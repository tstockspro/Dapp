// Wallet utility functions
import QRCode from 'qrcode';

export const generateQRCode = async (data: string): Promise<string> => {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(data, {
      width: 256,
      margin: 2,
      color: {
        dark: '#1a0b2e',
        light: '#ffffff'
      }
    });
    return qrCodeDataURL;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
};

export const generateWalletAddress = (network: string , state:any): string => {
  // Mock wallet address generation for different networks
  // const addressFormats = {
  //   TON: () => `0:${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
  //   ETH: () => `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
  //   TRX: () => `T${Array.from({ length: 33 }, () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'[Math.floor(Math.random() * 62)]).join('')}`,
  //   SOL: () => Array.from({ length: 44 }, () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'[Math.floor(Math.random() * 62)]).join('')
  // };

  // const generator = addressFormats[network as keyof typeof addressFormats];
  // return generator ? generator() : 'Invalid network';

  if(network == "SOL")
  {
    return state.wallet.address
  }
  return "NA"
};

export const validateAddress = (address: string, network: string): boolean => {
  const validators = {
    TON: (addr: string) => addr.startsWith('0:') && addr.length === 66,
    ETH: (addr: string) => addr.startsWith('0x') && addr.length === 42,
    TRX: (addr: string) => addr.startsWith('T') && addr.length === 34,
    SOL: (addr: string) => addr.length === 44
  };

  const validator = validators[network as keyof typeof validators];
  return validator ? validator(address) : false;
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};

export const formatWalletBalance = (balance: number, decimals = 18): string => {
  return (balance / Math.pow(10, decimals)).toFixed(4);
};

export const parseWalletBalance = (balance: string, decimals = 18): number => {
  return parseFloat(balance) * Math.pow(10, decimals);
};

export const estimateTransactionFee = (network: string, complexity = 'simple'): number => {
  const baseFees = {
    TON: { simple: 0.01, complex: 0.05 },
    ETH: { simple: 0.005, complex: 0.02 },
    TRX: { simple: 1, complex: 5 },
    SOL: { simple: 0.00025, complex: 0.001 }
  };

  const networkFees = baseFees[network as keyof typeof baseFees];
  return networkFees ? networkFees[complexity as keyof typeof networkFees] : 0;
};

export const getNetworkExplorer = (network: string, address: string): string => {
  const explorers = {
    TON: `https://tonscan.org/address/${address}`,
    ETH: `https://etherscan.io/address/${address}`,
    TRX: `https://tronscan.org/#/address/${address}`,
    SOL: `https://solscan.io/account/${address}`
  };

  return explorers[network as keyof typeof explorers] || '#';
};

// Mock transaction simulation
export const simulateTransaction = async (
  from: string,
  to: string,
  amount: number,
  network: string
): Promise<{
  success: boolean;
  txHash?: string;
  error?: string;
  fee: number;
}> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Random success/failure for demo (90% success rate)
  const success = Math.random() > 0.1;
  
  if (success) {
    const txHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
    const fee = estimateTransactionFee(network);
    
    return {
      success: true,
      txHash,
      fee
    };
  } else {
    return {
      success: false,
      error: 'Transaction failed: Insufficient gas or network congestion',
      fee: 0
    };
  }
};