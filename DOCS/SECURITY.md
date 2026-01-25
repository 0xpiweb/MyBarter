**1. Smart Contract Integrity**

  Non-Custodial Design: Assets are held in a specific escrow contract address; no administrative address has "Withdraw" or "Transfer" permissions over user funds.

  Reentrancy Protection: All state-changing functions utilize nonReentrant modifiers to prevent recursive call exploits.

  Integer Overflow/Underflow: Implementation uses Solidity 0.8.x native checks to prevent arithmetic vulnerabilities.

  Pull-over-Push Payments: Platform fees ($2) and "Cash Kickers" follow the pull-payment pattern to mitigate Denial of Service (DoS) attacks.

  Emergency Circuit Breaker: An owner-controlled "Pause" function is implemented to halt new trades in the event of a detected anomaly (while still allowing withdrawals of existing deposits).

**2. Barter Logic & Game Theory**
  
  Escrow Timeout: A hard-coded 72-hour window. If a trade is not finalized, the initiator can trigger a reclaim() function to unlock their assets.

  Atomic Settlement: The "Handshake" logic ensures that Asset A and Asset B move in the same transaction block or not at all.

  Oracle Integrity: Fee calculations for pure token swaps use Chainlink or Pyth price feeds with a heartbeat check to prevent stale price manipulation.

**3. User Privacy & Social Security**
  
  OAuth Least-Privilege: X/Twitter integration requests "Read-Only" access to verify handles; MyBarter never requests write-access or password data.

  Encrypted Notification Routing: Email addresses used for notifications are stored off-chain in an encrypted database (Supabase) and are never exposed via the smart contract.
