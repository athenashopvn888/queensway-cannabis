/* ============================================================
   Queensway Cannabis Dispensary — interactions (WordPress port)
   Age gate (focus-trapped) · time-aware hours · mobile nav ·
   catalog (URL-synced search/filter/sort, progressive enhancement
   over the server-rendered grid) · product imagery w/ fallback.
   Public pages consume availability STATUS only (inlined by PHP
   through the status projection); raw quantities never reach this
   file on a public page.

   WordPress deltas from the preview build are marked with WP:
   - URLs come from window.QCD_URLS (falls back to the static
     preview's .html paths so the file still runs standalone)
   - taxonomy archives inline window.QCD_FORCED_CAT
   - "Yes, I'm 19+" also sets the qcd_age_ok cookie for PHP
   - reserve submit POSTs to the REST endpoint (window.QCD_API);
     the compose-and-text path remains as offline fallback
   ============================================================ */
(function () {
  "use strict";

  /* ---------- WP: site config (inlined by functions.php) ---------- */
  var URLS = window.QCD_URLS || {};
  var CATALOG_URL = URLS.catalog || "category.html";
  var STORE = window.QCD_STORE || {};
  var TEL_HREF = STORE.tel || "tel:+14373319109";
  var PHONE_LABEL = STORE.phone || "(437) 331-9109";
  var SMS_NUM = STORE.sms || "+14373319109";
  var PAGE_DEFAULT_CAT = window.QCD_FORCED_CAT || "all";
  function catUrl(slug) {
    return CATALOG_URL + (CATALOG_URL.indexOf("?") < 0 ? "?" : "&") + "cat=" + slug;
  }

  /* ---------- Inline icon set ---------- */
  const ICON = {
    leaf:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6"/></svg>',
    gem:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12l4 6-10 12L2 9Z"/><path d="M2 9h20M9 3 6.5 9 12 21M15 3l2.5 6L12 21"/></svg>',
    roll:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17.5 17 4.5a2.1 2.1 0 0 1 3 3L7 20.5a2.1 2.1 0 0 1-3-3Z"/><path d="m14 7 3 3"/></svg>',
    candy:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4.5"/><path d="M8.4 8.4 4 6l1.5 4.2M15.6 15.6 20 18l-1.5-4.2M15.6 8.4 20 6l-1.5 4.2M8.4 15.6 4 18l1.5-4.2"/></svg>',
    vape:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="14" height="8" rx="2.5"/><path d="M17 10h2a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-2M7 8V6"/></svg>',
    tool:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="2.5"/><path d="M12 4v3M12 17v3M4 12h3M17 12h3"/></svg>',
    smoke:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="13" width="16" height="5" rx="1"/><path d="M14 13v5M18 8c1.5-.5 2-1.5 2-3M16 11c2-.6 3-1.8 3-4"/></svg>',
    phone:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z"/></svg>',
    pin:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
    clock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    nav:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>',
    menu:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>',
    close:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
    arrow:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    chev:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
    search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>',
    sliders:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/></svg>',
    grid:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>',
    rows:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="5" rx="1.5"/><rect x="3" y="15" width="18" height="5" rx="1.5"/></svg>',
    star:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 7.1-1.01L12 2z"/></svg>',
    shield:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/></svg>',
    sparkle:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18"/></svg>',
    tag:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12.59 2.59A2 2 0 0 0 11.17 2H4a2 2 0 0 0-2 2v7.17a2 2 0 0 0 .59 1.42l8 8a2 2 0 0 0 2.83 0l7.17-7.17a2 2 0 0 0 0-2.83Z"/><circle cx="7.5" cy="7.5" r="1.5" fill="currentColor"/></svg>',
    heart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 12 5 5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>',
    moon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>',
    info:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 16v-4M12 8h.01"/></svg>',
    check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
    bag:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 7h12l1.5 13.5a1 1 0 0 1-1 1.1H5.5a1 1 0 0 1-1-1.1Z"/><path d="M9 10V6a3 3 0 0 1 6 0v4"/></svg>',
    plus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
    minus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M5 12h14"/></svg>',
    trash:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M6 6l1 15h10l1-15M10 11v6M14 11v6"/></svg>',
    copy:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>'
  };
  window.ICON = ICON;

  /* ---------- Small helpers ---------- */
  function uniq(arr) { return Array.from(new Set(arr)); }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function statusMeta(key) {
    return (window.QCD_STATUS_META && window.QCD_STATUS_META[key]) || { label: key };
  }
  var STATUS_RANK = { ok: 0, low: 1, ask: 2 };

  function injectIcons(root) {
    (root || document).querySelectorAll("[data-icon]").forEach(function (el) {
      const name = el.getAttribute("data-icon");
      if (ICON[name] && !el.firstChild) el.innerHTML = ICON[name];
    });
  }

  /* ---------- Focus trap utility ---------- */
  function createTrap(container, opts) {
    opts = opts || {};
    var lastFocused = null;
    function focusables() {
      return Array.prototype.filter.call(
        container.querySelectorAll('a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'),
        function (el) { return !el.disabled && el.offsetParent !== null; }
      );
    }
    function onKeydown(e) {
      if (e.key === "Escape") {
        if (opts.onEscape) { e.preventDefault(); opts.onEscape(); }
        else e.preventDefault(); /* modal cannot be dismissed (age gate) */
        return;
      }
      if (e.key !== "Tab") return;
      var f = focusables();
      if (!f.length) { e.preventDefault(); return; }
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && (document.activeElement === first || !container.contains(document.activeElement))) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    }
    return {
      activate: function (initial) {
        lastFocused = document.activeElement;
        document.addEventListener("keydown", onKeydown, true);
        var t = initial || focusables()[0] || container;
        if (t && t.focus) t.focus();
      },
      deactivate: function (returnFocus) {
        document.removeEventListener("keydown", onKeydown, true);
        var back = returnFocus || lastFocused;
        if (back && back.focus) back.focus();
      }
    };
  }

  /* ---------- Time-aware store hours (America/Toronto) ----------
     WP: minutes come from window.QCD_HOURS when inlined. */
  var HOURS = window.QCD_HOURS || {};
  var OPEN_MIN = HOURS.open || 10 * 60, CLOSE_MIN = HOURS.close || 24 * 60;
  function torontoMinutes() {
    try {
      var parts = new Intl.DateTimeFormat("en-CA", {
        timeZone: "America/Toronto", hourCycle: "h23", hour: "numeric", minute: "numeric"
      }).formatToParts(new Date());
      var h = 0, m = 0;
      parts.forEach(function (p) { if (p.type === "hour") h = +p.value; if (p.type === "minute") m = +p.value; });
      return h * 60 + m;
    } catch (e) { var d = new Date(); return d.getHours() * 60 + d.getMinutes(); }
  }
  function storeState() {
    var mins = torontoMinutes();
    if (mins >= OPEN_MIN) {
      var left = CLOSE_MIN - mins;
      return left <= 45
        ? { open: true, label: "Closes soon · open until midnight" }
        : { open: true, label: "Open now · until midnight" };
    }
    var until = OPEN_MIN - mins;
    return until <= 60
      ? { open: false, label: "Opens soon · 10 AM" }
      : { open: false, label: "Closed · opens 10 AM" };
  }
  /* Pickup windows for reservations — same Toronto clock, store hours only */
  function pickupWindows() {
    var mins = torontoMinutes();
    var opts = [];
    function fmt(h) { var hh = h % 24; var am = hh < 12; var d = hh % 12 === 0 ? 12 : hh % 12; return d + (am ? " AM" : " PM"); }
    var open = mins >= OPEN_MIN && mins < CLOSE_MIN;
    if (open && (CLOSE_MIN - mins) >= 60) opts.push({ v: "asap", t: "ASAP (within the hour)" });
    var start = Math.max(OPEN_MIN, mins + 45);
    var firstH = Math.ceil(start / 60);
    var today = open;
    if (!today) firstH = 10; /* closed -> tomorrow from open */
    for (var h = firstH; h < 24 && opts.length < 7; h++) {
      if (h < 10) continue;
      opts.push({ v: (today ? "today-" : "tmrw-") + h, t: (today ? "Today " : "Tomorrow ") + fmt(h) + "–" + fmt(h + 1) });
    }
    if (!opts.length) opts.push({ v: "tmrw-10", t: "Tomorrow 10 AM–11 AM" });
    return opts;
  }

  function paintOpenState() {
    var st = storeState();
    document.querySelectorAll("[data-open-label]").forEach(function (el) { el.textContent = st.label; });
    document.querySelectorAll("[data-open-state]").forEach(function (el) { el.classList.toggle("is-closed", !st.open); });
  }
  function initOpenState() {
    if (!document.querySelector("[data-open-label]")) return;
    paintOpenState();
    setInterval(paintOpenState, 60000);
  }

  /* ---------- Age gate (fail-closed, focus-trapped, session-remembered) ---------- */
  function initAgeGate() {
    const gate = document.getElementById("agegate");
    if (!gate) return;
    var ok = false;
    try { ok = sessionStorage.getItem("qcd_age_ok") === "1"; } catch (e) {}
    /* WP: the PHP-set cookie also counts (covers the always-render cache mode) */
    if (!ok) { try { ok = /(?:^|;\s*)qcd_age_ok=1(?:;|$)/.test(document.cookie || ""); } catch (e) {} }
    if (ok) { gate.setAttribute("hidden", ""); return; }

    document.body.style.overflow = "hidden";
    var inerted = [];
    Array.prototype.forEach.call(document.body.children, function (el) {
      if (el !== gate && el.tagName !== "SCRIPT" && !el.hasAttribute("inert")) {
        el.setAttribute("inert", ""); inerted.push(el);
      }
    });

    const yes = gate.querySelector("[data-age-yes]");
    const no = gate.querySelector("[data-age-no]");
    const denied = gate.querySelector("[data-age-denied]");
    const main = gate.querySelector("[data-age-main]");
    var trap = createTrap(gate); /* Escape is swallowed — gate cannot be dismissed */
    trap.activate(yes);

    function release() {
      gate.setAttribute("hidden", "");
      document.body.style.overflow = "";
      inerted.forEach(function (el) { el.removeAttribute("inert"); });
      trap.deactivate(document.getElementById("main") || document.body);
    }
    if (yes) yes.addEventListener("click", function () {
      try { sessionStorage.setItem("qcd_age_ok", "1"); } catch (e) {}
      /* WP: session cookie so PHP can skip rendering the gate next load */
      try { document.cookie = "qcd_age_ok=1;path=/;SameSite=Lax"; } catch (e) {}
      release();
    });
    if (no) no.addEventListener("click", function () {
      if (main) main.hidden = true;
      if (denied) {
        denied.hidden = false;
        var link = denied.querySelector("a");
        if (link) link.focus(); else gate.querySelector(".agegate__card").focus();
      }
    });
  }

  /* ---------- Mobile nav ---------- */
  function initNav() {
    const toggle = document.querySelector("[data-menu-toggle]");
    const nav = document.getElementById("mobileNav");
    if (!toggle || !nav) return;
    const close = nav.querySelector("[data-menu-close]");
    const scrim = nav.querySelector(".mobile-nav__scrim");
    var trap = createTrap(nav.querySelector(".mobile-nav__panel") || nav, { onEscape: shut });
    toggle.setAttribute("aria-expanded", "false");
    function open() {
      nav.classList.add("open");
      document.body.style.overflow = "hidden";
      toggle.setAttribute("aria-expanded", "true");
      trap.activate(close);
    }
    function shut() {
      nav.classList.remove("open");
      document.body.style.overflow = "";
      toggle.setAttribute("aria-expanded", "false");
      trap.deactivate(toggle);
    }
    toggle.addEventListener("click", open);
    if (close) close.addEventListener("click", shut);
    if (scrim) scrim.addEventListener("click", shut);
    nav.querySelectorAll(".mobile-nav__links a, .mobile-nav__foot a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("open"); document.body.style.overflow = "";
        toggle.setAttribute("aria-expanded", "false");
        trap.deactivate(null); /* navigating away — don't yank focus back */
      });
    });
  }

  /* ---------- Footer year ---------- */
  function initYear() {
    document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
  }

  /* ---------- Category overview cards ---------- */
  function renderCategoryCards(targetId) {
    const host = document.getElementById(targetId);
    if (!host || !window.QCD_CATEGORIES) return;
    if (host.hasAttribute("data-ssr")) { injectIcons(host); return; } /* server-rendered — keep */
    host.innerHTML = categoryCardsHTML();
  }
  function categoryCardsHTML() {
    const P = window.QCD_PRODUCTS_PUBLIC || [];
    return (window.QCD_CATEGORIES || []).map(function (c) {
      const count = P.filter(function (p) { return p.category === c.slug; }).length;
      if (c.placeholder) {
        return '<div class="cat-card placeholder" style="--grad:' + c.grad + '" aria-disabled="true">' +
          '<span class="cat-card__icon">' + (ICON[c.icon] || ICON.leaf) + '</span>' +
          '<span class="pill">Pending review</span>' +
          '<h3>' + esc(c.name) + '</h3><p>' + esc(c.blurb) + ' · not browsable</p></div>';
      }
      /* WP: real taxonomy URLs when provided */
      return '<a class="cat-card" href="' + esc(c.url || catUrl(c.slug)) + '" style="--grad:' + c.grad + '">' +
        '<span class="cat-card__icon">' + (ICON[c.icon] || ICON.leaf) + '</span>' +
        '<span class="cat-card__count">' + count + ' item' + (count === 1 ? "" : "s") + '</span>' +
        '<span class="cat-card__arrow">' + ICON.arrow + '</span>' +
        '<h3>' + esc(c.name) + '</h3><p>' + esc(c.blurb) + '</p></a>';
    }).join("");
  }
  window.QCD_categoryCardsHTML = categoryCardsHTML;

  /* ---------- Product card ---------- */
  function productCard(p, opts) {
    opts = opts || {};
    const st = statusMeta(p.status);
    const cat = ((window.QCD_CATEGORIES || []).find(function (c) { return c.slug === p.category; }) || {}).name || p.category;
    const tier = p.tier ? '<span class="tier-tag">' + esc(p.tier) + '</span>' : "";
    const ribbon = opts.featured ? '<span class="fav-ribbon">' + ICON.star + ' Staff pick</span>' : "";
    const brand = p.brand && p.brand !== "—" ? '<span class="brand">' + esc(p.brand) + '</span>' : "";
    const size = p.size && p.size !== "—" ? '<span>' + esc(p.size) + '</span>' : "";
    const isFlower = p.category === "flower";
    const price = (p.price != null)
      ? '<span class="product-card__price">$' + p.price + (isFlower && p.format === "1g" ? '<small>/g ref</small>' : '<small> ref</small>') + '</span>'
      : '<span class="product-card__price muted" style="font-size:.82rem">See in store</span>';
    const media = p.image
      ? '<img src="' + esc(p.image) + '" alt="' + esc(p.name) + '" loading="lazy" decoding="async" width="600" height="600" onerror="this.parentNode.classList.remove(\'has-img\');this.remove()">' +
        '<span class="leaf" aria-hidden="true">' + ICON.leaf + '</span>'
      : '<span class="leaf" aria-hidden="true">' + ICON.leaf + '</span>';
    return '' +
      '<article class="product-card' + (opts.featured ? ' featured' : '') + '">' +
        '<div class="product-card__media' + (p.image ? ' has-img' : '') + '">' + ribbon + tier +
          '<span class="badge ' + p.status + '"><span class="d"></span>' + esc(st.label) + '</span>' +
          media +
        '</div>' +
        '<div class="product-card__body">' +
          '<span class="product-card__cat">' + esc(cat) + '</span>' +
          '<h3 class="product-card__name">' + esc(p.name) + '</h3>' +
          '<div class="product-card__meta">' + brand + size + (p.format && p.format !== "—" ? '<span>' + esc(p.format) + '</span>' : "") + '</div>' +
          '<div class="product-card__foot">' + price +
            (p.status !== "ask"
              ? '<button class="rsv-add" type="button" data-rsv-add="' + esc(p.id) + '" aria-label="Reserve ' + esc(p.name) + ' for pickup">' + ICON.bag + '<span>Reserve</span></button>'
              : '<a class="confirm-btn" href="' + esc(TEL_HREF) + '" aria-label="Call to ask about ' + esc(p.name) + '">' + ICON.phone + 'Ask in store</a>') +
          '</div>' +
        '</div>' +
      '</article>';
  }
  window.QCD_productCard = productCard;

  /* ---------- Featured picks (curated staff picks, in-stock only) ---------- */
  function featuredPicks(list, n) {
    n = n || 8;
    var pool = (list || window.QCD_PRODUCTS_PUBLIC || []).filter(function (p) { return p.status === "ok"; });
    var picks = pool.filter(function (p) { return p.featured; });
    if (picks.length < 4) {
      pool.forEach(function (p) { if (!p.featured && picks.length < n) picks.push(p); });
    }
    return picks.slice(0, n);
  }
  window.QCD_featuredPicks = featuredPicks;

  function renderHomeFeatured() {
    const host = document.getElementById("homeFeaturedRail");
    if (!host) return;
    if (host.hasAttribute("data-ssr")) { injectIcons(host); return; }
    host.innerHTML = featuredPicks().map(function (p) { return productCard(p, { featured: true }); }).join("");
  }
  window.renderHomeFeatured = renderHomeFeatured;

  /* ---------- Scroll reveal ---------- */
  function initReveal() {
    const sel = ".section-head, .why-card, .trust__item, .hero__card, .store-row, .faq-item, .post-card, .cat-card, .filter-panel";
    document.querySelectorAll(sel).forEach(function (el, i) {
      if (!el.hasAttribute("data-reveal")) {
        el.setAttribute("data-reveal", "");
        if (el.classList.contains("why-card") || el.classList.contains("trust__item") || el.classList.contains("cat-card")) el.setAttribute("data-reveal-d", String((i % 4) + 1));
      }
    });
    const targets = document.querySelectorAll("[data-reveal]:not(.is-visible)");
    if (!("IntersectionObserver" in window)) { targets.forEach(function (t) { t.classList.add("is-visible"); }); return; }
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); } });
    }, { threshold: 0.08, rootMargin: "0px 0px -8% 0px" });
    targets.forEach(function (t) { io.observe(t); });
  }
  window.initReveal = initReveal;

  /* ---------- Catalog engine ---------- */
  const PRICE_RANGES = [
    { val: "0-15", label: "Under $15", test: function (v) { return v != null && v <= 15; } },
    { val: "15-30", label: "$15 – $30", test: function (v) { return v != null && v > 15 && v <= 30; } },
    { val: "30-50", label: "$30 – $50", test: function (v) { return v != null && v > 30 && v <= 50; } },
    { val: "50+", label: "$50 +", test: function (v) { return v != null && v > 50; } }
  ];
  const AVAIL_OPTS = [
    { val: "ok", label: "Available", dot: "var(--ok-dot)" },
    { val: "low", label: "Low Stock", dot: "var(--low-dot)" },
    { val: "ask", label: "Ask In Store", dot: "var(--ask-dot)" }
  ];
  const TIER_OPTS = ["Exotic", "Premium", "AAA+", "AA", "Budget"];
  const FACETS = { avails: "avail", tiers: "tier", brands: "brand", formats: "format", prices: "price" };
  const SORTS = ["featured", "newest", "price-low", "price-high", "name"];

  function initCatalog() {
    const grid = document.getElementById("productGrid");
    if (!grid || !window.QCD_PRODUCTS_PUBLIC) return;

    const el = {
      pills: document.getElementById("catPills"),
      featured: document.getElementById("featuredBlock"),
      count: document.getElementById("resultCount"),
      sideDesk: document.getElementById("filterPanelDesktop"),
      sideMob: document.getElementById("filterPanelMobile"),
      chips: document.getElementById("activeFilters"),
      sort: document.getElementById("sortBy"),
      search: document.getElementById("searchInput"),
      title: document.getElementById("browseTitle"),
      crumb: document.getElementById("crumbCat"),
      filterBtn: document.getElementById("filterBtn"),
      filterCount: document.getElementById("filterCount"),
      drawer: document.getElementById("filterDrawer"),
      drawerApply: document.querySelector("[data-drawer-apply]"),
      notice: document.getElementById("catalogNotice")
    };

    const ALL = window.QCD_PRODUCTS_PUBLIC;
    var S = readState();
    var pendingFocus = null;

    /* ----- URL state ----- */
    function readState() {
      const q = new URLSearchParams(location.search);
      function set(name) { var v = q.get(name); return new Set(v ? v.split(",").filter(Boolean) : []); }
      var sort = q.get("sort");
      var density = "comfortable";
      try { density = sessionStorage.getItem("qcd_density") || "comfortable"; } catch (e) {}
      return {
        cat: q.get("cat") || PAGE_DEFAULT_CAT, /* WP: taxonomy archives force their term */
        q: (q.get("q") || "").toLowerCase(),
        avails: set("avail"), tiers: set("tier"), brands: set("brand"), formats: set("format"), prices: set("price"),
        sort: SORTS.indexOf(sort) >= 0 ? sort : "featured",
        density: density === "compact" ? "compact" : "comfortable"
      };
    }
    function writeURL(push) {
      const q = new URLSearchParams();
      if (S.cat !== PAGE_DEFAULT_CAT) q.set("cat", S.cat); /* WP: relative to the page's default */
      if (S.q) q.set("q", S.q);
      if (S.sort !== "featured") q.set("sort", S.sort);
      Object.keys(FACETS).forEach(function (key) {
        if (S[key].size) q.set(FACETS[key], Array.from(S[key]).join(","));
      });
      const url = location.pathname + (q.toString() ? "?" + q.toString() : "") + location.hash;
      try { history[push ? "pushState" : "replaceState"]({ qcd: 1 }, "", url); } catch (e) {}
    }
    function isDefault() {
      return S.cat === PAGE_DEFAULT_CAT && !S.q && S.sort === "featured" &&
        !S.avails.size && !S.tiers.size && !S.brands.size && !S.formats.size && !S.prices.size;
    }

    const catObj = (window.QCD_CATEGORIES || []).find(function (c) { return c.slug === S.cat; });
    function paintTitle() {
      var c = (window.QCD_CATEGORIES || []).find(function (x) { return x.slug === S.cat; });
      var name = c ? c.name : "The Menu";
      if (el.title) el.title.textContent = S.cat === "all" ? "The Menu" : name;
      if (el.crumb) el.crumb.textContent = S.cat === "all" ? "All products" : name;
      if (c || S.cat === "all") document.title = (S.cat === "all" ? "Menu" : name) + " — Queensway Cannabis Dispensary";
    }

    /* Placeholder category is not browsable (e.g. ?cat=nicotine typed by hand) */
    if (catObj && catObj.placeholder) {
      grid.removeAttribute("data-ssr");
      grid.innerHTML = '<div class="empty-state" style="grid-column:1/-1">' + ICON.info +
        '<p><strong>' + esc(catObj.name) + ' is pending legal review.</strong><br>This category isn’t browsable yet. <a href="' + esc(URLS.overview || "categories.html") + '" style="color:var(--green-700);font-weight:700">Browse our other categories</a> or call the store.</p></div>';
      if (el.count) el.count.textContent = "0 products";
      if (el.featured) { el.featured.hidden = true; el.featured.innerHTML = ""; }
      paintTitle();
      return;
    }

    /* ----- filtering ----- */
    function base() {
      return ALL.filter(function (p) {
        if (S.cat !== "all" && p.category !== S.cat) return false;
        if (S.q) {
          var hay = (p.name + " " + (p.brand || "") + " " + (p.tier || "") + " " + p.category + " " + (p.format || "") + " " + (p.size || "")).toLowerCase();
          if (hay.indexOf(S.q) < 0) return false;
        }
        return true;
      });
    }
    function passGroup(p, key) {
      if (key === "avails") return S.avails.size === 0 || S.avails.has(p.status);
      if (key === "tiers") return S.tiers.size === 0 || S.tiers.has(p.tier);
      if (key === "brands") return S.brands.size === 0 || S.brands.has(p.brand);
      if (key === "formats") return S.formats.size === 0 || S.formats.has(p.format);
      if (key === "prices") return S.prices.size === 0 || PRICE_RANGES.some(function (r) { return S.prices.has(r.val) && r.test(p.price); });
      return true;
    }
    const GROUPS = ["avails", "tiers", "brands", "formats", "prices"];
    function passExcept(p, except) { return GROUPS.every(function (g) { return g === except || passGroup(p, g); }); }
    function filtered() { return base().filter(function (p) { return GROUPS.every(function (g) { return passGroup(p, g); }); }); }
    function facetCount(except, predicate) { return base().filter(function (p) { return passExcept(p, except) && predicate(p); }).length; }
    function activeCount() { return S.brands.size + S.formats.size + S.prices.size + S.avails.size + S.tiers.size; }

    /* ----- category pills (real links, JS-enhanced) ----- */
    function pillsHTML() {
      const cats = (window.QCD_CATEGORIES || []).filter(function (c) { return !c.placeholder; });
      function pill(val, label, ico, n) {
        var href = val === "all" ? CATALOG_URL : catUrl(val); /* WP */
        return '<a class="cat-pill' + (S.cat === val ? " active" : "") + '" href="' + href + '" data-cat-pill="' + val + '"' + (S.cat === val ? ' aria-current="page"' : '') + '>' + ico + esc(label) + ' <span class="n">' + n + '</span></a>';
      }
      var html = pill("all", "All", ICON.sparkle, ALL.length);
      cats.forEach(function (c) { html += pill(c.slug, c.name, ICON[c.icon] || ICON.leaf, ALL.filter(function (p) { return p.category === c.slug; }).length); });
      return html;
    }
    function renderPills() { if (el.pills) el.pills.innerHTML = pillsHTML(); }

    /* ----- filter panel ----- */
    function panelHTML() {
      let html = '<div class="filter-panel__head"><h3>' + ICON.sliders + ' Filters</h3><button class="clear" data-clear-all type="button">Clear all</button></div>';
      html += group("Availability", AVAIL_OPTS.map(function (o) {
        return opt("avails", o.val, '<span class="filter-swatch" style="background:' + o.dot + '"></span>' + o.label, facetCount("avails", function (p) { return p.status === o.val; }), S.avails.has(o.val));
      }));
      if (S.cat === "flower" || S.cat === "all") {
        const tierOpts = TIER_OPTS.map(function (t) {
          const n = facetCount("tiers", function (p) { return p.tier === t; });
          return n ? opt("tiers", t, esc(t), n, S.tiers.has(t)) : "";
        }).join("");
        html += group("Quality tier", tierOpts);
      }
      const brands = uniq(base().map(function (p) { return p.brand; })).filter(function (b) { return b && b !== "—"; }).sort();
      if (brands.length) html += group("Brand", brands.map(function (b) { return opt("brands", b, esc(b), facetCount("brands", function (p) { return p.brand === b; }), S.brands.has(b)); }));
      const formats = uniq(base().map(function (p) { return p.format; })).filter(function (f) { return f && f !== "—"; }).sort();
      if (formats.length) html += group("Format", formats.map(function (f) { return opt("formats", f, esc(f), facetCount("formats", function (p) { return p.format === f; }), S.formats.has(f)); }));
      html += group("Price (reference)", PRICE_RANGES.map(function (r) { return opt("prices", r.val, r.label, facetCount("prices", function (p) { return r.test(p.price); }), S.prices.has(r.val)); }));
      return html;
      function group(title, opts) {
        const body = Array.isArray(opts) ? opts.join("") : opts;
        if (!body) return "";
        return '<div class="filter-group"><div class="filter-group__title">' + title + '</div><div class="filter-opts">' + body + '</div></div>';
      }
      function opt(key, val, label, n, on) {
        return '<label class="filter-opt' + (on ? " is-on" : "") + '"><input type="checkbox" data-facet="' + key + '" data-val="' + esc(val) + '"' + (on ? " checked" : "") + '><span>' + label + '</span><span class="ct">' + n + '</span></label>';
      }
    }
    function renderPanels() {
      const html = panelHTML();
      if (el.sideDesk) el.sideDesk.innerHTML = html;
      if (el.sideMob) el.sideMob.innerHTML = html;
    }

    /* ----- active chips ----- */
    function renderChips() {
      if (!el.chips) return;
      const items = [];
      S.avails.forEach(function (v) { const o = AVAIL_OPTS.find(function (x) { return x.val === v; }); items.push(chip("avails", v, o ? o.label : v)); });
      S.tiers.forEach(function (v) { items.push(chip("tiers", v, v)); });
      S.brands.forEach(function (v) { items.push(chip("brands", v, v)); });
      S.formats.forEach(function (v) { items.push(chip("formats", v, v)); });
      S.prices.forEach(function (v) { const o = PRICE_RANGES.find(function (x) { return x.val === v; }); items.push(chip("prices", v, o ? o.label : v)); });
      el.chips.innerHTML = items.join("") + (items.length ? '<button class="active-clear" data-clear-all type="button">Clear all</button>' : "");
      function chip(key, val, label) {
        return '<span class="active-chip">' + esc(label) + '<button type="button" data-remove-facet="' + key + '" data-remove-val="' + esc(val) + '" aria-label="Remove filter: ' + esc(label) + '">' + ICON.close + '</button></span>';
      }
    }

    /* ----- featured rail (clean default state only) ----- */
    function featuredHTML() {
      const picks = featuredPicks(base());
      if (picks.length < 4) return "";
      return '<div class="featured"><div class="featured__head"><h3>' + ICON.star + ' Staff picks</h3><span class="muted" style="font-size:.85rem">Call to confirm</span></div><div class="featured__rail">' +
        picks.map(function (p) { return productCard(p, { featured: true }); }).join("") + '</div></div>';
    }
    function renderFeatured() {
      if (!el.featured) return;
      const html = (activeCount() === 0 && !S.q) ? featuredHTML() : "";
      el.featured.innerHTML = html;
      el.featured.hidden = !html;
    }
    window.QCD_featuredBlockHTML = featuredHTML;

    /* ----- sorting ----- */
    function sortRows(rows) {
      rows.sort(function (a, b) {
        if (S.sort === "price-low") return (a.price != null ? a.price : 9999) - (b.price != null ? b.price : 9999);
        if (S.sort === "price-high") return (b.price != null ? b.price : 0) - (a.price != null ? a.price : 0);
        if (S.sort === "newest") return new Date(b.updated) - new Date(a.updated);
        if (S.sort === "name") return a.name.localeCompare(b.name);
        /* featured: staff picks first, then availability, then name */
        return (b.featured === true) - (a.featured === true) ||
               STATUS_RANK[a.status] - STATUS_RANK[b.status] ||
               a.name.localeCompare(b.name);
      });
      return rows;
    }
    function gridHTML(rows) {
      return rows.length
        ? rows.map(function (p) { return productCard(p); }).join("")
        : '<div class="empty-state" style="grid-column:1/-1">' + ICON.search + '<p><strong>No products match your filters.</strong><br>Try clearing a filter, or call the store at <a href="' + esc(TEL_HREF) + '" style="color:var(--green-700);font-weight:700">' + esc(PHONE_LABEL) + '</a> — we’re happy to check for you.</p></div>';
    }
    window.QCD_gridHTML = function () { return gridHTML(sortRows(filtered())); };
    window.QCD_pillsHTML = pillsHTML;
    window.QCD_panelHTML = panelHTML;

    /* ----- main apply/render ----- */
    function apply(opts) {
      opts = opts || {};
      var rows = sortRows(filtered());
      grid.className = "product-grid" + (S.density === "compact" ? " is-compact" : "");
      grid.removeAttribute("data-ssr");
      grid.innerHTML = gridHTML(rows);
      if (el.count) el.count.innerHTML = "<strong>" + rows.length + "</strong> product" + (rows.length === 1 ? "" : "s");
      const ac = activeCount();
      if (el.filterCount) { el.filterCount.textContent = ac ? String(ac) : ""; el.filterCount.style.display = ac ? "" : "none"; }
      if (el.filterBtn) el.filterBtn.setAttribute("aria-expanded", el.drawer && el.drawer.classList.contains("open") ? "true" : "false");
      if (el.drawerApply) el.drawerApply.textContent = "Show " + rows.length + " product" + (rows.length === 1 ? "" : "s");
      renderPills(); renderPanels(); renderChips(); renderFeatured(); paintTitle();
      if (!opts.noURL) writeURL(opts.push);
      restoreFocus();
    }
    function restoreFocus() {
      if (!pendingFocus) return;
      var sel = pendingFocus; pendingFocus = null;
      var target = null;
      if (sel.type === "facet") {
        var root = sel.mob ? el.sideMob : el.sideDesk;
        if (root) target = root.querySelector('[data-facet="' + sel.key + '"][data-val="' + CSS.escape(sel.val) + '"]');
      } else if (sel.type === "pill" && el.pills) {
        target = el.pills.querySelector('[data-cat-pill="' + sel.val + '"]');
      }
      if (target) target.focus({ preventScroll: true });
    }
    function clearAll() { S.brands.clear(); S.formats.clear(); S.prices.clear(); S.avails.clear(); S.tiers.clear(); apply(); }

    /* ----- events (delegated) ----- */
    document.addEventListener("change", function (e) {
      const cb = e.target.closest && e.target.closest("[data-facet]");
      if (!cb) return;
      const key = cb.getAttribute("data-facet"), val = cb.getAttribute("data-val");
      if (cb.checked) S[key].add(val); else S[key].delete(val);
      pendingFocus = { type: "facet", key: key, val: val, mob: !!(el.sideMob && el.sideMob.contains(cb)) };
      apply();
    });
    document.addEventListener("click", function (e) {
      const pill = e.target.closest && e.target.closest("[data-cat-pill]");
      if (pill) {
        e.preventDefault();
        S.cat = pill.getAttribute("data-cat-pill");
        if (S.cat !== "flower" && S.cat !== "all") S.tiers.clear();
        pendingFocus = { type: "pill", val: S.cat };
        apply({ push: true });
        return;
      }
      const rm = e.target.closest && e.target.closest("[data-remove-facet]");
      if (rm) { S[rm.getAttribute("data-remove-facet")].delete(rm.getAttribute("data-remove-val")); apply(); return; }
      if (e.target.closest && e.target.closest("[data-clear-all]")) { clearAll(); return; }
      const dt = e.target.closest && e.target.closest("[data-density]");
      if (dt) {
        S.density = dt.getAttribute("data-density");
        try { sessionStorage.setItem("qcd_density", S.density); } catch (err) {}
        document.querySelectorAll("[data-density]").forEach(function (b) {
          var on = b === dt; b.classList.toggle("active", on); b.setAttribute("aria-pressed", on ? "true" : "false");
        });
        apply({ noURL: true });
        return;
      }
      if (e.target.closest && e.target.closest("[data-filter-open]")) openDrawer(true);
      if (e.target.closest && (e.target.closest("[data-drawer-close]") || e.target.closest("[data-drawer-apply]"))) openDrawer(false);
    });
    var searchT = null;
    if (el.search) {
      el.search.value = S.q;
      el.search.addEventListener("input", function () {
        clearTimeout(searchT);
        searchT = setTimeout(function () { S.q = el.search.value.trim().toLowerCase(); apply(); }, 120);
      });
    }
    if (el.sort) {
      el.sort.value = S.sort;
      el.sort.addEventListener("change", function () { S.sort = el.sort.value; apply(); });
    }
    window.addEventListener("popstate", function () { S = readState(); if (el.search) el.search.value = S.q; if (el.sort) el.sort.value = S.sort; apply({ noURL: true }); });

    /* ----- mobile filter drawer (focus-trapped) ----- */
    var drawerTrap = el.drawer ? createTrap(el.drawer.querySelector(".filter-drawer__panel") || el.drawer, { onEscape: function () { openDrawer(false); } }) : null;
    function openDrawer(open) {
      if (!el.drawer) return;
      var was = el.drawer.classList.contains("open");
      el.drawer.classList.toggle("open", open);
      document.body.style.overflow = open ? "hidden" : "";
      if (el.filterBtn) el.filterBtn.setAttribute("aria-expanded", open ? "true" : "false");
      if (drawerTrap) { if (open && !was) drawerTrap.activate(); else if (!open && was) drawerTrap.deactivate(el.filterBtn); }
    }

    /* ----- density buttons initial state ----- */
    document.querySelectorAll("[data-density]").forEach(function (b) {
      var on = b.getAttribute("data-density") === S.density;
      b.classList.toggle("active", on); b.setAttribute("aria-pressed", on ? "true" : "false");
    });

    /* ----- boot: keep the server-rendered grid when state is default ----- */
    if (grid.hasAttribute("data-ssr") && isDefault() && S.density === "comfortable") {
      var rowsN = sortRows(filtered()).length;
      if (el.count) el.count.innerHTML = "<strong>" + rowsN + "</strong> product" + (rowsN === 1 ? "" : "s");
      if (el.drawerApply) el.drawerApply.textContent = "Show " + rowsN + " product" + (rowsN === 1 ? "" : "s");
      injectIcons();
      paintTitle();
    } else {
      apply({ noURL: true });
      writeURL(false);
    }
    initReveal();
  }

  /* ============================================================
     RESERVE FOR PICKUP — request-only flow. No payment, no delivery.
     Items + contact stay in this visitor's browser; submitting POSTs
     the request to the store's site (WP) with the compose-and-text
     path kept as offline fallback. Staff confirm by text or phone.
     ============================================================ */
  var RSV_KEY = "qcd_rsv_v1";
  var RSV_MAX_PER_ITEM = 4;
  var RSV_MAX_FLOWER_G = 30; /* Ontario public possession limit, dried */
  var rsvMem = null;

  function rsvLoad() {
    if (rsvMem) return rsvMem;
    var base = { items: {}, meta: {}, submitted: null };
    try {
      var raw = localStorage.getItem(RSV_KEY);
      rsvMem = raw ? JSON.parse(raw) : base;
    } catch (e) { rsvMem = base; }
    if (!rsvMem || typeof rsvMem !== "object" || !rsvMem.items) rsvMem = base;
    return rsvMem;
  }
  function rsvSave() {
    try { localStorage.setItem(RSV_KEY, JSON.stringify(rsvMem)); } catch (e) {}
    rsvPaintBadges();
  }
  function rsvProduct(id) {
    return (window.QCD_PRODUCTS_PUBLIC || []).find(function (p) { return p.id === id; }) || null;
  }
  function rsvGrams(p) {
    if (!p || (p.category !== "flower" && p.category !== "pre-rolls")) return 0;
    var m = String(p.size || "").match(/(\d+(?:\.\d+)?)\s*[x×]\s*(\d+(?:\.\d+)?)\s*g/i);
    if (m) return parseFloat(m[1]) * parseFloat(m[2]);
    m = String(p.size || "").match(/(\d+(?:\.\d+)?)\s*g/i);
    return m ? parseFloat(m[1]) : 0;
  }
  function rsvTotals() {
    var st = rsvLoad(), n = 0, grams = 0, dollars = 0, hasSeeStore = false;
    Object.keys(st.items).forEach(function (id) {
      var q = st.items[id], p = rsvProduct(id);
      if (!p) { delete st.items[id]; return; }
      n += q; grams += rsvGrams(p) * q;
      if (p.price != null) dollars += p.price * q; else hasSeeStore = true;
    });
    return { n: n, grams: grams, dollars: dollars, hasSeeStore: hasSeeStore };
  }
  function rsvCanAdd(id, delta) {
    var st = rsvLoad(), p = rsvProduct(id);
    if (!p || p.status === "ask") return { ok: false, why: "Ask in store for this one — give us a call." };
    var q = (st.items[id] || 0) + delta;
    if (q > RSV_MAX_PER_ITEM) return { ok: false, why: "Max " + RSV_MAX_PER_ITEM + " per product in one request." };
    var g = rsvTotals().grams + rsvGrams(p) * delta;
    if (g > RSV_MAX_FLOWER_G) return { ok: false, why: "That would exceed the 30 g dried-flower legal carry limit — staff can help you plan a second visit." };
    return { ok: true };
  }
  function rsvSet(id, count) {
    var st = rsvLoad();
    if (count <= 0) delete st.items[id]; else st.items[id] = count;
    if (st.submitted) st.submitted = null; /* editing reopens the request */
    rsvSave();
  }
  function rsvCount() { return rsvTotals().n; }

  function rsvPaintBadges() {
    var n = rsvCount();
    document.querySelectorAll("[data-rsv-count]").forEach(function (el) {
      el.textContent = n;
      el.hidden = n === 0;
      el.classList.remove("pop"); void el.offsetWidth; if (n) el.classList.add("pop");
    });
  }

  /* ----- drawer rendering ----- */
  function rsvEls() {
    var d = document.getElementById("rsvDrawer");
    if (!d) return null;
    return {
      drawer: d,
      panel: d.querySelector(".rsv-drawer__panel"),
      list: d.querySelector("[data-rsv-list]"),
      empty: d.querySelector("[data-rsv-empty]"),
      form: d.querySelector("[data-rsv-form]"),
      done: d.querySelector("[data-rsv-done]"),
      total: d.querySelector("[data-rsv-total]"),
      cap: d.querySelector("[data-rsv-cap]"),
      when: d.querySelector("#rsvWhen"),
      name: d.querySelector("#rsvName"),
      phone: d.querySelector("#rsvPhone"),
      notes: d.querySelector("#rsvNotes"),
      hp: d.querySelector("[data-rsv-hp]"), /* WP: honeypot */
      err: d.querySelector("[data-rsv-err]"),
      submit: d.querySelector("[data-rsv-submit]"),
      foot: d.querySelector(".rsv-drawer__foot")
    };
  }
  function rsvItemRow(p, q) {
    var g = rsvGrams(p);
    return '<div class="rsv-item" data-rsv-row="' + esc(p.id) + '">' +
      '<div class="rsv-item__info">' +
        '<span class="rsv-item__cat">' + esc(p.category.replace(/-/g, " ")) + (g ? ' · ' + (g * q) + ' g' : '') + '</span>' +
        '<strong class="rsv-item__name">' + esc(p.name) + '</strong>' +
        '<span class="rsv-item__meta">' + esc(p.brand || "") + (p.size && p.size !== "—" ? ' · ' + esc(p.size) : '') + (p.price != null ? ' · $' + (p.price * q) + ' ref' : ' · price in store') + '</span>' +
      '</div>' +
      '<div class="rsv-step" role="group" aria-label="Quantity for ' + esc(p.name) + '">' +
        '<button type="button" data-rsv-dec="' + esc(p.id) + '" aria-label="Decrease quantity">' + ICON.minus + '</button>' +
        '<span class="rsv-step__n" aria-live="polite">' + q + '</span>' +
        '<button type="button" data-rsv-inc="' + esc(p.id) + '" aria-label="Increase quantity">' + ICON.plus + '</button>' +
      '</div>' +
      '<button type="button" class="rsv-item__del" data-rsv-del="' + esc(p.id) + '" aria-label="Remove ' + esc(p.name) + '">' + ICON.trash + '</button>' +
    '</div>';
  }
  function rsvRefCode() { return "QCD-" + Date.now().toString(36).slice(-5).toUpperCase(); }
  function rsvMessage(st) {
    var lines = ["QUEENSWAY PICKUP REQUEST " + (st.submitted && st.submitted.ref || "")];
    lines.push((st.meta.name || "") + " · " + (st.meta.phone || ""));
    lines.push("Pickup: " + (st.meta.whenLabel || ""));
    Object.keys(st.items).forEach(function (id) {
      var p = rsvProduct(id); if (!p) return;
      lines.push("- " + st.items[id] + " × " + p.name + (p.size && p.size !== "—" ? " (" + p.size + ")" : ""));
    });
    var t = rsvTotals();
    lines.push("Est. $" + t.dollars + (t.hasSeeStore ? "+" : "") + " ref — pay in store");
    if (st.meta.notes) lines.push("Notes: " + st.meta.notes);
    lines.push("19+ ID at pickup. Request only until staff confirms.");
    return lines.join("\n");
  }
  function rsvRender() {
    var el = rsvEls(); if (!el) return;
    var st = rsvLoad();
    var ids = Object.keys(st.items).filter(function (id) { return rsvProduct(id); });
    var has = ids.length > 0;
    el.empty.hidden = has || !!st.submitted;
    el.list.hidden = !has || !!st.submitted;
    el.form.hidden = !has || !!st.submitted;
    el.foot.hidden = !has || !!st.submitted;
    el.done.hidden = !st.submitted;
    if (st.submitted) {
      el.done.querySelector("[data-rsv-ref]").textContent = st.submitted.ref;
      el.done.querySelector("[data-rsv-msg]").textContent = rsvMessage(st);
      /* WP: the copy reflects whether the request already reached the site */
      var line = el.done.querySelector("[data-rsv-doneline]");
      if (line) line.textContent = st.submitted.sent
        ? "Your request is in — we confirm by text or call, usually within minutes during opening hours."
        : "Send it to the store and we’ll confirm by text or call — usually within minutes during opening hours.";
      var smsA = el.done.querySelector("[data-rsv-sms]");
      if (smsA) {
        smsA.href = "sms:" + SMS_NUM + "?&body=" + encodeURIComponent(rsvMessage(st));
        smsA.textContent = st.submitted.sent ? "Text the store instead" : "Text request to the store";
      }
      var dh = el.done.querySelector("h3");
      if (dh) dh.textContent = st.submitted.sent ? "Request sent" : "Request ready";
      return;
    }
    if (!has) return;
    el.list.innerHTML = ids.map(function (id) { return rsvItemRow(rsvProduct(id), st.items[id]); }).join("");
    var t = rsvTotals();
    el.total.innerHTML = "<strong>" + t.n + "</strong> item" + (t.n === 1 ? "" : "s") + " · est. <strong>$" + t.dollars + (t.hasSeeStore ? "+" : "") + "</strong> ref" + (t.grams ? " · " + t.grams + " g flower" : "");
    el.cap.hidden = t.grams < RSV_MAX_FLOWER_G * 0.7;
    if (!el.cap.hidden) el.cap.textContent = t.grams + " g of " + RSV_MAX_FLOWER_G + " g dried-flower legal limit";
    if (el.when && !el.when.dataset.filled) {
      el.when.innerHTML = pickupWindows().map(function (o) { return '<option value="' + o.v + '">' + o.t + "</option>"; }).join("");
      el.when.dataset.filled = "1";
    }
  }

  /* ----- open/close (focus-trapped bottom sheet / side panel) ----- */
  var rsvTrap = null, rsvOpenBtn = null;
  function rsvOpen(open, invoker) {
    var el = rsvEls(); if (!el) return;
    var was = el.drawer.classList.contains("open");
    if (open === was) { if (open) rsvRender(); return; }
    /* close mobile nav if it invoked us */
    var nav = document.getElementById("mobileNav");
    if (open && nav && nav.classList.contains("open")) nav.classList.remove("open");
    el.drawer.classList.toggle("open", open);
    document.body.style.overflow = open ? "hidden" : "";
    document.querySelectorAll("[data-rsv-open]").forEach(function (b) { b.setAttribute("aria-expanded", open ? "true" : "false"); });
    if (!rsvTrap) rsvTrap = createTrap(el.panel, { onEscape: function () { rsvOpen(false); } });
    if (open) { rsvOpenBtn = invoker || null; rsvRender(); rsvTrap.activate(); var cf = el.panel.querySelector("[data-rsv-close]"); if (cf) cf.focus(); }
    else rsvTrap.deactivate(rsvOpenBtn);
  }

  function rsvFlash(btn) {
    var span = btn.querySelector("span");
    var old = span ? span.textContent : "";
    btn.classList.add("is-added");
    if (span) span.textContent = "Added ✓";
    setTimeout(function () { btn.classList.remove("is-added"); if (span) span.textContent = old; }, 1200);
  }
  function rsvNudge(msg) {
    var n = document.getElementById("rsvNudge");
    if (!n) {
      n = document.createElement("div"); n.id = "rsvNudge"; n.className = "rsv-nudge"; n.setAttribute("role", "status");
      document.body.appendChild(n);
    }
    n.textContent = msg; n.classList.add("show");
    clearTimeout(n._t); n._t = setTimeout(function () { n.classList.remove("show"); }, 2600);
  }

  function initRSV() {
    if (!document.getElementById("rsvDrawer")) { rsvPaintBadges(); return; }
    rsvPaintBadges();

    function focusDone() {
      var el = rsvEls(); if (!el) return;
      var dh = el.done.querySelector("h3");
      if (dh) { dh.setAttribute("tabindex", "-1"); dh.focus(); }
    }

    document.addEventListener("click", function (e) {
      var t = e.target.closest ? e.target : null; if (!t) return;
      var add = t.closest("[data-rsv-add]");
      if (add) {
        var id = add.getAttribute("data-rsv-add");
        var chk = rsvCanAdd(id, 1);
        if (!chk.ok) { rsvNudge(chk.why); return; }
        rsvSet(id, (rsvLoad().items[id] || 0) + 1);
        rsvFlash(add); rsvNudge("Added to your pickup request");
        return;
      }
      var opn = t.closest("[data-rsv-open]");
      if (opn) { rsvOpen(true, opn); return; }
      if (t.closest("[data-rsv-close]")) { rsvOpen(false); return; }
      var inc = t.closest("[data-rsv-inc]");
      if (inc) {
        var iid = inc.getAttribute("data-rsv-inc");
        var c = rsvCanAdd(iid, 1);
        if (!c.ok) { rsvNudge(c.why); return; }
        rsvSet(iid, (rsvLoad().items[iid] || 0) + 1); rsvRender(); return;
      }
      var dec = t.closest("[data-rsv-dec]");
      if (dec) { var did = dec.getAttribute("data-rsv-dec"); rsvSet(did, (rsvLoad().items[did] || 0) - 1); rsvRender(); return; }
      var del = t.closest("[data-rsv-del]");
      if (del) { rsvSet(del.getAttribute("data-rsv-del"), 0); rsvRender(); return; }
      if (t.closest("[data-rsv-again]")) { rsvMem.submitted = null; rsvMem.items = {}; rsvSave(); rsvRender(); return; }
      var cp = t.closest("[data-rsv-copy]");
      if (cp) {
        var msg = rsvMessage(rsvLoad());
        var done = function () { rsvNudge("Copied — paste it in a text to the store"); };
        try { navigator.clipboard.writeText(msg).then(done, done); } catch (e2) { done(); }
        return;
      }
      var sub = t.closest("[data-rsv-submit]");
      if (sub) {
        var el = rsvEls(), st = rsvLoad();
        var name = (el.name.value || "").trim();
        var phone = (el.phone.value || "").replace(/\D/g, "");
        var errs = [];
        if (name.length < 2) errs.push("your name");
        if (phone.length < 10) errs.push("a 10-digit phone number");
        el.err.hidden = !errs.length;
        if (errs.length) { el.err.textContent = "Please add " + errs.join(" and ") + "."; el.err.focus && el.err.focus(); return; }
        st.meta = {
          name: name, phone: phone,
          when: el.when.value,
          whenLabel: el.when.options[el.when.selectedIndex] ? el.when.options[el.when.selectedIndex].text : "",
          notes: (el.notes.value || "").trim().slice(0, 200)
        };

        /* WP: POST to the site's reserve endpoint; compose-only is the fallback */
        var api = window.QCD_API && window.QCD_API.reserve;
        if (api && window.fetch) {
          if (sub.disabled) return;
          sub.disabled = true;
          var oldTxt = sub.textContent;
          sub.textContent = "Sending…";
          var payload = {
            name: st.meta.name,
            phone: st.meta.phone,
            when: st.meta.when,
            notes: st.meta.notes,
            website: (el.hp && el.hp.value) || "",
            items: Object.keys(st.items).map(function (id) { return { id: id, count: st.items[id] }; })
          };
          fetch(api, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          }).then(function (r) {
            return r.json().then(function (d) { return { ok: r.ok, d: d }; }, function () { return { ok: false, d: null }; });
          }).then(function (res) {
            sub.disabled = false; sub.textContent = oldTxt;
            if (res.ok && res.d && res.d.ref) {
              st.submitted = { ref: res.d.ref, at: Date.now(), sent: true };
              rsvSave(); rsvRender(); focusDone();
            } else {
              var msg2 = (res.d && res.d.message) || "Something went wrong — please try again, or text or call the store.";
              el.err.hidden = false; el.err.textContent = msg2;
              if (el.err.focus) el.err.focus();
            }
          }).catch(function () {
            /* offline / endpoint unreachable — keep the compose-and-text path */
            sub.disabled = false; sub.textContent = oldTxt;
            st.submitted = { ref: rsvRefCode(), at: Date.now(), sent: false };
            rsvSave(); rsvRender(); focusDone();
            rsvNudge("Couldn’t reach the site — text or call to send your request.");
          });
          return;
        }

        st.submitted = { ref: rsvRefCode(), at: Date.now() };
        rsvSave(); rsvRender(); focusDone();
        return;
      }
    });
    /* keep windows fresh if drawer stays open across the hour */
    setInterval(function () { var el = rsvEls(); if (el && el.when) el.when.dataset.filled = ""; }, 15 * 60000);
  }

  /* ---------- Boot ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    injectIcons();
    initAgeGate();
    initNav();
    initYear();
    initOpenState();
    if (document.getElementById("homeCatGrid")) renderCategoryCards("homeCatGrid");
    if (document.getElementById("allCatGrid")) renderCategoryCards("allCatGrid");
    renderHomeFeatured();
    initCatalog();
    initRSV();
    initReveal();
  });
})();
