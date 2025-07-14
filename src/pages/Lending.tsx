import React, { useState } from 'react';
import { DollarSign, TrendingUp, Clock, Shield, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { TokenSelector } from '../components/TokenSelector';
import { formatNumber, formatPercentage } from '../lib/utils';
import { TOKENS } from '../lib/web3';
import { useWeb3 } from '../hooks/useWeb3';

interface Loan {
  id: string;
  borrowedToken: string;
  borrowedAmount: number;
  collateralToken?: string;
  collateralAmount?: number;
  interestRate: number;
  accruedInterest: number;
  totalOwed: number;
  dueDate?: Date;
  isCollateralized: boolean;
  status: 'active' | 'overdue' | 'paid';
}

const mockLoans: Loan[] = [
  {
    id: '1',
    borrowedToken: 'USDT',
    borrowedAmount: 5000,
    collateralToken: 'ETH',
    collateralAmount: 3.2,
    interestRate: 8.5,
    accruedInterest: 125.5,
    totalOwed: 5125.5,
    dueDate: new Date('2024-03-15'),
    isCollateralized: true,
    status: 'active',
  },
  {
    id: '2',
    borrowedToken: 'MON',
    borrowedAmount: 100,
    interestRate: 12.0,
    accruedInterest: 45.2,
    totalOwed: 145.2,
    isCollateralized: false,
    status: 'active',
  },
];

const lendingRates = {
  MON: { borrowRate: 12.0, supplyRate: 8.5 },
  ETH: { borrowRate: 6.5, supplyRate: 4.2 },
  USDT: { borrowRate: 8.5, supplyRate: 6.0 },
  USDC: { borrowRate: 8.2, supplyRate: 5.8 },
};

export function Lending() {
  const { isConnected } = useWeb3();
  const [activeTab, setActiveTab] = useState<'borrow' | 'supply' | 'my-loans'>('borrow');
  const [selectedToken, setSelectedToken] = useState(TOKENS.USDT);
  const [amount, setAmount] = useState('');
  const [collateralToken, setCollateralToken] = useState(TOKENS.ETH);
  const [collateralAmount, setCollateralAmount] = useState('');
  const [isCollateralized, setIsCollateralized] = useState(true);

  const handleBorrow = () => {
    if (!isConnected) {
      alert('请先连接钱包');
      return;
    }
    console.log('借贷参数:', {
      token: selectedToken.symbol,
      amount,
      collateralToken: collateralToken.symbol,
      collateralAmount,
      isCollateralized,
    });
  };

  const handleSupply = () => {
    if (!isConnected) {
      alert('请先连接钱包');
      return;
    }
    console.log('供给参数:', { token: selectedToken.symbol, amount });
  };

  const handleRepay = (loanId: string) => {
    console.log('还款:', loanId);
  };

  if (!isConnected) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto">
                <DollarSign className="h-8 w-8 text-accent" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">借贷中心</h2>
              <p className="text-muted-foreground">
                连接钱包开始借贷或供给资金，获得收益
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">借贷中心</h1>
          <p className="text-muted-foreground">借贷资金或供给流动性赚取收益</p>
        </div>

        {/* 标签切换 */}
        <div className="flex space-x-1 bg-surface rounded-lg p-1 mb-6 w-fit">
          <button
            onClick={() => setActiveTab('borrow')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === 'borrow'
                ? 'bg-accent text-accent-foreground shadow-glow'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            借贷
          </button>
          <button
            onClick={() => setActiveTab('supply')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === 'supply'
                ? 'bg-accent text-accent-foreground shadow-glow'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            供给
          </button>
          <button
            onClick={() => setActiveTab('my-loans')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === 'my-loans'
                ? 'bg-accent text-accent-foreground shadow-glow'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            我的借贷
          </button>
        </div>

        {/* 利率概览 */}
        <Card>
          <CardHeader>
            <CardTitle>市场利率</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {Object.entries(lendingRates).map(([token, rates]) => (
                <div key={token} className="p-4 bg-surface rounded-lg">
                  <div className="font-semibold mb-2">{token}</div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">借入利率:</span>
                      <span className="text-destructive">{formatPercentage(rates.borrowRate / 100)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">供给利率:</span>
                      <span className="text-success">{formatPercentage(rates.supplyRate / 100)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {activeTab === 'borrow' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5" />
                  <span>借贷资金</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 是否使用抵押物 */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground">借贷类型</label>
                  <div className="flex space-x-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={isCollateralized}
                        onChange={() => setIsCollateralized(true)}
                        className="text-accent"
                      />
                      <span>有抵押借贷</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={!isCollateralized}
                        onChange={() => setIsCollateralized(false)}
                        className="text-accent"
                      />
                      <span>无抵押借贷</span>
                    </label>
                  </div>
                </div>

                <TokenSelector
                  selectedToken={selectedToken}
                  onTokenSelect={setSelectedToken}
                  label="借贷代币"
                />

                <Input
                  label="借贷数量"
                  placeholder="0.0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  type="number"
                />

                {isCollateralized && (
                  <>
                    <TokenSelector
                      selectedToken={collateralToken}
                      onTokenSelect={setCollateralToken}
                      label="抵押物"
                      excludeTokens={[selectedToken.symbol]}
                    />

                    <Input
                      label="抵押物数量"
                      placeholder="0.0"
                      value={collateralAmount}
                      onChange={(e) => setCollateralAmount(e.target.value)}
                      type="number"
                      rightElement={
                        <Button variant="ghost" size="sm" className="text-xs px-2">
                          MAX
                        </Button>
                      }
                    />
                  </>
                )}

                <Button
                  onClick={handleBorrow}
                  className="w-full"
                  size="lg"
                  disabled={!amount || (isCollateralized && !collateralAmount)}
                >
                  借贷
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>借贷信息</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">借贷利率:</span>
                    <span className="font-medium text-destructive">
                      {formatPercentage((lendingRates[selectedToken.symbol as keyof typeof lendingRates]?.borrowRate || 0) / 100)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">借贷数量:</span>
                    <span className="font-medium">{amount || '0'} {selectedToken.symbol}</span>
                  </div>
                  {isCollateralized && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">抵押物:</span>
                        <span className="font-medium">{collateralAmount || '0'} {collateralToken.symbol}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">抵押率:</span>
                        <span className="font-medium">150%</span>
                      </div>
                    </>
                  )}
                </div>

                {!isCollateralized && (
                  <div className="mt-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Shield className="h-4 w-4 text-destructive" />
                      <span className="text-sm font-medium text-destructive">无抵押借贷</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      无抵押借贷仅对白名单用户开放，具有更高的利率和更严格的风控要求。
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'supply' && (
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>供给资金</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <TokenSelector
                  selectedToken={selectedToken}
                  onTokenSelect={setSelectedToken}
                  label="供给代币"
                />

                <Input
                  label="供给数量"
                  placeholder="0.0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  type="number"
                  rightElement={
                    <Button variant="ghost" size="sm" className="text-xs px-2">
                      MAX
                    </Button>
                  }
                />

                <Card variant="glass">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">供给利率:</span>
                      <span className="font-medium text-success">
                        {formatPercentage((lendingRates[selectedToken.symbol as keyof typeof lendingRates]?.supplyRate || 0) / 100)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">预计年收益:</span>
                      <span className="font-medium text-success">
                        +{formatNumber((parseFloat(amount) || 0) * 0.058)} {selectedToken.symbol}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Button
                  onClick={handleSupply}
                  className="w-full"
                  size="lg"
                  disabled={!amount}
                >
                  供给
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'my-loans' && (
          <div className="space-y-4">
            {mockLoans.map((loan) => (
              <Card key={loan.id}>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <div className="font-semibold text-lg mb-1">
                        {formatNumber(loan.borrowedAmount)} {loan.borrowedToken}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {loan.isCollateralized ? '有抵押借贷' : '无抵押借贷'}
                      </div>
                      {loan.collateralToken && (
                        <div className="text-xs text-muted-foreground">
                          抵押: {formatNumber(loan.collateralAmount!)} {loan.collateralToken}
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <div className="text-sm text-muted-foreground">利率</div>
                      <div className="font-semibold text-destructive">
                        {formatPercentage(loan.interestRate / 100)}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-muted-foreground">待还金额</div>
                      <div className="font-semibold">
                        {formatNumber(loan.totalOwed)} {loan.borrowedToken}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        利息: {formatNumber(loan.accruedInterest)}
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleRepay(loan.id)}
                      >
                        还款
                      </Button>
                      {loan.dueDate && (
                        <div className="text-xs text-muted-foreground flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          到期: {loan.dueDate.toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {mockLoans.length === 0 && (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <DollarSign className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">暂无借贷</h3>
                    <p className="text-muted-foreground mb-4">你还没有任何借贷记录</p>
                    <Button onClick={() => setActiveTab('borrow')}>
                      开始借贷
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}