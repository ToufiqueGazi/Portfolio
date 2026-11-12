"use client";

import Image from "next/image";
import { useEffect, useRef, useSyncExternalStore, type FC } from "react";
import { easing } from "maath";
import { useTheme } from "@/hooks/use-theme";
import { getAssetPath } from "@/helpers/path-helpers";
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

export const CybersecurityNetwork: FC = () => {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);

  // Position and damping state for exact mouse-following and float physics
  const targetPos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0, z: 0 });

  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Track mouse coordinates across the entire hero / window
    const onMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      if (innerWidth === 0 || innerHeight === 0) return;

      // Normalized coordinates: -1 (left/top) to +1 (right/bottom)
      const nx = (e.clientX / innerWidth) * 2 - 1;
      const ny = (e.clientY / innerHeight) * 2 - 1;

      targetPos.current.x = nx;
      targetPos.current.y = ny;
    };

    // When mouse leaves the window, gently glide back to center
    const onMouseLeave = () => {
      targetPos.current.x = 0;
      targetPos.current.y = 0;
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave, { passive: true });

    let lastTime = performance.now();
    let elapsed = 0;

    // Animation frame loop using maath critically-damped oscillator
    // Replicates the exact smoothness, easing, and responsiveness of the 3D scene Rig
    const loop = (now: number) => {
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      elapsed += delta;

      if (!reducedMotion && cardRef.current) {
        // Damping using maath's easing.damp with smoothTime = 0.5 (matching Rig)
        easing.damp(currentPos.current, "x", targetPos.current.x, 0.5, delta);
        easing.damp(currentPos.current, "y", targetPos.current.y, 0.5, delta);

        // Gentle floating wave (replicates Drei's Float component)
        const floatY = Math.sin(elapsed * 1.4) * 6; // subtle 6px bobbing
        const floatRotX = Math.cos(elapsed * 1.1) * 0.6; // subtle pitch oscillation
        const floatSwayY = Math.sin(elapsed * 0.9) * 0.5; // subtle yaw sway

        // Parallax depth translation: counter-movement to mouse
        const tx = currentPos.current.x * -16;
        const ty = currentPos.current.y * -12 + floatY;

        // Subtle three-dimensional rotation:
        // - Slight tilt up and down (pitch): rotX
        // - Slight rotation from side to side (yaw): rotY
        // - Gentle dynamic roll: rotZ
        const rotX = currentPos.current.y * -6.5 + floatRotX;
        const rotY = currentPos.current.x * 8.5 + floatSwayY;
        const rotZ = currentPos.current.x * -1.2;

        cardRef.current.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) rotateZ(${rotZ.toFixed(2)}deg)`;
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [reducedMotion]);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[380px] sm:max-w-[460px] md:max-w-[500px] lg:max-w-[580px] xl:max-w-[660px] select-none"
      style={{ perspective: 1400 }}
    >
      {/* 3D Moving Transparent Artwork Surface with Restrained Glow */}
      <div
        ref={cardRef}
        className="relative w-full aspect-[1024/578] will-change-transform select-none"
        style={{
          transformStyle: "preserve-3d",
          filter: isLight
            ? "drop-shadow(0 14px 28px rgba(0, 130, 240, 0.28)) drop-shadow(0 0 14px rgba(56, 189, 248, 0.22))"
            : "drop-shadow(0 14px 24px rgba(0, 140, 220, 0.20)) drop-shadow(0 0 10px rgba(0, 190, 255, 0.12))",
        }}
      >
        {/* Dark Mode: Transparent Dark Metallic Cybersecurity Network Illustration */}
        <div
          className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
            isLight ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <Image
            src={getAssetPath("/assets/cybersecurity-network-transparent.png")}
            alt="Cybersecurity Network Infrastructure and Threat Telemetry Operations (Dark Mode)"
            width={1024}
            height={578}
            priority
            sizes="(max-width: 768px) 92vw, (max-width: 1200px) 50vw, 660px"
            className="w-full h-auto object-contain pointer-events-none"
          />
        </div>

        {/* Light Mode: Transparent White and Metallic Blue Cybersecurity Network Illustration */}
        <div
          className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
            isLight ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <Image
            src={getAssetPath("/assets/cybersecurity-light-foreground.png")}
            alt="Cybersecurity Network Infrastructure and Threat Telemetry Operations (Light Mode)"
            width={1024}
            height={578}
            priority
            sizes="(max-width: 768px) 92vw, (max-width: 1200px) 50vw, 660px"
            className="w-full h-auto object-contain pointer-events-none"
          />
        </div>

        {/* Animated Data-Flow Overlay across Circuit Lines */}
        <svg
          viewBox="0 0 1024 578"
          className="absolute inset-0 w-full h-full pointer-events-none"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          <defs>
            {/* Restrained Cyan/Blue Glow Filter */}
            <filter id="cyberGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" result="blur1" />
              <feGaussianBlur in="SourceGraphic" stdDeviation="2.8" result="blur2" />
              <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Cyan Shimmer Radial Gradient for Data Packets */}
            <radialGradient id="packetGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="45%" stopColor="#38bdf8" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#00f0ff" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* --- TRACED CIRCUIT WIRES & DATA PACKET ANIMATIONS --- */}

          {/* 1. Endpoints Laptop 1 -> Central Shield Chip */}
          <path
            d="M 210,270 L 260,300 L 325,310"
            fill="none"
            stroke="#00f0ff"
            strokeWidth="1.5"
            strokeOpacity="0.3"
          />
          {!reducedMotion && (
            <>
              <circle r="3.5" fill="#ffffff" filter="url(#cyberGlow)">
                <animateMotion
                  path="M 210,270 L 260,300 L 325,310"
                  dur="2.4s"
                  repeatCount="indefinite"
                  begin="0s"
                />
              </circle>
              <circle r="2.5" fill="#38bdf8" filter="url(#cyberGlow)">
                <animateMotion
                  path="M 210,270 L 260,300 L 325,310"
                  dur="2.4s"
                  repeatCount="indefinite"
                  begin="1.2s"
                />
              </circle>
            </>
          )}

          {/* 2. Endpoints Laptop 3 (Lower Left) -> Central Shield Chip */}
          <path
            d="M 165,330 L 225,360 L 275,360 L 320,348"
            fill="none"
            stroke="#00f0ff"
            strokeWidth="1.5"
            strokeOpacity="0.3"
          />
          {!reducedMotion && (
            <>
              <circle r="3.5" fill="#ffffff" filter="url(#cyberGlow)">
                <animateMotion
                  path="M 165,330 L 225,360 L 275,360 L 320,348"
                  dur="2.6s"
                  repeatCount="indefinite"
                  begin="0.4s"
                />
              </circle>
              <circle r="2.5" fill="#38bdf8" filter="url(#cyberGlow)">
                <animateMotion
                  path="M 165,330 L 225,360 L 275,360 L 320,348"
                  dur="2.6s"
                  repeatCount="indefinite"
                  begin="1.7s"
                />
              </circle>
            </>
          )}

          {/* 3. Endpoints Laptop 4 (Lower Right) -> Central Shield Chip */}
          <path
            d="M 215,348 L 270,348 L 320,342"
            fill="none"
            stroke="#00f0ff"
            strokeWidth="1.5"
            strokeOpacity="0.3"
          />
          {!reducedMotion && (
            <circle r="3" fill="#ffffff" filter="url(#cyberGlow)">
              <animateMotion
                path="M 215,348 L 270,348 L 320,342"
                dur="2.2s"
                repeatCount="indefinite"
                begin="0.8s"
              />
            </circle>
          )}

          {/* 4. Network Router -> Security Operations Riser */}
          <path
            d="M 330,220 L 360,220 L 390,210 L 418,200 L 418,155 L 450,140 L 510,135"
            fill="none"
            stroke="#00f0ff"
            strokeWidth="1.5"
            strokeOpacity="0.35"
          />
          {!reducedMotion && (
            <>
              <circle r="3.5" fill="#ffffff" filter="url(#cyberGlow)">
                <animateMotion
                  path="M 330,220 L 360,220 L 390,210 L 418,200 L 418,155 L 450,140 L 510,135"
                  dur="3.2s"
                  repeatCount="indefinite"
                  begin="0.2s"
                />
              </circle>
              <circle r="2.5" fill="#38bdf8" filter="url(#cyberGlow)">
                <animateMotion
                  path="M 330,220 L 360,220 L 390,210 L 418,200 L 418,155 L 450,140 L 510,135"
                  dur="3.2s"
                  repeatCount="indefinite"
                  begin="1.8s"
                />
              </circle>
            </>
          )}

          {/* 5. Central Shield Chip -> Security Operations (Main Vertical Telemetry Trunk) */}
          <path
            d="M 372,290 L 372,235 L 395,215 L 418,200 L 418,155 L 470,138 L 540,135"
            fill="none"
            stroke="#00f0ff"
            strokeWidth="2"
            strokeOpacity="0.4"
          />
          {!reducedMotion && (
            <>
              <circle r="4" fill="#ffffff" filter="url(#cyberGlow)">
                <animateMotion
                  path="M 372,290 L 372,235 L 395,215 L 418,200 L 418,155 L 470,138 L 540,135"
                  dur="3.0s"
                  repeatCount="indefinite"
                  begin="0.6s"
                />
              </circle>
              <circle r="3" fill="#38bdf8" filter="url(#cyberGlow)">
                <animateMotion
                  path="M 372,290 L 372,235 L 395,215 L 418,200 L 418,155 L 470,138 L 540,135"
                  dur="3.0s"
                  repeatCount="indefinite"
                  begin="2.1s"
                />
              </circle>
            </>
          )}

          {/* 6. Central Shield Chip -> Servers */}
          <path
            d="M 425,342 L 468,342 L 468,368 L 495,368"
            fill="none"
            stroke="#00f0ff"
            strokeWidth="1.8"
            strokeOpacity="0.35"
          />
          {!reducedMotion && (
            <>
              <circle r="3.5" fill="#ffffff" filter="url(#cyberGlow)">
                <animateMotion
                  path="M 425,342 L 468,342 L 468,368 L 495,368"
                  dur="2.4s"
                  repeatCount="indefinite"
                  begin="0.3s"
                />
              </circle>
              <circle r="2.5" fill="#38bdf8" filter="url(#cyberGlow)">
                <animateMotion
                  path="M 425,342 L 468,342 L 468,368 L 495,368"
                  dur="2.4s"
                  repeatCount="indefinite"
                  begin="1.5s"
                />
              </circle>
            </>
          )}

          {/* 7. Servers -> Sub-endpoints Laptops */}
          <path
            d="M 480,410 L 440,430 L 415,442"
            fill="none"
            stroke="#00f0ff"
            strokeWidth="1.5"
            strokeOpacity="0.3"
          />
          {!reducedMotion && (
            <circle r="3" fill="#ffffff" filter="url(#cyberGlow)">
              <animateMotion
                path="M 480,410 L 440,430 L 415,442"
                dur="2.0s"
                repeatCount="indefinite"
                begin="0.9s"
              />
            </circle>
          )}

          {/* 8. Security Operations -> Firewall (Overhead Suspension Conduit) */}
          <path
            d="M 622,215 L 622,260 C 622,300 645,340 680,358 L 715,372"
            fill="none"
            stroke="#00f0ff"
            strokeWidth="2"
            strokeOpacity="0.45"
          />
          {!reducedMotion && (
            <>
              <circle r="4" fill="#ffffff" filter="url(#cyberGlow)">
                <animateMotion
                  path="M 622,215 L 622,260 C 622,300 645,340 680,358 L 715,372"
                  dur="3.2s"
                  repeatCount="indefinite"
                  begin="0.1s"
                />
              </circle>
              <circle r="3" fill="#38bdf8" filter="url(#cyberGlow)">
                <animateMotion
                  path="M 622,215 L 622,260 C 622,300 645,340 680,358 L 715,372"
                  dur="3.2s"
                  repeatCount="indefinite"
                  begin="1.7s"
                />
              </circle>
            </>
          )}

          {/* 9. Platform Base -> Firewall (Lower Trench Ground Line 1 - Top) */}
          <path
            d="M 535,442 L 585,466 L 635,490 L 690,482 L 730,445"
            fill="none"
            stroke="#00f0ff"
            strokeWidth="1.8"
            strokeOpacity="0.4"
          />
          {!reducedMotion && (
            <>
              <circle r="3.5" fill="#ffffff" filter="url(#cyberGlow)">
                <animateMotion
                  path="M 535,442 L 585,466 L 635,490 L 690,482 L 730,445"
                  dur="2.8s"
                  repeatCount="indefinite"
                  begin="0.5s"
                />
              </circle>
              <circle r="2.5" fill="#38bdf8" filter="url(#cyberGlow)">
                <animateMotion
                  path="M 535,442 L 585,466 L 635,490 L 690,482 L 730,445"
                  dur="2.8s"
                  repeatCount="indefinite"
                  begin="1.9s"
                />
              </circle>
            </>
          )}

          {/* 10. Platform Base -> Firewall (Lower Trench Ground Line 2 - Middle) */}
          <path
            d="M 550,456 L 600,480 L 650,504 L 705,496 L 745,458"
            fill="none"
            stroke="#00f0ff"
            strokeWidth="1.8"
            strokeOpacity="0.4"
          />
          {!reducedMotion && (
            <>
              <circle r="3.5" fill="#ffffff" filter="url(#cyberGlow)">
                <animateMotion
                  path="M 550,456 L 600,480 L 650,504 L 705,496 L 745,458"
                  dur="2.7s"
                  repeatCount="indefinite"
                  begin="1.0s"
                />
              </circle>
              <circle r="2.5" fill="#38bdf8" filter="url(#cyberGlow)">
                <animateMotion
                  path="M 550,456 L 600,480 L 650,504 L 705,496 L 745,458"
                  dur="2.7s"
                  repeatCount="indefinite"
                  begin="2.2s"
                />
              </circle>
            </>
          )}

          {/* 11. Platform Base -> Firewall (Lower Trench Ground Line 3 - Bottom) */}
          <path
            d="M 565,470 L 615,494 L 665,518 L 720,510 L 760,472"
            fill="none"
            stroke="#00f0ff"
            strokeWidth="1.8"
            strokeOpacity="0.4"
          />
          {!reducedMotion && (
            <circle r="3.5" fill="#ffffff" filter="url(#cyberGlow)">
              <animateMotion
                path="M 565,470 L 615,494 L 665,518 L 720,510 L 760,472"
                dur="2.9s"
                repeatCount="indefinite"
                begin="1.4s"
              />
            </circle>
          )}

          {/* 12. Firewall Foundation -> Up to the Glowing Firewall Shield */}
          <path
            d="M 730,445 L 755,420 L 755,360 L 780,310"
            fill="none"
            stroke="#00f0ff"
            strokeWidth="1.5"
            strokeOpacity="0.35"
          />
          {!reducedMotion && (
            <circle r="3.5" fill="#ffffff" filter="url(#cyberGlow)">
              <animateMotion
                path="M 730,445 L 755,420 L 755,360 L 780,310"
                dur="2.5s"
                repeatCount="indefinite"
                begin="0.7s"
              />
            </circle>
          )}
        </svg>
      </div>
    </div>
  );
};
