// Application configuration

export const APP_CONFIG = {
  // App info
  name: "Finfun",
  description: "Create and join price prediction competitions on Solana",
  url: "https://finfun.xyz",

  // Solana configuration
  solana: {
    network: "devnet", // "devnet" or "mainnet-beta"
    rpcUrl: "https://api.devnet.solana.com",
    programId: "FiNfUn111111111111111111111111111111111111", // Placeholder program ID
  },

  // Competition settings
  competition: {
    minEntryFee: 0.01, // SOL
    maxEntryFee: 10, // SOL
    minDuration: 1, // hours
    maxDuration: 168, // hours (7 days)
    platformFee: 0.1 // 10% platform fee
  },

  // Social media links
  social: {
    twitter: "https://twitter.com/finfunxyz",
    discord: "https://discord.gg/finfun",
    github: "https://github.com/finfun",
  },

  // Contact information
  contact: {
    email: "info@finfun.xyz",
  }
};

// Utility functions
export const formatSolAmount = (amount: number): string => {
  return amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4
  }) + " SOL";
};

export const formatAddress = (address: string, length: number = 4): string => {
  if (!address) return '';
  return `${address.slice(0, length)}...${address.slice(-length)}`;
};

export const formatTimeRemaining = (endTimeIso: string): string => {
  const endTime = new Date(endTimeIso);
  const now = new Date();
  const diffMs = endTime.getTime() - now.getTime();
  
  if (diffMs <= 0) return 'Ended';
  
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${hours}h ${minutes}m`;
};

export const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};
