import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const ctx = { window: {} };
vm.runInNewContext(fs.readFileSync('assets/beautician-data.js', 'utf8'), ctx);
const { questions, profiles, axes, links, resultKey } = ctx.window.beauticianData;
const home = fs.readFileSync('index.html', 'utf8');
assert.equal(questions.length, 12);
assert.equal(Object.keys(profiles).length, 16);
for (const { pair } of axes) {
  const matching = questions.filter(q => q.choices.every(c => pair.includes(c.pole)));
  assert.equal(matching.length, 3);
  for (const q of matching) assert.equal(new Set(q.choices.map(c => c.pole)).size, 2);
}
const distribution = new Map();
for (let mask = 0; mask < 2 ** questions.length; mask++) {
  const answers = questions.map((q, i) => q.choices[(mask >> i) & 1].pole);
  const expected = axes.map(({ pair }) => [...pair].find(pole => answers.filter(x => x === pole).length > 1)).join('');
  const code = resultKey(answers);
  assert.equal(code, expected);
  assert.ok(profiles[code]);
  distribution.set(code, (distribution.get(code) ?? 0) + 1);
}
assert.equal(distribution.size, 16);
for (const count of distribution.values()) assert.equal(count, 256);
assert.equal(resultKey([]), null);
assert.equal(resultKey(Array(12).fill('E')), null);
for (const [title, description, practice, section] of Object.values(profiles)) {
  assert.ok(title && description && practice && links[section]);
  assert.ok(home.includes('id="' + section + '"'));
}
assert.ok(home.includes('href="beautician-type.html?entry=ad"'));
console.log('PASS: all 4096 answer sequences, 16 reachable profiles, result links and campaign entry.');

const events = [];
const analytics = {
  window: { fbq: (...args) => events.push(args), dispatchEvent() {} },
  location: { hostname: 'legohair-recruit-lp.vercel.app' },
  navigator: {},
  CustomEvent: class {}
};
vm.runInNewContext(fs.readFileSync('assets/recruit-analytics.js', 'utf8'), analytics);
for (const [event, name] of Object.entries({
  diagnosis_line_click: 'RecruitDiagnosisLineClick', beautician_quiz_start: 'RecruitDiagnosisStart',
  beautician_quiz_complete: 'RecruitDiagnosisComplete', diagnosis_lp_click: 'RecruitDiagnosisLPClick'
})) {
  analytics.window.LEGOHAIR_TRACK(event, 'quiz');
  const [method, sentName, fields] = events.at(-1);
  assert.equal(method, 'trackCustom');
  assert.equal(sentName, name);
  assert.deepEqual(Object.keys(fields).sort(), ['interaction', 'page']);
}
