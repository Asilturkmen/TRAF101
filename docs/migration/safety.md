# Eski sorulardan yeni safety bankasına geçiş

Eski banka: `src/data/questions.js`. Yeni banka: `content/questions/safety.json` (konu `safety`). Gerekçeler `docs/research/kktc-regulations.md` bölüm 7.2'ye dayanır.

| Eski id | Konu | Yeni id ya da karar |
|---|---|---|
| dd1 | Uzun yol öncesi araç kontrolü | Bu dosyada yok: araç bilgisi konusudur (`content/questions/vehicle.json`, soru ajanı 3). "POWER" kısaltması kullanılmamalı. |
| dd2 | Yorgunken sürmek | Bu dosyada yok: sürücünün kişisel durumu konusudur (`content/questions/personal.json`, soru ajanı 3). |
| dd3 | Gece kuyrukta fren lambası | `safety.brake-lights-in-a-night-queue` (practice, UK Highway Code rule 114 referans) |
| dd4 | Profesyonel sürücü molası, 4,5 saat / 45 dakika | dropped: AB/AETR kuralı, KKTC mevzuatında bulunamadı; ayrıca yalnız ağır vasıta konusu. |
| dd5 | Arızada ilk iş: dörtlüler | `safety.breakdown-hazard-lights`; ek olarak `safety.pull-over-to-the-left`, `safety.passengers-after-a-breakdown`, `safety.warning-triangle-placement` |
| dd6 | Su kayması (aquaplaning) | `safety.aquaplaning` |
| dd7 | Tehlikeli yük belgeleri | dropped: ADR/ABD uygulaması, KKTC'de karşılığı yok ve EH sınıfı mevcut değil. |
| dd8 | Savunmalı sürüş | `safety.defensive-driving` (practice, kaynak s3 md. 29 müfredat başlığı) |
| tr2 | Sürerken elde telefon | `safety.texting-in-slow-traffic` (law, s1); ek olarak `safety.phone-penalty-points` (50 puan, s28), `safety.bluetooth-hands-free` (s29), `safety.phone-rings-while-driving`, `safety.setting-up-navigation`. Eski açıklamadaki "hands-free usually allowed" artık kaynaklı biçimde Bluetooth sorusunda. |
| tr3 | Emniyet kemeri kimin için zorunlu | `safety.seat-belts-for-everyone` (law, s1; artık bütün araç yollarında); ek olarak `safety.rear-belt-on-a-short-trip`, `safety.child-under-150-cm`, `safety.child-under-135-cm`, `safety.child-between-135-and-150-cm`, `safety.baby-on-a-lap`, `safety.seat-belt-penalty-points` |
| tr4 | Motosiklette zorunlu donanım: kask | `safety.helmet-rider-and-passenger` (law, s9 md. 58(3)); ek olarak `safety.helmet-on-a-small-moped`, `safety.helmet-on-an-atv`, `safety.helmet-on-an-e-moped` |

## İlgili ama bu dosyanın sahibi olmadığı eski öğeler

- `rw6` ve `public/scenarios.json` scenario-5 (ambulansa yol verme): kural sorusu soru ajanı 1'de, senaryo soru ajanı 4'te. Bu bankada sol trafiğe göre yazılmış karşılığı `safety.ambulance-behind-pull-left` ve `safety.fire-engine-before-a-blind-bend` (practice).
- scenario-15 (kazada 155): bu bankada `safety.injury-crash-112-and-155` 112 ve 155'i birlikte verir.
- `src/data/studyData.js`: "2 saniye / ıslakta 4 / buzda 10 saniye" bilgisi yalnız iki saniye ve "ıslakta en az iki katı" olarak, UK Highway Code rule 126 ve 227 kaynağıyla `secondary` etiketli alındı (`safety.two-second-gap`, `safety.gap-in-the-rain`). "Uyarı üçgeni 45 m geriye" KKTC'de doğrulanmadığı için sayısız yazıldı (`safety.warning-triangle-placement`). "112/155" bilgisi doğrulandı.
