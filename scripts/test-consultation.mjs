import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const source = fs.readFileSync('assets/recruit-analytics.js', 'utf8');
function environment({host='legohair-recruit-lp.vercel.app', consent, adapter, gpc=false, fbq}={}) {
  const local=[],scripts=[];
  const window={LEGOHAIR_ANALYTICS_CONSENT:consent,LEGOHAIR_ANALYTICS_ADAPTER:adapter,fbq,dispatchEvent:e=>local.push(e.detail)};
  const ctx={window,location:{hostname:host},navigator:{globalPrivacyControl:gpc},CustomEvent:class{constructor(type,options){this.type=type;this.detail=options.detail;}},document:{createElement:()=>({}),head:{append:s=>scripts.push(s)}}};
  vm.runInNewContext(source,ctx);
  return {window,local,scripts};
}
const prod=environment();
assert.equal(prod.scripts.length,1);
assert.equal(prod.scripts[0].src,'https://connect.facebook.net/en_US/fbevents.js');
assert.equal(prod.window.fbq.queue[0][1],'1504135836561412');
assert.equal(prod.window.fbq.queue[1][1],'PageView');
for(const [event,expected] of Object.entries({line_consultation_click:'RecruitLineClick',instagram_dm_consultation_click:'RecruitInstagramDMClick',salon_tour_click:'RecruitFormClick',instagram_profile_click:'RecruitInstagramProfileClick'})) {
  const before=prod.window.fbq.queue.length;
  prod.window.LEGOHAIR_TRACK(event,'hero');
  assert.equal(prod.window.fbq.queue.length,before+1);
  const call=prod.window.fbq.queue.at(-1);
  assert.equal(call[0],'trackCustom');assert.equal(call[1],expected);
  assert.equal(call[2].cta,'hero');assert.equal(call[2].interaction,'outbound_click');
}
prod.window.LEGOHAIR_TRACK('diagnosis_complete','quiz');
assert.equal(prod.window.fbq.queue.length,6,'Do not send diagnosis answers or results');
assert.equal(prod.local.length,5);
for(const options of [{host:'localhost'},{host:'preview.vercel.app'},{consent:false},{gpc:true}]) {
  const e=environment(options);e.window.LEGOHAIR_TRACK('line_consultation_click','hero');
  assert.equal(e.scripts.length,0);assert.equal(e.window.fbq,undefined);assert.equal(e.local.length,1);
}
let adapted=0;
const e=environment({consent:true,adapter:()=>adapted++});e.window.LEGOHAIR_TRACK('line_consultation_click','hero');
assert.equal(adapted,1);assert.equal(e.scripts.length,0,'Adapter must not duplicate Meta events');
const failing=environment({consent:true,adapter:()=>{throw Error('blocked')}});
assert.doesNotThrow(()=>failing.window.LEGOHAIR_TRACK('line_consultation_click','hero'));
const blocked=environment({fbq:()=>{throw Error('blocked')}});
assert.doesNotThrow(()=>blocked.window.LEGOHAIR_TRACK('instagram_dm_consultation_click','sticky'));

const html=fs.readFileSync('index.html','utf8');
for(const placement of ['hero','entry','sticky']) {
  for(const [event,url] of [['line_consultation_click','https://lin.ee/7dPFevn'],['instagram_dm_consultation_click','https://ig.me/m/legohair_group']]) {
    const links=[...html.matchAll(/<a\b[^>]*>/g)].map(m=>m[0]).filter(s=>s.includes(`data-event="${event}"`)&&s.includes(`data-placement="${placement}"`));
    assert.equal(links.length,1);assert.ok(links[0].includes(`href="${url}"`));assert.ok(!links[0].includes('target='),'App links use same-tab native navigation');
  }
}
const base=execFileSync('git',['show','9a4c8abb32ae869d0dd5f1284b11fc83bcb180cf:index.html'],{encoding:'utf8'});
for(const id of ['diagnosis','people','growth','creative','values','work']) {
  const pattern=new RegExp(`<section id="${id}"[\\s\\S]*?</section>`);
  assert.equal(html.match(pattern)[0],base.match(pattern)[0],`${id}: original content unchanged`);
}
const images=s=>[...s.matchAll(/<img[^>]*src="([^"]+)"/g)].map(m=>m[1]);
for(const src of images(base))assert.ok(images(html).includes(src),`Photo preserved: ${src}`);
for(const page of ['index.html','semi-employee.html','career-check.html']) {
  assert.ok(!/fbq\(['"]track['"],\s*['"](Lead|Contact|SubmitApplication)['"]/.test(fs.readFileSync(page,'utf8')),`${page}: no click conversion`);
}
assert.ok(!/['"](Lead|Contact|SubmitApplication)['"]/.test(source));
console.log('PASS: 3 CTA placements, 4 distinct click events, production Pixel, preview isolation, consent/adapter/error handling, original content/photos, no completed-inquiry events.');
