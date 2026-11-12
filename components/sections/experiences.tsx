"use client";

import { type FC } from "react";
import { Timeline } from "@/components/portfolio/timeline";
import { EXPERIENCES } from "@/constants/portfolio-constants";
import { useOptionalContent } from "@/lib/content-context";

export const Experiences: FC = () => {
  const content = useOptionalContent();
  const experiences =
    content?.experience.experiences !== undefined
      ? content.experience.experiences
      : EXPERIENCES;

  return (
    <div className="w-full">
      <Timeline data={experiences} />
    </div>
  );
};
