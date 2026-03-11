# CLAUDE.md

This file provides the "Source of Truth" for Claude Code (claude.ai/code) to build and deploy the MyBarter P2P settlement layer.

## Project Overview
MyBarter is the "Robot Lawyer" — a cross-chain P2P settlement layer for atomic swaps of NFTs and tokens. 
- **Hub:** Avalanche (MasterEscrow logic).
- **Spokes:** Ethereum, Polygon, BNB Chain (Asset custody).
- **Hard Rule:** Atomic settlement or total revert. No partial fills.

## Monorepo Structure
| Path | Purpose |
|---|---|
| `contracts/` | Solidity Source (Hub.sol, Spoke.sol) |
| `frontend/` | Next.js + Tailwind UI |
| `shared/` | Constants (Fees, Limits, Expirations) |

## The "Robot Lawyer" Invariants (MUST FOLLOW)

### 1. Fee Schedule & Hard Cap
- **Pure NFT Barter:** $0.00 Maker / $2.50 Taker (Flat Fee).
- **Hybrid (The Sweetener):** - If Token Kicker < $100: **Commission Waived** ($0.00 Maker / $2.50 Taker).
    - If Token Kicker ≥ $100: **REJECTED.** (Robot Lawyer prohibits high-value hybrids to prevent fee evasion).
- **Pure Token Rotation:** 0.75% commission on both sides.

**Constants:**
- `COMMISSION_BPS = 75`
- `FLAT_FEE_USD = 250` ($2.50)
- `HARD_CAP_USD = 10000` ($100.00)

### 2. Programmable Expiration (Taker-Driven)
- The **Taker** defines the validity window during the engagement/lock phase.
- **Options:** 24h (Min), 48h, 72h (Max).
- **Reclaim Power:** Once the Taker-defined window expires, the **Taker** triggers the `reclaim()` function to release assets and void the trade.
- **Logic:** `reclaim()` reverts if `block.timestamp < lockedAt + takerChosenWindow`.

### 3. Security Invariants
- **Volatility Guard (10%):** Revert if any asset price deviates >10% between `lockTrade()` and `settleTrade()`.
- **Non-Custodial:** No admin "withdraw" permissions.
- **Oracle:** Chainlink (On-chain logic) / Pyth (Frontend UI only).

## Trade State Machine
`PROPOSED` → `LOCKED (Taker sets timer)` → `SETTLED`
OR
`LOCKED` → `EXPIRED (Taker reclaims after 24-72h)`

## Development Commands
- **Root:** `npm install`
- **Contracts:** `npx hardhat compile` | `npx hardhat test`
- **Frontend:** `npm run dev`
