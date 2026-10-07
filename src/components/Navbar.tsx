import React, { useEffect, useState } from "react";
import { ShoppingBag, Menu, X } from "lucide-react";

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onNavigateSection: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  onNavigateSection,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 48);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    onNavigateSection(id);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0A0A0B]/88 backdrop-blur-md border-b border-white/[0.08] py-4"
          : "bg-gradient-to-b from-black/70 via-black/25 to-transparent py-6"
      }`}
    >
      <div className="max-w-[1360px] mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          onClick={(e) => handleNavClick(e, "top")}
          className="font-serif-display text-lg md:text-xl tracking-[0.22em] text-[#F5F3EF] hover:text-[#C6A87C] transition-colors duration-200 whitespace-nowrap shrink-0"
        >
          PATRICK HOSKINS
        </a>

        {/* Zone 2: Clean text navigation links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-10 text-xs tracking-[0.18em] uppercase text-[#F5F3EF]/80"
        >
          <a
            href="#collection"
            onClick={(e) => handleNavClick(e, "collection")}
            className="relative py-1 hover:text-[#F5F3EF] transition-colors duration-200 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-[#C6A87C] after:origin-right after:scale-x-0 hover:after:origin-left hover:after:scale-x-100 after:transition-transform after:duration-300 whitespace-nowrap"
          >
            Collection
          </a>
          <a
            href="#craftsmanship"
            onClick={(e) => handleNavClick(e, "craftsmanship")}
            className="relative py-1 hover:text-[#F5F3EF] transition-colors duration-200 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-[#C6A87C] after:origin-right after:scale-x-0 hover:after:origin-left hover:after:scale-x-100 after:transition-transform after:duration-300 whitespace-nowrap"
          >
            Craftsmanship
          </a>
          <a
            href="#about"
            onClick={(e) => handleNavClick(e, "about")}
            className="relative py-1 hover:text-[#F5F3EF] transition-colors duration-200 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-[#C6A87C] after:origin-right after:scale-x-0 hover:after:origin-left hover:after:scale-x-100 after:transition-transform after:duration-300 whitespace-nowrap"
          >
            About
          </a>
          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, "contact")}
            className="relative py-1 hover:text-[#F5F3EF] transition-colors duration-200 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-[#C6A87C] after:origin-right after:scale-x-0 hover:after:origin-left hover:after:scale-x-100 after:transition-transform after:duration-300 whitespace-nowrap"
          >
            Contact
          </a>
        </nav>

        {/* Zone 3: Primary action (Cart + Mobile Trigger) */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onOpenCart}
            aria-label={`Shopping bag with ${cartCount} items`}
            className="group flex items-center gap-2.5 px-3.5 py-2 text-xs tracking-[0.14em] uppercase text-[#F5F3EF] hover:text-[#C6A87C] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C6A87C] whitespace-nowrap shrink-0 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 stroke-[1.5]" />
            <span className="font-tabular text-xs">({cartCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            className="md:hidden p-2 text-[#F5F3EF]/85 hover:text-[#F5F3EF] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C6A87C]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0A0A0B]/95 backdrop-blur-xl border-b border-white/10 px-6 py-8">
          <nav className="flex flex-col gap-5 text-sm tracking-[0.2em] uppercase text-[#F5F3EF]/90">
            <a
              href="#collection"
              onClick={(e) => handleNavClick(e, "collection")}
              className="py-1 hover:text-[#C6A87C] transition-colors"
            >
              Collection
            </a>
            <a
              href="#craftsmanship"
              onClick={(e) => handleNavClick(e, "craftsmanship")}
              className="py-1 hover:text-[#C6A87C] transition-colors"
            >
              Craftsmanship
            </a>
            <a
              href="#about"
              onClick={(e) => handleNavClick(e, "about")}
              className="py-1 hover:text-[#C6A87C] transition-colors"
            >
              About
            </a>
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, "contact")}
              className="py-1 hover:text-[#C6A87C] transition-colors"
            >
              Contact
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};
