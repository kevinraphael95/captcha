/* ================================================================
   ENGINE.JS — State, phase system, UI utilities, cursor detection
================================================================ */

/* ---- Mémoire persistante ---- */
const memory = JSON.parse(localStorage.getItem('_captcha_sys') || '{}');
memory.visits      = (memory.visits || 0) + 1;
memory.totalTime   = memory.totalTime || 0;
memory.inputsGiven = memory.inputsGiven || [];
memory.lastEnding  = memory.lastEnding || null;
memory.firstSeen   = memory.firstSeen || Date.now();
localStorage.setItem('_captcha_sys', JSON.stringify(memory));

const _sessionStart = Date.now();

/* ---- État de session ---- */
const state = {
  trust:     0,
  bond:      0,
  fear:      0,
  stage:     0,
  answered:  0,
  returning: memory.visits > 1,
  /* types de captcha choisis aléatoirement pour cette session */
  captchaTypes: pickRandomCaptchaTypes(3),
};

/* ---- Sauvegarde en fin de session ---- */
function saveSession(endingKey) {
  memory.totalTime  += Math.round((Date.now() - _sessionStart) / 1000);
  memory.lastEnding  = endingKey;
  localStorage.setItem('_captcha_sys', JSON.stringify(memory));
}

/* ================================================================
   PHASES
================================================================ */
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

function applyPhaseUI(p) {
  const body      = document.body;
  const panel     = document.getElementById('panel');
  const noiseEl   = document.getElementById('noiseEl');
  const glitch    = document.getElementById('glitchOverlay');
  const cursor    = document.getElementById('cursorPulse');
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
    setEl('brandName',   L.veraName);
    setEl('brandSecure', L.brandConnected);
    setEl('footLogo',    L.veraName);
  }

  if (p >= 4) {
    body.classList.remove('red-mode');
    body.classList.add('severe-mode');
    panel.classList.remove('heartbeat');
    panel.classList.add('shake');
    brandLogo.textContent = '❤️';
    cursor.classList.add('active');
    if (!_glitchInterval) _glitchInterval = setInterval(triggerGlitch, 2500);
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

/* ================================================================
   CURSOR DETECTION — bord écran + zone fermeture onglet
================================================================ */
let _cursorWarningShown = false;
let _cursorWarningEl    = null;

document.addEventListener('mousemove', e => {
  /* Trailing cursor (phase 3+) */
  if (getPhase() >= 3) {
    const c = document.getElementById('cursorPulse');
    c.style.left = e.clientX + 'px';
    c.style.top  = e.clientY + 'px';
  }

  /* Détection déplacement vers le haut (zone fermeture onglet) */
  const nearTop    = e.clientY < 60;
  const nearRight  = e.clientX > window.innerWidth - 80;
  const nearExit   = nearTop || nearRight;

  if (nearExit && !_cursorWarningShown && getPhase() >= 1) {
    _showCursorWarning();
  }
  if (!nearExit && _cursorWarningShown) {
    _hideCursorWarning();
  }
});

function _showCursorWarning() {
  if (_cursorWarningShown) return;
  _cursorWarningShown = true;

  const pool = L.dialogs.cursor_warning;
  const msg  = pool[Math.floor(Math.random() * pool.length)];

  const el = document.createElement('div');
  el.id = 'cursorWarn';
  el.textContent = msg;
  el.style.cssText = `
    position:fixed; bottom:24px; left:50%; transform:translateX(-50%);
    background:var(--panel); border:1px solid var(--border);
    padding:10px 18px; border-radius:8px; font-size:12px;
    font-family:var(--mono); color:var(--text2);
    z-index:500; opacity:0; transition:opacity 0.3s;
    box-shadow:0 4px 20px rgba(0,0,0,0.15);
    pointer-events:none;
  `;
  document.body.appendChild(el);
  _cursorWarningEl = el;
  requestAnimationFrame(() => { el.style.opacity = '1'; });

  /* bonus bond si phase avancée */
  if (getPhase() >= 3) state.bond += 1;
}

function _hideCursorWarning() {
  _cursorWarningShown = false;
  if (_cursorWarningEl) {
    _cursorWarningEl.style.opacity = '0';
    setTimeout(() => { _cursorWarningEl?.remove(); _cursorWarningEl = null; }, 400);
  }
}

/* ================================================================
   STATS BAR
================================================================ */
function updateStats() {
  const p = getPhase();
  document.getElementById('stat1').textContent = 'trust: ' + state.trust;
  document.getElementById('stat2').textContent = 'bond: '  + state.bond;
  document.getElementById('stat3').textContent = 'état: '  + L.phaseNames[p];
  document.getElementById('dot3').style.background = PHASE_COLORS[p];
  document.getElementById('dot1').style.background = state.trust > 5 ? '#16a34a' : '#a0a09a';
  document.getElementById('dot2').style.background = state.bond  > 6 ? '#dc2626' : '#a0a09a';
}

/* ---- Barre de progression ---- */
function setProgress(n) {
  document.getElementById('progressFill').style.width =
    Math.min(100, (n / TOTAL_STAGES) * 100) + '%';
}

/* ================================================================
   UI UTILITIES
================================================================ */
function setEl(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function setHeader(title, sub) {
  setEl('panelTitle', title);
  setEl('panelSub', sub ?? '');
}

function setFooter(txt) {
  setEl('footText', txt);
}

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

/* ================================================================
   TYPEWRITER
================================================================ */
function typeText(el, text, speed = 28, callback) {
  el.textContent = '';
  const cur = document.createElement('span');
  cur.className = 'typed-cursor';
  el.appendChild(cur);
  let i = 0;
  const iv = setInterval(() => {
    if (i < text.length) {
      el.insertBefore(document.createTextNode(text[i++]), cur);
    } else {
      clearInterval(iv);
      cur.remove();
      if (callback) setTimeout(callback, 600);
    }
  }, speed);
  return iv;
}

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

/* ================================================================
   CAPTCHA GRID — générique, aléatoire
================================================================ */
function createGrid(container, poolKey, emotional, onVerify) {
  const data  = pickGrid(poolKey);
  const label = emotional
    ? (getPhase() >= 2 ? L.gridLabels.emo_phase : L.gridLabels.emo_normal)
    : L.gridLabels[poolKey];

  const instr = document.createElement('div');
  instr.className = 'grid-instruction';
  if (emotional && getPhase() >= 2) instr.innerHTML = label;
  else instr.textContent = label;
  container.appendChild(instr);

  const grid     = document.createElement('div');
  grid.className = 'captcha-grid';
  const selected = new Set();

  /* Mélange aléatoire des items */
  const indices = [...Array(data.items.length).keys()].sort(() => Math.random() - 0.5);
  const shuffledItems   = indices.map(i => data.items[i]);
  const shuffledCorrect = new Set(indices.map((orig, pos) => data.correct.has(orig) ? pos : -1).filter(x => x >= 0));

  shuffledItems.forEach((emoji, i) => {
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
  warn.textContent = L.incorrect;
  container.appendChild(warn);

  const btn = document.createElement('button');
  btn.className = 'btn-verify';
  btn.textContent = (emotional && getPhase() >= 2) ? L.submit : L.verify;

  btn.onclick = () => {
    if (emotional) {
      state.trust += 1;
      if (getPhase() >= 2) state.bond += 2;
      btn.textContent = L.noted;
      btn.style.background = getPhase() >= 3 ? '#7f1d1d' : '#16a34a';
      btn.disabled = true;
      setTimeout(onVerify, 700);
    } else {
      const ok = shuffledItems.every((_, i) => shuffledCorrect.has(i) === selected.has(i));
      if (ok) {
        state.trust++;
        btn.textContent = L.verified;
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

/* ================================================================
   CAPTCHA TEXTE DÉFORMÉ (Canvas)
================================================================ */
function createTextCaptcha(container, onVerify) {
  /* Génère un code aléatoire */
  const chars  = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];

  const canvas  = document.createElement('canvas');
  canvas.width  = 220;
  canvas.height = 60;
  canvas.style.cssText = 'border:1px solid var(--border);border-radius:6px;display:block;margin-bottom:10px;background:#f5f5f0;';
  const ctx = canvas.getContext('2d');

  /* Background grain */
  for (let i = 0; i < 400; i++) {
    ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.08})`;
    ctx.fillRect(Math.random()*220, Math.random()*60, 1, 1);
  }

  /* Lignes de bruit */
  for (let i = 0; i < 5; i++) {
    ctx.strokeStyle = `rgba(0,0,0,${Math.random() * 0.15 + 0.05})`;
    ctx.lineWidth = Math.random() * 1.5 + 0.5;
    ctx.beginPath();
    ctx.moveTo(Math.random()*220, Math.random()*60);
    ctx.bezierCurveTo(
      Math.random()*220, Math.random()*60,
      Math.random()*220, Math.random()*60,
      Math.random()*220, Math.random()*60
    );
    ctx.stroke();
  }

  /* Lettres déformées */
  code.split('').forEach((ch, i) => {
    ctx.save();
    const x = 20 + i * 33;
    const y = 38 + (Math.random() * 10 - 5);
    ctx.translate(x, y);
    ctx.rotate((Math.random() - 0.5) * 0.4);
    ctx.font = `bold ${24 + Math.random()*8}px monospace`;
    ctx.fillStyle = `hsl(${Math.random()*360},60%,25%)`;
    ctx.fillText(ch, 0, 0);
    ctx.restore();
  });

  container.appendChild(canvas);

  /* Bouton refresh */
  const refresh = document.createElement('button');
  refresh.style.cssText = 'background:none;border:none;cursor:pointer;font-size:16px;margin-bottom:8px;color:var(--text2);';
  refresh.textContent = '🔄';
  refresh.title = 'Nouveau code';
  refresh.onclick = () => {
    container.innerHTML = '';
    createTextCaptcha(container, onVerify);
  };
  container.appendChild(refresh);

  const inp = document.createElement('input');
  inp.type = 'text';
  inp.className = 'text-input';
  inp.placeholder = 'Entrez le texte ci-dessus...';
  inp.maxLength = 6;
  inp.autocomplete = 'off';
  inp.style.textTransform = 'uppercase';
  container.appendChild(inp);

  const warn = document.createElement('div');
  warn.className = 'warning-msg';
  warn.textContent = L.incorrect;
  container.appendChild(warn);

  const btn = document.createElement('button');
  btn.className = 'btn-verify';
  btn.textContent = L.verify;
  btn.onclick = () => {
    if (inp.value.toUpperCase().replace(/\s/g,'') === code) {
      state.trust++;
      btn.textContent = L.verified;
      btn.style.background = '#16a34a';
      btn.disabled = true;
      setTimeout(onVerify, 700);
    } else {
      warn.style.display = 'block';
      state.fear++;
      setTimeout(() => { warn.style.display = 'none'; }, 2500);
      inp.value = '';
      /* Régénère le code */
      container.innerHTML = '';
      createTextCaptcha(container, onVerify);
    }
  };
  container.appendChild(btn);
}

/* ================================================================
   CAPTCHA SLIDER
================================================================ */
function createSliderCaptcha(container, onVerify) {
  const target   = Math.floor(Math.random() * 60) + 20; /* 20–80% */
  const tolerance = 8;

  const wrap = document.createElement('div');
  wrap.style.cssText = 'margin-bottom:10px;';

  const label = document.createElement('div');
  label.className = 'grid-instruction';
  label.textContent = `Déplacez le curseur vers ${target}%`;
  wrap.appendChild(label);

  const track = document.createElement('div');
  track.style.cssText = `
    position:relative;height:36px;background:var(--border);
    border-radius:18px;overflow:hidden;cursor:pointer;
    border:1px solid var(--border);
  `;

  const fill = document.createElement('div');
  fill.style.cssText = 'position:absolute;left:0;top:0;bottom:0;width:0%;background:#2563eb;transition:width 0.05s;border-radius:18px;';

  const handle = document.createElement('div');
  handle.style.cssText = `
    position:absolute;top:50%;left:0%;transform:translate(-50%,-50%);
    width:32px;height:32px;background:white;border-radius:50%;
    border:2px solid #2563eb;display:flex;align-items:center;justify-content:center;
    font-size:14px;box-shadow:0 2px 8px rgba(0,0,0,0.15);cursor:grab;user-select:none;
  `;
  handle.textContent = '→';

  track.appendChild(fill);
  track.appendChild(handle);
  wrap.appendChild(track);
  container.appendChild(wrap);

  const indicator = document.createElement('div');
  indicator.style.cssText = 'font-size:11px;font-family:var(--mono);color:var(--text3);margin-top:4px;';
  indicator.textContent = '0%';
  container.appendChild(indicator);

  let dragging = false;
  let currentVal = 0;

  function updateHandle(pct) {
    currentVal = Math.max(0, Math.min(100, pct));
    handle.style.left = currentVal + '%';
    fill.style.width  = currentVal + '%';
    indicator.textContent = Math.round(currentVal) + '%';
  }

  handle.addEventListener('mousedown', e => { dragging = true; e.preventDefault(); });
  document.addEventListener('mousemove', e => {
    if (!dragging) return;
    const rect = track.getBoundingClientRect();
    const pct  = ((e.clientX - rect.left) / rect.width) * 100;
    updateHandle(pct);
  });
  document.addEventListener('mouseup', () => {
    if (!dragging) return;
    dragging = false;
    const diff = Math.abs(currentVal - target);
    if (diff <= tolerance) {
      state.trust++;
      handle.style.background = '#16a34a';
      fill.style.background   = '#16a34a';
      handle.textContent = '✓';
      setTimeout(onVerify, 700);
    } else {
      handle.style.background = '#dc2626';
      setTimeout(() => {
        handle.style.background = 'white';
        updateHandle(0);
      }, 800);
      state.fear++;
    }
  });

  /* Touch support */
  handle.addEventListener('touchstart', e => { dragging = true; e.preventDefault(); }, { passive:false });
  document.addEventListener('touchmove', e => {
    if (!dragging) return;
    const rect = track.getBoundingClientRect();
    const pct  = ((e.touches[0].clientX - rect.left) / rect.width) * 100;
    updateHandle(pct);
  }, { passive:true });
  document.addEventListener('touchend', () => {
    if (!dragging) return;
    dragging = false;
    const diff = Math.abs(currentVal - target);
    if (diff <= tolerance) { state.trust++; setTimeout(onVerify, 700); }
    else { state.fear++; updateHandle(0); }
  });
}

/* ================================================================
   CAPTCHA MATHS
================================================================ */
function createMathCaptcha(container, onVerify) {
  const ops = ['+', '-', '×'];
  const op  = ops[Math.floor(Math.random() * ops.length)];
  let a, b, answer;

  if (op === '+') { a = Math.floor(Math.random()*20)+1; b = Math.floor(Math.random()*20)+1; answer = a+b; }
  else if (op === '-') { a = Math.floor(Math.random()*20)+10; b = Math.floor(Math.random()*10)+1; answer = a-b; }
  else { a = Math.floor(Math.random()*9)+2; b = Math.floor(Math.random()*9)+2; answer = a*b; }

  const q = document.createElement('div');
  q.style.cssText = 'font-size:28px;font-family:var(--mono);text-align:center;margin:16px 0;color:var(--text);letter-spacing:0.05em;';
  q.textContent = `${a} ${op} ${b} = ?`;
  container.appendChild(q);

  const inp = document.createElement('input');
  inp.type = 'number';
  inp.className = 'text-input';
  inp.placeholder = 'Votre réponse...';
  inp.style.textAlign = 'center';
  container.appendChild(inp);

  const warn = document.createElement('div');
  warn.className = 'warning-msg';
  warn.textContent = L.incorrect;
  container.appendChild(warn);

  const btn = document.createElement('button');
  btn.className = 'btn-verify';
  btn.textContent = L.verify;
  btn.onclick = () => {
    if (parseInt(inp.value) === answer) {
      state.trust++;
      btn.textContent = L.verified;
      btn.style.background = '#16a34a';
      btn.disabled = true;
      setTimeout(onVerify, 700);
    } else {
      warn.style.display = 'block';
      state.fear++;
      inp.value = '';
      setTimeout(() => { warn.style.display = 'none'; }, 2500);
    }
  };
  container.appendChild(btn);
}

/* ================================================================
   CAPTCHA ORDRE DE MOTS
================================================================ */
function createWordOrderCaptcha(container, onVerify) {
  const sentences = [
    { words: ['Je', 'ne', 'suis', 'pas', 'un', 'robot'], answer: 'Je ne suis pas un robot' },
    { words: ['Cliquez', 'pour', 'continuer'], answer: 'Cliquez pour continuer' },
    { words: ['Vérification', 'en', 'cours'], answer: 'Vérification en cours' },
    { words: ['Sécurité', 'avant', 'tout'], answer: 'Sécurité avant tout' },
  ];
  const chosen   = sentences[Math.floor(Math.random() * sentences.length)];
  const shuffled = [...chosen.words].sort(() => Math.random() - 0.5);
  const selected = [];

  const instr = document.createElement('div');
  instr.className = 'grid-instruction';
  instr.textContent = 'Remettez les mots dans le bon ordre :';
  container.appendChild(instr);

  const answer = document.createElement('div');
  answer.style.cssText = `
    min-height:40px;border:1.5px dashed var(--border);border-radius:8px;
    padding:8px;display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px;
    font-family:var(--mono);font-size:13px;
  `;
  container.appendChild(answer);

  const pool = document.createElement('div');
  pool.style.cssText = 'display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px;';

  function wordBtn(word, fromPool) {
    const b = document.createElement('button');
    b.className = 'choice-btn';
    b.style.cssText = 'width:auto;padding:6px 10px;font-size:12px;font-family:var(--mono);margin:0;';
    b.textContent = word;
    b.onclick = () => {
      if (fromPool) {
        selected.push(word);
        answer.appendChild(wordBtn(word, false));
        b.remove();
      } else {
        const idx = selected.indexOf(word);
        if (idx >= 0) selected.splice(idx, 1);
        pool.appendChild(wordBtn(word, true));
        b.remove();
      }
      checkAnswer();
    };
    return b;
  }

  shuffled.forEach(w => pool.appendChild(wordBtn(w, true)));
  container.appendChild(pool);

  const warn = document.createElement('div');
  warn.className = 'warning-msg';
  warn.textContent = L.incorrect;
  container.appendChild(warn);

  const btn = document.createElement('button');
  btn.className = 'btn-verify';
  btn.textContent = L.verify;
  btn.onclick = () => {
    if (selected.join(' ') === chosen.answer) {
      state.trust++;
      btn.textContent = L.verified;
      btn.style.background = '#16a34a';
      btn.disabled = true;
      setTimeout(onVerify, 700);
    } else {
      warn.style.display = 'block';
      state.fear++;
      setTimeout(() => { warn.style.display = 'none'; }, 2500);
    }
  };
  container.appendChild(btn);

  function checkAnswer() {}
}

/* ================================================================
   CHOICE BUTTONS
================================================================ */
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
      onChoose(ch);
    };
    container.appendChild(btn);
  });
}
