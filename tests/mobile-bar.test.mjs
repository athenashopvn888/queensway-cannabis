import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { barHoursLabel, formatHour, QCD_HOURS, torontoMinutes } from "../app/lib/mobileBarHours.ts";
import { showMobileBar } from "../app/lib/showMobileBar.ts";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("formatHour matches the homepage clock", () => {
  assert.equal(formatHour(0), "12 AM");
  assert.equal(formatHour(60), "1 AM");
  assert.equal(formatHour(12 * 60), "12 PM");
  assert.equal(formatHour(22 * 60), "10 PM");
  assert.equal(formatHour(23 * 60 + 30), "11 PM");
});

test("Queensway QCD_HOURS is open 24 hours at any Toronto minute", () => {
  assert.deepEqual(QCD_HOURS, { open: 0, close: 24 * 60 });
  for (const minute of [0, 1, 600, 1439]) {
    assert.equal(barHoursLabel(minute, QCD_HOURS), "Open 24 hours");
  }
});

test("partial windows use Open now · until and Closed · opens", () => {
  const hours = { open: 10 * 60, close: 22 * 60 };
  assert.equal(barHoursLabel(10 * 60, hours), "Open now · until 10 PM");
  assert.equal(barHoursLabel(21 * 60 + 59, hours), "Open now · until 10 PM");
  assert.equal(barHoursLabel(22 * 60, hours), "Closed · opens 10 AM");
  assert.equal(barHoursLabel(9 * 60, hours), "Closed · opens 10 AM");
  assert.equal(barHoursLabel(23 * 60, hours), "Closed · opens 10 AM");
});

test("torontoMinutes uses America/Toronto, including daylight time", () => {
  assert.equal(torontoMinutes(new Date("2026-01-15T15:00:00Z")), 10 * 60);
  assert.equal(torontoMinutes(new Date("2026-07-15T15:00:00Z")), 11 * 60);
});

test("root layout mounts the shared mobile bar", () => {
  const layout = read("app/layout.tsx");
  const bar = read("app/components/MobileBar.tsx");
  const css = read("app/components/MobileBar.css");
  assert.match(layout, /<MobileBar\s*\/>/);
  assert.match(bar, /href="\/menu"/);
  assert.match(bar, /href="\/hours"/);
  assert.match(bar, /mapsSearchUrl/);
  assert.match(bar, /aria-label="Quick actions"/);
  assert.match(bar, /className="mobilebar"/);
  assert.match(bar, /className="mobilebar__name"/);
  assert.match(bar, /className="mobilebar__status"/);
  assert.match(bar, /className="accent"/);
  assert.doesNotMatch(bar, /styles\.hours/);
  assert.match(bar, /Menu/);
  assert.match(bar, /Hours/);
  assert.match(bar, /Directions/);
  assert.match(css, /\.mobilebar\s*\{/);
  assert.match(css, /min-height:\s*44px/);
  assert.match(css, /#1faa55/);
  assert.match(css, /#06230f/);
  assert.match(css, /@media \(min-width: 900px\)/);
  assert.match(css, /display:\s*none/);
});

test("in-store boards do not mount the mobile bar", () => {
  const bar = read("app/components/MobileBar.tsx");
  assert.match(bar, /usePathname\(\)/);
  assert.match(bar, /if \(!showMobileBar\(pathname\)\) return null/);
  for (const path of ["/tv", "/tv/", "/tv2", "/tv2/", "/tv/board", "/tv2/board"]) {
    assert.equal(showMobileBar(path), false, path);
  }
  for (const path of ["/", "/menu", "/hours", "/contact", "/delivery", "/television", "/tv2extra", null, ""]) {
    assert.equal(showMobileBar(path), true, String(path));
  }
});

test("header Call link stays the small header action", () => {
  const navbar = read("app/components/Navbar.tsx");
  const css = read("app/components/Navbar.module.css");
  assert.match(navbar, /href="tel:\+14377829234" className=\{styles\.call\}/);
  assert.match(navbar, />\s*Call\s*</);
  assert.match(css, /\.call[\s\S]*min-height:\s*44px/);
  assert.match(css, /\.actions \.call \{\s*display: none;\s*\}/);
});
