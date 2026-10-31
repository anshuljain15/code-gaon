import type { ModulePack } from '../core/types';

const file = (content: string) => ({ type: 'file' as const, content });

export const realworld: ModulePack = {
  id: 'asli-duniya',
  band: 'realworld',
  icon: '💻',
  title: { en: 'Real-World Coder', hi: 'असली दुनिया का कोडर' },
  audience: { en: 'Class 9-12 & college · tools pros use', hi: 'कक्षा 9-12 और कॉलेज · असली टूल' },
  description: {
    en: 'The terminal, Git and Python: the everyday tools of real software developers.',
    hi: 'टर्मिनल, Git और Python: असली सॉफ़्टवेयर डेवलपर रोज़ इन्हीं टूल से काम करते हैं।',
  },
  levels: [
    {
      id: 'terminal-pehla-din',
      engine: 'terminal',
      title: { en: 'First Day in the Terminal', hi: 'टर्मिनल में पहला दिन' },
      story: {
        en: 'Developers talk to computers by typing commands in a terminal. It looks scary, but it is just a conversation. You are setting up files for the town mela.',
        hi: 'डेवलपर टर्मिनल में कमांड लिखकर कंप्यूटर से बात करते हैं। देखने में डरावना है, पर यह बस एक बातचीत है। आप शहर के मेले के लिए फ़ाइलें तैयार कर रहे हो।',
      },
      goal: { en: 'Finish all 5 tasks using terminal commands.', hi: 'टर्मिनल कमांड से सारे 5 काम पूरे करो।' },
      concepts: ['tools-terminal'],
      home: { 'notes.txt': file('Welcome to Code Gaon!\n'), photos: { type: 'dir', children: {} } },
      tasks: [
        { text: { en: 'See what is in your home folder: ls', hi: 'अपने होम फ़ोल्डर में क्या है देखो: ls' }, check: (s) => s.ran(/^ls(\s|$)/) },
        { text: { en: 'Make a folder called mela: mkdir mela', hi: 'mela नाम का फ़ोल्डर बनाओ: mkdir mela' }, check: (s) => s.at('mela')?.type === 'dir' },
        { text: { en: 'Go inside it: cd mela', hi: 'उसके अंदर जाओ: cd mela' }, check: (s) => s.cwdFromHome === 'mela' },
        { text: { en: 'Create a file stalls.txt: touch stalls.txt', hi: 'stalls.txt फ़ाइल बनाओ: touch stalls.txt' }, check: (s) => s.at('mela/stalls.txt')?.type === 'file' },
        {
          text: { en: 'Write "chaat" into it: echo chaat > stalls.txt', hi: 'उसमें "chaat" लिखो: echo chaat > stalls.txt' },
          check: (s) => {
            const f = s.at('mela/stalls.txt');
            return f?.type === 'file' && f.content.includes('chaat');
          },
        },
      ],
      solution: ['ls', 'mkdir mela', 'cd mela', 'touch stalls.txt', 'echo chaat > stalls.txt'],
      hints: [
        { en: 'Type exactly what is shown after the colon in each task, then press Enter.', hi: 'हर काम में कोलन (:) के बाद जो लिखा है, वही टाइप करो और Enter दबाओ।' },
        { en: 'Lost? Type pwd to see where you are, and ls to see what is around you.', hi: 'रास्ता भूल गए? pwd से देखो आप कहाँ हो, और ls से देखो आस-पास क्या है।' },
        { en: 'Use cat stalls.txt to check what you wrote.', hi: 'cat stalls.txt से देखो आपने क्या लिखा।' },
      ],
      unplugged: {
        en: 'Make "folders" from envelopes and "files" from paper slips. One child is the computer and only follows exact commands like "mkdir mela" (make an envelope labelled mela).',
        hi: 'लिफ़ाफ़ों से "फ़ोल्डर" और काग़ज़ की पर्चियों से "फ़ाइलें" बनाइए। एक बच्चा कंप्यूटर बने और सिर्फ़ सटीक कमांड माने, जैसे "mkdir mela" (mela लिखा लिफ़ाफ़ा बनाओ)।',
      },
      teacherNote: {
        en: 'Every operating system has a terminal: Linux, macOS and Windows (PowerShell). Cloud servers have no screen or mouse, so developers manage them entirely by typing commands.',
        hi: 'हर ऑपरेटिंग सिस्टम में टर्मिनल होता है: Linux, macOS और Windows (PowerShell)। क्लाउड सर्वर में स्क्रीन या माउस नहीं होता, इसलिए डेवलपर उन्हें पूरी तरह कमांड लिखकर चलाते हैं।',
      },
    },
    {
      id: 'git-save-point',
      engine: 'terminal',
      title: { en: 'Git: Save Points for Code', hi: 'Git: कोड के सेव पॉइंट' },
      story: {
        en: 'You are building the mela website. Git is like save points in a game: if something breaks, you can go back. Every company in the world uses it.',
        hi: 'आप मेले की वेबसाइट बना रहे हो। Git गेम के सेव पॉइंट जैसा है: कुछ टूट जाए तो वापस जा सकते हो। दुनिया की हर कंपनी इसे इस्तेमाल करती है।',
      },
      goal: { en: 'Make two commits (save points) in the project.', hi: 'प्रोजेक्ट में दो कमिट (सेव पॉइंट) बनाओ।' },
      concepts: ['tools-git'],
      home: {
        project: { type: 'dir', children: { 'index.html': file('<h1>Code Gaon Mela</h1>\n'), 'README.md': file('# Mela website\n') } },
      },
      tasks: [
        { text: { en: 'Go into the project: cd project', hi: 'प्रोजेक्ट में जाओ: cd project' }, check: (s) => s.cwdFromHome === 'project' },
        { text: { en: 'Start Git here: git init', hi: 'यहाँ Git शुरू करो: git init' }, check: (s) => s.repo !== null },
        { text: { en: 'See what Git notices: git status', hi: 'देखो Git को क्या दिखता है: git status' }, check: (s) => s.ran(/^git status/) },
        {
          text: { en: 'Put all files in the "ready to save" box: git add .', hi: 'सारी फ़ाइलें "सेव के लिए तैयार" डिब्बे में रखो: git add .' },
          check: (s) => !!s.repo && (Object.keys(s.repo.staged).length > 0 || s.repo.commits.length > 0),
        },
        {
          text: { en: 'Save your first checkpoint: git commit -m "first save"', hi: 'पहला चेकपॉइंट सेव करो: git commit -m "first save"' },
          check: (s) => (s.repo?.commits.length ?? 0) >= 1,
        },
        {
          text: {
            en: 'Change a file (echo "Chaat stall" >> index.html), then add and commit again',
            hi: 'एक फ़ाइल बदलो (echo "Chaat stall" >> index.html), फिर दोबारा add और commit करो',
          },
          check: (s) => (s.repo?.commits.length ?? 0) >= 2,
        },
      ],
      solution: [
        'cd project',
        'git init',
        'git status',
        'git add .',
        'git commit -m "first save"',
        'echo "Chaat stall" >> index.html',
        'git add index.html',
        'git commit -m "add chaat stall"',
      ],
      hints: [
        { en: 'Run git status after every step. It always tells you what to do next.', hi: 'हर कदम के बाद git status चलाओ। वह हमेशा बताता है कि आगे क्या करना है।' },
        { en: 'A commit needs a message in quotes: git commit -m "your message"', hi: 'कमिट के लिए मैसेज कोट्स में चाहिए: git commit -m "आपका मैसेज"' },
        { en: 'Use git log to see all your save points.', hi: 'git log से अपने सारे सेव पॉइंट देखो।' },
      ],
      unplugged: {
        en: 'Draw a picture in stages. After each stage, take a photo or trace a copy and write a one-line note on it. That stack of notes is your "git log".',
        hi: 'एक चित्र को हिस्सों में बनाइए। हर हिस्से के बाद उसकी कॉपी बनाकर एक लाइन का नोट लिखिए। नोट्स का वह ढेर आपका "git log" है।',
      },
      teacherNote: {
        en: 'Git is version control: a history of every change. GitHub is a website that stores Git projects online so teams can work together. A GitHub profile is a coding portfolio that recruiters look at.',
        hi: 'Git वर्ज़न कंट्रोल है: हर बदलाव का इतिहास। GitHub एक वेबसाइट है जो Git प्रोजेक्ट ऑनलाइन रखती है ताकि टीमें साथ काम कर सकें। GitHub प्रोफ़ाइल कोडिंग पोर्टफ़ोलियो है जिसे नौकरी देने वाले देखते हैं।',
      },
    },
    {
      id: 'kirana-bill',
      engine: 'python',
      title: { en: 'Kirana Shop Bill (Python)', hi: 'किराना दुकान का बिल (Python)' },
      story: {
        en: "Sharma ji's kirana shop adds bills by hand and makes mistakes. Write a Python function that adds up the bill correctly every time.",
        hi: 'शर्मा जी की किराना दुकान में बिल हाथ से जोड़ते हैं और गलती हो जाती है। एक Python फ़ंक्शन लिखो जो हर बार सही बिल जोड़े।',
      },
      goal: { en: 'Make bill_total(items) return the correct total. All checks must pass.', hi: 'bill_total(items) से सही कुल रकम लौटाओ। सारी जाँच पास होनी चाहिए।' },
      concepts: ['variables', 'loops', 'functions'],
      starter: `# Kirana shop bill / किराना दुकान का बिल
# Each item is (name, price, quantity)
# हर आइटम है: (नाम, दाम, कितने)

def bill_total(items):
    total = 0
    for name, price, qty in items:
        # TODO: add price x qty to total
        pass
    return total


print(bill_total([("chawal", 60, 2), ("dal", 120, 1)]))
`,
      tests: [
        { name: { en: '2 kg rice at ₹60 + 1 kg dal at ₹120 = ₹240', hi: '2 किलो चावल ₹60 + 1 किलो दाल ₹120 = ₹240' }, code: 'assert bill_total([("chawal", 60, 2), ("dal", 120, 1)]) == 240, "Expected 240"' },
        { name: { en: 'An empty bag costs ₹0', hi: 'ख़ाली थैले का बिल ₹0' }, code: 'assert bill_total([]) == 0, "Expected 0 for an empty list"' },
        { name: { en: '10 biscuit packets at ₹5 = ₹50', hi: '10 बिस्किट पैकेट ₹5 वाले = ₹50' }, code: 'assert bill_total([("biscuit", 5, 10)]) == 50, "Expected 50"' },
      ],
      solution: `def bill_total(items):
    total = 0
    for name, price, qty in items:
        total = total + price * qty
    return total


print(bill_total([("chawal", 60, 2), ("dal", 120, 1)]))
`,
      hints: [
        { en: 'Replace "pass" with a line that changes total.', hi: '"pass" की जगह ऐसी लाइन लिखो जो total को बदले।' },
        { en: 'The cost of one item is price * qty.', hi: 'एक आइटम की कीमत है price * qty।' },
        { en: 'total = total + price * qty (keep the 8 spaces in front!)', hi: 'total = total + price * qty (आगे के 8 स्पेस रहने दो!)' },
      ],
      teacherNote: {
        en: 'A variable (total) is a box that holds a value that changes. A function is a reusable machine: put items in, get a total out. The checks are automated tests, which professional developers write for all their code.',
        hi: 'वेरिएबल (total) एक डिब्बा है जिसमें बदलने वाली वैल्यू रहती है। फ़ंक्शन दोबारा इस्तेमाल होने वाली मशीन है: आइटम डालो, कुल रकम पाओ। जाँच ऑटोमैटिक टेस्ट हैं, जो प्रोफ़ेशनल डेवलपर अपने सारे कोड के लिए लिखते हैं।',
      },
    },
    {
      id: 'cricket-scoreboard',
      engine: 'python',
      title: { en: 'Cricket Scoreboard (Python)', hi: 'क्रिकेट स्कोरबोर्ड (Python)' },
      story: {
        en: 'The gully cricket match needs a scoreboard! Every ball is a number of runs, or "W" for a wicket. Use if and else to keep the score.',
        hi: 'गली क्रिकेट मैच को स्कोरबोर्ड चाहिए! हर गेंद पर कुछ रन बनते हैं, या "W" यानी विकेट। if और else से स्कोर रखो।',
      },
      goal: { en: 'Make scoreboard(balls) return (runs, wickets). All checks must pass.', hi: 'scoreboard(balls) से (runs, wickets) लौटाओ। सारी जाँच पास होनी चाहिए।' },
      concepts: ['conditionals', 'loops', 'variables'],
      starter: `# Cricket scoreboard / क्रिकेट स्कोरबोर्ड
# balls is a list like ["1", "4", "W", "0", "6"]
# "W" means wicket (out). Numbers are runs.

def scoreboard(balls):
    runs = 0
    wickets = 0
    for ball in balls:
        # TODO: if ball is "W", add 1 to wickets
        # otherwise, add int(ball) to runs
        pass
    return runs, wickets


print(scoreboard(["1", "4", "W", "0", "6"]))
`,
      tests: [
        { name: { en: '1, 4, W, 0, 6 → 11 runs, 1 wicket', hi: '1, 4, W, 0, 6 → 11 रन, 1 विकेट' }, code: 'assert scoreboard(["1", "4", "W", "0", "6"]) == (11, 1), "Expected (11, 1)"' },
        { name: { en: 'No balls bowled → 0 runs, 0 wickets', hi: 'कोई गेंद नहीं → 0 रन, 0 विकेट' }, code: 'assert scoreboard([]) == (0, 0), "Expected (0, 0)"' },
        { name: { en: 'W, W, 6 → 6 runs, 2 wickets', hi: 'W, W, 6 → 6 रन, 2 विकेट' }, code: 'assert scoreboard(["W", "W", "6"]) == (6, 2), "Expected (6, 2)"' },
      ],
      solution: `def scoreboard(balls):
    runs = 0
    wickets = 0
    for ball in balls:
        if ball == "W":
            wickets = wickets + 1
        else:
            runs = runs + int(ball)
    return runs, wickets


print(scoreboard(["1", "4", "W", "0", "6"]))
`,
      hints: [
        { en: 'Start with: if ball == "W":', hi: 'ऐसे शुरू करो: if ball == "W":' },
        { en: 'The line after if needs 4 more spaces in front than the if.', hi: 'if के बाद वाली लाइन में if से 4 स्पेस ज़्यादा चाहिए।' },
        { en: '"4" is text. int("4") turns it into the number 4.', hi: '"4" टेक्स्ट है। int("4") उसे नंबर 4 बना देता है।' },
      ],
      teacherNote: {
        en: 'Conditionals (if / else) let programs make decisions. Converting text to numbers with int() is something developers do every day when reading data from forms and files.',
        hi: 'कंडीशनल (if / else) से प्रोग्राम फ़ैसले लेते हैं। int() से टेक्स्ट को नंबर बनाना डेवलपर रोज़ करते हैं, जब फ़ॉर्म और फ़ाइलों से डेटा पढ़ते हैं।',
      },
    },
  ],
};
