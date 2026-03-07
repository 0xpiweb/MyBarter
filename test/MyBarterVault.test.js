const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MyBarter 'Robot Lawyer' Vault", function () {
  let vault, owner, maker, taker;

  beforeEach(async function () {
    [owner, maker, taker] = await ethers.getSigners();
    const MyBarterVault = await ethers.getContractFactory("MyBarterVault");
    vault = await MyBarterVault.deploy();
  });

  it("Should apply 0.75% commission on Pure Token Swaps (No NFT)", async function () {
    const tokenValueUSD = ethers.parseUnits("1000", 18); // $1000
    const commission = await vault.calculateCommission(false, tokenValueUSD);
    
    // 0.75% of $1000 = $7.50
    expect(commission).to.equal(ethers.parseUnits("7.50", 18));
  });

  it("Should waive commission for Hybrid trades with <$100 Sweetener", async function () {
    const tokenValueUSD = ethers.parseUnits("50", 18); // $50 Kicker
    const hasNFT = true;
    
    const commission = await vault.calculateCommission(hasNFT, tokenValueUSD);
    
    // Should be $0.00 because it's a "Small Kicker" (<$100)
    expect(commission).to.equal(0);
  });

  it("Should apply 0.75% commission for Hybrid trades with >=$100 Kicker", async function () {
    const tokenValueUSD = ethers.parseUnits("200", 18); // $200 Kicker
    const hasNFT = true;
    
    const commission = await vault.calculateCommission(hasNFT, tokenValueUSD);
    
    // 0.75% of $200 = $1.50 (No longer waived)
    expect(commission).to.equal(ethers.parseUnits("1.50", 18));
  });

  it("Should always charge the Taker the flat $2.50 settlement fee if NFT is present", async function () {
    const hasNFT = true;
    const flatFee = await vault.getSettlementFee(hasNFT);
    
    expect(flatFee).to.equal(ethers.parseUnits("2.50", 18));
  });
});
