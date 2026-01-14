import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The custom UI components handle their own layout
  return <>{children}</>;
}
