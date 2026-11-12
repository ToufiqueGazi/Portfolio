"use client";

import { useState, useMemo, useEffect, useRef, type FC } from "react";
import {
  INITIAL_PUBLICATIONS,
  INITIAL_BOOK_CHAPTERS,
  INITIAL_CONFERENCES,
  INITIAL_PATENTS,
} from "@/lib/academic-data";
import { SectionHeader } from "@/components/ui/section-header";
import { CardSwap } from "@/components/ui/card-swap";
import { useOptionalContent } from "@/lib/content-context";
import {
  ExternalLink,
  Copy,
  Check,
  Search,
  Layers,
} from "lucide-react";

type FilterTab = "all" | "journals" | "chapters" | "conferences" | "patents";

interface UnifiedItem {
  id: string;
  title: string;
  category: string;
  displayType: string;
  authors?: string;
  detail?: string;
  year: string;
  abstract?: string;
  keywords?: string[];
  url?: string;
  badge?: string;
}

const SCROLL_PER_CARD = 420;
const HOLD_DISTANCE = 160;

export const Publications: FC = () => {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyCitation = (
    title: string,
    authors: string,
    venue: string,
    year: string,
    id: string
  ) => {
    const citation = `${authors}. "${title}." ${venue} (${year}).`;
    navigator.clipboard.writeText(citation).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 3000);
    });
  };

  const content = useOptionalContent();
  const rawPubs =
    content?.publications.publications !== undefined
      ? content.publications.publications
      : INITIAL_PUBLICATIONS;
  const rawChapters =
    content?.publications.bookChapters !== undefined
      ? content.publications.bookChapters
      : INITIAL_BOOK_CHAPTERS;
  const rawConfs =
    content?.publications.conferences !== undefined
      ? content.publications.conferences
      : INITIAL_CONFERENCES;
  const rawPatents =
    content?.publications.patents !== undefined
      ? content.publications.patents
      : INITIAL_PATENTS;

  const filteredItems = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    const journals: UnifiedItem[] = rawPubs.map((p) => ({
      ...p,
      category: "journals",
      displayType: p.type,
      detail: p.venue,
    }));

    const chapters: UnifiedItem[] = rawChapters.map((c) => ({
      ...c,
      category: "chapters",
      displayType: `Book Chapter (${c.publisher})`,
      detail: `${c.bookTitle} · ${c.publisher}`,
      badge: "Book Chapter",
    }));

    const confs: UnifiedItem[] = rawConfs.map((cf) => ({
      ...cf,
      category: "conferences",
      displayType: "Conference Presentation",
      detail: `${cf.conference} · ${cf.location}`,
      badge: "Conference",
      keywords: cf.tags,
    }));

    const patents: UnifiedItem[] = rawPatents.map((pt) => ({
      id: pt.id,
      title: pt.title,
      category: "patents",
      displayType: pt.status,
      detail: `${pt.jurisdiction} · ${pt.applicationNumber}`,
      badge: "Patent Filing",
      authors: pt.inventors.join(", "),
      year: "Provisional",
      abstract: pt.abstract,
      keywords: ["Intellectual Property", "Patent", pt.jurisdiction],
      url: "",
    }));

    let combined: UnifiedItem[] = [];
    if (activeTab === "all")
      combined = [...journals, ...chapters, ...confs, ...patents];
    else if (activeTab === "journals") combined = journals;
    else if (activeTab === "chapters") combined = chapters;
    else if (activeTab === "conferences") combined = confs;
    else if (activeTab === "patents") combined = patents;

    if (!query) return combined;

    return combined.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        (item.authors && item.authors.toLowerCase().includes(query)) ||
        (item.detail && item.detail.toLowerCase().includes(query)) ||
        (item.abstract && item.abstract.toLowerCase().includes(query)) ||
        (item.keywords &&
          item.keywords.some((k: string) => k.toLowerCase().includes(query)))
    );
  }, [activeTab, searchQuery, rawPubs, rawChapters, rawConfs, rawPatents]);

  const total = filteredItems.length;

  const trackRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const [stickyHeight, setStickyHeight] = useState(624);
  const [scrollProgress, setScrollProgress] = useState(0);

  // References for strict discrete card stepping and transition locking
  const scrollProgressRef = useRef(0);
  const targetIndexRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const lockUntilRef = useRef(0);
  const accumulatedDeltaRef = useRef(0);
  const animFrameRef = useRef<number | null>(null);
  const lastGestureTimeRef = useRef(0);
  const touchStartYRef = useRef<number | null>(null);

  // Measure the true rendered height of the sticky presentation element
  useEffect(() => {
    const stickyEl = stickyRef.current;
    if (!stickyEl) return;

    const measure = () => {
      const h = stickyEl.offsetHeight;
      if (h > 0) {
        setStickyHeight(h);
      }
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(stickyEl);
    return () => ro.disconnect();
  }, [total]);

  const transitionDistance = Math.max(0, (total - 1) * SCROLL_PER_CARD);
  const totalScrollableDistance = transitionDistance + HOLD_DISTANCE;
  const trackHeight =
    total <= 1 ? "auto" : `${stickyHeight + totalScrollableDistance}px`;

  const effectiveProgress =
    total <= 1 ? 0 : Math.min(total - 1, Math.max(0, scrollProgress));

  // Intercept wheel gestures when pinned to enforce strict 1-card-per-scroll-step
  useEffect(() => {
    if (total <= 1) return;

    // Helper to determine if the sticky container is actively pinned in viewport
    const isPinned = () => {
      const track = trackRef.current;
      if (!track) return false;
      const rect = track.getBoundingClientRect();
      const stickyTop = window.innerWidth >= 768 ? 96 : 80;
      const isAtOrPastTop = rect.top <= stickyTop + 4;
      const isBeforeBottom = rect.bottom >= stickyTop + stickyHeight - 4;
      return isAtOrPastTop && isBeforeBottom;
    };

    // Discrete Step Animator: transitions smoothly from current progress to targetIndex
    // with ease-in-out smoothstep curve, locking input until complete
    const animateToIndex = (toIndex: number) => {
      if (total <= 1) return;
      const clampedTo = Math.min(total - 1, Math.max(0, toIndex));
      const fromProgress = scrollProgressRef.current;
      if (clampedTo === fromProgress && !isAnimatingRef.current) return;

      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }

      isAnimatingRef.current = true;
      targetIndexRef.current = clampedTo;
      // Lock duration: 480ms transition duration + 120ms buffer for inertial wheel decay
      lockUntilRef.current = Date.now() + 600;

      const duration = 480;
      const startTime = performance.now();

      const track = trackRef.current;
      const stickyTop = window.innerWidth >= 768 ? 96 : 80;
      const trackDocTop =
        track !== null ? window.scrollY + track.getBoundingClientRect().top : 0;

      const step = (now: number) => {
        const elapsed = now - startTime;
        const t = Math.min(1, Math.max(0, elapsed / duration));
        // Smoothstep easing: 3t^2 - 2t^3
        const eased = t * t * (3 - 2 * t);
        const currentP = fromProgress + (clampedTo - fromProgress) * eased;

        scrollProgressRef.current = currentP;
        setScrollProgress(currentP);

        if (track) {
          const targetScrollY =
            trackDocTop - stickyTop + currentP * SCROLL_PER_CARD;
          window.scrollTo({ top: targetScrollY, behavior: "instant" });
        }

        if (t < 1) {
          animFrameRef.current = requestAnimationFrame(step);
        } else {
          scrollProgressRef.current = clampedTo;
          setScrollProgress(clampedTo);
          isAnimatingRef.current = false;
          animFrameRef.current = null;
        }
      };

      animFrameRef.current = requestAnimationFrame(step);
    };

    const onWheel = (e: WheelEvent) => {
      const track = trackRef.current;
      if (!track) return;

      const stickyTop = window.innerWidth >= 768 ? 96 : 80;
      const rect = track.getBoundingClientRect();

      // Outside the pinned region: let native page scroll run uninhibited
      const isAtOrPastTop = rect.top <= stickyTop + 4;
      const isBeforeBottom = rect.bottom >= stickyTop + stickyHeight - 4;
      if (!isAtOrPastTop || !isBeforeBottom) return;

      // Allow internal scrolling for scrollable containers (e.g. unabridged abstracts)
      const target = e.target as HTMLElement | null;
      const scrollable = target?.closest(".overflow-y-auto") as HTMLElement | null;
      if (scrollable) {
        const canDown =
          scrollable.scrollTop + scrollable.clientHeight < scrollable.scrollHeight - 2;
        const canUp = scrollable.scrollTop > 2;
        if ((e.deltaY > 0 && canDown) || (e.deltaY < 0 && canUp)) {
          return;
        }
      }

      lastGestureTimeRef.current = Date.now();

      // Scrolling Down / Forward
      if (e.deltaY > 0) {
        // If already on the final card, allow native scroll to release into next section
        if (targetIndexRef.current >= total - 1) {
          return;
        }

        // Intercept scroll while navigating cards
        e.preventDefault();

        // If currently animating or inside cooldown buffer, drop additional inertial ticks
        if (isAnimatingRef.current || Date.now() < lockUntilRef.current) {
          accumulatedDeltaRef.current = 0;
          return;
        }

        accumulatedDeltaRef.current += e.deltaY;
        // Require deliberate threshold to prevent hair-trigger activation
        if (accumulatedDeltaRef.current >= 24) {
          accumulatedDeltaRef.current = 0;
          animateToIndex(targetIndexRef.current + 1);
        }
        return;
      }

      // Scrolling Up / Backward
      if (e.deltaY < 0) {
        // If already on the first card, allow native scroll to scroll up to previous section
        if (targetIndexRef.current <= 0) {
          return;
        }

        // Intercept scroll while navigating cards
        e.preventDefault();

        // If currently animating or inside cooldown buffer, drop additional inertial ticks
        if (isAnimatingRef.current || Date.now() < lockUntilRef.current) {
          accumulatedDeltaRef.current = 0;
          return;
        }

        accumulatedDeltaRef.current += e.deltaY;
        if (accumulatedDeltaRef.current <= -24) {
          accumulatedDeltaRef.current = 0;
          animateToIndex(targetIndexRef.current - 1);
        }
        return;
      }
    };

    // Touch event handling for mobile / touchpads
    const onTouchStart = (e: TouchEvent) => {
      touchStartYRef.current = e.touches[0].clientY;
      accumulatedDeltaRef.current = 0;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (touchStartYRef.current === null) return;
      if (!isPinned()) return;

      const currentY = e.touches[0].clientY;
      const deltaY = touchStartYRef.current - currentY; // positive = swipe up = scroll down

      // Allow internal scrolling for scrollable containers
      const target = e.target as HTMLElement | null;
      const scrollable = target?.closest(".overflow-y-auto") as HTMLElement | null;
      if (scrollable) {
        const canDown =
          scrollable.scrollTop + scrollable.clientHeight < scrollable.scrollHeight - 2;
        const canUp = scrollable.scrollTop > 2;
        if ((deltaY > 0 && canDown) || (deltaY < 0 && canUp)) {
          return;
        }
      }

      if (deltaY > 30) {
        // Swipe up -> advance
        if (targetIndexRef.current < total - 1) {
          e.preventDefault();
          if (!isAnimatingRef.current && Date.now() >= lockUntilRef.current) {
            touchStartYRef.current = currentY;
            animateToIndex(targetIndexRef.current + 1);
          }
        }
      } else if (deltaY < -30) {
        // Swipe down -> go back
        if (targetIndexRef.current > 0) {
          e.preventDefault();
          if (!isAnimatingRef.current && Date.now() >= lockUntilRef.current) {
            touchStartYRef.current = currentY;
            animateToIndex(targetIndexRef.current - 1);
          }
        }
      }
    };

    const onTouchEnd = () => {
      touchStartYRef.current = null;
    };

    // Keyboard navigation (Arrow keys / PageUp / PageDown)
    const onKeyDown = (e: KeyboardEvent) => {
      if (!isPinned()) return;

      if (
        e.key === "ArrowDown" ||
        e.key === "PageDown" ||
        (e.key === " " && !e.shiftKey)
      ) {
        if (targetIndexRef.current < total - 1) {
          e.preventDefault();
          if (!isAnimatingRef.current && Date.now() >= lockUntilRef.current) {
            animateToIndex(targetIndexRef.current + 1);
          }
        }
      } else if (
        e.key === "ArrowUp" ||
        e.key === "PageUp" ||
        (e.key === " " && e.shiftKey)
      ) {
        if (targetIndexRef.current > 0) {
          e.preventDefault();
          if (!isAnimatingRef.current && Date.now() >= lockUntilRef.current) {
            animateToIndex(targetIndexRef.current - 1);
          }
        }
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKeyDown);
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [total, stickyHeight]);

  // Fallback scroll listener for scrollbar dragging
  useEffect(() => {
    if (total <= 1) return;

    const onScroll = () => {
      // Ignore programmatic scroll events triggered by our own animation
      if (isAnimatingRef.current) return;

      // If wheel or touch gesture occurred recently, the gesture controller is active
      if (Date.now() - lastGestureTimeRef.current < 400) return;

      const track = trackRef.current;
      if (!track) return;

      const rect = track.getBoundingClientRect();
      const stickyTop = window.innerWidth >= 768 ? 96 : 80;
      const scrolled = stickyTop - rect.top;

      if (scrolled <= 0) {
        targetIndexRef.current = 0;
        scrollProgressRef.current = 0;
        setScrollProgress(0);
      } else if (scrolled >= transitionDistance) {
        targetIndexRef.current = total - 1;
        scrollProgressRef.current = total - 1;
        setScrollProgress(total - 1);
      } else {
        const cardIndex = Math.round(scrolled / SCROLL_PER_CARD);
        const clampedIndex = Math.min(total - 1, Math.max(0, cardIndex));
        targetIndexRef.current = clampedIndex;
        scrollProgressRef.current = clampedIndex;
        setScrollProgress(clampedIndex);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [total, transitionDistance]);

  const resetTrackPosition = () => {
    if (animFrameRef.current !== null) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    isAnimatingRef.current = false;
    targetIndexRef.current = 0;
    scrollProgressRef.current = 0;
    setScrollProgress(0);

    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const stickyTop = window.innerWidth >= 768 ? 96 : 80;
    const scrolled = stickyTop - rect.top;
    if (scrolled > 50) {
      const trackDocTop = window.scrollY + rect.top;
      window.scrollTo({
        top: Math.max(0, trackDocTop - stickyTop),
        behavior: "instant",
      });
    }
  };

  const handleTabChange = (tab: FilterTab) => {
    setActiveTab(tab);
    resetTrackPosition();
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    resetTrackPosition();
  };

  // Color & Badge Styling based on category
  const getBadgeStyle = (category: string, badge?: string) => {
    if (badge?.toLowerCase().includes("patent") || category === "patents") {
      return "bg-cyan-500/20 text-cyan-300 border-cyan-500/40";
    }
    if (badge?.toLowerCase().includes("chapter") || category === "chapters") {
      return "bg-amber-500/20 text-amber-300 border-amber-500/40";
    }
    if (badge?.toLowerCase().includes("conference") || category === "conferences") {
      return "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
    }
    if (badge?.toLowerCase().includes("cyber")) {
      return "bg-rose-500/20 text-rose-300 border-rose-500/40";
    }
    if (badge?.toLowerCase().includes("machine") || badge?.toLowerCase().includes("learning")) {
      return "bg-purple-500/20 text-purple-300 border-purple-500/40";
    }
    return "bg-royal/30 text-lavender border-royal/50";
  };

  return (
    <section
      id="publications"
      className="c-space section-spacing relative"
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/3 h-80 w-80 rounded-full bg-royal/20 blur-[140px]" />
        <div className="absolute bottom-1/3 right-1/4 h-72 w-72 rounded-full bg-coral/15 blur-[140px]" />
      </div>

      <SectionHeader
        eyebrow={content?.publications.eyebrow || "Scholarly Output"}
        title={
          (content?.publications.title || "Publications, Book Chapters & Intellectual Property.").includes("&") ? (
            <>
              {(content?.publications.title || "Publications, Book Chapters & Intellectual Property.").split("&")[0]}&amp;{" "}
              <span className="text-gradient">
                {(content?.publications.title || "Publications, Book Chapters & Intellectual Property.").split("&").slice(1).join("&").trim()}
              </span>
            </>
          ) : (
            content?.publications.title || "Scholarly Publications"
          )
        }
      />

      {content?.publications.summary && (
        <p className="mt-4 text-xs md:text-sm text-neutral-400 max-w-2xl">
          {content.publications.summary}
        </p>
      )}

      {/* Filter Tabs & Search Bar */}
      <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-md">
          {(
            [
              { id: "all", label: "All Works" },
              { id: "journals", label: "Journal Articles" },
              { id: "chapters", label: "Book Chapters" },
              { id: "conferences", label: "Conferences" },
              { id: "patents", label: "Patents" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`px-4 py-2 text-xs md:text-sm font-medium rounded-full transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-royal to-coral text-white shadow-lg shadow-coral/25"
                  : "text-neutral-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search papers, topics..."
            className="w-full pl-10 pr-4 py-2 text-xs md:text-sm rounded-full border border-white/10 bg-white/[0.04] text-white placeholder-neutral-500 focus:outline-none focus:border-royal/60 transition-colors"
          />
        </div>
      </div>

      {/* Scroll-Driven Pinned Track for 3D Card Progression */}
      <div
        ref={trackRef}
        id="publications-track"
        className="mt-6 relative w-full"
        style={{
          height: trackHeight,
        }}
      >
        <div
          ref={stickyRef}
          className={
            total <= 1
              ? "w-full py-4"
              : "sticky top-20 md:top-24 w-full flex flex-col justify-center py-2"
          }
        >
          {total === 0 ? (
            <div className="glass p-12 text-center text-neutral-400 rounded-2xl border border-white/10">
              <p>No publication entries match your current search.</p>
            </div>
          ) : (
            <CardSwap
              key={`${activeTab}-${searchQuery}`}
              progress={effectiveProgress}
              total={total}
              cardDistance={28}
              verticalDistance={18}
            >
              {filteredItems.map((item) => {
                const isCopied = copiedId === item.id;
                const badgeStyle = getBadgeStyle(item.category, item.badge);

                return (
                  <div
                    key={item.id}
                    style={{ backgroundColor: "#0c101d" }}
                    className="gradient-border relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/15 p-7 md:p-9 shadow-2xl shadow-black/95 min-h-[500px] md:min-h-[520px]"
                  >
                    {/* Subtle Top Ambient Gradient Strip */}
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-royal via-coral to-lavender opacity-60" />

                    {/* Top Meta Header & Actions */}
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`text-xs uppercase tracking-wider px-3.5 py-1 rounded-full font-semibold border ${badgeStyle}`}
                          >
                            {item.badge || item.displayType}
                          </span>
                          <span className="text-xs text-neutral-300 font-medium px-3 py-0.5 rounded-full bg-white/5 border border-white/10">
                            {item.year}
                          </span>
                          {item.displayType && item.badge !== item.displayType && (
                            <span className="hidden sm:inline text-xs text-neutral-400">
                              · {item.displayType}
                            </span>
                          )}
                        </div>

                        {/* Action buttons (Citation & Source) */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyCitation(
                                item.title,
                                item.authors || "",
                                item.detail || "",
                                item.year || "",
                                item.id
                              );
                            }}
                            title="Copy BibTeX / Citation"
                            className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs text-neutral-300 transition-colors hover:bg-white/10 hover:text-white"
                          >
                            {isCopied ? (
                              <>
                                <Check className="h-3.5 w-3.5 text-emerald-400" />
                                <span className="text-emerald-400 font-medium">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3.5 w-3.5" />
                                <span>Cite</span>
                              </>
                            )}
                          </button>

                          {item.url && (
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              title="View Publication / Official Source"
                              className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs text-neutral-300 transition-colors hover:bg-white/10 hover:text-white"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                              <span>Source</span>
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Scholarly Title */}
                      <h3 className="mt-5 text-xl md:text-2xl lg:text-3xl font-bold text-white leading-snug tracking-tight">
                        {item.title}
                      </h3>

                      {/* Authors & Venue */}
                      <div className="mt-3 space-y-1">
                        <p className="text-sm md:text-base text-neutral-200 font-medium">
                          {item.authors}
                        </p>
                        <p className="text-xs md:text-sm text-neutral-400 italic">
                          {item.detail}
                        </p>
                      </div>

                      {/* Unabridged Academic Abstract */}
                      {item.abstract && (
                        <div className="mt-5 rounded-xl border border-white/5 bg-white/[0.02] p-4 md:p-5 text-xs md:text-sm text-neutral-300 leading-relaxed max-h-48 md:max-h-56 overflow-y-auto">
                          <strong className="text-neutral-400 font-semibold mr-1.5">
                            Abstract:
                          </strong>
                          {item.abstract}
                        </div>
                      )}
                    </div>

                    {/* Bottom: Keywords & Visual Stack Cue */}
                    <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap gap-1.5">
                        {item.keywords &&
                          item.keywords.slice(0, 5).map((kw: string, kIdx: number) => (
                            <span
                              key={kIdx}
                              className="text-[10px] md:text-xs px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/5 text-neutral-400"
                            >
                              #{kw}
                            </span>
                          ))}
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-medium">
                        <Layers className="h-3.5 w-3.5 text-royal" />
                        <span>Scroll to explore</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardSwap>
          )}
        </div>
      </div>

      {/* Profiles footer */}
      <div className="mt-12 text-center">
        <p className="text-xs md:text-sm text-neutral-400">
          For citations, metric verification, and preprints, visit the{" "}
          <a
            href="https://scholar.google.com/citations?user=AUZIYQG9NJrrgK6aU-qaoYO7C6WyU9AUT-VQtm1j0RRq3wuVsbb2QSNFs__4tMYIobfaIcJnqMaAMI6nu55CjVsX9vxeJAGGZoC_PuQiP7VuhpoPTdNbyMqaBxaWS5wwmQ891m72nNfsN5muG814blbBrrzUlg=="
            target="_blank"
            rel="noreferrer"
            className="text-white underline hover:text-aqua transition-colors"
          >
            Google Scholar Profile
          </a>{" "}
          or{" "}
          <a
            href="https://www.researchgate.net/profile/Toufique-Gazi"
            target="_blank"
            rel="noreferrer"
            className="text-white underline hover:text-aqua transition-colors"
          >
            ResearchGate Profile
          </a>
          .
        </p>
      </div>
    </section>
  );
};
