import { ethers } from "hardhat";

// Chainlink CCIP Router addresses
const CCIP_ROUTERS: Record<string, string> = {
  fuji:      "0xF694E193200268f9a4868e4Aa017A0118C9a8177",
  avalanche: "0x27F39D0af3303703750D4001fCc1844c6491563c",
};

async function main() {
  const [deployer] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();
  const networkName = network.name;

  console.log(`Deploying MasterEscrow on ${networkName} with account: ${deployer.address}`);

  const feeRecipient = process.env.FEE_RECIPIENT ?? deployer.address;
  const ccipRouter   = CCIP_ROUTERS[networkName];
  if (!ccipRouter) throw new Error(`No CCIP router configured for network: ${networkName}`);

  const MasterEscrow = await ethers.getContractFactory("MasterEscrow");
  const masterEscrow = await MasterEscrow.deploy(feeRecipient, ccipRouter);
  await masterEscrow.waitForDeployment();

  const address = await masterEscrow.getAddress();
  console.log(`MasterEscrow deployed to: ${address}`);
  console.log(`Fee recipient: ${feeRecipient}`);
  console.log(`CCIP router:   ${ccipRouter}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
