import assert from "node:assert/strict";
import test from "node:test";
import { isCigaretteScheduleActive } from "../app/lib/cigaretteSchedule.ts";

const active = [
  "2026-11-23T00:59:00-05:00", // Sunday night
  "2026-11-23T07:59:00-05:00", // Monday weekend continuation
  "2026-11-23T20:00:00-05:00", // Monday night
  "2026-11-27T17:00:00-05:00", // Friday weekend start
  "2026-11-28T12:00:00-05:00", // Saturday
];
const inactive = [
  "2026-11-23T08:00:00-05:00",
  "2026-11-23T19:59:00-05:00",
  "2026-11-27T08:00:00-05:00",
  "2026-11-27T16:59:00-05:00",
];

test("owner-approved cigarette schedule boundaries", () => {
  active.forEach((value) => assert.equal(isCigaretteScheduleActive(new Date(value)), true, value));
  inactive.forEach((value) => assert.equal(isCigaretteScheduleActive(new Date(value)), false, value));
});
