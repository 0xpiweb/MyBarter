/**
 * ROBOT LAWYER CORE INVARIANTS
 * These values govern the smart contract logic and frontend validation.
 */
export const ROBOT_LAWYER_SETTINGS = {
  // Fee Logic
  COMMISSION_BPS: 75,         // 0.75% (for Pure Token Rotations)
  FLAT_FEE_USD: 250,          // $2.50 Settlement Fee (in cents)
  
  // The "Sweetener" Hard Cap
  // Hybrid trades (NFT + Token) MUST be under this limit
  HARD_CAP_USD: 10000,        // $100.00 (in cents for precision)
  
  // Taker-Defined Expiration Windows (in hours)
  EXPIRATION_OPTIONS: {
    MIN: 24,
    MID: 48,
    MAX: 72
  },

  // Security Guards
  VOLATILITY_THRESHOLD_BPS: 1000, // 10% (revert if price shifts more than this)
  ORACLE_FRESHNESS_LIMIT: 3600    // 1 hour (reject stale Chainlink data)
};
