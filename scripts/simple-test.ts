import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Connection, Keypair, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

// Devnet connection
const connection = new Connection("https://api.devnet.solana.com", "confirmed");
const programId = new PublicKey("HJnVtBaQmzcbdeiHj5Y29UvXHiMBaKaTxjggva6ueMnq");

/**
 * Simple test script for Finfun on devnet
 * This script tests the basic functionality:
 * 1. Create a competition
 * 2. Submit a prediction
 * 3. Resolve the competition
 */
async function main() {
  try {
    console.log("===== Finfun Price Prediction Test =====");
    console.log(`Program ID: ${programId.toString()}`);
    console.log(`Current time: ${new Date().toLocaleString()}`);
    console.log(`Network: Solana Devnet`);
    
    // Load wallet and provider setup
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);
    console.log(`Wallet public key: ${provider.publicKey.toString()}`);
    
    // Get wallet balance
    const balance = await connection.getBalance(provider.publicKey);
    console.log(`Current balance: ${balance / LAMPORTS_PER_SOL} SOL`);
    
    if (balance < LAMPORTS_PER_SOL) {
      console.log("Warning: Low SOL balance, testing may fail");
    }
    
    // Load IDL
    const idlPath = path.join(process.cwd(), "target", "idl", "finfun.json");
    const idlFile = fs.readFileSync(idlPath, 'utf8');
    const idl = JSON.parse(idlFile);
    
    // Initialize program
    const program = new anchor.Program(idl, programId, provider);
    
    // Generate unique ID for this competition
    const competitionId = `test-${Math.floor(Math.random() * 1000000)}`;
    console.log(`\n1. Creating competition with ID: ${competitionId}`);
    
    // Derive PDAs
    const [competitionPDA, competitionBump] = PublicKey.findProgramAddressSync(
      [Buffer.from("competition"), Buffer.from(competitionId)],
      programId
    );
    
    const [vaultPDA, vaultBump] = PublicKey.findProgramAddressSync(
      [Buffer.from("vault"), Buffer.from(competitionId)],
      programId
    );
    
    console.log(`Competition PDA: ${competitionPDA.toString()}`);
    console.log(`Vault PDA: ${vaultPDA.toString()}`);
    
    // Create a competition with 0.1 SOL entry fee and 0.5 SOL prize pool
    const token = "SOL";
    const endTime = Math.floor(Date.now()/1000) + 3600; // 1 hour from now
    const entryFee = 0.1 * LAMPORTS_PER_SOL;
    const prizePool = 0.5 * LAMPORTS_PER_SOL;
    
    // Create the competition
    console.log(`Creating competition with ${token}, entry fee: ${entryFee/LAMPORTS_PER_SOL} SOL, prize: ${prizePool/LAMPORTS_PER_SOL} SOL`);
    
    // Build and send the transaction
    const ix = await program.methods
      .initializeCompetition(
        competitionId,
        token,
        new anchor.BN(endTime),
        new anchor.BN(entryFee),
        new anchor.BN(prizePool),
        competitionBump
      )
      .accounts({
        competition: competitionPDA,
        vault: vaultPDA,
        creator: provider.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .instruction();
    
    const tx = new anchor.web3.Transaction().add(ix);
    const txSig = await provider.sendAndConfirm(tx);
    
    console.log(`Competition created! Signature: ${txSig}`);
    
    // Verify competition was created
    try {
      const competitionAccount = await program.account.competition.fetch(competitionPDA);
      console.log(`\nCompetition details:`);
      console.log(`- ID: ${competitionAccount.id}`);
      console.log(`- Token: ${competitionAccount.token}`);
      console.log(`- Entry Fee: ${competitionAccount.entryFee.toNumber() / LAMPORTS_PER_SOL} SOL`);
      console.log(`- Prize Pool: ${competitionAccount.prizePool.toNumber() / LAMPORTS_PER_SOL} SOL`);
      console.log(`- End Time: ${new Date(competitionAccount.endTime.toNumber() * 1000).toLocaleString()}`);
      console.log(`- State: ${competitionAccount.state === 0 ? 'Active' : 'Resolved'}`);
      
      // Check vault balance
      const vaultBalance = await connection.getBalance(vaultPDA);
      console.log(`- Vault balance: ${vaultBalance / LAMPORTS_PER_SOL} SOL`);
      
      // Create a test user for predictions
      console.log(`\n2. Creating a test user for predictions`);
      const user = Keypair.generate();
      console.log(`User public key: ${user.publicKey.toString()}`);
      
      // Airdrop SOL to the user
      console.log(`Requesting SOL airdrop for user...`);
      const airdropSig = await connection.requestAirdrop(
        user.publicKey,
        0.5 * LAMPORTS_PER_SOL
      );
      
      // Wait for confirmation
      const latestBlockhash = await connection.getLatestBlockhash();
      await connection.confirmTransaction({
        signature: airdropSig,
        ...latestBlockhash,
      });
      
      const userBalance = await connection.getBalance(user.publicKey);
      console.log(`User funded with ${userBalance / LAMPORTS_PER_SOL} SOL`);
      
      // Derive prediction PDA
      const [predictionPDA, predictionBump] = PublicKey.findProgramAddressSync(
        [Buffer.from("prediction"), competitionPDA.toBuffer(), user.publicKey.toBuffer()],
        programId
      );
      
      console.log(`Prediction PDA: ${predictionPDA.toString()}`);
      
      // Submit a prediction (150 SOL guess)
      const guess = 150 * LAMPORTS_PER_SOL;
      console.log(`\nSubmitting prediction of ${guess / LAMPORTS_PER_SOL} SOL`);
      
      // Build prediction instruction
      const predIx = await program.methods
        .submitPrediction(
          new anchor.BN(guess),
          predictionBump
        )
        .accounts({
          competition: competitionPDA,
          prediction: predictionPDA,
          vault: vaultPDA,
          user: user.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .instruction();
      
      // Create transaction and add the prediction instruction
      const predTx = new anchor.web3.Transaction().add(predIx);
      
      // Sign and send the transaction
      const predTxSig = await provider.sendAndConfirm(predTx, [user]);
      console.log(`Prediction submitted! Signature: ${predTxSig}`);
      
      // Verify prediction
      const predictionAccount = await program.account.prediction.fetch(predictionPDA);
      console.log(`\nPrediction details:`);
      console.log(`- Competition: ${predictionAccount.competition.toString()}`);
      console.log(`- User: ${predictionAccount.user.toString()}`);
      console.log(`- Guess: ${predictionAccount.guess.toNumber() / LAMPORTS_PER_SOL} SOL`);
      console.log(`- Timestamp: ${new Date(predictionAccount.timestamp.toNumber() * 1000).toLocaleString()}`);
      
      // Check updated vault balance
      const newVaultBalance = await connection.getBalance(vaultPDA);
      console.log(`- Vault balance: ${newVaultBalance / LAMPORTS_PER_SOL} SOL`);
      
      // Resolve the competition
      console.log(`\n3. Resolving the competition`);
      console.log(`Setting user as winner: ${user.publicKey.toString()}`);
      
      // Get user balance before winning
      const userBalanceBefore = await connection.getBalance(user.publicKey);
      console.log(`User balance before winning: ${userBalanceBefore / LAMPORTS_PER_SOL} SOL`);
      
      // Build resolve instruction - pay out the full vault balance
      const resolveIx = await program.methods
        .resolveCompetition(
          user.publicKey,
          new anchor.BN(newVaultBalance)
        )
        .accounts({
          competition: competitionPDA,
          vault: vaultPDA,
          winner: user.publicKey,
          creator: provider.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .instruction();
      
      // Create and send the transaction
      const resolveTx = new anchor.web3.Transaction().add(resolveIx);
      const resolveTxSig = await provider.sendAndConfirm(resolveTx);
      console.log(`Competition resolved! Signature: ${resolveTxSig}`);
      
      // Verify competition state
      const resolvedComp = await program.account.competition.fetch(competitionPDA);
      console.log(`\nResolved Competition details:`);
      console.log(`- State: ${resolvedComp.state === 0 ? 'Active' : 'Resolved'}`);
      console.log(`- Winner: ${resolvedComp.winner.toString()}`);
      
      // Check user received winnings
      const userBalanceAfter = await connection.getBalance(user.publicKey);
      console.log(`User balance after winning: ${userBalanceAfter / LAMPORTS_PER_SOL} SOL`);
      console.log(`User gained: ${(userBalanceAfter - userBalanceBefore) / LAMPORTS_PER_SOL} SOL`);
      
      // Check vault is empty
      const finalVaultBalance = await connection.getBalance(vaultPDA);
      console.log(`Final vault balance: ${finalVaultBalance / LAMPORTS_PER_SOL} SOL`);
      
      console.log(`\n✅ Test completed successfully!`);
    }
    catch (error) {
      console.error(`Error fetching competition account:`, error);
      throw error;
    }
  }
  catch (error) {
    console.error(`❌ Test failed:`, error);
  }
}

// Run the test
main().then(
  () => process.exit(0),
  (err) => {
    console.error(err);
    process.exit(1);
  }
);
