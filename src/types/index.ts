// Core Types for Tstocks DApp

export interface Stock {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  changePercent24h: number;
  volume24h: number;
  marketCap: number;
  logo: string;
  description: string;
}

export interface TradingPair {
  id: string;
  baseAsset: string;
  quoteAsset: string;
  price: number;
  change24h: number;
  volume24h: number;
  high24h: number;
  low24h: number;
}

export interface UserBalance {
  asset: string;
  balance: number;
  usdValue: number;
  locked: number;
}

export interface Position {
  id: string;
  symbol: string;
  type: 'long' | 'short';
  size: number;
  entryPrice: number;
  currentPrice: number;
  leverage: number;
  pnl: number;
  pnlPercent: number;
  margin: number;
  liquidationPrice: number;
  timestamp: number;
  status: 'open' | 'closed';
}

export interface LPToken {
  id: string;
  name: string;
  symbol: string;
  totalSupply: number;
  userBalance: number;
  apr: number;
  tvl: number;
  underlyingAssets: {
    asset: string;
    amount: number;
    percentage: number;
  }[];
}

export interface DepositMethod {
  id: string;
  name: string;
  symbol: string;
  network: string;
  address?: string;
  qrCode?: string;
  minDeposit: number;
  processingTime: string;
  fee: number;
}

export interface TradeOrder {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  type: 'market' | 'limit';
  amount: number;
  price?: number;
  status: 'pending' | 'filled' | 'cancelled';
  timestamp: number;
  filled: number;
  remaining: number;
}

export interface WalletInfo {
  address: string;
  connected: boolean;
  balance: number; // TON balance
  network: 'mainnet' | 'testnet';
  sk:string;
}

export interface VaultInfo {
  id: string;
  name: string;
  description: string;
  tvl: number;
  apr: number;
  minDeposit: number;
  userDeposit: number;
  strategy: string;
  riskLevel: 'low' | 'medium' | 'high';
}