# Finfun Devnet Testing Guide

This directory contains scripts for testing the Finfun price prediction competition program on Solana devnet.

## Prerequisites

- Solana CLI tools installed and configured for devnet
- Node.js and Yarn installed
- A wallet with sufficient SOL on devnet (at least 2-3 SOL recommended)

## Setup

Before running the tests, make sure you have the required dependencies:

```bash
cd /Users/0xjume/Downloads/Finfun\ Program/finfun
yarn add ts-node @types/node
```

## Running the Tests

Make sure your Solana CLI is configured to use devnet and the same wallet that deployed the program:

```bash
solana config set --url devnet
```

To run the full testing script:

```bash
cd /Users/0xjume/Downloads/Finfun\ Program/finfun
yarn ts-node scripts/devnet-testing.ts
```

This will run through various test scenarios, including:

1. **Full Lifecycle Test**:
   - Create a competition
   - Multiple users submitting predictions
   - Resolving the competition and distributing funds

2. **Edge Case Tests**:
   - Testing competition creation edge cases
   - Testing prediction submission edge cases
   - Testing competition resolution edge cases

## Understanding Test Output

The script provides detailed logs of each operation, including:
- Transaction signatures
- Account data before and after operations
- Vault balances
- Error messages for failed operations

## Modifying Tests

You can modify the `devnet-testing.ts` file to add more test cases or adjust parameters:
- Change competition parameters in `createCompetition()`
- Adjust SOL amounts in `createAndFundUser()`
- Add more edge cases in the edge case testing functions
