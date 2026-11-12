"use client";

import Image from "next/image";
import { type FC } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useTheme } from "@/hooks/use-theme";
// [TEMPORARY FALLBACK PRESERVATION]
// Previous multi-layered parallax hook preserved for fallback if needed:
// import { useDeferredLayers } from "@/hooks/use-deferred-3d";

export const ParallaxBackground: FC = () => {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const { scrollYProgress } = useScroll();
  const smoothScroll = useSpring(scrollYProgress, { damping: 50 });
  // Subtle vertical drift on scroll to create cinematic depth
  const backgroundY = useTransform(smoothScroll, [0, 0.5], ["0%", "8%"]);
  const backgroundScale = useTransform(smoothScroll, [0, 0.5], [1, 1.04]);

  return (
    <section className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="relative w-full h-full min-h-screen">
        {/* Dark Mode Cosmic Sci-Fi Landscape Background */}
        <motion.div
          aria-hidden
          className={`absolute inset-0 -z-50 transition-opacity duration-700 ease-in-out ${
            isLight ? "opacity-0" : "opacity-100"
          }`}
          style={{ y: backgroundY, scale: backgroundScale }}
        >
          <Image
            src="/assets/hero-bg-scifi.jpg"
            alt="Cosmic Sci-Fi Landscape with Ringed Planet and Planetary Atmosphere"
            fill
            priority
            fetchPriority="high"
            quality={95}
            sizes="100vw"
            className="object-cover object-center will-change-transform"
          />
        </motion.div>

        {/* Light Mode Bright White-and-Blue Sci-Fi Landscape Background */}
        <motion.div
          aria-hidden
          className={`absolute inset-0 -z-50 transition-opacity duration-700 ease-in-out ${
            isLight ? "opacity-100" : "opacity-0"
          }`}
          style={{ y: backgroundY, scale: backgroundScale }}
        >
          <Image
            src="/assets/hero-light-background.jpg"
            alt="Bright White and Icy-Blue Sci-Fi Landscape with Orbiting Celestial Bodies and Mountains"
            fill
            priority
            fetchPriority="high"
            quality={95}
            sizes="100vw"
            className="object-cover object-center will-change-transform"
          />
        </motion.div>

        {/* Atmospheric vignettes tuned for Dark vs Light mode */}
        {isLight ? (
          <>
            {/* Light mode: Restrained atmospheric vignette preserving bright icy-blue & cloud details while maintaining crisp hero contrast */}
            <div
              aria-hidden
              className="absolute inset-0 -z-40 bg-gradient-to-t from-[#060814]/70 via-transparent to-black/25 pointer-events-none"
            />
            <div
              aria-hidden
              className="absolute inset-0 -z-40 bg-gradient-to-r from-black/50 via-transparent to-black/20 pointer-events-none"
            />
            {/* Natural gradient and backdrop-blur blend seamlessly transitioning Home landscape into the white About section */}
            <div
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-40 md:h-56 -z-30 pointer-events-none backdrop-blur-[6px] [mask-image:linear-gradient(to_bottom,transparent_0%,black_100%)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,black_100%)]"
            />
            <div
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-36 md:h-52 -z-20 pointer-events-none bg-gradient-to-b from-transparent via-white/60 to-white"
            />
          </>
        ) : (
          <>
            {/* Dark mode: original deep cosmic vignette */}
            <div
              aria-hidden
              className="absolute inset-0 -z-40 bg-gradient-to-t from-[#060814]/75 via-transparent to-black/25 pointer-events-none"
            />
            <div
              aria-hidden
              className="absolute inset-0 -z-40 bg-gradient-to-r from-black/45 via-transparent to-black/20 pointer-events-none"
            />
          </>
        )}

        {/*
          [TEMPORARY FALLBACK PRESERVATION]
          Original multi-layer parallax assets (sky, mountains, planets) preserved below:
          - /assets/sky.webp
          - /assets/mountain-3.webp
          - /assets/planets.webp
          - /assets/mountain-2.webp
          - /assets/mountain-1.webp
        */}
      </div>
    </section>
  );
};
