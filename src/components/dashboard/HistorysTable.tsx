// Positions table component
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, X, ExternalLink, AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { GlassCard } from '../common/GlassCard';
import { Button } from '../common/Button';
import { formatCurrency, formatPercent, formatTimeAgo, formatLeverage } from '../../utils/formatters';
import toast from 'react-hot-toast';
import { stat } from 'fs';

export const HistorysTable: React.FC = () => {
  const { state, closePosition } = useApp();
  const [closingPosition, setClosingPosition] = useState<string | null>(null);

  const handleClosePosition = async (positionId: string) => {
    setClosingPosition(positionId);
    
    try {
      // Simulate position closing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      closePosition(positionId);
      toast.success('Position closed successfully!', {
        icon: '✅'
      });
    } catch (error) {
      toast.error('Failed to close position');
    } finally {
      setClosingPosition(null);
    }
  };

  const getTotalPnL = () => {
    return state.positions.reduce((total, pos) => total + pos.pnl, 0);
  };

  const getUnrealizedPnL = () => {
    return state.positions.filter(pos => pos.status === 'open').reduce((total, pos) => total + pos.pnl, 0);
  };

  const totalPnL = getTotalPnL();
  const unrealizedPnL = getUnrealizedPnL();

  return (
    <GlassCard className="w-full">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">History</h2>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-xs text-purple-200">Total Trade </p>
              <p className={`text-lg font-bold text-green-400`}>
                {state.historyCount}
              </p>
            </div>
          </div>
        </div>

        {/* Positions List */}
        {state.history.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-purple-400" />
            </div>
            <p className="text-purple-300 mb-2">No trade history </p>
            <p className="text-sm text-purple-400">Start trading to see your history here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {state.history.map((history, index) => (
              <HistoryCard
                key={history.id}
                history={history}
                onClose={() => handleClosePosition(history.id)}
                isClosing={closingPosition === history.id}
                delay={index * 0.1}
              />
            ))}
          </div>
        )}
      </div>
    </GlassCard>
  );
};

interface HistoryCardProps {
  history: any;
  onClose: () => void;
  isClosing: boolean;
  delay: number;
}

const HistoryCard: React.FC<HistoryCardProps> = ({ history, onClose, isClosing, delay }) => {
  const isBuy = history.type == "buy" ? true : false
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-purple-800/20 border border-purple-500/20 rounded-xl p-4 hover:bg-purple-700/30 transition-colors"
    >
      <div className="flex items-center justify-between">
        {/* Position Info */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <img
            src={history.logo}
            className='w-10 h-10'
            />
            <span className="font-bold text-white">{history.symbol}</span>
            <span className={`text-xs px-2 py-1 rounded-full ${
              isBuy ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'
            }`}>
              {history.type.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="small"
            onClick={() => window.open(`https://solscan.io/tx/${history.id}`, '_blank')}
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
          
        </div>
      </div>

      {/* Position Details */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
        <div>
          <p className="text-purple-400">Size</p>
          <p className="text-white font-medium">{history.amountToken} {history.symbol}</p>
        </div>
        
        <div>
          <p className="text-purple-400">Entry Price</p>
          <p className="text-white font-medium">{formatCurrency(history.entryPrice)}</p>
        </div>
        
        <div>
          <p className="text-purple-400">Current Price</p>
          <p className="text-white font-medium">{formatCurrency(history.currentPrice)}</p>
        </div>
      
      </div>
      
      {/* Time */}
      <div className="mt-3 flex justify-between items-center text-xs text-purple-400">
        <span>Opened {formatTimeAgo(history.timestamp)}</span>
        <span className={`px-2 py-1 rounded-full ${
          history.type === 'open' 
            ? 'bg-green-600/20 text-green-400' 
            : 'bg-gray-600/20 text-gray-400'
        }`}>
          {history.type.toUpperCase()}
        </span>
      </div>
    </motion.div>
  );
};