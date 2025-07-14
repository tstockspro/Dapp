import React, { useState } from 'react';
import { History, ExternalLink, Filter, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { formatNumber, formatAddress } from '../lib/utils';
import { useWeb3 } from '../hooks/useWeb3';

interface Transaction {
  id: string;
  type: '杠杆开仓' | '杠杆平仓' | '代币交换' | '流动性添加' | '流动性移除' | '借贷' | '还款' | '供给';
  tokens: string;
  amount: string;
  value: string;
  txHash: string;
  status: '成功' | '失败' | '待确认';
  timestamp: Date;
  gasUsed?: number;
  gasFee?: number;
}

const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: '杠杆开仓',
    tokens: 'TSLA/USDT',
    amount: '+25.6 TSLA',
    value: '$3,720.83',
    txHash: '0x1234567890abcdef1234567890abcdef12345678',
    status: '成功',
    timestamp: new Date('2024-01-15T10:30:00'),
    gasUsed: 185420,
    gasFee: 0.0045,
  },
  {
    id: '2',
    type: '代币交换',
    tokens: 'NVIDIA → USDT',
    amount: '-1.5 NVIDIA',
    value: '+3,510.75 USDT',
    txHash: '0x2345678901abcdef2345678901abcdef23456789',
    status: '成功',
    timestamp: new Date('2024-01-15T09:15:00'),
    gasUsed: 95320,
    gasFee: 0.0023,
  },
  {
    id: '3',
    type: '流动性添加',
    tokens: 'USDT LP',
    amount: '+0.456 LP',
    value: '$1,230.45',
    txHash: '0x3456789012abcdef3456789012abcdef34567890',
    status: '成功',
    timestamp: new Date('2024-01-14T16:45:00'),
    gasUsed: 125680,
    gasFee: 0.0031,
  },
  {
    id: '4',
    type: '借贷',
    tokens: 'USDT',
    amount: '+5,000 USDT',
    value: '$5,000.00',
    txHash: '0x4567890123abcdef4567890123abcdef45678901',
    status: '成功',
    timestamp: new Date('2024-01-14T14:20:00'),
    gasUsed: 78950,
    gasFee: 0.0019,
  },
  {
    id: '5',
    type: '杠杆平仓',
    tokens: 'TESLA/USDC',
    amount: '-2.3 TESLA',
    value: '$5,382.15',
    txHash: '0x5678901234abcdef5678901234abcdef56789012',
    status: '失败',
    timestamp: new Date('2024-01-14T11:10:00'),
    gasUsed: 145230,
    gasFee: 0.0036,
  },
];

const typeColors: Record<string, string> = {
  '杠杆开仓': 'text-success',
  '杠杆平仓': 'text-destructive',
  '代币交换': 'text-accent',
  '流动性添加': 'text-primary-500',
  '流动性移除': 'text-secondary-500',
  '借贷': 'text-yellow-500',
  '还款': 'text-green-500',
  '供给': 'text-blue-500',
};

const statusColors: Record<string, string> = {
  '成功': 'text-success bg-success/10 border-success/20',
  '失败': 'text-destructive bg-destructive/10 border-destructive/20',
  '待确认': 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
};

export function TransactionHistory() {
  const { isConnected } = useWeb3();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filteredTransactions = mockTransactions.filter((tx) => {
    const matchesSearch = 
      tx.tokens.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.txHash.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = selectedType === 'all' || tx.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || tx.status === selectedStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const openTransaction = (txHash: string) => {
    // 在区块链浏览器中打开交易
    window.open(`https://scan.monad.xyz/tx/${txHash}`, '_blank');
  };

  const exportTransactions = () => {
    // 导出交易历史
    const csvContent = [
      ['类型', '代币', '数量', '价值', '状态', '时间', 'Hash'].join(','),
      ...filteredTransactions.map(tx => [
        tx.type,
        tx.tokens,
        tx.amount,
        tx.value,
        tx.status,
        tx.timestamp.toLocaleString(),
        tx.txHash
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tstocks-transactions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (!isConnected) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                <History className="h-8 w-8 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">交易历史</h2>
              <p className="text-muted-foreground">
                连接钱包查看你的交易历史记录
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
          <h1 className="text-3xl font-bold text-foreground mb-2">交易历史</h1>
          <p className="text-muted-foreground">查看你所有的交易记录和操作历史</p>
        </div>

        {/* 筛选和搜索 */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                placeholder="搜索交易哈希或代币..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="h-10 px-3 py-2 bg-input border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="all">所有类型</option>
                <option value="杠杆开仓">杠杆开仓</option>
                <option value="杠杆平仓">杠杆平仓</option>
                <option value="代币交换">代币交换</option>
                <option value="流动性添加">流动性添加</option>
                <option value="流动性移除">流动性移除</option>
                <option value="借贷">借贷</option>
                <option value="还款">还款</option>
              </select>
              
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="h-10 px-3 py-2 bg-input border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="all">所有状态</option>
                <option value="成功">成功</option>
                <option value="失败">失败</option>
                <option value="待确认">待确认</option>
              </select>
              
              <Button
                variant="outline"
                onClick={exportTransactions}
                className="flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>导出</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 交易列表 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>交易记录</span>
              <span className="text-sm font-normal text-muted-foreground">
                共 {filteredTransactions.length} 条记录
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredTransactions.length > 0 ? (
              <div className="space-y-3">
                {filteredTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-4 bg-surface rounded-lg border border-border hover:bg-surface-elevated transition-all duration-200"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                      <div>
                        <div className={`font-medium text-sm ${typeColors[tx.type] || 'text-foreground'}`}>
                          {tx.type}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {tx.timestamp.toLocaleString()}
                        </div>
                      </div>
                      
                      <div>
                        <div className="font-medium text-sm text-foreground">{tx.tokens}</div>
                        <div className="text-xs text-muted-foreground">{tx.amount}</div>
                      </div>
                      
                      <div>
                        <div className="font-medium text-sm text-foreground">{tx.value}</div>
                        {tx.gasFee && (
                          <div className="text-xs text-muted-foreground">
                            Gas: {tx.gasFee} ETH
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                          statusColors[tx.status] || 'text-muted-foreground bg-muted border-border'
                        }`}>
                          {tx.status}
                        </span>
                      </div>
                      
                      <div className="text-xs text-muted-foreground">
                        {formatAddress(tx.txHash)}
                      </div>
                      
                      <div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openTransaction(tx.txHash)}
                          className="flex items-center space-x-1"
                        >
                          <ExternalLink className="h-3 w-3" />
                          <span>查看</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <History className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">暂无交易记录</h3>
                <p className="text-muted-foreground">
                  {searchQuery || selectedType !== 'all' || selectedStatus !== 'all'
                    ? '没有找到匹配的交易记录'
                    : '你还没有进行任何交易'
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}