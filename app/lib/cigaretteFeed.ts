import { cache } from "react";
import { SHOW_CIGARETTES } from "./siteConfig";

export type CigaretteSurface = { show: boolean };

export type CigaretteSnapshot = {
  web: CigaretteSurface;
  tv: CigaretteSurface;
  guides: CigaretteSurface;
};

/**
 * Queensway's coded cigarette switch is NEXT_PUBLIC_SHOW_CIGARETTES.
 * There is no separate feed. A missing feed stays on that coded flag.
 * Route behaviour stays in next.config (redirects when the switch is off).
 */
export async function readCigaretteFeed(): Promise<CigaretteSnapshot> {
  const show = SHOW_CIGARETTES;
  return { web: { show }, tv: { show }, guides: { show } };
}

export const getCigaretteSnapshot = cache(readCigaretteFeed);
