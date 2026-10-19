# Eski senaryolardan yeni senaryo bankasına geçiş

Kaynak: `public/scenarios.json` (eski 15 senaryo). Hedef: `content/scenarios.json` (35 senaryo).
Gerekçeler `docs/research/kktc-regulations.md` bölüm 7.3'e dayanır. Eski senaryoların hepsi yeniden yazıldı; hiçbiri silinmedi.

Bütün senaryolarda ortak değişiklikler:

- Emoji görseller (`image`) kalktı. Gerekli yerde zorunlu listeden bir `signId` verildi.
- "Correct!", "Dangerous!" gibi ünlemli geri bildirimler kalktı. Her seçeneğin geri bildirimi nedenini anlatır.
- Her senaryo Türkçe ve İngilizce, `basis` etiketli ve kaynaklı. `practice` etiketli senaryolarda sayı yok.
- Doğru seçeneğin harfi a, b ve c arasında dengeli; doğru seçenek sistematik olarak en uzun seçenek değil.
- Eski `highway` kategorisi KKTC'de otoyol olmadığı için kalktı; bu senaryolar `rural` oldu.

| Eski id | Yeni id | Ne değişti |
|---|---|---|
| scenario-1 | `sc.children-near-school` | "30 km/sa'e düş" kalktı: KKTC'de yasal okul bölgesi sınırı bulunamadı. Doğru seçenek "sınırın epey altına düş, levha varsa ona uy". `practice`, levha `warning.children`. |
| scenario-2 | `sc.pedestrian-waiting-at-crossing` | Doğru cevap "durmaya hazır ol" yerine "dur ve yol ver" oldu; geçmeye hazırlanan yaya da kapsanır. `law`, s1. |
| scenario-3 | `sc.overtaking-slow-lorry` | "İki şeritli otoyol" yerine her yöne birer şeritli yol. Sollamanın sağdan yapıldığı ve sola ne zaman dönüleceği eklendi; "kamyonun solundan geç" çeldiricisi eklendi. `law`, s7 md. 2(b). |
| scenario-4 | `sc.heavy-rain-car-brakes` | "2 saniye / 4 saniye" sayıları kalktı (`practice`); "mesafeyi belirgin biçimde aç" dendi. ABS yanılgısı çeldirici oldu. |
| scenario-5 | `sc.ambulance-behind` | **Yanlıştı.** "Sağa çek ve dur" sağdan trafik kuralıdır. Doğru cevap artık "sola sinyal ver, güvenli olunca sola çek, yavaşla ya da dur"; "sağa çek" çeldirici oldu ve neden yanlış olduğu anlatılıyor. Hangi yana çekileceği mevzuatta yazılı olmadığı için `practice`. |
| scenario-6 | `sc.roundabout-car-circulating` | İçerik doğruydu. Çemberin saat yönünde dönüldüğü ve sola dönerek girildiği eklendi. `law`, s1, levha `mandatory.roundabout`. |
| scenario-7 | `sc.parking-uphill-kerb` | **Yanlıştı.** Eski cevap kaldırımı sağda varsayıyordu ve "arka tekerlek kaldırıma dayanır" diyordu. KKTC'de kaldırım solda: yokuş yukarı tekerlekler **sağa** çevrilir ve kaldırıma dayanan **ön** tekerlektir. Yokuş aşağı ve kaldırımsız durumlar açıklamaya eklendi. `practice`. |
| scenario-8 | `sc.tyre-blowout` | "100 km/sa" kalktı (`practice`, sayı yok); bölünmüş yolda sınıra yakın hız. Kenara çekme yönü sol olarak yazıldı. |
| scenario-9 | `sc.dense-fog` | "100 metreden az görüş" kalktı. KKTC'ye özgü sis farı kuralı bulunamadığı açıklamada belirtildi; arka sis lambasını kapatma uyarısı eklendi. |
| scenario-10 | `sc.brake-failure-downhill` | İçerik korundu; dörtlü flaşör ve kornayla uyarı, yokuş yukarı yan yol seçeneği eklendi. Levha `warning.steep-descent`. |
| scenario-11 | `sc.amber-light` | "50 km/sa, 20 metre" kalktı. KKTC ışık sırasının resmi metinde doğrulanamadığı belirtildi. Levha `warning.traffic-signals`. |
| scenario-12 | `sc.joining-dual-carriageway` | **KKTC'ye uymuyordu.** Otoyol giriş rampası yerine yan yoldan bölünmüş yola kısa katılma şeridiyle çıkış. Sol trafikte yoldaki araçların sağ arkadan geldiği, sağ omuz bakışı ve sol şeride katılma anlatılıyor. |
| scenario-13 | `sc.parallel-parking-left-kerb` | Kaldırım tarafı yazılmamıştı. Artık sol kaldırıma park: önce **sola**, sonra sağa kırılır. "45 derece" kalktı. Sağdan trafiğin hareketi (önce sağa kır) çeldirici oldu. |
| scenario-14 | `sc.aquaplaning` | İçerik korundu, iki dile çevrildi; önleme (yavaşla, diş derinliği) eklendi. |
| scenario-15 | `sc.crash-scene-injured` | **Eksikti.** Yalnız 155 deniyordu. Yaralı olduğu için doğru cevap "112 (ambulans) ve 155 (polis)". 199'un itfaiye olduğu bir çeldiricide anlatılıyor. `law`, s1. |

## Yeni senaryolar (20)

| Yeni id | Kategori | Konu |
|---|---|---|
| `sc.first-roundabout-on-the-left` | urban | Sağdan trafikten gelen sürücü için çember yönü (uluslararası öğrenci) |
| `sc.roundabout-first-exit` | urban | Çemberde ilk çıkış, sinyal ve konum |
| `sc.roundabout-later-exit` | urban | Çemberde yarım turdan ileri çıkış |
| `sc.lorry-at-roundabout` | urban | Çemberde iki şerit kullanan kamyonun yanında kalmamak (otomobil, motosiklet) |
| `sc.turning-right-across-traffic` | urban | Sağa dönüşte karşı trafiğe yol verme (uluslararası öğrenci), `secondary` s31 |
| `sc.keep-left-after-turning` | urban | Boş yolda dönüşten sonra sola girme (uluslararası öğrenci), `law` s7 |
| `sc.moto-passenger-without-helmet` | urban | Motosiklet: kasksız yolcu, `law` s9 |
| `sc.moto-gravel-on-bend` | rural | Motosiklet: virajda çakıl |
| `sc.moto-car-at-side-road` | urban | Motosiklet: yan yoldan çıkan otomobil |
| `sc.heavy-left-turn-cyclist` | urban | Ağır vasıta: sola dönüşte kör noktadaki bisikletli |
| `sc.heavy-mountain-descent` | rural | Ağır vasıta: Lefkoşa–Girne dağ yolunda iniş, `secondary` s27 |
| `sc.heavy-low-underpass` | rural | Ağır vasıta: yükseklik sınırı levhası |
| `sc.first-rain-after-summer` | weather | Kurak yazdan sonra ilk yağmurda kaygan yol |
| `sc.dazzled-at-night` | rural | Gece kamaşmada yolun sol kenarına bakmak |
| `sc.goats-on-village-road` | rural | Köy yolunda hayvan sürüsü |
| `sc.narrow-bridge-oncoming` | rural | Dar köprüde karşıdan gelene yol ver levhası |
| `sc.unmarked-crossroads` | urban | Kontrolsüz kavşakta sağdan gelene yol ver, `law` s1 |
| `sc.phone-rings-while-driving` | urban | Sürüşte telefon, `law` s1 |
| `sc.parking-at-bus-stop` | parking | Otobüs durağına park, `secondary` s31 |
| `sc.breakdown-on-dual-carriageway` | emergency | Bölünmüş yolda arıza, sol kenara çekme |

Toplam: 5 çember senaryosu, 3 uluslararası öğrenci senaryosu, 3 yalnız motosiklet, 3 yalnız ağır vasıta senaryosu.
