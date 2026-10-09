import { getLiveMenu } from "../lib/liveMenu";
import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import styles from "./menu.module.css";

// Products come from the same loader as /api/tv-data on every request.
export const dynamic = "force-dynamic";

// ONE product loader (same as /api/tv-data), filled per request by __loadMenuData(). Grok 2026-10-09.
let __menu!: Awaited<ReturnType<typeof getLiveMenu>>;
async function __loadMenuData(): Promise<void> {
  __menu = await getLiveMenu();
  categories = __compute_categories();
}

export const metadata: Metadata = {
  title: "Cannabis Menu in Etobicoke",
  description:
    "Browse flower, pre-rolls, edibles, vapes, concentrates and accessories at Queensway Cannabis Dispensary in Etobicoke.",
  alternates: {
    canonical: "https://www.queenswaycannabisdispensary.com/menu/",
  },
};

function __compute_categories() {
  return [
  {
    name: "Weed Flower",
    detail: "Exotic to budget · five tiers",
    href: "/exotic-weed",
    count: __menu.flowers.length,
    image: __menu.flowers.find((product) => product.image)?.image,
  },
  {
    name: "Pre-Rolls",
    detail: "Singles, packs and infused",
    href: "/items/prerolls",
    count: __menu.items.filter((item) => item.category === "PREROLLS").length,
    image: __menu.items.find((item) => item.category === "PREROLLS" && item.image)?.image,
  },
  {
    name: "Concentrates",
    detail: "Hash, shatter and extracts",
    href: "/items/concentrates",
    count: __menu.items.filter((item) => item.category === "CONCENTRATES").length,
    image: __menu.items.find((item) => item.category === "CONCENTRATES" && item.image)?.image,
  },
  {
    name: "Edibles",
    detail: "Gummies, chocolate and drinks",
    href: "/items/edibles",
    count: __menu.items.filter((item) => item.category === "EDIBLES").length,
    image: __menu.items.find((item) => item.category === "EDIBLES" && item.image)?.image,
  },
  {
    name: "THC Vape",
    detail: "Cannabis vape products",
    href: "/items/vape-disposables",
    count: __menu.items.filter((item) => item.category === "VAPE DISPOSABLE").length,
    image: __menu.items.find((item) => item.category === "VAPE DISPOSABLE" && item.image)?.image,
  },
  {
    name: "Nicotine Vape",
    detail: "Nicotine products for adults 19+",
    href: "/items/vapes",
    count: __menu.items.filter((item) => item.category === "VAPE PENS").length,
    image: __menu.items.find((item) => item.category === "VAPE PENS" && item.image)?.image,
  },
  {
    name: "Accessories",
    detail: "Add-ons and essentials",
    href: "/items/add-ons",
    count: __menu.items.filter((item) => item.category === "ADD ONS").length,
    image: __menu.items.find((item) => item.category === "ADD ONS" && item.image)?.image,
  },
];
}
let categories!: ReturnType<typeof __compute_categories>;

export default async function MenuPage() {
    await __loadMenuData();
  return (
    <main className={styles.page}>
      <Navbar />

      <section className={styles.hero}>
        <p className={styles.eyebrow}>Queensway Cannabis · Etobicoke</p>
        <h1>Browse the menu</h1>
        <p>
          Browse current categories, then open a product page for details.
          Availability is filtered from the store’s latest ONHAND feed.
        </p>
      </section>

      <section className={styles.categories} aria-label="Product categories">
        {categories.map((category) => (
          <Link href={category.href} className={styles.card} key={category.name}>
            <div className={styles.media}>
              {category.image ? (
                <img src={category.image} alt="" />
              ) : (
                <span aria-hidden="true">Q</span>
              )}
              <div className={styles.gradient} />
            </div>
            <span className={styles.count}>{category.count} items</span>
            <div className={styles.copy}>
              <h2>{category.name}</h2>
              <p>{category.detail}</p>
            </div>
            <span className={styles.arrow} aria-hidden="true">→</span>
          </Link>
        ))}
      </section>

      <section className={styles.tiers}>
        <div>
          <p className={styles.eyebrow}>Flower tiers</p>
          <h2>Choose your tier</h2>
        </div>
        <nav>
          <Link href="/exotic-weed">Exotic Weed</Link>
          <Link href="/premium-weed">Premium Weed</Link>
          <Link href="/aaa-weed">AAA+ Weed</Link>
          <Link href="/aa-weed">AA Weed</Link>
          <Link href="/budget-weed">Budget Weed</Link>
        </nav>
      </section>

      <Footer />
    </main>
  );
}
