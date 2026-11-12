"use client";

import { createContext, useContext, type ReactNode } from "react";
import { type SiteContent } from "./content-service";

const ContentContext = createContext<SiteContent | null>(null);

export interface ContentProviderProps {
  content: SiteContent;
  children: ReactNode;
}

export function ContentProvider({ content, children }: ContentProviderProps) {
  return (
    <ContentContext.Provider value={content}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent(): SiteContent {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error("useContent must be used within a ContentProvider");
  }
  return context;
}

export function useOptionalContent(): SiteContent | null {
  return useContext(ContentContext);
}
