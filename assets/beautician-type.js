(() => {
  'use strict';
  const { axes, questions, profiles, links, resultKey } = window.beauticianData;
  const panel = document.querySelector('#panel');
  const adEntry = new URLSearchParams(location.search).get('entry') === 'ad';
  const storageKey = 'legohair:type-quiz:v1';
  const lineVisitKey = 'legohair:type-line-opened:v1';
  let answers = [];
  let position = 0;

  // The return link also works when the LINE webview and the ad browser have separate storage.
  function read(key) {
    try { return sessionStorage.getItem(key); } catch { return null; }
  }
  function save(key, value) {
    try { sessionStorage.setItem(key, value); } catch { /* In-memory navigation still works. */ }
  }
  function track(event, placement) {
    window.LEGOHAIR_TRACK?.(event, placement);
  }
  function tag(name, text, className) {
    const element = document.createElement(name);
    if (text) element.textContent = text;
    if (className) element.className = className;
    return element;
  }
  function button(text, className, handler) {
    const element = tag('button', text, className);
    element.type = 'button';
    element.addEventListener('click', handler);
    return element;
  }
  function link(text, href, className) {
    const element = tag('a', text, className);
    element.href = href;
    return element;
  }
  function persist() {
    save(storageKey, JSON.stringify({ position, answers }));
  }
  function restore() {
    try {
      const previous = JSON.parse(read(storageKey));
      if (!previous || !Array.isArray(previous.answers) || previous.answers.length > questions.length ||
          !Number.isInteger(previous.position) || previous.position < 0 ||
          previous.position > previous.answers.length ||
          !previous.answers.every((pole, i) => questions[i].choices.some(choice => choice.pole === pole))) return;
      position = previous.position;
      answers = previous.answers;
    } catch { /* Ignore outdated or malformed tab state. */ }
  }
  function focusTitle(heading) {
    heading.tabIndex = -1;
    heading.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }
  function start() {
    answers = [];
    position = 0;
    persist();
    track('beautician_quiz_start', 'quiz');
    renderQuestion();
  }
  function welcome() {
    const actions = document.querySelector('#intro-actions');
    actions.hidden = false;
    if (adEntry) {
      const add = link('採用LINEを友だち追加する', 'https://lin.ee/7dPFevn', 'action line');
      const hint = tag('p', '友だち追加後、この画面に戻ると診断を始められます。', 'hint');
      const resume = button('友だち追加済みの方は、ここから診断', 'quiet', start);
      function showReturn() {
        resume.className = 'action';
        add.className = 'quiet';
      }
      add.addEventListener('click', () => {
        save(lineVisitKey, '1');
        showReturn();
        track('diagnosis_line_click', 'quiz');
      });
      actions.append(add, hint, resume);
      if (read(lineVisitKey) === '1') showReturn();
    } else {
      actions.append(button('診断をはじめる', 'action', start));
    }
  }
  function renderQuestion() {
    document.body.classList.add('in-quiz');
    const question = questions[position];
    const counter = tag('p', 'QUESTION  ' + String(position + 1).padStart(2, '0') + ' / ' + questions.length, 'overline');
    const progress = tag('progress');
    progress.max = questions.length;
    progress.value = position + 1;
    progress.setAttribute('aria-label', '質問の進み具合');
    const heading = tag('h1', question.prompt, 'question-title');
    heading.id = 'question-title';
    const form = tag('form');
    const group = tag('fieldset');
    group.setAttribute('aria-labelledby', heading.id);
    const next = tag('button', position === questions.length - 1 ? '診断結果を見る' : '次の質問へ', 'action');
    next.type = 'submit';
    next.disabled = !answers[position];
    for (const choice of question.choices) {
      const label = tag('label', '', 'choice');
      const radio = tag('input');
      radio.type = 'radio';
      radio.name = 'answer';
      radio.value = choice.pole;
      radio.required = true;
      radio.checked = choice.pole === answers[position];
      radio.addEventListener('change', () => { next.disabled = false; });
      label.append(radio, tag('span', choice.label));
      group.append(label);
    }
    form.append(group, next);
    form.addEventListener('submit', event => {
      event.preventDefault();
      const choice = new FormData(form).get('answer');
      if (!question.choices.some(option => option.pole === choice)) return;
      answers[position] = choice;
      position++;
      persist();
      if (position === questions.length) {
        track('beautician_quiz_complete', 'quiz');
        renderResult();
      } else renderQuestion();
    });
    if (position > 0) {
      form.append(button('前の質問に戻る', 'quiet', () => { position--; persist(); renderQuestion(); }));
    }
    panel.replaceChildren(counter, progress, heading, form);
    focusTitle(heading);
  }
  function renderResult() {
    const code = resultKey(answers);
    if (!code) { start(); return; }
    document.body.classList.add('in-quiz');
    const [title, description, practice, section] = profiles[code];
    const heading = tag('h1', title);
    const example = tag('div', '', 'practice');
    example.append(tag('strong', '明日のサロンワークで試すなら'), tag('p', practice));
    const summary = tag('dl', '', 'axes');
    summary.setAttribute('aria-label', '回答から見えた4つの傾向');
    for (const [i, axis] of axes.entries()) {
      const row = tag('div');
      row.append(tag('dt', axis.name), tag('dd', axis[code[i]]));
      summary.append(row);
    }
    const related = link(links[section], 'index.html#' + section, 'action');
    const conditions = link('募集職種・給与・働き方を見る', 'index.html#work', 'quiet');
    for (const destination of [related, conditions]) {
      destination.addEventListener('click', () => track('diagnosis_lp_click', 'result'));
    }
    const again = button('もう一度診断する', 'quiet', start);
    const end = tag('div', '', 'note');
    end.append(again);
    panel.replaceChildren(tag('p', 'あなたの美容師タイプ', 'overline'), heading, tag('p', description),
      example, summary, related, conditions, end);
    focusTitle(heading);
  }

  restore();
  if (position === questions.length) renderResult();
  else if (position > 0 || answers.length) renderQuestion();
  else welcome();
})();
