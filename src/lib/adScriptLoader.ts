/**
 * Monetag & Third-Party Ad Script Controller
 * Prevents third-party ad networks, popunders, and interstitial scripts
 * from firing when the admin is working in the Admin Panel or visiting /admin.
 */

let scriptsInjected = false;

export function isCurrentSessionAdmin(): boolean {
  try {
    const isPathAdmin = window.location.pathname.toLowerCase().replace(/\/+$/, '') === '/admin';
    const isHashAdmin = window.location.hash.toLowerCase().includes('admin');
    const hasAdminToken = !!sessionStorage.getItem('premium_web_store_admin_token');
    return isPathAdmin || isHashAdmin || hasAdminToken;
  } catch {
    return false;
  }
}

export function syncMonetagAds(isAdminActive: boolean): void {
  // If user is admin or currently inside admin panel, strictly NEVER load ad scripts!
  if (isAdminActive || isCurrentSessionAdmin()) {
    // If scripts were already injected, we don't reload or attach anything
    return;
  }

  // If already injected for visitor session, skip
  if (scriptsInjected) return;

  try {
    // 1. Monetag Tag Zone 284836
    const script1 = document.createElement('script');
    script1.id = 'monetag-tag-284836';
    script1.src = 'https://quge5.com/88/tag.min.js';
    script1.dataset.zone = '284836';
    script1.async = true;
    script1.setAttribute('data-cfasync', 'false');
    document.head.appendChild(script1);

    // 2. Monetag Zone 11867606
    const script2 = document.createElement('script');
    script2.id = 'monetag-tag-11867606';
    script2.text = `(function(s){s.dataset.zone='11867606',s.src='https://al5sm.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`;
    document.head.appendChild(script2);

    scriptsInjected = true;
    console.log('[AdManager] Monetag ads initialized for public visitors');
  } catch (err) {
    console.warn('[AdManager] Error initializing Monetag scripts:', err);
  }
}
