import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Settings, TrendingUp } from 'lucide-react';
import { Button } from './ui/Button';
import { WalletConnect, MobileWalletConnect } from './WalletConnect';
import { cn } from '../lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/', icon: TrendingUp },
  { name: 'Buy Stock', href: '/swap' },
  { name: 'Leverage', href: '/leverage' },
  { name: 'Pools', href: '/liquidity' },
  // { name: '借贷中心', href: '/lending' },
  { name: 'History', href: '/history' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-button-gradient rounded-lg flex items-center justify-center shadow-glow">
                {/* <span className="text-white font-bold text-lg">L</span> */}
                <img src='/logo.png'></img>
              </div>
              <span className="text-xl font-bold text-foreground">
                Tstocks<span className="text-accent"> Pro</span>
              </span>
            </Link>
          </div>

          {/* 桶面导航 */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-accent text-accent-foreground shadow-glow'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* 右侧操作 */}
          <div className="flex items-center space-x-4">
            {/* 设置按钮 */}
            <Button variant="ghost" size="sm" className="hidden md:flex">
              <Settings className="h-4 w-4" />
            </Button>

            {/* 钱包连接 */}
            <div className="hidden md:block">
              <WalletConnect />
            </div>

            {/* 移动端菜单按钮 */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* 移动端菜单 */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background-secondary/95 backdrop-blur-md">
          <div className="px-4 py-4 space-y-3">
            {/* 钱包连接 */}
            <MobileWalletConnect />
            
            {/* 导航链接 */}
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-accent text-accent-foreground shadow-glow'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  <span>{item.name}</span>
                </Link>
              );
            })}

            {/* 设置 */}
            <Button
              variant="ghost"
              className="w-full justify-start space-x-3"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Settings className="h-4 w-4" />
              <span>设置</span>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}