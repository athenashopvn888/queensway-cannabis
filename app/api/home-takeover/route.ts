import { readFile } from "node:fs/promises";
import path from "node:path";
import { getFleetContent } from "../../lib/fleetContent";
import { FLEET_STORE_CODE } from "../../lib/fleet/config";
import { getCigaretteSnapshot } from "../../lib/cigaretteFeed";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function versionToken(version: string): string {
  return /^[A-Za-z0-9:-]+$/.test(version) ? version : `${FLEET_STORE_CODE}:coded`;
}

/** Serves the existing homepage takeover and adds the fleet version marker. */
export async function GET(request: Request) {
  const [fleet, cigarettes] = await Promise.all([getFleetContent(), getCigaretteSnapshot()]);
  const explicitlyOff = new URL(request.url).searchParams.get("file") === "index-nocig.html";
  const file = cigarettes.web.show && !explicitlyOff ? "index.html" : "index-nocig.html";
  const html = await readFile(path.join(process.cwd(), "public", "takeover", file), "utf8");
  const meta = `<meta name="fleet-content-version" content="${versionToken(fleet.version)}">`;
  const body = html.includes("fleet-content-version") ? html : html.replace("<head>", `<head>\n${meta}`);
  return new Response(body, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
