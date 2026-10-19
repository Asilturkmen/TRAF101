# Test2Drive: current-site audit (baseline before production rebuild)

Audited 20 October 2026 against commit `0e442f6` (branch `dev`, same as `main`). No source files were changed for this audit.

**Method.** I ran the Vite dev server on port 5190 and a production build (`vite build`) served with `vite preview` on port 5191. I drove both with playwright-core and Microsoft Edge at 390x844 (mobile emulation, touch) and 1440x900, ran axe-core 4.x (WCAG 2.0/2.1/2.2 A+AA plus best-practice), did keyboard-only runs, measured layout overflow, and took throttled performance readings (4x CPU, 9 Mbps, 150 ms RTT). I also read every file under `src/` and `public/`, and fetched all 118 hotlinked sign images.

**Screenshot location.** All screenshots are in
`C:\Users\turkm\AppData\Local\Temp\claude\C--Users-turkm-GitHub-TRAF101\1315ec0c-afdd-49c8-8b19-04a5503d4057\scratchpad\audit\shots\`
(written as `SHOTS\` below). The `m-` prefix means 390x844 and `d-` means 1440x900. Contact sheets are in the sibling folder `...\scratchpad\audit\sheets\` (`m-home.png`, `m-views1.png`, `m-views2.png`, `m-study.png`, `d-home.png`, `d-study.png`, `d-views-a.png`, `d-views-b.png`, `d-results.png`, `d-scen.png`). The raw JSON logs are `...\scratchpad\audit\flows-m.json`, `flows-d.json`, `audit2-390.json`, `audit2-1440.json` and `report-a11y.txt`. These are temp files, so copy any you want to keep.

---

## TL;DR

- **The core loop works:** Study → sign category → sign detail; the B/C/D/EH license test → results with a review of wrong answers; Scenarios → feedback → result screen. The Study pages and the scenario feedback are the strongest parts of the product.
- **All ten suspected defects are confirmed.** The worst are these. `/quiz/A1` (linked from the homepage) hangs forever on "Loading Test...". `/quiz` (linked from History) throws `store.selectLicense is not a function`. A and B tests have **19** questions while the page promises 20. The correct answer is option **B in 50% of the bank** (D only once in 40). On mobile the nav is wider than the screen, so **History sits off-screen** and every page scrolls sideways.
- **Content is wrong in places, which matters more for a driving exam than any styling issue.** Two scenarios teach right-hand-traffic behaviour in a left-hand-traffic country: "pull to the right" for an ambulance, and uphill wheels "to the left". The yellow-diamond question is wrong under the Vienna convention. Two sign questions show the wrong image. One sign description contains stray Chinese characters ("This路径 is for animal riders only.").
- **Many claims are fake (claimed but not built):** "Timed practice sessions" / "30 Min", "Realistic exam simulation", "Progress Tracking" (History is a hard-coded empty state), "30+ Real Scenarios" (15 exist), "144+ signs" (118 exist), "Bilingual" (UI is English only; only sign names have Turkish), "Detailed explanations in both English and Turkish", "MIT License" (no LICENSE file).
- **A11y:** the Study hub category cards, all sign cards and the license-select cards are `div @click`, so **keyboard users cannot open any sign or category**. The sign modal has no dialog role, no focus move, no focus trap, no Escape and no accessible close label, and on mobile it is 433 px wide on a 390 px screen. axe reports about 150 colour-contrast nodes per width, from five token pairs.
- **SEO:** the site is a client-rendered SPA. Crawlers and link previews see an empty `<div id="app">`, one title for every route, no `og:image`, no canonical or hreflang, `lang="en"` only, the favicon `vite.svg`, and soft-404s: unknown URLs, `/robots.txt` and `/sitemap.xml` all return HTTP 200 with the app shell.
- **Performance is fine for the app itself** (143 kB JS / 51 kB gzip, LCP about 1.0–1.6 s throttled, CLS 0). The cost is the **2.2 MB of third-party JPEGs** from an S3 bucket with no Cache-Control header, 2 of which are broken. There is also a render-blocking chained Google Fonts `@import` with six weights, and a 160 KB, 1000x1000 EMU logo shown at 100x100.

---

## 1. Build and run

| Item | Result |
|---|---|
| `npm install` | `node_modules` already present. Dependencies: vue ^3.5.24, vue-router ^4.6.4, pinia ^3.0.4, vite ^7.2.4 (resolved 7.3.0), @vitejs/plugin-vue ^6.0.1 |
| Dev server | `npx vite --port 5190 --strictPort` was ready in 369 ms. The console shows no errors on load. |
| Production build | 59 modules in 783 ms, **no warnings** |
| `index.html` | 1.32 kB (0.59 kB gzip) |
| `assets/index-*.js` | **142.99 kB (51.41 kB gzip)**. It contains Vue, the router, Pinia, every eager view and the whole `questions.js` bank. |
| `assets/index-*.css` | 41.01 kB (7.51 kB gzip) |
| Lazy chunks | `SelectLicenseView` 1.60 kB JS + 1.19 kB CSS; `HistoryView` 0.94 kB JS + 1.23 kB CSS |
| Copied `public/` | `emu-logo.png` 159.9 kB (1000x1000, displayed 100x100); `logo.png` 31.6 kB (800x200, displayed 128x32); `signs.json` 39.6 kB; `scenarios.json` 20.6 kB; `vite.svg` 1.5 kB; `signs/*.svg` 13 files, 0.3–0.7 kB each |

The build output is in `...\scratchpad\audit\dist\`.

---

## 2. Defect verification

| # | Suspected defect | Confirmed? | Evidence |
|---|---|---|---|
| 1 | `/quiz/A1` hangs on "Loading Test..." because no question has A1 | **Yes** | The A1 pool is 0 questions: no entry in `src/data/questions.js` lists `'A1'` in `licenseTypeIds`. `startQuiz('A1')` sets `questions=[]`, `currentQuestion` is undefined, and `QuizView.vue` shows the `v-else` "Loading Test..." with no timeout or error. It was still showing after 3.5 s at both widths, with no console error. The homepage "A1 License / Start Test" card links here. Any unknown type such as `/quiz/ZZ` behaves the same way. Shots: `SHOTS\m-quiz-A1.png`, `SHOTS\d-quiz-A1.png`, `SHOTS\d-quiz-ZZ.png` |
| 2 | `/quiz` (SelectLicenseView) calls store functions that do not exist | **Yes** | The view uses `store.selectedLicenseTypeId`, `store.selectLicense()` and `store.startAttempt()`, but `src/stores/quiz.js` only has `startQuiz`, `submitAnswer` and `reset`. Clicking a card logs `pageerror: store.selectLicense is not a function` plus two Vue "Unhandled error" warnings. "Continue" stays disabled, so this page is a dead end. Even if it worked, `start()` pushes to `/quiz`, which is the same page. It offers B, A, C, D, EH and **no A1**. It is reached from History → "Start Practice Test". Shots: `SHOTS\d-quiz-select-after-click.png`, `SHOTS\m-quiz-select.png` |
| 3 | History is a static empty state | **Yes** | `HistoryView.vue` has no script logic beyond importing RouterLink. After finishing a full B test, `/history` still says "No History Yet". Nothing persists: there is no localStorage, and the store has no attempts array. Its CTA "Start Practice Test" leads to the broken `/quiz` (defect 2). Shots: `SHOTS\d-history-after-test.png`, `SHOTS\m-history.png` |
| 4 | A and B tests have 19, not 20, questions | **Yes** | `startQuiz` takes 8 "Signs" + 12 others. Pools: **A** 7 sign + 24 other = 19; **B** 7 + 27 = 19; C 8+26, D 8+25 and EH 8+26 = 20. The sign question `s6` (truck) is limited to C/D/EH. In the live run the counter read "Question 1 / 19" … "Question 19 / 19" at both widths. The homepage says "20 Questions" on every card. `QUIZ_CONFIG.QUESTIONS_PER_TEST: 20` is declared but never used. |
| 5 | Homepage sample scenario shows the answer and its buttons do nothing | **Yes** | Option B has the hard-coded class `choice-correct`: green border `rgb(16,185,129)` and tinted background, visible before any interaction. The three `<button class="choice-btn">` have no `@click`. After clicking A and C, the card's DOM was byte-identical and the URL unchanged. They have `cursor:pointer` and a hover style, so they look interactive. Only "Start Scenario Practice" works. Shots: `SHOTS\d-home-sample-scenario.png`, `SHOTS\m-home-sample-scenario.png` |
| 6 | The nav has no link to the license tests | **Yes** | `App.vue` nav has Home, Study, Scenarios and History only. Tests are reachable only from homepage buttons ("Take Practice Test" → `/quiz/B`, and the four license cards A1/B/C/D). **A and EH tests have no link anywhere that works.** The only route to them is the broken `/quiz` selector, so they exist only by typing the URL. |
| 7 | There is no 404 page | **Yes** | The router has no catch-all route. `/this-page-does-not-exist` renders header + footer with an **empty `<main>`** and logs `[Vue Router warn]: No match found`. `/study/bogus` also renders an empty main: the category is not found but data is loaded, so neither branch shows. The production server returns **HTTP 200** for unknown paths (soft 404). Shots: `SHOTS\d-unknown.png`, `SHOTS\m-unknown.png`, `SHOTS\d-study-bogus.png` |
| 8 | Sign images are hotlinked from an external S3 bucket | **Yes** | In `public/signs.json`, 117 of 118 images come from `https://cyprus-road-signs.s3.eu-central-1.amazonaws.com/signs/*.jpg` and 1 from `https://traffic-rules.com/img/europe/be/signs/mandatory/mandatory-direction-roundabout.png` (a **Belgian** sign set). Two are broken in the browser (`net::ERR_BLOCKED_BY_ORB`): `roundabout-mandatory` (HTTP 404 HTML) and `pedestrian-crossing-info` (HTTP 403 XML). They show as broken-image icons with alt text on `/study`, `/study/mandatory` and `/study/information` (`SHOTS\d-study-mandatory.png`, sheet `sheets\d-study.png`). The S3 responses carry **no Cache-Control** and no CORS or Timing-Allow-Origin headers. `metadata.source` is `"cysigns.online"`. Only the 8 quiz images are local SVGs. |
| 9 | Options are never shuffled, so correct answers cluster on option B | **Yes** | `QuizView.vue` renders `currentQuestion.options` in data order. The shuffle exists only in the unused `components/QuestionCard.vue`. Correct-option position across the 40-question bank: **A 7 / B 20 / C 12 / D 1**. Per license pool: A 5/15/10/1, B 5/17/11/1, C 6/15/12/1, D 6/14/12/1, EH 6/16/11/1. Always tapping B scores about 50%. Scenario choices are also unshuffled: correct is A in 7 of 15 and B in 8 of 15, **never C**. Question order *is* shuffled, with a biased `sort(() => Math.random()-0.5)`. |
| 10 | One answer tap advances immediately with no undo | **Yes** | `@click="handleOptionSelect(option.id)"` calls `submitAnswer`, which increments the index at once. There is no selected state, no confirm, no Back/Previous, no per-question feedback and no "review before submit". The browser Back button leaves the quiz with no warning, and progress is lost. Keyboard focus stays on the same-position button of the *next* question, so a double Enter answers two questions. Reloading `/results` loses state and redirects to `/`. "Take Another Test" resets and goes to the **homepage**, not to a new test of the same license. |

**Additional defects found (not in the brief):**

| Defect | Evidence |
|---|---|
| **Mobile nav overflows the screen.** History is off-screen and every page scrolls sideways | At 390 px, `div.nav-links` ends at x=464 (logo 128 px + links 320 px + padding). `scrollWidth` is 465 on every route. Playwright could not click "History" in the mobile header (timeout). Shots: `SHOTS\m-quiz-B-q1.png` (History cut off), sheet `sheets\m-views1.png` |
| Homepage hero cards `.card-glow` overflow (776 px wide at 390, 539 px at 1440) | They are clipped visually but add to overflow. Measured in `audit2-390.json` |
| On mobile, the homepage H1 sits **1,249 px down**: the first screen shows only 4 decorative category tiles | `order:-1` on `.hero-visual` at ≤1024 px. Mobile home is 10,093 px tall. Shots: `SHOTS\m-home-fold.png`, `sheets\m-home.png` |
| Mobile hero, Study hero and homepage text have **0 px side gutter** | `.section-padding { padding-left:0; padding-right:0 }` ("TRUE EDGE-TO-EDGE"). The H1 and paragraphs start at x=0 |
| Sign modal is 433 px wide on a 390 px screen (right edge at 449) | The description text is clipped. Shot `SHOTS\m-study-warning-modal.png` |
| Hero "category" tiles (Warning 46 / Prohibitory 35 / Mandatory 13 / Priority 8) look clickable (`cursor:pointer`, hover lift) but do nothing. **Information (16) is missing** | `HomeView.vue` `.modern-card` |
| Study hub / topic: `router.back()` "Back" button | On a deep link it leaves the site or does nothing useful |
| `QuizView` reads `route.params.licenseType` once (`const`) and starts in `onMounted` only | Navigating `/quiz/B` → `/quiz/C` in-app would reuse the component without restarting. There is no in-app link that does this today, so it is latent |
| `modal.speedLimit` ("Maximum Speed: … km/h") never renders | No sign in `signs.json` has a `speedLimit` field |
| Sign description typo with CJK characters | `mandatory/animal-riders`: "This路径 is for animal riders only." |
| `signs.json` `metadata.totalSigns: 144` vs 118 actual signs | README repeats "144+" |
| Quiz images contradict the prompt | `s5` "diamond shaped sign, usually yellow or orange" shows a **triangle** (`dangerous-bend.svg`). `s6` "truck with a red line" shows **No Entry**. `s2` "triangular sign" shows `children.svg`, which is fine. The `s1` STOP image prints the answer word |
| **Factually wrong for left-hand traffic (TRNC drives on the left)** | `scenario-5` correct answer "Pull to the right and stop"; option C is marked wrong as "Change lane suddenly to the left … Always move to the right for emergency vehicles." `scenario-7` "Turn wheels to the left, away from curb" when parking uphill; with left-hand traffic the curb is on the left, so "away" is right. These are US rules |
| Other content to verify with an expert | `s5`: under Vienna/UK convention a yellow diamond is **Priority Road**, not "Construction or Warning". `rw4` "4-way stop" is a US concept. `sp3` "75 km/h" for heavy vehicles. `tr5` alcohol limit "50 mg (0.05%)". `dd4` EU/AETR rest rules. `scenario-15` says call "155" (police) while `studyData.js` says "112/155". `dd5` grammar: "the first thing to securing the scene is:" |

---

## 3. Accessibility

axe-core results are the same at 390 and 1440 for these pages: `/`, `/study`, `/study/warning`, `/quiz`, `/quiz/B`, `/scenarios`, `/history`, unknown URL, sign modal open, `/results`, scenario feedback.

| Severity | Rule | Nodes | Where / detail |
|---|---|---|---|
| serious | color-contrast | 151 (390) / 148 (1440) | Five token pairs. `--color-text-muted #78909C` on white **3.35:1**: license-card "20 Questions • 30 Min", sign-card "TR: …" names, and the footer and other muted text. White on `#F59E0B` **2.14:1**: "MOST POPULAR" badge and scenario "Medium" badge. `#E67E22` on white **2.84:1**: quiz `.category-tag` ("SIGNS", "RIGHT OF WAY"). The scenario "Easy" badge, white on `#10B981`, is about 2.5:1 by calculation (axe sampled only the visible badge). "Hard" (`#EF4444`) is 3.8:1. |
| moderate | heading-order | 8 | Footer `<h4>` "Developed by" / "Course Information" follow h2/h3 on every page |
| moderate | page-has-heading-one | 2 | `/quiz/*` (the question is an `h2`, no h1) and the 404 / blank pages |

**Problems axe does not catch (verified manually):**

- **Keyboard: the Study section is unusable.** Tab order on `/study` is: logo, Home, Study, Scenarios, History, "← Back to Home", then body. **None of the 5 category cards is focusable.** `/study/warning` has the same problem: none of the 46 sign cards is focusable, so the modal can never be opened by keyboard. On `/quiz` the five `LicenseCard` divs are unreachable. All of these are `div @click` with no `tabindex`, `role` or key handler.
- **Keyboard quiz run (B, both widths): it works.** The `<button class="option-btn">` options take Tab/Enter, and I completed 19/19 by keyboard and reached `/results`. However, focus stays on the same-position button of the next question. There is no announcement that the question changed (no `aria-live`, no focus move to the prompt), and screen readers get no progress info (the progress bar is a bare div). The options are not grouped (`fieldset` / `radiogroup`).
- **Focus visibility:** there are no custom `:focus` or `:focus-visible` rules anywhere in the CSS. The browser default `outline: auto` is visible (teal/slate ring), so focus is visible but unstyled. Screenshot `SHOTS\kb-focus-390.png`, `SHOTS\kb-focus-1440.png`.
- **Sign modal:** no `role="dialog"`, no `aria-modal`, no `aria-labelledby`. Focus stays on `<body>` when it opens, and Tab walks into the page behind it: modal close → body → logo → Home → Study…. **Escape does not close it.** The close button's accessible name is "×" (no `aria-label`). Body scroll is not locked. It overflows at 390 px.
- **Scenario feedback:** after an answer, focus is dropped to `<body>`. The "Next Scenario →" button is about 1,424–1,576 px down, below the fold at both widths, and there is no live region for "Correct!" / "Incorrect".
- **Tap targets (mobile):** nav links are 38 px tall (Home 68x38, Study 68x38, Scenarios 96x38, History 77x38, the last one partly off-screen). The logo link is 128x32. "Back" buttons are 39–42 px. All pass WCAG 2.2 AA 24 px but are under the 44 px comfort target.
- **lang attribute:** `<html lang="en">` is fixed. Turkish strings (sign `nameTr`, footer name "Asil Türkmen") are not marked `lang="tr"`.
- **Alt text:** sign images use the sign name (good). The quiz sign image is always `alt="Traffic sign"`, which is generic and also hides what the question is about. Category "icons" are emoji in divs without `aria-hidden`, read aloud as "warning sign", "prohibited" and so on. The EMU logo alt is fine. The header logo alt is "Test2Drive" (fine).
- **No skip link.** Landmarks exist (header, nav, main, footer).
- **No `prefers-reduced-motion` handling:** there are infinite `bounce`/`scroll` keyframes in `HomeView.vue`, a staggered `scaleIn` on each sign card (46 x 30 ms = 1.4 s cascade), and hover transforms.
- **Colour-only meaning:** scenario difficulty uses badge colour plus text (OK). Correct/incorrect review uses ✅/❌ plus colour plus text (OK).
- **Duplicate accessible names:** four identical "Start Test" buttons on the homepage, and the "Start Learning Now" button appears twice.

---

## 4. Performance

Measured on the production build via `vite preview`, emulating a mobile device (390x844, DPR 2) with 4x CPU slowdown, about 9 Mbps down and 150 ms latency, cache disabled. Median of 3 runs.

| Route | LCP | FCP | CLS | Requests | LCP element |
|---|---|---|---|---|---|
| `/` | 1,268 ms | 1,268 ms | 0 | 6 | hero `div.card-icon` (emoji) |
| `/study` | 1,024 ms | 1,024 ms | 0 | 21 | hero subtitle `<p>` |
| `/study/warning` | 1,584 ms | 1,224 ms | 0 | 53 | `<p>` |
| `/quiz/B` | 1,152 ms | 912 ms | 0 | 6 | `h2.question-text` |

The measured transfer is about 250 KB per page. That **undercounts**: S3 images report `transferSize 0` because they send no Timing-Allow-Origin header. I fetched every image directly:

- **118 sign JPGs = 2.23 MB total** (median 17 KB, max 35 KB, `snow-chains`). The warning category alone is about 733 KB (46 images on one page) and prohibitory about 659 KB. The study hub loads 35 preview thumbnails (`loading="lazy"`). The topic grid has no lazy loading, no `width`/`height` and no `srcset`. There is **no Cache-Control** on the bucket, so repeat visits revalidate or re-download.
- **Two broken images** (404/403, blocked by ORB), as listed in defect 8.
- **Fonts:** `style.css` starts with `@import url(fonts.googleapis.com … Inter:wght@400;500;600;700;800;900)`. That is a render-blocking chain (app CSS → Google CSS → gstatic woff2), six weights, no preconnect, and a third-party privacy dependency.
- **Images in `public/`:** `emu-logo.png` 160 KB at 1000x1000, displayed at 100x100, so about 95% is wasted. `logo.png` 32 KB at 800x200, displayed at 128x32.
- **JS:** a single 51 kB-gzip main chunk is fine. The question bank is in it, `signs.json` and `scenarios.json` are fetched at runtime (40 + 21 KB, uncached, fetched again on every Study visit), and `/study/:id` refetches `signs.json` each time.
- **External requests per page:** `fonts.googleapis.com` and `fonts.gstatic.com` on every page, plus `cyprus-road-signs.s3.eu-central-1.amazonaws.com` (and `traffic-rules.com` on `/study` and `/study/mandatory`) on Study pages.
- **No service worker** and no offline support, although the use case (practising on a phone) would benefit.

---

## 5. SEO

| Check | Finding |
|---|---|
| Raw HTML vs rendered DOM | Raw HTML (what non-JS crawlers, link unfurlers, WhatsApp/Facebook/LinkedIn see) is only the `<head>` and an empty `<div id="app"></div>`. All copy, the 118 signs and the questions exist only after JS runs. No route is prerendered. |
| Titles per route | **Identical on every route:** "Test2Drive - Practice. Evaluate. Drive Safe." No `document.title` updates anywhere (checked all 17 captured routes). |
| Meta description | One global description that uses a different brand name: "TRNC Driving Safety - Master traffic signs…". `meta keywords` is present (ignored by search engines) and `meta author` is "TRNC Driving Safety". |
| Open Graph / Twitter | `og:type`, `og:title`, `og:description` only. **No `og:image`, `og:url`, `og:locale`** and no Twitter card, so shared links show no image. |
| Canonical / hreflang | None. No Turkish version exists, so no `tr` alternates. |
| `lang` | `en` only. The primary audience (KKTC exam candidates) searches in Turkish. |
| robots.txt / sitemap.xml | **Neither exists.** On the preview server both return **HTTP 200 text/html** (the SPA shell), so they are soft errors. |
| 404 handling | Unknown URLs return 200 plus an empty main (soft 404). |
| Favicon | `/vite.svg` (the Vite logo). No apple-touch-icon, no manifest, no theme-color. |
| Structured data | None. A quiz or learning-resource schema would be possible. |
| Heading structure | Homepage: one h1, and the badge above it repeats the same text. h2s carry decorative emoji ("🎬 Try a Real Situation"…). Quiz pages have no h1. |
| Internal linking | Many navigations are `<button @click="router.push()">` or `div @click` rather than `<a href>`, so crawlers cannot follow them. This applies to the Study categories, sign cards, homepage CTAs and license cards. Only the header nav and the History links are real anchors. |

---

## 6. Responsive

| Width | Problem | Evidence |
|---|---|---|
| 390 | **Horizontal scroll on every route** (`scrollWidth` 465 vs 390), caused by the nav | `audit2-390.json` overflow section |
| 390 | **History link off-screen**. Logo, then four pill links, no wrap and no menu | `SHOTS\m-quiz-B-q1.png`, `SHOTS\m-home-fold.png` |
| 390 | Homepage first viewport is four large decorative tiles. The H1 starts at y=1,249 and the CTAs at y=1,537 | `SHOTS\m-home-fold.png`, `sheets\m-home.png` |
| 390 | 0 px side gutter on the homepage hero and section text and the Study hero | measured: H1 left=0, Study hero H1 left=0 |
| 390 | Homepage scenario card and stats extend to x=413 | `audit2-390.json` |
| 390 | Sign modal is 433 px wide, so its content is clipped on the right | `SHOTS\m-study-warning-modal.png` |
| 390 | Mobile homepage is 10,093 px tall (about 12 screens). Four objective cards and four solution cards are each full-width | `SHOTS\m-home.png` |
| 390 | Scenario: you scroll past the whole feedback box to reach "Next" | `SHOTS\m-scen-1-feedback.png` |
| 1440 | No layout defects. `.card-glow` overflows its parent but is clipped | `SHOTS\d-home.png` |
| 1440 | "Loading Test..." and the empty 404 render as a near-blank page between header and footer | `SHOTS\d-quiz-A1.png`, `SHOTS\d-unknown.png` |

---

## 7. UX and visual critique: where it reads as a demo, and polish that fits the current design

The owner likes and is keeping the current look (teal palette in `style.css`, Inter, cards, the hero and section layouts). Nothing below proposes a redesign. These are the places where the site gives away "student demo" or "AI-generated", with fixes that stay inside the existing system.

**Fake or placeholder content**
- "30+ Real Scenarios", "5 Categories" and "100% Practical" stats. There are 15 scenarios (10 per run); "100% Practical" is filler. **Polish:** show real counts from the data (15 scenarios, 118 signs, 40 questions) in the same stat tiles.
- "Most Popular" badge on B. There is no data behind it. Remove it, or make it "Most common" with a source.
- "20 Questions • 30 Min" on every license card. A/B have 19, there is no timer, and the KKTC exam format is unverified (see `docs/research/benchmark.md`). Show real numbers from config.
- "Timed practice sessions", "Realistic exam simulation", "Category-specific questions", "Instant feedback … detailed performance feedback", "Detailed Explanations … in both English and Turkish". Only part of each is true. Rewrite each bullet to match what ships, or build the feature.
- "Application Objectives" and "Our Solutions" read like a course proposal ("Assess and evaluate users' driving readiness in the TRNC…", "Our mission to make TRNC roads safer…"). The same cards can carry user-facing benefits.
- Hero badge "Practice. Evaluate. Drive Safe." repeats the H1 word for word, and the footer repeats it again.
- Emoji as icons everywhere (🚗 🎬 🎯 💡 ⚠️ 🚫 🔵 🔺 📋 🏆 🚦 ✅ 📝 ⚡ 🔍 🌐 🏍️ 🚚 🚌 📊 🎉 💡 ✅ ❌ 🌟 👍 📚 🏙️ 🛣️ 🌦️ 🚨 🅿️). They render differently per OS (see the Windows emoji in screenshots), and "🔺" for Priority and "🔵" for Mandatory are not the real sign shapes. **Polish:** replace them with a small inline SVG icon set in the same positions and colours.
- Footer: student numbers "(21330934)", "(21330887)", "TRAF101 - Traffic Safety", the instructor, the EMU logo and "© 2025". This is fine for a course demo but is personal data and a university mark on a public product. **Decision needed:** keep it as an "About / credits" note, ask permission for the logo, and drop the student IDs.
- Favicon is `vite.svg`. Brand naming is inconsistent: "Test2Drive" (UI) vs "TRNC Driving Safety" (README, meta description, meta author, package name `trnc-driving-safety`). README calls the palette "Ocean Blue", but the CSS is teal (`#377272`, comment "Modern Teal Palette").

**Dead buttons and fake affordances**
- Sample-scenario choices (no handler, answer pre-highlighted). **Polish:** make the card a live one-question demo: hide the answer, reveal feedback on tap, using the same `choice-btn` styles already defined for correct/incorrect.
- Hero category tiles (pointer cursor plus hover, no link). Link them to `/study/<id>` and add the missing Information tile.
- `/quiz` selector (throws), A1 card (hangs), History CTA (goes to the broken selector).

**Missing states**
- No 404 page. No "category not found" on `/study/bogus`. No "no questions for this license" state. No load-failure state on Study and Scenarios: `fetch` errors are only `console.error`ed and the spinner spins forever.
- No per-question feedback in the license test, no answer selection state, no "Previous", no "Are you sure you want to leave?".
- Results: no "X of 19 correct", no pass mark shown (70% is hidden in code), no time taken (start and end times are recorded but unused), no category breakdown, no sign image in the review. "Take Another Test" goes home instead of restarting the same license. Results do not survive a reload.
- History: always empty.
- Scenario results show only a score. There is no list of which scenarios were missed.

**Broken flows and inconsistent naming**
- The test is reached by "Take Practice Test" (hero), "Start Test" (cards), "Start Practice Test" (History) and "Take Another Test" (results). They lead to three different places: `/quiz/B`, `/quiz/:id` and `/quiz` (broken).
- The page is named "Traffic School" (Study hero) but the nav says "Study", and "Scenario Practice" (page) appears as "Scenarios" (nav). The results heading "Ready for Traffic!" vs "More Practice Needed" is fine, but scenario results say "Quiz Complete!" while the license test has no such heading.
- "← Back to Home" buttons on Study and Scenarios duplicate the nav. The "Back" on topic pages uses `history.back()`.
- License letters shown: A1, B, C, D on the homepage; B, A, C, D, EH in the selector; A, A1, B, C, D, EH in the README. Three different lists.

**Unfinished pages**
- `/history`: placeholder. `/quiz`: broken. `ResultsView.vue`: half-written, with long monologue comments ("Let's assume…", "I'll skip complex 'same seed' logic…") that are typical of generated code. `HelloWorld.vue` and `assets/vue.svg` are Vite scaffold leftovers.

**Polish inside the current design (no new look)**
1. Fix the mobile nav: a hamburger or bottom tab bar using the same pill styles, or icon plus label at four items. Add a "Tests" item.
2. Add a 16–24 px side gutter at ≤640 px (`.section-padding`). On mobile, put the hero text before the tiles, or shrink the tiles to a 2x2 grid.
3. Make every clickable card a real `<a>` / `<RouterLink>` with focus styles matching the existing hover lift.
4. Add `:focus-visible` rings in `--color-primary`.
5. Darken `--color-text-muted` to about `#5F7884` (≥4.5:1). Use dark text on the amber and green badges, or darker badge fills. Use `#B85F12` for the orange category tag.
6. Shuffle options per question, show a selected state with a short confirm/next step or immediate feedback, and add Previous. The scenario view already has the right interaction pattern; reuse it.
7. Results: show the count, the pass mark, the time and per-category bars, inside the existing score card.
8. History: store attempts in localStorage and list them in the existing empty-state card layout.
9. Self-host the sign images as SVG/WebP and Inter (two or three weights). Shrink the logos.
10. Add a real 404 view using the History empty-state layout. Add per-route titles, `og:image` and a favicon from `logo.png`.

---

## 8. Exhaustive inventory

Status key: **W** = working, **B** = broken, **F** = fake (claimed but not implemented), **U** = unused / dead code, **P** = partial.

### 8.1 Global shell (`src/App.vue`, `index.html`, `src/style.css`)

| Item | Verbatim text / data | Status | Notes |
|---|---|---|---|
| `<title>` | "Test2Drive - Practice. Evaluate. Drive Safe." | W | Same on every route |
| meta description | "TRNC Driving Safety - Master traffic signs and rules for Northern Cyprus. Practice tests, comprehensive sign database, and study materials for all license types." | P | Wrong brand; "all license types" is false |
| meta keywords | "TRNC driving test, Cyprus traffic signs, driving license, traffic safety, road signs" | W | Obsolete tag |
| meta author | "TRNC Driving Safety" | W | Brand mismatch |
| og:type / og:title / og:description | "website" / "Test2Drive - Practice. Evaluate. Drive Safe." / "Comprehensive training for safe driving in Northern Cyprus. Practice tests and complete sign database." | P | No og:image or og:url |
| Favicon | `/vite.svg` | F | Vite logo |
| `<html lang>` | `en` | W | Single language |
| Header logo | `<img src="/logo.png" alt="Test2Drive">` → `/` | W | 800x200 PNG shown at 128x32 |
| Nav links | "Home" `/`, "Study" `/study`, "Scenarios" `/scenarios`, "History" `/history` | P | Overflows at 390 px; no Tests link |
| Active nav state | gradient pill on the current route (`route.path` checks) | W | |
| Unused CSS `.logo-text` | gradient text style | U | No element uses it |
| Footer "Developed by" | "Developed by" / "Asil Türkmen (21330934)" / "Arda Günsüren (21330887)" | W | Student IDs are public |
| Footer logo | `<img src="/emu-logo.png" alt="Eastern Mediterranean University">` | W | 160 KB; logo-rights question |
| Footer "Course Information" | "Course Information" / "TRAF101 - Traffic Safety" / "Instructor: Assoc.Prof.Dr Metin Kurt" | W | |
| Footer bottom | "© 2025 Test2Drive. Practice. Evaluate. Drive Safe." | W | Year is hard-coded |
| Design tokens | `--color-primary #377272`, primary-light `#5E9393`, lighter `#89B6B6`, secondary `#00897B`, accent `#E67E22`, success `#27AE60`, danger `#E74C3C`, warning `#F1C40F`, bg `#F8FAFA`/`#F0F4F4`/`#E8ECEC`, text `#2C3E50`/`#546E7A`/`#78909C`, borders, 5 category bg/border pairs, 4 gradients (`--gradient-primary/accent/hero/warm` + `secondary`), 5 shadows, radii 6–24 px + full, spacing xs–3xl, transitions 150/250/350 ms | W | Keep. `--color-text-muted` fails contrast. Category colour tokens and `--gradient-warm` are barely used |
| Global utilities | `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-large`, `.card` (hover lift), `.grid-2/3/4`, `.bento-grid` + `.bento-item-1/2/3`, `.text-center`, `.text-white`, `.bg-gradient-hero`, `.bg-gradient-accent`, `.animate-fadeIn`, `.animate-scaleIn`, `.section-padding` (0 padding), `.full-bleed` | W | `.btn{width:100%}` at ≤640 px |
| Google Fonts Inter 400–900 | `@import` in style.css | W | Render-blocking, third-party |

### 8.2 Routes (`src/router/index.js`)

| Path | Name | Component | Status |
|---|---|---|---|
| `/` | home | HomeView (eager) | W |
| `/study` | StudyHub | StudyHubView | W (not keyboard-operable) |
| `/study/:topicId` | StudyTopic | StudyTopicView | W for 5 ids; blank for unknown ids |
| `/quiz` | SelectLicense | SelectLicenseView (lazy) | **B** |
| `/quiz/:licenseType` | Quiz | QuizView | W for B/C/D/EH (and A by URL); **B** for A1 or unknown |
| `/results` | Results | ResultView | W only right after a test; a direct visit redirects to `/` |
| `/scenarios` | Scenarios | ScenarioQuizView | W |
| `/history` | History | HistoryView (lazy) | **F** |
| catch-all | — | none | **missing** (blank page) |
| `/select-license` | — | referenced by ResultsView | **does not exist** |

### 8.3 Home (`src/views/HomeView.vue`)

| Section | Verbatim copy | Interactive elements | Status |
|---|---|---|---|
| Hero badge | "🚗" "Practice. Evaluate. Drive Safe." | — | W (duplicates H1) |
| Hero H1 | "Practice. Evaluate. Drive Safe." | — | W |
| Hero paragraph | "Complete digital learning platform for TRNC traffic rules and signs. Interactive lessons, practice tests, and everything you need to excel." | — | P ("interactive lessons" do not exist) |
| Hero CTA 1 | "Start Learning Now" + chevron SVG | button → `/study` | W |
| Hero CTA 2 | "Take Practice Test" | button → `/quiz/B` | W (always B; 19 questions) |
| Hero tiles | "⚠️ Warning 46 Signs", "🚫 Prohibitory 35 Signs", "🔵 Mandatory 13 Signs", "🔺 Priority 8 Signs" | look clickable, no handler | F (counts hard-coded but correct; Information 16 missing) |
| Decorative | `.hero-pattern`, `.card-glow` | — | W (glow overflows) |
| Scenario preview H2 | "🎬 Try a Real Situation" / "Test your decision-making skills in realistic driving scenarios" | — | W |
| Sample card | badge "Sample Scenario"; icon "🚸"; H3 "School Zone Situation"; "You're driving at 50 km/h when you notice a school zone sign. Children are playing near the road. What should you do?" | | W (copy duplicated from scenario-1) |
| Sample choices | "A Maintain current speed if no children are crossing", "B Slow down to 30 km/h and stay alert" (pre-marked correct), "C Honk to warn children and continue" | 3 buttons, no handlers | **F** |
| Sample CTA | "Start Scenario Practice" + chevron | button → `/scenarios` | W |
| Stats | "30+ Real Scenarios", "5 Categories", "100% Practical" | hover only | **F** (15 scenarios) / W (5) / filler |
| Objectives H2 | "🎯 Application Objectives" / "Our mission to make TRNC roads safer through comprehensive driver education" | — | W (proposal tone) |
| Objective cards | "📋 Evaluate Readiness – Assess and evaluate users' driving readiness in the TRNC with comprehensive testing." · "🏆 License-Specific Practice – Provide targeted practice tests tailored for all TRNC driving license categories." · "🚦 Traffic Sign Knowledge – Improve traffic sign knowledge and awareness through interactive learning." · "✅ Safe Driving – Support safe and informed driving preparation for all license candidates." | hover lift only | P ("all categories" is false: A1 is broken, A/EH unreachable) |
| Solutions H2 | "💡 Our Solutions" / "Comprehensive tools and features designed for your success" | — | W |
| Solution: tests | "📝 License-Based Practice Tests – Comprehensive practice tests for all TRNC driving licenses - from motorcycles to passenger transport vehicles." bullets "✓ Category-specific questions", "✓ Realistic exam simulation", "✓ Timed practice sessions" | — | P / **F** / **F** |
| Solution: feedback | "⚡ Instant Feedback – Get immediate scoring and detailed performance feedback after every test." | — | P (score + wrong answers only) |
| Solution: explanations | "🔍 Detailed Explanations – Learn with comprehensive traffic sign explanations in both English and Turkish." | — | **F** (Turkish = sign names only) |
| Solution: platform | "🌐 Simple & Accessible Platform – Easy-to-use web-based platform accessible anytime, anywhere on any device." bullets "✓ No downloads required", "✓ Mobile-friendly design", "✓ 100% Free to use" | — | W / **P** (mobile nav broken) / W |
| License H2 | "Choose Your License Type" / "Select the category that matches your goal" | — | W |
| License cards | "🏍️ A1 License – Motorcycles up to 125cc – 20 Questions • 30 Min – Start Test" → `/quiz/A1`; "Most Popular" "🚗 B License – Private cars & light vehicles – 20 Questions • 30 Min – Start Test" → `/quiz/B`; "🚚 C License – Heavy goods vehicles – …" → `/quiz/C`; "🚌 D License – Passenger transport – …" → `/quiz/D` | whole card div clickable plus inner button | A1 **B**; B W (19 Q); C, D W; "30 Min" **F**; "Most Popular" **F**; A and EH absent |
| CTA band | H2 "Ready to Start Your Journey?" / "Begin learning today and pass your TRNC driving exam with confidence" / button "Start Learning Now" → `/study` (inline style white) | | W |
| Unused CSS | `.stat-badge`, bounce/scroll keyframes (scroll indicator), `slideIn` | — | U (selectors without markup) |

### 8.4 Study hub (`/study`, `StudyHubView.vue`)

| Item | Verbatim / data | Status |
|---|---|---|
| Back button | "← Back to Home" → `/` | W |
| H1 / subtitle | "Traffic School" / "Comprehensive training for safe driving in Northern Cyprus. Master all traffic signs and rules before taking your test." | P ("rules" are not covered; signs only) |
| Category cards (×5 from `signs.json`) | icon, "{n} signs" chip, name, description, 7 thumbnails + "+{n} more", footer "Explore All Signs →" | W by mouse/touch; **B** by keyboard |
| Categories | Warning Signs (46) "Triangular signs with red border warning of potential dangers ahead"; Prohibitory Signs (35) "Circular signs with red border indicating what is not allowed"; Mandatory Signs (13) "Blue circular signs indicating mandatory actions"; Priority Signs (8) "Signs indicating right of way rules"; Information Signs (16) "Signs providing information and directions" | W |
| Category data fields | `id, name, nameEn, nameTr, icon, color, description, signs[]` | `nameTr` (e.g. "Uyarı İşaretleri") and `nameEn` are **never displayed** (U) |
| Loading state | spinner + "Loading traffic signs..." | W (no error state) |

### 8.5 Study topic (`/study/:topicId`, `StudyTopicView.vue`)

| Item | Verbatim / data | Status |
|---|---|---|
| Back | chevron + "Back" (`router.back()`) | P |
| Header | icon, badge "{n} Traffic Signs", H1 category name, description | W |
| Section | H2 "All {Category name}" / "Click on any sign to see detailed information" | W ("Click" on touch devices) |
| Sign card | image (alt = name), name, "TR: {nameTr}" | W mouse; **B** keyboard; 2 images broken |
| Modal | "×" close; image; H2 name; "Turkish: {nameTr}"; category badge (bg = `category.color`); "Description" + text; optional "⚡ Maximum Speed: {n} km/h" | W by mouse; a11y **B**; speed block U (no data) |
| Loading | spinner + "Loading signs..." | W (unknown id → blank, **B**) |
| Sign data | 118 signs, fields `id, name, nameTr, image, description`, all filled. Full list in `public/signs.json` | W (1 typo with CJK characters; 2 broken images; 117 hotlinked) |
| `metadata` | version 2.0.0, source "cysigns.online", lastUpdated 2024-12-24, totalSigns 144 | count wrong |

### 8.6 License test (`/quiz/:licenseType`, `QuizView.vue` + `stores/quiz.js`)

| Item | Verbatim / data | Status |
|---|---|---|
| Progress bar | width = answered / total | W (0% on Q1; not exposed to AT) |
| Badge | "{type} License Test" | W |
| Counter | "Question {i} / {n}" | W (n = 19 for A/B) |
| Category tag | "Signs" / "Speed Limits" / "Right of Way" / "Traffic Rules" / "Driving Duties" (shown uppercase) | W (contrast fail) |
| Prompt | `h2.question-text` | W |
| Sign image | `<img alt="Traffic sign">` for the 8 sign questions, local SVG | W (2 mismatched images) |
| Options | 4 buttons, data order | W but **unshuffled**; advances instantly; no undo |
| Loading | "Loading Test..." | **B** (infinite for A1 or unknown) |
| Selection rules | 8 random "Signs" + 12 random others, shuffled by biased sort | P (yields 19 for A/B) |
| Store state | `licenseType, questions, userAnswers, currentQuestionIndex, startTime, endTime` | start/end time recorded but never shown (U) |
| `QUIZ_CONFIG` | `QUESTIONS_PER_TEST: 20`, `PASSING_SCORE_PERCENTAGE: 70` | **U** (ResultView re-declares 70) |
| Question bank | 40 questions: 8 Signs, 8 Speed Limits, 8 Right of Way, 8 Traffic Rules, 8 Driving Duties. Difficulty: easy 11, medium 20, hard 9. All have 4 options and exactly 1 correct answer, plus an explanation. Fields `id, licenseTypeIds, category, difficulty, prompt, options[{id,text}], correctOptionIds[], explanation, image?` | `difficulty` is never shown in QuizView (U). `correctOptionIds[]` is an array that allows multi-answer, never used |
| License coverage | A 31, A1 **0**, B 34, C 34, D 33, EH 34 | A1 **B** |
| Local SVGs | `public/signs/` 13 files; used by questions: stop, children, ahead-only, speed-50, dangerous-bend, no-entry (×2), give-way. **Unused:** parking, speed-30, double-dangerous-bend, pedestrian-crossing, road-narrows, steep-descent | 6 U |

### 8.7 Results (`/results`, `ResultView.vue`)

| Item | Verbatim | Status |
|---|---|---|
| Icon + heading | "🎉" "Ready for Traffic!" (≥70%) / "⚠️" "More Practice Needed" | W |
| Score circle | "{percentage}%" "Score" | W (no count, no pass mark) |
| Feedback | "You have demonstrated a good understanding of the rules." / "Please review the driving rules and signs before hitting the road." | W |
| Button | "Take Another Test" → `store.reset()` and `/` | P (goes home) |
| Review | H3 "Review Incorrect Answers"; for each wrong answer: prompt, "❌ {your answer}", "✅ {correct answer}", "💡 {explanation}". The fallback text "Skipped" is unreachable | W (no images, no correct-answer review) |
| Guard | redirects to `/` if no questions (direct visit or reload) | W, but results are lost on reload |

### 8.8 Scenarios (`/scenarios`, `ScenarioQuizView.vue` + `public/scenarios.json`)

| Item | Verbatim / data | Status |
|---|---|---|
| Header | "← Back to Home"; H1 "🎬 Scenario Practice"; "Real-world driving situations" | W |
| Progress | "Scenario {i} / 10", "Score: {s} / {answered}", bar | W |
| Meta | category badge with icon (urban 🏙️, highway 🛣️, weather 🌦️, emergency 🚨, parking 🅿️, fallback 📝); difficulty badge (easy `#10B981`, medium `#F59E0B`, hard `#EF4444`) | W (contrast fail) |
| Body | big emoji `image`, H2 title, situation text | W |
| Choices | 3 buttons "A/B/C" + text; after an answer they lock and show ✓/✗ | W (unshuffled; correct never C) |
| Feedback box | "✅ Correct!" / "❌ Incorrect", choice-specific feedback, "Explanation: …", button "Next Scenario →" / "View Results" | W (best-designed interaction in the app) |
| Results | "🎯" "Quiz Complete!" "{s} / 10" "{pct}%"; ≥80% "🌟 Excellent! You have a strong understanding of real driving situations."; ≥60% "👍 Good job! Keep practicing to improve your decision-making skills."; else "📚 Keep learning! Review the scenarios and try again to improve."; buttons "Try Again" (reshuffle), "Back to Home" | W (shot `SHOTS\d-scen-results.png`) |
| Loading | spinner + "Loading scenarios..." | W (no error state) |
| Data | 15 scenarios (urban 4, highway 3, weather 3, emergency 3, parking 2; easy 4, medium 7, hard 4); fields `id, category, difficulty, title, situation, image (emoji), choices[{id,text,correct,feedback}], explanation`; 10 drawn per run. Titles: School Zone Situation, Pedestrian Crossing, Overtaking Decision, Heavy Rain Driving, Ambulance Approaching, Roundabout Entry, Parking on a Hill, Tire Blowout, Fog Visibility, Brake Failure, Traffic Light Turning Yellow, Merging onto Highway, Parallel Parking, Hydroplaning, Accident Scene | W; **content errors** in scenario-5 and scenario-7 |
| `metadata` | version 1.0.0, totalScenarios 15, categories list | W |

### 8.9 History (`/history`, `HistoryView.vue`)

| Item | Verbatim | Status |
|---|---|---|
| H1 / subtitle | "Test History" / "Track your progress and review past performance" | **F** |
| Empty state | "📊" "No History Yet" "Take your first practice test to start tracking your progress!" | **F** (always shown) |
| Buttons | "Start Practice Test" → `/quiz` (broken); "Back to Home" → `/` | B / W |

### 8.10 License select (`/quiz`, `SelectLicenseView.vue` + `LicenseCard.vue` + `data/licenses.js`)

| Item | Verbatim | Status |
|---|---|---|
| Heading | "Select License Type" / "Choose the vehicle class you want to practice for." | W (renders) |
| Cards (`licenses.js`) | "B - Car / Standard passenger car license." · "A - Motorcycle / All types of motorcycles." · "C - Truck / Heavy goods vehicles." · "D - Bus / Buses and coaches." · "EH - Hazard / Vehicles carrying hazardous materials." | **B** (click throws; no A1) |
| Button | "Continue" (always disabled) | **B** |

### 8.11 Unused code and data

| File | Content | Status |
|---|---|---|
| `src/views/ResultsView.vue` | Alternative results page: `ResultsSummary`, buttons "Change License" (→ `/select-license`, which does not exist), "Home", "Retake Test"; "Review" list of "Q{n}: {category}" + "Correct"/"Incorrect"; hint "Check History for detailed breakdown if needed."; fallback "Loading results... or no results found." Calls the missing `store.init`, `completedAttempts`, `selectLicense`, `startAttempt` | **U** (not routed) and would be **B** |
| `src/components/ResultsSummary.vue` | "{pct}%", "PASSED"/"FAILED", "{correctCount} correct out of {total}", empty categories div ("We could compute category breakdown here") | U |
| `src/components/QuestionCard.vue` | Category + difficulty badges, **option shuffle**, single/multi-select (`listbox`/`option` roles, Enter key), placeholder "[Image: {category} Sign]" | U (its shuffle and difficulty badge are worth reusing) |
| `src/components/QuizProgress.vue` | "Question {n} / {total}" + "{pct}%" bar | U |
| `src/components/LicenseCard.vue` | Used only by the broken SelectLicenseView | P |
| `src/components/HelloWorld.vue` | Vite scaffold: "count is {n}", "Edit components/HelloWorld.vue to test HMR", create-vue links, "Click on the Vite and Vue logos to learn more" | U (delete) |
| `src/assets/vue.svg`, `public/vite.svg` | Scaffold logos (vite.svg is the favicon) | U / F |
| `src/data/studyData.js` | 5 sections never rendered. Content that exists **nowhere else in the UI** is listed below | **U** |

`studyData.js` content not used anywhere else (keep or migrate it; do not drop it silently):
- **Signs & Markings** ("Traffic Signs & Markings", "Complete guide to Road Signs in Northern Cyprus."), with tips per sign family: Warning "Triangular signs with a red border warn drivers of potential dangers ahead." tip "Slow down immediately when you see a triangle." · Prohibitory "Circular signs with a Red Border tell you what you MUST NOT do." tip "Disobeying these is a direct traffic offense." · Mandatory "Blue circles give positive instructions. You MUST follow them." tip "Blue = DO THIS." · Priority "Signs that regulate who goes first at intersections." tip "These are the most critical signs for safety." · Information "Rectangular signs giving information, directions, or facilities." tip "Usually Blue or Green." It also lists signs (with unicode icons) partly absent from `signs.json`: Maximum Speed 30/50/65/80/100 as separate signs (signs.json has one generic "Maximum Speed"), No Left Turn, Minimum Speed 30, Hospital, Turn Left (immediate, not "ahead").
- **Rules of the Road** ("The laws you must obey."): Driving Side "Drive on the LEFT. Overtake on the RIGHT." tip "Roundabouts are Clockwise." · Right of Way "Give way to traffic from the RIGHT at uncontrolled junctions and roundabouts." tip "Right hand rule applies." · Traffic Lights "Red: Stop. Red+Amber: Get Ready. Green: Go. Amber: Stop if safe. Flashing Amber: Proceed with caution (Yield)." tip "Flashing Amber = Yield Sign." · Parking Rules "Do not park on double yellow lines. Do not park against logic (facing traffic flow)." tip "Never block a hydrant."
- **Safety & Operations** ("Defensive driving and maintenance."): Cockpit Drill "Doors, Seat, Steering, Seatbelt, Mirrors." tip "Every trip." · Maintenance "Petrol, Oil, Water, Electrics, Rubber." tip "Weekly checks." · Safe Distance "Dry: 2 Seconds. Wet: 4 Seconds. Icy: 10 Seconds." tip "Only a fool breaks the 2-second rule."
- **Emergencies** ("Accidents and Breakdowns."): Accidents "Stop. Warn. Help. Call 112/155." tip "Do not move injured people." · Breakdowns "Hazard lights on. Warning triangle 45m back." tip "Safety first."
- **Legal & Penalties** ("Fines and Limits."): Alcohol Limit "50mg (0.05%) limit." tip "Zero tolerance is best." · Documents "License, Insurance, Registration, Tax." tip "Carry them always."

### 8.12 README claims

| Claim | Status |
|---|---|
| Title "🚗 TRNC Driving Safety" | Brand mismatch with Test2Drive |
| "Complete Sign Database: 144+ traffic signs organized by category" | **F** (118, organised in 5 categories: true) |
| "Practice Tests: License-specific quizzes (A, A1, B, C, D, EH)" | P (A1 broken; A and EH unreachable from the UI; questions are mostly shared, 28 of 40 apply to every license) |
| "Instant Feedback: Review incorrect answers with explanations" | W |
| "Progress Tracking: Monitor your learning journey" | **F** |
| "Bilingual: English interface with Turkish translations" | P (sign names only) |
| "Responsive Design: Works on desktop, tablet, and mobile" | P (mobile nav overflow) |
| Tech stack (Vue 3 `<script setup>`, Vite, Pinia, Vue Router, custom CSS) | W |
| "Node.js 16+" | **Wrong**: Vite 7 needs Node 20.19+ / 22.12+ |
| Project structure "public/signs/ # Traffic sign images", "signs.json # Sign database" | P (folder has 13 quiz SVGs; study images are remote) |
| Design system: "Ocean Blue color palette", "Inter font family", "Consistent spacing and typography scales", "Smooth transitions and micro-animations", "Responsive grid systems" | Palette is actually teal; the rest is W |
| License list "A1: Motorcycles (50-125cc)", "A: All motorcycles", "B: Standard passenger cars", "C: Heavy goods vehicles", "D: Buses and coaches", "EH: Hazardous materials transport" | Unverified against KKTC classes (see benchmark.md) |
| "Contributions are welcome! …" | — |
| "This project is licensed under the MIT License." | **F** (no LICENSE file) |
| "Traffic sign data and regulations based on TRNC traffic laws and standards." | Unsourced; images come from cysigns / Belgian set |

---

## 9. Keep list (good, must survive the rebuild)

1. **Visual system** (the owner's call, and it holds up at 1440): teal tokens, Inter, card radii and shadows, the hero split with the gradient, the bento solutions grid, and the gradient CTA band (`SHOTS\d-home.png`).
2. **Study section structure:** five category cards with thumbnail previews and a "+N more" tile, then a full grid with EN name plus "TR:" name, then a detail modal with Turkish name, category badge and description. The 118-sign dataset with complete EN/TR names and descriptions is the most valuable content asset (`SHOTS\d-study.png`, `SHOTS\d-study-mandatory.png`).
3. **Scenario practice interaction:** lock on answer, ✓/✗ marking, choice-specific feedback plus a general explanation, then Next. Keep the category and difficulty badges, the running score and the tiered result messages (`SHOTS\d-scen-1-feedback-full.png`). This pattern should become the model for license practice mode.
4. **The 15 scenarios with per-choice feedback**, once the left-hand-traffic errors are fixed.
5. **The 40-question bank** with categories, difficulty, explanations and license tagging (`licenseTypeIds`), plus the 8:12 sign/other mix idea. Every question has an explanation.
6. **Results "Review Incorrect Answers"** with your answer, the correct answer and the explanation (`SHOTS\d-results-B.png`).
7. **The `studyData.js` rules/safety/emergency/legal content** (cockpit drill, POWER checks, 2/4/10-second rule, traffic-light sequence, breakdown triangle at 45 m, documents). It is unused today but is the only "rules" content.
8. **Unused but useful code ideas:** the option shuffle and difficulty badge in `QuestionCard.vue`, `QuizProgress.vue`, the PASSED/FAILED plus "X correct out of Y" summary in `ResultsSummary.vue`, and `QUIZ_CONFIG`.
9. **Small, fast app core:** about 51 kB gzip JS, CLS 0, LCP under 1.6 s throttled. Native `<button>` options in the quiz are keyboard-operable.
10. **Credits:** developers, the course (TRAF101) and the instructor should survive in some form, such as an About or credits line, per the owner's no-silent-drop rule, even if the student IDs and logo change.
11. **Copy worth keeping:** "Practice. Evaluate. Drive Safe." (tagline), "Traffic School", "Try a Real Situation", the scenario result messages, and the results feedback lines.

---

## 10. Must-fix list (priority order)

1. **Content correctness:** fix scenario-5 (pull **left** for emergency vehicles) and scenario-7 (uphill with curb on the left: wheels **right**). Fix the s5 diamond question and the images for s5 and s6. Fix the "This路径" typo. Have a KKTC instructor check every speed, alcohol, emergency-number and rest-time fact. Verify the exam format and the license class letters (see benchmark.md).
2. **A1:** add A1 questions or remove the A1 card. Show an empty or error state instead of an infinite "Loading Test...".
3. **Remove or rebuild `/quiz`:** a working license selector listing every license that has a bank, linked from the nav. Make A and EH reachable.
4. **Exactly N questions per test:** enforce `QUESTIONS_PER_TEST` and top up when sign questions run short. Show real counts and remove the "30 Min" claim unless a timer is built.
5. **Shuffle options** and rebalance the correct-answer positions in the data. Shuffle scenario choices too. Use an unbiased Fisher–Yates for question order.
6. **Answer flow:** selected state, then confirm or immediate feedback, Previous/review, leave-quiz warning, persist the in-progress attempt, and "Retake" for the same license.
7. **History:** persist attempts (localStorage) and render them, or remove the page and its claims.
8. **Mobile nav overflow and gutters:** no horizontal scroll at 360–430 px, every nav item reachable, ≥16 px side padding, hero text in the first viewport.
9. **Keyboard and screen-reader access:** category, sign and license cards as links or buttons. Modal with `role=dialog`, focus move and trap, Escape, labelled close, scroll lock, and fitting the 390 px screen. A live region or focus management in the quiz and scenarios. Visible `:focus-visible` styles. A skip link. `prefers-reduced-motion`.
10. **Contrast:** muted text, amber and green badges, and the orange category tag must reach ≥4.5:1.
11. **Sign images:** self-host them (ideally redrawn KKTC SVGs, given licensing; see benchmark.md), fix the 2 broken ones, and set width/height, lazy loading and long cache.
12. **404 and not-found states:** catch-all route and page, `/study/:bad` message, fetch-error states; real 404 status from the static host.
13. **SEO baseline:** prerender routes (planned vite-ssg), per-route title and description, `og:image`/`og:url`, canonical plus hreflang TR/EN, `lang` per locale, robots.txt, sitemap.xml, and a real favicon and manifest.
14. **Homepage honesty pass:** make the sample scenario a live demo or hide the answer; link the hero tiles and add Information; real stats; delete "Most Popular" and the unbuilt feature bullets; unify the brand name (Test2Drive) across README, meta and package.
15. **Bilingual:** the UI is English only today. Every string above needs a Turkish counterpart; sign `nameTr` and category `nameTr` already exist and should be displayed.
16. **Fonts and logos:** self-host Inter with 2–3 weights and preload; resize `emu-logo.png` and `logo.png`.
17. **Cleanup:** delete `HelloWorld.vue` and `vue.svg`; decide the fate of `ResultsView.vue` and `ResultsSummary.vue` (merge ideas, then delete); move `studyData.js` content into the real Study section; fix the README (Node version, counts, license file or claim).
18. **Privacy and rights decisions:** student IDs in the footer, and permission to use the EMU logo in a public product.
