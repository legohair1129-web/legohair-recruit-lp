(() => {
  'use strict';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  function track(event, placement = '') {
    window.LEGOHAIR_TRACK?.(event, placement);
  }
  document.addEventListener('click', e => {const a=e.target.closest('[data-event]');if(a)track(a.dataset.event,a.dataset.placement||'');});
  const campaign = new URLSearchParams(location.search);
  track(campaign.has('utm_source')||campaign.has('fbclid')||campaign.has('gclid')?'ad_landing_view':'landing_view','page');
  const menuButton = document.querySelector('.menu-toggle'), menu=document.querySelector('#mobile-menu');
  function closeMenu(){menu.hidden=true;menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','メニューを開く');}
  menuButton.addEventListener('click',()=>{const expanded=menuButton.getAttribute('aria-expanded')==='true';menu.hidden=expanded;menuButton.setAttribute('aria-expanded',String(!expanded));menuButton.setAttribute('aria-label',expanded?'メニューを開く':'メニューを閉じる');});
  menu.addEventListener('click', e=>{if(e.target.closest('a'))closeMenu();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!menu.hidden){closeMenu();menuButton.focus();}});
  document.addEventListener('click',e=>{if(!menu.hidden&&!e.target.closest('.header'))closeMenu();});
  const diagnosisDetails=document.querySelector('#diagnosis-details');
  document.querySelectorAll('a[href="#diagnosis"]').forEach(a=>a.addEventListener('click',()=>{diagnosisDetails.open=true;}));
  if(location.hash==='#diagnosis')diagnosisDetails.open=true;
  // Keep consultation available while reading, without duplicating the visible buttons.
  const sticky=document.querySelector('.consultation-sticky');
  const heroActions=document.querySelector('.hero-actions'),entryActions=document.querySelector('.entry-actions');
  function updateSticky(){
    const heroRect=heroActions.getBoundingClientRect(),entryRect=entryActions.getBoundingClientRect();
    const entryVisible=entryRect.top<innerHeight && entryRect.bottom>0;
    sticky.hidden=heroRect.bottom>0 || entryVisible;
  }
  if('IntersectionObserver' in window){
    const ctaObserver=new IntersectionObserver(updateSticky,{threshold:[0,1]});
    ctaObserver.observe(heroActions);ctaObserver.observe(entryActions);updateSticky();
    addEventListener('resize',updateSticky);
  }
  const reveals=document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window && !reduced.matches){document.documentElement.classList.add('motion-ready');const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');observer.unobserve(e.target);}}),{threshold:.06});reveals.forEach(el=>observer.observe(el));}
  const layers=[...document.querySelectorAll('[data-parallax]')];let raf=0;
  function onScroll(){if(raf)return;raf=requestAnimationFrame(()=>{raf=0;const y=window.scrollY;if(!reduced.matches){if(innerWidth>720)layers.forEach(el=>{el.style.translate=`0 ${Math.min(y,800)*Number(el.dataset.parallax)}px`;});}});}
  addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',onScroll);onScroll();
  reduced.addEventListener('change',()=>{if(reduced.matches){document.documentElement.classList.remove('motion-ready');layers.forEach(el=>el.style.translate='');}});
  const photos=[['assets/collage/latest/team-3086.webp','撮影の日に笑顔を見せるスタッフ3人','撮影の日のひとこま'],['assets/collage/latest/pair-4872.webp','サロンの前で笑顔を見せるスタッフ2人','サロンの前で見せる笑顔'],['assets/collage/latest/team-2551.webp','頬に手を添えて並ぶスタッフ3人','一緒に働くLEGOHAIRの仲間']];let photoIndex=0;
  document.querySelector('.photo-switch').addEventListener('click',()=>{photoIndex=(photoIndex+1)%photos.length;const p=photos[photoIndex],img=document.querySelector('#people-switch-photo');img.src=p[0];img.alt=p[1];document.querySelector('#photo-caption').textContent=p[2];});
  const gallery=document.querySelector('.creative-gallery');document.querySelectorAll('[data-gallery]').forEach(button=>button.addEventListener('click',()=>gallery.scrollBy({left:Number(button.dataset.gallery)*gallery.clientWidth*.75,behavior:reduced.matches?'instant':'smooth'})));
})();
