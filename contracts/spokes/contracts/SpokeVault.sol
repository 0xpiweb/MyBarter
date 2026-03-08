// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title SpokeVault
 * @notice Deployed on Ethereum, Polygon, and BNB Chain. Holds user assets (NFTs
 *         and ERC20 tokens) in escrow for the duration of a MyBarter trade.
 *
 *         Asset custody flow:
 *           1. User calls depositERC20 / depositERC721 / depositERC1155 for their tradeId.
 *           2. MasterEscrow (Avalanche Hub) confirms both deposits, then dispatches a
 *              Chainlink CCIP message to this contract.
 *           3. The CCIP router calls releaseAssets() — assets go to the counterparty.
 *              Or reclaimAssets() — assets return to the depositor (reclaim/expiry).
 *
 *         Security model:
 *           - Only the Chainlink CCIP router (`ccipRouter`) may call release/reclaim.
 *           - CCIP message payloads must originate from the `hub` address on Avalanche.
 *           - No admin key can withdraw user assets directly.
 */
contract SpokeVault is ERC721Holder, ERC1155Holder, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // =========================================================================
    // Structs
    // =========================================================================

    struct ERC20Deposit {
        address token;
        uint256 amount;
    }

    struct ERC721Deposit {
        address nftContract;
        uint256 tokenId;
    }

    struct ERC1155Deposit {
        address nftContract;
        uint256 tokenId;
        uint256 amount;
    }

    struct DepositRecord {
        ERC20Deposit[]   erc20s;
        ERC721Deposit[]  erc721s;
        ERC1155Deposit[] erc1155s;
        bool             deposited; // true once at least one asset is deposited
    }

    // =========================================================================
    // State
    // =========================================================================

    /// @notice MasterEscrow address on Avalanche (validated in CCIP message payload).
    address public immutable hub;

    /// @notice Chainlink CCIP router on this chain. Only address allowed to call
    ///         releaseAssets() and reclaimAssets().
    address public immutable ccipRouter;

    /// @notice tradeId => depositor => DepositRecord
    mapping(uint256 => mapping(address => DepositRecord)) public deposits;

    // =========================================================================
    // Events
    // =========================================================================

    event ERC20Deposited(
        uint256 indexed tradeId,
        address indexed depositor,
        address token,
        uint256 amount
    );
    event ERC721Deposited(
        uint256 indexed tradeId,
        address indexed depositor,
        address nftContract,
        uint256 tokenId
    );
    event ERC1155Deposited(
        uint256 indexed tradeId,
        address indexed depositor,
        address nftContract,
        uint256 tokenId,
        uint256 amount
    );
    event AssetsReleased(uint256 indexed tradeId, address indexed from, address indexed to);
    event AssetsReclaimed(uint256 indexed tradeId, address indexed depositor);

    // =========================================================================
    // Errors
    // =========================================================================

    error OnlyCCIPRouter();
    error InvalidHubSender(address provided, address expected);
    error NothingDeposited(uint256 tradeId, address depositor);
    error ZeroAmount();
    error ZeroAddress();

    // =========================================================================
    // Modifiers
    // =========================================================================

    modifier onlyCCIPRouter() {
        if (msg.sender != ccipRouter) revert OnlyCCIPRouter();
        _;
    }

    // =========================================================================
    // Constructor
    // =========================================================================

    constructor(address _hub, address _ccipRouter) {
        if (_hub == address(0) || _ccipRouter == address(0)) revert ZeroAddress();
        hub       = _hub;
        ccipRouter = _ccipRouter;
    }

    // =========================================================================
    // Deposit Functions
    // Called by users on this chain BEFORE MasterEscrow locks the trade.
    // Multiple deposits per trade are allowed (bundle building).
    // =========================================================================

    /**
     * @notice Deposit ERC20 tokens into escrow for a given tradeId.
     * @dev    Caller must have approved this contract for `amount` of `token` first.
     *         Call once per token type; multiple tokens require multiple calls.
     *
     * @param tradeId  The trade ID assigned by MasterEscrow.
     * @param token    ERC20 contract address on this chain.
     * @param amount   Token amount in the token's native decimals.
     */
    function depositERC20(
        uint256 tradeId,
        address token,
        uint256 amount
    ) external nonReentrant {
        if (amount == 0) revert ZeroAmount();

        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);

        DepositRecord storage record = deposits[tradeId][msg.sender];
        record.erc20s.push(ERC20Deposit({ token: token, amount: amount }));
        record.deposited = true;

        emit ERC20Deposited(tradeId, msg.sender, token, amount);
    }

    /**
     * @notice Deposit an ERC721 NFT into escrow.
     * @dev    Caller must have approved this contract for `tokenId` first
     *         via `nftContract.approve(vaultAddress, tokenId)`.
     */
    function depositERC721(
        uint256 tradeId,
        address nftContract,
        uint256 tokenId
    ) external nonReentrant {
        IERC721(nftContract).safeTransferFrom(msg.sender, address(this), tokenId);

        DepositRecord storage record = deposits[tradeId][msg.sender];
        record.erc721s.push(ERC721Deposit({ nftContract: nftContract, tokenId: tokenId }));
        record.deposited = true;

        emit ERC721Deposited(tradeId, msg.sender, nftContract, tokenId);
    }

    /**
     * @notice Deposit ERC1155 tokens into escrow.
     * @dev    Caller must have approved this contract via `setApprovalForAll` first.
     */
    function depositERC1155(
        uint256 tradeId,
        address nftContract,
        uint256 tokenId,
        uint256 amount
    ) external nonReentrant {
        if (amount == 0) revert ZeroAmount();

        IERC1155(nftContract).safeTransferFrom(msg.sender, address(this), tokenId, amount, "");

        DepositRecord storage record = deposits[tradeId][msg.sender];
        record.erc1155s.push(ERC1155Deposit({ nftContract: nftContract, tokenId: tokenId, amount: amount }));
        record.deposited = true;

        emit ERC1155Deposited(tradeId, msg.sender, nftContract, tokenId, amount);
    }

    // =========================================================================
    // Release Functions
    // Called exclusively by the Chainlink CCIP router carrying a message from hub.
    // =========================================================================

    /**
     * @notice Release `from`'s deposited assets to `to` (settlement).
     *         Called by the CCIP router delivering an authenticated message from MasterEscrow.
     *
     * @param tradeId   The settled trade ID.
     * @param from      The depositor whose assets are being released.
     * @param to        The recipient (the counterparty).
     * @param hubSender The MasterEscrow address encoded in the CCIP payload — validated
     *                  against the `hub` immutable to prevent spoofing.
     */
    function releaseAssets(
        uint256 tradeId,
        address from,
        address to,
        address hubSender
    ) external onlyCCIPRouter nonReentrant {
        if (hubSender != hub) revert InvalidHubSender(hubSender, hub);

        DepositRecord storage record = deposits[tradeId][from];
        if (!record.deposited) revert NothingDeposited(tradeId, from);

        _transferAll(record, to);
        _clearRecord(record);

        emit AssetsReleased(tradeId, from, to);
    }

    /**
     * @notice Return deposited assets to the original depositor (reclaim / trade expiry).
     *         Called by the CCIP router delivering an authenticated message from MasterEscrow.
     *
     * @param tradeId   The trade ID being reclaimed.
     * @param depositor The address to return assets to.
     * @param hubSender The MasterEscrow address encoded in the CCIP payload.
     */
    function reclaimAssets(
        uint256 tradeId,
        address depositor,
        address hubSender
    ) external onlyCCIPRouter nonReentrant {
        if (hubSender != hub) revert InvalidHubSender(hubSender, hub);

        DepositRecord storage record = deposits[tradeId][depositor];
        if (!record.deposited) revert NothingDeposited(tradeId, depositor);

        _transferAll(record, depositor);
        _clearRecord(record);

        emit AssetsReclaimed(tradeId, depositor);
    }

    // =========================================================================
    // Internal Helpers
    // =========================================================================

    function _transferAll(DepositRecord storage record, address to) internal {
        for (uint256 i = 0; i < record.erc20s.length; i++) {
            IERC20(record.erc20s[i].token).safeTransfer(to, record.erc20s[i].amount);
        }
        for (uint256 i = 0; i < record.erc721s.length; i++) {
            IERC721(record.erc721s[i].nftContract).safeTransferFrom(
                address(this),
                to,
                record.erc721s[i].tokenId
            );
        }
        for (uint256 i = 0; i < record.erc1155s.length; i++) {
            IERC1155(record.erc1155s[i].nftContract).safeTransferFrom(
                address(this),
                to,
                record.erc1155s[i].tokenId,
                record.erc1155s[i].amount,
                ""
            );
        }
    }

    function _clearRecord(DepositRecord storage record) internal {
        delete record.erc20s;
        delete record.erc721s;
        delete record.erc1155s;
        record.deposited = false;
    }

    // =========================================================================
    // View
    // =========================================================================

    function getDepositRecord(uint256 tradeId, address depositor)
        external
        view
        returns (DepositRecord memory)
    {
        return deposits[tradeId][depositor];
    }

    function hasDeposit(uint256 tradeId, address depositor) external view returns (bool) {
        return deposits[tradeId][depositor].deposited;
    }
}
