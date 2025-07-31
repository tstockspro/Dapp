// Main trading dashboard component
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { StockList } from './trading/StockList';
import { TradingPanel } from './trading/TradingPanel';
import { PositionsTable } from './dashboard/PositionsTable';
import { PortfolioOverview, AssetBreakdown } from './dashboard/PortfolioOverview';
import { VaultCard } from './dashboard/VaultCard';
import { DepositModal } from './dashboard/DepositModal';
import { Button } from './common/Button';
import { useApp } from '../context/AppContext';
import { mockVaults } from '../data/mockData';
import { Stock } from '../types';

export const TradingDashboard: React.FC = () => {
  const { state } = useApp();
  const [selectedStock, setSelectedStock] = useState<Stock>(state.stocks[0]);
  const [activeTab, setActiveTab] = useState<'trading' | 'portfolio' | 'vaults'>('trading');
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);

  const tabs = [
    { id: 'trading', label: 'Trading', description: 'Spot & Leveraged Trading' },
    { id: 'portfolio', label: 'Portfolio', description: 'Positions & P&L' },
    { id: 'vaults', label: 'Vaults', description: 'LP Tokens & Staking' }
  ];

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Portfolio Overview */}
      <PortfolioOverview />

      {/* Tab Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <div className="flex space-x-1 bg-purple-800/30 rounded-xl p-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 rounded-lg transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-purple-300 hover:text-white hover:bg-purple-700/30'
              }`}
            >
              <div className="text-left">
                <p className="font-medium">{tab.label}</p>
                <p className="text-xs opacity-75">{tab.description}</p>
              </div>
            </button>
          ))}
        </div>

        <Button
          onClick={() => setIsDepositModalOpen(true)}
          className="flex items-center space-x-2"
        >
          <div className='flex'>
            <Plus className="w-4 h-4" />
            <span>Deposit Funds</span>
          </div>
        </Button>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'trading' && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Stock List */}
            <div className="xl:col-span-1">
              <StockList 
                onStockSelect={setSelectedStock}
                selectedStock={selectedStock}
              />
            </div>
            
            {/* Trading Panel */}
            <div className="xl:col-span-2">
              <TradingPanel selectedStock={selectedStock} />
            </div>
          </div>
        )}

        {activeTab === 'portfolio' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <PositionsTable />
              </div>
              <div>
                <AssetBreakdown />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'vaults' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Yield Vaults</h2>
              <p className="text-purple-300">
                Stake your assets in automated yield strategies
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockVaults.map((vault, index) => (
                <VaultCard
                  key={vault.id}
                  vault={vault}
                  delay={index * 0.1}
                />
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Deposit Modal */}
      <DepositModal
        isOpen={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
      />
    </div>
  );
};