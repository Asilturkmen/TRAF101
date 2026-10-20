# Sürüm notları

## Yayınlanmamış

- README artık siteyi ekran görüntüleriyle tanıtıyor. Komutlar ve yapı bilgisi docs/DEVELOPMENT.md'ye taşındı.
- Footer'da her sayfada "Hazırlayanlar: Asil Türkmen ve Arda Günsüren" satırı. Adlar asilturkmen.com ve ardagunsuren.com'a bağlı; Hakkında sayfasında da öyle.
- İçerik metinlerinde https bağlantısı yazılabiliyor: [metin](https://...).

## 1.1.0 (2026-10-20)

Planın 9. bölümündeki bütün v1.1 işleri.

**Yeni içerik**
- 125 yeni çizim: toplam 214. Uyarı 58, öncelik 8, yasak ve kısıtlama 47, mecburiyet 20, bilgi 36, ek levhalar 16, yol çizgileri 15, trafik ışıkları 7, polis işaretleri 7. Hepsi kendi çizimimiz, CC0.
- İki yeni ders: "Yol çizgileri, ışıklar ve polis işaretleri" ve 6 çizimli "Çember rehberi". Konu sayısı 19.
- 48 yeni yazılı soru (toplam 415) ve yeni levhalardan otomatik sorular.
- Kaynaklar güçlendirildi: 16/2025 sayılı yasaya ekli resmi ceza cetveli ve 10/2022 Yol Güvenliği Yasası kaynak olarak eklendi. Yasaya dayanan soru oranı yüzde 18'den 36'ya çıktı. Uyarı üçgeni ve ilk yardım çantasının zorunlu olduğu düzeltildi.

**Yeni özellikler**
- "Emin değilim" seçeneği: tahminle doğru bilinen soru tekrar sisteminde ilerlemez.
- Her sorunun altında "Bu soruda hata var" bağlantısı (soru kimliği dolu GitHub issue).
- Terim sözlüğü sayfası ve yazdırılabilir levha listesi.
- İlerleme sayfasında son 7 ve 30 günde kaç gün çalışıldığı.
- Deneme sınavında levha tanıma soruları "kurallar ve levhalar" bölümünün en çok yüzde 40'ı; nadir levhalar dışarıda.

**Kalite**
- Uçtan uca testler iPhone (WebKit) profilinde de çalışıyor.

## 1.0.0 (2026-10-20)

Ders projesi demosundan herkese açık ürüne geçiş. Plan: `docs/PLAN.md`, ölçümler: `docs/QA-REPORT.md`.

**Ürün**
- Türkçe (`/`) ve İngilizce (`/en/`) eksiksiz; her sayfa önceden üretilmiş HTML.
- 89 levhalık KKTC çekirdek seti, kendi çizimimiz ve CC0 lisanslı; her levhanın kendi sayfası.
- 17 konu sayfası, 6 rehber sayfası (sınav nasıl yapılır, ehliyet nasıl alınır, soldan trafik, kaynaklar, hakkında, gizlilik).
- 367 yazılı soru ve levha verisinden üretilen 89 soru, 35 senaryo; her öğe kaynak etiketli.
- Bugünkü tekrar (Leitner kutuları), konu çalışması, Hatalarım, levha sınavı provası, süreli yazılı sınav provası (otomobil, motosiklet, ağır vasıta), sonuç ve ilerleme sayfaları, dışa ve içe aktarma.
- Araç yolları: KKTC'nin bugünkü sınıf harfleri ve yeni sistemdeki karşılıkları.
- Çevrimdışı çalışma, uygulama olarak ana ekrana ekleme.

**Kaldırılanlar**
- Güney Kıbrıs'a ait, izinsiz kullanılan levha görselleri.
- Uydurma istatistikler ve rozetler, çalışmayan düğmeler, boş geçmiş sayfası, bozuk sınıf seçimi.
- Sol trafikte yanlış ya da KKTC'de karşılığı olmayan içerik (ayrıntı `docs/migration/`).

**Kalite**
- 31 birim, 32 uçtan uca test; axe ile 0 erişilebilirlik ihlali; 0 kırık bağlantı; içerik sayfalarında yavaşlatılmış telefonda LCP 1 saniyenin altında.
