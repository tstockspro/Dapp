import React, { useState } from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, Calculator, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { TokenSelector } from '../components/TokenSelector';
import { formatNumber, formatPercentage, calculateMinimumReceived } from '../lib/utils';
import { TOKENS } from '../lib/web3';
import { useWeb3 } from '../hooks/useWeb3';
import { useSettings } from '../contexts/SettingsContext';

interface Position {
  id: string;
  collateralToken: string;
  collateralAmount: number;
  borrowedToken: string;
  borrowedAmount: number;
  targetToken: string;
  targetAmount: number;
  leverage: number;
  entryPrice: number;
  currentPrice: number;
  liquidationPrice: number;
  pnl: number;
  pnlPercentage: number;
  status: 'open' | 'closed';
}

// 模拟仓位数据
const mockPositions: Position[] = [
  {
    id: '1',
    collateralToken: 'USDT',
    collateralAmount: 1.0,
    borrowedToken: 'USDT',
    borrowedAmount: 3000,
    targetToken: 'NVIDIA',
    targetAmount: 25.6,
    leverage: 3,
    entryPrice: 145.32,
    currentPrice: 152.40,
    liquidationPrice: 120.25,
    pnl: 181.25,
    pnlPercentage: 0.048,
    status: 'open',
  },
];

export function LeverageTrading() {
  const { isConnected } = useWeb3();
  const { slippageTolerance } = useSettings();
  const [activeTab, setActiveTab] = useState<'open' | 'positions'>('open');
  
  // 开仓表单状态
  const [collateralToken, setCollateralToken] = useState(TOKENS.USDC);
  const [collateralAmount, setCollateralAmount] = useState('');
  const [targetToken, setTargetToken] = useState(TOKENS.TESLA);
  const [leverage, setLeverage] = useState(2);
  const [isLong, setIsLong] = useState(true);

  // 计算数据
  const collateralValue = parseFloat(collateralAmount) || 0;
  const totalValue = collateralValue * leverage;
  const borrowedValue = totalValue - collateralValue;
  const targetPrice = 145.32; // 模拟价格
  const estimatedTargetAmount = totalValue / targetPrice;
  const liquidationPrice = targetPrice * (1 - 0.8 / leverage); // 简化计算
  const minimumReceived = calculateMinimumReceived(estimatedTargetAmount, slippageTolerance);

  const handleOpenPosition = () => {
    if (!isConnected) {
      alert('请先连接钱包');
      return;
    }
    // 这里将有智能合约交互逻辑
    console.log('开仓参数:', {
      collateralToken: collateralToken.symbol,
      collateralAmount,
      targetToken: targetToken.symbol,
      leverage,
      isLong,
    });
  };

  const handleClosePosition = (positionId: string) => {
    // 这里将有平仓逻辑
    console.log('平仓:', positionId);
  };

  if (!isConnected) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto">
                <TrendingUp className="h-8 w-8 text-secondary-500" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">杠杆交易</h2>
              <p className="text-muted-foreground">
                连接钱包开始杠杆交易，放大你的交易潜力
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Leverage Trading</h1>
          <p className="text-muted-foreground">Spot Leverage trading protocol . Max 20x Support !</p>
        </div>

        {/* 标签切换 */}
        <div className="flex space-x-1 bg-surface rounded-lg p-1 mb-6 w-fit">
          <button
            onClick={() => setActiveTab('open')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === 'open'
                ? 'bg-accent text-accent-foreground shadow-glow'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            开仓
          </button>
          <button
            onClick={() => setActiveTab('positions')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === 'positions'
                ? 'bg-accent text-accent-foreground shadow-glow'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            我的仓位
          </button>
        </div>

        {activeTab === 'open' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 开仓表单 */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>开启杠杆仓位</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 做多/做空选择 */}
                <div className="flex space-x-2">
                  <Button
                    variant={isLong ? 'primary' : 'outline'}
                    onClick={() => setIsLong(true)}
                    className="flex-1"
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    做多 (Long)
                  </Button>
                  <Button
                    variant={!isLong ? 'primary' : 'outline'}
                    onClick={() => setIsLong(false)}
                    className="flex-1"
                  >
                    <TrendingDown className="h-4 w-4 mr-2" />
                    做空 (Short)
                  </Button>
                </div>

                {/* 抵押物选择 */}
                <TokenSelector
                  selectedToken={collateralToken}
                  onTokenSelect={setCollateralToken}
                  label="抵押物"
                  excludeTokens={[targetToken.symbol]}
                />

                {/* 抵押物数量 */}
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

                {/* 目标代币 */}
                <TokenSelector
                  selectedToken={targetToken}
                  onTokenSelect={setTargetToken}
                  label="目标代币"
                  excludeTokens={[collateralToken.symbol]}
                />

                {/* 杠杆倍数 */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground">杠杆倍数: {leverage}x</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[2, 3, 5, 10].map((value) => (
                      <Button
                        key={value}
                        variant={leverage === value ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => setLeverage(value)}
                      >
                        {value}x
                      </Button>
                    ))}
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    step="0.1"
                    value={leverage}
                    onChange={(e) => setLeverage(parseFloat(e.target.value))}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <Button
                  onClick={handleOpenPosition}
                  className="w-full"
                  size="lg"
                  disabled={!collateralAmount || !collateralValue}
                >
                  开启{isLong ? '做多' : '做空'}仓位
                </Button>
              </CardContent>
            </Card>

            {/* 交易信息 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calculator className="h-5 w-5" />
                  <span>交易信息</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">抵押物价值:</span>
                    <span className="font-medium">${formatNumber(collateralValue * 2340)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">借入价值:</span>
                    <span className="font-medium">${formatNumber(borrowedValue * 2340)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">总交易量:</span>
                    <span className="font-medium">${formatNumber(totalValue * 2340)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">预计获得:</span>
                    <span className="font-medium">
                      {formatNumber(estimatedTargetAmount)} {targetToken.symbol}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">最少获得:</span>
                    <span className="font-medium">
                      {formatNumber(minimumReceived)} {targetToken.symbol}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">清算价格:</span>
                    <span className="font-medium text-destructive">
                      ${formatNumber(liquidationPrice)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">滑点容忍:</span>
                    <span className="font-medium">{slippageTolerance}%</span>
                  </div>
                </div>

                {/* 风险提示 */}
                <div className="mt-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    <span className="text-sm font-medium text-destructive">风险提示</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    杠杆交易具有高风险，可能导致全部资金损失。请确保你理解相关风险。
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* 仓位列表 */
          <Card>
            <CardHeader>
              <CardTitle>我的仓位</CardTitle>
            </CardHeader>
            <CardContent>
              {mockPositions.length > 0 ? (
                <div className="space-y-4">
                  {mockPositions.map((position) => (
                    <div
                      key={position.id}
                      className="p-6 bg-surface rounded-lg border border-border hover:bg-surface-elevated transition-all duration-200"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <div className="text-sm text-muted-foreground">交易对</div>
                          <div className="font-semibold">
                            {position.targetToken}/{position.collateralToken}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {position.leverage}x 杠杆
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-sm text-muted-foreground">价格</div>
                          <div className="font-semibold">
                            ${formatNumber(position.currentPrice)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            入场: ${formatNumber(position.entryPrice)}
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-sm text-muted-foreground">盈亏</div>
                          <div className={`font-semibold ${
                            position.pnl >= 0 ? 'text-success' : 'text-destructive'
                          }`}>
                            {position.pnl >= 0 ? '+' : ''}${formatNumber(position.pnl)}
                          </div>
                          <div className={`text-xs ${
                            position.pnlPercentage >= 0 ? 'text-success' : 'text-destructive'
                          }`}>
                            {position.pnlPercentage >= 0 ? '+' : ''}{formatPercentage(position.pnlPercentage)}
                          </div>
                        </div>
                        
                        <div className="flex flex-col space-y-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleClosePosition(position.id)}
                          >
                            平仓
                          </Button>
                          <div className="text-xs text-muted-foreground">
                            清算: ${formatNumber(position.liquidationPrice)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">暂无仓位</h3>
                  <p className="text-muted-foreground mb-4">你还没有开启任何杠杆仓位</p>
                  <Button onClick={() => setActiveTab('open')}>
                    开启首个仓位
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}