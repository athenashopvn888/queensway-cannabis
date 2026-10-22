"use client";

import { createContext, useContext } from "react";
import type { ResolvedBanner } from "../lib/fleet/types";

const FleetBannerContext = createContext<ResolvedBanner[] | undefined>(undefined);

export default function FleetBannerBridge({
  banners,
  children,
}: {
  banners?: ResolvedBanner[];
  children: React.ReactNode;
}) {
  return <FleetBannerContext.Provider value={banners}>{children}</FleetBannerContext.Provider>;
}

export function useFleetBanners(): ResolvedBanner[] | undefined {
  return useContext(FleetBannerContext);
}
