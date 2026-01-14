import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

// ============================================================================
// Types
// ============================================================================

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

// ============================================================================
// Styles
// ============================================================================

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-gradient-to-br from-[#B87333]/80 to-[#DA8A67]/80 backdrop-blur-sm border border-[#B87333]/30 text-white hover:from-[#CD7F32]/90 hover:to-[#B87333]/90 hover:border-[#B87333]/40 focus:ring-[#B87333]/50',
  secondary: 'bg-slate-800 text-white hover:bg-slate-700 border border-slate-700 focus:ring-slate-500',
  danger: 'border border-red-500/30 bg-red-500/20 backdrop-blur-sm text-red-400 hover:bg-red-500/30 hover:text-red-600 focus:ring-red-500/50',
  success: 'bg-success-600 text-white hover:bg-success-700 focus:ring-success-500',
  outline: 'border border-[#B87333]/30 bg-slate-900/60 backdrop-blur-sm text-white hover:bg-[#B87333]/10 focus:ring-[#B87333]/50',
  ghost: 'text-slate-300 hover:bg-slate-800/50 hover:text-white focus:ring-slate-500',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2.5',
};

// ============================================================================
// Component
// ============================================================================

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      title,
      ...props
    },
    ref
  ) => {
    // Allow pointer events when disabled but has a title (for tooltip)
    const allowPointerEvents = disabled && title;
    
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        title={title}
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-medium transition-all',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          'disabled:opacity-50',
          // Only apply pointer-events-none if there's no title
          !allowPointerEvents && 'disabled:pointer-events-none',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';
