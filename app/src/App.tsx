import { useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';

// Import CSS for wallet adapter
import '@solana/wallet-adapter-react-ui/styles.css';

// Import components
import MinimalNavbar from './components/MinimalNavbar';
import MinimalFooter from './components/MinimalFooter';

// Import pages
import Dashboard from './pages/Dashboard.simple';
import BrowseCompetitions from './pages/BrowseCompetitions.simple';
import CreateCompetition from './pages/CreateCompetition.simple';
import CompetitionDetails from './pages/CompetitionDetails.simple';
import WalletPage from './pages/WalletPage.simple';

// Import test components
import WalletConnectionTest from './components/WalletConnectionTest';
import CompetitionDataTest from './components/CompetitionDataTest';
import CompetitionResolver from './components/CompetitionResolver';

function App() {
  // Set up Solana network to devnet for testing
  const network = WalletAdapterNetwork.Devnet;

  // Set up custom RPC endpoint from environment variable
  const endpoint = useMemo(() => {
    // Use the Helius RPC endpoint from .env instead of default cluster URL
    return import.meta.env.VITE_SOLANA_RPC_URL || clusterApiUrl(network);
  }, [network]);

  // Set up wallet providers
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <Router>
            <div className="min-h-screen flex flex-col bg-gray-900 text-white">
              <MinimalNavbar />
              <main className="flex-grow pt-16">
                <Routes>
                  <Route path="/" element={<WalletPage />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/browse" element={<BrowseCompetitions />} />
                  <Route path="/competition/:id" element={<CompetitionDetails />} />
                  <Route path="/create" element={<CreateCompetition />} />
                  <Route path="/test-wallet" element={<WalletConnectionTest />} />
                  <Route path="/test-competitions" element={<CompetitionDataTest />} />
                  <Route path="/resolve" element={<CompetitionResolver />} />
                  <Route path="*" element={
                    <div className="container mx-auto px-4 mt-8">
                      <h1 className="text-4xl font-bold text-center mb-6">Page Not Found</h1>
                      <p className="text-center text-lg mb-8">
                        The page you're looking for doesn't exist or has been moved.
                      </p>
                    </div>
                  } />
                </Routes>
              </main>
              <MinimalFooter />
            </div>
          </Router>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
