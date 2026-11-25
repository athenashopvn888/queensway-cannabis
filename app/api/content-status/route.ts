import { NextResponse } from "next/server";
import { getFleetContent } from "../../lib/fleetContent";
import { contentStatusPayload } from "../../lib/fleet/status";
import { getCigaretteSnapshot } from "../../lib/cigaretteFeed";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Diagnostic only. Publish verification reads the page marker, not this route. */
export async function GET() {
  const [fleet, cigarettes] = await Promise.all([getFleetContent(), getCigaretteSnapshot()]);
  return NextResponse.json(contentStatusPayload(fleet, {
    web: cigarettes.web.show,
    tv: cigarettes.tv.show,
    guides: cigarettes.guides.show,
  }), { headers: { "Cache-Control": "no-store" } });
}
