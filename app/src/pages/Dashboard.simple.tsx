
import { useWallet } from '@solana/wallet-adapter-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Dashboard = () => {
  const { publicKey } = useWallet();
  const navigate = useNavigate();

  // Redirect to landing page if not connected
  useEffect(() => {
    if (!publicKey) {
      navigate('/');
    }
  }, [publicKey, navigate]);

  return (
    <div className="pt-20 pb-10 min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        
        <div className="bg-dark-gray border border-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Your Active Competitions</h2>
          <p className="text-gray-400">
            You haven't joined any competitions yet.
          </p>
          <button 
            onClick={() => navigate('/browse')}
            className="mt-4 bg-neon-blue text-white px-4 py-2 rounded-lg"
          >
            Browse Competitions
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div 
            onClick={() => navigate('/create')}
            className="bg-dark-gray border border-gray-800 rounded-lg p-6 cursor-pointer hover:border-neon-blue transition-colors"
          >
            <h2 className="text-xl font-bold mb-2">Create Competition</h2>
            <p className="text-gray-400 mb-4">
              Create a new price prediction competition
            </p>
            <button className="bg-neon-blue text-white px-4 py-2 rounded-lg">
              Get Started
            </button>
          </div>
          <div 
            onClick={() => navigate('/browse')}
            className="bg-dark-gray border border-gray-800 rounded-lg p-6 cursor-pointer hover:border-sol-orange transition-colors"
          >
            <h2 className="text-xl font-bold mb-2">Browse Competitions</h2>
            <p className="text-gray-400 mb-4">
              Find active competitions to join
            </p>
            <button className="bg-sol-orange text-white px-4 py-2 rounded-lg">
              Browse Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
