/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Navbar } from "./components/Navbar";
import { WatchHero } from "./components/WatchHero";
import { FeaturedWatches } from "./components/FeaturedWatches";
import { CraftsmanshipSection } from "./components/CraftsmanshipSection";
import { EditorialSection } from "./components/EditorialSection";
import { ContactSection } from "./components/ContactSection";
import { Footer } from "./components/Footer";
import { ProductDetailModal } from "./components/ProductDetailModal";
import { CartDrawer, CartItem } from "./components/CartDrawer";
import { WatchProduct } from "./lib/watchesData";

export default function App() {
  const [selectedWatch, setSelectedWatch] = useState<WatchProduct | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleAddToCart = (watch: WatchProduct) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.watch.id === watch.id);
      if (existing) {
        return prev.map((item) =>
          item.watch.id === watch.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { watch, quantity: 1 }];
    });
  };

  const handleBuyNow = (watch: WatchProduct) => {
    handleAddToCart(watch);
    setSelectedWatch(null);
    setCartOpen(true);
  };

  const handleUpdateQuantity = (watchId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.watch.id === watchId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (watchId: string) => {
    setCartItems((prev) => prev.filter((item) => item.watch.id !== watchId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const scrollToSection = (sectionId: string) => {
    if (sectionId === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const target = document.getElementById(sectionId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#F5F3EF] flex flex-col">
      {/* Minimal 3-Zone Luxury Navigation Bar */}
      <Navbar
        cartCount={totalCartCount}
        onOpenCart={() => setCartOpen(true)}
        onNavigateSection={scrollToSection}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* 1. Scroll-Driven 100-Frame Cloudinary Watch Hero */}
        <WatchHero
          onExploreCollection={() => scrollToSection("collection")}
          onDiscoverStory={() => scrollToSection("craftsmanship")}
        />

        {/* 2. Featured Timepieces & Curated Collection Grid */}
        <FeaturedWatches
          onSelectWatch={(watch) => setSelectedWatch(watch)}
          onAddToCart={(watch) => {
            handleAddToCart(watch);
            setCartOpen(true);
          }}
        />

        {/* 3. Craftsmanship / Macro Horological Detail Section */}
        <CraftsmanshipSection />

        {/* 4. Editorial Brand Statement & Collector Perspectives */}
        <EditorialSection />

        {/* 5. Oak Street Salon Contact & Private Inquiry */}
        <ContactSection />
      </main>

      {/* 6. Final CTA & Minimal Luxury Footer */}
      <Footer onNavigateSection={scrollToSection} />

      {/* Contiguous Product Detail View (PDP) */}
      <ProductDetailModal
        watch={selectedWatch}
        onClose={() => setSelectedWatch(null)}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        onSelectWatch={(watch) => setSelectedWatch(watch)}
      />

      {/* Slide-Over Acquisition Bag & Checkout Drawer */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />
    </div>
  );
}
