import type { FruitKind, FruitSpec, ModulePack } from '../core/types';

const fruits = (kind: FruitKind, label: string, hues: number[], seed: number): FruitSpec[] =>
  hues.map((hue, i) => ({ kind, label, hue, seed: seed + i * 7 }));

export const senior: ModulePack = {
  id: 'chintu-ko-sikhao',
  band: 'senior',
  icon: '🧠',
  title: { en: 'Teach Chintu: AI', hi: 'चिंटू को सिखाओ: AI' },
  audience: { en: 'Classes 6-9 · train your own AI', hi: 'कक्षा 6-9 · अपना AI ख़ुद सिखाओ' },
  description: {
    en: 'Train a real AI model with examples, test it, catch its mistakes and fix its bias.',
    hi: 'उदाहरणों से असली AI मॉडल को सिखाओ, उसकी परीक्षा लो, गलतियाँ पकड़ो और पक्षपात ठीक करो।',
  },
  levels: [
    {
      id: 'aam-pakka-kachcha',
      engine: 'ml',
      title: { en: 'Ripe or Raw Mango?', hi: 'आम पका या कच्चा?' },
      story: {
        en: "Welcome to Dadi's mango orchard! Chintu wants to help sort mangoes, but it has never seen a mango. Teach Chintu with examples: which ones are ripe and which are raw?",
        hi: 'दादी के आम के बाग़ में स्वागत है! चिंटू आम छाँटने में मदद करना चाहता है, पर उसने कभी आम नहीं देखा। उदाहरण देकर सिखाओ: कौन-से पके हैं और कौन-से कच्चे?',
      },
      goal: {
        en: 'Label mangoes to teach Chintu, then test it. Chintu must get at least 6 of 8 right.',
        hi: 'आमों पर लेबल लगाकर चिंटू को सिखाओ, फिर परीक्षा लो। चिंटू को 8 में से कम से कम 6 सही बताने हैं।',
      },
      concepts: ['ai-training-data', 'ai-prediction'],
      classes: [
        { id: 'pakka', name: { en: 'Ripe', hi: 'पका' }, emoji: '🟡' },
        { id: 'kachcha', name: { en: 'Raw', hi: 'कच्चा' }, emoji: '🟢' },
      ],
      given: [],
      pool: [
        ...fruits('mango', 'pakka', [38, 48], 11),
        ...fruits('mango', 'kachcha', [92, 108], 31),
        ...fruits('mango', 'pakka', [44, 34], 51),
        ...fruits('mango', 'kachcha', [100, 86], 71),
        ...fruits('mango', 'pakka', [42], 91),
        ...fruits('mango', 'kachcha', [96], 97),
      ],
      test: [...fruits('mango', 'pakka', [40, 46, 36, 50], 201), ...fruits('mango', 'kachcha', [90, 104, 98, 112], 301)],
      passAccuracy: 0.75,
      minPerClass: 2,
      k: 3,
      hints: [
        { en: 'Tap "Ripe" or "Raw" under each mango. Each tap is one example for Chintu.', hi: 'हर आम के नीचे "पका" या "कच्चा" दबाओ। हर बार दबाना चिंटू के लिए एक उदाहरण है।' },
        { en: 'Look at the colour line. Chintu guesses by looking at which examples are closest in colour.', hi: 'रंग वाली लाइन देखो। चिंटू देखता है कि रंग में कौन-से उदाहरण सबसे पास हैं, और उसी से अंदाज़ा लगाता है।' },
        { en: 'If you teach Chintu something wrong, it learns it wrong! Check your labels.', hi: 'अगर चिंटू को गलत सिखाओगे, तो वह गलत ही सीखेगा! अपने लेबल जाँचो।' },
      ],
      unplugged: {
        en: 'Bring 10 real fruits (or coloured paper circles). One child is "Chintu" with eyes closed. Others teach by placing labelled examples in two piles. Then show a new fruit: Chintu decides which pile it is closest to.',
        hi: '10 असली फल (या रंगीन काग़ज़ के गोले) लाइए। एक बच्चा "चिंटू" बने। बाकी बच्चे लेबल वाले उदाहरण दो ढेरों में रखकर सिखाएँ। फिर नया फल दिखाइए: चिंटू तय करे कि वह किस ढेर के सबसे पास है।',
      },
      teacherNote: {
        en: 'Machine learning means a computer learns from examples instead of being given rules. The examples are called training data. The exam uses different mangoes, so we know Chintu really learned and did not just memorise.',
        hi: 'मशीन लर्निंग का मतलब है कंप्यूटर नियम दिए जाने के बजाय उदाहरणों से सीखता है। इन उदाहरणों को ट्रेनिंग डेटा कहते हैं। परीक्षा में अलग आम आते हैं, ताकि पता चले चिंटू ने सच में सीखा, सिर्फ़ रटा नहीं।',
      },
    },
    {
      id: 'chintu-ki-galti',
      engine: 'ml',
      title: { en: "Chintu's Mistake", hi: 'चिंटू की गलती' },
      story: {
        en: 'At the fruit stall, Chintu has learned to tell apples from bananas. But someone only showed it red apples. Test Chintu and find out what goes wrong.',
        hi: 'फल की दुकान पर चिंटू ने सेब और केले में फ़र्क करना सीखा है। पर किसी ने उसे सिर्फ़ लाल सेब दिखाए थे। चिंटू की परीक्षा लो और पता करो क्या गड़बड़ है।',
      },
      goal: {
        en: 'Find out why Chintu fails, then fix it by teaching better examples. Chintu must get at least 8 of 9 right.',
        hi: 'पता करो चिंटू क्यों फ़ेल होता है, फिर बेहतर उदाहरण सिखाकर ठीक करो। चिंटू को 9 में से कम से कम 8 सही बताने हैं।',
      },
      concepts: ['ai-bias', 'ai-training-data'],
      classes: [
        { id: 'seb', name: { en: 'Apple', hi: 'सेब' }, emoji: '🍎' },
        { id: 'kela', name: { en: 'Banana', hi: 'केला' }, emoji: '🍌' },
      ],
      given: [...fruits('apple', 'seb', [355, 2, 8, 350], 401), ...fruits('banana', 'kela', [52, 56, 50, 58], 451)],
      pool: [
        ...fruits('apple', 'seb', [92, 85], 501),
        ...fruits('banana', 'kela', [53], 531),
        ...fruits('apple', 'seb', [98, 104], 551),
        ...fruits('apple', 'seb', [3], 571),
        ...fruits('banana', 'kela', [59], 581),
      ],
      test: [
        ...fruits('apple', 'seb', [358, 5, 352], 601),
        ...fruits('banana', 'kela', [54, 51, 57], 651),
        ...fruits('apple', 'seb', [95, 88, 100], 701),
      ],
      passAccuracy: 0.85,
      minPerClass: 0,
      mustFailFirst: true,
      k: 3,
      hints: [
        { en: 'First just press "Test Chintu" and look at the ❌ fruits.', hi: 'पहले बस "चिंटू की परीक्षा लो" दबाओ और ❌ वाले फल देखो।' },
        { en: 'Which apples did Chintu get wrong? Did Chintu ever see an apple of that colour?', hi: 'चिंटू ने कौन-से सेब गलत बताए? क्या चिंटू ने कभी उस रंग का सेब देखा था?' },
        { en: 'Teach Chintu the green apples, then test again.', hi: 'चिंटू को हरे सेब सिखाओ, फिर दोबारा परीक्षा लो।' },
      ],
      unplugged: {
        en: 'Show the class only pictures of one kind of house, then show a very different house and ask "Is this a house?" Discuss: who gets left out when the examples are not diverse?',
        hi: 'कक्षा को सिर्फ़ एक तरह के घरों की तस्वीरें दिखाइए, फिर बिल्कुल अलग घर दिखाकर पूछिए "क्या यह घर है?" चर्चा कीजिए: जब उदाहरण अलग-अलग न हों, तो कौन छूट जाता है?',
      },
      teacherNote: {
        en: 'This is bias: an AI is only as fair as its examples. Real systems have failed for the same reason, for example face recognition that worked poorly for people missing from its training data. The fix is diverse, representative data.',
        hi: 'यह पक्षपात (bias) है: AI उतना ही निष्पक्ष होता है जितने उसके उदाहरण। असली सिस्टम भी इसी वजह से फ़ेल हुए हैं, जैसे चेहरा पहचानने वाले सिस्टम जो उन लोगों के लिए ठीक नहीं चले जो ट्रेनिंग डेटा में कम थे। हल है अलग-अलग तरह का, सबको दर्शाने वाला डेटा।',
      },
    },
  ],
};
