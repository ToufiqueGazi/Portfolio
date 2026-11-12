"use client";

import { useRef, type FC } from "react";
import { motion, useInView } from "motion/react";
import { SectionHeader } from "@/components/ui/section-header";
import { ExternalLink, FileText } from "lucide-react";
import { type NotesContent } from "@/lib/content-service";
import { useOptionalContent } from "@/lib/content-context";

export interface NotesProps {
  data?: NotesContent;
}

export const Notes: FC<NotesProps> = ({ data }) => {
  const contextContent = useOptionalContent();
  const notesData = data || contextContent?.notes;
  const cards = notesData?.cards || [];

  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });

  const cardAccents = [
    { border: "hover:border-aqua/40", glow: "from-aqua/20 to-royal/10", tag: "bg-aqua/10 text-aqua" },
    { border: "hover:border-lavender/40", glow: "from-lavender/20 to-royal/10", tag: "bg-lavender/10 text-lavender" },
    { border: "hover:border-coral/40", glow: "from-coral/20 to-royal/10", tag: "bg-coral/10 text-coral" },
    { border: "hover:border-mint/40", glow: "from-mint/20 to-royal/10", tag: "bg-mint/10 text-mint" },
  ];

  const eyebrow = notesData?.eyebrow || "Courseware & Resources";
  const titleText = notesData?.title || "Lecture Notes, Documents & Academic Archives.";
  const description =
    notesData?.description ||
    "Curated courseware, syllabus outlines, laboratory manuals, and research repository archives published directly for students, researchers, and academic collaborators.";

  return (
    <section
      ref={sectionRef}
      id="notes"
      className="c-space section-spacing relative overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/3 top-10 h-72 w-72 rounded-full bg-royal/15 blur-[140px]" />
        <div className="absolute bottom-10 right-1/4 h-80 w-80 rounded-full bg-aqua/10 blur-[140px]" />
      </div>

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
        hint={["Scroll", "Open"]}
      />

      <p className="mt-4 text-sm md:text-base text-neutral-400 max-w-2xl">
        {description}
      </p>

      {/* Horizontally scrollable rectangular cards */}
      <div className="mt-10 -mx-4 px-4 sm:-mx-6 sm:px-6 md:mx-0 md:px-0">
        <div className="flex gap-5 md:gap-6 overflow-x-auto pb-6 pt-2 scrollbar-thin snap-x snap-mandatory">
          {cards.length === 0 ? (
            <div className="glass gradient-border p-8 rounded-2xl w-full text-center text-neutral-400">
              No notes or resources currently published.
            </div>
          ) : (
            cards.map((card, idx) => {
              const accent = cardAccents[idx % cardAccents.length];
              return (
                <motion.a
                  key={card.id || idx}
                  href={card.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  className={`snap-start min-w-[280px] sm:min-w-[340px] md:min-w-[380px] max-w-[420px] flex-shrink-0 flex flex-col justify-between glass gradient-border p-6 md:p-8 rounded-2xl group transition-all duration-300 hover:-translate-y-1.5 ${accent.border}`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-5">
                      <div className="h-11 w-11 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-white/[0.1] transition-colors">
                        <FileText className="h-5 w-5 text-aqua group-hover:scale-110 transition-transform" />
                      </div>
                      <span className={`text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full ${accent.tag}`}>
                        Resource
                      </span>
                    </div>

                    <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-aqua transition-colors line-clamp-3 mb-4 leading-snug">
                      {card.title}
                    </h3>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-neutral-300 group-hover:text-white transition-colors">
                    <span className="truncate">{card.linkText || "Open Resource"}</span>
                    <span className="inline-flex items-center gap-1 text-aqua flex-shrink-0 ml-2">
                      <ExternalLink className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </span>
                  </div>
                </motion.a>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};
