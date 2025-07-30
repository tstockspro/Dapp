// Portfolio overview component with balance and performance
import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, PieChart, BarChart3 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { GlassCard } from '../common/GlassCard';
import { formatCurrency, formatPercent, formatNumber } from '../../utils/formatters';

export const PortfolioOverview: React.FC = () => {
  const { state, getTotalPortfolioValue } = useApp();
  
  const totalValue = getTotalPortfolioValue();
  const totalPnL = state.positions.reduce((sum, pos) => sum + pos.pnl, 0);
  const totalPnLPercent = totalValue > 0 ? (totalPnL / (totalValue - totalPnL)) * 100 : 0;
  const openPositions = state.positions.filter(pos => pos.status === 'open').length;
  
  const stats = [
    {
      label: 'Total Portfolio Value',
      value: formatCurrency(totalValue),
      change: '+3.2%',
      changeValue: '+$1,245',
      icon: DollarSign,
      color: 'text-white'
    },
    {
      label: 'Total P&L',
      value: totalPnL >= 0 ? `+${formatCurrency(totalPnL)}` : formatCurrency(totalPnL),
      change: formatPercent(totalPnLPercent),
      changeValue: '24h',
      icon: totalPnL >= 0 ? TrendingUp : TrendingDown,
      color: totalPnL >= 0 ? 'text-green-400' : 'text-red-400'
    },
    {
      label: 'Open Positions',
      value: openPositions.toString(),
      change: 'Active',
      changeValue: `${state.positions.length} total`,
      icon: BarChart3,
      color: 'text-purple-400'
    },
    {
      label: 'Available Balance',
      value: formatCurrency(state.balances.find(b => b.asset === 'USDT')?.balance || 0),
      change: 'USDT',
      changeValue: 'Ready to trade',
      icon: PieChart,
      color: 'text-blue-400'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <GlassCard className="h-full" hover>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-xl bg-purple-600/20 ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="text-right">
                  <p className="text-xs text-purple-400">{stat.changeValue}</p>
                  <p className={`text-sm font-medium ${
                    stat.change.startsWith('+') ? 'text-green-400' : 'text-purple-300'
                  }`}>
                    {stat.change}
                  </p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-purple-300 mb-1">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      ))}
    </div>
  );
};

export const AssetBreakdown: React.FC = () => {
  const { state } = useApp();
  const totalValue = state.balances.reduce((sum, balance) => sum + balance.usdValue, 0);

  return (
    <GlassCard>
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white">Asset Breakdown</h3>
        
        <div className="space-y-3">
          {state.balances.map((balance, index) => {
            const percentage = totalValue > 0 ? (balance.usdValue / totalValue) * 100 : 0;
            
            return (
              <motion.div
                key={balance.asset}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-600/20 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-bold text-purple-300">
                        {balance.asset.slice(0, 2)}
                      </span>
                    </div>
                    <div>
                      <p className="text-white font-medium">{balance.asset}</p>
                      <p className="text-sm text-purple-400">
                        {balance.balance.toFixed(4)} {balance.asset}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-white font-medium">
                      {formatCurrency(balance.usdValue)}
                    </p>
                    <p className="text-sm text-purple-400">
                      {percentage.toFixed(1)}%
                    </p>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-purple-800/30 rounded-full h-2">
                  <motion.div
                    className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </GlassCard>
  );
};