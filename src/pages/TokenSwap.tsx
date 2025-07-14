import React, { useState } from 'react';
import { ArrowUpDown, Settings, TrendingUp, ArrowDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { TokenSelector } from '../components/TokenSelector';
import { formatNumber, formatPercentage, calculateMinimumReceived, calculatePriceImpact } from '../lib/utils';
import { TOKENS } from '../lib/web3';
import { useWeb3 } from '../hooks/useWeb3';
import { useSettings } from '../contexts/SettingsContext';

// 模拟价格数据
const mockPrices: Record<string, number> = {
  TESLA: 1234123,
  NVIDIA:2138213,
  MON: 145.32,
  ETH: 2340.50,
  USDT: 1.00,
  USDC: 0.999,
};

export function TokenSwap() {
  const { isConnected } = useWeb3();
  const { slippageTolerance } = useSettings();
  
  const [fromToken, setFromToken] = useState(TOKENS.TESLA);
  const [toToken, setToToken] = useState(TOKENS.USDC);
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [isReversed, setIsReversed] = useState(false);

  const fromValue = parseFloat(fromAmount) || 0;
  const fromPrice = mockPrices[fromToken.symbol] || 0;
  const toPrice = mockPrices[toToken.symbol] || 0;
  const exchangeRate = fromPrice / toPrice;
  const calculatedToAmount = fromValue * exchangeRate;
  const minimumReceived = calculateMinimumReceived(calculatedToAmount, slippageTolerance);
  const priceImpact = calculatePriceImpact(fromValue, calculatedToAmount, exchangeRate);

  // 当fromAmount变化时自动计算toAmount
  React.useEffect(() => {
    if (fromAmount && !isReversed) {
      setToAmount(calculatedToAmount.toFixed(6));
    }
  }, [fromAmount, fromToken, toToken, isReversed]);

  const handleSwapTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  const handleFromAmountChange = (value: string) => {
    setFromAmount(value);
    setIsReversed(false);
  };

  const handleToAmountChange = (value: string) => {
    setToAmount(value);
    setIsReversed(true);
    if (value) {
      const reverseAmount = (parseFloat(value) * toPrice) / fromPrice;
      setFromAmount(reverseAmount.toFixed(6));
    }
  };

  const handleSwap = () => {
    if (!isConnected) {
      alert('请先连接钱包');
      return;
    }
    // 这里将有Uniswap交换逻辑
    console.log('交换参数:', {
      fromToken: fromToken.symbol,
      toToken: toToken.symbol,
      fromAmount,
      toAmount,
      slippageTolerance,
    });
  };

  if (!isConnected) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                <ArrowUpDown className="h-8 w-8 text-primary-500" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">Spot Trading</h2>
              <p className="text-muted-foreground">
                连接钱包开始交换代币，享受去中心化交易
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Spot Trading</h1>
          <p className="text-muted-foreground">Buy / Sell your Stock now ! </p>
        </div>

        {/* 交换表单 */}
        <Card className="bg-card-gradient">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <ArrowUpDown className="h-5 w-5" />
                <span>交换</span>
              </CardTitle>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 从 */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">从</label>
                <span className="text-xs text-muted-foreground">余额: 2.45 {fromToken.symbol}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="0.0"
                  value={fromAmount}
                  onChange={(e) => handleFromAmountChange(e.target.value)}
                  type="number"
                  className="text-lg font-semibold"
                  rightElement={
                    <Button variant="ghost" size="sm" className="text-xs px-2">
                      MAX
                    </Button>
                  }
                />
                <TokenSelector
                  selectedToken={fromToken}
                  onTokenSelect={setFromToken}
                  excludeTokens={[toToken.symbol]}
                />
              </div>
              {fromAmount && (
                <div className="text-xs text-muted-foreground">
                  约 ${formatNumber(fromValue * fromPrice)}
                </div>
              )}
            </div>

            {/* 交换按钮 */}
            <div className="flex justify-center">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleSwapTokens}
                className="w-10 h-10 p-0 rounded-full"
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
            </div>

            {/* 到 */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">到</label>
                <span className="text-xs text-muted-foreground">余额: 0.00 {toToken.symbol}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="0.0"
                  value={toAmount}
                  onChange={(e) => handleToAmountChange(e.target.value)}
                  type="number"
                  className="text-lg font-semibold"
                />
                <TokenSelector
                  selectedToken={toToken}
                  onTokenSelect={setToToken}
                  excludeTokens={[fromToken.symbol]}
                />
              </div>
              {toAmount && (
                <div className="text-xs text-muted-foreground">
                  约 ${formatNumber(calculatedToAmount * toPrice)}
                </div>
              )}
            </div>

            {/* 交易信息 */}
            {fromAmount && toAmount && (
              <div className="bg-surface rounded-lg p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">汇率:</span>
                  <span className="font-medium">
                    1 {fromToken.symbol} = {formatNumber(exchangeRate)} {toToken.symbol}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">最小接收:</span>
                  <span className="font-medium">
                    {formatNumber(minimumReceived)} {toToken.symbol}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">价格影响:</span>
                  <span className={`font-medium ${
                    priceImpact > 0.05 ? 'text-destructive' : priceImpact > 0.01 ? 'text-yellow-500' : 'text-success'
                  }`}>
                    {formatPercentage(priceImpact)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">滑点容忍:</span>
                  <span className="font-medium">{slippageTolerance}%</span>
                </div>
              </div>
            )}

            <Button
              onClick={handleSwap}
              className="w-full"
              size="lg"
              disabled={!fromAmount || !toAmount}
            >
              交换
            </Button>
          </CardContent>
        </Card>

        {/* 价格图表区域 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>{fromToken.symbol}/{toToken.symbol} 价格趋势</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-32 flex items-center justify-center text-muted-foreground">
              Comming soon...
            </div>
          </CardContent>
        </Card>

        {/* 最近交易 */}
        <Card>
          <CardHeader>
            <CardTitle>最近交易</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { from: 'TSLA', to: 'USDT', amount: '1.5', time: '2 分钟前' },
                { from: 'USDT', to: 'ETH', amount: '500', time: '8 分钟前' },
                { from: 'NVIDIA', to: 'USDC', amount: '10.2', time: '15 分钟前' },
              ].map((tx, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-surface rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="text-sm font-medium">
                      {tx.amount} {tx.from} → {tx.to}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">{tx.time}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}