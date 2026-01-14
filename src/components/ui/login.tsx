"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { PulseBeams } from "./pulse-beams";
import { GradientButton } from "./gradient-button";

// --- BEAM CONFIGURATION ---

const beams = [
  {
    path: "M-200 150H800V1500",
    gradientConfig: {
      initial: { x1: "0%", x2: "0%", y1: "0%", y2: "10%" },
      animate: {
        x1: ["0%", "50%", "100%"],
        x2: ["0%", "50%", "100%"],
        y1: ["0%", "50%", "100%"],
        y2: ["10%", "60%", "110%"],
      },
      transition: {
        duration: 18,
        repeat: Infinity,
        repeatType: "loop",
        ease: "linear",
        repeatDelay: 3,
        delay: 0,
      },
    },
  },
  {
    path: "M-200 600H500V-200",
    gradientConfig: {
      initial: { x1: "0%", x2: "0%", y1: "100%", y2: "90%" },
      animate: {
        x1: ["0%", "50%", "100%"],
        x2: ["0%", "50%", "100%"],
        y1: ["100%", "50%", "0%"],
        y2: ["90%", "40%", "-10%"],
      },
      transition: {
        duration: 16,
        repeat: Infinity,
        repeatType: "loop",
        ease: "linear",
        repeatDelay: 4,
        delay: 2,
      },
    },
  },
  {
    path: "M300 -200V400H2500",
    gradientConfig: {
      initial: { x1: "0%", x2: "10%", y1: "0%", y2: "0%" },
      animate: {
        x1: ["0%", "50%", "100%"],
        x2: ["10%", "60%", "110%"],
        y1: ["0%", "50%", "100%"],
        y2: ["0%", "50%", "100%"],
      },
      transition: {
        duration: 20,
        repeat: Infinity,
        repeatType: "loop",
        ease: "linear",
        repeatDelay: 2,
        delay: 1,
      },
    },
  },
  {
    path: "M1000 -200V500H-200",
    gradientConfig: {
      initial: { x1: "100%", x2: "90%", y1: "0%", y2: "0%" },
      animate: {
        x1: ["100%", "50%", "0%"],
        x2: ["90%", "40%", "-10%"],
        y1: ["0%", "50%", "100%"],
        y2: ["0%", "50%", "100%"],
      },
      transition: {
        duration: 18,
        repeat: Infinity,
        repeatType: "loop",
        ease: "linear",
        repeatDelay: 3,
        delay: 5,
      },
    },
  },
  {
    path: "M2500 200H1200V1500",
    gradientConfig: {
      initial: { x1: "100%", x2: "100%", y1: "0%", y2: "10%" },
      animate: {
        x1: ["100%", "50%", "0%"],
        x2: ["100%", "50%", "0%"],
        y1: ["0%", "50%", "100%"],
        y2: ["10%", "60%", "110%"],
      },
      transition: {
        duration: 16,
        repeat: Infinity,
        repeatType: "loop",
        ease: "linear",
        repeatDelay: 4,
        delay: 3,
      },
    },
  },
  {
    path: "M2500 700H900V-200",
    gradientConfig: {
      initial: { x1: "100%", x2: "100%", y1: "100%", y2: "90%" },
      animate: {
        x1: ["100%", "50%", "0%"],
        x2: ["100%", "50%", "0%"],
        y1: ["100%", "50%", "0%"],
        y2: ["90%", "40%", "-10%"],
      },
      transition: {
        duration: 18,
        repeat: Infinity,
        repeatType: "loop",
        ease: "linear",
        repeatDelay: 3,
        delay: 7,
      },
    },
  },
  {
    path: "M400 1500V800H2500",
    gradientConfig: {
      initial: { x1: "0%", x2: "10%", y1: "100%", y2: "100%" },
      animate: {
        x1: ["0%", "50%", "100%"],
        x2: ["10%", "60%", "110%"],
        y1: ["100%", "50%", "0%"],
        y2: ["100%", "50%", "0%"],
      },
      transition: {
        duration: 20,
        repeat: Infinity,
        repeatType: "loop",
        ease: "linear",
        repeatDelay: 2,
        delay: 2,
      },
    },
  },
  {
    path: "M1100 1500V600H-200",
    gradientConfig: {
      initial: { x1: "100%", x2: "90%", y1: "100%", y2: "100%" },
      animate: {
        x1: ["100%", "50%", "0%"],
        x2: ["90%", "40%", "-10%"],
        y1: ["100%", "50%", "0%"],
        y2: ["100%", "50%", "0%"],
      },
      transition: {
        duration: 16,
        repeat: Infinity,
        repeatType: "loop",
        ease: "linear",
        repeatDelay: 4,
        delay: 4,
      },
    },
  },
  {
    path: "M-200 300H600V1500",
    gradientConfig: {
      initial: { x1: "0%", x2: "0%", y1: "0%", y2: "10%" },
      animate: {
        x1: ["0%", "50%", "100%"],
        x2: ["0%", "50%", "100%"],
        y1: ["0%", "50%", "100%"],
        y2: ["10%", "60%", "110%"],
      },
      transition: {
        duration: 18,
        repeat: Infinity,
        repeatType: "loop",
        ease: "linear",
        repeatDelay: 4,
        delay: 8,
      },
    },
  },
  {
    path: "M700 -200V350H2500",
    gradientConfig: {
      initial: { x1: "0%", x2: "10%", y1: "0%", y2: "0%" },
      animate: {
        x1: ["0%", "50%", "100%"],
        x2: ["10%", "60%", "110%"],
        y1: ["0%", "50%", "100%"],
        y2: ["0%", "50%", "100%"],
      },
      transition: {
        duration: 16,
        repeat: Infinity,
        repeatType: "loop",
        ease: "linear",
        repeatDelay: 3,
        delay: 9,
      },
    },
  },
  {
    path: "M-200 100H400V700H2500",
    gradientConfig: {
      initial: { x1: "0%", x2: "5%", y1: "0%", y2: "5%" },
      animate: {
        x1: ["0%", "50%", "100%"],
        x2: ["5%", "55%", "105%"],
        y1: ["0%", "50%", "100%"],
        y2: ["5%", "55%", "105%"],
      },
      transition: {
        duration: 22,
        repeat: Infinity,
        repeatType: "loop",
        ease: "linear",
        repeatDelay: 2,
        delay: 0.5,
      },
    },
  },
  {
    path: "M2500 250H1400V550H-200",
    gradientConfig: {
      initial: { x1: "100%", x2: "95%", y1: "0%", y2: "5%" },
      animate: {
        x1: ["100%", "50%", "0%"],
        x2: ["95%", "45%", "-5%"],
        y1: ["0%", "50%", "100%"],
        y2: ["5%", "55%", "105%"],
      },
      transition: {
        duration: 20,
        repeat: Infinity,
        repeatType: "loop",
        ease: "linear",
        repeatDelay: 3,
        delay: 6,
      },
    },
  },
  {
    path: "M200 -200V300H1000V1500",
    gradientConfig: {
      initial: { x1: "0%", x2: "5%", y1: "0%", y2: "5%" },
      animate: {
        x1: ["0%", "50%", "100%"],
        x2: ["5%", "55%", "105%"],
        y1: ["0%", "50%", "100%"],
        y2: ["5%", "55%", "105%"],
      },
      transition: {
        duration: 22,
        repeat: Infinity,
        repeatType: "loop",
        ease: "linear",
        repeatDelay: 2,
        delay: 3.5,
      },
    },
  },
  {
    path: "M1300 1500V900H700V-200",
    gradientConfig: {
      initial: { x1: "100%", x2: "95%", y1: "100%", y2: "95%" },
      animate: {
        x1: ["100%", "50%", "0%"],
        x2: ["95%", "45%", "-5%"],
        y1: ["100%", "50%", "0%"],
        y2: ["95%", "45%", "-5%"],
      },
      transition: {
        duration: 20,
        repeat: Infinity,
        repeatType: "loop",
        ease: "linear",
        repeatDelay: 4,
        delay: 7.5,
      },
    },
  },
  {
    path: "M-200 450H2500",
    gradientConfig: {
      initial: { x1: "0%", x2: "10%", y1: "50%", y2: "50%" },
      animate: {
        x1: ["0%", "50%", "100%"],
        x2: ["10%", "60%", "110%"],
        y1: ["50%", "50%", "50%"],
        y2: ["50%", "50%", "50%"],
      },
      transition: {
        duration: 18,
        repeat: Infinity,
        repeatType: "loop",
        ease: "linear",
        repeatDelay: 4,
        delay: 10,
      },
    },
  },
  {
    path: "M850 -200V1500",
    gradientConfig: {
      initial: { x1: "50%", x2: "50%", y1: "0%", y2: "10%" },
      animate: {
        x1: ["50%", "50%", "50%"],
        x2: ["50%", "50%", "50%"],
        y1: ["0%", "50%", "100%"],
        y2: ["10%", "60%", "110%"],
      },
      transition: {
        duration: 16,
        repeat: Infinity,
        repeatType: "loop",
        ease: "linear",
        repeatDelay: 5,
        delay: 11,
      },
    },
  },
];

const gradientColors = {
  start: "#FFFFFF",
  middle: "#DA8A67",
  end: "#B87333",
};

// --- HELPER COMPONENTS (ICONS) ---

const GoogleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 48 48"
  >
    <path
      fill="#FFC107"
      d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s12-5.373 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-2.641-.21-5.236-.611-7.743z"
    />
    <path
      fill="#FF3D00"
      d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
    />
    <path
      fill="#4CAF50"
      d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
    />
    <path
      fill="#1976D2"
      d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.022 35.026 44 30.038 44 24c0-2.641-.21-5.236-.611-7.743z"
    />
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
  isLoading?: boolean;
  error?: string | null;
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
  isLoading = false,
  error = null,
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
      <section className="flex-1 flex items-center justify-center md:justify-start p-8 relative z-10 text-white">
        <div className="w-full max-w-md md:ml-8 lg:ml-16">
          <div className="flex flex-col gap-6">
            <h1 className="animate-element animate-delay-100 text-4xl md:text-5xl font-semibold leading-tight text-white">
              {title}
            </h1>
            <p className="animate-element animate-delay-200 text-slate-400">
              {description}
            </p>

            {error && (
              <div className="animate-element animate-delay-250 rounded-lg bg-red-900/50 border border-red-500/30 p-3 text-sm text-red-200">
                {error}
              </div>
            )}

            <form className="space-y-5" onSubmit={onSignIn}>
              <div className="animate-element animate-delay-300">
                <label className="text-sm font-medium text-slate-400">
                  Email Address
                </label>
                <div className="rounded-2xl border border-[#B87333]/30 bg-slate-900/60 backdrop-blur-sm transition-colors focus-within:border-[#B87333]/70 focus-within:bg-[#B87333]/5">
                  <input
                    name="email"
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none text-white placeholder:text-slate-500"
                    required
                  />
                </div>
              </div>

              <div className="animate-element animate-delay-400">
                <label className="text-sm font-medium text-slate-400">
                  Password
                </label>
                <div className="rounded-2xl border border-[#B87333]/30 bg-slate-900/60 backdrop-blur-sm transition-colors focus-within:border-[#B87333]/70 focus-within:bg-[#B87333]/5">
                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="w-full bg-transparent text-sm p-4 pr-12 rounded-2xl focus:outline-none text-white placeholder:text-slate-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5 text-slate-400 hover:text-white transition-colors" />
                      ) : (
                        <Eye className="w-5 h-5 text-slate-400 hover:text-white transition-colors" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="animate-element animate-delay-500 flex items-center justify-between text-sm">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    className="custom-checkbox"
                  />
                  <span className="text-slate-300">Keep me signed in</span>
                </label>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onResetPassword?.();
                  }}
                  className="hover:underline text-[#DA8A67] transition-colors"
                >
                  Reset password
                </a>
              </div>

              <div className="animate-element animate-delay-600 flex justify-center">
                <GradientButton
                  type="submit"
                  className="rounded-2xl"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </GradientButton>
              </div>
            </form>

            <div className="animate-element animate-delay-700 relative flex items-center justify-center">
              <span className="w-full border-t border-[#B87333]/30"></span>
              <span className="px-4 text-sm text-slate-400 bg-black absolute">
                Or continue with
              </span>
            </div>

            <button
              type="button"
              onClick={onGoogleSignIn}
              className="animate-element animate-delay-800 w-full flex items-center justify-center gap-3 border border-[#B87333]/30 rounded-2xl py-4 text-white hover:bg-[#B87333]/10 transition-colors"
            >
              <GoogleIcon />
              Continue with Google
            </button>

            <p className="animate-element animate-delay-900 text-center text-sm text-slate-400">
              New to our platform?{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onCreateAccount?.();
                }}
                className="text-[#DA8A67] hover:underline transition-colors"
              >
                Create Account
              </a>
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
