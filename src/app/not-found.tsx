"use client";

import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";
import { PulseBeams } from "@/components/ui/pulse-beams";
import { Glitchy404 } from "@/components/ui/glitchy-404";

// Beam configuration (same as dashboard layout)
const beams = [
  {
    path: "M-400 150H1400V1600H-400V-200",
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
    path: "M-400 600H1200V-300H-400V1600",
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
    path: "M300 -300V600H2600V1600H-200",
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
    path: "M1000 -300V700H-300V1600H2600",
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
    path: "M2600 200H800V1600H2600V-200",
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
    path: "M2600 700H600V-300H2600V1600",
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
    path: "M400 1600V600H2600V-200H-200",
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
    path: "M1100 1600V400H-300V-200H2600",
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
    path: "M-400 300H1000V1600H-400V-200",
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
    path: "M700 -300V500H2600V1600H-200",
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
    path: "M-400 100H800V900H2600V-200H-400V1600",
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
    path: "M2600 250H1200V750H-300V-200H2600V1600",
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
];

const gradientColors = {
  start: "#B87333",
  middle: "#DA8A67",
  end: "#B87333",
};

export default function NotFound() {
  return (
    <div className="min-h-screen overflow-hidden flex flex-col items-center justify-center relative bg-black">
      {/* Pulse beams background */}
      <PulseBeams
        beams={beams}
        gradientColors={gradientColors}
        className="absolute inset-0 w-full h-full opacity-60 z-0 pulse-beams-svg"
        width={2400}
        height={1400}
        baseColor="#334155"
        accentColor="#475569"
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4">
        {/* Glitchy 404 */}
        <div className="mb-2">
          <Glitchy404 width={600} height={174} color="#B87333" />
        </div>

        {/* Message */}
        <h1 className="text-2xl md:text-3xl font-semibold text-white mb-4">
          Page Not Found
        </h1>
        <p className="text-slate-400 max-w-md mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm rounded-md bg-gradient-to-br from-[#B87333] to-[#DA8A67] text-white font-medium hover:from-[#CD7F32] hover:to-[#B87333] transition-all"
          >
            <Home className="w-3.5 h-3.5" />
            Go to Dashboard
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm rounded-md border border-[#B87333]/30 bg-slate-900/60 backdrop-blur-sm text-white font-medium hover:bg-[#B87333]/10 transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
