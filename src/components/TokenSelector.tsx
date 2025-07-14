import React, { useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { TOKENS, type Token } from '../lib/web3';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Modal } from './ui/Modal';
import { formatNumber } from '../lib/utils';
import { useTokenBalance } from '../hooks/useWeb3';

interface TokenSelectorProps {
  selectedToken: Token;
  onTokenSelect: (token: Token) => void;
  excludeTokens?: string[];
  label?: string;
}

export function TokenSelector({
  selectedToken,
  onTokenSelect,
  excludeTokens = [],
  label = '选择代币',
}: TokenSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTokens = Object.values(TOKENS).filter(
    (token) =>
      !excludeTokens.includes(token.symbol) &&
      (token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        token.symbol.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleTokenSelect = (token: Token) => {
    onTokenSelect(token);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <>
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">{label}</label>
        <Button
          variant="secondary"
          onClick={() => setIsOpen(true)}
          className="w-full justify-between h-12 px-4"
        >
          <div className="flex items-center space-x-3">
            <img
              src={selectedToken.icon}
              alt={selectedToken.symbol}
              className="w-6 h-6 rounded-full"
              onError={(e) => {
                // 图片加载失败时显示默认图标
                e.currentTarget.src = `data:image/svg+xml;base64,${btoa(
                  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" fill="#415A77"/>
                    <text x="12" y="16" text-anchor="middle" fill="white" font-size="8">${selectedToken.symbol.charAt(0)}</text>
                  </svg>`
                )}`;
              }}
            />
            <div className="text-left">
              <div className="font-medium text-foreground">{selectedToken.symbol}</div>
              <div className="text-xs text-muted-foreground">{selectedToken.name}</div>
            </div>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="选择代币"
        className="max-w-md"
      >
        <div className="space-y-4">
          <Input
            placeholder="搜索代币名称或符号"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            rightElement={<Search className="h-4 w-4 text-muted-foreground" />}
          />

          <div className="max-h-80 overflow-y-auto space-y-2">
            {filteredTokens.map((token) => (
              <TokenOption
                key={token.symbol}
                token={token}
                isSelected={token.symbol === selectedToken.symbol}
                onClick={() => handleTokenSelect(token)}
              />
            ))}
          </div>

          {filteredTokens.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              未找到匹配的代币
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}

interface TokenOptionProps {
  token: Token;
  isSelected: boolean;
  onClick: () => void;
}

function TokenOption({ token, isSelected, onClick }: TokenOptionProps) {
  const { balance } = useTokenBalance(token.address);

  return (
    <button
      className={`w-full p-3 rounded-lg border transition-all duration-200 text-left ${
        isSelected
          ? 'border-accent bg-accent/10'
          : 'border-border hover:border-accent/50 hover:bg-muted/50'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img
            src={token.icon}
            alt={token.symbol}
            className="w-8 h-8 rounded-full"
            onError={(e) => {
              e.currentTarget.src = `data:image/svg+xml;base64,${btoa(
                `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="14" fill="#415A77"/>
                  <text x="16" y="20" text-anchor="middle" fill="white" font-size="10">${token.symbol.charAt(0)}</text>
                </svg>`
              )}`;
            }}
          />
          <div>
            <div className="font-medium text-foreground">{token.symbol}</div>
            <div className="text-sm text-muted-foreground">{token.name}</div>
          </div>
        </div>
        
        {balance && (
          <div className="text-right">
            <div className="text-sm font-medium text-foreground">
              {formatNumber(parseFloat(balance.formatted))}
            </div>
            <div className="text-xs text-muted-foreground">{balance.symbol}</div>
          </div>
        )}
      </div>
    </button>
  );
}