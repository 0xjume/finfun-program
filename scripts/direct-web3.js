/**
 * Direct Web3.js test script for Finfun program
 * This script bypasses Anchor to interact directly with your Solana program
 */

const fs = require('fs');
const { 
  Connection, 
  Keypair, 
  PublicKey, 
  Transaction,
  TransactionInstruction,
  SystemProgram,
  sendAndConfirmTransaction
} = require('@solana/web3.js');
const BN = require('bn.js');
const borsh = require('borsh');

// Program ID for your deployed Finfun program
const PROGRAM_ID = new PublicKey('HJnVtBaQmzcbdeiHj5Y29UvXHiMBaKaTxjggva6ueMnq');

// Constants
const DEVNET_RPC_URL = 'https://api.devnet.solana.com';
const LAMPORTS_PER_SOL = 1000000000; // 10^9

// Use the exact wallet path from your Solana config
const WALLET_PATH = '/Users/0xjume/Downloads/Turbin3/airdrop/Turbin3-wallet.json';

// Instruction discriminators (from your IDL)
const INIT_COMPETITION_DISCRIMINATOR = [51, 234, 53, 254, 166, 217, 144, 224];
const SUBMIT_PREDICTION_DISCRIMINATOR = [193, 113, 41, 36, 160, 60, 247, 55];
const RESOLVE_COMPETITION_DISCRIMINATOR = [94, 73, 9, 180, 97, 109, 55, 239];

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

// Generate a random prediction amount in SOL (between 1 and 5000)
function generateRandomPrediction() {
  // Generate a random number between 1 and 5000
  return 1 + Math.floor(Math.random() * 5000);
}

// Serialize instruction data for initializing a competition
function serializeInitCompetitionInstructionData(competitionId, token, endTime, entryFee, prizePool, bump) {
  // Format:
  // discriminator[8] + competitionId + token + endTime(i64) + entryFee(u64) + prizePool(u64) + bump(u8)
  
  // Create a buffer to hold all data
  const competitionIdBuffer = Buffer.from(competitionId);
  const tokenBuffer = Buffer.from(token);
  
  // Calculate the size needed for the entire buffer
  const size = 
    8 + // discriminator
    4 + competitionIdBuffer.length + // string length prefix + competitionId
    4 + tokenBuffer.length + // string length prefix + token
    8 + // endTime (i64)
    8 + // entryFee (u64)
    8 + // prizePool (u64)
    1;  // bump (u8)
  
  const buffer = Buffer.alloc(size);
  let offset = 0;
  
  // Write discriminator
  Buffer.from(INIT_COMPETITION_DISCRIMINATOR).copy(buffer, offset);
  offset += 8;
  
  // Write competition ID (string)
  buffer.writeUInt32LE(competitionIdBuffer.length, offset);
  offset += 4;
  competitionIdBuffer.copy(buffer, offset);
  offset += competitionIdBuffer.length;
  
  // Write token (string)
  buffer.writeUInt32LE(tokenBuffer.length, offset);
  offset += 4;
  tokenBuffer.copy(buffer, offset);
  offset += tokenBuffer.length;
  
  // Write endTime (i64)
  const endTimeBuffer = Buffer.alloc(8);
  endTimeBuffer.writeBigInt64LE(BigInt(endTime.toString()), 0);
  endTimeBuffer.copy(buffer, offset);
  offset += 8;
  
  // Write entryFee (u64)
  const entryFeeBuffer = Buffer.alloc(8);
  entryFeeBuffer.writeBigUInt64LE(BigInt(entryFee.toString()), 0);
  entryFeeBuffer.copy(buffer, offset);
  offset += 8;
  
  // Write prizePool (u64)
  const prizePoolBuffer = Buffer.alloc(8);
  prizePoolBuffer.writeBigUInt64LE(BigInt(prizePool.toString()), 0);
  prizePoolBuffer.copy(buffer, offset);
  offset += 8;
  
  // Write bump (u8)
  buffer.writeUInt8(bump, offset);
  
  return buffer;
}

// Serialize instruction data for submitting a prediction
function serializeSubmitPredictionInstructionData(guess, bump) {
  // Format:
  // discriminator[8] + guess(u64) + bump(u8)
  
  // Calculate buffer size
  const size = 8 + 8 + 1; // discriminator + guess + bump
  
  const buffer = Buffer.alloc(size);
  let offset = 0;
  
  // Write discriminator
  Buffer.from(SUBMIT_PREDICTION_DISCRIMINATOR).copy(buffer, offset);
  offset += 8;
  
  // Write guess (u64)
  const guessBuffer = Buffer.alloc(8);
  guessBuffer.writeBigUInt64LE(BigInt(guess.toString()), 0);
  guessBuffer.copy(buffer, offset);
  offset += 8;
  
  // Write bump (u8)
  buffer.writeUInt8(bump, offset);
  
  return buffer;
}

// Serialize instruction data for resolving a competition
function serializeResolveCompetitionInstructionData(winner, payout) {
  // Format:
  // discriminator[8] + winner(pubkey, 32 bytes) + payout(u64)
  
  // Calculate buffer size
  const size = 8 + 32 + 8; // discriminator + winner pubkey + payout
  
  const buffer = Buffer.alloc(size);
  let offset = 0;
  
  // Write discriminator
  Buffer.from(RESOLVE_COMPETITION_DISCRIMINATOR).copy(buffer, offset);
  offset += 8;
  
  // Write winner pubkey (32 bytes)
  winner.toBuffer().copy(buffer, offset);
  offset += 32;
  
  // Write payout amount (u64)
  const payoutBuffer = Buffer.alloc(8);
  payoutBuffer.writeBigUInt64LE(BigInt(payout.toString()), 0);
  payoutBuffer.copy(buffer, offset);
  
  return buffer;
}

// Main function with options to create competition or submit prediction
async function main() {
  // Load your configured wallet
  const walletKeypair = loadWalletKey();
  console.log('Using wallet:', walletKeypair.publicKey.toString());
  
  // Connect to devnet
  const connection = new Connection(DEVNET_RPC_URL, 'confirmed');
  
  // Check wallet balance
  const balance = await connection.getBalance(walletKeypair.publicKey);
  console.log(`Wallet balance: ${balance / LAMPORTS_PER_SOL} SOL`);
  
  // Get command line arguments
  const args = process.argv.slice(2);
  const action = args[0] || 'create'; // default to create
  let competitionId = args[1]; // optional competition ID for submit prediction
  let winnerAddress = args[2]; // optional winner address for resolve
  
  if (action === 'create') {
    await createCompetition(connection, walletKeypair);
  } else if (action === 'submit') {
    if (!competitionId) {
      // If no competition ID provided, use the last one we created
      competitionId = 'comp-236103'; // The one we successfully created earlier
      console.log(`No competition ID provided, using the previous one: ${competitionId}`);
    }
    await submitPrediction(connection, walletKeypair, competitionId);
  } else if (action === 'resolve') {
    if (!competitionId) {
      competitionId = 'comp-236103'; // The one we successfully created earlier
      console.log(`No competition ID provided, using the previous one: ${competitionId}`);
    }
    
    // If no winner address specified, use our own wallet as winner
    const winner = winnerAddress ? new PublicKey(winnerAddress) : walletKeypair.publicKey;
    await resolveCompetition(connection, walletKeypair, competitionId, winner);
  } else {
    console.log('Unknown action. Use "create", "submit" or "resolve".');
  }
}

// Function to create a competition
async function createCompetition(connection, walletKeypair) {
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
    
    // Competition parameters
    const token = 'SOL';
    const entryFee = new BN(0.1 * LAMPORTS_PER_SOL); // 0.1 SOL
    const prizePool = new BN(0.2 * LAMPORTS_PER_SOL); // 0.2 SOL
    const endTime = new BN(Math.floor(Date.now() / 1000) + 86400); // 24 hours from now
    const bump = 0; // Program will calculate the correct bump
    
    // Create instruction data
    const instructionData = serializeInitCompetitionInstructionData(
      competitionId,
      token,
      endTime,
      entryFee,
      prizePool,
      bump
    );
    
    // Create instruction
    const instruction = new TransactionInstruction({
      keys: [
        { pubkey: competitionPda, isSigner: false, isWritable: true },
        { pubkey: vaultPda, isSigner: false, isWritable: true },
        { pubkey: walletKeypair.publicKey, isSigner: true, isWritable: true },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }
      ],
      programId: PROGRAM_ID,
      data: instructionData
    });
    
    // Create transaction
    const transaction = new Transaction().add(instruction);
    
    console.log('Sending transaction to create competition...');
    
    // Send and confirm transaction
    const signature = await sendAndConfirmTransaction(
      connection,
      transaction,
      [walletKeypair],
      { commitment: 'confirmed' }
    );
    
    console.log(`Transaction successful! Signature: ${signature}`);
    console.log(`View on Solscan: https://solscan.io/tx/${signature}?cluster=devnet`);
    
    // Check if the competition account exists
    const competitionAccount = await connection.getAccountInfo(competitionPda);
    if (competitionAccount && competitionAccount.data.length > 0) {
      console.log('Competition created successfully!');
      console.log('Account size:', competitionAccount.data.length);
      console.log('\nCompetition ID (save this to submit predictions):', competitionId);
    } else {
      console.log('Competition account not found - something went wrong.');
    }
    
    return competitionId;
    
  } catch (error) {
    console.error('Error creating competition:', error);
    
    // Try to get more detailed error info
    if (error.logs) {
      console.log('\nTransaction logs:');
      error.logs.forEach((log, i) => console.log(`${i}: ${log}`));
    }
    return null;
  }
}

// Function to submit a prediction to an existing competition
async function submitPrediction(connection, walletKeypair, competitionId) {
  console.log(`Submitting prediction to competition ID: ${competitionId}`);
  
  try {
    // First, find the competition PDA
    const [competitionPda] = PublicKey.findProgramAddressSync(
      [Buffer.from('competition'), Buffer.from(competitionId)],
      PROGRAM_ID
    );
    console.log('Competition PDA:', competitionPda.toString());
    
    // Check if the competition exists
    const competitionAccount = await connection.getAccountInfo(competitionPda);
    if (!competitionAccount) {
      console.error('Competition not found!');
      return false;
    }
    console.log('Found competition account!');
    
    // Find the vault PDA
    const [vaultPda] = PublicKey.findProgramAddressSync(
      [Buffer.from('vault'), Buffer.from(competitionId)],
      PROGRAM_ID
    );
    console.log('Vault PDA:', vaultPda.toString());
    
    // Find the prediction PDA
    const [predictionPda] = PublicKey.findProgramAddressSync(
      [Buffer.from('prediction'), competitionPda.toBuffer(), walletKeypair.publicKey.toBuffer()],
      PROGRAM_ID
    );
    console.log('Prediction PDA:', predictionPda.toString());
    
    // Generate a random prediction in SOL (convert to lamports)
    const guessInSol = generateRandomPrediction();
    const guess = new BN(guessInSol * LAMPORTS_PER_SOL);
    const bump = 0; // Program will calculate the correct bump
    
    console.log(`Submitting prediction of ${guessInSol} SOL`);
    
    // Create instruction data
    const instructionData = serializeSubmitPredictionInstructionData(guess, bump);
    
    // Create instruction
    const instruction = new TransactionInstruction({
      keys: [
        { pubkey: competitionPda, isSigner: false, isWritable: true },
        { pubkey: predictionPda, isSigner: false, isWritable: true },
        { pubkey: vaultPda, isSigner: false, isWritable: true },
        { pubkey: walletKeypair.publicKey, isSigner: true, isWritable: true },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }
      ],
      programId: PROGRAM_ID,
      data: instructionData
    });
    
    // Create transaction
    const transaction = new Transaction().add(instruction);
    
    console.log('Sending transaction to submit prediction...');
    
    // Send and confirm transaction
    const signature = await sendAndConfirmTransaction(
      connection,
      transaction,
      [walletKeypair],
      { commitment: 'confirmed' }
    );
    
    console.log(`Transaction successful! Signature: ${signature}`);
    console.log(`View on Solscan: https://solscan.io/tx/${signature}?cluster=devnet`);
    
    // Check if the prediction account exists
    const predictionAccount = await connection.getAccountInfo(predictionPda);
    if (predictionAccount && predictionAccount.data.length > 0) {
      console.log('Prediction submitted successfully!');
      console.log('Prediction account size:', predictionAccount.data.length);
      return true;
    } else {
      console.log('Prediction account not found - something went wrong.');
      return false;
    }
    
  } catch (error) {
    console.error('Error submitting prediction:', error);
    
    // Try to get more detailed error info
    if (error.logs) {
      console.log('\nTransaction logs:');
      error.logs.forEach((log, i) => console.log(`${i}: ${log}`));
    }
    return false;
  }
}

// Function to resolve a competition with a winner
async function resolveCompetition(connection, walletKeypair, competitionId, winnerPubkey) {
  console.log(`Resolving competition with ID: ${competitionId}`);
  console.log(`Winner: ${winnerPubkey.toString()}`);
  
  try {
    // First, find the competition PDA
    const [competitionPda] = PublicKey.findProgramAddressSync(
      [Buffer.from('competition'), Buffer.from(competitionId)],
      PROGRAM_ID
    );
    console.log('Competition PDA:', competitionPda.toString());
    
    // Check if the competition exists
    const competitionAccount = await connection.getAccountInfo(competitionPda);
    if (!competitionAccount) {
      console.error('Competition not found!');
      return false;
    }
    console.log('Found competition account!');
    
    // Find the vault PDA
    const [vaultPda] = PublicKey.findProgramAddressSync(
      [Buffer.from('vault'), Buffer.from(competitionId)],
      PROGRAM_ID
    );
    console.log('Vault PDA:', vaultPda.toString());
    
    // Set payout amount (70% of prize pool)
    // For now we're using a fixed amount of 0.14 SOL (70% of 0.2 SOL prize pool)
    const payout = new BN(0.14 * LAMPORTS_PER_SOL);
    console.log(`Payout amount: ${payout.toNumber() / LAMPORTS_PER_SOL} SOL`);
    
    // Create instruction data
    const instructionData = serializeResolveCompetitionInstructionData(winnerPubkey, payout);
    
    // Create instruction
    const instruction = new TransactionInstruction({
      keys: [
        { pubkey: competitionPda, isSigner: false, isWritable: true },
        { pubkey: vaultPda, isSigner: false, isWritable: true },
        { pubkey: walletKeypair.publicKey, isSigner: true, isWritable: true },
        { pubkey: winnerPubkey, isSigner: false, isWritable: true },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }
      ],
      programId: PROGRAM_ID,
      data: instructionData
    });
    
    // Create transaction
    const transaction = new Transaction().add(instruction);
    
    console.log('Sending transaction to resolve competition...');
    
    // Send and confirm transaction
    const signature = await sendAndConfirmTransaction(
      connection,
      transaction,
      [walletKeypair],
      { commitment: 'confirmed' }
    );
    
    console.log(`Transaction successful! Signature: ${signature}`);
    console.log(`View on Solscan: https://solscan.io/tx/${signature}?cluster=devnet`);
    
    // Check if the competition state was updated
    const updatedCompetitionAccount = await connection.getAccountInfo(competitionPda);
    if (updatedCompetitionAccount) {
      console.log('Competition resolved successfully!');
      return true;
    } else {
      console.log('Competition account not found - something went wrong.');
      return false;
    }
    
  } catch (error) {
    console.error('Error resolving competition:', error);
    
    // Try to get more detailed error info
    if (error.logs) {
      console.log('\nTransaction logs:');
      error.logs.forEach((log, i) => console.log(`${i}: ${log}`));
    }
    return false;
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
