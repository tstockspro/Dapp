// Utility functions for formatting data

export const formatCurrency = (amount: number, currency = 'USD', decimals = 2): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(amount);
};

export const formatNumber = (num: number, decimals = 2): string => {
  if (num >= 1e9) {
    return (num / 1e9).toFixed(1) + 'B';
  }
  if (num >= 1e6) {
    return (num / 1e6).toFixed(1) + 'M';
  }
  if (num >= 1e3) {
    return (num / 1e3).toFixed(1) + 'K';
  }
  return num.toFixed(decimals);
};

export const formatPercent = (percent: number, decimals = 2): string => {
  return `${percent >= 0 ? '+' : ''}${percent.toFixed(decimals)}%`;
};

export const formatAddress = (address: string, startChars = 6, endChars = 4): string => {
  if (address.length <= startChars + endChars) return address;
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
};

export const formatTimeAgo = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return `${seconds}s ago`;
};

export const formatLeverage = (leverage: number): string => {
  return `${leverage}x`;
};

export const formatPnL = (pnl: number, currency = 'USD'): {
  formatted: string;
  isPositive: boolean;
} => {
  const isPositive = pnl >= 0;
  const formatted = formatCurrency(Math.abs(pnl), currency);
  return {
    formatted: `${isPositive ? '+' : '-'}${formatted}`,
    isPositive
  };
};

export const formatVolume = (volume: number): string => {
  return formatNumber(volume, 0);
};

export const formatMarketCap = (marketCap: number): string => {
  return formatNumber(marketCap, 1);
};

export const formatTradingPair = (baseAsset: string, quoteAsset: string): string => {
  return `${baseAsset}/${quoteAsset}`;
};

export const calculateLiquidationPrice = (
  entryPrice: number,
  leverage: number,
  isLong: boolean,
  maintenanceMargin = 0.05
): number => {
  if (isLong) {
    return entryPrice * (1 - (1 / leverage) + maintenanceMargin);
  } else {
    return entryPrice * (1 + (1 / leverage) - maintenanceMargin);
  }
};

export const calculatePnL = (
  entryPrice: number,
  currentPrice: number,
  size: number,
  isLong: boolean,
  leverage: number = 1
): { pnl: number; pnlPercent: number } => {
  const priceDiff = isLong ? currentPrice - entryPrice : entryPrice - currentPrice;
  const pnl = (priceDiff / entryPrice) * size * entryPrice * leverage;
  const pnlPercent = (priceDiff / entryPrice) * 100 * leverage;
  
  return { pnl, pnlPercent };
};

export const validateTradeAmount = (
  amount: number,
  balance: number,
  minAmount: number,
  maxAmount: number
): { isValid: boolean; error?: string } => {
  if (amount < minAmount) {
    return { isValid: false, error: `Minimum trade amount is ${formatCurrency(minAmount)}` };
  }
  if (amount > maxAmount) {
    return { isValid: false, error: `Maximum trade amount is ${formatCurrency(maxAmount)}` };
  }
  if (amount > balance) {
    return { isValid: false, error: 'Insufficient balance' };
  }
  return { isValid: true };
};

export const generateTradeId = (): string => {
  return `trade_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const generatePositionId = (): string => {
  return `pos_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};