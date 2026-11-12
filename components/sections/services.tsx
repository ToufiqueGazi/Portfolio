"use client";

import { useRef, type FC } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ServiceCard } from "@/components/services/service-card";
import { SectionHeader } from "@/components/ui/section-header";
import { SERVICES } from "@/constants/services-constants";
import { padIndex } from "@/helpers/format-helpers";
import { useOptionalContent } from "@/lib/content-context";

export const Research: FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const content = useOptionalContent();

  const services =
    content?.research.domains !== undefined
      ? content.research.domains
      : SERVICES;

  const eyebrow = content?.research.eyebrow
    ? `${content.research.eyebrow.replace(/\s*·\s*\d+\s*Focus Domains/i, "")} · ${padIndex(services.length)} Focus Domains`
    : `Research · ${padIndex(services.length)} Focus Domains`;
  const titleText =
    content?.research.title ||
    "Scholarly Inquiries, Defense Architecture & Applied Intelligence.";
  const hint: readonly [string, string] =
    content?.research.hint && content.research.hint.length >= 2
      ? [content.research.hint[0], content.research.hint[1]]
      : (["Scroll", "Stack"] as const);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const auroraY = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);
  const auroraOpacity = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [0.3, 0.7, 0.3]
  );

  return (
    <section
      ref={sectionRef}
      id="research"
      className="c-space section-spacing relative overflow-visible"
    >
      <motion.div
        aria-hidden
        style={{ y: auroraY, opacity: auroraOpacity }}
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute right-10 top-10 h-80 w-80 rounded-full bg-lavender/20 blur-[140px]" />
        <div className="absolute bottom-10 left-10 h-72 w-72 rounded-full bg-aqua/15 blur-[140px]" />
      </motion.div>

      <SectionHeader
        className="mb-12"
        eyebrow={eyebrow}
        title={
          titleText.includes("&") ? (
            <>
              {titleText.split("&")[0]}&amp;{" "}
              <span className="text-gradient">
                {titleText.split("&").slice(1).join("&").trim()}
              </span>
            </>
          ) : (
            titleText
          )
        }
        hint={hint}
      />

      {services.length === 0 ? (
        <div className="glass p-12 text-center text-neutral-400 rounded-2xl border border-white/10">
          <p>No research domains currently listed.</p>
        </div>
      ) : (
        <div className="relative space-y-6 md:space-y-8">
          {services.map((service, index) => (
            <ServiceCard
              key={service.id}
              service={service}
              index={index}
              total={services.length}
            />
          ))}
        </div>
      )}
    </section>
  );
};
