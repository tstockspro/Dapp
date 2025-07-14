import { useState, useEffect } from 'react';
import { useAccount, useBalance, useChainId } from 'wagmi';
import { TOKENS, type Token } from '../lib/web3';

export function useWeb3() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const [selectedToken, setSelectedToken] = useState<Token>(TOKENS.ETH);

  // 获取ETH余额
  const { data: ethBalance, refetch: refetchEthBalance } = useBalance({
    address,
  });

  // 获取选中代币余额
  const { data: tokenBalance, refetch: refetchTokenBalance } = useBalance({
    address,
    token: selectedToken.address !== '0x0000000000000000000000000000000000000000' 
      ? selectedToken.address as `0x${string}` 
      : undefined,
  });

  const refreshBalances = () => {
    refetchEthBalance();
    refetchTokenBalance();
  };

  return {
    address,
    isConnected,
    chainId,
    ethBalance,
    tokenBalance,
    selectedToken,
    setSelectedToken,
    refreshBalances,
  };
}

export function useTokenBalance(tokenAddress: string) {
  const { address } = useAccount();
  
  const { data: balance, refetch } = useBalance({
    address,
    token: tokenAddress !== '0x0000000000000000000000000000000000000000' 
      ? tokenAddress as `0x${string}` 
      : undefined,
  });

  return { balance, refetch };
}