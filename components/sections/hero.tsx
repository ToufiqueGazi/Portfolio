"use client";

import { type FC } from "react";
// [TEMPORARY FALLBACK PRESERVATION]
// Original 3D Astronaut Hero Scene is preserved in hero-scene.tsx as fallback per specification.
// To re-enable, un-comment HeroScene below and replace <CybersecurityNetwork />:
// import dynamic from "next/dynamic";
// const HeroScene = dynamic(
//   () => import("@/components/sections/hero-scene").then((mod) => mod.HeroScene),
//   { ssr: false }
// );
// import { useDeferred3D } from "@/hooks/use-deferred-3d";
import { HeroText } from "@/components/portfolio/hero-text";
import { ParallaxBackground } from "@/components/portfolio/parallax-background";
import { CybersecurityNetwork } from "@/components/portfolio/cybersecurity-network";

export const Hero: FC = () => {
  return (
    <section
      id="home"
      className="relative flex flex-col md:flex-row items-center md:items-start justify-center md:justify-start min-h-screen overflow-hidden"
    >
      <HeroText />
      <ParallaxBackground />

      {/* Active Hero Artwork: 3D Mouse-Following Cybersecurity Network Infrastructure with Animated Circuit Data */}
      <div
        className="z-10 w-full md:w-auto md:absolute md:right-4 lg:right-6 xl:right-12 md:top-1/2 md:-translate-y-1/2 flex items-center justify-center px-4 sm:px-6 md:px-0 mt-8 mb-16 md:mt-0 md:mb-0"
        style={{
          animation: "fadeIn 1s cubic-bezier(0.16, 1, 0.3, 1) forwards",
          animationDelay: "calc(var(--intro-delay) + 0.35s)",
        }}
      >
        <CybersecurityNetwork />
      </div>

      {/*
        [TEMPORARY FALLBACK PRESERVATION]
        Original Astronaut Artwork implementation preserved below:
        {showScene && <HeroScene />}
      */}

      <a
        href="#about"
        className="reveal absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-[10px] tracking-[0.4em] uppercase text-neutral-400 hover:text-white transition-colors z-10"
        style={{ animationDelay: "calc(var(--intro-delay) + 1.2s)" }}
        aria-label="Scroll down"
      >
        <span>Scroll</span>
        <span className="relative block h-10 w-px overflow-hidden bg-white/10">
          <span className="scroll-hint-sweep absolute inset-x-0 top-0 h-3 bg-gradient-to-b from-coral to-transparent" />
        </span>
      </a>
    </section>
  );
};
