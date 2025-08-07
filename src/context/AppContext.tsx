// Global App Context for Tstocks DApp
import React, { createContext, useContext, useReducer, ReactNode, useEffect, useMemo } from 'react';
import { Stock, UserBalance, Position, LPToken, WalletInfo, TradeOrder } from '../types';
import {
  mockStocks,
  mockUserBalances,
  mockPositions,
  mockLPTokens,
  priceSimulator
} from '../data/mockData';
import { STORAGE_KEYS } from '../constants';
import { initBalanace, localInit } from '@/core/wallet';

import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { 
  PhantomWalletAdapter, 
  SolflareWalletAdapter 
} from '@solana/wallet-adapter-wallets';
import '@solana/wallet-adapter-react-ui/styles.css';
import { clusterApiUrl } from '@solana/web3.js';

interface AppState {
  // Wallet state
  wallet: WalletInfo | null;
  
  // Market data
  stocks: Stock[];
  
  // User data
  balances: UserBalance[];
  positions: Position[];
  lpTokens: LPToken[];
  orders: TradeOrder[];
  // UI state
  loading: boolean;
  error: string | null;
  
  // Real-time updates
  priceUpdates: Record<string, number>;
}

type AppAction =
  | { type: 'SET_WALLET'; payload: WalletInfo | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'UPDATE_STOCK_PRICE'; payload: { symbol: string; price: number } }
  | { type: 'UPDATE_STOCK_INFO'; payload: { symbol: string; price: number ;change24h: number ; changePercent24h: number ;volume24h:number;marketCap:number;} }
  | { type: 'UPDATE_BALANCE'; payload: UserBalance }
  | { type: 'ADD_POSITION'; payload: Position }
  | { type: 'UPDATE_POSITION'; payload: Position }
  | { type: 'CLOSE_POSITION'; payload: string }
  | { type: 'ADD_ORDER'; payload: TradeOrder }
  | { type: 'UPDATE_ORDER'; payload: TradeOrder }
  | { type: 'UPDATE_LP_TOKEN'; payload: LPToken }
  | { type: 'UPDATE_STOCKS'; payload: Stock }
  | { type: 'INITIALIZE_DATA' };

const initialState: AppState = {
  wallet: null,
  stocks: mockStocks,
  balances: mockUserBalances,
  positions: mockPositions,
  lpTokens: mockLPTokens,
  orders: [],
  loading: false,
  error: null,
  priceUpdates: {}
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_WALLET':
      return { ...state, wallet: action.payload };
    
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'UPDATE_STOCK_PRICE':
      return {
        ...state,
        stocks: state.stocks.map(stock => 
          stock.symbol === action.payload.symbol
            ? { ...stock, price: action.payload.price }
            : stock
        ),
        priceUpdates: {
          ...state.priceUpdates,
          [action.payload.symbol]: action.payload.price
        }
      };
    case 'UPDATE_STOCK_INFO':
      return {
        ...state,
        stocks: state.stocks.map(stock => 
          stock.symbol === action.payload.symbol
            ? { ...stock, price: action.payload.price,change24h: action.payload.change24h,changePercent24h: action.payload.changePercent24h,volume24h: action.payload.volume24h,marketCap: action.payload.marketCap }
            : stock
        ),
        priceUpdates: {
          ...state.priceUpdates,
          [action.payload.symbol]: action.payload.price
        }
      };
    case 'UPDATE_BALANCE':
      return {
        ...state,
        balances: state.balances.map(balance =>
          balance.asset === action.payload.asset ? action.payload : balance
        )
      };
    
    case 'ADD_POSITION':
      return {
        ...state,
        positions: [...state.positions, action.payload]
      };
    
    case 'UPDATE_POSITION':
      return {
        ...state,
        positions: state.positions.map(position =>
          position.id === action.payload.id ? action.payload : position
        )
      };
    
    case 'CLOSE_POSITION':
      return {
        ...state,
        positions: state.positions.filter(position => position.id !== action.payload)
      };
    
    case 'ADD_ORDER':
      return {
        ...state,
        orders: [...state.orders, action.payload]
      };
    
    case 'UPDATE_ORDER':
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload.id ? action.payload : order
        )
      };
    
    case 'UPDATE_LP_TOKEN':
      return {
        ...state,
        lpTokens: state.lpTokens.map(token =>
          token.id === action.payload.id ? action.payload : token
        )
      };
    
    case 'INITIALIZE_DATA':
      return initialState;
    
    default:
      return state;
  }
};

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  
  // Wallet actions
  connectWallet: () => void;
  disconnectWallet: () => void;
  connectExtensionWallet: (address:string) => void;
  updateBalance: (bal:any)=>void;
  // Trading actions
  createPosition: (position: Position) => void;
  closePosition: (positionId: string) => void;
  
  // Utility functions
  getStockPrice: (symbol: string) => number;
  getUserBalance: (asset: string) => UserBalance | undefined;
  getTotalPortfolioValue: () => number;
  updateStockInfo:(info:any)=> void
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

    const network = WalletAdapterNetwork.Mainnet;
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    const wallets = useMemo(
      () => [
        new PhantomWalletAdapter(),
        new SolflareWalletAdapter(),
      ],
      []
    );
  // Initialize real-time price updates
  useEffect(() => {
    console.log("connect wallet")
    // Start price updates for all stocks
    state.stocks.forEach(stock => {
      priceSimulator.startPriceUpdates(
        stock,
        (data) => {
          dispatch({
            type: 'UPDATE_STOCK_INFO',
            payload: data
          });
        }
      );
    });
    
    return () => {
      priceSimulator.stopAllUpdates();
    };
  }, []);

  // Wallet actions
  const connectWallet = () => {
    const wallet = localInit();
    const w = {
      address:wallet.publicKey,
      sk:wallet.secretKey,
      connected: true,
      balance: 0,
      network: "mainnet",
    }
    dispatch({ type: 'SET_WALLET', payload: w as any });
    return w;
  };

  const connectExtensionWallet = (address:string) => {
    const wallet = localInit();
    const w = {
      address:address,
      sk:"",
      connected: true,
      balance: 0,
      network: "mainnet",
    }
    dispatch({ type: 'SET_WALLET', payload: w as any });
  };

  const disconnectWallet = () => {
    dispatch({ type: 'SET_WALLET', payload: null });
  };

  // Trading actions
  const createPosition = (position: Position) => {
    dispatch({ type: 'ADD_POSITION', payload: position });
  };

  const closePosition = (positionId: string) => {
    dispatch({ type: 'CLOSE_POSITION', payload: positionId });
  };

  // Utility functions
  const getStockPrice = (symbol: string): number => {
    const stock = state.stocks.find(s => s.symbol === symbol);
    return stock?.price || 0;
  };

  const getUserBalance = (asset: string): UserBalance | undefined => {
    return state.balances.find(balance => balance.asset === asset);
  };

  const getTotalPortfolioValue = (): number => {
    return state.balances.reduce((total, balance) => total + balance.usdValue, 0);
  };
  const updateBalance = (e:any) => {
      dispatch({
        type: 'UPDATE_BALANCE',
        payload: e
      });
  };

  const updateStockInfo = (e:any) => {
        dispatch({
          type: 'UPDATE_STOCK_INFO',
          payload: e
        });
  };


  const contextValue: AppContextType = {
    state,
    dispatch,
    connectWallet,
    disconnectWallet,
    connectExtensionWallet,
    createPosition,
    closePosition,
    getStockPrice,
    getUserBalance,
    getTotalPortfolioValue,
    updateBalance,
    updateStockInfo
  };

  return (
    <AppContext.Provider value={contextValue}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
              {children}
        </WalletModalProvider>
      </WalletProvider>
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};