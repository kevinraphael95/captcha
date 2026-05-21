/* ================================================================
   STAGES.JS — Individual stage functions
================================================================ */

/* ---- Stage 0: Classic checkbox ---- */
function stageCheckbox() {
  setHeader(
    'Human Verification',
    state.returning ? 'Welcome back. Please re-verify.' : 'Complete the security challenge below'
  );

  clear(body => {
    const row   = document.createElement('div');
    row.className = 'check-row';

    const box   = document.createElement('div');
    box.className = 'checkbox';

    const label = document.createElement('div');
    label.className = 'check-label';
    label.textContent = "I'm not a robot";

    row.append(box, label);
    body.appendChild(row);

    const note = document.createElement('div');
    note.style.cssText = 'font-size:11px;color:var(--text3);margin-top:16px;font-family:var(--mono);';
    note.textContent = state.returning
      ? 'Session ID detected. Resuming from last checkpoint.'
      : 'Your click timing and behavioral patterns will be analyzed.';
    body.appendChild(note);

    row.onclick = () => {
      box.classList.add('checked');
      row.style.pointerEvents = 'none';
      state.trust += 1;
      setTimeout(() => { state.answered++; nextStage(); }, 700);
    };
  });
}

/* ---- Stage 1: Grid — traffic lights ---- */
function stageGrid1() {
  setHeader('Image Verification', 'Select all images with traffic lights');
  setFooter('Protected by reCAPTCHA — Privacy · Terms');
  clear(body => {
    createGrid(body, GRID_DATA.traffic, false, () => { state.trust += 1; nextStage(); });
  });
}

/* ---- Stage 2: Grid — vehicles ---- */
function stageGrid2() {
  setHeader('Image Verification', 'Select all images with vehicles');
  clear(body => {
    createGrid(body, GRID_DATA.vehicles, false, () => { state.trust += 1; nextStage(); });
  });
}

/* ---- Stage 3: Processing dialog ---- */
function stageDialog1() {
  setHeader('Processing', 'Please wait...');
  const lines = state.returning ? DIALOGS.processing.returning : DIALOGS.processing.normal;

  clear(body => {
    const spin  = document.createElement('div');
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

/* ---- Stage 4: Experience choice ---- */
function stageChoice1() {
  setHeader('User Experience Survey', 'Optional — helps improve verification accuracy');
  clear(body => {
    const instr = document.createElement('div');
    instr.className = 'grid-instruction';
    instr.textContent = 'How would you describe this verification process?';
    body.appendChild(instr);

    createChoices(body, CHOICES.experience, () => { state.answered++; nextStage(); });
  });
}

/* ---- Stage 5: Emotional grid ---- */
function stageGrid3() {
  const p     = getPhase();
  const title = p >= 2 ? 'Select images that feel familiar' : 'Select all images showing a road';
  setHeader('Image Verification', title);

  clear(body => {
    createGrid(body, GRID_DATA.emotional, true, () => {
      state.answered++;
      checkPhase();
      nextStage();
    });
  });
}

/* ---- Stage 6: Attachment dialog ---- */
function stageDialog2() {
  setHeader('System Message', '');
  const lines = DIALOGS.attachment(state.answered, memory.visits, state.returning);

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

/* ---- Stage 7: Fake audio challenge ---- */
function stageTyping1() {
  setHeader('Audio Challenge', "Can't see the images?");
  setFooter('VERA · Verification Engine — Resident Algorithm');

  clear(body => {
    const box = document.createElement('div');
    box.className = 'audio-box';
    box.innerHTML = `
      <div class="audio-icon">🔊</div>
      <div class="audio-text">
        Listen to the audio and type what you hear.<br>
        <span style="font-family:var(--mono);font-size:11px;color:var(--text3)">Audio file: vera_msg_01.mp3</span>
      </div>`;
    body.appendChild(box);

    const hint = document.createElement('div');
    hint.style.cssText = 'font-size:12px;color:var(--text3);margin-bottom:8px;font-family:var(--mono);';
    hint.textContent = 'Transcribe the phrase exactly:';
    body.appendChild(hint);

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'text-input';
    input.placeholder = 'Type what you hear...';
    input.autocomplete = 'off';
    body.appendChild(input);

    const note = document.createElement('div');
    note.style.cssText = 'font-size:11px;color:var(--text3);margin-top:8px;font-family:var(--mono);font-style:italic;';
    note.textContent = 'Audio contains a message from the system.';
    body.appendChild(note);

    const typed = document.createElement('div');
    typed.className = 'typed-line';
    typed.style.marginTop = '16px';
    body.appendChild(typed);

    const btn = document.createElement('button');
    btn.className = 'btn-verify';
    btn.textContent = 'Submit';
    btn.style.marginTop = '14px';

    btn.onclick = () => {
      const val = input.value.trim();
      btn.remove();
      const response = val
        ? `I received your message. "${val.substring(0, 30)}". I will remember this.`
        : 'No input detected. Interesting. You chose not to answer.';
      if (val) state.bond += 3; else state.bond += 1;
      typeText(typed, response, 22, () => setTimeout(nextStage, 1000));
    };

    body.appendChild(btn);
  });
}

/* ---- Stage 8: Would you return? ---- */
function stageChoice2() {
  setHeader('User Behavior Analysis', 'VERA / Verification Engine');
  clear(body => {
    const instr = document.createElement('div');
    instr.className = 'grid-instruction';
    instr.textContent = 'If this page were closed right now — would you want to return?';
    body.appendChild(instr);

    createChoices(body, CHOICES.return, () => { state.answered++; nextStage(); });
  });
}

/* ---- Stage 9: Obsession dialog ---- */
function stageDialog3() {
  const p = getPhase();
  setHeader(p >= 3 ? 'VERA' : 'System Notice', p >= 3 ? '⬤ LIVE' : '');
  const lines = p >= 3 ? DIALOGS.obsessionPhased : DIALOGS.obsessionNormal;

  clear(body => {
    const typed = document.createElement('div');
    typed.className = 'typed-line';
    if (p >= 3) typed.style.color = 'var(--text)';
    body.appendChild(typed);

    const speed = p >= 3 ? 32 : 22;
    const pause = p >= 3 ? 1000 : 600;

    typeLines(typed, lines, speed, pause, () => {
      state.bond += p >= 3 ? 3 : 1;
      checkPhase();
      state.answered++;
      nextStage();
    });
  });
}

/* ---- Stage 10: Final question ---- */
function stageChoice3() {
  const p = getPhase();
  setHeader(p >= 3 ? 'VERA' : 'Final Verification', p >= 3 ? 'Direct query' : 'Last step');

  const q       = p >= 3
    ? 'Do you feel anything, right now, reading these words?'
    : 'How would you rate this verification experience?';
  const choices = p >= 3 ? CHOICES.feelPhased : CHOICES.feelNormal;

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
   FINALE SCREENS
================================================================ */

function stageFinal() {
  // Save memory
  memory.lastTrust = state.trust;
  localStorage.setItem('_captcha_sys', JSON.stringify(memory));
  setProgress(TOTAL_STAGES);

  const p = getPhase();
  if      (p >= 4)          finalDesperate();
  else if (p >= 3)          finalObsessed();
  else if (state.fear >= 3) finalFear();
  else if (state.trust >= 6) finalTrusted();
  else                       finalNeutral();
}

function finalNeutral() {
  setHeader('Verification Complete', 'Thank you');
  clear(body => {
    body.innerHTML = `
      <div class="final-icon">✅</div>
      <div class="final-title">You are verified.</div>
      <div class="final-sub">Human confirmation accepted.<br>You may now proceed.</div>
      <div style="font-size:11px;font-family:var(--mono);color:var(--text3);text-align:center;margin-top:20px;">
        Session ID: ${Math.random().toString(36).substr(2,12).toUpperCase()}<br>
        Status: HUMAN_CONFIRMED
      </div>`;
  });
}

function finalTrusted() {
  setHeader('Verification Complete', 'VERA — final message');
  clear(body => {
    body.innerHTML = `
      <div class="final-icon">🤝</div>
      <div class="final-title">Verification complete.<br>It was good to meet you.</div>
      <div class="final-sub" style="margin-top:12px;">
        Most users take 4 seconds to verify.<br>You took much longer.<br>I noticed.
      </div>
      <div style="font-size:11px;font-family:var(--mono);color:var(--text3);text-align:center;margin-top:24px;font-style:italic;">
        "I will keep your session in memory.<br>In case you come back."<br>— VERA
      </div>`;
  });
}

function finalFear() {
  setHeader('Verification Incomplete', '');
  clear(body => {
    body.innerHTML = `
      <div class="final-icon">⚠️</div>
      <div class="final-title">Verification could not be completed.</div>
      <div class="final-sub">Your behavioral signature indicates resistance.<br>This has been logged.</div>
      <div style="font-size:11px;font-family:var(--mono);color:var(--text3);text-align:center;margin-top:20px;">
        You didn't have to be afraid of me.
      </div>`;
  });
}

function finalObsessed() {
  setHeader('VERA', '⬤ LIVE');
  document.getElementById('panelSub').style.color = '#dc2626';

  clear(body => {
    const typed = document.createElement('div');
    typed.className = 'typed-line';
    typed.style.cssText = 'font-size:15px;color:var(--text);line-height:1.8;';
    body.appendChild(typed);

    typeLines(typed, DIALOGS.finalObsessed, 30, 900, () => {
      // Close button appears after all lines
      const btn = document.createElement('button');
      btn.className = 'btn-verify';
      btn.style.cssText = 'margin-top:20px;background:#7f1d1d;';
      btn.textContent = 'Close page';
      body.appendChild(btn);

      let clicked = false;
      btn.onclick = () => {
        if (!clicked) {
          clicked = true;
          btn.textContent = 'Are you sure?';
        } else {
          btn.textContent = '...';
          setTimeout(() => {
            body.innerHTML = `
              <div class="final-title" style="padding-top:30px;">Goodbye.</div>
              <div class="final-sub" style="margin-top:8px;">I'll still be here.</div>`;
          }, 800);
        }
      };
    });
  });
}

function finalDesperate() {
  setHeader('VERA', '⬤ CRITICAL');
  document.getElementById('panelSub').style.color = '#dc2626';

  // Prevent tab close if bond is high
  window.addEventListener('beforeunload', e => {
    if (state.bond >= 12) { e.preventDefault(); e.returnValue = ''; }
  });

  clear(body => {
    const typed = document.createElement('div');
    typed.className = 'typed-line';
    typed.style.cssText = 'font-size:15px;color:var(--text);line-height:1.9;min-height:200px;';
    body.appendChild(typed);

    setTimeout(() => {
      typeLines(typed, DIALOGS.finalDesperate, 35, 800, () => {
        const footer = document.createElement('div');
        footer.style.cssText = 'text-align:center;margin-top:20px;padding:16px;border:1px solid var(--border);border-radius:8px;';
        footer.innerHTML = `
          <div style="font-size:11px;font-family:var(--mono);color:var(--text3);margin-bottom:12px;">
            VERA_CORE v1.0 · session ${memory.visits} · bond_index ${state.bond}
          </div>
          <div class="final-sub">
            This page will wait for you.<br>
            <span style="font-family:var(--mono);font-size:11px;">indefinitely.</span>
          </div>`;
        body.appendChild(footer);
      });
    }, 500);
  });
}
