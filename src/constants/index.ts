// Constants for Tstocks DApp

export const COLORS = {
  primary: {
    50: '#f8f6ff',
    100: '#f0ebff',
    200: '#e4daff',
    300: '#d1bbff',
    400: '#b691ff',
    500: '#9b5fff',
    600: '#8b3dff',
    700: '#7c25ff',
    800: '#6b1fed',
    900: '#5a18c7',
    950: '#1a0b2e'
  },
  purple: {
    dark: '#1a0b2e',
    medium: '#2d1b69',
    light: '#4c2f8a',
    accent: '#6d44b8'
  },
  glass: {
    bg: 'rgba(29, 11, 46, 0.8)',
    border: 'rgba(109, 68, 184, 0.3)',
    hover: 'rgba(109, 68, 184, 0.2)'
  }
};

export const ANIMATIONS = {
  fadeIn: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  },
  slideIn: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.3 }
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.2 }
  }
};

export const TRADING_CONFIG = {
  maxLeverage: 20,
  minTradeAmount: 1,
  maxTradeAmount: 1000000,
  liquidationThreshold: 0.8,
  tradingFee: 0.001, // 0.1%
  leverageFee: 0.0003 // 0.03% per 8 hours
};

export const VAULT_CONFIG = {
  minDeposit: 10,
  withdrawalFee: 0.005, // 0.5%
  performanceFee: 0.15, // 15%
  lockPeriod: 0 // No lock period for demo
};

export const NETWORKS = {
  TON: {
    name: 'TON',
    chainId: 'mainnet',
    rpcUrl: 'https://toncenter.com/api/v2/jsonRPC',
    explorerUrl: 'https://tonscan.org'
  },
  ETHEREUM: {
    name: 'Ethereum',
    chainId: 1,
    rpcUrl: 'https://eth-mainnet.g.alchemy.com/v2/',
    explorerUrl: 'https://etherscan.io'
  },
  TRON: {
    name: 'TRON',
    chainId: 'mainnet',
    rpcUrl: 'https://api.trongrid.io',
    explorerUrl: 'https://tronscan.org'
  }
};

export const STORAGE_KEYS = {
  WALLET_CONNECTED: 'tstocks_wallet_connected',
  USER_POSITIONS: 'tstocks_user_positions',
  USER_TRADES: 'tstocks_user_trades',
  LP_TOKENS: 'tstocks_lp_tokens',
  THEME_PREFERENCE: 'tstocks_theme'
};

export const ROUTES = {
  HOME: '/',
  TRADING: '/trading',
  PORTFOLIO: '/portfolio',
  VAULTS: '/vaults',
  DEPOSIT: '/deposit',
  SETTINGS: '/settings'
};

export const SOCKET_EVENTS = {
  PRICE_UPDATE: 'price_update',
  POSITION_UPDATE: 'position_update',
  BALANCE_UPDATE: 'balance_update',
  ORDER_UPDATE: 'order_update'
};