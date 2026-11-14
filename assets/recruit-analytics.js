(() => {
  'use strict';
  // Reuse the existing recruitment Pixel and its production-host boundary.
  // No Lead/Contact/SubmitApplication event is emitted for outbound clicks.
  const production = location.hostname === 'legohair-recruit-lp.vercel.app';
  const events = {
    line_consultation_click: ['RecruitLineClick', 'LINE'],
    instagram_dm_consultation_click: ['RecruitInstagramDMClick', 'Instagram DM'],
    salon_tour_click: ['RecruitFormClick', 'Google Forms'],
    instagram_profile_click: ['RecruitInstagramProfileClick', 'Instagram profile']
  };
  const placements = new Set(['hero', 'entry', 'sticky', 'qr']);
  const adapterActive = () => window.LEGOHAIR_ANALYTICS_CONSENT === true && typeof window.LEGOHAIR_ANALYTICS_ADAPTER === 'function';
  const allowed = () => production && window.LEGOHAIR_ANALYTICS_CONSENT !== false && navigator.globalPrivacyControl !== true;
  if (allowed() && !adapterActive() && !window.fbq) {
    const fbq = window.fbq = function () { fbq.callMethod ? fbq.callMethod.apply(fbq, arguments) : fbq.queue.push(arguments); };
    window._fbq = fbq; fbq.push = fbq; fbq.loaded = true; fbq.version = '2.0'; fbq.queue = [];
    const script = document.createElement('script'); script.async = true;
    script.src = 'https://connect.facebook.net/en_US/fbevents.js';
    document.head.append(script);
    fbq('init', '1504135836561412');
    fbq('track', 'PageView');
  }
  window.LEGOHAIR_TRACK = (event, placement = '') => {
    const payload = { event, page: 'career_recruit', placement };
    window.dispatchEvent(new CustomEvent('legohair:analytics', { detail: payload }));
    try {
      if (adapterActive()) { window.LEGOHAIR_ANALYTICS_ADAPTER(payload); return; }
      if (!allowed() || typeof window.fbq !== 'function' || !events[event]) return;
      const [name, destination] = events[event];
      // Only categorical context. Never send message text or diagnosis answers.
      window.fbq('trackCustom', name, {
        destination, page: payload.page,
        cta: placements.has(placement) ? placement : 'other',
        interaction: 'outbound_click', measurement_version: 'consultation_v1'
      });
    } catch (_) { /* Analytics failures must never interrupt navigation. */ }
  };
})();
