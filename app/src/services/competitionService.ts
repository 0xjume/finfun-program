// Import only the types we need for TypeScript typing
import type { Program } from '@coral-xyz/anchor';
import { 
  Connection, 
  PublicKey, 
  SystemProgram
} from '@solana/web3.js';
import { v4 as uuidv4 } from 'uuid';

import { getConnection, getProgram, getVaultPDA, solToLamports, lamportsToSol } from '../utils/solana';
import type { CompetitionUI, Competition, UserPrediction, UserPredictionUI } from '../types/finfun';
import programIdl from '../idl/finfun.json';

// Import the Ave.ai service
import { aveService } from './aveService';

// Use the actual deployed program ID with Vite's environment variable access pattern
const PROGRAM_ID = new PublicKey(import.meta.env.VITE_PROGRAM_ID || 'HJnVtBaQmzcbdeiHj5Y29UvXHiMBaKaTxjggva6ueMnq');

// Helper function to convert on-chain Competition to UI representation
export function convertCompetitionToUI(competition: Competition): CompetitionUI {
  return {
    id: competition.id,
    token: competition.token,
    entryFee: lamportsToSol(competition.entryFee),
    prizePool: lamportsToSol(competition.prizePool),
    participants: competition.participants,
    state: competition.state,
    creator: competition.creator.toString(),
    creatorPublicKey: competition.creator.toString(),
    endTime: new Date(competition.endTime * 1000).toISOString(),
    startTime: new Date(competition.startTime * 1000).toISOString(),
    description: `${competition.token} price prediction competition. Winner takes the prize pool.`,
  };
}

// Helper function to convert on-chain UserPrediction to UI representation
export function convertPredictionToUI(prediction: UserPrediction): UserPredictionUI {
  return {
    user: prediction.user.toString(),
    userPublicKey: prediction.user.toString(),
    prediction: prediction.prediction,
    timestamp: new Date(prediction.timestamp * 1000).toISOString(),
  };
}

export class CompetitionService {
  private connection: Connection;
  private programId: PublicKey;
  
  // Helper method to validate program is available
  private validateProgram(program: Program | null): Program {
    if (!program) {
      throw new Error('Failed to initialize Solana program. Check your connection and wallet.');
    }
    return program;
  }

  constructor() {
    this.connection = getConnection();
    this.programId = PROGRAM_ID;
  }

  /**
   * Create a new competition
   * @param wallet Connected anchor wallet
   * @param token The token symbol (e.g., "SOL", "BTC")
   * @param entryFee Entry fee in SOL
   * @param startTime Start time as Date object 
   * @param endTime End time as Date object
   * @returns The transaction signature and competition ID
   */
  async createCompetition(
    wallet: any,
    token: string,
    entryFee: number,
    startTime: Date, 
    endTime: Date
  ) {
    try {
      if (!wallet.publicKey) {
        throw new Error('Wallet not connected');
      }

      // Convert parameters
      const entryFeeLamports = solToLamports(entryFee);
      const startTimestamp = Math.floor(startTime.getTime() / 1000);
      const endTimestamp = Math.floor(endTime.getTime() / 1000);
      
      // Create a unique ID for the competition
      const competitionId = uuidv4().slice(0, 8);
      
      // Get program instance and validate it's available
      const program = this.validateProgram(await getProgram(wallet, programIdl));
      
      // Calculate vault PDA (Program Derived Address)
      const vaultPDA = await getVaultPDA(competitionId, this.programId);

      // Get competition PDA
      const [competitionPDA] = await PublicKey.findProgramAddress(
        [Buffer.from('competition'), Buffer.from(competitionId)],
        this.programId
      );
      
      // Send transaction
      const txSignature = await program.methods
        .createCompetition(
          competitionId, 
          token, 
          entryFeeLamports,
          endTimestamp,
          startTimestamp
        )
        .accounts({
          competition: competitionPDA,
          creator: wallet.publicKey,
          vault: vaultPDA,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
      
      return { signature: txSignature, competitionId };
    } catch (error: any) {
      console.error('Error creating competition:', error);
      throw new Error(error.message || 'Failed to create competition');
    }
  }

  /**
   * Join a competition with a prediction
   * @param wallet Connected anchor wallet
   * @param competitionId ID of the competition to join
   * @param prediction Price prediction value
   * @returns Transaction signature
   */
  async joinCompetition(
    wallet: any,
    competitionId: string,
    prediction: number
  ) {
    try {
      if (!wallet.publicKey) {
        throw new Error('Wallet not connected');
      }

      // Get program instance and validate it's available
      const program = this.validateProgram(await getProgram(wallet, programIdl));
      
      // Get competition PDA
      const [competitionPDA] = await PublicKey.findProgramAddress(
        [Buffer.from('competition'), Buffer.from(competitionId)],
        this.programId
      );
      
      // Calculate vault PDA
      const vaultPDA = await getVaultPDA(competitionId, this.programId);
      
      // Calculate user prediction PDA
      const [userPredictionPDA] = await PublicKey.findProgramAddress(
        [Buffer.from('prediction'), wallet.publicKey.toBuffer(), Buffer.from(competitionId)],
        this.programId
      );

      // Send transaction
      const txSignature = await program.methods
        .joinCompetition(prediction)
        .accounts({
          competition: competitionPDA,
          user: wallet.publicKey,
          userPrediction: userPredictionPDA,
          vault: vaultPDA,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
      
      return txSignature;
    } catch (error: any) {
      console.error('Error joining competition:', error);
      throw new Error(error.message || 'Failed to join competition');
    }
  }

  /**
   * Resolve a competition and distribute rewards
   * @param wallet Connected anchor wallet (must be competition creator)
   * @param competitionId ID of competition to resolve
   * @param winnerPubkey Public key of the winner
   * @param payoutAmount Amount to pay the winner (in SOL)
   * @returns Transaction signature
   */
  async resolveCompetition(
    wallet: any,
    competitionId: string,
    winnerPubkey: PublicKey,
    payoutAmount: number
  ) {
    try {
      if (!wallet.publicKey) {
        throw new Error('Wallet not connected');
      }

      // Get program instance and validate it's available
      const program = this.validateProgram(await getProgram(wallet, programIdl));
      
      // Get competition PDA
      const [competitionPDA] = await PublicKey.findProgramAddress(
        [Buffer.from('competition'), Buffer.from(competitionId)],
        this.programId
      );
      
      // Calculate vault PDA
      const vaultPDA = await getVaultPDA(competitionId, this.programId);
      
      // Convert payout to lamports
      const payoutLamports = solToLamports(payoutAmount);
      
      // Send transaction
      const txSignature = await program.methods
        .resolveCompetition(winnerPubkey, payoutLamports)
        .accounts({
          competition: competitionPDA,
          vault: vaultPDA,
          creator: wallet.publicKey,
          winner: winnerPubkey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
      
      return txSignature;
    } catch (error: any) {
      console.error('Error resolving competition:', error);
      throw new Error(error.message || 'Failed to resolve competition');
    }
  }

  /**
   * Resolves a competition using Ave.ai price data
   * @param wallet - Connected wallet
   * @param competitionId - ID of the competition to resolve
   */
  async resolveCompetitionUsingAveAi(wallet: any, competitionId: string) {
    try {
      if (!wallet.publicKey) {
        throw new Error('Wallet not connected');
      }

      // Get program instance and validate it's available
      const program = this.validateProgram(await getProgram(wallet, programIdl));
      
      // Get competition PDA
      const [competitionPDA] = await PublicKey.findProgramAddress(
        [Buffer.from('competition'), Buffer.from(competitionId)],
        this.programId
      );
      
      // Get the competition data
      const competitionAccount = await (program.account as any).competition.fetch(competitionPDA);
      const competition = convertCompetitionToUI(competitionAccount as unknown as Competition);
      
      // Calculate vault PDA
      const vaultPDA = await getVaultPDA(competitionId, this.programId);
      
      // Use Ave.ai to get the final token price
      const endTimeUnix = Math.floor(new Date(competition.endTime).getTime() / 1000);
      const finalPrice = await aveService.resolveCompetitionResult(competition.token, endTimeUnix);
      
      if (finalPrice === null) {
        throw new Error('Could not determine final price from Ave.ai');
      }
      
      console.log(`Resolving competition ${competitionId} with final ${competition.token} price: $${finalPrice}`);
      
      // Execute the resolve transaction on-chain
      const txSignature = await program.methods
        .resolveCompetition(finalPrice)
        .accounts({
          competition: competitionPDA,
          vault: vaultPDA,
          creator: wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
        
      return { 
        success: true, 
        signature: txSignature,
        finalPrice: finalPrice
      };
    } catch (error) {
      console.error('Error resolving competition:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Fetch all competitions from the program
   * @param wallet Connected anchor wallet
   * @returns Array of competitions in UI format
   */
  async fetchAllCompetitions(wallet: any) {
    try {
      // Get program instance and validate it's available
      const program = this.validateProgram(await getProgram(wallet, programIdl));
      
      // Fetch all competitions (getAccounts is figurative, depends on the structure)
      // This would typically involve using the getProgramAccounts RPC call
      const accounts = await this.connection.getProgramAccounts(this.programId, {
        filters: [
          {
            memcmp: {
              offset: 0, // Assuming the first field identifies it as a Competition account
              bytes: Buffer.from('competition').toString('base64'),
            },
          },
        ],
      });
      
      // Parse and convert the accounts
      const competitions: CompetitionUI[] = [];
      
      for (const account of accounts) {
        try {
          const competitionData = program.coder.accounts.decode(
            'Competition',
            account.account.data
          );
          
          if (competitionData) {
            competitions.push(convertCompetitionToUI(competitionData));
          }
        } catch (e) {
          console.log('Failed to decode account:', e);
        }
      }
      
      return competitions;
    } catch (error) {
      console.error('Error fetching competitions:', error);
      return [];
    }
  }

  /**
   * Fetch a specific competition by ID
   * @param wallet Connected anchor wallet
   * @param competitionId ID of competition to fetch
   * @returns Competition in UI format or null if not found
   */
  async fetchCompetitionById(wallet: any, competitionId: string) {
    try {
      // Get program instance and validate it's available
      const program = this.validateProgram(await getProgram(wallet, programIdl));
      
      // Get competition PDA
      const [competitionPDA] = await PublicKey.findProgramAddress(
        [Buffer.from('competition'), Buffer.from(competitionId)],
        this.programId
      );
      
      // Fetch the competition account
      // Use type assertion to fix TypeScript error
      const competitionAccount = await (program.account as any).competition.fetch(competitionPDA);
      
      return convertCompetitionToUI(competitionAccount as unknown as Competition);
    } catch (error) {
      console.error('Error fetching competition by ID:', error);
      return null;
    }
  }

  /**
   * Fetch predictions for a specific competition
   * @param wallet Connected anchor wallet
   * @param competitionId ID of competition to fetch predictions for
   * @returns Array of user predictions in UI format
   */
  async fetchPredictionsForCompetition(wallet: any, competitionId: string) {
    try {
      // Get program instance and validate it's available
      const program = this.validateProgram(await getProgram(wallet, programIdl));
      
      // Fetch all user prediction accounts for this competition
      const accounts = await this.connection.getProgramAccounts(this.programId, {
        filters: [
          {
            memcmp: {
              offset: 32, // Assuming competitionId is after user pubkey (which is 32 bytes)
              bytes: Buffer.from(competitionId).toString('base64'),
            },
          },
        ],
      });
      
      // Parse and convert the accounts
      const predictions: UserPredictionUI[] = [];
      
      for (const account of accounts) {
        try {
          const predictionData = program.coder.accounts.decode(
            'UserPrediction',
            account.account.data
          );
          
          if (predictionData) {
            predictions.push(convertPredictionToUI(predictionData as unknown as UserPrediction));
          }
        } catch (e) {
          console.log('Failed to decode account:', e);
        }
      }
      
      return predictions;
    } catch (error) {
      console.error('Error fetching predictions for competition:', error);
      return [];
    }
  }

  /**
   * Check if a user has joined a specific competition
   * @param wallet Connected anchor wallet
   * @param competitionId ID of competition to check
   * @returns Boolean indicating if user has joined, and user prediction if available
   */
  async hasUserJoinedCompetition(wallet: any, competitionId: string) {
    try {
      if (!wallet.publicKey) {
        return { joined: false };
      }

      // Get program instance and validate it's available
      const program = this.validateProgram(await getProgram(wallet, programIdl));
      
      // Calculate user prediction PDA
      const [userPredictionPDA] = await PublicKey.findProgramAddress(
        [Buffer.from('prediction'), wallet.publicKey.toBuffer(), Buffer.from(competitionId)],
        this.programId
      );
      
      try {
        // Try to fetch the user prediction account
        // Use type assertion to fix TypeScript error
        const userPrediction = await (program.account as any).userPrediction.fetch(userPredictionPDA);
        
        // If it exists, the user has joined
        return { joined: true, prediction: convertPredictionToUI(userPrediction as unknown as UserPrediction) };
      } catch (error) {
        // If it doesn't exist, the user hasn't joined
        return { joined: false };
      }
    } catch (error) {
      console.error('Error checking if user has joined competition:', error);
      return { joined: false };
    }
  }

  /**
   * Fetch competitions created by the connected wallet
   * @param wallet Connected anchor wallet
   * @returns Array of competitions created by the user in UI format
   */
  async fetchUserCreatedCompetitions(wallet: any) {
    try {
      if (!wallet.publicKey) {
        return [];
      }

      // Get program instance and validate it's available
      const program = this.validateProgram(await getProgram(wallet, programIdl));
      
      // Fetch competitions created by this user
      const accounts = await this.connection.getProgramAccounts(this.programId, {
        filters: [
          {
            memcmp: {
              offset: 8 + 32, // Assuming ID (string ptr), then creator pubkey
              bytes: wallet.publicKey.toBase58(),
            },
          },
        ],
      });
      
      // Parse and convert the accounts
      const competitions: CompetitionUI[] = [];
      
      for (const account of accounts) {
        try {
          const competitionData = program.coder.accounts.decode(
            'Competition',
            account.account.data
          );
          
          if (competitionData) {
            competitions.push(convertCompetitionToUI(competitionData as unknown as Competition));
          }
        } catch (e) {
          console.log('Failed to decode account:', e);
        }
      }
      
      return competitions;
    } catch (error) {
      console.error('Error fetching user-created competitions:', error);
      return [];
    }
  }

  /**
   * Fetch competitions the user has joined
   * @param wallet Connected anchor wallet
   * @returns Array of competitions the user has joined in UI format
   */
  async fetchUserJoinedCompetitions(wallet: any) {
    try {
      if (!wallet.publicKey) {
        return [];
      }

      // Get program instance and validate it's available
      const program = this.validateProgram(await getProgram(wallet, programIdl));
      
      // Fetch all user predictions for this user
      const accounts = await this.connection.getProgramAccounts(this.programId, {
        filters: [
          {
            memcmp: {
              offset: 0, // Assuming user pubkey is first
              bytes: wallet.publicKey.toBase58(),
            },
          },
        ],
      });
      
      // Get all competitions the user has joined
      const competitions: CompetitionUI[] = [];
      
      // For each user prediction, fetch the associated competition
      for (const account of accounts) {
        try {
          const predictionData = program.coder.accounts.decode(
            'UserPrediction',
            account.account.data
          );
          
          if (predictionData) {
            const competitionId = predictionData.competitionId;
            const competition = await this.fetchCompetitionById(wallet, competitionId);
            
            if (competition) {
              competitions.push({
                ...competition,
                userHasJoined: true,
              });
            }
          }
        } catch (e) {
          console.log('Failed to decode account:', e);
        }
      }
      
      return competitions;
    } catch (error) {
      console.error('Error fetching user-joined competitions:', error);
      return [];
    }
  }
}

// Export a singleton instance
export const competitionService = new CompetitionService();
