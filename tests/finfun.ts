import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Keypair, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Finfun } from "../target/types/finfun";
import { expect } from "chai";

describe("finfun", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.finfun as Program<Finfun>;
  const creator = provider.wallet;
  
  // Test competition parameters
  const competitionId = "comp-" + Math.floor(Math.random() * 1000000).toString(); // Unique ID
  const token = "SOL";
  const now = Math.floor(Date.now() / 1000);
  const endTime = now + 3600; // Competition ends in 1 hour
  const entryFee = 0.05 * LAMPORTS_PER_SOL; // 0.05 SOL entry fee
  const prizePool = 0.5 * LAMPORTS_PER_SOL; // 0.5 SOL prize pool
  
  // Create new user keypair for testing
  const user = Keypair.generate();
  
  // Find PDAs
  let competitionPDA: PublicKey;
  let vaultPDA: PublicKey;
  let competitionBump: number;
  let vaultBump: number;
  
  before(async () => {
    // Airdrop SOL to user for testing
    const airdropSig = await provider.connection.requestAirdrop(
      user.publicKey,
      1 * LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(airdropSig);
    
    // Derive PDAs
    const [compPDA, compBump] = await PublicKey.findProgramAddressSync(
      [Buffer.from("competition"), Buffer.from(competitionId)],
      program.programId
    );
    competitionPDA = compPDA;
    competitionBump = compBump;
    
    const [vPDA, vBump] = await PublicKey.findProgramAddressSync(
      [Buffer.from("vault"), Buffer.from(competitionId)],
      program.programId
    );
    vaultPDA = vPDA;
    vaultBump = vBump;
  });
  
  it("Initializes a competition", async () => {
    const tx = await program.methods
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
        creator: creator.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();
    
    console.log("Initialize competition transaction signature", tx);
    
    // Verify competition data
    const competitionAccount = await program.account.competition.fetch(competitionPDA);
    expect(competitionAccount.id).to.equal(competitionId);
    expect(competitionAccount.token).to.equal(token);
    expect(competitionAccount.endTime.toNumber()).to.equal(endTime);
    expect(competitionAccount.entryFee.toNumber()).to.equal(entryFee);
    expect(competitionAccount.prizePool.toNumber()).to.equal(prizePool);
    expect(competitionAccount.state).to.equal(0); // Active
    
    // Check vault balance
    const vaultBalance = await provider.connection.getBalance(vaultPDA);
    expect(vaultBalance).to.be.at.least(prizePool);
  });
  
  it("Submits a prediction", async () => {
    // Find prediction PDA
    const [predictionPDA, predictionBump] = await PublicKey.findProgramAddressSync(
      [Buffer.from("prediction"), competitionPDA.toBuffer(), user.publicKey.toBuffer()],
      program.programId
    );
    
    // User's prediction
    const guess = 150 * 1e9; // 150 SOL price prediction (in lamports)
    
    // Submit prediction from user wallet
    const tx = await program.methods
      .submitPrediction(new anchor.BN(guess), predictionBump)
      .accounts({
        competition: competitionPDA,
        prediction: predictionPDA,
        vault: vaultPDA,
        user: user.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([user])
      .rpc();
    
    console.log("Submit prediction transaction signature", tx);
    
    // Verify prediction data
    const predictionAccount = await program.account.prediction.fetch(predictionPDA);
    expect(predictionAccount.competition.toString()).to.equal(competitionPDA.toString());
    expect(predictionAccount.user.toString()).to.equal(user.publicKey.toString());
    expect(predictionAccount.guess.toNumber()).to.equal(guess);
    
    // Check vault balance increased by entry fee
    const vaultBalance = await provider.connection.getBalance(vaultPDA);
    expect(vaultBalance).to.be.at.least(prizePool + entryFee);
  });
  
  it("Resolves the competition", async () => {
    // Get initial winner balance to verify prize distribution
    const initialWinnerBalance = await provider.connection.getBalance(user.publicKey);
    
    const payout = prizePool + entryFee; // Total prize
    
    // Resolve competition (only creator can call this)
    const tx = await program.methods
      .resolveCompetition(user.publicKey, new anchor.BN(payout))
      .accounts({
        competition: competitionPDA,
        vault: vaultPDA,
        winner: user.publicKey,
        creator: creator.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();
    
    console.log("Resolve competition transaction signature", tx);
    
    // Verify competition state
    const competitionAccount = await program.account.competition.fetch(competitionPDA);
    expect(competitionAccount.state).to.equal(1); // Resolved
    expect(competitionAccount.winner.toString()).to.equal(user.publicKey.toString());
    
    // Verify winner received payment
    const finalWinnerBalance = await provider.connection.getBalance(user.publicKey);
    expect(finalWinnerBalance).to.be.greaterThan(initialWinnerBalance);
    
    // Check vault balance is reduced
    const vaultBalance = await provider.connection.getBalance(vaultPDA);
    expect(vaultBalance).to.be.closeTo(0, 10); // May not be exactly 0 due to rent exemption
  });
});
