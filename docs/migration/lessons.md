# Eski çalışma verisinden derslere geçiş

Eski kaynak: `src/data/studyData.js` (sitede hiç gösterilmedi). Yeni yer: `content/lessons/<id>.json` içindeki 17 ders (ders ajanı). Gerekçeler `docs/research/kktc-regulations.md` (özellikle bölüm 3, 4, 5, 7.4) ve `docs/research/road-signs.md` (bölüm 1, 2, 4.4, 4.5) dosyalarına dayanır. Derslere özel ek kaynaklar `content/sources/lessons.json` dosyasındadır (`le-` önekli).

Kısaltmalar: **kept** taşındı, **reworded** anlamı korunarak düzeltildi, **dropped** yayınlanmadı.

## Kurallar (`rules`)

| Eski öğe | Karar | Yeni yer ve gerekçe |
|---|---|---|
| `r-gen` "Drive on the LEFT. Overtake on the RIGHT." | kept | `overtaking` §1 ve anahtar noktalar (law, s7 md. 2). |
| `r-gen` ipucu "Roundabouts are Clockwise." | kept | `junctions` §1-§3 (law, s1: broşürdeki zorunlu dönel kavşak levhası okları saat yönünde gösterir; road-signs.md R4). |
| `r-row` "Give way to traffic from the RIGHT at uncontrolled junctions and roundabouts." | kept | `right-of-way` §2, `junctions` §2 ve §4 (law, s1). Dönel kavşakta "içerideki araç önceliklidir" kuralı da eklendi. |
| `r-row` ipucu "Right hand rule applies." | kept | `junctions` §1, sağdan trafikten gelen öğrenci için açıklamayla. |
| `r-lights` Red: Stop · Green: Go · Amber: Stop if safe | reworded | `junctions` §5 (practice, sayısız). KKTC ışık sırası resmi metinde bulunamadı (road-signs.md 4.5). Kırmızı ışık cezası anahtar noktada (secondary, s30). |
| `r-lights` "Red+Amber: Get Ready" | dropped | KKTC'de kırmızı-sarı evresinin kullanıldığı doğrulanamadı (road-signs.md 4.5, 6 madde 10). `docs/verification-checklist.md` kapsamındaki açık soru doğrulanırsa `junctions` §5'e eklenir. |
| `r-lights` "Flashing Amber: Proceed with caution (Yield)" ve ipucu "Flashing Amber = Yield Sign" | reworded | `junctions` §5 (practice): "yavaşla, kavşağa ışık yokmuş gibi yaklaş, levhaya uy, yoksa sağdan gelene yol ver". "Yol ver levhasıyla aynı" eşitlemesi kaldırıldı, çünkü KKTC anlamı doğrulanmadı (rapor 7.2 rw8). |
| `r-park` "Do not park on double yellow lines." | reworded | `parking` §3 (practice): "kaldırım kenarında sarı çizgi görürsen orayı bekleme yasağı gibi düşün ve levhayı oku". Çift sarı çizginin İngiltere'deki ayrıntılı anlamı yazılmadı; KKTC'deki yasal anlamı doğrulanmadı (rapor 7.4). |
| `r-park` "Do not park against logic (facing traffic flow)." | kept | `parking` §4 (practice): yolun sol kenarına, trafikle aynı yöne bakarak park et. |
| `r-park` ipucu "Never block a hydrant." | kept | `parking` §3 (practice). |

## Güvenlik ve araç (`safety`)

| Eski öğe | Karar | Yeni yer ve gerekçe |
|---|---|---|
| `v-dsssm` Doors, Seat, Steering, Seatbelt, Mirrors; ipucu "Every trip." | kept | `vehicle` §1 (practice). İngilizce DSSSM kısaltması bir ezber aracı olarak anıldı. |
| `v-power` Petrol, Oil, Water, Electrics, Rubber | kept | `vehicle` §2 (practice). POWER kısaltması "İngilizcede bu liste böyle bilinir" diye etiketlendi (rapor 7.2 dd1). |
| `v-power` ipucu "Weekly checks." | reworded | "Düzenli olarak ve uzun yola çıkmadan önce" oldu. Haftalık sıklık KKTC kaynağında yok; practice etiketli metinde süre yazılamaz. |
| `v-dist` "Dry: 2 Seconds. Wet: 4 Seconds. Icy: 10 Seconds." | reworded | `speed` §4 ve anahtar nokta (secondary, `le-highway-code`, kural 126). KKTC mevzuatında takip mesafesi yok; metin bunu açıkça söyler ve ölçüyü İngiltere Highway Code'una bağlar. Highway Code ıslak yol için "en az iki katı", buzlu yol için "on katına kadar" der; eski "4" ve "10 saniye" bu biçimde yazıldı. |
| `v-dist` ipucu "Only a fool breaks the 2-second rule." | dropped | Bilgi içermiyor ve kullanıcıyı aşağılayan bir dil. |

## Acil durumlar (`emergency`)

| Eski öğe | Karar | Yeni yer ve gerekçe |
|---|---|---|
| `e-acc` "Stop. Warn. Help. Call 112/155." | kept | `emergencies` §3 (practice: Dur, Uyar, Ara, Yardım et) ve §1 (law, s15: 155, 112, 199, 177). Yaralıda 112 ve 155 birlikte (CONTENT-SCHEMA). |
| `e-acc` ipucu "Do not move injured people." | reworded | `emergencies` §3 ve `first-aid` §2: "doğrudan bir tehlike yoksa oynatma; hava yolunu açmak her zaman önce gelir" (secondary, `le-erc-2025-first-aid`). Mutlak "asla oynatma" kalıbı yangın ya da trafik tehlikesinde yanlış olurdu. |
| `e-break` "Hazard lights on." | kept | `emergencies` §2 (practice). |
| `e-break` "Warning triangle 45m back." | reworded | `emergencies` §2 (practice, sayısız): "uyarı üçgenin varsa aracının arkasına, aynı tarafta ve yaklaşan sürücülerin zamanında göreceği bir uzaklığa koy". 45 metre KKTC mevzuatında bulunamadı (rapor 7.4) ve üçgenin özel araçta zorunlu olup olmadığı da açık soru (rapor 8 madde 11). Takip mesafesinden farklı olarak bu bir teknik değil, ülkeden ülkeye değişen bir mesafe kuralıdır; İngiltere değeri KKTC'de doğru olmayabilir, bu yüzden sayı yazılmadı. |
| `e-break` ipucu "Safety first." | kept | `emergencies` özeti ve §2. |

## Yasal (`legal`)

| Eski öğe | Karar | Yeni yer ve gerekçe |
|---|---|---|
| `l-alc` "50mg (0.05%) limit." | kept | `fitness` §1 (law, s8 md. 2): kanda 100 ml'de 50 mg; nefes (24 mikrogram) ve idrar (65 mg) sınırları ile toplu taşıma için sıfır sınırı eklendi. "0.05%" yazılmadı. |
| `l-alc` ipucu "Zero tolerance is best." | kept | `fitness` §1 son paragraf: "araç kullanacaksan hiç içmemek en güvenlisidir". |
| `l-doc` "License, Insurance, Registration, Tax." | reworded | `documents` §5 (law, s1): ehliyet ya da öğrenci ehliyeti, seyrüsefer belgesi (yol vergisi), sigorta, kimlik. "Registration" (ruhsat) s1 listesinde yok, bu yüzden yazılmadı; yerine kaynaktaki "kimlik" geldi. |
| `l-doc` ipucu "Carry them always." | kept | `documents` §5. |

## Levha listesi (`signs`)

Levha adları ve tek tek anlamları levha verisine aittir (`content/signs/`, levha ajanı). Derslere yalnız sistem bilgisi taşındı.

| Eski öğe | Karar | Yeni yer ve gerekçe |
|---|---|---|
| `s-warning` "Triangular signs with a red border warn drivers of potential dangers ahead." | kept | `signs-basics` §2 ve §3. |
| `s-warning` ipucu "Slow down immediately when you see a triangle." | reworded | `signs-basics` §3: "hızını düşür, tehlikeyi ara, durmaya hazır ol". |
| `s-prohibitory` "Circular signs with a Red Border tell you what you MUST NOT do." | kept | `signs-basics` §2. |
| `s-prohibitory` ipucu "Disobeying these is a direct traffic offense." | dropped | Levhaya uymamanın suç olduğu yalnız bir arama özetinde görüldü (road-signs.md 4.5, R28). Kaynağı açılmadan yazılmadı. |
| `s-mandatory` "Blue circles give positive instructions." / "Blue = DO THIS." | kept | `signs-basics` §2. |
| `s-priority` "Signs that regulate who goes first at intersections." | kept | `signs-basics` §4 (DUR, yol ver, dar yolda öncelik levhaları) ve `right-of-way`. |
| `s-priority` "Priority Road (Diamond)" ve "End of Priority" | dropped | Sarı-beyaz öncelikli yol levhasının KKTC'de kullanıldığı doğrulanmadı (road-signs.md 6 madde 6, rapor 8 madde 10). Zorunlu levha listesinde de yok. |
| `s-info` "Rectangular signs giving information, directions, or facilities." | kept | `signs-basics` §2. |
| `s-info` ipucu "Usually Blue or Green." | reworded | Renk iddiası kaldırıldı. KKTC'de yeşil yön levhası düzeni doğrulanmadı (road-signs.md 2.2, 6 madde 5). |
| Tek tek levhalar (viraj, yol daralması, giriş yok, hız sınırları, park, hastane ve diğerleri) | kept | Zorunlu listede olanlar derslerin `relatedSigns` alanında. |
| "Steep Descent (10%)", "Steep Ascent (10%)" | kept | `warning.steep-descent` ve `warning.steep-ascent`, `heavy` dersinin `relatedSigns` alanında. Yüzde değeri levha resmine aittir. |
| "Maximum Speed 100" | kept | `speed` §1 ve §2: çift şeritli yolda otomobil için 100 km/sa (law, s1). Levha zorunlu listede olmadığı için `relatedSigns`'a eklenmedi. |
| "Minimum Speed 30" | dropped | KKTC'de en düşük hız kuralı bulunamadı (rapor 7.2 sp6, 8 madde 7). `speed` §3 sayısız olarak "çok yavaş gitmek de tehlikeli olabilir" der. |
| "Side Winds", "No Horns", "Animals (Wild)", "Stop (Customs/Police)" | dropped from lessons | Zorunlu listede değiller; levha verisinde olup olmayacaklarına levha ajanı karar verir. Yan rüzgar `lights-weather` §4'te, korna kullanımı `environment` §4'te, evcil hayvan `vulnerable` §5'te sürücü davranışı olarak var. Gümrük ve polis "STOP" levhası güney Kıbrıs'a aittir (road-signs.md TL;DR 1). |

## Kaynağı bulunamayan ve bu yüzden yazılmayanlar

- Ağır kamyon (B) ehliyeti için yaş: kaynaklar çelişiyor (21 ya da 22). `documents` ve `heavy` derslerinde "kursuna ya da Trafik Dairesi'ne sor" deniyor.
- H2 ve H yaş şartları: 2013 metni ile 2022 değişikliği net değil. `motorcycle` §1 kursa yönlendiriyor.
- Turist statüsü bitince yabancı ehliyetle başvuru süresi: kaynaklar çelişiyor. `documents` §4 "Trafik Dairesi'ne sor, izni alır almaz başvur" diyor.
- Alkolde mahkeme üst sınırları: 21/1974 Yasası (s6 md. 9) ile 2025 değişikliklerinin basındaki aktarımı (s28) farklı değerler veriyor. `fitness` §2 yalnız sabit ceza bantlarını ve "mahkeme hapis ve men kararı verebilir" bilgisini sayısız veriyor.
- Okul bölgesi hız sınırı: KKTC'de genel bir değer bulunamadı; `speed` §3 ve `vulnerable` §2 yerel levhaya yönlendiriyor.
