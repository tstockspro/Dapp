// Positions table component
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, X, ExternalLink, AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { GlassCard } from '../common/GlassCard';
import { Button } from '../common/Button';
import { formatCurrency, formatPercent, formatTimeAgo, formatLeverage } from '../../utils/formatters';
import toast from 'react-hot-toast';

export const PositionsTable: React.FC = () => {
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
          <h2 className="text-xl font-bold text-white">Positions</h2>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-xs text-purple-200">Unrealized P&L</p>
              <p className={`text-lg font-bold ${
                unrealizedPnL >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {unrealizedPnL >= 0 ? '+' : ''}{formatCurrency(unrealizedPnL)}
              </p>
            </div>
          </div>
        </div>

        {/* Positions List */}
        {state.positions.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-purple-400" />
            </div>
            <p className="text-purple-300 mb-2">No open positions</p>
            <p className="text-sm text-purple-400">Start trading to see your positions here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {state.positions.map((position, index) => (
              <PositionCard
                key={position.id}
                position={position}
                onClose={() => handleClosePosition(position.id)}
                isClosing={closingPosition === position.id}
                delay={index * 0.1}
              />
            ))}
          </div>
        )}
      </div>
    </GlassCard>
  );
};

interface PositionCardProps {
  position: any;
  onClose: () => void;
  isClosing: boolean;
  delay: number;
}

const PositionCard: React.FC<PositionCardProps> = ({ position, onClose, isClosing, delay }) => {
  const isProfit = position.pnl >= 0;
  const isLong = position.type === 'long';
  const liquidationRisk = Math.abs(position.currentPrice - position.liquidationPrice) / position.currentPrice < 0.1;

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
            {isLong ? (
              <TrendingUp className="w-5 h-5 text-green-400" />
            ) : (
              <TrendingDown className="w-5 h-5 text-red-400" />
            )}
            <span className="font-bold text-white">{position.symbol}</span>
            <span className={`text-xs px-2 py-1 rounded-full ${
              isLong ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'
            }`}>
              {position.type.toUpperCase()}
            </span>
            {position.leverage > 1 && (
              <span className="text-xs px-2 py-1 rounded-full bg-purple-600/20 text-purple-400">
                {formatLeverage(position.leverage)}
              </span>
            )}
          </div>
          
          {liquidationRisk && (
            <div className="flex items-center space-x-1 text-yellow-400">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-xs">High Risk</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="small"
            onClick={() => window.open(`https://tonscan.org/tx/${position.id}`, '_blank')}
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
          
          <Button
            variant="danger"
            size="small"
            onClick={onClose}
            loading={isClosing}
            disabled={isClosing}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Position Details */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
        <div>
          <p className="text-purple-400">Size</p>
          <p className="text-white font-medium">{position.size} {position.symbol}</p>
        </div>
        
        <div>
          <p className="text-purple-400">Entry Price</p>
          <p className="text-white font-medium">{formatCurrency(position.entryPrice)}</p>
        </div>
        
        <div>
          <p className="text-purple-400">Current Price</p>
          <p className="text-white font-medium">{formatCurrency(position.currentPrice)}</p>
        </div>
        
        <div>
          <p className="text-purple-400">P&L</p>
          <div className={`font-bold ${
            isProfit ? 'text-green-400' : 'text-red-400'
          }`}>
            <p>{formatCurrency(position.pnl)}</p>
            <p className="text-xs">{formatPercent(position.pnlPercent)}</p>
          </div>
        </div>
        
        <div>
          <p className="text-purple-400">Margin</p>
          <p className="text-white font-medium">{formatCurrency(position.margin)}</p>
        </div>
        
        <div>
          <p className="text-purple-400">Liquidation</p>
          <p className={`font-medium ${
            liquidationRisk ? 'text-yellow-400' : 'text-purple-300'
          }`}>
            {formatCurrency(position.liquidationPrice)}
          </p>
        </div>
      </div>
      
      {/* Time */}
      <div className="mt-3 flex justify-between items-center text-xs text-purple-400">
        <span>Opened {formatTimeAgo(position.timestamp)}</span>
        <span className={`px-2 py-1 rounded-full ${
          position.status === 'open' 
            ? 'bg-green-600/20 text-green-400' 
            : 'bg-gray-600/20 text-gray-400'
        }`}>
          {position.status.toUpperCase()}
        </span>
      </div>
    </motion.div>
  );
};