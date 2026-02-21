# MyBarter Technical Requirements Document (TRD) v1.5

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
    * **NFT-inclusive Trades:** Flat $2.00 fee.
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

## 3.0 System Architecture & Technical Stack

### 3.1 The Multi-Chain Stack

- **Smart Contracts**: Solidity (AVAX/BNB/ETH/POLY) for the "Robot Lawyer" Vault; architected for cross-chain consistency.
- **Oracles**: **Chainlink Price Feeds** (Primary settlement oracle for Build Games) supplemented by **Pyth Network** for high-frequency price updates.
- **Frontend**: Next.js / Tailwind CSS (Optimized for Vercel deployment and responsive mobile bartering).
- **Backend/Real-time**: **Supabase** (Powering "Green Dot" presence, user profiles, and off-chain trade signaling).
- **Data Layer**: **Reservoir API** (Aggregated NFT data for ETH/POLY) and **Helius/SimpleHash** (Solana/BNB/AVAX asset indexing).

### 3.2 Cross-Chain Logic Engine

- **Unified State Manager**: A single dashboard that aggregates and mirrors balances across the **Power Square** (AVAX, POLY, ETH, BNB).
- **Chain-Specific Settlement**: Logic that handles gas estimation and atomic execution tailored to each specific network.

### 3.3 Trade Velocity & Notification Engine

#### 3.3.1 Live Presence Logic (The "Green Dot")

- **Mechanism**: Built on **Supabase Presence**, utilizing WebSocket heartbeats to track active sessions.
- **State Management**:
  - **Green (Online)**: Triggered when the user has an active tab and is authenticated via their wallet.
  - **Red (Offline)**: Triggered immediately upon WebSocket disconnection (tab closed) or after 5 minutes of idle time.
- **Strategic Goal**: Eliminates "Ghosting" in P2P trades by signaling to the buyer that the seller is available for **Instant Atomic Settlement**.

#### 3.3.2 In-App Notification Center (The "My Account" Inbox)

- **Infrastructure**: Uses **Supabase Realtime (Postgres Changes)** to listen for new entries in the trade_offers database table.
- **Notification Flow**:
  1. **Trigger**: User A submits an offer via the Smart Contract/Backend.
  2. **Broadcast**: Supabase detects the new row and broadcasts a payload specifically to User B’s user_id channel.
  3. **UI Update**: A real-time notification badge appears on the "My Account" icon, and an in-app "Toast" alert provides an immediate link to review the offer.
- **Persistence**: All notifications are stored in a notifications table (Status: Unread/Read) to ensure users never miss an offer while offline.

#### 3.3.3 Multi-Channel Fallback

- **Out-of-App Alerts**: For critical trade updates (e.g., an offer is accepted or a counter-offer is made), an optional automated notification is pushed via X (Twitter) DM or Email to pull the user back into the dApp for final signature.

### 3.4 Tiered Chain Integration (The Priority Matrix)

- **Tier 1 (The Power Square)**: Core launch focus on Avalanche, Polygon, Ethereum, and BNB Chain.
- **Tier 2 (Non-EVM Expansion)**: Solana integration (Rust/Anchor) specifically targeting high-velocity memecoin liquidity.
- **Tier 3 (Ecosystem Scaling)**: Modular expansion to Base and Arbitrum as volume and community demand scale.

## 4. Security Requirements
* **Non-Custodial:** Assets are only movable via programmatic contract logic; no admin keys can withdraw user assets.
* **Timeout/Refund:** 72-hour window. Initiators can "Reclaim" assets and fees if the offer is not accepted.
