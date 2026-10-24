# Rumo ao B2 🇧🇷

A personal website for learning **Brazilian Portuguese** from A2/B1 to **B2**.

It is a plain static site (HTML, CSS and JavaScript) with no build step and no dependencies. Progress is stored in your browser's `localStorage`, and you can export or import it from the *Progresso* page.

## Sections

| Section | What it does |
|---|---|
| **Início** | Daily plan, streak, XP goal and a B2 roadmap |
| **Gramática** | 12 B1→B2 topics (subjunctive × 3, compound tenses, personal infinitive, por/para, pronouns, connectors, passive voice, reported speech…) with explanations and auto-graded exercises |
| **Verbos** | Conjugation drill (choose tenses, irregular/regular) plus full tables for 39 verbs, using the Brazilian 4-person system |
| **Vocabulário** | 6 decks (~135 cards) with spaced repetition (SM-2), audio and example sentences |
| **Leitura** | Graded texts on Brazilian life and culture, with tap-to-translate glossary, read-aloud and comprehension questions |
| **Escuta** | Dictation with pt-BR text-to-speech and a word-by-word diff |
| **Escrita** | B2-style writing tasks with word count, connector detection, draft autosave and a ready-made AI correction prompt |
| **Progresso** | XP history, scores per topic, verb accuracy by tense, backup/restore |

## Running it

Open `index.html` in a browser, or serve the folder:

```sh
python3 -m http.server 8000
# then visit http://localhost:8000
```

Audio uses the browser's Web Speech API. For the best results, use Chrome, Edge or Safari with a Portuguese (Brazil) voice installed.

### Publishing with GitHub Pages

Repository **Settings → Pages → Deploy from a branch**, then pick your branch and `/ (root)`.

## Adding content

All content is in `js/data/` and `js/verbs.js`:

- `grammar.js`: lessons. A typed exercise is `{ q, a: ['answer', 'alternative'] }`; a multiple-choice one is `{ q, options: [...], a: index, why }`.
- `vocab.js`: decks of `[portuguese, english, example]`.
- `readings.js`: readings (with `glossary` and `questions`), dictation sentences and writing prompts.
- `verbs.js`: add verbs to `VERBS`. Regular verbs need only `inf` and `en`; irregulars override the forms that differ.
