'use client';

import React, { useId } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

// ============================================================================
// Types
// ============================================================================

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: string;
  error?: string;
  hint?: string;
  options: SelectOption[];
  placeholder?: string;
}

// ============================================================================
// Component
// ============================================================================

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, hint, options, placeholder, id, ...props }, ref) => {
    const reactId = useId();
    const selectId = id || reactId;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className="mb-1.5 block text-sm font-medium text-slate-400">
            {label}
            {props.required && <span className="ml-1 text-danger-500">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              'flex h-10 w-full appearance-none rounded-xl border bg-slate-900/60 backdrop-blur-sm px-3 py-2 pr-10 text-sm text-white',
              'focus:outline-none focus:ring-2 focus:border-transparent',
              'disabled:cursor-not-allowed disabled:bg-slate-800/50 disabled:opacity-50',
              error
                ? 'border-danger-500 focus:ring-danger-500 focus:bg-danger-500/5'
                : 'border-[#B87333]/30 focus:ring-[#B87333]/50 focus:bg-[#B87333]/5 focus:border-[#B87333]/70',
              !props.value && placeholder && 'text-slate-500',
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value} disabled={option.disabled} className="bg-slate-900 text-white">
                {option.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </div>
        </div>
        {error && <p className="mt-1.5 text-sm text-danger-400">{error}</p>}
        {hint && !error && <p className="mt-1.5 text-sm text-slate-400">{hint}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
