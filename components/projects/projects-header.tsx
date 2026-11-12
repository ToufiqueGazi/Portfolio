"use client";

import { type FC } from "react";
import { SectionHeader } from "@/components/ui/section-header";
import { padIndex } from "@/helpers/format-helpers";
import { useOptionalContent } from "@/lib/content-context";

export const ProjectsHeader: FC<{ total: number }> = ({ total }) => {
  const content = useOptionalContent();
  const eyebrow = content?.projects.eyebrow
    ? `${content.projects.eyebrow.replace(/\s*·\s*Selected$/, "")} · ${padIndex(total)} Selected`
    : `Research Prototypes · ${padIndex(total)} Selected`;
  const titleText =
    content?.projects.title || "Testbeds, Simulators & Applied Systems.";
  const notice =
    content?.projects.notice ||
    "Academic prototypes and implementations supporting empirical publications. Source code repositories and reproducibility artifacts will be linked directly to faculty GitHub repositories.";

  return (
    <div className="c-space pt-24 md:pt-32">
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
        hint={["Scroll", "Pinned"]}
      />
      <p className="mt-4 text-xs md:text-sm text-neutral-400 max-w-2xl">
        {notice}
      </p>
    </div>
  );
};
