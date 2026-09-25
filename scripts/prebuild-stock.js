/**
 * Prebuild script: Fetches live stock data from Apps Script
 * and writes flowers.json + items.json before Next.js builds.
 *
 * Menu JSON is the QCD01 ONHAND intersection (public menu SKUs ⊆ ONHAND).
 * Product URL slugs already on the site are kept in url-catalog.json so
 * detail pages and the sitemap stay additive-only.
 *
 * This runs automatically via "prebuild" in package.json.
 * If the fetch fails, the existing JSON files are kept as fallback.
 */

const fs = require('fs');
const path = require('path');

const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL || '';
const LIB_DIR = path.join(__dirname, '..', 'app', 'lib');
const FLOWERS_PATH = path.join(LIB_DIR, 'flowers.json');
const ITEMS_PATH = path.join(LIB_DIR, 'items.json');
const CATALOG_PATH = path.join(LIB_DIR, 'url-catalog.json');
const FETCH_TIMEOUT_MS = 120000;
const FETCH_ATTEMPTS = 2;

function readJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf-8'));
  } catch {
    return fallback;
  }
}

async function fetchJson(url) {
  let lastErr;
  for (let attempt = 1; attempt <= FETCH_ATTEMPTS; attempt++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      return await res.json();
    } catch (err) {
      lastErr = err;
      console.warn(`[prebuild] attempt ${attempt}/${FETCH_ATTEMPTS} failed: ${err.message}`);
    }
  }
  throw lastErr;
}

function skuTokens(sku) {
  return String(sku || '')
    .split(/[,/]/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function normName(name) {
  return String(name || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function pairScore(feed, local) {
  let score = 0;
  const feedSku = String(feed.sku || '').trim();
  const localSku = String(local.sku || '').trim();
  if (feedSku && feedSku === localSku) score += 100;
  if (feed.slug && feed.slug === local.slug) score += 80;
  const feedName = normName(feed.name);
  const localName = normName(local.name);
  if (feedName && feedName === localName) score += 60;
  else if (localName.length >= 8 && feedName.startsWith(localName)) score += 40;
  if (
    local.slug &&
    feed.slug &&
    local.slug.length >= 12 &&
    feed.slug.startsWith(`${local.slug}-`)
  ) {
    score += 30;
  }
  const feedTokens = new Set(skuTokens(feedSku));
  const localTokens = skuTokens(localSku);
  if (feedTokens.size && localTokens.length) {
    const inter = localTokens.filter((token) => feedTokens.has(token)).length;
    const union = new Set([...feedTokens, ...localTokens]).size;
    if (inter > 0) score += Math.round((inter / union) * 20);
  }
  return score;
}

function pairAccepted(feed, local, score) {
  if (score < 40) return false;
  const feedSku = String(feed.sku || '').trim();
  const localSku = String(local.sku || '').trim();
  if (feedSku && feedSku === localSku) return true;
  if (feed.slug && feed.slug === local.slug) return true;
  const feedTokens = new Set(skuTokens(feedSku));
  const overlap = skuTokens(localSku).some((token) => feedTokens.has(token));
  if (!overlap) return false;
  const localName = normName(local.name);
  const feedName = normName(feed.name);
  if (localName.length >= 8 && feedName.startsWith(localName)) return true;
  if (local.slug && local.slug.length >= 12 && feed.slug && feed.slug.startsWith(`${local.slug}-`)) {
    return true;
  }
  return false;
}

function preserveSlugs(feedRows, existingRows) {
  const pairs = [];
  for (let i = 0; i < feedRows.length; i++) {
    for (let j = 0; j < existingRows.length; j++) {
      const score = pairScore(feedRows[i], existingRows[j]);
      if (pairAccepted(feedRows[i], existingRows[j], score)) {
        pairs.push({ i, j, score });
      }
    }
  }
  pairs.sort((a, b) => b.score - a.score || a.i - b.i);
  const usedFeed = new Set();
  const usedLocal = new Set();
  const slugByFeed = new Map();
  for (const pair of pairs) {
    if (usedFeed.has(pair.i) || usedLocal.has(pair.j)) continue;
    usedFeed.add(pair.i);
    usedLocal.add(pair.j);
    slugByFeed.set(pair.i, existingRows[pair.j].slug);
  }
  return feedRows.map((row, index) => ({
    ...row,
    slug: slugByFeed.get(index) || row.slug,
  }));
}

function keepOnhand(row, onhand) {
  const tokens = skuTokens(row.sku);
  const kept = tokens.filter((token) => onhand.has(token));
  if (kept.length === 0) return null;
  if (kept.length === tokens.length) return row;
  return { ...row, sku: kept.join(', ') };
}

const SALE_RE = /\bSALE\b/i;
const ON_SALE_RE = /ON\s*SALE/i;

function hasSalePrice(flower) {
  return !!(
    (flower.price3g && flower.price3g.sale !== null) ||
    (flower.price5g && flower.price5g.sale !== null) ||
    (flower.price14g && flower.price14g.sale !== null) ||
    (flower.price28g && flower.price28g.sale !== null)
  );
}

function cleanName(name) {
  return String(name || '')
    .replace(/\s*\(?\s*AAA\+?\s*ON\s*SALE\s*\)?\s*$/i, '')
    .replace(/\s*\(?\s*AAA\+?\s*SALE!?\s*\)?\s*$/i, '')
    .replace(/\s*\bSALE!?\s*$/i, '')
    .replace(/\s*\bON\s*SALE\s*$/i, '')
    .trim();
}

function applyFlowerPost(flowers) {
  let saleFixed = 0;
  for (const flower of flowers) {
    if (!flower.isSale && (SALE_RE.test(flower.name) || ON_SALE_RE.test(flower.name) || hasSalePrice(flower))) {
      flower.isSale = true;
      saleFixed++;
    }
    flower.name = cleanName(flower.name);
  }
  return saleFixed;
}

function applyItemPost(items) {
  let itemsFixed = 0;
  for (const item of items) {
    if (typeof item.price === 'string' && item.price.includes('[object')) {
      item.price = '';
      itemsFixed++;
    }
  }
  return itemsFixed;
}

function mergeCatalog(existingRows, previousRows, menuRows) {
  const bySlug = new Map();
  for (const row of [...existingRows, ...previousRows]) {
    if (row && row.slug && !bySlug.has(row.slug)) bySlug.set(row.slug, row);
  }
  for (const row of menuRows) {
    if (row && row.slug) bySlug.set(row.slug, row);
  }
  return [...bySlug.values()];
}

function slugSet(rows) {
  return new Set(rows.map((row) => row.slug).filter(Boolean));
}

async function loadOnhandMenu(baseUrl) {
  const stockUrl = `${baseUrl}?store=QCD01&stock=1`;
  const combinedUrl = `${baseUrl}?store=QCD01`;
  console.log('[prebuild] Fetching QCD01 ONHAND stock=1...');
  const stockRes = await fetchJson(stockUrl);

  let onhand = null;
  if (stockRes && stockRes.stock && typeof stockRes.stock === 'object') {
    onhand = new Set(Object.keys(stockRes.stock));
  }

  let flowers;
  let items;
  let stockDate = stockRes.stockDate || stockRes.date || null;
  let storeCode = stockRes.storeCode || 'QCD01';

  if (Array.isArray(stockRes.flowers) && Array.isArray(stockRes.items)) {
    flowers = stockRes.flowers;
    items = stockRes.items;
    console.log('[prebuild] stock=1 returned the combined menu payload');
  } else {
    console.log('[prebuild] stock=1 is a stock map; fetching combined QCD01 menu payload...');
    const combined = await fetchJson(combinedUrl);
    if (!Array.isArray(combined.flowers) || !Array.isArray(combined.items)) {
      throw new Error('Invalid response: missing flowers or items');
    }
    flowers = combined.flowers;
    items = combined.items;
    stockDate = combined.stockDate || stockDate;
    storeCode = combined.storeCode || storeCode;
  }

  if (!onhand) {
    throw new Error('ONHAND stock map missing from stock=1 response');
  }
  if (storeCode && storeCode !== 'QCD01') {
    throw new Error(`Unexpected store code ${storeCode}`);
  }

  return { flowers, items, onhand, stockDate, storeCode: storeCode || 'QCD01' };
}

async function main() {
  if (!APPS_SCRIPT_URL) {
    console.log('[prebuild] No APPS_SCRIPT_URL set — using existing static JSON files');
    return;
  }

  console.log('[prebuild] Fetching live stock from Apps Script...');

  try {
    const existingFlowers = readJson(FLOWERS_PATH, []);
    const existingItems = readJson(ITEMS_PATH, []);
    const previousCatalog = readJson(CATALOG_PATH, { flowers: [], items: [] });
    const beforeFlowerSlugs = slugSet(existingFlowers);
    const beforeItemSlugs = slugSet(existingItems);
    for (const row of previousCatalog.flowers || []) beforeFlowerSlugs.add(row.slug);
    for (const row of previousCatalog.items || []) beforeItemSlugs.add(row.slug);

    const { flowers, items, onhand, stockDate, storeCode } = await loadOnhandMenu(APPS_SCRIPT_URL);

    const menuFlowers = preserveSlugs(flowers, [...existingFlowers, ...(previousCatalog.flowers || [])])
      .map((row) => keepOnhand(row, onhand))
      .filter(Boolean);
    const menuItems = preserveSlugs(items, [...existingItems, ...(previousCatalog.items || [])])
      .map((row) => keepOnhand(row, onhand))
      .filter(Boolean);

    const saleFixed = applyFlowerPost(menuFlowers);
    const itemsFixed = applyItemPost(menuItems);
    if (saleFixed > 0) console.log(`[prebuild] Fixed ${saleFixed} sale flags from names`);
    if (itemsFixed > 0) console.log(`[prebuild] Fixed ${itemsFixed} mangled item prices`);

    const catalogFlowers = mergeCatalog(existingFlowers, previousCatalog.flowers || [], menuFlowers);
    const catalogItems = mergeCatalog(existingItems, previousCatalog.items || [], menuItems);

    const removedFlowerSlugs = [...beforeFlowerSlugs].filter((slug) => !catalogFlowers.some((row) => row.slug === slug));
    const removedItemSlugs = [...beforeItemSlugs].filter((slug) => !catalogItems.some((row) => row.slug === slug));
    if (removedFlowerSlugs.length || removedItemSlugs.length) {
      throw new Error(
        `Refusing to write: URL slugs would be removed (flowers ${removedFlowerSlugs.length}, items ${removedItemSlugs.length})`
      );
    }

    const menuSkuTokens = [...menuFlowers, ...menuItems].flatMap((row) => skuTokens(row.sku));
    const outside = menuSkuTokens.filter((token) => !onhand.has(token));
    if (outside.length) {
      throw new Error(`Refusing to write: ${outside.length} menu SKUs are not in ONHAND`);
    }

    fs.writeFileSync(FLOWERS_PATH, JSON.stringify(menuFlowers, null, 2) + '\n', 'utf-8');
    fs.writeFileSync(ITEMS_PATH, JSON.stringify(menuItems, null, 2) + '\n', 'utf-8');
    fs.writeFileSync(
      CATALOG_PATH,
      JSON.stringify(
        {
          storeCode,
          stockDate,
          onhandSkuCount: onhand.size,
          flowers: catalogFlowers,
          items: catalogItems,
        },
        null,
        2
      ) + '\n',
      'utf-8'
    );

    console.log(`[prebuild] flowers.json updated: ${menuFlowers.length} products (was ${existingFlowers.length})`);
    const tiers = {};
    menuFlowers.forEach((flower) => { tiers[flower.tier] = (tiers[flower.tier] || 0) + 1; });
    Object.entries(tiers).forEach(([tier, count]) => console.log(`  ${tier}: ${count}`));

    console.log(`[prebuild] items.json updated: ${menuItems.length} products (was ${existingItems.length})`);
    const cats = {};
    menuItems.forEach((item) => { cats[item.category] = (cats[item.category] || 0) + 1; });
    Object.entries(cats).sort().forEach(([category, count]) => console.log(`  ${category}: ${count}`));

    const addedFlowerSlugs = catalogFlowers.filter((row) => !beforeFlowerSlugs.has(row.slug)).length;
    const addedItemSlugs = catalogItems.filter((row) => !beforeItemSlugs.has(row.slug)).length;
    console.log(`[prebuild] Stock date: ${stockDate || 'unknown'}`);
    console.log(`[prebuild] Store: ${storeCode} ONHAND SKUs: ${onhand.size}`);
    console.log(`[prebuild] Menu SKU tokens: ${new Set(menuSkuTokens).size} (all ⊆ ONHAND)`);
    console.log(`[prebuild] Flower URL slugs: ${beforeFlowerSlugs.size} -> ${catalogFlowers.length} (removed 0, added ${addedFlowerSlugs})`);
    console.log(`[prebuild] Item URL slugs: ${beforeItemSlugs.size} -> ${new Set(catalogItems.map((row) => row.slug)).size} (removed 0, added ${addedItemSlugs})`);
    console.log('[prebuild] Done!');
  } catch (err) {
    console.warn(`[prebuild] Live fetch failed: ${err.message}`);
    console.warn('[prebuild] Keeping existing JSON files as fallback');
  }
}

main();
