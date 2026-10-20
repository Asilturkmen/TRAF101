# QA raporu (v1.1.0)

Ölçüm tarihi: 2026-10-20. Ölçümler yayın derlemesi (`npm run build`) üzerinde, yerel statik sunucuyla (`npm run preview`), Microsoft Edge (Chromium) ve Playwright WebKit ile alındı. Yerel sunucu, her gerçek statik barındırma gibi metin dosyalarını gzip ile sıkıştırarak gönderir.

## v1.1 özeti

| Kapı | Hedef | Sonuç |
|---|---|---|
| İçerik doğrulama (katı) | hatasız | 0 hata: 214 levha, 415 yazılı soru, 35 senaryo, 19 ders |
| Birim testleri (Vitest) | hepsi geçer | 33 / 33 |
| Uçtan uca testler: masaüstü Edge, telefon Edge, iPhone 13 WebKit | hepsi geçer | 48 geçti, 6 bilinçli atlandı |
| axe erişilebilirlik, 28 sayfa × 390 ve 1440 piksel, açık menü ve cevaplanmış soru dahil | 0 | 0 ihlal |
| Kırık iç bağlantı (568 sayfa) | 0 | 0 |
| hreflang karşılıklılığı | iki yönlü | 512 sayfa, 0 hata |
| Yana kayma (360, 390, 430 piksel; WebKit dahil) | yok | yok |
| Dış istek | 0 | 0 |
| CLS | yaklaşık 0 | en yüksek 0,009 |
| LCP, yavaş 4G + 4 kat yavaş işlemci, telefon | 2,5 sn altı | İçerik sayfaları 0,5-1,1 sn. Kişiye özel uygulama ekranları 0,5-2,7 sn (aşağıda) |

### LCP tablosu (v1.1, sıkıştırmalı)

| Sayfa | LCP |
|---|---|
| `/` | 0,80-1,08 sn |
| `/en/` | 0,68 sn |
| `/levhalar/` | 0,58 sn |
| `/levhalar/oncelik/dur/` | 0,81 sn |
| `/levhalar/yol-cizgileri/` | 0,54 sn |
| `/konular/cember-rehberi/` | 0,66 sn |
| `/terimler/` | 0,59 sn |
| `/calis/`, `/deneme-sinavi/`, `/ilerleme/` | 0,50-0,58 sn |
| `/deneme-sinavi/otomobil/` | 0,50-0,52 sn |
| `/senaryolar/` | 0,51 sn |
| `/calis/bugun/` | 0,51-2,69 sn |
| `/calis/levha-sinavi/` | 0,49-2,31 sn |
| `/hatalarim/` | 2,61-2,65 sn |

Kişiye özel ekranlar, kartlarını sayfa tarayıcıda canlandıktan (hidrasyon) sonra çizer. Kart, sayfa başlığından büyükse LCP o ana kayar. Bu yüzden aynı sayfada ölçümler 0,5 ile 2,7 saniye arasında değişiyor. 2,6 saniye, yavaşlatılmış işlemcide uygulamanın canlanma süresinin tabanıdır. Bu ekranlar arama motoruna kapalıdır ve ikinci ziyarette önbellekten açılır.

**Ölçüm düzeltmesi:** v1.0 raporundaki 3,2-4,6 saniyelik uygulama ekranı değerleri sıkıştırmasız yerel sunucuyla alınmıştı. Gerçek barındırmalar dosyaları sıkıştırdığı için o değerler fazla kötümserdi. v1.1'de test sunucusu da sıkıştırıyor.

**Boyutlar:** `dist/` 75 MB; bunun büyük kısmı 512 sayfanın OG paylaşım görselleri. Çevrimdışı önbellek 2,9 MB.

---

# v1.0.0 ölçümleri (tarihçe)

## Özet: plan bölüm 10'daki kapılar

| Kapı | Hedef | Sonuç |
|---|---|---|
| İçerik doğrulama (katı) | hatasız | 0 hata, 0 uyarı |
| Birim testleri (Vitest) | hepsi geçer | 31 / 31 |
| Uçtan uca testler (Playwright, masaüstü + telefon) | hepsi geçer | 32 geçti, 4 bilinçli atlandı (yalnız tek ekran boyutunda anlamlı olanlar) |
| axe erişilebilirlik (WCAG 2.2 AA etiketleri), 20 sayfa × 390 ve 1440 piksel, açık menü ve cevaplanmış soru dahil | 0 | 0 ihlal |
| Kırık iç bağlantı (298 sayfa) | 0 | 0 |
| hreflang karşılıklılığı | her sayfa iki yönlü | 246 sayfa, 0 hata |
| Konsol hatası | 0 | 0 (404 sayfasındaki beklenen 404 yanıtı dışında) |
| Hidrasyon uyumsuzluğu | 0 | 0 (14 sayfa × 2 tarayıcı dili, ayrıntı bayrağı açık derlemeyle) |
| Yana kayma (360, 390, 430 piksel) | yok | 21 sayfada yok |
| Dış istek | 0 | 0 (yazı tipi ve levhalar yerel) |
| CLS | yaklaşık 0 | en yüksek 0,036 |
| LCP, yavaşlatılmış telefon | 2,5 sn altı | İçerik sayfalarında 0,53-1,06 sn. Kişiye özel uygulama ekranlarında 3,2-4,6 sn (aşağıda) |
| JavaScript kapalıyken içerik | okunur | Levha, konu, rehber ve ana sayfalar önceden üretilmiş HTML olarak okunuyor |
| Türkçe büyük harf | hatasız | Tek büyük harfli satır alt bilgi başlıkları; marka `lang="en"` ile korunuyor |

## Performans

Koşullar: 390 piksel telefon, DPR 2, yavaş 4G (150 ms gecikme, 1,6 Mbps), 4 kat işlemci yavaşlatma, soğuk önbellek. Komut: `node scripts/qa/perf.mjs http://localhost:4173`.

| Sayfa | LCP | CLS |
|---|---|---|
| `/` | 0,86 sn | 0,000 |
| `/en/` | 0,64 sn | 0,036 |
| `/levhalar/` | 0,59 sn | 0,000 |
| `/levhalar/oncelik/dur/` | 1,06 sn | 0,000 |
| `/konular/oncelik-kurallari/` | 0,63 sn | 0,000 |
| `/sinav-nasil-yapilir/` | 0,64 sn | 0,000 |
| `/calis/` | 0,56 sn | 0,000 |
| `/deneme-sinavi/` | 0,60 sn | 0,009 |
| `/ilerleme/` | 0,56 sn | 0,000 |
| `/deneme-sinavi/otomobil/` | 0,53 sn | 0,000 |
| `/calis/levha-sinavi/` | 3,19 sn | 0,000 |
| `/senaryolar/` | 3,57 sn | 0,000 |
| `/hatalarim/` | 4,43 sn | 0,000 |
| `/calis/bugun/` | 4,60 sn | 0,000 |

**Uygulama ekranları neden daha yavaş:** Bugünkü tekrar, Hatalarım, levha provası ve senaryolar, tarayıcıdaki ilerlemeye göre kişiye özel bir tur kurar. Bu yüzden önceden üretilemezler. Sayfanın başlığı ve açıklaması 0,6 saniyede görünür, soru kartı ise soru bankası indirilip işlenince çizilir. Bu ekranlar arama motoruna kapalıdır (`noindex`). İkinci ziyaretten sonra service worker önbelleği devreye girer ve ağ beklemesi kalkar. Yapılan iyileştirmeler:

| Adım | Etki |
|---|---|
| vite-ssg `hydration: true` (önceden sayfa tarayıcıda baştan çiziliyordu) | İçerik sayfalarında LCP 4-7 sn'den 0,5-1 sn'ye |
| Soru bankası dil başına ayrı ve isteğe bağlı | 117 KB'tan 60-62 KB'a (gzip) |
| Veri parçaları HTML'de önceden yükleniyor | Tekrar ekranında yaklaşık 1,5 sn kazanç |
| Uygulama paketi levha ve ders verisi taşımıyor | 112 KB'tan 86 KB'a (gzip) |
| Inter yalnız Latin-1 ve 5 Türkçe harf | 133 KB'tan 51 KB'a |
| Ölçüsü eşlenmiş yedek yazı tipi, ayrılmış alanlar | CLS 0,3'ten 0'a |

v1.1 için öneri: ilk soruyu soru bankasından bağımsız küçük bir "ilk tur" dosyasıyla açmak, ve HTTP/2 destekleyen bir barındırmada küçük parçaları birleştirmek.

**Paket boyutları (gzip):** uygulama 86,6 KB · soru bankası TR 62,1 KB, EN 59,7 KB · levha verisi 26,3 KB · senaryolar 23,7 KB · ders ve rehber metinleri 63,1 KB · yazı tipi 48,3 KB + 3 KB. Çevrimdışı önbellek 2,3 MB. `dist/` toplamı 38 MB; bunun 29 MB'ı 246 OG görseli.

## Erişilebilirlik

Komut: `node scripts/qa/a11y.mjs http://localhost:4173`. axe-core, WCAG 2.0/2.1/2.2 A ve AA kuralları, 390 ve 1440 piksel. Elle kontrol edilen ve uçtan uca testlerle bağlanan davranışlar:
- Sorular `fieldset` + `legend` + gerçek radyo düğmeleriyle; klavyeyle Space ve Enter ile cevaplanıyor (test: "keyboard can answer a question").
- Geri bildirim canlı bölgeden duyuruluyor. Odak bir sonraki soruya, tur sonunda sonuç başlığına, levha provasında açılan cevaba taşınıyor.
- Telefon menüsü ve onay pencereleri yerel `<dialog>`; Escape ile kapanıyor ve odak açan düğmeye dönüyor.
- Sayaç `role="timer"` ile okunabiliyor; 10, 5 ve 1 dakika kala duyuruluyor. Süre uzatılabiliyor ya da kapatılabiliyor (WCAG 2.2.1).
- `prefers-reduced-motion` desteği, görünür odak çerçevesi, sayfa başına atlama bağlantısı, en az 44 piksel dokunma hedefleri.

## Bağımsız inceleme

- **Codex, 1. tur (çekirdek kod, 3.300 satır):** 19 bulgu. Hepsi kodla karşılaştırılarak doğrulandı ve düzeltildi. Başlıcaları: bozuk yedek dosyasının ilerlemeyi bozması, iki sekmenin birbirini ezmesi, başka araç için açılan denemenin yarım sınavı silmesi, içerik güncellemesinin eski puanı değiştirmesi, aynı bileşeni kullanan sayfalar arasında eski oturumun kalması, dil düğmesinin önceden üretilen HTML'de yanlış adrese gitmesi, çevrimdışı yedek sayfanın bulunamaması.
- **Codex, 2. tur (sayfa şablonları, SEO):** 2 küçük bulgu (arama sonucu canlı bölgesi, İngilizce kalan içerik haritası etiketi), düzeltildi.
- **Dil editörü ajanı:** bütün içerik TR ve EN olarak baştan sona okundu; terim tutarlılığı, İngiliz yazımı, "sen" hitabı, AI-made kalıplar.
- **Olgu denetimi ajanı:** dil editörünün işaretlediği 10 olgu kaynaklara karşı kontrol edildi: 8 düzeltme, 1 doğru, 1 sayının kaldırılması.

## Bilinen sınırlar

- Uygulama ekranlarındaki LCP (yukarıda).
- `VITE_SITE_URL` yayından önce ayarlanmalı; aksi halde canonical ve sitemap yer tutucu alan adını kullanır (`docs/LAUNCH.md`).
- Doğrulanamayan kurallar "Genel uygulama" etiketiyle yayında; liste `docs/verification-checklist.md`.
- Levha setinin KKTC karşılığı, kaynaklarda kuzeyde görüldüğü belgelenenler dışında "muhtemel" olarak işaretli; her levha sayfası bunu söylüyor.
