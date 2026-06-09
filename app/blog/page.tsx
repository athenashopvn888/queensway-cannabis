import type { Metadata } from "next";
import BlogContent from "./BlogContent";

export const metadata: Metadata = {
  title: "Cannabis Blog & Guides — Queensway Cannabis Dispensary | Etobicoke",
  description: "Read the latest strain reviews, dosing guides, and cannabis news from Queensway Cannabis Dispensary in Etobicoke.",
  alternates: {
    canonical: "https://queenswaycannabisdispensary.com/blog",
  },
};

export default function BlogPage() {
  return <BlogContent />;
}
