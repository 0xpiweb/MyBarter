### 1. Smart Contract Integrity

* **Non-Custodial Design:** Assets are held in isolated, per-trade vault addresses; no administrative "God Mode" exists to withdraw or transfer user funds.
* **Reentrancy Protection:** All state-changing functions utilize `nonReentrant` modifiers to prevent recursive call exploits during asset settlement.
* **Arithmetic Safety:** Leverages Solidity 0.8.x native overflow/underflow checks to ensure mathematical integrity of the "Robot Lawyer" fee calculator.
* **Pull-over-Push Settlement:** All fee distributions and "Cash Kicker" movements follow the pull-payment pattern to mitigate Denial of Service (DoS) and gas-griefing attacks.
* **Circuit Breaker:** An emergency "Pause" mechanism can halt new offer creation during detected anomalies while ensuring `reclaim()` functions remain active for existing deposits.

### 2. Barter Logic & Game Theory

* **Programmable Expiration:** Moving beyond static limits, the **Taker** defines the validity window (24h–72h). If the window closes without finalization, the Taker triggers the `reclaim()` function to void the trade and release assets.
* **Atomic Settlement:** The "Robot Lawyer" Handshake ensures that all assets (NFTs, Tokens, and Fees) move within a single transaction block; if one component fails, the entire swap reverts.
* **Oracle Integrity:** Fee calculations for "Hybrid" and "Pure Rotation" trades utilize Chainlink or Pyth price feeds with mandatory heartbeat checks to prevent stale price manipulation.
* **The $100 Hard Cap:** Logic is hard-coded to reject any "Hybrid" trade where the token kicker value exceeds $100 USD, preventing protocol-wide fee evasion.

### 3. User Privacy & Security

* **OAuth Least-Privilege:** X/Twitter integration is strictly "Read-Only" for identity verification; the protocol never requests write-access or private credentials.
* **Off-Chain PII Isolation:** Notification data (emails/handles) is stored in an encrypted, off-chain environment (Supabase) and is never exposed to the public ledger.
