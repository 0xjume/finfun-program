import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Connection, PublicKey, LAMPORTS_PER_SOL, Transaction } from '@solana/web3.js';
import { Program, BN } from '@coral-xyz/anchor';
import { toast } from 'react-toastify';

import idl from '../idl/finfun.json';
import { solToLamports } from '../utils/solana';

// Program ID for the deployed Finfun program on devnet
const PROGRAM_ID = new PublicKey('HJnVtBaQmzcbdeiHj5Y29UvXHiMBaKaTxjggva6ueMnq');

// Function to create a random competition ID
const generateCompetitionId = () => `comp-${Math.floor(Math.random() * 1000000)}`;

const ProgramInteractionDemo = () => {
  const { publicKey, connected, sendTransaction } = useWallet();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string>('');
  const [competitions, setCompetitions] = useState<any[]>([]);

  // Initialize the connection to devnet
  const connection = new Connection(
    'https://api.devnet.solana.com',
    'confirmed'
  );

  // Function to fetch competitions from the program
  const fetchCompetitions = async () => {
    if (!publicKey) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      setLoading(true);
      setStatus('Fetching competitions from the blockchain...');

      // Define the provider
      const provider = {
        connection,
        publicKey,
        sendTransaction: async (transaction: Transaction, signers: any[]) => {
          try {
            transaction.feePayer = publicKey;
            transaction.recentBlockhash = (
              await connection.getLatestBlockhash()
            ).blockhash;

            // Request the wallet to sign and send the transaction
            const signature = await sendTransaction(transaction, connection, { signers });
            
            // Wait for confirmation
            await connection.confirmTransaction(signature, 'confirmed');
            return signature;
          } catch (error) {
            console.error('Transaction error:', error);
            throw error;
          }
        },
      };

      // Use our local IDL
      // @ts-ignore - IDL typing issue
      const program = new Program(idl, PROGRAM_ID, provider);

      // Query all competition accounts
      // This is a simplified example - in a real app, you would need to
      // properly parse the account data based on your program's structure
      const competitionAccounts = await connection.getProgramAccounts(PROGRAM_ID);
      console.log('Found accounts:', competitionAccounts);

      // Parse the account data (simplified example)
      const parsedCompetitions = competitionAccounts.map((account) => {
        try {
          // This parsing would need to be adjusted based on your actual program structure
          // @ts-ignore
          const decoded = program.coder.accounts.decode('Competition', account.account.data);
          return {
            ...decoded,
            publicKey: account.pubkey.toString(),
          };
        } catch (error) {
          console.log('Failed to decode account:', error);
          return null;
        }
      }).filter(Boolean);

      setCompetitions(parsedCompetitions);
      setStatus('Successfully fetched competitions');
    } catch (error: any) {
      console.error('Error fetching competitions:', error);
      setStatus(`Error: ${error?.message || 'Unknown error'}`);
      toast.error('Failed to fetch competitions');
    } finally {
      setLoading(false);
    }
  };

  // Function to create a new competition
  const createCompetition = async () => {
    if (!publicKey) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      setLoading(true);
      setStatus('Creating a new competition...');

      // Define the provider
      const provider = {
        connection,
        publicKey,
        sendTransaction: async (transaction: Transaction, signers: any[]) => {
          try {
            transaction.feePayer = publicKey;
            transaction.recentBlockhash = (
              await connection.getLatestBlockhash()
            ).blockhash;

            // Request the wallet to sign and send the transaction
            const signature = await sendTransaction(transaction, connection, { signers });
            
            // Wait for confirmation
            await connection.confirmTransaction(signature, 'confirmed');
            return signature;
          } catch (error) {
            console.error('Transaction error:', error);
            throw error;
          }
        },
      };

      // Use our local IDL
      // @ts-ignore - IDL typing issue
      const program = new Program(idl, PROGRAM_ID, provider);

      // Generate a unique competition ID
      const competitionId = generateCompetitionId();

      // Competition parameters
      const token = 'SOL';
      const entryFee = solToLamports(0.1); // 0.1 SOL in lamports
      
      // Set the end time (24 hours from now)
      const now = Math.floor(Date.now() / 1000);
      const endTime = new BN(now + 60 * 60 * 24); // 24 hours from now

      // Find the competition PDA
      const [competitionPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from('competition'),
          Buffer.from(competitionId),
        ],
        PROGRAM_ID
      );

      // Find the vault PDA
      const [vaultPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from('vault'),
          Buffer.from(competitionId),
        ],
        PROGRAM_ID
      );

      // Calculate a bump value (usually zero, will be determined by the program)
      const bump = 0;
      
      // Call the initialize_competition instruction with parameters matching the IDL
      const txId = await program.methods
        .initialize_competition(
          competitionId,
          token,
          endTime,          // endTime comes before entryFee in the IDL
          new BN(entryFee),
          new BN(entryFee),  // prizePool (same as entryFee for simplicity)
          bump
        )
        .accounts({
          competition: competitionPda,
          creator: publicKey,
          vault: vaultPda,
          systemProgram: PublicKey.default,
        })
        .rpc();

      console.log('Competition created with TX:', txId);
      setStatus(`Successfully created competition: ${competitionId}`);
      toast.success('Competition created successfully');

      // Fetch the updated list of competitions
      await fetchCompetitions();
    } catch (error: any) {
      console.error('Error creating competition:', error);
      setStatus(`Error: ${error?.message || 'Unknown error'}`);
      toast.error('Failed to create competition');
    } finally {
      setLoading(false);
    }
  };

  // Function to submit a prediction for a competition
  const submitPrediction = async (competitionId: string) => {
    if (!publicKey) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      setLoading(true);
      setStatus('Submitting prediction...');

      // Define the provider
      const provider = {
        connection,
        publicKey,
        sendTransaction: async (transaction: Transaction, signers: any[]) => {
          try {
            transaction.feePayer = publicKey;
            transaction.recentBlockhash = (
              await connection.getLatestBlockhash()
            ).blockhash;

            // Request the wallet to sign and send the transaction
            const signature = await sendTransaction(transaction, connection, { signers });
            
            // Wait for confirmation
            await connection.confirmTransaction(signature, 'confirmed');
            return signature;
          } catch (error) {
            console.error('Transaction error:', error);
            throw error;
          }
        },
      };

      // Use our local IDL
      // @ts-ignore - IDL typing issue
      const program = new Program(idl, PROGRAM_ID, provider);

      // Generate a random prediction value (example: SOL price in USD cents)
      const predictionValue = new BN(Math.floor(Math.random() * 15000) + 10000); // Random between $100-$250

      // Find the competition PDA
      const [competitionPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from('competition'),
          Buffer.from(competitionId),
        ],
        PROGRAM_ID
      );

      // Find the vault PDA
      const [vaultPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from('vault'),
          Buffer.from(competitionId),
        ],
        PROGRAM_ID
      );

      // Find the prediction PDA
      const [predictionPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from('prediction'),
          Buffer.from(competitionId),
          publicKey.toBuffer(),
        ],
        PROGRAM_ID
      );

      // Calculate a bump value (usually zero, will be determined by the program)
      const bump = 0;
      
      // Call the submit_prediction instruction according to the IDL
      const txId = await program.methods
        .submit_prediction(
          predictionValue,
          bump
        )
        .accounts({
          competition: competitionPda,
          prediction: predictionPda,
          user: publicKey,
          vault: vaultPda,
          systemProgram: PublicKey.default,
        })
        .rpc();

      console.log('Prediction submitted with TX:', txId);
      setStatus(`Successfully submitted prediction: ${predictionValue.toString()}`);
      toast.success('Prediction submitted successfully');
    } catch (error: any) {
      console.error('Error submitting prediction:', error);
      setStatus(`Error: ${error?.message || 'Unknown error'}`);
      toast.error('Failed to submit prediction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-white">Solana Program Interaction Demo</h2>
      
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2 text-white">Wallet Connection</h3>
        <div className="flex items-center gap-4">
          <WalletMultiButton />
          <div>
            {connected ? (
              <span className="text-green-400">✓ Connected: {publicKey?.toString().slice(0, 8)}...{publicKey?.toString().slice(-8)}</span>
            ) : (
              <span className="text-red-400">❌ Not connected</span>
            )}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2 text-white">Program Interactions</h3>
        <div className="flex gap-4 mb-4">
          <button
            onClick={createCompetition}
            disabled={loading || !connected}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Competition
          </button>
          <button
            onClick={fetchCompetitions}
            disabled={loading || !connected}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Fetch Competitions
          </button>
        </div>
      </div>

      {status && (
        <div className="mb-6 p-4 bg-gray-700 rounded">
          <h3 className="text-xl font-semibold mb-2 text-white">Status</h3>
          <p className="text-gray-200">{loading ? 'Loading...' : status}</p>
        </div>
      )}

      {competitions.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2 text-white">Competitions</h3>
          <div className="grid gap-4">
            {competitions.map((competition, index) => (
              <div key={index} className="bg-gray-700 p-4 rounded">
                <div className="flex justify-between mb-2">
                  <span className="text-white font-medium">ID: {competition.id}</span>
                  <span className="text-blue-400">{competition.token}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-300">Entry Fee:</span>
                  <span className="text-white">{competition.entryFee?.toString() / LAMPORTS_PER_SOL} SOL</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-300">Prize Pool:</span>
                  <span className="text-white">{competition.prizePool?.toString() / LAMPORTS_PER_SOL} SOL</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-300">Participants:</span>
                  <span className="text-white">{competition.participants?.toString()}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-300">Status:</span>
                  <span className="text-white">{competition.state}</span>
                </div>
                <div className="mt-3">
                  <button
                    onClick={() => submitPrediction(competition.id)}
                    disabled={loading || !connected}
                    className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Submit Prediction
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgramInteractionDemo;
