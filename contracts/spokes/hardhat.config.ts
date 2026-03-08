import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: { enabled: true, runs: 200 },
      viaIR: true,
    },
  },
  networks: {
    // Ethereum
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL ?? "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
    mainnet: {
      url: process.env.MAINNET_RPC_URL ?? "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
    // Polygon
    amoy: {
      url: process.env.AMOY_RPC_URL ?? "https://rpc-amoy.polygon.technology",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 80002,
    },
    polygon: {
      url: process.env.POLYGON_RPC_URL ?? "https://polygon-rpc.com",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 137,
    },
    // BNB Chain
    bscTestnet: {
      url: process.env.BSC_TESTNET_RPC_URL ?? "https://data-seed-prebsc-1-s1.binance.org:8545",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 97,
    },
    bsc: {
      url: process.env.BSC_RPC_URL ?? "https://bsc-dataseed.binance.org",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 56,
    },
  },
  etherscan: {
    apiKey: {
      sepolia: process.env.ETHERSCAN_API_KEY ?? "",
      mainnet: process.env.ETHERSCAN_API_KEY ?? "",
      polygonAmoy: process.env.POLYGONSCAN_API_KEY ?? "",
      polygon: process.env.POLYGONSCAN_API_KEY ?? "",
      bscTestnet: process.env.BSCSCAN_API_KEY ?? "",
      bsc: process.env.BSCSCAN_API_KEY ?? "",
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS === "true",
    currency: "USD",
  },
};

export default config;
