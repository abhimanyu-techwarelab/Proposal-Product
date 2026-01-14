import React, { useId } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, leftIcon, rightIcon, id, ...props }, ref) => {
    const reactId = useId()
    const inputId = id ?? reactId

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-sm font-medium text-slate-400"
          >
            {label}
            {props.required && <span className="ml-1 text-danger-500">*</span>}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            className={cn(
              'flex h-10 w-full rounded-xl border bg-slate-900/60 backdrop-blur-sm px-3 py-2 text-sm text-white',
              'placeholder:text-slate-500',
              'focus:outline-none focus:ring-2 focus:border-transparent',
              'disabled:cursor-not-allowed disabled:bg-slate-800/50 disabled:opacity-50',
              error
                ? 'border-danger-500 focus:ring-danger-500 focus:bg-danger-500/5'
                : 'border-[#B87333]/30 focus:ring-[#B87333]/50 focus:bg-[#B87333]/5 focus:border-[#B87333]/70',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              className
            )}
            {...props}
          />

          {rightIcon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
              {rightIcon}
            </div>
          )}
        </div>

        {error && <p className="mt-1.5 text-sm text-danger-400">{error}</p>}
        {hint && !error && <p className="mt-1.5 text-sm text-slate-400">{hint}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
