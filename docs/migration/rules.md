# Eski soru bankasından "rules" konusuna geçiş

Kaynak: `src/data/questions.js` (eski 40 soru). Hedef: `content/questions/rules.json`.
Gerekçeler `docs/research/kktc-regulations.md` bölüm 7.2'ye dayanır.

| Eski id | Yeni id | Not |
|---|---|---|
| s1 | `rules.stop-sign-clear-road` | "Kırmızı sekizgen" tanıma sorusu davranış sorusuna çevrildi (DUR levhası, yol boşken de dur). Levha tanıma soruları levha verisinden üretilir. |
| s2 | `rules.sign-shape-warning` | Aynı fikir, iki dilde. |
| s3 | `rules.sign-shape-mandatory` | Aynı fikir. |
| s4 | `rules.sign-shape-prohibition` | Görsel ve açıklama arasındaki uyumsuzluk kalktı; resim kullanılmıyor. |
| s5 | dropped | Sarı ya da turuncu elmas = uyarı ABD (MUTCD) kavramıdır, KKTC'de yok. Öncelikli yol elması KKTC'de doğrulanmadı ve zorunlu levha listesinde değil. |
| s6 | `rules.sign-no-goods-vehicles` | Yalnız ağır vasıta yolu; yanlış sınıf harfleri (C, D, EH) kalktı. |
| s7 | `rules.give-way-sign`, `rules.give-way-beats-right` | Ters üçgen tanıma yerine davranış ve "levha sağdan gelen kuralından önce gelir" sorusu. |
| s8 | `rules.sign-no-entry` | Davranış sorusuna çevrildi. |
| sp1 | `rules.speed-built-up` | `law`, kaynak s1. |
| sp2 | `rules.speed-dual-carriageway-car`, `rules.speed-rural-range`, `rules.speed-first-class-car`, `rules.speed-village-road-car`, `rules.speed-moto-dual-carriageway`, `rules.speed-moto-first-class` | 100 km/sa yalnız çift şeritli yolda otomobil için geçerli; yol sınıfı ve motosiklet soruları ayrıldı. |
| sp3 | `rules.speed-lorry-dual-carriageway`, `rules.speed-bus-dual-carriageway`, `rules.speed-lorry-first-class` | Kamyon 75, otobüs 80 olarak bölündü (`secondary`, s27). |
| sp4 | `rules.speed-limit-is-maximum` | Sayısız yazıldı (`practice`), levha resmi `prohibitory.speed-limit--65`. |
| sp5 | `rules.sign-children` | KKTC'de yasal okul bölgesi sınırı bulunamadı; "30 km/sa" kalktı, sayısız davranış sorusu oldu. |
| sp6 | `rules.speed-slow-queue` | "Yasadışı" iddiası kalktı (asgari hız kuralı bulunamadı); solda kal ve yol ver. |
| sp7 | `rules.speed-adapt-conditions` | Aynı fikir. |
| sp8 | `rules.speed-towing-broken-down` | Römork sınırı bulunamadı; yerine doğrulanmış "arızalı araç çekme" sınırı (25 km/sa, s27). |
| rw1 | `rules.priority-right-uncontrolled` | Yanlış "İngiltere gibi" açıklaması kalktı. |
| rw2 | `rules.roundabout-give-way` | `law`, s1. Ayrıca `rules.roundabout-already-in`, `rules.roundabout-clockwise` eklendi. |
| rw3 | `rules.pedestrian-waiting-crossing` | "Geçmeye hazırlanan yaya" vurgusu, s1. |
| rw4 | dropped | "4-way stop" KKTC'de yok. Yerine `rules.priority-right-you-have-it`. |
| rw5 | `rules.stop-sign-clear-road` | s1 ile birleşti. |
| rw6 | `rules.emergency-vehicle-behind` | Hangi yana çekileceği eklendi: sola (`practice`). |
| rw7 | `rules.turn-right-oncoming` | `secondary`, s31. |
| rw8 | `rules.flashing-amber` | KKTC metni yok; `practice` olarak, "öncelik kurallarına uyarak dikkatle geç". |
| tr1 | `rules.keep-left` | `law`, s7 md. 2(a). |
| tr2 | out of scope | Telefon kullanımı `safety`/`personal` bankasına ait (soru ajanı 2 ya da 3). |
| tr3 | out of scope | Emniyet kemeri `safety` bankasına ait (soru ajanı 2). |
| tr4 | out of scope | Kask `safety`/`moto` bankasına ait (soru ajanı 2 ya da 4). |
| tr5 | out of scope | Alkol sınırı `personal` bankasına ait (soru ajanı 3). |
| tr6 | `rules.overtake-side` | Kafa karıştıran soru yeniden yazıldı: "Normalde hangi taraftan sollarsın? Sağdan." |
| tr7 | `rules.solid-centre-line` | KKTC yol çizgisi kuralı doğrulanmadı; tek kesintisiz çizgi, `practice`. |
| tr8 | `rules.dual-carriageway-missed-turn` | "Otoyol çıkışı" KKTC'de yok; çift şeritli yolda kaçırılan kavşak olarak yazıldı. |

Eski `dd1`–`dd8` soruları bu konuya ait değildir (araç, kişisel durum, acil durum).
