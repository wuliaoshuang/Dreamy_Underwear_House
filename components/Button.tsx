import React from 'react';
import { HapticsService } from '../services/hapticsService';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
  disableHaptics?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading, 
  className = '', 
  disabled,
  disableHaptics = false,
  onClick,
  ...props 
}) => {
  const baseStyles = "relative overflow-hidden px-8 py-3 rounded-2xl font-bold transition-all duration-200 shadow-md flex items-center justify-center gap-2 jelly-active disabled:opacity-60 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-br from-pink-400 to-pink-500 hover:from-pink-300 hover:to-pink-400 text-white shadow-pink-200 border-b-4 border-pink-600 active:border-b-0 active:translate-y-1",
    secondary: "bg-white hover:bg-pink-50 text-pink-500 border-2 border-pink-200 hover:border-pink-300 shadow-sm",
    danger: "bg-red-400 hover:bg-red-300 text-white"
  };

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disableHaptics && !disabled && !isLoading) {
      // 根据按钮类型触发不同强度的反馈
      if (variant === 'danger') {
        await HapticsService.medium();
      } else {
        await HapticsService.light();
      }
    }
    onClick?.(e);
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      onClick={handleClick}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="animate-pulse">制作中...</span>
        </>
      ) : children}
      
      {/* Glossy overlay */}
      {!isLoading && variant === 'primary' && (
        <div className="absolute top-0 left-0 w-full h-1/2 bg-white/20 pointer-events-none"></div>
      )}
    </button>
  );
};