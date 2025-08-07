// Deposit modal with QR codes and multi-chain support
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, QrCode, AlertCircle, CheckCircle } from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import { Button } from '../common/Button';
import { mockDepositMethods } from '../../data/mockData';
import { generateQRCode, copyToClipboard, generateWalletAddress } from '../../utils/wallet';
import { formatCurrency } from '../../utils/formatters';
import toast from 'react-hot-toast';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DepositModal: React.FC<DepositModalProps> = ({ isOpen, onClose }) => {
  const [selectedMethod, setSelectedMethod] = useState(mockDepositMethods[0]);
  const [depositAddress, setDepositAddress] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [amount, setAmount] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (isOpen && selectedMethod) {
      generateDepositAddress();
    }
  }, [isOpen, selectedMethod]);

  const generateDepositAddress = async () => {
    setIsGenerating(true);
    
    try {
      // Generate address based on network
      const address = generateWalletAddress(selectedMethod.network);
      setDepositAddress(address);
      
      // Generate QR code
      const qrCodeData = await generateQRCode(address);
      setQrCode(qrCodeData);
    } catch (error) {
      toast.error('Failed to generate deposit address');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyAddress = async () => {
    const success = await copyToClipboard(depositAddress);
    if (success) {
      toast.success('Address copied to clipboard!', {
        icon: '📋'
      });
    }
  };

  const networkIcons: Record<string, string> = {
    'TON': '🔷',
    'Ethereum': '⚪',
    'TRON': '🔴',
    'Solana': '🔵'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 "  >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto  overflow-auto"
            style={{scrollbarWidth: 'none', msOverflowStyle: 'none' }} 
          >
            <GlassCard>
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">Deposit Funds</h2>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg bg-purple-700/30 text-purple-300 hover:text-white hover:bg-purple-600/40 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Network Selection */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-white">Select Network</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {mockDepositMethods.map((method) => (
                      <button
                        key={method.id}
                        onClick={() => setSelectedMethod(method)}
                        className={`p-4 rounded-xl border transition-all duration-200 ${
                          selectedMethod.id === method.id
                            ? 'bg-purple-600/30 border-purple-400/50 text-white'
                            : 'bg-purple-800/20 border-purple-500/20 text-purple-300 hover:border-purple-400/30 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">
                              <img src={method.logo} style={{maxWidth:"40px",maxHeight:"40px"}}/>
                              </span>
                            <div className="text-left">
                              <p className="font-medium">{method.name}</p>
                              <p className="text-sm opacity-75">{method.network}</p>
                            </div>
                          </div>
                          <div className="text-right text-sm">
                            <p>Fee: {method.fee} {method.symbol}</p>
                            <p>{method.processingTime}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Deposit Details */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* QR Code Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Deposit Address</h3>
                    
                    {isGenerating ? (
                      <div className="flex items-center justify-center h-64 bg-purple-800/20 rounded-xl">
                        <div className="text-center">
                          <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                          <p className="text-purple-300">Generating address...</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* QR Code */}
                        <div className="bg-white rounded-xl p-4 flex items-center justify-center">
                          {qrCode ? (
                            <img src={qrCode} alt="Deposit QR Code" className="w-48 h-48" />
                          ) : (
                            <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                              <QrCode className="w-16 h-16 text-gray-400" />
                            </div>
                          )}
                        </div>
                        
                        {/* Address */}
                        <div className="space-y-2">
                          <p className="text-sm text-purple-200">Wallet Address</p>
                          <div className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={depositAddress}
                              readOnly
                              className="flex-1 px-3 py-2 bg-purple-800/30 border border-purple-500/30 rounded-lg text-white text-sm font-mono"
                            />
                            <Button
                              onClick={handleCopyAddress}
                              variant="outline"
                              size="small"
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Instructions Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Instructions</h3>
                    
                    <div className="space-y-3">
                      <div className="bg-purple-800/20 rounded-lg p-4 border border-purple-500/20">
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
                          <div>
                            <p className="text-white font-medium">Send {selectedMethod.symbol}</p>
                            <p className="text-sm text-purple-300 mt-1">
                              Send only {selectedMethod.symbol} to this address on {selectedMethod.network} network
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-purple-800/20 rounded-lg p-4 border border-purple-500/20">
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
                          <div>
                            <p className="text-white font-medium">Wait for Confirmation</p>
                            <p className="text-sm text-purple-300 mt-1">
                              Processing time: {selectedMethod.processingTime}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-purple-800/20 rounded-lg p-4 border border-purple-500/20">
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
                          <div>
                            <p className="text-white font-medium">Start Trading</p>
                            <p className="text-sm text-purple-300 mt-1">
                              Funds will appear in your balance once confirmed
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Important Notes */}
                    <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-4">
                      <div className="flex items-start space-x-2">
                        <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-yellow-300 font-medium text-sm">Important Notes</p>
                          <ul className="text-xs text-yellow-200 mt-2 space-y-1">
                            <li>• Minimum deposit: {formatCurrency(selectedMethod.minDeposit)}</li>
                            <li>• Network fee: {selectedMethod.fee} {selectedMethod.symbol}</li>
                            <li>• Only send {selectedMethod.symbol} on {selectedMethod.network} network</li>
                            <li>• Sending other assets may result in permanent loss</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Deposits */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-white">Recent Deposits</h3>
                  <div className="space-y-2">
                    <DepositStatus
                      amount="500 USDT"
                      status="completed"
                      time="2 hours ago"
                      txHash="0x1234...5678"
                    />
                    <DepositStatus
                      amount="0.1 ETH"
                      status="pending"
                      time="5 minutes ago"
                      txHash="0xabcd...efgh"
                    />
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

interface DepositStatusProps {
  amount: string;
  status: 'pending' | 'completed' | 'failed';
  time: string;
  txHash: string;
}

const DepositStatus: React.FC<DepositStatusProps> = ({ amount, status, time, txHash }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'pending': return 'text-yellow-400';
      case 'failed': return 'text-red-400';
      default: return 'text-purple-400';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />;
      case 'failed': return <X className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <div className="bg-purple-800/20 rounded-lg p-3 border border-purple-500/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={getStatusColor()}>
            {getStatusIcon()}
          </div>
          <div>
            <p className="text-white font-medium">{amount}</p>
            <p className="text-sm text-purple-300">{time}</p>
          </div>
        </div>
        <div className="text-right">
          <p className={`text-sm font-medium capitalize ${getStatusColor()}`}>
            {status}
          </p>
          <button
            onClick={() => window.open(`https://etherscan.io/tx/${txHash}`, '_blank')}
            className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
          >
            {txHash}
          </button>
        </div>
      </div>
    </div>
  );
};