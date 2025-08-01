// Mock Data for Tstocks DApp
import { Stock, TradingPair, UserBalance, Position, LPToken, DepositMethod, VaultInfo } from '../types';

export const mockStocks: Stock[] = [
  {
    id: 'tsla',
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    price: 248.52,
    change24h: 12.34,
    changePercent24h: 5.23,
    volume24h: 125000000,
    marketCap: 792000000000,
    logo: '/images/stocks/tesla.png',
    description: 'Electric vehicle and clean energy company'
  },
  {
    id: 'nvda',
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    price: 875.64,
    change24h: -15.23,
    changePercent24h: -1.71,
    volume24h: 89000000,
    marketCap: 2160000000000,
    logo: '/images/stocks/nvidia.jpg',
    description: 'GPU and AI semiconductor technology'
  },
  {
    id: 'aapl',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 195.89,
    change24h: 3.45,
    changePercent24h: 1.79,
    volume24h: 156000000,
    marketCap: 3010000000000,
    logo: '/images/stocks/apple.jpg',
    description: 'Consumer electronics and software services'
  },
  {
    id: 'googl',
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    price: 145.67,
    change24h: -2.34,
    changePercent24h: -1.58,
    volume24h: 78000000,
    marketCap: 1850000000000,
    logo: '/images/stocks/google.jpg',
    description: 'Internet search and advertising technology'
  },
  {
    id: 'amzn',
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    price: 178.25,
    change24h: 8.75,
    changePercent24h: 5.16,
    volume24h: 92000000,
    marketCap: 1840000000000,
    logo: '/images/stocks/amazon.png',
    description: 'E-commerce and cloud computing services'
  }
];

export const mockTradingPairs: TradingPair[] = [
  {
    id: 'tsla-usdt',
    baseAsset: 'TSLA',
    quoteAsset: 'USDT',
    price: 248.52,
    change24h: 5.23,
    volume24h: 25000000,
    high24h: 255.67,
    low24h: 235.89
  },
  {
    id: 'nvda-usdt',
    baseAsset: 'NVDA',
    quoteAsset: 'USDT',
    price: 875.64,
    change24h: -1.71,
    volume24h: 18000000,
    high24h: 892.45,
    low24h: 867.23
  },
  {
    id: 'aapl-usdt',
    baseAsset: 'AAPL',
    quoteAsset: 'USDT',
    price: 195.89,
    change24h: 1.79,
    volume24h: 32000000,
    high24h: 198.45,
    low24h: 189.67
  }
];

export const mockUserBalances: UserBalance[] = [
  {
    asset: 'USDT',
    balance: 15750.25,
    usdValue: 15750.25,
    locked: 2500.00
  },
  {
    asset: 'USDC',
    balance: 8920.50,
    usdValue: 8920.50,
    locked: 1200.00
  },
  {
    asset: 'TON',
    balance: 245.67,
    usdValue: 1228.35,
    locked: 50.00
  },
  {
    asset: 'TSLA',
    balance: 12.5,
    usdValue: 3106.50,
    locked: 0
  },
  {
    asset: 'NVDA',
    balance: 5.2,
    usdValue: 4553.33,
    locked: 2.1
  },
  {
    asset: 'AAPL',
    balance: 25.0,
    usdValue: 4897.25,
    locked: 0
  }
];

export const mockPositions: Position[] = [
  {
    id: 'pos-1',
    symbol: 'TSLA',
    type: 'long',
    size: 10,
    entryPrice: 235.40,
    currentPrice: 248.52,
    leverage: 3,
    pnl: 393.60,
    pnlPercent: 16.75,
    margin: 784.67,
    liquidationPrice: 156.93,
    timestamp: Date.now() - 86400000,
    status: 'open'
  },
  {
    id: 'pos-2',
    symbol: 'NVDA',
    type: 'short',
    size: 5,
    entryPrice: 890.25,
    currentPrice: 875.64,
    leverage: 2,
    pnl: 365.25,
    pnlPercent: 8.21,
    margin: 2225.80,
    liquidationPrice: 1001.79,
    timestamp: Date.now() - 172800000,
    status: 'open'
  },
  {
    id: 'pos-3',
    symbol: 'AAPL',
    type: 'long',
    size: 15,
    entryPrice: 189.20,
    currentPrice: 195.89,
    leverage: 2,
    pnl: 501.75,
    pnlPercent: 17.71,
    margin: 1419.00,
    liquidationPrice: 141.90,
    timestamp: Date.now() - 259200000,
    status: 'open'
  }
];

export const mockLPTokens: LPToken[] = [
  {
    id: 'lp-stocks',
    name: 'Stocks LP Token',
    symbol: 'STOCK-LP',
    totalSupply: 1000000,
    userBalance: 2500.75,
    apr: 18.5,
    tvl: 15000000,
    underlyingAssets: [
      { asset: 'TSLA', amount: 15000, percentage: 35 },
      { asset: 'NVDA', amount: 8500, percentage: 25 },
      { asset: 'AAPL', amount: 12000, percentage: 30 },
      { asset: 'USDT', amount: 500000, percentage: 10 }
    ]
  },
  {
    id: 'lp-stable',
    name: 'Stablecoin LP Token',
    symbol: 'STABLE-LP',
    totalSupply: 5000000,
    userBalance: 8750.25,
    apr: 12.3,
    tvl: 25000000,
    underlyingAssets: [
      { asset: 'USDT', amount: 12500000, percentage: 50 },
      { asset: 'USDC', amount: 12500000, percentage: 50 }
    ]
  }
];

export const mockDepositMethods: DepositMethod[] = [
  {
    id: 'ton',
    name: 'TON',
    symbol: 'TON',
    network: 'TON',
    minDeposit: 1,
    processingTime: '1-2 minutes',
    fee: 0.01
  },
  {
    id: 'eth',
    name: 'Ethereum',
    symbol: 'ETH',
    network: 'Ethereum',
    minDeposit: 0.001,
    processingTime: '5-10 minutes',
    fee: 0.005
  },
  {
    id: 'trx',
    name: 'TRON',
    symbol: 'TRX',
    network: 'TRON',
    minDeposit: 10,
    processingTime: '1-3 minutes',
    fee: 1
  },
  {
    id: 'usdt-trc20',
    name: 'USDT (TRC20)',
    symbol: 'USDT',
    network: 'TRON',
    minDeposit: 1,
    processingTime: '1-3 minutes',
    fee: 1
  }
];

export const mockVaults: VaultInfo[] = [
  {
    id: 'vault-growth',
    name: 'Growth Vault',
    description: 'High-growth tech stocks with leveraged strategies',
    tvl: 12500000,
    apr: 24.5,
    minDeposit: 100,
    userDeposit: 5000,
    strategy: 'Leveraged Long Positions',
    riskLevel: 'high'
  },
  {
    id: 'vault-stable',
    name: 'Stable Yield Vault',
    description: 'Conservative stablecoin strategies with LP rewards',
    tvl: 8750000,
    apr: 15.2,
    minDeposit: 50,
    userDeposit: 2500,
    strategy: 'Liquidity Provision',
    riskLevel: 'low'
  },
  {
    id: 'vault-balanced',
    name: 'Balanced Portfolio',
    description: 'Mixed strategy with stocks and stablecoins',
    tvl: 6800000,
    apr: 19.8,
    minDeposit: 75,
    userDeposit: 1250,
    strategy: 'Long/Short Hedging',
    riskLevel: 'medium'
  }
];

// Price update simulation
export const generatePriceUpdate = (currentPrice: number): number => {
  const volatility = 0.002; // 0.2% volatility
  const change = (Math.random() - 0.5) * 2 * volatility;
  return Number((currentPrice * (1 + change)).toFixed(2));
};

// Simulate real-time price updates
export class PriceSimulator {
  private intervals: Map<string, NodeJS.Timeout> = new Map();
  private callbacks: Map<string, (price: number) => void> = new Map();

  startPriceUpdates(symbol: string, initialPrice: number, callback: (price: number) => void) {
    let currentPrice = initialPrice;
    this.callbacks.set(symbol, callback);
    
    const interval = setInterval(() => {
      currentPrice = generatePriceUpdate(currentPrice);
      callback(currentPrice);
    }, 2000); // Update every 2 seconds
    
    this.intervals.set(symbol, interval);
  }

  stopPriceUpdates(symbol: string) {
    const interval = this.intervals.get(symbol);
    if (interval) {
      clearInterval(interval);
      this.intervals.delete(symbol);
      this.callbacks.delete(symbol);
    }
  }

  stopAllUpdates() {
    this.intervals.forEach((interval) => clearInterval(interval));
    this.intervals.clear();
    this.callbacks.clear();
  }
}

export const priceSimulator = new PriceSimulator();