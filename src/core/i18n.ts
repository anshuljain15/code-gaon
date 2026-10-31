import type { Lang, Text } from './types';

export const t = (text: Text, lang: Lang): string => text[lang] || text.en;

const ui = {
  appName: { en: 'Code Gaon', hi: 'कोड गाँव' },
  tagline: {
    en: 'Learn coding and AI by solving problems in a small-town world. Free. Works offline.',
    hi: 'एक छोटे शहर की दुनिया में मुश्किलें सुलझाकर कोडिंग और AI सीखो। मुफ़्त। बिना इंटरनेट भी चलता है।',
  },
  whoIsPlaying: { en: 'Who is playing?', hi: 'कौन खेल रहा है?' },
  newPlayer: { en: 'New player', hi: 'नया खिलाड़ी' },
  nickname: { en: 'Nickname (not your real name)', hi: 'उपनाम (असली नाम नहीं)' },
  pickAvatar: { en: 'Pick your buddy', hi: 'अपना साथी चुनो' },
  start: { en: 'Start', hi: 'शुरू करो' },
  privacy: {
    en: 'No name, phone number or photo is needed. Your progress stays on this phone only.',
    hi: 'नाम, फ़ोन नंबर या फ़ोटो की ज़रूरत नहीं। आपकी प्रगति सिर्फ़ इसी फ़ोन में रहती है।',
  },
  chooseTrack: { en: 'Choose your path', hi: 'अपना रास्ता चुनो' },
  levels: { en: 'levels', hi: 'लेवल' },
  back: { en: 'Back', hi: 'वापस' },
  listen: { en: 'Listen', hi: 'सुनो' },
  goal: { en: 'Your mission', hi: 'आपका मिशन' },
  hint: { en: 'Hint', hi: 'संकेत' },
  noMoreHints: { en: 'No more hints. You can do it!', hi: 'और संकेत नहीं। आप कर सकते हो!' },
  unplugged: { en: 'Play without a phone', hi: 'बिना फ़ोन के खेलो' },
  teacherNote: { en: 'For the teacher', hi: 'शिक्षक के लिए' },
  wellDone: { en: 'Shabaash! Mission complete', hi: 'शाबाश! मिशन पूरा' },
  next: { en: 'Next level', hi: 'अगला लेवल' },
  replay: { en: 'Play again', hi: 'फिर से खेलो' },
  toMap: { en: 'Back to map', hi: 'नक्शे पर वापस' },
  switchPlayer: { en: 'Switch player', hi: 'खिलाड़ी बदलो' },
  voiceOn: { en: 'Voice on', hi: 'आवाज़ चालू' },
  voiceOff: { en: 'Voice off', hi: 'आवाज़ बंद' },
  locked: { en: 'Finish the previous level first', hi: 'पहले पिछला लेवल पूरा करो' },
  offlineReady: { en: 'Ready to work offline', hi: 'अब बिना इंटरनेट भी चलेगा' },
  // Grid engine
  run: { en: 'Run', hi: 'चलाओ' },
  reset: { en: 'Reset', hi: 'फिर से' },
  blocksUsed: { en: 'Blocks used', hi: 'इस्तेमाल किए ब्लॉक' },
  tooManyBlocks: { en: 'Too many blocks! Try a repeat block.', hi: 'बहुत ज़्यादा ब्लॉक! "दोहराओ" ब्लॉक आज़माओ।' },
  crashed: { en: 'Oops! Chintu bumped into a tree. Fix the steps and try again.', hi: 'अरे! चिंटू पेड़ से टकरा गया। कदम ठीक करके फिर कोशिश करो।' },
  notThereYet: { en: 'Chintu stopped before finishing. Add more steps.', hi: 'चिंटू काम पूरा होने से पहले रुक गया। और कदम जोड़ो।' },
  emptyProgram: { en: 'Snap some blocks under "Start" first.', hi: 'पहले "शुरू" के नीचे कुछ ब्लॉक जोड़ो।' },
  // ML engine
  teachChintu: { en: 'Teach Chintu', hi: 'चिंटू को सिखाओ' },
  chintuKnows: { en: 'What Chintu has learned', hi: 'चिंटू ने क्या सीखा है' },
  testChintu: { en: 'Test Chintu', hi: 'चिंटू की परीक्षा लो' },
  examResult: { en: 'Exam result', hi: 'परीक्षा का नतीजा' },
  accuracy: { en: 'Correct', hi: 'सही' },
  sure: { en: 'sure', hi: 'पक्का' },
  howChintuSees: {
    en: 'How Chintu sees: only the colour of the pixels, placed on a line.',
    hi: 'चिंटू कैसे देखता है: सिर्फ़ पिक्सेल का रंग, एक लाइन पर।',
  },
  needMoreExamples: { en: 'Teach at least {n} of each kind first.', hi: 'पहले हर तरह के कम से कम {n} उदाहरण सिखाओ।' },
  biasFound: {
    en: 'Chintu got some wrong! Look at which fruit it missed. What examples did Chintu never see?',
    hi: 'चिंटू ने कुछ गलत बताया! देखो कौन-से फल गलत हुए। चिंटू ने कौन-से उदाहरण कभी नहीं देखे?',
  },
  tryAgainMl: { en: 'Not good enough yet. Teach Chintu more, then test again.', hi: 'अभी काफ़ी नहीं। चिंटू को और सिखाओ, फिर दोबारा परीक्षा लो।' },
  // Terminal engine
  terminalHelp: { en: 'Type a command and press Enter. Type "help" to see all commands.', hi: 'कमांड लिखो और Enter दबाओ। सारी कमांड देखने के लिए "help" लिखो।' },
  tasks: { en: 'Tasks', hi: 'काम' },
  // Python engine
  loadingPython: { en: 'Loading Python (about 10 MB, only the first time)...', hi: 'Python लोड हो रहा है (लगभग 10 MB, सिर्फ़ पहली बार)...' },
  runTests: { en: 'Run and check', hi: 'चलाओ और जाँचो' },
  output: { en: 'Output', hi: 'आउटपुट' },
  checks: { en: 'Checks', hi: 'जाँच' },
  showSolution: { en: 'Show a solution', hi: 'एक हल दिखाओ' },
  pythonOffline: {
    en: 'Python needs internet the first time. Connect once, then it works offline.',
    hi: 'Python को पहली बार इंटरनेट चाहिए। एक बार जुड़ो, फिर बिना इंटरनेट चलेगा।',
  },
  timedOut: { en: 'Your code ran too long. Is there a loop that never stops?', hi: 'आपका कोड बहुत देर चला। कहीं कोई लूप रुक नहीं रहा?' },
} satisfies Record<string, Text>;

export type UiKey = keyof typeof ui;

export const tr = (key: UiKey, lang: Lang, vars?: Record<string, string | number>): string => {
  let s = t(ui[key], lang);
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.replace(`{${k}}`, String(v));
  return s;
};

export const UI_STRINGS = ui;
