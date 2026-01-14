"use client";

import React from "react";

interface GradientButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export function GradientButton({
  children,
  className = "",
  ...props
}: GradientButtonProps) {
  return (
    <button
      className={`gradient-button-copper w-full px-6 py-3 text-white font-medium ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
