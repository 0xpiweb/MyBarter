// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

/**
 * @title MasterEscrow
 * @notice Hub contract deployed on Avalanche. The "Robot Lawyer" — coordinates all
 *         cross-chain trade state, enforces fee logic, and dispatches settlement
 *         instructions to SpokeVaults via Chainlink CCIP.
 *
 * Architecture:
 *   - MasterEscrow (this) holds trade state only. No assets are stored here.
 *   - SpokeVaults on ETH/POLY/BNB hold the actual NFTs and tokens.
 *   - On settleTrade(), CCIP messages instruct each SpokeVault to release assets
 *     to the counterparty atomically.
 *
 * Fee schedule (see CLAUDE.md):
 *   Pure Token Swap   → maker: 0.75%, taker: 0.75%
 *   Pure NFT Barter   → maker: $0,    taker: $2.50 flat
 *   Hybrid < $100     → maker: $0,    taker: $2.50 flat
 *   Hybrid ≥ $100     → maker: 0.75% on entire token amount, taker: $2.50 flat
 */
contract MasterEscrow is ReentrancyGuard {
    using SafeERC20 for IERC20;

    // =========================================================================
    // Constants
    // =========================================================================

    uint256 public constant TIMELOCK                 = 72 hours;
    uint256 public constant COMMISSION_BPS           = 75;        // 0.75%
    uint256 public constant BPS_DENOMINATOR          = 10_000;
    uint256 public constant FLAT_FEE_USD             = 250;       // $2.50 in cents
    uint256 public constant SWEETENER_THRESHOLD_USD  = 10_000;   // $100.00 in cents
    uint256 public constant VOLATILITY_GUARD_BPS     = 1_000;    // 10%
    uint256 public constant ORACLE_STALENESS         = 1 hours;

    // =========================================================================
    // Enums & Structs
    // =========================================================================

    enum TradeStatus { PROPOSED, LOCKED, SETTLED, EXPIRED, CANCELLED }

    enum AssetType { ERC20, ERC721, ERC1155 }

    /**
     * TradeType is computed at lockTrade() based on asset composition and
     * oracle-verified token USD value. Governs fee logic for the entire trade.
     *
     *   PURE_TOKEN   — no NFTs on either side
     *   PURE_NFT     — no tokens on either side
     *   HYBRID_SMALL — NFT present; token kicker USD value < SWEETENER_THRESHOLD_USD
     *   HYBRID_LARGE — NFT present; token kicker USD value >= SWEETENER_THRESHOLD_USD
     */
    enum TradeType { PURE_TOKEN, PURE_NFT, HYBRID_SMALL, HYBRID_LARGE }

    struct Asset {
        AssetType assetType;
        uint256   chainId;       // Chain where this asset lives (SpokeVault chain)
        address   contractAddr;  // ERC20/ERC721/ERC1155 contract address on that chain
        uint256   tokenId;       // ERC721/ERC1155 token ID; 0 for ERC20
        uint256   amount;        // ERC20 or ERC1155 amount; 0 for ERC721
    }

    struct Trade {
        uint256     id;
        address     maker;
        address     taker;
        Asset[]     makerAssets;
        Asset[]     takerAssets;
        TradeStatus status;
        TradeType   tradeType;
        uint256     lockedAt;
        // Chainlink USD values captured at lockTrade() (in cents, 2 decimal places)
        uint256     makerTokenUsdSnapshot;
        uint256     takerTokenUsdSnapshot;
        // Chainlink raw prices per token captured at lockTrade() for volatility guard
        mapping(address => int256) tokenPriceSnapshot;
    }

    // =========================================================================
    // State
    // =========================================================================

    uint256 private _tradeIdCounter;

    mapping(uint256 => Trade) public trades;
    mapping(address => bool) public isApprovedStable;

    /// @notice Chainlink price feed per ERC20 token address (on Avalanche).
    mapping(address => AggregatorV3Interface) public priceFeeds;

    /// @notice Maps chainId to the deployed SpokeVault address on that chain
    ///         (used to build CCIP destination messages).
    mapping(uint256 => address) public spokeVaults;

    address public immutable feeRecipient;
    address public immutable ccipRouter;   // Chainlink CCIP router on Avalanche

    // =========================================================================
    // Events
    // =========================================================================

    event TradeProposed(uint256 indexed tradeId, address indexed maker, address indexed taker);
    event TradeLocked(uint256 indexed tradeId, TradeType tradeType, uint256 lockedAt);
    event TradeSettled(uint256 indexed tradeId);
    event TradeCancelled(uint256 indexed tradeId);
    event TradeExpired(uint256 indexed tradeId);
    event FeeCollected(uint256 indexed tradeId, address indexed payer, uint256 amountUsdCents);

    // =========================================================================
    // Errors
    // =========================================================================

    error Unauthorized();
    error InvalidStatus(TradeStatus current, TradeStatus expected);
    error TimelockNotExpired(uint256 unlocksAt);
    error VolatilityGuardTriggered(address token, uint256 deviationBps);
    error StaleOracleData(address feed, uint256 updatedAt);
    error ZeroAssets();
    error InsufficientFlatFee(uint256 required, uint256 provided);
    error SpokeVaultNotRegistered(uint256 chainId);

    // =========================================================================
    // Constructor
    // =========================================================================

    constructor(address _feeRecipient, address _ccipRouter) {
        feeRecipient = _feeRecipient;
        ccipRouter   = _ccipRouter;
    }

    // =========================================================================
    // Admin
    // =========================================================================

    /**
     * @notice Register a Chainlink price feed for an ERC20 token.
     * @dev    TODO: restrict to governance/owner.
     */
    function setPriceFeed(address token, address feed) external {
        priceFeeds[token] = AggregatorV3Interface(feed);
    }

    /**
     * @notice Register the SpokeVault address for a given chain ID.
     * @dev    TODO: restrict to governance/owner.
     */
    function setSpokeVault(uint256 chainId, address vault) external {
        spokeVaults[chainId] = vault;
    }

    /**
     * @notice Approve or revoke a stablecoin for use as flat-fee payment.
     * @dev    TODO: restrict to governance/owner.
     */
    function setApprovedStable(address token, bool status) external {
        isApprovedStable[token] = status;
    }

    // =========================================================================
    // Core Trade Flow
    // =========================================================================

    /**
     * @notice Maker proposes a trade specifying the assets they offer and request.
     *         No assets move at this stage. The taker must call lockTrade() to accept.
     *
     * @param taker       Address of the intended counterparty.
     * @param makerAssets Assets the maker is offering.
     * @param takerAssets Assets the maker is requesting from the taker.
     * @return tradeId    The assigned trade ID.
     */
    function proposeTrade(
        address taker,
        Asset[] calldata makerAssets,
        Asset[] calldata takerAssets
    ) external returns (uint256 tradeId) {
        if (makerAssets.length == 0 || takerAssets.length == 0) revert ZeroAssets();

        tradeId = ++_tradeIdCounter;
        Trade storage trade = trades[tradeId];
        trade.id     = tradeId;
        trade.maker  = msg.sender;
        trade.taker  = taker;
        trade.status = TradeStatus.PROPOSED;

        for (uint256 i = 0; i < makerAssets.length; i++) {
            trade.makerAssets.push(makerAssets[i]);
        }
        for (uint256 i = 0; i < takerAssets.length; i++) {
            trade.takerAssets.push(takerAssets[i]);
        }

        emit TradeProposed(tradeId, msg.sender, taker);
    }

    /**
     * @notice Taker accepts the proposal, locking both parties in for 72 hours.
     *         - Classifies trade type (PURE_TOKEN / PURE_NFT / HYBRID_SMALL / HYBRID_LARGE).
     *         - Snapshots Chainlink prices for all token assets (volatility guard baseline).
     *         - Collects the $2.50 flat fee from the taker (via approved stablecoin) if any
     *           NFT is present in the trade bundle.
     *
     * @param tradeId  The trade to lock.
     * @param feeToken Approved stablecoin address used to pay the flat fee (e.g. USDC).
     *                 Ignored (and no transfer made) for PURE_TOKEN trades.
     */
    function lockTrade(uint256 tradeId, address feeToken) external nonReentrant {
        Trade storage trade = trades[tradeId];
        if (trade.status != TradeStatus.PROPOSED) revert InvalidStatus(trade.status, TradeStatus.PROPOSED);
        if (msg.sender != trade.taker) revert Unauthorized();

        uint256 makerTokenUsd = _sumTokenUsdValue(trade.makerAssets, trade);
        uint256 takerTokenUsd = _sumTokenUsdValue(trade.takerAssets, trade);
        bool hasNFT = _containsNFT(trade.makerAssets) || _containsNFT(trade.takerAssets);

        trade.tradeType             = _classifyTrade(hasNFT, makerTokenUsd + takerTokenUsd);
        trade.makerTokenUsdSnapshot = makerTokenUsd;
        trade.takerTokenUsdSnapshot = takerTokenUsd;
        trade.lockedAt              = block.timestamp;
        trade.status                = TradeStatus.LOCKED;

        // Taker pays $2.50 flat fee for any NFT-containing trade
        if (hasNFT) {
            require(isApprovedStable[feeToken], "Unsupported fee token");
            // FLAT_FEE_USD = 250 cents; multiply by 10^4 to get 6-decimal stablecoin units (e.g. USDC)
            uint256 feeAmount = FLAT_FEE_USD * 10 ** 4;
            IERC20(feeToken).safeTransferFrom(msg.sender, feeRecipient, feeAmount);
            emit FeeCollected(tradeId, msg.sender, FLAT_FEE_USD);
        }

        emit TradeLocked(tradeId, trade.tradeType, block.timestamp);
    }

    /**
     * @notice Executes final settlement. Validates that deposits are confirmed in each
     *         SpokeVault (via CCIP), runs the volatility circuit breaker, collects
     *         commissions, then dispatches CCIP release messages to SpokeVaults.
     *
     *         Either party may trigger settlement once both deposits are confirmed.
     *
     * @dev    Commission for PURE_TOKEN and HYBRID_LARGE is deducted from the ERC20
     *         amounts released, not charged separately in native token.
     *         TODO: implement CCIP message dispatch to SpokeVaults.
     */
    function settleTrade(uint256 tradeId) external nonReentrant {
        Trade storage trade = trades[tradeId];
        if (trade.status != TradeStatus.LOCKED) revert InvalidStatus(trade.status, TradeStatus.LOCKED);
        if (msg.sender != trade.maker && msg.sender != trade.taker) revert Unauthorized();

        // Volatility circuit breaker: compare current Chainlink prices to snapshots
        _runVolatilityChecks(trade);

        // TODO: verify deposits are confirmed in each SpokeVault (CCIP message or mapping)
        // TODO: dispatch CCIP messages to each relevant SpokeVault:
        //       releaseAssets(tradeId, from=maker, to=taker) for maker's assets
        //       releaseAssets(tradeId, from=taker, to=maker) for taker's assets
        //       with fee deductions applied to token amounts
        // TODO: emit FeeCollected for commission amounts from _calculateCommission()

        trade.status = TradeStatus.SETTLED;
        emit TradeSettled(tradeId);
    }

    /**
     * @notice Maker reclaims deposited assets after the 72-hour timelock expires
     *         without the trade being settled.
     *
     *         Dispatches CCIP messages to each SpokeVault to return assets to depositors.
     */
    function reclaim(uint256 tradeId) external nonReentrant {
        Trade storage trade = trades[tradeId];
        if (msg.sender != trade.maker) revert Unauthorized();
        if (trade.status != TradeStatus.LOCKED && trade.status != TradeStatus.PROPOSED)
            revert InvalidStatus(trade.status, TradeStatus.LOCKED);
        if (block.timestamp < trade.lockedAt + TIMELOCK)
            revert TimelockNotExpired(trade.lockedAt + TIMELOCK);

        trade.status = TradeStatus.EXPIRED;

        // TODO: dispatch CCIP reclaimAssets(tradeId, depositor=maker) to each SpokeVault
        //       that holds the maker's assets
        // TODO: dispatch CCIP reclaimAssets(tradeId, depositor=taker) to each SpokeVault
        //       that holds the taker's assets (in case taker already deposited)

        emit TradeExpired(tradeId);
    }

    /**
     * @notice Either party cancels a PROPOSED trade before it is locked.
     *         No assets have moved at this point so no CCIP messages needed.
     */
    function cancelTrade(uint256 tradeId) external {
        Trade storage trade = trades[tradeId];
        if (trade.status != TradeStatus.PROPOSED) revert InvalidStatus(trade.status, TradeStatus.PROPOSED);
        if (msg.sender != trade.maker && msg.sender != trade.taker) revert Unauthorized();

        trade.status = TradeStatus.CANCELLED;
        emit TradeCancelled(tradeId);
    }

    // =========================================================================
    // Fee Logic
    // =========================================================================

    /**
     * @dev Classifies trade type from NFT presence and total token USD value.
     *
     *   hasNFT = false → PURE_TOKEN
     *   hasNFT = true, tokenUsd == 0 → PURE_NFT
     *   hasNFT = true, tokenUsd < SWEETENER_THRESHOLD_USD → HYBRID_SMALL
     *   hasNFT = true, tokenUsd >= SWEETENER_THRESHOLD_USD → HYBRID_LARGE
     */
    function _classifyTrade(bool hasNFT, uint256 totalTokenUsdCents) internal pure returns (TradeType) {
        if (!hasNFT) return TradeType.PURE_TOKEN;
        if (totalTokenUsdCents == 0) return TradeType.PURE_NFT;
        if (totalTokenUsdCents < SWEETENER_THRESHOLD_USD) return TradeType.HYBRID_SMALL;
        return TradeType.HYBRID_LARGE;
    }

    /**
     * @dev Computes maker and taker commission amounts in USD cents.
     *
     *   PURE_TOKEN:    both pay 0.75% of their respective token USD value
     *   PURE_NFT:      flat fee already collected at lockTrade; no variable commission
     *   HYBRID_SMALL:  flat fee already collected at lockTrade; no variable commission
     *   HYBRID_LARGE:  maker pays 0.75% of entire maker token amount; flat fee already paid
     *
     * Note: flat fee is already collected at lockTrade(); this function returns the
     * additional variable commission due at settlement time.
     */
    function _calculateCommission(
        TradeType tradeType,
        uint256 makerTokenUsdCents,
        uint256 takerTokenUsdCents
    ) internal pure returns (uint256 makerFeeUsd, uint256 takerFeeUsd) {
        if (tradeType == TradeType.PURE_TOKEN) {
            makerFeeUsd = (makerTokenUsdCents * COMMISSION_BPS) / BPS_DENOMINATOR;
            takerFeeUsd = (takerTokenUsdCents * COMMISSION_BPS) / BPS_DENOMINATOR;
        } else if (tradeType == TradeType.HYBRID_LARGE) {
            makerFeeUsd = (makerTokenUsdCents * COMMISSION_BPS) / BPS_DENOMINATOR;
            takerFeeUsd = 0; // flat fee already paid at lockTrade
        } else {
            // PURE_NFT / HYBRID_SMALL: flat fee only, no variable commission
            makerFeeUsd = 0;
            takerFeeUsd = 0;
        }
    }

    // =========================================================================
    // Oracle & Safety
    // =========================================================================

    /**
     * @dev Queries Chainlink for current USD value (in cents) of a token amount.
     *      Also snapshots the raw price in the Trade struct for later volatility checks.
     *      Reverts if oracle data is stale (older than ORACLE_STALENESS).
     */
    function _getUsdValueAndSnapshot(
        address token,
        uint256 amount,
        Trade storage trade
    ) internal returns (uint256 usdCents) {
        AggregatorV3Interface feed = priceFeeds[token];
        // TODO: handle missing feed gracefully for non-USD-valued tokens
        (
            /* roundId */,
            int256 price,
            /* startedAt */,
            uint256 updatedAt,
            /* answeredInRound */
        ) = feed.latestRoundData();

        if (block.timestamp - updatedAt > ORACLE_STALENESS)
            revert StaleOracleData(address(feed), updatedAt);

        trade.tokenPriceSnapshot[token] = price;

        // price has `feed.decimals()` decimals; amount has token decimals.
        // TODO: normalize both to compute USD cents correctly per token decimals.
        uint8 feedDecimals = feed.decimals();
        usdCents = (amount * uint256(price) * 100) / (10 ** feedDecimals);
    }

    /**
     * @dev Sums USD value of all ERC20 assets in the list and snapshots prices.
     */
    function _sumTokenUsdValue(
        Asset[] storage assets,
        Trade storage trade
    ) internal returns (uint256 totalUsdCents) {
        for (uint256 i = 0; i < assets.length; i++) {
            if (assets[i].assetType == AssetType.ERC20) {
                totalUsdCents += _getUsdValueAndSnapshot(
                    assets[i].contractAddr,
                    assets[i].amount,
                    trade
                );
            }
        }
    }

    /**
     * @dev Returns true if any asset in the list is an NFT (ERC721 or ERC1155).
     */
    function _containsNFT(Asset[] storage assets) internal view returns (bool) {
        for (uint256 i = 0; i < assets.length; i++) {
            if (assets[i].assetType == AssetType.ERC721 || assets[i].assetType == AssetType.ERC1155) {
                return true;
            }
        }
        return false;
    }

    /**
     * @dev Volatility circuit breaker. Re-queries Chainlink for each token asset
     *      and compares to the price snapshot taken at lockTrade().
     *      Reverts if any token has moved more than VOLATILITY_GUARD_BPS (10%).
     */
    function _runVolatilityChecks(Trade storage trade) internal view {
        _checkVolatilityForAssets(trade.makerAssets, trade);
        _checkVolatilityForAssets(trade.takerAssets, trade);
    }

    function _checkVolatilityForAssets(Asset[] storage assets, Trade storage trade) internal view {
        for (uint256 i = 0; i < assets.length; i++) {
            if (assets[i].assetType != AssetType.ERC20) continue;

            address token = assets[i].contractAddr;
            int256 snapshot = trade.tokenPriceSnapshot[token];
            if (snapshot == 0) continue; // no snapshot = no feed registered

            AggregatorV3Interface feed = priceFeeds[token];
            (
                /* roundId */,
                int256 currentPrice,
                /* startedAt */,
                uint256 updatedAt,
                /* answeredInRound */
            ) = feed.latestRoundData();

            if (block.timestamp - updatedAt > ORACLE_STALENESS)
                revert StaleOracleData(address(feed), updatedAt);

            // Compute absolute deviation in BPS
            uint256 delta = snapshot > currentPrice
                ? uint256(snapshot - currentPrice)
                : uint256(currentPrice - snapshot);
            uint256 deviationBps = (delta * BPS_DENOMINATOR) / uint256(snapshot);

            if (deviationBps > VOLATILITY_GUARD_BPS)
                revert VolatilityGuardTriggered(token, deviationBps);
        }
    }

    // =========================================================================
    // View
    // =========================================================================

    function getTradeStatus(uint256 tradeId) external view returns (TradeStatus) {
        return trades[tradeId].status;
    }

    function getTradeType(uint256 tradeId) external view returns (TradeType) {
        return trades[tradeId].tradeType;
    }

    function getMakerAssets(uint256 tradeId) external view returns (Asset[] memory) {
        return trades[tradeId].makerAssets;
    }

    function getTakerAssets(uint256 tradeId) external view returns (Asset[] memory) {
        return trades[tradeId].takerAssets;
    }
}
