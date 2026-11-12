"use client";

import { useRef, type FC } from "react";
import { motion, useInView } from "motion/react";
import {
  CONTACT_EMAIL,
  HERO_NAME,
  INSTITUTION,
  DEPARTMENT,
} from "@/constants/portfolio-constants";
import { getAssetPath } from "@/helpers/path-helpers";
import { useOptionalContent } from "@/lib/content-context";

export const Footer: FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const content = useOptionalContent();

  const name = content?.home.name || HERO_NAME;
  const email = content?.contact.email || CONTACT_EMAIL;
  const department = content?.contact.department || DEPARTMENT;
  const institution = content?.contact.institution || INSTITUTION;

  const socials = [
    {
      name: "Google Scholar",
      href:
        content?.contact.socials?.find((s) => s.name.toLowerCase().includes("scholar"))?.url ||
        "https://scholar.google.com/citations?user=AUZIYQG9NJrrgK6aU-qaoYO7C6WyU9AUT-VQtm1j0RRq3wuVsbb2QSNFs__4tMYIobfaIcJnqMaAMI6nu55CjVsX9vxeJAGGZoC_PuQiP7VuhpoPTdNbyMqaBxaWS5wwmQ891m72nNfsN5muG814blbBrrzUlg==",
      icon: "/assets/socials/google-scholar.svg",
    },
    {
      name: "ResearchGate",
      href:
        content?.contact.socials?.find((s) => s.name.toLowerCase().includes("researchgate"))?.url ||
        "https://www.researchgate.net/profile/Toufique-Gazi",
      icon: "/assets/socials/researchgate.svg",
    },
    {
      name: "Adamas University Directory",
      href:
        content?.contact.socials?.find(
          (s) =>
            s.name.toLowerCase().includes("directory") ||
            s.name.toLowerCase().includes("adamas")
        )?.url || "https://aucse.in",
      icon: "/assets/socials/institution.svg",
    },
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/in/toufique-ahammad-gazi-53733a275/",
      icon: "/assets/socials/linkedIn.svg",
    },
  ];

  return (
    <footer ref={ref} className="c-space pt-16 pb-8 relative overflow-hidden">
      <motion.div
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 1, ease: "easeOut" }}
        style={{ originX: 0 }}
        className="bg-gradient-to-r from-transparent via-neutral-700 to-transparent h-px w-full"
      />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10">
        <div className="absolute left-1/2 -translate-x-1/2 bottom-[-50%] h-72 w-[80%] rounded-full bg-royal/10 blur-[140px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
        className="mt-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8"
      >
        <div>
          <div className="flex items-center gap-2 text-base font-semibold tracking-tight text-white">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-royal to-coral text-white text-sm font-black">
              {name.charAt(0)}
            </span>
            <span>{name}</span>
          </div>
          <p className="mt-2 text-xs md:text-sm text-neutral-300">
            {department} · {institution}
          </p>
          <p className="mt-2 text-xs text-neutral-400 max-w-sm">
            Institutional Email:{" "}
            <a
              href={`mailto:${email}`}
              className="text-white hover:text-aqua transition-colors underline"
            >
              {email}
            </a>
          </p>
        </div>

        <div className="flex flex-col md:items-end gap-3">
          <div className="flex gap-3">
            {socials.map((social, i) => (
              <motion.a
                key={`${social.name}-${i}`}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.08 }}
                className="h-10 w-10 rounded-full border border-white/10 bg-white/[0.04] flex items-center justify-center hover:bg-white/[0.1] hover:border-white/30 transition-colors"
              >
                <img src={getAssetPath(social.icon)} alt="" loading="lazy" decoding="async" className="w-4 h-4" />
              </motion.a>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-neutral-400">
            <span>© {new Date().getFullYear()} {name}</span>
            <span>·</span>
            <span>{institution}</span>
          </div>
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="mt-16 text-center text-[18vw] md:text-[12rem] font-black leading-none text-white/[0.02] select-none uppercase tracking-widest"
      >
        {name.split(" ")[0].toUpperCase()}
      </motion.p>
    </footer>
  );
};
