import { cache } from "react";
import { SHOW_CIGARETTES } from "./siteConfig";
import { resolveAppsScriptUrl, TV_STORE } from "./tvStock";

const OFF = { web: { show: false }, tv: { show: false }, guides: { show: false } };

export async function readCigaretteFeed() {
  try {
    const url = new URL(resolveAppsScriptUrl());
    url.searchParams.set("store", TV_STORE);
    const response = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(8000) });
    if (!response.ok) return OFF;
    const { cig } = await response.json();
    if (cig?.source !== TV_STORE && cig?.source !== "ALL") return OFF;
    const web = SHOW_CIGARETTES && cig.webOn === true;
    return { web: { show: web }, tv: { show: cig.tvOn === true }, guides: { show: web } };
  } catch {
    return OFF;
  }
}

export const getCigaretteSnapshot = cache(readCigaretteFeed);
