import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useNavigate } from 'react-router-dom';
import React, {  useEffect  } from 'react';

const LandingPage = () => {
  const { publicKey } = useWallet();
  const navigate = useNavigate();

  // Redirect to dashboard if connected
  useEffect(() => {
    if (publicKey) {
      navigate('/dashboard');
    }
  }, [publicKey, navigate]);

  return (
    <div className="pt-24 pb-12">
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-12">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="font-space text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Predict 
                <span className="gradient-text"> Crypto Prices</span>
                , Win <span className="text-sol-orange">SOL</span>
              </h1>
              <p className="text-lg md:text-xl mb-8 text-gray-300 max-w-xl">
                Create and join price prediction competitions on Solana. Test your forecasting skills against the community and win real crypto rewards.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <WalletMultiButton className="!bg-neon-blue hover:!bg-neon-blue/90 !rounded-lg !text-lg !py-3 !px-8" />
                <button
                  onClick={() => navigate('/browse')}
                  className="bg-sol-orange hover:bg-sol-orange/90 text-white text-lg py-3 px-8 rounded-lg font-medium transition-colors"
                >
                  Browse Competitions
                </button>
              </div>
            </div>
            <div className="md:w-1/2 relative">
              <div className="bg-competition-purple/20 backdrop-blur-xl p-8 rounded-2xl border border-competition-purple/30 shadow-lg">
                <div className="text-neon-blue text-center text-lg font-medium mb-4">LIVE COMPETITION</div>
                <h3 className="font-space text-2xl font-bold mb-2 text-center">SOL Price Prediction</h3>
                <div className="flex justify-between mb-6">
                  <div>
                    <p className="text-sm text-gray-400">Entry Fee</p>
                    <p className="text-lg font-bold">0.1 SOL</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Prize Pool</p>
                    <p className="text-lg font-bold text-sol-orange">1.5 SOL</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Ends In</p>
                    <p className="text-lg font-bold text-electric-pink">12h 34m</p>
                  </div>
                </div>
                <div className="bg-dark-gray/50 p-4 rounded-lg mb-4">
                  <p className="text-sm text-gray-400 mb-2">Current Participants</p>
                  <div className="flex justify-around">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="text-center">
                        <div className="inline-flex items-center justify-center w-10 h-10 bg-neon-blue/20 rounded-full mb-1">
                          <span className="text-neon-blue font-bold">{i + 1}</span>
                        </div>
                        <p className="text-xs">User{i+1}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <button 
                  onClick={() => navigate('/browse')}
                  className="w-full bg-neon-blue hover:bg-neon-blue/90 text-white py-3 rounded-lg font-bold transition-colors"
                >
                  Join Now
                </button>
              </div>
              <div className="absolute -z-10 w-full h-full top-4 left-4 bg-electric-pink/10 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-dark-gray/50">
        <div className="container mx-auto px-4">
          <h2 className="font-space text-3xl md:text-4xl font-bold mb-12 text-center">
            How <span className="gradient-text">Finfun</span> Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-dark-gray p-6 rounded-xl border border-gray-800">
              <div className="w-12 h-12 bg-neon-blue/20 rounded-full flex items-center justify-center mb-4">
                <span className="text-neon-blue font-bold text-xl">1</span>
              </div>
              <h3 className="font-space text-xl font-bold mb-2">Connect Your Wallet</h3>
              <p className="text-gray-400">
                Start by connecting your Solana wallet to the platform. Finfun supports Phantom and Solflare wallets.
              </p>
            </div>
            <div className="bg-dark-gray p-6 rounded-xl border border-gray-800">
              <div className="w-12 h-12 bg-sol-orange/20 rounded-full flex items-center justify-center mb-4">
                <span className="text-sol-orange font-bold text-xl">2</span>
              </div>
              <h3 className="font-space text-xl font-bold mb-2">Join or Create Competitions</h3>
              <p className="text-gray-400">
                Browse active competitions or create your own. Set parameters like token, entry fee, and prize pool.
              </p>
            </div>
            <div className="bg-dark-gray p-6 rounded-xl border border-gray-800">
              <div className="w-12 h-12 bg-competition-purple/20 rounded-full flex items-center justify-center mb-4">
                <span className="text-competition-purple font-bold text-xl">3</span>
              </div>
              <h3 className="font-space text-xl font-bold mb-2">Win SOL Rewards</h3>
              <p className="text-gray-400">
                Submit your price prediction, track the leaderboard, and win SOL if your guess is closest to the final price.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-neon-blue/20 to-competition-purple/20 p-8 md:p-12 rounded-2xl border border-neon-blue/30 text-center">
            <h2 className="font-space text-3xl md:text-4xl font-bold mb-6">
              Ready to Test Your Prediction Skills?
            </h2>
            <p className="text-lg md:text-xl mb-8 text-gray-300 max-w-2xl mx-auto">
              Join the Finfun community today and start earning rewards for your market insights.
            </p>
            <WalletMultiButton className="!bg-sol-orange hover:!bg-sol-orange/90 !rounded-lg !text-lg !py-3 !px-8" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
