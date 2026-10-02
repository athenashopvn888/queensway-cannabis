import { allFlowers, allItems, type FlowerProduct, type ItemProduct } from "./products";

export type GuideLane = "strain" | "native_cig" | "nic_vape" | "thc_vape";
export const GUIDE_LANES: ReadonlyArray<{ lane: GuideLane; label: string }> = [{ lane: "strain", label: "Strains" }, { lane: "native_cig", label: "Native Cigarettes" }, { lane: "nic_vape", label: "Nicotine Vape" }, { lane: "thc_vape", label: "THC Vape" }];
export type GuideEntry = { slug: string; lane: GuideLane; name: string; title: string; preferredCategoryPath: string; preferredProductSlug?: string; relatedSlugs: string[]; stockSource: "flowers.json" | "items.json" };
type Seed = [string, GuideLane, string, string, string?];

const rows: Seed[] = [
  ["og-kush","strain","OG Kush","/aaa-weed","og-kush-aaa"],
  ["gorilla-glue","strain","Gorilla Glue","/aa-weed","gorilla-glue-4"],
  ["northern-lights","strain","Northern Lights","/budget-weed","northern-lights-shreds"],
  ["master-kush","strain","Master Kush","/aaa-weed","master-kush-aaa"],
  ["pineapple-haze","strain","Pineapple Haze","/premium-weed","pineapple-haze"],
  ["granddaddy-purple","strain","Granddaddy Purple","/budget-weed","granddaddy-purple-shreds"],
  ["peanut-butter-rockstar","strain","Peanut Butter Rockstar","/exotic-weed","peanut-butter-rockstar"],
  ["slurricane","strain","Slurricane","/aa-weed","slurricane"],
  ["island-pink","strain","Island Pink","/premium-weed","island-pink"],
  ["pink-rockstar","strain","Pink Rockstar","/aaa-weed","pink-rockstar"],
  ["red-congolese","strain","Red Congolese","/premium-weed","red-congolese"],
  ["tequila-sunrise","strain","Tequila Sunrise","/exotic-weed","tequila-sunrise-s"],
  ["royal-gorilla","strain","Royal Gorilla","/aa-weed","royal-gorilla"],
  ["diamond-og","strain","Diamond OG","/aa-weed","diamond-og"],
  ["lavender-kush","strain","Lavender Kush","/budget-weed","lavender-kush"],
  ["bb-cigarettes","native_cig","BB","/items/cigarettes","bb-full-carton"],
  ["canadian-classics","native_cig","Canadian Classics","/items/cigarettes","canadian-classics-original"],
  ["nexus-cigarettes","native_cig","Nexus","/items/cigarettes","nexus-full"],
  ["canadian-goose","native_cig","Canadian Goose","/items/cigarettes","canadian-goose-full"],
  ["putters","native_cig","Putters","/items/cigarettes","putters"],
  ["time-cigarettes","native_cig","Time","/items/cigarettes","time-full"],
  ["rolled-gold","native_cig","Rolled Gold","/items/cigarettes","rolled-gold-lights"],
  ["canadian-cigarettes","native_cig","Canadian","/items/cigarettes","canadian-full"],
  ["belmont","native_cig","Belmont","/items/cigarettes","belmont-king-pack-only-new-price"],
  ["backwoods","native_cig","Backwoods","/items/cigarettes","backwoods-assorted-flavors-20-25"],
  ["grabba","native_cig","Grabba","/items/cigarettes","grabba"],
  ["ovns-vape","nic_vape","OVNS","/items/vapes","ovns-10000-5-10k-puffs-nvape"],
  ["geek-bar-vape","nic_vape","Geek Bar","/items/vapes","geek-promax-5-30k-puffs-nvape"],
  ["gas-gang-thc-vape","thc_vape","Gas Gang","/items/vape-disposables","2g-gas-gang-vol3-hybrid-thcvape"],
  ["drizzle-thc-vape","thc_vape","Drizzle","/items/vape-disposables","drizzle-switch-3in1-2g-thcvape"],
];

const titleFor = (name: string, lane: GuideLane) => `${name}${lane === "native_cig" ? " Native Cigarettes" : lane === "nic_vape" ? " Nicotine Vape" : lane === "thc_vape" ? " THC Vape" : ""} at Queensway Cannabis Dispensary | Queensway`;
export const GUIDE_REGISTRY: GuideEntry[] = rows.map(([slug,lane,name,path,product]) => ({ slug, lane, name, title: titleFor(name,lane), preferredCategoryPath: path, preferredProductSlug: product, stockSource: lane === "strain" ? "flowers.json" : "items.json", relatedSlugs: rows.filter((r) => r[1] === lane && r[0] !== slug).slice(0, lane === "strain" ? 4 : 3).map((r) => r[0]) }));
export const getGuide = (slug: string) => GUIDE_REGISTRY.find((guide) => guide.slug === slug);
export const getGuidesByLane = () => GUIDE_LANES.map(({ lane, label }) => ({ lane, label, guides: GUIDE_REGISTRY.filter((guide) => guide.lane === lane) }));
export function resolveGuideProduct(guide: GuideEntry): FlowerProduct | ItemProduct | undefined { const products = guide.lane === "strain" ? allFlowers : allItems; return products.find((product) => product.slug === guide.preferredProductSlug); }
export const getTierGuideLinks = (path: string, limit = 6) => GUIDE_REGISTRY.filter((guide) => guide.lane === "strain" && guide.preferredCategoryPath === path).slice(0,limit);
export function getCategoryGuideGroups(path: string) { if (path === "/items/cigarettes") return [{ label: "Native Cigarettes guides", guides: GUIDE_REGISTRY.filter((g) => g.lane === "native_cig") }]; if (path === "/items/vapes") return [{ label: "Nicotine Vape guides", guides: GUIDE_REGISTRY.filter((g) => g.lane === "nic_vape") }]; if (path === "/items/vape-disposables") return [{ label: "THC Vape guides", guides: GUIDE_REGISTRY.filter((g) => g.lane === "thc_vape") }]; return []; }
