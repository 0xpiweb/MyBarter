/**
 * ROBOT LAWYER CORE INVARIANTS
 * These values govern the smart contract logic and frontend validation.
 */
export const ROBOT_LAWYER_SETTINGS = {
  // Fee Logic
  COMMISSION_BPS: 75,           // 0.75% (for Pure Token Rotations)
  FLAT_FEE_USD: 250,            // $2.50 Settlement Fee (in cents)
  
  // The "Sweetener" Hard Cap
  // Hybrid trades (NFT + Token) MUST be under this limit
  HARD_CAP_USD: 10000,          // $100.00 (in cents for precision)
  
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

/**
 * CHAINLINK CCIP TESTNET DIRECTORY (2026)
 */
export const CCIP_DIRECTORY = {
  AVALANCHE_FUJI: {
    name: "Avalanche Fuji (Hub)",
    chainId: 43113,
    chainSelector: "14767482510784806043",
    router: "0xF694E193200268f9a4868e4Aa017A0118C9a8177"
  },
  ETHEREUM_SEPOLIA: {
    name: "Ethereum Sepolia",
    chainId: 11155111,
    chainSelector: "16015286601757825753",
    router: "0x0BF3d143412Fcd29d56dec3395982D2F2A663A59"
  },
  POLYGON_AMOY: {
    name: "Polygon Amoy",
    chainId: 80002,
    chainSelector: "16281711391670634445",
    router: "0x9C32463e265ee818296A000A89112F8484B2"
  },
  BNB_TESTNET: {
    name: "BNB Chain Testnet",
    chainId: 97,
    chainSelector: "13264668187771770619",
    router: "0xE1053aE1857476f36A3C62580FF9b73628F6f"
  }
};
