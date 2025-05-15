import { Connection, PublicKey } from '@solana/web3.js';
import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { useState, useEffect } from 'react';

// Use the actual deployed program ID 
const PROGRAM_ID = new PublicKey('HJnVtBaQmzcbdeiHj5Y29UvXHiMBaKaTxjggva6ueMnq');

/**
 * Custom hook to initialize the Finfun program
 */
export function useProgram() {
  const wallet = useAnchorWallet();
  const [program, setProgram] = useState<Program | null>(null);
  const [connection, setConnection] = useState<Connection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeProgram = async () => {
      setLoading(true);
      setError(null);

      try {
        // Set up Solana connection (using devnet for testing)
        const rpcUrl = import.meta.env.VITE_SOLANA_RPC_URL || 'https://api.devnet.solana.com';
        const conn = new Connection(rpcUrl, 'confirmed');
        setConnection(conn);

        if (wallet) {
          // Configure the client to use the provided wallet
          const provider = new anchor.AnchorProvider(
            conn,
            wallet,
            { commitment: 'confirmed' }
          );

          // Initialize the program
          // In a real app, we would load the IDL from a JSON file
          // const idl = await Program.fetchIdl(PROGRAM_ID, provider);
          
          // For now, we'll use a placeholder
          // setProgram(new Program(idl, PROGRAM_ID, provider));

          // Since we don't have the actual IDL loaded here, we'll just set program to null for mock purposes
          setProgram(null);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error initializing Finfun program:', err);
        setError('Failed to initialize program connection');
        setLoading(false);
      }
    };

    initializeProgram();
  }, [wallet]);

  return {
    program,
    connection,
    loading,
    error,
    programId: PROGRAM_ID,
  };
}

/**
 * Generate a PDA (Program Derived Address) for a competition
 */
export function findCompetitionAddress(competitionId: string, programId: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from('competition'),
      Buffer.from(competitionId),
    ],
    programId
  );
}

/**
 * Generate a PDA for a competition vault
 */
export function findVaultAddress(competitionId: string, programId: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from('vault'),
      Buffer.from(competitionId),
    ],
    programId
  );
}

/**
 * Generate a PDA for a user's prediction
 */
export function findPredictionAddress(
  competitionId: string, 
  userPubkey: PublicKey, 
  programId: PublicKey
) {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from('prediction'),
      Buffer.from(competitionId),
      userPubkey.toBuffer(),
    ],
    programId
  );
}

/**
 * Format account data for a competition
 */
export function formatCompetition(accountData: any) {
  if (!accountData) return null;
  
  return {
    id: accountData.id,
    token: accountData.token,
    entryFee: accountData.entryFee.toNumber() / anchor.web3.LAMPORTS_PER_SOL,
    prizePool: accountData.prizePool.toNumber() / anchor.web3.LAMPORTS_PER_SOL,
    startTime: new Date(accountData.startTime.toNumber() * 1000).toISOString(),
    endTime: new Date(accountData.endTime.toNumber() * 1000).toISOString(),
    participants: accountData.participants.toNumber(),
    creator: accountData.creator.toString(),
    state: accountData.state,
    description: accountData.description || '',
  };
}

/**
 * Format account data for a prediction
 */
export function formatPrediction(accountData: any) {
  if (!accountData) return null;
  
  return {
    user: accountData.user.toString(),
    prediction: accountData.prediction.toNumber(),
    timestamp: new Date(accountData.timestamp.toNumber() * 1000).toISOString(),
  };
}
