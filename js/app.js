(function () {
  'use strict';
  const PT = window.PT;
  const app = document.getElementById('app');

  // ---------- Storage ----------
  const STORAGE_KEY = 'rumo-ao-b2-v1';
  const defaults = () => ({
    xp: 0,
    days: {},          // 'YYYY-MM-DD' -> xp earned that day
    lessons: {},       // id -> { best, attempts }
    cards: {},         // cardId -> { reps, interval, ease, due }
    readings: {},      // id -> { best }
    drills: {},        // tenseId -> { c, t }
    dictation: { c: 0, t: 0 },
    writing: {},       // id -> { draft, done }
    settings: { goal: 50, drillTenses: ['subjPres', 'subjImp', 'subjFut'], drillVerbs: 'all', strictAccents: false, cardDirection: 'pt-en', newPerSession: 10 }
  });

  let state = load();
  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaults();
      const s = JSON.parse(raw);
      const d = defaults();
      return { ...d, ...s, settings: { ...d.settings, ...(s.settings || {}) }, dictation: { ...d.dictation, ...(s.dictation || {}) } };
    } catch (e) {
      return defaults();
    }
  }
  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { /* storage unavailable */ }
  }

  // ---------- Dates & XP ----------
  function dateStr(d = new Date()) {
    const p = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
  }
  function addDays(str, n) {
    const [y, m, d] = str.split('-').map(Number);
    return dateStr(new Date(y, m - 1, d + n));
  }
  const today = () => dateStr();

  function addXP(n) {
    state.xp += n;
    const t = today();
    state.days[t] = (state.days[t] || 0) + n;
    save();
    updateHeaderXP();
  }
  function streak() {
    let d = today();
    if (!state.days[d]) d = addDays(d, -1);
    let n = 0;
    while (state.days[d]) { n++; d = addDays(d, -1); }
    return n;
  }
  function updateHeaderXP() {
    const el = document.getElementById('header-xp');
    if (el) el.textContent = `🔥 ${streak()} · ${state.days[today()] || 0}/${state.settings.goal} XP`;
  }

  // ---------- Utilities ----------
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const stripAccents = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '');
  const norm = (s) => s.toLowerCase().replace(/[“”"]/g, '').replace(/\s+/g, ' ').replace(/[.!?,;:]+$/, '').trim();
  const shuffle = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const $ = (sel, root = app) => root.querySelector(sel);
  const $$ = (sel, root = app) => Array.from(root.querySelectorAll(sel));

  // Returns 'ok', 'accent' (right apart from accents) or 'bad'
  function checkAnswer(given, accepted) {
    const g = norm(given);
    if (!g) return 'bad';
    if (accepted.some((a) => norm(a) === g)) return 'ok';
    if (accepted.some((a) => stripAccents(norm(a)) === stripAccents(g))) return 'accent';
    return 'bad';
  }

  // ---------- Speech ----------
  let ptVoice = null;
  function loadVoices() {
    if (!('speechSynthesis' in window)) return;
    const voices = speechSynthesis.getVoices();
    ptVoice = voices.find((v) => v.lang === 'pt-BR') || voices.find((v) => v.lang.replace('_', '-').startsWith('pt-BR')) || voices.find((v) => v.lang.startsWith('pt')) || null;
  }
  if ('speechSynthesis' in window) {
    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
  }
  // iOS Safari only allows speech that starts inside a tap, and drops an utterance
  // queued right after cancel(). So we unlock speech on the first tap, and only
  // cancel (then wait briefly) when something is actually playing.
  let speechUnlocked = false, speakTimer = null;
  function enqueue(text, rate) {
    speechSynthesis.resume(); // Safari/Chrome can get stuck in a paused state
    // Long texts are split into chunks; some browsers cut off long utterances.
    const chunks = text.split(/\n+|(?<=[.!?])\s+/).filter((s) => s.trim());
    for (const chunk of chunks) {
      const u = new SpeechSynthesisUtterance(chunk);
      u.lang = 'pt-BR';
      if (ptVoice) u.voice = ptVoice;
      u.rate = rate;
      speechSynthesis.speak(u);
    }
  }
  function speak(text, rate = 1) {
    if (!('speechSynthesis' in window)) return;
    // Auto-play (e.g. a new flashcard) doesn't count: iOS ignores it outside a tap
    if (!navigator.userActivation || navigator.userActivation.isActive) speechUnlocked = true;
    clearTimeout(speakTimer);
    if (speechSynthesis.speaking || speechSynthesis.pending) {
      speechSynthesis.cancel();
      speakTimer = setTimeout(() => enqueue(text, rate), 120);
    } else {
      enqueue(text, rate);
    }
  }
  function stopSpeaking() {
    if (!('speechSynthesis' in window)) return;
    clearTimeout(speakTimer);
    speechSynthesis.cancel();
  }
  function unlockSpeech() {
    if (speechUnlocked || !('speechSynthesis' in window)) return;
    speechUnlocked = true;
    const u = new SpeechSynthesisUtterance(' ');
    u.volume = 0;
    speechSynthesis.speak(u);
  }
  // Bubble phase on document: runs after any button that already called speak()
  ['touchend', 'click', 'keydown'].forEach((ev) => document.addEventListener(ev, unlockSpeech));
  const speakBtn = (text, label = '🔊') => `<button class="speak" data-say="${esc(text)}" title="Ouvir" aria-label="Ouvir">${label}</button>`;
  app.addEventListener('click', (e) => {
    const b = e.target.closest('[data-say]');
    if (b) speak(b.dataset.say, Number(b.dataset.rate || 1));
  });

  // ---------- Progress helpers ----------
  function lessonStatus(id) {
    const l = state.lessons[id];
    if (!l) return 'none';
    return l.best >= 0.8 ? 'full' : 'partial';
  }
  const allCards = () => PT.vocab.flatMap((d) => d.cards.map((c) => ({ id: `${d.id}:${c[0]}`, deck: d.id, pt: c[0], en: c[1], ex: c[2] })));
  function dueCount(deckId) {
    const t = today();
    return allCards().filter((c) => (!deckId || c.deck === deckId) && state.cards[c.id] && state.cards[c.id].due <= t).length;
  }
  function seenCount(deckId) {
    return allCards().filter((c) => (!deckId || c.deck === deckId) && state.cards[c.id]).length;
  }

  // ---------- Router ----------
  const routes = {
    '': viewHome,
    gramatica: (id) => (id ? viewLesson(id) : viewGrammarList()),
    verbos: viewVerbs,
    vocabulario: (id) => (id ? viewDeck(id) : viewVocabList()),
    leitura: (id) => (id ? viewReading(id) : viewReadingList()),
    escuta: viewListening,
    escrita: (id) => (id ? viewWriting(id) : viewWritingList()),
    progresso: viewProgress
  };
  let cleanup = null;
  function route() {
    if (cleanup) { cleanup(); cleanup = null; }
    stopSpeaking();
    const [section = '', id] = location.hash.replace(/^#\/?/, '').split('/').map(decodeURIComponent);
    const view = routes[section] || viewHome;
    $$('#nav a', document).forEach((a) => a.classList.toggle('active', a.dataset.route === (routes[section] ? section : '')));
    app.innerHTML = '';
    view(id);
    window.scrollTo(0, 0);
    updateHeaderXP();
  }
  window.addEventListener('hashchange', route);

  // ---------- Home ----------
  function viewHome() {
    const todayXP = state.days[today()] || 0;
    const goal = state.settings.goal;
    const next = PT.grammar.find((l) => lessonStatus(l.id) !== 'full');
    const due = dueCount();
    const mastered = PT.grammar.filter((l) => lessonStatus(l.id) === 'full').length;

    app.innerHTML = `
      <h1>Olá! Bora estudar? 🇧🇷</h1>
      <p class="muted">Your path from A2/B1 to B2: grammar, verbs, vocabulary, reading, listening and writing, every day a little.</p>
      <div class="stats">
        <div class="stat"><div class="num">🔥 ${streak()}</div><div class="label">day streak</div></div>
        <div class="stat"><div class="num">${todayXP}<span class="muted small"> / ${goal}</span></div><div class="label">XP today</div>
          <div class="progress" style="margin-top:6px"><div style="width:${Math.min(100, (todayXP / goal) * 100)}%"></div></div></div>
        <div class="stat"><div class="num">${due}</div><div class="label">cards due for review</div></div>
        <div class="stat"><div class="num">${mastered}/${PT.grammar.length}</div><div class="label">grammar topics mastered</div></div>
      </div>

      <div class="card">
        <h2>Today’s plan (≈30 min)</h2>
        <ol>
          <li><a href="#/vocabulario">Review flashcards</a> ${due ? `<span class="badge">${due} due</span>` : '<span class="muted small">(learn new words)</span>'} · 5–10 min</li>
          ${next ? `<li>Grammar: <a href="#/gramatica/${next.id}">${esc(next.title)}</a> <span class="badge ${next.level}">${next.level}</span> · 10 min</li>` : '<li>Grammar: every topic is mastered! Redo your weakest one in <a href="#/progresso">Progresso</a>.</li>'}
          <li><a href="#/verbos">Verb drill</a>: 20 conjugations · 5 min</li>
          <li>Alternate: <a href="#/leitura">a reading</a>, <a href="#/escuta">dictation</a> or <a href="#/escrita">a writing task</a> · 10 min</li>
        </ol>
      </div>

      <div class="card">
        <h2>Roadmap to B2</h2>
        <p class="muted small">A topic counts as mastered at ≥ 80% on its exercises.</p>
        <ul class="roadmap">
          ${PT.grammar.map((l) => `<li><span class="dot ${lessonStatus(l.id)}"></span><a href="#/gramatica/${l.id}">${esc(l.title)}</a> <span class="badge ${l.level}">${l.level}</span>
            ${state.lessons[l.id] ? `<span class="muted small">${Math.round(state.lessons[l.id].best * 100)}%</span>` : ''}</li>`).join('')}
        </ul>
      </div>

      <div class="card">
        <h2>What B2 means</h2>
        <p>At B2 (independent user) you can follow the main ideas of complex texts, talk with native speakers without strain on either side, and write clear, detailed texts that argue a point of view. In practice, for Portuguese that means:</p>
        <ul>
          <li>Using <strong>all three subjunctive tenses</strong> and compound tenses with confidence</li>
          <li>Linking ideas with <strong>connectors</strong> (embora, no entanto, portanto…)</li>
          <li>Switching between <strong>informal speech</strong> and <strong>formal writing</strong></li>
          <li>Understanding podcasts, the news and series without subtitles</li>
        </ul>
        <p class="small muted">The Brazilian proficiency exam is the <strong>Celpe-Bras</strong>; “Intermediário Superior” roughly corresponds to B2.</p>
      </div>`;
  }

  // ---------- Grammar ----------
  function viewGrammarList() {
    app.innerHTML = `
      <h1>Gramática</h1>
      <p class="muted">The key topics between B1 and B2. Read the explanation, then do the exercises; you need ≥ 80% to master a topic.</p>
      <div class="grid">
        ${PT.grammar.map((l) => {
          const s = state.lessons[l.id];
          return `<a class="card" href="#/gramatica/${l.id}">
            <div class="spread"><span class="badge ${l.level}">${l.level}</span>${s ? `<span class="badge ${s.best >= 0.8 ? 'done' : ''}">${Math.round(s.best * 100)}%</span>` : ''}</div>
            <h3 style="margin-top:8px">${esc(l.title)}</h3>
            <p class="muted small" style="margin:0">${esc(l.summary)}</p></a>`;
        }).join('')}
      </div>`;
  }

  function viewLesson(id) {
    const lesson = PT.grammar.find((l) => l.id === id);
    if (!lesson) return viewGrammarList();
    const idx = PT.grammar.indexOf(lesson);
    const nextLesson = PT.grammar[idx + 1];
    const results = new Array(lesson.exercises.length).fill(null); // first-try result per exercise

    app.innerHTML = `
      <p><a href="#/gramatica">← Gramática</a></p>
      <div class="spread"><h1>${esc(lesson.title)}</h1><span class="badge ${lesson.level}">${lesson.level}</span></div>
      <div class="card explanation">${lesson.explanation}</div>
      <div class="card">
        <div class="spread"><h2>Exercícios</h2><span class="muted small" id="score"></span></div>
        <div id="exercises">
          ${lesson.exercises.map((ex, i) => `
            <div class="exercise" data-i="${i}">
              <div class="q"><strong>${i + 1}.</strong> ${esc(ex.q)}</div>
              ${ex.options
                ? `<div class="options">${ex.options.map((o, j) => `<button data-opt="${j}">${esc(o)}</button>`).join('')}</div>`
                : `<div class="answer-row"><input type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Your answer…"><button class="check">Check</button></div>`}
              <div class="feedback hidden"></div>
            </div>`).join('')}
        </div>
        <div id="lesson-done" class="hidden" style="margin-top:16px"></div>
      </div>`;

    function record(i, ok) {
      if (results[i] !== null) return;
      results[i] = ok;
      if (ok) addXP(10);
      const answered = results.filter((r) => r !== null).length;
      const correct = results.filter((r) => r).length;
      $('#score').textContent = `${correct} correct of ${answered} answered`;
      if (answered === results.length) finish(correct / results.length);
    }

    function finish(score) {
      const prev = state.lessons[id] || { best: 0, attempts: 0 };
      state.lessons[id] = { best: Math.max(prev.best, score), attempts: prev.attempts + 1 };
      save();
      const done = $('#lesson-done');
      done.classList.remove('hidden');
      done.innerHTML = `
        <div class="feedback ${score >= 0.8 ? 'ok' : 'warn'}">
          <strong>${Math.round(score * 100)}%</strong>: ${score >= 0.8 ? 'Mandou bem! Topic mastered. 🎉' : 'Quase! Reread the explanation and try again.'}
        </div>
        <div class="row" style="margin-top:12px">
          <button id="retry">Try again</button>
          ${nextLesson ? `<a class="btn primary" href="#/gramatica/${nextLesson.id}">Next: ${esc(nextLesson.title)} →</a>` : ''}
        </div>`;
      $('#retry').onclick = () => viewLessonReload();
    }
    const viewLessonReload = () => { app.innerHTML = ''; viewLesson(id); window.scrollTo(0, 0); };

    $$('.exercise').forEach((el) => {
      const i = Number(el.dataset.i);
      const ex = lesson.exercises[i];
      const fb = $('.feedback', el);
      const show = (cls, html) => { fb.className = `feedback ${cls}`; fb.innerHTML = html; };

      if (ex.options) {
        $$('[data-opt]', el).forEach((btn) => {
          btn.onclick = () => {
            const j = Number(btn.dataset.opt);
            const ok = j === ex.a;
            btn.classList.add(ok ? 'correct' : 'wrong');
            if (ok) {
              $$('[data-opt]', el).forEach((b) => (b.disabled = true));
              show('ok', `✓ Correto!${ex.why ? ' ' + esc(ex.why) : ''}`);
            } else {
              show('bad', '✗ Not quite. Try again.');
            }
            record(i, ok);
          };
        });
      } else {
        const input = $('input', el);
        const btn = $('.check', el);
        let tries = 0;
        const check = () => {
          const r = checkAnswer(input.value, ex.a);
          tries++;
          input.classList.remove('correct', 'wrong');
          if (r === 'ok') {
            input.classList.add('correct');
            input.disabled = true; btn.disabled = true;
            show('ok', `✓ Correto!${ex.a.length > 1 ? ` <span class="small">(also accepted: ${ex.a.filter((a) => norm(a) !== norm(input.value)).map(esc).join(', ')})</span>` : ''}`);
            record(i, true);
          } else if (r === 'accent') {
            input.classList.add('correct');
            input.disabled = true; btn.disabled = true;
            show('warn', `Almost: watch the accents → <strong>${esc(ex.a[0])}</strong>`);
            record(i, true);
          } else {
            input.classList.add('wrong');
            if (tries >= 2) {
              input.disabled = true; btn.disabled = true;
              show('bad', `✗ Answer: <strong>${esc(ex.a.join(' / '))}</strong>`);
            } else {
              show('bad', '✗ Not quite. One more try!');
            }
            record(i, false);
          }
        };
        btn.onclick = check;
        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            if (!input.disabled) check();
            const nextInput = $$('.exercise input:not(:disabled)')[0];
            if (input.disabled && nextInput) nextInput.focus();
          }
        });
      }
    });
  }

  // ---------- Verbs ----------
  function viewVerbs(tab) {
    const V = PT.verbs;
    app.innerHTML = `
      <h1>Verbos</h1>
      <div class="row" style="margin-bottom:16px">
        <a class="btn ${tab !== 'tabelas' ? 'primary' : ''}" href="#/verbos">Drill</a>
        <a class="btn ${tab === 'tabelas' ? 'primary' : ''}" href="#/verbos/tabelas">Tabelas</a>
      </div>
      <div id="verbs-body"></div>`;
    if (tab === 'tabelas') verbTables(V); else verbDrill(V);
  }

  function verbTables(V) {
    const body = $('#verbs-body');
    body.innerHTML = `
      <div class="card">
        <label for="verb-select" class="small muted">Choose a verb</label>
        <select id="verb-select">${V.VERBS.map((v) => `<option value="${esc(v.inf)}">${esc(v.inf)} · ${esc(v.en)}${v.irregular ? ' (irr.)' : ''}</option>`).join('')}</select>
        <p class="small muted" style="margin:8px 0 0">Brazilian 4-person system: <em>tu</em> and <em>vós</em> are left out (rare in most of Brazil). <em>A gente</em> uses the <em>você/ele</em> form.</p>
      </div>
      <div class="conj-grid" id="conj"></div>`;
    const render = () => {
      const v = V.VERBS.find((x) => x.inf === $('#verb-select').value);
      const t = V.conjugate(v);
      $('#conj').innerHTML = V.TENSES.map((tense) => `
        <div class="card">
          <div class="spread"><h3 style="margin:0">${esc(tense.name)}</h3>${speakBtn(t[tense.id].join(', '))}</div>
          <p class="small muted" style="margin:0 0 6px">${esc(tense.en)}</p>
          <table class="conj-table">${V.PERSONS.map((p, i) => `<tr><td class="muted small">${p}</td><td><strong>${esc(t[tense.id][i])}</strong></td></tr>`).join('')}</table>
        </div>`).join('');
    };
    $('#verb-select').onchange = render;
    render();
  }

  function verbDrill(V) {
    const s = state.settings;
    const body = $('#verbs-body');
    body.innerHTML = `
      <div class="card">
        <h3>Tenses</h3>
        <div>${V.TENSES.map((t) => `<label class="check"><input type="checkbox" value="${t.id}" ${s.drillTenses.includes(t.id) ? 'checked' : ''}> ${esc(t.name)}</label>`).join('')}</div>
        <div class="row" style="margin-top:8px">
          <select id="verb-set" style="width:auto">
            <option value="all">All verbs</option>
            <option value="irregular">Irregular only</option>
            <option value="regular">Regular only</option>
          </select>
          <label class="check"><input type="checkbox" id="strict" ${s.strictAccents ? 'checked' : ''}> Strict accents</label>
        </div>
      </div>
      <div class="card">
        <div class="spread"><span class="muted small" id="drill-stats">Session: 0/0</span><span class="muted small" id="drill-streak"></span></div>
        <div class="drill-prompt" id="drill-prompt" style="margin-top:12px"></div>
        <div class="answer-row row"><input type="text" id="drill-input" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Type the form and press Enter" style="flex:1"><button class="primary" id="drill-check">Check</button></div>
        <div class="feedback hidden" id="drill-fb"></div>
      </div>`;
    $('#verb-set').value = s.drillVerbs;

    let current = null, answered = false, sc = 0, st = 0, run = 0;
    const input = $('#drill-input');
    const fb = $('#drill-fb');

    function saveSettings() {
      s.drillTenses = $$('#verbs-body input[type=checkbox][value]').filter((c) => c.checked).map((c) => c.value);
      s.drillVerbs = $('#verb-set').value;
      s.strictAccents = $('#strict').checked;
      save();
    }
    function next() {
      const tenses = s.drillTenses.length ? s.drillTenses : ['pres'];
      const pool = V.VERBS.filter((v) => s.drillVerbs === 'all' || (s.drillVerbs === 'irregular' ? v.irregular : !v.irregular));
      const verb = pick(pool);
      const tenseId = pick(tenses);
      const tense = V.TENSES.find((t) => t.id === tenseId);
      const p = Math.floor(Math.random() * 4);
      current = { verb, tense, p, answer: V.conjugate(verb)[tense.id][p] };
      answered = false;
      $('#drill-prompt').innerHTML = `<span class="muted">${V.PERSONS[p]}</span> · <strong>${esc(verb.inf)}</strong> <span class="muted small">(${esc(verb.en)})</span><br><span class="badge" style="margin-top:6px">${esc(tense.name)}</span>`;
      input.value = ''; input.className = ''; input.disabled = false;
      fb.className = 'feedback hidden';
      input.focus();
    }
    function check() {
      if (answered) return next();
      if (!input.value.trim()) return;
      let r = checkAnswer(input.value, [current.answer]);
      if (r === 'accent' && s.strictAccents) r = 'bad';
      const ok = r !== 'bad';
      answered = true;
      st++; if (ok) { sc++; run++; addXP(2); } else run = 0;
      const d = state.drills[current.tense.id] || { c: 0, t: 0 };
      d.t++; if (ok) d.c++;
      state.drills[current.tense.id] = d; save();
      input.classList.add(ok ? 'correct' : 'wrong');
      fb.className = `feedback ${r === 'ok' ? 'ok' : r === 'accent' ? 'warn' : 'bad'}`;
      fb.innerHTML = (r === 'ok' ? '✓ ' : r === 'accent' ? 'Watch the accents: ' : '✗ ') + `<strong>${esc(current.answer)}</strong> ${speakBtn(current.answer)} <span class="small muted">· Enter for the next one</span>`;
      $('#drill-stats').textContent = `Session: ${sc}/${st}`;
      $('#drill-streak').textContent = run >= 3 ? `🔥 ${run} in a row` : '';
    }
    $('#drill-check').onclick = check;
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); check(); } });
    $$('#verbs-body input[type=checkbox], #verb-set').forEach((el) => (el.onchange = () => { saveSettings(); next(); }));
    next();
  }

  // ---------- Vocabulary (spaced repetition) ----------
  function viewVocabList() {
    const due = dueCount();
    app.innerHTML = `
      <h1>Vocabulário</h1>
      <p class="muted">Flashcards with spaced repetition: words you know come back less often, words you miss come back sooner. Do a little every day.</p>
      ${due ? `<div class="card spread"><div><strong>${due} cards</strong> due for review today.</div><a class="btn primary" href="#/vocabulario/all">Review all</a></div>` : ''}
      <div class="grid">
        ${PT.vocab.map((d) => {
          const seen = seenCount(d.id), dd = dueCount(d.id);
          return `<a class="card" href="#/vocabulario/${d.id}">
            <div class="spread"><span class="badge ${d.level}">${d.level}</span>${dd ? `<span class="badge">${dd} due</span>` : ''}</div>
            <h3 style="margin-top:8px">${esc(d.title)}</h3>
            <p class="muted small">${esc(d.desc)}</p>
            <div class="progress"><div style="width:${(seen / d.cards.length) * 100}%"></div></div>
            <p class="small muted" style="margin:4px 0 0">${seen}/${d.cards.length} studied</p></a>`;
        }).join('')}
      </div>
      <div class="card" style="margin-top:16px">
        <h3>Direction</h3>
        <label class="check"><input type="radio" name="dir" value="pt-en" ${state.settings.cardDirection === 'pt-en' ? 'checked' : ''}> Portuguese → English (recognition)</label>
        <label class="check"><input type="radio" name="dir" value="en-pt" ${state.settings.cardDirection === 'en-pt' ? 'checked' : ''}> English → Portuguese (production, harder)</label>
      </div>`;
    $$('input[name=dir]').forEach((r) => (r.onchange = () => { state.settings.cardDirection = r.value; save(); }));
  }

  function schedule(id, grade) {
    // Simplified SM-2. grade: 0 = again, 1 = hard, 2 = good, 3 = easy
    const c = state.cards[id] || { reps: 0, interval: 0, ease: 2.5, due: today() };
    if (grade === 0) { c.reps = 0; c.interval = 0; c.ease = Math.max(1.3, c.ease - 0.2); }
    else if (grade === 1) { c.interval = Math.max(1, Math.round(c.interval * 1.2)); c.ease = Math.max(1.3, c.ease - 0.15); c.reps++; }
    else if (grade === 2) { c.interval = c.reps === 0 ? 1 : c.reps === 1 ? 3 : Math.round(c.interval * c.ease); c.reps++; }
    else { c.interval = c.reps === 0 ? 4 : Math.round(c.interval * c.ease * 1.3); c.ease += 0.15; c.reps++; }
    c.due = addDays(today(), c.interval);
    state.cards[id] = c;
    save();
  }
  function intervalLabel(id, grade) {
    const c = state.cards[id] || { reps: 0, interval: 0, ease: 2.5 };
    const n = grade === 0 ? 0 : grade === 1 ? Math.max(1, Math.round(c.interval * 1.2)) : grade === 2 ? (c.reps === 0 ? 1 : c.reps === 1 ? 3 : Math.round(c.interval * c.ease)) : (c.reps === 0 ? 4 : Math.round(c.interval * c.ease * 1.3));
    return n === 0 ? 'now' : n === 1 ? '1 day' : `${n} days`;
  }

  function viewDeck(deckId) {
    const deck = PT.vocab.find((d) => d.id === deckId);
    if (!deck && deckId !== 'all') return viewVocabList();
    const t = today();
    const cards = allCards().filter((c) => deckId === 'all' || c.deck === deckId);
    const due = shuffle(cards.filter((c) => state.cards[c.id] && state.cards[c.id].due <= t));
    const fresh = deckId === 'all' ? [] : cards.filter((c) => !state.cards[c.id]).slice(0, state.settings.newPerSession);
    const queue = [...due, ...fresh];
    const dir = state.settings.cardDirection;
    let reviewed = 0;

    app.innerHTML = `
      <p><a href="#/vocabulario">← Vocabulário</a></p>
      <div class="spread"><h1>${deck ? esc(deck.title) : 'Review'}</h1><span class="muted small" id="remaining"></span></div>
      <div id="study"></div>`;

    function render() {
      $('#remaining').textContent = queue.length ? `${queue.length} remaining` : '';
      if (!queue.length) {
        const nextDue = cards.map((c) => state.cards[c.id]).filter(Boolean).map((c) => c.due).sort()[0];
        $('#study').innerHTML = `<div class="card" style="text-align:center">
          <h2>${reviewed ? 'Sessão concluída! 🎉' : 'Nothing to review right now.'}</h2>
          <p class="muted">${reviewed ? `You reviewed ${reviewed} cards.` : ''} ${nextDue ? `Next review: ${nextDue === t ? 'today' : nextDue}.` : ''}</p>
          <div class="row" style="justify-content:center">
            <a class="btn" href="#/vocabulario">Back to decks</a>
            ${deck && cards.some((c) => !state.cards[c.id]) ? `<button class="primary" id="more">Learn ${state.settings.newPerSession} more</button>` : ''}
          </div>
          ${deck ? `<details style="margin-top:16px;text-align:left"><summary>Word list (${cards.length})</summary><table class="conj-table" style="margin-top:8px">${cards.map((c) => `<tr><td><strong>${esc(c.pt)}</strong></td><td>${esc(c.en)}</td></tr>`).join('')}</table></details>` : ''}
        </div>`;
        const more = $('#more');
        if (more) more.onclick = () => { queue.push(...cards.filter((c) => !state.cards[c.id]).slice(0, state.settings.newPerSession)); render(); };
        return;
      }
      const c = queue[0];
      const isNew = !state.cards[c.id];
      const front = dir === 'pt-en' ? c.pt : c.en;
      const backMain = dir === 'pt-en' ? c.en : c.pt;
      $('#study').innerHTML = `
        <div class="card flashcard" id="fc">
          ${isNew ? '<span class="badge" style="margin-bottom:8px">new</span>' : ''}
          <div class="front">${esc(front)}</div>
          <div class="back hidden">
            <div class="en">${esc(backMain)}</div>
            <div class="ex">${esc(c.ex)}</div>
            <div style="margin-top:8px">${speakBtn(c.pt.replace(/\s*\(.*?\)/g, ''), '🔊 word')} ${speakBtn(c.ex, '🔊 example')}</div>
          </div>
          <p class="muted small show-hint" style="margin:16px 0 0">Click or press <span class="kbd">space</span> to flip</p>
        </div>
        <div class="srs-buttons hidden" id="grades">
          ${['Again', 'Hard', 'Good', 'Easy'].map((g, i) => `<button data-grade="${i}">${g} <span class="kbd">${i + 1}</span><small>${intervalLabel(c.id, i)}</small></button>`).join('')}
        </div>`;
      if (dir === 'pt-en') speak(c.pt.replace(/\s*\(.*?\)/g, ''));
      $('#fc').onclick = (e) => { if (!e.target.closest('button')) flip(); };
      $$('[data-grade]').forEach((b) => (b.onclick = () => grade(Number(b.dataset.grade))));
    }
    function flip() {
      const back = $('.back');
      if (!back || !back.classList.contains('hidden')) return;
      back.classList.remove('hidden');
      $('.show-hint').classList.add('hidden');
      $('#grades').classList.remove('hidden');
      if (dir === 'en-pt') speak(queue[0].pt.replace(/\s*\(.*?\)/g, ''));
    }
    function grade(g) {
      if ($('#grades').classList.contains('hidden')) return;
      const c = queue.shift();
      schedule(c.id, g);
      addXP(2);
      reviewed++;
      if (g === 0) queue.splice(Math.min(queue.length, 3), 0, c); // see it again soon
      render();
    }
    const onKey = (e) => {
      if (e.target.matches('input, textarea, select')) return;
      if (e.key === ' ') { e.preventDefault(); flip(); }
      else if (['1', '2', '3', '4'].includes(e.key)) grade(Number(e.key) - 1);
    };
    document.addEventListener('keydown', onKey);
    cleanup = () => document.removeEventListener('keydown', onKey);
    render();
  }

  // ---------- Reading ----------
  function viewReadingList() {
    app.innerHTML = `
      <h1>Leitura</h1>
      <p class="muted">Graded texts about Brazilian life and culture. Tap the highlighted words for a translation, listen to the text, then answer the questions.</p>
      <div class="grid">
        ${PT.readings.map((r) => {
          const s = state.readings[r.id];
          return `<a class="card" href="#/leitura/${r.id}">
            <div class="spread"><span class="badge ${r.level}">${r.level}</span>${s ? `<span class="badge ${s.best >= 0.8 ? 'done' : ''}">${Math.round(s.best * 100)}%</span>` : ''}</div>
            <h3 style="margin-top:8px">${esc(r.title)}</h3>
            <p class="muted small" style="margin:0">${r.text.split(/\s+/).length} words · ${r.questions.length} questions</p></a>`;
        }).join('')}
      </div>`;
  }

  function highlightGlossary(text, glossary) {
    const lookup = {};
    Object.keys(glossary).forEach((k) => (lookup[k.toLowerCase()] = glossary[k]));
    const terms = Object.keys(glossary).sort((a, b) => b.length - a.length).map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    if (!terms.length) return esc(text);
    const re = new RegExp(`(?<![\\p{L}])(${terms.join('|')})(?![\\p{L}])`, 'giu');
    const used = new Set();
    return esc(text).replace(re, (m) => {
      const key = m.toLowerCase();
      if (used.has(key)) return m;
      used.add(key);
      return `<span class="gloss" tabindex="0" data-en="${esc(lookup[key])}">${m}</span>`;
    });
  }

  function viewReading(id) {
    const r = PT.readings.find((x) => x.id === id);
    if (!r) return viewReadingList();
    const answers = new Array(r.questions.length).fill(null);

    app.innerHTML = `
      <p><a href="#/leitura">← Leitura</a></p>
      <div class="spread"><h1>${esc(r.title)}</h1><span class="badge ${r.level}">${r.level}</span></div>
      <div class="row" style="margin-bottom:12px">
        <button id="play">🔊 Listen</button>
        <button id="play-slow">🐢 Slowly</button>
        <button id="stop">⏹ Stop</button>
      </div>
      <div class="card reading-text">${highlightGlossary(r.text, r.glossary)}</div>
      <details class="card"><summary><strong>Glossary</strong> (${Object.keys(r.glossary).length})</summary>
        <div class="glossary-list" style="margin-top:8px">${Object.entries(r.glossary).map(([k, v]) => `<div><strong>${esc(k)}</strong>: ${esc(v)}</div>`).join('')}</div>
      </details>
      <div class="card">
        <h2>Compreensão</h2>
        ${r.questions.map((q, i) => `
          <div class="exercise" data-i="${i}">
            <div class="q"><strong>${i + 1}.</strong> ${esc(q.q)}</div>
            <div class="options">${q.options.map((o, j) => `<button data-opt="${j}">${esc(o)}</button>`).join('')}</div>
          </div>`).join('')}
        <div id="reading-done" class="hidden" style="margin-top:12px"></div>
      </div>`;

    $('#play').onclick = () => speak(r.text, 1);
    $('#play-slow').onclick = () => speak(r.text, 0.75);
    $('#stop').onclick = stopSpeaking;
    $$('.gloss').forEach((g) => (g.onclick = () => {
      const on = g.classList.contains('show');
      $$('.gloss.show').forEach((x) => x.classList.remove('show'));
      if (!on) g.classList.add('show');
    }));

    $$('.exercise').forEach((el) => {
      const i = Number(el.dataset.i);
      $$('[data-opt]', el).forEach((btn) => (btn.onclick = () => {
        const ok = Number(btn.dataset.opt) === r.questions[i].a;
        btn.classList.add(ok ? 'correct' : 'wrong');
        if (ok) $$('[data-opt]', el).forEach((b) => (b.disabled = true));
        if (answers[i] === null) {
          answers[i] = ok;
          if (ok) addXP(5);
          if (answers.every((a) => a !== null)) {
            const score = answers.filter(Boolean).length / answers.length;
            state.readings[id] = { best: Math.max(score, (state.readings[id] || { best: 0 }).best) };
            save();
            const done = $('#reading-done');
            done.classList.remove('hidden');
            done.innerHTML = `<div class="feedback ${score >= 0.8 ? 'ok' : 'warn'}"><strong>${Math.round(score * 100)}%</strong> on the first try. ${score >= 0.8 ? 'Ótimo!' : 'Reread the text and try again later.'}</div>
              <p class="small muted" style="margin-top:8px">💡 To go further: read the text aloud, then summarize it in 3 sentences in the <a href="#/escrita">Escrita</a> section.</p>`;
          }
        }
      }));
    });
  }

  // ---------- Listening (dictation) ----------
  function tokenize(s) {
    return s.replace(/[.,!?;:“”"«»—–-]/g, ' ').split(/\s+/).filter(Boolean);
  }
  // Word-level LCS diff between expected and given
  function diffWords(expected, given) {
    const a = tokenize(expected), b = tokenize(given);
    const key = (w) => stripAccents(w.toLowerCase());
    const dp = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
    for (let i = a.length - 1; i >= 0; i--)
      for (let j = b.length - 1; j >= 0; j--)
        dp[i][j] = key(a[i]) === key(b[j]) ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    const out = [];
    let i = 0, j = 0, exact = 0;
    while (i < a.length && j < b.length) {
      if (key(a[i]) === key(b[j])) {
        if (a[i].toLowerCase() === b[j].toLowerCase()) { out.push(`<span class="ok">${esc(a[i])}</span>`); exact++; }
        else out.push(`<span class="accent" title="you wrote: ${esc(b[j])}">${esc(a[i])}</span>`);
        i++; j++;
      } else if (dp[i + 1][j] >= dp[i][j + 1]) { out.push(`<span class="miss">${esc(a[i])}</span>`); i++; }
      else { out.push(`<span class="add">${esc(b[j])}</span>`); j++; }
    }
    while (i < a.length) out.push(`<span class="miss">${esc(a[i++])}</span>`);
    while (j < b.length) out.push(`<span class="add">${esc(b[j++])}</span>`);
    return { html: out.join(' '), score: exact / a.length, perfect: exact === a.length && a.length === b.length };
  }

  function viewListening() {
    const hasTTS = 'speechSynthesis' in window;
    let level = 'all', current = null, done = false;
    app.innerHTML = `
      <h1>Escuta: dictation</h1>
      <p class="muted">Listen, type exactly what you hear, and check. Dictation trains your ear and your spelling at the same time.</p>
      ${!hasTTS ? '<div class="feedback bad">Your browser does not support speech synthesis. Try Chrome, Edge or Safari.</div>' : ''}
      <div class="card">
        <div class="spread">
          <select id="level" style="width:auto">
            <option value="all">All levels</option><option value="B1">B1</option><option value="B1+">B1+</option><option value="B2">B2</option>
          </select>
          <span class="muted small">Total: ${state.dictation.c}/${state.dictation.t} perfect</span>
        </div>
        <p class="small muted" id="voice-info" style="margin:8px 0 0"></p>
      </div>
      <div class="card">
        <div class="row" style="margin-bottom:12px">
          <button class="primary" id="play">🔊 Play</button>
          <button id="slow">🐢 Slowly</button>
        </div>
        <div class="row"><input type="text" id="dict-input" autocomplete="off" spellcheck="false" placeholder="Type what you heard…" style="flex:1"><button id="dict-check">Check</button></div>
        <div id="dict-result" class="hidden" style="margin-top:12px"></div>
      </div>
      <div class="card">
        <h3>More listening practice</h3>
        <ul class="small">
          <li><strong>Podcasts:</strong> <em>Café Brasil</em>, <em>Mamilos</em>, <em>Nerdcast</em>, <em>Speaking Brazilian</em> (for learners)</li>
          <li><strong>YouTube:</strong> news from <em>g1</em>, <em>Porta dos Fundos</em> (comedy), <em>Manual do Mundo</em></li>
          <li><strong>Series:</strong> <em>Sintonia</em>, <em>Cidade Invisível</em>, <em>Coisa Mais Linda</em>, with Portuguese subtitles</li>
          <li><strong>Music:</strong> look up the lyrics (letras.mus.br) and sing along</li>
        </ul>
      </div>`;

    const info = () => { $('#voice-info').textContent = ptVoice ? `Voice: ${ptVoice.name}` : 'No Portuguese voice found; your system default will be used. On a computer, install a pt-BR voice in your system’s language settings.'; };
    if (hasTTS) { info(); speechSynthesis.addEventListener('voiceschanged', info); cleanup = () => speechSynthesis.removeEventListener('voiceschanged', info); }

    const input = $('#dict-input');
    function next() {
      const pool = PT.dictation.filter((d) => level === 'all' || d.level === level);
      let n = pick(pool);
      if (current && pool.length > 1) while (n === current) n = pick(pool);
      current = n; done = false;
      input.value = ''; input.disabled = false;
      $('#dict-result').className = 'hidden';
      $('#dict-check').textContent = 'Check';
    }
    function check() {
      if (done) { next(); speak(current.s); input.focus(); return; }
      if (!input.value.trim()) return;
      const d = diffWords(current.s, input.value);
      done = true;
      state.dictation.t++;
      if (d.perfect) { state.dictation.c++; addXP(5); } else if (d.score >= 0.7) addXP(2);
      save();
      const res = $('#dict-result');
      res.className = '';
      res.innerHTML = `<div class="feedback ${d.perfect ? 'ok' : d.score >= 0.7 ? 'warn' : 'bad'}">${d.perfect ? '✓ Perfect!' : `${Math.round(d.score * 100)}% of the words correct`}</div>
        <p class="diff" style="font-size:1.1rem;margin-top:8px">${d.html}</p>
        <p class="small muted">${d.perfect ? '' : '<span class="diff"><span class="miss">missing</span> · <span class="add">extra/wrong</span> · <span class="accent">accent</span></span>'}</p>
        <p><strong>${esc(current.s)}</strong> ${speakBtn(current.s)}</p>`;
      $('#dict-check').textContent = 'Next →';
    }
    $('#play').onclick = () => { speak(current.s, 1); input.focus(); };
    $('#slow').onclick = () => { speak(current.s, 0.65); input.focus(); };
    $('#dict-check').onclick = check;
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); check(); } });
    $('#level').onchange = (e) => { level = e.target.value; next(); };
    next();
  }

  // ---------- Writing ----------
  function viewWritingList() {
    app.innerHTML = `
      <h1>Escrita</h1>
      <p class="muted">Writing is where B2 shows. Each task lists target structures; the editor detects connectors automatically and saves your draft in this browser.</p>
      <div class="grid">
        ${PT.writing.map((w) => {
          const s = state.writing[w.id];
          return `<a class="card" href="#/escrita/${w.id}">
            <div class="spread"><span class="badge ${w.level}">${w.level}</span>${s && s.done ? '<span class="badge done">done</span>' : s && s.draft ? '<span class="badge">draft</span>' : ''}</div>
            <h3 style="margin-top:8px">${esc(w.title)}</h3>
            <p class="muted small" style="margin:0">~${w.words} words</p></a>`;
        }).join('')}
      </div>`;
  }

  const CONNECTORS = ['além disso', 'também', 'inclusive', 'não só', 'mas também', 'porém', 'no entanto', 'contudo', 'entretanto', 'por outro lado', 'embora', 'mesmo que', 'ainda que', 'apesar de', 'apesar disso', 'porque', 'já que', 'uma vez que', 'visto que', 'portanto', 'por isso', 'logo', 'de modo que', 'caso', 'desde que', 'a menos que', 'a não ser que', 'para que', 'a fim de', 'ou seja', 'aliás', 'enfim', 'afinal', 'em primeiro lugar', 'em segundo lugar', 'por fim', 'em conclusão', 'em suma', 'na minha opinião', 'por exemplo', 'mesmo assim', 'à medida que', 'quer dizer', 'pelo contrário', 'de qualquer forma', 'sobretudo', 'principalmente'];

  function viewWriting(id) {
    const w = PT.writing.find((x) => x.id === id);
    if (!w) return viewWritingList();
    const ws = state.writing[id] || { draft: '', done: false };

    app.innerHTML = `
      <p><a href="#/escrita">← Escrita</a></p>
      <div class="spread"><h1>${esc(w.title)}</h1><span class="badge ${w.level}">${w.level}</span></div>
      <div class="card">
        <p style="font-size:1.05rem">${esc(w.prompt)}</p>
        <h3>Target structures</h3>
        <div>${w.targets.map((t, i) => `<label class="check"><input type="checkbox" data-t="${i}"> ${esc(t)}</label>`).join('')}</div>
      </div>
      <div class="card">
        <textarea id="text" placeholder="Escreva aqui…" lang="pt-BR" spellcheck="true">${esc(ws.draft)}</textarea>
        <div class="spread" style="margin-top:8px">
          <span id="wc" class="small"></span>
          <span class="small muted" id="saved"></span>
        </div>
        <div class="progress" style="margin-top:6px"><div id="wc-bar"></div></div>
        <h3 style="margin-top:16px">Connectors used</h3>
        <div id="connectors" class="small"></div>
        <div class="row" style="margin-top:16px">
          <button id="copy">📋 Copy a correction request for an AI tutor</button>
          <button class="primary" id="done">${ws.done ? '✓ Done' : 'Mark as done (+30 XP)'}</button>
        </div>
        <p class="small muted" id="copy-msg" style="margin-top:8px"></p>
      </div>`;

    const ta = $('#text');
    let timer = null;
    function analyze() {
      const text = ta.value;
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;
      $('#wc').innerHTML = `<strong>${words}</strong> / ~${w.words} words`;
      $('#wc-bar').style.width = `${Math.min(100, (words / w.words) * 100)}%`;
      const lower = ` ${text.toLowerCase()} `;
      const found = CONNECTORS.filter((c) => new RegExp(`(?<![\\p{L}])${c}(?![\\p{L}])`, 'u').test(lower));
      // Drop shorter connectors contained in longer ones that were found (e.g. "logo" vs nothing, "também" in "mas também")
      const shown = found.filter((c) => !found.some((o) => o !== c && o.includes(c)));
      $('#connectors').innerHTML = shown.length
        ? shown.map((c) => `<span class="found">${esc(c)}</span>`).join(' ') + (shown.length < 3 ? '<p class="muted" style="margin-top:6px">Try to use at least 3 different connectors.</p>' : '')
        : '<span class="muted">None yet. Try <em>além disso, no entanto, embora, portanto…</em></span>';
    }
    ta.addEventListener('input', () => {
      analyze();
      clearTimeout(timer);
      timer = setTimeout(() => {
        state.writing[id] = { ...(state.writing[id] || {}), draft: ta.value };
        save();
        $('#saved').textContent = 'Draft saved ✓';
      }, 600);
    });
    cleanup = () => {
      clearTimeout(timer);
      state.writing[id] = { ...(state.writing[id] || {}), draft: ta.value };
      save();
    };
    analyze();

    $('#copy').onclick = async () => {
      const req = `Você é um professor de português brasileiro. Sou estudante de nível B1 e quero chegar ao B2.\n\nTarefa: ${w.prompt}\n\nMeu texto:\n"""\n${ta.value.trim()}\n"""\n\nPor favor:\n1. Corrija os erros (gramática, ortografia, acentos, regência) e explique cada correção em inglês.\n2. Reescreva o texto de forma mais natural, no nível B2.\n3. Avalie meu uso de: ${w.targets.join('; ')}.\n4. Dê uma nota de nível estimada (A2, B1, B2…).`;
      try {
        await navigator.clipboard.writeText(req);
        $('#copy-msg').textContent = 'Copied! Paste it into Claude or another AI tutor for detailed feedback.';
      } catch (e) {
        $('#copy-msg').textContent = 'Could not copy automatically. Select and copy your text manually.';
      }
    };
    $('#done').onclick = () => {
      const words = ta.value.trim().split(/\s+/).filter(Boolean).length;
      if (words < Math.round(w.words * 0.6)) { $('#copy-msg').textContent = `Write at least ${Math.round(w.words * 0.6)} words first.`; return; }
      if (!state.writing[id] || !state.writing[id].done) addXP(30);
      state.writing[id] = { draft: ta.value, done: true };
      save();
      $('#done').textContent = '✓ Done';
    };
  }

  // ---------- Progress ----------
  function viewProgress() {
    const cards = allCards();
    const learned = cards.filter((c) => state.cards[c.id] && state.cards[c.id].reps > 0).length;
    const mature = cards.filter((c) => state.cards[c.id] && state.cards[c.id].interval >= 21).length;
    const days = [];
    for (let i = 13; i >= 0; i--) { const d = addDays(today(), -i); days.push([d, state.days[d] || 0]); }
    const maxXP = Math.max(state.settings.goal, ...days.map((d) => d[1]));
    const V = PT.verbs;

    app.innerHTML = `
      <h1>Progresso</h1>
      <div class="stats">
        <div class="stat"><div class="num">${state.xp}</div><div class="label">total XP</div></div>
        <div class="stat"><div class="num">🔥 ${streak()}</div><div class="label">day streak</div></div>
        <div class="stat"><div class="num">${learned}<span class="muted small">/${cards.length}</span></div><div class="label">words learned</div></div>
        <div class="stat"><div class="num">${mature}</div><div class="label">words in long-term memory (21+ days)</div></div>
      </div>

      <div class="card">
        <h2>Last 14 days</h2>
        <div style="display:flex;align-items:flex-end;gap:4px;height:120px;border-bottom:1px solid var(--border)">
          ${days.map(([d, x]) => `<div title="${d}: ${x} XP" style="flex:1;background:${x >= state.settings.goal ? 'var(--green)' : 'var(--yellow)'};height:${(x / maxXP) * 100}%;min-height:${x ? 3 : 0}px;border-radius:4px 4px 0 0"></div>`).join('')}
        </div>
        <div class="spread small muted" style="margin-top:4px"><span>${days[0][0].slice(5)}</span><span>today</span></div>
        <div class="row" style="margin-top:12px">
          <label for="goal" class="small">Daily goal:</label>
          <select id="goal" style="width:auto">${[20, 50, 100, 150].map((g) => `<option value="${g}" ${g === state.settings.goal ? 'selected' : ''}>${g} XP</option>`).join('')}</select>
        </div>
      </div>

      <div class="card">
        <h2>Gramática</h2>
        <table class="conj-table">${PT.grammar.map((l) => {
          const s = state.lessons[l.id];
          return `<tr><td><a href="#/gramatica/${l.id}">${esc(l.title)}</a></td><td><span class="badge ${l.level}">${l.level}</span></td><td style="width:35%">${s ? `<div class="progress"><div style="width:${s.best * 100}%"></div></div>` : '<span class="muted small">not started</span>'}</td><td class="small">${s ? Math.round(s.best * 100) + '%' : ''}</td></tr>`;
        }).join('')}</table>
      </div>

      <div class="card">
        <h2>Verbs: accuracy by tense</h2>
        ${Object.keys(state.drills).length ? `<table class="conj-table">${V.TENSES.filter((t) => state.drills[t.id]).map((t) => {
          const d = state.drills[t.id]; const p = d.c / d.t;
          return `<tr><td>${esc(t.name)}</td><td style="width:35%"><div class="progress"><div style="width:${p * 100}%;background:${p >= 0.8 ? 'var(--green)' : p >= 0.6 ? 'var(--yellow)' : 'var(--red)'}"></div></div></td><td class="small">${Math.round(p * 100)}% (${d.c}/${d.t})</td></tr>`;
        }).join('')}</table>` : '<p class="muted">Do a few <a href="#/verbos">drills</a> to see your weak spots here.</p>'}
      </div>

      <div class="card">
        <h2>Reading, listening and writing</h2>
        <p>Readings: ${Object.keys(state.readings).length}/${PT.readings.length} done · Dictation: ${state.dictation.c}/${state.dictation.t} perfect · Writing tasks: ${Object.values(state.writing).filter((w) => w.done).length}/${PT.writing.length} done</p>
      </div>

      <div class="card">
        <h2>Back up your progress</h2>
        <p class="small muted">Progress is stored only in this browser. Export it to back it up or move it to another device.</p>
        <div class="row">
          <button id="export">⬇️ Export</button>
          <label class="btn" for="import-file">⬆️ Import</label><input type="file" id="import-file" accept="application/json" class="hidden">
          <button id="reset" style="color:var(--red)">Reset everything</button>
        </div>
        <p class="small" id="backup-msg"></p>
      </div>`;

    $('#goal').onchange = (e) => { state.settings.goal = Number(e.target.value); save(); viewProgressReload(); };
    const viewProgressReload = () => { app.innerHTML = ''; viewProgress(); updateHeaderXP(); };
    $('#export').onclick = () => {
      const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `rumo-ao-b2-${today()}.json`;
      a.click();
      URL.revokeObjectURL(a.href);
    };
    $('#import-file').onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        const data = JSON.parse(await file.text());
        if (typeof data !== 'object' || !('xp' in data)) throw new Error('invalid');
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        state = load();
        viewProgressReload();
        $('#backup-msg').textContent = 'Progress imported ✓';
      } catch (err) {
        $('#backup-msg').textContent = 'Invalid file.';
      }
    };
    $('#reset').onclick = () => {
      if (!confirm('Erase all progress? This cannot be undone.')) return;
      state = defaults();
      save();
      viewProgressReload();
    };
  }

  route();
})();
