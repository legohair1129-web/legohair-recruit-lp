(() => {
  const menu = document.querySelector('.site-menu');
  menu?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => { menu.open = false; }));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu?.open) { menu.open = false; menu.querySelector('summary').focus(); }
  });
  // Link clicks retain their existing meaning; a form open is never a submission.
  document.querySelectorAll('[data-form-cta]').forEach(link => {
    link.addEventListener('click', () => {
      try { if (typeof fbq === 'function') fbq('trackCustom', 'RecruitFormClick', {destination:'Google Forms', page:'recruit_lp', cta:link.dataset.formCta}); } catch {}
    });
  });
  if (!('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      try { if (typeof fbq === 'function') fbq('trackCustom', 'RecruitSectionView', {section:entry.target.dataset.section, page:'recruit_lp'}); } catch {}
    });
  }, {rootMargin:'0px 0px -25% 0px'});
  document.querySelectorAll('[data-section]').forEach(section => observer.observe(section));
})();
