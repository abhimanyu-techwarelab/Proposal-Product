import React from 'react';
import { cn } from '@/lib/utils';

// ============================================================================
// Card
// ============================================================================

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export function Card({ className, padding = 'md', children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-[#B87333]/30 bg-slate-900/60 backdrop-blur-sm shadow-sm',
        paddingStyles[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// ============================================================================
// Card Header
// ============================================================================

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function CardHeader({ title, description, action, className, ...props }: CardHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between', className)} {...props}>
      <div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        {description && <p className="mt-1 text-sm text-slate-400">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

// ============================================================================
// Card Content
// ============================================================================

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CardContent({ className, children, ...props }: CardContentProps) {
  return (
    <div className={cn('mt-4', className)} {...props}>
      {children}
    </div>
  );
}

// ============================================================================
// Card Footer
// ============================================================================

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CardFooter({ className, children, ...props }: CardFooterProps) {
  return (
    <div className={cn('mt-6 flex items-center justify-end gap-3', className)} {...props}>
      {children}
    </div>
  );
}

// ============================================================================
// Stats Card
// ============================================================================

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  compact?: boolean;
  valueSize?: 'default' | 'large';
}

export function StatsCard({ title, value, description, icon, trend, className, compact, valueSize = 'large' }: StatsCardProps) {
  const valueSizeClass = valueSize === 'large' ? 'text-4xl' : 'text-2xl';
  if (compact) {
    return (
      <Card className={cn('overflow-hidden', className)}>
        <div className="flex flex-col items-center justify-center">
          {icon && (
            <div className="rounded-lg bg-gradient-to-br from-[#B87333]/20 to-[#DA8A67]/10 p-3 text-[#DA8A67] border border-[#B87333]/30">
              {icon}
            </div>
          )}
          <p className={cn('mt-3 font-bold text-white', valueSizeClass)}>{value}</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn('overflow-hidden', className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-slate-400">{title}</p>
          <p className={cn('mt-2 font-bold text-white', valueSizeClass)}>{value}</p>
          {description && <p className="mt-1 text-sm text-slate-400">{description}</p>}
          {trend && (
            <p
              className={cn(
                'mt-2 text-sm font-medium',
                trend.isPositive ? 'text-success-500' : 'text-danger-500'
              )}
            >
              {trend.isPositive ? '+' : '-'}
              {Math.abs(trend.value)}% from last month
            </p>
          )}
        </div>
        {icon && (
          <div className="rounded-lg bg-gradient-to-br from-[#B87333]/20 to-[#DA8A67]/10 p-3 text-[#DA8A67] border border-[#B87333]/30 shrink-0">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
