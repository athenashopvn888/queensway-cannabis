import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brandBlock}>
          <img src="/storeFavicon.webp" alt="" className={styles.logo} />
          <div>
            <strong>QUEENSWAY</strong>
            <span>CANNABIS · ETOBICOKE</span>
          </div>
          <p>
            Adult-use cannabis retail at 1174 The Queensway in Etobicoke.
            Open 24 hours a day, 7 days a week.
          </p>
        </div>

        <div className={styles.column}>
          <h2>Browse</h2>
          <Link href="/menu">Full menu</Link>
          <Link href="/exotic-weed">Weed flower</Link>
          <Link href="/items/prerolls">Pre-rolls</Link>
          <Link href="/items/edibles">Edibles</Link>
          <Link href="/items/vape-disposables">THC Vape</Link>
          <Link href="/items/vapes">Nicotine Vape</Link>
          <Link href="/items/concentrates">Concentrates</Link>
          <Link href="/resources/weed-flower-guide">Weed &amp; flower guide</Link>
        </div>

        <div className={styles.column}>
          <h2>Visit</h2>
          <Link href="/faq">FAQ</Link>
          <Link href="/contact">Contact and directions</Link>
          <Link href="/blog">Blog</Link>
          <a href="tel:+14377829234">(437) 782-9234</a>
          <span>1174 The Queensway</span>
          <span>Etobicoke, ON M8Z 1R5</span>
        </div>
      </div>

      <div className={styles.bottom}>
        <span>© {new Date().getFullYear()} Queensway Cannabis Dispensary</span>
        <span>19+ · Valid government-issued ID required</span>
      </div>
    </footer>
  );
}
