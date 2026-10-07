import React, { useEffect, useState } from "react";
import { X, Check, ShieldCheck, ArrowRight } from "lucide-react";
import { WATCH_COLLECTION, WatchProduct } from "../lib/watchesData";

interface ProductDetailModalProps {
  watch: WatchProduct | null;
  onClose: () => void;
  onAddToCart: (watch: WatchProduct) => void;
  onBuyNow: (watch: WatchProduct) => void;
  onSelectWatch: (watch: WatchProduct) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  watch,
  onClose,
  onAddToCart,
  onBuyNow,
  onSelectWatch,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState<0 | 1>(0);
  const [addedFeedback, setAddedFeedback] = useState(false);

  useEffect(() => {
    setActiveImageIndex(0);
    setAddedFeedback(false);
  }, [watch]);

  useEffect(() => {
    if (!watch) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [watch, onClose]);

  if (!watch) return null;

  const images = [watch.primaryImage, watch.secondaryImage];
  const relatedWatches = WATCH_COLLECTION.filter((w) => w.id !== watch.id).slice(
    0,
    3
  );

  const handleAdd = () => {
    onAddToCart(watch);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1800);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdp-watch-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-[#0A0A0B]/95 backdrop-blur-xl animate-fadeIn"
    >
      <div className="min-h-screen max-w-[1360px] mx-auto px-6 md:px-12 py-8 md:py-12">
        {/* Top Bar inside Detail View */}
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-white/[0.08]">
          <div className="flex items-center gap-2 text-xs tracking-[0.18em] uppercase text-[#F5F3EF]/60">
            <span>Patrick Hoskins</span>
            <span aria-hidden="true">·</span>
            <span>{watch.category}</span>
            <span aria-hidden="true">·</span>
            <span className="font-tabular text-[#C6A87C]">{watch.reference}</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close timepiece specification view"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs tracking-[0.18em] uppercase text-[#F5F3EF]/80 hover:text-[#C6A87C] border border-white/15 hover:border-[#C6A87C] transition-colors duration-150 cursor-pointer"
          >
            <span>Close</span>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Contiguous Purchase Module: Sticky Gallery Left, Purchase & Specs Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left: Large Product Gallery (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="relative aspect-[4/3] w-full bg-[#131315] border border-white/[0.07] overflow-hidden">
              <img
                src={images[activeImageIndex]}
                alt={`${watch.name} view ${activeImageIndex + 1}`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center transition-all duration-500"
              />
            </div>

            {/* Gallery Thumbnails */}
            <div className="grid grid-cols-2 gap-4">
              {images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx as 0 | 1)}
                  className={`relative aspect-[16/9] overflow-hidden border transition-all cursor-pointer ${
                    activeImageIndex === idx
                      ? "border-[#C6A87C]"
                      : "border-white/10 opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`${watch.name} thumbnail ${idx + 1}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center"
                  />
                  <span className="absolute bottom-2 left-3 text-[11px] tracking-[0.16em] uppercase text-[#F5F3EF]/80 bg-black/60 px-2 py-0.5">
                    {idx === 0 ? "Dial & Case" : "Calibre Architecture"}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Right: Contiguous Purchase & Specification Module (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-[#111113] border border-white/[0.08] p-7 md:p-9">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#C6A87C] tracking-[0.16em] uppercase mb-3">
                <span>{watch.availability}</span>
                <span aria-hidden="true">·</span>
                <span>109 E. Oak St</span>
              </div>

              <h1
                id="pdp-watch-title"
                className="font-serif-display text-3xl md:text-4xl text-[#F5F3EF] font-normal mb-2"
              >
                {watch.name}
              </h1>

              <p className="font-tabular text-2xl text-[#F5F3EF] mb-6">
                {watch.priceFormatted}
              </p>

              <p className="text-sm md:text-[15px] text-[#F5F3EF]/75 font-light leading-relaxed mb-8">
                {watch.shortDescription}
              </p>

              {/* Primary CTAs: Add to Cart & Buy Now */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-8">
                <button
                  type="button"
                  onClick={handleAdd}
                  className="w-full py-3.5 px-5 border border-[#C6A87C] text-[#F5F3EF] hover:bg-[#C6A87C]/15 text-xs tracking-[0.2em] uppercase font-medium transition-colors duration-150 flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
                >
                  {addedFeedback ? (
                    <>
                      <Check className="w-4 h-4 text-[#C6A87C]" />
                      <span>Added to Bag</span>
                    </>
                  ) : (
                    <span>Add to Cart</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => onBuyNow(watch)}
                  className="w-full py-3.5 px-5 bg-[#C6A87C] text-[#0A0A0B] hover:bg-[#F5F3EF] text-xs tracking-[0.2em] uppercase font-medium transition-colors duration-150 flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
                >
                  <span>Buy Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Technical Horological Specifications */}
              <div className="border-t border-white/[0.08] pt-6 space-y-3.5 text-sm">
                <div className="flex justify-between gap-4 py-1 border-b border-white/[0.05]">
                  <span className="text-[#F5F3EF]/50 text-xs uppercase tracking-[0.14em]">
                    Movement
                  </span>
                  <span className="text-[#F5F3EF] text-right font-light">
                    {watch.specs.movement}
                  </span>
                </div>
                <div className="flex justify-between gap-4 py-1 border-b border-white/[0.05]">
                  <span className="text-[#F5F3EF]/50 text-xs uppercase tracking-[0.14em]">
                    Calibre
                  </span>
                  <span className="text-[#F5F3EF] text-right font-tabular text-xs">
                    {watch.specs.caliber}
                  </span>
                </div>
                <div className="flex justify-between gap-4 py-1 border-b border-white/[0.05]">
                  <span className="text-[#F5F3EF]/50 text-xs uppercase tracking-[0.14em]">
                    Case
                  </span>
                  <span className="text-[#F5F3EF] text-right font-light">
                    {watch.specs.case}
                  </span>
                </div>
                <div className="flex justify-between gap-4 py-1 border-b border-white/[0.05]">
                  <span className="text-[#F5F3EF]/50 text-xs uppercase tracking-[0.14em]">
                    Dial
                  </span>
                  <span className="text-[#F5F3EF] text-right font-light">
                    {watch.specs.dial}
                  </span>
                </div>
                <div className="flex justify-between gap-4 py-1 border-b border-white/[0.05]">
                  <span className="text-[#F5F3EF]/50 text-xs uppercase tracking-[0.14em]">
                    Strap
                  </span>
                  <span className="text-[#F5F3EF] text-right font-light">
                    {watch.specs.strap}
                  </span>
                </div>
                <div className="flex justify-between gap-4 py-1">
                  <span className="text-[#F5F3EF]/50 text-xs uppercase tracking-[0.14em]">
                    Power Reserve
                  </span>
                  <span className="text-[#F5F3EF] text-right font-tabular text-xs">
                    {watch.specs.powerReserve} · {watch.specs.waterResistance}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-7 pt-5 border-t border-white/[0.06] flex items-center gap-3 text-xs text-[#F5F3EF]/55">
              <ShieldCheck className="w-4 h-4 text-[#C6A87C] shrink-0" />
              <span>
                Accompanied by Patrick Hoskins Certificate of Origin & 5-Year
                Horological Guarantee.
              </span>
            </div>
          </div>
        </div>

        {/* Related Timepieces */}
        <div className="mt-16 pt-12 border-t border-white/[0.08]">
          <h2 className="font-serif-display text-2xl text-[#F5F3EF] font-normal mb-8">
            Companion Timepieces
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedWatches.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectWatch(item)}
                className="group bg-[#111113] border border-white/[0.06] p-4 flex items-center gap-4 hover:border-[#C6A87C]/50 transition-colors cursor-pointer"
              >
                <img
                  src={item.primaryImage}
                  alt={item.name}
                  referrerPolicy="no-referrer"
                  className="w-20 h-20 object-cover bg-[#18181B] shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-[11px] tracking-[0.14em] uppercase text-[#F5F3EF]/50">
                    {item.category}
                  </p>
                  <p className="font-serif-display text-lg text-[#F5F3EF] group-hover:text-[#C6A87C] transition-colors truncate">
                    {item.name}
                  </p>
                  <p className="font-tabular text-xs text-[#F5F3EF]/80 mt-0.5">
                    {item.priceFormatted}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
