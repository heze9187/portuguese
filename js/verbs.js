// Conjugation engine for Brazilian Portuguese.
// Uses the 4-person system common in Brazil: eu / você·ele·ela·a gente / nós / vocês·eles·elas.
(function () {
  const PERSONS = ['eu', 'você / ele / ela', 'nós', 'vocês / eles / elas'];

  const TENSES = [
    { id: 'pres', name: 'Presente', en: 'present indicative' },
    { id: 'pret', name: 'Pretérito perfeito', en: 'simple past (completed)' },
    { id: 'imp', name: 'Pretérito imperfeito', en: 'imperfect (used to / was -ing)' },
    { id: 'fut', name: 'Futuro do presente', en: 'future (formal)' },
    { id: 'cond', name: 'Futuro do pretérito', en: 'conditional (would)' },
    { id: 'subjPres', name: 'Presente do subjuntivo', en: 'present subjunctive' },
    { id: 'subjImp', name: 'Imperfeito do subjuntivo', en: 'imperfect subjunctive' },
    { id: 'subjFut', name: 'Futuro do subjuntivo', en: 'future subjunctive' },
    { id: 'infPes', name: 'Infinitivo pessoal', en: 'personal infinitive' }
  ];

  // Irregular data. Anything not listed is derived from the regular rules.
  // pres/pret/imp/subjPres/subjFut: [eu, ele, nós, eles]
  const VERBS = [
    { inf: 'ser', en: 'to be (permanent)', irregular: true,
      pres: ['sou', 'é', 'somos', 'são'], pret: ['fui', 'foi', 'fomos', 'foram'],
      imp: ['era', 'era', 'éramos', 'eram'], subjPres: ['seja', 'seja', 'sejamos', 'sejam'] },
    { inf: 'estar', en: 'to be (temporary)', irregular: true,
      pres: ['estou', 'está', 'estamos', 'estão'], pret: ['estive', 'esteve', 'estivemos', 'estiveram'],
      subjPres: ['esteja', 'esteja', 'estejamos', 'estejam'] },
    { inf: 'ter', en: 'to have', irregular: true,
      pres: ['tenho', 'tem', 'temos', 'têm'], pret: ['tive', 'teve', 'tivemos', 'tiveram'],
      imp: ['tinha', 'tinha', 'tínhamos', 'tinham'] },
    { inf: 'ir', en: 'to go', irregular: true,
      pres: ['vou', 'vai', 'vamos', 'vão'], pret: ['fui', 'foi', 'fomos', 'foram'],
      subjPres: ['vá', 'vá', 'vamos', 'vão'] },
    { inf: 'fazer', en: 'to do / make', irregular: true, futStem: 'far',
      pres: ['faço', 'faz', 'fazemos', 'fazem'], pret: ['fiz', 'fez', 'fizemos', 'fizeram'] },
    { inf: 'dizer', en: 'to say', irregular: true, futStem: 'dir',
      pres: ['digo', 'diz', 'dizemos', 'dizem'], pret: ['disse', 'disse', 'dissemos', 'disseram'] },
    { inf: 'trazer', en: 'to bring', irregular: true, futStem: 'trar',
      pres: ['trago', 'traz', 'trazemos', 'trazem'], pret: ['trouxe', 'trouxe', 'trouxemos', 'trouxeram'] },
    { inf: 'poder', en: 'to be able to', irregular: true,
      pres: ['posso', 'pode', 'podemos', 'podem'], pret: ['pude', 'pôde', 'pudemos', 'puderam'] },
    { inf: 'querer', en: 'to want', irregular: true,
      pres: ['quero', 'quer', 'queremos', 'querem'], pret: ['quis', 'quis', 'quisemos', 'quiseram'],
      subjPres: ['queira', 'queira', 'queiramos', 'queiram'] },
    { inf: 'saber', en: 'to know (facts)', irregular: true,
      pres: ['sei', 'sabe', 'sabemos', 'sabem'], pret: ['soube', 'soube', 'soubemos', 'souberam'],
      subjPres: ['saiba', 'saiba', 'saibamos', 'saibam'] },
    { inf: 'vir', en: 'to come', irregular: true,
      pres: ['venho', 'vem', 'vimos', 'vêm'], pret: ['vim', 'veio', 'viemos', 'vieram'],
      imp: ['vinha', 'vinha', 'vínhamos', 'vinham'] },
    { inf: 'ver', en: 'to see', irregular: true,
      pres: ['vejo', 'vê', 'vemos', 'veem'], pret: ['vi', 'viu', 'vimos', 'viram'] },
    { inf: 'dar', en: 'to give', irregular: true,
      pres: ['dou', 'dá', 'damos', 'dão'], pret: ['dei', 'deu', 'demos', 'deram'],
      subjPres: ['dê', 'dê', 'demos', 'deem'] },
    { inf: 'pôr', en: 'to put', irregular: true, futStem: 'por', infBase: 'por',
      pres: ['ponho', 'põe', 'pomos', 'põem'], pret: ['pus', 'pôs', 'pusemos', 'puseram'],
      imp: ['punha', 'punha', 'púnhamos', 'punham'] },
    { inf: 'sair', en: 'to leave / go out', irregular: true,
      pres: ['saio', 'sai', 'saímos', 'saem'], pret: ['saí', 'saiu', 'saímos', 'saíram'],
      imp: ['saía', 'saía', 'saíamos', 'saíam'], subjFut: ['sair', 'sair', 'sairmos', 'saírem'],
      infPes: ['sair', 'sair', 'sairmos', 'saírem'] },
    // Stem-changing / spelling-change verbs (regular endings otherwise)
    { inf: 'ouvir', en: 'to hear', irregular: true, presEu: 'ouço' },
    { inf: 'pedir', en: 'to ask for', irregular: true, presEu: 'peço' },
    { inf: 'dormir', en: 'to sleep', irregular: true, presEu: 'durmo' },
    { inf: 'sentir', en: 'to feel', irregular: true, presEu: 'sinto' },
    { inf: 'preferir', en: 'to prefer', irregular: true, presEu: 'prefiro' },
    { inf: 'conhecer', en: 'to know (people/places)', presEu: 'conheço' },
    { inf: 'chegar', en: 'to arrive' },
    { inf: 'ficar', en: 'to stay / become' },
    { inf: 'começar', en: 'to begin' },
    // Fully regular
    { inf: 'falar', en: 'to speak' },
    { inf: 'trabalhar', en: 'to work' },
    { inf: 'morar', en: 'to live (reside)' },
    { inf: 'gostar', en: 'to like' },
    { inf: 'precisar', en: 'to need' },
    { inf: 'comer', en: 'to eat' },
    { inf: 'beber', en: 'to drink' },
    { inf: 'viver', en: 'to live' },
    { inf: 'aprender', en: 'to learn' },
    { inf: 'entender', en: 'to understand' },
    { inf: 'partir', en: 'to leave / depart' },
    { inf: 'abrir', en: 'to open' },
    { inf: 'decidir', en: 'to decide' },
    { inf: 'assistir', en: 'to watch' }
  ];

  const ACCENT = { a: 'á', e: 'ê', i: 'í', o: 'ô' };

  // Spelling changes before e: c→qu, g→gu, ç→c
  function softenAr(stem) {
    if (stem.endsWith('c')) return stem.slice(0, -1) + 'qu';
    if (stem.endsWith('g')) return stem.slice(0, -1) + 'gu';
    if (stem.endsWith('ç')) return stem.slice(0, -1) + 'c';
    return stem;
  }

  function conjugate(v) {
    const base = v.infBase || v.inf;
    const cls = base.slice(-2); // ar / er / ir / or
    const stem = base.slice(0, -2);
    const t = {};

    // Presente
    if (v.pres) t.pres = v.pres;
    else {
      const e = cls === 'ar' ? ['a', 'amos', 'am'] : cls === 'er' ? ['e', 'emos', 'em'] : ['e', 'imos', 'em'];
      t.pres = [v.presEu || stem + 'o', stem + e[0], stem + e[1], stem + e[2]];
    }

    // Pretérito perfeito
    if (v.pret) t.pret = v.pret;
    else if (cls === 'ar') t.pret = [softenAr(stem) + 'ei', stem + 'ou', stem + 'amos', stem + 'aram'];
    else if (cls === 'er') t.pret = [stem + 'i', stem + 'eu', stem + 'emos', stem + 'eram'];
    else t.pret = [stem + 'i', stem + 'iu', stem + 'imos', stem + 'iram'];

    // Imperfeito
    if (v.imp) t.imp = v.imp;
    else if (cls === 'ar') t.imp = [stem + 'ava', stem + 'ava', stem + 'ávamos', stem + 'avam'];
    else t.imp = [stem + 'ia', stem + 'ia', stem + 'íamos', stem + 'iam'];

    // Futuro / condicional
    const fs = v.futStem || base;
    t.fut = [fs + 'ei', fs + 'á', fs + 'emos', fs + 'ão'];
    t.cond = [fs + 'ia', fs + 'ia', fs + 'íamos', fs + 'iam'];

    // Presente do subjuntivo: from 1st person present
    if (v.subjPres) t.subjPres = v.subjPres;
    else {
      let s = t.pres[0].replace(/o$/, '');
      if (cls === 'ar') { s = softenAr(s); t.subjPres = [s + 'e', s + 'e', s + 'emos', s + 'em']; }
      else t.subjPres = [s + 'a', s + 'a', s + 'amos', s + 'am'];
    }

    // Imperfeito / futuro do subjuntivo: from 3rd person plural preterite minus -ram
    const pb = t.pret[3].replace(/ram$/, '');
    const last = pb.slice(-1);
    let accented;
    if ('áéíóôê'.includes(last)) accented = pb;
    else if (last === 'e') accented = pb.slice(0, -1) + (v.pret ? 'é' : 'ê');
    else accented = pb.slice(0, -1) + (ACCENT[last] || last);
    t.subjImp = v.subjImp || [pb + 'sse', pb + 'sse', accented + 'ssemos', pb + 'ssem'];
    t.subjFut = v.subjFut || [pb + 'r', pb + 'r', pb + 'rmos', pb + 'rem'];

    // Infinitivo pessoal
    t.infPes = v.infPes || [base, base, base + 'mos', base + 'em'];
    if (v.inf === 'pôr') t.infPes = ['pôr', 'pôr', 'pormos', 'porem'];
    return t;
  }

  window.PT = window.PT || {};
  window.PT.verbs = { PERSONS, TENSES, VERBS, conjugate };
  if (typeof module !== 'undefined') module.exports = window.PT.verbs;
})();
