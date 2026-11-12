"use client";

import { type FC } from "react";
import { motion } from "motion/react";
import { Marquee } from "@/components/portfolio/marquee";
import { MARQUEE, SKILL_CHIP_CLASS } from "@/constants/about-constants";
import { SKILL_CHIPS } from "@/constants/skills-constants";
import { useOptionalContent } from "@/lib/content-context";

const Chip: FC<{ skill: string }> = ({ skill }) => (
  <span className={SKILL_CHIP_CLASS}>{skill}</span>
);

export const SkillsMarquee: FC = () => {
  const content = useOptionalContent();
  const skills =
    content?.about.skills !== undefined
      ? content.about.skills
      : SKILL_CHIPS;
  const eyebrow =
    content?.about.skillsEyebrow || "Technical Proficiencies & Research Tools";

  return (
    <div className="mt-8">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mb-6 flex items-center justify-between"
      >
        <p className="text-eyebrow">{eyebrow}</p>
        <div className="ml-6 h-px flex-1 bg-gradient-to-r from-white/15 via-white/5 to-transparent" />
      </motion.div>

      <div className="relative overflow-hidden">
        <Marquee className={MARQUEE.forward} pauseOnHover>
          {skills.map((skill) => (
            <Chip key={skill} skill={skill} />
          ))}
        </Marquee>

        <Marquee reverse className={MARQUEE.reverse} pauseOnHover>
          {[...skills].reverse().map((skill) => (
            <Chip key={`reverse-${skill}`} skill={skill} />
          ))}
        </Marquee>

        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r from-primary to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l from-primary to-transparent" />
      </div>
    </div>
  );
};
