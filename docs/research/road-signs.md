# Road signs and sign artwork for Test2Drive (KKTC)

Research date: 20 October 2026. Scope: the sign library behind the Study section (`public/signs.json`, `public/signs/`) and how to own its artwork legally.
Companion files: `kktc-regulations.md` (exam format, priority, speed limits, licence classes), `current-site-audit.md` (defects), `benchmark.md` (product).

Evidence tags:

- **[V]** verified against a primary source: a KKTC law or regulation text, an official ministry leaflet, the UN treaty record, a licence text on the file page itself, or a test I ran myself (HTTP status, file hash).
- **[S]** secondary: Wikipedia, Wikimedia Commons photos, news reports, forums, commercial sites.
- **[?]** uncertain, conflicting or inferred. Confirm it before it reaches learners.

Source IDs such as (R3) point to the source index at the end.

---

## TL;DR

1. **The current sign set depicts the Republic of Cyprus (the south), not KKTC.** [V] All 118 images come from the image store of **CySigns** (cysigns.online). I downloaded files from the S3 bucket and from cysigns.online/images/signs/: they are **byte-identical** (same MD5) and use the same file names (R20, R21). CySigns prepares learners for the south's oral test run by the Road Transport Department. It offers Greek and Russian, not Turkish (R20). The artwork shows it: "ΑΣΤΥΝΟΜΙΑ / POLICE", "Τελωνείο / Customs", "ΤΑΞΙ", a red-cross first-aid sign, a STOP sign, odd/even-date parking signs, and a direction sign to "Tseri / Lakatameia / Latsia".
2. **Licence verdict on the current images: not usable. Stop hotlinking them.** [V] CySigns names no owner (an anonymous iCloud contact). Its Terms claim "road sign images used in quizzes" as its "exclusive property". The footer says "All rights reserved". There is no licence and no permission to hotlink (R20, R22). Hotlinking also sends every visitor's IP and referrer to a third party. And it is fragile: 2 of the 118 links are already broken (`pedestrian-crossing-info` returns 403; `roundabout-mandatory` points to a Belgian site and returns 404) [V].
3. **KKTC has no published illustrated sign catalogue that I could find online.** [V for what exists, ? for what may exist offline] The legal basis is the *1974 Motorlu Araçlar ve Yol Trafik Yasası* (21/1974). Its art. 5(1)(G) lets the Council of Ministers regulate "trafik işaretlerini ve bunların yerleştirilmesini" by tüzük (R1). The base regulation is the *1974 Motorlu Araçlar ve Yol Trafik Tüzüğü* (R.G. 39, 4.12.1974, Ek III, A.E. 99) (R2, R3). Its sign schedule is not online. The 2003 *KKTC Karayolları Trafik Kuralları Kitabı* is the official exam book (R6, R7), but no digital copy was found.
4. **The KKTC sign system is a hybrid** [S]. The shapes and pictograms are the European (Vienna-style) set that both sides of Cyprus inherited from the British period: red triangles, red rings, blue mandatory discs, a yellow box-junction diamond. On top of that sit Turkish-language elements: **DUR** or **DUR / STOP**, Turkish text plates ("ARAÇ GİREMEZ", "YAVAŞ"), a red-crescent first-aid sign, and Turkish town-entry and town-exit signs (R10, R13). Older trilingual Turkish / English / Greek plates survive. Traffic drives on the left, and the official leaflet uses a clockwise mandatory-roundabout sign (R4). KKTC is not a party to the Vienna Convention. The Republic of Cyprus joined on 16.08.2016 and Türkiye on 17.05.2023 (R9).
5. **Coverage gap.** Of our 118 signs: **10 need different artwork** for the north (Greek text, STOP, red cross, wrong roundabout direction); **13 should be dropped or parked as rare** (tram, level crossings, snow chains, odd/even parking, "GO" disc, and similar); **3 have broken data** (two dead links and one warning sign showing an information image); **39 names need correcting** in TR and/or EN (for example "Kontrollü Blok" for a box junction); **only 13 have any photo or leaflet evidence from the north**. The rest are plausible but unverified. We are also **missing roughly 60 to 80 signs** (left/right variants, crossroads, school crossing, no left turn, speed camera, town limits, zone signs, buses, cycles, additional plates). We have **no road markings, no traffic-light states and no police hand signals at all**. A complete study section needs about **170–200 assets**.
6. **Recommended strategy: (c) a hybrid, i.e. draw our own SVG set.** Use public-domain or CC0 Commons drawings as geometric starting points where they match: about 80 Republic of Cyprus SVGs (mostly `{{PD-self}}`) and the CC0 "TRNC Stop Sign". Replace all text with Turkish. Verify each sign against northern photos and the KKTC rules book. Release our files as **CC0** (or CC BY 4.0), so the site owns them outright. Do not base files on the Turkish Commons set: it is almost all **CC BY-SA 4.0**, so any change would also have to be shared under BY-SA. Option (b) "redraw from the official spec" is not possible as stated, because no official KKTC spec is published. Estimated effort: **about 2.5–3.5 person-weeks**, of which artwork is about 1 week and bilingual content and verification take the rest.

---

## 1. Legal basis

| Item | Finding | Tag | Source |
|---|---|---|---|
| Parent law | *Motorlu Araçlar ve Yol Trafik Yasası*, Sayı 21/1974, amended by 33 laws up to 63/2017 (list on every recent tüzük) | [V] | R1, R2, R3 |
| Power to regulate signs | Art. 5(1): the Council of Ministers may make tüzük for, among other things, "(G) ... trafiğin yönü ile yolları kullanma şeklini düzenlemek; **trafik işaretlerini ve bunların yerleştirilmesini düzenlemek**; ... park yerleri saptamak" | [V] | R1 |
| Base regulation | *1974 Motorlu Araçlar ve Yol Trafik Tüzüğü* ("Esas Tüzük"), R.G. 39, 4.12.1974, Ek III, A.E. 99, amended dozens of times (latest seen 2025: R.G. 202, 8.10.2025; Sayı 1060, Dec 2025). The amendments I read deal with licences, plates and fees, not signs. | [V] | R2, R3 |
| Sign schedule inside the Esas Tüzük | Not found online. The colonial-era model (Cyprus Motor Vehicles and Road Traffic Regulations) carried a schedule of sign diagrams, so the 1974 Tüzük probably does too. | [?] | — |
| Separate "Trafik İşaretleri Tüzüğü/Yönetmeliği" | None found. Search results for "Trafik İşaretleri Hakkında Yönetmelik" are **Türkiye's** 1985 regulation under Law 2918, which does not apply in KKTC. | [V] none found | R27 |
| Road-rule law | *Yol Kuralları Yasası* (Fasıl 334): keep left; overtake on the right | [V] | R5 |
| Ministry and departments | Bayındırlık ve Ulaştırma Bakanlığı (BUB). The **Karayolları Dairesi** installs signs (2012 replacement programme "standartlara uygun", Turkish text plus English in tourist areas). The **Trafik Dairesi** runs licences and exams. | [V] BUB pages; [S] for the 2012 programme | R4, R8, R14 |
| Official study book | *KKTC Karayolları Trafik Kuralları Kitabı*: presented in 2003 by the Ministry of Interior. 122 pages, printed by Devlet Basımevi, made mandatory for licence exams by a Council of Ministers decision. Still named as the source of preparatory-test questions in a 2023 tüzük change. | [S] 2003 news; [S] 2023 news citing the tüzük | R6, R7 |
| Exam weight of signs | The 2017 exam regulation (*Ehliyet, Sınav ve Sürüş Ehliyet Müfettişleri ile İlgili Usul ve Kurallar Tüzüğü*, art. 13) puts "Trafik kuralları, trafik levhaları" at **22 of 50 questions (44%)** for car and motorcycle classes. In practice the theory step is still oral and sign-centred (see `kktc-regulations.md` §1). | [V] text; [S] practice | R11 |
| Vienna Convention | KKTC is not a party (unrecognised state). Republic of Cyprus acceded 16.08.2016. Türkiye acceded 17.05.2023, with a declaration that it does not recognise the "Republic of Cyprus"; Cyprus objected on 26.04.2024. | [V] | R9 |
| Copyright regime in KKTC | Commons summarises it as **Fasıl 264**, which applies the UK Copyright Act 1911. Government works: publication + 50 years. Freedom of panorama covers architecture and sculpture only. | [S] | R18 |

**What this means.** No authority publishes a KKTC sign standard or catalogue that Test2Drive could cite or copy. The authoritative references are paper: the 1974 Tüzük schedule (Devlet Basımevi) and the Trafik Kuralları Kitabı. **Action:** buy or borrow both (Devlet Basımevi in Lefkoşa, or a şoför okulu), and ask the Trafik Dairesi which sign list examiners use. Until then, label the library "based on signs in use in KKTC", not "official".

---

## 2. Official categories and how KKTC signs look

### 2.1 Categories

No KKTC text that I could read defines sign categories. The usable taxonomies are:

| Taxonomy | Groups | Use for Test2Drive |
|---|---|---|
| Vienna Convention / Republic of Cyprus Highway Code (as used by CySigns) | Warning · Priority · Prohibitory · Mandatory · Information · Additional plates · Road markings · Signals by authorised persons | Best fit for the shapes actually on KKTC roads [S] |
| Türkiye KGM (Trafik İşaretleri El Kitabı) | Tehlike uyarı (T) · Trafik tanzim (TT: yasaklayıcı, kısıtlayıcı, mecburiyet, öncelik) · Bilgi (B) · Duraklama-park (P) · Yatay işaretleme | Good source of **Turkish names**; designs differ in detail [S] |
| Current site | warning · prohibitory · mandatory · priority · information | Keep, and add **additional plates**, **road markings**, **traffic lights**, **police signals** |

Recommended top-level categories (TR / EN): Uyarı işaretleri / Warning · Öncelik işaretleri / Priority · Yasak ve kısıtlama işaretleri / Prohibitory & restriction · Mecburiyet işaretleri / Mandatory · Bilgi ve yön işaretleri / Information & direction · Ek levhalar / Additional plates · Yol çizgileri / Road markings · Trafik ışıkları / Traffic lights · Polis işaretleri / Police signals.

### 2.2 Visible differences: KKTC vs the south vs Türkiye

| Feature | KKTC (north) | Republic of Cyprus (south) | Türkiye | Tag / source |
|---|---|---|---|---|
| Driving side | Left | Left | Right | [V] R5; [S] |
| Stop sign | "DUR", or bilingual "DUR / STOP"; STOP alone still seen | "STOP" | "DUR" | [S] R10, R13 photos |
| Text language | Turkish; English added in tourist areas; old trilingual TR/EN/GR plates survive ("YAVAŞ / Reduce Speed / ΕΛΑΤΤΩΣΤΕ ΤΑΧΥΤΗΤΑ") | Greek + Latin transliteration | Turkish | [S] R10, R13; [S] R14 |
| First aid | Red crescent, Turkish text | Red cross | Red crescent | [S] R10 |
| Mandatory roundabout | Clockwise arrows (left-hand traffic); shown on the BUB leaflet | Clockwise | Anticlockwise | [V] R4 (leaflet); [S] |
| Box junction | Yellow/black criss-cross diamond sign in North Nicosia | Same sign ("controlled block") | Not used this way | [S] R13 photo |
| Direction signs | Blue panels with white Turkish place names (rural); municipal finger-posts in Lefkoşa | Blue (rural), green/blue motorway panels, Greek over Latin | Blue (state roads), green (motorways) | [S] R13 photos; [?] full scheme |
| Town limits | Blue name panel at entry; same with a red diagonal bar at exit (Kalkanlı photos) | White/blue name signs | Türkiye style B-9 | [S] R13 |
| Speed numbers | km/h; 10, 20, 30, 50, 65 photographed; official leaflet: built-up 50, rural 65–90, dual carriageway 100 | km/h | km/h | [V] R4; [S] R13 |
| Speed camera warning | Camera pictogram sign (on the official leaflet; photographed near Kalkanlı) | Similar | Different | [V] R4; [S] R13 |
| Street-name signs | Turkish only, black on yellow; trilingual near the Green Line | Greek/English | Varies by municipality | [S] R10 |
| Road markings | British-heritage practice reported (yellow kerb lines, Belisha-style beacons at crossings) | British-heritage | Turkish KGM standard | [S] R15; [?] details |

Sign condition is poor in places. A September 2026 column by a civil-engineering professor says KKTC signs often do not meet standards for distance, height, colour and lettering, and suggests UK left-hand-traffic standards as a reference (R16) [S]. So photos of real signs vary. Draw the clean canonical form, and say so on the site.

---

## 3. Source and licence findings

| # | Source | Jurisdiction depicted | Licence / terms (exact) | Attribution | Coverage | Verdict |
|---|---|---|---|---|---|---|
| 1 | **CySigns** (cysigns.online) and S3 bucket `cyprus-road-signs.s3.eu-central-1.amazonaws.com` (same files, same MD5; S3 objects last modified 16.02.2024; bucket listing denied) | Republic of Cyprus (RTD oral test; Greek text) | Terms §5: content including "images (such as road sign images used in quizzes)" is "the exclusive property of CySigns"; "© 2026 CySigns. All rights reserved." No licence, no named legal entity, governed by "Cyprus law" | n/a | 240 items incl. 13 markings, 7 police signals, 17 additional plates | **Do not use. Do not hotlink.** [V] R20–R22 |
| 2 | traffic-rules.com (one hotlinked file) | Belgium | Unknown; file 404 | n/a | 1 | Remove [V] |
| 3 | Commons: **SVG road signs in Cyprus** (warning 20, prohibitory 30, mandatory 12, priority 5, information 15) | Republic of Cyprus, drawn from the RoC Highway Code PDF | Mostly **`{{PD-self}}`** (author Gigillo83 released them to the public domain); some "Government of Cyprus" files marked **`{{PD-ineligible\|type=road signs}}`**; 3 files **OGL v1.0** (UK-derived) | PD: none required (credit as courtesy); OGL: "Contains public sector information licensed under the Open Government Licence" | ~82 files; most Vienna pictograms, Greek text on some | **Best base geometry.** Strip the Greek text. Check each file page. [V] R17 |
| 4 | Commons: **TRNC / Northern Cyprus SVGs** | KKTC | "TRNC Stop Sign.svg" (DUR/STOP) **CC0**; TRNC border signs **CC0**; "Northern Cyprus Giveway Sign.svg" ("YOL VER") and "Northern Cyprus Mandatory Roundabout.svg" **CC BY 4.0** (Augustasci, 2025) | CC0: none; CC BY: author, licence and link | 5 files | Use the CC0 stop sign. Treat CC BY files as reference (or credit them). Whether real KKTC give-way signs carry text is [?]. [V] R17 |
| 5 | Commons: **SVG road signs of Turkey** (424 files across warning, prohibitory, mandatory, priority, information, parking, additional, temporary and historic categories) | Türkiye (KGM) | **CC BY-SA 4.0** for nearly all current signs (Gigillo83, มองโกเลีย๔๔ and others; `{{self\|cc-by-sa-4.0}}`); CC0 for 26 information signs; PD for 33 historic warning signs and 4 parking signs (one credited to KGM) | BY-SA: author, licence, link, and **share-alike for modified files** | Full KGM set | Useful for **Turkish names**, not as a base. Designs differ (e.g. anticlockwise roundabout, Turkish typeface). [V] R17 |
| 6 | Commons: **photos** in "Road signs in Northern Cyprus" (12 sub-categories, ~35 photos) | KKTC | Mostly **CC BY-SA 3.0/4.0** or CC BY 4.0 (ToprakM, Dickelbers, others); a few PD | Required if displayed | Evidence of what is on the roads | Use as **verification evidence**, not as study images [V] R13 |
| 7 | **GOV.UK traffic sign images** (DfT, >600 signs, JPG + EPS) | United Kingdom | "Traffic signs are Crown copyright ... You may reproduce traffic-sign images free of charge and without having to seek permission ... reproduce them accurately and not in a misleading context ... include a statement that these images are Crown copyright"; OGL v3.0 | "Crown copyright" statement | British-heritage designs (box junction, markings, zig-zags) | Good reference for **road-marking diagrams**; usable with a credit [V] R19 |
| 8 | Türkiye KGM *Trafik İşaretleri El Kitabı* (2015 PDF) | Türkiye | Government publication; no open licence stated | — | Full TR names and dimensions | Use for **names and wording only** [S] R26 |
| 9 | Republic of Cyprus Highway Code (*Κώδικας Οδικής Κυκλοφορίας*, mcw.gov.cy PDF) | South | Not checked | — | South's official list | Reference only [?] |
| 10 | Our 13 hand-made SVGs in `public/signs/` | Generic | Our own work | — | 13 | Fine to keep as a licence, but `stop.svg` says STOP and all text relies on the Arial font. Replace with the new set. [V] |

**Is a road sign design itself protected?** Simple statutory sign designs are widely treated as below the threshold of originality (Commons' `PD-ineligible|type=road signs`). A particular drawing of a sign can still be protected as an artwork, and the UK claims Crown copyright even on simple designs. In KKTC, government works are protected for 50 years from publication [S R18]. The clean path is to **draw our own files** from geometry and photos. Never trace a copyrighted raster. This is a reasoned position, not legal advice [?].

### 3.1 Sample check (files saved in the scratch area)

Saved under `C:\Users\turkm\AppData\Local\Temp\claude\C--Users-turkm-GitHub-TRAF101\1315ec0c-afdd-49c8-8b19-04a5503d4057\scratchpad\signs-sample\`:

- `svg\` holds 11 Commons SVGs. Sizes run from 0.5 kB (Cyprus give way) to 21 kB (Cyprus police, text as paths). The Turkish files are 2–5 kB. All render cleanly (`svg-sheet.png`). Some have no `viewBox` (Cyprus give way, TT-1, TRNC stop), so they need normalising.
- `s3\` holds 32 current images: 400×400 JPEG, about 20 kB each, with no transparency (`s3-sheet.png`).
- `commons-nc\` holds 32 northern photo and drawing thumbnails (`nc-sheet.png`).

Quality verdict: the PD Cyprus SVGs are clean and simple, so they are fine as geometry bases. Their stroke weights and colours vary by author, so a single normalisation pass is needed (palette, viewBox, outline text).

---

## 4. Coverage comparison

### 4.1 Data problems found in `public/signs.json` (all [V])

- `metadata.totalSigns` says 144, but there are 118 entries (46 + 35 + 13 + 8 + 16). `metadata.source` names CySigns.
- Broken images: `pedestrian-crossing-info` (S3 403) and `roundabout-mandatory` (traffic-rules.com 404, a Belgian sign).
- `warning/pedestrian-crossing` uses the blue information-sign image, so the warning triangle is missing.
- Only English descriptions. `name` and `nameEn` are duplicated. There are no fields for the driver's action, confusions, related signs, source or licence.
- Several Turkish names are machine-translated: "Kontrollü Blok", "Karaya Oturma Riski", "Varsayılan Dönel Kavşak Şeridi", "İleri Geçiş", "Sizin Yönünüze Öncelik".

### 4.2 Per-sign status (all 118)

Status codes: **K** keep the concept, redraw ourselves, not yet field-verified · **KP** keep; a northern photo or official leaflet shows it · **A** the artwork must change for KKTC · **R** rename (TR and/or EN) · **D** drop or park as "rare / south only" · **X** broken data today.
Totals: K 51 · K R 30 · KP 7 · KP R 6 · A 8 · X A 2 · X 1 · D 10 · D R 3. Proposed Turkish names follow KGM wording and KKTC usage (*çember*, *çift şeritli yol*) and must be checked against the KKTC rules book [?].

#### Warning Signs (Uyarı İşaretleri): 46 signs

| # | id | EN name (current) | TR name (current) | Status | Notes |
|---|---|---|---|---|---|
| 1 | `dangerous-bend` | Dangerous Bend | Tehlikeli Viraj | K R | Image is a left bend; Vienna-style sets have separate left and right signs. Rename to "Sola tehlikeli viraj / Dangerous bend to the left" and add the right-hand variant. |
| 2 | `end-dual-carriageway` | End of Dual Carriageway | Çift Yolun Sonu | K R | TR: "Bölünmüş (çift şeritli) yol sonu". The BUB leaflet uses "çift şeritli yol" for dual carriageways [V]. |
| 3 | `other-danger` | Other Danger | Diğer Tehlike | K | Keep; redraw; verify in the field [?]. |
| 4 | `junction-secondary-road` | Junction with Secondary Road | Yan Yol Kavşağı | KP R | Crossroads with a minor road; photographed in Kalkanlı [S]. TR: "Tali yol kavşağı". Add side-road left and right variants. |
| 5 | `tunnel` | Tunnel | Tünel | K | Keep; redraw; verify in the field [?]. |
| 6 | `roundabout` | Roundabout | Dönel Kavşak | K R | TR: "İleride döner kavşak (çember)". KKTC usage is "çember / döner çember" [V]. |
| 7 | `junction-on-bend` | Junction on Bend | Virajda Kavşak | K | Keep; redraw; verify in the field [?]. |
| 8 | `double-dangerous-bend` | Double Dangerous Bend | Çift Tehlikeli Viraj | KP R | Photographed with a trilingual "YAVAŞ / Reduce speed / ΕΛΑΤΤΩΣΤΕ ΤΑΧΥΤΗΤΑ" plate [S]. TR: "Tehlikeli devamlı viraj". Add the "first to the right" variant. |
| 9 | `road-narrows-both` | Road Narrows on Both Sides | İki Taraftan Daralma | K | Keep; redraw; verify in the field [?]. |
| 10 | `road-narrows-one` | Road Narrows on One Side | Tek Taraftan Daralma | K R | Split into "Soldan daralan yol" and "Sağdan daralan yol". |
| 11 | `two-way-traffic` | Two Way Traffic | İki Yönlü Trafik | K | Keep; redraw; verify in the field [?]. |
| 12 | `two-way-crosses-one` | Two Way Traffic Crosses One Way Road | İki Yön Tek Yolu Keser | K | Rare. |
| 13 | `steep-descent` | Steep Descent | Dik İniş | K | Keep; redraw; verify in the field [?]. |
| 14 | `steep-ascent` | Steep Ascent | Dik Yokuş | K | Keep; redraw; verify in the field [?]. |
| 15 | `traffic-signals` | Traffic Signals | Trafik Işıkları | K | Keep; redraw; verify in the field [?]. |
| 16 | `hump-bridge` | Hump Bridge | Kambur Köprü | K R | TR: "Kambur (tümsekli) köprü". |
| 17 | `swing-bridge` | Swing Bridge | Hareketli Köprü | D | No movable road bridges known in the north [?]. Park as rare. |
| 18 | `risk-of-ice` | Risk of Ice | Buzlanma Riski | K | Low priority in the KKTC climate. |
| 19 | `pedestrians` | Pedestrians | Yayalar | K | Keep; redraw; verify in the field [?]. |
| 20 | `elderly-disabled` | Elderly or Disabled Pedestrians | Yaşlı veya Engelli Yayalar | K | Keep; redraw; verify in the field [?]. |
| 21 | `pedestrian-crossing` | Pedestrian Crossing | Yaya Geçidi | X A | Data error: filed as a warning sign but the image is the blue square information sign. Needs the red-triangle warning version, which the BUB leaflet shows [V]. |
| 22 | `children` | Children | Çocuklar | K R | TR: "Okul geçidi / Dikkat çocuklar". Whether KKTC uses a school-crossing variant is unverified [?]. |
| 23 | `domestic-animals` | Domestic Animals | Evcil Hayvanlar | KP | Animal (donkey) warning signs photographed in the north [S]. |
| 24 | `wild-animals` | Wild Animals | Vahşi Hayvanlar | K | Keep; redraw; verify in the field [?]. |
| 25 | `slippery-road` | Slippery Road | Kaygan Yol | K | Keep; redraw; verify in the field [?]. |
| 26 | `water-course` | Water Course Alongside Road | Yol Kenarında Su | K R | Source EN is "Riverbank or quayside". TR: "Yol kenarında su / rıhtım". Low priority. |
| 27 | `soft-verges` | Soft Verges Ahead | Yumuşak Banketler | K R | TR: "Yumuşak banket". |
| 28 | `uneven-road` | Uneven Road | Engebeli Yol | K R | TR: "Kasisli / bozuk yol". |
| 29 | `low-helicopters` | Low Flying Helicopters | Alçak Uçan Helikopterler | D | Republic of Cyprus placement [?]. Park as rare. |
| 30 | `low-aircrafts` | Low Flying Aircrafts | Alçak Uçan Uçaklar | K R | Plausible near Ercan [?]. EN: "Low-flying aircraft" (not "aircrafts"). TR: "Alçak uçuş". |
| 31 | `falling-rocks` | Falling Rocks | Düşen Kayalar | K | Keep; redraw; verify in the field [?]. |
| 32 | `side-winds` | Side Winds | Yan Rüzgarlar | K | Keep; redraw; verify in the field [?]. |
| 33 | `slow-vehicles` | Slow Moving Vehicles on Hill Ahead | Yokuşta Yavaş Araçlar | K | UK-heritage sign; verify [?]. |
| 34 | `traffic-queues` | Traffic Queues | Trafik Kuyrukları | K | UK-heritage sign; verify [?]. |
| 35 | `cycle-crossing` | Pedal Cycle Route Crossing the Road | Bisiklet Yolu Geçişi | K | Keep; redraw; verify in the field [?]. |
| 36 | `level-crossing-barriers` | Level Crossing with Barriers | Bariyerli Hemzemin Geçit | D | No railway operates in Cyprus [S]. Park as rare. |
| 37 | `level-crossing-no-barrier` | Level Crossing without Barrier | Bariyersiz Hemzemin Geçit | D | Same as above. |
| 38 | `overhead-cable` | Electrified Overhead Cable | Elektrikli Havai Hat | D | Tied to electrified railways; not relevant [?]. |
| 39 | `risk-grounding` | Risk of Grounding | Karaya Oturma Riski | D R | "Karaya Oturma Riski" is machine-translated (a hump where long, low vehicles may ground). Park. |
| 40 | `roadworks` | Roadworks | Yol Çalışması | KP | Roadworks signs photographed in the north [S]. |
| 41 | `loose-surface` | Loose Road Surface | Gevşek Yol Yüzeyi | K R | TR: "Gevşek malzemeli yol". |
| 42 | `road-hump` | Road Hump | Hız Kesici | K R | TR: "Kasis / hız tümseği". |
| 43 | `tramway` | Tramway | Tramvay | D | No trams anywhere in Cyprus [S]. Drop. |
| 44 | `traffic-merges` | Traffic Merges onto Main Carriageway | Trafik Ana Yola Birleşir | K | Add left and right variants. |
| 45 | `priority-right` | Junction with Priority to the Right | Sağa Öncelik Veren Kavşak | K R | TR: "Sağdan gelene yol verilecek kavşak". Matches the KKTC priority-to-the-right rule [V leaflet]. High exam value. |
| 46 | `t-junction` | T Junction | T Kavşağı | K | Keep; redraw; verify in the field [?]. |

#### Prohibitory Signs (Yasaklayıcı İşaretler): 35 signs

| # | id | EN name (current) | TR name (current) | Status | Notes |
|---|---|---|---|---|---|
| 1 | `no-entry` | No Entry | Girilmez | KP R | Photographed in the north [S]. TR: "Taşıt giremez (girilmez)". |
| 2 | `no-water-pollutants` | No Vehicles Carrying Dangerous Water Pollutants | Su Kirleticileri Taşıyan Araçlar Giremez | D | Rare; park. |
| 3 | `no-heavy-goods` | No Heavy Goods Vehicles | Ağır Tonajlı Araçlar Giremez | KP | A no-trucks/buses sign is photographed in the north [S]. |
| 4 | `no-motor-except-motorcycle` | No Motor Vehicles Except Motorcycles | Motosiklet Hariç Motorlu Araçlar Giremez | K | Rare. |
| 5 | `no-motorcycles` | No Entry for Motorcycles | Motosikletler Giremez | K | Keep; redraw; verify in the field [?]. |
| 6 | `no-mopeds` | No Entry for Mopeds | Mopedler Giremez | K | Keep; redraw; verify in the field [?]. |
| 7 | `no-cycling` | No Cycling | Bisiklet Giremez | K R | TR: "Bisiklet giremez". |
| 8 | `no-motor-vehicles` | No Motor Vehicles | Motorlu Araçlar Giremez | KP | A northern sign with the Turkish text "ARAÇ GİREMEZ" is photographed [S]; consider a text-plate variant. |
| 9 | `no-horse-drawn` | No Horse Drawn Vehicles | Atlı Araçlar Giremez | K R | TR: "Hayvanla çekilen taşıt giremez". |
| 10 | `no-agricultural` | No Agricultural Vehicles | Tarım Araçları Giremez | K R | TR: "Traktör giremez". Image file name has a typo ("agricle"). |
| 11 | `no-pedestrian-crossing` | No Crossing for Pedestrians | Yaya Geçişi Yasak | K R | TR: "Yaya giremez". |
| 12 | `no-horns` | No Horns | Korna Yasak | K R | TR: "Korna çalmak yasaktır". |
| 13 | `no-overtaking` | No Overtaking | Sollama Yasak | K R | TR: "Öndeki taşıtı geçmek yasaktır". |
| 14 | `no-right-turn` | No Right Turn | Sağa Dönüş Yasak | K R | TR: "Sağa dönülmez". Add "Sola dönülmez" (photographed in the north [S]). |
| 15 | `no-u-turn` | No U-turn | U Dönüşü Yasak | K R | TR: "U dönüşü yapılmaz". |
| 16 | `no-vehicle-length` | No Vehicle Over Length Shown | Belirtilen Uzunluktan Fazla Araç Giremez | KP | "Araç uzunluk max 5 m" photographed in the north [S]. |
| 17 | `min-distance` | Minimum Safe Following Distance | Minimum Takip Mesafesi | K | Keep; redraw; verify in the field [?]. |
| 18 | `max-weight` | Maximum Weight | Azami Ağırlık | K | Keep; redraw; verify in the field [?]. |
| 19 | `max-width` | Maximum Width | Azami Genişlik | K | Keep; redraw; verify in the field [?]. |
| 20 | `max-height` | Maximum Height | Azami Yükseklik | K | Keep; redraw; verify in the field [?]. |
| 21 | `max-speed` | Maximum Speed | Azami Hız | KP R | 10/20/30/50/65 km/h signs photographed in the north [S]. TR: "Azami hız sınırı". Build per-value variants. |
| 22 | `no-overtaking-heavy` | No Overtaking by Heavy Vehicles | Ağır Araçlar Sollayamaz | K | Keep; redraw; verify in the field [?]. |
| 23 | `no-explosives` | No Vehicles Carrying Explosives | Patlayıcı Taşıyan Araçlar Giremez | K | Rare. |
| 24 | `stop-police` | Stop - Police | Dur - Polis | A | Text is Greek "ΑΣΤΥΝΟΜΙΑ / POLICE". A KKTC version would read "POLİS" [?]. Redraw or drop. |
| 25 | `stop-customs` | Stop - Customs | Dur - Gümrük | A | Text is Greek "Τελωνείο / Customs". KKTC "GÜMRÜK" [?]. Redraw or drop. |
| 26 | `end-no-overtaking` | End of No Overtaking | Sollama Yasağı Sonu | K | Keep; redraw; verify in the field [?]. |
| 27 | `end-restrictions` | End of All Restrictions | Tüm Kısıtlamalar Sonu | K | Keep; redraw; verify in the field [?]. |
| 28 | `end-speed-limit` | End of Maximum Speed Limit | Azami Hız Sınırı Sonu | K | Keep; redraw; verify in the field [?]. |
| 29 | `no-parking-even` | No Parking on Even Dates | Çift Günler Park Yasak | D | Odd/even-date parking is a Republic of Cyprus sign; not seen in the north [?]. |
| 30 | `no-parking-odd` | No Parking on Odd Dates | Tek Günler Park Yasak | D | Same as above. |
| 31 | `no-parking-waiting` | No Parking or Waiting | Park ve Bekleme Yasak | K R | TR: "Park etmek yasaktır". |
| 32 | `no-stopping` | No Stopping | Durma Yasak | K R | TR: "Duraklamak ve park etmek yasaktır". |
| 33 | `no-parking-zone` | No Parking Zone | Park Yasağı Bölgesi | K | Verify [?]. |
| 34 | `end-no-parking-zone` | End of No Parking Zone | Park Yasağı Bölgesi Sonu | K | Verify [?]. |
| 35 | `no-vehicles` | No Vehicles | Araç Giremez | K R | TR: "Her iki yönden taşıt giremez". |

#### Mandatory Signs (Zorunlu İşaretler): 13 signs

| # | id | EN name (current) | TR name (current) | Status | Notes |
|---|---|---|---|---|---|
| 1 | `turn-right` | Turn Right | Sağa Dönülmeli | K | Add "turn left". |
| 2 | `turn-left-ahead` | Turn Left Ahead | İleride Sola Dönülmeli | K | Add "turn right ahead". |
| 3 | `keep-left` | Keep Left | Soldan Gidiniz | K | Arrow points down-left = keep left; correct for left-hand traffic. |
| 4 | `pass-either-side` | Pass on Either Side | Her İki Taraftan Geçilebilir | K | Keep; redraw; verify in the field [?]. |
| 5 | `roundabout-mandatory` | Roundabout | Dönel Kavşak | X A | Broken: hotlinked from traffic-rules.com (a Belgian set), returns 404. A Belgian sign also circulates anticlockwise. KKTC needs clockwise arrows; the BUB leaflet shows this sign [V]. |
| 6 | `go-straight` | Go Straight Ahead Only | İleri Gidilmeli | K | Keep; redraw; verify in the field [?]. |
| 7 | `turn-left-right` | Turn Left or Right Ahead | Sola veya Sağa Dönülmeli | K | Keep; redraw; verify in the field [?]. |
| 8 | `straight-or-right` | Go Straight or Turn Right Ahead | İleri veya Sağa Gidilebilir | K | Add "straight or left". |
| 9 | `pedestrians-only` | Pedestrians Only | Sadece Yayalar | K R | TR: "Yaya yolu". |
| 10 | `animal-riders` | Animal Riders Only | Sadece Atlılar | K R | TR: "Atlı yolu". Its description contains stray Chinese characters (see current-site-audit.md). |
| 11 | `min-speed` | Minimum Speed Limit | Asgari Hız Sınırı | K | Keep; redraw; verify in the field [?]. |
| 12 | `end-min-speed` | End of Minimum Speed Limit | Asgari Hız Sınırı Sonu | K | Keep; redraw; verify in the field [?]. |
| 13 | `snow-chains` | Mandatory Snow Chains | Kar Zinciri Zorunlu | D | Troodos (south) context; no snow-chain roads in the north [?]. Park. |

#### Priority Signs (Öncelik İşaretleri): 8 signs

| # | id | EN name (current) | TR name (current) | Status | Notes |
|---|---|---|---|---|---|
| 1 | `priority-your-direction` | Priority to Traffic from Your Direction | Sizin Yönünüze Öncelik | K R | TR: "Karşıdan gelen trafiğe göre geçiş önceliği". |
| 2 | `priority-opposite` | Priority to Traffic from Opposite Direction | Karşı Yöne Öncelik | K R | TR: "Karşıdan gelene yol ver". |
| 3 | `give-way` | Give Way | Yol Ver | KP | A CC BY 4.0 Commons drawing has the text "YOL VER". Whether KKTC signs carry text is unverified [?]. |
| 4 | `stop` | Stop | Dur | A | Image reads "STOP". Northern signs read "DUR" or "DUR / STOP" [S photos, Wikipedia]. Redraw. |
| 5 | `priority-road` | Priority Road | Öncelikli Yol | K | Yellow diamond: check that KKTC uses it [?] (see kktc-regulations.md). |
| 6 | `end-priority-road` | End of Priority Road | Öncelikli Yol Sonu | K | Same as above. |
| 7 | `controlled-block` | Controlled Block | Kontrollü Blok | KP R | Box junction: a yellow/black diamond is photographed in North Nicosia [S]. "Kontrollü Blok" is a literal mistranslation. Use "Kavşak kutusu (çıkış boş değilse girme) / Box junction". |
| 8 | `go-ahead` | Go Ahead | İleri Geçiş | D R | Green "GO" disc, Republic of Cyprus temporary control [?]. "İleri Geçiş" is not a real term. Park. |

#### Information Signs (Bilgi İşaretleri): 16 signs

| # | id | EN name (current) | TR name (current) | Status | Notes |
|---|---|---|---|---|---|
| 1 | `one-way` | One Way Street | Tek Yön | K R | TR: "Tek yönlü yol". |
| 2 | `parking` | Parking | Park Yeri | K R | TR: "Park yeri". |
| 3 | `taxi-parking` | Taxi Parking | Taksi Durağı | A | Plate reads Greek "ΤΑΞΙ". Redraw with "TAKSİ" [?]. |
| 4 | `dead-end-straight` | Dead End Straight Ahead | İleride Çıkmaz Sokak | KP | Dead-end sign photographed in the north [S]. |
| 5 | `dead-end-left` | Dead End Left | Solda Çıkmaz Sokak | K | Add the right variant. |
| 6 | `first-aid` | First Aid | İlk Yardım | A | Image shows a red cross. KKTC uses a red crescent with Turkish text [S Wikipedia]. |
| 7 | `residential` | Residential Area | Yerleşim Bölgesi | KP R | Home-zone / living-street sign ("ZONE 20" photographed in Girne) [S]. EN: "Residential area (home zone)"; TR: "Yaşam alanı (yayalara öncelik)". Add "end of zone". |
| 8 | `emergency-phone` | Emergency Phone | Acil Telefon | K | Keep; redraw; verify in the field [?]. |
| 9 | `airport` | Airport | Havaalanı | K | Keep; redraw; verify in the field [?]. |
| 10 | `recommended-speed` | Recommended Speed | Tavsiye Edilen Hız | K | Keep; redraw; verify in the field [?]. |
| 11 | `petrol-station` | Petrol Station | Benzin İstasyonu | K | Keep; redraw; verify in the field [?]. |
| 12 | `direction-sign` | Direction Sign | Yön İşareti | A | Shows the south: "ΤΣΕΡΙ Tseri / ΛΑΚΑΤΑΜΕΙΑ / ΛΑΤΣΙΑ". Redraw a KKTC example with Turkish place names [S photos]. |
| 13 | `pedestrian-crossing-info` | Pedestrian Crossing | Yaya Geçidi | X | Broken: S3 returns 403. Same concept as the misfiled warning entry. |
| 14 | `bus-stop` | Bus Stop | Otobüs Durağı | A | Plate shows Greek route text. Redraw. |
| 15 | `roundabout-lane` | Default Roundabout Lane | Varsayılan Dönel Kavşak Şeridi | D R | Republic of Cyprus lane-marking diagram; "Varsayılan Dönel Kavşak Şeridi" is machine-translated. Move into the roundabout / road-markings lesson. |
| 16 | `highway` | Highway | Otoyol | A | Green motorway sign of the Republic of Cyprus. Whether a motorway (otoyol) sign is used in the north is unverified [?]. |

### 4.3 Missing signs (not in our 118)

Derived from three sources: the 124 CySigns items we lack (R20), signs photographed in the north (R13), and items on the official BUB leaflet (R4). Priority: **P1** = likely examined and seen in KKTC; **P2** = common; **P3** = rare.

| Group | Missing items | Priority | Evidence |
|---|---|---|---|
| Direction variants | Dangerous bend right; double bend first right; road narrows left / right; side road left / right; staggered junctions; junctions on the inside or outside of a bend; traffic merging from left / right; dead end right; turn left; turn right ahead; keep right; straight or left | P1 | Standard Vienna variants [S] |
| Priority | Give way ahead (with distance); stop ahead; direction of priority road (plate) | P1 | R20 [S] |
| Prohibitory | **No left turn** (photographed in the north); no goods vehicles over the weight shown; maximum axle weight; no towed caravans; no hand carts | P1 / P3 | R13 [S], R20 |
| Speed | Speed-limit values 30 / 50 / 65 / 80 / 100; **town speed limit**; **speed camera** (BUB leaflet and photo); speed-limit zone and end of zone ("ZONE 20") | P1 | R4 [V], R13 [S] |
| Town limits | Settlement start (blue name panel) and end (with red bar) | P1 | R13 [S] |
| Pedestrians and schools | Pedestrian crossing (warning triangle; currently misfiled); school crossing; school crossing patrol "DUR"; pedestrian overpass / underpass | P1 | R4 [V], R20 |
| Humps | Road hump with speed limit; humped crossing; road humps left / right / both | P2 | R20 |
| Buses and cycles | Buses only; bus lane start / end; cycle route; shared or segregated cycle and pedestrian route | P2 | R20 |
| Information and services | Information; hospital (H); telephone; hotel; restaurant; toilets; picnic; camping; car repair; disabled parking | P2 / P3 | R20, KGM |
| Additional plates (*ek levhalar*) | Distance to the sign; length of section; start / continue / end of restriction; arrow direction; time window; vehicle-type plates; "YAVAŞ" text plate | P1 (exam favourite) | R20, R13 |
| Temporary / roadworks | Obstacle chevrons; sharp deviation left / right; lane-closure boards | P2 | R20, R13 |
| KKTC-only | DUR / STOP; red-crescent first aid; Turkish street-name sign; TRNC border sign (CC0 on Commons); "ARAÇ GİREMEZ" text sign | P1 | R10, R13, R17 |

Rough total: 118 − 13 parked + about 70 additions ≈ **175 sign entries**. On top of that come about 15 marking diagrams, 8 light states and 7 police signals.

### 4.4 Road markings (*yol çizgileri*): not covered today

| Marking | Meaning to teach | KKTC status |
|---|---|---|
| Broken white centre line | Lane separation; you may cross to overtake when safe | Universal [S] |
| Solid white centre line / double solid | Do not cross or straddle | [?] which form KKTC uses (UK-style double white vs single solid) |
| Solid + broken pair | Obey the line nearest to you | [?] |
| Hatched area / chevrons | Do not enter | [S] |
| Yellow kerb line(s) | No waiting / no parking; double = stricter | British-heritage, photographed in North Nicosia [S R13]; legal meaning in the 1974 Tüzük [?] |
| Box junction (yellow criss-cross) | Do not enter unless your exit is clear | Sign photographed in North Nicosia; travel report quotes the same rule [S R13, R15] |
| Zebra crossing + beacons | Give way to pedestrians on or about to step onto the crossing | Leaflet: stop and give way [V R4]; beacons [S R15] |
| Stop line / give-way line | Where to stop or give way | [S] |
| Arrows, lane markings, roundabout lanes | Lane choice | [?] |
| Bus lane / bus stop box | No stopping | [?] |

Draw these as **top-down diagrams** (our own SVG). GOV.UK DfT images (Crown copyright, reproduction allowed with credit, R19) are a good reference for British-heritage markings. Confirm each meaning against the 1974 Tüzük before publishing.

### 4.5 Traffic lights and police signals

- **Lights:** teach red, red+amber (if used), green, amber, flashing amber, green filter arrow and pedestrian signals. **The KKTC sequence and the meaning of flashing amber are unverified [?].** No KKTC text was found. Türkiye's sequence and meanings (R27) must not be copied blindly; `kktc-regulations.md` already flags "flashing amber" as [?].
- **Police / authorised-person signals:** CySigns lists 7 for the south (R20). KKTC hand signals are unverified [?]. They are probably in the 1974 Tüzük or the rules book.
- **Legal anchor:** failing to obey traffic signs and road markings is a listed offence in a KKTC fixed-penalty notice (R.G. 130, 17.07.2007) (R28) [S, seen only as a search snippet].

---

## 5. Recommended asset strategy

### 5.1 Options compared

| Option | Description | Legal | Accuracy for KKTC | Effort | Verdict |
|---|---|---|---|---|---|
| (a) Self-host PD/CC0 SVGs as they are | Copy the Commons Cyprus PD set plus the TRNC CC0 stop sign | Clean | Medium: southern Greek text on ~15 files, many gaps | 2–3 days | Not enough alone |
| (b) Redraw from the official spec | Draw every sign from the KKTC legal drawings | Clean | High | — | **Not possible yet:** no KKTC spec is published (§1) |
| **(c) Hybrid: own set, PD-based geometry, field-verified** | Start from the PD/CC0 files where they match. Draw the rest ourselves from Vienna geometry and northern photos. Turkish text everywhere. One style pass. Release as CC0. | Clean (our copyright; PD/CC0 inputs) | High, once verified against the KKTC rules book | ~2.5–3.5 person-weeks incl. content | **Recommended** |
| (d) License from CySigns | Ask the anonymous operator | Possible but unclear chain of title | Low (south) | — | No |
| (e) Turkish Commons set (CC BY-SA) | Recolour and redirect KGM files | Allowed, but **modified files must be BY-SA** with attribution | Medium (Türkiye details) | 1 week | Only for gap-filling, if accepting BY-SA |

### 5.2 Production rules for the new SVGs

1. **Inputs allowed:** our own drawings; `PD-self`, `PD-ineligible` and CC0 Commons files; GOV.UK images as reference (with a Crown-copyright credit if a diagram is closely derived). Record each input in `credits.json`. **Not allowed:** CySigns or S3 images, tracing any raster, CC BY-SA bases (unless we accept BY-SA for that file).
2. **Format:** a square `viewBox="0 0 200 200"` for discs, triangles and octagons; rectangles with the true aspect ratio. No `width`/`height` attributes. **All text converted to paths**, so no font dependency. No external references. Run SVGO. Target ≤ 4 kB per sign.
3. **Palette** (CSS custom properties are not usable inside `<img>`, so hard-code these): red `#C1121F`, blue `#0B4EA2`, yellow `#F2C200`, green `#00754A`, black `#1A1A1A`, white `#FFFFFF`. Use a 1-unit light-grey outline on white-edged signs, so they show on white cards and in dark mode.
4. **Accessibility:** decorative use inside pages via `<img alt="">` plus a visible caption. The `alt` text comes from data (`image.alt.tr/en`), not from the SVG.
5. **Licence:** publish the set as **CC0 1.0** (simplest for a free educational site, and lets others reuse it). List the upstream PD/CC0 sources in `public/signs/CREDITS.md` as a courtesy.

### 5.3 File naming scheme

```
public/signs/<category>/<slug>[--<variant>].svg

category  = warning | priority | prohibitory | mandatory | information | additional | marking | light | police
slug      = English, kebab-case, language-neutral, stable (never translated)
variant   = left | right | 30 | 50 | 65 | tr-text | ...   (double hyphen separates the variant)

Examples
public/signs/warning/bend--left.svg
public/signs/warning/bend--right.svg
public/signs/warning/double-bend--left-first.svg
public/signs/priority/stop.svg                  (DUR)
public/signs/priority/stop--dur-stop.svg        (bilingual DUR / STOP)
public/signs/prohibitory/speed-limit--50.svg
public/signs/prohibitory/no-turn--left.svg
public/signs/mandatory/roundabout.svg           (clockwise)
public/signs/information/first-aid.svg          (red crescent)
public/signs/marking/box-junction.svg
public/signs/light/amber-flashing.svg
public/signs/police/stop-from-front.svg
```

Page URLs use localized slugs from the data (`slug.tr` / `slug.en`), not the file name. For example `/isaretler/uyari/sola-tehlikeli-viraj` and `/en/signs/warning/dangerous-bend-left`.

### 5.4 Data schema per sign

Store it as `src/data/signs/<category>.json` (or a single `signs.json`) and validate it in CI with a JSON Schema.

```jsonc
{
  "id": "warning.bend-left",                 // stable key = category + file slug
  "category": "warning",                     // one of the 9 categories
  "group": "curves",                         // sub-group for the study UI
  "image": {
    "src": "/signs/warning/bend--left.svg",
    "alt": { "tr": "Kırmızı kenarlı üçgen içinde sola kıvrılan yol", "en": "Red-bordered triangle with a road curving left" },
    "author": "Test2Drive",
    "license": "CC0-1.0",
    "basedOn": [{ "title": "File:Cyprus warning road sign bend.svg", "license": "PD-self", "url": "https://commons.wikimedia.org/wiki/File:Cyprus_warning_road_sign_bend.svg" }]
  },
  "slug":  { "tr": "sola-tehlikeli-viraj", "en": "dangerous-bend-left" },
  "name":  { "tr": "Sola tehlikeli viraj", "en": "Dangerous bend to the left" },
  "aka":   { "tr": ["Sola viraj"], "en": ["Left bend ahead"] },
  "meaning": {
    "tr": "İleride sola keskin bir viraj var.",
    "en": "There is a sharp bend to the left ahead."
  },
  "driverAction": {
    "tr": "Virajdan önce hızını düşür, sol şeridinde kal, virajda sollama yapma.",
    "en": "Slow down before the bend, keep to the left lane, do not overtake in the bend."
  },
  "confusions": [
    { "with": "warning.double-bend-left-first",
      "tip": { "tr": "Tek kıvrım = tek viraj; S şekli = devamlı viraj.", "en": "One curve = single bend; S shape = double bend." } },
    { "with": "mandatory.turn-left",
      "tip": { "tr": "Üçgen uyarır, mavi daire zorunlu kılar.", "en": "A triangle warns; a blue disc orders." } }
  ],
  "related": ["warning.bend-right", "warning.double-bend-left-first", "additional.distance"],
  "examPriority": "core",                    // core | common | rare
  "kktc": {
    "status": "seen",                        // seen | likely | unverified | south-only
    "evidence": [{ "type": "photo", "ref": "<Commons file or own photo URL>", "tag": "S" }],
    "notes": { "tr": "", "en": "" }
  },
  "refs": { "vienna": null, "trKgm": null, "cySouth": "Dangerous bend to the left" },  // editor cross-references; fill from the source documents, never guess
  "reviewedAt": "2026-10-20",
  "reviewedBy": null
}
```

Rules: `name`, `meaning` and `driverAction` are **required in both languages**; the build fails if one is missing. `confusions` should have at least one entry for P1 signs. The same `id` is used by quiz questions (`questions[].signId`), so the quiz and study views can never show different images for the same sign.

### 5.5 Effort estimate

| Work package | Items | Estimate |
|---|---|---|
| 0. Verification sources: obtain the 1974 Tüzük sign schedule and the KKTC rules book; ask the Trafik Dairesi; photo walk in Lefkoşa / Girne | — | 2–3 days (elapsed time longer) |
| 1. Normalise and adapt PD/CC0 Commons SVGs (viewBox, palette, Turkish text, mirror for variants) | ~70 | 2 days |
| 2. Draw remaining signs and plates ourselves | ~100 | 4–5 days |
| 3. Road markings, light states, police signals (diagrams) | ~30 | 2–3 days |
| 4. Bilingual content: name, meaning, action, confusions, related (~15 min per sign) | ~200 | 6–7 days |
| 5. Schema, CI validation, credits page, review pass by a KKTC driving instructor | — | 2 days |
| **Total** | ~200 assets | **≈ 18–22 working days (2.5–3.5 person-weeks)** |

A first useful release (P1 signs only, about 90 assets plus content) is about **8–10 days**.

---

## 6. Unverified list (resolve before launch)

1. Whether the 1974 Motorlu Araçlar ve Yol Trafik Tüzüğü has a sign schedule, and its content and numbering. [?]
2. Current edition, illustrations and availability of the *KKTC Karayolları Trafik Kuralları Kitabı* (2003), and whether the "pink booklet" used by driving schools (see `kktc-regulations.md`) is the de facto sign list. [?]
3. Whether "DUR" alone, "DUR / STOP", or both are legal; whether new installs still use STOP. [?]
4. Whether the KKTC give-way sign carries "YOL VER" text. [?]
5. Direction-sign colour scheme (blue vs green for main roads); bilingual TR/EN rules. [?]
6. Whether KKTC uses the yellow-diamond priority-road sign. [?]
7. Whether KKTC has a motorway (*otoyol*) sign class. [?]
8. Presence in the north of: odd/even-date parking, snow chains, swing bridge, low-flying helicopters, risk of grounding, water-pollutant restriction, the "GO" disc, "Stop – Police / Customs" equivalents. [?]
9. Road-marking meanings: centre lines, yellow kerb lines, zig-zags, bus lanes. [?]
10. Traffic-light sequence (red+amber phase?), flashing amber, filter arrows, pedestrian lights. [?]
11. Police hand signals. [?]
12. Red-crescent first-aid design (text "İLK YARDIM"?). [S, design details ?]
13. Whether CySigns ever licensed its images to third parties (no evidence either way; irrelevant if we replace them). [?]
14. Legal view on reusing statutory sign designs in KKTC (Fasıl 264 / UK 1911 Act). Ask a lawyer if a commercial edition is ever planned. [?]

---

## 7. Source index

**KKTC primary**

- **R1** *Motorlu Araçlar ve Yol Trafik Yasası* 21/1974, consolidated to 43/2014 (BUB), art. 5(1)(G). https://bub.gov.ct.tr/Portals/42/yasa8.pdf [V]
- **R2** *1974 Motorlu Araçlar ve Yol Trafik (Değişiklik) Tüzüğü*, R.G. 202, Ek III, 8.10.2025 (identifies the Esas Tüzük R.G. 39, 4.12.1974, A.E. 99). https://www.ktto.net/wp-content/uploads/2025/10/1974-Motorlu-Araclar-ve-Yol-Trafik-Degisiklik-Tuzugu.pdf [V]
- **R3** Same, Sayı 1060 (Dec 2025). https://www.ktto.net/wp-content/uploads/2025/12/1974-Motorlu-Araclar-ve-Yol-Trafik-Degisiklik-Tuzugu-hk.pdf [V]
- **R4** BUB leaflet "Lütfen dikkat! KKTC trafiğinde araç kullanırken" (keep left, priority to the right, roundabout priority, speed limits 50 / 65–90 / 100, sign pictograms incl. clockwise roundabout, pedestrian crossing, speed camera). https://bub.gov.ct.tr/Portals/42/TRAFIK_BILGI_INTERNET_TUR_1_1_1.pdf [V]
- **R5** *Yol Kuralları Yasası* (Fasıl 334). https://bub.gov.ct.tr/Portals/42/yasa12.pdf [V]
- **R8** BUB legislation page. https://bub.gov.ct.tr/BAKANLIK/MEVZUAT [V]
- **R11** *Ehliyet, Sınav ve Sürüş Ehliyet Müfettişleri ile İlgili Usul ve Kurallar Tüzüğü* (Sayı 297), art. 4 and 13. https://bub.gov.ct.tr/Portals/42/tuzuk3.pdf [V]

**International**

- **R9** UN Treaty Collection, Convention on Road Signs and Signals (XI-B-20), status and declarations. https://treaties.un.org/Pages/ViewDetailsIII.aspx?src=TREATY&mtdsg_no=XI-B-20&chapter=11&Temp=mtdsg3&clang=_en [V]
- **R19** GOV.UK, "Traffic sign images" (Crown copyright; OGL v3.0). https://www.gov.uk/traffic-sign-images [V]

**Commons (licences read on file pages or via the API, 20.10.2026)**

- **R13** Category: Road signs in Northern Cyprus (and sub-categories). https://commons.wikimedia.org/wiki/Category:Road_signs_in_Northern_Cyprus [V licences / S content]
- **R17** SVG categories: https://commons.wikimedia.org/wiki/Category:SVG_road_signs_in_Cyprus · https://commons.wikimedia.org/wiki/Category:SVG_road_signs_in_Turkey · https://commons.wikimedia.org/wiki/File:TRNC_Stop_Sign.svg · https://commons.wikimedia.org/wiki/File:Northern_Cyprus_Giveway_Sign.svg · https://commons.wikimedia.org/wiki/File:Northern_Cyprus_Mandatory_Roundabout.svg · https://commons.wikimedia.org/wiki/File:Cyprus_road_sign_give_way.svg · https://commons.wikimedia.org/wiki/File:Cyprus_road_sign_police.svg · https://commons.wikimedia.org/wiki/File:Turkey_road_sign_T-1a.svg [V]
- **R18** Commons: Copyright rules by territory / Northern Cyprus. https://commons.wikimedia.org/wiki/Commons:Copyright_rules_by_territory/Northern_Cyprus [S]

**CySigns and the current images**

- **R20** cysigns.online home and /en/signs (240 items; Greek and Russian; RTD oral exam). https://cysigns.online/en · https://cysigns.online/en/signs · PDF https://cysigns.online/downloads/cyprus-road-signs-en.pdf [V]
- **R21** S3 bucket `cyprus-road-signs.s3.eu-central-1.amazonaws.com`: listing AccessDenied; `signs/stop.jpg` MD5 `3d67c12c8665f4798a5460fc6055362c` = cysigns.online `/images/signs/stop.jpg`; same for `controlled-block.jpg` and `give-way.jpg`. My own test, 20.10.2026. [V]
- **R22** CySigns Terms §5, §12 and Contacts page. https://cysigns.online/terms · https://cysigns.online/en/contacts [V]
- **R25** traffic-rules.com file used for `roundabout-mandatory` (404). https://traffic-rules.com/img/europe/be/signs/mandatory/mandatory-direction-roundabout.png [V]

**Secondary**

- **R6** Kıbrıs Postası, 29.08.2003, "KKTC Karayolları Trafik Kuralları kitabı". https://www.kibrispostasi.com/c35-KIBRIS_HABERLERI/n1425-KKTC-Karayollari-trafik-Kurallari-kitabi [S]
- **R7** Haber Kıbrıs, 09.05.2023, tüzük change citing the "KKTC Karayolları Trafik Kuralları Kitabı". https://haberkibris.com/yabanci-ehliyet-sahibi-kisilerle-ilgili-tuzuk-degisikligi-0830-2023-05-09.html [S]
- **R10** Wikipedia, "Road signs in Cyprus" (Northern Cyprus section: DUR, red crescent, street names). https://en.wikipedia.org/wiki/Road_signs_in_Cyprus [S]
- **R12** Haber Kıbrıs, 31.12.2025, move from oral to written exam, 8-language question banks. https://haberkibris.com/kktctc-arasinda-ehliyet-sistemi-icin-altyapi-calismasi-1344-2025-12-31.html [S]
- **R14** Kıbrıs Postası, 13.04.2012, "Trafik levhaları yenileniyor" (Karayolları Dairesi; Turkish plus English in tourist areas). http://www.kibrispostasi.com/index.php/cat/35/news/77677 [S]
- **R15** Tema.ru travel notes, Northern Cyprus, Feb 2012 (British-heritage markings, yellow globes, box-junction rule). https://www.tema.ru/eng/travel/northern-cyprus/ [S]
- **R16** Yenidüzen, 29.09.2026, M. Çelikağ, "KKTC'de kara yollarının yapımı, bakım-onarımı ve trafik durumu". https://www.yeniduzen.com/murude-celikag-kktcde-kara-yollarinin-yapimi-bakim-onarimi-ve-trafik-durumu-199939h.htm [S]
- **R23** Kibkom North Cyprus Forum, Feb 2015, "Highway Code???" (schools used the UK Highway Code with irrelevant parts crossed out). https://kibkomnorthcyprusforum.com/viewtopic.php?t=21891 [S, anecdotal]
- **R24** kktcehliyet.xyz (commercial; claims oral exam with 7–15 sign questions). https://kktcehliyet.xyz/ [S]
- **R26** KGM, *Trafik İşaretleri El Kitabı* 2015 (Türkiye; names only). https://www.kgm.gov.tr/SiteCollectionDocuments/KGMdocuments/Trafik/IsaretlerElKitabi/TrafikIsaretleriElKitabi2015.pdf [S]
- **R28** KKTC Resmî Gazete Sayı 130, 17.07.2007 (Bildiri; traffic offences list). https://basimevi.gov.ct.tr/Portals/6/2007/130.pdf?ver=2021-04-03-144848-443 [S, not opened]
- **R27** Türkiye, *Trafik İşaretleri Hakkında Yönetmelik* (1985; not applicable in KKTC). https://www.mevzuat.gov.tr/anasayfa/MevzuatFihristDetayIframe?MevzuatTur=7&MevzuatNo=4699&MevzuatTertip=5 [S]
