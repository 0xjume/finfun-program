import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { toast } from 'react-toastify';

// Test component to verify wallet connection and transaction functionality
export const WalletConnectionTest = () => {
  const { publicKey, connected } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [testResult, setTestResult] = useState<string>('');

  // Get RPC URL from environment
  const rpcUrl = import.meta.env.VITE_SOLANA_RPC_URL || 'https://api.devnet.solana.com';
  const connection = new Connection(rpcUrl, 'confirmed');

  useEffect(() => {
    const fetchBalance = async () => {
      if (publicKey) {
        try {
          setLoading(true);
          const bal = await connection.getBalance(publicKey);
          setBalance(bal / LAMPORTS_PER_SOL);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching balance:', error);
          setLoading(false);
          toast.error('Failed to fetch wallet balance');
        }
      } else {
        setBalance(null);
      }
    };

    fetchBalance();
    // Run when publicKey changes
  }, [publicKey, connection]);

  const runConnectionTest = async () => {
    if (!publicKey) {
      setTestResult('❌ Test failed: Wallet not connected');
      return;
    }

    try {
      setLoading(true);
      setTestResult('🔄 Testing connection to Solana...');
      
      // 1. Test RPC connection
      const version = await connection.getVersion();
      
      // 2. Test wallet address validity
      const isValid = PublicKey.isOnCurve(publicKey);
      
      // 3. Test recent blockhash retrieval
      const { blockhash } = await connection.getLatestBlockhash();
      
      setTestResult(`✅ Connection successful!
      • Solana Version: ${version['solana-core']}
      • RPC Endpoint: ${rpcUrl.substring(0, 30)}...
      • Blockhash: ${blockhash.substring(0, 10)}...
      • Wallet is valid: ${isValid}
      • Wallet balance: ${balance?.toFixed(4) || 0} SOL`);
      
      setLoading(false);
    } catch (error) {
      console.error('Connection test failed:', error);
      setTestResult(`❌ Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">Wallet Connection Test</h2>
        <div className="flex space-x-2 items-center">
          <WalletMultiButton />
          <span className={connected ? "text-green-500" : "text-red-500"}>
            {connected ? '✅ Connected' : '❌ Not Connected'}
          </span>
        </div>
      </div>

      {connected && (
        <div className="mb-4">
          <p className="text-sm text-gray-600">Wallet Address:</p>
          <p className="font-mono text-xs break-all">{publicKey?.toString()}</p>
          <p className="text-sm text-gray-600 mt-2">Balance:</p>
          <p className="font-bold">{loading ? 'Loading...' : balance !== null ? `${balance.toFixed(4)} SOL` : 'Unknown'}</p>
        </div>
      )}

      <div className="mt-4">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          onClick={runConnectionTest}
          disabled={!connected || loading}
        >
          {loading ? 'Testing...' : 'Test Solana Connection'}
        </button>
      </div>

      {testResult && (
        <div className="mt-4 p-3 bg-gray-100 rounded-md">
          <pre className="text-xs whitespace-pre-wrap">{testResult}</pre>
        </div>
      )}
    </div>
  );
};

export default WalletConnectionTest;
