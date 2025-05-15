import { PublicKey } from '@solana/web3.js';

// Define the Competition account structure
export interface Competition {
  id: string;
  creator: PublicKey;
  token: string;
  entryFee: number; // in lamports
  prizePool: number; // in lamports
  endTime: number; // unix timestamp
  startTime: number; // unix timestamp
  participants: number;
  state: number; // 0 = active, 1 = resolved, 2 = cancelled
}

// Define the UserPrediction account structure
export interface UserPrediction {
  user: PublicKey;
  competitionId: string; 
  prediction: number; // price prediction value
  timestamp: number; // when prediction was made
}

// Define the frontend Competition interface (including UI-specific fields)
export interface CompetitionUI extends Omit<Competition, 'creator' | 'entryFee' | 'prizePool' | 'endTime' | 'startTime'> {
  creator: string; // PublicKey as string
  creatorPublicKey: string; // Same as creator but explicitly marked
  entryFee: number; // in SOL
  prizePool: number; // in SOL
  endTime: string; // ISO string
  startTime: string; // ISO string
  userHasJoined?: boolean; // Whether current user has joined
  predictions?: UserPredictionUI[]; // Array of predictions if loaded
  description: string; // Competition description
}

// Define the frontend UserPrediction interface
export interface UserPredictionUI {
  user: string; // PublicKey as string
  userPublicKey: string;
  prediction: number;
  timestamp: string; // ISO string
}
