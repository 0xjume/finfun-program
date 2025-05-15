import React, {  useState  } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';

// Mock data for competitions
const mockCompetitions = [
  {
    id: 'comp-123456',
    token: 'SOL',
    entryFee: 0.1,
    prizePool: 1.5,
    endTime: new Date(Date.now() + 12 * 3600 * 1000).toISOString(),
    participants: 12,
    creator: 'Sailor',
  },
  {
    id: 'comp-789012',
    token: 'JUP',
    entryFee: 0.05,
    prizePool: 0.75,
    endTime: new Date(Date.now() + 6 * 3600 * 1000).toISOString(),
    participants: 8,
    creator: 'Moonfrog',
  },
  {
    id: 'comp-345678',
    token: 'SOL',
    entryFee: 0.2,
    prizePool: 2.0,
    endTime: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
    participants: 15,
    creator: 'DegenTrader',
  },
  {
    id: 'comp-901234',
    token: 'RAY',
    entryFee: 0.2,
    prizePool: 3.0,
    endTime: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
    participants: 7,
    creator: 'SolMaster',
  },
  {
    id: 'comp-567890',
    token: 'BONK',
    entryFee: 0.05,
    prizePool: 1.0,
    endTime: new Date(Date.now() + 36 * 3600 * 1000).toISOString(),
    participants: 20,
    creator: 'BonkWhale',
  },
  {
    id: 'comp-678901',
    token: 'PYTH',
    entryFee: 0.1,
    prizePool: 1.2,
    endTime: new Date(Date.now() + 18 * 3600 * 1000).toISOString(),
    participants: 10,
    creator: 'DataWizard',
  },
];

const BrowseCompetitions = () => {
  const navigate = useNavigate();
  const { publicKey } = useWallet();
  const [competitions] = useState(mockCompetitions);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('endingSoon'); // 'endingSoon', 'highestPrize', 'lowestEntry'

  // Filter competitions based on search term
  const filteredCompetitions = competitions.filter((comp) => {
    return (
      comp.token.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comp.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Sort competitions based on selected sort order
  const sortedCompetitions = [...filteredCompetitions].sort((a, b) => {
    if (sortOrder === 'endingSoon') {
      return new Date(a.endTime).getTime() - new Date(b.endTime).getTime();
    } else if (sortOrder === 'highestPrize') {
      return b.prizePool - a.prizePool;
    } else if (sortOrder === 'lowestEntry') {
      return a.entryFee - b.entryFee;
    }
    return 0;
  });

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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="font-space text-3xl md:text-4xl font-bold mb-2">
              Browse <span className="gradient-text">Competitions</span>
            </h1>
            <p className="text-gray-400">
              Find active price prediction competitions to join
            </p>
          </div>
          {publicKey && (
            <button
              onClick={() => navigate('/create')}
              className="mt-4 md:mt-0 bg-neon-blue hover:bg-neon-blue/90 text-white py-2 px-6 rounded-lg font-medium transition-colors"
            >
              Create Competition
            </button>
          )}
        </div>

        {/* Filters and Search */}
        <div className="bg-dark-gray border border-gray-800 rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
            <div className="flex-grow mb-4 md:mb-0">
              <label htmlFor="search" className="block text-gray-400 mb-2">Search</label>
              <input
                type="text"
                id="search"
                placeholder="Search by token or ID"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-neon-blue text-white"
              />
            </div>
            <div className="md:w-64">
              <label htmlFor="sort" className="block text-gray-400 mb-2">Sort By</label>
              <select
                id="sort"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-neon-blue text-white"
              >
                <option value="endingSoon">Ending Soon</option>
                <option value="highestPrize">Highest Prize</option>
                <option value="lowestEntry">Lowest Entry Fee</option>
              </select>
            </div>
          </div>
        </div>

        {/* Competition Cards */}
        {sortedCompetitions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedCompetitions.map((competition) => (
              <div 
                key={competition.id}
                onClick={() => navigate(`/competition/${competition.id}`)}
                className="bg-dark-gray border border-gray-800 rounded-xl p-6 hover:border-neon-blue/50 transition-colors cursor-pointer"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-space text-xl font-bold">{competition.token} Price Prediction</h3>
                  <div className="bg-electric-pink/20 text-electric-pink font-medium py-1 px-3 rounded-full text-sm">
                    {formatTimeRemaining(competition.endTime)}
                  </div>
                </div>
                
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

                <div className="flex justify-between items-center text-sm text-gray-400 mb-4">
                  <p>ID: {competition.id}</p>
                  <p>Created by: {competition.creator}</p>
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
            <p className="text-gray-400 mb-4">No competitions found for "{searchTerm}"</p>
            <button 
              onClick={() => setSearchTerm('')}
              className="bg-neon-blue hover:bg-neon-blue/90 text-white py-2 px-6 rounded-lg font-medium transition-colors"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseCompetitions;
