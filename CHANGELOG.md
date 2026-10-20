# Sürüm notları

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
