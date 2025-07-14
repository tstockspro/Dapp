import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Activity, Zap, Droplets } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { formatNumber, formatPercentage } from '../lib/utils';
import { useWeb3 } from '../hooks/useWeb3';
import { Link } from 'react-router-dom';
import { WalletConnect } from '@/components/WalletConnect';
import { ConnectButton , useConnectModal } from '@rainbow-me/rainbowkit';
// 模拟数据
const portfolioData = {
  totalValue: 125420.50,
  totalPnL: 8650.25,
  pnlPercentage: 0.074,
  positions: 3,
  liquidityPools: 2,
};



const marketData = [
  { symbol: 'TSLA', price: 145.32, change: 0.058, volume: '2.4M' },
  { symbol: 'NVDA', price: 2340.50, change: -0.023, volume: '1.2B' },
  { symbol: 'APPLE', price: 1.00, change: 0.001, volume: '8.9B' },
  { symbol: 'GOOGLE', price: 0.999, change: -0.001, volume: '4.5B' },
];

const recentTransactions = [
  {
    id: 1,
    type: '开仓',
    token: 'TSLA/USDT',
    amount: '+2.5 TSLA',
    value: '$364.80',
    status: '成功',
    timestamp: '2 分钟前',
  },
  {
    id: 2,
    type: '添加流动性',
    token: 'APPLE/USDC',
    amount: '+0.5 APPLE',
    value: '$1,170.25',
    status: '成功',
    timestamp: '15 分钟前',
  },
  {
    id: 3,
    type: '代币交换',
    token: 'USDT → GOOGLE',
    amount: '-500 USDT',
    value: '+3.44 GOOGLE',
    status: '成功',
    timestamp: '1 小时前',
  },
];

export function Dashboard() {
  const { isConnected, address, ethBalance } = useWeb3();
  const {
    openConnectModal
  } = useConnectModal()
  if (!isConnected) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto">
                <Activity className="h-8 w-8 text-accent" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">Welcome to tstocks</h2>
              <p className="text-muted-foreground">
                Start your on-chain stock trading 
              </p>
              <Button asChild className="w-full" onClick={openConnectModal}>
                <div>Connect EVM Wallet</div>
              </Button>
              <Button asChild className="w-full" variant="outline">
                <Link to="/">Connect SOLANA Wallet</Link>
              </Button>
              <Button asChild className="w-full" variant="secondary">
                <Link to="/">Connect Tonconnect</Link>
              </Button>
              <Button asChild className="w-full" variant="ghost">
                <Link to="/">Continue with Email</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      <div className="max-w-7xl mx-auto">
        {/* 欢迎标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">仪表板</h1>
          <p className="text-muted-foreground">欢迎回来，管理你的 DeFi 投资组合</p>
        </div>

        {/* 投资组合概览 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-card-gradient border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">总资产</p>
                  <p className="text-2xl font-bold text-foreground">
                    ${formatNumber(portfolioData.totalValue)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card-gradient border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">总盈亏</p>
                  <p className={`text-2xl font-bold ${
                    portfolioData.totalPnL >= 0 ? 'text-success' : 'text-destructive'
                  }`}>
                    {portfolioData.totalPnL >= 0 ? '+' : ''}${formatNumber(portfolioData.totalPnL)}
                  </p>
                  <p className={`text-xs ${
                    portfolioData.pnlPercentage >= 0 ? 'text-success' : 'text-destructive'
                  }`}>
                    {portfolioData.pnlPercentage >= 0 ? '+' : ''}{formatPercentage(portfolioData.pnlPercentage)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-success/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card-gradient border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">活跃仓位</p>
                  <p className="text-2xl font-bold text-foreground">
                    {portfolioData.positions}
                  </p>
                </div>
                <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center">
                  <Zap className="h-6 w-6 text-secondary-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card-gradient border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">流动性池</p>
                  <p className="text-2xl font-bold text-foreground">
                    {portfolioData.liquidityPools}
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Droplets className="h-6 w-6 text-primary-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 市场数据 */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>市场数据</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {marketData.map((token) => (
                  <div
                    key={token.symbol}
                    className="flex items-center justify-between p-4 rounded-lg bg-surface hover:bg-surface-elevated transition-all duration-200"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                        <span className="font-semibold text-sm">{token.symbol}</span>
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{token.symbol}</div>
                        <div className="text-sm text-muted-foreground">交易量: {token.volume}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-foreground">
                        ${formatNumber(token.price)}
                      </div>
                      <div className={`text-sm flex items-center ${
                        token.change >= 0 ? 'text-success' : 'text-destructive'
                      }`}>
                        {token.change >= 0 ? (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        ) : (
                          <TrendingDown className="h-3 w-3 mr-1" />
                        )}
                        {token.change >= 0 ? '+' : ''}{formatPercentage(token.change)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex space-x-3">
                <Button asChild variant="primary" className="flex-1">
                  <Link to="/swap">代币交换</Link>
                </Button>
                <Button asChild variant="secondary" className="flex-1">
                  <Link to="/leverage">杠杆交易</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 最近交易 */}
          <Card>
            <CardHeader>
              <CardTitle>最近交易</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-3 rounded-lg bg-surface hover:bg-surface-elevated transition-all duration-200"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">{tx.type}</span>
                      <span className="text-xs text-muted-foreground">{tx.timestamp}</span>
                    </div>
                    <div className="text-sm text-muted-foreground mb-1">{tx.token}</div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">{tx.amount}</span>
                      <span className="text-xs text-muted-foreground">{tx.value}</span>
                    </div>
                  </div>
                ))}
              </div>
              <Button asChild variant="outline" className="w-full mt-4">
                <Link to="/history">查看全部</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* 快速操作 */}
        <Card>
          <CardHeader>
            <CardTitle>快速操作</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button asChild variant="outline" size="lg" className="h-15">
                <Link to="/swap" className="flex flex-col items-center space-y-2">
                  <DollarSign className="h-6 w-6" />
                  <span>Buy Stocks</span>
                </Link>
              </Button>
              <Button asChild variant="primary" size="lg" className="h-15">
                <Link to="/leverage" className="flex flex-col items-center space-y-2">
                  <Zap className="h-6 w-6" />
                  <span>Future Market</span>
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg" className="h-15">
                <Link to="/liquidity" className="flex flex-col items-center space-y-2">
                  <Droplets className="h-6 w-6" />
                  <span>Add Liquidity</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}