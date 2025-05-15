import React from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Link } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';

const MinimalNavbar = () => {
  const { publicKey } = useWallet();
  
  return (
    <nav className="fixed w-full top-0 bg-gray-900 z-10 shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-white">
          Finfun.xyz
        </Link>
        
        <div className="flex items-center space-x-6">
          {publicKey && (
            <>
              <Link to="/dashboard" className="text-white hover:text-blue-400">
                Dashboard
              </Link>
              <Link to="/browse" className="text-white hover:text-blue-400">
                Browse
              </Link>
              <Link to="/create" className="text-white hover:text-blue-400">
                Create
              </Link>
              <Link to="/wallet" className="text-white hover:text-blue-400">
                Wallet
              </Link>
              <Link to="/test-wallet" className="text-white hover:text-blue-400 bg-blue-900 px-2 py-1 rounded text-sm">
                Test Connection
              </Link>
              <Link to="/test-competitions" className="text-white hover:text-blue-400 bg-green-900 px-2 py-1 rounded text-sm">
                Test Competitions
              </Link>
              <Link to="/resolve" className="text-white hover:text-blue-400 bg-green-900 px-2 py-1 rounded text-sm">
                Resolve Competition
              </Link>
            </>
          )}
          <WalletMultiButton />
        </div>
      </div>
    </nav>
  );
};

export default MinimalNavbar;
