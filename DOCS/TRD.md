MyBarter Technical Requirements Document (TRD) v1.4

1. System Overview
MyBarter is a cross-chain P2P settlement layer. It uses an asynchronous escrow model (The "Robot Lawyer") to allow users to propose, negotiate, and execute trades involving NFTs and tokens across Avalanche and Polygon, with settlement logic hosted on Avalanche.

2. Core Functional Requirements
2.1 Profile & Onboarding (The Social Layer)
Wallet Integration: Support for Core, Metamask, and Rabby via RainbowKit/Wagmi.

Mandatory Identity Linking: Users must link an X (Twitter) account via OAuth or verify an Email address before they can tag assets as "Up for Trade."

Presence Service: A WebSocket-based "Heartbeat" to track active sessions.

UI Requirement: A Green Dot (Active) or Red Dot (Offline) displayed on the user's profile and their listed assets.

2.2 Inventory & Discovery
Multi-Chain Indexing: The app must scan the user's wallet on Avalanche, Polygon, and Ethereum.

"Up for Trade" Toggle: A database flag (off-chain) that allows users to mark specific NFTs in their collection as "Active for Barter."

Filtered Gallery: A public-facing marketplace view where users can filter exclusively for NFTs marked "Up for Trade."

2.3 The "Robot Lawyer" Escrow (Smart Contracts)
Offer Initiation: User B selects an asset from User A’s gallery. User B pays a $2.00 Platform Fee + locks their offered assets (NFT/Tokens) into the MyBarter Vault.

Atomic Swap Logic: The contract must only release assets if both signatures (User A and User B) are present and the required fees are paid.

Fee Oracle: For pure token-to-token swaps, the contract must query a price feed (Pyth/Chainlink) to calculate the 0.5% commission.

2.4 Notification Engine
In-App: Real-time toast notifications for "New Offer Received."

Social Trigger: An automated bot that tags the counterparty on X once a trade is "Locked" in the vault.

Payload: "Hey @[UserHandle], a new offer has been secured for your [Asset Name]. Review here: [Link]"

3. Technical Stack
Frontend: Next.js, Tailwind CSS, Shadcn UI.

Backend/Database: Supabase (for Presence, Profile metadata, and "Up for Trade" flags).

Smart Contracts: Solidity (Hardhat/Foundry).

Cross-Chain: Avalanche Interchain Messaging (ICM) or LayerZero/Wormhole for state synchronization.

Notifications: SendGrid (Email) and a custom Twitter API worker.

4. Security Requirements
Non-Custodial: Assets must never be accessible by the MyBarter team; they are only movable via the "Robot Lawyer" contract logic.

Timeout/Refund: If an offer is not accepted within 72 hours, User B must be able to "Reclaim" their assets and the $2 fee (minus gas).
