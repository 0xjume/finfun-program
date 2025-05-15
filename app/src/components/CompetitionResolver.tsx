import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { toast } from 'react-toastify';
import { competitionService } from '../services/competitionService';

// Component to test resolving competitions using Ave.ai
export const CompetitionResolver = () => {
  const { publicKey, connected } = useWallet();
  const [competitionId, setCompetitionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleResolveCompetition = async () => {
    if (!connected || !publicKey) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!competitionId.trim()) {
      toast.error('Please enter a competition ID');
      return;
    }

    try {
      setLoading(true);
      setResult(null);

      const resolveResult = await competitionService.resolveCompetitionUsingAveAi(
        window.solana,
        competitionId.trim()
      );

      console.log('Resolve result:', resolveResult);
      setResult(resolveResult);

      if (resolveResult.success) {
        toast.success('Competition resolved successfully!');
      } else {
        toast.error(`Failed to resolve competition: ${resolveResult.error}`);
      }
    } catch (error) {
      console.error('Error resolving competition:', error);
      toast.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Competition Resolver</h1>
      <p className="mb-6 text-gray-600">
        This tool uses Ave.ai to fetch the final token price and resolves a competition on-chain.
      </p>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Competition ID
          </label>
          <input
            type="text"
            value={competitionId}
            onChange={(e) => setCompetitionId(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter competition ID"
            disabled={loading}
          />
        </div>

        <div className="flex justify-between items-center">
          {!connected ? (
            <div className="text-center w-full">
              <p className="mb-4 text-red-500">Connect your wallet to resolve competitions</p>
              <WalletMultiButton className="mx-auto" />
            </div>
          ) : (
            <button
              onClick={handleResolveCompetition}
              disabled={loading || !competitionId.trim()}
              className={`w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Processing...' : 'Resolve Competition'}
            </button>
          )}
        </div>
      </div>

      {result && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Resolution Result</h2>
          <div className="bg-gray-100 p-4 rounded">
            <pre className="whitespace-pre-wrap break-words">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompetitionResolver;
