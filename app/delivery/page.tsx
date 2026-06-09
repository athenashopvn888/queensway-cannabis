import type { Metadata } from "next";
import DeliveryContent from "./DeliveryContent";

export const metadata: Metadata = {
  title: "Delivery Coming Soon — Queensway Cannabis Dispensary | Etobicoke",
  description: "Get notified when Queensway Cannabis Dispensary launches same-day weed delivery across Etobicoke and surrounding areas.",
  alternates: {
    canonical: "https://queenswaycannabisdispensary.com/delivery",
  },
};

export default function DeliveryPage() {
  return <DeliveryContent />;
}
