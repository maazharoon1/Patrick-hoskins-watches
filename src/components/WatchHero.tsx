import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  FRAME_COUNT,
  preloadWatchFrames,
  renderWatchFrameOnCanvas,
} from "../lib/watchFrames";
import { ArrowDownRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

interface WatchHeroProps {
  onExploreCollection: () => void;
  onDiscoverStory: () => void;
}

export const WatchHero: React.FC<WatchHeroProps> = ({
  onExploreCollection,
  onDiscoverStory,
}) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const introOverlayRef = useRef<HTMLDivElement | null>(null);
  const finaleOverlayRef = useRef<HTMLDivElement | null>(null);
  const currentFrameRef = useRef<number>(1);
  const rafIdRef = useRef<number | null>(null);

  const [displayFrame, setDisplayFrame] = useState<number>(1);
  const [loadedFrames, setLoadedFrames] = useState<number>(1);

  // Schedule a canvas redraw via requestAnimationFrame
  const requestCanvasDraw = (frameToRender: number) => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
    }
    rafIdRef.current = requestAnimationFrame(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      if (canvas.width !== Math.floor(width * dpr) || canvas.height !== Math.floor(height * dpr)) {
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      renderWatchFrameOnCanvas(ctx, width, height, frameToRender);
      ctx.restore();
    });
  };

  useEffect(() => {
    // Draw frame-001 immediately on mount
    requestCanvasDraw(1);

    // Preload frame-001 first, then progressively preload frames 002..100
    const unsubscribePreload = preloadWatchFrames((loaded) => {
      setLoadedFrames(Math.max(1, loaded));
      requestCanvasDraw(currentFrameRef.current);
    });

    const handleResize = () => {
      requestCanvasDraw(currentFrameRef.current);
    };
    window.addEventListener("resize", handleResize, { passive: true });

    // Set up GSAP ScrollTrigger pinned sequence across 380vh
    const sectionEl = sectionRef.current;
    if (!sectionEl) return;

    const frameState = { frame: 1 };

    const ctx = gsap.context(() => {
      // Subtle initial entrance animation
      if (introOverlayRef.current) {
        gsap.fromTo(
          introOverlayRef.current.querySelectorAll(".hero-reveal"),
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.1,
            stagger: 0.12,
            ease: "power3.out",
          }
        );
      }

      ScrollTrigger.create({
        trigger: sectionEl,
        start: "top top",
        end: "+=360%",
        pin: true,
        scrub: 0.4,
        anticipatePin: 1,
        onUpdate: (self) => {
          const progress = self.progress; // 0 to 1
          const nextFrame = Math.max(
            1,
            Math.min(FRAME_COUNT, Math.round(1 + progress * (FRAME_COUNT - 1)))
          );

          frameState.frame = nextFrame;
          if (currentFrameRef.current !== nextFrame) {
            currentFrameRef.current = nextFrame;
            setDisplayFrame(nextFrame);
            requestCanvasDraw(nextFrame);
          }

          // Animate intro headline fade-out as scrolling begins (0% -> 24% scroll)
          if (introOverlayRef.current) {
            const introProgress = Math.min(1, progress / 0.24);
            const opacity = 1 - introProgress;
            const translateY = -introProgress * 36;
            introOverlayRef.current.style.opacity = String(Math.max(0, opacity));
            introOverlayRef.current.style.transform = `translate3d(0, ${translateY}px, 0)`;
            introOverlayRef.current.style.pointerEvents =
              opacity < 0.15 ? "none" : "auto";
          }

          // Animate finale CTA reveal near the end of the sequence (78% -> 96% scroll)
          if (finaleOverlayRef.current) {
            const finaleProgress = Math.max(
              0,
              Math.min(1, (progress - 0.78) / 0.18)
            );
            const translateY = (1 - finaleProgress) * 28;
            finaleOverlayRef.current.style.opacity = String(finaleProgress);
            finaleOverlayRef.current.style.transform = `translate3d(0, ${translateY}px, 0)`;
            finaleOverlayRef.current.style.pointerEvents =
              finaleProgress > 0.5 ? "auto" : "none";
          }
        },
      });
    }, sectionEl);

    return () => {
      unsubscribePreload();
      window.removeEventListener("resize", handleResize);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
      ctx.revert();
    };
  }, []);

  const paddedFrame = String(displayFrame).padStart(3, "0");

  return (
    <section
      id="top"
      ref={sectionRef}
      aria-label="Patrick Hoskins Scroll-Controlled Watch Showcase"
      className="relative w-full h-screen bg-[#0A0A0B] overflow-hidden select-none"
    >
      {/* Full-Screen Scroll-Scrubbed HTML Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block pointer-events-none"
      />

      {/* Measured contrast scrims so peripheral editorial copy never clashes with watch details */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-[#0A0A0B]/85 via-transparent to-[#0A0A0B]/70 pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-transparent to-[#0A0A0B]/50 pointer-events-none"
      />

      {/* INITIAL EDITORIAL OVERLAY (Fades away smoothly as user scrolls into the 100-frame sequence) */}
      <div
        ref={introOverlayRef}
        className="relative z-10 w-full h-full max-w-[1360px] mx-auto px-6 md:px-12 flex flex-col justify-between pt-28 pb-12 md:pt-32 md:pb-16 will-change-transform"
      >
        <div className="max-w-md">
          <p className="hero-reveal text-[11px] tracking-[0.28em] uppercase text-[#C6A87C] mb-4">
            PATRICK HOSKINS
          </p>
          <h1 className="hero-reveal font-serif-display text-5xl sm:text-6xl md:text-7xl leading-[0.96] tracking-tight text-[#F5F3EF] font-normal">
            TIME,
            <br />
            REFINED.
          </h1>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-sm">
            <p className="hero-reveal text-sm md:text-[15px] leading-relaxed text-[#F5F3EF]/78 font-light mb-7">
              A curated selection of exceptional timepieces defined by
              precision, craftsmanship and timeless design.
            </p>
            <div className="hero-reveal flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onExploreCollection}
                className="group inline-flex items-center gap-2.5 px-6 py-3.5 bg-[#F5F3EF] text-[#0A0A0B] text-xs tracking-[0.2em] uppercase font-medium hover:bg-[#C6A87C] hover:text-[#0A0A0B] transition-colors duration-200 whitespace-nowrap cursor-pointer"
              >
                <span>EXPLORE COLLECTION</span>
                <ArrowDownRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
              </button>
              <button
                type="button"
                onClick={onDiscoverStory}
                className="px-6 py-3.5 border border-white/20 text-[#F5F3EF] text-xs tracking-[0.2em] uppercase hover:border-[#C6A87C] hover:text-[#C6A87C] transition-colors duration-200 whitespace-nowrap cursor-pointer"
              >
                DISCOVER
              </button>
            </div>
          </div>

          <div className="hero-reveal hidden sm:flex flex-col items-end text-right">
            <span className="text-[11px] tracking-[0.22em] uppercase text-[#F5F3EF]/50 mb-1">
              SCROLL TO ARTICULATE
            </span>
            <span className="font-tabular text-xs text-[#C6A87C]">
              109 E. OAK ST · CHICAGO
            </span>
          </div>
        </div>
      </div>

      {/* FINALE OVERLAY (Reveals near frame-100 as the scroll sequence completes) */}
      <div
        ref={finaleOverlayRef}
        style={{ opacity: 0, pointerEvents: "none" }}
        className="absolute inset-x-0 bottom-14 md:bottom-20 z-20 max-w-[1360px] mx-auto px-6 md:px-12 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 will-change-transform"
      >
        <div>
          <p className="text-[11px] tracking-[0.26em] uppercase text-[#C6A87C] mb-2">
            CALIBRE PH.01 — SEQUENCE COMPLETE
          </p>
          <h2 className="font-serif-display text-3xl md:text-4xl text-[#F5F3EF] font-normal">
            Engineered for Eternity.
          </h2>
        </div>

        <button
          type="button"
          onClick={onExploreCollection}
          className="px-7 py-3.5 bg-[#C6A87C] text-[#0A0A0B] text-xs tracking-[0.2em] uppercase font-medium hover:bg-[#F5F3EF] transition-colors duration-200 whitespace-nowrap cursor-pointer"
        >
          EXPLORE COLLECTION
        </button>
      </div>

      {/* Minimal Scrub Progress Rail (Bottom Edge) */}
      <div className="absolute bottom-5 left-6 right-6 md:left-12 md:right-12 z-20 flex items-center justify-between text-[11px] text-[#F5F3EF]/45 pointer-events-none">
        <div className="flex items-center gap-3">
          <span className="font-tabular text-[#F5F3EF]/75">
            FRAME {paddedFrame} / 100
          </span>
          {loadedFrames < FRAME_COUNT && (
            <span className="hidden sm:inline text-[#F5F3EF]/35 font-tabular">
              · STREAMING SEQUENCE ({loadedFrames}%)
            </span>
          )}
        </div>

        <div className="w-28 sm:w-44 h-[1px] bg-white/12 relative overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-[#C6A87C] transition-transform duration-75 origin-left"
            style={{
              width: "100%",
              transform: `scaleX(${displayFrame / FRAME_COUNT})`,
            }}
          />
        </div>
      </div>
    </section>
  );
};
