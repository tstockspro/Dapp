// Stock list component with real-time prices
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Search, Star } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { GlassCard } from '../common/GlassCard';
import { formatCurrency, formatPercent, formatNumber } from '../../utils/formatters';
import { Stock } from '../../types';

interface StockListProps {
  onStockSelect: (stock: Stock) => void;
  selectedStock?: Stock;
}

export const StockList: React.FC<StockListProps> = ({ onStockSelect, selectedStock }) => {
  const { state } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState<string[]>(['TSLA', 'NVDA']);

  const filteredStocks = state.stocks.filter(stock => 
    stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stock.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleFavorite = (symbol: string) => {
    setFavorites(prev => 
      prev.includes(symbol) 
        ? prev.filter(s => s !== symbol)
        : [...prev, symbol]
    );
  };

  return (
    <GlassCard className="h-full">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Markets</h2>
          <div className="text-sm text-purple-300">
            {filteredStocks.length} stocks
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-400" />
          <input
            type="text"
            placeholder="Search stocks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-purple-800/30 border border-purple-500/30 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 transition-colors"
          />
        </div>

        {/* Stock List */}
        <div className="space-y-2 max-h-[600px] overflow-y-auto custom-scrollbar">
          {filteredStocks.map((stock, index) => (
            <StockItem
              key={stock.id}
              stock={stock}
              isSelected={selectedStock?.id === stock.id}
              isFavorite={favorites.includes(stock.symbol)}
              onSelect={() => onStockSelect(stock)}
              onToggleFavorite={() => toggleFavorite(stock.symbol)}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </GlassCard>
  );
};

interface StockItemProps {
  stock: Stock;
  isSelected: boolean;
  isFavorite: boolean;
  onSelect: () => void;
  onToggleFavorite: () => void;
  delay: number;
}

const StockItem: React.FC<StockItemProps> = ({ 
  stock, 
  isSelected, 
  isFavorite,
  onSelect, 
  onToggleFavorite,
  delay 
}) => {
  const isPositive = stock.changePercent24h >= 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className={`p-4 rounded-xl cursor-pointer transition-all duration-200 ${
        isSelected 
          ? 'bg-purple-600/40 border border-purple-400/50' 
          : 'bg-purple-800/20 hover:bg-purple-700/30 border border-purple-500/10'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Stock Logo */}
          <div className="relative">
            <img 
              src={stock.logo} 
              alt={stock.symbol}
              className="w-10 h-10 rounded-lg object-contain bg-white/10 p-1"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `data:image/svg+xml;base64,${btoa(`
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
                    <rect width="40" height="40" fill="#6d44b8"/>
                    <text x="20" y="24" text-anchor="middle" fill="white" font-family="Arial" font-size="12" font-weight="bold">
                      ${stock.symbol.slice(0, 2)}
                    </text>
                  </svg>
                `)}`;
              }}
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite();
              }}
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center hover:bg-purple-500 transition-colors"
            >
              <Star 
                className={`w-3 h-3 ${
                  isFavorite ? 'text-yellow-400 fill-current' : 'text-white'
                }`} 
              />
            </button>
          </div>
          
          {/* Stock Info */}
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-white">{stock.symbol}</span>
              {isPositive ? (
                <TrendingUp className="w-4 h-4 text-green-400" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-400" />
              )}
            </div>
            <p className="text-sm text-purple-300 truncate max-w-[120px]">
              {stock.name}
            </p>
          </div>
        </div>
        
        {/* Price Info */}
        <div className="text-right">
          <div className="font-bold text-white">
            {formatCurrency(stock.price)}
          </div>
          <div className={`text-sm font-medium ${
            isPositive ? 'text-green-400' : 'text-red-400'
          }`}>
            {formatPercent(stock.changePercent24h)}
          </div>
        </div>
      </div>
      
      {/* Additional Info */}
      <div className="mt-3 flex justify-between text-xs text-purple-400">
        <span>Vol: {formatNumber(stock.volume24h)}</span>
        <span>MCap: {formatNumber(stock.marketCap)}</span>
      </div>
    </motion.div>
  );
};