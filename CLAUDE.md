# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MyBarter is a cross-chain P2P settlement layer — the "Robot Lawyer" — for atomic swaps of NFTs and tokens across EVM chains. Settlement logic lives on Avalanche (Hub); asset custody lives on Ethereum, Polygon, and BNB Chain (Spokes). Trades are asynchronous: assets are deposited into SpokeVaults first, then atomically released by MasterEscrow on settlement.

## Monorepo Structure

| Path | Purpose |
|---|---|
| `contracts/hub/` | Avalanche — MasterEscrow.sol, fee logic, oracle integration |
| `contracts/spokes/` | ETH / POLY / BNB — SpokeVault.sol, asset custody |
| `frontend/` | Next.js + Tailwind UI, deployed to Vercel |

## Commands

### Root
```bash
npm install          # install all workspaces
npm run test         # run tests in all workspaces
```

### Hub (contracts/hub/)
```bash
npx hardhat compile
npx hardhat test
npx hardhat test test/MasterEscrow.test.ts   # single file
npx hardhat coverage
npx hardhat run scripts/deploy.ts --network fuji
npx hardhat run scripts/deploy.ts --network avalanche
```

### Spokes (contracts/spokes/)
```bash
npx hardhat compile
npx hardhat test
npx hardhat test test/SpokeVault.test.ts     # single file
npx hardhat run scripts/deploy.ts --network amoy        # Polygon testnet
npx hardhat run scripts/deploy.ts --network bscTestnet
npx hardhat run scripts/deploy.ts --network sepolia
```

### Frontend (frontend/)
```bash
npm run dev     # http://localhost:3000
npm run build
npm run lint
```

---

## The Triple-Threat Invariants

Every contract change must preserve all three. These are non-negotiable design constraints:

1. **Economic Safety (Slippage-Free):** All value flows through the vault atomically. No side-loading. Chainlink oracles determine USD value — never user-supplied amounts. The vault is a "Zero-Impact Dark Pool."
2. **Transactional Safety (Scam-Proof):** Both-party signatures required for atomic settlement. No admin key can unilaterally withdraw user assets. The escrow is non-custodial.
3. **Capital Efficiency (Asset Rotation):** Multi-asset bundles (NFTs + Tokens) must settle atomically or revert entirely. Partial fills are not allowed.

---

## Fee Schedule

| Trade Type | Maker Fee | Taker Fee |
|---|---|---|
| Pure Token Swap | 0.75% commission | 0.75% commission |
| Pure NFT Barter | $0.00 | $2.50 flat |
| Hybrid — Kicker < $100 | $0.00 | $2.50 flat |
| Hybrid — Kicker ≥ $100 | 0.75% on entire token amount | $2.50 flat |

**Key constants (use these names in all contracts):**
- `COMMISSION_BPS = 75` (0.75% expressed as basis points)
- `FLAT_FEE_USD = 250` ($2.50 in cents)
- `SWEETENER_THRESHOLD_USD = 10_000` ($100.00 in cents)

**Sweetener Buffer Logic:**
- The $100 commission-free zone is only available when **at least one NFT** is present in the trade bundle.
- At ≥ $100 token value, the 0.75% commission applies to the **entire** token amount — not just the amount above $100.
- Token USD value is determined at `lockTrade()` time using Chainlink. Users cannot supply their own valuations.

**Fee enforcement:** Fees are deducted programmatically during the atomic `settleTrade()`. The Taker pays the flat fee at `lockTrade()`. No manual overrides or admin bypasses.

---

## The 72-Hour Rule

- All `lockTrade()` calls record a `lockedAt` timestamp.
- Only the **Maker** may call `reclaim()`.
- `reclaim()` reverts if `block.timestamp < lockedAt + 72 hours`.
- The Taker cannot extend or reset the clock.
- Constant: `TIMELOCK = 72 hours`

---

## Security Invariants

### Volatility Circuit Breaker (10% Rule)
- Constant: `VOLATILITY_GUARD_BPS = 1000`
- At `lockTrade()`, Chainlink prices are snapshot-recorded for every token asset.
- At `settleTrade()`, current Chainlink prices are re-queried. If **any** token deviates >10% from the snapshot, the transaction reverts automatically.
- Error: `VolatilityGuardTriggered(address token, uint256 deviationBps)`

### Anti-Sideloading
- `settleTrade()` is atomic — all asset movements happen in one transaction. There is no code path where an NFT settles without the token side (or vice versa) passing through fee calculation.

### Oracle Strategy
- **Chainlink** (`AggregatorV3Interface`): Used for all on-chain fee enforcement and settlement valuation. Check `updatedAt` freshness (reject data older than 1 hour).
- **Pyth Network**: Used only in the frontend for real-time UI price display and negotiation-phase sanity checks. **Never use Pyth for on-chain fee logic.**

### Cross-Chain Authentication
- `SpokeVault` only accepts `releaseAssets()` and `reclaimAssets()` calls from the **Chainlink CCIP router** (`ccipRouter` immutable). Validate the sender strictly — this is the primary attack surface.
- The hub address (`hub` immutable on SpokeVault) must be validated inside CCIP message payloads.

---

## Trade State Machine

```
PROPOSED → LOCKED → SETTLED
         ↓         ↓
      CANCELLED   EXPIRED (reclaim after 72h)
```

- `proposeTrade()`: Maker creates trade, no assets move. Status: `PROPOSED`.
- `lockTrade()`: Taker accepts proposal, flat fee collected. Status: `LOCKED`. Price snapshot taken.
- `settleTrade()`: Both deposits confirmed, atomic release via CCIP. Status: `SETTLED`.
- `reclaim()`: Maker calls after 72h. Status: `EXPIRED`. Assets return to depositors.
- `cancelTrade()`: Either party cancels a `PROPOSED` trade (not yet locked).

---

## Testing Requirements (TRD §4)

Target 100% branch coverage on `MasterEscrow.sol`. Mandatory test cases:

| # | Name | What to verify |
|---|---|---|
| 1 | Atomic Integrity | Transaction reverts if any single bundle asset is missing or unapproved |
| 2 | Pure Token Rotation | 0.75% triggers from the first $1.00 of token value (no NFTs) |
| 3 | Sweetener Rule | Hybrid trade waives commission if token < $100; applies 0.75% to **entire** amount if ≥ $100 |
| 4 | Fee Integrity | $2.50 flat fee collected on every NFT trade regardless of token volume |

Fuzz testing: `forge test --fuzz-runs 10000` on all fee calculation functions.

Integration: Fuji (hub) ↔ Polygon Amoy (spoke) for cross-chain message tests.

---

## Chain Targets

- **Tier 1 (Power Square — launch):** Avalanche (hub), Ethereum, Polygon, BNB Chain
- **Tier 2 (Q3 2026):** Solana — Rust/Anchor port
- **Tier 3 (scaling):** Base, Arbitrum

---

## Architecture Notes

- **Hub-and-Spoke model:** MasterEscrow on Avalanche is the single source of truth for trade state. SpokeVaults on other chains are stateless asset holders — they take orders from the hub via CCIP.
- **RainbowKit/Wagmi** for wallet connections (Core, MetaMask, Rabby).
- **Supabase** for: user profiles, "Green Dot" WebSocket presence (5-min heartbeat), ephemeral deal-chat (auto-deleted on trade settlement or expiry), in-app notification inbox.
- **Reservoir API** for ETH/POLY NFT data; **SimpleHash** for BNB/AVAX asset indexing.
- Social auth: Users must link an X (Twitter) account via OAuth or verify an email before marking assets "Up for Trade."
