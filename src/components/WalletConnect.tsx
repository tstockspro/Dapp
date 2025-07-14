import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Wallet, ChevronDown } from 'lucide-react';
import { Button } from './ui/Button';
import { formatAddress } from '../lib/utils';
import { useAccount, useBalance } from 'wagmi';

export function WalletConnect() {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus ||
            authenticationStatus === 'authenticated');

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button
                    onClick={openConnectModal}
                    variant="primary"
                    className="flex items-center space-x-2"
                  >
                    <Wallet className="h-4 w-4" />
                    <span>Connect EVM</span>
                  </Button>
                );
              }

              if (chain.unsupported) {
                return (
                  <Button
                    onClick={openChainModal}
                    variant="outline"
                    className="text-destructive border-destructive"
                  >
                    Unsupport network
                  </Button>
                );
              }

              return (
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={openChainModal}
                    variant="secondary"
                    size="sm"
                    className="flex items-center space-x-1"
                  >
                    {chain.hasIcon && (
                      <div
                        style={{
                          background: chain.iconBackground,
                          width: 16,
                          height: 16,
                          borderRadius: 999,
                          overflow: 'hidden',
                          marginRight: 4,
                        }}
                      >
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? 'Chain icon'}
                            src={chain.iconUrl}
                            style={{ width: 16, height: 16 }}
                          />
                        )}
                      </div>
                    )}
                    <span>{chain.name}</span>
                    <ChevronDown className="h-3 w-3" />
                  </Button>

                  <Button
                    onClick={openAccountModal}
                    variant="secondary"
                    className="flex items-center space-x-2"
                  >
                    {account.displayBalance && (
                      <span className="text-xs text-muted-foreground">
                        {account.displayBalance}
                      </span>
                    )}
                    <span>{formatAddress(account.address)}</span>
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}

// 简化版本，用于移动端
export function MobileWalletConnect() {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });

  return (
    <ConnectButton.Custom>
      {({ openConnectModal, openAccountModal, mounted }) => {
        if (!mounted) return null;

        if (!isConnected) {
          return (
            <Button
              onClick={openConnectModal}
              variant="primary"
              size="sm"
              className="w-full flex items-center justify-center space-x-2"
            >
              <Wallet className="h-4 w-4" />
              <span>连接</span>
            </Button>
          );
        }

        return (
          <Button
            onClick={openAccountModal}
            variant="secondary"
            size="sm"
            className="w-full"
          >
            <div className="flex flex-col items-center">
              <span className="text-xs">{balance?.formatted.slice(0, 6)} {balance?.symbol}</span>
              <span className="text-xs text-muted-foreground">{formatAddress(address!)}</span>
            </div>
          </Button>
        );
      }}
    </ConnectButton.Custom>
  );
}