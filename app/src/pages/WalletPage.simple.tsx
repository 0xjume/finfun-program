import React, {  useState, useEffect  } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Connection, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { toast } from 'react-toastify';
import { useCompetitions } from '../contexts/CompetitionContext';

// Constants - use Vite's environment variable format
const SOLANA_CONNECTION = new Connection(import.meta.env.VITE_SOLANA_RPC_URL || 'https://api.devnet.solana.com');

// Transaction types
interface Transaction {
  signature: string;
  type: string;
  amount: number;
  timestamp: string;
  competitionId?: string;
  blockTime?: number;
  status: 'confirmed' | 'pending' | 'failed';
}

// Sample transaction description parser
const parseTransactionType = (memo: string | null, amount: number): string => {
  if (!memo) return amount > 0 ? 'Deposit' : 'Withdrawal';
  
  if (memo.includes('entry')) return 'Competition Entry';
  if (memo.includes('win') || memo.includes('prize')) return 'Competition Winnings';
  if (memo.includes('create')) return 'Competition Creation';
  
  return memo.substring(0, 30) + (memo.length > 30 ? '...' : '');
};

const WalletPage = () => {

  const navigate = useNavigate();
  const { publicKey } = useWallet();
  const { userCompetitions } = useCompetitions();
  
  // State variables
  const [balance, setBalance] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isBalanceLoading, setIsBalanceLoading] = useState(true);
  const [isTransactionsLoading, setIsTransactionsLoading] = useState(true);
  const [copying, setCopying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch wallet balance from Solana
  useEffect(() => {
    if (!publicKey) {
      navigate('/');
      return;
    }
    
    const fetchBalance = async () => {
      try {
        setIsBalanceLoading(true);
        const lamports = await SOLANA_CONNECTION.getBalance(publicKey);
        const solBalance = lamports / LAMPORTS_PER_SOL;
        setBalance(solBalance);
      } catch (err) {
        console.error('Error fetching balance:', err);
        setError('Failed to load wallet balance');
        toast.error('Failed to load wallet balance');
      } finally {
        setIsBalanceLoading(false);
      }
    };
    
    fetchBalance();
  }, [publicKey, navigate]);
  
  // Fetch transaction history from Solana
  useEffect(() => {
    if (!publicKey) return;
    
    const fetchTransactions = async () => {
      try {
        setIsTransactionsLoading(true);
        
        // Get recent transactions (last 10)
        const signatures = await SOLANA_CONNECTION.getSignaturesForAddress(
          publicKey,
          { limit: 10 }
        );
        
        if (signatures.length === 0) {
          setTransactions([]);
          setIsTransactionsLoading(false);
          return;
        }
        
        // Get transaction details
        const txDetails = await Promise.all(
          signatures.map(async (sig) => {
            try {
              const tx = await SOLANA_CONNECTION.getTransaction(sig.signature, {
                maxSupportedTransactionVersion: 0
              });
              
              if (!tx) return null;
              
              // Extract memo if it exists
              let memo: string | null = null;
              try {
                // This is a simplified approach - in a real app you'd need more robust parsing
                if (tx.meta && tx.meta.logMessages) {
                  const memoLog = tx.meta.logMessages.find(log => log.includes('Memo'));
                  if (memoLog) memo = memoLog.split('[').pop()?.split(']')[0] || null;
                }
              } catch (e) {
                console.log('Error parsing memo', e);
              }
              
              // Calculate amount (simplified)
              // In a real app, you'd need to identify the transactions relevant to your app
              let amount = 0;
              if (tx.meta && tx.meta.postBalances && tx.meta.preBalances) {
                // This is a simplified calculation that looks at the wallet's balance change
                // Use getAccountKeys() for versioned transactions
                const accountKeys = tx.transaction.message.getAccountKeys ? 
                  tx.transaction.message.getAccountKeys() : 
                  tx.transaction.message.staticAccountKeys;
                  
                // Handle different account key formats safely
                let index = -1;
                
                if (Array.isArray(accountKeys)) {
                  // If accountKeys is already an array, use findIndex directly
                  index = accountKeys.findIndex(key => 
                    key && typeof key.toString === 'function' && key.toString() === publicKey.toString()
                  );
                } else if (accountKeys) {
                  // For MessageAccountKeys type which uses a get method instead of array access
                  try {
                    // First check if we can use standard length property
                    const length = accountKeys.length || 0;
                    for (let i = 0; i < length; i++) {
                      // Use get method if available, otherwise safely try to access by index
                      const key = typeof accountKeys.get === 'function' ? 
                        accountKeys.get(i) : 
                        (accountKeys as any)[i];
                        
                      if (key && typeof key.toString === 'function' && key.toString() === publicKey.toString()) {
                        index = i;
                        break;
                      }
                    }
                  } catch (error) {
                    console.error('Error processing account keys:', error);
                  }
                }
                if (index >= 0) {
                  amount = (tx.meta.postBalances[index] - tx.meta.preBalances[index]) / LAMPORTS_PER_SOL;
                }
              }
              
              // Try to match with competitions
              const competitionId = userCompetitions && userCompetitions.length > 0 ? 
                userCompetitions.find(c => {
                  // This is simplified - in a real app, you'd have more robust matching
                  return memo && (memo.includes(c.id) || c.id.includes(sig.signature.slice(0, 8)));
                })?.id : undefined;
              
              return {
                signature: sig.signature,
                type: parseTransactionType(memo, amount),
                amount,
                timestamp: new Date((tx.blockTime || Date.now() / 1000) * 1000).toISOString(),
                competitionId,
                blockTime: tx.blockTime,
                status: amount !== 0 ? 'confirmed' : 'pending'
              } as Transaction;
            } catch (err) {
              console.error('Error getting transaction:', err);
              return null;
            }
          })
        );
        
        // Filter out nulls and sort by timestamp (latest first)
        const validTxs = txDetails
          .filter((tx): tx is Transaction => tx !== null)
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        
        setTransactions(validTxs);
      } catch (err) {
        console.error('Error fetching transactions:', err);
        setError('Failed to load transaction history');
      } finally {
        setIsTransactionsLoading(false);
      }
    };
    
    fetchTransactions();
  }, [publicKey, userCompetitions]);

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

  return (
    <div className="pt-20 pb-10 min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Wallet</h1>
        
        {!publicKey ? (
          <div className="bg-dark-gray border border-gray-800 rounded-lg p-8 text-center">
            <p className="text-gray-400 mb-4">Connect your wallet to view your dashboard</p>
            <WalletMultiButton />
          </div>
        ) : (
          <>
            {error && (
              <div className="bg-red-900/30 border border-red-900/30 text-red-400 p-4 rounded-lg mb-6">
                <p className="font-medium">Error</p>
                <p>{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="text-sm underline mt-2"
                >
                  Refresh page
                </button>
              </div>
            )}
            
            {/* Wallet Info Card */}
            <div className="bg-dark-gray border border-gray-800 rounded-lg p-6 mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="mb-4 md:mb-0">
                  <h2 className="text-xl font-bold mb-1">Wallet</h2>
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center">
                      <p className="font-mono text-gray-400 text-sm mr-2">
                        {publicKey.toString().slice(0, 8)}...{publicKey.toString().slice(-8)}
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
                    <a 
                      href={`https://explorer.solana.com/address/${publicKey.toString()}?cluster=devnet`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-neon-blue hover:underline"
                    >
                      View on Solana Explorer
                    </a>
                  </div>
                </div>
                <div className="bg-gray-800 py-3 px-5 rounded-lg">
                  <p className="text-gray-400 text-sm mb-1">Balance</p>
                  {isBalanceLoading ? (
                    <div className="h-6 w-24 bg-gray-700 rounded animate-pulse"></div>
                  ) : (
                    <p className="font-bold text-xl text-sol-orange">{balance !== null ? balance.toFixed(4) : '0'} SOL</p>
                  )}
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-4">
                <button
                  onClick={() => navigate('/browse')}
                  className="bg-neon-blue text-white py-2 px-4 rounded-lg"
                >
                  Browse Competitions
                </button>
                <button
                  onClick={() => navigate('/create')}
                  className="bg-sol-orange text-white py-2 px-4 rounded-lg"
                >
                  Create Competition
                </button>
              </div>
            </div>

            {/* Transaction History */}
            <div className="bg-dark-gray border border-gray-800 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Transaction History</h2>
                <a 
                  href={`https://explorer.solana.com/address/${publicKey.toString()}/transactions?cluster=devnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-neon-blue hover:underline"
                >
                  View all on Explorer
                </a>
              </div>
              
              {isTransactionsLoading ? (
                <div className="py-10 flex justify-center">
                  <div className="w-10 h-10 border-4 border-neon-blue border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : transactions.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left border-b border-gray-700">
                        <th className="pb-3 text-gray-400">Type</th>
                        <th className="pb-3 text-gray-400">Amount</th>
                        <th className="pb-3 text-gray-400">Date</th>
                        <th className="pb-3 text-gray-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((tx) => (
                        <tr key={tx.signature} className="border-b border-gray-800">
                          <td className="py-3">
                            <div className="flex items-center">
                              <span className="mr-2">{tx.type}</span>
                              {tx.status === 'pending' && (
                                <span className="px-2 py-0.5 text-xs bg-yellow-900/30 text-yellow-400 rounded-full">Pending</span>
                              )}
                            </div>
                          </td>
                          <td className={`py-3 font-medium ${tx.amount >= 0 ? 'text-green-500' : 'text-red-400'}`}>
                            {tx.amount >= 0 ? '+' : ''}{tx.amount.toFixed(4)} SOL
                          </td>
                          <td className="py-3 text-gray-400 text-sm">{formatDate(tx.timestamp)}</td>
                          <td className="py-3">
                            <div className="flex space-x-3">
                              {tx.competitionId && (
                                <button
                                  onClick={() => navigate(`/competition/${tx.competitionId}`)}
                                  className="text-neon-blue hover:underline text-sm"
                                >
                                  View Competition
                                </button>
                              )}
                              <a 
                                href={`https://explorer.solana.com/tx/${tx.signature}?cluster=devnet`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-white text-sm"
                              >
                                Explorer
                              </a>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-900/30 rounded-lg border border-gray-800">
                  <p className="text-gray-400 mb-2">No transactions found</p>
                  <p className="text-sm text-gray-500">Transactions will appear here when you create or join competitions</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WalletPage;
