import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const EditorialSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll(".editorial-reveal"),
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.95,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 78%",
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-24 md:py-36 bg-[#0A0A0B] border-t border-white/[0.06]"
    >
      <div className="max-w-[1360px] mx-auto px-6 md:px-12">
        {/* Part 1: Concise Editorial About Statement */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-24 md:mb-32">
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#131315] border border-white/[0.08]">
              {!imgError ? (
                <img
                  src="/src/assets/images/watch_tourbillon_platinum_1791334897345.jpg"
                  alt="Patrick Hoskins curated platinum tourbillon timepiece"
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover object-center"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#141416]">
                  <span className="font-serif-display text-xl text-[#C6A87C]">
                    Patrick Hoskins · 109 E. Oak St
                  </span>
                </div>
              )}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B]/70 via-transparent to-transparent"
              />
              <div className="absolute bottom-5 left-6 text-xs tracking-[0.18em] uppercase text-[#F5F3EF]/80">
                109 E. Oak St · Gold Coast, Chicago
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 order-1 lg:order-2">
            <p className="editorial-reveal text-xs tracking-[0.24em] uppercase text-[#C6A87C] mb-4">
              03. The Maison & Philosophy
            </p>
            <h2 className="editorial-reveal font-serif-display text-4xl sm:text-5xl text-[#F5F3EF] font-normal leading-[1.08] mb-6">
              Curated for Those Who Measure Life in Generations.
            </h2>
            <p className="editorial-reveal text-sm md:text-[15px] text-[#F5F3EF]/72 font-light leading-relaxed mb-8">
              Situated at 109 E. Oak St in Chicago, Patrick Hoskins brings
              together independent horological masterworks and rare mechanical
              complications. Our mandate is singular: uncompromising precision,
              enduring craftsmanship, and timeless architectural form.
            </p>

            {/* Four Pillars: Precision · Craftsmanship · Timeless Design · Curation */}
            <div className="editorial-reveal grid grid-cols-2 gap-6 pt-6 border-t border-white/[0.08]">
              <div>
                <h3 className="font-serif-display text-xl text-[#F5F3EF] font-normal mb-1">
                  01. Precision
                </h3>
                <p className="text-xs text-[#F5F3EF]/58 leading-relaxed">
                  In-house regulated mechanical calibres verified for long-term
                  isochronism.
                </p>
              </div>
              <div>
                <h3 className="font-serif-display text-xl text-[#F5F3EF] font-normal mb-1">
                  02. Craftsmanship
                </h3>
                <p className="text-xs text-[#F5F3EF]/58 leading-relaxed">
                  Grand feu enameling, hand-guilloché dials, and mirror-polished
                  tourbillon cages.
                </p>
              </div>
              <div>
                <h3 className="font-serif-display text-xl text-[#F5F3EF] font-normal mb-1">
                  03. Timeless Design
                </h3>
                <p className="text-xs text-[#F5F3EF]/58 leading-relaxed">
                  Restrained case proportions that transcend seasonal ornament.
                </p>
              </div>
              <div>
                <h3 className="font-serif-display text-xl text-[#F5F3EF] font-normal mb-1">
                  04. Curation
                </h3>
                <p className="text-xs text-[#F5F3EF]/58 leading-relaxed">
                  Each reference is individually vetted and accompanied by full
                  provenance archival documentation.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Part 2: Short Collector Perspectives (Social Proof adjacent to Curation Claim) */}
        <div className="pt-16 border-t border-white/[0.07]">
          <p className="editorial-reveal text-xs tracking-[0.22em] uppercase text-[#C6A87C] mb-10">
            Collector Perspectives
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <blockquote className="editorial-reveal bg-[#111113] border border-white/[0.06] p-8 flex flex-col justify-between">
              <p className="font-serif-display text-2xl text-[#F5F3EF]/90 italic font-normal leading-snug mb-6">
                “After searching Geneva and New York for an unpolished rose gold
                flyback chronograph, Patrick Hoskins sourced and authenticated
                my reference on Oak Street within three weeks.”
              </p>
              <footer className="flex items-center gap-2 text-xs text-[#F5F3EF]/55 tracking-[0.1em] uppercase">
                <span className="text-[#F5F3EF]">Julian Vance</span>
                <span aria-hidden="true">·</span>
                <span>Managing Partner, Vance Capital (Chicago)</span>
              </footer>
            </blockquote>

            <blockquote className="editorial-reveal bg-[#111113] border border-white/[0.06] p-8 flex flex-col justify-between">
              <p className="font-serif-display text-2xl text-[#F5F3EF]/90 italic font-normal leading-snug mb-6">
                “The private viewing experience at 109 E. Oak St is unmatched in
                the Midwest. Every technical specification and archival extract
                was prepared before my arrival.”
              </p>
              <footer className="flex items-center gap-2 text-xs text-[#F5F3EF]/55 tracking-[0.1em] uppercase">
                <span className="text-[#F5F3EF]">Dr. Eleanor Sterling</span>
                <span aria-hidden="true">·</span>
                <span>Horological Collector & Patron (Lake Forest)</span>
              </footer>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
};
