"use client";

import { useRef, type FC } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { AboutBio } from "@/components/about/about-bio";
import { AboutStatCard } from "@/components/about/about-stat-card";
import { SkillsMarquee } from "@/components/about/skills-marquee";
import { EducationSection } from "@/components/about/education-section";
import { SectionHeader } from "@/components/ui/section-header";
import { STATS } from "@/constants/hero-constants";
import { useOptionalContent } from "@/lib/content-context";

export const About: FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const content = useOptionalContent();

  const eyebrow = content?.about.eyebrow || "Faculty Overview";
  const titleText = content?.about.title || "Academic Pedigree, Research & Core Vision.";
  const stats =
    content?.about.stats && content.about.stats.length > 0
      ? content.about.stats
      : STATS;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const auroraY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const auroraOpacity = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [0.2, 0.6, 0.2]
  );

  return (
    <section
      ref={sectionRef}
      id="about"
      className="c-space section-spacing relative overflow-hidden"
    >
      <motion.div
        aria-hidden
        style={{ y: auroraY, opacity: auroraOpacity }}
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute left-1/4 top-1/3 h-72 w-72 rounded-full bg-royal/30 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-coral/20 blur-[140px]" />
      </motion.div>

      <SectionHeader
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
      />

      <div className="mt-12 grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        <AboutBio />
        <div className="grid grid-cols-2 gap-4 lg:col-span-5">
          {stats.map((stat, index) => (
            <AboutStatCard key={`${stat.label}-${index}`} {...stat} index={index} />
          ))}
        </div>
      </div>

      <EducationSection />

      <div className="mt-16">
        <p className="text-eyebrow text-center mb-6">
          {content?.about.skillsTitle || "Research Disciplines & Computing Tools"}
        </p>
        <SkillsMarquee />
      </div>
    </section>
  );
};
