// Header component with wallet connection and navigation
import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Wallet, Menu, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatAddress } from '../../utils/formatters';
import { WalletConnect } from '../wallet/WalletConnect';

interface HeaderProps {
  onMenuToggle: () => void;
  isMobileMenuOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle, isMobileMenuOpen }) => {
  const { state, getTotalPortfolioValue } = useApp();
  const totalValue = getTotalPortfolioValue();

  return (
    <motion.header 
      className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-900/90 via-purple-800/90 to-purple-900/90 backdrop-blur-xl border-b border-purple-500/30"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-3">
          <motion.div 
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Tstocks</h1>
              <p className="text-xs text-purple-200 -mt-1">DeFi Trading</p>
            </div>
          </motion.div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <NavLink href="#" active>Dapp</NavLink>
        </nav>

        {/* Portfolio Value & Wallet */}
        <div className="flex items-center space-x-4">
          {state.wallet && (
            <motion.div 
              className="hidden sm:block text-right"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-xs text-purple-200">Portfolio Value</p>
              <p className="text-lg font-bold text-white">{formatCurrency(state.wallet.balance)}</p>
            </motion.div>
          )}
          
          <WalletConnect />
          
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuToggle}
            className="md:hidden p-2 rounded-lg bg-purple-700/50 text-white hover:bg-purple-600/50 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </motion.header>
  );
};

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  active?: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children, active = false }) => {
  return (
    <motion.a
      href={href}
      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
        active 
          ? 'bg-purple-600/50 text-white shadow-lg shadow-purple-500/25' 
          : 'text-purple-200 hover:text-white hover:bg-purple-700/30'
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.a>
  );
};