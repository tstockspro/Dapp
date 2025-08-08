// TON Wallet connection component
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, ChevronDown, LogOut, Copy, ExternalLink,ArrowLeftRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { GlassCard } from '../common/GlassCard';
import { formatAddress, formatCurrency } from '../../utils/formatters';
import { copyToClipboard, generateWalletAddress } from '../../utils/wallet';
import toast from 'react-hot-toast';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { getAccountInfo, initBalanace } from '@/core/wallet';
export const WalletConnectLocal: React.FC = () => {
  const { state, connectWallet, disconnectWallet ,connectExtensionWallet,updateBalance,updateStockInfo ,createPosition ,anyDispatch} = useApp();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const { setVisible } = useWalletModal()
  const {publicKey, connected, signTransaction,disconnect } = useWallet();

  const init = async()=>
  {
    let wallet = connectWallet();
    if(publicKey)
    {
      wallet = connectExtensionWallet(publicKey.toBase58())
    }
    // console.log("Init wallt",wallet)
    const info = await initBalanace((wallet as any)?.address)
    if(info)
    {
      // console.log(info)
      info.balance.forEach(e => {
        updateBalance(e);
      });
      info.price.forEach(e => {
        updateStockInfo(e)
      });
    }
    const _state = JSON.parse(
      JSON.stringify(state)
    );
    
    const accountInfo = await getAccountInfo((wallet as any)?.address , state ,(info as any)?.price);
    console.log("accountInfo",accountInfo)
    if(accountInfo)
    {
      anyDispatch("CLEAN_POSITION","")
      for(let i of accountInfo.positions)
      {
        createPosition(i);
      }
      anyDispatch("UPDATE_HISTORY",{history:accountInfo.history,historyCount:accountInfo.count})
      
    }
    // dispatch({type: 'SET_LOADING',payload: false});
    // console.log("final state :: ",state)
  }

  useEffect(() => {
    // console.log("connect",connected)
    //Check params
    init()

    const interval = setInterval(() => {
      init()
    }, 30000); // 30s

    return () => clearInterval(interval);

  }, [connected]);

  const handleConnect = async () => {
    setIsConnecting(true);
    
    try {
      // Simulate wallet connection process
      await new Promise(resolve => setTimeout(resolve, 200));
      toast.success('Wallet connected successfully!', {
        icon: '🔗',
        style: {
          background: 'rgba(139, 69, 19, 0.9)',
          color: '#fff',
          border: '1px solid rgba(147, 51, 234, 0.3)'
        }
      });
    } catch (error) {
      toast.error('Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    toast.success('Export Wallet', {
      icon: '🔌',
      style: {
        background: 'rgba(139, 69, 19, 0.9)',
        color: '#fff'
      }
    });
  };

  const handleCopyAddress = async () => {
    if (state.wallet?.address) {
      const success = await copyToClipboard(state.wallet.address);
      if (success) {
        toast.success('Address copied to clipboard!', {
          icon: '📋'
        });
      }
    }
  };

  if (!state.wallet) {
    return (
      <Button 
        onClick={handleConnect}
        loading={isConnecting}
        className="flex items-center space-x-2"
      >
        <Wallet className="w-7 h-7" />
        {/* <span>Connect Wallet</span> */}
      </Button>
    );
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-ecnter space-x-2 min-w-[160px] justify-between"
      >
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="font-mono text-sm">
            {formatAddress(state.wallet.address)}
          </span>
          <ChevronDown className={`w-4 h-4 transition-transform ${
          isDropdownOpen ? 'rotate-180' : ''
        }`} />
        </div>

      </Button>

      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            className="absolute top-full right-0 mt-2 z-50"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <GlassCard className="w-80 bg-black" padding="medium">
              <div className="space-y-4">
                {/* Wallet Info */}
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Wallet className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-sm text-purple-200 mb-1">My Wallet</p>
                  <p className="font-mono text-xs text-purple-300 break-all">
                    {state.wallet.address}
                  </p>
                </div>

                {/* Balance */}
                <div className="bg-purple-800/30 rounded-lg p-4 border border-purple-500/20">
                  <div className="flex justify-between items-center">
                    <span className="text-purple-200">Balance</span>
                    <span className="text-white font-bold">
                      {formatCurrency(state.balances.find(b => b.asset === 'USDC')?.balance || 0)} $
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-purple-200 text-sm">USDC Value</span>
                    <span className="text-purple-300 text-sm">
                       {formatCurrency(state.balances.find(b => b.asset === 'USDC')?.balance || 0)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <button
                    onClick={handleCopyAddress}
                    className="w-full flex items-center justify-center space-x-2 p-3 rounded-lg bg-purple-700/30 hover:bg-purple-600/40 text-purple-200 hover:text-white transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy Address</span>
                  </button>
                  
                  <button
                    onClick={() => window.open(`https://solscan.io/account/${state.wallet.address}`, '_blank')}
                    className="w-full flex items-center justify-center space-x-2 p-3 rounded-lg bg-purple-700/30 hover:bg-purple-600/40 text-purple-200 hover:text-white transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>View on Explorer</span>
                  </button>
                  

                  <button
                    onClick={() => {
                      if(state.wallet.sk.length>10)
                      {
                        //Local wallet to extension wallet
                        setVisible(true)
                      }else{
                        disconnect()
                      }
                    }}
                    className="w-full flex items-center justify-center space-x-2 p-3 rounded-lg bg-green-600/30 hover:bg-green-500/40 text-green-200 hover:text-white transition-colors"
                  >
                    <ArrowLeftRight className="w-4 h-4" />
                    <span>
                      {
                        state.wallet.sk?.length>10 ? "Switch To Extension Wallet" : "Switch to Local Wallet"
                      }
                    </span>
                  </button>

                      {
                        state.wallet.sk?.length>10 ? 
                        <button
                          onClick={handleDisconnect}
                          className="w-full flex items-center justify-center space-x-2 p-3 rounded-lg bg-blue-600/30 hover:bg-blue-500/40 text-blue-200 hover:text-white transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Import Wallet</span>
                        </button>
                        :null
                      }

                      {
                        state.wallet.sk?.length>10 ? 
                        <button
                          onClick={handleDisconnect}
                          className="w-full flex items-center justify-center space-x-2 p-3 rounded-lg bg-red-600/30 hover:bg-red-500/40 text-red-200 hover:text-white transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Export Wallet</span>
                        </button>
                        :null
                      }
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close */}
      {isDropdownOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  );
};