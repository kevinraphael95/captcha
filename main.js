/* ================================================================
   test fait avec gem
================================================================ */

/* ================================================================
   MAIN.JS — Application entry point and navigation logic
================================================================ */

// Suivi de l'étape actuelle
let currentStage = 0;

/**
 * Définit la liste des fonctions de stage à exécuter dans l'ordre.
 */
const stageFlow = [
  stageCheckbox, // 0
  stageGrid1,    // 1
  stageGrid2,    // 2
  stageDialog1,  // 3
  stageChoice1,  // 4
  stageGrid3,    // 5
  stageDialog2,  // 6
  stageTyping1,  // 7
  stageChoice2,  // 8
  stageDialog3,  // 9
  stageChoice3,  // 10
  stageFinal     // 11
];

/**
 * Navigue vers l'étape suivante ou termine le processus.
 */
function nextStage() {
  currentStage++;
  
  // Mise à jour de la barre de progression globale
  setProgress(currentStage);
  
  // Vérification de la phase (changement d'état émotionnel)
  checkPhase();

  // Exécution du prochain stage
  if (currentStage < stageFlow.length) {
    stageFlow[currentStage]();
  }
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
  // Lancement du premier stage
  stageFlow[0]();
});
