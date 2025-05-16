import { Connection, PublicKey } from '@solana/web3.js';
// Use the recommended import pattern from Anchor docs
import * as anchor from '@coral-xyz/anchor';

// Environment variables (make sure these are defined in your .env file)
export const SOLANA_RPC_URL = import.meta.env.VITE_SOLANA_RPC_URL || 'https://api.devnet.solana.com';
export const PROGRAM_ID = import.meta.env.VITE_PROGRAM_ID || '';

// Competition states
export const CompetitionState = {
  ACTIVE: 0,
  RESOLVED: 1,
  CANCELLED: 2
} as const;

// Connection instance
export const getConnection = () => new Connection(SOLANA_RPC_URL, 'confirmed');

// Get Anchor Provider
export const getProvider = (wallet: any) => {
  const connection = getConnection();
    // Use the anchor namespace
  const provider = new anchor.AnchorProvider(
    connection, 
    wallet,
    { commitment: 'confirmed' }
  );
  return provider;
};

// Get Program using the pattern directly from Anchor examples
export const getProgram = (wallet: any, idl: any) => {
  try {
    // Check program ID
    if (!PROGRAM_ID) {
      console.error('PROGRAM_ID is not set. Please check your environment variables.');
      return null;
    }
    
    // Check wallet connection
    if (!wallet || !wallet.publicKey) {
      console.log('Wallet not connected or publicKey not available');
      return null;
    }
    
    // Step 1: Set up the connection
    const connection = getConnection();
    
    // Step 2: Create the provider (must be AnchorProvider)
    const provider = new anchor.AnchorProvider(
      connection,
      wallet,
      { commitment: 'confirmed' }
    );
    
    // Step 3: Set the provider globally (required by Anchor)
    anchor.setProvider(provider);
    
    // Step 4: Parse the program ID
    const programId = new PublicKey(PROGRAM_ID);
    
    // Step 5: Use the IDL passed in or load from file
    const programIdl = idl || require('../idl/finfun.json');
    
    // Step 6: Initialize the program
    // Use type assertions to handle potential Anchor version differences
    // This is needed because different versions of Anchor have different parameter orders
    // @ts-ignore - Bypass TypeScript type checking for this specific line
    const program = new anchor.Program(programIdl, programId);
    
    console.log('Anchor program initialized successfully');
    // For troubleshooting, log the program ID
    console.log('Program ID:', programId.toString());
    
    return program;
  } catch (error) {
    console.error('Error initializing Anchor program:', error);
    return null;
  }
};

// Format lamports to SOL
export const lamportsToSol = (lamports: number): number => {
  return lamports / 1_000_000_000;
};

// Format SOL to lamports
export const solToLamports = (sol: number): number => {
  return sol * 1_000_000_000;
};

// Calculate PDA for competition vault
export const getVaultPDA = async (competitionId: string, programId: PublicKey) => {
  const [vault] = await PublicKey.findProgramAddress(
    [Buffer.from('vault'), Buffer.from(competitionId)],
    programId
  );
  
  return vault;
};

// Calculate PDA for user's participation in a competition
export const getUserPredictionPDA = async (
  userPubkey: PublicKey,
  competitionId: string,
  programId: PublicKey
) => {
  const [predictionAccount] = await PublicKey.findProgramAddress(
    [Buffer.from('prediction'), userPubkey.toBuffer(), Buffer.from(competitionId)],
    programId
  );
  
  return predictionAccount;
};
