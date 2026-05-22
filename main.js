/* ================================================================
   MAIN.JS — Flow controller
================================================================ */

let currentStage = 0;

/*
  Séquence de stages.
  stageGridEmotional intègre le choix final → nextStage() saute vers stageFinal
*/
const stageFlow = [
  stageCheckbox,       // 0  — checkbox classique
  stageGrid1,          // 1  — grille aléatoire #1
  stageCaptchaText,    // 2  — texte déformé canvas
  stageDialog1,        // 3  — dialog processing
  stageChoice1,        // 4  — expérience utilisateur
  stageGrid2,          // 5  — grille aléatoire #2
  stageSlider,         // 6  — slider
  stageDialog2,        // 7  — VERA se nomme
  stageMath,           // 8  — maths
  stageTyping1,        // 9  — audio factice
  stageWordOrder,      // 10 — ordre de mots
  stageChoice2,        // 11 — "reviendriez-vous ?"
  stageDialog3,        // 12 — obsession
  stageGridEmotional,  // 13 — grille émotionnelle + choix final intégré
  stageFinal,          // 14 — finale (branché selon stats)
];

function nextStage() {
  currentStage++;
  setProgress(currentStage);
  checkPhase();

  if (currentStage < stageFlow.length) {
    stageFlow[currentStage]();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  updateStats();
  stageFlow[0]();
});
