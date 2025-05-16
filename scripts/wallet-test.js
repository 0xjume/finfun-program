/**
 * Test script for Finfun Solana program using the configured wallet
 * This script uses your Solana CLI configured wallet
 */

const fs = require('fs');
const path = require('path');
const { 
  Connection, 
  Keypair, 
  PublicKey, 
  SystemProgram
} = require('@solana/web3.js');
const { 
  AnchorProvider, 
  Program, 
  BN, 
  Wallet 
} = require('@coral-xyz/anchor');

// Program ID for the deployed Finfun program on devnet
const PROGRAM_ID = new PublicKey('HJnVtBaQmzcbdeiHj5Y29UvXHiMBaKaTxjggva6ueMnq');

// Constants
const DEVNET_RPC_URL = 'https://api.devnet.solana.com';
const LAMPORTS_PER_SOL = 1000000000; // 10^9

// Use the exact wallet path from your Solana config
const WALLET_PATH = '/Users/0xjume/Downloads/Turbin3/airdrop/Turbin3-wallet.json';

// Load wallet keypair
function loadWalletKey() {
  try {
    console.log(`Loading wallet from: ${WALLET_PATH}`);
    const keypairData = fs.readFileSync(WALLET_PATH, { encoding: 'utf8' });
    const secretKey = Uint8Array.from(JSON.parse(keypairData));
    return Keypair.fromSecretKey(secretKey);
  } catch (error) {
    console.error('Error loading wallet keypair:', error);
    console.log('Make sure your Solana keypair exists at:', WALLET_PATH);
    process.exit(1);
  }
}

// Generate a unique competition ID
function generateCompetitionId() {
  return `comp-${Math.floor(Math.random() * 1000000)}`;
}

// Main function
async function main() {
  // Load your configured wallet
  const walletKeypair = loadWalletKey();
  console.log('Using wallet:', walletKeypair.publicKey.toString());
  
  // Connect to devnet
  const connection = new Connection(DEVNET_RPC_URL, 'confirmed');
  
  // Check wallet balance
  const balance = await connection.getBalance(walletKeypair.publicKey);
  console.log(`Wallet balance: ${balance / LAMPORTS_PER_SOL} SOL`);
  
  // Request airdrop if balance is low
  if (balance < 0.5 * LAMPORTS_PER_SOL) {
    console.log('Balance is low, requesting airdrop...');
    try {
      const signature = await connection.requestAirdrop(
        walletKeypair.publicKey,
        2 * LAMPORTS_PER_SOL
      );
      await connection.confirmTransaction(signature, 'confirmed');
      
      const newBalance = await connection.getBalance(walletKeypair.publicKey);
      console.log(`Updated wallet balance: ${newBalance / LAMPORTS_PER_SOL} SOL`);
    } catch (error) {
      console.error('Airdrop failed, but continuing with test:', error.message);
    }
  }
  
  // Generate a new competition ID
  const competitionId = generateCompetitionId();
  console.log(`Creating a new competition with ID: ${competitionId}`);
  
  try {
    // Find the PDAs for competition and vault
    const [competitionPda] = PublicKey.findProgramAddressSync(
      [Buffer.from('competition'), Buffer.from(competitionId)],
      PROGRAM_ID
    );
    console.log('Competition PDA:', competitionPda.toString());
    
    const [vaultPda] = PublicKey.findProgramAddressSync(
      [Buffer.from('vault'), Buffer.from(competitionId)],
      PROGRAM_ID
    );
    console.log('Vault PDA:', vaultPda.toString());
    
    // Set up the wallet and provider
    const wallet = new Wallet(walletKeypair);
    const provider = new AnchorProvider(
      connection,
      wallet,
      { commitment: 'confirmed' }
    );
    
    // Create a minimal IDL structure
    const minimalIdl = {
      version: "0.1.0",
      name: "finfun",
      instructions: [
        {
          name: "initialize_competition",
          accounts: [
            { name: "competition", isMut: true, isSigner: false },
            { name: "vault", isMut: true, isSigner: false },
            { name: "creator", isMut: true, isSigner: true },
            { name: "system_program", isMut: false, isSigner: false }
          ],
          args: [
            { name: "competition_id", type: "string" },
            { name: "token", type: "string" },
            { name: "end_time", type: "i64" },
            { name: "entry_fee", type: "u64" },
            { name: "prize_pool", type: "u64" },
            { name: "bump", type: "u8" }
          ]
        }
      ]
    };
    
    // Initialize the program
    const program = new Program(minimalIdl, PROGRAM_ID, provider);
    
    // Competition parameters
    const token = 'SOL';
    const entryFee = new BN(0.1 * LAMPORTS_PER_SOL); // 0.1 SOL
    const prizePool = new BN(0.2 * LAMPORTS_PER_SOL); // 0.2 SOL
    const endTime = new BN(Math.floor(Date.now() / 1000) + 86400); // 24 hours from now
    const bump = 0; // Program will calculate the correct bump
    
    console.log('Sending transaction to create competition...');
    
    // Create the competition
    const tx = await program.methods
      .initialize_competition(
        competitionId,
        token,
        endTime,
        entryFee,
        prizePool,
        bump
      )
      .accounts({
        competition: competitionPda,
        vault: vaultPda,
        creator: walletKeypair.publicKey,
        systemProgram: SystemProgram.programId
      })
      .signers([walletKeypair])
      .rpc({ commitment: 'confirmed' });
    
    console.log(`Transaction successful! Signature: ${tx}`);
    console.log(`View on Solscan: https://solscan.io/tx/${tx}?cluster=devnet`);
    
    // Check if the competition account exists
    const competitionAccount = await connection.getAccountInfo(competitionPda);
    if (competitionAccount && competitionAccount.data.length > 0) {
      console.log('Competition created successfully!');
    } else {
      console.log('Competition account not found - something went wrong.');
    }
    
  } catch (error) {
    console.error('Error creating competition:', error);
    
    // If we have transaction logs, display them
    if (error.logs) {
      console.log('\nTransaction logs:');
      error.logs.forEach((log, i) => console.log(`${i}: ${log}`));
    }
  }
}

// Run the test
main()
  .then(() => {
    console.log('Test completed!');
    process.exit(0);
  })
  .catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
