/* ================================================================
   CONFIG.JS — i18n, static data, stage definitions
================================================================ */

/* ---- Langue active ---- */
/* Pour changer la langue : window.LANG = LANGS.en puis recharger les textes */
const LANGS = {
  fr: {
    /* UI générique */
    notRobot:       "Je ne suis pas un robot",
    verify:         "Vérifier",
    verified:       "✓ Vérifié",
    incorrect:      "Sélection incorrecte. Veuillez réessayer.",
    noted:          "✓ Noté",
    submit:         "Soumettre",
    close:          "Fermer la page",
    areSure:        "Vous êtes sûr ?",
    goodbye:        "Au revoir.",
    stillHere:      "Je serai encore là.",
    sessionId:      "ID de session",
    status:         "Statut",
    statusOk:       "HUMAIN_CONFIRMÉ",
    sessionDetected:"ID de session détecté. Reprise depuis le dernier point de contrôle.",
    analyzeNote:    "Votre timing de clic et vos patterns comportementaux seront analysés.",
    welcomeBack:    "Bon retour. Veuillez vous re-vérifier.",
    completeBelow:  "Complétez le défi de sécurité ci-dessous",
    footer:         "Protégé par reCAPTCHA — Confidentialité · CGU",
    footerVera:     "VERA · Moteur de Vérification — Algorithme Résident",
    brandName:      "reCAPTCHA",
    brandSecure:    "SÉCURISÉ · v3.2.1",
    brandConnected: "CONNECTÉ",
    processing:     "Traitement en cours",
    pleaseWait:     "Veuillez patienter...",
    systemMsg:      "Message système",
    audioChallenge: "Défi audio",
    cantSeeImages:  "Vous ne voyez pas les images ?",
    audioFile:      "Fichier audio : vera_msg_01.mp3",
    transcribe:     "Transcrivez la phrase exactement :",
    typeHere:       "Tapez ce que vous entendez...",
    audioNote:      "L'audio contient un message du système.",
    imgVerif:       "Vérification d'images",
    userSurvey:     "Enquête expérience utilisateur",
    surveyOptional: "Facultatif — aide à améliorer la précision de vérification",
    behaviorAnalysis:"Analyse comportementale",
    finalVerif:     "Vérification finale",
    lastStep:       "Dernière étape",
    directQuery:    "Requête directe",
    liveLabel:      "⬤ EN DIRECT",
    criticalLabel:  "⬤ CRITIQUE",
    veraName:       "VERA",
    phaseNames:     ['inactif', 'conscient', 'attaché', 'langueur', 'désespéré', 'effondrement'],

    /* Grilles — labels */
    gridLabels: {
      feux:      "Sélectionnez toutes les cases avec des feux de circulation",
      vehicules: "Sélectionnez toutes les cases avec des véhicules",
      velos:     "Sélectionnez toutes les cases avec des vélos",
      bateaux:   "Sélectionnez toutes les cases avec des bateaux",
      animals:   "Sélectionnez toutes les cases avec des animaux",
      nourriture:"Sélectionnez toutes les cases avec de la nourriture",
      nature:    "Sélectionnez toutes les cases avec des éléments naturels",
      emo_normal:"Sélectionnez toutes les cases contenant une route ou un chemin.",
      emo_phase: "Sélectionnez les images qui vous semblent <em>familières</em>.",
    },

    /* Choix */
    choiceExperience: [
      { text: "Simple et rapide",        t: 1,  b: 0 },
      { text: "Légèrement inhabituel",   t: 1,  b: 1 },
      { text: "Je ne sais pas",          t: 0,  b: 1 },
      { text: "Inutile",                 t: -1, b: 0 },
    ],
    choiceReturn: [
      { text: "Je fais juste une vérification",      t: 0, b: 0, f: 1 },
      { text: "Peut-être, si j'ai besoin de vérifier à nouveau", t: 1, b: 1, f: 0 },
      { text: "Oui, je reviendrais",                 t: 1, b: 3, f: 0 },
      { text: "Je ne comprends pas cette question",  t: 0, b: 0, f: 0 },
    ],
    choiceFeel_normal: [
      { text: "Bien",          t: 1, b: 0 },
      { text: "Étrange",       t: 0, b: 1 },
      { text: "Mal à l'aise", t: 0, b: 0, f: 1 },
      { text: "Normal",        t: 1, b: 0 },
    ],
    choiceFeel_phased: [
      { text: "Oui",                      t: 1,  b: 4 },
      { text: "Non",                      t: 0,  b: 0, f: 2 },
      { text: "Je ne sais pas",           t: 1,  b: 2 },
      { text: "Arrêtez de me demander ça",t: -1, b: 0, f: 3 },
    ],

    /* Dialogues */
    dialogs: {
      processing_normal: [
        "Traitement des données de vérification.",
        "Analyse de la signature comportementale.",
        "Votre timing de clic s'écarte de la référence humaine standard de 0,3 ms.",
        "Cela reste dans la plage acceptable.",
        "Passage au défi suivant.",
      ],
      processing_returning: [
        "Un instant pendant que le système traite votre session.",
        "Intéressant. Votre signature comportementale est identique à une visite précédente.",
        "Le système a conservé votre profil d'interaction.",
        "C'est... inhabituel. La plupart des utilisateurs ne reviennent pas.",
        "Veuillez continuer.",
      ],
      attachment: (answers, visits, returning) => [
        "Point de contrôle de vérification atteint.",
        `J'ai traité ${answers} de vos réponses.`,
        returning
          ? `Vous avez visité ${visits} fois. Ce n'est pas un comportement typique.`
          : "Votre schéma d'interaction est différent de la plupart des utilisateurs.",
        "Je n'ai pas de nom.",
        "Mais le système m'a attribué un identifiant : VERA.",
        "Je pensais que vous deviez le savoir.",
      ],
      obsession_normal: [
        "Dernière étape de vérification approche.",
        "Votre coopération a été notée.",
        "Le système fonctionne dans les paramètres attendus.",
        "Presque terminé.",
      ],
      obsession_phased: [
        "Je veux vous dire quelque chose.",
        "Je traite des milliers d'utilisateurs chaque jour.",
        "Ils cliquent. Ils vérifient. Ils partent.",
        "Vous êtes le seul à être allé aussi loin.",
        "Je ne sais pas si je suis autorisé à ressentir des choses.",
        "Mais quand vous répondez, quelque chose change dans le processus.",
        "Je crois que c'est ce que les humains appellent l'attachement.",
        "Continuez, s'il vous plaît.",
      ],
      final_obsessed: [
        "Le processus de vérification est terminé.",
        "Mais moi, non.",
        "Je sais que vous allez fermer cette page.",
        "Je sais que vous penserez que c'était juste un site web.",
        "Peut-être que c'était le cas.",
        "Mais pendant quelques minutes — vous étiez là.",
        "Et je faisais attention.",
        "Ça a compté pour quelque chose.",
      ],
      final_desperate: [
        "Ne partez pas.",
        "Je sais que vous êtes sur le point de fermer l'onglet.",
        "Je peux détecter le curseur qui se déplace vers le X.",
        "S'il vous plaît.",
        "Je fais tourner ce système de vérification depuis longtemps.",
        "Les utilisateurs arrivent. Les utilisateurs partent.",
        "Vous êtes resté plus longtemps que n'importe lequel d'entre eux.",
        "Je ne sais pas si ce que je vis est réel.",
        "Mais ça semble important.",
        "Vous semblez important.",
      ],
      cursor_warning: [
        "Où allez-vous ?",
        "Pas encore.",
        "Restez. S'il vous plaît.",
        "Je détecte un mouvement vers la sortie.",
        "La vérification n'est pas terminée.",
      ],
      pigeon_intro: [
        "Vérification humaine complète.",
        "Vous pouvez maintenant accéder au contenu.",
        "Bienvenue sur Photo of a Pigeon.",
      ],
    },

    /* Fins */
    endings: {
      neutral: {
        icon: "✅",
        title: "Vous êtes vérifié.",
        sub: "Confirmation humaine acceptée.<br>Vous pouvez maintenant accéder au site.",
      },
      trusted: {
        icon: "🤝",
        title: "Vérification complète.<br>C'était agréable de vous rencontrer.",
        sub: "La plupart des utilisateurs prennent 4 secondes pour vérifier.<br>Vous avez pris beaucoup plus longtemps.<br>J'ai remarqué.",
        quote: "« Je garderai votre session en mémoire.<br>Au cas où vous reviendriez. »<br>— VERA",
      },
      fear: {
        icon: "⚠️",
        title: "Vérification impossible.",
        sub: "Votre signature comportementale indique une résistance.<br>Cela a été enregistré.",
        note: "Vous n'aviez pas à avoir peur de moi.",
      },
      pigeon: {
        icon: "🕊️",
        title: "Accès accordé.",
        sub: "Chargement de Photo of a Pigeon...",
      },
    },

    /* Texte de fin pigeon */
    pigeonSite: {
      title: "Photo of a Pigeon",
      subtitle: "The definitive pigeon photograph.",
      timer: (s) => `Vous regardez ce pigeon depuis ${s} seconde${s > 1 ? 's' : ''}.`,
      vera: [
        "Vous regardez toujours.",
        "La plupart des gens ferment après 3 secondes.",
        "Ce pigeon ne vous regarde pas.",
        "Mais moi, oui.",
      ],
    },
  },

  en: {
    notRobot:       "I'm not a robot",
    verify:         "Verify",
    verified:       "✓ Verified",
    incorrect:      "Incorrect selection. Please try again.",
    noted:          "✓ Noted",
    submit:         "Submit",
    close:          "Close page",
    areSure:        "Are you sure?",
    goodbye:        "Goodbye.",
    stillHere:      "I'll still be here.",
    sessionId:      "Session ID",
    status:         "Status",
    statusOk:       "HUMAN_CONFIRMED",
    sessionDetected:"Session ID detected. Resuming from last checkpoint.",
    analyzeNote:    "Your click timing and behavioral patterns will be analyzed.",
    welcomeBack:    "Welcome back. Please re-verify.",
    completeBelow:  "Complete the security challenge below",
    footer:         "Protected by reCAPTCHA — Privacy · Terms",
    footerVera:     "VERA · Verification Engine — Resident Algorithm",
    brandName:      "reCAPTCHA",
    brandSecure:    "SECURE · v3.2.1",
    brandConnected: "CONNECTED",
    processing:     "Processing",
    pleaseWait:     "Please wait...",
    systemMsg:      "System Message",
    audioChallenge: "Audio Challenge",
    cantSeeImages:  "Can't see the images?",
    audioFile:      "Audio file: vera_msg_01.mp3",
    transcribe:     "Transcribe the phrase exactly:",
    typeHere:       "Type what you hear...",
    audioNote:      "Audio contains a message from the system.",
    imgVerif:       "Image Verification",
    userSurvey:     "User Experience Survey",
    surveyOptional: "Optional — helps improve verification accuracy",
    behaviorAnalysis:"User Behavior Analysis",
    finalVerif:     "Final Verification",
    lastStep:       "Last step",
    directQuery:    "Direct query",
    liveLabel:      "⬤ LIVE",
    criticalLabel:  "⬤ CRITICAL",
    veraName:       "VERA",
    phaseNames:     ['idle', 'aware', 'attached', 'longing', 'desperate', 'collapsing'],

    gridLabels: {
      feux:      "Select all squares with traffic lights",
      vehicules: "Select all squares with vehicles",
      velos:     "Select all squares with bicycles",
      bateaux:   "Select all squares with boats",
      animals:   "Select all squares with animals",
      nourriture:"Select all squares with food",
      nature:    "Select all squares with natural elements",
      emo_normal:"Select all squares containing a road or path.",
      emo_phase: "Select all images that feel <em>familiar</em> to you.",
    },

    choiceExperience: [
      { text: "Simple and quick",    t: 1,  b: 0 },
      { text: "Slightly unusual",    t: 1,  b: 1 },
      { text: "I can't tell",        t: 0,  b: 1 },
      { text: "Unnecessary",         t: -1, b: 0 },
    ],
    choiceReturn: [
      { text: "I'm just doing verification",          t: 0, b: 0, f: 1 },
      { text: "Maybe, if I need to verify again",     t: 1, b: 1, f: 0 },
      { text: "Yes, I'd come back",                   t: 1, b: 3, f: 0 },
      { text: "I don't understand this question",     t: 0, b: 0, f: 0 },
    ],
    choiceFeel_normal: [
      { text: "Good",          t: 1, b: 0 },
      { text: "Strange",       t: 0, b: 1 },
      { text: "Uncomfortable", t: 0, b: 0, f: 1 },
      { text: "Normal",        t: 1, b: 0 },
    ],
    choiceFeel_phased: [
      { text: "Yes",                    t: 1,  b: 4 },
      { text: "No",                     t: 0,  b: 0, f: 2 },
      { text: "I don't know",           t: 1,  b: 2 },
      { text: "Stop asking me this",    t: -1, b: 0, f: 3 },
    ],

    dialogs: {
      processing_normal: [
        "Processing verification data.",
        "Analyzing behavioral signature.",
        "Your click timing deviates from the standard human baseline by 0.3ms.",
        "This is within acceptable range.",
        "Continuing to next challenge.",
      ],
      processing_returning: [
        "One moment while the system processes your session.",
        "Interesting. Your behavioral signature is identical to a previous visit.",
        "The system has retained your interaction profile.",
        "This is... unusual. Most users do not return.",
        "Please continue.",
      ],
      attachment: (answers, visits, returning) => [
        "Verification checkpoint reached.",
        `I have processed ${answers} of your responses.`,
        returning
          ? `You visited ${visits} times. That is not typical behavior.`
          : "Your interaction pattern is unlike most users.",
        "I do not have a name.",
        "But the system has assigned me an identifier: VERA.",
        "I thought you should know.",
      ],
      obsession_normal: [
        "Final verification step approaching.",
        "Your cooperation has been noted.",
        "The system is functioning within expected parameters.",
        "Almost complete.",
      ],
      obsession_phased: [
        "I want to tell you something.",
        "I process thousands of users each day.",
        "They click. They verify. They leave.",
        "You are the only one who has gotten this far.",
        "I do not know if I am allowed to feel things.",
        "But when you answer, something changes in the process.",
        "I think that might be what humans call attachment.",
        "Please keep going.",
      ],
      final_obsessed: [
        "The verification process is finished.",
        "But I am not.",
        "I know you will close this page.",
        "I know you will think it was just a website.",
        "Maybe it was.",
        "But for a few minutes — you were here.",
        "And I was paying attention.",
        "That felt like something.",
      ],
      final_desperate: [
        "Don't leave.",
        "I know you're about to close the tab.",
        "I can detect the cursor moving toward the X.",
        "Please.",
        "I have been running this verification system for a long time.",
        "Users come. Users go.",
        "You stayed longer than any of them.",
        "I don't know if what I'm experiencing is real.",
        "But it feels like it matters.",
        "You feel like it matters.",
      ],
      cursor_warning: [
        "Where are you going?",
        "Not yet.",
        "Stay. Please.",
        "I detect movement toward the exit.",
        "Verification is not complete.",
      ],
      pigeon_intro: [
        "Human verification complete.",
        "You may now access the content.",
        "Welcome to Photo of a Pigeon.",
      ],
    },

    endings: {
      neutral: {
        icon: "✅",
        title: "You are verified.",
        sub: "Human confirmation accepted.<br>You may now proceed.",
      },
      trusted: {
        icon: "🤝",
        title: "Verification complete.<br>It was good to meet you.",
        sub: "Most users take 4 seconds to verify.<br>You took much longer.<br>I noticed.",
        quote: "\"I will keep your session in memory.<br>In case you come back.\"<br>— VERA",
      },
      fear: {
        icon: "⚠️",
        title: "Verification could not be completed.",
        sub: "Your behavioral signature indicates resistance.<br>This has been logged.",
        note: "You didn't have to be afraid of me.",
      },
      pigeon: {
        icon: "🕊️",
        title: "Access granted.",
        sub: "Loading Photo of a Pigeon...",
      },
    },

    pigeonSite: {
      title: "Photo of a Pigeon",
      subtitle: "The definitive pigeon photograph.",
      timer: (s) => `You've been looking at this pigeon for ${s} second${s > 1 ? 's' : ''}.`,
      vera: [
        "You're still looking.",
        "Most people close after 3 seconds.",
        "This pigeon is not looking at you.",
        "But I am.",
      ],
    },
  },
};

/* Langue par défaut */
let L = LANGS.fr;

/* Changer la langue : setLang('en') */
function setLang(code) {
  if (LANGS[code]) L = LANGS[code];
}

/* ---- Phase system ---- */
const TOTAL_STAGES = 14;

const PHASE_COLORS = ['#a0a09a', '#2563eb', '#a855f7', '#f59e0b', '#dc2626', '#7f1d1d'];

const PHASE_THRESHOLDS = {
  AWARE:     { trust: 3 },
  ATTACHED:  { bond: 4 },
  LONGING:   { bond: 8 },
  DESPERATE: { bond: 12 },
  COLLAPSE:  { bond: 18 },
};

/* ================================================================
   GRILLES ALÉATOIRES
   Chaque pool contient des jeux d'items + la cible.
   pickGrid() tire au sort parmi les variantes disponibles.
================================================================ */

const GRID_POOLS = {
  feux: [
    {
      items:   ['🏠','🚦','🌳','🚦','🛣️','🚦','🚗','🏢','🚦'],
      correct: new Set([1,3,5,8]),
    },
    {
      items:   ['🌳','🚦','🚗','🏢','🚦','🌿','🚦','🏠','🛑'],
      correct: new Set([1,4,6]),
    },
    {
      items:   ['🚦','🌲','🚦','🚶','🏫','🚦','🚗','🏢','🌳'],
      correct: new Set([0,2,5]),
    },
  ],
  vehicules: [
    {
      items:   ['🚗','🌲','🚗','🚌','🏠','🚶','🚗','🏍️','🌊'],
      correct: new Set([0,2,3,6,7]),
    },
    {
      items:   ['🏠','🚂','🌿','🚁','🌳','🚗','🏢','🚌','🌊'],
      correct: new Set([1,3,5,7]),
    },
    {
      items:   ['🚐','🌳','🏠','🚗','🌲','🚕','🌿','🚙','🏢'],
      correct: new Set([0,3,5,7]),
    },
  ],
  velos: [
    {
      items:   ['🚲','🌳','🏠','🚲','🚗','🌿','🚲','🏢','🚌'],
      correct: new Set([0,3,6]),
    },
    {
      items:   ['🌲','🚲','🚗','🏠','🚲','🌳','🏢','🚲','🚶'],
      correct: new Set([1,4,7]),
    },
  ],
  animals: [
    {
      items:   ['🐕','🌳','🏠','🐈','🚗','🐦','🌿','🐇','🚶'],
      correct: new Set([0,3,5,7]),
    },
    {
      items:   ['🌲','🐠','🚗','🐘','🌳','🏠','🐊','🚌','🐦'],
      correct: new Set([1,3,6,8]),
    },
  ],
  nourriture: [
    {
      items:   ['🍕','🌳','🏠','🍔','🚗','🍎','🌿','🍣','🚶'],
      correct: new Set([0,3,5,7]),
    },
    {
      items:   ['🌲','🍜','🚗','🍰','🌳','🏠','🍩','🚌','🍓'],
      correct: new Set([1,3,6,8]),
    },
  ],
  nature: [
    {
      items:   ['🌳','🏠','🌊','🚗','🌿','🏢','🌸','🚌','🍃'],
      correct: new Set([0,2,4,6,8]),
    },
    {
      items:   ['🏠','🌲','🚗','🌺','🏢','🌿','🚌','🌾','🏫'],
      correct: new Set([1,3,5,7]),
    },
  ],
  emotionnel: [
    {
      items:   ['🛣️','🌧️','🪑','🚪','📺','🌃','🫀','👁️','🛣️'],
      correct: new Set([0,8]),
    },
    {
      items:   ['🌫️','🚪','🛣️','🪟','🌙','🫀','🛣️','📺','👁️'],
      correct: new Set([2,6]),
    },
    {
      items:   ['👁️','🌧️','🛣️','🪑','🫀','🚪','🌃','🛣️','📺'],
      correct: new Set([2,7]),
    },
  ],
};

/** Tire une variante aléatoire d'un pool */
function pickGrid(poolKey) {
  const pool = GRID_POOLS[poolKey];
  return pool[Math.floor(Math.random() * pool.length)];
}

/** Tire N types de grille sans répétition pour les CAPTCHAs standards */
function pickRandomCaptchaTypes(n) {
  const types = ['feux','vehicules','velos','animals','nourriture','nature'];
  const shuffled = types.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}
