import React, {  useEffect, useState  } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const Navbar = () => {
  const { publicKey } = useWallet();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scrolling effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className={`fixed w-full z-20 transition-all duration-300 ${
      isScrolled ? 'bg-dark-gray shadow-lg' : 'bg-dark-gray/80 backdrop-blur-md'
    }`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-space font-bold gradient-text">Finfun.xyz</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {publicKey ? (
              <>
                <Link 
                  to="/dashboard" 
                  className={`font-medium hover:text-neon-blue transition-colors ${
                    isActive('/dashboard') ? 'text-neon-blue' : 'text-light-gray'
                  }`}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/browse" 
                  className={`font-medium hover:text-neon-blue transition-colors ${
                    isActive('/browse') ? 'text-neon-blue' : 'text-light-gray'
                  }`}
                >
                  Browse
                </Link>
                <Link 
                  to="/create" 
                  className={`font-medium hover:text-neon-blue transition-colors ${
                    isActive('/create') ? 'text-neon-blue' : 'text-light-gray'
                  }`}
                >
                  Create
                </Link>
                <Link 
                  to="/wallet" 
                  className={`font-medium hover:text-neon-blue transition-colors ${
                    isActive('/wallet') ? 'text-neon-blue' : 'text-light-gray'
                  }`}
                >
                  Wallet
                </Link>
              </>
            ) : (
              <Link 
                to="/browse" 
                className={`font-medium hover:text-neon-blue transition-colors ${
                  isActive('/browse') ? 'text-neon-blue' : 'text-light-gray'
                }`}
              >
                Browse
              </Link>
            )}
            <WalletMultiButton className="!bg-neon-blue hover:!bg-neon-blue/90 !rounded-lg" />
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-4">
            <WalletMultiButton className="!bg-neon-blue hover:!bg-neon-blue/90 !rounded-lg !py-2 !px-3 !text-sm" />
            <button
              onClick={toggleMobileMenu}
              className="text-light-gray hover:text-neon-blue focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-700">
            <div className="flex flex-col space-y-4 pt-4">
              {publicKey && (
                <>
                  <Link 
                    to="/dashboard" 
                    className={`font-medium hover:text-neon-blue transition-colors ${
                      isActive('/dashboard') ? 'text-neon-blue' : 'text-light-gray'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                </>
              )}
              <Link 
                to="/browse" 
                className={`font-medium hover:text-neon-blue transition-colors ${
                  isActive('/browse') ? 'text-neon-blue' : 'text-light-gray'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Browse
              </Link>
              {publicKey && (
                <>
                  <Link 
                    to="/create" 
                    className={`font-medium hover:text-neon-blue transition-colors ${
                      isActive('/create') ? 'text-neon-blue' : 'text-light-gray'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Create
                  </Link>
                  <Link 
                    to="/wallet" 
                    className={`font-medium hover:text-neon-blue transition-colors ${
                      isActive('/wallet') ? 'text-neon-blue' : 'text-light-gray'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Wallet
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
