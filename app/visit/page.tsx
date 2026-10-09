import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import styles from "../hours/seo.module.css";

const ORIGIN = "https://www.queenswaycannabisdispensary.com";
const PAGE_URL = `${ORIGIN}/visit`;
const TITLE = "Visit Queensway Cannabis Dispensary | 1174 The Queensway, Etobicoke";
const DESCRIPTION = "Directions to Queensway Cannabis Dispensary at 1174 The Queensway, Etobicoke, ON M8Z 1R5. Map link, phone +1 (437) 782-9234, hours and arrival notes. Adults 19+.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: PAGE_URL, type: "website" },
};

const FAQS = [
  { q: "What is the address of Queensway Cannabis Dispensary?", a: "1174 The Queensway, Etobicoke, ON M8Z 1R5." },
  { q: "What are the hours?", a: "Open 24 Hours. See the hours page for day-by-day times." },
  { q: "Who can shop here?", a: "Adults 19+ with valid government-issued photo ID." },
] as const;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Store",
      "@id": "https://www.queenswaycannabisdispensary.com/#store",
      name: "Queensway Cannabis Dispensary",
      url: ORIGIN,
      telephone: "+14377829234",
      address: { "@type": "PostalAddress", streetAddress: "1174 The Queensway", addressLocality: "Etobicoke", addressRegion: "ON", postalCode: "M8Z 1R5", addressCountry: "CA" },
      openingHoursSpecification: [{"@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], "opens": "00:00", "closes": "23:59"}],
    },
    { "@type": "WebPage", "@id": `${PAGE_URL}#webpage`, url: PAGE_URL, name: TITLE, description: DESCRIPTION, about: { "@id": "https://www.queenswaycannabisdispensary.com/#store" } },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: ORIGIN },
        { "@type": "ListItem", position: 2, name: "Visit & Directions", item: PAGE_URL },
      ],
    },
    { "@type": "FAQPage", "@id": `${PAGE_URL}#faq`, mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ],
};

export default function VisitPage() {
  return (
    <main className={styles.main}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <div className={styles.content}>
        <nav className={styles.crumbs} aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><span>Visit &amp; Directions</span></nav>
        <p className={styles.kicker}>Directions · Adults 19+</p>
        <h1 className={styles.title}>Visit Queensway Cannabis Dispensary</h1>
        <p className={styles.lead}>Queensway Cannabis Dispensary is at 1174 The Queensway, Etobicoke, ON M8Z 1R5. Use the map link below for turn-by-turn directions, or call +1 (437) 782-9234 before you head over. Adults 19+ with government-issued photo ID.</p>
        <div className={styles.card}>
          <p><strong>Queensway Cannabis Dispensary</strong></p>
          <p>1174 The Queensway, Etobicoke, ON M8Z 1R5</p>
          <p>Phone: <a href="tel:+14377829234">+1 (437) 782-9234</a></p>
          <p>Open 24 Hours</p>
          <p><a href="https://www.google.com/maps/search/?api=1&query=1174+The+Queensway%2C+Etobicoke%2C+ON+M8Z+1R5" target="_blank" rel="noreferrer">Open in Google Maps</a></p>
        </div>
        <section className={styles.section}>
          <h2>Weekly hours</h2>
          <div className={styles.weekRow}><span>Monday</span><strong>Open 24 hours</strong></div>
          <div className={styles.weekRow}><span>Tuesday</span><strong>Open 24 hours</strong></div>
          <div className={styles.weekRow}><span>Wednesday</span><strong>Open 24 hours</strong></div>
          <div className={styles.weekRow}><span>Thursday</span><strong>Open 24 hours</strong></div>
          <div className={styles.weekRow}><span>Friday</span><strong>Open 24 hours</strong></div>
          <div className={styles.weekRow}><span>Saturday</span><strong>Open 24 hours</strong></div>
          <div className={styles.weekRow}><span>Sunday</span><strong>Open 24 hours</strong></div>
        </section>
        <section className={styles.section}>
          <h2>Getting here</h2>
          <ul className={styles.list}>
            <li>Accessible by local TTC bus routes along The Queensway.</li>
            <li>Street parking and local retail lot parking are available nearby.</li>
            <li>Nearby: The Queensway, Etobicoke, Islington, Royal York, Mimico, Humber Bay, Stonegate-Queensway.</li>
          </ul>
        </section>
        <section className={styles.section}>
          <h2>Plan your visit</h2>
          <div className={styles.ctaRow}>
            <a href="tel:+14377829234" className={`${styles.cta} ${styles.ctaPrimary}`}>Call +1 (437) 782-9234</a>
            <Link href="/" className={styles.cta}>Store menu</Link>
            <Link href="/hours" className={styles.cta}>Store hours</Link>
          </div>
          <p className={styles.note}>Adults 19+. Government-issued photo ID required.</p>
        </section>
        <section className={styles.section}>
          <h2>Visit FAQs</h2>
          {FAQS.map((f) => (
            <details key={f.q} className={styles.faqItem}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </section>
      </div>
      <Footer />
    </main>
  );
}
