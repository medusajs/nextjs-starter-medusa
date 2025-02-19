// src/components/ui/card.tsx
import React from "react";

// Card Component
export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`bg-white shadow-lg rounded-lg overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
}

// CardContent Component
export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}
