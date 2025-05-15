import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

// Popular tokens for the dropdown
const popularTokens = [
  { symbol: 'SOL', name: 'Solana' },
  { symbol: 'BTC', name: 'Bitcoin' },
  { symbol: 'ETH', name: 'Ethereum' },
  { symbol: 'BONK', name: 'Bonk' },
  { symbol: 'JUP', name: 'Jupiter' },
  { symbol: 'RAY', name: 'Raydium' },
  { symbol: 'PYTH', name: 'Pyth Network' },
  { symbol: 'ORCA', name: 'Orca' },
  { symbol: 'SAMO', name: 'Samoyedcoin' },
  { symbol: 'USDC', name: 'USD Coin' },
];

const CreateCompetition = () => {
  const navigate = useNavigate();
  const { publicKey, connected } = useWallet();
  
  // Form state
  const [token, setToken] = useState('');
  const [entryFee, setEntryFee] = useState('');
  const [duration, setDuration] = useState('24');
  const [description, setDescription] = useState('');
  const [customToken, setCustomToken] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [previewPrizePool, setPreviewPrizePool] = useState(0);

  // Redirect to landing page if not connected
  useEffect(() => {
    if (!publicKey) {
      navigate('/');
    }
  }, [publicKey, navigate]);

  // Calculate prize pool preview (90% of entry fees, assuming 10 participants)
  useEffect(() => {
    const entryFeeNumber = parseFloat(entryFee) || 0;
    const estimatedParticipants = 10; // Just an estimate for preview
    setPreviewPrizePool(entryFeeNumber * estimatedParticipants * 0.9); // 90% goes to prize pool
  }, [entryFee]);

  // Submit handler
  const handleCreateCompetition = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!connected) return;
    
    // Form validation
    if (!token && !customToken) {
      setError('Please select or enter a token');
      return;
    }

    // Token selection logic (currently not used in the mock implementation)
    // const selectedToken = token || customToken;
    
    const entryFeeNumber = parseFloat(entryFee);
    if (isNaN(entryFeeNumber) || entryFeeNumber <= 0) {
      setError('Please enter a valid entry fee');
      return;
    }

    if (entryFeeNumber < 0.01) {
      setError('Entry fee must be at least 0.01 SOL');
      return;
    }

    if (entryFeeNumber > 10) {
      setError('Entry fee cannot exceed 10 SOL');
      return;
    }

    const durationHours = parseInt(duration);
    if (isNaN(durationHours) || durationHours < 1 || durationHours > 168) {
      setError('Duration must be between 1 and 168 hours');
      return;
    }

    setIsCreating(true);
    setError('');

    try {
      // In a real app, here we would make a transaction to create the competition
      // For now, we'll simulate a successful creation
      setTimeout(() => {
        setSuccess('Competition created successfully!');
        setIsCreating(false);
        
        // Reset form
        setToken('');
        setEntryFee('');
        setDuration('24');
        setDescription('');
        setCustomToken('');
        
        // Redirect to the browse page after a delay
        setTimeout(() => {
          navigate('/browse');
        }, 2000);
      }, 1500);
    } catch (err) {
      setError('Failed to create competition');
      setIsCreating(false);
    }
  };

  return (
    <div className="pt-24 pb-12">
      <div className="container mx-auto px-4">
        <h1 className="font-space text-3xl md:text-4xl font-bold mb-2">
          Create <span className="gradient-text">Competition</span>
        </h1>
        <p className="text-gray-400 mb-8">
          Create a new price prediction competition on Solana
        </p>

        {!connected ? (
          <div className="bg-dark-gray border border-gray-800 rounded-xl p-8 text-center">
            <p className="text-gray-400 mb-4">Connect your wallet to create a competition</p>
            <WalletMultiButton className="!bg-neon-blue hover:!bg-neon-blue/90 !rounded-lg" />
          </div>
        ) : (
          <div className="bg-dark-gray border border-gray-800 rounded-xl p-6 md:p-8">
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-400 p-3 rounded-lg mb-6">
                {error}
              </div>
            )}
            
            {success && (
              <div className="bg-green-500/20 border border-green-500/50 text-green-400 p-3 rounded-lg mb-6">
                {success}
              </div>
            )}
            
            <form onSubmit={handleCreateCompetition}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Token Selection */}
                <div>
                  <label className="block text-gray-400 mb-2">Token</label>
                  <select
                    value={token}
                    onChange={(e) => {
                      setToken(e.target.value);
                      if (e.target.value) setCustomToken('');
                    }}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-neon-blue text-white"
                  >
                    <option value="">Select a token</option>
                    {popularTokens.map((t) => (
                      <option key={t.symbol} value={t.symbol}>
                        {t.symbol} - {t.name}
                      </option>
                    ))}
                    <option value="custom">Custom Token</option>
                  </select>
                </div>

                {/* Custom Token Input (shown if "Custom Token" is selected) */}
                {token === 'custom' && (
                  <div>
                    <label htmlFor="customToken" className="block text-gray-400 mb-2">
                      Custom Token Symbol
                    </label>
                    <input
                      type="text"
                      id="customToken"
                      placeholder="Enter token symbol (e.g. SOL)"
                      value={customToken}
                      onChange={(e) => setCustomToken(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-neon-blue text-white"
                      maxLength={10}
                    />
                  </div>
                )}

                {/* Entry Fee */}
                <div>
                  <label htmlFor="entryFee" className="block text-gray-400 mb-2">
                    Entry Fee (SOL)
                  </label>
                  <input
                    type="number"
                    id="entryFee"
                    placeholder="0.1"
                    value={entryFee}
                    onChange={(e) => setEntryFee(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-neon-blue text-white"
                    step="0.01"
                    min="0.01"
                    max="10"
                  />
                  <p className="text-sm text-gray-500 mt-1">Min: 0.01 SOL, Max: 10 SOL</p>
                </div>

                {/* Duration */}
                <div>
                  <label htmlFor="duration" className="block text-gray-400 mb-2">
                    Duration (hours)
                  </label>
                  <input
                    type="number"
                    id="duration"
                    placeholder="24"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-neon-blue text-white"
                    min="1"
                    max="168"
                  />
                  <p className="text-sm text-gray-500 mt-1">Min: 1 hour, Max: 168 hours (7 days)</p>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <label htmlFor="description" className="block text-gray-400 mb-2">
                  Description (optional)
                </label>
                <textarea
                  id="description"
                  placeholder="Describe your competition..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-neon-blue text-white"
                  rows={4}
                  maxLength={300}
                ></textarea>
                <p className="text-sm text-gray-500 mt-1">
                  {description.length}/300 characters
                </p>
              </div>

              {/* Preview */}
              <div className="bg-gray-800/50 p-6 rounded-lg mb-6">
                <h3 className="font-space text-xl font-bold mb-4">Competition Preview</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Token</p>
                    <p className="font-bold text-xl">
                      {token === 'custom' ? customToken : token || '---'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Entry Fee</p>
                    <p className="font-bold text-xl">
                      {entryFee ? `${entryFee} SOL` : '---'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Estimated Prize Pool</p>
                    <p className="font-bold text-xl text-sol-orange">
                      {previewPrizePool > 0 ? `${previewPrizePool.toFixed(2)} SOL` : '---'}
                    </p>
                    <p className="text-xs text-gray-500">Based on 10 participants</p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isCreating}
                className={`w-full bg-neon-blue hover:bg-neon-blue/90 text-white py-3 rounded-lg font-bold transition-colors ${
                  isCreating ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isCreating ? 'Creating Competition...' : 'Create Competition'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateCompetition;
