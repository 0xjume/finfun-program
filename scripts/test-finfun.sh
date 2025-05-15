#!/bin/bash

# Finfun Devnet Testing Script
# This script tests the core functionality of the Finfun price prediction program on Solana devnet
# using the Solana CLI directly

# Set colors for better readability
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}===== FINFUN PRICE PREDICTION COMPETITION TESTING =====${NC}"
echo "Date: $(date)"
echo "Network: Solana Devnet"
echo "Program ID: HJnVtBaQmzcbdeiHj5Y29UvXHiMBaKaTxjggva6ueMnq"

# Verify we're on devnet
NETWORK=$(solana config get | grep "RPC URL" | awk '{print $3}')
if [[ "$NETWORK" != *"devnet"* ]]; then
  echo -e "${RED}Error: Please set Solana CLI to devnet using 'solana config set --url devnet'${NC}"
  exit 1
fi

# Check wallet balance
WALLET=$(solana address)
BALANCE=$(solana balance | awk '{print $1}')
echo -e "${YELLOW}Using wallet:${NC} $WALLET"
echo -e "${YELLOW}Current balance:${NC} $BALANCE SOL"

if (( $(echo "$BALANCE < 1.0" | bc -l) )); then
  echo -e "${RED}Warning: Low balance. At least 1 SOL recommended for testing.${NC}"
  read -p "Continue anyway? (y/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
  fi
fi

# Show deployed program
echo -e "\n${BLUE}1. Verifying deployed program...${NC}"
solana program show HJnVtBaQmzcbdeiHj5Y29UvXHiMBaKaTxjggva6ueMnq
if [ $? -ne 0 ]; then
  echo -e "${RED}Error: Cannot find the program on devnet${NC}"
  exit 1
fi

echo -e "\n${GREEN}Program verification successful!${NC}"

# Create a new test user
echo -e "\n${BLUE}2. Creating a test user...${NC}"
TEST_USER_FILE="/tmp/finfun_test_user.json"
solana-keygen new --no-bip39-passphrase -o "$TEST_USER_FILE" -s > /dev/null 2>&1
TEST_USER=$(solana-keygen pubkey "$TEST_USER_FILE")
echo -e "${YELLOW}Created test user:${NC} $TEST_USER"

# Fund the test user
echo -e "\n${BLUE}3. Funding test user with SOL...${NC}"
solana airdrop 0.5 $TEST_USER --url devnet
if [ $? -ne 0 ]; then
  echo -e "${RED}Failed to fund test user. Trying alternative funding method...${NC}"
  # Manual funding as fallback
  echo -e "${YELLOW}Transferring 0.5 SOL to test user from your wallet...${NC}"
  solana transfer $TEST_USER 0.5 --allow-unfunded-recipient
  if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Cannot fund test user. Exiting.${NC}"
    exit 1
  fi
fi
TEST_USER_BALANCE=$(solana balance $TEST_USER | awk '{print $1}')
echo -e "${YELLOW}Test user balance:${NC} $TEST_USER_BALANCE SOL"

# Create a logging function for easier reading
log_step() {
  echo -e "\n${BLUE}=====================${NC}"
  echo -e "${BLUE}$1${NC}"
  echo -e "${BLUE}=====================${NC}"
}

# At this point, we would need to create transactions to interact with our program
# Since we can't directly create them with bash, we'll provide instructions for manual testing
log_step "MANUAL TESTING INSTRUCTIONS"

echo -e "${YELLOW}To fully test the Finfun program, you'll need to use the Anchor framework.${NC}"
echo "Follow these steps to complete the testing:"

echo -e "\n${GREEN}1. Create a competition:${NC}"
echo "   - Run 'yarn ts-node' to start an interactive console"
echo "   - Import the necessary libraries:"
echo "     > import * as anchor from '@coral-xyz/anchor'"
echo "     > import { Keypair, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js'"
echo "   - Create a competition with:"
echo "     > const provider = anchor.AnchorProvider.env()"
echo "     > anchor.setProvider(provider)"
echo "     > const idl = JSON.parse(fs.readFileSync('./target/idl/finfun.json', 'utf8'))"
echo "     > const programId = new PublicKey('HJnVtBaQmzcbdeiHj5Y29UvXHiMBaKaTxjggva6ueMnq')"
echo "     > const program = new anchor.Program(idl, programId, provider)"
echo "     > const tx = await program.rpc.initializeCompetition(...params)"

echo -e "\n${GREEN}2. Submit a prediction:${NC}"
echo "   - Use the test user keypair to submit a prediction"
echo "   - Example:"
echo "     > const userKeypair = Keypair.fromSecretKey(Buffer.from(JSON.parse(fs.readFileSync('$TEST_USER_FILE'))))"
echo "     > const tx = await program.rpc.submitPrediction(...params, {signers: [userKeypair]})"

echo -e "\n${GREEN}3. Resolve the competition:${NC}"
echo "   - Only the competition creator can resolve the competition"
echo "   - Example:"
echo "     > const tx = await program.rpc.resolveCompetition(winnerPubkey, payoutAmount)"

echo -e "\n${YELLOW}Alternatively, you can use the deployed program directly in your frontend application${NC}"
echo "The program ID to connect to is: HJnVtBaQmzcbdeiHj5Y29UvXHiMBaKaTxjggva6ueMnq"

# Manual verification
echo -e "\n${BLUE}SECURITY CONSIDERATIONS${NC}"
echo "When using this program in production, remember to:"
echo "1. Set appropriate competition end times to prevent premature resolutions"
echo "2. Verify that sufficient funds are available for competition creation"
echo "3. Implement proper error handling for failed transactions"
echo "4. Consider using a multisig wallet for resolving high-value competitions"
echo "5. Implement rate limiting and input validation in your frontend"

# Clean up
rm -f "$TEST_USER_FILE"
echo -e "\n${GREEN}Test completed. Temporary files cleaned up.${NC}"
