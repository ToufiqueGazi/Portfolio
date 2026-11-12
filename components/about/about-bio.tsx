"use client";

import { useRef, type FC } from "react";
import { motion, useInView } from "motion/react";
import { fadeInUp } from "@/animations/scroll-animations";
import { HERO_LOCATION, HERO_NAME } from "@/constants/hero-constants";
import { useOptionalContent } from "@/lib/content-context";

export const AboutBio: FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const content = useOptionalContent();

  const name = content?.home.name || HERO_NAME;
  const location = content?.home.location || HERO_LOCATION;
  const subtitle = content?.about.subtitle || "Faculty Profile & Academic Mission";
  const actionButtons = content?.about.actionButtons || [
    { label: "Explore Publications", href: "#publications", primary: true },
    { label: "Research Focus", href: "#research", primary: false },
    { label: "Get in Touch", href: "#contact", primary: false },
  ];

  // If Markdown bio is provided, split paragraphs
  const rawBio = content?.about.bio || "";
  const bioParagraphs = rawBio
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0 && !p.startsWith("#"));

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={fadeInUp}
      transition={{ duration: 0.7 }}
      className="glass gradient-border p-8 md:p-10 lg:col-span-7"
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="h-2 w-2 rounded-full bg-mint animate-pulse" />
        <p className="text-xs uppercase tracking-[0.25em] text-neutral-400">
          {subtitle}
        </p>
      </div>
      <h3 className="mb-4 text-2xl font-bold md:text-3xl">
        {name}
      </h3>
      <p className="text-sm font-medium text-aqua mb-3">
        {location}
      </p>

      {bioParagraphs.length > 0 ? (
        bioParagraphs.map((para, idx) => {
          // Highlight bold text markdown: **text**
          const parts = para.split(/(\*\*[^*]+\*\*)/g);
          return (
            <p
              key={idx}
              className={
                idx === 0
                  ? "text-base leading-relaxed text-neutral-300 md:text-lg"
                  : "mt-4 leading-relaxed text-neutral-400 text-sm md:text-base"
              }
            >
              {parts.map((part, pIdx) => {
                if (part.startsWith("**") && part.endsWith("**")) {
                  return (
                    <span key={pIdx} className="font-semibold text-white">
                      {part.slice(2, -2)}
                    </span>
                  );
                }
                return part;
              })}
            </p>
          );
        })
      ) : (
        <>
          <p className="text-base leading-relaxed text-neutral-300 md:text-lg">
            Assistant Professor in the Department of Computer Science & Engineering at{" "}
            <span className="font-semibold text-white">Adamas University, Kolkata</span>.
            My academic work converges at the crossroads of{" "}
            <span className="font-semibold text-white">Cybersecurity & Threat Intelligence</span>,{" "}
            <span className="font-semibold text-white">Cloud/IoT Network Observability</span>, and{" "}
            <span className="font-semibold text-white">Applied Computer Vision</span>.
          </p>
          <p className="mt-4 leading-relaxed text-neutral-400 text-sm md:text-base">
            Currently pursuing a Ph.D. in Computer Science & Engineering at the{" "}
            <span className="text-neutral-200">University of Engineering & Management (UEM)</span>.
            My research focuses on exploit kit analysis, zero-day threat containment via the Cyber Kill Chain,
            and deep multitask transfer learning for heterogeneous data streams. In the classroom, I am dedicated
            to cultivating deep systems intuition and ethical problem-solving among engineering students.
          </p>
        </>
      )}

      <div className="mt-8 flex flex-wrap gap-3">
        {actionButtons.map((btn, idx) => (
          <a
            key={idx}
            href={btn.href}
            className={btn.primary ? "btn-primary" : "btn-ghost"}
          >
            <span>{btn.label}</span>
            {btn.primary && <span aria-hidden>→</span>}
          </a>
        ))}
      </div>
    </motion.div>
  );
};
