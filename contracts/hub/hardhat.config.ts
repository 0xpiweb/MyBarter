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
    fuji: {
      url: process.env.FUJI_RPC_URL ?? "https://api.avax-test.network/ext/bc/C/rpc",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 43113,
    },
    avalanche: {
      url: process.env.AVALANCHE_RPC_URL ?? "https://api.avax.network/ext/bc/C/rpc",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 43114,
    },
  },
  etherscan: {
    apiKey: {
      avalancheFujiTestnet: process.env.SNOWTRACE_API_KEY ?? "",
      avalanche: process.env.SNOWTRACE_API_KEY ?? "",
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS === "true",
    currency: "USD",
  },
};

export default config;
