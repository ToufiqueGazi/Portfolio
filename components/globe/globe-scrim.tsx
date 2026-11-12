"use client";

import { type FC } from "react";
import { useTheme } from "@/hooks/use-theme";

const PAGE = "3, 4, 18";

export const GlobeScrim: FC = () => {
  const { theme } = useTheme();

  // In light mode, do not render black scrims over the white page
  if (theme === "light") {
    return null;
  }

  return (
    <>
      <div
        className="absolute inset-0"
        style={{ background: `rgba(${PAGE}, 0.14)` }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(145% 115% at 50% 52%, rgba(${PAGE}, 0) 48%, rgba(${PAGE}, 0.28) 80%, rgba(${PAGE}, 0.6) 100%)`,
        }}
      />
      <div
        className="absolute inset-x-0 top-0 h-28"
        style={{
          background: `linear-gradient(to bottom, rgba(${PAGE}, 0.9), rgba(${PAGE}, 0))`,
        }}
      />
    </>
  );
};
