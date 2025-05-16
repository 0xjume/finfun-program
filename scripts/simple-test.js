/**
 * Simplified test script for the Finfun Solana program
 * This script uses a more direct approach to interact with your program
 */

const fs = require('fs');
const path = require('path');
const { 
  Connection, 
  Keypair, 
  PublicKey, 
  TransactionMessage, 
  VersionedTransaction,
  SystemProgram,
  sendAndConfirmTransaction
} = require('@solana/web3.js');
const { Wallet, AnchorProvider, Program, BN, utils } = require('@coral-xyz/anchor');

// Program ID - your deployed program on devnet
const PROGRAM_ID = new PublicKey('HJnVtBaQmzcbdeiHj5Y29UvXHiMBaKaTxjggva6ueMnq');

// Constants
const DEVNET_RPC_URL = 'https://api.devnet.solana.com';
const LAMPORTS_PER_SOL = 1000000000; // 10^9
const WALLET_PATH = process.env.WALLET_PATH || path.join(require('os').homedir(), '.config/solana/id.json');

// Load wallet keypair
function loadWalletKey() {
  try {
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
  // Load wallet and setup connection
  const walletKeypair = loadWalletKey();
  console.log('Using wallet:', walletKeypair.publicKey.toString());
  
  const connection = new Connection(DEVNET_RPC_URL, 'confirmed');
  
  // Check balance
  const balance = await connection.getBalance(walletKeypair.publicKey);
  console.log(`Wallet balance: ${balance / LAMPORTS_PER_SOL} SOL`);
  
  if (balance < 0.1 * LAMPORTS_PER_SOL) {
    console.log('Requesting airdrop...');
    try {
      const signature = await connection.requestAirdrop(
        walletKeypair.publicKey,
        2 * LAMPORTS_PER_SOL
      );
      await connection.confirmTransaction(signature, 'confirmed');
      console.log('Airdrop successful!');
      
      // Check updated balance
      const newBalance = await connection.getBalance(walletKeypair.publicKey);
      console.log(`Updated wallet balance: ${newBalance / LAMPORTS_PER_SOL} SOL`);
    } catch (error) {
      console.error('Airdrop error:', error);
    }
  }
  
  // Create a competition
  const competitionId = generateCompetitionId();
  console.log(`Creating a new competition with ID: ${competitionId}`);
  
  // Find PDAs
  const competitionSeed = Buffer.from('competition');
  const competitionIdBuffer = Buffer.from(competitionId);
  const vaultSeed = Buffer.from('vault');
  
  const [competitionPda] = PublicKey.findProgramAddressSync(
    [competitionSeed, competitionIdBuffer],
    PROGRAM_ID
  );
  console.log('Competition PDA:', competitionPda.toString());
  
  const [vaultPda] = PublicKey.findProgramAddressSync(
    [vaultSeed, competitionIdBuffer],
    PROGRAM_ID
  );
  console.log('Vault PDA:', vaultPda.toString());
  
  // Create basic provider
  const wallet = new Wallet(walletKeypair);
  const provider = new AnchorProvider(
    connection,
    wallet,
    { commitment: 'confirmed' }
  );
  
  // Set up basic IDL (only the parts we need)
  const idl = {
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
  
  // Create program
  const program = new Program(idl, PROGRAM_ID, provider);
  
  try {
    // Competition parameters
    const token = 'SOL';
    const entryFee = new BN(0.1 * LAMPORTS_PER_SOL); // 0.1 SOL in lamports
    const prizePool = new BN(0.2 * LAMPORTS_PER_SOL); // 0.2 SOL prize pool
    const now = Math.floor(Date.now() / 1000);
    const endTime = new BN(now + 60 * 60 * 24); // 24 hours from now
    const bump = 0; // The program will calculate the correct bump
    
    console.log('Submitting transaction to create competition...');
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
      .rpc();
    
    console.log('Transaction submitted successfully!');
    console.log('Transaction signature:', tx);
    console.log('Solscan link:', `https://solscan.io/tx/${tx}?cluster=devnet`);
    
    // Wait for confirmation
    await connection.confirmTransaction(tx, 'confirmed');
    console.log('Transaction confirmed!');
    
    // Check if the competition account was created
    const competitionAccount = await connection.getAccountInfo(competitionPda);
    if (competitionAccount) {
      console.log('Competition account created successfully!');
      console.log('Account data size:', competitionAccount.data.length, 'bytes');
    } else {
      console.log('Competition account not found - transaction may have failed.');
    }
    
  } catch (error) {
    console.error('Error creating competition:', error);
    
    // Better error diagnostics
    if (error.logs) {
      console.log('\nTransaction logs:');
      error.logs.forEach((log, i) => console.log(`${i}: ${log}`));
    }
  }
}

// Run the main function
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
