"use client";

import { useRef, type FC } from "react";
import { motion, useInView } from "motion/react";
import { fadeInUp } from "@/animations/scroll-animations";
import { INITIAL_EDUCATION } from "@/lib/academic-data";
import { useOptionalContent } from "@/lib/content-context";

export const EducationSection: FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const content = useOptionalContent();

  const title = content?.about.educationTitle || "Education & Academic Pedigree";
  const degrees =
    content?.about.degrees !== undefined
      ? content.about.degrees
      : INITIAL_EDUCATION;

  return (
    <div ref={ref} className="mt-12">
      <div className="flex items-center gap-3 mb-6">
        <span className="h-2.5 w-2.5 rounded-full bg-lavender" />
        <h4 className="text-xl md:text-2xl font-bold text-white">
          {title}
        </h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {degrees.map((edu, idx) => (
          <motion.div
            key={`${edu.degree}-${idx}`}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={fadeInUp}
            transition={{ duration: 0.6, delay: idx * 0.08 }}
            className="glass gradient-border p-6 relative flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs uppercase tracking-wider font-semibold text-aqua">
                  {edu.period}
                </span>
                <span className="text-xs text-neutral-400">{edu.location}</span>
              </div>
              <h5 className="text-lg font-bold text-white mb-1">{edu.degree}</h5>
              <p className="text-sm font-medium text-neutral-300 mb-3">
                {edu.institution}
              </p>
              <ul className="space-y-1.5 text-xs md:text-sm text-neutral-400">
                {(edu.details || []).map((detail, dIdx) => (
                  <li key={dIdx} className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-coral mt-1.5 flex-shrink-0" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
