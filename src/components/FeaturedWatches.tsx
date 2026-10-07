import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  WATCH_CATEGORIES,
  WATCH_COLLECTION,
  WatchCategory,
  WatchProduct,
} from "../lib/watchesData";
import { ProductCard } from "./ProductCard";

gsap.registerPlugin(ScrollTrigger);

interface FeaturedWatchesProps {
  onSelectWatch: (watch: WatchProduct) => void;
  onAddToCart: (watch: WatchProduct) => void;
}

export const FeaturedWatches: React.FC<FeaturedWatchesProps> = ({
  onSelectWatch,
  onAddToCart,
}) => {
  const [activeCategory, setActiveCategory] = useState<"All" | WatchCategory>("All");
  const sectionRef = useRef<HTMLElement | null>(null);

  const filteredWatches =
    activeCategory === "All"
      ? WATCH_COLLECTION
      : WATCH_COLLECTION.filter((w) => w.category === activeCategory);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll(".collection-reveal"),
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="collection"
      ref={sectionRef}
      className="py-24 md:py-36 bg-[#0A0A0B] border-t border-white/[0.06]"
    >
      <div className="max-w-[1360px] mx-auto px-6 md:px-12">
        {/* Editorial Header & Interactive Category Filter Bar */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14 md:mb-16">
          <div>
            <p className="collection-reveal text-xs tracking-[0.24em] uppercase text-[#C6A87C] mb-3">
              01. Curated Horology
            </p>
            <h2 className="collection-reveal font-serif-display text-4xl md:text-5xl text-[#F5F3EF] font-normal tracking-tight">
              The Oak Street Collection
            </h2>
          </div>

          {/* Interactive Filter Controls (Functional Buttons) */}
          <div
            role="tablist"
            aria-label="Filter timepieces by category"
            className="collection-reveal flex flex-wrap items-center gap-1.5 p-1 bg-[#131316] border border-white/[0.07]"
          >
            {WATCH_CATEGORIES.map((category) => {
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 text-xs tracking-[0.15em] uppercase transition-colors duration-150 whitespace-nowrap cursor-pointer ${
                    isActive
                      ? "bg-[#C6A87C] text-[#0A0A0B] font-medium"
                      : "text-[#F5F3EF]/65 hover:text-[#F5F3EF]"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3-Column Desktop / 2-Column Tablet Editorial Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 md:gap-8">
          {filteredWatches.map((watch) => (
            <ProductCard
              key={watch.id}
              watch={watch}
              onSelectWatch={onSelectWatch}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
