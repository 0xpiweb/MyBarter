import { ethers } from "hardhat";

async function main() {
  // 1. Define the SpokeVault addresses you just deployed
  // (In a real CI/CD, you'd pull these from a 'deployments.json' file)
  const spokes = [
    { name: "Sepolia Spoke", address: "0x..." },
    { name: "Amoy Spoke", address: "0x..." },
    { name: "BNB Testnet Spoke", address: "0x..." }
  ];

  // 2. Amount of native gas to seed each vault (e.g., 0.2 Native)
  // This is enough for ~50 CCIP transactions on most testnets
  const amount = ethers.parseEther("0.2"); 

  const [deployer] = await ethers.getSigners();
  console.log(`⚖️ Robot Lawyer Gas-Up starting...`);
  console.log(`Funding from: ${deployer.address}\n`);

  for (const spoke of spokes) {
    console.log(`📡 Funding ${spoke.name} at ${spoke.address}...`);
    
    const tx = await deployer.sendTransaction({
      to: spoke.address,
      value: amount,
    });

    await tx.wait();
    console.log(`✅ Success! Hash: ${tx.hash}\n`);
  }

  console.log("🚀 All Spokes fueled and ready for court.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
