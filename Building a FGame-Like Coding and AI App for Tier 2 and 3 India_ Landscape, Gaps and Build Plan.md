# Building a Free, Game-Like Coding & AI Web App for Tier 2/3 India: Landscape, Gaps, Design Science, and a Build Plan

**Bottom line:** There is a real gap you can fill. Free world-class tools exist: Scratch, Code.org (now "CodeAI"), Teachable Machine and PictoBlox. But none of them combines four things: a *story-driven Indian game world*, *voice-first Hindi and regional-language narration*, *offline-first performance on a shared low-end Android phone*, and *direct mapping to the new CBSE Computational Thinking & AI curriculum*. Build that combination as an offline-first PWA on Blockly + TensorFlow.js. Pilot it first in a few schools through an NGO partner. Design for DPDP compliance from day one, because the children's-data rules become enforceable in May 2027.

## TL;DR
- **The market moment is now.** CBSE Circular Acad-15/2026 (1 April 2026) made Computational Thinking & AI part of the curriculum for Classes 3–8 from 2026–27. That means 50 hours a year in Classes 3–5 and 100 hours in Classes 6–8. It is platform-agnostic and explicitly recommends free and open-source tools. Yet only 64.7% of schools have computers and 63.5% have internet (UDISE+ 2024–25). Teachers are being asked to teach something they have no resources for. That is your wedge.
- **The gap is not "more coding content."** Existing free tools are English-first or translated-but-not-localized. Most assume a laptop, an internet connection and a skilled teacher. Their AI lessons, such as AI for Oceans, are excellent but short one-offs. Rural children have phones: ASER 2024 found 89.1% of rural 14–16-year-olds have a smartphone at home. But only 57% used it for education in the past week, versus 76% for social media. Girls are less likely to own one (26.9% vs 36.2%).
- **Build:** "Mission mode" story quests set in Indian life (a village mela, a cricket match, a railway station, a kirana shop). Use Hindi voice narration, block coding (Blockly) and "train-your-own-AI" mini-games that run fully in the browser. Make it work offline on a shared phone, add a lightweight teacher/"didi" mode, and ship WhatsApp nudges for parents. Ship a 10-level MVP in about 12 weeks and pilot it in 3–5 schools with an NGO. Measure learning with a pre/post computational-thinking test before you scale.

---

## Assumptions (and how changing them changes the plan)

| Assumption | If different… |
|---|---|
| Learners are Classes 3–9 (about ages 8–14), in two bands: **Junior (Classes 3–5)** and **Senior (Classes 6–9)** | If you target Classes 1–2, you need icon-only, ScratchJr-style blocks and almost no text. If you target Classes 9–12, add Python and text-coding bridges earlier. |
| Hindi first, then 2–3 regional languages, plus English | If you start in a southern state, swap Hindi for Tamil, Telugu or Kannada as the launch language. The architecture is the same. |
| Low-end Android phones (2–3 GB RAM, Android 8+), often shared within a family; limited data; patchy internet; some school computer labs | If your pilot schools have working labs or Atal Tinkering Labs, a desktop-first classroom mode can come earlier. |
| Used at home and in classrooms | If you are school-only, you can lean on teacher-led flows and defer the parent features. |
| You run it as a free, non-commercial project, possibly a Section 8 company or a trust later | If you go commercial or freemium, you lose some Bhashini/NGO goodwill and face more DPDP scrutiny. |

---

## 1. Landscape: What Exists for Free (and What Each Actually Delivers)

### Comparison table

| Tool | What it does well | Indian-language support | Offline / low-bandwidth | Device needs | Cost | Teacher dependence |
|---|---|---|---|---|---|---|
| **Scratch (MIT)** | The gold standard for creative block coding. "Low floor, high ceiling, wide walls." Huge community. | Interface translated into many languages, Hindi included. Projects and tutorials are mostly English. | **Yes**, via the Scratch app (Windows 10+, macOS 10.13+, ChromeOS, Android 6.0+) | Works on phones but is cramped. Best on a tablet or laptop. | Free | Medium-high. Open-ended, so beginners need structure.\[1\] |
| **ScratchJr** | Icon-based blocks that pre-readers can use, ages 5–7 | Limited | **Yes**, works offline once installed | Android 5+ **tablets with screens of 7 inches or more**. Not phone-friendly. | Free | Medium\[2\]\[3\] |
| **Code.org / CodeAI** (Hour of Code, now "Hour of AI"; AI for Oceans; Dance Party AI; Mix & Move with AI) | Polished, game-like, curriculum-backed. AI for Oceans has the child train a real ML model (MobileNet transfer learning) and has logged over 1 million completions. | Strong. AI for Oceans and other Hour of AI tutorials come in Hindi, Marathi, Tamil, Telugu, Kannada, Gujarati, Odia and more. | Mostly online | Browser; laptop preferred | Free | Low for single tutorials, high for full courses\[4\]\[5\] |
| **Google CS First** | Was a structured Scratch curriculum | — | — | — | **Shut down 30 June 2025**; all data deleted. Raspberry Pi's "Experience CS" is the suggested successor. | —\[6\] |
| **Blockly Games (Google)** | Self-paced puzzle progression (maze, bird, turtle) that ends with a JavaScript bridge | Many translations | Can be downloaded and self-hosted | Any browser | Free, open source | Low |
| **Teachable Machine (Google)** | Train image, sound or pose classifiers in the browser with no code. The best concrete "AI learns from examples" experience. | Mostly English | Needs internet to load. Training then runs in the browser. | A webcam/camera makes it far better | Free | Medium. Children need framing to understand it. |
| **Machine Learning for Kids** (Dale Lane, IBM-origin) | Train models, then use them in Scratch projects. A good bridge from ML to coding. | Mostly English | Online | Laptop preferred | Free | Medium-high |
| **MIT App Inventor** | Build real Android apps with blocks; for older children | Some translations | Online | Laptop + phone | Free | High |
| **Microsoft MakeCode** | Block-to-JavaScript/Python editors, plus hardware (micro:bit) and Minecraft integration | Many translations | Partly offline-capable web editor | Laptop preferred; hardware optional | Free (hardware costs money) | Medium-high |
| **Lightbot / CodeMonkey / Kodable / Tynker (free tiers)** | Very game-like sequencing and loop puzzles | Mostly English | Varies | Tablet or laptop | Freemium. Deeper content is paywalled. | Low-medium |
| **Day of AI (MIT RAISE) / AI4K12 "Five Big Ideas"** | Free AI-literacy curricula and frameworks. AI4K12's five big ideas (perception, representation & reasoning, learning, natural interaction, societal impact) are a good backbone for your AI track. | English-first | Printable lesson plans | Varies | Free | **High**: designed for teacher delivery |
| **PictoBlox (STEMpedia, India)** | A Scratch-like editor with AI/ML, robotics and Python extensions; about 950k Android downloads | **Hindi** interface added | Installable app | Android 6.0+, ~82 MB APK | Free for individuals and non-commercial use; proprietary | Medium-high; tied to the hardware ecosystem\[7\]\[8\] |
| **CBSE/Intel "AI For All," YUVA AI for All, Microsoft Learn** | Awareness-level AI courses with certificates | Some Hindi | Online | Phone OK | Free | Low, but passive (video and reading)\[9\] |
| **DIKSHA / PM eVidya** | Government content distribution at scale, linked to textbooks via QR codes, with TV/radio channels | Many Indian languages | DIKSHA app supports downloaded content | Phone | Free | Medium. Content is mostly textbook-style, not interactive coding games. |
| **Kolibri (Learning Equality)** | An **offline-first**, MIT-licensed learning platform with peer-to-peer sync. Runs on low-cost hardware and is used in 220+ countries. Its predecessor KA Lite reached 6 million users by 2018. | Any language the content supports | **Best in class** | Runs on cheap servers or Raspberry Pi | Free, open source | Medium\[10\]\[11\]\[12\] |
| **Paid Indian edtech: WhiteHat Jr, Codingal, Camp K12, BrightChamps** | Live 1:1 or small-group classes with human tutors | English/Hindi tutors | Live video, so data-heavy | Laptop or phone + data | Paid; free *trial* lessons only\[13\] | High (tutor-led)\[14\] |

### What the landscape tells you
1. **The best AI-for-kids experiences are short, English-centric one-offs.** AI for Oceans is the only major one that is well-localized into Indian languages. Even it is one hour long, not a learning journey.
2. **Teacher-dependence is the hidden cost of "free."** Day of AI, App Inventor, ML for Kids and Scratch curricula all assume a capable facilitator. That is exactly what Tier 2/3 schools lack.
3. **Big-company free products can disappear.** Google retired CS First on 30 June 2025 and deleted all user data.\[6\] Your users and partners will value an open-source, community-governed tool that won't vanish. Make this part of your pitch.
4. **Paid Indian coding edtech damaged trust.** Byju's bought WhiteHat Jr in 2020 at an enterprise value of $300 million. TechCrunch reported on 22 February 2023 that it drew criticism for "misleading claims, quality of teaching and aggressive tactics," and that Byju's "was until recently spending about $14 million a month on the coding platform," citing one of its sources. Many Tier 2/3 parents now link "coding for kids" with upselling. A *genuinely free, no-ads, no-sales-calls* tool is itself a differentiator. Say so loudly.

---

## 2. Gap Analysis: What Is Missing for Tier 2/3 India

### 2.1 The syllabus has arrived; the capacity has not
- **CBSE Circular Acad-15/2026** (dated 1 April 2026) launched the *Curriculum Framework for Computational Thinking and AI for Classes III–VIII* from the 2026–27 session. The Ministry of Education had announced the plan on 30 October 2025. An expert committee chaired by **Dr. Karthik Raman (IIT Madras)** drafted it.\[15\]\[16\]
- In Classes 3–5, CT is embedded in Mathematics and The World Around Us (TWAU) through workbooks, games and puzzles (**50 hours a year**). Classes 6–8 add AI literacy and interdisciplinary projects (**100 hours a year**). Assessment is project-based, with no board exam.\[17\]
- Critically, the framework is **"without dependence on any platform"** and "recommends harnessing the potential of free and open source." It says "Mathematics and other subject teachers will deliver" the CT syllabus in Classes 3–5.\[17\] In other words, maths teachers with no CS training. **This is the single most important fact for your product.** You are not fighting the syllabus; you are the missing delivery vehicle for it.
- State boards are not uniformly on this timeline yet. Map to CBSE first (the clearest learning outcomes), then to NCF-SE 2023 competencies, which state boards follow.

### 2.2 Infrastructure: phones yes, labs partly, data unreliable
- **School infrastructure (UDISE+ 2024–25, 14.71 lakh schools):** 64.7% have computers (up from 47.7% in 2022–23), but Arun C. Mehta's analysis of the UDISE+ 2024–25 data finds only 58.0% of schools have computers functional for pedagogy. 63.5% have internet. State variation is huge: the same analysis puts computer availability at 25.2% in Bihar and 25.1% in West Bengal versus 99.9% in Delhi and 99.5% in Kerala.
- **Home devices (ASER 2024, 6,49,491 children in 17,997 villages across 605 rural districts):** Rural household smartphone ownership rose from 36% (2018) to 84% (2024). Per ASER Centre's national findings, 89.1% of 14–16-year-olds have a smartphone at home, and 82.2% can use one. But only 57% used it for education in the past week, versus 76% for social media. Only 31.4% of those who can use a smartphone *own* one.
- **Implication:** Design for a *shared family phone that the child borrows for 15–30 minutes in the evening*. That means small downloads, offline play, multiple child profiles per device, and no reliance on a webcam or mic for core levels.

### 2.3 Foundational literacy is the silent constraint
ASER 2024 reports that only **23.4% of Class 3 government-school children could read a Class 2 text** (up from 16.3% in 2022).\[18\] A text-heavy coding app will fail most Class 3–5 learners. **Voice narration, icons and minimal text are not nice-to-haves; they are prerequisites.**

### 2.4 Girls' access
- ASER 2024: among 14–16-year-olds who can use a smartphone, **36.2% of boys vs 26.9% of girls own one**. On survey day, 70.2% of boys vs 62.2% of girls could get hold of a smartphone.\[19\]\[20\]
- NFHS-5 (2019–21): only **24.6% of rural women had ever used the internet**, versus 48.7% of rural men.\[21\]\[22\]\[23\] NFHS-6 (2023–24) shows rapid catch-up: women 64.3% overall, rural women 58.6%, men 80.5%.\[24\]\[25\] Mothers are increasingly reachable, but the gap persists.\[24\]\[26\]
- **Design implications:** offline play so girls can use a phone without spending data; content that features girl protagonists; classroom and group modes that don't require device ownership; and parent messaging aimed at mothers.

### 2.5 Other missing pieces
| Gap | Evidence / observation | What it means for you |
|---|---|---|
| **Cultural relevance** | Existing tools use oceans, dance parties and Western cartoon characters | Indian contexts: cricket scoring, mela stalls, Diwali rangoli patterns, railway timetables, kirana billing, sorting crops, monsoon weather |
| **AI made concrete** | Mertala et al.'s study of 197 Finnish students (Grades 4–9) found only 34.0% understood ML as "teaching machines"; 37.1% thought it meant "learning via or about machines" | Children must *train, test and break* a model themselves, with local examples |
| **Teacher capability** | The CBSE framework hands CT to maths teachers in Classes 3–5 | A "teacher-free" self-play mode plus a zero-prep "play-along" classroom mode |
| **Parent perception** | Coding edtech is associated with upselling; parents prioritise marks | Explicitly show the syllabus link ("this is in your child's CBSE CT & AI syllabus") and send WhatsApp progress messages |
| **Data costs and size** | Shared phones, prepaid data | Initial load under 5 MB; downloadable language/level packs; nothing auto-plays video |

---

## 3. Child Learning Science and Engagement Design

### 3.1 How 8–14-year-olds think, and what follows
- **Piaget:** Ages 7–11 are the *concrete operational* stage. Children reason well about tangible, visible things but struggle with abstraction. From about 11–12, *formal operational* thinking emerges: hypotheses, variables, abstraction. **So the Junior band (Classes 3–5) needs physical metaphors** (a robot walking on a grid, a bullock cart following instructions). **The Senior band can handle variables, conditions and "what if the data were different?"**
- **Papert's constructionism:** Children learn best by *building things they care about*. Seymour Papert's "objects to think with" means the child builds the cricket scoreboard rather than reading about variables.
- **Resnick's "low floor, high ceiling, wide walls"** (the Scratch philosophy): Easy to start, a lot of room to grow, and many different kinds of projects. Mitchel Resnick's "4 Ps" are **Projects, Passion, Peers, Play**. Use them as your design checklist.
- **Teaching at the Right Level:** Pratham's TaRL work and the Mindspark evidence both show that matching content to the child's *actual* level, not their grade, drives gains. In the Delhi Mindspark RCT (619 students), the personalized adaptive software added **0.36σ in math and 0.22σ in Hindi** in about 4.5 months, with the largest relative benefits for the weakest students. Karthik Muralidharan said of the later Rajasthan rollout: "In 15 years of education research, I've never seen something that has had such a large effect in such a short amount of time."\[27\]\[28\] **Lesson: adaptive difficulty is worth more than any shiny game mechanic.** Note the Delhi result came from after-school centres with supervision, and the Rajasthan in-school version showed smaller (about 0.2 SD) but still meaningful gains.\[29\]

### 3.2 Gamification: what works vs. what backfires
The evidence is clear on direction but nuanced on mechanics:
- **It works on average.** Sailer & Homner (2020) found gamification improves learning (g = 0.49), with smaller effects on motivation (g = 0.36) and engagement (g = 0.25). A 2025 K-12 meta-analysis (Kurnaz, *Psychology in the Schools*) found effects on both extrinsic (g = 0.713) and intrinsic (g = 0.638) motivation, with larger learning effects for elementary students.\[30\]\[31\]
- **But rewards can undermine intrinsic motivation.** Deci, Koestner & Ryan's 1999 meta-analysis of 128 experiments found expected, engagement-contingent tangible rewards reduced intrinsic motivation (d ≈ −0.40). Kurnaz's finding that gamification boosts extrinsic motivation *more* than intrinsic is a warning that many implementations are just "points, badges, leaderboards." In Zeng et al.'s 2024 meta-analysis, one stacked combination (levels + awards + badges + leaderboards) even showed a negative effect, though that rests on a single study.\[32\]\[33\]\[34\]

**Design rules that follow:**
| Use | Avoid |
|---|---|
| **Narrative and mission progress** ("help Munni fix the mela's lights") | Global leaderboards that shame weaker kids |
| **Mastery stars per concept** (you earned it by understanding) | Rewards for mere time-on-app |
| **Gentle streaks** with "streak freeze," weekly not daily, framed as "your garden grows" | Punitive daily streaks (Duolingo-style anxiety) on a phone the child doesn't control |
| **Creative unlocks** (new characters and backgrounds for your own projects) | Loot boxes, gacha mechanics, or anything resembling gambling |
| **Class/team goals** ("our class trained 500 AI examples") | Ads, paid boosts, dark patterns |

### 3.3 What the engagement giants actually do well
- **Duolingo:** 3–5-minute bite-size lessons, instant feedback, a forgiving difficulty curve, and a charismatic mascot. *Copy:* short sessions and a mascot. *Don't copy:* guilt-based notifications aimed at children.
- **Prodigy:** Curriculum wrapped in an RPG adventure; adaptive questions; teacher dashboard. *Caution:* heavy membership upselling inside the game, which is exactly what to avoid.
- **Minecraft Education / Roblox:** *Agency and creation.* Children build worlds and share them with peers. *Copy:* sandbox "free build" after each mission. *Avoid:* open chat with strangers.
- **Common thread:** The game *is* the learning. Concepts are the mechanics, not quizzes bolted onto a game.

### 3.4 Voice, story and characters for low-literacy learners
- **Every instruction should be spoken** in the child's language, with replay. Text is optional and secondary.
- **Characters:** A recurring cast of an Indian robot buddy (e.g., "Chintu Bot") and a girl and a boy protagonist from a small town. Add a wise *dadi/nani* who poses puzzles. Use regional festivals and settings that rotate.
- **Stories with stakes the child recognises:** The kirana shop's bill is wrong; the school bus route is too long; the farmer needs to sort good and bad tomatoes; the cricket team needs a scoring system.

### 3.5 Unplugged and social learning
The CBSE framework itself leans on worksheets, puzzles and group work for Classes 3–5.\[17\] Every digital level should have a **printable or no-device "unplugged" twin**: a grid on the floor, children act as "robots" following arrow cards, or sort picture cards to "train" a classmate. This handles the "one phone, 40 kids" classroom and makes the teacher successful without any coding knowledge.

### 3.6 How to teach AI concretely (by age)
Use AI4K12's Five Big Ideas as the spine, with "train it yourself" as the core experience. Studies show children as young as 7 can meaningfully train classifiers in Teachable Machine. A study of 18 Nigerian children aged 3–13, published in *Computer Science Education* (Taylor & Francis, 2023), found they grasped input–output relationships: "the children perfected teaching the teachable machine how to recognise whether they were sad or happy." But children commonly overestimate a model's "reasoning." Design activities that *expose* that limitation.

| Concept | Junior (Classes 3–5) | Senior (Classes 6–9) |
|---|---|---|
| **Patterns & classification** | Sort fruits/vegetables at the sabzi mandi by colour and shape (drag-and-drop) | Train an in-browser image model: "ripe vs unripe mango" or "plastic vs leaf" |
| **Training data** | "Teach Chintu Bot": more examples = better guesses | Watch accuracy change as you add or remove examples; split train vs test data |
| **Bias & fairness** | The bot only saw red apples, so it thinks green apples aren't apples! | The model trained only on photos from one village fails elsewhere. Who is left out? |
| **Prediction & probability** | "Will it rain?" based on cloud pictures | Confidence scores; "the AI is 70% sure" ≠ certain |
| **Rules vs learning** | Coding Chintu with "if-then" blocks vs teaching by example | Compare a hand-coded rule system with a trained model for the same task |
| **Generative AI & ethics** | "Is this picture real?" games | When to trust a chatbot; deepfakes; not sharing personal info with AI |

### 3.7 Progression from blocks to text
1. **Icon blocks** (arrows, repeat), ScratchJr-like: Classes 3–4
2. **Word blocks in the child's language** (Blockly supports translated block labels): Classes 4–6
3. **Blocks with "show me the code"** toggle (Blockly can generate Python and JavaScript): Classes 6–8
4. **Guided text coding** (Python in the browser, e.g., via Pyodide, loaded only on demand): Classes 8–9+

### 3.8 Child safety and privacy (DPDP Act 2023 + Rules 2025)
This is where hobby projects get into trouble. Key facts:
- **Everyone under 18 is a "child"** under the DPDP Act. This is stricter than the US COPPA threshold of 13.\[35\]
- The **DPDP Rules, 2025 (G.S.R. 846(E), dated 13 November 2025)** were notified after 6,915 consultation inputs. **Rule 10** requires "verifiable consent of the parent... before the processing of any personal data of a child." It also requires due diligence that the person consenting is an identifiable adult. This can use identity and age details already held, details provided voluntarily, or "a virtual token... issued by an authorised entity," including **DigiLocker**.\[36\]\[37\]
- **Section 9(3)** of the Act bans tracking, behavioural monitoring and targeted advertising directed at children.\[38\]
- **Timing:** Rule 10 and Section 9 come into force **18 months after publication, around 13 May 2027**. MeitY proposed in January 2026 to shorten timelines to 12 months, but as of October 2026 no notification had changed the dates.\[39\]\[40\]\[41\] Re-check before launch.
- **Exemptions are narrow.** The Fourth Schedule exempts an "educational institution" only for tracking and behavioural monitoring "for the educational activities of such institution" or the safety of children "enrolled with such institution."\[36\] A free edtech web app run by an individual or startup almost certainly does **not** qualify for a general waiver. Being free gives no exemption.\[42\]
- **Penalty:** Breach of children's-data obligations can attract up to **₹200 crore** per contravention.\[43\]

**Practical privacy-by-design approach (strongly recommended):**
1. **Anonymous-by-default play.** No name, phone, email or photo is needed to play. Progress lives on the device (IndexedDB) under a nickname and avatar. If you collect no personal data, most DPDP obligations don't bite.
2. **Opt-in sync only through a parent or teacher.** Cloud backup, certificates or WhatsApp progress reports require the parent to sign up (as the adult account holder), with a consent flow designed to meet Rule 10.
3. **School deployments** go through the school: the teacher creates class codes and children use pseudonymous IDs. Get the school/NGO data-sharing agreement reviewed by a lawyer; don't assume the school's exemption covers you.
4. **Camera and microphone ML runs entirely on-device** (TensorFlow.js). Images are never uploaded. Say so in plain Hindi on the screen.
5. **No ads, no third-party trackers, no open chat, no public profiles.** Sharing is curated (class gallery only, teacher-approved).
6. **Analytics:** aggregate, privacy-preserving, event-level without identifiers. Avoid anything that resembles "behavioural monitoring" of identifiable children.

---

## 4. The Differentiated Product Concept

### Working name: **"Code Gaon" (कोड गाँव)** or **"Chintu Bot ki Duniya"**
*A free, offline-first, voice-led adventure where Indian kids code and train AI to solve problems in a living small-town world.*

### Core pillars
1. **Story world, not a course.** A map of a small Indian town: school, mela ground, railway station, farm, kirana shop, cricket maidan. Each location is a "chapter" teaching one concept through missions. Seasonal events (Diwali lights = loops; Holi colours = variables; monsoon = conditionals) keep it fresh.
2. **Voice-first, in your language.** Every line narrated in Hindi (then Marathi, Bengali, Tamil, Telugu…), with an English toggle. Pre-generate audio using open-source **AI4Bharat Indic-TTS** (13 languages, including Hindi, Marathi, Bengali, Tamil, Telugu, Gujarati, Kannada, Malayalam, Odia) and/or Bhashini APIs.\[44\]\[45\] Then *bundle* the audio into offline packs, so you never depend on live API calls during play.
3. **"Train your own AI" mini-games** with local data: sorting mangoes, recognising rangoli patterns, a "cricket shot classifier" from pose, plastic-vs-leaf for a "Swachh" mission. All of it runs in-browser with TensorFlow.js transfer learning on MobileNet, the same technique AI for Oceans uses.\[5\]
4. **Offline-first PWA** under 5 MB initial load. Works in airplane mode after first visit. Multiple child profiles per shared phone. Also distributable through school labs, Kolibri servers or a USB/SD card for zero-internet schools.
5. **Three modes:**
   - **Solo play** (home, teacher-free; adaptive difficulty)
   - **Class play-along** (the teacher projects or shares one phone; unplugged twin activity; zero prep, with a script in Hindi)
   - **Teacher/"Didi" dashboard** (class code, who's stuck where, printable certificates, mapped to the CBSE CT & AI learning outcomes)
6. **Parent bridge via WhatsApp.** An opt-in weekly voice note or message in Hindi: "Aaj Riya ne loop seekha — usse poochiye ki loop kya hota hai!" Delivered via WhatsApp Business API (Glific, an open-source NGO WhatsApp platform, is worth evaluating).\[46\] This turns parents from sceptics into supporters and reaches mothers.
7. **Syllabus mapping as a feature.** Every mission is tagged to CBSE CT & AI outcomes (decomposition, pattern recognition, abstraction, algorithm design, data, AI ethics). Teachers can show principals "we covered X hours of the CT syllabus." That makes adoption a no-brainer.
8. **Creation and showcase.** After each chapter, a free-build sandbox: make your own mela game or Diwali animation. A class gallery (teacher-moderated). District-level "Code Gaon Utsav" competitions with certificates (parents value certificates).
9. **Plugin architecture for your future builds.** Each mission, mini-game or AI activity is a self-contained "module pack" (manifest + assets + Blockly block definitions + audio). Your future tools plug in as new locations on the map.

### What it deliberately does *not* do
No ads. No upsell. No live chat. No mandatory login. No video-heavy content. No leaderboards beyond opt-in class/team goals.

---

## 5. Practical Build Plan

### 5.1 Recommended tech stack

| Layer | Recommendation | Why |
|---|---|---|
| **App shell** | **PWA** with Vite + **Preact** or **Svelte** (small bundles); TypeScript | Low-end Android performance; installable from browser; no Play Store needed (you can still wrap it as a TWA for Play Store later) |
| **Offline** | **Workbox** service worker; **IndexedDB** (via Dexie) for progress and models; versioned "content packs" downloaded on Wi-Fi | Works in airplane mode; tiny updates |
| **Block coding** | **Google Blockly** (open source, Apache-2.0) with custom blocks, translated block labels and a code generator (JS/Python) | Industry-standard engine behind Scratch-era tools, Code.org and MakeCode |
| **Game rendering** | Lightweight 2D: **Phaser** or plain Canvas/SVG; sprite atlases; 30 fps cap | Smooth on 2 GB RAM phones |
| **In-browser ML** | **TensorFlow.js** + MobileNet (quantized) for transfer learning; KNN classifier for instant training; optional **MediaPipe** for pose/hand | All on-device; no image uploads; the same approach as AI for Oceans and Teachable Machine |
| **Localization** | **i18next** (or FormatJS) with ICU messages; Noto Sans Devanagari and other Indic fonts subset per language | Handles plurals and scripts; small font payloads |
| **Voice** | Pre-generated audio via **AI4Bharat Indic-TTS** (open source) or Bhashini, reviewed by native speakers; Opus/AAC at low bitrate; bundled per language pack | No runtime API dependence (one NGO platform, Glific, moved off Bhashini to Gemini in January 2026, so don't hard-wire to any single provider)\[46\] |
| **Backend (optional, minimal)** | **Firebase** (Hosting + Firestore + Auth for teachers/parents only) *or* **Supabase**; static hosting on **Cloudflare Pages** | Free tiers cover a pilot; the backend only stores opt-in teacher/parent accounts and aggregate stats |
| **Teacher dashboard** | Same PWA, a separate route; class codes; CSV/PDF export | One codebase |
| **WhatsApp** | **Glific** (open source, NGO-focused) or the Meta WhatsApp Business Cloud API | Parent nudges with consent |
| **Analytics** | Self-hosted privacy-first analytics (e.g., Plausible/Umami) + local event logs, uploaded in aggregate | DPDP-friendly |
| **Offline distribution** | Package content as a **Kolibri** channel or static bundle for school labs and Raspberry Pi servers | Zero-internet schools |
| **Licensing** | Code: Apache-2.0 or MIT; content: CC BY-SA | Attracts contributors, CSR and government partners; aligns with CBSE's open-source recommendation |

### 5.2 Architecture for "plug in future modules"
- **Core runtime:** player profile, progress store, audio engine, Blockly host, ML host, reward and map system, i18n.
- **Module pack contract** (JSON manifest): `id`, `targetBand`, `concepts[]`, `cbseOutcomes[]`, `languages[]`, `levels[]` (each with a goal, allowed blocks, starter code, success test, hints, audio keys), `assets`, and optional `mlModel`.
- **Level engine:** each level defines a *world state + allowed blocks + a success checker*. The checker is a pure function, so new modules are just data plus small scripts.
- **Content authoring tool** (Phase 2): a simple admin UI so teachers and NGO staff can author missions in their language without code.
- **Adaptive layer** (Phase 2): track per-concept mastery (e.g., Bayesian knowledge tracing or simple Elo-style scoring) to pick the next level. This is the "teaching at the right level" lesson from Mindspark.

### 5.3 MVP scope: 10 levels across 3 chapters (Hindi + English; Junior and Senior variants)

| # | Location / Story | Concept | Mechanic |
|---|---|---|---|
| 1 | **Ghar se School** (home to school) | Sequencing / algorithms | Drag arrow blocks to guide Chintu Bot through the lanes |
| 2 | **School ki Ghanti** | Debugging | The bot's route is wrong; find and fix the bad step |
| 3 | **Diwali ki Lights** | Loops | Light 10 diyas with a "repeat" block instead of 10 blocks |
| 4 | **Rangoli Maker** | Patterns + nested loops | Create a rangoli; free-build unlock |
| 5 | **Kirana Shop** | Variables | Keep the bill total as items are added |
| 6 | **Baarish Aayi?** (monsoon) | Conditionals (if-else) | If clouds are dark, take an umbrella; if sunny, play cricket |
| 7 | **Cricket Scoreboard** | Variables + events | Code a scoreboard that updates on 4s and 6s |
| 8 | **Sabzi Mandi Sorter** | Classification (unplugged-style) | Sort vegetables by features; "how would a computer decide?" |
| 9 | **Teach Chintu: Aam Pakka ya Kachcha?** | ML training data | Train a classifier (pre-loaded images, camera optional); see accuracy rise |
| 10 | **Chintu ki Galti** (bias) | Bias & fairness | The model trained only on red apples fails on green; fix it by adding diverse data |

Plus: the unplugged twin worksheet (PDF) for each level, a 1-page Hindi teacher script per level, and a pre/post 10-question CT assessment.

**MVP non-negotiables:** works offline after first load; under 5 MB first load; runs on a 2 GB RAM Android Go-class phone; full Hindi voice; no personal data collected for solo play.

### 5.4 Phased roadmap

| Phase | Timeline | Goals | Exit criteria |
|---|---|---|---|
| **0. Discovery** | Weeks 1–3 | 10–15 conversations with teachers, parents and kids in 2–3 Tier 2/3 towns; test paper prototypes; pick the launch language and state | Validated story world and characters; 3 committed pilot schools or an NGO partner |
| **1. MVP build** | Weeks 4–14 | 10 levels, Hindi + English, offline PWA, basic teacher class code | Runs on target phones; kids aged 8–12 complete Levels 1–5 without adult help in usability tests |
| **2. Pilot** | Months 4–7 | 3–5 schools (mix of govt/low-fee private; ensure ≥40% girls), 300–600 children; class play-along + home play | Learning gain on pre/post CT test; ≥30% weekly return at home; teacher NPS |
| **3. Iterate & expand** | Months 7–12 | 30–40 levels; 2 more languages; adaptive difficulty; parent WhatsApp; authoring tool; DPDP-compliant parent consent flow ready before May 2027 | Results report; first CSR/foundation grant; open-source contributors |
| **4. Scale** | Year 2+ | State partnership (SCERT/Samagra Shiksha), DIKSHA content linkage, ATL integration, district competitions | Adoption across 100+ schools; independent evaluation (ideally an RCT with J-PAL South Asia or a university) |

### 5.5 How to pilot and measure learning
- **Design:** Ideally randomize *classes or schools* into "Code Gaon now" vs "Code Gaon next term" (a waitlist control). At minimum, run a pre/post test with a comparison group.
- **Instruments:** A 10–15-item CT assessment adapted from published tools (e.g., Bebras-style tasks; the Computational Thinking test by Román-González). Translate and validate in Hindi. Add a short AI-literacy scale ("Can a computer learn? How?"), echoing the Finnish ML-conceptions study.
- **Engagement metrics:** levels completed, voluntary home sessions per week, hint usage, drop-off level, and gender split.
- **Qualitative data:** children explain their project to a peer (a constructionist "teach-back"); teacher interviews.
- **Report honestly:** publish null results too. Funders and states trust evidence, and the Mindspark story shows that rigorous evidence is what unlocks government scale.

### 5.6 Funding and partnership routes in India
- **CSR funding:** Under the Companies Act 2013 Schedule VII, education is an eligible CSR area, and IT companies and banks are natural funders. Register as a **Section 8 company or trust** with **CSR-1 registration**, plus **12A/80G**, to receive CSR money.
- **NGO implementation partners:** **Pratham** (TaRL, ASER, rural reach), **Learning for Education (LFE)**, **Peepul**, and others already partnering with Code.org in Indian government schools (in Maharashtra, Tamil Nadu, Telangana and Haryana, via the SCERT).\[47\] They can provide classroom access and credibility.
- **Government:**
  - **Atal Innovation Mission:** the Union Budget 2025–26 announced **50,000 new Atal Tinkering Labs in government schools over 5 years**, and PIB reported 10,000 ATLs and over 1.1 crore students engaged by December 2025.\[48\] Offer your tool as free ATL content.
  - **State SCERTs and Samagra Shiksha** for state-board alignment and teacher training.
  - **DIKSHA** as a distribution channel.
  - The **₹500 crore Centre of Excellence in AI for Education** (Budget 2025–26) as a potential research partner.\[49\]
  - **BharatNet** broadband to government secondary schools will gradually improve connectivity.\[50\]
- **Philanthropy and tech grants:** Google.org, the Microsoft Philanthropies/AI for Good programmes, and foundations active in Indian education (e.g., Michael & Susan Dell Foundation, Tata Trusts, Wadhwani). Also the **Bhashini/MeitY ecosystem** for language tech partnerships, and **AI4Bharat (IIT Madras)**, which is linked to the same IIT Madras group that chaired the CBSE CT & AI committee.\[16\]\[51\]
- **Open-source community:** Publish on GitHub and apply to Google Summer of Code via an umbrella organisation. Engage college student developers (NSS/FOSS clubs in Tier 2 engineering colleges) as volunteer localizers and content authors.

### 5.7 Risks and mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| Kids try it once and don't return | High | Story cliffhangers, short sessions, weekly (not daily) goals, class goals, parent nudges; measure the week-2 return rate as your north-star metric |
| Low-end performance problems | High | Performance budget in CI; test on real ₹6–8k phones; disable animations on low memory |
| DPDP non-compliance | Medium | Anonymous-by-default; legal review before collecting any child data; consent flow ready before May 2027 |
| Translation quality and dialect mismatch | Medium | Native-speaker review; local teachers record or approve audio; simple "Hinglish" where natural |
| Teachers ignore it | Medium | Zero-prep scripts; CBSE outcome mapping; certificates for teachers; principal-facing reports |
| Founder bandwidth (you're one engineer) | High | Narrow MVP; open-source contributors; NGO partner handles field ops |
| A big player launches a similar free tool | Medium | Your moat is localization depth, offline-first design and community ownership; partner rather than compete (e.g., link to Scratch/CodeAI as "next steps") |
| Screen-time concerns from parents/schools | Medium | Built-in session limits ("Chintu is tired, come back tomorrow"); unplugged twins; position it as "replaces reels time" |

---

## 6. How to Start This Week

1. **Day 1–2: Read the source document.** Download the CBSE CT & AI Classes 3–8 framework PDF (cbseacademic.nic.in) and extract its learning outcomes into a spreadsheet. This becomes your curriculum map and your pitch.
2. **Day 2–3: Play the competition, as a child would.** Spend an hour each on AI for Oceans (in Hindi), Scratch, Blockly Games, Teachable Machine and PictoBlox, *on a cheap Android phone with mobile data*. Note every moment of friction.
3. **Day 3–4: Talk to 5 real users.** Two teachers from a Tier 2/3 school (CBSE and state board), two parents, and one or two children aged 9–12. Ask: "What do you do on the phone in the evening?" "Has your teacher taught 'computational thinking' yet?" Show paper sketches of Chintu Bot.
4. **Day 4–5: Build a spike.** A Vite + Blockly PWA with **one level** ("Ghar se School") with 3 arrow blocks, Hindi audio generated via Indic-TTS, and a service worker so it works offline. Test it on the cheapest phone you can find.
5. **Day 6: Build a second spike.** A TensorFlow.js MobileNet + KNN "Aam pakka ya kachcha" demo with 20 pre-loaded images. Measure load size and time on the phone.
6. **Day 7: Set up the foundations.** A GitHub repo (Apache-2.0), a one-page "Why Code Gaon" note, and outreach emails to one NGO (e.g., a Pratham state team or LFE) and one school principal asking for a 4-week pilot slot next term. Start the Section 8/trust registration conversation with a CA if you intend to accept CSR funds.

---

## Caveats
- **Tool details change fast.** Code.org rebranded to CodeAI and Google retired CS First within the last 18 months.\[6\]\[52\] Language lists, offline support and free tiers for each tool should be re-checked when you build. Several rows in the comparison table (Lightbot, Tynker, CodeMonkey, Kodable, MakeCode, Day of AI, DIKSHA) reflect general product knowledge rather than fresh verification in this research.
- **ASER's digital data covers rural 14–16-year-olds only.**\[53\] It is the best available proxy, but device access for 8–12-year-olds in Tier 2/3 *towns* may differ (likely better access, less ownership). Validate in your discovery phase.
- **The 58.0% functional-computers figure** comes from Arun C. Mehta's secondary analysis of UDISE+ 2024–25, not the headline PIB release (which gives 64.7% with computers).
- **DPDP interpretation:** The analysis of exemptions is a reading of the Rules text, not legal advice; there is no official guidance yet on edtech. Timelines may be shortened by notification. Get a lawyer's review before collecting any child data.
- **Gamification evidence** is mostly from short studies with self-reported motivation. Long-term effects on intrinsic motivation remain uncertain,\[54\] which is why your pilot should measure *voluntary return* rather than just in-class engagement.
- **Mindspark effects** came from adaptive *math and language* software with supervised sessions.\[28\] They suggest, but do not prove, similar gains for coding/AI content delivered at home.

## Sources

1. [Tools](https://scratchfoundation.org/tools)
2. [Download ScratchJr (free) for Android, APK and iOS](https://gizmodo.com/download/scratchjr)
3. [ScratchJr Device Requirements- External](https://sites.bc.edu/devtech/wp-content/uploads/sites/181/2023/10/ScratchJr-Device-Requirements-External.pdf)
4. [🌍 Explore CodeAI in Your Language: More Courses for a Global Audience](https://support.code.org/hc/en-us/articles/45296558462349--Explore-CodeAI-in-Your-Language-More-Courses-for-a-Global-Audience)
5. [GitHub - code-dot-org/ml-activities: This is the repo for AI for Oceans from Code.org. · GitHub](https://github.com/code-dot-org/ml-activities)
6. [CS First has been turned down - CS First Help](https://support.google.com/csfirst/answer/15848549?hl=en)
7. [PictoBlox - Block Coding & AI APK Download](https://www.appbrain.com/app/pictoblox-scratch-coding-ai-robotics-courses/io.stempedia.pictoblox)
8. [PictoBlox - Python and Block-Based AI Programming Software for Kids](https://thestempedia.com/product/pictoblox/)
9. [AI Course in Hindi: 8 Free Options We Checked](https://www.unrot.co/best/ai-courses-in-hindi)
10. [Kolibri - Digital X Solution](https://digitalx.undp.org/catalogs/kolibri.html)
11. [Introduction to Kolibri - Kolibri Learning Platform](https://learningequality-kolibri.mintlify.app/introduction)
12. [solve.mit.edu](https://solve.mit.edu/solutions/44212)
13. [AI, Coding, Math & Public Speaking Courses for Kids & Teens](https://www.codingal.com/en-us/courses/)
14. [Best Accredited Online Coding Classes for Kids & Teens](https://www.codingal.com/en-us/)
15. [CBSE's AI Curriculum for Classes 3-8: 2026-27 Rollout](https://www.raysolute.com/ai-education-grade-3-rollout-2026.html)
16. [Students to learn AI, computational thinking from Class 3 starting 2026–27; CBSE, NCERT to frame curriculum](https://news.careers360.com/students-learn-ai-computational-thinking-from-class-3-starting-2026-27-cbse-ncert-frame-curriculum/amp)
17. <https://cbseacademic.nic.in/web_material/CurriculumMain27/CTAI_Pri_2026-27.pdf>
18. [Aser 2024: Govt schools outpace private ones in learning recovery trends](https://www.business-standard.com/education/news/aser-2024-india-education-report-learning-covid-recovery-digital-literacy-125012900451_1.html)
19. [Smartphone Access, Education Recovery in ASER 2024](https://www.deccanchronicle.com/news/smartphone-access-education-recovery-in-aser-2024-1857277)
20. [Only 57 per cent of rural Indian children use phones to study: ASER](https://www.nationalheraldindia.com/national/only-57-percent-of-rural-indian-children-use-phones-to-study-aser-report)
21. [Exploring India’s Digital Divide](https://www.orfonline.org/expert-speak/exploring-indias-digital-divide)
22. [Indian Women Are Exercising More Agency But Urban-Rural Gaps Persist - BehanBox](https://behanbox.com/2021/12/15/indian-women-are-exercising-more-agency-but-urban-rural-gaps-persist/)
23. [Gender-Based Digital Divide: The New Threats of Inequality](https://varthana.com/school/gender-based-digital-divide-the-digital-divide-risks-new-threats-of-inequality/)
24. [Women’s internet use nearly doubles, but access gaps remain](https://www.thenewsminute.com/news/womens-internet-use-nearly-doubles-but-access-gaps-remain)
25. [NFHS-6 (2023–24): Key Findings and Long-Term Trends.](https://www.cgisaopaulo.gov.in/wn-26-06-2026-01.php)
26. [State-Level Equalisation of Women’s Internet Use in India Between the Fifth and Sixth National Family Health Surveys: A Convergence Analysis](https://www.mdpi.com/1660-4601/23/10/1327)
27. [Mindspark In Rajasthan: Personalized Adaptive Learning Tools To Improve Learning Outcomes - BW Businessworld](https://www.businessworld.in/article/mindspark-in-rajasthan-personalized-adaptive-learning-tools-to-improve-learning-outcomes-178372)
28. [Disrupting Education? Experimental Evidence on ...](https://www.nber.org/system/files/working_papers/w22923/w22923.pdf)
29. [Personalized Adaptive Learning Tools To Improve Learning Outcomes - BW Education](https://www.bweducation.com/article/personalized-adaptive-learning-tools-to-improve-learning-outcomes-178606)
30. [(PDF) A Meta‐Analysis of Gamification's Impact on Student Motivation in K‐12 Education](https://www.researchgate.net/publication/394050015_A_Meta-Analysis_of_Gamification's_Impact_on_Student_Motivation_in_K-12_Education)
31. [Scholars' Mine Scholars' Mine Masters Theses Student Theses and Dissertations](https://scholarsmine.mst.edu/cgi/viewcontent.cgi?article=9073&context=masters_theses)
32. [Gamification in Education: The Complete Guide for Instructors](https://www.engageli.com/blog/gamification-in-education)
33. [A Meta‐Analysis of Gamification's Impact on Student Motivation in K‐12 Education - Furkan Kurnaz - 2025 - Psychology in the Schools - Wiley Online Library](https://onlinelibrary.wiley.com/doi/10.1002/pits.70056)
34. [Exploring the impact of gamification on students’ academic performance: A comprehensive meta‐analysis of studies from the year 2008 to 2023 - Zeng - 2024 - British Journal of Educational Technology - Wiley Online Library](https://bera-journals.onlinelibrary.wiley.com/doi/full/10.1111/bjet.13471)
35. [India's DPDP Rules Draw the Line at 18: Age Verification and Verifiable Parental Consent Before May 2027](https://xident.io/blog/india-dpdp-age-verification-verifiable-parental-consent-childrens-data-2026/)
36. <https://www.dpdpa.com/DPDP_Rules_2025_English_only.pdf>
37. [DPDP Rules, 2025 Notified](https://static.pib.gov.in/WriteReadData/specificdocs/documents/2025/nov/doc20251117695301.pdf)
38. [Schedule IV DPDP Rules, 2025 - Fourth Schedule - Exemptions from section 9(1) and 9(3)](https://privacylawhub.com/bare-acts/dpdp-rules-2025/schedule-iv-fourth-schedule-exemptions-from-section-9-1-and-9-3-)
39. [DPDP 13 November 2026: What Actually Starts (and What Does Not)](https://theprivacylabs.com/blogs/dpdp-13-november-2026-what-starts)
40. [DPDP (Removal Of Difficulties) Order, 2026: What Changes In Sections 9 And 10 Of The DPDP Act - Data Protection - India](https://www.mondaq.com/india/data-protection/1857872/dpdp-removal-of-difficulties-order-2026-what-changes-in-sections-9-and-10-of-the-dpdp-act)
41. [DPDP deadline: is the 18 month window being cut to 12 months?](https://dpdprules.org/blog/dpdp-18-months-to-12-months-proposal)
42. [DPDP and Children's Data: Enterprise Requirements](https://nodguard.in/dpdp-childrens-data/)
43. [DPDP Children's Data Compliance Playbook — Section 9 & Rule 10](https://veritect.ai/digital-data-ai-law/dpdp-childrens-data-compliance-playbook)
44. [GitHub - AI4Bharat/Indic-TTS: Text-to-Speech for languages of India · GitHub](https://github.com/AI4Bharat/Indic-TTS)
45. [BHASHINI Explained: India's Multilingual AI Language Platform for UPSC GS-III](https://anantamias.com/bhashini-bhasha-interface-for-india/)
46. [github.com](https://github.com/glific/docs/pull/601/files)
47. [CodeAI in India](https://code.org/en-US/global/india)
48. [What 50,000 New Atal Tinkering Labs Mean for Private Schools](https://labs.scaleopal.com/insights/what-50000-atls-mean-private-schools)
49. [Union Budget 2025: Government will build 50,000 Atal Tinkering Labs in schools to cultivate spirit of innovation](https://www.indiablooms.com/finance/union-budget-2025-government-will-build-50000-atal-tinkering-labs-in-schools-to-cultivate-spirit-of-innovation/details)
50. [Budget 2025-26: 50,000 Atal Tinkering Labs, 5 National Centres of Excellence for Skill Development - The Statesman](https://www.thestatesman.com/india/budget-2025-26-50000-atal-tinkering-labs-5-national-centres-of-excellence-for-skill-development-1503393166.html)
51. [Bhashini: The Digital Public Good Revolutionizing Cross-Language Communication](https://aistartupimpact.com/news/bhashini-digital-public-good)
52. [Code.org is now CodeAI](https://code.org/en-US/codeai)
53. [In rural India, 82.2% teens aged 14-16 know how to use smartphone but only 57% use it for studies](https://theprint.in/india/education/in-rural-india-82-2-teens-aged-14-16-know-how-to-use-smartphone-but-only-57-use-it-for-studies/2467560/)
54. [Gamification in Education: Its Impact on Engagement, ...](https://aquila.usm.edu/cgi/viewcontent.cgi?article=1530&context=jetde)
