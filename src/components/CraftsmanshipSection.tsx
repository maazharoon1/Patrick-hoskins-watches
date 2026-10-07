import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const CraftsmanshipSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const imageWrapRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      // Text reveal
      gsap.fromTo(
        el.querySelectorAll(".craft-reveal"),
        { y: 32, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 75%",
          },
        }
      );

      // Subtle parallax & scale transition on macro movement image
      if (imageRef.current && imageWrapRef.current) {
        gsap.fromTo(
          imageRef.current,
          { scale: 1.14, yPercent: -5 },
          {
            scale: 1.0,
            yPercent: 5,
            ease: "none",
            scrollTrigger: {
              trigger: imageWrapRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      }
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="craftsmanship"
      ref={sectionRef}
      className="py-24 md:py-36 bg-[#0E0E10] border-t border-white/[0.06] overflow-hidden"
    >
      <div className="max-w-[1360px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Editorial Headline & Concise Horological Story (5 cols) */}
          <div className="lg:col-span-5">
            <p className="craft-reveal text-xs tracking-[0.24em] uppercase text-[#C6A87C] mb-4">
              02. Haute Horlogerie
            </p>
            <h2 className="craft-reveal font-serif-display text-4xl sm:text-5xl md:text-6xl leading-[1.02] text-[#F5F3EF] font-normal mb-7">
              THE ART
              <br />
              OF PRECISION
            </h2>
            <p className="craft-reveal text-sm md:text-[15px] text-[#F5F3EF]/72 font-light leading-relaxed mb-10">
              Every timepiece selected by Patrick Hoskins is evaluated down to
              the micron—hand-beveled bridges, black-polished escapement
              components, and movements regulated across six positions.
            </p>

            {/* Quantitative Horological Benchmarks */}
            <div className="craft-reveal space-y-6 pt-6 border-t border-white/[0.08]">
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-xs uppercase tracking-[0.16em] text-[#F5F3EF]/55">
                  Chronometric Tolerance
                </span>
                <span className="font-tabular text-sm text-[#C6A87C]">
                  -1 / +2 Seconds Per Day
                </span>
              </div>
              <div className="flex items-baseline justify-between gap-4 border-t border-white/[0.05] pt-4">
                <span className="text-xs uppercase tracking-[0.16em] text-[#F5F3EF]/55">
                  Manual Finishing Per Calibre
                </span>
                <span className="font-tabular text-sm text-[#F5F3EF]">
                  310+ Hours of Hand Anglage
                </span>
              </div>
              <div className="flex items-baseline justify-between gap-4 border-t border-white/[0.05] pt-4">
                <span className="text-xs uppercase tracking-[0.16em] text-[#F5F3EF]/55">
                  Salon Inspection Protocol
                </span>
                <span className="font-tabular text-sm text-[#F5F3EF]">
                  6-Position Acoustic & Pressure Test
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Macro Movement Showcase with Parallax & Masking (7 cols) */}
          <div className="lg:col-span-7">
            <div
              ref={imageWrapRef}
              className="relative aspect-[16/10] w-full overflow-hidden bg-[#141416] border border-white/[0.08]"
            >
              {!imgError ? (
                <img
                  ref={imageRef}
                  src="/src/assets/images/horology_macro_movement_1791334944062.jpg"
                  alt="Macro interior view of a hand-finished mechanical watch movement with gold gear train and ruby jewels"
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover object-center will-change-transform"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1C1915] to-[#0B0B0D] p-12">
                  <span className="font-serif-display text-2xl text-[#C6A87C]">
                    Calibre Architecture · Côtes de Genève
                  </span>
                </div>
              )}

              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-[#0E0E10]/85 via-transparent to-transparent pointer-events-none"
              />

              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-xs text-[#F5F3EF]/75">
                <span>Hand-Engraved Balance Cock & Free-Sprung Gyromax</span>
                <span className="font-tabular text-[#C6A87C]">28,800 VPH</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
