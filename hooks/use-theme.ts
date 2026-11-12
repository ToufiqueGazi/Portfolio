"use client";

import { useSyncExternalStore, useCallback } from "react";

export type Theme = "dark" | "light";

function getSystemTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function getStoredOrDomTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  const html = document.documentElement;
  const dataTheme = html.getAttribute("data-theme");
  if (dataTheme === "light" || html.classList.contains("light")) {
    return "light";
  }
  if (dataTheme === "dark" || html.classList.contains("dark")) {
    return "dark";
  }
  try {
    const stored = localStorage.getItem("theme");
    if (stored === "light") return "light";
    if (stored === "dark") return "dark";
  } catch {
    // ignore
  }
  return getSystemTheme();
}

function subscribeTheme(callback: () => void) {
  if (typeof window === "undefined") return () => {};

  const mql = window.matchMedia("(prefers-color-scheme: light)");
  const mediaListener = () => callback();
  mql.addEventListener("change", mediaListener);

  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.attributeName === "class" || m.attributeName === "data-theme") {
        callback();
      }
    }
  });
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class", "data-theme"],
  });

  const storageListener = (e: StorageEvent) => {
    if (e.key === "theme") callback();
  };
  window.addEventListener("storage", storageListener);

  return () => {
    mql.removeEventListener("change", mediaListener);
    observer.disconnect();
    window.removeEventListener("storage", storageListener);
  };
}

export function useTheme(): {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
} {
  const theme: Theme = useSyncExternalStore<Theme>(
    subscribeTheme,
    getStoredOrDomTheme,
    () => "dark" as Theme
  );

  const setTheme = useCallback((nextTheme: Theme) => {
    if (typeof window === "undefined") return;
    const html = document.documentElement;
    html.setAttribute("data-theme", nextTheme);
    if (nextTheme === "light") {
      html.classList.add("light");
      html.classList.remove("dark");
    } else {
      html.classList.add("dark");
      html.classList.remove("light");
    }
    try {
      localStorage.setItem("theme", nextTheme);
    } catch {
      // ignore
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  return { theme, setTheme, toggleTheme };
}
