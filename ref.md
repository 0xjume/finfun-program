Below is the updated specification for the Minimum Viable Product (MVP) of the Finfun.xyz Price Prediction Competition, focusing on a single competition type with **external wallet connection** for sign-in and transactions. The MVP allows users to create and join Price Prediction competitions for Solana-native tokens, with entry fees and prize pools managed by a Solana program written in **Rust using Anchor** (replacing TypeScript via Poseidon). Competition results are validated using the **Ave.ai API**. This spec is tailored for temporary development, ensuring a lean, functional, and user-friendly experience.

---

## **Finfun.xyz MVP Specification: Price Prediction Competition**
*Version 1.2 - May 15, 2025*  
*Platform: Web (Responsive) & Mobile (iOS/Android)*  
*Updated: 10:28 AM WIB, Thursday, May 15, 2025*

---

### **1. Project Overview**
**Objective**: Launch a streamlined MVP for Finfun.xyz that enables users to create and join Price Prediction competitions on Solana, using **SOL** as the sole token for entry fees and rewards. The MVP uses external wallet connections (e.g., Phantom, Solflare) for authentication and transactions, with smart contracts developed in Rust using Anchor.

**Scope**:
- Single competition type: Price Prediction.
- External wallet connection for sign-in and SOL transactions.
- Users can create competitions by selecting Solana tokens or pasting token addresses.
- Entry fees are collected in a Solana program-managed prize pool.
- Results are validated via Ave.ai API.

**Goals**:
- Validate the core user-generated competition concept.
- Attract early Solana users for feedback.
- Prepare for Q1 2025 launch.

---

### **2. User Flow**

#### **2.1 Onboarding**
- **Sign-In**:
  - **UI**: Landing page with a **Neon Blue** (#00D4FF) “Connect Wallet” button.
  - **Action**: Users connect their Solana wallet (e.g., Phantom, Solflare) using Solana Web3.js, prompting a wallet signature to authenticate.
  - **Feedback**: “Wallet Connected!” in **SOL Orange** (#F7931A) with the wallet address (shortened, e.g., “0x123...456”) displayed upon success. If no wallet is detected, a pop-up suggests installing one (e.g., “No wallet? Get Phantom here!”) with a link.
  - **Technical**: Solana Web3.js handles wallet connection and signature verification, storing the public key in a session for user identification.

#### **2.2 Main Dashboard (Home)**
- **Featured Competitions**:
  - **UI**: Carousel of active Price Prediction competitions (e.g., “SOL Price Prediction | Prize: 1 SOL”).
  - **Details**: Token, entry fee (e.g., 0.1 SOL), prize pool, participant count, countdown (e.g., “Ends in 12h”).
  - **Action**: Tap to join or view details.
- **Quick Actions**:
  - **UI**: Two buttons: “Create Competition” (**Neon Blue**) and “Browse Competitions” (**SOL Orange**).
- **User’s Competitions**:
  - **UI**: Cards listing active competitions (e.g., “Rank: #2 | Ends in 2h”).
  - **Action**: Tap to view leaderboard or details.

#### **2.3 Creating a Price Prediction Competition**
- **Form**:
  - **UI**: Form with:
    - **Token Selection**: Dropdown of Solana tokens (e.g., SOL, JUP, RAY) or text field for token address.
    - **Entry Fee**: Numeric input (e.g., 0.1 SOL, minimum 0.05 SOL).
    - **Duration**: Dropdown (e.g., 1h, 12h, 24h).
    - **Prize Pool**: Numeric input (e.g., 1 SOL, creator-funded).
  - **Validation**: Backend verifies token address (via Helius.dev API), wallet balance (via Web3.js), and prize pool ≥ entry fee.
- **Funding**:
  - **UI**: “Fund with 1 SOL” (**Neon Blue**) prompts wallet signature via Web3.js.
  - **Feedback**: “Competition Created!” with a **SOL Orange** trophy icon.
  - **Technical**: Backend calls `initialize_competition` (Rust smart contract) to create `Competition Account` and `Vault Account`, transferring SOL to the vault.

#### **2.4 Joining a Price Prediction Competition**
- **Browse**:
  - **UI**: Grid of competition cards (e.g., “SOL Price Prediction | Entry: 0.1 SOL | Prize: 1 SOL”).
  - **Filters**: By token, prize size, time remaining.
- **Join**:
  - **UI**: Tap “Join Now” (**Neon Blue**) → Modal shows “Confirm 0.1 SOL Entry Fee” and wallet balance (queried via Web3.js).
  - **Action**: Input SOL price prediction (e.g., “150”) → “Submit Guess” (**Neon Blue**) triggers wallet signature.
  - **Feedback**: “You’re in! Good luck!” (**SOL Orange** checkmark).
  - **Technical**: Backend calls `submit_prediction`, creating a `Prediction Account` and transferring 0.1 SOL to the vault.

#### **2.5 Leaderboard & Results**
- **Leaderboard**:
  - **UI**: Real-time rankings with top 3 in a podium (e.g., “#1 @UserX - 150.2 SOL”), rest scrollable.
  - **Updates**: WebSocket refreshes every few seconds.
- **Results**:
  - **UI**: Shows “Winner: @UserY | Prize: 1 SOL” with a **SOL Orange** trophy.
  - **Technical**: Backend fetches final price from Ave.ai API (5-minute buffer), calls `resolve_competition` to distribute SOL.

#### **2.6 Wallet Management**
- **Overview**:
  - **UI**: “SOL Balance: 5” in a **SOL Orange** to **Competition Purple** (#A020F0) gradient, queried via Web3.js.
  - **Actions**: “Deposit” / “Withdraw” (**Neon Blue** buttons) prompt wallet interactions via Web3.js.
- **History**:
  - **UI**: Lists transactions (e.g., “Entry Fee: -0.1 SOL”).
  - **Links**: Helius.dev explorer links for transparency.

---

### **3. Branding Guidelines**
- **Colors**:
  - **SOL Orange**: `#F7931A` (rewards)
  - **Competition Purple**: `#A020F0` (community)
  - **Neon Blue**: `#00D4FF` (CTAs)
  - **Electric Pink**: `#FF00FF` (gamification)
  - **Dark Gray**: `#1A1A1A` (background)
  - **Light Gray**: `#F0F0F0` (text)
- **Typography**:
  - **Headings**: `Space Grotesk` ([Google Fonts](https://fonts.google.com/specimen/Space+Grotesk))
  - **Body**: `Inter` ([Google Fonts](https://fonts.google.com/specimen/Inter))
- **Tone**: Playful, competitive (e.g., “Think you can predict SOL? Prove it!”).

---

### **4. Technical Specifications**

#### **4.1 Tech Stack**
- **Frontend**: React (web) and React Native (mobile) with TypeScript.
- **Backend**: Node.js/Express, PostgreSQL (competition metadata), WebSockets (live updates).
- **Blockchain**: Solana, Web3.js, Anchor (for smart contract development).
- **Smart Contracts**: Rust using Anchor.
- **APIs**:
  - **Ave.ai API**: Real-time price data for competition resolution.
  - **Helius.dev**: Solana RPC provider.
  - **X API (optional)**: Social sharing.

#### **4.2 Smart Contract**
- **Program**: `FinfunProgram`
- **Accounts**:
  - **Competition Account** (PDA):
    - Data: `token` (string), `end_time` (i64), `entry_fee` (u64, SOL lamports), `prize_pool` (u64, SOL lamports), `state` (u8), `winner` (Pubkey).
    - Seeds: `[b"competition", competition_id]`.
  - **Prediction Account** (PDA):
    - Data: `competition` (Pubkey), `user` (Pubkey), `guess` (u64), `timestamp` (i64).
    - Seeds: `[b"prediction", competition.key, user.key]`.
  - **Vault Account** (PDA):
    - Data: SOL balance.
    - Seeds: `[b"vault", competition_id]`.
- **Rust Code (Anchor)**:
  ```rust
  use anchor_lang::prelude::*;

  declare_id!("YourProgramIdHere");

  #[program]
  pub mod finfun {
      use super::*;

      pub fn initialize_competition(
          ctx: Context<InitializeCompetition>,
          token: String,
          end_time: i64,
          entry_fee: u64,
          prize_pool: u64,
      ) -> Result<()> {
          let competition = &mut ctx.accounts.competition;
          competition.creator = ctx.accounts.creator.key();
          competition.token = token;
          competition.end_time = end_time;
          competition.entry_fee = entry_fee;
          competition.prize_pool = prize_pool;
          competition.state = 0; // Active
          competition.winner = Pubkey::default();

          // Transfer SOL to vault
          let cpi_program = ctx.accounts.system_program.to_account_info();
          let cpi_accounts = anchor_lang::system_program::Transfer {
              from: ctx.accounts.creator.to_account_info(),
              to: ctx.accounts.vault.to_account_info(),
          };
          anchor_lang::system_program::transfer(
              CpiContext::new(cpi_program, cpi_accounts),
              prize_pool,
          )?;
          Ok(())
      }

      pub fn submit_prediction(ctx: Context<SubmitPrediction>, guess: u64) -> Result<()> {
          let competition = &ctx.accounts.competition;
          let clock = Clock::get()?;
          if competition.state != 0 || clock.unix_timestamp > competition.end_time {
              return err!(ErrorCode::CompetitionClosed);
          }

          let prediction = &mut ctx.accounts.prediction;
          prediction.competition = competition.key();
          prediction.user = ctx.accounts.user.key();
          prediction.guess = guess;
          prediction.timestamp = clock.unix_timestamp;

          // Transfer SOL entry fee to vault
          let cpi_program = ctx.accounts.system_program.to_account_info();
          let cpi_accounts = anchor_lang::system_program::Transfer {
              from: ctx.accounts.user.to_account_info(),
              to: ctx.accounts.vault.to_account_info(),
          };
          anchor_lang::system_program::transfer(
              CpiContext::new(cpi_program, cpi_accounts),
              competition.entry_fee,
          )?;
          Ok(())
      }

      pub fn resolve_competition(
          ctx: Context<ResolveCompetition>,
          winner: Pubkey,
          payout: u64,
      ) -> Result<()> {
          let competition = &mut ctx.accounts.competition;
          if competition.state != 0 {
              return err!(ErrorCode::AlreadyResolved);
          }

          competition.winner = winner;
          competition.state = 1; // Resolved

          // Transfer SOL to winner
          let vault = &mut ctx.accounts.vault;
          **vault.to_account_info().try_borrow_mut_lamports()? -= payout;
          **ctx.accounts.winner.to_account_info().try_borrow_mut_lamports()? += payout;
          Ok(())
      }
  }

  #[derive(Accounts)]
  pub struct InitializeCompetition<'info> {
      #[account(
          init,
          payer = creator,
          space = 8 + 32 + 32 + 8 + 8 + 8 + 1 + 32,
          seeds = [b"competition", &ctx.accounts.competition.key().to_bytes()],
          bump
      )]
      pub competition: Account<'info, Competition>,
      #[account(
          init,
          payer = creator,
          space = 8,
          seeds = [b"vault", &ctx.accounts.competition.key().to_bytes()],
          bump
      )]
      pub vault: Account<'info, System>,
      #[account(mut)]
      pub creator: Signer<'info>,
      pub system_program: Program<'info, System>,
  }

  #[derive(Accounts)]
  pub struct SubmitPrediction<'info> {
      #[account(mut)]
      pub competition: Account<'info, Competition>,
      #[account(
          init,
          payer = user,
          space = 8 + 32 + 32 + 8 + 8,
          seeds = [b"prediction", competition.key().as_ref(), user.key().as_ref()],
          bump
      )]
      pub prediction: Account<'info, Prediction>,
      #[account(mut)]
      pub vault: Account<'info, System>,
      #[account(mut)]
      pub user: Signer<'info>,
      pub system_program: Program<'info, System>,
  }

  #[derive(Accounts)]
  pub struct ResolveCompetition<'info> {
      #[account(mut)]
      pub competition: Account<'info, Competition>,
      #[account(mut)]
      pub vault: Account<'info, System>,
      #[account(mut)]
      pub winner: AccountInfo<'info>,
  }

  #[account]
  pub struct Competition {
      pub creator: Pubkey,
      pub token: String,
      pub end_time: i64,
      pub entry_fee: u64,
      pub prize_pool: u64,
      pub state: u8,
      pub winner: Pubkey,
  }

  #[account]
  pub struct Prediction {
      pub competition: Pubkey,
      pub user: Pubkey,
      pub guess: u64,
      pub timestamp: i64,
  }

  #[error_code]
  pub enum ErrorCode {
      #[msg("Competition is closed")]
      CompetitionClosed,
      #[msg("Competition already resolved")]
      AlreadyResolved,
  }
  ```

#### **4.3 Ave.ai Integration**
- **Purpose**: Validates final token prices for competition resolution.
- **Process**: Backend fetches price data post-competition (5-minute buffer to account for potential latency), compares predictions, and calls `resolve_competition` with the winner’s address and payout amount.

---

### **5. User Experience (UX)**
- **Gamification**: Badges (e.g., “Price Prophet” in **SOL Orange**) for top predictors, displayed on user profiles.
- **Real-Time**: WebSocket updates for leaderboard rankings every few seconds.
- **Accessibility**: WCAG 2.1 AA contrast (e.g., white text on **Dark Gray**), alt text for icons, full keyboard navigation.
- **Feedback**: Playful messages (e.g., “Great guess! Can you take #1?”) in **Electric Pink** (#FF00FF).

---

### **6. Technical Notes**
- **Dependencies**: Solana, Anchor, Ave.ai API, Helius.dev, React, Node.js, Web3.js.
- **Considerations**:
  - **Wallet Integration**: Web3.js ensures compatibility with external wallets, requiring users to have pre-installed wallets (e.g., Phantom), which may slightly raise the entry barrier for non-crypto natives.
  - **Latency**: Ave.ai’s centralized data may lag; the 5-minute buffer mitigates this by ensuring finalized prices are used.
  - **SOL Volatility**: Display approximate USD equivalents (via Ave.ai) alongside SOL values (e.g., “0.1 SOL ≈ $15”) to provide context.
  - **Testing**: Use Solana devnet with Anchor’s test framework (e.g., `anchor test`) and Jest for backend API tests. Simulate competition flows (creation, joining, resolution) and edge cases (e.g., insufficient SOL, late submissions).
  - **Security**: Implement Anchor’s account validation (e.g., `#[account(...)]` constraints) to prevent unauthorized access. Plan a post-MVP audit of Rust code by a Solana-focused auditor (e.g., OtterSec) to check for vulnerabilities like reentrancy or lamport overflows.
  - **Rate Limits**: Monitor Ave.ai API usage to stay within free tier limits during MVP; budget for a paid plan if demand increases.
  - **Scalability**: Use PostgreSQL for off-chain data (e.g., competition metadata) and WebSockets for real-time updates, with Redis caching planned for future scaling.

---

### **7. Key Changes from Previous Spec**
- **Smart Contract Development**: Replaced TypeScript (Poseidon) with Rust using Anchor for direct Solana program development, leveraging Anchor’s robust account validation and error handling.
- **Wallet Connection**: Continues to use Solana Web3.js for external wallet integration (e.g., Phantom, Solflare), removing Privy API as per previous update.
- **Transaction Handling**: All SOL transfers (entry fees, prize pools) use Anchor’s CPI (Cross-Program Invocation) for secure lamport transfers, prompted by wallet signatures via Web3.js.
- **Simplified Program**: The `FinfunProgram` is now a native Rust program, optimized for Solana’s runtime with Anchor’s declarative syntax, reducing dependency on Poseidon’s transpilation.

---

### **8. User Flow Example: Joining a Competition**
1. **Browse**: User navigates to the “Browse Competitions” page, sees a card: “SOL Price Prediction | Entry: 0.1 SOL | Prize: 1 SOL.”
2. **Join**: Clicks “Join Now” (**Neon Blue**) → Modal displays “Confirm 0.1 SOL” and balance (e.g., “Balance: 3 SOL”).
3. **Predict**: Enters “150” in the prediction field → Clicks “Submit Guess” (**Neon Blue**).
4. **Transaction**: Web3.js prompts wallet signature for 0.1 SOL transfer.
5. **Smart Contract**: Backend calls `submit_prediction`, which:
   - Verifies competition is active (`state == 0`, `end_time > now`).
   - Creates a `Prediction Account` with the guess.
   - Transfers 0.1 SOL to the `Vault Account` via CPI.
6. **Feedback**: UI shows “You’re in! Good luck!” (**SOL Orange**).
7. **Leaderboard**: User’s rank updates live via WebSocket (e.g., “Rank: #5”).

---

### **9. Assumptions and Constraints**
- **Assumptions**:
  - Ave.ai API provides reliable price data for Solana tokens, with sufficient coverage for popular tokens (e.g., SOL, JUP, RAY).
  - Users have Solana-compatible wallets installed, as external wallet integration requires no embedded wallet support.
  - Anchor’s Rust implementation is stable for Solana program deployment in Q1 2025.
- **Constraints**:
  - Ave.ai’s centralized nature may introduce minor latency; the 5-minute buffer mitigates this but could delay resolution slightly.
  - External wallet reliance may exclude non-crypto users, limiting initial audience to Solana natives.
  - Free-tier API limits (Ave.ai, Helius.dev) may constrain MVP scale; paid plans may be needed post-launch.