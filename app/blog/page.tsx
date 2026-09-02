import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { SEO_PAGES } from "../lib/seoPages";
import styles from "./blog.module.css";

export const metadata: Metadata = {
  title: "Queensway Cannabis Guides",
  description:
    "Store guides and locally useful information from Queensway Cannabis Dispensary in Etobicoke.",
  alternates: {
    canonical: "https://www.queenswaycannabisdispensary.com/blog/",
  },
};

export default function BlogPage() {
  return (
    <main className={styles.page}>
      <Navbar />
      <header className={styles.hero}>
        <p>Queensway Cannabis · Store guides</p>
        <h1>Local information</h1>
        <span>
          Store information, product-category explainers and visit planning for
          adult customers 19+.
        </span>
      </header>

      <section className={styles.grid}>
        <Link href="/resources/weed-flower-guide" className={styles.card}>
          <span className={styles.number}>01</span>
          <span className={styles.icon} aria-hidden="true">🌿</span>
          <h2>Queensway Cannabis Dispensary Weed &amp; Flower Guide</h2>
          <p>Compare five Weed flower collections in Etobicoke.</p>
          <strong>Read guide →</strong>
        </Link>
        {SEO_PAGES.filter((post) => post.slug !== "cheap-weed-york").map((post, index) => (
          <Link href={`/info/${post.slug}`} className={styles.card} key={post.slug}>
            <span className={styles.number}>{String(index + 2).padStart(2, "0")}</span>
            <span className={styles.icon} aria-hidden="true">{post.icon}</span>
            <h2>{post.h1}</h2>
            <p>{post.heroTagline}</p>
            <strong>Read guide →</strong>
          </Link>
        ))}
      </section>

      <Footer />
    </main>
  );
}
