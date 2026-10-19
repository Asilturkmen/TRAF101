# Test2Drive benchmark and product research

Prepared 20 October 2026 for the Test2Drive production rebuild (Vue 3 + Vite, prerendered with vite-ssg, vue-i18n, static hosting, localStorage only).

Scope note: the owner wants the current visual system kept: the palette tokens in `src/style.css`, Inter, and the card and hero layouts in `src/App.vue` and `src/views/HomeView.vue`. Section 3 therefore covers production polish inside that system, not a new direction.

---

## TL;DR

1. **The biggest risk is content truth, not design.** I could not find an official KKTC source that describes the theory exam format. Secondary sources disagree. One practice site says the learner exam is **oral, 7 to 15 sign questions, with no fixed pass mark**. A Lefkoşa driving school describes a multiple-choice theory stage. Infonorthcyprus says the school "arranges the theory test, which typically involves identifying a small number of road signs". Yet the app sells "20 Questions · 30 Min" mock tests for "B License". Before launch, verify the format, the language and the licence class letters (one Lefkoşa school lists **D as the car class**) with the Karayolları Ulaştırma Dairesi or the ministry (bub.gov.ct.tr). Store the result in one `examProfile` data file with a source and a "checked on" date.
2. **The sign images are not production-safe.** `public/signs.json` hotlinks 144 images from the CySigns S3 bucket (`cyprus-road-signs.s3...`), and that site says "© 2026 CySigns. All rights reserved." CySigns also appears to cover the south. Wikipedia notes that **northern signs follow Turkish design (for example, DUR rather than STOP)**. Redraw the KKTC sign set as your own SVGs. That fixes licensing, accuracy and offline use together.
3. **Use a simple learning model:** practice by topic with immediate feedback, a Leitner review queue (6 boxes, intervals 0/1/3/7/14/30 days) in localStorage, a mistake bank, and a mock exam with feedback held until the end. Readiness is a checklist of named states ("Başlangıç / Yolda / Yaklaşıyor / Hazır görünüyor"), not a fake pass-probability percentage. This is how the German apps work: FahrAPP and Fahrschule.de base readiness on learning progress plus the last 15 simulations.
4. **Add a sign-naming mode.** If the real KKTC test is an examiner asking you to name signs, the best rehearsal is a flashcard mode: see the sign, say its meaning aloud, reveal it, mark yourself right or wrong. CySigns sells this as "Examiner mode". No other KKTC product offers it bilingually.
5. **Architecture:** TR at `/`, EN at `/en/`, localized slugs, one prerendered page per sign and topic in both languages, a full hreflang cluster with `x-default`, a generated sitemap with alternates, OG images per language, no auto-redirects, a vite-plugin-pwa service worker that precaches the bank, and WCAG 2.2 AA quiz patterns: fieldset/radios, a live region for feedback, an adjustable timer, focus management.
6. **Most demo signals are copy and data, not visuals:** "Most Popular", "30+ Real Scenarios" (the data has 15), "100% Practical", the badge repeating the H1, "Application Objectives" and "Our Solutions" sections, student numbers in the footer, the `vite.svg` favicon, emoji icons, no 404 page, "Ready for Traffic!". All of these can change without changing the look.

---

## 0. What the current build actually ships (baseline)

| Area | Current state (from the repo) | Production implication |
|---|---|---|
| Question bank | `src/data/questions.js`, ~40 questions, English only, no source field | TR/EN parity and a `source` + `reviewedAt` per item are needed |
| Quiz engine | `src/stores/quiz.js`: 20 questions (8 signs + 12 other), 70% pass, **no timer**, `sort(() => Math.random() - 0.5)` shuffle (biased) | Use a Fisher–Yates shuffle, add timer and profile; the "30 Min" label is untrue today |
| Licences | `licenses.js` has A, B, C, D, EH; Home shows A1, B, C, D | Verify KKTC class letters before showing class-specific tests |
| Signs | `public/signs.json` v2.0.0, source "cysigns.online", 144 signs, remote JPGs | Licence and accuracy problem; redraw |
| Scenarios | `public/scenarios.json`: 15 scenarios, emoji as image | Home says "30+" |
| History | `HistoryView.vue` is a static empty state; no localStorage anywhere | Must be real or removed |
| i18n | `<html lang="en">`, EN UI, some `nameTr` fields | Rebuild with vue-i18n + localized routes |
| A11y | No `:focus-visible` style; license cards are `div @click`; QuestionCard uses `aria-selected` on options | Fix in the quiz pattern below |
| Meta | Favicon `vite.svg`; two names ("TRNC Driving Safety" / "Test2Drive"); `meta keywords` | One name, real icons, per-page head |

---

## 1. Product benchmark (17 products)

Legend for "Static fit": **S** = can be done the same way in a static site with localStorage; **P** = partly; **—** = anti-example.

| # | Product | URL | Learning model | IA (top level) | Copy tone | What builds trust | Offline / static | One idea to adopt | Static fit |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Official DVSA Theory Test Kit (UK, TSO) | apps.apple.com/gb/app/id463295925 | Topic study + topic practice, custom sets, unlimited quick and timed 50-question mocks, 36 CGI hazard clips, "test readiness" gauge "backed by learning science", graphs | Learn · Practise · Mock test · Hazard perception · Highway Code · Progress | Confident, official ("the ONLY OFFICIAL"), plain | Published by the official publisher of DVSA material, "© Crown Copyright", frequent versioned releases | Works offline | **Every wrong answer links to the exact rule source** (Highway Code paragraph). Do the same with KKTC law/regulation references | S |
| 2 | GOV.UK theory test pages + free practice | gov.uk/theory-test, gov.uk/take-practice-theory-test | Explains the real test: 50 questions in 57 min, pass 43/50, hazard 44/75, flag and return to questions, practice question first | Task-based pages (book, prepare, what happens, pass mark) | Neutral, short sentences, second person | Government domain, exact numbers | Static pages | **A plain "what happens on the day" page with exact numbers**. Ours needs a source and a checked date | S |
| 3 | Theory Test Pro (UK) | theorytestpro.co.uk | Topic multiple choice, hazard tests with feedback, Highway Code revision, final mock; instructor-linked accounts | Learner drivers · Driving instructors · Log in · Get started free | Short, outcome-focused | Crown copyright material "reproduced under licence", instructor network | Online | **Two audiences, two doors**: a light "Sürücü kursları için" page later (shareable progress code) | P |
| 4 | Driving Theory 4 in 1 (UK) | apps.apple.com/gb/app/id829581836 | 700+ questions, 36 DVSA clips, Highway Code, "pass predictor", "smart revision" that targets weak areas | Revision · Mock · Hazard · Highway Code · Progress | Feature-list marketing | DVSA licensed content | Offline mode | **Weak-area review button on the results screen** ("Bu konudaki 6 soruyu tekrar et") | S |
| 5 | Zutobi (UK/US/AU) | zutobi.com/uk | Bite-sized lessons with questions after each, exam simulator matching count, time and pass mark; points, levels, leaderboard | Courses · Practice tests · Blog · FAQ; 4-step "How does it work" | Upbeat, easy ("Getting your driver's licence should be easy") | Store logos, dated reviews, registered address | Apps; web needs account | **Lesson → 5 check questions → next lesson**: retrieval after each short reading | S |
| 6 | Driving-Tests.org (US) | driving-tests.org | State practice tests, "Challenge Bank" that "automatically retests you on all your missed questions", handbook summaries, road signs pages, adaptive premium | DMV practice test · CDL · Handbook · Road signs · per-state pages | Playful ("Less Ugh... More Aha!") with risky absolutes ("Pass the First Time, Guaranteed") | Named editor and fact-checker in schema, "2026 updated" badge; weakened by press logos for unrelated articles and live counters showing "0 tests" | Web, no sign-up for free tests | **Named reviewer + per-page "last reviewed" in visible text and JSON-LD.** Avoid their guarantees and padded logos | S |
| 7 | iTheorie (DE/CH) | itheorie.de | Official catalogue question practice, apps + web | Single landing page with classes | Superlatives, a grammar slip in the tagline | "Aktuellster amtlicher Katalog", but the update dates shown are from 2017 | Apps | **Anti-example**: a stale "updated" date destroys trust. Show a date only if you keep it current | — |
| 8 | ClickClickDrive (DE) | apps.apple.com/de/app/id1435154541 | Official TÜV/DEKRA catalogue, real exam simulation, multiple languages, read-aloud, synced progress, school booking | Learn · Simulate · School (chat, appointments) | Functional | Official catalogue, issued through the driving school | Works offline after activation | **Questions in several languages with read-aloud.** Strong precedent for a TR/EN bank for international students | P |
| 9 | FahrAPP (AT/DE) | (via wandernundmehr.at FAQ) | Readiness = learning progress + **results of the last 15 exams** | Learn · Exam · Readiness | Supportive | Transparent rule for readiness | App | **A readiness rule written down where users can read it** | S |
| 10 | Fahrschule.de app (DE) | apps.apple.com/de/app/id413246093 | Readiness from the 15 most recent simulations, **oldest weighted least** | Learn · Simulation · Statistics | Neutral | Explains its weighting | App | **Recency-weighted mock component** in our readiness checklist | S |
| 11 | ADAC Führerschein app (DE) | (reviews: giga.de, vodafone.de) | Exam simulation with stopwatch, bookmark list for hard questions, learning statistics | Learn · Simulation · Merkliste · Stats | Neutral | ADAC brand | App | **Manual "İşaretle / Flag" on any question**, which feeds the review queue | S |
| 12 | TheorieExamen.nl (NL, CBR) | theorieexamen.nl | Practice exams for the 3-part CBR exam (hazard 25 needing 13 correct, knowledge 12 needing 10, insight 28 needing 25), learning system where "difficult questions appear more often", immediate feedback, theory book with search, 8 languages | Theory book · Practice exams · Signs | Practical | Mirrors the official per-part thresholds | App/web | **Per-part pass rule.** If the KKTC test has separate sign and rules parts, score them separately. Since 2019 CBR no longer shows candidates their wrong questions after the exam, only per-topic results, which supports a topic-level review screen | S |
| 13 | ehliyetsinavsorulari.io (TR, MEB e-sınav) | ehliyetsinavsorulari.io | 50 questions / 45 min / 70 to pass simulator, 39 full exams, 197 topic tests in 4 subjects, "Yanlışlarım", daily question, games, signs galleries | Çıkmış sorular · Konu anlatımları · Konu testleri · Trafik işaretleri · Rehber · Cezalar · Oyunlar | Direct "sen", plain ("Üyelik yok, ücret yok — soruyu çöz, doğru cevabı ve nedenini anında gör.") | Names its source document (MEB e-Sınav Uygulama Kılavuzu 2026); explicit "gerçek sınav değildir" demo disclaimer | Web, no login | **Turkish SEO URL patterns** (`/trafik-tanzim-isaretleri/`) and the line "a wrong answer belongs to a topic; read the topic or you'll miss it again", which links the mistake to the lesson | S |
| 14 | Turkish ehliyet apps (e.g. "Ehliyet Sınav Soruları 2026 TR", "Ehliyet Soruları 2026") | apps.apple.com/us/app/id1491476061 and id6755768618 | Timed e-sınav simulation, saved wrong answers, animated video questions, offline, statistics | Deneme · Konu · Yanlışlar · İstatistik | Marketing-heavy, imply MEB approval without proof | Weak (unverified "official" implication) | Offline | **Anti-example**: never imply official status. Put "Test2Drive resmi bir kurum değildir" in the footer | — |
| 15 | kktcehliyet.xyz (KKTC) | kktcehliyet.xyz | Sign test (41 questions), general knowledge, driving prep, 40-question "real format" mock; PWA; no registration | One landing page: CTA, modules, how-to, FAQ | Promotional ("Ücretsiz Online Test Çöz!") | Claims "kamuya açık kaynaklardan derlenen" with no named source; contradicts itself (says the exam is oral, then sells a "real exam format" mock) | PWA | **Direct competitor, TR only.** Beat it on verified sources, EN parity, and an oral sign-naming mode that matches what it says the exam is | S |
| 16 | CySigns (Cyprus, apparently south) | cysigns.online | 240-sign catalogue, 30-question rules quiz, **Examiner mode (name signs out loud)**, readiness score, weak-sign practice, free printable PDF of all signs; EN/GR/RU | Signs · Quiz · Guides · Roadmap · Pro | Salesy ("Pass guarantee ... 85% readiness") | Ratings, "80K+ learners", money-back | Web | **Free printable sign sheet (PDF) per language** and the examiner-mode idea. Do not reuse their images | S |
| 17 | CyprusDriving.net (Republic of Cyprus guide) | cyprusdriving.net | Guides only (learner licence, test, law). States the southern learner test is a short verbal exam in English or Greek, on signs and the Highway Code | Licences · Learning to drive · Police & law · Dept. of Road Transport | Calm, explanatory | About page, disclaimer, links to official forms, dated law-change notes | Static | **Dated "what changed" notes on the exam page** | S |

Also reviewed: the KKTC driving-school sites vizyonsoforokulu.com and kktcehliyet.com (theory + practical stages, foreign-licence conversion documents, a "95% first-attempt" claim with no method). They are useful for facts to verify, not as product models.

### Patterns across the best products

- **One learning loop everywhere:** read briefly → answer → see why → missed items come back → mock under real rules → readiness. DVSA, Zutobi, Driving-Tests.org and TheorieExamen all follow it.
- **Trust comes from three things:** a named source per answer, real exam numbers with a date, and honest status (official, licensed, or neither). Trust is lost through stale dates (iTheorie), guarantees (Driving-Tests.org, CySigns), unexplained logos, and broken counters.
- **Readiness in the best apps is rule-based and explained,** not a magic number (FahrAPP, Fahrschule.de).
- **Hazard perception needs licensed video,** so it does not fit a static student project. Static stand-ins: scenario questions with a photo or diagram, and timed "what do you do next" questions.
- **Multilingual banks are normal** (ClickClickDrive; TheorieExamen with 8 languages). A TR/EN bank is a real differentiator in the KKTC market, where the local competitors are Turkish-only.

---

## 2. Learning model recommendation

### Evidence that fits a static product

- **Practice testing and distributed practice** are the only two techniques rated "high utility" in Dunlosky et al. (2013). Rereading and highlighting rated low. So the product should make people answer, not read long pages.
- **Testing effect:** in Roediger & Karpicke (2006), restudying won at 5 minutes, but **prior testing won at 2 days and at 1 week**.
- **Spacing:** in Cepeda et al. (2008, more than 1,350 people), the best review gap was about 20 to 40% of the time until the test for a one-week horizon, and **gaps that were too short hurt more than gaps that were too long**. Candidates typically sit the exam a few weeks after starting, so reviews should be spread over days and weeks.
- **Feedback timing:** Butler, Karpicke & Roediger (2007) found delayed feedback beat immediate feedback on a later test, probably because the delay adds spacing. Immediate feedback helps early learning. So: **immediate feedback in practice, delayed feedback in mocks.**
- **Interleaving** of topics (moderate utility in Dunlosky) suits review sessions where the learner must first identify which rule applies.

### The model: "Çalış → Tekrarla → Dene"

**1. Item model.** Every question and every sign card is an item:

```json
{
  "id": "sign.dur",
  "type": "sign-name | mcq | scenario",
  "topic": "signs.regulatory",
  "classes": ["*"],
  "rev": 2,
  "source": { "tr": "Motorlu Araçlar ve Yol Trafik Yasası ...", "url": "..." },
  "reviewedAt": "2026-10-01"
}
```

**2. Leitner schedule (localStorage).** Six boxes:

| Box | Meaning | Next review |
|---|---|---|
| 0 | Not seen | — |
| 1 | Wrong or new | Again in the same session (after at least 5 other items), then tomorrow |
| 2 | Correct once | +1 day |
| 3 | Correct on two separate days | +3 days |
| 4 | | +7 days |
| 5 | | +14 days |
| 6 | Mastered | +30 days (keeps a light check) |

- Correct answer: move up one box. Wrong answer: back to box 1 and into **Hatalarım / My mistakes**.
- An item leaves the mistake bank after **two correct answers on different days**.
- Promotion happens at most once per item per day, so cramming cannot inflate mastery.
- Optional "Emin değildim / I guessed" toggle: a correct but unsure answer stays in the same box. (Should-have.)

**3. Daily session ("Bugünkü tekrar / Today's review").** 15 to 20 items, about 8 minutes:
1. Due items, oldest first (up to 60%).
2. Mistake-bank items not seen today.
3. New items from the weakest topic, at most 10 new per day.
4. Interleave: no two consecutive items from the same topic when avoidable. At least a third are sign items.

**4. Modes.**

| Mode | TR / EN label | Feedback | Feeds Leitner |
|---|---|---|---|
| Topic practice | Konu çalış / Practise a topic | Immediate: correct/wrong, one-line why, source line, "related sign" link | Yes |
| Daily review | Bugünkü tekrar / Today's review | Immediate | Yes |
| Sign naming (oral rehearsal) | Levhayı söyle / Name the sign | See sign → say the meaning aloud → reveal → "Bildim / Bilemedim" | Yes (self-graded) |
| Mistakes | Hatalarım / My mistakes | Immediate | Yes |
| Mock exam | Deneme sınavı / Mock exam | **None until the end**, then a full review with per-topic scores; flag and return like GOV.UK | Yes (at the end) |
| Scenarios | Senaryolar / Scenarios | Immediate, with reasoning | Yes |

**5. Exam profile (data, not code).** `content/exam-profile.json`:

```json
{ "id": "kktc-b-2026", "verified": false, "format": "oral-signs | mcq",
  "questions": 20, "timeLimitMin": 30, "passMark": 17,
  "source": "...", "checkedAt": "2026-10-20" }
```

While `verified` is false, the mock exam is labelled **"Test2Drive deneme formatı / Test2Drive practice format"**, never "gerçek sınav". This avoids the honesty gap kktcehliyet.xyz falls into.

**6. Readiness (checklist, not a percentage).**

Item mastery for the calculation: box 0 = 0, 1 = 0.1, 2 = 0.35, 3 = 0.6, 4 = 0.8, 5 or 6 = 0.95. If an item is overdue by more than its interval, count it one box lower. Topic mastery is the mean of its items. Mock component: the weighted mean of the last 5 mocks within 14 days, weights 5/4/3/2/1 with the newest weighted most (the Fahrschule.de idea).

| State | TR / EN | Rule |
|---|---|---|
| 1 | Başlangıç / Getting started | Less than 50% of items seen |
| 2 | Yolda / On your way | 50% or more seen |
| 3 | Yaklaşıyor / Getting close | Overall mastery 0.7 or more, and 2 mocks passed |
| 4 | Hazır görünüyor / Looks ready | Mastery 0.8 or more, **every** topic 0.7 or more, all sign categories 0.8 or more, last 3 mocks at the pass mark + 1 question, on 2 or more different days |

The progress page shows **what is missing** ("Öncelik kurallarında 7 soru tekrar bekliyor", "Son 3 denemenin ikisi geçer notun altında") and states in one line that this is an estimate, not a guarantee.

**7. Storage design.**
- One key, `t2d.v1`. Compact arrays per item: `[box, dueDay, seen, wrong, lastDay]`. Days are local-date integers. 300 items take about 15 KB.
- A `schema` version and migrations. When an item's `rev` changes, set `box = max(1, box - 2)`. Drop removed ids.
- Wrap every read and write in try/catch, and only touch storage in `onMounted` or `<ClientOnly>`, never during SSG render.
- **Backup:** "İlerlemeni dışa aktar / Export progress" (JSON download) and import. Call `navigator.storage.persist()` when available. Tell iOS users that adding to the home screen keeps progress safer: WebKit can clear script-writable storage for sites not used within 7 days of browser use, and home-screen web apps are exempt.
- "İlerlemeyi sıfırla / Reset progress" with a confirm step.

**Later:** swap the Leitner box rule for FSRS (open-spaced-repetition) behind the same item interface, once there is enough usage to justify it.

---

## 3. Production polish within the current design

The system stays: tokens in `src/style.css` (primary `#377272` family, `--gradient-hero`, radii, shadows), Inter, the split hero, the card grids, the header and footer layout. Note that the tokens are labelled "Modern Teal Palette" in `style.css`, while `App.vue` still uses an older blue `rgba(15, 76, 129, …)` for the header border and nav hover. Pick one family and replace the stray values with tokens. This document assumes the teal tokens because they are what the CSS defines.

### 3.1 Remove demo signals (no visual change)

| # | Where | Now | Change |
|---|---|---|---|
| 1 | `HomeView.vue` licence grid | "Most Popular" badge on B | Remove. Keep the `featured` border if wanted, with no label |
| 2 | `HomeView.vue` scenario stats | "30+ Real Scenarios", "5 Categories", "100% Practical" | Use counts computed from the data at build time ("15 senaryo / 15 scenarios"), or delete the stats row |
| 3 | Hero cards | Hard-coded "46 / 35 / 13 / 8 Signs" | Compute from the sign data. Make each card a link to its category page |
| 4 | Licence cards | "20 Questions • 30 Min" with no timer; A1 vs A mismatch | Show only after the exam profile is verified. Until then: "Deneme: 20 soru" |
| 5 | Hero badge | Repeats the H1 ("Practice. Evaluate. Drive Safe." twice) | Replace with a factual line ("Ücretsiz · Kayıt yok · TR / EN") or remove |
| 6 | "Application Objectives", "Our Solutions" sections | Read like an assignment brief | Replace with "Nasıl çalışır / How it works" (3 cards, existing `grid-3`) and a trust block. See section 5 |
| 7 | Final CTA band | "Ready to Start Your Journey?" | Make it specific ("Bugünkü tekrar: 20 soru, yaklaşık 8 dakika / Today's review: 20 questions, about 8 minutes") or drop it |
| 8 | Footer | Student numbers, instructor, EMU logo | Move to an **About / Hakkında** page ("Proje hikâyesi": started in TRAF101 at EMU, credit the instructor and authors). Footer gets product links, Sources, Privacy, Report a mistake, language switch, "İçerik son kontrol: 2026-10" and "Resmi bir kurum değildir / Not an official service" |
| 9 | Results | "Ready for Traffic!" / "More Practice Needed" | "Bu denemeyi geçtin: 18/20 / You passed this mock: 18/20" and "Bu sefer olmadı: 6 yanlış, hepsi Hatalarım'a eklendi / Not this time: 6 wrong, all added to My mistakes" |
| 10 | `HistoryView.vue` | Static empty state | Real list from localStorage. Empty copy: "Henüz deneme yok. Sonuçların yalnızca bu cihazda saklanır." |
| 11 | Home sample scenario | Buttons do nothing; the answer is pre-highlighted | Make it a working one-question demo, or render it as non-interactive text |
| 12 | Meta | `vite.svg` favicon; "TRNC Driving Safety" vs "Test2Drive"; `meta keywords` | Real favicon, apple-touch and PWA icons from the logo; one name; remove keywords |
| 13 | Dead code | `.bento-grid`, `.gradient-text`, `.title-word`, `.logo-text`, `HelloWorld.vue`, `assets/vue.svg` | Delete. The visual output stays the same |
| 14 | Off-token colours | `#F59E0B`, `#10B981`, `#f5f7fa`, `#e8f0f5` in `HomeView.vue` | Map to existing tokens |

### 3.2 Icons that match the current style

- The hero buttons already use an inline SVG chevron with `stroke-width="2"` and round caps. Use **one outline icon set in that style**: Lucide (ISC licence), 24px grid, stroke 2, `currentColor`. Use 20px in buttons and nav, and 24px in card heads on the existing tinted tiles (`--color-mandatory-bg` and similar), coloured `var(--color-primary)`. Import per icon (unplugin-icons or `lucide-vue-next`) so only used icons ship.
- **For sign categories, the honest icon is the sign shape.** Use a small SVG of a red-bordered triangle, a red-bordered circle, a blue disc and an octagon, drawn from the same SVG sign library. Use them in the hero cards (40px) and the category list.
- Replace every emoji in `studyData.js`, `signs.json` (`icon`), `scenarios.json` (`image`) and the views.

### 3.3 Sign artwork (licence-clean)

- Draw the KKTC set yourself as SVG from regulation geometry (shape, border ratio, pictogram), checked against photos of signs in the north. Northern signs follow the Turkish design (DUR, red-crescent first-aid sign). Release them under your own licence (CC BY 4.0 or CC0).
- The Wikimedia Commons Highways licensing table marks Turkish road signs as "unclear". Check each file's licence before reuse, or redraw.
- Store each sign as a file in `public/signs/<category>/<id>.svg` (the folder already exists for 13 signs). They are small, cacheable and work offline.

### 3.4 Contrast fixes inside the palette (computed, WCAG 2.x)

| Pair | Ratio | Verdict | Fix (same hue, darker) | New ratio |
|---|---|---|---|---|
| `#377272` text on `#FFFFFF` | 5.51 | AA pass | keep | |
| `#377272` on `--color-bg #F8FAFA` | 5.26 | AA pass | keep | |
| White on `#2A5858` (gradient end) | 7.97 | pass | keep | |
| White on `#5E9393` (primary-light) | 3.46 | **fails body text** | use only for large text or decoration | |
| `--color-text #2C3E50` on `#F8FAFA` | 10.48 | pass | keep | |
| `--color-text-secondary #546E7A` on white | 5.40 | pass | keep | |
| `#546E7A` on `#F0F4F4` | 4.87 | pass | keep | |
| `--color-text-muted #78909C` on white | 3.35 | **fails** | `#5F7682` | 4.77 |
| `--color-accent #E67E22` on white (or white on it) | 2.85 | **fails** | `#B85C0F` for text and buttons; keep `#E67E22` for fills next to text | 4.59 |
| `--color-success #27AE60` as text | 2.87 | **fails** | `#1E7B45` for text | 5.28 |
| `--color-danger #E74C3C` as text | 3.82 | **fails** | `#C0392B` for text | 5.44 |
| `--color-warning #F1C40F` on white | 1.66 | **fails** | never as text; use `#2C3E50` text on `--color-warning-bg #FFF8E1` (10.34) | |
| `#89B6B6` on `#377272` | 2.47 | **fails** | avoid for text | |
| `--color-border #DAE1E1` on white | 1.33 | below 3:1 for UI components | fine for card edges, but **input and answer-option borders need 3:1**: use the primary `#377272` for those | 5.51 |

Add the darker values as new tokens (`--color-text-muted` updated, plus `--color-success-text`, `--color-danger-text`, `--color-accent-text`). This is an extension, not a palette change.

### 3.5 States every screen needs

- **Loading:** a skeleton card in the existing `.card` style. Data ships with the build, so loading should be rare.
- **Error:** "İçerik yüklenemedi. Bağlantını kontrol edip tekrar dene. [Tekrar dene]" / "Couldn't load this. Check your connection and try again."
- **Offline:** a small banner: "Çevrimdışısın. Çalışmaya devam edebilirsin; ilerlemen bu cihazda." / "You're offline. You can keep practising; your progress stays on this device."
- **Empty:** history, mistakes ("Hatalarım boş. Yanlış yaptığın sorular burada toplanır."), progress.
- **404:** a catch-all route plus a static `404.html`. Copy: "Bu sayfa yok. Aradığın levha listede olabilir. [Levhalar] [Ana sayfa]".
- **Update ready (PWA):** "Yeni içerik hazır. [Yenile]". Never show it during a mock.

### 3.6 Microcopy rules (TR and EN)

- TR: "sen", short sentences, no exclamation marks, real terms from the regulation ("yol ver", "geçiş üstünlüğü"). Write the key term once in **bold**. Sentence case in headings.
- EN: plain British spelling, because Cyprus law and signs are UK-influenced and traffic drives on the left ("licence", "practise" as a verb, "give way", "roundabout"). On EN pages, show the Turkish sign name under the English one (e.g., "Stop · **DUR**"), because international students meet Turkish on the road and possibly in the exam.
- Headings: no trailing full stops, no tracked uppercase eyebrow labels, no exclamation marks. The footer `h4` uses `text-transform: uppercase`; in Turkish, `i` must uppercase to `İ`, which CSS handles only when `lang="tr"` is set on the page.
- Keep a shared glossary (`content/glossary.json`, TR to EN) so both languages use the same term every time.
- Replacements:

| Now | TR | EN |
|---|---|---|
| Start Learning Now | Çalışmaya başla | Start practising |
| Take Practice Test | Deneme sınavına gir | Take a mock exam |
| Traffic School (Study hub H1) | Konular | Topics |
| 🎬 Scenario Practice | Senaryolar | Scenarios |
| Correct! / Incorrect | Doğru / Yanlış. Doğru cevap: B | Correct / Wrong. The answer is B |
| Quiz Complete! | Senaryolar bitti: 15'te 12 | Scenarios done: 12 of 15 |
| Start Test (licence cards) | Denemeye başla | Start mock |

### 3.7 Motion

Keep the existing transitions (`--transition-*`, `fadeIn`). Limit the hover lift (`translateY(-4px)`) to cards that are links. Add `@media (prefers-reduced-motion: reduce)` that removes transforms and animations and sets `scroll-behavior: auto`. Answer feedback can use the existing `scaleIn` at 150 ms.

### 3.8 Fonts

Keep Inter. It covers Turkish (ç ğ ı İ ö ş ü) in its latin-ext subset. For offline use and fewer requests, self-host it with `@fontsource-variable/inter` (latin + latin-ext) instead of the Google Fonts `@import`, which currently loads 6 weights (400 to 900) when the UI uses about 4.

---

## 4. Static bilingual architecture (Vue 3 + Vite + vite-ssg + vue-i18n)

### 4.1 URL scheme and slugs

- **TR is the default at `/`; EN lives under `/en/`.** Use the language codes `tr` and `en`, not region codes. A region code alone is invalid hreflang, and codes like `UK` are reserved.
- Use localized ASCII slugs with trailing slashes (`dirStyle: 'nested'`, so each page is `…/index.html`, which works on any static host):

| Page | TR | EN |
|---|---|---|
| Home | `/` | `/en/` |
| Practise hub | `/calis/` | `/en/practise/` |
| Today's review | `/calis/bugun/` | `/en/practise/today/` |
| Topic | `/konular/oncelik-kurallari/` | `/en/topics/right-of-way/` |
| Signs index | `/levhalar/` | `/en/signs/` |
| Sign category | `/levhalar/uyari/` | `/en/signs/warning/` |
| Sign | `/levhalar/dur/` | `/en/signs/stop/` |
| Name the sign | `/calis/levha-soyle/` | `/en/practise/name-the-sign/` |
| Mock exam | `/deneme-sinavi/` | `/en/mock-exam/` |
| Mistakes | `/hatalarim/` | `/en/mistakes/` |
| Progress | `/ilerleme/` | `/en/progress/` |
| How the exam works | `/sinav-nasil-yapilir/` | `/en/how-the-exam-works/` |
| Getting a licence in KKTC (students, residence) | `/ehliyet-nasil-alinir/` | `/en/getting-a-licence/` |
| Left-hand traffic primer | `/soldan-trafik/` | `/en/driving-on-the-left/` |
| Sources | `/kaynaklar/` | `/en/sources/` |
| About | `/hakkinda/` | `/en/about/` |
| Privacy | `/gizlilik/` | `/en/privacy/` |

- Slugify Turkish with an explicit map (ç→c, ğ→g, ı→i, İ→i, ö→o, ş→s, ü→u) and lowercase with `toLocaleLowerCase('tr')`. Store slugs in the content, never derive them at runtime, so URLs stay stable.

### 4.2 Content as data

```
content/
  signs/<id>.json        { id, category, shape, svg, slug:{tr,en}, name:{tr,en},
                           meaning:{tr,en}, action:{tr,en}, confusedWith:[id],
                           source:{...}, reviewedAt }
  topics/<id>.json       { id, slug, title, summary, body (md per lang), items:[...] }
  questions/<topic>.json { id, rev, type, prompt:{tr,en}, options:[{id, text:{tr,en}}],
                           answer, why:{tr,en}, signId?, source, reviewedAt }
  exam-profile.json
  glossary.json
locales/tr.json, en.json  (UI strings only, vue-i18n)
```

- Keep UI strings in vue-i18n (`legacy: false`, Composition API) and content in JSON. This keeps message bundles small, and pages import only the content they render.
- **The locale comes from the route** (the `/en` prefix), not from a store or the browser. Generate routes from one table, e.g. `{ name: 'sign', tr: '/levhalar/:slug/', en: '/en/signs/:slug/' }`. Write a `localePath(name, params, lang)` helper and use `RouterLink` everywhere (which also replaces the `div @click` cards).
- **The language switcher links to the equivalent page** (the sign page's other-language slug), not to the home page.
- **No automatic redirects** by Accept-Language or IP. On first visit, if `navigator.language` does not start with `tr` and the page is TR, show a dismissible line: "This page is available in English →". Remember the choice in localStorage.

### 4.3 Prerendering with vite-ssg

- Entry: `export const createApp = ViteSSG(App, { routes }, ({ app, router, isClient }) => { app.use(i18n); app.use(pinia) })`. Build with `vite-ssg build`.
- `ssgOptions.includedRoutes(paths, routes)`: expand every dynamic route for both languages from the content files (signs × 2, topics × 2, categories × 2), plus `/404`.
- Use `beasties` for critical CSS, `script: 'async'`, `dirStyle: 'nested'`.
- **Hydration safety:** everything that depends on localStorage (progress strip, review counts, history) goes in `<ClientOnly>` with a placeholder of the same size, and is read in `onMounted`. This prevents mismatches and layout shift.
- Replace the biased `sort(() => Math.random() - 0.5)` with Fisher–Yates. Shuffle only on the client, so the prerendered HTML stays deterministic.

### 4.4 Head, hreflang, sitemap, structured data

Per page via `useHead` (`@unhead/vue`, bundled with vite-ssg):

```html
<html lang="tr">
<title>Dur levhası ne demek? | Test2Drive</title>
<meta name="description" content="Dur levhası: tamamen dur, yol ver, sonra geç. KKTC'de nerede görülür, neyle karıştırılır.">
<link rel="canonical" href="https://test2drive.example/levhalar/dur/">
<link rel="alternate" hreflang="tr" href="https://test2drive.example/levhalar/dur/">
<link rel="alternate" hreflang="en" href="https://test2drive.example/en/signs/stop/">
<link rel="alternate" hreflang="x-default" href="https://test2drive.example/levhalar/dur/">
<meta property="og:locale" content="tr_TR">
<meta property="og:locale:alternate" content="en_GB">
<meta property="og:image" content="https://test2drive.example/og/tr/levhalar/dur.png">
```

Rules from Google's documentation: every version lists itself and every other version; links must be bidirectional or they are ignored; use fully qualified URLs; `x-default` is the fallback. Google detects page language itself, and hreflang only tells it how versions relate. Set `htmlAttrs.lang` per page anyway, for screen readers and correct Turkish casing.

- **Sitemap:** a post-build script writes `sitemap.xml` (optionally with `xhtml:link` alternates matching the HTML tags) and `robots.txt` pointing to it. One hreflang method is enough; if you use both, they must agree.
- **Structured data (JSON-LD):** `WebSite` on home, `BreadcrumbList` on sign and topic pages, `DefinedTerm` inside a `DefinedTermSet` for signs, `Organization` with `name: "Test2Drive"`. Do not count on FAQ rich results: Google limited them to well-known government and health sites in 2023. A visible FAQ is still useful to readers.
- **Sign page template (the SEO workhorse):** H1 "Dur levhası" / "Stop sign (DUR)" → one-sentence meaning → "Ne yapmalısın / What to do" → where you meet it in the north → "Sık karıştırılan / Often confused with" (e.g., Yol ver) → "Bu levhayla 3 soru çöz / Try 3 questions on this sign" (inline quiz) → related signs → source + "Son kontrol / Last checked" date.
- **Search intent to cover:** TR "dur levhası ne demek", "trafik levhaları ve anlamları", "KKTC ehliyet sınavı", "KKTC ehliyet soruları", "KKTC'de ehliyet nasıl alınır"; EN "north cyprus driving licence", "TRNC driving test", "driving licence north cyprus student", "road signs north cyprus".

### 4.5 OG images per language

A build script (Node, satori + @resvg/resvg-js, with the Inter TTF) renders 1200×630 PNGs. Use the existing hero gradient tokens (`#377272` → `#1F4545`), the page title in white Inter 700 at 64px, the sign SVG on the right, and "test2drive" in the corner. Output to `public/og/tr/...` and `public/og/en/...`. Keep one template so all images look alike.

### 4.6 PWA and offline (vite-plugin-pwa)

- `strategies: 'generateSW'`, `registerType: 'prompt'`, so new content never swaps in mid-exam. Show the update toast only on non-quiz routes.
- **Precache:** the JS/CSS shell, all content JSON (expected well under 1 MB), sign SVGs, self-hosted fonts and icons. Precache the HTML of the core routes in both languages. For all sign and topic HTML (300+ pages at roughly 15 KB each): precache everything if the total stays under about 5 MB. Otherwise use `StaleWhileRevalidate` runtime caching for navigations plus an `offline.html` fallback. Measure after the first build.
- Manifest: `name: "Test2Drive"`, `lang: "tr"`, `start_url: "/"`, `display: "standalone"`, `theme_color: "#377272"`, `background_color: "#F8FAFA"`, maskable icons at 192 and 512. The app reopens in the last-used language from localStorage.
- On iOS, show an "Ana ekrana ekle" hint on the progress page (storage persistence, see 2.7).

### 4.7 Accessibility: WCAG 2.2 AA for the quiz

- **Question markup:** `<fieldset>` with the question as `<legend>`, then native `<input type="radio">` options styled as the existing option cards, then a "Kontrol et / Check" button. Do not use `aria-selected` on options (the current QuestionCard does); it belongs to listbox and tab patterns.
- **Feedback:** a persistent `<div role="status" aria-live="polite">` that receives "Doğru." or "Yanlış. Doğru cevap: B, Yol ver. Çünkü…". After checking, the button becomes "Sonraki soru / Next question" and keeps focus. On the next question, move focus to the question heading (`tabindex="-1"`).
- **Not colour alone:** correct and wrong states use an icon + text + colour, with the darker text tokens from 3.4.
- **Timer (2.2.1 Timing Adjustable, level A):** offer untimed practice everywhere, and in mock settings a "süreyi uzat / more time" option (×1.5, ×2, off). Do not announce every second. Announce at 10, 5 and 1 minutes through the polite region.
- **Keyboard:** everything works with Tab, Space and Enter. Optional 1–4 / A–D shortcuts, with a setting to turn them off (2.1.4 Character Key Shortcuts).
- **2.4.11 Focus Not Obscured:** the sticky header can cover focused elements. Add `scroll-padding-top` equal to the header height (about 64px).
- **2.5.8 Target Size:** options and nav links at least 44px high (already roughly true; check the mobile nav).
- **Focus style:** add `:focus-visible { outline: 3px solid var(--color-primary); outline-offset: 2px; }`, with a white outline on the hero gradient.
- **Sign image alt text** must not give away the answer. In a quiz: `alt="Soru levhası: kırmızı kenarlı üçgen, içinde iki çocuk figürü"`. On the sign page: `alt="Okul geçidi levhası"`.
- **Language of parts:** wrap EN terms on TR pages (and the reverse) in `lang` spans.
- **Mock review page:** a heading per question, and results as a table with a caption.

### 4.8 Hosting

Cloudflare Pages, Netlify or GitHub Pages all serve `404.html` and nested `index.html`. Pick one canonical host and one trailing-slash policy, and redirect the other variants.

---

## 5. Information architecture and homepage sequence

### 5.1 Primary navigation (5 items + language)

| TR | EN | Route |
|---|---|---|
| Çalış | Practise | `/calis/` (today's review, topics, name the sign, mistakes, scenarios) |
| Levhalar | Signs | `/levhalar/` |
| Konular | Topics | `/konular/` |
| Deneme sınavı | Mock exam | `/deneme-sinavi/` |
| İlerleme | Progress | `/ilerleme/` (includes history) |
| EN / TR | TR / EN | equivalent page |

On mobile: the logo, "Çalış" as the primary button, and a menu. Add a badge on "Çalış" with the count of due items, only after hydration.

**Footer columns:** Çalış (Bugünkü tekrar, Hatalarım, Senaryolar) · Rehber (Sınav nasıl yapılır, Ehliyet nasıl alınır, Soldan trafik) · Test2Drive (Hakkında, Kaynaklar, Gizlilik, Hata bildir) · bottom line: "Resmi bir kurum değildir · İçerik son kontrol: Ekim 2026 · TR / EN".

### 5.2 Homepage sequence (inside the existing layouts)

1. **Hero (existing split hero).**
   - H1 TR: "KKTC ehliyet sınavına hazırlan" / EN: "Get ready for the North Cyprus driving theory test".
   - Lead: "Levhalar, kurallar ve deneme sınavları. Ücretsiz, kayıt yok; ilerlemen bu cihazda kalır." / "Signs, rules and mock exams. Free, no sign-up; your progress stays on this device."
   - Buttons: "Çalışmaya başla" (primary) · "Deneme sınavına gir" (secondary).
   - Right: the existing 4-card grid, with sign-shape SVGs and real counts, each card a link.
2. **Returning-user strip (client only, shown only if progress exists):** "Kaldığın yerden devam: 12 soru tekrar bekliyor · Hatalarım: 5 · [Devam et]".
3. **How the exam works, in short:** 3–4 facts from the verified exam profile, each with a source, a "son kontrol" date, and a link to the full page. This answers the first search intent and is the main trust signal.
4. **How Test2Drive works** (existing `grid-3` cards, Lucide icons): **Öğren** (short topic pages and sign pages) → **Tekrarla** (the daily review brings back what you missed, on a schedule) → **Dene** (mock exam with results held until the end, then a per-topic review).
5. **Try one question:** the existing scenario card, now working, with immediate feedback and the "why".
6. **Browse signs by category:** links into the prerendered sign pages (good for SEO and quick use).
7. **For international students** (short block): traffic drives on the left; a residence permit is needed for a TRNC licence (per Wikipedia); Turkish terms are shown on English pages; link to "Getting a licence".
8. **Licence classes:** the existing licence cards, only classes verified for KKTC, no badge.
9. **Why you can trust it:** named sources, reviewed dates, "not official", "no account, your answers stay on your device", report a mistake, the project story in one sentence linking to About.
10. **FAQ (verified answers only):** exam language, classes, retakes, how readiness is estimated, where data is stored.
11. **Footer.**

### 5.3 Supporting pages

- **Sınav nasıl yapılır / How the exam works:** stages (learner permit → theory/sign check → lessons → practical), what is asked, pass rule, language, what to bring. Every claim has a source. A dated "what changed" log (the CyprusDriving.net pattern).
- **Ehliyet nasıl alınır / Getting a licence:** citizens vs residents vs students; driving-school registration (Infonorthcyprus reports that schools apply for the learner permit, and cites a 2022 Official Gazette rule on attending a school); foreign-licence conversion; the 2025 Turkey–TRNC licence agreement. Facts with dates and sources only.
- **Kaynaklar / Sources:** the legal texts and official pages used, the last check date per source, and the method ("içerik nasıl hazırlanır").
- **Hakkında / About:** the TRAF101 origin, authors, instructor credit, EMU. The current footer content moves here.
- **Gizlilik / Privacy:** "Cevapların hiçbir sunucuya gitmez" (true for a static app). Mention analytics if any is added (prefer a cookieless option).

---

## 6. Features to adopt

### Must (launch)

1. **Verified exam profile + "How the exam works" page** with sources and a checked date. Mock exams are labelled "practice format" until verified. Verify the licence class letters.
2. **Own SVG sign library for KKTC (Turkish-design) signs.** Remove the hotlinked CySigns images.
3. **Full TR/EN parity** of UI, questions, explanations and sign pages, with the Turkish term shown on EN pages.
4. **Prerendered bilingual pages** for every sign, category and topic: localized slugs, hreflang + x-default, canonical, sitemap, per-page title, description and OG image.
5. **Topic practice with immediate feedback,** a one-line "why", and a source per question.
6. **Leitner daily review** in localStorage, with export/import and reset.
7. **Hatalarım / My mistakes** with the exit rule (2 correct answers on different days).
8. **Name-the-sign mode** (oral rehearsal, self-graded).
9. **Mock exam:** feedback held until the end, flag and return, adjustable or untimed timer, per-topic results review, weak-topic retry.
10. **Progress page** with the readiness checklist and "what's missing". No fake percentages.
11. **WCAG 2.2 AA quiz pattern** (fieldset/radios, live region, focus management, focus-visible, contrast tokens, reduced motion).
12. **PWA offline** (prompt-based updates, self-hosted Inter).
13. **Demo-signal clean-up** from 3.1, plus 404, error, empty and offline states, the About page and the new footer.

### Should (next)

- "Emin değildim / I guessed" confidence toggle.
- "Bu soruda hata var / Report a mistake" link per question (mailto or a GitHub issue form with the question id).
- Driving-on-the-left primer and a roundabout explainer for international students.
- Printable sign sheet PDF per language, generated at build.
- TR↔EN glossary page.
- A larger scenario bank with verified explanations and own diagrams instead of emoji.
- A quiet days-practised streak (no leaderboard).
- Per-part scoring if the exam has a sign part and a rules part (the TheorieExamen pattern).

### Later

- FSRS scheduler behind the same item interface.
- Read-aloud (Web Speech API) for questions, like DVSA's voiceover.
- Hazard-style questions with own photos or video of northern roads.
- More languages common among KKTC students (e.g., Russian, Arabic, Persian), once TR/EN are stable.
- A shareable progress code for driving instructors (static, encoded in the URL; no backend).

---

## 7. Source index

**Fetched and read for this report**
- Official DVSA Theory Test Kit, App Store: https://apps.apple.com/gb/app/official-dvsa-theory-test-kit/id463295925
- GOV.UK pass mark: https://www.gov.uk/theory-test/pass-mark-and-result
- GOV.UK multiple-choice section (50 questions, 57 min, flagging): https://www.gov.uk/theory-test/multiple-choice-questions
- GOV.UK free practice test: https://www.gov.uk/take-practice-theory-test
- Theory Test Pro: https://www.theorytestpro.co.uk/
- Zutobi UK: https://zutobi.com/uk
- Driving-Tests.org: https://driving-tests.org/
- iTheorie: https://www.itheorie.de/
- Autorai on the CBR three-part exam: https://autorai.nl/theorie-examen-voor-auto-gaat-volledig-op-de-schop/
- ehliyetsinavsorulari.io: https://ehliyetsinavsorulari.io/
- kktcehliyet.xyz: https://kktcehliyet.xyz/
- kktcehliyet.com: https://www.kktcehliyet.com/
- Vizyon Sürücü Kursu FAQ (Lefkoşa): https://vizyonsoforokulu.com/kibris_surucu_kursu_sss.html
- Infonorthcyprus, driving licence: https://www.infonorthcyprus.com/driving-licence
- Wikipedia, Driving licence in Northern Cyprus: https://en.wikipedia.org/wiki/Driving_licence_in_Northern_Cyprus
- Wikipedia, Road signs in Cyprus (north follows Turkish design, DUR, left-hand traffic): https://en.wikipedia.org/wiki/Road_signs_in_Cyprus
- CySigns: https://cysigns.online/
- CyprusDriving.net learner licence guide: https://cyprusdriving.net/learning-to-drive/a-guide-to-the-cyprus-learner-student-driving-licences/
- Wikimedia Commons, SVG road signs in Turkey: https://commons.wikimedia.org/wiki/Category:SVG_road_signs_in_Turkey
- vite-ssg README: https://github.com/antfu-collective/vite-ssg
- Google, localized versions / hreflang: https://developers.google.com/search/docs/specialty/international/localized-versions
- vite-plugin-pwa guide: https://vite-pwa-org.netlify.app/guide/
- W3C, What's new in WCAG 2.2: https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/

**From search results (summaries, not full pages)**
- Driving Theory 4 in 1 listings: https://apps.apple.com/gb/app/driving-theory-test-4-in-1-kit/id829581836 and https://apps.apple.com/us/app/-/id6744391418
- ClickClickDrive: https://apps.apple.com/DE/app/id1435154541
- FahrAPP readiness (last 15 exams): https://www.wandernundmehr.at/faq/wie-erreiche-ich-100-in-der-fahrapp
- Fahrschule.de app (last 15 simulations, recency-weighted): https://apps.apple.com/de/app/fahrschule-de-2026/id413246093
- ADAC app features: https://www.giga.de/extra/apps/specials/die-besten-fuehrerschein-apps-fuer-android-ios-mit-dem-smartphone-zum-pruefungserfolg/
- German theory test rules (30 questions, 10 error points): https://www.bussgeldkatalog.de/theoriepruefung/ and https://www.tuev-nord.de/de/privatkunden/verkehr/fuehrerschein/theoretische-pruefung
- TheorieExamen app listing: https://apps.apple.com/py/app/cbr-theory-mock-exam-practice/id1601297412
- Turkish ehliyet apps: https://apps.apple.com/us/app/id1491476061 and https://apps.apple.com/us/app/-/id6755768618
- KKTC licence renewal guide citing the ministry (bub.gov.ct.tr): https://www.allianz.com.tr/tr_TR/seninle-guzel/kktc-ehliyet-yenileme-rehber-gerekli-belgeler-ve-adimlar.html
- Turkey–TRNC licence agreement: https://www.memurlar.net/haber/804517/turkiye-ve-kktc-arasinda-ehliyet-anlasmasi.html
- KKTC traffic regulation amendments (KTTO copy): https://www.ktto.net/wp-content/uploads/2025/10/1974-Motorlu-Araclar-ve-Yol-Trafik-Degisiklik-Tuzugu.pdf
- Commons Highways licensing table (Turkey "unclear"): https://c.enwp.org/wiki/Commons:WikiProject_Highways/Licensing

**Learning science**
- Dunlosky et al. (2013), APS summary: https://www.psychologicalscience.org/news/releases/which-study-strategies-make-the-grade.html
- Roediger & Karpicke (2006): https://psychology.ecu.edu/wp-content/pv-uploads/sites/216/2019/03/Roediger-Karpicke-2006.pdf
- Cepeda et al. (2008): https://pubmed.ncbi.nlm.nih.gov/19076480/
- Butler, Karpicke & Roediger (2007), feedback timing: https://profiles.wustl.edu/en/publications/the-effect-of-type-and-timing-of-feedback-on-learning-from-multip/
- Leitner system: https://en.wikipedia.org/wiki/Leitner_system
- FSRS: https://github.com/open-spaced-repetition/fsrs4anki

**Platform references (standard docs, not re-fetched for this report)**
- WCAG 2.2 Understanding 2.2.1 Timing Adjustable: https://www.w3.org/WAI/WCAG22/Understanding/timing-adjustable.html
- MDN, ARIA live regions: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions
- WebKit 7-day storage cap: https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/
- vue-i18n: https://vue-i18n.intlify.dev/
- Google FAQ rich results change (2023): https://developers.google.com/search/blog/2023/08/howto-faq-changes
- Lucide icons (ISC): https://lucide.dev/

**Open questions to settle with an official source before launch**
1. The KKTC theory/sign test format: oral or computer, number of questions, pass rule, and language options for non-Turkish speakers.
2. The KKTC licence class letters, and which classes have separate theory content.
3. The current consolidated text of the Motorlu Araçlar ve Yol Trafik Yasası and the sign regulation, to cite per question.
