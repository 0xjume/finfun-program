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

// Get Program using the pattern from Anchor examples
export const getProgram = (wallet: any, idl: any) => {
  try {
    if (!PROGRAM_ID) {
      console.error('PROGRAM_ID is not set. Please check your environment variables.');
      return null;
    }
    
    // Based on the Anchor TypeScript examples pattern
    const connection = getConnection();
    const provider = new anchor.AnchorProvider(
      connection, 
      wallet,
      { commitment: 'confirmed' }
    );
    
    // Set the provider for Anchor to use globally
    anchor.setProvider(provider);
    
    // Use the actual Anchor documentation pattern for creating a program
    // https://coral-xyz.github.io/anchor/ts/index.html
    try {
      // Create the program ID from our environment variable
      const programId = new PublicKey(PROGRAM_ID);
      
      // Use the provider and programId to create a proper program instance
      // @ts-ignore - Ignoring type issues as we know this is the correct Anchor pattern
      return new anchor.Program(idl, programId, provider);
    } catch (innerError) {
      console.error('Inner error creating program:', innerError);
      return null;
    }
  } catch (error) {
    console.error('Error creating Anchor Program:', error);
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
