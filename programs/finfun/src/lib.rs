use anchor_lang::prelude::*;
use anchor_lang::solana_program::clock::Clock;
use anchor_lang::solana_program::program::invoke_signed;
use anchor_lang::solana_program::system_instruction;

declare_id!("HJnVtBaQmzcbdeiHj5Y29UvXHiMBaKaTxjggva6ueMnq");

#[program]
pub mod finfun {
    use super::*;
    
    // Helper validation functions
    mod validations {
        use super::*;
        
        // Validation function for competition parameters
        pub fn validate_competition_params(
            competition_id: &str,
            token: &str,
            end_time: i64,
            entry_fee: u64,
            prize_pool: u64,
        ) -> Result<()> {
        // 1. Check that competition_id is not empty
        if competition_id.is_empty() {
            return err!(ErrorCode::EmptyCompetitionId);
        }
        
        // 2. Check that competition_id is not too long (max 50 chars)
        if competition_id.len() > 50 {
            return err!(ErrorCode::CompetitionIdTooLong);
        }
        
        // 3. Check that competition_id contains only valid characters
        if !competition_id.chars().all(|c| c.is_alphanumeric() || c == '_' || c == '-') {
            return err!(ErrorCode::InvalidCompetitionIdFormat);
        }
        
        // 4. Check that token name is not empty
        if token.is_empty() {
            return err!(ErrorCode::EmptyTokenName);
        }
        
        // 5. Check that token name is not too long (max 20 chars)
        if token.len() > 20 {
            return err!(ErrorCode::TokenNameTooLong);
        }
        
        // 6. Check that token name contains only valid characters
        if !token.chars().all(|c| c.is_alphanumeric() || c == ' ') {
            return err!(ErrorCode::InvalidTokenNameFormat);
        }
        
        // 7. Ensure end_time is in the future
        let current_time = Clock::get()?.unix_timestamp;
        if end_time <= current_time {
            return err!(ErrorCode::EndTimeInPast);
        }
        
        // 8. Ensure end_time is not too far in the future (max 30 days)
        const MAX_DAYS: i64 = 30;
        const SECONDS_PER_DAY: i64 = 86400;
        let max_allowed_time = current_time + (MAX_DAYS * SECONDS_PER_DAY);
        if end_time > max_allowed_time {
            return err!(ErrorCode::EndTimeTooFar);
        }
        
        // 9. Ensure prize_pool is greater than zero
        if prize_pool == 0 {
            return err!(ErrorCode::InvalidPrizePool);
        }
        
        // 10. Ensure prize_pool is not too high
        const MAX_PRIZE_POOL: u64 = 1_000 * 1_000_000_000; // 1000 SOL in lamports
        if prize_pool > MAX_PRIZE_POOL {
            return err!(ErrorCode::PrizePoolTooHigh);
        }
        
        // 11. Ensure entry_fee is reasonable (not greater than prize pool)
        if entry_fee > prize_pool {
            return err!(ErrorCode::InvalidEntryFee);
        }
        
        // 12. Ensure entry_fee is not too high
        const MAX_ENTRY_FEE: u64 = 10 * 1_000_000_000; // 10 SOL in lamports
        if entry_fee > MAX_ENTRY_FEE {
            return err!(ErrorCode::EntryFeeTooHigh);
        }
        
        Ok(())
    }
    
        // Validation function for prediction guess
        pub fn validate_prediction_guess(guess: u64) -> Result<()> {
            // Check if guess is within reasonable range for SOL price (in lamports)
            // For SOL, we'll say the price should be between 1 SOL and 10,000 SOL
            // 1 SOL = 1_000_000_000 lamports
            const MIN_GUESS: u64 = 1_000_000_000;        // 1 SOL in lamports
            const MAX_GUESS: u64 = 10_000_000_000_000;   // 10,000 SOL in lamports
            
            if guess < MIN_GUESS {
                return err!(ErrorCode::PredictionTooLow);
            }
            
            if guess > MAX_GUESS {
                return err!(ErrorCode::PredictionTooHigh);
            }
            
            Ok(())
        }
    
        // Validation function for resolve competition parameters
        pub fn validate_resolve_params(winner: Pubkey, payout: u64, vault_balance: u64) -> Result<()> {
            // 1. Validate that winner is not the default public key (empty)
            if winner == Pubkey::default() {
                return err!(ErrorCode::InvalidWinner);
            }
            
            // 2. Validate that payout is greater than zero
            if payout == 0 {
                return err!(ErrorCode::InvalidPayout);
            }
            
            // 3. Validate that payout is not greater than vault balance
            if payout > vault_balance {
                return err!(ErrorCode::InsufficientFunds);
            }
            
            // 4. Validate that payout is not too high (reasonable limit)
            const MAX_PAYOUT: u64 = 1_000 * 1_000_000_000; // 1000 SOL in lamports
            if payout > MAX_PAYOUT {
                return err!(ErrorCode::PayoutTooHigh);
            }
            
            Ok(())
        }
    } // End of validations module

    pub fn initialize_competition(
        ctx: Context<InitializeCompetition>,
        competition_id: String, // Added unique ID for the competition
        token: String,
        end_time: i64,
        entry_fee: u64,
        prize_pool: u64,
        bump: u8, // Added bump for safety
    ) -> Result<()> {
        // Validate competition parameters
        validations::validate_competition_params(&competition_id, &token, end_time, entry_fee, prize_pool)?;
        
        let competition = &mut ctx.accounts.competition;
        competition.id = competition_id.clone();
        competition.creator = ctx.accounts.creator.key();
        competition.token = token;
        competition.end_time = end_time;
        competition.entry_fee = entry_fee;
        competition.prize_pool = prize_pool;
        competition.state = 0; // Active
        competition.winner = Pubkey::default();
        competition.bump = bump;

        // Transfer SOL to the program's account (vault is just a PDA that we use to track funds)
        let transfer_instruction = system_instruction::transfer(
            &ctx.accounts.creator.key(),
            &ctx.accounts.vault.key(),
            prize_pool,
        );

        // Execute the transfer instruction
        anchor_lang::solana_program::program::invoke(
            &transfer_instruction,
            &[
                ctx.accounts.creator.to_account_info(),
                ctx.accounts.vault.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
        )?;

        msg!("Competition initialized with ID: {}", competition_id);
        Ok(())
    }

    pub fn submit_prediction(ctx: Context<SubmitPrediction>, guess: u64, bump: u8) -> Result<()> {
        let competition = &ctx.accounts.competition;
        let clock = Clock::get()?;

        // Check if competition is still active
        if competition.state != 0 {
            return err!(ErrorCode::CompetitionClosed);
        }

        // Check if competition hasn't ended yet
        if clock.unix_timestamp > competition.end_time {
            return err!(ErrorCode::CompetitionClosed);
        }
        
        // Validate guess value (ensure it's reasonable)
        validations::validate_prediction_guess(guess)?;

        // Initialize prediction account
        let prediction = &mut ctx.accounts.prediction;
        prediction.competition = competition.key();
        prediction.user = ctx.accounts.user.key();
        prediction.guess = guess;
        prediction.timestamp = clock.unix_timestamp;
        prediction.bump = bump;

        // Transfer SOL entry fee to vault
        let transfer_instruction = system_instruction::transfer(
            &ctx.accounts.user.key(),
            &ctx.accounts.vault.key(),
            competition.entry_fee,
        );

        // Execute the transfer instruction
        anchor_lang::solana_program::program::invoke(
            &transfer_instruction,
            &[
                ctx.accounts.user.to_account_info(),
                ctx.accounts.vault.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
        )?;

        msg!("Prediction submitted with guess: {}", guess);
        Ok(())
    }

    pub fn resolve_competition(
        ctx: Context<ResolveCompetition>,
        winner: Pubkey,
        payout: u64,
    ) -> Result<()> {
        let competition = &mut ctx.accounts.competition;

        // Check if competition is still active
        if competition.state != 0 {
            return err!(ErrorCode::AlreadyResolved);
        }
        
        // Validate resolve parameters
        validations::validate_resolve_params(winner, payout, ctx.accounts.vault.lamports())?;

        // Update competition state
        competition.winner = winner;
        competition.state = 1; // Resolved

        // Get the current balance of the vault
        let vault_balance = ctx.accounts.vault.lamports();
        msg!("Vault balance: {}, payout: {}", vault_balance, payout);

        // Ensure the vault has enough SOL for the payout
        if vault_balance < payout {
            return err!(ErrorCode::InsufficientFunds);
        }

        // Transfer SOL from vault to winner using CPIs
        let bump = ctx.bumps.vault;
        let competition_id = competition.id.as_bytes();
        let seeds = &[b"vault", competition_id, &[bump]];
        let signer = &[&seeds[..]]; // PDA signer
        
        // Create a system program transfer instruction
        let transfer_instruction = system_instruction::transfer(
            ctx.accounts.vault.key, 
            ctx.accounts.winner.key, 
            payout
        );
        
        // Invoke the instruction with PDA signing
        invoke_signed(
            &transfer_instruction,
            &[
                ctx.accounts.vault.to_account_info(),
                ctx.accounts.winner.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
            signer,
        )?;

        msg!("Competition resolved, winner: {}, payout: {}", winner, payout);
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(competition_id: String, token: String, end_time: i64, entry_fee: u64, prize_pool: u64, bump: u8)]
pub struct InitializeCompetition<'info> {
    #[account(
        init,
        payer = creator,
        space = 8 + 32 + 36 + 32 + 8 + 8 + 8 + 1 + 32 + 1, // Added space for id (36) and bump (1)
        seeds = [b"competition", competition_id.as_bytes()],
        bump,
    )]
    pub competition: Account<'info, Competition>,
    
    /// CHECK: This account is a PDA owned by the program that will be used as a vault
    #[account(
        mut,
        seeds = [b"vault", competition_id.as_bytes()],
        bump,
    )]
    pub vault: SystemAccount<'info>,
    
    #[account(mut)]
    pub creator: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(guess: u64, bump: u8)]
pub struct SubmitPrediction<'info> {
    #[account(mut)]
    pub competition: Account<'info, Competition>,
    
    #[account(
        init,
        payer = user,
        space = 8 + 32 + 32 + 8 + 8 + 1, // Added bump (1)
        seeds = [b"prediction", competition.key().as_ref(), user.key().as_ref()],
        bump,
    )]
    pub prediction: Account<'info, Prediction>,
    
    /// CHECK: This account is a PDA owned by the program that will receive entry fees
    #[account(
        mut,
        seeds = [b"vault", competition.id.as_bytes()],
        bump,
    )]
    pub vault: SystemAccount<'info>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ResolveCompetition<'info> {
    #[account(mut)]
    pub competition: Account<'info, Competition>,
    
    #[account(
        mut,
        seeds = [b"vault", competition.id.as_bytes()],
        bump,
    )]
    pub vault: SystemAccount<'info>,
    
    #[account(
        mut,
        constraint = competition.creator == creator.key() @ ErrorCode::UnauthorizedAccess,
    )]
    pub creator: Signer<'info>,
    
    /// CHECK: We're just transferring SOL to this account
    #[account(mut)]
    pub winner: AccountInfo<'info>,
    
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Competition {
    pub id: String,        // Unique ID for the competition (36 bytes for UUID)
    pub creator: Pubkey,   // Creator of the competition
    pub token: String,     // Token being predicted
    pub end_time: i64,     // When the competition ends
    pub entry_fee: u64,    // Entry fee in lamports
    pub prize_pool: u64,   // Prize pool in lamports
    pub state: u8,         // 0 = active, 1 = resolved
    pub winner: Pubkey,    // Winner address
    pub bump: u8,          // Bump seed for PDA derivation
}

#[account]
pub struct Prediction {
    pub competition: Pubkey, // Competition this prediction is for
    pub user: Pubkey,       // User who made the prediction
    pub guess: u64,         // Price prediction in lamports
    pub timestamp: i64,     // When the prediction was made
    pub bump: u8,           // Bump seed for PDA derivation
}

#[error_code]
pub enum ErrorCode {
    // Competition state errors
    #[msg("Competition is closed")]
    CompetitionClosed,
    
    #[msg("Competition already resolved")]
    AlreadyResolved,
    
    #[msg("Competition has not ended yet")]
    CompetitionNotEnded,
    
    // Funds-related errors
    #[msg("Insufficient funds for payout")]
    InsufficientFunds,
    
    #[msg("Prize pool must be greater than zero")]
    InvalidPrizePool,
    
    #[msg("Prize pool is too high (max 1000 SOL)")]
    PrizePoolTooHigh,
    
    #[msg("Entry fee must be reasonable (between 0 and prize pool value)")]
    InvalidEntryFee,
    
    #[msg("Entry fee is too high (max 10 SOL)")]
    EntryFeeTooHigh,
    
    // Permission errors
    #[msg("Only the competition creator can resolve the competition")]
    UnauthorizedAccess,
    
    // Time-related errors
    #[msg("End time must be in the future")]
    EndTimeInPast,
    
    #[msg("End time is too far in the future (max 30 days)")]
    EndTimeTooFar,
    
    // Input validation errors - Competition
    #[msg("Competition ID is empty")]
    EmptyCompetitionId,
    
    #[msg("Competition ID too long (max 50 characters)")]
    CompetitionIdTooLong,
    
    #[msg("Competition ID contains invalid characters")]
    InvalidCompetitionIdFormat,
    
    #[msg("Token name is empty")]
    EmptyTokenName,
    
    #[msg("Token name too long (max 20 characters)")]
    TokenNameTooLong,
    
    #[msg("Token name contains invalid characters")]
    InvalidTokenNameFormat,
    
    // Input validation errors - Prediction
    #[msg("Prediction guess is too low (min 1 SOL)")]
    PredictionTooLow,
    
    #[msg("Prediction guess is too high (max 10,000 SOL)")]
    PredictionTooHigh,
    
    #[msg("Prediction guess is outside reasonable price range")]
    UnreasonableGuess,
    
    // Resolution errors
    #[msg("Winner cannot be the default public key")]
    InvalidWinner,
    
    #[msg("Payout amount must be greater than zero")]
    InvalidPayout,
    
    #[msg("Payout amount exceeds maximum allowed")]
    PayoutTooHigh,
    
    // Generic errors
    #[msg("Invalid parameters provided")]
    InvalidParameters,
    
    #[msg("Operation failed")]
    OperationFailed,
}
