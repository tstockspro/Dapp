// Glass morphism card component
import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'small' | 'medium' | 'large';
  hover?: boolean;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  padding = 'medium',
  hover = true,
  onClick
}) => {
  const paddingClasses = {
    none: '',
    small: 'p-3',
    medium: 'p-6',
    large: 'p-8'
  };

  const baseClasses = `
    relative overflow-hidden
    bg-gradient-to-br from-purple-900/40 via-purple-800/30 to-purple-900/40
    backdrop-blur-xl
    border border-purple-500/20
    rounded-2xl
    shadow-xl shadow-purple-900/20
    transition-all duration-300
  `;

  const hoverClasses = hover ? `
    hover:shadow-2xl hover:shadow-purple-500/30
    hover:border-purple-400/40
    hover:scale-[1.02]
    cursor-pointer
  ` : '';

  return (
    <motion.div
      className={`${baseClasses} ${hoverClasses} ${paddingClasses[padding]} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={hover ? { scale: 1.02 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      onClick={onClick}
    >
      {/* Glass reflection effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none"/>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};