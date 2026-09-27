import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Queensway Cannabis In-Store Flower Display",
  description: "Operational in-store flower menu display for Queensway Cannabis Dispensary.",
  robots: { index: false, follow: false },
};

export default function TvLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
