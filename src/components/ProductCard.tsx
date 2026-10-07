import React, { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { WatchProduct } from "../lib/watchesData";

interface ProductCardProps {
  watch: WatchProduct;
  onSelectWatch: (watch: WatchProduct) => void;
  onAddToCart: (watch: WatchProduct) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  watch,
  onSelectWatch,
  onAddToCart,
}) => {
  const [imgError, setImgError] = useState(false);
  const [secondaryError, setSecondaryError] = useState(false);

  return (
    <article className="group flex flex-col bg-[#111113] border border-white/[0.07] transition-transform duration-200 hover:-translate-y-0.5">
      {/* Image Showcase Container (70% of card visual weight) */}
      <div
        onClick={() => onSelectWatch(watch)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelectWatch(watch);
          }
        }}
        aria-label={`View details for ${watch.name}`}
        className="relative aspect-[4/3] w-full overflow-hidden bg-[#161618] cursor-pointer"
      >
        {!imgError ? (
          <>
            <img
              src={watch.primaryImage}
              alt={`${watch.name} — ${watch.category} timepiece by Patrick Hoskins`}
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-105"
            />
            {!secondaryError && watch.secondaryImage && (
              <img
                src={watch.secondaryImage}
                alt={`${watch.name} movement detail`}
                referrerPolicy="no-referrer"
                onError={() => setSecondaryError(true)}
                className="absolute inset-0 w-full h-full object-cover object-center opacity-0 group-hover:opacity-35 transition-opacity duration-500 ease-out pointer-events-none"
              />
            )}
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#191817] to-[#0E0E10] p-6 text-center">
            <div className="w-16 h-16 rounded-full border border-[#C6A87C]/40 flex items-center justify-center mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#C6A87C]" />
            </div>
            <span className="font-serif-display text-lg text-[#F5F3EF]">
              {watch.name}
            </span>
          </div>
        )}

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#111113] via-transparent to-transparent opacity-65 pointer-events-none"
        />
      </div>

      {/* Contiguous Card Content */}
      <div className="p-6 md:p-7 flex flex-col flex-1 justify-between gap-5">
        <div>
          {/* Clean Unboxed Metadata with Typographic Separator */}
          <div className="flex items-center gap-2 text-xs text-[#F5F3EF]/55 tracking-[0.12em] uppercase mb-2">
            <span>{watch.category}</span>
            <span aria-hidden="true">·</span>
            <span className="font-tabular">{watch.reference}</span>
          </div>

          <div className="flex items-baseline justify-between gap-4">
            <h3
              onClick={() => onSelectWatch(watch)}
              className="font-serif-display text-2xl text-[#F5F3EF] font-normal tracking-wide group-hover:text-[#C6A87C] transition-colors duration-200 cursor-pointer"
            >
              {watch.name}
            </h3>
            <span className="font-tabular text-[15px] text-[#F5F3EF] shrink-0">
              {watch.priceFormatted}
            </span>
          </div>

          <p className="mt-2.5 text-sm text-[#F5F3EF]/65 font-light line-clamp-2 leading-relaxed">
            {watch.shortDescription}
          </p>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => onSelectWatch(watch)}
            className="inline-flex items-center gap-1.5 text-xs tracking-[0.18em] uppercase text-[#F5F3EF]/85 hover:text-[#C6A87C] transition-colors duration-150 whitespace-nowrap cursor-pointer"
          >
            <span>View Details</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>

          <button
            type="button"
            onClick={() => onAddToCart(watch)}
            className="px-3.5 py-1.5 text-xs tracking-[0.16em] uppercase text-[#C6A87C] hover:text-[#0A0A0B] hover:bg-[#C6A87C] border border-[#C6A87C]/35 transition-colors duration-150 whitespace-nowrap cursor-pointer"
          >
            Acquire
          </button>
        </div>
      </div>
    </article>
  );
};
