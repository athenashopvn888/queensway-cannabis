(()=>{const key='takeover-age-ok-qcd';if(sessionStorage.getItem(key)||localStorage.getItem('QCD01_age_verified')==='true')return;const d=document.createElement('div');d.className='takeover-age-gate';d.innerHTML='<div class="takeover-age-card"><div class="takeover-age-kicker">19+ ONLY</div><h2>ARE YOU 19 OR OLDER?</h2><p>You must be of legal age in Ontario to enter Queensway Cannabis Dispensary. Please verify your age to continue.</p><button>YES, I AM 19 OR OLDER</button><a href="https://www.google.ca">No — take me back</a></div>';document.body.appendChild(d);d.querySelector('button').onclick=()=>{sessionStorage.setItem(key,'1');localStorage.setItem('QCD01_age_verified','true');d.remove()}})();
(() => {
  const replacements = [
    [/open now\s*·?\s*until midnight/gi, "Open 24 hours"],
    [/until midnight/gi, "open 24 hours"],
    [/10:00\s*AM\s*[–-]\s*12:00\s*AM(?:\s*\(midnight\))?/gi, "Open 24 hours"],
    [/10\s*AM\s*[–-]\s*12\s*AM/gi, "Open 24 hours"],
    [/seven days a week,?\s*10\s*AM\s*to\s*midnight/gi, "open 24 hours a day, 7 days a week"],
  ];

  const normalizeHours = () => {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      let value = node.nodeValue || "";
      for (const [pattern, replacement] of replacements) {
        value = value.replace(pattern, replacement);
      }
      if (value !== node.nodeValue) node.nodeValue = value;
    }
  };

  const normalizeTaxonomy = () => {
    document.querySelectorAll('a[href="/menu/flower/"]').forEach((link) => {
      link.setAttribute("href", "/exotic-weed");
      const heading = link.querySelector("h3");
      if (heading && heading.textContent !== "Weed Flower") {
        heading.textContent = "Weed Flower";
      }
    });

    document.querySelectorAll('a[href="/menu/vapes/"]').forEach((link) => {
      if (link.getAttribute("href") !== "/items/vape-disposables") {
        link.setAttribute("href", "/items/vape-disposables");
      }
      const heading = link.querySelector("h3");
      const description = link.querySelector("p");
      if (heading && heading.textContent !== "THC Vape") heading.textContent = "THC Vape";
      if (description && description.textContent !== "Cannabis vape products") {
        description.textContent = "Cannabis vape products";
      }
      if (!heading && link.textContent?.trim() === "Vapes") link.textContent = "THC Vape";
    });

    document.querySelectorAll('a[href="/menu/disposables/"]').forEach((link) => {
      if (link.classList.contains("cat-card")) link.remove();
    });

    document.querySelectorAll(".cat-card.placeholder").forEach((card) => {
      const heading = card.querySelector("h3");
      if (!heading?.textContent?.includes("Cigarettes / Nicotine")) return;
      const link = document.createElement("a");
      link.className = card.className.replace("placeholder", "").trim();
      link.href = "/items/vapes";
      link.innerHTML = card.innerHTML;
      link.removeAttribute("aria-disabled");
      link.querySelector(".pill")?.remove();
      const linkHeading = link.querySelector("h3");
      const description = link.querySelector("p");
      if (linkHeading) linkHeading.textContent = "Nicotine Vape";
      if (description) description.textContent = "Nicotine products for adults 19+";
      card.replaceWith(link);
    });
  };

  normalizeHours();
  normalizeTaxonomy();
  new MutationObserver(() => {
    normalizeHours();
    normalizeTaxonomy();
  }).observe(document.body, {
    childList: true,
    subtree: true,
  });
})();
