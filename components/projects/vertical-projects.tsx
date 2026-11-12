"use client";

import { type FC } from "react";
import { MY_PROJECTS } from "@/constants/portfolio-constants";
import { useInViewOnce } from "@/hooks/use-in-view-once";
import {
  type ProjectListProps,
  type ProjectPanelProps,
} from "@/types/project-types";
import { type Project } from "@/types/portfolio-types";
import { useOptionalContent } from "@/lib/content-context";
import { ProjectPanel } from "./project-panel";

const LazyPanel: FC<Omit<ProjectPanelProps, "showPreview">> = (props) => {
  const [ref, inView] = useInViewOnce<HTMLDivElement>();
  return (
    <div ref={ref}>
      <ProjectPanel {...props} showPreview={inView} />
    </div>
  );
};

export const VerticalProjects: FC<ProjectListProps & { projects?: Project[] }> = ({
  onOpen,
  projects,
}) => {
  const content = useOptionalContent();
  const projectList =
    projects ||
    (content?.projects.projects !== undefined
      ? content.projects.projects
      : MY_PROJECTS);

  return (
    <div className="mt-12 space-y-20">
      {projectList.map((project, index) => (
        <LazyPanel
          key={project.id}
          project={project}
          index={index}
          total={projectList.length}
          onOpen={() => onOpen(project)}
        />
      ))}
    </div>
  );
};
