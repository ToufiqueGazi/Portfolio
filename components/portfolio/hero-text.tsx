"use client";

import { type CSSProperties, type FC } from "react";
import { FlipWords } from "@/components/portfolio/flip-words";
import {
  FLIP_WORDS,
  HERO_NAME,
  HERO_ROLE,
  HERO_LOCATION,
} from "@/constants/portfolio-constants";
import { useOptionalContent } from "@/lib/content-context";

const delay = (seconds: number): CSSProperties => ({
  animationDelay: `calc(var(--intro-delay) + ${seconds}s)`,
});

export const HeroText: FC = () => {
  const content = useOptionalContent()?.home;

  const name = content?.name || HERO_NAME;
  const role = content?.role || HERO_ROLE;
  const location = content?.location || HERO_LOCATION;
  const headlinePrefix = content?.headlinePrefix || "advancing";
  const headlineSuffix = content?.headlineSuffix || "& Intelligent Systems.";
  const flipWords =
    content?.flipWords && content.flipWords.length > 0
      ? content.flipWords
      : FLIP_WORDS;
  const actionButtons = content?.actionButtons || [
    { label: "Publications", href: "#publications", primary: true },
    { label: "Research Focus", href: "#research", primary: false },
    { label: "Institutional Contact", href: "#contact", primary: false },
  ];

  return (
    <div className="z-10 mt-24 text-center md:mt-32 md:text-left max-w-3xl">
      <div className="flex-col hidden md:flex c-space">
        <div
          className="reveal inline-flex items-center gap-2 self-start rounded-full border border-white/15 bg-white/[0.04] backdrop-blur-md px-3.5 py-1.5 mb-6"
          style={delay(0.05)}
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inset-0 rounded-full bg-aqua animate-ping opacity-75" />
            <span className="relative rounded-full bg-aqua h-2 w-2" />
          </span>
          <span className="text-xs tracking-[0.2em] uppercase text-neutral-300 font-medium">
            {location}
          </span>
        </div>

        <h1
          className="reveal text-3xl font-light text-neutral-300"
          style={delay(0.12)}
        >
          {name}
        </h1>

        <p
          className="reveal text-4xl lg:text-5xl font-bold mt-2 text-gradient leading-tight"
          style={delay(0.19)}
        >
          {role} <br />
          {headlinePrefix}
        </p>

        <div className="reveal" style={delay(0.26)}>
          <FlipWords
            words={[...flipWords]}
            className="font-black text-white text-6xl lg:text-7xl"
          />
        </div>

        <p
          className="reveal text-2xl lg:text-3xl font-semibold text-neutral-300 mt-1"
          style={delay(0.33)}
        >
          {headlineSuffix}
        </p>

        <div className="reveal flex flex-wrap gap-4 mt-8" style={delay(0.4)}>
          {actionButtons.map((btn, idx) => (
            <a
              key={idx}
              href={btn.href}
              className={btn.primary ? "btn-primary" : "btn-ghost"}
            >
              <span>{btn.label}</span>
              {btn.primary && <span aria-hidden>→</span>}
            </a>
          ))}
        </div>
      </div>

      <div className="flex flex-col space-y-4 md:hidden px-4">
        <div
          className="reveal inline-flex self-center items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-3 py-1.5"
          style={delay(0.05)}
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inset-0 rounded-full bg-aqua animate-ping opacity-75" />
            <span className="relative rounded-full bg-aqua h-2 w-2" />
          </span>
          <span className="text-[10px] tracking-[0.2em] uppercase text-neutral-300 font-medium">
            {location}
          </span>
        </div>

        <p
          className="reveal text-2xl font-light text-neutral-300"
          style={delay(0.12)}
        >
          {name}
        </p>

        <p
          className="reveal text-3xl font-bold text-gradient"
          style={delay(0.19)}
        >
          {role}
        </p>

        <div className="reveal" style={delay(0.26)}>
          <FlipWords
            words={[...flipWords]}
            className="font-bold text-white text-4xl"
          />
        </div>

        <p
          className="reveal text-xl font-semibold text-neutral-300"
          style={delay(0.33)}
        >
          {headlineSuffix}
        </p>

        <div
          className="reveal flex flex-col gap-3 mt-4 items-center"
          style={delay(0.4)}
        >
          {actionButtons.map((btn, idx) => (
            <a
              key={idx}
              href={btn.href}
              className={`${btn.primary ? "btn-primary" : "btn-ghost"} w-full`}
            >
              <span>{btn.label}</span>
              {btn.primary && <span aria-hidden>→</span>}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
