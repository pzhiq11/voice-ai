import React, { InputHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  variant?: 'default' | 'filled';
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      leftIcon,
      rightIcon,
      fullWidth = false,
      variant = 'default',
      ...props
    },
    ref
  ) => {
    // 基础样式
    const baseStyles = 'rounded-lg text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200';
    
    // 变体样式
    const variantStyles = {
      default: 'bg-dark-800 border border-dark-700',
      filled: 'bg-dark-800/50 border border-dark-800/80 focus:bg-dark-800'
    };
    
    // 图标样式
    const withLeftIconStyles = leftIcon ? 'pl-10' : 'pl-4';
    const withRightIconStyles = rightIcon ? 'pr-10' : 'pr-4';
    
    // 错误样式
    const errorStyles = error ? 'border-red-500 focus:ring-red-500' : '';
    
    // 宽度样式
    const widthStyles = fullWidth ? 'w-full' : '';
    
    return (
      <div className={clsx('flex flex-col space-y-1', fullWidth && 'w-full', className)}>
        {label && (
          <label className="text-sm font-medium text-white/80">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-dark-400">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={clsx(
              baseStyles,
              variantStyles[variant],
              withLeftIconStyles,
              withRightIconStyles,
              errorStyles,
              widthStyles,
              'py-2'
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-dark-400">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input; 