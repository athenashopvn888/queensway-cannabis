"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Navbar.module.css";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
  { href: "/blog", label: "Blog" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand} aria-label="Queensway Cannabis home">
          <img src="/storeFavicon.webp" alt="" className={styles.logo} />
          <span className={styles.brandText}>
            <strong>QUEENSWAY</strong>
            <small>CANNABIS · ETOBICOKE</small>
          </span>
        </Link>

        <nav className={styles.nav} aria-label="Primary navigation">
          {LINKS.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={active ? styles.active : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className={styles.actions}>
          <a href="tel:+14377829234" className={styles.call}>
            <span aria-hidden="true">☎</span> Call
          </a>
          <Link href="/menu" className={styles.reserve}>
            Browse menu
          </Link>
        </div>
      </div>

      <div className={styles.mobileNav} aria-label="Mobile navigation">
        {LINKS.map((link) => (
          <Link key={link.href} href={link.href}>
            {link.label}
          </Link>
        ))}
      </div>
    </header>
  );
}
