import { readFile } from "node:fs/promises";
import path from "node:path";
import { getFleetContent } from "../../lib/fleetContent";
import { FLEET_STORE_CODE } from "../../lib/fleet/config";
import { SHOW_CIGARETTES } from "../../lib/siteConfig";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FILES = new Set(["index.html", "index-nocig.html"]);

function takeoverFile(request: Request): string {
  const requested = new URL(request.url).searchParams.get("file");
  if (requested && FILES.has(requested)) return requested;
  return SHOW_CIGARETTES ? "index.html" : "index-nocig.html";
}

function versionToken(version: string): string {
  return /^[A-Za-z0-9:-]+$/.test(version) ? version : `${FLEET_STORE_CODE}:coded`;
}

/** Serves the existing homepage takeover and adds the fleet version marker. */
export async function GET(request: Request) {
  const fleet = await getFleetContent();
  const file = takeoverFile(request);
  const html = await readFile(path.join(process.cwd(), "public", "takeover", file), "utf8");
  const meta = `<meta name="fleet-content-version" content="${versionToken(fleet.version)}">`;
  const body = html.includes("fleet-content-version") ? html : html.replace("<head>", `<head>\n${meta}`);
  return new Response(body, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=60, stale-while-revalidate=300",
    },
  });
}
