import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
const ctx={window:{}};vm.runInNewContext(fs.readFileSync('assets/beautician-data.js','utf8'),ctx);
const data=ctx.window.beauticianData;
assert.equal(data.questions.length,5);assert.equal(Object.keys(data.results).length,4);
const js=fs.readFileSync('assets/collage.js','utf8');const functionText=js.match(/function resultKey\(values\)\{.*?return top;\}/)[0];vm.runInNewContext(functionText+'; window.resultKey=resultKey;',ctx);
const types=['creative','empathy','proposal','growth'];let checked=0;
for(let i=0;i<4**5;i++){let n=i;const answers=Array.from({length:5},()=>{const t=types[n%4];n=Math.floor(n/4);return t;});
 const frequency=Object.fromEntries(types.map(t=>[t,answers.filter(x=>x===t).length]));const highest=Math.max(...Object.values(frequency));const expected=answers.find(t=>frequency[t]===highest);
 assert.equal(ctx.window.resultKey(answers),expected,JSON.stringify(answers));checked++;
}
console.log(`PASS: ${checked} possible answer sequences, including first-appearance tie resolution.`);
