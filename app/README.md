# Finfun - Solana Price Prediction Competition Platform

## Overview

Finfun is a decentralized price prediction competition platform built on the Solana blockchain. Users can create and join competitions to predict future prices of various cryptocurrencies and win SOL rewards.

## Features

- **Create Competitions**: Set up price prediction competitions with custom parameters
- **Submit Predictions**: Enter your price predictions and compete with others
- **Win Rewards**: Closest prediction to the actual price wins the prize pool
- **User Dashboard**: Track your active competitions and predictions
- **Wallet Integration**: Seamless connection with Solana wallets (Phantom, Solflare)
- **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

- React with TypeScript
- Vite for fast development and building
- TailwindCSS for styling
- Solana Web3.js for blockchain interactions
- Anchor Framework for Solana program integration
- React Router for navigation

## Project Structure

```
/app
├── public/                # Static assets
├── src/
│   ├── components/        # Reusable UI components
│   ├── contexts/          # React context providers
│   ├── pages/             # Page components
│   ├── utils/             # Utility functions
│   ├── App.tsx            # Main application component
│   ├── config.ts          # Application configuration
│   ├── index.css          # Global styles
│   └── main.tsx           # Application entry point
├── package.json           # Dependencies and scripts
├── postcss.config.js      # PostCSS configuration
├── tailwind.config.js     # TailwindCSS configuration
├── tsconfig.json          # TypeScript configuration
└── vite.config.ts         # Vite configuration
```

## Setup and Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Solana Program Integration

The frontend connects to a Solana program deployed on devnet. The program handles:

- Competition creation and management
- Prize pool escrow through PDAs (Program Derived Addresses)
- Prediction submission and validation
- Competition resolution and prize distribution

## Environment Variables

Create a `.env` file in the app directory with the following variables:

```
REACT_APP_SOLANA_RPC_URL=https://api.devnet.solana.com
REACT_APP_PROGRAM_ID=FiNfUn111111111111111111111111111111111111
