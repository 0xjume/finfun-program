import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { toast } from 'react-toastify';
import { useCompetitions } from '../contexts/CompetitionContext';
import { PublicKey } from '@solana/web3.js';

// Test component to verify competition data fetching
export const CompetitionDataTest = () => {
  const { publicKey, connected } = useWallet();
  const { competitions, fetchCompetitions, loading, error } = useCompetitions();
  const [testResult, setTestResult] = useState<string>('');
  const [localLoading, setLocalLoading] = useState(false);

  // Programmatically fetch competitions when component mounts
  useEffect(() => {
    if (connected && publicKey) {
      handleFetchCompetitions();
    }
  // We only want this to run once on mount and when wallet connects
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected, publicKey]);

  const handleFetchCompetitions = async () => {
    try {
      setLocalLoading(true);
      setTestResult('🔄 Fetching competitions from blockchain...');
      await fetchCompetitions();
      setLocalLoading(false);
    } catch (err) {
      console.error('Error fetching competitions:', err);
      setLocalLoading(false);
      toast.error('Failed to fetch competitions');
    }
  };

  const testProgramConnection = async () => {
    if (!publicKey) {
      setTestResult('❌ Test failed: Wallet not connected');
      return;
    }

    try {
      setLocalLoading(true);
      setTestResult('🔄 Testing connection to Finfun program...');
      
      // Use the program ID from the environment
      const programId = import.meta.env.VITE_PROGRAM_ID || '';
      
      if (!programId) {
        setTestResult('❌ Test failed: Program ID not found in environment variables');
        setLocalLoading(false);
        return;
      }
      
      // Verify program ID is valid
      try {
        new PublicKey(programId);
      } catch (e) {
        setTestResult(`❌ Test failed: Invalid program ID format - ${programId}`);
        setLocalLoading(false);
        return;
      }
      
      // Trigger competition fetch
      await fetchCompetitions();
      
      // Generate test result
      const result = `✅ Program connection successful!
      • Program ID: ${programId}
      • Connected wallet: ${publicKey.toString()}
      • Competitions found: ${competitions.length}
      • Data: ${JSON.stringify(competitions.slice(0, 2), null, 2)}`;
      
      setTestResult(result);
      setLocalLoading(false);
    } catch (err) {
      console.error('Program connection test failed:', err);
      setTestResult(`❌ Test failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setLocalLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">Competition Data Test</h2>
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
        </div>
      )}

      <div className="flex space-x-2 mt-4">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          onClick={handleFetchCompetitions}
          disabled={!connected || localLoading || loading}
        >
          {localLoading || loading ? 'Loading...' : 'Fetch Competitions'}
        </button>
        
        <button
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          onClick={testProgramConnection}
          disabled={!connected || localLoading || loading}
        >
          {localLoading || loading ? 'Testing...' : 'Test Program Connection'}
        </button>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {competitions.length > 0 && (
        <div className="mt-4">
          <h3 className="font-bold">Competitions ({competitions.length})</h3>
          <div className="mt-2 max-h-60 overflow-y-auto">
            {competitions.map((comp) => (
              <div key={comp.id} className="p-2 bg-gray-100 rounded mb-2">
                <p><span className="font-bold">ID:</span> {comp.id.substring(0, 10)}...</p>
                <p><span className="font-bold">Token:</span> {comp.token}</p>
                <p><span className="font-bold">Entry Fee:</span> {comp.entryFee} SOL</p>
                <p><span className="font-bold">Prize Pool:</span> {comp.prizePool} SOL</p>
                <p><span className="font-bold">Participants:</span> {comp.participants}</p>
                <p><span className="font-bold">Status:</span> {comp.state === 0 ? 'Active' : comp.state === 1 ? 'Resolved' : 'Cancelled'}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {testResult && (
        <div className="mt-4 p-3 bg-gray-100 rounded-md">
          <pre className="text-xs whitespace-pre-wrap">{testResult}</pre>
        </div>
      )}
    </div>
  );
};

export default CompetitionDataTest;
