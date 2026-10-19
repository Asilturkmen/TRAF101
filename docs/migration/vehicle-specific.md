# Eski araç türüne özgü sorulardan geçiş

Kaynak: `src/data/questions.js`. Hedef: `content/questions/moto.json` (28 soru, yalnız `moto` yolu) ve `content/questions/heavy.json` (47 soru, yalnız `heavy` yolu).
Eski sorular `licenseTypeIds` ile AB harflerine bağlıydı (A motosiklet, C kamyon, D otobüs, EH tehlikeli madde). Yeni yollar bugünkü KKTC sınıflarını kullanır: motosiklet J, H1, H2, H; ağır vasıta A otobüs, B ağır kamyon, C minibüs. EH sınıfı KKTC'de yoktur ve kalktı.

Bu tablo yalnız eski bankada yalnız motosiklet ya da yalnız ağır vasıta sınıflarına bağlı soruları kapsar. Aynı eski sorular `docs/migration/rules.md` ve diğer geçiş dosyalarında ortak bankaya da eşlenmiş olabilir; burada yalnız `moto.json` ve `heavy.json` içindeki karşılıkları yazar.

| Eski id | Eski sınıflar | Yeni id | Not |
|---|---|---|---|
| s6 | C, D, EH | (bkz. `rules.sign-no-goods-vehicles`), `heavy.height-limit-sign`, `heavy.weight-limit-sign` | "Kırmızı çizgili kamyon" tanıma sorusu rules.json'da davranış sorusu oldu. Ağır vasıta dosyasında aynı fikir zorunlu listedeki yükseklik ve ağırlık levhalarıyla davranış sorusu olarak sürdü. Yanlış sınıf harfleri kalktı. |
| sp2 | B, A | `moto.speed-village-road`, `moto.speed-built-up-area` (bkz. `rules.speed-moto-dual-carriageway`, `rules.speed-moto-first-class`) | Motosiklet sınırı her yol sınıfında otomobilden farklı. Bölünmüş ve birinci sınıf yol rules.json'da; köy yolu (60) ve yerleşim yeri (50) burada. |
| sp3 | C, D, EH | `heavy.drawbar-trailer-speed`, `heavy.bus-speed-second-class-road`, `heavy.truck-speed-second-class-road`, `heavy.truck-speed-village-road`, `heavy.bus-speed-village-road`, `heavy.tipper-speed-dual-carriageway`, `heavy.mountain-road-limit`, `heavy.built-up-area-limit` (bkz. `rules.speed-lorry-dual-carriageway`, `rules.speed-bus-dual-carriageway`) | "Ağır vasıta 75" kısmen yanlıştı: kamyon 75, otobüs ve minibüs 80, tam römorklu çekici 65. Tablonun geri kalanı araç ve yol sınıfına göre ayrı sorular oldu. `secondary`, s27. |
| sp8 | C, EH | `heavy.towing-broken-down-vehicle` | Römork çekme sınırı KKTC'de bulunamadı. Yerine doğrulanmış "arızalı araç çekme" sınırı: bölünmüş yolda 50 km/sa (`secondary`, s27). Yerleşim yerindeki 25 km/sa rules.json'dadır. |
| tr4 | A | `moto.child-passenger` (bkz. `safety.helmet-rider-and-passenger`, `safety.helmet-on-a-small-moped`, `safety.helmet-on-an-e-moped`) | Kask kuralı (sürücü ve yolcu, her motor hacmi) safety.json'da bütün yollar için var. Motosiklet dosyasında tekrar edilmedi; mopette çocuk yolcu (Tüzük md. 58(2)) ve kask konusu `sc.moto-passenger-without-helmet` senaryosunda işlendi. |
| tr5 | hepsi (EH dahil) | `heavy.beer-before-bus-shift`, `heavy.morning-after-drinking` (bkz. `personal.alcohol-public-transport`) | "Profesyoneller için genellikle sıfır" belirsizdi. Yasaya göre kamu taşımacılığı yapan şoförler için sınır sıfır (`law`, s8 md. 2). Ağır vasıta dosyasında bu kural iki uygulamalı soruyla işlendi. |
| dd2 | hepsi | `heavy.drowsy-medicine` (bkz. `personal.fatigue-law`, `personal.fatigue-signs`, `personal.fatigue-remedy`) | Yorgunluk soruları personal.json'da bütün yollar için var; ağır vasıta dosyasında tekrar edilmedi. |
| dd4 | C, D, EH | silindi | 4,5 saat sürüş / 45 dakika mola kuralı AB/AETR kuralıdır, KKTC mevzuatında bulunamadı. Takograf ya da sürüş süresi kuralı KKTC yasası gibi yazılmadı. Yerine yorgunluk yasası (Yasa md. 10) ve yorgunluk belirtileri ortak bankada. |
| dd7 | EH | silindi | Tehlikeli yük belgelerinin yangına dayanıklı kılıfta tutulması ADR/ABD uygulamasıdır ve EH sınıfı KKTC'de yoktur. Tehlikeli madde yalnız hız bildirisindeki araç türü olarak geçer (bkz. `rules.speed-dangerous-goods-town`). |

## Yeni sorular

`moto.json` ve `heavy.json`'daki diğer sorular eski bankada karşılığı olmayan yeni sorulardır: sınıf tanımları ve kapsamı (J, H1, H2, H; A, B, C, D), motosiklet temel kursu (Tüzük md. 29(7)), e-moped ehliyet sınırı (s39), ağır sınıflar için yönetmelikteki yazılı sınav biçimi (s3 md. 13, henüz uygulanmıyor), şeritte konum, görünürlük, koruyucu giysi, frenleme, yolcu taşıma, viraj, kör noktalar, arka çıkıntı savrulması, arka tekerleklerin köşeyi kesmesi, yük bağlama, devrilme, motor freni ve fren yorulması, otobüs yolcularının güvenliği, bisikletli ve motosikletliyi sollama, yan rüzgâr, araç denetimi, yangın söndürücü (s38) ve hava basıncı uyarısı.

Tekrarı önlemek için rules.json, safety.json ve personal.json'da aynı yol için zaten bulunan bilgiler (motosiklet kask kuralı, e-scooter yaşı ve yolları, J ve H sınıfları, motosiklet bölünmüş yol sınırı, A ve C sınıfları, kamyon ve otobüs bölünmüş yol sınırları, tehlikeli madde yerleşim yeri sınırı, kamu taşımacılığında sıfır alkol, yorgunluk yasası ve belirtileri, yük taşıtı giremez levhası) bu iki dosyada yeniden sorulmadı.
