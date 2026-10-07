import React, { useState } from "react";
import { MapPin, ArrowUpRight, CheckCircle2 } from "lucide-react";

const FACEBOOK_URL = "https://www.facebook.com/profile.php?id=61595105723453";

export const ContactSection: React.FC = () => {
  const [fullName, setFullName] = useState("");
  const [contactMethod, setContactMethod] = useState("");
  const [interest, setInterest] = useState("Private Salon Viewing — 109 E. Oak St");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !contactMethod.trim()) return;
    setSubmitted(true);
  };

  return (
    <section
      id="contact"
      className="py-24 md:py-36 bg-[#0E0E10] border-t border-white/[0.06]"
    >
      <div className="max-w-[1360px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Oak Street Salon Location & Architectural Map Card (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <p className="text-xs tracking-[0.24em] uppercase text-[#C6A87C] mb-4">
                04. Private Salon
              </p>
              <h2 className="font-serif-display text-4xl sm:text-5xl text-[#F5F3EF] font-normal leading-tight mb-6">
                Visit Oak Street.
              </h2>
              <p className="text-sm md:text-[15px] text-[#F5F3EF]/70 font-light leading-relaxed mb-10">
                Experience the collection in person at our Chicago Gold Coast
                salon or connect with us directly for private acquisition
                inquiries.
              </p>
            </div>

            {/* Architectural Location Visual Card */}
            <div className="bg-[#111113] border border-white/[0.08] p-7 md:p-8">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <span className="text-[11px] tracking-[0.2em] uppercase text-[#C6A87C] block mb-2">
                    CHICAGO FLAGSHIP SALON
                  </span>
                  <p className="font-serif-display text-2xl text-[#F5F3EF] font-normal">
                    Patrick Hoskins
                  </p>
                  <p className="text-sm text-[#F5F3EF]/80 mt-1">
                    109 E. Oak St, Chicago, IL 60611
                  </p>
                </div>
                <div className="w-10 h-10 border border-[#C6A87C]/35 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-[#C6A87C]" />
                </div>
              </div>

              {/* Minimal Architectural Street Grid Representation */}
              <div
                aria-hidden="true"
                className="relative h-40 w-full bg-[#0A0A0B] border border-white/[0.06] overflow-hidden mb-6 flex items-center justify-center"
              >
                {/* Subtle Gold Coast Grid Lines */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-[#C6A87C]" />
                  <div className="absolute top-1/4 left-0 right-0 h-[1px] bg-white/30" />
                  <div className="absolute top-3/4 left-0 right-0 h-[1px] bg-white/30" />
                  <div className="absolute left-1/3 top-0 bottom-0 w-[1px] bg-white/30" />
                  <div className="absolute left-2/3 top-0 bottom-0 w-[1px] bg-[#C6A87C]" />
                </div>

                {/* Coordinate Pin */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-[#C6A87C] ring-8 ring-[#C6A87C]/15 mb-2" />
                  <span className="font-tabular text-[11px] tracking-[0.18em] uppercase text-[#F5F3EF] bg-[#111113]/90 px-2.5 py-1 border border-white/10">
                    109 E. OAK ST · 60611
                  </span>
                </div>
              </div>

              {/* Official Facebook Channel CTA */}
              <div className="pt-5 border-t border-white/[0.07] flex items-center justify-between gap-4">
                <span className="text-xs tracking-[0.14em] uppercase text-[#F5F3EF]/55">
                  Official Social Channel
                </span>
                <a
                  href={FACEBOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs tracking-[0.18em] uppercase text-[#C6A87C] hover:text-[#F5F3EF] transition-colors whitespace-nowrap"
                >
                  <span>Facebook Profile</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Private Inquiry / Salon Appointment Form (7 cols) */}
          <div className="lg:col-span-7 bg-[#111113] border border-white/[0.08] p-8 md:p-12">
            <h3 className="font-serif-display text-3xl text-[#F5F3EF] font-normal mb-2">
              Request a Private Consultation
            </h3>
            <p className="text-sm text-[#F5F3EF]/60 font-light mb-8">
              Reserve a private viewing at 109 E. Oak St or inquire regarding a
              specific reference.
            </p>

            {submitted ? (
              <div className="py-12 px-6 border border-[#C6A87C]/35 bg-[#0A0A0B] text-center">
                <CheckCircle2 className="w-8 h-8 text-[#C6A87C] mx-auto mb-4 stroke-[1.5]" />
                <h4 className="font-serif-display text-2xl text-[#F5F3EF] mb-2">
                  Consultation Request Registered
                </h4>
                <p className="text-sm text-[#F5F3EF]/70 max-w-md mx-auto mb-6">
                  Thank you, {fullName}. Our Oak Street concierge has recorded
                  your inquiry regarding <span className="text-[#C6A87C]">{interest}</span>.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFullName("");
                    setContactMethod("");
                    setMessage("");
                  }}
                  className="px-6 py-2.5 border border-white/20 text-xs tracking-[0.18em] uppercase text-[#F5F3EF] hover:border-[#C6A87C] transition-colors cursor-pointer"
                >
                  New Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="inquiry-name"
                      className="block text-xs tracking-[0.16em] uppercase text-[#F5F3EF]/65 mb-2.5"
                    >
                      Full Name *
                    </label>
                    <input
                      id="inquiry-name"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Julian Vance"
                      className="w-full bg-[#0A0A0B] border border-white/15 px-4 py-3 text-sm text-[#F5F3EF] placeholder:text-[#F5F3EF]/30 focus:outline-none focus:border-[#C6A87C] transition-colors"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="inquiry-contact"
                      className="block text-xs tracking-[0.16em] uppercase text-[#F5F3EF]/65 mb-2.5"
                    >
                      Preferred Contact Detail *
                    </label>
                    <input
                      id="inquiry-contact"
                      type="text"
                      required
                      value={contactMethod}
                      onChange={(e) => setContactMethod(e.target.value)}
                      placeholder="Your preferred contact method"
                      className="w-full bg-[#0A0A0B] border border-white/15 px-4 py-3 text-sm text-[#F5F3EF] placeholder:text-[#F5F3EF]/30 focus:outline-none focus:border-[#C6A87C] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="inquiry-interest"
                    className="block text-xs tracking-[0.16em] uppercase text-[#F5F3EF]/65 mb-2.5"
                  >
                    Nature of Inquiry
                  </label>
                  <select
                    id="inquiry-interest"
                    value={interest}
                    onChange={(e) => setInterest(e.target.value)}
                    className="w-full bg-[#0A0A0B] border border-white/15 px-4 py-3 text-sm text-[#F5F3EF] focus:outline-none focus:border-[#C6A87C] transition-colors"
                  >
                    <option value="Private Salon Viewing — 109 E. Oak St">
                      Private Salon Viewing — 109 E. Oak St
                    </option>
                    <option value="Timepiece Acquisition Inquiry">
                      Timepiece Acquisition Inquiry
                    </option>
                    <option value="Bespoke Commission & Allocation">
                      Bespoke Commission & Allocation
                    </option>
                    <option value="Collection Valuation & Provenance">
                      Collection Valuation & Provenance
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="inquiry-message"
                    className="block text-xs tracking-[0.16em] uppercase text-[#F5F3EF]/65 mb-2.5"
                  >
                    Reference or Preferred Date
                  </label>
                  <textarea
                    id="inquiry-message"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Specify a timepiece reference or preferred afternoon for your Oak Street appointment..."
                    className="w-full bg-[#0A0A0B] border border-white/15 px-4 py-3 text-sm text-[#F5F3EF] placeholder:text-[#F5F3EF]/30 focus:outline-none focus:border-[#C6A87C] transition-colors resize-none"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <span className="text-xs text-[#F5F3EF]/50">
                    109 E. Oak St, Chicago, IL 60611
                  </span>

                  <button
                    type="submit"
                    className="px-8 py-4 bg-[#C6A87C] text-[#0A0A0B] text-xs tracking-[0.2em] uppercase font-medium hover:bg-[#F5F3EF] transition-colors duration-200 whitespace-nowrap cursor-pointer"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
