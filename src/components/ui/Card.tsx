import React from 'react';
import { clsx } from 'clsx';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'hoverable' | 'bordered' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = 'default',
  padding = 'md',
  onClick
}) => {
  // 基础样式
  const baseStyles = 'rounded-xl overflow-hidden transition-all duration-200';
  
  // 变体样式
  const variantStyles = {
    default: 'bg-dark-800 border border-dark-700 shadow-lg',
    hoverable: 'bg-dark-800 border border-dark-700 shadow-lg hover:shadow-xl hover:scale-[1.01] cursor-pointer',
    bordered: 'bg-dark-800 border-2 border-primary-500 shadow-lg',
    glass: 'bg-dark-800/80 backdrop-blur-lg border border-dark-700/50 shadow-lg'
  };
  
  // 内边距样式
  const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-7'
  };
  
  return (
    <div
      className={clsx(
        baseStyles,
        variantStyles[variant],
        paddingStyles[padding],
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
};

export default Card; 