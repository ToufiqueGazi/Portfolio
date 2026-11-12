"use client";

import { type FC } from "react";
import { motion } from "motion/react";
import { revealProps } from "@/animations/scroll-animations";
import {
  CONTACT_EMAIL,
  INSTITUTION,
  DEPARTMENT,
} from "@/constants/social-constants";
import { useOptionalContent } from "@/lib/content-context";
import { ContactInfoCard } from "./contact-info-card";

export const ContactDetails: FC = () => {
  const content = useOptionalContent();
  const contact = content?.contact;

  const email = contact?.email || CONTACT_EMAIL;
  const department = contact?.department || DEPARTMENT;
  const school = contact?.school || "School of Engineering & Technology";
  const campusAddress =
    contact?.campusAddress ||
    `${INSTITUTION} · Barasat - Barrackpore Road, 24 Parganas North, Kolkata 700126`;
  const introEyebrow = contact?.introEyebrow || "Institutional Correspondence";
  const introTitle = contact?.introTitle || "Academic Dialogue & Scholarly Collaboration.";
  const introDescription =
    contact?.introDescription ||
    "Welcome to reach out regarding collaborative research proposals, graduate advising, conference review invitations, guest lectures, or technical consultations in Cybersecurity and Computer Vision.";

  return (
    <motion.div {...revealProps()} className="lg:col-span-5">
      <div className="flex items-center gap-2 mb-3">
        <span className="h-2 w-2 rounded-full bg-aqua animate-pulse" />
        <p className="text-xs uppercase tracking-[0.25em] text-neutral-400">
          {introEyebrow}
        </p>
      </div>
      <h2 className="text-heading">
        {introTitle.includes("&") ? (
          <>
            {introTitle.split("&")[0]}&amp; <br />
            <span className="text-gradient">{introTitle.split("&").slice(1).join("&").trim()}</span>
          </>
        ) : (
          introTitle
        )}
      </h2>
      <p className="mt-4 leading-relaxed text-neutral-300 text-sm md:text-base">
        {introDescription}
      </p>

      <div className="mt-8 space-y-4">
        <ContactInfoCard
          icon="✉"
          label="Institutional Email"
          value={email}
          href={`mailto:${email}`}
          gradient="from-coral/30 to-lavender/30"
        />
        <ContactInfoCard
          icon="🏛"
          label="Department & School"
          value={`${department}, ${school}`}
          gradient="from-aqua/30 to-mint/30"
        />
        <ContactInfoCard
          icon="⌖"
          label="Campus Address"
          value={campusAddress}
          gradient="from-royal/30 to-fuchsia/30"
        />
      </div>
    </motion.div>
  );
};
