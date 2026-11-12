"use client";

import { useRef, type FC } from "react";
import { motion, useInView } from "motion/react";
import {
  INITIAL_COURSES,
  INITIAL_ACTIVITIES,
  INITIAL_LINKS,
} from "@/lib/academic-data";
import { SectionHeader } from "@/components/ui/section-header";
import { useOptionalContent } from "@/lib/content-context";
import {
  GraduationCap,
  BookOpen,
  Building,
  Globe,
  Code2,
  Award,
  ExternalLink,
  Shield,
  Layers,
} from "lucide-react";

export const AcademicActivities: FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const content = useOptionalContent();

  const sectionEyebrow =
    content?.experience.activitiesEyebrow || "Pedagogy & Service";
  const sectionTitle =
    content?.experience.activitiesSectionTitle ||
    "Courses Taught, Academic Service & Scholarly Profiles.";
  const profilesEyebrow =
    content?.contact.profilesEyebrow ||
    "Verified Academic Identifiers & Indexes";

  const courses =
    content?.experience.coursesTaught !== undefined
      ? content.experience.coursesTaught
      : INITIAL_COURSES;

  const activities =
    content?.experience.activities !== undefined
      ? content.experience.activities
      : INITIAL_ACTIVITIES;

  const links =
    content?.contact.socials !== undefined
      ? content.contact.socials
      : INITIAL_LINKS;

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "GraduationCap":
        return <GraduationCap className="h-5 w-5 text-aqua" />;
      case "BookOpen":
        return <BookOpen className="h-5 w-5 text-lavender" />;
      case "Building":
        return <Building className="h-5 w-5 text-coral" />;
      case "Linkedin":
        return <Globe className="h-5 w-5 text-[#0077b5]" />;
      case "Github":
        return <Code2 className="h-5 w-5 text-white" />;
      case "Award":
        return <Award className="h-5 w-5 text-mint" />;
      default:
        return <ExternalLink className="h-5 w-5 text-neutral-400" />;
    }
  };

  return (
    <section
      ref={ref}
      id="academic-service"
      className="c-space section-spacing relative overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 h-72 w-[60%] rounded-full bg-lavender/10 blur-[140px]" />
      </div>

      <SectionHeader
        eyebrow={sectionEyebrow}
        title={
          sectionTitle.includes("&") ? (
            <>
              {sectionTitle.split("&")[0]}&amp;{" "}
              <span className="text-gradient">
                {sectionTitle.split("&").slice(1).join("&").trim()}
              </span>
            </>
          ) : (
            sectionTitle
          )
        }
      />

      {/* Courses Taught Grid */}
      <div className="mt-12">
        <div className="flex items-center gap-2 mb-4">
          <Layers className="h-4 w-4 text-aqua" />
          <h3 className="text-lg md:text-xl font-bold text-white">
            {content?.experience.coursesTitle || "Undergraduate & Postgraduate Instruction"}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map((course, idx) => (
            <motion.div
              key={`${course.code}-${idx}`}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              className="glass gradient-border p-6"
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded bg-white/10 text-aqua">
                  {course.code}
                </span>
                <span className="text-xs text-neutral-400">{course.level}</span>
              </div>
              <h4 className="text-base md:text-lg font-bold text-white mb-1">
                {course.name}
              </h4>
              <p className="text-xs text-neutral-300 font-medium mb-3">
                {course.institution}
              </p>
              <p className="text-xs text-neutral-400 leading-relaxed">
                <strong className="text-neutral-300">Syllabus Focus:</strong> {course.topics}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Institutional Service & Activities */}
      <div className="mt-12">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-4 w-4 text-coral" />
          <h3 className="text-lg md:text-xl font-bold text-white">
            {content?.experience.activitiesTitle || "Academic Governance & Student Mentorship"}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activities.map((act, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + idx * 0.05 }}
              className="glass p-6"
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-xs font-semibold text-lavender">
                  {act.period}
                </span>
              </div>
              <h4 className="text-base font-bold text-white mb-1">{act.role}</h4>
              <p className="text-xs font-medium text-neutral-300 mb-2">
                {act.organization}
              </p>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {act.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Verified Scholarly Profiles */}
      <div className="mt-14">
        <p className="text-eyebrow text-center mb-6">
          {profilesEyebrow}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {links.map((link, idx) => (
            <motion.a
              key={`${link.name}-${idx}`}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + idx * 0.05 }}
              className="glass p-5 flex items-center justify-between group hover:border-white/30 transition-all hover:-translate-y-1"
            >
              <div className="flex items-center gap-3.5">
                <div className="h-10 w-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-white/[0.1] transition-colors">
                  {getIcon(link.icon)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-aqua transition-colors">
                    {link.name}
                  </h4>
                  <p className="text-xs text-neutral-400 line-clamp-1">
                    {link.description}
                  </p>
                </div>
              </div>
              <ExternalLink className="h-4 w-4 text-neutral-400 group-hover:text-white transition-colors flex-shrink-0 ml-2" />
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};
