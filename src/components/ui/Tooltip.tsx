"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  disabled?: boolean;
  position?: "top" | "bottom" | "left" | "right";
  className?: string;
}

// ============================================================================
// Component
// ============================================================================

export function Tooltip({
  children,
  content,
  disabled = false,
  position = "top",
  className,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isVisible || !triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;

    let top = 0;
    let left = 0;

    switch (position) {
      case "top":
        top = triggerRect.top + scrollY - tooltipRect.height - 8;
        left = triggerRect.left + scrollX + triggerRect.width / 2 - tooltipRect.width / 2;
        break;
      case "bottom":
        top = triggerRect.bottom + scrollY + 8;
        left = triggerRect.left + scrollX + triggerRect.width / 2 - tooltipRect.width / 2;
        break;
      case "left":
        top = triggerRect.top + scrollY + triggerRect.height / 2 - tooltipRect.height / 2;
        left = triggerRect.left + scrollX - tooltipRect.width - 8;
        break;
      case "right":
        top = triggerRect.top + scrollY + triggerRect.height / 2 - tooltipRect.height / 2;
        left = triggerRect.right + scrollX + 8;
        break;
    }

    // Keep tooltip within viewport
    const padding = 8;
    if (left < padding) left = padding;
    if (left + tooltipRect.width > window.innerWidth - padding) {
      left = window.innerWidth - tooltipRect.width - padding;
    }
    if (top < padding) {
      top = triggerRect.bottom + scrollY + 8; // Fallback to bottom
    }
    if (top + tooltipRect.height > window.innerHeight + scrollY - padding) {
      top = triggerRect.top + scrollY - tooltipRect.height - 8; // Fallback to top
    }

    setTooltipPosition({ top, left });
  }, [isVisible, position]);

  if (disabled || !content) {
    return <>{children}</>;
  }

  return (
    <div
      ref={triggerRef}
      className={cn("relative inline-block", className)}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          ref={tooltipRef}
          className="fixed z-[9999] pointer-events-none animate-in fade-in-0 zoom-in-95 duration-200"
          style={{
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`,
          }}
        >
          <div className="rounded-lg border border-[#B87333]/30 bg-slate-900/95 backdrop-blur-sm px-3 py-1.5 shadow-lg">
            <p className="text-xs font-medium text-white whitespace-nowrap">
              {content}
            </p>
            {/* Arrow */}
            <div
              className={cn(
                "absolute w-2 h-2 bg-slate-900 border-[#B87333]/30 rotate-45",
                position === "top" && "bottom-[-4px] left-1/2 -translate-x-1/2 border-b border-r",
                position === "bottom" && "top-[-4px] left-1/2 -translate-x-1/2 border-t border-l",
                position === "left" && "right-[-4px] top-1/2 -translate-y-1/2 border-l border-b",
                position === "right" && "left-[-4px] top-1/2 -translate-y-1/2 border-r border-t"
              )}
            />
          </div>
        </div>
      )}
    </div>
  );
}
