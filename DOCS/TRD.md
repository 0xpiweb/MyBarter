# MyBarter Technical Requirements Document (TRD) v1.6

## 1. System Overview
MyBarter is a cross-chain P2P settlement layer. It uses an asynchronous escrow model (The "Robot Lawyer") to allow users to propose, negotiate, and execute trades involving NFTs and tokens across EVM-compatible chains, with settlement logic hosted on Avalanche.

## 2. Core Functional Requirements

### 2.1 Profile & Onboarding (The Social Layer)
* **Wallet Integration:** Support for Core, Metamask, and Rabby via RainbowKit/Wagmi.
* **Mandatory Identity Linking:** Users must link an X (Twitter) account via OAuth or verify an Email address before tagging assets as "Up for Trade."
* **Presence Service:** A WebSocket-based "Heartbeat" (Supabase Presence) to track active sessions.
* **UI Requirement:** Real-time Green Dot (Active) or Red Dot (Offline) displayed on user profiles.

### 2.2 Inventory & Discovery
* **Multi-Chain Indexing:** Cross-chain scanning of user wallets on Avalanche, Polygon, BNB, and Ethereum.
* **"Up for Trade" Toggle:** An off-chain database flag allowing users to mark specific NFTs as "Active for Barter."
* **Filtered Gallery:** A marketplace view displaying only NFTs marked "Up for Trade," prioritizing active users.

### 2.3 The "Robot Lawyer" Escrow (Smart Contracts)
* **Offer Initiation:** User B pays a platform fee and locks offered assets (NFT/Tokens) into the MyBarter Vault.
* **Atomic Swap Logic:** Assets are released ONLY if both signatures (User A and User B) are verified and fees are settled.
* **Fee Structure:**
    * **NFT-inclusive Trades:** Flat $2.50 fee.
    * **Pure Token Swaps:** 0.75% commission via Pyth/Chainlink Price Oracles.
* **Trade Constraints:** Restricted to Asset-for-Asset swaps; MyBarter does not support NFT-for-Stablecoin (Marketplace) transactions.

 #### 2.3.1 Anti-Exploit Measures (Fee Integrity)

- **Verification Requirement**: The flat $2.50 "Bundle" fee only applies to trades involving at least one NFT from a Whitelisted Collection.
- **Dust Protection**: If an NFT is unverified or has a floor price below a "Dust Threshold", the trade is treated as a Pure Token Swap, and a 0.75% commission is applied to the total token value.
- **Oracle Validation**: Use Pyth/Chainlink to verify token values and ensure the 0.75% fee accurately reflects the market price of the "Cash Kicker."

### 2.4 Notification Engine

* **In-App:** Real-time toast notifications for offer events.
* **Social Trigger:** Automated X-bot tagging the counterparty when a trade is "Locked" in the vault.
* **Payload:** "Hey @[UserHandle], a new offer has been secured for your [Asset Name]. Review here: [Link]"

## 3.0 System Architecture & Technical Stack

### 3.1 The Multi-Chain Stack

- **Smart Contracts**: Solidity (AVAX/BNB/ETH/POLY) for the "Robot Lawyer" Vault; architected for cross-chain consistency and high-security escrow.
- **Oracles**: **Chainlink Price Feeds** (primary settlement oracle for Build Games) supplemented by **Pyth Network** for high-frequency price updates on volatile assets.
- **Frontend**: Next.js / Tailwind CSS (optimized for Vercel deployment and responsive mobile bartering).
- **Backend/Real-time**: **Supabase** (powering "Green Dot" presence, user profiles, and the internal notification engine).
- **Data Layer**: **Reservoir API** (Aggregated NFT data for ETH/POLY) and **Helius/SimpleHash** (Solana/BNB/AVAX asset indexing).

### 3.2 Cross-Chain Logic Engine

- **Unified State Manager**: A single dashboard that aggregates and mirrors balances across the **Power Square** (AVAX, POLY, ETH, BNB).
- **Chain-Specific Settlement**: Logic that handles gas estimation and atomic execution tailored to each network's specific finality and cost structures.
- **Interoperability Standards**: Designed to utilize Chainlink CCIP or similar messaging protocols for future cross-chain state synchronization.

### 3.3 Trade Velocity & Notification Engine

- **Green Dot (Live Presence)**:
  - **Logic**: Integrates Supabase Presence to monitor WebSocket heartbeats. The status resets to "Offline" immediately upon tab closure or after 5 minutes of inactivity.
  - **Objective**: Signals to counterparties that the asset owner is currently active on MyBarter, enabling high-velocity, near-instant negotiation and settlement.
- **In-App Notification Center**:
  - **Logic**: A dedicated "My Account" inbox built on Supabase Realtime. It listens for INSERT events in the trade_offers table.
  - **Mechanism**: When a user receives an offer, a real-time broadcast triggers a dashboard badge update and an in-app "Toast" notification, allowing the user to review and sign without leaving the platform.
- **Multi-Channel Fallback**: Optional automated triggers via X (Twitter) or email for critical trade milestones (Acceptance/Counter-offers) to re-engage users when they are not actively on-site.

### 3.4 Tiered Chain Integration (The Priority Matrix)

- **Tier 1 (The Power Square)**: Core launch focus on Avalanche, Polygon, Ethereum, and BNB Chain.
- **Tier 2 (Non-EVM Expansion)**: Solana integration (Rust/Anchor) specifically targeting high-velocity memecoin liquidity.
- **Tier 3 (Ecosystem Scaling)**: Modular expansion to Base and Arbitrum as volume and community demand scale.

## 4.0 Quality Assurance & Testing Plan

### 4.1 Smart Contract Validation (The "Robot Lawyer" Audit)
* **Unit Testing:** 100% coverage of the `MyBarterVault.sol` core logic using **Foundry**.
    * **Test Case 1:** Verification of atomic swaps (Swap fails if any asset in the bundle is missing).
    * **Test Case 2:** Fee calculation logic (Validating $2.50 flat fee vs. 0.75% commission via **Chainlink Price Feeds**).
    * **Test Case 3:** Anti-Exploit Guard (Ensuring non-whitelisted "Dust NFTs" cannot bypass fee logic).
* **Fuzz Testing:** Utilizing Foundry's `forge test` to execute 10,000+ random input scenarios to verify mathematical overflows and edge-case fee evasion.

### 4.2 Fuji Testnet Integration Testing
* **Cross-Chain Simulation:** Deploying identical "Robot Lawyer" instances on **Avalanche Fuji** and **Polygon Amoy** to verify logic consistency across EVM environments.
* **Oracle Stress Test:** Simulating rapid price fluctuations in a test environment to ensure **Chainlink/Pyth** updates trigger correct fee tiers without latency.

### 4.3 Real-time Presence & Inbox Testing (The "Green Dot")
* **Supabase Presence Validation:**
    * **Scenario A (Multi-tab sync):** Closing one browser tab should keep the user "Green" if other platform tabs remain active.
    * **Scenario B (Hard disconnect):** Simulating network failure to ensure status flips to "Offline" within the 5-minute heartbeat window.
* **Notification Latency:** Measuring end-to-end latency from "Offer Signed" to "Recipient Inbox Alert." Target: **<500ms** to maintain high-velocity trading.

### 4.4 User Acceptance Testing (UAT)
* **Public Beta (Fuji):** Opening the platform to my existing community for a structured "Bug Bounty" period during the final week of Build Games.
* **Wallet Compatibility:** Rigorous testing with **Core, MetaMask, and Rabby** to ensure seamless signature requests across desktop and mobile providers.

## 5.0 Revenue & Economic Model

### 5.1 Fee Structure & Value Alignment
MyBarter utilizes a hybrid fee model designed to align the protocol's sustainability with the three pillars of the Triple-Threat:

1. **Economic Safety Fee (The Memecoin Shield):**
   * **Fee:** **0.75% Commission** on all fungible token swaps (ERC-20/SPL/Native).
   * **Objective:** This is the primary revenue driver. It provides a "Dark Pool" environment for high-impact trades, allowing users to rotate large positions without DEX slippage or damaging project charts.

2. **Transactional Safety & Capital Efficiency Fee (The NFT Utility):**
   * **Fee:** **$2.50 Flat Fee** per trade for the NFT component.
   * **Objective:** Ensures a scam-proof environment for "Museum-grade" assets. By keeping the NFT fee low and flat, we incentivize users to bundle illiquid assets with "Cash Kickers" to restore market velocity.

### 5.2 "Robot Lawyer" Vault Enforcement
The revenue collection is fully automated and non-custodial via the smart contract:
* **Real-time Valuation:** The vault integrates **Chainlink Price Feeds** to determine the USD value of any token "Kicker" or pure token swap.
* **Programmatic Collection:** The 0.75% commission is calculated on-chain. If the total required fee ($2.50 base + 0.75% commission) is not met, the "Robot Lawyer" rejects the atomic swap, ensuring no fee evasion.
* **Non-Custodial:** MyBarter never holds user funds; fees are deducted at the exact moment of the atomic swap.

### 5.3 Revenue Projections (Conservative Beta Phase)
Based on an initial 3,000 trades/month target across the Power Square:
* **Base NFT Revenue:** ~$7,500 (3,000 trades × $2.50).
* **Token Commission Upside:** Projected **$2,250 - $10,000+** per month, scaling directly with the volume of high-value, zero-slippage token rotations.
* **Economic Moat:** By offering a 0.75% fee with 0% slippage, MyBarter remains significantly cheaper for large traders than traditional DEXs, where combined slippage and pool fees often exceed 1.5%–3%.
## 6. Security Requirements
* **Non-Custodial:** Assets are only movable via programmatic contract logic; no admin keys can withdraw user assets.
* **Timeout/Refund:** 72-hour window. Initiators can "Reclaim" assets and fees if the offer is not accepted.
