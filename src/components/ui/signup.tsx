"use client";

import React, { useState, useRef, useEffect } from "react";
import { Eye, EyeOff, ChevronDown } from "lucide-react";
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
  {
    path: "M1200 -200V600H2500",
    gradientConfig: {
      initial: { x1: "0%", x2: "10%", y1: "0%", y2: "0%" },
      animate: {
        x1: ["0%", "50%", "100%"],
        x2: ["10%", "60%", "110%"],
        y1: ["0%", "50%", "100%"],
        y2: ["0%", "50%", "100%"],
      },
      transition: {
        duration: 17,
        repeat: Infinity,
        repeatType: "loop",
        ease: "linear",
        repeatDelay: 3,
        delay: 1.5,
      },
    },
  },
  {
    path: "M1400 1500V700H2500",
    gradientConfig: {
      initial: { x1: "0%", x2: "10%", y1: "100%", y2: "100%" },
      animate: {
        x1: ["0%", "50%", "100%"],
        x2: ["10%", "60%", "110%"],
        y1: ["100%", "50%", "0%"],
        y2: ["100%", "50%", "0%"],
      },
      transition: {
        duration: 19,
        repeat: Infinity,
        repeatType: "loop",
        ease: "linear",
        repeatDelay: 2,
        delay: 4,
      },
    },
  },
  {
    path: "M1600 -200V1500",
    gradientConfig: {
      initial: { x1: "50%", x2: "50%", y1: "0%", y2: "10%" },
      animate: {
        x1: ["50%", "50%", "50%"],
        x2: ["50%", "50%", "50%"],
        y1: ["0%", "50%", "100%"],
        y2: ["10%", "60%", "110%"],
      },
      transition: {
        duration: 15,
        repeat: Infinity,
        repeatType: "loop",
        ease: "linear",
        repeatDelay: 4,
        delay: 6,
      },
    },
  },
  {
    path: "M1100 -200V400H1800V1500",
    gradientConfig: {
      initial: { x1: "0%", x2: "5%", y1: "0%", y2: "5%" },
      animate: {
        x1: ["0%", "50%", "100%"],
        x2: ["5%", "55%", "105%"],
        y1: ["0%", "50%", "100%"],
        y2: ["5%", "55%", "105%"],
      },
      transition: {
        duration: 21,
        repeat: Infinity,
        repeatType: "loop",
        ease: "linear",
        repeatDelay: 3,
        delay: 2.5,
      },
    },
  },
  {
    path: "M1500 1500V800H2500",
    gradientConfig: {
      initial: { x1: "0%", x2: "10%", y1: "100%", y2: "100%" },
      animate: {
        x1: ["0%", "50%", "100%"],
        x2: ["10%", "60%", "110%"],
        y1: ["100%", "50%", "0%"],
        y2: ["100%", "50%", "0%"],
      },
      transition: {
        duration: 18,
        repeat: Infinity,
        repeatType: "loop",
        ease: "linear",
        repeatDelay: 3,
        delay: 8,
      },
    },
  },
  {
    path: "M1300 -200V500H2500",
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
        repeatDelay: 4,
        delay: 5.5,
      },
    },
  },
  {
    path: "M1700 -200V1500",
    gradientConfig: {
      initial: { x1: "50%", x2: "50%", y1: "0%", y2: "10%" },
      animate: {
        x1: ["50%", "50%", "50%"],
        x2: ["50%", "50%", "50%"],
        y1: ["0%", "50%", "100%"],
        y2: ["10%", "60%", "110%"],
      },
      transition: {
        duration: 14,
        repeat: Infinity,
        repeatType: "loop",
        ease: "linear",
        repeatDelay: 5,
        delay: 9,
      },
    },
  },
  {
    path: "M1200 1500V600H1900V-200",
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
        repeatDelay: 3,
        delay: 10,
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

const ORGANIZATION_SIZES = [
  { value: "1-10", label: "1-10 employees" },
  { value: "10-50", label: "10-50 employees" },
  { value: "50-100", label: "50-100 employees" },
  { value: "100-500", label: "100-500 employees" },
  { value: "500+", label: "500+ employees" },
];

interface SignUpPageProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  heroImageSrc?: string;
  onSignUp?: (event: React.FormEvent<HTMLFormElement>) => void;
  onGoogleSignUp?: () => void;
  onSignIn?: () => void;
  isLoading?: boolean;
  error?: string | null;
}

// --- MAIN COMPONENT ---

export const SignUpPage: React.FC<SignUpPageProps> = ({
  title = <span className="font-light tracking-tighter">Create Account</span>,
  description = "Join us and start your journey today",
  heroImageSrc,
  onSignUp,
  onGoogleSignUp,
  onSignIn,
  isLoading = false,
  error = null,
}) => {
  // Wizard state
  const [currentStep, setCurrentStep] = useState(1);

  // Form data state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    organizationName: "",
    organizationSize: "",
  });

  // Step-specific errors
  const [stepErrors, setStepErrors] = useState<Record<string, string>>({});

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSizeSelect = (value: string) => {
    setFormData((prev) => ({ ...prev, organizationSize: value }));
    setIsDropdownOpen(false);
  };

  // Validation functions
  const validateStep1 = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.firstName.trim() || formData.firstName.trim().length < 2) {
      errors.firstName = "First name must be at least 2 characters";
    }
    if (!formData.lastName.trim() || formData.lastName.trim().length < 2) {
      errors.lastName = "Last name must be at least 2 characters";
    }
    setStepErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const errors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Invalid email address";
    }
    if (!formData.password || formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      errors.password =
        "Password must contain uppercase, lowercase, and number";
    }
    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    setStepErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep3 = (): boolean => {
    const errors: Record<string, string> = {};
    if (
      !formData.organizationName.trim() ||
      formData.organizationName.trim().length < 2
    ) {
      errors.organizationName =
        "Organization name must be at least 2 characters";
    }
    if (!formData.organizationSize) {
      errors.organizationSize = "Please select organization size";
    }
    setStepErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Navigation functions
  const handleNext = () => {
    let isValid = false;
    if (currentStep === 1) {
      isValid = validateStep1();
    } else if (currentStep === 2) {
      isValid = validateStep2();
    }

    if (isValid) {
      setStepErrors({});
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const handleBack = () => {
    setStepErrors({});
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleStepClick = (step: number) => {
    // Only allow navigation to completed or current step
    if (step <= currentStep) {
      setStepErrors({});
      setCurrentStep(step);
    }
  };

  // Progress Bar Component
  const ProgressBar = () => {
    const steps = [
      { number: 1, label: "Personal Info" },
      { number: 2, label: "Account Details" },
      { number: 3, label: "Organization" },
    ];

    return (
      <div className="w-full mb-6">
        <div className="flex items-center justify-between relative">
          {/* Progress line */}
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-slate-700/50 z-0">
            <div
              className="h-full bg-gradient-to-r from-[#B87333] to-[#DA8A67] transition-all duration-500 ease-out"
              style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
            />
          </div>

          {/* Step indicators */}
          {steps.map((step, index) => {
            const isCompleted = step.number < currentStep;
            const isCurrent = step.number === currentStep;
            const isClickable = step.number <= currentStep;

            return (
              <div
                key={step.number}
                className="flex flex-col items-center relative z-10 flex-1"
              >
                <button
                  type="button"
                  onClick={() => handleStepClick(step.number)}
                  disabled={!isClickable}
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300
                    ${
                      isCompleted
                        ? "bg-gradient-to-r from-[#B87333] to-[#DA8A67] text-white cursor-pointer hover:scale-110"
                        : isCurrent
                        ? "bg-[#B87333] text-white ring-4 ring-[#B87333]/30 cursor-pointer"
                        : "bg-slate-700 text-slate-400 cursor-not-allowed"
                    }
                    ${isClickable ? "hover:scale-110" : ""}
                  `}
                >
                  {isCompleted ? "✓" : step.number}
                </button>
                <span
                  className={`mt-2 text-xs text-center ${
                    isCurrent ? "text-white" : "text-slate-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
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
      <section className="flex-1 flex items-center justify-center md:justify-end p-4 md:p-6 relative z-10 text-white overflow-hidden">
        <div className="w-full max-w-md md:mr-8 lg:mr-16">
          <div className="flex flex-col gap-4">
            <h1 className="animate-element animate-delay-100 text-3xl md:text-4xl font-semibold leading-tight text-white">
              {title}
            </h1>
            <p className="animate-element animate-delay-200 text-slate-400 text-sm">
              {description}
            </p>

            {/* Progress Bar */}
            <ProgressBar />

            {error && (
              <div className="animate-element animate-delay-250 rounded-lg bg-red-900/50 border border-red-500/30 p-3 text-sm text-red-200">
                {error}
              </div>
            )}

            <form
              className="space-y-2.5 overflow-visible"
              onSubmit={(e) => {
                e.preventDefault();
                if (currentStep === 3) {
                  if (validateStep3()) {
                    // Create hidden inputs with form data for FormData compatibility
                    const form = e.currentTarget;
                    const hiddenInputs = [
                      { name: "firstName", value: formData.firstName },
                      { name: "lastName", value: formData.lastName },
                      { name: "email", value: formData.email },
                      { name: "password", value: formData.password },
                      {
                        name: "confirmPassword",
                        value: formData.confirmPassword,
                      },
                      {
                        name: "organizationName",
                        value: formData.organizationName,
                      },
                      {
                        name: "organizationSize",
                        value: formData.organizationSize,
                      },
                    ];

                    // Temporarily add hidden inputs to form
                    hiddenInputs.forEach(({ name, value }) => {
                      const input = document.createElement("input");
                      input.type = "hidden";
                      input.name = name;
                      input.value = value;
                      form.appendChild(input);
                    });

                    // Call onSignUp with the form event
                    onSignUp?.(e);

                    // Clean up hidden inputs after a short delay
                    setTimeout(() => {
                      hiddenInputs.forEach(() => {
                        const input = form.querySelector(
                          'input[type="hidden"]'
                        );
                        if (input) form.removeChild(input);
                      });
                    }, 100);
                  }
                } else {
                  handleNext();
                }
              }}
            >
              {/* Step 1: First Name and Last Name */}
              {currentStep === 1 && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-slate-400">
                        First Name
                      </label>
                      <div
                        className={`rounded-xl border bg-slate-900/60 backdrop-blur-sm transition-colors focus-within:border-[#B87333]/70 focus-within:bg-[#B87333]/5 ${
                          stepErrors.firstName
                            ? "border-red-500/50"
                            : "border-[#B87333]/30"
                        }`}
                      >
                        <input
                          type="text"
                          placeholder="First name"
                          value={formData.firstName}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              firstName: e.target.value,
                            }))
                          }
                          className="w-full bg-transparent text-sm px-3 py-2.5 rounded-xl focus:outline-none text-white placeholder:text-slate-500"
                          required
                        />
                      </div>
                      {stepErrors.firstName && (
                        <p className="mt-1 text-xs text-red-400">
                          {stepErrors.firstName}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-400">
                        Last Name
                      </label>
                      <div
                        className={`rounded-xl border bg-slate-900/60 backdrop-blur-sm transition-colors focus-within:border-[#B87333]/70 focus-within:bg-[#B87333]/5 ${
                          stepErrors.lastName
                            ? "border-red-500/50"
                            : "border-[#B87333]/30"
                        }`}
                      >
                        <input
                          type="text"
                          placeholder="Last name"
                          value={formData.lastName}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              lastName: e.target.value,
                            }))
                          }
                          className="w-full bg-transparent text-sm px-3 py-2.5 rounded-xl focus:outline-none text-white placeholder:text-slate-500"
                          required
                        />
                      </div>
                      {stepErrors.lastName && (
                        <p className="mt-1 text-xs text-red-400">
                          {stepErrors.lastName}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Email, Password, Confirm Password */}
              {currentStep === 2 && (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-slate-400">
                      Email Address
                    </label>
                    <div
                      className={`rounded-xl border bg-slate-900/60 backdrop-blur-sm transition-colors focus-within:border-[#B87333]/70 focus-within:bg-[#B87333]/5 ${
                        stepErrors.email
                          ? "border-red-500/50"
                          : "border-[#B87333]/30"
                      }`}
                    >
                      <input
                        type="email"
                        placeholder="Enter your email address"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        className="w-full bg-transparent text-sm px-3 py-2.5 rounded-xl focus:outline-none text-white placeholder:text-slate-500"
                        required
                      />
                    </div>
                    {stepErrors.email && (
                      <p className="mt-1 text-xs text-red-400">
                        {stepErrors.email}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-slate-400">
                        Password
                      </label>
                      <div
                        className={`rounded-xl border bg-slate-900/60 backdrop-blur-sm transition-colors focus-within:border-[#B87333]/70 focus-within:bg-[#B87333]/5 ${
                          stepErrors.password
                            ? "border-red-500/50"
                            : "border-[#B87333]/30"
                        }`}
                      >
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Create password"
                            value={formData.password}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                password: e.target.value,
                              }))
                            }
                            className="w-full bg-transparent text-sm px-3 py-2.5 pr-10 rounded-xl focus:outline-none text-white placeholder:text-slate-500"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-2 flex items-center"
                          >
                            {showPassword ? (
                              <EyeOff className="w-4 h-4 text-slate-400 hover:text-white transition-colors" />
                            ) : (
                              <Eye className="w-4 h-4 text-slate-400 hover:text-white transition-colors" />
                            )}
                          </button>
                        </div>
                      </div>
                      {stepErrors.password && (
                        <p className="mt-1 text-xs text-red-400">
                          {stepErrors.password}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-400">
                        Confirm Password
                      </label>
                      <div
                        className={`rounded-xl border bg-slate-900/60 backdrop-blur-sm transition-colors focus-within:border-[#B87333]/70 focus-within:bg-[#B87333]/5 ${
                          stepErrors.confirmPassword
                            ? "border-red-500/50"
                            : "border-[#B87333]/30"
                        }`}
                      >
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm password"
                            value={formData.confirmPassword}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                confirmPassword: e.target.value,
                              }))
                            }
                            className="w-full bg-transparent text-sm px-3 py-2.5 pr-10 rounded-xl focus:outline-none text-white placeholder:text-slate-500"
                            required
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute inset-y-0 right-2 flex items-center"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="w-4 h-4 text-slate-400 hover:text-white transition-colors" />
                            ) : (
                              <Eye className="w-4 h-4 text-slate-400 hover:text-white transition-colors" />
                            )}
                          </button>
                        </div>
                      </div>
                      {stepErrors.confirmPassword && (
                        <p className="mt-1 text-xs text-red-400">
                          {stepErrors.confirmPassword}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Organization Name and Size */}
              {currentStep === 3 && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 relative z-50">
                    <div>
                      <label className="text-xs font-medium text-slate-400">
                        Organization Name
                      </label>
                      <div
                        className={`rounded-xl border bg-slate-900/60 backdrop-blur-sm transition-colors focus-within:border-[#B87333]/70 focus-within:bg-[#B87333]/5 ${
                          stepErrors.organizationName
                            ? "border-red-500/50"
                            : "border-[#B87333]/30"
                        }`}
                      >
                        <input
                          type="text"
                          placeholder="Organization name"
                          value={formData.organizationName}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              organizationName: e.target.value,
                            }))
                          }
                          className="w-full bg-transparent text-sm px-3 py-2.5 rounded-xl focus:outline-none text-white placeholder:text-slate-500"
                          required
                        />
                      </div>
                      {stepErrors.organizationName && (
                        <p className="mt-1 text-xs text-red-400">
                          {stepErrors.organizationName}
                        </p>
                      )}
                    </div>
                    <div className="relative z-50" ref={dropdownRef}>
                      <label className="text-xs font-medium text-slate-400">
                        Organization Size
                      </label>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                          className={`w-full rounded-xl border bg-slate-900/60 backdrop-blur-sm transition-colors focus:border-[#B87333]/70 focus:bg-[#B87333]/5 text-left ${
                            stepErrors.organizationSize
                              ? "border-red-500/50"
                              : "border-[#B87333]/30"
                          }`}
                        >
                          <div className="flex items-center justify-between px-3 py-2.5">
                            <span
                              className={`text-sm ${
                                formData.organizationSize
                                  ? "text-white"
                                  : "text-slate-500"
                              }`}
                            >
                              {formData.organizationSize
                                ? ORGANIZATION_SIZES.find(
                                    (s) => s.value === formData.organizationSize
                                  )?.label
                                : "Select size"}
                            </span>
                            <ChevronDown
                              className={`w-4 h-4 text-slate-400 transition-transform ${
                                isDropdownOpen ? "rotate-180" : ""
                              }`}
                            />
                          </div>
                        </button>

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
                      {stepErrors.organizationSize && (
                        <p className="mt-1 text-xs text-red-400">
                          {stepErrors.organizationSize}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="flex items-center gap-2 relative z-0">
                    <input
                      type="checkbox"
                      name="agreeToTerms"
                      className="custom-checkbox"
                      required
                    />
                    <span className="text-xs text-slate-300">
                      I agree to the{" "}
                      <a href="#" className="text-[#DA8A67] hover:underline">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="#" className="text-[#DA8A67] hover:underline">
                        Privacy Policy
                      </a>
                    </span>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center gap-3 pt-2">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-[#B87333]/30 bg-slate-900/60 text-white hover:bg-[#B87333]/10 transition-colors text-sm font-medium"
                  >
                    Back
                  </button>
                )}
                <GradientButton
                  type="submit"
                  className={`rounded-xl py-2.5 ${
                    currentStep > 1 ? "flex-1" : "w-full"
                  }`}
                  disabled={isLoading}
                >
                  {isLoading
                    ? "Creating account..."
                    : currentStep === 3
                    ? "Create Account"
                    : "Next"}
                </GradientButton>
              </div>
            </form>

            {/* OAuth - Only show on steps 1 and 2 */}
            {currentStep < 3 && (
              <>
                <div className="relative flex items-center justify-center">
                  <span className="w-full border-t border-[#B87333]/30"></span>
                  <span className="px-4 text-xs text-slate-400 bg-black absolute">
                    Or continue with
                  </span>
                </div>

                <button
                  type="button"
                  onClick={onGoogleSignUp}
                  className="w-full flex items-center justify-center gap-2 border border-[#B87333]/30 rounded-xl py-2.5 text-white hover:bg-[#B87333]/10 transition-colors text-sm"
                >
                  <GoogleIcon />
                  Continue with Google
                </button>
              </>
            )}

            <p className="animate-element animate-delay-1100 text-center text-xs text-slate-400">
              Already have an account?{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onSignIn?.();
                }}
                className="text-[#DA8A67] hover:underline transition-colors"
              >
                Sign In
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
