import { ethers, network } from "hardhat";

// Chainlink CCIP Router addresses per spoke chain
const CCIP_ROUTERS: Record<string, string> = {
  sepolia:    "0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59",
  mainnet:    "0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D",
  amoy:       "0x9C32fCB86BF0f29ef9F65528a3F5B74b5B4Fff55",
  polygon:    "0x849c5ED5a80F5B408Dd4969b78c2C8fdf0565Bfe",
  bscTestnet: "0xE1053aE1857476f36A3C62580FF9b016E8EE8F6f",
  bsc:        "0x34B03Cb9086d7D758AC55af71584F81A598759FE",
};

async function main() {
  const [deployer] = await ethers.getSigners();
  const networkName = network.name;

  console.log(`Deploying SpokeVault on ${networkName} with account: ${deployer.address}`);

  const hubAddress = process.env.HUB_ADDRESS;
  if (!hubAddress) throw new Error("Set HUB_ADDRESS env var to the deployed MasterEscrow address on Avalanche.");

  const ccipRouter = CCIP_ROUTERS[networkName];
  if (!ccipRouter) throw new Error(`No CCIP router configured for network: ${networkName}`);

  const SpokeVault = await ethers.getContractFactory("SpokeVault");
  const spokeVault = await SpokeVault.deploy(hubAddress, ccipRouter);
  await spokeVault.waitForDeployment();

  const address = await spokeVault.getAddress();
  console.log(`SpokeVault deployed to: ${address}`);
  console.log(`Hub (MasterEscrow):    ${hubAddress}`);
  console.log(`CCIP router:           ${ccipRouter}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
