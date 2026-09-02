import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import styles from "../../info/[seoPage]/seo.module.css";

export const metadata: Metadata = {
  title: {
    absolute:
      "Weed & Cannabis Flower Guide Etobicoke | Queensway Cannabis Dispensary",
  },
  description:
    "Explore Exotic Weed, Premium Weed, AAA+ Weed, AA Weed and Budget Weed from Queensway Cannabis Dispensary in Etobicoke.",
  alternates: {
    canonical:
      "https://www.queenswaycannabisdispensary.com/resources/weed-flower-guide",
  },
};

const tiers = [
  ["Explore Exotic Weed", "/exotic-weed"],
  ["Explore Premium Weed", "/premium-weed"],
  ["Explore AAA+ Weed", "/aaa-weed"],
  ["Explore AA Weed", "/aa-weed"],
  ["Explore Budget Weed", "/budget-weed"],
] as const;

export default function WeedFlowerGuidePage() {
  return (
    <main className={styles.main}>
      <Navbar />
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.heroIcon} aria-hidden="true">🌿</span>
          <h1 className={styles.heroH1}>
            Queensway Cannabis Dispensary Weed &amp; Flower Guide
          </h1>
          <p className={styles.heroTagline}>
            Compare five Weed flower collections in Etobicoke.
          </p>
        </div>
      </section>

      <section className={styles.content}>
        <div className={styles.container}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Compare Weed flower collections</h2>
            <p className={styles.sectionBody}>
              Queensway Cannabis Dispensary brings five Weed flower collections
              together for shoppers who want to compare different parts of the
              Cannabis Flower selection: Exotic Weed, Premium Weed, AAA+ Weed,
              AA Weed and Budget Weed.
            </p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Explore each Weed collection</h2>
            <div className={styles.tierGrid}>
              {tiers.map(([label, href]) => (
                <Link key={href} href={href} className={styles.tierCard}>
                  <div className={styles.tierLabel}>{label}</div>
                  <p className={styles.tierDesc}>
                    Review the products and information presented in this
                    Queensway Cannabis Dispensary flower collection.
                  </p>
                </Link>
              ))}
            </div>
          </div>

          <div className={styles.section}>
            <Link href="/weed-dispensary-etobicoke" className={styles.tierCard}>
              <div className={styles.tierLabel}>
                Explore Queensway Cannabis Dispensary Weed in Etobicoke
              </div>
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
