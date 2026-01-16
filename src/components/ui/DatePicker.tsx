'use client';

import React, { useState, useRef, useEffect, useId } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface DatePickerProps {
  label?: string;
  error?: string;
  hint?: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  id?: string;
  minDate?: string;
  maxDate?: string;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export function DatePicker({
  label,
  error,
  hint,
  value,
  onChange,
  placeholder = 'Select date',
  required,
  disabled,
  className,
  id,
  minDate,
  maxDate,
}: DatePickerProps) {
  const reactId = useId();
  const inputId = id ?? reactId;
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [currentMonth, setCurrentMonth] = useState(() => {
    if (value) {
      const date = new Date(value);
      return new Date(date.getFullYear(), date.getMonth(), 1);
    }
    return new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Parse date string to Date object
  const parseDate = (dateStr: string): Date | null => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? null : date;
  };

  // Format date to YYYY-MM-DD
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Format date for display
  const formatDisplayDate = (dateStr: string): string => {
    const date = parseDate(dateStr);
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get days in month
  const getDaysInMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  // Get first day of month (0 = Sunday)
  const getFirstDayOfMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  // Check if date is disabled
  const isDateDisabled = (date: Date): boolean => {
    if (minDate) {
      const min = parseDate(minDate);
      if (min && date < min) return true;
    }
    if (maxDate) {
      const max = parseDate(maxDate);
      if (max && date > max) return true;
    }
    return false;
  };

  // Check if date is selected
  const isDateSelected = (date: Date): boolean => {
    if (!value) return false;
    const selected = parseDate(value);
    if (!selected) return false;
    return (
      date.getFullYear() === selected.getFullYear() &&
      date.getMonth() === selected.getMonth() &&
      date.getDate() === selected.getDate()
    );
  };

  // Check if date is today
  const isToday = (date: Date): boolean => {
    const today = new Date();
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  };

  // Navigate months
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // Handle date selection
  const selectDate = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    if (!isDateDisabled(date)) {
      onChange?.(formatDate(date));
      setIsOpen(false);
    }
  };

  // Calculate dropdown position (fixed positioning uses viewport coordinates)
  const updateDropdownPosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      // For fixed positioning, use viewport coordinates directly (no scroll offset needed)
      setDropdownPosition({
        top: rect.bottom + 8,
        left: rect.left,
      });
    }
  };

  // Toggle dropdown
  const toggleDropdown = () => {
    if (!disabled) {
      if (!isOpen) {
        updateDropdownPosition();
      }
      setIsOpen(!isOpen);
    }
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isInsideContainer = containerRef.current && containerRef.current.contains(target);
      const isInsideDropdown = dropdownRef.current && dropdownRef.current.contains(target);

      if (!isInsideContainer && !isInsideDropdown) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update position on scroll/resize with RAF for smooth updates
  useEffect(() => {
    if (isOpen) {
      let rafId: number;
      const handleScrollResize = () => {
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          updateDropdownPosition();
        });
      };
      window.addEventListener('scroll', handleScrollResize, true);
      window.addEventListener('resize', handleScrollResize);
      return () => {
        cancelAnimationFrame(rafId);
        window.removeEventListener('scroll', handleScrollResize, true);
        window.removeEventListener('resize', handleScrollResize);
      };
    }
  }, [isOpen]);

  // Generate calendar days
  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days: React.ReactNode[] = [];

    // Empty cells for days before first day of month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8" />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const isDisabled = isDateDisabled(date);
      const isSelected = isDateSelected(date);
      const isTodayDate = isToday(date);

      days.push(
        <button
          key={day}
          type="button"
          onClick={() => selectDate(day)}
          disabled={isDisabled}
          className={cn(
            'w-8 h-8 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center',
            'hover:bg-[#B87333]/20 focus:outline-none focus:ring-2 focus:ring-[#B87333]/50',
            isDisabled && 'opacity-30 cursor-not-allowed hover:bg-transparent',
            isSelected && 'bg-[#B87333] text-white hover:bg-[#B87333]/90',
            !isSelected && !isDisabled && 'text-white',
            isTodayDate && !isSelected && 'border border-[#B87333]/50 text-[#B87333]'
          )}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  return (
    <div className="w-full" ref={containerRef}>
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-sm font-medium text-slate-400"
        >
          {label}
          {required && <span className="ml-1 text-danger-500">*</span>}
        </label>
      )}

      <div>
        <button
          ref={buttonRef}
          type="button"
          id={inputId}
          onClick={toggleDropdown}
          disabled={disabled}
          className={cn(
            'flex h-10 w-full items-center justify-between rounded-xl border bg-slate-900/60 backdrop-blur-sm px-3 py-2 text-sm',
            'focus:outline-none focus:ring-2 focus:border-transparent',
            'disabled:cursor-not-allowed disabled:bg-slate-800/50 disabled:opacity-50',
            error
              ? 'border-danger-500 focus:ring-danger-500 focus:bg-danger-500/5'
              : 'border-[#B87333]/30 focus:ring-[#B87333]/50 focus:bg-[#B87333]/5 focus:border-[#B87333]/70',
            value ? 'text-white' : 'text-slate-500',
            className
          )}
        >
          <span>{value ? formatDisplayDate(value) : placeholder}</span>
          <Calendar className="h-4 w-4 text-slate-400" />
        </button>

        {isOpen && typeof document !== 'undefined' && createPortal(
          <div
            ref={dropdownRef}
            className="fixed z-[9999] w-72 rounded-xl border border-[#B87333]/30 bg-slate-900 p-4 shadow-xl shadow-black/50"
            style={{ top: dropdownPosition.top, left: dropdownPosition.left }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={prevMonth}
                className="p-1.5 rounded-lg hover:bg-[#B87333]/20 text-slate-400 hover:text-white transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm font-semibold text-white">
                {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </span>
              <button
                type="button"
                onClick={nextMonth}
                className="p-1.5 rounded-lg hover:bg-[#B87333]/20 text-slate-400 hover:text-white transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Days header */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {DAYS.map((day) => (
                <div
                  key={day}
                  className="w-8 h-8 flex items-center justify-center text-xs font-medium text-slate-400"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1 relative">
              {renderCalendarDays()}
            </div>

            {/* Today button */}
            <div className="mt-3 pt-3 border-t border-slate-700/50">
              <button
                type="button"
                onClick={() => {
                  const today = new Date();
                  onChange?.(formatDate(today));
                  setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
                  setIsOpen(false);
                }}
                className="w-full py-1.5 text-sm font-medium text-[#B87333] hover:text-[#B87333]/80 transition-colors"
              >
                Today
              </button>
            </div>
          </div>,
          document.body
        )}
      </div>

      {error && <p className="mt-1.5 text-sm text-danger-400">{error}</p>}
      {hint && !error && <p className="mt-1.5 text-sm text-slate-400">{hint}</p>}
    </div>
  );
}
