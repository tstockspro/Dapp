import React, { useState } from 'react';
import { Droplets, Plus, TrendingUp, Zap, ArrowUpDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { TokenSelector } from '../components/TokenSelector';
import { formatNumber, formatPercentage } from '../lib/utils';
import { TOKENS } from '../lib/web3';
import { useWeb3 } from '../hooks/useWeb3';

interface Pool {
  id: string;
  tokenA: string;
  tokenB: string;
  liquidity: number;
  apy: number;
  volume24h: number;
  fees24h: number;
  userLiquidity?: number;
  userEarnings?: number;
}

const mockPools: Pool[] = [
  {
    id: '1',
    tokenA: 'USDT',
    tokenB: 'USDT',
    liquidity: 2450000,
    apy: 15.4,
    volume24h: 890000,
    fees24h: 2670,
    userLiquidity: 5420,
    userEarnings: 245.6,
  },
  {
    id: '2',
    tokenA: 'USDC',
    tokenB: 'USDC',
    liquidity: 5670000,
    apy: 12.8,
    volume24h: 1240000,
    fees24h: 3720,
  },
  {
    id: '3',
    tokenA: 'TESLA',
    tokenB: 'USDT',
    liquidity: 1890000,
    apy: 18.2,
    volume24h: 567000,
    fees24h: 1701,
  },
  {
    id: '4',
    tokenA: 'NVIDIA',
    tokenB: 'USDT',
    liquidity: 1890000,
    apy: 18.2,
    volume24h: 567000,
    fees24h: 1701,
  },
];

export function LiquidityPools() {
  const { isConnected } = useWeb3();
  const [activeTab, setActiveTab] = useState<'pools' | 'add' | 'my-liquidity'>('pools');
  const [tokenA, setTokenA] = useState(TOKENS.TESLA);
  const [tokenB, setTokenB] = useState(TOKENS.USDT);
  const [amountA, setAmountA] = useState('');
  const [amountB, setAmountB] = useState('');

  const handleAddLiquidity = () => {
    if (!isConnected) {
      alert('请先连接钱包');
      return;
    }
    console.log('添加流动性:', { tokenA: tokenA.symbol, tokenB: tokenB.symbol, amountA, amountB });
  };

  const handleRemoveLiquidity = (poolId: string) => {
    console.log('移除流动性:', poolId);
  };

  if (!isConnected) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                <Droplets className="h-8 w-8 text-primary-500" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">流动性池</h2>
              <p className="text-muted-foreground">
                连接钱包开始提供流动性，赚取交易手续费
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
          <h1 className="text-3xl font-bold text-foreground mb-2">流动性池</h1>
          <p className="text-muted-foreground">提供流动性赚取交易手续费和挖矿奖励</p>
        </div>

        {/* 标签切换 */}
        <div className="flex space-x-1 bg-surface rounded-lg p-1 mb-6 w-fit">
          <button
            onClick={() => setActiveTab('pools')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === 'pools'
                ? 'bg-accent text-accent-foreground shadow-glow'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            所有池
          </button>
          <button
            onClick={() => setActiveTab('add')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === 'add'
                ? 'bg-accent text-accent-foreground shadow-glow'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            添加流动性
          </button>
          <button
            onClick={() => setActiveTab('my-liquidity')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === 'my-liquidity'
                ? 'bg-accent text-accent-foreground shadow-glow'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            我的流动性
          </button>
        </div>

        {activeTab === 'pools' && (
          <div className="grid gap-4">
            {mockPools.map((pool) => (
              <Card key={pool.id} className="hover:bg-surface-elevated transition-all duration-200">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                    <div>
                      <div className="font-semibold text-lg">
                        {pool.tokenA}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        流动性池
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-muted-foreground">TVL</div>
                      <div className="font-semibold">${formatNumber(pool.liquidity)}</div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-muted-foreground">APY</div>
                      <div className="font-semibold text-success">{formatPercentage(pool.apy / 100)}</div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-muted-foreground">24h 交易量</div>
                      <div className="font-semibold">${formatNumber(pool.volume24h)}</div>
                      <div className="text-xs text-muted-foreground">手续费: ${formatNumber(pool.fees24h)}</div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          setTokenA(TOKENS[pool.tokenA as keyof typeof TOKENS]);
                          setTokenB(TOKENS[pool.tokenB as keyof typeof TOKENS]);
                          setActiveTab('add');
                        }}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        添加
                      </Button>
                      <Button variant="outline" size="sm">
                        查看
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'add' && (
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="h-5 w-5" />
                  <span>添加流动性</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 代币A */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-foreground">代币 A</label>
                    <span className="text-xs text-muted-foreground">余额: 25.6 {tokenA.symbol}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      placeholder="0.0"
                      value={amountA}
                      onChange={(e) => setAmountA(e.target.value)}
                      type="number"
                      rightElement={
                        <Button variant="ghost" size="sm" className="text-xs px-2">
                          MAX
                        </Button>
                      }
                    />
                    <TokenSelector
                      selectedToken={tokenA}
                      onTokenSelect={setTokenA}
                      excludeTokens={[tokenB.symbol]}
                    />
                  </div>
                </div>

                {/* 交换图标 */}
                {/* <div className="flex justify-center">
                  <div className="w-8 h-8 bg-surface rounded-full flex items-center justify-center">
                    <Plus className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div> */}

                {/* 代币B */}
                {/* <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-foreground">代币 B</label>
                    <span className="text-xs text-muted-foreground">余额: 1,200 {tokenB.symbol}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      placeholder="0.0"
                      value={amountB}
                      onChange={(e) => setAmountB(e.target.value)}
                      type="number"
                      rightElement={
                        <Button variant="ghost" size="sm" className="text-xs px-2">
                          MAX
                        </Button>
                      }
                    />
                    <TokenSelector
                      selectedToken={tokenB}
                      onTokenSelect={setTokenB}
                      excludeTokens={[tokenA.symbol]}
                    />
                  </div>
                </div> */}

                {/* 流动性信息 */}
                {amountA && amountB && (
                  <Card variant="glass">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">你将获得 LP 代币:</span>
                        <span className="font-medium">0.456 {tokenA.symbol}-{tokenB.symbol} LP</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">你的池份额:</span>
                        <span className="font-medium">0.1%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">汇率:</span>
                        <span className="font-medium">1 {tokenA.symbol} = 16.5 {tokenB.symbol}</span>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Button
                  onClick={handleAddLiquidity}
                  className="w-full"
                  size="lg"
                  disabled={!amountA || !amountB}
                >
                  添加流动性
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'my-liquidity' && (
          <div className="space-y-4">
            {mockPools
              .filter(pool => pool.userLiquidity)
              .map((pool) => (
                <Card key={pool.id}>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <div className="font-semibold text-lg mb-2">
                          {pool.tokenA}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          我的流动性
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-muted-foreground">投入价值</div>
                        <div className="font-semibold">${formatNumber(pool.userLiquidity!)}</div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-muted-foreground">累计收益</div>
                        <div className="font-semibold text-success">+${formatNumber(pool.userEarnings!)}</div>
                        <div className="text-xs text-muted-foreground">APY: {formatPercentage(pool.apy / 100)}</div>
                      </div>
                      
                      <div className="flex flex-col space-y-2">
                        <Button variant="outline" size="sm">
                          添加
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleRemoveLiquidity(pool.id)}
                        >
                          移除
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            
            {!mockPools.some(pool => pool.userLiquidity) && (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <Droplets className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">暂无流动性</h3>
                    <p className="text-muted-foreground mb-4">你还没有提供任何流动性</p>
                    <Button onClick={() => setActiveTab('add')}>
                      添加首个流动性位置
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