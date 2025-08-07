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
  | { type: 'UPDATE_BALANCE'; payload: UserBalance }
  | { type: 'ADD_POSITION'; payload: Position }
  | { type: 'UPDATE_POSITION'; payload: Position }
  | { type: 'CLOSE_POSITION'; payload: string }
  | { type: 'ADD_ORDER'; payload: TradeOrder }
  | { type: 'UPDATE_ORDER'; payload: TradeOrder }
  | { type: 'UPDATE_LP_TOKEN'; payload: LPToken }
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
  // Trading actions
  createPosition: (position: Position) => void;
  closePosition: (positionId: string) => void;
  
  // Utility functions
  getStockPrice: (symbol: string) => number;
  getUserBalance: (asset: string) => UserBalance | undefined;
  getTotalPortfolioValue: () => number;
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
    // Start price updates for all stocks
    state.stocks.forEach(stock => {
      priceSimulator.startPriceUpdates(
        stock.symbol,
        stock.price,
        (newPrice) => {
          dispatch({
            type: 'UPDATE_STOCK_PRICE',
            payload: { symbol: stock.symbol, price: newPrice }
          });
        }
      );
    });

    console.log("Init wallt",state)
    initBalanace((state.wallet as any)?.address)
    //  { type: 'UPDATE_BALANCE'; payload: UserBalance }
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
    getTotalPortfolioValue
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