(() => {
  'use strict';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  // Preview default: no analytics loader, cookies, network beacons, URL identifiers or raw answers.
  // The production consent manager may provide an adapter and explicitly grant consent.
  function track(event, placement = '') {
    const payload = {event, page:'career_recruit', placement};
    window.dispatchEvent(new CustomEvent('legohair:analytics', {detail:payload}));
    if (window.LEGOHAIR_ANALYTICS_CONSENT === true && typeof window.LEGOHAIR_ANALYTICS_ADAPTER === 'function') window.LEGOHAIR_ANALYTICS_ADAPTER(payload);
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
  document.querySelectorAll('a[href="#stylist"]').forEach(a=>a.addEventListener('click',()=>{document.querySelector('#stylist').open=true;}));
  if(location.hash==='#stylist')document.querySelector('#stylist').open=true;
  const reveals=document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window && !reduced.matches){document.documentElement.classList.add('motion-ready');const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');observer.unobserve(e.target);}}),{threshold:.06});reveals.forEach(el=>observer.observe(el));}
  const hero=document.querySelector('.hero'),sticky=document.querySelector('.sticky-cta'),path=document.querySelector('.learning-path'),ribbon=document.querySelector('.ribbon-progress');
  const layers=[...document.querySelectorAll('[data-parallax]')];let raf=0;
  function onScroll(){if(raf)return;raf=requestAnimationFrame(()=>{raf=0;const y=window.scrollY;sticky.classList.toggle('visible',y>hero.offsetHeight*.65);if(!reduced.matches){if(innerWidth>720)layers.forEach(el=>{el.style.translate=`0 ${Math.min(y,800)*Number(el.dataset.parallax)}px`;});const r=path.getBoundingClientRect();const p=Math.min(1,Math.max(0,(innerHeight*.85-r.top)/(r.height+innerHeight*.25)));ribbon.style.strokeDashoffset=String(1-p);}});}
  addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',onScroll);onScroll();
  reduced.addEventListener('change',()=>{if(reduced.matches){document.documentElement.classList.remove('motion-ready');layers.forEach(el=>el.style.translate='');ribbon.style.strokeDashoffset='0';}});
  const photos=[['assets/editorial/2319-960.webp','撮影の日に笑顔を見せるスタッフ3人','撮影の日のひとこま'],['assets/editorial/4872-960.webp','サロンの前で笑顔を見せるスタッフ2人','サロンの前で見せる笑顔'],['assets/collage/hero-team-03.webp','笑顔でポーズをとるスタッフ3人','一緒に働くLEGOHAIRの仲間']];let photoIndex=0;
  document.querySelector('.photo-switch').addEventListener('click',()=>{photoIndex=(photoIndex+1)%photos.length;const p=photos[photoIndex],img=document.querySelector('#people-switch-photo');img.src=p[0];img.alt=p[1];document.querySelector('#photo-caption').textContent=p[2];});
  const gallery=document.querySelector('.creative-gallery');document.querySelectorAll('[data-gallery]').forEach(button=>button.addEventListener('click',()=>gallery.scrollBy({left:Number(button.dataset.gallery)*gallery.clientWidth*.75,behavior:reduced.matches?'instant':'smooth'})));
  const {questions,results}=window.beauticianData,box=document.querySelector('#quiz-content');let answers=[];
  // Matches BeauticianType.tsx exactly: count votes, resolve ties by first appearance in answers.
  function resultKey(values){const counts=new Map();for(const type of values)counts.set(type,(counts.get(type)||0)+1);let top=values[0],topCount=0;for(const [type,count]of counts){if(count>topCount){top=type;topCount=count;}}return top;}
  window.LEGOHAIR_DIAGNOSIS={resultKey};
  function focusHeading(){const h=box.querySelector('h3');h?.focus({preventScroll:true});}
  function renderQuestion(){const n=answers.length,q=questions[n];box.replaceChildren();const kicker=document.createElement('p');kicker.className='quiz-kicker';kicker.textContent=`QUESTION ${String(n+1).padStart(2,'0')} / 05`;box.append(kicker);const progress=document.createElement('div');progress.className='quiz-progress';progress.setAttribute('aria-hidden','true');for(let i=0;i<5;i++){const bar=document.createElement('span');if(i<=n)bar.className='done';progress.append(bar);}box.append(progress);const heading=document.createElement('h3');heading.className='quiz-question';heading.tabIndex=-1;heading.textContent=q.prompt;box.append(heading);const choices=document.createElement('div');choices.className='quiz-options';q.choices.forEach(c=>{const b=document.createElement('button');b.type='button';b.textContent=c.label;b.addEventListener('click',()=>{answers.push(c.type);if(answers.length===questions.length)renderResult();else renderQuestion();});choices.append(b);});box.append(choices);if(n>0){const back=document.createElement('button');back.className='quiz-back';back.type='button';back.textContent='← ひとつ戻る';back.addEventListener('click',()=>{answers.pop();renderQuestion();});box.append(back);}focusHeading();}
  function renderResult(){const key=resultKey(answers),r=results[key];track('diagnosis_complete','quiz');const related={creative:['#creative','撮影とヘアデザインを見る'],empathy:['#people','一緒に働く人を見る'],proposal:['#creative','好印象プロデュースを知る'],growth:['#growth','入社後の学びを見る']};box.replaceChildren();const wrap=document.createElement('div');wrap.className='quiz-result';const label=document.createElement('span');label.className='result-label';label.textContent='あなたの回答に近いタイプ';const heading=document.createElement('h3');heading.tabIndex=-1;heading.textContent=r.title;const desc=document.createElement('p');desc.textContent=r.description;wrap.append(label,heading,desc);const nav=document.createElement('nav');nav.className='result-links';nav.setAttribute('aria-label','診断のあとに見る情報');for(const [href,text]of [related[key],['#entry','サロン見学について見る']]){const a=document.createElement('a');a.href=href;a.textContent=`${text} ↗`;nav.append(a);}wrap.append(nav);const retry=document.createElement('button');retry.type='button';retry.className='quiz-retry';retry.textContent='もう一度診断する';retry.addEventListener('click',start);wrap.append(retry);box.append(wrap);document.querySelectorAll('[data-type]').forEach(el=>{el.dataset.active=String(el.dataset.type===key);el.dataset.muted=String(el.dataset.type!==key);});focusHeading();}
  function start(){answers=[];track('diagnosis_start','quiz');document.querySelectorAll('[data-type]').forEach(el=>{delete el.dataset.active;delete el.dataset.muted;});renderQuestion();}
  document.querySelector('#quiz-start').addEventListener('click',start);
})();
