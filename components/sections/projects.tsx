"use client";

import { useState, type FC } from "react";
import { useMediaQuery } from "react-responsive";
import { ProjectDetails } from "@/components/portfolio/project-details";
import { PinnedShowcase } from "@/components/projects/pinned-showcase";
import { ProjectsHeader } from "@/components/projects/projects-header";
import { VerticalProjects } from "@/components/projects/vertical-projects";
import { MY_PROJECTS } from "@/constants/portfolio-constants";
import { useHasMounted } from "@/hooks/use-has-mounted";
import { type Project } from "@/types/portfolio-types";
import { useOptionalContent } from "@/lib/content-context";

export const Projects: FC = () => {
  const isMobile = useMediaQuery({ maxWidth: 1023 });
  const mounted = useHasMounted();
  const [active, setActive] = useState<Project | null>(null);
  const content = useOptionalContent();

  const projectList =
    content?.projects.projects !== undefined
      ? content.projects.projects
      : MY_PROJECTS;

  const pinned = mounted && !isMobile;

  return (
    <section id="projects" className="relative">
      <div id="work" className="absolute -top-20" />
      <ProjectsHeader total={projectList.length} />

      {projectList.length === 0 ? (
        <div className="c-space py-12 text-center text-neutral-400">
          <p>No project prototypes currently listed.</p>
        </div>
      ) : pinned ? (
        <PinnedShowcase onOpen={setActive} projects={projectList} />
      ) : (
        <div className="c-space">
          <VerticalProjects onOpen={setActive} projects={projectList} />
        </div>
      )}

      {active && (
        <ProjectDetails {...active} closeModal={() => setActive(null)} />
      )}
    </section>
  );
};
