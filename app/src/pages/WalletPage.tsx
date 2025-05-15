import React, {  useState, useEffect  } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

// Mock transaction data
const mockTransactions = [
  {
    id: 'tx-123456',
    type: 'Competition Entry',
    amount: -0.1,
    timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    status: 'confirmed',
    competition: 'comp-123456',
  },
  {
    id: 'tx-234567',
    type: 'Competition Winnings',
    amount: 1.2,
    timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    status: 'confirmed',
    competition: 'comp-789012',
  },
  {
    id: 'tx-345678',
    type: 'Competition Entry',
    amount: -0.05,
    timestamp: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    status: 'confirmed',
    competition: 'comp-345678',
  },
];

const WalletPage = () => {
  const navigate = useNavigate();
  const { publicKey, connected, wallet, signTransaction } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const [transactions, setTransactions] = useState(mockTransactions);
  const [isLoading, setIsLoading] = useState(true);
  const [copying, setCopying] = useState(false);

  // Redirect to landing page if not connected
  useEffect(() => {
    if (!publicKey) {
      navigate('/');
    } else {
      // In a real app, we would fetch the actual balance from the blockchain
      // For now, we'll simulate a balance
      setTimeout(() => {
        setBalance(3.75); // Mock balance in SOL
        setIsLoading(false);
      }, 1000);

      // In a real app, we would also fetch the transaction history here
    }
  }, [publicKey, navigate]);

  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Copy address to clipboard
  const copyAddressToClipboard = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey.toString());
      setCopying(true);
      setTimeout(() => setCopying(false), 2000);
    }
  };

  // Get wallet info
  const getWalletName = () => {
    return wallet?.adapter.name || 'Unknown Wallet';
  };

  return (
    <div className="pt-24 pb-12">
      <div className="container mx-auto px-4">
        <h1 className="font-space text-3xl md:text-4xl font-bold mb-2">
          Wallet <span className="gradient-text">Dashboard</span>
        </h1>
        <p className="text-gray-400 mb-8">
          Manage your wallet and view transaction history
        </p>

        {!connected ? (
          <div className="bg-dark-gray border border-gray-800 rounded-xl p-8 text-center">
            <p className="text-gray-400 mb-4">Connect your wallet to view your dashboard</p>
            <WalletMultiButton className="!bg-neon-blue hover:!bg-neon-blue/90 !rounded-lg" />
          </div>
        ) : (
          <>
            {/* Wallet Info Card */}
            <div className="bg-dark-gray border border-gray-800 rounded-xl p-6 mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="mb-4 md:mb-0">
                  <h2 className="font-space text-2xl font-bold mb-1">
                    {getWalletName()}
                  </h2>
                  <div className="flex items-center">
                    <p className="text-gray-400 text-sm mr-2">
                      {publicKey?.toString().slice(0, 8)}...{publicKey?.toString().slice(-8)}
                    </p>
                    <button
                      onClick={copyAddressToClipboard}
                      className="text-neon-blue hover:text-neon-blue/80 transition-colors"
                      title="Copy address"
                    >
                      {copying ? (
                        <span className="text-xs text-green-400">Copied!</span>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                <div className="bg-gray-800/50 py-4 px-6 rounded-lg">
                  <p className="text-gray-400 text-sm mb-1">Balance</p>
                  {isLoading ? (
                    <div className="animate-pulse h-6 w-24 bg-gray-700 rounded"></div>
                  ) : (
                    <p className="font-bold text-2xl text-sol-orange">{balance} SOL</p>
                  )}
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-4">
                <button
                  onClick={() => window.open('https://solfaucet.com', '_blank')}
                  className="bg-neon-blue/10 hover:bg-neon-blue/20 text-neon-blue border border-neon-blue/30 py-2 px-4 rounded-lg transition-colors"
                >
                  Get Devnet SOL
                </button>
                <button
                  onClick={() => navigate('/browse')}
                  className="bg-sol-orange/10 hover:bg-sol-orange/20 text-sol-orange border border-sol-orange/30 py-2 px-4 rounded-lg transition-colors"
                >
                  Browse Competitions
                </button>
                <button
                  onClick={() => navigate('/create')}
                  className="bg-competition-purple/10 hover:bg-competition-purple/20 text-competition-purple border border-competition-purple/30 py-2 px-4 rounded-lg transition-colors"
                >
                  Create Competition
                </button>
              </div>
            </div>

            {/* Transaction History */}
            <div className="bg-dark-gray border border-gray-800 rounded-xl p-6">
              <h2 className="font-space text-2xl font-bold mb-6">Transaction History</h2>
              
              {transactions.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-full">
                    <thead>
                      <tr className="text-left border-b border-gray-700">
                        <th className="pb-3 text-gray-400">Type</th>
                        <th className="pb-3 text-gray-400">Amount</th>
                        <th className="pb-3 text-gray-400">Date</th>
                        <th className="pb-3 text-gray-400">Status</th>
                        <th className="pb-3 text-gray-400">Competition</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((tx) => (
                        <tr key={tx.id} className="border-b border-gray-800">
                          <td className="py-4">{tx.type}</td>
                          <td className={`py-4 font-medium ${tx.amount >= 0 ? 'text-green-500' : 'text-red-400'}`}>
                            {tx.amount >= 0 ? '+' : ''}{tx.amount} SOL
                          </td>
                          <td className="py-4 text-gray-400 text-sm">{formatDate(tx.timestamp)}</td>
                          <td className="py-4">
                            <span className="bg-green-500/20 text-green-500 py-1 px-2 rounded-full text-xs">
                              {tx.status}
                            </span>
                          </td>
                          <td className="py-4">
                            <button
                              onClick={() => navigate(`/competition/${tx.competition}`)}
                              className="text-neon-blue hover:underline text-sm"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">No transactions yet</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WalletPage;
