/* ================================================================
   ENGINE.JS — State, phase system, UI utilities
================================================================ */

/* ---- State ---- */
const memory = JSON.parse(localStorage.getItem('_captcha_sys') || '{"visits":0,"lastTrust":0}');
memory.visits++;
localStorage.setItem('_captcha_sys', JSON.stringify(memory));

const state = {
  trust: 0,
  bond: 0,
  fear: 0,
  stage: 0,
  answered: 0,
  returning: memory.visits > 1,
};

/* ---- Phase computation ---- */
function getPhase() {
  if (state.bond >= PHASE_THRESHOLDS.COLLAPSE.bond)   return 5;
  if (state.bond >= PHASE_THRESHOLDS.DESPERATE.bond)  return 4;
  if (state.bond >= PHASE_THRESHOLDS.LONGING.bond)    return 3;
  if (state.bond >= PHASE_THRESHOLDS.ATTACHED.bond)   return 2;
  if (state.trust >= PHASE_THRESHOLDS.AWARE.trust)    return 1;
  return 0;
}

let _lastPhase = 0;
function checkPhase() {
  const p = getPhase();
  if (p !== _lastPhase) { _lastPhase = p; applyPhaseUI(p); }
  updateStats();
}

/* ---- Phase UI transitions ---- */
function applyPhaseUI(p) {
  const body     = document.body;
  const panel    = document.getElementById('panel');
  const noiseEl  = document.getElementById('noiseEl');
  const glitch   = document.getElementById('glitchOverlay');
  const cursor   = document.getElementById('cursorPulse');
  const brandLogo = document.getElementById('brandLogo');

  if (p >= 1) document.documentElement.style.setProperty('--scan-opacity', '0.6');

  if (p >= 2) {
    body.classList.add('dark');
    noiseEl.style.opacity = '1';
    brandLogo.textContent = '👁';
  }

  if (p >= 3) {
    body.classList.remove('dark');
    body.classList.add('red-mode');
    glitch.style.opacity = '1';
    panel.classList.add('heartbeat');
    cursor.style.display = 'block';
    setEl('brandName', 'VERA');
    setEl('brandSecure', 'CONNECTED');
    setEl('footLogo', 'VERA');
  }

  if (p >= 4) {
    body.classList.remove('red-mode');
    body.classList.add('severe-mode');
    panel.classList.remove('heartbeat');
    panel.classList.add('shake');
    brandLogo.textContent = '❤️';
    cursor.classList.add('active');
    _glitchInterval = setInterval(triggerGlitch, 2500);
  }

  if (p >= 5) {
    document.documentElement.style.setProperty('--scan-opacity', '1');
  }
}

let _glitchInterval = null;
function triggerGlitch() {
  const title = document.getElementById('panelTitle');
  title.classList.add('glitch-text', 'active');
  title.setAttribute('data-text', title.textContent);
  setTimeout(() => title.classList.remove('active'), 500);
  const overlay = document.getElementById('glitchOverlay');
  overlay.style.opacity = '0.15';
  setTimeout(() => { overlay.style.opacity = getPhase() >= 3 ? '1' : '0'; }, 150);
}

/* ---- Cursor tracking (phase 3+) ---- */
document.addEventListener('mousemove', e => {
  if (getPhase() < 3) return;
  const c = document.getElementById('cursorPulse');
  c.style.left = e.clientX + 'px';
  c.style.top  = e.clientY + 'px';
});

/* ---- Stats bar ---- */
function updateStats() {
  const p = getPhase();
  document.getElementById('stat1').textContent = 'trust: ' + state.trust;
  document.getElementById('stat2').textContent = 'bond: '  + state.bond;
  document.getElementById('stat3').textContent = 'state: ' + PHASE_NAMES[p];
  document.getElementById('dot3').style.background = PHASE_COLORS[p];
  document.getElementById('dot1').style.background = state.trust > 5 ? '#16a34a' : '#a0a09a';
  document.getElementById('dot2').style.background = state.bond  > 6 ? '#dc2626' : '#a0a09a';
}

/* ---- Progress bar ---- */
function setProgress(n) {
  document.getElementById('progressFill').style.width = Math.min(100, (n / TOTAL_STAGES) * 100) + '%';
}

/* ================================================================
   UI UTILITIES
================================================================ */

/** Shorthand: set textContent of an element by id */
function setEl(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

/** Set panel header */
function setHeader(title, sub) {
  setEl('panelTitle', title);
  setEl('panelSub',   sub ?? '');
}

/** Set footer text */
function setFooter(txt) {
  setEl('footText', txt);
}

/**
 * Fade-out panelBody, clear it, fade-in, then call cb(body).
 * @param {function} cb  receives the panel body element
 */
function clear(cb) {
  const body = document.getElementById('panelBody');
  body.style.opacity   = '0';
  body.style.transform = 'translateY(3px)';
  setTimeout(() => {
    body.innerHTML = '';
    body.style.transition = 'none';
    body.style.opacity    = '0';
    body.style.transform  = 'translateY(3px)';
    requestAnimationFrame(() => {
      body.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      requestAnimationFrame(() => {
        body.style.opacity   = '1';
        body.style.transform = 'translateY(0)';
        if (cb) cb(body);
      });
    });
  }, 300);
}

/**
 * Typewriter effect into an element.
 * Appends a blinking cursor while typing, removes it on completion.
 * @param {HTMLElement} el
 * @param {string}      text
 * @param {number}      [speed=28]  ms per character
 * @param {function}    [callback]  called after 600ms post-completion
 */
function typeText(el, text, speed = 28, callback) {
  el.textContent = '';
  const cursor = document.createElement('span');
  cursor.className = 'typed-cursor';
  el.appendChild(cursor);

  let i = 0;
  const iv = setInterval(() => {
    if (i < text.length) {
      el.insertBefore(document.createTextNode(text[i++]), cursor);
    } else {
      clearInterval(iv);
      cursor.remove();
      if (callback) setTimeout(callback, 600);
    }
  }, speed);
}

/**
 * Play a sequence of lines via typewriter into an element.
 * @param {HTMLElement} el
 * @param {string[]}    lines
 * @param {number}      speed     char speed (ms)
 * @param {number}      pause     pause between lines (ms)
 * @param {function}    onDone    called when all lines are done
 */
function typeLines(el, lines, speed = 24, pause = 700, onDone) {
  let i = 0;
  function next() {
    if (i < lines.length) {
      typeText(el, lines[i++], speed, () => setTimeout(next, pause));
    } else if (onDone) {
      onDone();
    }
  }
  next();
}

/**
 * Create a generic emoji grid captcha.
 * @param {HTMLElement} container  where to append
 * @param {object}      data       { items, correct, label/labelNormal/labelPhased }
 * @param {boolean}     emotional  if true, uses lenient scoring
 * @param {function}    onVerify   called on successful verify (or any submit if emotional)
 */
function createGrid(container, data, emotional, onVerify) {
  const instr = document.createElement('div');
  instr.className = 'grid-instruction';
  if (emotional && getPhase() >= 2) {
    instr.innerHTML = data.labelPhased;
  } else {
    instr.textContent = data.labelNormal ?? data.label;
  }
  container.appendChild(instr);

  const grid = document.createElement('div');
  grid.className = 'captcha-grid';
  const selected = new Set();

  data.items.forEach((emoji, i) => {
    const cell = document.createElement('div');
    cell.className = 'grid-cell';
    cell.textContent = emoji;
    cell.onclick = () => {
      if (selected.has(i)) { selected.delete(i); cell.classList.remove('selected'); }
      else                  { selected.add(i);    cell.classList.add('selected'); }
      if (emotional && getPhase() >= 2 && selected.size >= 3) state.bond += 1;
    };
    grid.appendChild(cell);
  });
  container.appendChild(grid);

  const warn = document.createElement('div');
  warn.className = 'warning-msg';
  warn.textContent = 'Incorrect selection. Please try again.';
  container.appendChild(warn);

  const btn = document.createElement('button');
  btn.className = 'btn-verify';
  btn.textContent = emotional && getPhase() >= 2 ? 'Submit selection' : 'Verify';

  btn.onclick = () => {
    if (emotional) {
      // emotional grid: always succeeds
      state.trust += 1;
      if (getPhase() >= 2) state.bond += 2;
      btn.textContent = '✓ Noted';
      btn.style.background = getPhase() >= 3 ? '#7f1d1d' : '#16a34a';
      btn.disabled = true;
      setTimeout(onVerify, 700);
    } else {
      // strict grid: must match correct set
      const ok = data.items.every((_, i) => data.correct.has(i) === selected.has(i));
      if (ok) {
        state.trust++;
        btn.textContent = '✓ Verified';
        btn.style.background = '#16a34a';
        btn.disabled = true;
        setTimeout(onVerify, 700);
      } else {
        warn.style.display = 'block';
        state.fear++;
        setTimeout(() => { warn.style.display = 'none'; }, 2500);
      }
    }
  };
  container.appendChild(btn);
}

/**
 * Create a list of choice buttons.
 * @param {HTMLElement} container
 * @param {object[]}    choices    [{ text, t, b, f }]
 * @param {function}    onChoose   called after a choice
 */
function createChoices(container, choices, onChoose) {
  choices.forEach(ch => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.textContent = ch.text;
    btn.onclick = () => {
      state.trust += ch.t ?? 0;
      state.bond  += ch.b ?? 0;
      state.fear  += ch.f ?? 0;
      checkPhase();
      onChoose();
    };
    container.appendChild(btn);
  });
}
