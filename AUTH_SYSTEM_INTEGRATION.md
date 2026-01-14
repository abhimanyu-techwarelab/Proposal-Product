# Auth System Integration Guide

Complete guide for integrating the animated login/signup system with sliding shader overlay into a Next.js App Router project.

## Prerequisites

- Next.js 14+ with App Router
- Tailwind CSS
- Framer Motion
- Lucide React icons

```bash
npm install framer-motion lucide-react
```

---

## File Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with AuthLayoutWrapper
│   ├── page.tsx            # Login page route
│   ├── signup/
│   │   └── page.tsx        # Signup page route
│   └── globals.css         # Global styles + animations
├── components/ui/
│   ├── AuthLayoutWrapper.tsx
│   ├── AuthShaderOverlay.tsx
│   ├── login.tsx
│   ├── signup.tsx
│   ├── shader-lines.tsx
│   ├── pulse-beams.tsx
│   └── gradient-button.tsx
└── contexts/
    └── AuthNavigationContext.tsx
```

---

## 1. Context: AuthNavigationContext.tsx

```tsx
"use client";

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

type NavigationDirection = 'left' | 'right' | null;
type AuthPage = 'login' | 'signup';

interface AuthNavigationContextType {
  direction: NavigationDirection;
  isAnimating: boolean;
  currentPage: AuthPage;
  navigateTo: (page: AuthPage) => void;
}

const AuthNavigationContext = createContext<AuthNavigationContextType | undefined>(undefined);

export function AuthNavigationProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [direction, setDirection] = useState<NavigationDirection>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentPage, setCurrentPage] = useState<AuthPage>(() =>
    pathname === '/signup' ? 'signup' : 'login'
  );
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const page: AuthPage = pathname === '/signup' ? 'signup' : 'login';
    if (!isAnimating) {
      setCurrentPage(page);
    }
  }, [pathname, isAnimating]);

  const navigateTo = useCallback((targetPage: AuthPage) => {
    if (isAnimating || targetPage === currentPage) return;

    const newDirection: NavigationDirection = targetPage === 'signup' ? 'left' : 'right';

    setDirection(newDirection);
    setIsAnimating(true);

    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }

    const targetPath = targetPage === 'signup' ? '/signup' : '/';
    router.push(targetPath);

    animationTimeoutRef.current = setTimeout(() => {
      setCurrentPage(targetPage);
      setIsAnimating(false);
      setDirection(null);
    }, 600);
  }, [isAnimating, currentPage, router]);

  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, []);

  return (
    <AuthNavigationContext.Provider value={{ direction, isAnimating, currentPage, navigateTo }}>
      {children}
    </AuthNavigationContext.Provider>
  );
}

export function useAuthNavigation() {
  const context = useContext(AuthNavigationContext);
  if (context === undefined) {
    throw new Error('useAuthNavigation must be used within an AuthNavigationProvider');
  }
  return context;
}
```

---

## 2. Components

### AuthLayoutWrapper.tsx

```tsx
"use client";

import React from 'react';
import { AuthNavigationProvider } from '@/contexts/AuthNavigationContext';
import { AuthShaderOverlay } from './AuthShaderOverlay';

interface AuthLayoutWrapperProps {
  children: React.ReactNode;
}

export function AuthLayoutWrapper({ children }: AuthLayoutWrapperProps) {
  return (
    <AuthNavigationProvider>
      <div className="relative">
        {children}
        <AuthShaderOverlay />
      </div>
    </AuthNavigationProvider>
  );
}
```

### AuthShaderOverlay.tsx

```tsx
"use client";

import React from 'react';
import { ShaderAnimation } from './shader-lines';
import { useAuthNavigation } from '@/contexts/AuthNavigationContext';

interface AuthShaderOverlayProps {
  className?: string;
}

export function AuthShaderOverlay({ className = '' }: AuthShaderOverlayProps) {
  const { direction, isAnimating, currentPage } = useAuthNavigation();

  const getShaderPosition = () => {
    if (isAnimating && direction) {
      return direction === 'left' ? 'translate-x-0' : 'translate-x-full';
    }
    return currentPage === 'signup' ? 'translate-x-0' : 'translate-x-full';
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
```

### shader-lines.tsx

```tsx
"use client"

import { useEffect, useRef } from "react"

declare global {
  interface Window {
    THREE: any
  }
}

export function ShaderAnimation() {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<{
    camera: any
    scene: any
    renderer: any
    uniforms: any
    animationId: number | null
  }>({
    camera: null,
    scene: null,
    renderer: null,
    uniforms: null,
    animationId: null,
  })

  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/89/three.min.js"
    script.onload = () => {
      if (containerRef.current && window.THREE) {
        initThreeJS()
      }
    }
    document.head.appendChild(script)

    return () => {
      if (sceneRef.current.animationId) {
        cancelAnimationFrame(sceneRef.current.animationId)
      }
      if (sceneRef.current.renderer) {
        sceneRef.current.renderer.dispose()
      }
      document.head.removeChild(script)
    }
  }, [])

  const initThreeJS = () => {
    if (!containerRef.current || !window.THREE) return

    const THREE = window.THREE
    const container = containerRef.current

    container.innerHTML = ""

    const camera = new THREE.Camera()
    camera.position.z = 1

    const scene = new THREE.Scene()
    const geometry = new THREE.PlaneBufferGeometry(2, 2)

    const uniforms = {
      time: { type: "f", value: 1.0 },
      resolution: { type: "v2", value: new THREE.Vector2() },
    }

    const vertexShader = `
      void main() {
        gl_Position = vec4( position, 1.0 );
      }
    `

    const fragmentShader = `
      #define TWO_PI 6.2831853072
      #define PI 3.14159265359

      precision highp float;
      uniform vec2 resolution;
      uniform float time;

      float random (in float x) {
          return fract(sin(x)*1e4);
      }
      float random (vec2 st) {
          return fract(sin(dot(st.xy,
                               vec2(12.9898,78.233)))*
              43758.5453123);
      }

      varying vec2 vUv;

      void main(void) {
        vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);

        vec2 fMosaicScal = vec2(4.0, 2.0);
        vec2 vScreenSize = vec2(256,256);
        uv.x = floor(uv.x * vScreenSize.x / fMosaicScal.x) / (vScreenSize.x / fMosaicScal.x);
        uv.y = floor(uv.y * vScreenSize.y / fMosaicScal.y) / (vScreenSize.y / fMosaicScal.y);

        float t = time*0.06+random(uv.x)*0.4;
        float lineWidth = 0.0008;

        vec3 color = vec3(0.0);
        for(int j = 0; j < 3; j++){
          for(int i=0; i < 5; i++){
            color[j] += lineWidth*float(i*i) / abs(fract(t - 0.01*float(j)+float(i)*0.01)*1.0 - length(uv));
          }
        }

        gl_FragColor = vec4(color[2],color[1],color[0],1.0);
      }
    `

    const material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    })

    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    const renderer = new THREE.WebGLRenderer()
    renderer.setPixelRatio(window.devicePixelRatio)
    container.appendChild(renderer.domElement)

    sceneRef.current = {
      camera,
      scene,
      renderer,
      uniforms,
      animationId: null,
    }

    const onWindowResize = () => {
      const rect = container.getBoundingClientRect()
      renderer.setSize(rect.width, rect.height)
      uniforms.resolution.value.x = renderer.domElement.width
      uniforms.resolution.value.y = renderer.domElement.height
    }

    onWindowResize()
    window.addEventListener("resize", onWindowResize, false)

    const animate = () => {
      sceneRef.current.animationId = requestAnimationFrame(animate)
      uniforms.time.value += 0.05
      renderer.render(scene, camera)
    }

    animate()
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full absolute"
    />
  )
}
```

### pulse-beams.tsx

```tsx
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
      className={className}
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
            <stop offset="0%" stopColor={gradientColors.start} stopOpacity="0" />
            <stop offset="30%" stopColor={gradientColors.middle} stopOpacity="0.8" />
            <stop offset="50%" stopColor={gradientColors.end} stopOpacity="1" />
            <stop offset="70%" stopColor={gradientColors.middle} stopOpacity="0.8" />
            <stop offset="100%" stopColor={gradientColors.start} stopOpacity="0" />
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
        />
      ))}
    </svg>
  );
}
```

### gradient-button.tsx

```tsx
"use client";

import React from "react";

interface GradientButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export function GradientButton({ children, className = "", ...props }: GradientButtonProps) {
  return (
    <button
      className={`gradient-button-copper w-full px-6 py-3 text-white font-medium ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
```

### login.tsx

```tsx
"use client";

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { PulseBeams } from './pulse-beams';
import { GradientButton } from './gradient-button';

// --- BEAM CONFIGURATION ---

const beams = [
  {
    path: "M-200 150H800V1500",
    gradientConfig: {
      initial: { x1: "0%", x2: "0%", y1: "0%", y2: "10%" },
      animate: { x1: ["0%", "50%", "100%"], x2: ["0%", "50%", "100%"], y1: ["0%", "50%", "100%"], y2: ["10%", "60%", "110%"] },
      transition: { duration: 18, repeat: Infinity, repeatType: "loop", ease: "linear", repeatDelay: 3, delay: 0 },
    },
  },
  {
    path: "M-200 600H500V-200",
    gradientConfig: {
      initial: { x1: "0%", x2: "0%", y1: "100%", y2: "90%" },
      animate: { x1: ["0%", "50%", "100%"], x2: ["0%", "50%", "100%"], y1: ["100%", "50%", "0%"], y2: ["90%", "40%", "-10%"] },
      transition: { duration: 16, repeat: Infinity, repeatType: "loop", ease: "linear", repeatDelay: 4, delay: 2 },
    },
  },
  {
    path: "M300 -200V400H2500",
    gradientConfig: {
      initial: { x1: "0%", x2: "10%", y1: "0%", y2: "0%" },
      animate: { x1: ["0%", "50%", "100%"], x2: ["10%", "60%", "110%"], y1: ["0%", "50%", "100%"], y2: ["0%", "50%", "100%"] },
      transition: { duration: 20, repeat: Infinity, repeatType: "loop", ease: "linear", repeatDelay: 2, delay: 1 },
    },
  },
  {
    path: "M1000 -200V500H-200",
    gradientConfig: {
      initial: { x1: "100%", x2: "90%", y1: "0%", y2: "0%" },
      animate: { x1: ["100%", "50%", "0%"], x2: ["90%", "40%", "-10%"], y1: ["0%", "50%", "100%"], y2: ["0%", "50%", "100%"] },
      transition: { duration: 18, repeat: Infinity, repeatType: "loop", ease: "linear", repeatDelay: 3, delay: 5 },
    },
  },
  {
    path: "M2500 200H1200V1500",
    gradientConfig: {
      initial: { x1: "100%", x2: "100%", y1: "0%", y2: "10%" },
      animate: { x1: ["100%", "50%", "0%"], x2: ["100%", "50%", "0%"], y1: ["0%", "50%", "100%"], y2: ["10%", "60%", "110%"] },
      transition: { duration: 16, repeat: Infinity, repeatType: "loop", ease: "linear", repeatDelay: 4, delay: 3 },
    },
  },
  {
    path: "M2500 700H900V-200",
    gradientConfig: {
      initial: { x1: "100%", x2: "100%", y1: "100%", y2: "90%" },
      animate: { x1: ["100%", "50%", "0%"], x2: ["100%", "50%", "0%"], y1: ["100%", "50%", "0%"], y2: ["90%", "40%", "-10%"] },
      transition: { duration: 18, repeat: Infinity, repeatType: "loop", ease: "linear", repeatDelay: 3, delay: 7 },
    },
  },
  {
    path: "M400 1500V800H2500",
    gradientConfig: {
      initial: { x1: "0%", x2: "10%", y1: "100%", y2: "100%" },
      animate: { x1: ["0%", "50%", "100%"], x2: ["10%", "60%", "110%"], y1: ["100%", "50%", "0%"], y2: ["100%", "50%", "0%"] },
      transition: { duration: 20, repeat: Infinity, repeatType: "loop", ease: "linear", repeatDelay: 2, delay: 2 },
    },
  },
  {
    path: "M1100 1500V600H-200",
    gradientConfig: {
      initial: { x1: "100%", x2: "90%", y1: "100%", y2: "100%" },
      animate: { x1: ["100%", "50%", "0%"], x2: ["90%", "40%", "-10%"], y1: ["100%", "50%", "0%"], y2: ["100%", "50%", "0%"] },
      transition: { duration: 16, repeat: Infinity, repeatType: "loop", ease: "linear", repeatDelay: 4, delay: 4 },
    },
  },
  {
    path: "M-200 300H600V1500",
    gradientConfig: {
      initial: { x1: "0%", x2: "0%", y1: "0%", y2: "10%" },
      animate: { x1: ["0%", "50%", "100%"], x2: ["0%", "50%", "100%"], y1: ["0%", "50%", "100%"], y2: ["10%", "60%", "110%"] },
      transition: { duration: 18, repeat: Infinity, repeatType: "loop", ease: "linear", repeatDelay: 4, delay: 8 },
    },
  },
  {
    path: "M700 -200V350H2500",
    gradientConfig: {
      initial: { x1: "0%", x2: "10%", y1: "0%", y2: "0%" },
      animate: { x1: ["0%", "50%", "100%"], x2: ["10%", "60%", "110%"], y1: ["0%", "50%", "100%"], y2: ["0%", "50%", "100%"] },
      transition: { duration: 16, repeat: Infinity, repeatType: "loop", ease: "linear", repeatDelay: 3, delay: 9 },
    },
  },
  {
    path: "M-200 100H400V700H2500",
    gradientConfig: {
      initial: { x1: "0%", x2: "5%", y1: "0%", y2: "5%" },
      animate: { x1: ["0%", "50%", "100%"], x2: ["5%", "55%", "105%"], y1: ["0%", "50%", "100%"], y2: ["5%", "55%", "105%"] },
      transition: { duration: 22, repeat: Infinity, repeatType: "loop", ease: "linear", repeatDelay: 2, delay: 0.5 },
    },
  },
  {
    path: "M2500 250H1400V550H-200",
    gradientConfig: {
      initial: { x1: "100%", x2: "95%", y1: "0%", y2: "5%" },
      animate: { x1: ["100%", "50%", "0%"], x2: ["95%", "45%", "-5%"], y1: ["0%", "50%", "100%"], y2: ["5%", "55%", "105%"] },
      transition: { duration: 20, repeat: Infinity, repeatType: "loop", ease: "linear", repeatDelay: 3, delay: 6 },
    },
  },
  {
    path: "M200 -200V300H1000V1500",
    gradientConfig: {
      initial: { x1: "0%", x2: "5%", y1: "0%", y2: "5%" },
      animate: { x1: ["0%", "50%", "100%"], x2: ["5%", "55%", "105%"], y1: ["0%", "50%", "100%"], y2: ["5%", "55%", "105%"] },
      transition: { duration: 22, repeat: Infinity, repeatType: "loop", ease: "linear", repeatDelay: 2, delay: 3.5 },
    },
  },
  {
    path: "M1300 1500V900H700V-200",
    gradientConfig: {
      initial: { x1: "100%", x2: "95%", y1: "100%", y2: "95%" },
      animate: { x1: ["100%", "50%", "0%"], x2: ["95%", "45%", "-5%"], y1: ["100%", "50%", "0%"], y2: ["95%", "45%", "-5%"] },
      transition: { duration: 20, repeat: Infinity, repeatType: "loop", ease: "linear", repeatDelay: 4, delay: 7.5 },
    },
  },
  {
    path: "M-200 450H2500",
    gradientConfig: {
      initial: { x1: "0%", x2: "10%", y1: "50%", y2: "50%" },
      animate: { x1: ["0%", "50%", "100%"], x2: ["10%", "60%", "110%"], y1: ["50%", "50%", "50%"], y2: ["50%", "50%", "50%"] },
      transition: { duration: 18, repeat: Infinity, repeatType: "loop", ease: "linear", repeatDelay: 4, delay: 10 },
    },
  },
  {
    path: "M850 -200V1500",
    gradientConfig: {
      initial: { x1: "50%", x2: "50%", y1: "0%", y2: "10%" },
      animate: { x1: ["50%", "50%", "50%"], x2: ["50%", "50%", "50%"], y1: ["0%", "50%", "100%"], y2: ["10%", "60%", "110%"] },
      transition: { duration: 16, repeat: Infinity, repeatType: "loop", ease: "linear", repeatDelay: 5, delay: 11 },
    },
  },
];

const gradientColors = {
  start: "#FFFFFF",
  middle: "#DA8A67",
  end: "#B87333"
};

// --- HELPER COMPONENTS (ICONS) ---

const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s12-5.373 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-2.641-.21-5.236-.611-7.743z" />
        <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.022 35.026 44 30.038 44 24c0-2.641-.21-5.236-.611-7.743z" />
    </svg>
);


// --- TYPE DEFINITIONS ---

interface LoginPageProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  heroImageSrc?: string;
  onSignIn?: (event: React.FormEvent<HTMLFormElement>) => void;
  onGoogleSignIn?: () => void;
  onResetPassword?: () => void;
  onCreateAccount?: () => void;
}

// --- MAIN COMPONENT ---

export const LoginPage: React.FC<LoginPageProps> = ({
  title = <span className="font-light tracking-tighter">Welcome</span>,
  description = "Access your account and continue your journey with us",
  heroImageSrc,
  onSignIn,
  onGoogleSignIn,
  onResetPassword,
  onCreateAccount,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="h-[100dvh] flex flex-col md:flex-row font-geist w-[100dvw] relative overflow-hidden bg-black">
      {/* Pulse beams background */}
      <PulseBeams
        beams={beams}
        gradientColors={gradientColors}
        className="absolute inset-0 w-full h-full opacity-60 z-0"
        width={2400}
        height={1400}
        baseColor="#334155"
        accentColor="#475569"
      />

      {/* Left column: sign-in form */}
      <section className="flex-1 flex items-center justify-center p-8 relative z-10 text-white">
        <div className="w-full max-w-md">
          <div className="flex flex-col gap-6">
            <h1 className="animate-element animate-delay-100 text-4xl md:text-5xl font-semibold leading-tight text-white">{title}</h1>
            <p className="animate-element animate-delay-200 text-slate-400">{description}</p>

            <form className="space-y-5" onSubmit={onSignIn}>
              <div className="animate-element animate-delay-300">
                <label className="text-sm font-medium text-slate-400">Email Address</label>
                <div className="rounded-2xl border border-[#B87333]/30 bg-slate-900/60 backdrop-blur-sm transition-colors focus-within:border-[#B87333]/70 focus-within:bg-[#B87333]/5">
                  <input name="email" type="email" placeholder="Enter your email address" className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none text-white placeholder:text-slate-500" />
                </div>
              </div>

              <div className="animate-element animate-delay-400">
                <label className="text-sm font-medium text-slate-400">Password</label>
                <div className="rounded-2xl border border-[#B87333]/30 bg-slate-900/60 backdrop-blur-sm transition-colors focus-within:border-[#B87333]/70 focus-within:bg-[#B87333]/5">
                  <div className="relative">
                    <input name="password" type={showPassword ? 'text' : 'password'} placeholder="Enter your password" className="w-full bg-transparent text-sm p-4 pr-12 rounded-2xl focus:outline-none text-white placeholder:text-slate-500" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-3 flex items-center">
                      {showPassword ? <EyeOff className="w-5 h-5 text-slate-400 hover:text-white transition-colors" /> : <Eye className="w-5 h-5 text-slate-400 hover:text-white transition-colors" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="animate-element animate-delay-500 flex items-center justify-between text-sm">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" name="rememberMe" className="custom-checkbox" />
                  <span className="text-slate-300">Keep me signed in</span>
                </label>
                <a href="#" onClick={(e) => { e.preventDefault(); onResetPassword?.(); }} className="hover:underline text-[#DA8A67] transition-colors">Reset password</a>
              </div>

              <div className="animate-element animate-delay-600 flex justify-center">
                <GradientButton type="submit" className="rounded-2xl">
                  Sign In
                </GradientButton>
              </div>
            </form>

            <div className="animate-element animate-delay-700 relative flex items-center justify-center">
              <span className="w-full border-t border-[#B87333]/30"></span>
              <span className="px-4 text-sm text-slate-400 bg-black absolute">Or continue with</span>
            </div>

            <button onClick={onGoogleSignIn} className="animate-element animate-delay-800 w-full flex items-center justify-center gap-3 border border-[#B87333]/30 rounded-2xl py-4 text-white hover:bg-[#B87333]/10 transition-colors">
                <GoogleIcon />
                Continue with Google
            </button>

            <p className="animate-element animate-delay-900 text-center text-sm text-slate-400">
              New to our platform? <a href="#" onClick={(e) => { e.preventDefault(); onCreateAccount?.(); }} className="text-[#DA8A67] hover:underline transition-colors">Create Account</a>
            </p>
          </div>
        </div>
      </section>

      {/* Right column: placeholder for shader (handled by AuthShaderOverlay) */}
      {heroImageSrc && (
        <section className="hidden md:block flex-1 relative z-10 pointer-events-none" />
      )}
    </div>
  );
};
```

### signup.tsx

```tsx
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Eye, EyeOff, ChevronDown } from 'lucide-react';
import { PulseBeams } from './pulse-beams';
import { GradientButton } from './gradient-button';

// --- BEAM CONFIGURATION ---

const beams = [
  {
    path: "M-200 150H800V1500",
    gradientConfig: {
      initial: { x1: "0%", x2: "0%", y1: "0%", y2: "10%" },
      animate: { x1: ["0%", "50%", "100%"], x2: ["0%", "50%", "100%"], y1: ["0%", "50%", "100%"], y2: ["10%", "60%", "110%"] },
      transition: { duration: 18, repeat: Infinity, repeatType: "loop", ease: "linear", repeatDelay: 3, delay: 0 },
    },
  },
  {
    path: "M-200 600H500V-200",
    gradientConfig: {
      initial: { x1: "0%", x2: "0%", y1: "100%", y2: "90%" },
      animate: { x1: ["0%", "50%", "100%"], x2: ["0%", "50%", "100%"], y1: ["100%", "50%", "0%"], y2: ["90%", "40%", "-10%"] },
      transition: { duration: 16, repeat: Infinity, repeatType: "loop", ease: "linear", repeatDelay: 4, delay: 2 },
    },
  },
  {
    path: "M300 -200V400H2500",
    gradientConfig: {
      initial: { x1: "0%", x2: "10%", y1: "0%", y2: "0%" },
      animate: { x1: ["0%", "50%", "100%"], x2: ["10%", "60%", "110%"], y1: ["0%", "50%", "100%"], y2: ["0%", "50%", "100%"] },
      transition: { duration: 20, repeat: Infinity, repeatType: "loop", ease: "linear", repeatDelay: 2, delay: 1 },
    },
  },
  {
    path: "M1000 -200V500H-200",
    gradientConfig: {
      initial: { x1: "100%", x2: "90%", y1: "0%", y2: "0%" },
      animate: { x1: ["100%", "50%", "0%"], x2: ["90%", "40%", "-10%"], y1: ["0%", "50%", "100%"], y2: ["0%", "50%", "100%"] },
      transition: { duration: 18, repeat: Infinity, repeatType: "loop", ease: "linear", repeatDelay: 3, delay: 5 },
    },
  },
  {
    path: "M2500 200H1200V1500",
    gradientConfig: {
      initial: { x1: "100%", x2: "100%", y1: "0%", y2: "10%" },
      animate: { x1: ["100%", "50%", "0%"], x2: ["100%", "50%", "0%"], y1: ["0%", "50%", "100%"], y2: ["10%", "60%", "110%"] },
      transition: { duration: 16, repeat: Infinity, repeatType: "loop", ease: "linear", repeatDelay: 4, delay: 3 },
    },
  },
  {
    path: "M2500 700H900V-200",
    gradientConfig: {
      initial: { x1: "100%", x2: "100%", y1: "100%", y2: "90%" },
      animate: { x1: ["100%", "50%", "0%"], x2: ["100%", "50%", "0%"], y1: ["100%", "50%", "0%"], y2: ["90%", "40%", "-10%"] },
      transition: { duration: 18, repeat: Infinity, repeatType: "loop", ease: "linear", repeatDelay: 3, delay: 7 },
    },
  },
  {
    path: "M400 1500V800H2500",
    gradientConfig: {
      initial: { x1: "0%", x2: "10%", y1: "100%", y2: "100%" },
      animate: { x1: ["0%", "50%", "100%"], x2: ["10%", "60%", "110%"], y1: ["100%", "50%", "0%"], y2: ["100%", "50%", "0%"] },
      transition: { duration: 20, repeat: Infinity, repeatType: "loop", ease: "linear", repeatDelay: 2, delay: 2 },
    },
  },
  {
    path: "M1100 1500V600H-200",
    gradientConfig: {
      initial: { x1: "100%", x2: "90%", y1: "100%", y2: "100%" },
      animate: { x1: ["100%", "50%", "0%"], x2: ["90%", "40%", "-10%"], y1: ["100%", "50%", "0%"], y2: ["100%", "50%", "0%"] },
      transition: { duration: 16, repeat: Infinity, repeatType: "loop", ease: "linear", repeatDelay: 4, delay: 4 },
    },
  },
  {
    path: "M-200 300H600V1500",
    gradientConfig: {
      initial: { x1: "0%", x2: "0%", y1: "0%", y2: "10%" },
      animate: { x1: ["0%", "50%", "100%"], x2: ["0%", "50%", "100%"], y1: ["0%", "50%", "100%"], y2: ["10%", "60%", "110%"] },
      transition: { duration: 18, repeat: Infinity, repeatType: "loop", ease: "linear", repeatDelay: 4, delay: 8 },
    },
  },
  {
    path: "M700 -200V350H2500",
    gradientConfig: {
      initial: { x1: "0%", x2: "10%", y1: "0%", y2: "0%" },
      animate: { x1: ["0%", "50%", "100%"], x2: ["10%", "60%", "110%"], y1: ["0%", "50%", "100%"], y2: ["0%", "50%", "100%"] },
      transition: { duration: 16, repeat: Infinity, repeatType: "loop", ease: "linear", repeatDelay: 3, delay: 9 },
    },
  },
  {
    path: "M-200 100H400V700H2500",
    gradientConfig: {
      initial: { x1: "0%", x2: "5%", y1: "0%", y2: "5%" },
      animate: { x1: ["0%", "50%", "100%"], x2: ["5%", "55%", "105%"], y1: ["0%", "50%", "100%"], y2: ["5%", "55%", "105%"] },
      transition: { duration: 22, repeat: Infinity, repeatType: "loop", ease: "linear", repeatDelay: 2, delay: 0.5 },
    },
  },
  {
    path: "M2500 250H1400V550H-200",
    gradientConfig: {
      initial: { x1: "100%", x2: "95%", y1: "0%", y2: "5%" },
      animate: { x1: ["100%", "50%", "0%"], x2: ["95%", "45%", "-5%"], y1: ["0%", "50%", "100%"], y2: ["5%", "55%", "105%"] },
      transition: { duration: 20, repeat: Infinity, repeatType: "loop", ease: "linear", repeatDelay: 3, delay: 6 },
    },
  },
  {
    path: "M200 -200V300H1000V1500",
    gradientConfig: {
      initial: { x1: "0%", x2: "5%", y1: "0%", y2: "5%" },
      animate: { x1: ["0%", "50%", "100%"], x2: ["5%", "55%", "105%"], y1: ["0%", "50%", "100%"], y2: ["5%", "55%", "105%"] },
      transition: { duration: 22, repeat: Infinity, repeatType: "loop", ease: "linear", repeatDelay: 2, delay: 3.5 },
    },
  },
  {
    path: "M1300 1500V900H700V-200",
    gradientConfig: {
      initial: { x1: "100%", x2: "95%", y1: "100%", y2: "95%" },
      animate: { x1: ["100%", "50%", "0%"], x2: ["95%", "45%", "-5%"], y1: ["100%", "50%", "0%"], y2: ["95%", "45%", "-5%"] },
      transition: { duration: 20, repeat: Infinity, repeatType: "loop", ease: "linear", repeatDelay: 4, delay: 7.5 },
    },
  },
  {
    path: "M-200 450H2500",
    gradientConfig: {
      initial: { x1: "0%", x2: "10%", y1: "50%", y2: "50%" },
      animate: { x1: ["0%", "50%", "100%"], x2: ["10%", "60%", "110%"], y1: ["50%", "50%", "50%"], y2: ["50%", "50%", "50%"] },
      transition: { duration: 18, repeat: Infinity, repeatType: "loop", ease: "linear", repeatDelay: 4, delay: 10 },
    },
  },
  {
    path: "M850 -200V1500",
    gradientConfig: {
      initial: { x1: "50%", x2: "50%", y1: "0%", y2: "10%" },
      animate: { x1: ["50%", "50%", "50%"], x2: ["50%", "50%", "50%"], y1: ["0%", "50%", "100%"], y2: ["10%", "60%", "110%"] },
      transition: { duration: 16, repeat: Infinity, repeatType: "loop", ease: "linear", repeatDelay: 5, delay: 11 },
    },
  },
  // Additional right-side beams for signup page
  {
    path: "M1200 -200V600H2500",
    gradientConfig: {
      initial: { x1: "0%", x2: "10%", y1: "0%", y2: "0%" },
      animate: { x1: ["0%", "50%", "100%"], x2: ["10%", "60%", "110%"], y1: ["0%", "50%", "100%"], y2: ["0%", "50%", "100%"] },
      transition: { duration: 17, repeat: Infinity, repeatType: "loop", ease: "linear", repeatDelay: 3, delay: 1.5 },
    },
  },
  {
    path: "M1400 1500V700H2500",
    gradientConfig: {
      initial: { x1: "0%", x2: "10%", y1: "100%", y2: "100%" },
      animate: { x1: ["0%", "50%", "100%"], x2: ["10%", "60%", "110%"], y1: ["100%", "50%", "0%"], y2: ["100%", "50%", "0%"] },
      transition: { duration: 19, repeat: Infinity, repeatType: "loop", ease: "linear", repeatDelay: 2, delay: 4 },
    },
  },
  {
    path: "M1600 -200V1500",
    gradientConfig: {
      initial: { x1: "50%", x2: "50%", y1: "0%", y2: "10%" },
      animate: { x1: ["50%", "50%", "50%"], x2: ["50%", "50%", "50%"], y1: ["0%", "50%", "100%"], y2: ["10%", "60%", "110%"] },
      transition: { duration: 15, repeat: Infinity, repeatType: "loop", ease: "linear", repeatDelay: 4, delay: 6 },
    },
  },
  {
    path: "M1100 -200V400H1800V1500",
    gradientConfig: {
      initial: { x1: "0%", x2: "5%", y1: "0%", y2: "5%" },
      animate: { x1: ["0%", "50%", "100%"], x2: ["5%", "55%", "105%"], y1: ["0%", "50%", "100%"], y2: ["5%", "55%", "105%"] },
      transition: { duration: 21, repeat: Infinity, repeatType: "loop", ease: "linear", repeatDelay: 3, delay: 2.5 },
    },
  },
  {
    path: "M1500 1500V800H2500",
    gradientConfig: {
      initial: { x1: "0%", x2: "10%", y1: "100%", y2: "100%" },
      animate: { x1: ["0%", "50%", "100%"], x2: ["10%", "60%", "110%"], y1: ["100%", "50%", "0%"], y2: ["100%", "50%", "0%"] },
      transition: { duration: 18, repeat: Infinity, repeatType: "loop", ease: "linear", repeatDelay: 3, delay: 8 },
    },
  },
  {
    path: "M1300 -200V500H2500",
    gradientConfig: {
      initial: { x1: "0%", x2: "10%", y1: "0%", y2: "0%" },
      animate: { x1: ["0%", "50%", "100%"], x2: ["10%", "60%", "110%"], y1: ["0%", "50%", "100%"], y2: ["0%", "50%", "100%"] },
      transition: { duration: 16, repeat: Infinity, repeatType: "loop", ease: "linear", repeatDelay: 4, delay: 5.5 },
    },
  },
  {
    path: "M1700 -200V1500",
    gradientConfig: {
      initial: { x1: "50%", x2: "50%", y1: "0%", y2: "10%" },
      animate: { x1: ["50%", "50%", "50%"], x2: ["50%", "50%", "50%"], y1: ["0%", "50%", "100%"], y2: ["10%", "60%", "110%"] },
      transition: { duration: 14, repeat: Infinity, repeatType: "loop", ease: "linear", repeatDelay: 5, delay: 9 },
    },
  },
  {
    path: "M1200 1500V600H1900V-200",
    gradientConfig: {
      initial: { x1: "100%", x2: "95%", y1: "100%", y2: "95%" },
      animate: { x1: ["100%", "50%", "0%"], x2: ["95%", "45%", "-5%"], y1: ["100%", "50%", "0%"], y2: ["95%", "45%", "-5%"] },
      transition: { duration: 20, repeat: Infinity, repeatType: "loop", ease: "linear", repeatDelay: 3, delay: 10 },
    },
  },
];

const gradientColors = {
  start: "#FFFFFF",
  middle: "#DA8A67",
  end: "#B87333"
};

// --- HELPER COMPONENTS (ICONS) ---

const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s12-5.373 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-2.641-.21-5.236-.611-7.743z" />
        <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.022 35.026 44 30.038 44 24c0-2.641-.21-5.236-.611-7.743z" />
    </svg>
);


// --- TYPE DEFINITIONS ---

const ORGANIZATION_SIZES = [
  { value: '1-10', label: '1-10 employees' },
  { value: '11-50', label: '11-50 employees' },
  { value: '51-200', label: '51-200 employees' },
];

interface SignUpPageProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  heroImageSrc?: string;
  onSignUp?: (event: React.FormEvent<HTMLFormElement>) => void;
  onGoogleSignUp?: () => void;
  onSignIn?: () => void;
}

// --- MAIN COMPONENT ---

export const SignUpPage: React.FC<SignUpPageProps> = ({
  title = <span className="font-light tracking-tighter">Create Account</span>,
  description = "Join us and start your journey today",
  heroImageSrc,
  onSignUp,
  onGoogleSignUp,
  onSignIn,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSizeSelect = (value: string) => {
    setSelectedSize(value);
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <div className="h-[100dvh] flex flex-col md:flex-row font-geist w-[100dvw] relative overflow-hidden bg-black">
      {/* Pulse beams background */}
      <PulseBeams
        beams={beams}
        gradientColors={gradientColors}
        className="absolute inset-0 w-full h-full opacity-60 z-0"
        width={2400}
        height={1400}
        baseColor="#334155"
        accentColor="#475569"
      />

      {/* Left column: placeholder for shader (handled by AuthShaderOverlay) */}
      {heroImageSrc && (
        <section className="hidden md:block flex-1 relative z-10 pointer-events-none" />
      )}

      {/* Right column: sign-up form */}
      <section className="flex-1 flex items-center justify-center p-4 md:p-6 relative z-10 text-white overflow-hidden">
        <div className="w-full max-w-md">
          <div className="flex flex-col gap-2">
            <h1 className="animate-element animate-delay-100 text-3xl md:text-4xl font-semibold leading-tight text-white">{title}</h1>
            <p className="animate-element animate-delay-200 text-slate-400 text-sm">{description}</p>

            <form className="space-y-2.5 overflow-visible" onSubmit={onSignUp}>
              {/* First Name and Last Name Row */}
              <div className="animate-element animate-delay-300 grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-400">First Name</label>
                  <div className="rounded-xl border border-[#B87333]/30 bg-slate-900/60 backdrop-blur-sm transition-colors focus-within:border-[#B87333]/70 focus-within:bg-[#B87333]/5">
                    <input name="firstName" type="text" placeholder="First name" className="w-full bg-transparent text-sm px-3 py-2.5 rounded-xl focus:outline-none text-white placeholder:text-slate-500" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-400">Last Name</label>
                  <div className="rounded-xl border border-[#B87333]/30 bg-slate-900/60 backdrop-blur-sm transition-colors focus-within:border-[#B87333]/70 focus-within:bg-[#B87333]/5">
                    <input name="lastName" type="text" placeholder="Last name" className="w-full bg-transparent text-sm px-3 py-2.5 rounded-xl focus:outline-none text-white placeholder:text-slate-500" />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="animate-element animate-delay-400">
                <label className="text-xs font-medium text-slate-400">Email Address</label>
                <div className="rounded-xl border border-[#B87333]/30 bg-slate-900/60 backdrop-blur-sm transition-colors focus-within:border-[#B87333]/70 focus-within:bg-[#B87333]/5">
                  <input name="email" type="email" placeholder="Enter your email address" className="w-full bg-transparent text-sm px-3 py-2.5 rounded-xl focus:outline-none text-white placeholder:text-slate-500" />
                </div>
              </div>

              {/* Password and Confirm Password Row */}
              <div className="animate-element animate-delay-500 grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-400">Password</label>
                  <div className="rounded-xl border border-[#B87333]/30 bg-slate-900/60 backdrop-blur-sm transition-colors focus-within:border-[#B87333]/70 focus-within:bg-[#B87333]/5">
                    <div className="relative">
                      <input name="password" type={showPassword ? 'text' : 'password'} placeholder="Create password" className="w-full bg-transparent text-sm px-3 py-2.5 pr-10 rounded-xl focus:outline-none text-white placeholder:text-slate-500" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-2 flex items-center">
                        {showPassword ? <EyeOff className="w-4 h-4 text-slate-400 hover:text-white transition-colors" /> : <Eye className="w-4 h-4 text-slate-400 hover:text-white transition-colors" />}
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-400">Confirm Password</label>
                  <div className="rounded-xl border border-[#B87333]/30 bg-slate-900/60 backdrop-blur-sm transition-colors focus-within:border-[#B87333]/70 focus-within:bg-[#B87333]/5">
                    <div className="relative">
                      <input name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirm password" className="w-full bg-transparent text-sm px-3 py-2.5 pr-10 rounded-xl focus:outline-none text-white placeholder:text-slate-500" />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-2 flex items-center">
                        {showConfirmPassword ? <EyeOff className="w-4 h-4 text-slate-400 hover:text-white transition-colors" /> : <Eye className="w-4 h-4 text-slate-400 hover:text-white transition-colors" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Organization Name and Size Row */}
              <div className="animate-element animate-delay-600 grid grid-cols-2 gap-3 relative z-50">
                <div>
                  <label className="text-xs font-medium text-slate-400">Organization Name</label>
                  <div className="rounded-xl border border-[#B87333]/30 bg-slate-900/60 backdrop-blur-sm transition-colors focus-within:border-[#B87333]/70 focus-within:bg-[#B87333]/5">
                    <input name="organizationName" type="text" placeholder="Organization name" className="w-full bg-transparent text-sm px-3 py-2.5 rounded-xl focus:outline-none text-white placeholder:text-slate-500" />
                  </div>
                </div>
                <div className="relative z-50" ref={dropdownRef}>
                  <label className="text-xs font-medium text-slate-400">Organization Size</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="w-full rounded-xl border border-[#B87333]/30 bg-slate-900/60 backdrop-blur-sm transition-colors focus:border-[#B87333]/70 focus:bg-[#B87333]/5 text-left"
                    >
                      <div className="flex items-center justify-between px-3 py-2.5">
                        <span className={`text-sm ${selectedSize ? 'text-white' : 'text-slate-500'}`}>
                          {selectedSize ? ORGANIZATION_SIZES.find(s => s.value === selectedSize)?.label : 'Select size'}
                        </span>
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                      </div>
                    </button>
                    <input type="hidden" name="organizationSize" value={selectedSize} />

                    {isDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1 rounded-xl border border-[#B87333]/30 bg-slate-900/90 backdrop-blur-sm z-[9999] overflow-hidden shadow-2xl">
                        {ORGANIZATION_SIZES.map((size) => (
                          <button
                            key={size.value}
                            type="button"
                            onClick={() => handleSizeSelect(size.value)}
                            className="w-full text-left px-3 py-2.5 text-sm text-white hover:bg-[#B87333]/20 transition-colors"
                          >
                            {size.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="animate-element animate-delay-700 flex items-center gap-2 relative z-0">
                <input type="checkbox" name="agreeToTerms" className="custom-checkbox" />
                <span className="text-xs text-slate-300">
                  I agree to the <a href="#" className="text-[#DA8A67] hover:underline">Terms of Service</a> and <a href="#" className="text-[#DA8A67] hover:underline">Privacy Policy</a>
                </span>
              </div>

              <div className="animate-element animate-delay-800 flex justify-center pt-1 relative z-0">
                <GradientButton type="submit" className="rounded-xl py-2.5">
                  Create Account
                </GradientButton>
              </div>
            </form>

            <div className="animate-element animate-delay-900 relative flex items-center justify-center">
              <span className="w-full border-t border-[#B87333]/30"></span>
              <span className="px-4 text-xs text-slate-400 bg-black absolute">Or continue with</span>
            </div>

            <button onClick={onGoogleSignUp} className="animate-element animate-delay-1000 w-full flex items-center justify-center gap-2 border border-[#B87333]/30 rounded-xl py-2.5 text-white hover:bg-[#B87333]/10 transition-colors text-sm">
                <GoogleIcon />
                Continue with Google
            </button>

            <p className="animate-element animate-delay-1100 text-center text-xs text-slate-400">
              Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); onSignIn?.(); }} className="text-[#DA8A67] hover:underline transition-colors">Sign In</a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
```

---

## 3. App Router Pages

### app/layout.tsx

```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthLayoutWrapper } from "@/components/ui/AuthLayoutWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Auth System",
  description: "Login and Signup with animated shader",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthLayoutWrapper>
          {children}
        </AuthLayoutWrapper>
      </body>
    </html>
  );
}
```

### app/page.tsx (Login)

```tsx
"use client";

import { LoginPage } from "@/components/ui/login";
import { useAuthNavigation } from "@/contexts/AuthNavigationContext";

export default function Home() {
  const { navigateTo } = useAuthNavigation();

  const handleSignIn = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());
    console.log("Login submitted:", data);
    // Add your login logic here
  };

  const handleGoogleSignIn = () => {
    console.log("Continue with Google clicked");
    // Add your Google OAuth logic here
  };

  const handleResetPassword = () => {
    // Add your password reset logic here
  };

  const handleCreateAccount = () => {
    navigateTo('signup');
  };

  return (
    <div className="bg-background text-foreground">
      <LoginPage
        heroImageSrc="https://example.com/image.jpg"
        onSignIn={handleSignIn}
        onGoogleSignIn={handleGoogleSignIn}
        onResetPassword={handleResetPassword}
        onCreateAccount={handleCreateAccount}
      />
    </div>
  );
}
```

### app/signup/page.tsx

```tsx
"use client";

import { SignUpPage } from "@/components/ui/signup";
import { useAuthNavigation } from "@/contexts/AuthNavigationContext";

export default function SignUp() {
  const { navigateTo } = useAuthNavigation();

  const handleSignUp = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());
    console.log("Sign up submitted:", data);
    // Add your signup logic here
  };

  const handleGoogleSignUp = () => {
    console.log("Continue with Google clicked");
    // Add your Google OAuth logic here
  };

  const handleSignIn = () => {
    navigateTo('login');
  };

  return (
    <div className="bg-background text-foreground">
      <SignUpPage
        heroImageSrc="https://example.com/image.jpg"
        onSignUp={handleSignUp}
        onGoogleSignUp={handleGoogleSignUp}
        onSignIn={handleSignIn}
      />
    </div>
  );
}
```

---

## 4. CSS Styles (globals.css additions)

Add these styles to your `globals.css`:

```css
/* Custom animations for auth components */
@keyframes fadeSlideIn {
  to {
    opacity: 1;
    filter: blur(0px);
    transform: translateY(0px);
  }
}

@keyframes slideRightIn {
  to {
    opacity: 1;
    filter: blur(0px);
    transform: translateX(0px);
  }
}

/* Animation classes */
.animate-element {
  opacity: 0;
  filter: blur(4px);
  transform: translateY(10px);
  animation: fadeSlideIn 0.6s ease-out forwards;
}

.animate-slide-right {
  opacity: 0;
  filter: blur(4px);
  transform: translateX(20px);
  animation: slideRightIn 0.8s ease-out forwards;
}

/* Animation delays */
.animate-delay-100 { animation-delay: 0.1s; }
.animate-delay-200 { animation-delay: 0.2s; }
.animate-delay-300 { animation-delay: 0.3s; }
.animate-delay-400 { animation-delay: 0.4s; }
.animate-delay-500 { animation-delay: 0.5s; }
.animate-delay-600 { animation-delay: 0.6s; }
.animate-delay-700 { animation-delay: 0.7s; }
.animate-delay-800 { animation-delay: 0.8s; }
.animate-delay-900 { animation-delay: 0.9s; }
.animate-delay-1000 { animation-delay: 1.0s; }
.animate-delay-1100 { animation-delay: 1.1s; }

/* Custom checkbox styling */
.custom-checkbox {
  appearance: none;
  width: 1.25rem;
  height: 1.25rem;
  border: 1px solid var(--border);
  border-radius: 0.375rem;
  background-color: transparent;
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
}

.custom-checkbox:checked {
  background-color: var(--primary);
  border-color: var(--primary);
}

.custom-checkbox:checked::after {
  content: '';
  position: absolute;
  left: 50%;
  top: 45%;
  width: 0.3rem;
  height: 0.55rem;
  border: solid var(--primary-foreground);
  border-width: 0 2px 2px 0;
  transform: translate(-50%, -50%) rotate(45deg);
}

/* Auth Shader Overlay Animation */
.auth-shader-overlay {
  will-change: transform;
}

.auth-shader-slider {
  will-change: transform;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

@keyframes shaderSlideIn {
  from {
    opacity: 0;
    filter: blur(8px);
  }
  to {
    opacity: 1;
    filter: blur(0px);
  }
}

.auth-shader-slider {
  animation: shaderSlideIn 0.8s ease-out 0.3s forwards;
  opacity: 0;
}

/* Copper Gradient Button */
@property --copper-pos-x {
  syntax: '<percentage>';
  initial-value: 50%;
  inherits: false;
}

@property --copper-pos-y {
  syntax: '<percentage>';
  initial-value: 0%;
  inherits: false;
}

@property --copper-spread-x {
  syntax: '<percentage>';
  initial-value: 150%;
  inherits: false;
}

@property --copper-spread-y {
  syntax: '<percentage>';
  initial-value: 150%;
  inherits: false;
}

@property --copper-color-1 {
  syntax: '<color>';
  initial-value: #B87333;
  inherits: false;
}

@property --copper-color-2 {
  syntax: '<color>';
  initial-value: #A0673D;
  inherits: false;
}

@property --copper-color-3 {
  syntax: '<color>';
  initial-value: #7A5230;
  inherits: false;
}

@property --copper-color-4 {
  syntax: '<color>';
  initial-value: #2a1a10;
  inherits: false;
}

@property --copper-color-5 {
  syntax: '<color>';
  initial-value: #000000;
  inherits: false;
}

.gradient-button-copper {
  position: relative;
  appearance: none;
  cursor: pointer;
  background: radial-gradient(
    var(--copper-spread-x) var(--copper-spread-y) at var(--copper-pos-x) var(--copper-pos-y),
    var(--copper-color-1) 0%,
    var(--copper-color-2) 25%,
    var(--copper-color-3) 50%,
    var(--copper-color-4) 75%,
    var(--copper-color-5) 100%
  );
  transition:
    --copper-pos-x 0.5s,
    --copper-pos-y 0.5s,
    --copper-spread-x 0.5s,
    --copper-spread-y 0.5s,
    --copper-color-1 0.5s,
    --copper-color-2 0.5s,
    --copper-color-3 0.5s,
    --copper-color-4 0.5s,
    --copper-color-5 0.5s,
    transform 0.15s ease;
}

.gradient-button-copper:hover {
  --copper-pos-x: 30%;
  --copper-pos-y: 0%;
  --copper-spread-x: 180%;
  --copper-spread-y: 200%;
  --copper-color-1: #CD7F32;
  --copper-color-2: #B87333;
  --copper-color-3: #8B5A2B;
  --copper-color-4: #3a2510;
  --copper-color-5: #000000;
}

.gradient-button-copper:active {
  transform: scale(0.98);
}
```

---

## Animation Behavior

- **Login -> Signup**: Shader slides from right to left
- **Signup -> Login**: Shader slides from left to right
- Animation duration: 600ms with ease-in-out
- Shader persists across navigation (no re-render)
- Form elements animate in with staggered delays

## Customization

### Colors
Edit the `gradientColors` object in login.tsx and signup.tsx:
```tsx
const gradientColors = {
  start: "#FFFFFF",    // Light color
  middle: "#DA8A67",   // Mid tone (copper)
  end: "#B87333"       // Dark tone (copper)
};
```

### Animation Timing
Edit the CSS transition duration in AuthShaderOverlay.tsx:
```tsx
transition-transform duration-[600ms] ease-in-out
```

### Beam Configuration
Modify the `beams` array to change the animated line patterns.
