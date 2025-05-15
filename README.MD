cat > README.md << 'EOL'
# Finfun - Solana Price Prediction Platform

A decentralized application built on Solana that lets users create and participate in price prediction competitions for various tokens.

## Features

- Create price prediction competitions for any token
- Join existing competitions with predictions
- Automatic resolution using Ave.ai price feed integration
- Wallet connection and transaction capabilities
- Custom token support with validation

## Technologies

- Solana Blockchain & Web3.js
- Anchor Framework
- React with TypeScript
- Ave.ai API for token validation and price feeds
- TailwindCSS for styling

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see `.env.example`)
4. Run the development server: `npm run dev`

## Environment Variables
# Vite environment variables must be prefixed with VITE_
# Using the standard Helius URL format
VITE_SOLANA_RPC_URL=https://devnet.helius-rpc.com/v1/YOUR_API_KEY
VITE_PROGRAM_ID=YOUR_PROGRAM_ID

# Ave.ai API key 
VITE_AVE_API_KEY=YOUR_AVE_API_KEY