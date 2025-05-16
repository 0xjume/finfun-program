/**
 * Test script for Finfun Solana program
 * This script shows how to:
 * 1. Connect to your Solana program on devnet
 * 2. Create a competition
 * 3. Fetch all competitions
 * 4. Submit a prediction
 */

const { Connection, Keypair, PublicKey, SystemProgram } = require('@solana/web3.js');
const { Program, AnchorProvider, BN, Wallet } = require('@coral-xyz/anchor');
const fs = require('fs');
const path = require('path');

// Program ID - already deployed on devnet
const PROGRAM_ID = new PublicKey('HJnVtBaQmzcbdeiHj5Y29UvXHiMBaKaTxjggva6ueMnq');

// Constants
const DEVNET_RPC_URL = 'https://api.devnet.solana.com';
const LAMPORTS_PER_SOL = 1000000000; // 10^9
const WALLET_PATH = process.env.WALLET_PATH || path.join(require('os').homedir(), '.config/solana/id.json');

// Load the wallet keypair
function loadWalletKey() {
  try {
    const keypairData = fs.readFileSync(WALLET_PATH, { encoding: 'utf8' });
    const secretKey = Uint8Array.from(JSON.parse(keypairData));
    return Keypair.fromSecretKey(secretKey);
  } catch (error) {
    console.error('Error loading wallet keypair:', error);
    console.log('Make sure your Solana keypair exists at:', WALLET_PATH);
    console.log('Or set the WALLET_PATH environment variable to your keypair location');
    process.exit(1);
  }
}

// Generate a competition ID
function generateCompetitionId() {
  return `comp-${Math.floor(Math.random() * 1000000)}`;
}

// Helper to convert SOL to lamports
function solToLamports(sol) {
  return Math.floor(sol * LAMPORTS_PER_SOL);
}

// Helper to convert lamports to SOL
function lamportsToSol(lamports) {
  return lamports / LAMPORTS_PER_SOL;
}

// Main function
async function main() {
  // Load wallet keypair
  const walletKeypair = loadWalletKey();
  console.log('Using wallet:', walletKeypair.publicKey.toString());

  // Connect to devnet
  const connection = new Connection(DEVNET_RPC_URL, 'confirmed');
  
  // Check wallet balance
  const balance = await connection.getBalance(walletKeypair.publicKey);
  console.log(`Wallet balance: ${lamportsToSol(balance)} SOL`);
  
  if (balance < solToLamports(0.1)) {
    console.warn('Warning: Low wallet balance. You may need to get more devnet SOL from a faucet.');
    console.log('You can use: https://faucet.solana.com/ or solana airdrop 2 --url devnet');
  }

  // Set up the provider
  const wallet = new Wallet(walletKeypair);
  const provider = new AnchorProvider(
    connection,
    wallet,
    { commitment: 'confirmed' }
  );

  // Load the IDL
  // Get the IDL directly from your downloaded account file, which is guaranteed to match the program
  let rawIdl;
  try {
    // First try to load the IDL from the app directory
    rawIdl = require('../app/Account HJnVtBaQmzcbdeiHj5Y29UvXHiMBaKaTxjggva6ueMnq.json');
    console.log('Loaded account IDL file');
  } catch (error) {
    console.error('Error loading account IDL:', error);
    try {
      // Fallback to src/idl directory
      rawIdl = require('../app/src/idl/finfun.json');
      console.log('Loaded local IDL file');
    } catch (fallbackError) {
      console.error('Error loading local IDL:', fallbackError);
      process.exit(1);
    }
  }

  // For the IDL to work with Anchor, we need to convert it to the expected format
  const formattedIdl = {
    version: rawIdl.metadata.version,
    name: rawIdl.metadata.name,
    instructions: rawIdl.instructions.map(instruction => ({
      name: instruction.name,
      accounts: instruction.accounts.map(account => ({
        name: account.name,
        isMut: account.writable, 
        isSigner: account.signer || false
      })),
      args: instruction.args.map(arg => ({
        name: arg.name,
        type: arg.type
      }))
    })),
    accounts: rawIdl.types.map(type => ({
      name: type.name,
      type: {
        kind: type.type.kind,
        fields: type.type.fields.map(field => ({
          name: field.name,
          type: field.type
        }))
      }
    }))
  };

  console.log('Formatted IDL for Anchor compatibility');
  
  // Initialize the program instance
  // @ts-ignore
  const program = new Program(formattedIdl, PROGRAM_ID, provider);
  console.log('Program initialized successfully');

  // =====================================================
  // STEP 1: Create a competition
  // =====================================================

  // Generate a unique competition ID
  const competitionId = generateCompetitionId();
  console.log(`Creating competition with ID: ${competitionId}`);

  // Competition parameters
  const token = 'SOL';
  const entryFee = solToLamports(0.1); // 0.1 SOL in lamports
  
  // Set the start and end times
  const now = Math.floor(Date.now() / 1000);
  const startTime = new BN(now);
  const endTime = new BN(now + 60 * 60 * 24); // 24 hours from now

  try {
    // Find the competition PDA (Program Derived Address)
    const [competitionPda] = await PublicKey.findProgramAddressSync(
      [
        Buffer.from('competition'),
        Buffer.from(competitionId),
      ],
      PROGRAM_ID
    );
    console.log('Competition PDA:', competitionPda.toString());

    // Find the vault PDA
    const [vaultPda] = await PublicKey.findProgramAddressSync(
      [
        Buffer.from('vault'),
        Buffer.from(competitionId),
      ],
      PROGRAM_ID
    );
    console.log('Vault PDA:', vaultPda.toString());

    // Calculate a bump value (usually zero, will be determined by the program)
    const bump = 0;
    
    // Create competition transaction
    console.log('Sending initialize_competition transaction...');
    const createTxId = await program.methods
      .initialize_competition(
        competitionId,
        token,
        endTime,          // Note: endTime comes before entryFee in the IDL
        new BN(entryFee),
        new BN(entryFee * 2), // prizePool (twice the entry fee for example)
        bump
      )
      .accounts({
        competition: competitionPda,
        creator: walletKeypair.publicKey,
        vault: vaultPda,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    console.log('Competition created successfully!');
    console.log('Transaction ID:', createTxId);
    console.log('Solscan link:', `https://solscan.io/tx/${createTxId}?cluster=devnet`);
  } catch (error) {
    console.error('Error creating competition:', error);
  }

  // =====================================================
  // STEP 2: Fetch all competitions
  // =====================================================
  
  try {
    console.log('\nFetching competitions...');
    
    // Get all program accounts of type 'Competition'
    const competitionAccounts = await connection.getProgramAccounts(PROGRAM_ID);
    console.log(`Found ${competitionAccounts.length} program accounts`);

    // Parse each competition account
    const competitions = [];
    for (const account of competitionAccounts) {
      try {
        // Attempt to decode as a Competition account
        // Note: This will fail for non-Competition accounts (e.g. Prediction accounts)
        const decodedData = program.coder.accounts.decode('Competition', account.account.data);
        
        competitions.push({
          publicKey: account.pubkey.toString(),
          data: {
            ...decodedData,
            // Format BNs to strings or numbers for cleaner output
            entryFee: decodedData.entryFee.toString(),
            prizePool: decodedData.prizePool.toString(),
            startTime: new Date(decodedData.startTime.toNumber() * 1000).toISOString(),
            endTime: new Date(decodedData.endTime.toNumber() * 1000).toISOString(),
          }
        });
      } catch (error) {
        // Skip non-Competition accounts
        continue;
      }
    }

    console.log(`Successfully decoded ${competitions.length} competitions`);
    
    // Display the competitions
    if (competitions.length > 0) {
      console.log('\nCompetition list:');
      competitions.forEach((comp, index) => {
        console.log(`\n[${index + 1}] Competition: ${comp.data.id}`);
        console.log(`  Address: ${comp.publicKey}`);
        console.log(`  Token: ${comp.data.token}`);
        console.log(`  Entry Fee: ${lamportsToSol(comp.data.entryFee)} SOL`);
        console.log(`  Prize Pool: ${lamportsToSol(comp.data.prizePool)} SOL`);
        console.log(`  Participants: ${comp.data.participants}`);
        console.log(`  State: ${comp.data.state}`);
        console.log(`  Creator: ${comp.data.creator.toString()}`);
        console.log(`  Start Time: ${comp.data.startTime}`);
        console.log(`  End Time: ${comp.data.endTime}`);
      });

      // Save the first competition ID for the prediction step
      const targetCompetitionId = competitions[0].data.id;
      return targetCompetitionId;
    } else {
      console.log('No competitions found');
      return competitionId; // Use the one we just created
    }
  } catch (error) {
    console.error('Error fetching competitions:', error);
    return competitionId; // Use the one we just created
  }
}

// Function to submit a prediction
async function submitPrediction(competitionId) {
  if (!competitionId) {
    console.error('No competition ID provided for prediction');
    return;
  }

  console.log(`\nSubmitting prediction for competition: ${competitionId}`);

  // Load wallet keypair
  const walletKeypair = loadWalletKey();
  
  // Connect to devnet
  const connection = new Connection(DEVNET_RPC_URL, 'confirmed');
  
  // Set up the provider
  const wallet = new Wallet(walletKeypair);
  const provider = new AnchorProvider(
    connection,
    wallet,
    { commitment: 'confirmed' }
  );

  // Load the IDL
  const idl = require('../app/src/idl/finfun.json');
  
  // Initialize the program instance
  const program = new Program(idl, PROGRAM_ID, provider);

  try {
    // Generate a random prediction value (example: SOL price in USD cents)
    const predictionValue = new BN(Math.floor(Math.random() * 15000) + 10000); // Random between $100-$250
    console.log(`Prediction value: $${predictionValue.toNumber() / 100} USD`);

    // Find the competition PDA
    const [competitionPda] = await PublicKey.findProgramAddressSync(
      [
        Buffer.from('competition'),
        Buffer.from(competitionId),
      ],
      PROGRAM_ID
    );
    console.log('Competition PDA:', competitionPda.toString());

    // Find the vault PDA
    const [vaultPda] = await PublicKey.findProgramAddressSync(
      [
        Buffer.from('vault'),
        Buffer.from(competitionId),
      ],
      PROGRAM_ID
    );
    console.log('Vault PDA:', vaultPda.toString());

    // Find the prediction PDA
    const [predictionPda] = await PublicKey.findProgramAddressSync(
      [
        Buffer.from('prediction'),
        Buffer.from(competitionId),
        walletKeypair.publicKey.toBuffer(),
      ],
      PROGRAM_ID
    );
    console.log('Prediction PDA:', predictionPda.toString());

    // Calculate a bump value (usually zero, will be determined by the program)
    const bump = 0;
    
    // Submit prediction transaction
    console.log('Sending submit prediction transaction...');
    const txId = await program.methods
      .submit_prediction(
        predictionValue,
        bump
      )
      .accounts({
        competition: competitionPda,
        prediction: predictionPda,
        user: walletKeypair.publicKey,
        vault: vaultPda,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    console.log('Prediction submitted successfully!');
    console.log('Transaction ID:', txId);
    console.log('Solscan link:', `https://solscan.io/tx/${txId}?cluster=devnet`);
  } catch (error) {
    console.error('Error submitting prediction:', error);
  }
}

// Execute the main function and then submit a prediction
main()
  .then(competitionId => {
    return submitPrediction(competitionId);
  })
  .then(() => {
    console.log('\nTest script completed successfully!');
    process.exit(0);
  })
  .catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
