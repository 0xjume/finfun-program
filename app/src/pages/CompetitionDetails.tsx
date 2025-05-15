import React, {  useState, useEffect  } from 'react';
import { useParams } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

// Mock competition data - in a real app, we would fetch this from the blockchain
const mockCompetitionDetails = {
  id: 'comp-123456',
  token: 'SOL',
  entryFee: 0.1,
  prizePool: 1.5,
  endTime: new Date(Date.now() + 12 * 3600 * 1000).toISOString(),
  startTime: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
  participants: 12,
  creator: 'Sailor',
  creatorPublicKey: '8xMUCY7pGdwFqzFz8bNb7fRDgv9FmKXvxJqKKMNbBVkf',
  description: 'Predict the price of SOL at the end of the competition period. The closest prediction wins the prize pool!',
  userHasJoined: false,
  predictions: [
    { user: 'User1', prediction: 142.5, timestamp: '2023-09-01T12:00:00Z' },
    { user: 'User2', prediction: 145.0, timestamp: '2023-09-01T13:30:00Z' },
    { user: 'User3', prediction: 138.2, timestamp: '2023-09-01T14:15:00Z' }
  ]
};

const CompetitionDetails = () => {
  const { id } = useParams<{ id: string }>();
  // Navigation functionality commented out for now, but kept for future implementation
  // const navigate = useNavigate();
  const { publicKey, connected } = useWallet();
  const [competition, setCompetition] = useState(mockCompetitionDetails);
  const [prediction, setPrediction] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [hasJoined, setHasJoined] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState('');
  const [userPrediction, setUserPrediction] = useState<number | null>(null);

  // Format timestamp
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format time remaining
  const updateTimeRemaining = () => {
    const endTime = new Date(competition.endTime);
    const now = new Date();
    const diffMs = endTime.getTime() - now.getTime();
    
    if (diffMs <= 0) {
      setTimeRemaining('Competition ended');
      return;
    }
    
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
    
    setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
  };

  // Update time remaining every second
  useEffect(() => {
    // In a real app, we would fetch the competition data here
    setCompetition({
      ...mockCompetitionDetails,
      id: id || mockCompetitionDetails.id
    });

    const timer = setInterval(updateTimeRemaining, 1000);
    return () => clearInterval(timer);
  }, [id]);

  // Check if user has joined
  useEffect(() => {
    if (publicKey) {
      // In a real app, we would check if the user has already joined
      // For now, we'll use the mock data
      setHasJoined(competition.userHasJoined);
      
      // Check if user has a prediction
      const userPred = competition.predictions.find(
        (p) => p.user === publicKey.toString().slice(0, 6) + '...'
      );
      
      if (userPred) {
        setUserPrediction(userPred.prediction);
      }
    }
  }, [publicKey, competition]);

  // Handle join competition
  const handleJoinCompetition = async () => {
    if (!connected) return;
    if (!prediction) {
      setError('Please enter a prediction');
      return;
    }

    const predictionValue = parseFloat(prediction);
    if (isNaN(predictionValue)) {
      setError('Please enter a valid number');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // In a real app, here we would make a transaction to join the competition
      // For now, we'll simulate a successful join
      setTimeout(() => {
        setHasJoined(true);
        setUserPrediction(predictionValue);
        setSuccess('Successfully joined the competition!');
        setIsSubmitting(false);
      }, 1500);
    } catch (err) {
      setError('Failed to join competition');
      setIsSubmitting(false);
    }
  };

  // Check if competition has ended
  const isCompetitionEnded = () => {
    const endTime = new Date(competition.endTime);
    const now = new Date();
    return now > endTime;
  };

  return (
    <div className="pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="bg-dark-gray border border-gray-800 rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6">
            <div>
              <h1 className="font-space text-3xl font-bold mb-2">
                {competition.token} Price Prediction
              </h1>
              <p className="text-gray-400 mb-1">ID: {competition.id}</p>
              <p className="text-gray-400">Created by: {competition.creator}</p>
            </div>
            <div className="mt-4 md:mt-0 bg-electric-pink/20 text-electric-pink font-medium py-2 px-4 rounded-lg text-center">
              {isCompetitionEnded() ? 'Competition ended' : timeRemaining}
            </div>
          </div>

          <p className="text-gray-300 mb-6">
            {competition.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-800/50 p-4 rounded-lg">
              <p className="text-gray-400 text-sm mb-1">Entry Fee</p>
              <p className="font-bold text-xl">{competition.entryFee} SOL</p>
            </div>
            <div className="bg-gray-800/50 p-4 rounded-lg">
              <p className="text-gray-400 text-sm mb-1">Prize Pool</p>
              <p className="font-bold text-xl text-sol-orange">{competition.prizePool} SOL</p>
            </div>
            <div className="bg-gray-800/50 p-4 rounded-lg">
              <p className="text-gray-400 text-sm mb-1">Participants</p>
              <p className="font-bold text-xl">{competition.participants}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-800/50 p-4 rounded-lg">
              <p className="text-gray-400 text-sm mb-1">Start Time</p>
              <p className="font-medium">{formatDate(competition.startTime)}</p>
            </div>
            <div className="bg-gray-800/50 p-4 rounded-lg">
              <p className="text-gray-400 text-sm mb-1">End Time</p>
              <p className="font-medium">{formatDate(competition.endTime)}</p>
            </div>
          </div>
        </div>

        {/* Join Competition Form */}
        {!isCompetitionEnded() && (
          <div className="bg-dark-gray border border-gray-800 rounded-xl p-6 mb-8">
            <h2 className="font-space text-2xl font-bold mb-4">
              {hasJoined ? 'Your Prediction' : 'Join Competition'}
            </h2>
            
            {!connected ? (
              <div className="text-center py-6">
                <p className="text-gray-400 mb-4">Connect your wallet to join this competition</p>
                <WalletMultiButton className="!bg-neon-blue hover:!bg-neon-blue/90 !rounded-lg" />
              </div>
            ) : hasJoined ? (
              <div className="text-center py-4">
                <p className="text-gray-400 mb-2">Your prediction for {competition.token} price:</p>
                <p className="font-bold text-2xl text-neon-blue mb-4">{userPrediction} USD</p>
                <p className="text-gray-400 text-sm">
                  Good luck! Check back after the competition ends to see if you won.
                </p>
              </div>
            ) : (
              <div>
                <p className="text-gray-400 mb-6">
                  Enter your prediction for the price of {competition.token} at the end of the competition period.
                  Entry fee: {competition.entryFee} SOL.
                </p>
                
                {error && (
                  <div className="bg-red-500/20 border border-red-500/50 text-red-400 p-3 rounded-lg mb-4">
                    {error}
                  </div>
                )}
                
                {success && (
                  <div className="bg-green-500/20 border border-green-500/50 text-green-400 p-3 rounded-lg mb-4">
                    {success}
                  </div>
                )}
                
                <div className="mb-4">
                  <label htmlFor="prediction" className="block text-gray-400 mb-2">
                    Your Prediction (USD)
                  </label>
                  <input
                    type="number"
                    id="prediction"
                    placeholder={`Enter ${competition.token} price prediction`}
                    value={prediction}
                    onChange={(e) => setPrediction(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-neon-blue text-white"
                    step="0.01"
                    min="0"
                  />
                </div>
                
                <button
                  onClick={handleJoinCompetition}
                  disabled={isSubmitting}
                  className={`w-full bg-neon-blue hover:bg-neon-blue/90 text-white py-3 rounded-lg font-bold transition-colors ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? 'Submitting...' : `Join Competition (${competition.entryFee} SOL)`}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Leaderboard */}
        <div className="bg-dark-gray border border-gray-800 rounded-xl p-6">
          <h2 className="font-space text-2xl font-bold mb-4">Predictions</h2>
          
          {competition.predictions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-full">
                <thead>
                  <tr className="text-left border-b border-gray-700">
                    <th className="pb-3 text-gray-400">User</th>
                    <th className="pb-3 text-gray-400">Prediction</th>
                    <th className="pb-3 text-gray-400">Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {competition.predictions.map((pred, index) => (
                    <tr key={index} className="border-b border-gray-800">
                      <td className="py-3">{pred.user}</td>
                      <td className="py-3 font-medium">{pred.prediction} USD</td>
                      <td className="py-3 text-gray-400 text-sm">{formatDate(pred.timestamp)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-400 text-center py-4">No predictions submitted yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompetitionDetails;
