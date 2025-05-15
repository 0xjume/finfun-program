import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useCompetitions } from '../contexts/CompetitionContext';
import { toast } from 'react-toastify';
import { aveService } from '../services/aveService';

const CreateCompetition = () => {
  const navigate = useNavigate();
  const { publicKey } = useWallet();
  const { createCompetition } = useCompetitions();
  
  // Form state
  const [token, setToken] = useState('');
  const [tokenInputType, setTokenInputType] = useState<'preset' | 'custom'>('preset');
  const [customTokenAddress, setCustomTokenAddress] = useState('');
  const [customTokenSymbol, setCustomTokenSymbol] = useState('');
  const [validatingToken, setValidatingToken] = useState(false);
  const [tokenValidationResult, setTokenValidationResult] = useState<null | {
    valid: boolean;
    symbol?: string;
    name?: string;
  }>(null);
  const [entryFee, setEntryFee] = useState('0.1');
  const [duration, setDuration] = useState('24');
  const [description, setDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  // Redirect to landing page if not connected
  useEffect(() => {
    if (!publicKey) {
      navigate('/');
    }
  }, [publicKey, navigate]);

  // Handle token address validation
  const validateTokenAddress = async () => {
    if (!customTokenAddress) {
      setTokenValidationResult(null);
      return;
    }

    try {
      setValidatingToken(true);
      setTokenValidationResult(null);
      
      const result = await aveService.validateTokenAddress(customTokenAddress);
      setTokenValidationResult(result);
      
      if (result.valid && result.symbol) {
        setCustomTokenSymbol(result.symbol);
        toast.success(`Token validated: ${result.name || result.symbol}`);
      } else {
        toast.error('Invalid token address');
      }
    } catch (error) {
      console.error('Error validating token:', error);
      toast.error('Error validating token address');
      setTokenValidationResult({ valid: false });
    } finally {
      setValidatingToken(false);
    }
  };

  // Reset custom token fields when switching input types
  const handleTokenInputTypeChange = (type: 'preset' | 'custom') => {
    setTokenInputType(type);
    if (type === 'preset') {
      setCustomTokenAddress('');
      setCustomTokenSymbol('');
      setTokenValidationResult(null);
    } else {
      setToken('');
    }
  };

  // Submit handler
  const handleCreateCompetition = async (e: React.FormEvent) => {
    e.preventDefault();

    // Get the token to use (either preset or custom validated symbol)
    const tokenToUse = tokenInputType === 'preset' ? token : customTokenSymbol;
    
    // Validate input (including checking if custom token is validated)
    if (tokenInputType === 'custom' && (!tokenValidationResult || !tokenValidationResult.valid)) {
      toast.error('Please validate the custom token address first');
      return;
    }
    
    if (!tokenToUse) {
      toast.error('Please select or validate a token');
      return;
    }
    
    const entryFeeNumber = parseFloat(entryFee);
    if (isNaN(entryFeeNumber) || entryFeeNumber <= 0) {
      setError('Please enter a valid entry fee');
      toast.error('Please enter a valid entry fee');
      return;
    }
    
    const durationHours = parseInt(duration);
    if (isNaN(durationHours) || durationHours <= 0) {
      setError('Please enter a valid competition duration');
      toast.error('Please enter a valid competition duration');
      return;
    }

    setIsCreating(true);
    setError('');
    
    try {
      // Calculate end time based on current time + duration
      const now = new Date();
      const endTime = new Date(now.getTime() + durationHours * 60 * 60 * 1000);
      
      // Get the token name for display
      const tokenDisplayName = tokenInputType === 'preset' ? token : 
        (tokenValidationResult?.name || tokenValidationResult?.symbol || customTokenSymbol);
      
      // Prepare competition data
      const competitionData = {
        token: tokenToUse,
        entryFee: entryFeeNumber,
        description: description || `${tokenDisplayName} price prediction competition`,
        endTime: endTime.toISOString(),
        startTime: now.toISOString()
      };
      
      // Create the competition on Solana
      const competitionId = await createCompetition(competitionData);
      toast.success('Competition created successfully!');
      
      // Redirect to the competition detail page
      navigate(`/competition/${competitionId}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create competition');
      toast.error(err.message || 'Failed to create competition');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="pt-20 pb-10 min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Create Competition</h1>
        
        {!publicKey ? (
          <div className="bg-dark-gray border border-gray-800 rounded-lg p-8 text-center">
            <p className="text-gray-400 mb-4">Connect your wallet to create a competition</p>
            <WalletMultiButton />
          </div>
        ) : (
          <div className="bg-dark-gray border border-gray-800 rounded-lg p-6">
            {error && (
              <div className="bg-red-900/20 border border-red-900/30 text-red-400 p-4 rounded-lg mb-6">
                <p className="font-medium">Error</p>
                <p>{error}</p>
              </div>
            )}
            
            <form onSubmit={handleCreateCompetition}>
              {/* Token selection type toggle */}
              <div className="mb-4">
                <label className="block text-gray-400 mb-2">Token Selection Method</label>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => handleTokenInputTypeChange('preset')}
                    className={`px-4 py-2 rounded-lg ${
                      tokenInputType === 'preset'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300'
                    }`}
                  >
                    Select from List
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTokenInputTypeChange('custom')}
                    className={`px-4 py-2 rounded-lg ${
                      tokenInputType === 'custom'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300'
                    }`}
                  >
                    Custom Token
                  </button>
                </div>
              </div>

              {/* Show preset token dropdown or custom token input based on selection */}
              {tokenInputType === 'preset' ? (
                <div className="mb-4">
                  <label className="block text-gray-400 mb-2">Token to Predict</label>
                  <select
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-neon-blue outline-none transition-colors"
                    disabled={isCreating}
                  >
                    <option value="">Select a token</option>
                    <option value="SOL">SOL - Solana</option>
                    <option value="BTC">BTC - Bitcoin</option>
                    <option value="ETH">ETH - Ethereum</option>
                    <option value="BONK">BONK - Bonk</option>
                    <option value="JUP">JUP - Jupiter</option>
                    <option value="USDC">USDC - USD Coin</option>
                    <option value="PYTH">PYTH - Pyth Network</option>
                  </select>
                </div>
              ) : (
                <div className="mb-4">
                  <label className="block text-gray-400 mb-2">Custom Token Address</label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={customTokenAddress}
                      onChange={(e) => setCustomTokenAddress(e.target.value)}
                      className="flex-grow px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-neon-blue outline-none transition-colors"
                      placeholder="Enter token address"
                      disabled={isCreating || validatingToken}
                    />
                    <button
                      type="button"
                      onClick={validateTokenAddress}
                      disabled={!customTokenAddress || isCreating || validatingToken}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg disabled:opacity-50"
                    >
                      {validatingToken ? 'Validating...' : 'Validate'}
                    </button>
                  </div>
                  
                  {/* Token validation result */}
                  {tokenValidationResult && (
                    <div className={`mt-2 p-2 rounded ${
                      tokenValidationResult.valid ? 'bg-green-900/30' : 'bg-red-900/30'
                    }`}>
                      {tokenValidationResult.valid ? (
                        <p className="text-green-400">
                          ✓ Valid token: {tokenValidationResult.name || tokenValidationResult.symbol || 'Unknown'}
                        </p>
                      ) : (
                        <p className="text-red-400">
                          ✗ Invalid token address
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
              
              <div className="mb-4">
                <label className="block text-gray-400 mb-2">Entry Fee (SOL)</label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="0.1"
                    value={entryFee}
                    onChange={(e) => setEntryFee(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-neon-blue outline-none transition-colors pr-12"
                    step="0.01"
                    min="0.01"
                    max="10"
                    disabled={isCreating}
                  />
                  <span className="absolute right-3 top-2 text-gray-400">SOL</span>
                </div>
                <p className="text-gray-500 text-xs mt-1">Prize pool will be {parseFloat(entryFee || '0') * 10 * 0.9} SOL (90% of total entry fees)</p>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-400 mb-2">Duration (hours)</label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="24"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-neon-blue outline-none transition-colors pr-16"
                    min="1"
                    max="168"
                    disabled={isCreating}
                  />
                  <span className="absolute right-3 top-2 text-gray-400">hours</span>
                </div>
                <p className="text-gray-500 text-xs mt-1">
                  Competition will end {new Date(Date.now() + parseInt(duration || '24') * 60 * 60 * 1000).toLocaleString()}
                </p>
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-400 mb-2">Description (optional)</label>
                <textarea
                  placeholder="Describe your competition..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-neon-blue outline-none transition-colors"
                  rows={3}
                  maxLength={200}
                  disabled={isCreating}
                />
                <p className="text-gray-500 text-xs mt-1">{description.length}/200 characters</p>
              </div>
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/browse')}
                  disabled={isCreating}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="flex-2 bg-neon-blue hover:bg-blue-600 text-white py-3 rounded-lg font-bold transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isCreating ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating on Solana...
                    </span>
                  ) : (
                    'Create Competition'
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateCompetition;
