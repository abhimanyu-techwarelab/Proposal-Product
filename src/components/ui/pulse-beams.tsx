"use client";

import React from "react";
import { motion } from "framer-motion";

interface BeamConfig {
  path: string;
  gradientConfig: {
    initial: { x1: string; x2: string; y1: string; y2: string };
    animate: {
      x1: string[];
      x2: string[];
      y1: string[];
      y2: string[];
    };
    transition: {
      duration: number;
      repeat: number;
      repeatType: string;
      ease: string;
      repeatDelay: number;
      delay: number;
    };
  };
}

interface GradientColors {
  start: string;
  middle: string;
  end: string;
}

interface PulseBeamsProps {
  beams: BeamConfig[];
  gradientColors: GradientColors;
  className?: string;
  width?: number;
  height?: number;
  baseColor?: string;
  accentColor?: string;
}

export function PulseBeams({
  beams,
  gradientColors,
  className = "",
  width = 2400,
  height = 1400,
  baseColor = "#334155",
  accentColor = "#475569",
}: PulseBeamsProps) {
  return (
    <svg
      className={`pulse-beams-svg ${className}`}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        {beams.map((beam, index) => (
          <motion.linearGradient
            key={`gradient-${index}`}
            id={`pulse-gradient-${index}`}
            initial={beam.gradientConfig.initial}
            animate={beam.gradientConfig.animate}
            transition={beam.gradientConfig.transition as any}
          >
            <stop
              offset="0%"
              stopColor={gradientColors.start}
              stopOpacity="0"
            />
            <stop
              offset="30%"
              stopColor={gradientColors.middle}
              stopOpacity="0.8"
            />
            <stop offset="50%" stopColor={gradientColors.end} stopOpacity="1" />
            <stop
              offset="70%"
              stopColor={gradientColors.middle}
              stopOpacity="0.8"
            />
            <stop
              offset="100%"
              stopColor={gradientColors.start}
              stopOpacity="0"
            />
          </motion.linearGradient>
        ))}
      </defs>

      {/* Base grid lines */}
      {beams.map((beam, index) => (
        <path
          key={`base-${index}`}
          d={beam.path}
          stroke={baseColor}
          strokeWidth="1"
          strokeOpacity="0.3"
          data-pulse-beam="base"
          style={{ strokeWidth: 1 }}
        />
      ))}

      {/* Animated gradient lines */}
      {beams.map((beam, index) => (
        <path
          key={`animated-${index}`}
          d={beam.path}
          stroke={`url(#pulse-gradient-${index})`}
          strokeWidth="2"
          strokeLinecap="round"
          data-pulse-beam="animated"
          style={{ strokeWidth: 2 }}
        />
      ))}
    </svg>
  );
}
