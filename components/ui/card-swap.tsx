"use client";

import React, {
  useSyncExternalStore,
  type ReactNode,
  type FC,
} from "react";
import { Sparkles } from "lucide-react";

function subscribeReducedMotion(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

export interface CardSwapProps {
  children?: ReactNode[];
  progress?: number;
  total?: number;
  cardDistance?: number;
  verticalDistance?: number;
  className?: string;
}

interface CardTransformStyle {
  display: "block" | "none";
  transform: string;
  transformOrigin: string;
  opacity: number;
  zIndex: number;
  pointerEvents: "auto" | "none";
}

function getCardStyle(
  index: number,
  progress: number,
  prefersReducedMotion: boolean,
  cardDistance: number,
  verticalDistance: number
): CardTransformStyle {
  const d = index - progress;

  // Fully exited (finished falling away)
  if (d <= -1.0) {
    return {
      display: "none",
      transform: "translate3d(0, 420px, -200px)",
      transformOrigin: "bottom center",
      opacity: 0,
      zIndex: 0,
      pointerEvents: "none",
    };
  }

  // Falling exit transition: d in (-1.0, 0)
  if (d < 0) {
    const u = -d; // 0 (just leaving) to 1.0 (fully fallen)
    const clampedU = Math.min(Math.max(0, u), 1.0);

    if (prefersReducedMotion) {
      return {
        display: "block",
        transform: `translate3d(0, ${-20 * clampedU}px, 0)`,
        transformOrigin: "center center",
        opacity: Math.max(0, 1 - clampedU),
        zIndex: 18,
        pointerEvents: "none",
      };
    }

    const fallY = 460 * Math.pow(clampedU, 1.3);
    const fallX = -12 * Math.sin(clampedU * Math.PI);
    const rotX = 36 * Math.sin(clampedU * Math.PI * 0.85);
    const rotZ = -4.5 * clampedU;
    const scale = 1.0 - 0.07 * clampedU;

    // Smooth opacity fade that cleans up early so text never overlaps
    const opacity =
      clampedU < 0.2
        ? 1.0
        : Math.max(0, 1.0 - Math.pow((clampedU - 0.2) / 0.7, 1.4));

    // When card has detached (clampedU >= 0.35), drop zIndex and translate backward in Z
    // so incoming front card (zIndex 25, opacity 1.0) cleanly covers it
    const isDetached = clampedU >= 0.35;
    const zIndex = isDetached ? 17 : 28;
    const zOffset = isDetached ? -20 - 45 * clampedU : 25 * (1 - clampedU);

    return {
      display: "block",
      transform: `translate3d(${fallX.toFixed(2)}px, ${fallY.toFixed(2)}px, ${zOffset.toFixed(2)}px) rotateX(${rotX.toFixed(2)}deg) rotateZ(${rotZ.toFixed(2)}deg) scale(${scale.toFixed(4)})`,
      transformOrigin: "bottom center",
      opacity,
      zIndex,
      pointerEvents: "none",
    };
  }

  // Active stack or approaching front: d >= 0
  if (d <= 3.5) {
    const s = d;
    const offsetX = s * cardDistance;
    const offsetY = -s * verticalDistance;
    const scale = Math.max(0.72, 1 - s * 0.045);
    const rotZ = s * 1.5;

    // Solid opaque card for the active front card and incoming transition (s <= 1.0)
    // Ensures text from cards behind NEVER shows through
    let opacity = 1.0;
    let zIndex = 20;

    if (s <= 1.0) {
      opacity = 1.0;
      zIndex = s <= 0.65 ? 25 : 22;
    } else if (s <= 3.0) {
      // Inactive stack cards preserve depth layering with subtle opacity
      opacity = Math.max(0.78, 1.0 - (s - 1.0) * 0.11);
      zIndex = Math.round(20 - s * 2);
    } else {
      opacity = Math.max(0, 0.78 * (1.0 - (s - 3.0) / 0.5));
      zIndex = 10;
    }

    const isInteractive = s < 0.35;

    return {
      display: "block",
      transform: `translate3d(${offsetX.toFixed(2)}px, ${offsetY.toFixed(2)}px, ${(-s * 25).toFixed(2)}px) rotateZ(${rotZ.toFixed(2)}deg) scale(${scale.toFixed(4)})`,
      transformOrigin: "center center",
      opacity,
      zIndex,
      pointerEvents: isInteractive ? "auto" : "none",
    };
  }

  // Deep in stack (hidden behind)
  return {
    display: "none",
    transform: `translate3d(${4 * cardDistance}px, ${-4 * verticalDistance}px, -150px) scale(0.82)`,
    transformOrigin: "center center",
    opacity: 0,
    zIndex: 1,
    pointerEvents: "none",
  };
}

export const CardSwap: FC<CardSwapProps> = ({
  children = [],
  progress = 0,
  total: totalProp,
  cardDistance = 28,
  verticalDistance = 18,
  className = "",
}) => {
  const cardList = React.Children.toArray(children);
  const total = totalProp ?? cardList.length;

  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  const activeIndex = Math.min(total - 1, Math.max(0, Math.round(progress)));

  if (total === 0) return null;

  return (
    <div
      className={`relative w-full select-none ${className}`}
      role="region"
      aria-label="Academic Works 3D Card Stack"
    >
      {/* 3D Stack Stage Container */}
      <div
        className="relative mx-auto flex w-full max-w-5xl items-center justify-center py-2 md:py-4"
        style={{
          perspective: 1400,
          perspectiveOrigin: "50% 36%",
          minHeight: "520px",
        }}
      >
        <div
          className="relative w-full max-w-4xl"
          style={{ transformStyle: "preserve-3d", minHeight: "500px" }}
        >
          {cardList.map((item, index) => {
            const style = getCardStyle(
              index,
              progress,
              prefersReducedMotion,
              cardDistance,
              verticalDistance
            );
            if (style.display === "none") return null;

            return (
              <div
                key={`card-item-${index}`}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  transform: style.transform,
                  transformOrigin: style.transformOrigin,
                  opacity: style.opacity,
                  zIndex: style.zIndex,
                  pointerEvents: style.pointerEvents,
                  willChange: "transform, opacity",
                  backgroundColor: "#0c101d",
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                }}
                className="rounded-2xl overflow-hidden shadow-2xl shadow-black/95 cursor-default"
              >
                {item}
              </div>
            );
          })}
        </div>
      </div>

      {/* Stack Status & Passive Progress Indicators */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 pt-5">
        {/* Left: Stack Counter indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-xs font-medium text-neutral-300 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-coral animate-pulse" />
            <span>
              Entry <strong className="text-white">{activeIndex + 1}</strong> of{" "}
              <strong className="text-white">{total}</strong>
            </span>
          </div>
        </div>

        {/* Right: Passive Card Progress Dots */}
        <div
          className="flex items-center gap-1.5 overflow-x-auto max-w-[240px] sm:max-w-none px-2 py-1"
          role="group"
          aria-label="Progress across entries"
        >
          {Array.from({ length: total }).map((_, dotIdx) => (
            <div
              key={`dot-${dotIdx}`}
              aria-hidden="true"
              className={`h-2.5 rounded-full transition-all duration-300 ${
                dotIdx === activeIndex
                  ? "w-8 bg-gradient-to-r from-royal to-coral shadow-md shadow-coral/30"
                  : "w-2.5 bg-white/20"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
