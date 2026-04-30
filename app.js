// ============================================================
//  TABIJI — App Core Logic
//  Screen routing, lesson flow, vocab browser, voice practice
// ============================================================

(() => {
  'use strict';

  // ── State ──────────────────────────────────────────────────
  const state = {
    level:           'beginner',  // 'beginner' | 'basic' | 'intermediate'
    progress: {
      // moduleId → { seen: Set of phrase indices }
    },
    currentModule:   null,
    currentPhraseIdx: 0,
    vocabCategory:   'All',
    vocabSearch:     '',
  };

  // ── Persist & Restore ──────────────────────────────────────
  function saveState() {
    try {
      const serializable = {
        level: state.level,
        progress: {}
      };
      for (const [k, v] of Object.entries(state.progress)) {
        serializable.progress[k] = { seen: [...v.seen] };
      }
      localStorage.setItem('tabiji_state', JSON.stringify(serializable));
    } catch (_) { /* storage unavailable */ }
  }

  function loadState() {
    try {
      const raw = localStorage.getItem('tabiji_state');
      if (!raw) return;
      const saved = JSON.parse(raw);
      state.level = saved.level || 'beginner';
      for (const [k, v] of Object.entries(saved.progress || {})) {
        state.progress[k] = { seen: new Set(v.seen || []) };
      }
    } catch (_) { /* ignore corrupt data */ }
  }

  // ── Word Breakdown Tokenizer ────────────────────────────────

  /**
   * Built-in dictionary: Japanese grammar particles, auxiliaries,
   * and very common words not always in the VOCAB list.
   */
  const PARTICLES = [
    // Particles
    { jp:'を',   kana:'を',   rom:'o',          en:'[object marker]',      type:'particle' },
    { jp:'は',   kana:'は',   rom:'wa',         en:'[topic marker]',        type:'particle' },
    { jp:'が',   kana:'が',   rom:'ga',         en:'[subject marker]',      type:'particle' },
    { jp:'に',   kana:'に',   rom:'ni',         en:'[direction / location]',type:'particle' },
    { jp:'で',   kana:'で',   rom:'de',         en:'[means / location]',    type:'particle' },
    { jp:'の',   kana:'の',   rom:'no',         en:'[possessive / of]',     type:'particle' },
    { jp:'と',   kana:'と',   rom:'to',         en:'and / with',            type:'particle' },
    { jp:'も',   kana:'も',   rom:'mo',         en:'also / too',            type:'particle' },
    { jp:'か',   kana:'か',   rom:'ka',         en:'[question marker]',     type:'particle' },
    { jp:'ね',   kana:'ね',   rom:'ne',         en:'[seeks agreement]',     type:'particle' },
    { jp:'よ',   kana:'よ',   rom:'yo',         en:'[assertion]',           type:'particle' },
    { jp:'から', kana:'から', rom:'kara',       en:'from',                  type:'particle' },
    { jp:'まで', kana:'まで', rom:'made',       en:'until / up to',         type:'particle' },
    { jp:'より', kana:'より', rom:'yori',       en:'than / rather',         type:'particle' },
    { jp:'へ',   kana:'へ',   rom:'e',          en:'[direction: toward]',   type:'particle' },
    { jp:'だけ', kana:'だけ', rom:'dake',       en:'only / just',           type:'particle' },
    { jp:'しか', kana:'しか', rom:'shika',      en:'only (with negative)',  type:'particle' },
    { jp:'でも', kana:'でも', rom:'demo',       en:'but / even so',         type:'particle' },
    { jp:'なし', kana:'なし', rom:'nashi',      en:'without',               type:'particle' },
    // Copula & auxiliaries
    { jp:'です',     kana:'です',     rom:'desu',         en:'is / am / are (polite)',     type:'auxiliary' },
    { jp:'ます',     kana:'ます',     rom:'masu',         en:'[polite verb ending]',       type:'auxiliary' },
    { jp:'ました',   kana:'ました',   rom:'mashita',      en:'[polite past tense]',        type:'auxiliary' },
    { jp:'ません',   kana:'ません',   rom:'masen',        en:'[polite negative]',          type:'auxiliary' },
    { jp:'ましょう', kana:'ましょう', rom:'mashō',        en:'let\'s [volitional]',        type:'auxiliary' },
    { jp:'てください', kana:'てください', rom:'te kudasai', en:'please do',                type:'auxiliary' },
    { jp:'ください', kana:'ください', rom:'kudasai',      en:'please (give me)',           type:'auxiliary' },
    { jp:'たい',     kana:'たい',     rom:'tai',          en:'want to',                   type:'auxiliary' },
    { jp:'てもいいですか', kana:'てもいいですか', rom:'temo ii desu ka', en:'is it okay if…?', type:'auxiliary' },
    { jp:'でしょう', kana:'でしょう', rom:'deshō',        en:'probably / I suppose',       type:'auxiliary' },
    { jp:'ている',   kana:'ている',   rom:'te iru',       en:'[ongoing action]',           type:'auxiliary' },
    { jp:'になる',   kana:'になる',   rom:'ni naru',      en:'to become',                  type:'auxiliary' },
    // Common adverbs / connectors
    { jp:'どこ',     kana:'どこ',     rom:'doko',         en:'where',                      type:'question word' },
    { jp:'なん',     kana:'なん',     rom:'nan',          en:'what',                       type:'question word' },
    { jp:'なに',     kana:'なに',     rom:'nani',         en:'what',                       type:'question word' },
    { jp:'いつ',     kana:'いつ',     rom:'itsu',         en:'when',                       type:'question word' },
    { jp:'どれ',     kana:'どれ',     rom:'dore',         en:'which one',                  type:'question word' },
    { jp:'どの',     kana:'どの',     rom:'dono',         en:'which',                      type:'question word' },
    { jp:'いくら',   kana:'いくら',   rom:'ikura',        en:'how much',                   type:'question word' },
    { jp:'どのくらい', kana:'どのくらい', rom:'dono kurai', en:'how long / how much',      type:'question word' },
    { jp:'もう',     kana:'もう',     rom:'mō',           en:'already / more',             type:'adverb' },
    { jp:'一度',     kana:'いちど',   rom:'ichido',       en:'once / one time',            type:'adverb' },
    { jp:'少し',     kana:'すこし',   rom:'sukoshi',      en:'a little',                   type:'adverb' },
    { jp:'ゆっくり', kana:'ゆっくり', rom:'yukkuri',      en:'slowly',                     type:'adverb' },
    { jp:'まっすぐ', kana:'まっすぐ', rom:'massugu',      en:'straight ahead',             type:'adverb' },
    { jp:'近く',     kana:'ちかく',   rom:'chikaku',      en:'nearby',                     type:'adverb' },
    { jp:'ここ',     kana:'ここ',     rom:'koko',         en:'here',                       type:'pronoun' },
    { jp:'そこ',     kana:'そこ',     rom:'soko',         en:'there',                      type:'pronoun' },
    { jp:'あそこ',   kana:'あそこ',   rom:'asoko',        en:'over there',                 type:'pronoun' },
    { jp:'これ',     kana:'これ',     rom:'kore',         en:'this (thing)',               type:'pronoun' },
    { jp:'それ',     kana:'それ',     rom:'sore',         en:'that (thing)',               type:'pronoun' },
    { jp:'あれ',     kana:'あれ',     rom:'are',          en:'that (thing over there)',    type:'pronoun' },
    { jp:'私',       kana:'わたし',   rom:'watashi',      en:'I / me',                     type:'pronoun' },
    { jp:'あなた',   kana:'あなた',   rom:'anata',        en:'you',                        type:'pronoun' },
    // Common verbs
    { jp:'行く',     kana:'いく',     rom:'iku',          en:'to go',                      type:'verb' },
    { jp:'来る',     kana:'くる',     rom:'kuru',         en:'to come',                    type:'verb' },
    { jp:'見る',     kana:'みる',     rom:'miru',         en:'to see / to look',           type:'verb' },
    { jp:'見せる',   kana:'みせる',   rom:'miseru',       en:'to show',                    type:'verb' },
    { jp:'食べる',   kana:'たべる',   rom:'taberu',       en:'to eat',                     type:'verb' },
    { jp:'飲む',     kana:'のむ',     rom:'nomu',         en:'to drink',                   type:'verb' },
    { jp:'買う',     kana:'かう',     rom:'kau',          en:'to buy',                     type:'verb' },
    { jp:'乗る',     kana:'のる',     rom:'noru',         en:'to ride / board',            type:'verb' },
    { jp:'降りる',   kana:'おりる',   rom:'oriru',        en:'to get off',                 type:'verb' },
    { jp:'待つ',     kana:'まつ',     rom:'matsu',        en:'to wait',                    type:'verb' },
    { jp:'話す',     kana:'はなす',   rom:'hanasu',       en:'to speak',                   type:'verb' },
    { jp:'分かる',   kana:'わかる',   rom:'wakaru',       en:'to understand',              type:'verb' },
    { jp:'ある',     kana:'ある',     rom:'aru',          en:'to exist / there is (thing)',type:'verb' },
    { jp:'いる',     kana:'いる',     rom:'iru',          en:'to be / exist (person)',     type:'verb' },
    { jp:'する',     kana:'する',     rom:'suru',         en:'to do',                      type:'verb' },
    { jp:'なる',     kana:'なる',     rom:'naru',         en:'to become',                  type:'verb' },
    { jp:'言う',     kana:'いう',     rom:'iu',           en:'to say',                     type:'verb' },
    { jp:'使う',     kana:'つかう',   rom:'tsukau',       en:'to use',                     type:'verb' },
    { jp:'帰る',     kana:'かえる',   rom:'kaeru',        en:'to return / go home',        type:'verb' },
    { jp:'入る',     kana:'はいる',   rom:'hairu',        en:'to enter',                   type:'verb' },
    { jp:'出る',     kana:'でる',     rom:'deru',         en:'to exit / to leave',         type:'verb' },
    { jp:'かかる',   kana:'かかる',   rom:'kakaru',       en:'to take (time/cost)',        type:'verb' },
    { jp:'呼ぶ',     kana:'よぶ',     rom:'yobu',         en:'to call / invite',           type:'verb' },
    { jp:'教える',   kana:'おしえる', rom:'oshieru',      en:'to teach / tell',            type:'verb' },
    { jp:'止まる',   kana:'とまる',   rom:'tomaru',       en:'to stop',                    type:'verb' },
    { jp:'泊まる',   kana:'とまる',   rom:'tomaru',       en:'to stay (overnight)',        type:'verb' },
    { jp:'届く',     kana:'とどく',   rom:'todoku',       en:'to reach / arrive',          type:'verb' },
    // Numbers
    { jp:'一',  kana:'いち', rom:'ichi', en:'one',   type:'number' },
    { jp:'二',  kana:'に',   rom:'ni',   en:'two',   type:'number' },
    { jp:'三',  kana:'さん', rom:'san',  en:'three', type:'number' },
    { jp:'四',  kana:'よん', rom:'yon',  en:'four',  type:'number' },
    { jp:'五',  kana:'ご',   rom:'go',   en:'five',  type:'number' },
    { jp:'六',  kana:'ろく', rom:'roku', en:'six',   type:'number' },
    { jp:'七',  kana:'なな', rom:'nana', en:'seven', type:'number' },
    { jp:'八',  kana:'はち', rom:'hachi',en:'eight', type:'number' },
    { jp:'九',  kana:'きゅう',rom:'kyū', en:'nine',  type:'number' },
    { jp:'十',  kana:'じゅう',rom:'jū',  en:'ten',   type:'number' },
    { jp:'百',  kana:'ひゃく',rom:'hyaku',en:'100',  type:'number' },
    { jp:'千',  kana:'せん', rom:'sen',  en:'1,000', type:'number' },
    { jp:'万',  kana:'まん', rom:'man',  en:'10,000',type:'number' },
  ];

  /**
   * Build a unified lookup map (longest words first for greedy matching).
   * Merges VOCAB + PARTICLES into: jp → { kana, rom, en, type }
   */
  function buildLookupMap() {
    const map = new Map();

    // PARTICLES first (lower priority — overwritten by VOCAB if same key)
    for (const p of PARTICLES) {
      if (!map.has(p.jp)) map.set(p.jp, { kana: p.kana, rom: p.rom, en: p.en, type: p.type });
    }

    // VOCAB takes priority
    for (const w of VOCAB) {
      map.set(w.jp,   { kana: w.kana, rom: w.rom, en: w.en, type: 'word' });
      if (w.kana !== w.jp) {
        map.set(w.kana, { kana: w.kana, rom: w.rom, en: w.en, type: 'word' });
      }
    }

    return map;
  }

  let _lookupMap = null;
  function getLookupMap() {
    if (!_lookupMap) _lookupMap = buildLookupMap();
    return _lookupMap;
  }

  /**
   * Greedy longest-match tokenizer.
   * Returns array of { text, info: { kana, rom, en, type } | null }
   */
  function tokenizeJP(sentence) {
    // Strip punctuation for tokenisation but keep it for display
    const map   = getLookupMap();
    const keys  = [...map.keys()].sort((a, b) => b.length - a.length); // longest first
    const clean = sentence.replace(/[。、！？\s\u3000「」『』【】（）()]/g, '');
    const tokens = [];
    let i = 0;

    while (i < clean.length) {
      let matched = false;
      for (const key of keys) {
        if (clean.startsWith(key, i)) {
          tokens.push({ text: key, info: map.get(key) });
          i += key.length;
          matched = true;
          break;
        }
      }
      if (!matched) {
        // Single unrecognised character
        tokens.push({ text: clean[i], info: null });
        i++;
      }
    }

    return tokens;
  }

  // ── Breakdown UI ────────────────────────────────────────────
  function renderBreakdown(jpText) {
    const chips = document.getElementById('breakdown-chips');
    const detailCard = document.getElementById('word-detail-card');
    chips.innerHTML = '';
    detailCard.style.display = 'none';

    const tokens = tokenizeJP(jpText);

    for (const token of tokens) {
      const chip = document.createElement('button');
      const typeClass = !token.info      ? 'unknown'
                      : token.info.type === 'particle' || token.info.type === 'auxiliary' ? 'particle'
                      : '';
      chip.className = `bd-chip ${typeClass}`;
      chip.disabled  = !token.info;

      const shortEn = token.info
        ? (token.info.en.length > 12 ? token.info.en.slice(0, 11) + '…' : token.info.en)
        : '?';

      chip.innerHTML = `
        <span class="bd-chip-jp">${token.text}</span>
        <span class="bd-chip-en">${token.info ? shortEn : ''}</span>
      `;

      if (token.info) {
        chip.addEventListener('click', () => {
          // Deactivate siblings
          chips.querySelectorAll('.bd-chip').forEach(c => c.classList.remove('active'));
          chip.classList.add('active');
          showWordDetail(token.text, token.info);
        });
      }

      chips.appendChild(chip);
    }
  }

  function showWordDetail(jp, info) {
    const card = document.getElementById('word-detail-card');
    document.getElementById('wdc-japanese').textContent = jp;
    document.getElementById('wdc-kana').textContent     = info.kana !== jp ? info.kana : '';
    document.getElementById('wdc-romaji').textContent   = info.rom;
    document.getElementById('wdc-english').textContent  = info.en;
    document.getElementById('wdc-type').textContent     = info.type;
    card.style.display = 'flex';
  }

  function initBreakdown() {
    document.getElementById('breakdown-toggle').addEventListener('click', () => {
      const chips  = document.getElementById('breakdown-chips');
      const toggle = document.getElementById('breakdown-toggle');
      const open   = chips.style.display !== 'none';
      chips.style.display = open ? 'none' : 'flex';
      document.getElementById('word-detail-card').style.display = 'none';
      toggle.classList.toggle('open', !open);
      toggle.querySelector('.breakdown-toggle-icon').textContent = open ? '⊞' : '⊟';
    });

    document.getElementById('word-detail-close').addEventListener('click', () => {
      document.getElementById('word-detail-card').style.display = 'none';
      document.getElementById('breakdown-chips')
        .querySelectorAll('.bd-chip').forEach(c => c.classList.remove('active'));
    });
  }

  // ── Screen Router ──────────────────────────────────────────
  function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(id);
    if (target) target.classList.add('active');

    // Sync bottom nav active state
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.screen === id);
    });
  }

  // ── Toast ──────────────────────────────────────────────────
  function showToast(msg, duration = 2500) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), duration);
  }

  // Expose globally so voice.js can use it
  window.showToast = showToast;

  // ── Level Badge ────────────────────────────────────────────
  function updateLevelBadge() {
    const badge = document.getElementById('header-level-badge');
    if (badge) {
      const labels = { beginner: 'Beginner', basic: 'Basic', intermediate: 'Intermediate' };
      badge.textContent = labels[state.level] || state.level;
    }
  }

  // ── Romaji visibility ──────────────────────────────────────
  function shouldShowRomaji() {
    return state.level === 'beginner' || state.level === 'basic';
  }

  // ── Progress Helpers ───────────────────────────────────────
  function initModuleProgress(moduleId) {
    if (!state.progress[moduleId]) {
      state.progress[moduleId] = { seen: new Set() };
    }
  }

  function markPhraseSeen(moduleId, idx) {
    initModuleProgress(moduleId);
    state.progress[moduleId].seen.add(idx);
    saveState();
  }

  function getModulePct(moduleId, total) {
    const seen = (state.progress[moduleId] || { seen: new Set() }).seen;
    return total ? Math.round((seen.size / total) * 100) : 0;
  }

  function getOverallProgress() {
    let totalPhrases = 0, seenPhrases = 0;
    for (const lesson of LESSONS) {
      totalPhrases += lesson.phrases.length;
      seenPhrases  += (state.progress[lesson.id] || { seen: new Set() }).seen.size;
    }
    return { total: totalPhrases, seen: seenPhrases };
  }

  // ── Welcome Screen ─────────────────────────────────────────
  function initWelcome() {
    document.querySelectorAll('.level-card').forEach(card => {
      card.addEventListener('click', () => {
        state.level = card.dataset.level;
        saveState();
        initHome();
        showScreen('screen-home');
      });
    });
  }

  // ── Home Screen ────────────────────────────────────────────
  function initHome() {
    updateLevelBadge();

    // Stats
    const { total, seen } = getOverallProgress();
    const pct = total ? Math.round((seen / total) * 100) : 0;

    document.getElementById('stat-modules').textContent =
      LESSONS.filter(l => getModulePct(l.id, l.phrases.length) === 100).length;
    document.getElementById('stat-phrases').textContent = seen;
    document.getElementById('stat-words').textContent =
      parseInt(localStorage.getItem('tabiji_words_studied') || '0');

    document.getElementById('overall-pct').textContent = pct + '%';
    document.getElementById('overall-bar').style.width  = pct + '%';

    renderModuleGrid();
  }

  function renderModuleGrid() {
    const grid = document.getElementById('modules-grid');
    grid.innerHTML = '';

    for (const lesson of LESSONS) {
      const pct   = getModulePct(lesson.id, lesson.phrases.length);
      const done  = pct === 100;
      const card  = document.createElement('button');
      card.className = 'module-card' + (done ? ' completed' : '');
      card.innerHTML = `
        <span class="module-emoji">${lesson.emoji}</span>
        <span class="module-name">${lesson.name}</span>
        <span class="module-count">${lesson.phrases.length} phrases${pct > 0 ? ' · ' + pct + '%' : ''}</span>
        <div class="module-mini-bar"><div class="module-mini-fill" style="width:${pct}%"></div></div>
      `;
      card.style.setProperty('--mod-color', lesson.color);
      card.addEventListener('click', () => openLesson(lesson));
      grid.appendChild(card);
    }
  }

  // ── Lesson Screen ──────────────────────────────────────────
  function openLesson(lesson) {
    state.currentModule   = lesson;
    state.currentPhraseIdx = 0;
    initModuleProgress(lesson.id);

    document.getElementById('lesson-header-title').textContent = lesson.name;
    renderPhrase();
    renderPhraseDots();
    renderPhraseList();
    showScreen('screen-lesson');
  }

  function renderPhrase() {
    const lesson = state.currentModule;
    const idx    = state.currentPhraseIdx;
    const phrase = lesson.phrases[idx];
    const total  = lesson.phrases.length;

    // Mark as seen
    markPhraseSeen(lesson.id, idx);

    // Header progress text
    document.getElementById('lesson-progress-text').textContent = `${idx + 1} / ${total}`;

    // Progress bar
    const pct = Math.round(((idx + 1) / total) * 100);
    document.getElementById('lesson-progress-bar').style.width = pct + '%';

    // Phrase content
    document.getElementById('phrase-scenario').textContent  = lesson.name;
    document.getElementById('phrase-kanji').textContent     = phrase.jp;
    document.getElementById('phrase-romaji').textContent    = shouldShowRomaji() ? phrase.rom : '';
    document.getElementById('phrase-romaji').style.display  = shouldShowRomaji() ? '' : 'none';
    document.getElementById('phrase-english').textContent   = phrase.en;
    document.getElementById('tip-text').textContent         = phrase.tip;

    // Word breakdown — re-render chips for new phrase, collapse panel
    const chips = document.getElementById('breakdown-chips');
    const toggle = document.getElementById('breakdown-toggle');
    const isOpen = chips.style.display !== 'none';
    renderBreakdown(phrase.jp);
    if (!isOpen) {
      chips.style.display = 'none'; // keep collapsed unless already open
    }
    document.getElementById('word-detail-card').style.display = 'none';
    chips.querySelectorAll('.bd-chip').forEach(c => c.classList.remove('active'));

    // Dots
    renderPhraseDots();

    // Update phrase list item highlights
    document.querySelectorAll('.phrase-list-item').forEach((el, i) => {
      el.classList.toggle('seen', state.progress[lesson.id].seen.has(i));
    });

    // Navigation button states
    document.getElementById('btn-prev-phrase').disabled = idx === 0;
    document.getElementById('btn-next-phrase').textContent =
      idx === total - 1 ? 'Done ✓' : 'Next →';
  }

  function renderPhraseDots() {
    const lesson = state.currentModule;
    const total  = lesson.phrases.length;
    const dots   = document.getElementById('phrase-dots');
    dots.innerHTML = '';

    // Only show up to 12 dots to avoid overflow
    const maxDots = 12;
    const step    = Math.ceil(total / maxDots);

    for (let i = 0; i < total; i += step) {
      const dot = document.createElement('div');
      dot.className = 'phrase-dot';
      if (state.progress[lesson.id].seen.has(i)) dot.classList.add('done');
      if (i === state.currentPhraseIdx) dot.classList.add('active');
      dots.appendChild(dot);
    }
  }

  function renderPhraseList() {
    const lesson  = state.currentModule;
    const panel   = document.getElementById('phrase-list-panel');
    panel.innerHTML = '';

    lesson.phrases.forEach((phrase, i) => {
      const item = document.createElement('div');
      item.className = 'phrase-list-item';
      item.dataset.idx = i;
      item.innerHTML = `
        <div>
          <div class="pli-jp">${phrase.jp}</div>
          <div class="pli-en">${phrase.en}</div>
        </div>
        <span class="pli-check">✓</span>
      `;
      if (state.progress[lesson.id].seen.has(i)) item.classList.add('seen');
      item.addEventListener('click', () => {
        state.currentPhraseIdx = i;
        renderPhrase();
        document.getElementById('phrase-list-panel').style.display = 'none';
        document.getElementById('btn-show-all-phrases').textContent = 'Show all phrases in this lesson ↓';
      });
      panel.appendChild(item);
    });
  }

  function initLessonNavigation() {
    document.getElementById('btn-prev-phrase').addEventListener('click', () => {
      if (state.currentPhraseIdx > 0) {
        state.currentPhraseIdx--;
        renderPhrase();
      }
    });

    document.getElementById('btn-next-phrase').addEventListener('click', () => {
      const lesson = state.currentModule;
      if (state.currentPhraseIdx < lesson.phrases.length - 1) {
        state.currentPhraseIdx++;
        renderPhrase();
      } else {
        // Module complete
        const pct = getModulePct(lesson.id, lesson.phrases.length);
        showToast(`${lesson.emoji} Module complete! ${pct}% phrases seen.`);
        initHome();
        showScreen('screen-home');
      }
    });

    document.getElementById('btn-lesson-back').addEventListener('click', () => {
      initHome();
      showScreen('screen-home');
    });

    // Play audio for current phrase
    document.getElementById('btn-play-phrase').addEventListener('click', () => {
      const phrase = state.currentModule.phrases[state.currentPhraseIdx];
      VoicePractice.speak(phrase.jp);
    });

    // Quick-launch voice practice from lesson
    document.getElementById('btn-voice-practice-phrase').addEventListener('click', () => {
      const phrase = state.currentModule.phrases[state.currentPhraseIdx];
      openVoicePracticeWith(phrase);
      showScreen('screen-voice');
    });

    // Toggle phrase list
    document.getElementById('btn-show-all-phrases').addEventListener('click', (e) => {
      const panel = document.getElementById('phrase-list-panel');
      const visible = panel.style.display !== 'none';
      panel.style.display = visible ? 'none' : 'block';
      e.target.textContent = visible
        ? 'Show all phrases in this lesson ↓'
        : 'Hide phrase list ↑';
    });
  }

  // ── Vocabulary Screen ──────────────────────────────────────
  function initVocab() {
    buildCategoryTabs();
    renderVocabList();

    document.getElementById('vocab-search').addEventListener('input', (e) => {
      state.vocabSearch = e.target.value.toLowerCase();
      renderVocabList();
    });

    document.getElementById('btn-vocab-back').addEventListener('click', () => {
      showScreen('screen-home');
    });

    document.getElementById('btn-open-vocab').addEventListener('click', () => {
      showScreen('screen-vocab');
      renderVocabList();
    });
  }

  function buildCategoryTabs() {
    const tabs = document.getElementById('category-tabs');
    tabs.innerHTML = '';
    const cats = ['All', ...new Set(VOCAB.map(w => w.cat))];

    for (const cat of cats) {
      const btn = document.createElement('button');
      btn.className  = 'cat-tab' + (cat === state.vocabCategory ? ' active' : '');
      btn.textContent = cat;
      btn.addEventListener('click', () => {
        state.vocabCategory = cat;
        document.querySelectorAll('.cat-tab').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderVocabList();
      });
      tabs.appendChild(btn);
    }
  }

  function renderVocabList() {
    const list = document.getElementById('vocab-list');
    list.innerHTML = '';

    const filtered = VOCAB.filter(w => {
      const catOk = state.vocabCategory === 'All' || w.cat === state.vocabCategory;
      const q     = state.vocabSearch;
      const searchOk = !q || [w.jp, w.kana, w.rom, w.en].some(s => s.toLowerCase().includes(q));
      return catOk && searchOk;
    });

    document.getElementById('vocab-count-badge').textContent = filtered.length + ' words';

    if (filtered.length === 0) {
      list.innerHTML = '<div style="padding:40px;text-align:center;color:var(--text3);">No words found.<br>Try a different search.</div>';
      return;
    }

    // Render in chunks for performance
    const CHUNK = 50;
    let offset  = 0;

    function renderChunk() {
      const slice = filtered.slice(offset, offset + CHUNK);
      for (const word of slice) {
        const item = document.createElement('div');
        item.className = 'vocab-item';
        item.innerHTML = `
          <div>
            <div class="vi-japanese">${word.jp}${word.kana !== word.jp ? ' <small style="color:var(--text3);font-size:14px">' + word.kana + '</small>' : ''}</div>
            <div class="vi-romaji">${word.rom}</div>
            <div class="vi-english">${word.en}</div>
          </div>
          <button class="vi-play" title="Play pronunciation" data-jp="${escapeAttr(word.jp)}">▶</button>
        `;
        item.querySelector('.vi-play').addEventListener('click', (e) => {
          e.stopPropagation();
          VoicePractice.speak(word.jp);
          trackWordStudied();
        });
        item.addEventListener('click', () => openWordModal(word));
        list.appendChild(item);
      }
      offset += CHUNK;
    }

    renderChunk();

    // Lazy load on scroll
    list.parentElement.addEventListener('scroll', function lazyLoad() {
      const el = list.parentElement;
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 100 && offset < filtered.length) {
        renderChunk();
      }
    });
  }

  function trackWordStudied() {
    const n = parseInt(localStorage.getItem('tabiji_words_studied') || '0') + 1;
    localStorage.setItem('tabiji_words_studied', n);
  }

  function escapeAttr(str) {
    return str.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  // ── Word Modal ─────────────────────────────────────────────
  function openWordModal(word) {
    document.getElementById('modal-japanese').textContent  = word.jp;
    document.getElementById('modal-romaji').textContent    = shouldShowRomaji() ? word.rom : '';
    document.getElementById('modal-english').textContent   = word.en;
    document.getElementById('modal-category').textContent  = word.cat;
    document.getElementById('modal-example-jp').textContent  = word.ex_jp  || '';
    document.getElementById('modal-example-rom').textContent = shouldShowRomaji() ? (word.ex_rom || '') : '';
    document.getElementById('modal-example-en').textContent  = word.ex_en  || '';

    const overlay = document.getElementById('modal-overlay');
    overlay.style.display = 'flex';

    document.getElementById('modal-play-audio').onclick = () => {
      VoicePractice.speak(word.jp);
      trackWordStudied();
    };
  }

  function initModal() {
    document.getElementById('modal-close').addEventListener('click', closeModal);
    document.getElementById('modal-overlay').addEventListener('click', (e) => {
      if (e.target === e.currentTarget) closeModal();
    });
  }

  function closeModal() {
    document.getElementById('modal-overlay').style.display = 'none';
  }

  // ── Voice Practice Screen ───────────────────────────────────
  function initVoiceScreen() {
    buildVoicePhraseSelect();
    loadVoicePhrase();

    document.getElementById('btn-voice-back').addEventListener('click', () => {
      VoicePractice.stopRecording();
      showScreen('screen-home');
    });

    document.getElementById('voice-phrase-select').addEventListener('change', loadVoicePhrase);

    document.getElementById('btn-vc-play').addEventListener('click', () => {
      const phrase = currentVoicePhrase();
      if (phrase) VoicePractice.speak(phrase.jp);
    });

    document.getElementById('btn-vc-record').addEventListener('click', handleRecord);
    document.getElementById('btn-try-again').addEventListener('click', () => {
      document.getElementById('feedback-panel').style.display = 'none';
      document.getElementById('btn-vc-record').textContent = '🎤 Hold to Record';
      document.getElementById('btn-vc-record').classList.remove('recording');
    });
  }

  function buildVoicePhraseSelect() {
    const select = document.getElementById('voice-phrase-select');
    select.innerHTML = '';

    for (const lesson of LESSONS) {
      const group = document.createElement('optgroup');
      group.label = lesson.emoji + ' ' + lesson.name;
      lesson.phrases.forEach((phrase, i) => {
        const opt = document.createElement('option');
        opt.value = `${lesson.id}::${i}`;
        opt.textContent = phrase.jp + '  —  ' + phrase.en;
        group.appendChild(opt);
      });
      select.appendChild(group);
    }
  }

  function currentVoicePhrase() {
    const val   = document.getElementById('voice-phrase-select').value;
    if (!val) return null;
    const [lid, idx] = val.split('::');
    const lesson = LESSONS.find(l => l.id === lid);
    return lesson ? lesson.phrases[parseInt(idx)] : null;
  }

  function loadVoicePhrase() {
    const phrase = currentVoicePhrase();
    if (!phrase) return;
    document.getElementById('vc-japanese').textContent = phrase.jp;
    document.getElementById('vc-romaji').textContent   = shouldShowRomaji() ? phrase.rom : '';
    document.getElementById('vc-romaji').style.display = shouldShowRomaji() ? '' : 'none';
    document.getElementById('vc-english').textContent  = phrase.en;
    document.getElementById('feedback-panel').style.display = 'none';
    document.getElementById('vc-recording-indicator').style.display = 'none';
    document.getElementById('btn-vc-record').textContent = '🎤 Hold to Record';
    document.getElementById('btn-vc-record').classList.remove('recording');
  }

  function openVoicePracticeWith(phrase) {
    // Find the option matching this phrase and set it
    const select = document.getElementById('voice-phrase-select');
    for (const opt of select.options) {
      const [lid, idx] = opt.value.split('::');
      const lesson = LESSONS.find(l => l.id === lid);
      if (lesson && lesson.phrases[parseInt(idx)] === phrase) {
        select.value = opt.value;
        break;
      }
    }
    loadVoicePhrase();
  }

  function handleRecord() {
    const btn = document.getElementById('btn-vc-record');
    const indicator = document.getElementById('vc-recording-indicator');

    if (VoicePractice.getIsRecording()) {
      VoicePractice.stopRecording();
      btn.textContent = '🎤 Hold to Record';
      btn.classList.remove('recording');
      indicator.style.display = 'none';
      return;
    }

    const phrase = currentVoicePhrase();
    if (!phrase) {
      showToast('Please select a phrase first.');
      return;
    }

    btn.textContent = '⏹ Stop Recording';
    btn.classList.add('recording');
    indicator.style.display = 'flex';
    document.getElementById('feedback-panel').style.display = 'none';

    VoicePractice.startRecording(
      phrase.jp,
      phrase.rom,
      (feedback) => {
        btn.textContent = '🎤 Hold to Record';
        btn.classList.remove('recording');
        indicator.style.display = 'none';
        renderFeedback(feedback);
      },
      (errMsg) => {
        btn.textContent = '🎤 Hold to Record';
        btn.classList.remove('recording');
        indicator.style.display = 'none';
        showToast(errMsg, 4000);
      }
    );
  }

  function renderFeedback(feedback) {
    const panel = document.getElementById('feedback-panel');
    panel.style.display = 'flex';

    // Score circle
    const score  = feedback.score;
    const arc    = document.getElementById('score-arc');
    const circumference = 2 * Math.PI * 44; // r=44
    const dashLen = (score / 100) * circumference;
    arc.style.strokeDasharray  = `${dashLen} ${circumference}`;
    arc.style.stroke = score >= 75 ? 'var(--green)' : score >= 50 ? 'var(--yellow)' : 'var(--accent)';
    document.getElementById('score-value').textContent = score;

    // Transcript
    document.getElementById('transcript-box').textContent = feedback.transcript || '—';

    // Chips
    const highlights = document.getElementById('feedback-highlights');
    highlights.innerHTML = '';
    for (const chip of (feedback.chips || [])) {
      const span = document.createElement('span');
      span.className = 'syllable-chip ' + (chip.status === 'correct' ? 'correct' : chip.status === 'missing' ? 'neutral' : 'incorrect');
      span.textContent = chip.char;
      highlights.appendChild(span);
    }

    // Tip
    document.getElementById('feedback-tips').textContent = feedback.tip;

    // Scroll into view
    panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // ── Navigation wiring ──────────────────────────────────────
  function initNavigation() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.screen;
        if (target === 'screen-vocab') renderVocabList();
        if (target === 'screen-home') initHome();
        showScreen(target);
      });
    });

    document.getElementById('btn-change-level').addEventListener('click', () => {
      showScreen('screen-welcome');
    });
  }

  // ── Voices preload (Chrome requires user interaction) ──────
  function preloadVoices() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
    }
  }

  // ── Boot ───────────────────────────────────────────────────
  function boot() {
    loadState();
    preloadVoices();

    initWelcome();
    initBreakdown();
    initLessonNavigation();
    initVocab();
    initModal();
    initVoiceScreen();
    initNavigation();

    // If we have a saved level, skip welcome
    if (state.level) {
      initHome();
      showScreen('screen-home');
    } else {
      showScreen('screen-welcome');
    }
  }

  document.addEventListener('DOMContentLoaded', boot);

})();
