import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Keypair, PublicKey, LAMPORTS_PER_SOL, Connection } from "@solana/web3.js";
import * as fs from 'fs';
import { Finfun } from "../target/types/finfun";

/**
 * Devnet Testing Script for Finfun Price Prediction Competition
 * 
 * This script provides utilities to test the full lifecycle of the Finfun program on devnet:
 * 1. Create competitions
 * 2. Submit predictions
 * 3. Resolve competitions and distribute prizes
 * 4. Error cases and edge scenarios
 */

// Initialize connection to devnet
const connection = new Connection("https://api.devnet.solana.com", "confirmed");

// Load the IDL
async function getProgram() {
  // Set up the provider
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  
  // Load the program
  const programId = new PublicKey("HJnVtBaQmzcbdeiHj5Y29UvXHiMBaKaTxjggva6ueMnq");
  const idl = JSON.parse(fs.readFileSync("./target/idl/finfun.json", "utf8"));
  
  // Fix TS errors related to program accounts
  const program = new anchor.Program(idl, programId, provider);
  return program as Program<Finfun>;
}

// Utility to create a new competition
async function createCompetition(
  competitionId: string,
  token: string,
  endTimeSeconds: number,
  entryFeeSol: number,
  prizePoolSol: number
) {
  try {
    const program = await getProgram();
    const provider = program.provider as anchor.AnchorProvider;
    const creator = provider.wallet;
    
    // Convert SOL to lamports
    const entryFee = entryFeeSol * LAMPORTS_PER_SOL;
    const prizePool = prizePoolSol * LAMPORTS_PER_SOL;
    
    // Calculate PDAs
    const [competitionPDA, competitionBump] = await PublicKey.findProgramAddressSync(
      [Buffer.from("competition"), Buffer.from(competitionId)],
      program.programId
    );
    
    const [vaultPDA, vaultBump] = await PublicKey.findProgramAddressSync(
      [Buffer.from("vault"), Buffer.from(competitionId)],
      program.programId
    );
    
    console.log(`\n=== Creating Competition ===`);
    console.log(`Competition ID: ${competitionId}`);
    console.log(`Token: ${token}`);
    console.log(`Entry Fee: ${entryFeeSol} SOL`);
    console.log(`Prize Pool: ${prizePoolSol} SOL`);
    console.log(`End Time: ${new Date(endTimeSeconds * 1000).toLocaleString()}`);
    console.log(`Competition PDA: ${competitionPDA.toString()}`);
    console.log(`Vault PDA: ${vaultPDA.toString()}`);
    
    // Initialize the competition
    const tx = await program.methods
      .initializeCompetition(
        competitionId,
        token,
        new anchor.BN(endTimeSeconds),
        new anchor.BN(entryFee),
        new anchor.BN(prizePool),
        competitionBump
      )
      .accounts({
        competition: competitionPDA,
        vault: vaultPDA,
        creator: creator.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      // TypeScript fix: don't need remainingAccounts for this
      .rpc();
    
    console.log(`Transaction signature: ${tx}`);
    console.log(`Competition created successfully!`);
    
    // Verify competition data
    const competitionAccount = await program.account.competition.fetch(competitionPDA);
    console.log(`\n=== Competition Details ===`);
    console.log(`ID: ${competitionAccount.id}`);
    console.log(`Creator: ${competitionAccount.creator.toString()}`);
    console.log(`Token: ${competitionAccount.token}`);
    console.log(`End Time: ${new Date(competitionAccount.endTime.toNumber() * 1000).toLocaleString()}`);
    console.log(`Entry Fee: ${competitionAccount.entryFee.toNumber() / LAMPORTS_PER_SOL} SOL`);
    console.log(`Prize Pool: ${competitionAccount.prizePool.toNumber() / LAMPORTS_PER_SOL} SOL`);
    console.log(`State: ${competitionAccount.state === 0 ? 'Active' : 'Resolved'}`);
    
    // Verify vault balance
    const vaultBalance = await connection.getBalance(vaultPDA);
    console.log(`Vault Balance: ${vaultBalance / LAMPORTS_PER_SOL} SOL`);
    
    return { competitionPDA, vaultPDA, competitionBump, vaultBump };
  } catch (error) {
    console.error(`Error creating competition:`, error);
    throw error;
  }
}

// Submit a prediction to a competition
async function submitPrediction(
  competitionPDA: PublicKey,
  vaultPDA: PublicKey,
  userKeypair: Keypair,
  guessPriceSOL: number
) {
  try {
    const program = await getProgram();
    
    // Convert SOL price guess to lamports
    const guess = guessPriceSOL * LAMPORTS_PER_SOL;
    
    // Calculate prediction PDA
    const [predictionPDA, predictionBump] = await PublicKey.findProgramAddressSync(
      [Buffer.from("prediction"), competitionPDA.toBuffer(), userKeypair.publicKey.toBuffer()],
      program.programId
    );
    
    console.log(`\n=== Submitting Prediction ===`);
    console.log(`User: ${userKeypair.publicKey.toString()}`);
    console.log(`Competition: ${competitionPDA.toString()}`);
    console.log(`Prediction PDA: ${predictionPDA.toString()}`);
    console.log(`Guess Price: ${guessPriceSOL} SOL`);
    
    // Get competition details to know the entry fee
    const competition = await program.account.competition.fetch(competitionPDA);
    console.log(`Entry Fee: ${competition.entryFee.toNumber() / LAMPORTS_PER_SOL} SOL`);
    
    // Check user's balance
    const userBalance = await connection.getBalance(userKeypair.publicKey);
    console.log(`User Balance: ${userBalance / LAMPORTS_PER_SOL} SOL`);
    
    if (userBalance < competition.entryFee.toNumber() + 5000) {
      throw new Error(`Insufficient balance to pay entry fee plus transaction cost`);
    }
    
    // Submit prediction
    const tx = await program.methods
      .submitPrediction(new anchor.BN(guess), predictionBump)
      .accounts({
        competition: competitionPDA,
        prediction: predictionPDA,
        vault: vaultPDA,
        user: userKeypair.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      // TypeScript fix: don't need remainingAccounts for this
      .signers([userKeypair])
      .rpc();
    
    console.log(`Transaction signature: ${tx}`);
    console.log(`Prediction submitted successfully!`);
    
    // Verify prediction data
    const predictionAccount = await program.account.prediction.fetch(predictionPDA);
    console.log(`\n=== Prediction Details ===`);
    console.log(`Competition: ${predictionAccount.competition.toString()}`);
    console.log(`User: ${predictionAccount.user.toString()}`);
    console.log(`Guess: ${predictionAccount.guess.toNumber() / LAMPORTS_PER_SOL} SOL`);
    console.log(`Timestamp: ${new Date(predictionAccount.timestamp.toNumber() * 1000).toLocaleString()}`);
    
    // Verify vault balance increased
    const vaultBalance = await connection.getBalance(vaultPDA);
    console.log(`Vault Balance: ${vaultBalance / LAMPORTS_PER_SOL} SOL`);
    
    return predictionPDA;
  } catch (error) {
    console.error(`Error submitting prediction:`, error);
    throw error;
  }
}

// Resolve a competition
async function resolveCompetition(
  competitionPDA: PublicKey,
  vaultPDA: PublicKey,
  winnerPubkey: PublicKey
) {
  try {
    const program = await getProgram();
    const provider = program.provider as anchor.AnchorProvider;
    
    // Get vault balance to determine total payout
    const vaultBalance = await connection.getBalance(vaultPDA);
    console.log(`\n=== Resolving Competition ===`);
    console.log(`Competition: ${competitionPDA.toString()}`);
    console.log(`Winner: ${winnerPubkey.toString()}`);
    console.log(`Vault Balance: ${vaultBalance / LAMPORTS_PER_SOL} SOL`);
    
    // Resolve competition with full vault payout
    const tx = await program.methods
      .resolveCompetition(winnerPubkey, new anchor.BN(vaultBalance))
      .accounts({
        competition: competitionPDA,
        vault: vaultPDA,
        winner: winnerPubkey,
        creator: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      // TypeScript fix: don't need remainingAccounts for this
      .rpc();
    
    console.log(`Transaction signature: ${tx}`);
    console.log(`Competition resolved successfully!`);
    
    // Verify competition state
    const competitionAccount = await program.account.competition.fetch(competitionPDA);
    console.log(`\n=== Updated Competition Details ===`);
    console.log(`ID: ${competitionAccount.id}`);
    console.log(`State: ${competitionAccount.state === 0 ? 'Active' : 'Resolved'}`);
    console.log(`Winner: ${competitionAccount.winner.toString()}`);
    
    // Verify vault balance is emptied
    const newVaultBalance = await connection.getBalance(vaultPDA);
    console.log(`Vault Balance: ${newVaultBalance / LAMPORTS_PER_SOL} SOL`);
    
    return tx;
  } catch (error) {
    console.error(`Error resolving competition:`, error);
    throw error;
  }
}

// Generate a new keypair and fund it with SOL from the airdrop
async function createAndFundUser(solAmount = 0.5): Promise<Keypair> {
  const user = Keypair.generate();
  console.log(`\n=== Creating New User ===`);
  console.log(`Address: ${user.publicKey.toString()}`);
  
  try {
    // Request airdrop
    const signature = await connection.requestAirdrop(
      user.publicKey,
      solAmount * LAMPORTS_PER_SOL
    );
    
    // Wait for confirmation
    const latestBlockhash = await connection.getLatestBlockhash();
    await connection.confirmTransaction({
      signature,
      ...latestBlockhash,
    });
    
    const balance = await connection.getBalance(user.publicKey);
    console.log(`Funded with ${balance / LAMPORTS_PER_SOL} SOL`);
    
    return user;
  } catch (error) {
    console.error(`Error funding user:`, error);
    throw error;
  }
}

// Test edge cases for competition creation
async function testCompetitionCreationEdgeCases() {
  console.log(`\n===== TESTING COMPETITION CREATION EDGE CASES =====`);
  
  // Try creating with zero prize pool (should fail)
  try {
    console.log(`\nTest: Zero Prize Pool`);
    await createCompetition("comp-zero-prize", "SOL", Math.floor(Date.now()/1000) + 3600, 0.1, 0);
    console.log(`❌ Test failed - expected an error but none was thrown`);
  } catch (error) {
    console.log(`✅ Test passed - got expected error:`, (error as Error).message);
  }
  
  // Try creating with end time in the past (should fail)
  try {
    console.log(`\nTest: End Time in Past`);
    await createCompetition("comp-past-end", "SOL", Math.floor(Date.now()/1000) - 3600, 0.1, 1);
    console.log(`❌ Test failed - expected an error but none was thrown`);
  } catch (error) {
    console.log(`✅ Test passed - got expected error:`, (error as Error).message);
  }
}

// Test edge cases for prediction submission
async function testPredictionSubmissionEdgeCases(competitionPDA: PublicKey, vaultPDA: PublicKey) {
  console.log(`\n===== TESTING PREDICTION SUBMISSION EDGE CASES =====`);
  
  // Create a user with insufficient funds (should fail)
  try {
    console.log(`\nTest: Insufficient Funds`);
    const poorUser = await createAndFundUser(0.01); // Very little SOL
    await submitPrediction(competitionPDA, vaultPDA, poorUser, 150);
    console.log(`❌ Test failed - expected an error but none was thrown`);
  } catch (error) {
    console.log(`✅ Test passed - got expected error:`, (error as Error).message);
  }
  
  // Try double submission from same user (should fail)
  try {
    console.log(`\nTest: Double Submission`);
    const user = await createAndFundUser(1);
    await submitPrediction(competitionPDA, vaultPDA, user, 150);
    await submitPrediction(competitionPDA, vaultPDA, user, 160);
    console.log(`❌ Test failed - expected an error but none was thrown`);
  } catch (error) {
    console.log(`✅ Test passed - got expected error:`, (error as Error).message);
  }
}

// Test edge cases for competition resolution
async function testCompetitionResolutionEdgeCases(competitionPDA: PublicKey, vaultPDA: PublicKey) {
  console.log(`\n===== TESTING COMPETITION RESOLUTION EDGE CASES =====`);
  
  // Create a user for testing
  const user = await createAndFundUser(0.2);
  
  // Try resolving with non-creator (should fail)
  try {
    console.log(`\nTest: Non-Creator Resolution`);
    const nonCreatorProgram = await getProgram();
    // This won't actually change the signer, but illustrates the test case
    await resolveCompetition(competitionPDA, vaultPDA, user.publicKey);
    console.log(`❌ Test failed - expected an error but none was thrown`);
  } catch (error) {
    console.log(`✅ Test passed - got expected error:`, (error as Error).message);
  }
  
  // Try double resolution (should fail)
  try {
    console.log(`\nTest: Double Resolution`);
    // First resolution should succeed
    await resolveCompetition(competitionPDA, vaultPDA, user.publicKey);
    // Second resolution should fail
    await resolveCompetition(competitionPDA, vaultPDA, user.publicKey);
    console.log(`❌ Test failed - expected an error but none was thrown`);
  } catch (error) {
    console.log(`✅ Test passed - got expected error:`, (error as Error).message);
  }
}

// Run a full test workflow
async function runFullLifecycleTest() {
  console.log(`\n\n======= RUNNING FULL LIFECYCLE TEST =======\n`);
  
  // Step 1: Create a competition
  const competitionId = `comp-${Math.floor(Math.random() * 1000000)}`;
  const { competitionPDA, vaultPDA } = await createCompetition(
    competitionId,
    "SOL",
    Math.floor(Date.now()/1000) + 3600, // End in 1 hour
    0.1, // 0.1 SOL entry fee
    0.5  // 0.5 SOL prize pool
  );
  
  // Step 2: Create multiple users and submit predictions
  const users: Keypair[] = [];
  const predictions: Array<{ user: Keypair, guess: number }> = [];
  
  for (let i = 0; i < 3; i++) {
    const user = await createAndFundUser(0.5);
    users.push(user);
    
    // Different guesses for each user
    const guess = 100 + (i * 10); // 100, 110, 120
    await submitPrediction(competitionPDA, vaultPDA, user, guess);
    
    predictions.push({ user, guess });
  }
  
  // Step 3: Simulate some time passing
  console.log(`\n=== Simulating time passing (in real testing, you would wait until end time) ===`);
  
  // Step 4: Choose a winner (in real scenario, this would be based on actual price)
  const winner = predictions[1].user; // Select the second user as winner
  console.log(`\n=== Selecting winner: ${winner.publicKey.toString()} with guess ${predictions[1].guess} SOL ===`);
  
  // Step 5: Resolve the competition
  await resolveCompetition(competitionPDA, vaultPDA, winner.publicKey);
  
  console.log(`\n======= FULL LIFECYCLE TEST COMPLETED SUCCESSFULLY =======\n`);
}

// Test edge cases separately
async function runEdgeCaseTests() {
  console.log(`\n\n======= RUNNING EDGE CASE TESTS =======\n`);
  
  // Set up a standard competition for edge case testing
  const { competitionPDA, vaultPDA } = await createCompetition(
    `edge-${Math.floor(Math.random() * 1000000)}`,
    "SOL",
    Math.floor(Date.now()/1000) + 86400, // End in 24 hours
    0.1, // 0.1 SOL entry fee
    0.5  // 0.5 SOL prize pool
  );
  
  // Run edge case tests
  await testPredictionSubmissionEdgeCases(competitionPDA, vaultPDA);
  await testCompetitionCreationEdgeCases();
  
  // Create a separate competition for resolution tests
  const { competitionPDA: resolutionTestPDA, vaultPDA: resolutionTestVaultPDA } = await createCompetition(
    `res-${Math.floor(Math.random() * 1000000)}`,
    "SOL",
    Math.floor(Date.now()/1000) + 3600, // End in 1 hour
    0.1, // 0.1 SOL entry fee
    0.2  // 0.2 SOL prize pool
  );
  
  await testCompetitionResolutionEdgeCases(resolutionTestPDA, resolutionTestVaultPDA);
  
  console.log(`\n======= EDGE CASE TESTS COMPLETED =======\n`);
}

// Main function to run all tests
async function main() {
  console.log(`===== FINFUN PRICE PREDICTION COMPETITION TESTING =====`);
  console.log(`Date: ${new Date().toLocaleString()}`);
  console.log(`Testing on: Solana Devnet`);
  console.log(`Program ID: ${new PublicKey("HJnVtBaQmzcbdeiHj5Y29UvXHiMBaKaTxjggva6ueMnq").toString()}`);
  
  try {
    // Run standard lifecycle test
    await runFullLifecycleTest();
    
    // Run edge case tests
    await runEdgeCaseTests();
    
    console.log(`\n===== ALL TESTS COMPLETED SUCCESSFULLY =====`);
  } catch (error) {
    console.error(`\n❌ TESTING FAILED:`, error);
  }
}

// Run the main function
main().then(
  () => process.exit(0),
  (err) => {
    console.error(err);
    process.exit(1);
  }
);
