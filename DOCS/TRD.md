# MyBarter Technical Requirements Document (TRD) v1.4

## 1. System Overview
MyBarter is a cross-chain P2P settlement layer. It uses an asynchronous escrow model (The "Robot Lawyer") to allow users to propose, negotiate, and execute trades involving NFTs and tokens across EVM-compatible chains, with settlement logic hosted on Avalanche.

## 2. Core Functional Requirements

### 2.1 Profile & Onboarding (The Social Layer)
* **Wallet Integration:** Support for Core, Metamask, and Rabby via RainbowKit/Wagmi.
* **Mandatory Identity Linking:** Users must link an X (Twitter) account via OAuth or verify an Email address before tagging assets as "Up for Trade."
* **Presence Service:** A WebSocket-based "Heartbeat" (Supabase Presence) to track active sessions.
* **UI Requirement:** Real-time Green Dot (Active) or Red Dot (Offline) displayed on user profiles.

### 2.2 Inventory & Discovery
* **Multi-Chain Indexing:** Cross-chain scanning of user wallets on Avalanche, Polygon, and Ethereum.
* **"Up for Trade" Toggle:** An off-chain database flag allowing users to mark specific NFTs as "Active for Barter."
* **Filtered Gallery:** A marketplace view displaying only NFTs marked "Up for Trade," prioritizing active users.

### 2.3 The "Robot Lawyer" Escrow (Smart Contracts)
* **Offer Initiation:** User B pays a platform fee and locks offered assets (NFT/Tokens) into the MyBarter Vault.
* **Atomic Swap Logic:** Assets are released ONLY if both signatures (User A and User B) are verified and fees are settled.
* **Fee Structure:** * **NFT-inclusive Trades:** Flat $2.00 fee.
    * **Pure Token Swaps:** 0.5% commission via Pyth/Chainlink Price Oracles.
* **Trade Constraints:** Restricted to Asset-for-Asset swaps; MyBarter does not support NFT-for-Stablecoin (Marketplace) transactions.

 #### 2.3.1 Anti-Exploit Measures (Fee Integrity)

- **Verification Requirement**: The flat $2.00 "Bundle" fee only applies to trades involving at least one NFT from a Whitelisted Collection.

- **Dust Protection**: If an NFT is unverified or has a floor price below a "Dust Threshold" (0.1 AVAX), the trade is treated as a Pure Token Swap, and a 0.5% commission is applied to the total token value.

- **Oracle Validation**: Use Pyth/Chainlink to verify token values and ensure the 0.5% fee accurately reflects the market price of the "Cash Kicker."

### 2.4 Notification Engine
* **In-App:** Real-time toast notifications for offer events.
* **Social Trigger:** Automated X-bot tagging the counterparty when a trade is "Locked" in the vault.
* **Payload:** "Hey @[UserHandle], a new offer has been secured for your [Asset Name]. Review here: [Link]"

## 3. Technical Stack
* **Frontend:** Next.js, Tailwind CSS, Shadcn UI.
* **Backend:** Supabase (Presence, Metadata, Auth).
* **Smart Contracts:** Solidity (Hardhat/Foundry).
* **Cross-Chain:** Avalanche Interchain Messaging (ICM) or LayerZero for state synchronization.
* **Notifications:** SendGrid (Email) and Custom Twitter API worker.

## 4. Security Requirements
* **Non-Custodial:** Assets are only movable via programmatic contract logic; no admin keys can withdraw user assets.
* **Timeout/Refund:** 72-hour window. Initiators can "Reclaim" assets and fees if the offer is not accepted.
