import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/src/utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  isLoading?: boolean;
}

export const Button = ({ 
  children, 
  className, 
  variant = 'primary', 
  isLoading, 
  ...props 
}: ButtonProps) => {
  const variants = {
    primary: 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-900/10',
    secondary: 'bg-brand-600 text-white hover:bg-brand-700 shadow-lg shadow-brand-600/10',
    outline: 'border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-sm',
    ghost: 'bg-transparent hover:bg-slate-100 text-slate-600',
  };

  return (
    <button 
      className={cn(
        'inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold transition-all active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:opacity-50 disabled:pointer-events-none',
        variants[variant],
        className
      )}
      disabled={isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
};
