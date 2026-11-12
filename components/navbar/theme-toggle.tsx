"use client";

import { type FC } from "react";
import { useTheme } from "@/hooks/use-theme";
import { useActiveSection } from "@/hooks/use-active-section";

export const ThemeToggle: FC<{ className?: string }> = ({ className = "" }) => {
  const { theme, toggleTheme } = useTheme();
  const activeSection = useActiveSection();

  // Show this text-based toggle only while the Home section is active
  const isHome = activeSection === "#home" || !activeSection;

  if (!isHome) {
    return null;
  }

  const isDark = theme === "dark";
  // The label must always represent the opposite theme, not the current one:
  // When in Light mode -> Display BLACK (clicking switches to dark)
  // When in Dark mode  -> Display WHITE (clicking switches to light)
  const buttonLabel = isDark ? "WHITE" : "BLACK";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`group relative inline-flex items-center justify-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.25em] transition-all duration-300 backdrop-blur-md cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aqua/50 ${
        isDark
          ? "border border-white/25 bg-white/[0.08] text-white shadow-[0_0_15px_rgba(255,255,255,0.35)] hover:bg-white/[0.14] hover:shadow-[0_0_22px_rgba(255,255,255,0.6)]"
          : "border border-black/15 bg-white/70 text-black shadow-sm hover:bg-white/90 hover:border-black/30"
      } ${className}`}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      <span
        className={`transition-all duration-300 ${
          isDark
            ? "drop-shadow-[0_0_8px_rgba(255,255,255,0.85)] text-white"
            : "text-black"
        }`}
      >
        {buttonLabel}
      </span>
    </button>
  );
};
