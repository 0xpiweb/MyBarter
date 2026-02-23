// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title MyBarter "Robot Lawyer" Vault
 * @notice Enforces the Triple-Threat: Economic Safety, Transactional Safety, and Capital Efficiency.
 */
contract MyBarterVault is Ownable, ReentrancyGuard {
    
    // Fee Configuration (18 Decimals)
    uint256 public constant FLAT_FEE_USD = 2.50 * 10**18; 
    uint256 public constant COMMISSION_BPS = 75;         // 0.75%
    uint256 public constant KICKER_THRESHOLD = 100 * 10**18; // $100 USD

    constructor() Ownable(msg.sender) {}

    /**
     * @notice Calculates the Commission (Maker's responsibility for the Kicker)
     * @param _hasNFT Boolean indicating if an NFT is in the trade bundle
     * @param _tokenValueUSD Total value of fungible tokens in USD (from Oracle)
     */
    function calculateMakerCommission(bool _hasNFT, uint256 _tokenValueUSD) 
        public 
        pure 
        returns (uint256) 
    {
        // Rule: Pure Token Swaps ALWAYS pay 0.75%
        if (!_hasNFT) {
            return (_tokenValueUSD * COMMISSION_BPS) / 10000;
        }

        // Rule: Hybrid Trade - "Sweetener" Waiver
        if (_tokenValueUSD < KICKER_THRESHOLD) {
            return 0; // Commission waived for kickers < $100
        }

        // Rule: Hybrid Trade - Large Kicker
        return (_tokenValueUSD * COMMISSION_BPS) / 10000;
    }

    /**
     * @notice Calculates the Settlement Fee (Taker's responsibility)
     * @param _hasNFT Boolean indicating if an NFT is in the trade bundle
     */
    function getTakerSettlementFee(bool _hasNFT) 
        public 
        pure 
        returns (uint256) 
    {
        // If an NFT is involved, taker pays the flat safety fee
        if (_hasNFT) {
            return FLAT_FEE_USD;
        }
        // For pure token swaps, the taker pays 0 (Maker covers the 0.75% commission)
        return 0;
    }

    // Escrow logic and Oracle integration would follow here...
}
