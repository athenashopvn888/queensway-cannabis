import type { Metadata } from "next";
import GamesContent from "./GamesContent";

export const metadata: Metadata = {
  title: "Cannabis Arcade Games — Queensway Cannabis Dispensary | Etobicoke",
  description: "Play free online cannabis-themed games like Flappy Bud and Snake Munchies while you wait at Queensway Cannabis Dispensary.",
  alternates: {
    canonical: "https://queenswaycannabisdispensary.com/games",
  },
};

export default function GamesPage() {
  return <GamesContent />;
}
