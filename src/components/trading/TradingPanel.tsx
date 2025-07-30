// Main trading panel with buy/sell functionality
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, BarChart3, Zap, Shield } from 'lucide-react';
import { Stock } from '../../types';
import { useApp } from '../../context/AppContext';
import { GlassCard } from '../common/GlassCard';
import { Button } from '../common/Button';
import { formatCurrency, formatPercent, generatePositionId } from '../../utils/formatters';
import { calculatePnL } from '../../utils/formatters';
import toast from 'react-hot-toast';

interface TradingPanelProps {
  selectedStock: Stock;
}

export const TradingPanel: React.FC<TradingPanelProps> = ({ selectedStock }) => {
  const { state, createPosition, getUserBalance } = useApp();
  const [activeTab, setActiveTab] = useState<'spot' | 'leveraged' | 'short'>('spot');
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  const [leverage, setLeverage] = useState(2);
  const [limitPrice, setLimitPrice] = useState('');
  const [isTrading, setIsTrading] = useState(false);

  const usdtBalance = getUserBalance('USDT');
  const stockBalance = getUserBalance(selectedStock.symbol);
  
  const maxAmount = side === 'buy' 
    ? (usdtBalance?.balance || 0) / selectedStock.price
    : (stockBalance?.balance || 0);

  const totalCost = parseFloat(amount || '0') * selectedStock.price;
  const leveragedAmount = activeTab === 'leveraged' ? totalCost * leverage : totalCost;

  const handleTrade = async () => {
    if (!state.wallet) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (parseFloat(amount) > maxAmount) {
      toast.error('Insufficient balance');
      return;
    }

    setIsTrading(true);

    try {
      // Simulate trade execution
      await new Promise(resolve => setTimeout(resolve, 2000));

      if (activeTab === 'leveraged' || activeTab === 'short') {
        // Create a leveraged position
        const position = {
          id: generatePositionId(),
          symbol: selectedStock.symbol,
          type: (activeTab === 'short' ? 'short' : 'long') as 'long' | 'short',
          size: parseFloat(amount),
          entryPrice: selectedStock.price,
          currentPrice: selectedStock.price,
          leverage: activeTab === 'leveraged' ? leverage : 1,
          pnl: 0,
          pnlPercent: 0,
          margin: totalCost / (activeTab === 'leveraged' ? leverage : 1),
          liquidationPrice: activeTab === 'short' 
            ? selectedStock.price * 1.8
            : selectedStock.price * 0.2,
          timestamp: Date.now(),
          status: 'open' as const
        };

        createPosition(position);
        toast.success(`${activeTab === 'short' ? 'Short' : 'Leveraged'} position opened!`, {
          icon: '🚀'
        });
      } else {
        // Spot trade
        toast.success(`${side === 'buy' ? 'Bought' : 'Sold'} ${amount} ${selectedStock.symbol}!`, {
          icon: side === 'buy' ? '💰' : '💸'
        });
      }

      setAmount('');
    } catch (error) {
      toast.error('Trade failed. Please try again.');
    } finally {
      setIsTrading(false);
    }
  };

  const tabs = [
    { id: 'spot', label: 'Spot Trading', icon: BarChart3, color: 'blue' },
    { id: 'leveraged', label: 'Leveraged Long', icon: TrendingUp, color: 'green' },
    { id: 'short', label: 'Short Trading', icon: TrendingDown, color: 'red' }
  ];

  return (
    <GlassCard className="h-full">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Trade {selectedStock.symbol}</h2>
          <div className="text-right">
            <div className="text-lg font-bold text-white">
              {formatCurrency(selectedStock.price)}
            </div>
            <div className={`text-sm font-medium ${
              selectedStock.changePercent24h >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {formatPercent(selectedStock.changePercent24h)}
            </div>
          </div>
        </div>

        {/* Trading Mode Tabs */}
        <div className="flex space-x-1 bg-purple-800/30 rounded-xl p-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-2 rounded-lg transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-purple-300 hover:text-white hover:bg-purple-700/30'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="text-sm font-medium hidden sm:block">{tab.label}</span>
              <span className="text-sm font-medium sm:hidden">{tab.id}</span>
            </button>
          ))}
        </div>

        {/* Trading Form */}
        <div className="space-y-4">
          {/* Order Type */}
          <div className="flex space-x-2">
            <button
              onClick={() => setOrderType('market')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                orderType === 'market'
                  ? 'bg-purple-600 text-white'
                  : 'bg-purple-800/30 text-purple-300 hover:text-white'
              }`}
            >
              Market
            </button>
            <button
              onClick={() => setOrderType('limit')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                orderType === 'limit'
                  ? 'bg-purple-600 text-white'
                  : 'bg-purple-800/30 text-purple-300 hover:text-white'
              }`}
            >
              Limit
            </button>
          </div>

          {/* Buy/Sell for Spot Trading */}
          {activeTab === 'spot' && (
            <div className="flex space-x-2">
              <button
                onClick={() => setSide('buy')}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  side === 'buy'
                    ? 'bg-green-600 text-white'
                    : 'bg-green-800/30 text-green-300 hover:text-white'
                }`}
              >
                Buy
              </button>
              <button
                onClick={() => setSide('sell')}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  side === 'sell'
                    ? 'bg-red-600 text-white'
                    : 'bg-red-800/30 text-red-300 hover:text-white'
                }`}
              >
                Sell
              </button>
            </div>
          )}

          {/* Leverage Slider for Leveraged Trading */}
          {activeTab === 'leveraged' && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm text-purple-200">Leverage</label>
                <span className="text-sm font-bold text-white">{leverage}x</span>
              </div>
              <input
                type="range"
                min="1"
                max="20"
                value={leverage}
                onChange={(e) => setLeverage(parseInt(e.target.value))}
                className="w-full h-2 bg-purple-800/30 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-purple-400">
                <span>1x</span>
                <span>10x</span>
                <span>20x</span>
              </div>
            </div>
          )}

          {/* Amount Input */}
          <div className="space-y-2">
            <label className="text-sm text-purple-200">Amount ({selectedStock.symbol})</label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-3 bg-purple-800/30 border border-purple-500/30 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 transition-colors"
              />
              <button
                onClick={() => setAmount(maxAmount.toString())}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-purple-400 hover:text-purple-300 transition-colors"
              >
                MAX
              </button>
            </div>
            <div className="flex justify-between text-xs text-purple-400">
              <span>Available: {maxAmount.toFixed(4)} {side === 'buy' ? selectedStock.symbol : 'USDT'}</span>
              <span>≈ {formatCurrency(totalCost)}</span>
            </div>
          </div>

          {/* Limit Price for Limit Orders */}
          {orderType === 'limit' && (
            <div className="space-y-2">
              <label className="text-sm text-purple-200">Limit Price (USDT)</label>
              <input
                type="number"
                value={limitPrice}
                onChange={(e) => setLimitPrice(e.target.value)}
                placeholder={selectedStock.price.toString()}
                className="w-full px-4 py-3 bg-purple-800/30 border border-purple-500/30 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 transition-colors"
              />
            </div>
          )}

          {/* Trade Summary */}
          <div className="bg-purple-800/30 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-purple-200">Total Cost:</span>
              <span className="text-white font-medium">
                {formatCurrency(totalCost)}
              </span>
            </div>
            {activeTab === 'leveraged' && (
              <div className="flex justify-between text-sm">
                <span className="text-purple-200">Margin Required:</span>
                <span className="text-white font-medium">
                  {formatCurrency(totalCost / leverage)}
                </span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-purple-200">Trading Fee:</span>
              <span className="text-white font-medium">
                {formatCurrency(totalCost * 0.001)}
              </span>
            </div>
          </div>

          {/* Trade Button */}
          <Button
            onClick={handleTrade}
            loading={isTrading}
            disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > maxAmount}
            className="w-full py-4 text-lg font-bold"
            variant={activeTab === 'short' ? 'danger' : activeTab === 'leveraged' ? 'success' : 'primary'}
          >
            {activeTab === 'spot' && `${side === 'buy' ? 'Buy' : 'Sell'} ${selectedStock.symbol}`}
            {activeTab === 'leveraged' && `Open Long Position`}
            {activeTab === 'short' && `Open Short Position`}
          </Button>
        </div>
      </div>
    </GlassCard>
  );
};