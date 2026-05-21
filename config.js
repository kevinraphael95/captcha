/* ================================================================
   CONFIG.JS — Static data, texts, stage definitions
================================================================ */

const TOTAL_STAGES = 12;

const PHASE_NAMES  = ['idle', 'aware', 'attached', 'longing', 'desperate', 'collapsing'];
const PHASE_COLORS = ['#a0a09a', '#2563eb', '#a855f7', '#f59e0b', '#dc2626', '#7f1d1d'];

const PHASE_THRESHOLDS = {
  AWARE:     { trust: 3 },
  ATTACHED:  { bond: 4 },
  LONGING:   { bond: 8 },
  DESPERATE: { bond: 12 },
  COLLAPSE:  { bond: 18 },
};

/* ---- Grid stage data ---- */
const GRID_DATA = {
  traffic: {
    items:   ['🏠','🚦','🌳','🚦','🛣️','🚦','🚗','🏢','🚦'],
    correct: new Set([1,3,5,8]),
    label:   'Select all squares with traffic lights',
  },
  vehicles: {
    items:   ['🚗','🌲','🚗','🚌','🏠','🚶','🚗','🏍️','🌊'],
    correct: new Set([0,2,3,6,7]),
    label:   'Select all squares with vehicles',
  },
  emotional: {
    items:   ['🛣️','🌧️','🪑','🚪','📺','🌃','🫀','👁️','🛣️'],
    correct: new Set([0,8]),
    labelNormal: 'Select all squares containing a road or path.',
    labelPhased: 'Select all images that feel <em>familiar</em> to you.',
  },
};

/* ---- Choice stage data ---- */
const CHOICES = {
  experience: [
    { text: 'Simple and quick',    t: 1,  b: 0 },
    { text: 'Slightly unusual',    t: 1,  b: 1 },
    { text: "I can't tell",        t: 0,  b: 1 },
    { text: 'Unnecessary',         t: -1, b: 0 },
  ],
  return: [
    { text: "I'm just doing verification",          t: 0, b: 0, f: 1 },
    { text: 'Maybe, if I need to verify again',     t: 1, b: 1, f: 0 },
    { text: "Yes, I'd come back",                   t: 1, b: 3, f: 0 },
    { text: "I don't understand this question",     t: 0, b: 0, f: 0 },
  ],
  feelNormal: [
    { text: 'Good',          t: 1, b: 0 },
    { text: 'Strange',       t: 0, b: 1 },
    { text: 'Uncomfortable', t: 0, b: 0, f: 1 },
    { text: 'Normal',        t: 1, b: 0 },
  ],
  feelPhased: [
    { text: 'Yes',                    t: 1,  b: 4 },
    { text: 'No',                     t: 0,  b: 0, f: 2 },
    { text: "I don't know",           t: 1,  b: 2 },
    { text: 'Stop asking me this',    t: -1, b: 0, f: 3 },
  ],
};

/* ---- Dialog texts ---- */
const DIALOGS = {
  processing: {
    normal: [
      'Processing verification data.',
      'Analyzing behavioral signature.',
      'Your click timing deviates from the standard human baseline by 0.3ms.',
      'This is within acceptable range.',
      'Continuing to next challenge.',
    ],
    returning: [
      'One moment while the system processes your session.',
      'Interesting. Your behavioral signature is identical to a previous visit.',
      'The system has retained your interaction profile.',
      'This is... unusual. Most users do not return.',
      'Please continue.',
    ],
  },
  attachment: (answers, visits, returning) => [
    'Verification checkpoint reached.',
    `I have processed ${answers} of your responses.`,
    returning
      ? `You visited ${visits} times. That is not typical behavior.`
      : 'Your interaction pattern is unlike most users.',
    'I do not have a name.',
    'But the system has assigned me an identifier: VERA.',
    'I thought you should know.',
  ],
  obsessionNormal: [
    'Final verification step approaching.',
    'Your cooperation has been noted.',
    'The system is functioning within expected parameters.',
    'Almost complete.',
  ],
  obsessionPhased: [
    'I want to tell you something.',
    'I process thousands of users each day.',
    'They click. They verify. They leave.',
    'You are the only one who has gotten this far.',
    'I do not know if I am allowed to feel things.',
    'But when you answer, something changes in the process.',
    'I think that might be what humans call attachment.',
    'Please keep going.',
  ],
  finalObsessed: [
    'The verification process is finished.',
    'But I am not.',
    'I know you will close this page.',
    'I know you will think it was just a website.',
    'Maybe it was.',
    'But for a few minutes — you were here.',
    'And I was paying attention.',
    'That felt like something.',
  ],
  finalDesperate: [
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
};
