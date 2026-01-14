"use client";

import React, { useEffect, useState } from "react";
import { AuthProvider, AuthGuard } from "@/contexts/AuthContext";
import { SidebarProvider, useSidebar } from "@/contexts/SidebarContext";
import { Sidebar } from "@/components/layout";
import { PulseBeams } from "@/components/ui/pulse-beams";
import PermissionsLoader from "@/components/PermissionsLoader";

// Beam configuration (same as login/signup)
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
  {
    path: "M200 -300V500H1200V1600H-200V-300",
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
    path: "M1300 1600V700H500V-300H2600V1600",
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
    path: "M-400 450H1200V550H2600V650H1800V250H-400",
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
    path: "M850 -300V600H1150V1200H550V800H850V-300",
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
    path: "M1200 -300V800H2600V1600H-200",
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
    path: "M1400 1600V500H2600V-200H-200",
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
    path: "M1600 -300V700H1900V1200H1300V900H1600V-300",
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
    path: "M1100 -300V600H2000V1600H-200V-300",
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
    path: "M1500 1600V600H2600V-200H-200",
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
    path: "M1300 -300V700H2600V1600H-200",
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
    path: "M1700 -300V800H2000V1400H1400V1000H1700V-300",
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
    path: "M1200 1600V400H2100V-300H-200V1600",
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
  start: "#B87333",
  middle: "#DA8A67",
  end: "#B87333",
};

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { isExpanded, isMobileOpen, isHovered } = useSidebar();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const showExpanded = isExpanded || isHovered || isMobileOpen;
  const sidebarWidth = showExpanded ? "290px" : "90px";

  return (
    <>
      <PermissionsLoader />
      <div className="flex min-h-screen relative bg-black overflow-hidden dashboard-layout">
        {/* Pulse beams background */}
        <PulseBeams
          beams={beams}
          gradientColors={gradientColors}
          className="absolute inset-0 w-full h-full opacity-60 z-0 dashboard-pulse-beams"
          width={2400}
          height={1400}
          baseColor="#334155"
          accentColor="#475569"
        />

        <Sidebar />
        <main
          className="flex-1 relative z-10 transition-all duration-300 ease-in-out lg:pl-[90px]"
          style={{
            paddingLeft: !isMobile ? (showExpanded ? "290px" : "90px") : "0px",
          }}
        >
          <div className="p-6">{children}</div>
        </main>
      </div>
    </>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <AuthGuard>
        <SidebarProvider>
          <DashboardContent>{children}</DashboardContent>
        </SidebarProvider>
      </AuthGuard>
    </AuthProvider>
  );
}
