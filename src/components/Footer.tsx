import React from "react";
import { ArrowUpRight } from "lucide-react";

const FACEBOOK_URL = "https://www.facebook.com/profile.php?id=61595105723453";

interface FooterProps {
  onNavigateSection: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateSection }) => {
  const handleLink = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    onNavigateSection(id);
  };

  return (
    <footer className="bg-[#080809] border-t border-white/[0.08] text-[#F5F3EF]">
      {/* Final Campaign CTA Banner */}
      <div className="max-w-[1360px] mx-auto px-6 md:px-12 py-20 md:py-28 border-b border-white/[0.06] flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <p className="text-xs tracking-[0.24em] uppercase text-[#C6A87C] mb-3">
            PATRICK HOSKINS · CHICAGO
          </p>
          <h2 className="font-serif-display text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-[#F5F3EF]">
            Acquire the Exceptional.
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <a
            href="#collection"
            onClick={(e) => handleLink(e, "collection")}
            className="px-7 py-3.5 bg-[#F5F3EF] text-[#0A0A0B] text-xs tracking-[0.2em] uppercase font-medium hover:bg-[#C6A87C] transition-colors whitespace-nowrap"
          >
            Explore Collection
          </a>
          <a
            href="#contact"
            onClick={(e) => handleLink(e, "contact")}
            className="px-7 py-3.5 border border-white/20 text-[#F5F3EF] text-xs tracking-[0.2em] uppercase hover:border-[#C6A87C] hover:text-[#C6A87C] transition-colors whitespace-nowrap"
          >
            Private Viewing
          </a>
        </div>
      </div>

      {/* Minimal Luxury Footer Columns */}
      <div className="max-w-[1360px] mx-auto px-6 md:px-12 py-14 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/[0.06]">
          {/* Brand */}
          <div className="md:col-span-5">
            <a
              href="#top"
              onClick={(e) => handleLink(e, "top")}
              className="font-serif-display text-2xl tracking-[0.22em] text-[#F5F3EF] block mb-3"
            >
              PATRICK HOSKINS
            </a>
            <p className="text-xs text-[#F5F3EF]/55 max-w-xs leading-relaxed">
              Haute Horlogerie & Curated Timepieces.
            </p>
          </div>

          {/* Navigation */}
          <div className="md:col-span-4">
            <p className="text-[11px] tracking-[0.2em] uppercase text-[#C6A87C] mb-4">
              Navigation
            </p>
            <ul className="space-y-2.5 text-xs tracking-[0.16em] uppercase text-[#F5F3EF]/70">
              <li>
                <a
                  href="#collection"
                  onClick={(e) => handleLink(e, "collection")}
                  className="hover:text-[#F5F3EF] transition-colors"
                >
                  Collection
                </a>
              </li>
              <li>
                <a
                  href="#craftsmanship"
                  onClick={(e) => handleLink(e, "craftsmanship")}
                  className="hover:text-[#F5F3EF] transition-colors"
                >
                  Craftsmanship
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  onClick={(e) => handleLink(e, "about")}
                  className="hover:text-[#F5F3EF] transition-colors"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  onClick={(e) => handleLink(e, "contact")}
                  className="hover:text-[#F5F3EF] transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Salon Address & Social */}
          <div className="md:col-span-3">
            <p className="text-[11px] tracking-[0.2em] uppercase text-[#C6A87C] mb-4">
              Salon Location
            </p>
            <address className="not-italic text-xs text-[#F5F3EF]/75 leading-relaxed mb-4">
              109 E. Oak St
              <br />
              Chicago, IL 60611
            </address>
            <a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs tracking-[0.16em] uppercase text-[#C6A87C] hover:text-[#F5F3EF] transition-colors"
            >
              <span>Facebook</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Copyright Row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#F5F3EF]/45">
          <p>© {new Date().getFullYear()} Patrick Hoskins. All rights reserved.</p>
          <p className="tracking-[0.14em] uppercase">
            109 E. Oak St, Chicago, IL 60611
          </p>
        </div>
      </div>
    </footer>
  );
};
