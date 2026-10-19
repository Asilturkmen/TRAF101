# Eski içerikten araç, çevre, kişisel durum ve ilk yardım bankalarına geçiş

Eski banka: `src/data/questions.js` ve `src/data/studyData.js`. Yeni bankalar: `content/questions/vehicle.json`, `environment.json`, `personal.json`, `firstaid.json` (soru ajanı 3). Gerekçeler `docs/research/kktc-regulations.md` bölüm 7.2 ve 7.4'e dayanır. İlk yardım kaynakları `content/sources/general.json` dosyasındadır (`ge-` önekli).

## Eski sorular

| Eski id | Konu | Yeni id ya da karar |
|---|---|---|
| dd1 | Uzun yol öncesi araç kontrolü | `vehicle.pre-trip-checks` (practice). "POWER" kısaltması kaldırıldı; içerik lastik, yağ, soğutma suyu, ışık ve fren olarak yazıldı. Ayrıntı soruları: `vehicle.tyre-pressure-cold`, `vehicle.oil-check`, `vehicle.lights-walkaround`, `vehicle.brake-fluid-low`. |
| dd2 | Yorgunken sürmek | `personal.fatigue-remedy` (practice). Yasal dayanak ayrı soruda: `personal.fatigue-law` (law, s6 md. 10). Ek: `personal.fatigue-signs`, `personal.fatigue-plan`. |
| dd4 | Profesyonel sürücü molası, 4,5 saat / 45 dakika | dropped: AB/AETR kuralı, KKTC mevzuatında bulunamadı (rapor 7.2). Yorgunluk `personal.fatigue-law` ve `personal.fatigue-plan` ile sayısız işleniyor. Aynı karar `docs/migration/safety.md` dosyasında da var. |
| dd6 | Su kayması (aquaplaning) | Bu dosyalarda yok: `safety.aquaplaning` (soru ajanı 2) karşılıyor. Araç tarafı `vehicle.worn-tread` ile (aşınmış diş ve ıslak yolda tutuş) işleniyor. |
| tr5 | Kandaki alkol sınırı | `personal.alcohol-blood-limit` (law, s8 md. 2: 100 ml kanda 50 mg). Eski açıklamadaki "profesyonel sürücülerde genelde sıfır" düzeltildi: `personal.alcohol-public-transport` (law, s8: kamu taşımacılığı yapan sürücüler için sıfır). Ek: `personal.alcohol-breath-limit` (law, s8: 100 ml nefeste 24 mikrogram), `personal.alcohol-over-150` ve `personal.alcohol-points` (secondary, s28), `personal.alcohol-time-only`, `personal.alcohol-morning-after`, `personal.alcohol-effects` (practice). "0.05%" ifadesi kullanılmadı. |

Bu alanın dışında kalan dd3, dd5, dd7, dd8 ve tr2, tr3, tr4 için bkz. `docs/migration/safety.md`.

## Eski çalışma verisi (`src/data/studyData.js`)

| Eski öğe | Yeni yer ya da karar |
|---|---|
| `v-power` (Petrol, Oil, Water, Electrics, Rubber) | `vehicle.pre-trip-checks` ve ayrıntı soruları. Kısaltma kaldırıldı, çünkü İngiltere'ye özgü bir ezber aracıdır. |
| `v-dsssm` (kapı, koltuk, direksiyon, kemer, ayna) | Ayna kısmı `vehicle.mirrors-before-moving` (önce koltuk, sonra ayna). Kemer `safety` bankasında. |
| `l-alc` ("50mg (0.05%) limit", "Zero tolerance is best") | `personal.alcohol-blood-limit`, `personal.alcohol-breath-limit`, `personal.alcohol-public-transport`. "Sıfır en iyisi" tavsiyesi `personal.alcohol-effects` ile karşılanıyor. |
| `e-acc` ("Do not move injured people") | `firstaid.awake-neck-pain`, `firstaid.crash-casualty-position` ve `firstaid.no-improvised-collar` (ERC 2025). Genel kural `safety.do-not-move-the-injured` sorusunda. |
| `e-acc` ("Call 112/155") | `firstaid.on-the-phone-to-112` (görüşmede ne yapılır). Numaraların kendisi `safety.injury-crash-112-and-155` sorusunda. |

## Yinelemeyi önlemek için bilerek yazılmayanlar

Şu konular `safety` bankasında zaten var. Bu bankalar aynı soruyu tekrar etmez, başka bir yönünü sorar:

- Su kayması (`safety.aquaplaning`), araç yangını ve 199 (`safety.vehicle-fire-199`), yangın söndürme cihazı (`safety.fire-extinguisher-in-a-car`, `safety.fire-extinguisher-exempt-vehicles`), araçta serbest eşya (`safety.loose-objects-in-the-car`), korna (`safety.using-the-horn`), kaza yerine ilk varış (`safety.first-at-a-crash-scene`), yaralıyı taşımamak (`safety.do-not-move-the-injured`), kazadan sonra motosikletlinin kaskı (`safety.motorcyclist-helmet-after-a-crash`), telefon dikkat dağınıklığı (`safety.texting-in-slow-traffic` ve diğerleri).
