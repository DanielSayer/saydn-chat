import React from "react";

type Size = "sm" | "md" | "lg";

interface DotsLoaderProps {
  size?: Size;
  className?: string;
  ariaLabel?: string;
}

export function DotsLoader({
  size = "md",
  className = "",
  ariaLabel = "Loading",
}: DotsLoaderProps) {
  const sizeMap: Record<Size, string> = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  };

  const dotSize = sizeMap[size];
  const baseStyle: React.CSSProperties = {
    animationName: "bounce",
    animationIterationCount: "infinite",
    animationTimingFunction: "ease-in-out",
    animationDuration: "700ms",
  };

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={ariaLabel}
      className={`inline-flex items-end gap-2 text-gray-500 dark:text-gray-400 ${className}`}
    >
      <span
        className={`${dotSize} inline-block rounded-full bg-current`}
        style={{ ...baseStyle, animationDelay: "0ms" }}
      />
      <span
        className={`${dotSize} inline-block rounded-full bg-current`}
        style={{ ...baseStyle, animationDelay: "200ms" }}
      />
      <span
        className={`${dotSize} inline-block rounded-full bg-current`}
        style={{ ...baseStyle, animationDelay: "350ms" }}
      />

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}
