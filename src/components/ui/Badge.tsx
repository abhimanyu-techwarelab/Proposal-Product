import React from 'react';
import { cn } from '@/lib/utils';
import { ProposalStatus } from '@/types';
import { PROPOSAL_STATUS_CONFIG } from '@/constants';

// ============================================================================
// Types
// ============================================================================

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
}

// ============================================================================
// Styles
// ============================================================================

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-slate-800 text-slate-300 border-slate-700',
  primary: 'bg-gradient-to-br from-[#B87333]/20 to-[#DA8A67]/10 text-[#DA8A67] border-[#B87333]/30',
  success: 'bg-success-500/20 text-success-400 border-success-500/30',
  warning: 'bg-warning-500/20 text-warning-400 border-warning-500/30',
  danger: 'bg-danger-500/20 text-danger-400 border-danger-500/30',
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1 text-sm',
};

// ============================================================================
// Badge Component
// ============================================================================

export function Badge({
  className,
  variant = 'default',
  size = 'md',
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border font-medium whitespace-nowrap',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

// ============================================================================
// Status Badge Component
// ============================================================================

interface StatusBadgeProps {
  status: ProposalStatus;
  size?: BadgeSize;
  className?: string;
}

export function StatusBadge({ status, size = 'md', className }: StatusBadgeProps) {
  const config = PROPOSAL_STATUS_CONFIG[status];

  const variantMap: Record<ProposalStatus, BadgeVariant> = {
    [ProposalStatus.DRAFT]: 'default',
    [ProposalStatus.PENDING]: 'default',
    [ProposalStatus.PROCESSING]: 'primary',
    [ProposalStatus.APPROVAL_PENDING]: 'warning',
    [ProposalStatus.COMPLETED]: 'success',
    [ProposalStatus.REJECTED]: 'danger',
    [ProposalStatus.FAILED]: 'danger',
  };

  return (
    <Badge variant={variantMap[status]} size={size} className={className}>
      <span
        className={cn(
          'mr-1.5 h-1.5 w-1.5 rounded-full',
          status === ProposalStatus.DRAFT && 'bg-slate-400',
          status === ProposalStatus.PENDING && 'bg-slate-500',
          status === ProposalStatus.PROCESSING && 'bg-blue-500',
          status === ProposalStatus.APPROVAL_PENDING && 'bg-warning-500',
          status === ProposalStatus.COMPLETED && 'bg-success-500',
          status === ProposalStatus.REJECTED && 'bg-danger-500',
          status === ProposalStatus.FAILED && 'bg-danger-500'
        )}
      />
      {config.label}
    </Badge>
  );
}
