"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CODED_NAP } from "../lib/fleet/config";
import { QCD_HOURS, barHoursLabel, barHoursOpen, torontoMinutes } from "../lib/mobileBarHours";
import styles from "./MobileBar.module.css";

const MAPS_HREF = CODED_NAP.mapsSearchUrl;

function paint() {
  const minutes = torontoMinutes();
  return {
    label: barHoursLabel(minutes, QCD_HOURS),
    open: barHoursOpen(minutes, QCD_HOURS),
  };
}

export default function MobileBar() {
  const [status, setStatus] = useState(paint);

  useEffect(() => {
    const update = () => setStatus(paint());
    update();
    const timer = setInterval(update, 60_000);
    return () => clearInterval(timer);
  }, []);

  return (
    <nav className={styles.bar} aria-label="Quick actions">
      <Link href="/menu" className={styles.item}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <span className={styles.name}>Menu</span>
      </Link>
      <Link
        href="/hours"
        className={status.open ? `${styles.item} ${styles.hours}` : `${styles.item} ${styles.hours} ${styles.closed}`}
        aria-label={`Hours, ${status.label}`}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
        <span className={styles.name}>Hours</span>
        <span className={styles.status} data-hours-status="">
          {status.label}
        </span>
      </Link>
      <a className={`${styles.item} ${styles.accent}`} href={MAPS_HREF} target="_blank" rel="noopener noreferrer">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polygon points="3 11 22 2 13 21 11 13 3 11" />
        </svg>
        <span className={styles.name}>Directions</span>
      </a>
    </nav>
  );
}
