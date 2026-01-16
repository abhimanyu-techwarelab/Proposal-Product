'use client';

import React, { useId } from 'react';
import { cn } from '@/lib/utils';

// ============================================================================
// Types
// ============================================================================

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

// ============================================================================
// Component
// ============================================================================

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const reactId = useId();
    const textareaId = id || reactId;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={textareaId} className="mb-1.5 block text-sm font-medium text-slate-400">
            {label}
            {props.required && <span className="ml-1 text-danger-500">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            'flex min-h-[100px] w-full rounded-xl border bg-slate-900/60 backdrop-blur-sm px-3 py-2 text-sm text-white',
            'placeholder:text-slate-500',
            'focus:outline-none focus:ring-2 focus:border-transparent',
            'disabled:cursor-not-allowed disabled:bg-slate-800/50 disabled:opacity-50',
            'resize-y',
            error
              ? 'border-danger-500 focus:ring-danger-500 focus:bg-danger-500/5'
              : 'border-[#B87333]/30 focus:ring-[#B87333]/50 focus:bg-[#B87333]/5 focus:border-[#B87333]/70',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1.5 text-sm text-danger-400">{error}</p>}
        {hint && !error && <p className="mt-1.5 text-sm text-slate-400">{hint}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
