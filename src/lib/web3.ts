import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'viem';
import { mainnet, arbitrum, polygon } from 'viem/chains';

// Monad链配置（模拟配置，实际需要Monad网络的真实参数）
const monad = {
  id: 34443, // Monad的链ID（假设值）
  name: 'Monad',
  network: 'monad',
  nativeCurrency: {
    decimals: 18,
    name: 'MON',
    symbol: 'MON',
  },
  rpcUrls: {
    public: { http: ['https://rpc.monad.xyz'] },
    default: { http: ['https://rpc.monad.xyz'] },
  },
  blockExplorers: {
    default: { name: 'MonadScan', url: 'https://scan.monad.xyz' },
  },
} as const;

export const config = getDefaultConfig({
  appName: 'Tstocks',
  projectId: 'YOUR_PROJECT_ID', // 实际使用时需要WalletConnect项目ID
  chains: [monad, mainnet, arbitrum, polygon],
  transports: {
    [monad.id]: http(),
    [mainnet.id]: http(),
    [arbitrum.id]: http(),
    [polygon.id]: http(),
  },
});

// 智能合约地址（Monad网络上的地址）
export const CONTRACTS = {
  LEVERAGE_TRADING: '0x1234567890123456789012345678901234567890',
  VAULT: '0x2345678901234567890123456789012345678901',
  UNISWAP_V2_ROUTER: '0x3456789012345678901234567890123456789012',
  MON_TOKEN: '0x4567890123456789012345678901234567890123',
  USDT_TOKEN: '0x5678901234567890123456789012345678901234',
  USDC_TOKEN: '0x6789012345678901234567890123456789012345',
};

// 支持的代币
export const TOKENS = {
    TESLA: {
    symbol: 'TESLA',
    name: 'Monad',
    decimals: 18,
    address: CONTRACTS.MON_TOKEN,
    icon: '/images/tokens/mon.svg',
  },
  NVIDIA: {
    symbol: 'NVIDIA',
    name: 'Ethereum',
    decimals: 18,
    address: '0x0000000000000000000000000000000000000000',
    icon: '/images/tokens/mon.svg',
  },
  MON: {
    symbol: 'MON',
    name: 'Monad',
    decimals: 18,
    address: CONTRACTS.MON_TOKEN,
    icon: '/images/tokens/mon.svg',
  },
  ETH: {
    symbol: 'ETH',
    name: 'Ethereum',
    decimals: 18,
    address: '0x0000000000000000000000000000000000000000',
    icon: '/images/tokens/eth.svg',
  },
  USDT: {
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 6,
    address: CONTRACTS.USDT_TOKEN,
    icon: '/images/tokens/usdt.svg',
  },
  USDC: {
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    address: CONTRACTS.USDC_TOKEN,
    icon: '/images/tokens/usdc.svg',
  },
};

export type Token = typeof TOKENS[keyof typeof TOKENS];