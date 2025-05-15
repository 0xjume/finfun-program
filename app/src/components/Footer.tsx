import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark-gray border-t border-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-space font-bold gradient-text">Finfun.xyz</span>
            </Link>
            <p className="mt-4 text-gray-400 text-sm">
              Create and join price prediction competitions on Solana. Test your market forecasting skills and win SOL!
            </p>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-lg font-space font-medium text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-neon-blue transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/browse" className="text-gray-400 hover:text-neon-blue transition-colors">
                  Browse Competitions
                </Link>
              </li>
              <li>
                <Link to="/create" className="text-gray-400 hover:text-neon-blue transition-colors">
                  Create Competition
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-lg font-space font-medium text-white mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://docs.solana.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-neon-blue transition-colors"
                >
                  Solana Docs
                </a>
              </li>
              <li>
                <a 
                  href="https://helius.dev/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-neon-blue transition-colors"
                >
                  Helius API
                </a>
              </li>
              <li>
                <a 
                  href="https://ave.ai/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-neon-blue transition-colors"
                >
                  Ave.ai
                </a>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-lg font-space font-medium text-white mb-4">Connect</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://twitter.com/finfunxyz" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-neon-blue transition-colors"
                >
                  Twitter
                </a>
              </li>
              <li>
                <a 
                  href="https://discord.gg/finfun" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-neon-blue transition-colors"
                >
                  Discord
                </a>
              </li>
              <li>
                <a 
                  href="mailto:info@finfun.xyz" 
                  className="text-gray-400 hover:text-neon-blue transition-colors"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-800 text-center text-gray-400 text-sm">
          <p>© {currentYear} Finfun.xyz. All rights reserved.</p>
          <p className="mt-2">
            <span className="inline-block mr-2 text-sol-orange">Powered by</span>
            <a 
              href="https://solana.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-neon-blue hover:underline"
            >
              Solana
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
