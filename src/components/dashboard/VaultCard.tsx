// Vault card component for LP token management
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, TrendingUp, Shield, Target, AlertCircle } from 'lucide-react';
import { VaultInfo } from '../../types';
import { GlassCard } from '../common/GlassCard';
import { Button } from '../common/Button';
import { formatCurrency, formatPercent, formatNumber } from '../../utils/formatters';
import toast from 'react-hot-toast';

interface VaultCardProps {
  vault: VaultInfo;
  delay?: number;
}

export const VaultCard: React.FC<VaultCardProps> = ({ vault, delay = 0 }) => {
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [isDepositing, setIsDepositing] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const handleDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) < vault.minDeposit) {
      toast.error(`Minimum deposit is ${formatCurrency(vault.minDeposit)}`);
      return;
    }

    setIsDepositing(true);
    
    try {
      // Simulate deposit transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success(`Deposited ${formatCurrency(parseFloat(depositAmount))} to ${vault.name}!`, {
        icon: '💰'
      });
      
      setDepositAmount('');
      setShowDepositModal(false);
    } catch (error) {
      toast.error('Deposit failed. Please try again.');
    } finally {
      setIsDepositing(false);
    }
  };

  const handleWithdraw = async () => {
    if (vault.userDeposit === 0) {
      toast.error('No funds to withdraw');
      return;
    }

    setIsWithdrawing(true);
    
    try {
      // Simulate withdrawal transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success(`Withdrew ${formatCurrency(vault.userDeposit)} from ${vault.name}!`, {
        icon: '💸'
      });
    } catch (error) {
      toast.error('Withdrawal failed. Please try again.');
    } finally {
      setIsWithdrawing(false);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-red-400';
      default: return 'text-purple-400';
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'low': return Shield;
      case 'medium': return AlertCircle;
      case 'high': return Target;
      default: return Shield;
    }
  };

  const RiskIcon = getRiskIcon(vault.riskLevel);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
      >
        <GlassCard className="h-full" hover>
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">{vault.name}</h3>
                <p className="text-sm text-purple-300 mt-1">{vault.description}</p>
              </div>
              <div className={`flex items-center space-x-1 ${getRiskColor(vault.riskLevel)}`}>
                <RiskIcon className="w-4 h-4" />
                <span className="text-xs font-medium uppercase">{vault.riskLevel}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-purple-800/30 rounded-lg p-3">
                <p className="text-xs text-purple-400">APR</p>
                <p className="text-xl font-bold text-green-400">{formatPercent(vault.apr)}</p>
              </div>
              <div className="bg-purple-800/30 rounded-lg p-3">
                <p className="text-xs text-purple-400">TVL</p>
                <p className="text-xl font-bold text-white">{formatNumber(vault.tvl)}</p>
              </div>
            </div>

            {/* Strategy */}
            <div className="bg-purple-800/20 rounded-lg p-3">
              <p className="text-xs text-purple-400 mb-1">Strategy</p>
              <p className="text-sm text-white">{vault.strategy}</p>
            </div>

            {/* User Position */}
            {vault.userDeposit > 0 && (
              <div className="bg-purple-600/20 rounded-lg p-3 border border-purple-400/30">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-purple-200">Your Deposit</span>
                  <span className="text-lg font-bold text-white">
                    {formatCurrency(vault.userDeposit)}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-purple-300">Estimated Yearly Yield</span>
                  <span className="text-sm font-medium text-green-400">
                    {formatCurrency(vault.userDeposit * (vault.apr / 100))}
                  </span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex space-x-2">
              <Button
                onClick={() => setShowDepositModal(true)}
                className="flex-1 flex items-center justify-center space-x-2"
                variant="primary"
              >
                <Plus className="w-4 h-4" />
                <span>Deposit</span>
              </Button>
              
              {vault.userDeposit > 0 && (
                <Button
                  onClick={handleWithdraw}
                  loading={isWithdrawing}
                  className="flex-1 flex items-center justify-center space-x-2"
                  variant="outline"
                >
                  <Minus className="w-4 h-4" />
                  <span>Withdraw</span>
                </Button>
              )}
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md"
          >
            <GlassCard>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">Deposit to {vault.name}</h3>
                  <button
                    onClick={() => setShowDepositModal(false)}
                    className="text-purple-400 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-purple-200">Amount (USDT)</label>
                    <input
                      type="number"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      placeholder={`Min: ${vault.minDeposit}`}
                      className="w-full mt-1 px-4 py-3 bg-purple-800/30 border border-purple-500/30 rounded-xl text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 transition-colors"
                    />
                  </div>

                  <div className="bg-purple-800/30 rounded-lg p-3 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-purple-200">Minimum Deposit:</span>
                      <span className="text-white">{formatCurrency(vault.minDeposit)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-200">Expected APR:</span>
                      <span className="text-green-400 font-medium">{formatPercent(vault.apr)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-200">Risk Level:</span>
                      <span className={getRiskColor(vault.riskLevel)}>{vault.riskLevel.toUpperCase()}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      onClick={() => setShowDepositModal(false)}
                      variant="outline"
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleDeposit}
                      loading={isDepositing}
                      className="flex-1"
                    >
                      Deposit
                    </Button>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      )}
    </>
  );
};