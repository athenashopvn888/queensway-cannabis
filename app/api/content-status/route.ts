import { NextResponse } from "next/server";
import { getFleetContent } from "../../lib/fleetContent";
import { contentStatusPayload } from "../../lib/fleet/status";
import { isCigaretteScheduleActive } from "../../lib/cigaretteSchedule";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Diagnostic only. Publish verification reads the page marker, not this route. */
export async function GET() {
  const fleet = await getFleetContent();
  const active = isCigaretteScheduleActive();
  return NextResponse.json(contentStatusPayload(fleet, {
    web: active,
    tv: active,
    guides: active,
  }), { headers: { "Cache-Control": "no-store" } });
}
