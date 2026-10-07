import React, { useState } from "react";
import { X, Plus, Minus, Trash2, CheckCircle2, Shield } from "lucide-react";
import { WatchProduct } from "../lib/watchesData";

export interface CartItem {
  watch: WatchProduct;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (watchId: string, delta: number) => void;
  onRemoveItem: (watchId: string) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const [clientName, setClientName] = useState("");
  const [deliveryPreference, setDeliveryPreference] = useState<
    "salon" | "courier"
  >("salon");
  const [shippingAddress, setShippingAddress] = useState("");
  const [orderConfirmedId, setOrderConfirmedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const subtotal = items.reduce(
    (sum, item) => sum + item.watch.price * item.quantity,
    0
  );

  const handleCompleteAcquisition = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) return;
    const randomId = `PH-${Math.floor(1000 + Math.random() * 9000)}`;
    setOrderConfirmedId(randomId);
    onClearCart();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Bag and Acquisition Drawer"
      className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm"
    >
      <div className="w-full max-w-md bg-[#0E0E10] border-l border-white/10 h-full flex flex-col justify-between overflow-y-auto">
        {/* Drawer Header */}
        <div className="p-6 md:p-8 border-b border-white/[0.08] flex items-center justify-between">
          <div>
            <p className="text-[11px] tracking-[0.22em] uppercase text-[#C6A87C] mb-1">
              PATRICK HOSKINS
            </p>
            <h2 className="font-serif-display text-2xl text-[#F5F3EF] font-normal">
              Acquisition Bag
            </h2>
          </div>

          <button
            type="button"
            onClick={() => {
              setOrderConfirmedId(null);
              onClose();
            }}
            aria-label="Close acquisition bag"
            className="p-2 text-[#F5F3EF]/70 hover:text-[#F5F3EF] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="p-6 md:p-8 flex-1 overflow-y-auto">
          {orderConfirmedId ? (
            <div className="py-10 px-6 bg-[#131315] border border-[#C6A87C]/40 text-center">
              <CheckCircle2 className="w-10 h-10 text-[#C6A87C] mx-auto mb-4 stroke-[1.5]" />
              <p className="font-tabular text-xs tracking-[0.2em] uppercase text-[#C6A87C] mb-2">
                RESERVATION #{orderConfirmedId} CONFIRMED
              </p>
              <h3 className="font-serif-display text-2xl text-[#F5F3EF] mb-3">
                Preparing Your Timepiece
              </h3>
              <p className="text-sm text-[#F5F3EF]/70 font-light leading-relaxed mb-6">
                Thank you, {clientName}. Your selection has been allocated under
                your name at{" "}
                <span className="text-[#F5F3EF]">
                  109 E. Oak St, Chicago, IL 60611
                </span>
                .
              </p>
              <button
                type="button"
                onClick={() => {
                  setOrderConfirmedId(null);
                  onClose();
                }}
                className="w-full py-3 bg-[#C6A87C] text-[#0A0A0B] text-xs tracking-[0.2em] uppercase font-medium hover:bg-[#F5F3EF] transition-colors cursor-pointer"
              >
                Return to Salon
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="py-20 text-center">
              <p className="font-serif-display text-2xl text-[#F5F3EF]/80 mb-2">
                Your Acquisition Bag is Empty
              </p>
              <p className="text-xs text-[#F5F3EF]/50 mb-8">
                Explore the curated Oak Street collection to select a reference.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-white/20 text-xs tracking-[0.18em] uppercase text-[#F5F3EF] hover:border-[#C6A87C] hover:text-[#C6A87C] transition-colors cursor-pointer"
              >
                Explore Timepieces
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map(({ watch, quantity }) => (
                <div
                  key={watch.id}
                  className="flex gap-4 pb-6 border-b border-white/[0.07]"
                >
                  <img
                    src={watch.primaryImage}
                    alt={watch.name}
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 object-cover bg-[#161618] border border-white/10 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-[11px] font-tabular text-[#C6A87C]">
                          {watch.reference}
                        </p>
                        <h3 className="font-serif-display text-lg text-[#F5F3EF] truncate">
                          {watch.name}
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemoveItem(watch.id)}
                        aria-label={`Remove ${watch.name}`}
                        className="text-[#F5F3EF]/40 hover:text-[#F5F3EF] transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="inline-flex items-center border border-white/15 bg-[#0A0A0B]">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(watch.id, -1)}
                          aria-label="Decrease quantity"
                          className="p-1.5 text-[#F5F3EF]/70 hover:text-[#F5F3EF] cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 font-tabular text-xs text-[#F5F3EF]">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(watch.id, 1)}
                          aria-label="Increase quantity"
                          className="p-1.5 text-[#F5F3EF]/70 hover:text-[#F5F3EF] cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-tabular text-sm text-[#F5F3EF]">
                        ${(watch.price * quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Client Allocation & Handover Form */}
              <form
                onSubmit={handleCompleteAcquisition}
                className="pt-4 space-y-4"
              >
                <div>
                  <label className="block text-[11px] tracking-[0.16em] uppercase text-[#F5F3EF]/60 mb-2">
                    Collector Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Enter full name for certificate"
                    className="w-full bg-[#0A0A0B] border border-white/15 px-3.5 py-2.5 text-sm text-[#F5F3EF] placeholder:text-[#F5F3EF]/30 focus:outline-none focus:border-[#C6A87C]"
                  />
                </div>

                <div>
                  <span className="block text-[11px] tracking-[0.16em] uppercase text-[#F5F3EF]/60 mb-2">
                    Handover Method
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setDeliveryPreference("salon")}
                      className={`py-2.5 px-3 text-xs tracking-[0.12em] uppercase border transition-colors cursor-pointer ${
                        deliveryPreference === "salon"
                          ? "border-[#C6A87C] bg-[#C6A87C]/15 text-[#F5F3EF]"
                          : "border-white/15 text-[#F5F3EF]/60"
                      }`}
                    >
                      109 E. Oak St Salon
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeliveryPreference("courier")}
                      className={`py-2.5 px-3 text-xs tracking-[0.12em] uppercase border transition-colors cursor-pointer ${
                        deliveryPreference === "courier"
                          ? "border-[#C6A87C] bg-[#C6A87C]/15 text-[#F5F3EF]"
                          : "border-white/15 text-[#F5F3EF]/60"
                      }`}
                    >
                      Insured Courier
                    </button>
                  </div>
                </div>

                {deliveryPreference === "courier" && (
                  <div>
                    <label className="block text-[11px] tracking-[0.16em] uppercase text-[#F5F3EF]/60 mb-2">
                      Delivery Address *
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      placeholder="Street, City, State, Postal Code"
                      className="w-full bg-[#0A0A0B] border border-white/15 px-3.5 py-2.5 text-sm text-[#F5F3EF] placeholder:text-[#F5F3EF]/30 focus:outline-none focus:border-[#C6A87C]"
                    />
                  </div>
                )}

                <div className="pt-4 border-t border-white/[0.08] space-y-2">
                  <div className="flex justify-between text-xs text-[#F5F3EF]/60">
                    <span>Complimentary Insured Logistics</span>
                    <span className="font-tabular">Included</span>
                  </div>
                  <div className="flex justify-between items-baseline pt-2">
                    <span className="text-xs uppercase tracking-[0.16em] text-[#F5F3EF]/80">
                      Total Allocation
                    </span>
                    <span className="font-tabular text-xl text-[#C6A87C]">
                      ${subtotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-[#C6A87C] text-[#0A0A0B] text-xs tracking-[0.2em] uppercase font-medium hover:bg-[#F5F3EF] transition-colors cursor-pointer"
                >
                  Confirm Private Acquisition
                </button>

                <div className="flex items-center gap-2 text-[11px] text-[#F5F3EF]/50 pt-2">
                  <Shield className="w-3.5 h-3.5 text-[#C6A87C] shrink-0" />
                  <span>
                    Full archival provenance & 5-year mechanical warranty.
                  </span>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
