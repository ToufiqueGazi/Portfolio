"use client";

import { useEffect, useRef, useSyncExternalStore, type FC } from "react";

const subscribePointerFine = (callback: () => void) => {
  if (typeof window === "undefined") return () => {};
  const mql = window.matchMedia("(hover: hover) and (pointer: fine)");
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
};

const getPointerSnapshot = () => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
};

const getServerPointerSnapshot = () => false;

export const CustomCursor: FC = () => {
  const isPointerFine = useSyncExternalStore(
    subscribePointerFine,
    getPointerSnapshot,
    getServerPointerSnapshot
  );

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isPointerFine) return;

    document.documentElement.classList.add("has-custom-cursor");

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Dimensions in CSS pixels (30-42px diameter standard)
    const BASE_RADIUS = 17; // 34px diameter
    const HOVER_RADIUS = 21; // 42px diameter
    const TEXT_RADIUS = 11; // 22px diameter

    const BASE_DOT_RADIUS = 3.25; // ~6.5px diameter dark center dot
    const HOVER_DOT_RADIUS = 3.75;
    const TEXT_DOT_RADIUS = 2.5;

    const state = {
      targetX: -200,
      targetY: -200,
      currX: -200,
      currY: -200,
      vx: 0,
      vy: 0,
      w: BASE_RADIUS * 2,
      h: BASE_RADIUS * 2,
      angle: 0,
      currDotRadius: BASE_DOT_RADIUS,
      currAlpha: 0,
      targetAlpha: 0,
      isHovered: false,
      isTextInput: false,
      hasMoved: false,
    };

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas, { passive: true });

    const onMouseMove = (e: MouseEvent) => {
      const clientX = e.clientX;
      const clientY = e.clientY;

      state.targetX = clientX;
      state.targetY = clientY;
      state.targetAlpha = 1;

      if (!state.hasMoved) {
        state.currX = clientX;
        state.currY = clientY;
        state.vx = 0;
        state.vy = 0;
        state.hasMoved = true;
      }

      // Detect interactive elements
      const target = e.target as HTMLElement | null;
      if (target) {
        const isInteractive = Boolean(
          target.closest(
            "a, button, [role='button'], input[type='submit'], [data-cursor-hover], .clickable"
          )
        );
        const isInput = Boolean(
          target.closest(
            "input:not([type='submit']):not([type='button']), textarea, [contenteditable='true']"
          )
        );
        state.isHovered = isInteractive;
        state.isTextInput = isInput;
      }
    };

    const onMouseEnter = (e: MouseEvent) => {
      state.targetX = e.clientX;
      state.targetY = e.clientY;
      state.currX = e.clientX;
      state.currY = e.clientY;
      state.vx = 0;
      state.vy = 0;
      state.targetAlpha = 1;
      state.hasMoved = true;
    };

    const onMouseLeave = () => {
      state.targetAlpha = 0;
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseenter", onMouseEnter);
    document.addEventListener("mouseleave", onMouseLeave);

    let rafId: number;

    const animate = () => {
      if (prefersReducedMotion) {
        state.currX = state.targetX;
        state.currY = state.targetY;
        state.w = BASE_RADIUS * 2;
        state.h = BASE_RADIUS * 2;
        state.angle = 0;
      } else {
        // Elastic spring follower physics matching reference jelly cursor
        const dx = state.targetX - state.currX;
        const dy = state.targetY - state.currY;
        const lagDist = Math.hypot(dx, dy);

        const SPRING_STIFFNESS = 0.17;
        const SPRING_DAMPING = 0.68;

        state.vx = (state.vx + dx * SPRING_STIFFNESS) * SPRING_DAMPING;
        state.vy = (state.vy + dy * SPRING_STIFFNESS) * SPRING_DAMPING;

        state.currX += state.vx;
        state.currY += state.vy;

        // Angle and stretch along direction of motion
        if (lagDist > 1.5) {
          const targetAngle = Math.atan2(dy, dx);
          let diff = targetAngle - state.angle;
          while (diff < -Math.PI) diff += Math.PI * 2;
          while (diff > Math.PI) diff -= Math.PI * 2;
          state.angle += diff * 0.38;
        }

        const stretch = Math.min(lagDist / 190, 0.52);

        const baseRad = state.isHovered
          ? HOVER_RADIUS
          : state.isTextInput
            ? TEXT_RADIUS
            : BASE_RADIUS;
        const baseDiameter = baseRad * 2;

        const targetW = baseDiameter + 78 * stretch;
        const targetH = Math.max(18, baseDiameter * (1 - stretch * 0.44));

        state.w += (targetW - state.w) * 0.34;
        state.h += (targetH - state.h) * 0.34;
      }

      const targetDotRad = state.isHovered
        ? HOVER_DOT_RADIUS
        : state.isTextInput
          ? TEXT_DOT_RADIUS
          : BASE_DOT_RADIUS;
      const maxAlpha = state.isTextInput ? 0.35 : 1.0;
      const targetOpacity = state.targetAlpha * maxAlpha;

      state.currDotRadius += (targetDotRad - state.currDotRadius) * 0.25;
      state.currAlpha += (targetOpacity - state.currAlpha) * 0.22;

      // Clear canvas
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      if (state.currAlpha > 0.01 && state.hasMoved) {
        // Center position biased towards mouse pointer so dot stays naturally embedded
        const centerX = state.currX + (state.targetX - state.currX) * 0.32;
        const centerY = state.currY + (state.targetY - state.currY) * 0.32;

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(state.angle);

        const halfW = state.w / 2;
        const halfH = state.h / 2;
        const cornerRadius = halfH; // Perfect capsule / pill contour

        // Layer 1: Soft neutral white outer glow (strictly monochrome)
        ctx.beginPath();
        ctx.roundRect(-halfW, -halfH, state.w, state.h, cornerRadius);
        ctx.fillStyle = `rgba(255, 255, 255, ${0.88 * state.currAlpha})`;
        ctx.shadowColor = "rgba(255, 255, 255, 0.42)";
        ctx.shadowBlur = state.isHovered ? 12 : 7;
        ctx.fill();

        // Layer 2: Solid soft white capsule body
        ctx.beginPath();
        ctx.roundRect(-halfW + 0.5, -halfH + 0.5, state.w - 1, state.h - 1, cornerRadius);
        ctx.fillStyle = `rgba(252, 252, 255, ${0.96 * state.currAlpha})`;
        ctx.shadowBlur = 0;
        ctx.fill();

        ctx.restore();

        // Layer 3: Dark charcoal center dot (accurately tracking mouse position)
        ctx.save();
        ctx.beginPath();
        ctx.arc(state.targetX, state.targetY, state.currDotRadius, 0, Math.PI * 2);
        ctx.fillStyle = state.isTextInput
          ? `rgba(20, 24, 28, ${0.65 * state.currAlpha})`
          : `rgba(15, 18, 22, ${state.currAlpha})`;
        ctx.shadowBlur = 0;
        ctx.fill();
        ctx.restore();
      }

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseenter", onMouseEnter);
      document.removeEventListener("mouseleave", onMouseLeave);
      cancelAnimationFrame(rafId);
    };
  }, [isPointerFine]);

  if (!isPointerFine) return null;

  return (
    <canvas
      id="custom-cursor-canvas"
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[99999]"
      style={{
        display: "block",
      }}
    />
  );
};
