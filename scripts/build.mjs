import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const pages=['index.html','semi-employee.html','career-check.html'];
for(const page of pages){
 const html=fs.readFileSync(page,'utf8');
 assert.equal((html.match(/<h1[\s>]/g)||[]).length,1,`${page}: one H1`);
 assert.equal((html.match(/<details[\s>]/g)||[]).length,(html.match(/<\/details>/g)||[]).length,`${page}: balanced accordions`);
 const markup=html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g,'');
 for(const [,url] of markup.matchAll(/(?:src|href)="([^"#][^"]*)"/g)){
  if(/^(https?:|data:|mailto:|tel:)/.test(url))continue;
  assert.ok(fs.existsSync(path.resolve(url.split('#')[0].split('?')[0])),`${page}: missing ${url}`);
 }
 for(const [,id] of html.matchAll(/href="#([^"]+)"/g)) assert.ok(html.includes(`id="${id}"`),`${page}: broken #${id}`);
}
const home=fs.readFileSync('index.html','utf8');
for(const value of ['中途アシスタント・第二新卒','＋ケア指名＋店販手当','24.5万〜27万円','＋歩合給＋能力給','完全週休','2027年2月','Around Happy','wellness life','https://lin.ee/7dPFevn','1FAIpQLScxNHnbmHnlhdYBWE_F89-pQ6azJjjB5BQvKXiNePSSnvg8BA'])assert.ok(home.includes(value),`Missing recruitment content: ${value}`);
const ids=[...home.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);assert.equal(ids.length,new Set(ids).size,'Duplicate DOM IDs');
assert.equal((home.match(/<section\b/g)||[]).length,8,'Eight distinct sections');
assert.ok(!home.includes('fbevents.js'),'Preview must not load advertising pixels');
fs.mkdirSync('dist',{recursive:true});
for(const page of pages)fs.copyFileSync(page,path.join('dist',page));
fs.cpSync('assets','dist/assets',{recursive:true});
console.log('Build OK: 3 pages; 8 main sections; local resources, anchors, unique IDs, recruitment content.');
