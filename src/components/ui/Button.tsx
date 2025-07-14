import React from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  asChild?: boolean;
}

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  asChild = false,
  children,
  ...props
}: ButtonProps) {
  const baseClasses = cn(
    'relative inline-flex items-center justify-center font-medium transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
    'disabled:opacity-50 disabled:pointer-events-none',
    'rounded-lg backdrop-blur-sm',
    {
      // 拟物化主按钮
      'bg-button-gradient text-white shadow-3d hover:shadow-glow active:shadow-pressed': variant === 'primary',
      // 次要按钮
      'bg-surface border border-border text-foreground shadow-glass hover:bg-surface-elevated': variant === 'secondary',
      // 轮廓按钮
      'border border-accent text-accent bg-transparent hover:bg-accent hover:text-accent-foreground': variant === 'outline',
      // 幽灵按钮
      'text-muted-foreground hover:text-foreground hover:bg-muted': variant === 'ghost',
      // 尺寸
      'h-8 px-3 text-sm': size === 'sm',
      'h-10 px-4 text-base': size === 'md',
      'h-12 px-6 text-lg': size === 'lg',
    },
    className
  );

  if (asChild) {
    return React.cloneElement(children as React.ReactElement, {
      className: cn(baseClasses, (children as React.ReactElement).props.className),
      ...props,
    });
  }

  return (
    <button
      className={baseClasses}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          加载中...
        </>
      ) : (
        children
      )}
    </button>
  );
}