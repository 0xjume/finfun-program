import { useWallet } from '@solana/wallet-adapter-react';
import { useNavigate } from 'react-router-dom';
import React, {  useEffect, useState  } from 'react';

// Mock data for active competitions - in a real app this would come from your Solana program
const mockUserCompetitions = [
  {
    id: 'comp-123456',
    token: 'SOL',
    entryFee: 0.1,
    prizePool: 1.5,
    endTime: new Date(Date.now() + 12 * 3600 * 1000).toISOString(), // 12 hours from now
    participants: 12,
    userRank: 2,
    userGuess: 145.5,
  },
  {
    id: 'comp-789012',
    token: 'JUP',
    entryFee: 0.05,
    prizePool: 0.75,
    endTime: new Date(Date.now() + 6 * 3600 * 1000).toISOString(), // 6 hours from now
    participants: 8,
    userRank: 1,
    userGuess: 2.3,
  },
];

// Mock data for featured competitions
const mockFeaturedCompetitions = [
  {
    id: 'comp-345678',
    token: 'SOL',
    entryFee: 0.1,
    prizePool: 2.0,
    endTime: new Date(Date.now() + 24 * 3600 * 1000).toISOString(), // 24 hours from now
    participants: 15,
  },
  {
    id: 'comp-901234',
    token: 'RAY',
    entryFee: 0.2,
    prizePool: 3.0,
    endTime: new Date(Date.now() + 48 * 3600 * 1000).toISOString(), // 48 hours from now
    participants: 7,
  },
  {
    id: 'comp-567890',
    token: 'BONK',
    entryFee: 0.05,
    prizePool: 1.0,
    endTime: new Date(Date.now() + 36 * 3600 * 1000).toISOString(), // 36 hours from now
    participants: 20,
  },
];

const Dashboard = () => {
  const { publicKey } = useWallet();
  const navigate = useNavigate();
  const [userCompetitions] = useState(mockUserCompetitions);
  const [featuredCompetitions] = useState(mockFeaturedCompetitions);

  // Redirect to landing page if not connected
  useEffect(() => {
    if (!publicKey) {
      navigate('/');
    }
  }, [publicKey, navigate]);

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

  return (
    <div className="pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* User Welcome */}
        <div className="mb-12">
          <h1 className="font-space text-3xl md:text-4xl font-bold mb-4">
            Welcome to <span className="gradient-text">Finfun</span>
          </h1>
          <p className="text-gray-400">
            Your dashboard for price prediction competitions on Solana
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div 
            onClick={() => navigate('/create')}
            className="bg-neon-blue/10 hover:bg-neon-blue/20 border border-neon-blue/30 rounded-xl p-6 cursor-pointer transition-colors"
          >
            <h2 className="font-space text-2xl font-bold mb-2 text-neon-blue">Create Competition</h2>
            <p className="text-gray-400 mb-4">
              Start a new price prediction competition and set your own parameters
            </p>
            <button className="bg-neon-blue hover:bg-neon-blue/90 text-white py-2 px-6 rounded-lg font-medium transition-colors">
              Create Now
            </button>
          </div>
          <div 
            onClick={() => navigate('/browse')}
            className="bg-sol-orange/10 hover:bg-sol-orange/20 border border-sol-orange/30 rounded-xl p-6 cursor-pointer transition-colors"
          >
            <h2 className="font-space text-2xl font-bold mb-2 text-sol-orange">Browse Competitions</h2>
            <p className="text-gray-400 mb-4">
              Explore active competitions and put your prediction skills to the test
            </p>
            <button className="bg-sol-orange hover:bg-sol-orange/90 text-white py-2 px-6 rounded-lg font-medium transition-colors">
              Browse Now
            </button>
          </div>
        </div>

        {/* Your Active Competitions */}
        <div className="mb-12">
          <h2 className="font-space text-2xl font-bold mb-6">Your Active Competitions</h2>
          
          {userCompetitions.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {userCompetitions.map((competition) => (
                <div 
                  key={competition.id}
                  onClick={() => navigate(`/competition/${competition.id}`)}
                  className="bg-dark-gray border border-gray-800 rounded-xl p-6 hover:border-neon-blue/50 transition-colors cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-space text-xl font-bold">{competition.token} Price Prediction</h3>
                      <p className="text-gray-400 text-sm">ID: {competition.id}</p>
                    </div>
                    <div className="bg-neon-blue/20 text-neon-blue font-bold py-1 px-3 rounded-full text-sm">
                      Rank #{competition.userRank}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-gray-400 text-sm">Your Guess</p>
                      <p className="font-bold">{competition.userGuess} {competition.token}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Prize Pool</p>
                      <p className="font-bold text-sol-orange">{competition.prizePool} SOL</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Ends In</p>
                      <p className="font-bold text-electric-pink">{formatTimeRemaining(competition.endTime)}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <p className="text-gray-400 text-sm">{competition.participants} participants</p>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/competition/${competition.id}`);
                      }}
                      className="text-neon-blue hover:underline text-sm font-medium"
                    >
                      View Details →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-dark-gray border border-gray-800 rounded-xl p-8 text-center">
              <p className="text-gray-400 mb-4">You haven't joined any competitions yet</p>
              <button 
                onClick={() => navigate('/browse')}
                className="bg-neon-blue hover:bg-neon-blue/90 text-white py-2 px-6 rounded-lg font-medium transition-colors"
              >
                Browse Competitions
              </button>
            </div>
          )}
        </div>

        {/* Featured Competitions Carousel */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-space text-2xl font-bold">Featured Competitions</h2>
            <button 
              onClick={() => navigate('/browse')}
              className="text-neon-blue hover:underline text-sm font-medium"
            >
              View All →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredCompetitions.map((competition) => (
              <div 
                key={competition.id}
                onClick={() => navigate(`/competition/${competition.id}`)}
                className="bg-dark-gray border border-gray-800 rounded-xl p-6 hover:border-sol-orange/50 transition-colors cursor-pointer"
              >
                <h3 className="font-space text-xl font-bold mb-4">{competition.token} Price Prediction</h3>
                
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
                  <p className="text-gray-400 text-sm">{competition.participants} participants</p>
                  <p className="text-electric-pink font-medium text-sm">
                    Ends in {formatTimeRemaining(competition.endTime)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
