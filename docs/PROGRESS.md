# İlerleme

Plan: `docs/PLAN.md`. Branch: `dev` (main'e dokunulmadı). Uygulama 2026-10-20 gecesi, Claude product manager rolünde, alt ajanlardan oluşan bir ekiple yaptı.

## Durum özeti

| Faz | Durum | Not |
|---|---|---|
| F0 Hazırlık | Tamam | DESIGN.md, PROGRESS.md, inventory-map.md, test altyapısı, CI, ölü kod temizliği |
| F1 Altyapı | Tamam | vite-ssg, vue-i18n, rota tablosu, içerik şeması ve doğrulayıcı, kabuk, durum bileşenleri, depolama |
| F2 İçerik | Tamam | 89 levha, 367 yazılı + 89 otomatik levha sorusu, 35 senaryo, 17 ders, 6 rehber sayfası, 60 terim |
| F3 Öğrenme motoru | Tamam | Bugünkü tekrar, konu çalışması, Hatalarım, levha sınavı provası, yazılı sınav provası, senaryolar, ilerleme |
| F4 Sayfalar | Tamam | Ana sayfa, levhalar, konular, çalış merkezi, deneme seçimi, rehberler, kaynaklar, 404 |
| F5 Arama motoru ve çevrimdışı | Tamam | hreflang, canonical, JSON-LD, sitemap, robots, 298 OG görseli, manifest, service worker |
| F6 QA ve inceleme | Tamam | Ölçümler `docs/QA-REPORT.md` içinde |
| F7 Teslim | Tamam | README, LAUNCH.md, sürüm etiketi |

## Ekip

| Ajan | İş | Sonuç |
|---|---|---|
| Araştırma (4) | KKTC mevzuatı, levha lisansları, ürün karşılaştırması, mevcut site denetimi | `docs/research/` |
| Levha | Çekirdek KKTC levha seti, üretici betik | 89 SVG, CC0 |
| Soru 1 | Trafik kuralları | 117 soru |
| Soru 2 | Güvenlik ve davranış | 91 soru |
| Soru 3 | Araç, çevre, kişisel durum, ilk yardım | 84 soru |
| Soru 4 | Motosiklet, ağır vasıta, senaryolar | 28 + 47 soru, 35 senaryo |
| Ders | 17 konu sayfası | `content/lessons/` |
| Rehber | 6 rehber sayfası, terim sözlüğü, doğrulama listesi, envanter eşlemesi | `content/pages/`, `docs/` |
| Dil editörü | TR ve EN dil kontrolü (F2.7) | |
| Bağımsız inceleme | Codex, çekirdek kod | `docs/QA-REPORT.md` |

## Varsayımlar ve plan içi kararlar

- **Levha adresleri iç içe:** plan `/levhalar/dur/` yazıyordu; kategori ve levha adları çakışmasın diye `/levhalar/<kategori>/<levha>/` kullanıldı (örnek `/levhalar/oncelik/dur/`).
- **Levha tanıma soruları otomatik:** "Bu levha ne anlama gelir?" soruları levha verisinden üretiliyor; böylece levha sayfası ile soru asla farklı resim ya da anlam göstermiyor. Bunlar "kurallar ve levhalar" havuzuna sayıldı; yazılı kural sorusu hedefi 70 iken 117 oldu.
- **Ağır vasıta konu dağılımı:** yönetmelik yalnız otomobil dağılımını veriyor; ağır vasıta denemesi bu dağılımın iki katıyla kuruldu ve sayfada "Test2Drive tarafından belirlendi" diye yazıyor.
- **Ana sayfadaki "Levhalara göz at" bölümü:** hero'daki kategori kartları bu işi gördüğü için ayrı bölüm eklenmedi; kartlar artık gerçek kategori sayfalarına bağlı ve bir "Tüm levhalar" kartı var.
- **Senaryo görselleri:** emoji yerine isteğe bağlı levha çizimi kullanılıyor; levhası olmayan senaryolar yalnız metinle gösteriliyor.
- **Hata bildir:** alt bilgi deponun GitHub issue sayfasına bağlanıyor (A4 varsayılanı).
- **Deneme süresi:** sekme arka plandayken süre işlemiyor; kapatılan sınav kaldığı süreden devam ediyor.
- **DAÜ logosu:** izin gelene kadar yayından kaldırıldı, `docs/assets/emu-logo.png` içinde saklanıyor.

## Bilinçli olarak yapılmayanlar (v1.1, plan bölüm 9)

Kalan yaklaşık 110 levha, yol çizgileri, trafik ışıkları, polis işaretleri, "emin değildim" seçeneği, soru başına hata bildirimi, yazdırılabilir levha listesi.

## Senin için açık konular

`docs/LAUNCH.md` bölüm 4: alan adı, DAÜ logosu izni, hata bildirme kanalı, isteğe bağlı sürücü kursu doğrulaması (`docs/verification-checklist.md`).
