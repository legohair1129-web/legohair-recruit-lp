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
for(const value of ['24.4〜42','222,500〜255,000','6,500〜15,000','230,000','180,000','111日','完全週休2日制','10日','https://lin.ee/7dPFevn','https://forms.gle/HdJJZuKUT4ScFmDP7'])assert.ok(home.includes(value),`Missing preserved content: ${value}`);
fs.mkdirSync('dist',{recursive:true});
for(const page of pages)fs.copyFileSync(page,path.join('dist',page));
fs.cpSync('assets','dist/assets',{recursive:true});
console.log('Build OK: 3 static pages, local resources, anchors, accordions and verified recruitment values.');
