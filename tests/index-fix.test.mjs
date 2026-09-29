import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const sitemapSource = await readFile(new URL("../app/sitemap.ts", import.meta.url), "utf8");
const cityPageSource = await readFile(
  new URL("../app/weed-dispensary-etobicoke/page.tsx", import.meta.url),
  "utf8",
);

test("Etobicoke city URL is no-slash in the sitemap and canonical", () => {
  assert.match(sitemapSource, /`\$\{BASE\}\/weed-dispensary-etobicoke`/);
  assert.doesNotMatch(sitemapSource, /`\$\{BASE\}\/weed-dispensary-etobicoke\/`/);
  assert.match(cityPageSource, /`https:\/\/\$\{gbpLocation\.domain\}\/\$\{gbpLocation\.slug\}`/);
  assert.doesNotMatch(cityPageSource, /`https:\/\/\$\{gbpLocation\.domain\}\/\$\{gbpLocation\.slug\}\/`/);
});
