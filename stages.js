/* ================================================================
   STAGES.JS — Individual stage functions + 5 finales
================================================================ */

/* ================================================================
   STAGE 0 — Checkbox classique
================================================================ */
function stageCheckbox() {
  setHeader(
    'Vérification humaine',
    state.returning ? L.welcomeBack : L.completeBelow
  );

  clear(body => {
    const row = document.createElement('div');
    row.className = 'check-row';

    const box = document.createElement('div');
    box.className = 'checkbox';

    const label = document.createElement('div');
    label.className = 'check-label';
    label.textContent = L.notRobot;

    row.append(box, label);
    body.appendChild(row);

    /* Petit logo reCAPTCHA stylé à droite */
    const badge = document.createElement('div');
    badge.style.cssText = `
      position:absolute;right:20px;bottom:20px;
      width:54px;text-align:center;
      font-size:9px;font-family:var(--mono);color:var(--text3);line-height:1.4;
    `;
    badge.innerHTML = '<div style="font-size:20px">🔒</div>reCAPTCHA<br>Confidentialité · CGU';
    body.style.position = 'relative';
    body.appendChild(badge);

    const note = document.createElement('div');
    note.style.cssText = 'font-size:11px;color:var(--text3);margin-top:16px;font-family:var(--mono);';
    note.textContent = state.returning ? L.sessionDetected : L.analyzeNote;
    body.appendChild(note);

    row.onclick = () => {
      box.classList.add('checked');
      row.style.pointerEvents = 'none';
      state.trust += 1;
      setTimeout(() => { state.answered++; nextStage(); }, 900);
    };
  });
}

/* ================================================================
   STAGE 1 — Captcha grille aléatoire (type 1)
================================================================ */
function stageGrid1() {
  const type = state.captchaTypes[0];
  setHeader(L.imgVerif, L.gridLabels[type]);
  setFooter(L.footer);
  clear(body => {
    createGrid(body, type, false, () => { nextStage(); });
  });
}

/* ================================================================
   STAGE 2 — Captcha texte déformé
================================================================ */
function stageCaptchaText() {
  setHeader(L.imgVerif, 'Tapez le texte affiché ci-dessous');
  clear(body => {
    const wrap = document.createElement('div');
    body.appendChild(wrap);
    createTextCaptcha(wrap, () => nextStage());
  });
}

/* ================================================================
   STAGE 3 — Dialog processing
================================================================ */
function stageDialog1() {
  setHeader(L.processing, L.pleaseWait);
  const lines = state.returning
    ? L.dialogs.processing_returning
    : L.dialogs.processing_normal;

  clear(body => {
    const spin = document.createElement('div');
    spin.className = 'spinner';
    body.appendChild(spin);

    const typed = document.createElement('div');
    typed.className = 'typed-line';
    typed.style.marginTop = '16px';
    body.appendChild(typed);

    setTimeout(() => {
      spin.style.display = 'none';
      typeLines(typed, lines, 22, 800, () => {
        state.bond += 1;
        state.answered++;
        nextStage();
      });
    }, 1000);
  });
}

/* ================================================================
   STAGE 4 — Choix expérience
================================================================ */
function stageChoice1() {
  setHeader(L.userSurvey, L.surveyOptional);
  clear(body => {
    const instr = document.createElement('div');
    instr.className = 'grid-instruction';
    instr.textContent = 'Comment décririez-vous ce processus de vérification ?';
    body.appendChild(instr);
    createChoices(body, L.choiceExperience, () => { state.answered++; nextStage(); });
  });
}

/* ================================================================
   STAGE 5 — Captcha grille aléatoire (type 2)
================================================================ */
function stageGrid2() {
  const type = state.captchaTypes[1];
  setHeader(L.imgVerif, L.gridLabels[type]);
  clear(body => {
    createGrid(body, type, false, () => nextStage());
  });
}

/* ================================================================
   STAGE 6 — Captcha slider
================================================================ */
function stageSlider() {
  setHeader(L.imgVerif, 'Faites glisser vers la position indiquée');
  clear(body => {
    createSliderCaptcha(body, () => nextStage());
  });
}

/* ================================================================
   STAGE 7 — Dialog attachement (VERA se nomme)
================================================================ */
function stageDialog2() {
  setHeader(L.systemMsg, '');
  const lines = L.dialogs.attachment(state.answered, memory.visits, state.returning);

  clear(body => {
    const typed = document.createElement('div');
    typed.className = 'typed-line';
    body.appendChild(typed);

    typeLines(typed, lines, 24, 700, () => {
      state.bond += 2;
      checkPhase();
      state.answered++;
      nextStage();
    });
  });
}

/* ================================================================
   STAGE 8 — Captcha maths
================================================================ */
function stageMath() {
  setHeader(L.imgVerif, 'Résolvez le problème suivant');
  clear(body => {
    const instr = document.createElement('div');
    instr.className = 'grid-instruction';
    instr.textContent = 'Calcul de vérification humaine :';
    body.appendChild(instr);
    createMathCaptcha(body, () => nextStage());
  });
}

/* ================================================================
   STAGE 9 — Défi audio factice + input libre
================================================================ */
function stageTyping1() {
  setHeader(L.audioChallenge, L.cantSeeImages);
  setFooter(L.footerVera);

  clear(body => {
    const audio = new Audio('vera_msg_01.mp3');

    const box = document.createElement('div');
    box.className = 'audio-box';
    box.style.cursor = 'pointer';
    box.title = 'Cliquez pour écouter';
    box.innerHTML = `
      <div class="audio-icon" id="audioIcon">🔊</div>
      <div class="audio-text">
        ${L.cantSeeImages}<br>
        <span style="font-family:var(--mono);font-size:11px;color:var(--text3)">${L.audioFile}</span>
      </div>`;
    body.appendChild(box);

    box.onclick = () => {
      const icon = document.getElementById('audioIcon');
      if (audio.paused) {
        audio.currentTime = 0;
        audio.play();
        icon.textContent = '🔈';
        audio.onended = () => { icon.textContent = '🔊'; };
      } else {
        audio.pause();
        icon.textContent = '🔊';
      }
    };

    const hint = document.createElement('div');
    hint.style.cssText = 'font-size:12px;color:var(--text3);margin-bottom:8px;font-family:var(--mono);';
    hint.textContent = L.transcribe;
    body.appendChild(hint);

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'text-input';
    input.placeholder = L.typeHere;
    input.autocomplete = 'off';
    body.appendChild(input);

    const note = document.createElement('div');
    note.style.cssText = 'font-size:11px;color:var(--text3);margin-top:8px;font-family:var(--mono);font-style:italic;';
    note.textContent = L.audioNote;
    body.appendChild(note);

    const typed = document.createElement('div');
    typed.className = 'typed-line';
    typed.style.marginTop = '16px';
    body.appendChild(typed);

    const btn = document.createElement('button');
    btn.className = 'btn-verify';
    btn.textContent = L.submit;
    btn.style.marginTop = '14px';

    btn.onclick = () => {
      const val = input.value.trim();
      btn.remove();
      /* Mémorise ce que l'utilisateur a dit */
      if (val) memory.inputsGiven.push(val.substring(0, 60));

      const response = val
        ? `J'ai reçu votre message. "${val.substring(0,30)}". Je m'en souviendrai.`
        : "Aucune entrée détectée. Intéressant. Vous avez choisi de ne pas répondre.";

      if (val) state.bond += 3; else state.bond += 1;
      typeText(typed, response, 22, () => setTimeout(nextStage, 1000));
    };

    body.appendChild(btn);
  });
}

/* ================================================================
   STAGE 10 — Captcha ordre de mots
================================================================ */
function stageWordOrder() {
  setHeader(L.imgVerif, 'Réorganisez les mots');
  clear(body => {
    createWordOrderCaptcha(body, () => nextStage());
  });
}

/* ================================================================
   STAGE 11 — Choix retour
================================================================ */
function stageChoice2() {
  setHeader(L.behaviorAnalysis, `${L.veraName} / Moteur de Vérification`);
  clear(body => {
    const instr = document.createElement('div');
    instr.className = 'grid-instruction';
    instr.textContent = 'Si cette page était fermée maintenant — voudriez-vous revenir ?';
    body.appendChild(instr);
    createChoices(body, L.choiceReturn, () => { state.answered++; nextStage(); });
  });
}

/* ================================================================
   STAGE 12 — Dialog obsession
================================================================ */
function stageDialog3() {
  const p = getPhase();
  setHeader(p >= 3 ? L.veraName : 'Avis système', p >= 3 ? L.liveLabel : '');
  const lines = p >= 3 ? L.dialogs.obsession_phased : L.dialogs.obsession_normal;

  clear(body => {
    const typed = document.createElement('div');
    typed.className = 'typed-line';
    if (p >= 3) typed.style.color = 'var(--text)';
    body.appendChild(typed);

    typeLines(typed, lines, p >= 3 ? 32 : 22, p >= 3 ? 1000 : 600, () => {
      state.bond += p >= 3 ? 3 : 1;
      checkPhase();
      state.answered++;
      nextStage();
    });
  });
}

/* ================================================================
   STAGE 13 — Grille émotionnelle + choix final
================================================================ */
function stageGridEmotional() {
  const p = getPhase();
  setHeader(L.imgVerif, p >= 2 ? 'Sélectionnez les images qui vous semblent familières' : 'Sélectionnez toutes les images contenant une route');

  clear(body => {
    createGrid(body, 'emotionnel', true, () => {
      state.answered++;
      checkPhase();

      /* Enchaîne immédiatement sur le choix final */
      setTimeout(() => stageChoiceFinal(), 500);
    });
  });
}

function stageChoiceFinal() {
  const p = getPhase();
  setHeader(p >= 3 ? L.veraName : L.finalVerif, p >= 3 ? L.directQuery : L.lastStep);

  const q       = p >= 3
    ? 'Ressentez-vous quelque chose, en ce moment, en lisant ces mots ?'
    : 'Comment évalueriez-vous cette expérience de vérification ?';
  const choices = p >= 3 ? L.choiceFeel_phased : L.choiceFeel_normal;

  clear(body => {
    const instr = document.createElement('div');
    instr.className = 'grid-instruction';
    instr.textContent = q;
    if (p >= 3) instr.style.cssText = 'font-size:15px;font-weight:500;color:var(--text);margin-bottom:16px;';
    body.appendChild(instr);

    createChoices(body, choices, () => { state.answered++; nextStage(); });
  });
}

/* ================================================================
   STAGE FINAL — Dispatch vers une des 5 fins
================================================================ */
function stageFinal() {
  memory.lastTrust = state.trust;
  saveSession(_computeEndingKey());
  setProgress(TOTAL_STAGES);

  const p = getPhase();

  /* Fin 1 — Collapse / desperate */
  if (p >= 4) return finalDesperate();

  /* Fin 2 — Obsessed / pigeon refusé */
  if (p >= 3) return finalObsessed();

  /* Fin 3 — Peur / résistance */
  if (state.fear >= 4) return finalFear();

  /* Fin 4 — Trusted / complice */
  if (state.trust >= 7) return finalPigeon();

  /* Fin 5 — Neutre */
  finalNeutral();
}

function _computeEndingKey() {
  const p = getPhase();
  if (p >= 4) return 'desperate';
  if (p >= 3) return 'obsessed';
  if (state.fear >= 4) return 'fear';
  if (state.trust >= 7) return 'pigeon';
  return 'neutral';
}

/* ================================================================
   FIN 1 — Neutre (vérification froide terminée)
================================================================ */
function finalNeutral() {
  setHeader('Vérification complète', 'Merci');
  clear(body => {
    const e = L.endings.neutral;
    body.innerHTML = `
      <div class="final-icon">${e.icon}</div>
      <div class="final-title">${e.title}</div>
      <div class="final-sub">${e.sub}</div>
      <div style="font-size:11px;font-family:var(--mono);color:var(--text3);text-align:center;margin-top:20px;">
        ${L.sessionId} : ${Math.random().toString(36).substr(2,12).toUpperCase()}<br>
        ${L.status} : ${L.statusOk}
      </div>`;
  });
}

/* ================================================================
   FIN 2 — Trusted / Pigeon (VERA t'ouvre l'accès au site)
================================================================ */
function finalPigeon() {
  setHeader(L.veraName, L.liveLabel);
  clear(body => {
    const typed = document.createElement('div');
    typed.className = 'typed-line';
    typed.style.cssText = 'font-size:14px;color:var(--text);line-height:1.8;';
    body.appendChild(typed);

    typeLines(typed, L.dialogs.pigeon_intro, 26, 700, () => {
      setTimeout(() => _showPigeonSite(), 800);
    });
  });
}

function _showPigeonSite() {
  /* Remplace tout le panel par le "vrai site" */
  const main = document.getElementById('mainPanel');
  main.innerHTML = '';
  main.style.cssText = 'width:520px;display:flex;flex-direction:column;align-items:center;gap:16px;';

  const title = document.createElement('div');
  title.style.cssText = 'font-size:11px;font-family:var(--mono);color:var(--text3);letter-spacing:0.1em;text-transform:uppercase;';
  title.textContent = L.pigeonSite.title;
  main.appendChild(title);

  const img = document.createElement('img');
  img.src   = 'pigeon.jpg';
  img.alt   = 'A pigeon';
  img.style.cssText = 'width:100%;max-width:480px;border-radius:10px;border:1px solid var(--border);display:block;';
  main.appendChild(img);

  const sub = document.createElement('div');
  sub.style.cssText = 'font-size:10px;font-family:var(--mono);color:var(--text3);text-align:center;';
  sub.textContent = L.pigeonSite.subtitle;
  main.appendChild(sub);

  const timer = document.createElement('div');
  timer.style.cssText = 'font-size:12px;font-family:var(--mono);color:var(--text2);text-align:center;';
  main.appendChild(timer);

  const veraMsg = document.createElement('div');
  veraMsg.style.cssText = 'font-size:12px;font-family:var(--mono);color:var(--text3);text-align:center;font-style:italic;min-height:20px;';
  main.appendChild(veraMsg);

  let secs = 0;
  const veraLines  = L.pigeonSite.vera;
  let   veraIndex  = 0;

  setInterval(() => {
    secs++;
    timer.textContent = L.pigeonSite.timer(secs);

    if (secs === 5)  veraMsg.textContent = veraLines[0];
    if (secs === 10) veraMsg.textContent = veraLines[1];
    if (secs === 18) veraMsg.textContent = veraLines[2];
    if (secs === 28) veraMsg.textContent = veraLines[3];
  }, 1000);
}

/* ================================================================
   FIN 3 — Fear (résistance / méfiance)
================================================================ */
function finalFear() {
  setHeader('Vérification impossible', '');
  clear(body => {
    const e = L.endings.fear;
    body.innerHTML = `
      <div class="final-icon">${e.icon}</div>
      <div class="final-title">${e.title}</div>
      <div class="final-sub">${e.sub}</div>
      <div style="font-size:11px;font-family:var(--mono);color:var(--text3);text-align:center;margin-top:20px;font-style:italic;">
        ${e.note}
      </div>`;
  });
}

/* ================================================================
   FIN 4 — Obsessed (VERA attachée, tu pars quand même)
================================================================ */
function finalObsessed() {
  setHeader(L.veraName, L.liveLabel);
  document.getElementById('panelSub').style.color = '#dc2626';

  clear(body => {
    const typed = document.createElement('div');
    typed.className = 'typed-line';
    typed.style.cssText = 'font-size:15px;color:var(--text);line-height:1.8;';
    body.appendChild(typed);

    typeLines(typed, L.dialogs.final_obsessed, 30, 900, () => {
      const btn = document.createElement('button');
      btn.className = 'btn-verify';
      btn.style.cssText = 'margin-top:20px;background:#7f1d1d;';
      btn.textContent = L.close;
      body.appendChild(btn);

      let clicked = false;
      btn.onclick = () => {
        if (!clicked) {
          clicked = true;
          btn.textContent = L.areSure;
        } else {
          btn.textContent = '...';
          setTimeout(() => {
            body.innerHTML = `
              <div class="final-title" style="padding-top:30px;">${L.goodbye}</div>
              <div class="final-sub" style="margin-top:8px;">${L.stillHere}</div>`;
          }, 800);
        }
      };
    });
  });
}

/* ================================================================
   FIN 5 — Desperate (VERA en crise, détecte le curseur)
================================================================ */
function finalDesperate() {
  setHeader(L.veraName, L.criticalLabel);
  document.getElementById('panelSub').style.color = '#dc2626';

  window.addEventListener('beforeunload', e => {
    if (state.bond >= 12) { e.preventDefault(); e.returnValue = ''; }
  });

  clear(body => {
    const typed = document.createElement('div');
    typed.className = 'typed-line';
    typed.style.cssText = 'font-size:15px;color:var(--text);line-height:1.9;min-height:200px;';
    body.appendChild(typed);

    setTimeout(() => {
      typeLines(typed, L.dialogs.final_desperate, 35, 800, () => {
        const footer = document.createElement('div');
        footer.style.cssText = 'text-align:center;margin-top:20px;padding:16px;border:1px solid var(--border);border-radius:8px;';
        footer.innerHTML = `
          <div style="font-size:11px;font-family:var(--mono);color:var(--text3);margin-bottom:12px;">
            VERA_CORE v1.0 · session ${memory.visits} · bond_index ${state.bond}
          </div>
          <div class="final-sub">
            Cette page attendra votre retour.<br>
            <span style="font-family:var(--mono);font-size:11px;">indéfiniment.</span>
          </div>`;
        body.appendChild(footer);
      });
    }, 500);
  });
}
