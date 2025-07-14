import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 格式化数字显示
export function formatNumber(value: number, decimals: number = 2): string {
  if (value === 0) return '0';
  if (value < 0.01 && value > 0) return '<0.01';
  if (value >= 1000000) return `${(value / 1000000).toFixed(decimals)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(decimals)}K`;
  return value.toFixed(decimals);
}

// 格式化百分比
export function formatPercentage(value: number, decimals: number = 2): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

// 格式化地址
export function formatAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// 格式化代币金额
export function formatTokenAmount(amount: bigint, decimals: number, displayDecimals: number = 4): string {
  const divisor = BigInt(10 ** decimals);
  const quotient = amount / divisor;
  const remainder = amount % divisor;
  
  const integerPart = quotient.toString();
  const fractionalPart = remainder.toString().padStart(decimals, '0');
  
  const trimmedFractional = fractionalPart.slice(0, displayDecimals).replace(/0+$/, '');
  
  if (trimmedFractional === '') {
    return integerPart;
  }
  
  return `${integerPart}.${trimmedFractional}`;
}

// 计算滑点后的最小接收量
export function calculateMinimumReceived(amount: number, slippageTolerance: number): number {
  return amount * (1 - slippageTolerance / 100);
}

// 计算价格影响
export function calculatePriceImpact(inputAmount: number, outputAmount: number, marketPrice: number): number {
  const expectedOutput = inputAmount * marketPrice;
  return Math.abs((expectedOutput - outputAmount) / expectedOutput);
}

// 本地存储工具
export const storage = {
  get: (key: string, defaultValue: any = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  set: (key: string, value: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // 忽略存储错误
    }
  },
  remove: (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch {
      // 忽略删除错误
    }
  },
};