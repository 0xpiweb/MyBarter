# MyBarter Technical Requirements Document (TRD) v1.6

## System Overview
MyBarter is a cross-chain P2P settlement layer. It uses an asynchronous escrow model (The "Robot Lawyer") to allow users to propose, negotiate, and execute trades involving NFTs and tokens across EVM-compatible chains, with settlement logic hosted on Avalanche.

## 1.0 Project Scope & Objectives

### 1.1 The Triple-Threat Problem Set
MyBarter is a multi-chain settlement layer designed to resolve friction across the entire digital asset lifecycle, prioritized as follows:

1. **Economic Safety (Slippage-Free):** Large swaps in any token - from high-cap blue chips (AVAX, ETH, BNB, POL) to emerging gems - suffer from DEX price impact. This "Red Candle" effect damages project charts and penalizes traders via MEV bots.
2. **Transactional Safety (Scam-Proof):** Peer-to-peer trading currently relies on unverified manual escrow (Discord/Telegram), exposing users to systemic OTC fraud and "who-goes-first" standoffs.
3. **Capital Efficiency (Asset Rotation):** High-value NFTs and large token positions often become "dead capital." MyBarter unlocks this liquidity by enabling atomic, multi-asset bundling and rotation.

### 1.2 Technical Objectives
* **Universal Token Settlement:** A "Zero-Impact Dark Pool" architecture using off-AMM P2P logic to eliminate slippage on all Power Square assets.
* **Trustless Escrow:** Implementation of the "Robot Lawyer" (Solidity/EVM) to programmatically secure OTC transactions.
* **Capital Velocity:** A flexible asset-bundling engine allowing for atomic swaps of heterogeneous assets (NFTs + Tokens).
  
## 2. Core Functional Requirements

### 2.1 Profile & Onboarding (The Social Layer)
* **Wallet Integration:** Support for Core, Metamask, and Rabby via RainbowKit/Wagmi.
* **Mandatory Identity Linking:** Users must link an X (Twitter) account via OAuth or verify an Email address before tagging assets as "Up for Trade."
* **Presence Service:** A WebSocket-based "Heartbeat" (Supabase Presence) to track active sessions.
* **UI Requirement:** Real-time Green Dot (Active) or Red Dot (Offline) displayed on user profiles.

### 2.2 Inventory & Discovery (The Assets)
* **Multi-Chain Indexing:** Cross-chain scanning of user wallets on Avalanche, Polygon, BNB, and Ethereum.
* **"Up for Trade" Toggle:** An off-chain database flag allowing users to mark specific NFTs as "Active for Barter."
* **Filtered Gallery:** A marketplace view displaying only NFTs marked "Up for Trade," prioritizing active users.

### 2.3 The Negotiation Engine & Ephemeral Chat
To drive **Capital Efficiency**, MyBarter allows users to bridge value gaps without leaving the platform.

* **Counter-Offer Logic:** A Taker may reject an initial offer and propose a counter-offer, specifying a required **Cash Kicker** (fungible tokens) to balance the trade.
* **Ephemeral Deal-Chat:** * **Scope:** A dedicated, low-latency chat channel is opened automatically when an offer is "Locked" in the vault.
    * **Exclusivity:** Access is restricted strictly to the two parties involved in the specific Trade ID.
    * **Life-Cycle:** To ensure privacy and platform cleanliness, the chat history and channel are **permanently deleted** from Supabase the moment the trade is either "Settled" (Accepted) or "Expired/Cancelled" (Rejected).
* **Presence Integration:** The "Green Dot" remains active during chat sessions, signaling to both parties that the negotiation is live.

### 2.4 The "Robot Lawyer" Escrow (Smart Contracts)

The "Robot Lawyer" is the core settlement engine of MyBarter. It serves as an asynchronous, non-custodial vault that manages the custody and atomic exchange of assets. To ensure **Transactional Safety**, assets are only released if the signatures of both parties are verified and the programmatic fee requirements are met in a single atomic transaction.

### 2.4.1 Hybrid Fee Enforcement

The vault programmatically applies fees based on the trade composition. This ensures high-value "Pure Token" rotations contribute to protocol revenue while incentivizing NFT bartering through a "Sweetener" buffer.

| Trade Type | Maker Responsibility | Taker Responsibility |
| :--- | :--- | :--- |
| **Pure Token Swap** | **0.75% Commission** | **0.75% Commission** |
| **Pure NFT Barter** | $0.00 | **$2.50 Flat Fee** |
| **Hybrid (Small Kicker)** | $0.00 (Kicker <$100) | **$2.50 Flat Fee** |
| **Hybrid (Large Kicker)** | **0.75% Commission** | **$2.50 Flat Fee** |

> **Execution Note:** In Pure Token Swaps, both parties pay a 0.75% "Slippage-Avoidance" fee. This is calculated against the total USD value of the tokens provided by each party, as verified by Chainlink Price Oracles.
### 2.4.2 The "Sweetener" Buffer Logic
To drive **Capital Efficiency** and lower the friction for NFT traders, the Robot Lawyer implements a conditional commission waiver:
* **The NFT Anchor:** The $100 commission-free buffer is **only** activated when at least one NFT is present in the trade bundle.
* **Threshold Verification:** The system utilizes **Chainlink Price Feeds** to calculate the USD value of the tokens at the moment of the swap. 
* **Automatic Tier Escalation:** If the token value (the "Cash Kicker") is ≥ $100 USD, the trade is automatically reclassified as a "Large Kicker," and the 0.75% commission is applied to the entire token amount.

### 2.4.3 Anti-Exploit Guard (Fee Integrity)
The smart contract architecture is designed to prevent "Fee Evasion" strategies:
* **No Side-Loading:** Because the swap is atomic, users cannot transfer tokens outside of the vault's logic while using the vault for the NFT portion. All value moved within the transaction is seen and taxed by the Robot Lawyer.
* **Asset Valuation:** By using on-chain oracles (Chainlink/Pyth), the contract ignores user-inputted values, relying instead on real-time market data to determine if a trade has crossed the $100 commission threshold.

### 2.5 Notification Engine

* **In-App:** Real-time toast notifications for offer events.
* **Social Trigger:** Automated X-bot tagging the counterparty when a trade is "Locked" in the vault.
* **Payload:** "Hey @[UserHandle], a new offer has been secured for your [Asset Name]. Review here: [Link]"

## 3.0 System Architecture & Technical Stack

### 3.1 The Multi-Chain Stack

- **Smart Contracts**: Solidity (AVAX/BNB/ETH/POLY) for the "Robot Lawyer" Vault; architected for cross-chain consistency and high-security escrow.
- **Dual-Oracle Strategy:** * **Chainlink Price Feeds (Primary):** Used for the final "Robot Lawyer" settlement valuation and fee calculation.
    * **Pyth Network (Low-Latency):** Used for real-time UI price updates and as a sub-second "sanity check" for volatile tokens during the negotiation phase.
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
    * **Test Case 1 (Atomic Integrity):** Verification of atomic swaps—ensure the transaction reverts if any single asset in a complex bundle is missing or unapproved.
    * **Test Case 2 (Pure Token Rotation):** Confirm that swaps containing only tokens trigger the **0.75% commission** starting from the first $1.00 of value.
    * **Test Case 3 (The Sweetener Rule):** Validate that a "Hybrid" trade (NFT + Tokens) correctly waives the commission if token value is <$100, but automatically applies the 0.75% fee to the entire token amount if the value is ≥$100.
    * **Test Case 4 (Fee Integrity):** Ensure the $2.50 flat fee is consistently collected for any trade involving an NFT, regardless of token volume.
* **Fuzz Testing:** Utilizing Foundry's `forge test` to execute 10,000+ random input scenarios (varying token amounts and NFT counts) to verify mathematical precision and prevent "fee-rounding" exploits.

### 4.2 Fuji Testnet Integration Testing
* **Cross-Chain Simulation:** Deploying identical "Robot Lawyer" instances on **Avalanche Fuji** and **Polygon Amoy** to verify logic consistency and signature handling across EVM environments.
* **Oracle Stress Test:** Simulating rapid price fluctuations using the **Chainlink/Pyth** testnet feeds to ensure the vault captures the correct USD value during high-volatility events, protecting the 0.75% revenue stream.

### 4.3 Real-time Presence & Inbox Testing (The "Green Dot")
* **Supabase Presence Validation:**
    * **Scenario A (Multi-tab sync):** Closing one browser tab should keep the user "Green" if other platform tabs remain active.
    * **Scenario B (Hard disconnect):** Simulating network failure to ensure status flips to "Offline" within the 5-minute heartbeat window.
* **Notification Latency:** Measuring end-to-end latency from "Offer Signed" to "Recipient Inbox Alert." Target: **<500ms** to maintain the "high-velocity" trading experience.

### 4.4 User Acceptance Testing (UAT)
* **Public Beta (Fuji):** Opening the platform to the existing community for a structured "Bug Bounty" period during the final phase of Build Games.
* **Wallet Compatibility:** Rigorous testing with **Core, MetaMask, and Rabby** to ensure seamless signature requests across desktop and mobile providers.

## 5.0 Revenue & Economic Model

### 5.1 Fee Strategy & Value Alignment
MyBarter’s revenue model is engineered to capture value from professional "Professional Rotations" while removing friction for retail barterers.

* **Professional Tier (Economic Safety):** By applying a 0.75% commission to token-heavy trades, we capture revenue from high-value moves that would otherwise suffer from 1.5%+ slippage on DEXs. This creates a sustainable treasury while providing a superior service for "Whales."
* **Retail Tier (Capital Efficiency):** The $100 "Sweetener" buffer (detailed in Section 2.3) ensures that community-level NFT bartering remains high-velocity. We prioritize ecosystem growth over nickel-and-diming small-cap users.
* **Settlement Model:** MyBarter utilizes a **"Taker-Pays"** model. The initiator (Maker) can propose trades for free, while the Taker pays the fixed $2.50 fee and any applicable commission during final execution. This ensures the protocol is always compensated for the gas and compute of the "Robot Lawyer" settlement.

#### 5.1.1 The Ethereum Mainnet Case (Post-Fusaka/PeerDAS)

While MyBarter originates in the Avalanche ecosystem, the Q2 2026 deployment to Ethereum Mainnet is a primary revenue catalyst based on the following structural shifts:

* **Sub-Dollar Unit Economics:** Following the 2025/2026 upgrades, Ethereum L1 transaction fees have stabilized at an average of **$0.20 - $0.50**. This enables MyBarter to offer its **$2.50 flat fee** with a >400% margin on the settlement gas cost.
* **Blue-Chip Liquidity Capture:** Ethereum remains the host for 60%+ of global NFT value (Pudgy Penguins, BAYC, Azuki). Capturing even 1% of the monthly "Blue Chip" rotation volume provides a significant upward multiplier to our $15,000 base revenue projections.
* **Institutional Trust:** For high-value token rotations ($100k+), Ethereum’s security remains the industry gold standard. Our **0.75% commission** on these swaps becomes the most cost-effective way for whales to move large positions without the high slippage of Ethereum-based AMMs.

### 5.2 "Robot Lawyer" Vault Enforcement
* **The "Sweetener" Rule:** The $100 commission-free buffer is **only** unlocked when an NFT is present. If the token value exceeds $100, the 0.75% commission is applied to the entire token amount.
* **Real-time Valuation:** The vault integrates **Chainlink Price Feeds** to determine the USD value of tokens at the exact moment of execution.
* **Non-Custodial Collection:** Fees are deducted programmatically during the atomic swap. 

### 5.3 Revenue Projections (Conservative 1,500 Trade Model)

These projections assume a conservative "Retail-First" environment for Hybrid trades and an Average Transaction Value (ATV) of $1,000 for professional rotations.

| Revenue Stream | Trade Volume | Calculation (Per Side) | Monthly Revenue |
| :--- | :--- | :--- | :--- |
| **Hybrid Settlement Fees** | 600 Trades | $2.50 (Taker Only) | **$1,500** |
| **Token Rotation Commissions** | 900 Trades | $7.50 (Maker) + $7.50 (Taker) | **$13,500** |
| **Total Monthly Revenue** | **1,500 Trades** | — | **$15,000** |

#### **The Strategic Moat: Dual-Sided Settlement**
* **Individual ROI:** By charging each party a 0.75% commission ($7.50 on a $1,000 swap), both the Maker and Taker achieve a net gain by avoiding the 1.5% - 3.0% slippage typical of low-liquidity AMM pairs.
* **Incentivized Hybrid Model:** The $1,500 generated from Hybrid fees ensures that while the NFT community enjoys a low-friction entry point, the protocol remains anchored by the high-value "Dark Pool" activity of the token rotation market.

## 6.0 Security & Operational Safeties

### 6.1 Volatility Circuit Breaker
* **The 10% Rule:** The Robot Lawyer monitors the price delta between the "Offer Signing" and "Execution." 
* **Automatic Revert:** If a token's price deviates by more than **10%** (via Chainlink Data Streams), the transaction is automatically reverted to protect the user's capital and protocol fee integrity.

### 6.2 Transactional Safety Guardrails
* **Asynchronous Escrow:** Assets are held in isolated vaults; no central "admin" key can withdraw user assets.
* **Signature Expiration:** All trade offers include a 72-hour time-lock. If an offer is not accepted, the "Maker" can trigger a `reclaim()` function.
* **Anti-Sideloading:** Swaps are atomic; assets cannot be moved "outside" the fee calculator logic during a `swap()` execution.

## 7.0 2026 Expansion Roadmap

### **Phase 1: Build Games & Fuji Alpha (Q1 2026)**
* **Focus:** Logic validation on Fuji Testnet for the "Robot Lawyer."
* **Milestones:** Implementation of Ephemeral Deal-Chat and Green Dot Presence.

### **Phase 2: The Power Square Launch (Q2 2026)**
* **Network Launch:** Concurrent Mainnet deployment on **Avalanche, Ethereum, Polygon, and BNB Chain.**
* **Revenue Anchor:** Onboarding Ethereum Blue Chips (Pudgy Penguins, BAYC, Milady) to capture the 62% market share of NFT contract volume.
* **EVM Parity:** Ensuring the $2.50 flat fee and 0.75% commission logic is identical across all four chains.

### **Phase 3: Cross-Chain & Non-EVM (Q3 - Q4 2026)**
* **Solana Integration (Q3):** Porting the settlement engine to Rust to capture high-velocity memecoin liquidity.
* **Institutional Pivot (Q4):** Launching support for **Tokenized Real-World Assets** (RWAs) and "Whale Tiers" for high-volume institutional rotations.
