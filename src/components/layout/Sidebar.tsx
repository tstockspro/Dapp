// Sidebar navigation component
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  Wallet, 
  TrendingUp, 
  PieChart, 
  Settings, 
  CreditCard,
  Users,
  Shield,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 40
      }
    },
    closed: {
      x: "-100%",
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 40
      }
    }
  };

  const menuItems = [
    { icon: BarChart3, label: 'Dapp', href: '#', active: true },
    // { icon: PieChart, label: 'Portfolio', href: '#' },
    // { icon: TrendingUp, label: 'Positions', href: '#' },
    // { icon: Users, label: 'Vaults', href: '#' },
    // { icon: CreditCard, label: 'Deposit', href: '#' },
    // { icon: Wallet, label: 'Wallet', href: '#' },
    // { icon: Shield, label: 'Security', href: '#' },
    // { icon: Settings, label: 'Settings', href: '#' }
  ];

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-gradient-to-b from-purple-900/95 via-purple-800/95 to-purple-900/95 backdrop-blur-xl border-r border-purple-500/30 z-50 md:z-30"
        variants={sidebarVariants}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
      >
        <div className="p-6">
          {/* Quick Stats */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-purple-200 mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <QuickStat label="Open Positions" value="3" change="+12%" />
              <QuickStat label="24h P&L" value="+$1,260" change="+8.5%" />
              <QuickStat label="Total Value" value="$38.4K" change="+3.2%" />
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-1">
            {menuItems.map((item, index) => (
              <SidebarMenuItem
                key={item.label}
                icon={item.icon}
                label={item.label}
                href={item.href}
                active={item.active}
                delay={index * 0.1}
              />
            ))}
          </nav>
        </div>
      </motion.aside>
    </>
  );
};

interface SidebarMenuItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  active?: boolean;
  delay?: number;
}

const SidebarMenuItem: React.FC<SidebarMenuItemProps> = ({ 
  icon: Icon, 
  label, 
  href, 
  active = false,
  delay = 0
}) => {
  return (
    <motion.a
      href={href}
      className={`flex items-center justify-between p-3 rounded-xl transition-all duration-200 group ${
        active 
          ? 'bg-purple-600/50 text-white shadow-lg shadow-purple-500/25' 
          : 'text-purple-200 hover:text-white hover:bg-purple-700/30'
      }`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center space-x-3">
        <Icon className="w-5 h-5" />
        <span className="font-medium">{label}</span>
      </div>
      <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.a>
  );
};

interface QuickStatProps {
  label: string;
  value: string;
  change: string;
}

const QuickStat: React.FC<QuickStatProps> = ({ label, value, change }) => {
  const isPositive = change.startsWith('+');
  
  return (
    <div className="bg-purple-800/30 rounded-lg p-3 border border-purple-500/20">
      <p className="text-xs text-purple-300">{label}</p>
      <div className="flex items-center justify-between mt-1">
        <span className="text-sm font-bold text-white">{value}</span>
        <span className={`text-xs font-medium ${
          isPositive ? 'text-green-400' : 'text-red-400'
        }`}>
          {change}
        </span>
      </div>
    </div>
  );
};