// Custom button component with glass morphism
import React from 'react';
import { motion } from 'framer-motion';
import { LoadingSpinner } from './LoadingSpinner';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  className = '',
  onClick,
  type = 'button'
}) => {
  const baseClasses = `
    inline-flex items-center justify-center
    font-medium rounded-xl
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-purple-500/50
    disabled:opacity-50 disabled:cursor-not-allowed
    relative overflow-hidden
  `;

  const variantClasses = {
    primary: `
      bg-gradient-to-r from-purple-600 to-purple-700
      hover:from-purple-500 hover:to-purple-600
      text-white shadow-lg shadow-purple-500/25
      hover:shadow-xl hover:shadow-purple-500/40
    `,
    secondary: `
      bg-gradient-to-r from-gray-600 to-gray-700
      hover:from-gray-500 hover:to-gray-600
      text-white shadow-lg shadow-gray-500/25
    `,
    outline: `
      border-2 border-purple-500/50
      text-purple-300 hover:text-white
      hover:bg-purple-600/20 hover:border-purple-400
      backdrop-blur-sm
    `,
    ghost: `
      text-purple-300 hover:text-white
      hover:bg-purple-600/20
      backdrop-blur-sm
    `,
    danger: `
      bg-gradient-to-r from-red-600 to-red-700
      hover:from-red-500 hover:to-red-600
      text-white shadow-lg shadow-red-500/25
    `,
    success: `
      bg-gradient-to-r from-green-600 to-green-700
      hover:from-green-500 hover:to-green-600
      text-white shadow-lg shadow-green-500/25
    `
  };

  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-sm',
    large: 'px-6 py-3 text-base'
  };

  const isDisabled = disabled || loading;

  return (
    <motion.button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={isDisabled}
      onClick={onClick}
      whileHover={!isDisabled ? { scale: 1.05 } : {}}
      whileTap={!isDisabled ? { scale: 0.95 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {/* Glass reflection effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
      
      {/* Content */}
      <div className="relative flex items-center space-x-2">
        {loading && <LoadingSpinner size="small" color="white" />}
        <span>{children}</span>
      </div>
    </motion.button>
  );
};