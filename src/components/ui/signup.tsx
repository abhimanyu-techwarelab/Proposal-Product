"use client";

import React, { useState, useRef, useEffect } from "react";
import { Eye, EyeOff, ChevronDown } from "lucide-react";
import { PulseBeams } from "./pulse-beams";
import { GradientButton } from "./gradient-button";
import { COUNTRIES } from "@/lib/countries";

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
  const [maxStepReached, setMaxStepReached] = useState(1);

  // Form data state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    organizationName: "",
    organizationSize: "",
    streetAddress1: "",
    streetAddress2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    phone: "",
  });

  // Step-specific errors
  const [stepErrors, setStepErrors] = useState<Record<string, string>>({});

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [highlightedCountryIndex, setHighlightedCountryIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const countryDropdownRef = useRef<HTMLDivElement>(null);
  const countryListRef = useRef<HTMLDivElement>(null);
  const countrySearchStringRef = useRef("");
  const countrySearchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSizeSelect = (value: string) => {
    setFormData((prev) => ({ ...prev, organizationSize: value }));
    setIsDropdownOpen(false);
  };

  const handleCountrySelect = (value: string) => {
    setFormData((prev) => ({ ...prev, country: value }));
    setIsCountryDropdownOpen(false);
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

  const validateStep4 = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.streetAddress1.trim()) {
      errors.streetAddress1 = "Street address is required";
    }
    if (!formData.city.trim()) {
      errors.city = "City is required";
    }
    if (!formData.state.trim()) {
      errors.state = "State/Province is required";
    }
    if (!formData.zipCode.trim()) {
      errors.zipCode = "ZIP/Postal code is required";
    }
    if (!formData.country.trim()) {
      errors.country = "Country is required";
    }
    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
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
    } else if (currentStep === 3) {
      isValid = validateStep3();
    }

    if (isValid) {
      setStepErrors({});
      const nextStep = Math.min(currentStep + 1, 4);
      setCurrentStep(nextStep);
      setMaxStepReached((prev) => Math.max(prev, nextStep));
    }
  };

  const handleBack = () => {
    setStepErrors({});
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleStepClick = (step: number) => {
    // Allow navigation to any step up to the maximum step reached
    if (step <= maxStepReached) {
      setStepErrors({});
      setCurrentStep(step);
    }
  };

  // Progress Bar Component
  const ProgressBar = () => {
    const steps = [
      { number: 1, label: "Personal" },
      { number: 2, label: "Account" },
      { number: 3, label: "Organization" },
      { number: 4, label: "Address" },
    ];

    return (
      <div className="w-full mb-4">
        <div className="flex items-center justify-between relative">
          {/* Progress line - inset to align with step centers */}
          <div
            className="absolute top-4 h-0.5 bg-slate-700/50 z-0"
            style={{ left: "12.5%", right: "12.5%" }}
          >
            <div
              className="h-full bg-gradient-to-r from-[#B87333] to-[#DA8A67] transition-all duration-500 ease-out"
              style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
            />
          </div>

          {/* Step indicators */}
          {steps.map((step) => {
            const isCompleted = step.number < currentStep;
            const isCurrent = step.number === currentStep;
            const isClickable = step.number <= maxStepReached;

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
                    w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300
                    ${
                      isCompleted
                        ? "bg-gradient-to-r from-[#B87333] to-[#DA8A67] text-white cursor-pointer hover:scale-110"
                        : isCurrent
                        ? "bg-[#B87333] text-white cursor-pointer animate-ring-pulse"
                        : isClickable
                        ? "bg-gradient-to-r from-[#B87333]/70 to-[#DA8A67]/70 text-white cursor-pointer hover:scale-110"
                        : "bg-slate-700 text-slate-400 cursor-not-allowed"
                    }
                  `}
                >
                  {isCompleted ? "✓" : step.number}
                </button>
                <span
                  className={`mt-1.5 text-[10px] text-center ${
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        countryDropdownRef.current &&
        !countryDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCountryDropdownOpen(false);
        setHighlightedCountryIndex(-1);
        countrySearchStringRef.current = "";
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isCountryDropdownOpen) return;

      const key = event.key;

      if (key === "ArrowDown") {
        event.preventDefault();
        setHighlightedCountryIndex((prev) =>
          prev < COUNTRIES.length - 1 ? prev + 1 : 0
        );
      } else if (key === "ArrowUp") {
        event.preventDefault();
        setHighlightedCountryIndex((prev) =>
          prev > 0 ? prev - 1 : COUNTRIES.length - 1
        );
      } else if (key === "Enter" && highlightedCountryIndex >= 0) {
        event.preventDefault();
        handleCountrySelect(COUNTRIES[highlightedCountryIndex].value);
        setHighlightedCountryIndex(-1);
        countrySearchStringRef.current = "";
      } else if (key === "Escape") {
        setIsCountryDropdownOpen(false);
        setHighlightedCountryIndex(-1);
        countrySearchStringRef.current = "";
      } else if (key.length === 1 && /[a-zA-Z]/.test(key)) {
        // Debounced search: accumulate typed letters
        const newSearchString = countrySearchStringRef.current + key.toLowerCase();
        countrySearchStringRef.current = newSearchString;

        // Find first country starting with the accumulated search string
        const index = COUNTRIES.findIndex((c) =>
          c.label.toLowerCase().startsWith(newSearchString)
        );
        if (index !== -1) {
          setHighlightedCountryIndex(index);
        }

        // Clear existing timeout
        if (countrySearchTimeoutRef.current) {
          clearTimeout(countrySearchTimeoutRef.current);
        }

        // Reset search string after 500ms of inactivity
        countrySearchTimeoutRef.current = setTimeout(() => {
          countrySearchStringRef.current = "";
        }, 500);
      }
    };

    if (isCountryDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isCountryDropdownOpen, highlightedCountryIndex]);

  // Scroll highlighted country into view
  useEffect(() => {
    if (highlightedCountryIndex >= 0 && countryListRef.current) {
      const highlightedElement = countryListRef.current.children[
        highlightedCountryIndex
      ] as HTMLElement;
      if (highlightedElement) {
        highlightedElement.scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }
    }
  }, [highlightedCountryIndex]);

  return (
    <div className="h-[100dvh] flex flex-col md:flex-row font-geist w-[100dvw] relative overflow-hidden bg-black">
      {/* Pulse animation for current step ring */}
      <style>{`
        @keyframes ring-pulse {
          0%, 100% {
            box-shadow: 0 0 0 3px rgba(184, 115, 51, 0.35);
          }
          50% {
            box-shadow: 0 0 0 6px rgba(184, 115, 51, 0.15);
          }
        }
        .animate-ring-pulse {
          animation: ring-pulse 2s ease-in-out infinite;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(51, 65, 85, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #B87333, #DA8A67);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #DA8A67, #B87333);
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #B87333 rgba(51, 65, 85, 0.3);
        }
      `}</style>
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
                if (currentStep === 4) {
                  if (validateStep4()) {
                    // Get country label from code
                    const countryLabel = COUNTRIES.find(
                      (c) => c.value === formData.country
                    )?.label || formData.country;

                    // Combine address fields into single address string (including phone)
                    const addressParts = [
                      formData.streetAddress1,
                      formData.streetAddress2,
                      formData.city,
                      formData.state,
                      formData.zipCode,
                      countryLabel,
                      formData.phone ? `Phone: ${formData.phone}` : null,
                    ].filter(Boolean);
                    const combinedAddress = addressParts.join(", ");

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
                      {
                        name: "address",
                        value: combinedAddress,
                      },
                      {
                        name: "country",
                        value: formData.country,
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
                </div>
              )}

              {/* Step 4: Organization Address */}
              {currentStep === 4 && (
                <div className="space-y-2">
                  {/* Street Address Lines */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-medium text-slate-400">
                        Street Address
                      </label>
                      <div
                        className={`rounded-xl border bg-slate-900/60 backdrop-blur-sm transition-colors focus-within:border-[#B87333]/70 focus-within:bg-[#B87333]/5 ${
                          stepErrors.streetAddress1
                            ? "border-red-500/50"
                            : "border-[#B87333]/30"
                        }`}
                      >
                        <input
                          type="text"
                          placeholder="House/Building, Street"
                          value={formData.streetAddress1}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              streetAddress1: e.target.value,
                            }))
                          }
                          className="w-full bg-transparent text-sm px-3 py-2 rounded-xl focus:outline-none text-white placeholder:text-slate-500"
                          required
                        />
                      </div>
                      {stepErrors.streetAddress1 && (
                        <p className="mt-0.5 text-xs text-red-400">
                          {stepErrors.streetAddress1}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-400">
                        Address Line 2 (Optional)
                      </label>
                      <div className="rounded-xl border border-[#B87333]/30 bg-slate-900/60 backdrop-blur-sm transition-colors focus-within:border-[#B87333]/70 focus-within:bg-[#B87333]/5">
                        <input
                          type="text"
                          placeholder="Apt, Suite, Unit"
                          value={formData.streetAddress2}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              streetAddress2: e.target.value,
                            }))
                          }
                          className="w-full bg-transparent text-sm px-3 py-2 rounded-xl focus:outline-none text-white placeholder:text-slate-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* City and State */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-medium text-slate-400">
                        City
                      </label>
                      <div
                        className={`rounded-xl border bg-slate-900/60 backdrop-blur-sm transition-colors focus-within:border-[#B87333]/70 focus-within:bg-[#B87333]/5 ${
                          stepErrors.city
                            ? "border-red-500/50"
                            : "border-[#B87333]/30"
                        }`}
                      >
                        <input
                          type="text"
                          placeholder="City"
                          value={formData.city}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              city: e.target.value,
                            }))
                          }
                          className="w-full bg-transparent text-sm px-3 py-2 rounded-xl focus:outline-none text-white placeholder:text-slate-500"
                          required
                        />
                      </div>
                      {stepErrors.city && (
                        <p className="mt-0.5 text-xs text-red-400">
                          {stepErrors.city}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-400">
                        State / Province
                      </label>
                      <div
                        className={`rounded-xl border bg-slate-900/60 backdrop-blur-sm transition-colors focus-within:border-[#B87333]/70 focus-within:bg-[#B87333]/5 ${
                          stepErrors.state
                            ? "border-red-500/50"
                            : "border-[#B87333]/30"
                        }`}
                      >
                        <input
                          type="text"
                          placeholder="State/Province"
                          value={formData.state}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              state: e.target.value,
                            }))
                          }
                          className="w-full bg-transparent text-sm px-3 py-2 rounded-xl focus:outline-none text-white placeholder:text-slate-500"
                          required
                        />
                      </div>
                      {stepErrors.state && (
                        <p className="mt-0.5 text-xs text-red-400">
                          {stepErrors.state}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* ZIP, Country, and Phone */}
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-xs font-medium text-slate-400">
                        ZIP / Postal
                      </label>
                      <div
                        className={`rounded-xl border bg-slate-900/60 backdrop-blur-sm transition-colors focus-within:border-[#B87333]/70 focus-within:bg-[#B87333]/5 ${
                          stepErrors.zipCode
                            ? "border-red-500/50"
                            : "border-[#B87333]/30"
                        }`}
                      >
                        <input
                          type="text"
                          placeholder="ZIP Code"
                          value={formData.zipCode}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              zipCode: e.target.value,
                            }))
                          }
                          className="w-full bg-transparent text-sm px-3 py-2 rounded-xl focus:outline-none text-white placeholder:text-slate-500"
                          required
                        />
                      </div>
                      {stepErrors.zipCode && (
                        <p className="mt-0.5 text-xs text-red-400">
                          {stepErrors.zipCode}
                        </p>
                      )}
                    </div>
                    <div className="relative" ref={countryDropdownRef}>
                      <label className="text-xs font-medium text-slate-400">
                        Country
                      </label>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => {
                            const newState = !isCountryDropdownOpen;
                            setIsCountryDropdownOpen(newState);
                            if (newState) {
                              // Set highlighted to current selection or -1
                              const currentIndex = COUNTRIES.findIndex(
                                (c) => c.value === formData.country
                              );
                              setHighlightedCountryIndex(currentIndex);
                            }
                          }}
                          className={`w-full rounded-xl border bg-slate-900/60 backdrop-blur-sm transition-colors focus:border-[#B87333]/70 focus:bg-[#B87333]/5 text-left ${
                            stepErrors.country
                              ? "border-red-500/50"
                              : "border-[#B87333]/30"
                          }`}
                        >
                          <div className="flex items-center justify-between px-3 py-2">
                            <span
                              className={`text-sm truncate ${
                                formData.country
                                  ? "text-white"
                                  : "text-slate-500"
                              }`}
                            >
                              {formData.country
                                ? COUNTRIES.find(
                                    (c) => c.value === formData.country
                                  )?.label
                                : "Select"}
                            </span>
                            <ChevronDown
                              className={`w-3 h-3 text-slate-400 transition-transform flex-shrink-0 ${
                                isCountryDropdownOpen ? "rotate-180" : ""
                              }`}
                            />
                          </div>
                        </button>

                        {isCountryDropdownOpen && (
                          <div
                            ref={countryListRef}
                            className="absolute top-full left-0 right-0 mt-1 rounded-xl border border-[#B87333]/30 bg-slate-900/95 backdrop-blur-sm z-[9999] overflow-hidden shadow-2xl max-h-48 overflow-y-auto custom-scrollbar"
                          >
                            {COUNTRIES.map((country, index) => (
                              <button
                                key={country.value}
                                type="button"
                                onClick={() => handleCountrySelect(country.value)}
                                onMouseEnter={() => setHighlightedCountryIndex(index)}
                                className={`w-full text-left px-3 py-2 text-sm text-white transition-colors ${
                                  index === highlightedCountryIndex
                                    ? "bg-[#B87333]/30"
                                    : "hover:bg-[#B87333]/20"
                                }`}
                              >
                                {country.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      {stepErrors.country && (
                        <p className="mt-0.5 text-xs text-red-400">
                          {stepErrors.country}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-400">
                        Phone
                      </label>
                      <div
                        className={`rounded-xl border bg-slate-900/60 backdrop-blur-sm transition-colors focus-within:border-[#B87333]/70 focus-within:bg-[#B87333]/5 ${
                          stepErrors.phone
                            ? "border-red-500/50"
                            : "border-[#B87333]/30"
                        }`}
                      >
                        <input
                          type="tel"
                          placeholder="Phone"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              phone: e.target.value,
                            }))
                          }
                          className="w-full bg-transparent text-sm px-3 py-2 rounded-xl focus:outline-none text-white placeholder:text-slate-500"
                          required
                        />
                      </div>
                      {stepErrors.phone && (
                        <p className="mt-0.5 text-xs text-red-400">
                          {stepErrors.phone}
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
                    : currentStep === 4
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
