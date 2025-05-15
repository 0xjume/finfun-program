import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { toast } from 'react-toastify';
import { competitionService } from '../services/competitionService';


// Types
export interface Competition {
  id: string;
  token: string;
  entryFee: number;
  prizePool: number;
  endTime: string;
  startTime: string;
  participants: number;
  creator: string;
  creatorPublicKey: string;
  description: string;
  userHasJoined?: boolean;
  state: number; // 0 = Active, 1 = Resolved, 2 = Cancelled
}

export interface Prediction {
  user: string;
  prediction: number;
  timestamp: string;
  userPublicKey: string;
}

interface CompetitionContextType {
  competitions: Competition[];
  userCompetitions: Competition[];
  getPredictions: (competitionId: string) => Prediction[];
  getCompetition: (competitionId: string) => Competition | undefined;
  fetchCompetitions: () => Promise<void>;
  createCompetition: (competition: Partial<Competition>) => Promise<string>;
  joinCompetition: (competitionId: string, prediction: number) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

const CompetitionContext = createContext<CompetitionContextType | undefined>(undefined);

export const CompetitionProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const { publicKey } = useWallet();
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [userCompetitions, setUserCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch competitions from Solana
  const fetchCompetitions = async () => {
    setLoading(true);
    setError(null);
    try {
      const comps = await competitionService.fetchAllCompetitions(publicKey);
      setCompetitions(comps);
      // Filter competitions the user has joined (if wallet connected)
      if (publicKey) {
        const userAddress = publicKey.toString();
        const userComps = comps.filter((comp: Competition) => comp.userHasJoined || comp.creatorPublicKey === userAddress);
        setUserCompetitions(userComps);
      } else {
        setUserCompetitions([]);
      }
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch competitions');
      toast.error(err.message || 'Failed to fetch competitions');
      setLoading(false);
    }
  };

  // Get predictions for a competition
  const getPredictions = (competitionId: string): Prediction[] => {
    if (!publicKey) return [];
    
    // Use competitionId variable to avoid lint warning - this will be used in the actual implementation
    console.debug(`Will fetch predictions for competition: ${competitionId} when implementation is ready`);
    
    // Note: This is async in the service, but context API is sync. Consider making this async if needed in the future.
    // For now, return empty array if not available synchronously.
    // To properly fetch, you should use a hook or effect in the component that calls this.
    // Example usage below for illustration; in practice, you may want to refactor this to async.
    // return await competitionService.fetchPredictionsForCompetition(publicKey, competitionId);
    return [];
  };

  // Get a specific competition by ID
  const getCompetition = (id: string): Competition | undefined => {
    return competitions.find(comp => comp.id === id);
  };

  // Create a new competition via Solana
  const createCompetition = async (competition: Partial<Competition>): Promise<string> => {
    try {
      if (!publicKey) throw new Error('Wallet not connected');
      if (!competition.token || !competition.entryFee || !competition.startTime || !competition.endTime) {
        throw new Error('Missing required competition fields');
      }
      const result = await competitionService.createCompetition(
        { publicKey },
        competition.token,
        competition.entryFee,
        new Date(competition.startTime),
        new Date(competition.endTime)
      );
      toast.success('Competition created!');
      await fetchCompetitions();
      return result.competitionId;
    } catch (err: any) {
      toast.error(err.message || 'Failed to create competition');
      throw new Error(err.message || 'Failed to create competition');
    }
  };

  // Join a competition via Solana
  const joinCompetition = async (competitionId: string, prediction: number): Promise<boolean> => {
    try {
      if (!publicKey) throw new Error('Wallet not connected');
      await competitionService.joinCompetition({ publicKey }, competitionId, prediction);
      toast.success('Joined competition!');
      await fetchCompetitions();
      return true;
    } catch (err: any) {
      toast.error(err.message || 'Failed to join competition');
      throw new Error(err.message || 'Failed to join competition');
    }
  };

  // Fetch competitions on mount and when wallet changes
  useEffect(() => {
    fetchCompetitions();
  }, [publicKey]);

  const value = {
    competitions,
    userCompetitions,
    getPredictions,
    getCompetition,
    fetchCompetitions,
    createCompetition,
    joinCompetition,
    loading,
    error
  };

  return (
    <CompetitionContext.Provider value={value}>
      {children}
    </CompetitionContext.Provider>
  );
};

export const useCompetitions = () => {
  const context = useContext(CompetitionContext);
  if (context === undefined) {
    throw new Error('useCompetitions must be used within a CompetitionProvider');
  }
  return context;
};
