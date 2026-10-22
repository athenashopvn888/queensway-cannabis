import type { Nap, ResolvedBanner, ResolvedPage } from "./types.ts";

/**
 * The only store-specific fleet file. Other stores replace this module
 * and leave the rest of app/lib/fleet and app/components/fleet as-is.
 */
export const FLEET_STORE_CODE = "QCD01";
export const FLEET_STORE_NAME = "Queensway Cannabis Dispensary";
export const FLEET_AREA = "Etobicoke";
export const FLEET_DOMAIN = "www.queenswaycannabisdispensary.com";
export const FLEET_DOMAINS = ["www.queenswaycannabisdispensary.com", "queenswaycannabisdispensary.com"] as const;
export const FLEET_ORIGIN = "https://www.queenswaycannabisdispensary.com";

/** Public blob origin. Objects live at /{storeCode}/manifest.json and /{storeCode}/articles/. */
export const FLEET_BLOB_ORIGIN = "https://dhaah0upvlpukv56.public.blob.vercel-storage.com";

export const FLEET_COLORS = {
  banner: "#111827",
  bannerText: "#ffffff",
} as const;

/** Digits or formatted numbers. An article containing any of these is dropped. */
export const FLEET_BLOCKED_PHONES: readonly string[] = [];

export const FLEET_ARTICLES_PATH = "/articles";

/** Page and spot names for the six TV2 category cards. Spot is the card name. */
export const TV2_PAGE = "TV2";
export const TV2_CARDS = [
  "PREROLLS_ADDONS",
  "VAPES",
  "EDIBLES",
  "CONCENTRATES",
  "CIGARETTES",
  "MAGIC",
] as const;

export const TV_PAGE = "TV";
export const TV_FULLSCREEN_SPOTS = [
  "Fullscreen promo 1",
  "Fullscreen promo 2",
  "Fullscreen promo 3",
] as const;

/** Fort York Cannabis takeover defaults: 5s on screen, once a minute, 5s first preview, 650ms slide. */
export const TV_PROMO_SHOW_SECONDS = 5;
export const TV_PROMO_EVERY_MINUTES = 1;
export const TV_PROMO_INITIAL_DELAY_MS = 5_000;
export const TV_PROMO_SLIDE_MS = 650;

export function defaultManifestUrl(storeCode = FLEET_STORE_CODE): string {
  return `${FLEET_BLOB_ORIGIN}/${storeCode}/manifest.json`;
}

export function articlesIndexUrl(storeCode = FLEET_STORE_CODE): string {
  return `${FLEET_BLOB_ORIGIN}/${storeCode}/articles/index.json`;
}

export function articleBodyUrl(slug: string, storeCode = FLEET_STORE_CODE): string {
  return `${FLEET_BLOB_ORIGIN}/${storeCode}/articles/${encodeURIComponent(slug)}.json`;
}

export const CODED_NAP: Nap = {
  name: "Queensway Cannabis Dispensary",
  street: "1174 The Queensway",
  city: "Etobicoke",
  province: "ON",
  postalCode: "M8Z 1R5",
  cityLine: "Etobicoke, ON M8Z 1R5",
  area: "Etobicoke",
  intersection: "The Queensway",
  areaLine: "The Queensway, Etobicoke",
  phoneDisplay: "+1 (437) 782-9234",
  phoneTel: "+14377829234",
  hours: "Open 24 Hours",
  mapsSearchUrl: "https://www.google.com/maps/search/?api=1&query=1174+The+Queensway%2C+Etobicoke%2C+ON+M8Z+1R5",
  mapsEmbedUrl: "https://maps.google.com/maps?q=1174%20The%20Queensway%2C%20Etobicoke%2C%20ON%20M8Z%201R5&z=16&output=embed",
  lat: "43.6223417",
  lng: "-79.5217307",
  schemaName: "Queensway Cannabis Dispensary",
  website: "https://www.queenswaycannabisdispensary.com",
};

export const CODED_BANNERS: ResolvedBanner[] = [
  {
    id: "weed",
    page: "Home",
    spot: "Top banner",
    href: "/exotic-weed",
    categoryName: "Exotic Weed",
    hidden: false,
    render: "image",
    image: "/banners/core-top-weed-tier.webp",
    codedImage: "/banners/core-top-weed-tier.webp",
    alt: `${FLEET_STORE_NAME} in ${FLEET_AREA} — Exotic, Premium and AAA+ top weed tiers`,
    title: `${FLEET_STORE_NAME} top weed tiers — Exotic, Premium and AAA+`,
    textBar: "Top 3 tiers only (Exotic, Premium, AAA+): Buy 2g Get 1g FREE · Buy 3g Get 3g FREE (6g)",
    caption: "Top 3 tiers only (Exotic, Premium, AAA+): Buy 2g Get 1g FREE · Buy 3g Get 3g FREE (6g)",
  },
  {
    id: "vapes",
    page: "Home",
    spot: "Promo banner 2",
    href: "/items/vapes",
    categoryName: "Nicotine Vapes",
    hidden: false,
    render: "image",
    image: "/banners/core-vapes-nicotine-thc.webp",
    codedImage: "/banners/core-vapes-nicotine-thc.webp",
    alt: `${FLEET_STORE_NAME} in ${FLEET_AREA} — nicotine and THC vapes`,
    title: `${FLEET_STORE_NAME} nicotine and THC vapes`,
    textBar: "Nicotine + THC vapes",
    caption: "Nicotine + THC vapes",
  },
  {
    id: "cigarettes",
    page: "Home",
    spot: "Promo banner 3",
    href: "/items/cigarettes",
    categoryName: "Cigarettes",
    hidden: false,
    render: "image",
    image: "/banners/native-cigarette-offer-20260822.webp",
    codedImage: "/banners/native-cigarette-offer-20260822.webp",
    alt: `${FLEET_STORE_NAME} in ${FLEET_AREA} — 2 packs for $5 mix and match and $25 carton cigarette offer`,
    title: `${FLEET_STORE_NAME} cigarette offer — 2 packs $5 mix and match, $25 carton`,
    textBar: "2 PACKS $5 / $25 CARTON",
    caption: "2 PACKS $5 / $25 CARTON",
  },
  {
    id: "premium-cigarettes",
    page: "Home",
    spot: "Promo banner 4",
    href: "/items/cigarettes",
    categoryName: "Premium Cigarettes",
    hidden: false,
    render: "image",
    image: "/banners/core-premium-bb-marlboro-belmont.webp",
    codedImage: "/banners/core-premium-bb-marlboro-belmont.webp",
    alt: `${FLEET_STORE_NAME} in ${FLEET_AREA} — BB Full Flavor and Lights, Marlboro and Belmont premium cigarettes`,
    title: `${FLEET_STORE_NAME} premium cigarettes — BB, Marlboro and Belmont`,
    textBar: "BB Full Flavor + Lights 2 packs $5 · Marlboro & Belmont $10/pack",
    caption: "BB Full Flavor + Lights 2 packs $5 · Marlboro & Belmont $10/pack",
  },
];

export const CODED_PAGES: Record<string, ResolvedPage> = {
  Home: {
    description: "Queensway Cannabis Dispensary is an Etobicoke cannabis store on The Queensway with adult 19+ store info and category browsing for flower, pre-rolls, vapes, edibles, concentrates, and accessories. Open 24 Hours.",
    metaTitle: "",
    metaDescription: "Queensway Cannabis Dispensary is an Etobicoke cannabis store on The Queensway with adult 19+ store info and category browsing for flower, pre-rolls, vapes, edibles, concentrates, and accessories. Open 24 Hours.",
  },
  Contact: {
    description: "Visit Queensway Cannabis Dispensary at 1174 The Queensway, Etobicoke, ON M8Z 1R5. We are open 24 hours a day, 7 days a week. Walk-ins welcome.",
    metaTitle: "Contact Us — Queensway Cannabis Dispensary | 1174 The Queensway, Etobicoke",
    metaDescription: "Visit Queensway Cannabis Dispensary at 1174 The Queensway, Etobicoke, ON M8Z 1R5. We are open 24 hours a day, 7 days a week. Walk-ins welcome.",
  },
};
