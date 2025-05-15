import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Link, useNavigate } from 'react-router-dom';
import { useCompetitions } from '../contexts/CompetitionContext';

const LandingPage = () => {
  const { publicKey } = useWallet();
  const navigate = useNavigate();
  const { competitions, loading } = useCompetitions();
  const [activeCompetitions, setActiveCompetitions] = useState(0);
  
  // Calculate active competitions (not yet ended)
  useEffect(() => {
    if (competitions.length > 0) {
      const now = new Date();
      const active = competitions.filter(comp => new Date(comp.endTime) > now).length;
      setActiveCompetitions(active);
    }
  }, [competitions]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="h-screen flex flex-col justify-center items-center p-6 text-center bg-gradient-to-b from-gray-900 to-dark-gray relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute w-64 h-64 bg-neon-blue rounded-full blur-3xl -top-20 -left-20 animate-pulse-slow"></div>
          <div className="absolute w-96 h-96 bg-sol-orange rounded-full blur-3xl -bottom-32 -right-32 animate-pulse-slow animation-delay-2000"></div>
          <div className="absolute w-64 h-64 bg-electric-pink rounded-full blur-3xl bottom-40 left-20 animate-pulse-slow animation-delay-1000"></div>
        </div>
        
        {/* Main Content */}
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 animate-fade-in">
            Predict Prices,<br />
            Win <span className="text-neon-blue">SOL</span> on <span className="text-sol-orange">Solana</span>
          </h1>
          <p className="text-xl mb-10 max-w-xl mx-auto text-gray-300 animate-fade-in animation-delay-500">
            Create and join crypto price prediction competitions. Test your forecasting skills and earn rewards on the Solana blockchain.
          </p>
          
          <div className="mb-10 flex flex-col sm:flex-row justify-center items-center gap-4 animate-fade-in animation-delay-1000">
            <WalletMultiButton className="text-lg !bg-neon-blue hover:!bg-blue-600 !transition-colors" />
            
            {publicKey ? (
              <button 
                onClick={() => navigate('/create')} 
                className="bg-sol-orange hover:bg-sol-orange/80 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors"
              >
                Create Competition
              </button>
            ) : (
              <button 
                onClick={() => navigate('/browse')} 
                className="px-8 py-3 rounded-lg text-lg font-medium border-2 border-white/20 hover:border-white/40 transition-colors"
              >
                Browse Competitions
              </button>
            )}
          </div>
          
          {/* Statistics */}
          <div className="flex justify-center gap-8 text-center animate-fade-in animation-delay-1500">
            <div className="">
              <p className="text-3xl font-bold text-electric-pink">{loading ? '...' : activeCompetitions}</p>
              <p className="text-gray-400">Active Competitions</p>
            </div>
            <div className="">
              <p className="text-3xl font-bold text-sol-orange">{loading ? '...' : competitions.length}</p>
              <p className="text-gray-400">Total Competitions</p>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="py-20 px-6 bg-dark-gray">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-800">
              <div className="w-12 h-12 flex items-center justify-center bg-neon-blue/20 text-neon-blue rounded-full mb-4 text-xl font-bold">1</div>
              <h3 className="text-xl font-bold mb-3">Create a Competition</h3>
              <p className="text-gray-400">Choose a token, set an entry fee, and create a price prediction competition on Solana.</p>
            </div>
            
            <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-800">
              <div className="w-12 h-12 flex items-center justify-center bg-sol-orange/20 text-sol-orange rounded-full mb-4 text-xl font-bold">2</div>
              <h3 className="text-xl font-bold mb-3">Submit Predictions</h3>
              <p className="text-gray-400">Join competitions by paying the entry fee and submitting your price predictions.</p>
            </div>
            
            <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-800">
              <div className="w-12 h-12 flex items-center justify-center bg-electric-pink/20 text-electric-pink rounded-full mb-4 text-xl font-bold">3</div>
              <h3 className="text-xl font-bold mb-3">Win Rewards</h3>
              <p className="text-gray-400">The most accurate prediction wins the prize pool, paid out automatically on Solana.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="py-16 px-6 bg-gradient-to-r from-neon-blue/10 to-electric-pink/10 border-t border-b border-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to start predicting?</h2>
          <p className="text-xl mb-8 text-gray-300">Join the Finfun community today and test your prediction skills.</p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            {!publicKey && <WalletMultiButton className="text-lg" />}
            
            <Link 
              to="/browse" 
              className="bg-neon-blue hover:bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors"
            >
              Browse All Competitions
            </Link>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="py-10 text-sm text-gray-400 text-center">
        <p>Built on Solana • Running on Devnet</p>
        <p className="mt-2">© {new Date().getFullYear()} Finfun</p>
      </div>
    </div>
  );
};

export default LandingPage;
