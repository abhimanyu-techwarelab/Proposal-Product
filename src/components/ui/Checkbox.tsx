import React from "react";
import { cn } from "@/lib/utils";

interface CheckboxProps {
  label?: string;
  checked: boolean;
  className?: string;
  id?: string;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked,
  id,
  onChange,
  className = "",
  disabled = false,
}) => {
  return (
    <label
      className={cn(
        "flex items-center space-x-3 group",
        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
        className
      )}
    >
      <div className="relative w-5 h-5">
        <input
          id={id}
          type="checkbox"
          className={cn(
            "w-5 h-5 appearance-none rounded-md border transition-colors",
            "checked:bg-gradient-to-br checked:from-[#B87333] checked:to-[#DA8A67]",
            "border-[#B87333]/30 bg-slate-900/60",
            "focus:outline-none focus:ring-2 focus:ring-[#B87333]/50",
            disabled && "opacity-60 cursor-not-allowed",
            checked && "border-transparent"
          )}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
        />
        {checked && (
          <svg
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
          >
            <path
              d="M11.6666 3.5L5.24992 9.91667L2.33325 7"
              stroke="white"
              strokeWidth="1.94437"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      {label && (
        <span className="text-sm font-medium text-slate-300">{label}</span>
      )}
    </label>
  );
};
