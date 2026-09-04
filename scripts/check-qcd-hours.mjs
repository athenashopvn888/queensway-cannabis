import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const required = new Map([
  ["app/page.tsx", ["Open 24 Hours", "open 24 hours a day, 7 days a week"]],
  ["app/components/Footer.tsx", ["Open 24 hours a day, 7 days a week."]],
  ["app/contact/page.tsx", ["Open 24 Hours", "open 24 hours a day, 7 days a week"]],
  ["app/faq/page.tsx", ["open 24 hours a day, 7 days a week"]],
  ["app/layout.tsx", ["Open 24 Hours", '"opens": "00:00"', '"closes": "23:59"']],
  ["app/lib/gbp-location.ts", ['hours: ["Open 24 Hours"]']],
  ["app/lib/seoPages.ts", ["Open 24 Hours", "open 24 hours a day, 7 days a week"]],
  ["app/items/[category]/page.tsx", ["Open 24 Hours"]],
  ["app/tv/page.tsx", ['"Open 24 Hours"']],
  ["app/tv2/page.tsx", ['"Open 24 Hours"']],
  ["public/takeover/index.html", ['window.QCD_HOURS={"open":0,"close":1440}', "Open Daily 24 HOURS", '"@type":"Store"', '"openingHoursSpecification"', '"opens":"00:00"', '"closes":"23:59"']],
  ["public/wp-content/themes/queensway/assets/app.js", ["OPEN_MIN = Number.isFinite(HOURS.open) ? HOURS.open : 0", "Open 24 hours"]],
]);

const failures = [];
for (const [relative, needles] of required) {
  const body = fs.readFileSync(path.join(root, relative), "utf8");
  for (const needle of needles) {
    if (!body.includes(needle)) failures.push(`${relative}: missing ${JSON.stringify(needle)}`);
  }
}

const stalePatterns = [
  new RegExp(["10:00", "AM"].join("\\s*") + "\\s*(?:-|–|to)\\s*" + ["12:00", "AM"].join("\\s*"), "i"),
  new RegExp(["10", "AM"].join("\\s*") + ".{0,24}" + ["mid", "night"].join("\\s*"), "i"),
  new RegExp(["opens", "10", "AM"].join("\\s+"), "i"),
  new RegExp(["until", "midnight"].join("\\s+"), "i"),
];
const scanRoots = ["app", "public"];
const allowedTechnicalFile = path.normalize("public/takeover.js");
function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(absolute);
    else if (/\.(?:tsx?|jsx?|html|json)$/i.test(entry.name)) {
      const relative = path.relative(root, absolute);
      if (path.normalize(relative) === allowedTechnicalFile) continue;
      const body = fs.readFileSync(absolute, "utf8");
      for (const pattern of stalePatterns) {
        if (pattern.test(body)) failures.push(`${relative}: stale storefront-hours wording matches ${pattern}`);
      }
    }
  }
}
for (const scanRoot of scanRoots) walk(path.join(root, scanRoot));

const delivery = fs.readFileSync(path.join(root, "app/delivery/DeliveryContent.tsx"), "utf8");
if (!/coming soon/i.test(delivery)) failures.push("delivery status changed: Coming Soon marker missing");
if (!delivery.includes("Open 24 Hours")) failures.push("delivery page storefront-hours reference is not Open 24 Hours");

if (failures.length) {
  process.stderr.write(`QCD01 hours regression FAIL\n${failures.join("\n")}\n`);
  process.exit(1);
}
process.stdout.write("QCD01 hours regression PASS: website storefront hours are 24/7 and delivery status remains preserved.\n");
