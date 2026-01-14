"use client";

import React from "react";
import { ShaderAnimation } from "./shader-lines";
import { useAuthNavigation } from "@/contexts/AuthNavigationContext";

interface AuthShaderOverlayProps {
  className?: string;
}

export function AuthShaderOverlay({ className = "" }: AuthShaderOverlayProps) {
  const { direction, isAnimating, currentPage } = useAuthNavigation();

  const getShaderPosition = () => {
    if (isAnimating && direction) {
      return direction === "left" ? "translate-x-0" : "translate-x-full";
    }
    return currentPage === "signup" ? "translate-x-0" : "translate-x-full";
  };

  return (
    <div
      className={`
        auth-shader-overlay
        absolute inset-0 w-full h-full z-20 pointer-events-none
        hidden md:block
        ${className}
      `}
    >
      <div
        className={`
          auth-shader-slider
          absolute inset-0 w-1/2 h-full
          transition-transform duration-[600ms] ease-in-out
          ${getShaderPosition()}
        `}
      >
        <div className="absolute inset-0 overflow-hidden">
          <ShaderAnimation />
        </div>
      </div>
    </div>
  );
}
