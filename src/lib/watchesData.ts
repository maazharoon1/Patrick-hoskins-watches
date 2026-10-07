export type WatchCategory =
  | "Classic"
  | "Chronograph"
  | "Automatic"
  | "Dress Watches"
  | "Luxury";

export interface WatchProduct {
  id: string;
  reference: string;
  name: string;
  category: WatchCategory;
  price: number;
  priceFormatted: string;
  shortDescription: string;
  availability: "Available in Oak Street Salon" | "Limited Allocation" | "By Private Commission";
  featured: boolean;
  primaryImage: string;
  secondaryImage: string;
  specs: {
    movement: string;
    caliber: string;
    powerReserve: string;
    case: string;
    dial: string;
    strap: string;
    waterResistance: string;
  };
}

export const WATCH_CATEGORIES: ("All" | WatchCategory)[] = [
  "All",
  "Classic",
  "Chronograph",
  "Automatic",
  "Dress Watches",
  "Luxury",
];

export const WATCH_COLLECTION: WatchProduct[] = [
  {
    id: "ph-chronographe-souverain",
    reference: "REF. PH-109.RG",
    name: "Chronographe Souverain",
    category: "Chronograph",
    price: 48500,
    priceFormatted: "$48,500",
    shortDescription:
      "Column-wheel flyback chronograph housed in hand-finished 18k rose gold with an anthracite sunray dial.",
    availability: "Available in Oak Street Salon",
    featured: true,
    primaryImage: "/src/assets/images/watch_chronograph_gold_1791334881818.jpg",
    secondaryImage: "/src/assets/images/horology_macro_movement_1791334944062.jpg",
    specs: {
      movement: "Manual-winding column-wheel chronograph",
      caliber: "Calibre PH.01 In-House (28,800 vph)",
      powerReserve: "68 Hours",
      case: "40.5 mm · 18k Rose Gold · Sapphire Exhibition Caseback",
      dial: "Anthracite sunray brass with applied 18k gold baton indices",
      strap: "Hand-stitched matte black Mississippiensis alligator",
      waterResistance: "3 ATM (30 Meters)",
    },
  },
  {
    id: "ph-tourbillon-celeste",
    reference: "REF. PH-802.PT",
    name: "Tourbillon Céleste",
    category: "Luxury",
    price: 112000,
    priceFormatted: "$112,000",
    shortDescription:
      "Open-worked flying tourbillon in 950 platinum featuring a hand-engraved midnight blue guilloché dial.",
    availability: "By Private Commission",
    featured: true,
    primaryImage: "/src/assets/images/watch_tourbillon_platinum_1791334897345.jpg",
    secondaryImage: "/src/assets/images/horology_macro_movement_1791334944062.jpg",
    specs: {
      movement: "One-minute flying tourbillon, manual-winding",
      caliber: "Calibre PH.09 Tourbillon (21,600 vph)",
      powerReserve: "80 Hours",
      case: "41.0 mm · 950 Platinum · Domed anti-reflective sapphire",
      dial: "Midnight blue hand-guilloché gold with open escapement bridge",
      strap: "Abyssal navy alligator leather with platinum folding clasp",
      waterResistance: "3 ATM (30 Meters)",
    },
  },
  {
    id: "ph-quantieme-perpetuel",
    reference: "REF. PH-304.WG",
    name: "Quantième Perpétuel",
    category: "Classic",
    price: 64000,
    priceFormatted: "$64,000",
    shortDescription:
      "Ultra-thin perpetual calendar in brushed white gold with warm ivory grand feu enamel and astronomical moonphase.",
    availability: "Limited Allocation",
    featured: true,
    primaryImage: "/src/assets/images/watch_perpetual_classic_1791334913948.jpg",
    secondaryImage: "/src/assets/images/watch_chronograph_gold_1791334881818.jpg",
    specs: {
      movement: "Ultra-thin automatic perpetual calendar with micro-rotor",
      caliber: "Calibre PH.04 Ultra-Fine (8.1 mm profile)",
      powerReserve: "72 Hours",
      case: "39.0 mm · 18k White Gold · Concave polished bezel",
      dial: "Warm champagne-ivory enamel with lapis lazuli moonphase disc",
      strap: "Dark espresso Barénia calfskin with white gold pin buckle",
      waterResistance: "3 ATM (30 Meters)",
    },
  },
  {
    id: "ph-odyssee-automatique",
    reference: "REF. PH-512.TI",
    name: "Odyssée Automatique",
    category: "Automatic",
    price: 34900,
    priceFormatted: "$34,900",
    shortDescription:
      "Architectural grade-5 titanium automatic timepiece accented with a satin champagne gold bezel and matte slate dial.",
    availability: "Available in Oak Street Salon",
    featured: true,
    primaryImage: "/src/assets/images/watch_automatic_diver_1791334928670.jpg",
    secondaryImage: "/src/assets/images/horology_macro_movement_1791334944062.jpg",
    specs: {
      movement: "Self-winding mechanical with 22k gold oscillating weight",
      caliber: "Calibre PH.05 Automatic (28,800 vph)",
      powerReserve: "70 Hours",
      case: "40.0 mm · Brushed Grade-5 Titanium & 18k Champagne Gold",
      dial: "Grained matte charcoal with luminous gold-framed indices",
      strap: "Integrated brushed titanium & vulcanized elastomer lining",
      waterResistance: "10 ATM (100 Meters)",
    },
  },
  {
    id: "ph-heure-du-soir",
    reference: "REF. PH-210.WG",
    name: "L’Heure du Soir",
    category: "Dress Watches",
    price: 29800,
    priceFormatted: "$29,800",
    shortDescription:
      "Pure two-hand dress timepiece with hand-beveled bridges visible through the sapphire exhibition back.",
    availability: "Available in Oak Street Salon",
    featured: false,
    primaryImage: "/src/assets/images/watch_perpetual_classic_1791334913948.jpg",
    secondaryImage: "/src/assets/images/watch_tourbillon_platinum_1791334897345.jpg",
    specs: {
      movement: "Extra-flat manual-winding twin-barrel movement",
      caliber: "Calibre PH.02 Dress (21,600 vph)",
      powerReserve: "65 Hours",
      case: "38.0 mm · 18k White Gold · 6.8 mm thickness",
      dial: "Opaline silvered gold with diamond-polished Dauphine hands",
      strap: "Hand-sewn anthracite alligator leather",
      waterResistance: "3 ATM (30 Meters)",
    },
  },
  {
    id: "ph-rattrapante-oak",
    reference: "REF. PH-901.RG",
    name: "Rattrapante Oak Street Edition",
    category: "Luxury",
    price: 89000,
    priceFormatted: "$89,000",
    shortDescription:
      "Split-seconds monopusher chronograph created exclusively for the 109 E. Oak St salon in numbered editions of ten.",
    availability: "Limited Allocation",
    featured: false,
    primaryImage: "/src/assets/images/watch_chronograph_gold_1791334881818.jpg",
    secondaryImage: "/src/assets/images/watch_automatic_diver_1791334928670.jpg",
    specs: {
      movement: "Manual-winding split-seconds monopusher chronograph",
      caliber: "Calibre PH.11 Rattrapante (412 components)",
      powerReserve: "60 Hours",
      case: "40.0 mm · 18k Rose Gold · Double sapphire crystals",
      dial: "Obsidian black lacquer with rose gold tachymeter scale",
      strap: "Full-cut matte black alligator with rose gold deployant",
      waterResistance: "3 ATM (30 Meters)",
    },
  },
];
