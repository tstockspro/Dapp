import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';

import { config } from './lib/web3';
import { SettingsProvider } from './contexts/SettingsContext';
import { Header } from './components/Header';
import { Dashboard } from './pages/Dashboard';
import { LeverageTrading } from './pages/LeverageTrading';
import { LiquidityPools } from './pages/LiquidityPools';
import { TokenSwap } from './pages/TokenSwap';
import { Lending } from './pages/Lending';
import { TransactionHistory } from './pages/TransactionHistory';

const queryClient = new QueryClient();

// 自定义RainbowKit主题
const customTheme = darkTheme({
  accentColor: '#00D4FF',
  accentColorForeground: '#0D1B2A',
  borderRadius: 'medium',
  fontStack: 'system',
  overlayBlur: 'small',
});

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={customTheme}>
          <SettingsProvider>
            <Router>
              <div className="min-h-screen bg-background">
                {/* 渐变背景 */}
                <div className="fixed inset-0 bg-gradient-to-br from-background via-background-secondary to-background-tertiary" />
                
                {/* 装饰性光效 */}
                <div className="fixed top-0 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-float" />
                <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
                
                {/* 主要内容 */}
                <div className="relative z-10">
                  <Header />
                  <main>
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/leverage" element={<LeverageTrading />} />
                      <Route path="/liquidity" element={<LiquidityPools />} />
                      <Route path="/swap" element={<TokenSwap />} />
                      {/* <Route path="/lending" element={<Lending />} /> */}
                      <Route path="/history" element={<TransactionHistory />} />
                    </Routes>
                  </main>
                </div>
              </div>
            </Router>
          </SettingsProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;