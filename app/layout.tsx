import type { Metadata } from "next";
import "./globals.css";
import AgeGate from "./components/AgeGate";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.queenswaycannabisdispensary.com"),
  title: {
    default: "Queensway Cannabis Dispensary | Etobicoke Dispensary",
    template: "%s | Queensway Cannabis Dispensary",
  },
  description:
    "Queensway Cannabis Dispensary is an Etobicoke cannabis store on The Queensway with adult 19+ store info and category browsing for flower, pre-rolls, vapes, edibles, concentrates, and accessories. Open 24 Hours.",
  keywords: [
    "cannabis dispensary Etobicoke",
    "weed store Etobicoke",
    "exotic flower Etobicoke",
    "premium cannabis",
    "Queensway Cannabis Dispensary",
    "cheap weed Etobicoke",
    "dispensary near me",
    "THC flower",
    "indica sativa hybrid",
    "edibles Etobicoke",
    "vapes",
    "pre-rolls",
    "native cigarettes Etobicoke",
    "weed store Mississauga",
  ],
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: "https://www.queenswaycannabisdispensary.com",
    siteName: "Queensway Cannabis Dispensary",
    title: "Queensway Cannabis Dispensary — Premium Etobicoke Cannabis Dispensary",
    description:
      "200+ strains from $3/g. Exotic to Budget. Etobicoke's uplifting dispensary at 1174 The Queensway. Open 24 Hours.",
    images: [
      {
        url: "https://www.queenswaycannabisdispensary.com/wp-content/uploads/2026/04/46Oi5.jpg",
        width: 1200,
        height: 630,
        alt: "Queensway Cannabis Dispensary — Premium Cannabis Dispensary Etobicoke",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Queensway Cannabis Dispensary — Etobicoke's Uplifting Dispensary",
    description: "200+ strains from $3/g. Open 24 Hours at 1174 The Queensway, Etobicoke.",
    images: ["https://www.queenswaycannabisdispensary.com/wp-content/uploads/2026/04/46Oi5.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "https://www.queenswaycannabisdispensary.com",
  },
  verification: {
    // google: "your-google-verification-code",
  },
};

/* ── JSON-LD Structured Data ── */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Store",
  additionalType: "https://schema.org/Store",
  "@id": "https://www.queenswaycannabisdispensary.com",
  name: "Queensway Cannabis Dispensary",
  description: "Cannabis dispensary at 1174 The Queensway in Etobicoke, ON. Shop exotic, premium, AAA+, AA, and budget flower tiers plus edibles, prerolls, and vapes. Open 24 Hours.",
  url: "https://www.queenswaycannabisdispensary.com",
  telephone: "+14377829234",
  image: "https://www.queenswaycannabisdispensary.com/wp-content/uploads/2026/04/7Clmh.jpg",
  priceRange: "$3 - $12/g",
  address: {
    "@type": "PostalAddress",
    streetAddress: "1174 The Queensway",
    addressLocality: "Etobicoke",
    addressRegion: "ON",
    postalCode: "M8Z 1R5",
    addressCountry: "CA",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 43.6223417,
    longitude: -79.5217307,
  },
  openingHoursSpecification: [
  {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday"
    ],
    "opens": "00:00",
    "closes": "23:59"
  }
],
  sameAs: [
    "https://www.queenswaycannabisdispensary.com/",
    "https://www.queenswaycannabisdispensary.com/",
  ],
  hasMap: "https://www.queenswaycannabisdispensary.com/",
  areaServed: {
    "@type": "City",
    name: "Etobicoke",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="geo.region" content="CA-ON" />
        <meta name="geo.placename" content="Etobicoke" />
        <meta name="geo.position" content="43.6223417;-79.5217307" />
        <meta name="ICBM" content="43.6223417, -79.5217307" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-97B4MDE512"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-97B4MDE512');
            `
          }}
        />
      </head>
      <body>
        {children}
        <AgeGate />
      </body>
    </html>
  );
}
