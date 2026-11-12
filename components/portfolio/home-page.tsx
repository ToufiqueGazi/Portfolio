"use client";

import { type FC } from "react";
import { Navbar } from "@/components/sections/navbar";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Research } from "@/components/sections/services";
import { Publications } from "@/components/sections/publications";
import { Projects } from "@/components/sections/projects";
import { Experiences } from "@/components/sections/experiences";
import { Notes } from "@/components/sections/notes";
import { AcademicActivities } from "@/components/sections/academic-activities";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/sections/footer";
import { PageLoader } from "@/components/portfolio/page-loader";
import { GlobeLayer } from "@/components/globe/globe-layer";
import { CustomCursor } from "@/components/ui/custom-cursor";
import { ContentProvider } from "@/lib/content-context";
import { type SiteContent } from "@/lib/content-service";

export interface HomePageProps {
  content?: SiteContent;
}

export const HomePage: FC<HomePageProps> = ({ content }) => {
  const contentElement = (
    <>
      <CustomCursor />
      <PageLoader />
      <GlobeLayer />
      <div id="site-content" className="relative z-10 w-full">
        <Navbar />
        <Hero />
        <About />
        <Research />
        <Publications />
        <Experiences />
        <Projects />
        <Notes data={content?.notes} />
        <AcademicActivities />
        <Contact />
        <Footer />
      </div>
    </>
  );

  if (content) {
    return <ContentProvider content={content}>{contentElement}</ContentProvider>;
  }

  return contentElement;
};
