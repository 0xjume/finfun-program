import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

// Mock competition data
const mockCompetition = {
  id: 'comp-123456',
  token: 'SOL',
  entryFee: 0.1,
  prizePool: 1.5,
  endTime: new Date(Date.now() + 12 * 3600 * 1000).toISOString(),
  startTime: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
  participants: 12,
  description: 'Predict the price of SOL at the end of the competition period. The closest prediction wins the prize pool!',
  predictions: [
    { user: 'User1', prediction: 142.5, timestamp: '2023-09-01T12:00:00Z' },
    { user: 'User2', prediction: 145.0, timestamp: '2023-09-01T13:30:00Z' },
    { user: 'User3', prediction: 138.2, timestamp: '2023-09-01T14:15:00Z' }
  ]
};

const CompetitionDetails = () => {
  const { id } = useParams<{ id: string }>();
  // Navigation is not used in this simplified version but kept for potential future use
  // const navigate = useNavigate();
  const { publicKey } = useWallet();
  const [prediction, setPrediction] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [hasJoined, setHasJoined] = useState(false);

  // Format date
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

  // Handle join competition
  const handleJoinCompetition = () => {
    if (!publicKey) return;
    if (!prediction) {
      setError('Please enter a prediction');
      return;
    }

    setIsSubmitting(true);
    setError('');

    // Simulate joining the competition
    setTimeout(() => {
      setHasJoined(true);
      setSuccess('Successfully joined the competition!');
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="pt-20 pb-10 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="bg-dark-gray border border-gray-800 rounded-lg p-6 mb-6">
          <h1 className="text-2xl font-bold mb-2">
            {mockCompetition.token} Price Prediction
          </h1>
          <p className="text-gray-400 mb-4">ID: {id || mockCompetition.id}</p>
          
          <p className="text-gray-300 mb-6">
            {mockCompetition.description}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-gray-800 p-4 rounded-lg">
              <p className="text-gray-400 text-sm mb-1">Entry Fee</p>
              <p className="font-bold text-xl">{mockCompetition.entryFee} SOL</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <p className="text-gray-400 text-sm mb-1">Prize Pool</p>
              <p className="font-bold text-xl text-sol-orange">{mockCompetition.prizePool} SOL</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <p className="text-gray-400 text-sm mb-1">End Time</p>
              <p className="font-bold">{formatDate(mockCompetition.endTime)}</p>
            </div>
          </div>
        </div>

        {/* Join Competition Form */}
        <div className="bg-dark-gray border border-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">
            {hasJoined ? 'Your Prediction' : 'Join Competition'}
          </h2>
          
          {!publicKey ? (
            <div className="text-center py-6">
              <p className="text-gray-400 mb-4">Connect your wallet to join this competition</p>
              <WalletMultiButton />
            </div>
          ) : hasJoined ? (
            <div className="text-center py-4">
              <p className="text-gray-400 mb-2">Your prediction for {mockCompetition.token} price:</p>
              <p className="font-bold text-2xl text-neon-blue mb-4">{prediction} USD</p>
              <p className="text-gray-400 text-sm">
                Good luck! Check back after the competition ends to see if you won.
              </p>
            </div>
          ) : (
            <div>
              {error && (
                <div className="bg-red-900/20 border border-red-900/30 text-red-400 p-4 rounded-lg mb-4">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="bg-green-900/20 border border-green-900/30 text-green-400 p-4 rounded-lg mb-4">
                  {success}
                </div>
              )}
              
              <div className="mb-4">
                <label className="block text-gray-400 mb-2">
                  Your Prediction (USD)
                </label>
                <input
                  type="number"
                  placeholder={`Enter ${mockCompetition.token} price prediction`}
                  value={prediction}
                  onChange={(e) => setPrediction(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg"
                  step="0.01"
                  min="0"
                />
              </div>
              
              <button
                onClick={handleJoinCompetition}
                disabled={isSubmitting}
                className="w-full bg-neon-blue text-white py-3 rounded-lg font-bold"
              >
                {isSubmitting ? 'Submitting...' : `Join Competition (${mockCompetition.entryFee} SOL)`}
              </button>
            </div>
          )}
        </div>

        {/* Leaderboard */}
        <div className="bg-dark-gray border border-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Predictions</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-700">
                  <th className="pb-3 text-gray-400">User</th>
                  <th className="pb-3 text-gray-400">Prediction</th>
                  <th className="pb-3 text-gray-400">Submitted</th>
                </tr>
              </thead>
              <tbody>
                {mockCompetition.predictions.map((pred, index) => (
                  <tr key={index} className="border-b border-gray-800">
                    <td className="py-3">{pred.user}</td>
                    <td className="py-3 font-medium">{pred.prediction} USD</td>
                    <td className="py-3 text-gray-400 text-sm">{formatDate(pred.timestamp)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompetitionDetails;
