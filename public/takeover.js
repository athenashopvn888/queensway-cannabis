(()=>{const key='takeover-age-ok-qcd';if(sessionStorage.getItem(key))return;const d=document.createElement('div');d.className='takeover-age-gate';d.innerHTML='<div class="takeover-age-card"><div class="takeover-age-kicker">19+ ONLY</div><h2>ARE YOU 19 OR OLDER?</h2><p>You must be of legal age in Ontario to enter Queensway Cannabis Dispensary. Please verify your age to continue.</p><button>YES, I AM 19 OR OLDER</button><a href="https://www.google.ca">No — take me back</a></div>';document.body.appendChild(d);d.querySelector('button').onclick=()=>{sessionStorage.setItem(key,'1');d.remove()}})();
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

  normalizeHours();
  new MutationObserver(normalizeHours).observe(document.body, {
    childList: true,
    subtree: true,
  });
})();
