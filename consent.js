// Cookie consent for Google tag (Consent Mode v2) and Meta Pixel.
// Load it before both tags: it sets the default consent they start with.
(function () {
  var KEY = 'bv-consent';
  var tz = '';
  try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) {}
  // shortcut: guesses EU/EEA/UK/CH visitors by time zone (GitHub Pages has no geo-IP); use the visitor's country from the server once the site runs behind Cloudflare.
  var needsConsent = /^(Europe\/|Atlantic\/(Canary|Madeira|Azores|Reykjavik|Faroe))/.test(tz);
  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}
  var granted = saved ? saved === 'granted' : !needsConsent;

  var state = function (g) {
    var v = g ? 'granted' : 'denied';
    return { ad_storage: v, ad_user_data: v, ad_personalization: v, analytics_storage: v };
  };
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { dataLayer.push(arguments); };
  gtag('consent', 'default', state(granted));
  window.bvConsentGranted = granted; // read by the Meta Pixel snippet before fbq('init')

  function choose(g) {
    try { localStorage.setItem(KEY, g ? 'granted' : 'denied'); } catch (e) {}
    gtag('consent', 'update', state(g));
    if (window.fbq) fbq('consent', g ? 'grant' : 'revoke');
    var b = document.getElementById('bv-cookies');
    if (b) b.remove();
  }

  // Also opened by the "Cookies" link in the footer, so a choice can be changed.
  window.bvCookieSettings = function () {
    if (document.getElementById('bv-cookies')) return;
    var css = document.createElement('style');
    css.textContent =
      '#bv-cookies{position:fixed;left:16px;right:16px;bottom:16px;z-index:9999;max-width:560px;margin:0 auto;padding:16px 20px;' +
      'background:#111;color:#f4f4f1;border:1px solid rgba(244,244,241,.16);border-radius:12px;font:400 14px/1.5 "Instrument Sans",system-ui,sans-serif}' +
      '#bv-cookies p{margin:0 0 12px}#bv-cookies div{display:flex;gap:8px;flex-wrap:wrap}' +
      '#bv-cookies button{flex:1;min-height:44px;padding:0 16px;border-radius:999px;border:1px solid rgba(244,244,241,.32);background:transparent;color:inherit;font:inherit;font-weight:500;cursor:pointer}' +
      '#bv-cookies button:hover,#bv-cookies button:focus-visible{border-color:#ff9902;color:#ff9902;outline:none}';
    var b = document.createElement('div');
    b.id = 'bv-cookies';
    b.setAttribute('role', 'dialog');
    b.setAttribute('aria-label', 'Cookies');
    b.innerHTML =
      '<p>We use cookies from Google and Meta to measure visits and to show Boothview ads to people who have been here. ' +
      'Nothing is set until you agree. You can change this any time under “Cookies” at the bottom of the page.</p>' +
      '<div><button type="button" data-g="0">Reject</button><button type="button" data-g="1">Accept</button></div>';
    b.addEventListener('click', function (e) {
      var g = e.target.getAttribute && e.target.getAttribute('data-g');
      if (g) choose(g === '1');
    });
    document.head.appendChild(css);
    document.body.appendChild(b);
  };

  if (needsConsent && !saved) {
    if (document.body) window.bvCookieSettings();
    else document.addEventListener('DOMContentLoaded', window.bvCookieSettings);
  }
})();
