const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MyBarter "Robot Lawyer" Vault", function () {
  let MyBarterVault, vault, owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    MyBarterVault = await ethers.getContractFactory("MyBarterVault");
    vault = await MyBarterVault.deploy();
  });

  it("Should apply a flat $2 fee if a whitelisted NFT is present", async function () {
    const nftAddress = "0x1234567890123456789012345678901234567890";
    await vault.setCollectionStatus(nftAddress, true);

    const fee = await vault.calculatePlatformFee([nftAddress], 0);
    // 2 * 10^18 (Flat fee in 18 decimals)
    expect(fee).to.equal(ethers.parseEther("2"));
  });

  it("Should apply a 0.5% commission if no whitelisted NFT is present", async function () {
    const tokenValueUSD = ethers.parseEther("1000"); // $1000 value
    const fee = await vault.calculatePlatformFee([], tokenValueUSD);
    
    // 0.5% of $1000 = $5
    expect(fee).to.equal(ethers.parseEther("5"));
  });

  it("Should prevent fee evasion from unverified 'Dust' NFTs", async function () {
    const dustNFT = "0x0000000000000000000000000000000000000000";
    const tokenValueUSD = ethers.parseEther("1000");

    const fee = await vault.calculatePlatformFee([dustNFT], tokenValueUSD);
    // Should still be 0.5% ($5) because the NFT isn't whitelisted
    expect(fee).to.equal(ethers.parseEther("5"));
  });
});
