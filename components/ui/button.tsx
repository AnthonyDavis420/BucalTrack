// components/ui/button.tsx
import React from "react";

export function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "danger";
  className?: string;
}) {
  const variants: Record<typeof variant, string> = {
    primary: "bg-[#071689] text-white hover:opacity-90",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-normal transition focus:ring-2 focus:ring-offset-1 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
