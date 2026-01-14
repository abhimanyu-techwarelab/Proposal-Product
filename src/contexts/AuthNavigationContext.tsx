"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";
import { useRouter, usePathname } from "next/navigation";

type NavigationDirection = "left" | "right" | null;
type AuthPage = "login" | "signup";

interface AuthNavigationContextType {
  direction: NavigationDirection;
  isAnimating: boolean;
  currentPage: AuthPage;
  navigateTo: (page: AuthPage) => void;
}

const AuthNavigationContext = createContext<
  AuthNavigationContextType | undefined
>(undefined);

export function AuthNavigationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [direction, setDirection] = useState<NavigationDirection>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentPage, setCurrentPage] = useState<AuthPage>(() =>
    pathname === "/register" || pathname === "/signup" ? "signup" : "login"
  );
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const page: AuthPage =
      pathname === "/register" || pathname === "/signup" ? "signup" : "login";
    if (!isAnimating) {
      setCurrentPage(page);
    }
  }, [pathname, isAnimating]);

  const navigateTo = useCallback(
    (targetPage: AuthPage) => {
      if (isAnimating || targetPage === currentPage) return;

      const newDirection: NavigationDirection =
        targetPage === "signup" ? "left" : "right";

      setDirection(newDirection);
      setIsAnimating(true);

      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }

      const targetPath = targetPage === "signup" ? "/register" : "/login";
      router.push(targetPath);

      animationTimeoutRef.current = setTimeout(() => {
        setCurrentPage(targetPage);
        setIsAnimating(false);
        setDirection(null);
      }, 600);
    },
    [isAnimating, currentPage, router]
  );

  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, []);

  return (
    <AuthNavigationContext.Provider
      value={{ direction, isAnimating, currentPage, navigateTo }}
    >
      {children}
    </AuthNavigationContext.Provider>
  );
}

export function useAuthNavigation() {
  const context = useContext(AuthNavigationContext);
  if (context === undefined) {
    throw new Error(
      "useAuthNavigation must be used within an AuthNavigationProvider"
    );
  }
  return context;
}
