
import { useNavigate } from 'react-router-dom';
import { useCompetitions } from '../contexts/CompetitionContext';
import { useWallet } from '@solana/wallet-adapter-react';
import { toast } from 'react-toastify';

const BrowseCompetitions = () => {
  const navigate = useNavigate();
  const { publicKey } = useWallet();
  const { 
    competitions, 
    fetchCompetitions, 
    loading, 
    error 
  } = useCompetitions();

  // Format time remaining
  const formatTimeRemaining = (endTimeIso: string) => {
    const endTime = new Date(endTimeIso);
    const now = new Date();
    const diffMs = endTime.getTime() - now.getTime();
    
    if (diffMs <= 0) return 'Ended';
    
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  // Determine competition status (open, closed, or ended)
  const getCompetitionStatus = (endTimeIso: string) => {
    const endTime = new Date(endTimeIso);
    const now = new Date();
    return now > endTime ? 'ended' : 'open';
  };

  // Handle refresh button click
  const handleRefresh = async () => {
    try {
      await fetchCompetitions();
      toast.success('Competitions refreshed!');
    } catch (err) {
      toast.error('Failed to refresh competitions');
    }
  };

  // Sort competitions by end time (nearest ending first)
  const sortedCompetitions = [...competitions].sort((a, b) => {
    return new Date(a.endTime).getTime() - new Date(b.endTime).getTime();
  });

  return (
    <div className="pt-20 pb-10 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Browse Competitions</h1>
          <button 
            onClick={handleRefresh}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center"
            disabled={loading}
          >
            {loading ? (
              <span className="animate-pulse">Loading...</span>
            ) : (
              <span>Refresh</span>
            )}
          </button>
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-500 text-red-200 p-4 rounded-lg mb-6">
            <p>Error: {error}</p>
            <button 
              onClick={handleRefresh}
              className="text-sm underline mt-2"
            >
              Try again
            </button>
          </div>
        )}

        {loading && competitions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 border-4 border-neon-blue border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400">Loading competitions...</p>
          </div>
        ) : competitions.length === 0 ? (
          <div className="text-center py-12 bg-dark-gray border border-gray-800 rounded-lg">
            <h2 className="text-2xl font-bold mb-2">No competitions found</h2>
            <p className="text-gray-400 mb-6">
              {!publicKey 
                ? 'Connect your wallet to view and create competitions' 
                : 'Be the first to create a price prediction competition!'}
            </p>
            <button
              onClick={() => publicKey ? navigate('/create') : toast.info('Please connect your wallet first')}
              className="bg-neon-blue text-white px-6 py-2 rounded-lg"
            >
              {publicKey ? 'Create Competition' : 'Connect Wallet'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {sortedCompetitions.map(competition => {
              const status = getCompetitionStatus(competition.endTime);
              return (
                <div 
                  key={competition.id}
                  onClick={() => navigate(`/competition/${competition.id}`)}
                  className={`bg-dark-gray border border-gray-800 rounded-lg p-6 cursor-pointer transition-colors ${status === 'ended' ? 'opacity-70' : 'hover:border-neon-blue'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-xl font-bold">{competition.token} Price Prediction</h2>
                    {status === 'ended' ? (
                      <span className="px-2 py-1 text-xs bg-gray-800 text-gray-400 rounded-full">Ended</span>
                    ) : competition.userHasJoined ? (
                      <span className="px-2 py-1 text-xs bg-green-900/50 text-green-400 rounded-full">Joined</span>
                    ) : (
                      <span className="px-2 py-1 text-xs bg-blue-900/50 text-blue-400 rounded-full">Open</span>
                    )}
                  </div>
                  
                  {competition.description && (
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{competition.description}</p>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-gray-400 text-sm">Entry Fee</p>
                      <p className="font-bold">{competition.entryFee} SOL</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Prize Pool</p>
                      <p className="font-bold text-sol-orange">{competition.prizePool} SOL</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-400 text-sm">{competition.participants} participants</p>
                      <p className="text-gray-400 text-xs">Created by {competition.creator}</p>
                    </div>
                    {status !== 'ended' && (
                      <p className="text-electric-pink text-sm font-medium">
                        Ends in {formatTimeRemaining(competition.endTime)}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {!loading && competitions.length > 0 && (
          <div className="text-center mt-8">
            <button
              onClick={() => publicKey ? navigate('/create') : toast.info('Please connect your wallet first')}
              className="bg-neon-blue text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
            >
              Create Your Own Competition
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseCompetitions;
