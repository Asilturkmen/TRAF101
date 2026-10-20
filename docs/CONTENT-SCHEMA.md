# İçerik şeması ve yazım sözleşmesi

Bu dosya `content/` altındaki her veri dosyasının biçimini ve kimin hangi dosyaya yazdığını tanımlar. Plan: `docs/PLAN.md` bölüm 5. Her ajan işe başlamadan önce bu dosyayı, `docs/PLAN.md` bölüm 1, 5 ve 7.4'ü okur.

Denetim: `node scripts/validate-content.mjs`. Hata varsa çıkış kodu 1 olur. İşini bitiren her ajan bu komutu çalıştırır ve kendi dosyalarındaki bütün hataları düzeltir.

## Genel kurallar

- **Yerelleştirilmiş metin** her yerde `{ "tr": "...", "en": "..." }` biçimindedir. İki dil de zorunludur, boş metin olmaz.
- **Biçimlendirme:** gövde metinlerinde yalnız şunlar kullanılır: boş satırla ayrılmış paragraflar, `- ` ile başlayan madde satırları, `**kalın**`. Başka Markdown, HTML ya da emoji yok.
- **Etiket (`basis`)** zorunludur: `law` | `practice` | `secondary`. Anlamları `docs/PLAN.md` bölüm 5.1'dedir.
  - `law`: araştırmada [V] işaretli bilgi. `sourceId` resmi bir kaynağı gösterir, `sourceRef` maddeyi ya da sayfayı söyler.
  - `secondary`: yalnız [S] işaretli bilgi. `sourceId` ikincil kaynağı gösterir.
  - `practice`: kaynakta yazılı değil ama sol trafikte ve güvenli sürüşte mantıklı. `sourceId` boş olabilir. **Km/sa, mg, yüzde, TL, puan, yaş, metre, dakika, saat ya da gün içeren hiçbir sayı yazılamaz.** Doğrulama betiği bunu denetler.
- **Yayınlanmayanlar:** kaynaklar arasında çelişen bilgi, KKTC'de olmadığı bilinen kavramlar (4-way stop, otoyol rampası, sarı elmas uyarı levhası, EH sınıfı), kaynağı olmayan sayısal iddia.
- **Sol trafik:** KKTC'de soldan gidilir, sağdan sollanır. Dönel kavşaklarda dönüş saat yönündedir ve içerideki araç önceliklidir. Kavşakta sağdan gelene yol verilir. Kaldırım soldadır. Acil araca yol vermek için sola çekilir (`practice`). Her senaryo ve soru buna göre yazılır.
- **Acil numaralar:** 155 polis, 112 ambulans, 199 itfaiye (`law`, kaynak `s1` ve `s15`). Yaralı varsa 112 ve 155 birlikte söylenir.
- **Türkçe:** "sen" diye hitap, kısa cümle, ünlem yok. Yönetmelik terimleri: "yol ver", "geçiş üstünlüğü", "çember" ya da "dönel kavşak", "çift şeritli yol". Doğru Türkçe karakterler (ç ğ ı İ ö ş ü) ve kesme işareti: KKTC'de, Kıbrıs'ta.
- **İngilizce:** İngiliz yazımı: licence, practise (fiil), give way, roundabout, kerb, tyre, dual carriageway.
- **Başlıklar:** cümle düzeninde, sonda nokta yok, ünlem yok.
- **AI-made dili yok:** "Ready to...", "Our mission", "journey", "unlock", "master", "seamless", "empower" gibi kalıplar yok. Somut ol.
- **Kimlikler** küçük harf, kebab-case, sabit. Bir kez yayınlanan kimlik değişmez.
- `reviewedAt`: içeriği yazdığın gün, `2026-10-20` biçiminde.

## Dosyalar ve sahipleri

Her ajan yalnız kendi dosyalarına yazar. Başka bir dosyada değişiklik gerekirse son raporunda önerir.

| Dosya | Sahip |
|---|---|
| `content/exam-profile.json`, `content/tracks.json`, `content/topics.json`, `content/lessons.json` | Lider |
| `content/sources/regulations.json` | Lider (araştırma raporundan) |
| `content/sources/signs.json` | Levha ajanı |
| `content/sources/<ajan>.json` | Kendi kaynağını ekleyen ajan; kimlikler ajan önekiyle başlar (`fa-`, `sc-` gibi) |
| `content/signs/categories.json`, `content/signs/<kategori>.json`, `public/signs/**.svg`, `public/signs/CREDITS.md` | Levha ajanı |
| `content/questions/rules.json` | Soru ajanı 1 |
| `content/questions/safety.json` | Soru ajanı 2 |
| `content/questions/vehicle.json`, `environment.json`, `personal.json`, `firstaid.json` | Soru ajanı 3 |
| `content/questions/moto.json`, `heavy.json`, `content/scenarios.json` | Soru ajanı 4 |
| `content/lessons/<id>.json` | Ders ajanı |
| `content/pages/<id>.json`, `content/glossary.json`, `docs/verification-checklist.md`, `docs/inventory-map.md` | Rehber ajanı |

## Sınav konuları (`content/topics.json`)

Her soru şu altı konudan birine aittir. Yönetmelikteki yazılı sınav dağılımı bunlara göredir.

| id | TR | EN |
|---|---|---|
| `rules` | Trafik kuralları ve levhalar | Traffic rules and signs |
| `safety` | Trafik güvenliği ve davranış | Road safety and behaviour |
| `vehicle` | Araç bilgisi | Vehicle knowledge |
| `environment` | Çevre | Environment |
| `personal` | Sürücünün kişisel durumu | Driver fitness |
| `firstaid` | İlk yardım | First aid |

## Dersler (`content/lessons.json` ve `content/lessons/<id>.json`)

Konular sayfasındaki öğrenme sayfalarıdır. Her soru bir derse bağlanır (`lesson` alanı).

| id | TR slug | EN slug | Sınav konusu |
|---|---|---|---|
| `signs-basics` | `levhalarin-dili` | `how-signs-work` | rules |
| `right-of-way` | `oncelik-kurallari` | `right-of-way` | rules |
| `junctions` | `kavsaklar-ve-cember` | `junctions-and-roundabouts` | rules |
| `speed` | `hiz-ve-takip-mesafesi` | `speed-and-following-distance` | rules |
| `overtaking` | `sollama-ve-serit` | `overtaking-and-lanes` | rules |
| `parking` | `duraklama-ve-park` | `stopping-and-parking` | rules |
| `documents` | `belgeler-ve-ceza-puani` | `documents-and-penalty-points` | rules |
| `vulnerable` | `yayalar-ve-iki-tekerlekliler` | `pedestrians-and-riders` | safety |
| `lights-weather` | `isiklar-gece-ve-kotu-hava` | `lights-night-and-bad-weather` | safety |
| `occupants` | `emniyet-kemeri-cocuk-ve-kask` | `seat-belts-children-and-helmets` | safety |
| `emergencies` | `ariza-kaza-ve-acil-durum` | `breakdowns-crashes-and-emergencies` | safety |
| `vehicle` | `arac-teknigi-ve-bakim` | `vehicle-checks-and-maintenance` | vehicle |
| `environment` | `cevre-ve-verimli-surus` | `environment-and-eco-driving` | environment |
| `fitness` | `alkol-yorgunluk-ve-dikkat` | `alcohol-fatigue-and-attention` | personal |
| `first-aid` | `ilk-yardim` | `first-aid` | firstaid |
| `motorcycle` | `motosiklet` | `motorcycles` | safety |
| `heavy` | `agir-vasitalar` | `heavy-vehicles` | safety |

Ders dosyası:

```jsonc
{
  "id": "right-of-way",
  "title":   { "tr": "Öncelik kuralları", "en": "Right of way" },
  "summary": { "tr": "Tek cümlelik özet", "en": "One-sentence summary" },
  "sections": [
    {
      "heading": { "tr": "...", "en": "..." },
      "body":    { "tr": "Paragraf.\n\n- madde\n- madde", "en": "..." },
      "basis": "law", "sourceId": "s1", "sourceRef": "s. 2"
    }
  ],
  "keyPoints": [ { "text": { "tr": "...", "en": "..." }, "basis": "law", "sourceId": "s7", "sourceRef": "md. 2" } ],
  "relatedSigns": ["priority.give-way"],
  "reviewedAt": "2026-10-20"
}
```

## Sorular (`content/questions/<dosya>.json`)

Dosya bir dizi sorudur.

```jsonc
{
  "id": "rules.overtake-side",        // dosya öneki + nokta + kebab-case
  "rev": 1,
  "topic": "rules",                   // altı sınav konusundan biri
  "lesson": "overtaking",             // derslerden biri
  "tracks": ["car", "moto", "heavy"], // en az biri
  "difficulty": "easy",               // easy | medium | hard
  "prompt":  { "tr": "...", "en": "..." },
  "options": [                        // tam 4 şık, id'ler a, b, c, d
    { "id": "a", "text": { "tr": "...", "en": "..." } },
    { "id": "b", "text": { "tr": "...", "en": "..." } },
    { "id": "c", "text": { "tr": "...", "en": "..." } },
    { "id": "d", "text": { "tr": "...", "en": "..." } }
  ],
  "answer": "b",
  "why": { "tr": "Bir ya da iki cümlelik gerekçe", "en": "..." },
  "signId": null,                     // levha resmi gösterilecekse aşağıdaki zorunlu listeden bir id
  "basis": "law",
  "sourceId": "s7",
  "sourceRef": "md. 2",
  "reviewedAt": "2026-10-20"
}
```

- Her dosyada doğru cevap harflerinin her biri yüzde 15 ile 35 arasında olmalıdır.
- Şıklar inandırıcı olmalı. "Hepsi", "hiçbiri" ya da şaka şık yok. Doğru şık en uzun şık olmamalı.
- Soru metni levha resmini anlatıyorsa `signId` verilir ve metin resmi tarif etmez ("Bu levha ne anlama gelir?").
- "Bu levha ne anlama gelir?" türü levha tanıma soruları yazılmaz. Bunlar levha verisinden otomatik üretilir. Kural sorularında levha kullanılabilir: "Bu levhayı gördün, ne yaparsın?".

## Senaryolar (`content/scenarios.json`)

```jsonc
{
  "id": "sc.ambulance-behind",
  "rev": 1,
  "lesson": "emergencies",
  "category": "urban",                 // urban | rural | weather | emergency | parking
  "difficulty": "easy",
  "tracks": ["car", "moto", "heavy"],
  "title":     { "tr": "...", "en": "..." },
  "situation": { "tr": "...", "en": "..." },
  "signId": null,                      // görsel olarak gösterilecek levha, isteğe bağlı
  "choices": [                         // tam 3 seçenek, id'ler a, b, c
    { "id": "a", "text": { "tr": "...", "en": "..." }, "correct": false, "feedback": { "tr": "...", "en": "..." } }
  ],
  "explanation": { "tr": "...", "en": "..." },
  "basis": "practice", "sourceId": null, "sourceRef": null,
  "reviewedAt": "2026-10-20"
}
```

Tam bir doğru seçenek olur. Doğru seçeneğin harfi a, b ve c arasında dengeli dağılır.

## Levhalar (`content/signs/`)

`categories.json`:

```jsonc
[{ "id": "warning", "slug": { "tr": "uyari", "en": "warning" },
   "name": { "tr": "Uyarı levhaları", "en": "Warning signs" },
   "description": { "tr": "...", "en": "..." },
   "shape": "triangle" }]               // triangle | circle-red | disc-blue | octagon | rectangle | inverted-triangle
```

Kategoriler: `warning`, `priority`, `prohibitory`, `mandatory`, `information`. Ek levhalar (`additional`) çekirdek sette isteğe bağlıdır.

`<kategori>.json` bir dizi levhadır. Şema `docs/research/road-signs.md` bölüm 5.4'tedir, şu sadeleştirmeyle:

```jsonc
{
  "id": "warning.bend--left",                 // kategori + "." + dosya adı
  "category": "warning",
  "image": {
    "src": "/signs/warning/bend--left.svg",
    "alt": { "tr": "...", "en": "..." },      // levhayı tarif eder; quizde kullanılmaz
    "basedOn": [{ "title": "...", "license": "PD-self", "url": "..." }]   // yoksa []
  },
  "slug": { "tr": "sola-tehlikeli-viraj", "en": "dangerous-bend-left" },
  "name": { "tr": "Sola tehlikeli viraj", "en": "Dangerous bend to the left" },
  "meaning": { "tr": "...", "en": "..." },
  "driverAction": { "tr": "...", "en": "..." },
  "confusions": [{ "with": "warning.bend--right", "tip": { "tr": "...", "en": "..." } }],
  "related": ["warning.double-bend--left-first"],
  "examPriority": "core",                      // core | common | rare
  "kktc": { "status": "seen", "note": { "tr": "", "en": "" } },  // seen | likely | unverified
  "reviewedAt": "2026-10-20"
}
```

### Zorunlu levha kimlikleri

Levha ajanı bu kimliklerin hepsini üretir. Soru ve senaryo ajanları `signId` olarak yalnız bu listeden seçer.

- `priority.stop` (DUR), `priority.give-way`, `priority.give-way-to-oncoming`, `priority.priority-over-oncoming`
- `prohibitory.no-entry`, `prohibitory.no-vehicles`, `prohibitory.no-overtaking`, `prohibitory.no-left-turn`, `prohibitory.no-right-turn`, `prohibitory.no-u-turn`, `prohibitory.no-parking`, `prohibitory.no-stopping`, `prohibitory.no-motorcycles`, `prohibitory.no-goods-vehicles`, `prohibitory.no-pedestrians`, `prohibitory.speed-limit--30`, `prohibitory.speed-limit--50`, `prohibitory.speed-limit--65`, `prohibitory.speed-limit--80`, `prohibitory.end-of-restrictions`, `prohibitory.height-limit`, `prohibitory.weight-limit`
- `mandatory.roundabout` (saat yönünde), `mandatory.ahead-only`, `mandatory.turn-left`, `mandatory.turn-right`, `mandatory.keep-left`, `mandatory.pass-either-side`, `mandatory.cycle-route`
- `warning.bend--left`, `warning.bend--right`, `warning.double-bend--left-first`, `warning.crossroads`, `warning.junction-priority-right`, `warning.side-road--left`, `warning.roundabout-ahead`, `warning.pedestrian-crossing`, `warning.children`, `warning.road-narrows--both`, `warning.slippery-road`, `warning.road-works`, `warning.traffic-signals`, `warning.two-way-traffic`, `warning.steep-descent`, `warning.steep-ascent`, `warning.uneven-road`, `warning.falling-rocks`, `warning.domestic-animals`, `warning.other-danger`
- `information.parking`, `information.pedestrian-crossing`, `information.one-way-street`, `information.dead-end`, `information.hospital`, `information.first-aid` (kızılay), `information.bus-stop`, `information.town-start`, `information.town-end`

## Rehber sayfaları (`content/pages/<id>.json`)

Ders dosyasıyla aynı yapıdadır (`title`, `summary`, `sections`, `reviewedAt`). Ek olarak `slug: {tr, en}` taşır. Sayfalar: `exam` (`sinav-nasil-yapilir` / `how-the-exam-works`), `licence` (`ehliyet-nasil-alinir` / `getting-a-licence`), `left-driving` (`soldan-trafik` / `driving-on-the-left`), `sources` (`kaynaklar` / `sources`, yalnız giriş metni; liste veriden üretilir), `about` (`hakkinda` / `about`), `privacy` (`gizlilik` / `privacy`).

## Terim sözlüğü (`content/glossary.json`)

`[{ "id": "give-way", "tr": "yol vermek", "en": "give way", "note": { "tr": "", "en": "" } }]`

## v1.1 eklemeleri

- **Paralel levha işi:** yeni levha çizimleri `scripts/signs/defs/<ajan>.mjs` dosyasına yazılır. Dosya `export const SIGNS = { 'kategori/dosya': () => compose(...) }` biçimindedir ve `scripts/signs/lib.mjs` yardımcılarını kullanır (gerekirse `signs.mjs` içindeki küçük yardımcıları kendi dosyana kopyala, `signs.mjs`'i değiştirme). `node scripts/signs/build-signs.mjs` hepsini üretir; aynı anahtar iki dosyada olursa hata verir.
- **Kategori başına birden çok veri dosyası:** `content/signs/` altındaki her `.json` (categories.json dışında) birleştirilir. Kendi dosyanı yaz, örneğin `content/signs/warning-v11.json`; başka ajanın dosyasını değiştirme. Her levhanın `category` alanı kategorisini belirler.
- **Yeni kategoriler** (`content/signs/categories.json`, lider yazar): `additional` (Ek levhalar), `marking` (Yol çizgileri), `light` (Trafik ışıkları), `police` (Polis işaretleri). Çizimleri `public/signs/<kategori>/` altına gider. Yol çizgisi, ışık ve polis çizimleri kare olmak zorunda değildir; `viewBox` gerçek oranı taşır.
- **Ders bölümünde çizim:** bir bölüm isteğe bağlı `"figure": { "src": "/diagrams/<dosya>.svg", "alt": { "tr", "en" }, "caption": { "tr", "en" } }` taşıyabilir. Dosya `public/` altında bulunmalıdır.
- **Yeni dersler** (`content/lessons.json`, lider yazar): `markings` (`yol-cizgileri-isiklar-ve-polis` / `road-markings-lights-and-police`, sınav konusu rules) ve `roundabouts` (`cember-rehberi` / `roundabout-guide`, sınav konusu rules).
- **Yeni soru dosyaları:** `content/questions/markings.json` (kimlikler `markings.` ile başlar), `content/questions/roundabouts.json` (`roundabouts.` ile başlar). Kurallar yukarıdakilerle aynıdır.
- KKTC'de anlamı doğrulanamayan çizgi, ışık ya da işaret için levha verisinde `kktc.status` `unverified` olur ve `kktc.note` bunu açıkça söyler; anlam metni Viyana Sözleşmesi ve Türkiye uygulamasındaki genel anlamı verir, KKTC'ye özgü bir kural uydurmaz.
