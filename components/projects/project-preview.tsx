"use client";

import { type FC, type MouseEvent } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { TILT_RANGE, TILT_SPRING } from "@/constants/projects-constants";
import { formatCounter, padIndex } from "@/helpers/format-helpers";
import { type ProjectPreviewProps } from "@/types/project-types";
import { useTheme } from "@/hooks/use-theme";
import { Terminal, Shield, Cpu, Activity, ExternalLink } from "lucide-react";

// Individual, soft pastel background colors for the 4 project cards in Light Mode
const LIGHT_CARD_STYLES = [
  {
    bg: "bg-[#eaf4fc]", // Soft icy pastel cyan-blue (Cyber Threat Telemetry)
    border: "border-sky-200/70",
    shadow: "shadow-sky-900/[0.06]",
  },
  {
    bg: "bg-[#f3edf9]", // Soft muted lavender-purple (SportsVision AI)
    border: "border-purple-200/70",
    shadow: "shadow-purple-900/[0.06]",
  },
  {
    bg: "bg-[#eaf7f2]", // Soft light sage/mint green (IoT-MeshGuard)
    border: "border-emerald-200/70",
    shadow: "shadow-emerald-900/[0.06]",
  },
  {
    bg: "bg-[#fbf1ea]", // Soft warm peach/amber pastel (Transfer Learning)
    border: "border-amber-200/70",
    shadow: "shadow-amber-900/[0.06]",
  },
];

const BADGE =
  "rounded-full border border-white/15 bg-black/40 px-3 py-1 text-[10px] uppercase tracking-[0.3em] backdrop-blur-md";

export const ProjectPreview: FC<ProjectPreviewProps> = ({
  project,
  index,
  total,
  showPreview,
}) => {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const lightStyle = LIGHT_CARD_STYLES[index % LIGHT_CARD_STYLES.length];

  const pointerX = useMotionValue(0.5);
  const pointerY = useMotionValue(0.5);
  const rotateX = useSpring(
    useTransform(pointerY, [0, 1], TILT_RANGE.x),
    TILT_SPRING
  );
  const rotateY = useSpring(
    useTransform(pointerX, [0, 1], TILT_RANGE.y),
    TILT_SPRING
  );

  const handleMove = (event: MouseEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - bounds.left) / bounds.width);
    pointerY.set((event.clientY - bounds.top) / bounds.height);
  };

  const handleLeave = () => {
    pointerX.set(0.5);
    pointerY.set(0.5);
  };

  return (
    <div className="order-1 lg:order-2 lg:col-span-7">
      <div style={{ perspective: "1400px" }} className="relative">
        <motion.div
          onMouseMove={handleMove}
          onMouseLeave={handleLeave}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className={`relative aspect-[4/3] overflow-hidden rounded-3xl border shadow-2xl transition-colors duration-500 md:aspect-[16/10] ${
            isLight
              ? `${lightStyle.bg} ${lightStyle.border} ${lightStyle.shadow}`
              : "border-white/10 bg-midnight shadow-black/50"
          }`}
        >
          <div
            className={`absolute inset-0 bg-gradient-to-br ${project.accent} ${
              isLight ? "opacity-20" : "opacity-40"
            }`}
          />

          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span
              className={`text-[10rem] font-black leading-none tracking-tighter md:text-[14rem] ${
                isLight ? "text-black/[0.04]" : "text-white/10"
              }`}
            >
              {padIndex(index + 1)}
            </span>
          </div>

          {project.image ? (
            <Image
              src={project.image}
              alt={`${project.title} preview`}
              fill
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="pointer-events-none select-none object-cover object-top"
            />
          ) : (
            <div className="absolute inset-0 p-8 flex flex-col justify-center items-center text-center">
              <div
                className={`h-16 w-16 rounded-2xl border flex items-center justify-center mb-4 shadow-lg ${
                  isLight
                    ? "bg-black/[0.03] border-black/10 text-aqua shadow-black/5"
                    : "bg-white/5 border-white/15 text-aqua shadow-aqua/10"
                }`}
              >
                {index === 0 && <Shield className="h-8 w-8 text-coral" />}
                {index === 1 && <Activity className="h-8 w-8 text-aqua" />}
                {index === 2 && <Cpu className="h-8 w-8 text-mint" />}
                {index >= 3 && <Terminal className="h-8 w-8 text-lavender" />}
              </div>
              <p
                className={`text-xs uppercase tracking-[0.25em] font-semibold mb-1 ${
                  isLight ? "text-neutral-500" : "text-neutral-400"
                }`}
              >
                {project.category}
              </p>
              <h4
                className={`text-xl md:text-2xl font-bold max-w-md ${
                  isLight ? "text-slate-900" : "text-white"
                }`}
              >
                {project.title}
              </h4>
              <p
                className={`mt-2 text-xs md:text-sm max-w-sm line-clamp-2 ${
                  isLight ? "text-neutral-600" : "text-neutral-400"
                }`}
              >
                {project.description}
              </p>
            </div>
          )}

          {/* Theme-Adaptive Card Overlays: In light mode, add subtle white hue concentrated towards the bottom-right corner */}
          {isLight ? (
            <>
              {/* Subtle white hue/gradient concentrated towards the bottom-right corner */}
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_88%_88%,rgba(255,255,255,0.85)_0%,rgba(255,255,255,0.45)_35%,transparent_70%)]" />
              {/* Soft ambient light sheen across the top-left */}
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(255,255,255,0.35)_0%,transparent_50%)]" />
            </>
          ) : (
            <>
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.06),transparent_45%)]" />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(0,0,0,0.35),transparent_45%)]" />
            </>
          )}

          <div
            style={{ transform: "translateZ(70px)" }}
            className="pointer-events-none absolute left-5 right-5 top-5 flex items-center justify-between"
          >
            <span
              className={`${BADGE} inline-flex items-center gap-2 ${
                isLight
                  ? "border-black/10 bg-white/80 text-slate-800 shadow-sm"
                  : "border-white/25 bg-black/50 text-white"
              }`}
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inset-0 animate-ping rounded-full bg-mint opacity-75" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-mint" />
              </span>
              Academic Prototype
            </span>
            <span
              className={`${BADGE} ${
                isLight
                  ? "border-black/10 bg-white/80 text-slate-700 shadow-sm"
                  : "text-white/70"
              }`}
            >
              {formatCounter(index, total)}
            </span>
          </div>

          <a
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            style={{ transform: "translateZ(80px)" }}
            className={`absolute bottom-5 right-5 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs backdrop-blur-md transition-colors ${
              isLight
                ? "border-black/15 bg-white/90 text-slate-900 shadow-sm hover:border-black/30 hover:bg-white"
                : "border-white/25 bg-black/50 text-white hover:border-white/40"
            }`}
          >
            <span>Research Profile</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>

          <div
            style={{ transform: "translateZ(50px)" }}
            className={`${BADGE} pointer-events-none absolute bottom-5 left-5 ${
              isLight
                ? "border-black/10 bg-white/85 text-slate-800 shadow-sm"
                : "text-white/85"
            }`}
          >
            {project.title}
          </div>

          <div
            className={`pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ${
              isLight ? "ring-black/5" : "ring-white/10"
            }`}
          />
        </motion.div>
      </div>
    </div>
  );
};
