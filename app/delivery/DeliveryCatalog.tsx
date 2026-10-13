"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import styles from "./delivery.module.css";
import { deliveryTierRanges, tierRangeText } from "../lib/tierPriceRanges";

type Tier = "SHREDS" | "Budget" | "BC Premium" | "CRAFTS" | "Exotics";
type PriceOption = { key: string; label: string; price: number };
type Offer = { kind: "prime_time" | "multi_ounce"; quantity?: number; price?: number; bonus?: string; perUnitPrice?: number; totalPrice?: number };
export type Product = { publicProductId: string; name: string; tier: Tier; category: string; strain?: string; thc?: string; effects?: string[]; description?: string | null; images: string[]; priceOptions: PriceOption[]; offers?: Offer[] };
type Filter = "ALL" | Tier;
export type StoreInfo = { name: string; shortName: string; eyebrow: string; area: string; address: string; phone: string; phoneHref: string; storeHours: string; sodCode: string };

const filters: Filter[] = ["ALL", "Exotics", "CRAFTS", "BC Premium", "Budget", "SHREDS"];
const tierOrder: Tier[] = ["Exotics", "CRAFTS", "BC Premium", "Budget", "SHREDS"];
const tierLabel = (tier: Filter) => (tier === "ALL" ? "All flower" : tier);

function entryPrice(product: Product) {
  const prices = product.priceOptions.map((option) => option.price);
  return prices.length ? Math.min(...prices) : Number.POSITIVE_INFINITY;
}
function money(value: number) {
  if (!Number.isFinite(value)) return "$0";
  const rounded = Math.round((value + Number.EPSILON) * 100) / 100;
  return `$${rounded.toFixed(2).replace(/\.00$/, "").replace(/(\.\d)0$/, "$1")}`;
}
function bundleEach(quantity: number, total: number, perUnitPrice?: number) {
  if (quantity === 3 && total === 95) return 33;
  const supplied = Number(perUnitPrice);
  return Number.isFinite(supplied) && supplied > 0 ? supplied : total / quantity;
}

function ProductPricing({ product }: { product: Product }) {
  const standard28 = product.priceOptions.find((option) => option.label === "28g");
  const compact = product.priceOptions.filter((option) => option.label !== "28g");
  const explicit = product.offers?.find((offer) => offer.kind === "prime_time");
  const eligible = ["Exotics", "CRAFTS", "BC Premium"].includes(product.tier);
  const explicitPrice = Number(explicit?.price);
  const loyalty = Number.isFinite(explicitPrice) && explicitPrice > 0 ? explicitPrice : eligible && standard28 ? standard28.price - 30 : null;
  const suppliedBundles = product.offers?.filter((offer) => offer.kind === "multi_ounce" && Number(offer.quantity) !== 2) ?? [];
  const bundles = eligible && loyalty ? [{ quantity: 2, perUnitPrice: loyalty, totalPrice: loyalty * 2 }, ...suppliedBundles] : product.offers?.filter((offer) => offer.kind === "multi_ounce") ?? [];
  return (
    <div className={styles.pricing}>
      <strong className="price-scope-label">Delivery price</strong>
      {compact.length > 0 && <div className={styles.compactPrices}>{compact.map((option) => <span key={option.key}>{option.label} <strong>{money(option.price)}</strong></span>)}</div>}
      <div className={styles.decisionPrices}>
        {loyalty !== null && <span className={styles.loyaltyTile}><small>MEMBER LOYALTY 28g</small><strong>{money(loyalty)}</strong></span>}
        {bundles.map((offer, index) => {
          const quantity = Number(offer.quantity);
          const total = Number(offer.totalPrice);
          return <span key={`${quantity}-${index}`}><small>{quantity} × 28g DEAL</small><strong>{money(bundleEach(quantity, total, offer.perUnitPrice))} each</strong><em>{money(total)} total</em></span>;
        })}
        {standard28 && <span><small>STANDARD 28g</small><strong>{money(standard28.price)}</strong></span>}
      </div>
    </div>
  );
}

export default function DeliveryCatalog({ products, store, faqs }: { products: Product[]; store: StoreInfo; faqs: Array<{ id: string; q: string; a: string }> }) {
  const [filter, setFilter] = useState<Filter>("ALL");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Product | null>(null);

  useEffect(() => {
    if (!selected) return;
    const overflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setSelected(null); };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", closeOnEscape);
    return () => { document.body.style.overflow = overflow; document.removeEventListener("keydown", closeOnEscape); };
  }, [selected]);

  const visible = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return products
      .filter((product) => (filter === "ALL" || product.tier === filter) && (!needle || `${product.name} ${product.category} ${product.strain ?? ""}`.toLowerCase().includes(needle)))
      .sort((a, b) => tierOrder.indexOf(a.tier) - tierOrder.indexOf(b.tier) || entryPrice(a) - entryPrice(b) || a.name.localeCompare(b.name));
  }, [filter, products, search]);
  const tierRanges = useMemo(() => deliveryTierRanges(products).map(({ tier, range }) => ({ tier, line: tierRangeText(range) })).filter((item): item is { tier: string; line: string } => Boolean(item.line)), [products]);

  return (
    <>
      <section className={styles.hero} aria-labelledby="delivery-title">
        <p>{store.eyebrow}</p>
        <h1 id="delivery-title">{store.name} Weed Delivery</h1>
        <span>Browse the delivery menu, then open LIVE ORDER to chat with the {store.shortName} dispatcher. The dispatcher confirms stock, address coverage and your total before anything is accepted. Delivery prices apply.</span>
        <div className={styles.heroActions}><a href="#delivery-menu">Browse the delivery menu</a><a href="#how-to-order">How to order</a></div>
      </section>

      <section className={styles.terms} aria-label={`${store.shortName} delivery details`}>
        <div><small>Product minimum</small><strong>$60</strong></div>
        <div><small>Delivery fee</small><strong>$10</strong></div>
        <div><small>Delivery hours</small><strong>10 a.m.–10 p.m.</strong></div>
        <div><small>ID at the door</small><strong>Adults 19+</strong></div>
      </section>

      <p className={`price-rule-notice ${styles.notice}`}><strong>DELIVERY PRICES ONLY.</strong> Delivery orders are charged these prices, not in-store prices. In-store prices and deals apply to purchases made at the store. <Link href="/faq#delivery-price-rule">See the FAQ</Link></p>

      {tierRanges.length > 0 ? <section className={`tier-range-list ${styles.ranges}`} aria-label="Delivery prices per gram by flower tier"><h2>Delivery prices per gram</h2><ul>{tierRanges.map(({ tier, line }) => <li key={tier}><strong>{tier}</strong><span><b className="price-scope-label">Delivery price</b>{line}</span></li>)}</ul></section> : null}

      <section className={styles.howToOrder} id="how-to-order" aria-labelledby="how-to-order-title">
        <div><p>HOW TO ORDER</p><h2 id="how-to-order-title">Order with the {store.shortName} dispatcher</h2><span>LIVE ORDER connects you with the {store.shortName} dispatcher.</span></div>
        <ol>
          <li><strong>Browse the delivery menu</strong><span>Note the product names and weights you want. Delivery starts at 7g.</span></li>
          <li><strong>Open LIVE ORDER</strong><span>Tap LIVE ORDER at the bottom right of the page and send the dispatcher your choices.</span></li>
          <li><strong>Verify your ID</strong><span>New customers complete a private ID check in chat. Returning customers skip this step.</span></li>
          <li><strong>Confirm and receive</strong><span>The dispatcher confirms stock, your address and the total. Show photo ID at the door.</span></li>
        </ol>
      </section>

      <section className={styles.loyalty} aria-labelledby="loyalty-title">
        <div><p>SAVE ON A LATER ORDER</p><h2 id="loyalty-title">Member Loyalty Savings</h2></div>
        <p>Qualify with an eligible regular-price 28g purchase in BC Premium, Crafts, or Exotics, or with a selected 2 × 28g tier offer. Rewards and coupons apply to a later order—not the qualifying purchase.</p>
        <ol>
          <li><strong>Qualify</strong><span>Purchase an eligible regular-price ounce or selected two-ounce tier offer.</span></li>
          <li><strong>Return</strong><span>On your next order, save $30 on an eligible regular-price 28g item in the selected tier.</span></li>
          <li><strong>Use your coupon later</strong><span>A 3g Craft coupon earned with a qualifying $120+ purchase is redeemed on your next order.</span></li>
          <li><strong>Keep access active</strong><span>Make a $50+ purchase within 14 days, or requalify with an eligible full-price purchase.</span></li>
        </ol>
        <aside><strong>Important conditions</strong><p>Complimentary items apply only to regular-price Craft or Exotic ounces—not BC Premium. Loyalty prices are firm and cannot be reduced with points. Loyalty-price orders do not include extra complimentary items. The dispatcher confirms current eligibility and any included item before checkout.</p></aside>
      </section>

      <section className={styles.catalogShell} id="delivery-menu">
        <aside className={styles.filters}><h2>Flower tiers</h2>{filters.map((tier) => <button type="button" key={tier} className={filter === tier ? styles.active : ""} onClick={() => setFilter(tier)}>{tierLabel(tier)}<span>{tier === "ALL" ? products.length : products.filter((product) => product.tier === tier).length}</span></button>)}</aside>
        <div className={styles.catalog}>
          <header className={styles.tools}>
            <div><p>DELIVERY MENU</p><h2>{filter === "ALL" ? "All flower" : filter}</h2><span>{visible.length} products</span></div>
            <label><span>Search products</span><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Product or strain" /></label>
          </header>
          <div className={styles.mobileFilters}>{filters.map((tier) => <button type="button" key={tier} className={filter === tier ? styles.active : ""} onClick={() => setFilter(tier)}>{tierLabel(tier)}</button>)}</div>
          {products.length === 0 ? <p className={styles.empty}>The delivery menu is temporarily unavailable. Please check back shortly or open LIVE ORDER to ask the dispatcher.</p> : null}
          <div className={styles.grid}>{visible.map((product) => <article className={styles.card} key={product.publicProductId}>
            <button type="button" className={styles.imageButton} onClick={() => setSelected(product)} aria-label={`View details for ${product.name}`}>
              {product.images[0] ? <Image src={product.images[0]} alt={`${product.name} on the ${store.name} delivery menu`} fill sizes="(max-width: 640px) 50vw, 280px" unoptimized /> : <span>{store.shortName}</span>}
            </button>
            <div className={styles.cardBody}>
              <div className={styles.badges}><span>{product.tier}</span><span>{product.category}</span></div>
              <h3><button type="button" onClick={() => setSelected(product)}>{product.name}</button></h3>
              <ProductPricing product={product} />
              <button type="button" className={styles.detailsButton} onClick={() => setSelected(product)}>View details</button>
            </div>
          </article>)}</div>
        </div>
      </section>

      <section className={styles.trust} aria-labelledby="trust-title">
        <h2 id="trust-title">Before you order</h2>
        <ul>
          <li><strong>Adults 19+ only.</strong> Government-issued photo ID is checked at the door.</li>
          <li><strong>Sealed, discreet orders.</strong> The dispatcher confirms your address and total before the order is accepted.</li>
          <li><strong>Need less than 7g, or want it right now?</strong> Our store at {store.address} is open {store.storeHours}.</li>
        </ul>
      </section>

      <section className={styles.faq} aria-labelledby="delivery-faq-title">
        <h2 id="delivery-faq-title">Delivery questions</h2>
        {faqs.map((item) => <details key={item.id} id={item.id}><summary>{item.q}</summary><p>{item.a}</p></details>)}
      </section>

      <div className={styles.ctaSection}><p>Visit us in-store at <strong>{store.address}</strong>. Open <strong>{store.storeHours}</strong>. Call <a href={store.phoneHref}><strong>{store.phone}</strong></a>.</p></div>

      {selected && <div className={styles.backdrop} onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}>
        <section className={styles.drawer} role="dialog" aria-modal="true" aria-labelledby="product-title">
          <header><strong>Product details</strong><button type="button" onClick={() => setSelected(null)} aria-label="Close product details">×</button></header>
          <div className={styles.drawerContent}>
            {selected.images.map((src, index) => <div className={styles.drawerImage} key={src}><Image src={src} alt={`${selected.name}${index ? ` alternate ${index + 1}` : ""}`} fill sizes="(max-width: 720px) 100vw, 420px" unoptimized /></div>)}
            <h2 id="product-title">{selected.name}</h2>
            <p>{selected.description || "Ask the dispatcher for current product details."}</p>
            {selected.thc ? <p><strong>THC:</strong> {selected.thc}</p> : null}
            {(selected.effects?.length ?? 0) > 0 && <div className={styles.effects}>{selected.effects!.map((effect) => <span key={effect}>{effect}</span>)}</div>}
            <ProductPricing product={selected} />
          </div>
        </section>
      </div>}
    </>
  );
}
