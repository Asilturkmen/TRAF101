# Test2Drive

KKTC (Kuzey Kıbrıs) ehliyet sınavına ücretsiz ve kayıtsız hazırlık sitesi. Türkçe ve İngilizce.

- Levhalar: KKTC'de kullanılan çekirdek set, kendi çizimimiz (CC0), her levhanın anlamı, ne yapılması gerektiği ve neyle karıştırıldığı.
- Konular: sınavın kapsadığı 17 konu, kaynak etiketli kısa okumalar.
- Çalış: günlük tekrar (Leitner kutuları), konu çalışması, Hatalarım, levha sınavı provası (bugünkü sözlü sınav gibi), senaryolar.
- Deneme sınavı: 2017 yönetmeliğindeki yazılı sınav biçimi (otomobil ve motosiklet 50 soru / 40 doğru / 60 dakika, ağır vasıta 100 / 80 / 120), sonuçlar sonda.
- İlerleme yalnız tarayıcıda saklanır. Backend, hesap ve çerez yoktur.

Proje, Doğu Akdeniz Üniversitesi TRAF101 Trafik Güvenliği dersinde Asil Türkmen ve Arda Günsüren tarafından başlatıldı. Test2Drive resmi bir kurum değildir.

## Komutlar

| Komut | Ne yapar |
|---|---|
| `npm install` | Bağımlılıkları kurar (Node 20 ya da üstü). |
| `npm run dev` | Geliştirme sunucusu, `http://localhost:5173`. |
| `npm run validate` | İçerik dosyalarını denetler. `validate:strict` yayın sayılarını da denetler. |
| `npm test` | Birim testleri (Vitest). |
| `npm run build` | Katı içerik denetimi, bütün sayfaların iki dilde önceden üretilmesi, sitemap, robots, OG görselleri ve service worker. Çıktı `dist/`. |
| `npm run preview` | `dist/` klasörünü statik bir barındırma gibi sunar, `http://localhost:4173`. |
| `npm run test:e2e` | Derlenmiş site üzerinde uçtan uca testler (Playwright). |

Kanonik adresler için derlemeden önce `VITE_SITE_URL` ayarlanır, örneğin `VITE_SITE_URL=https://ornek.com npm run build`. Ayarlanmazsa yer tutucu alan adı kullanılır ve derleme uyarı verir.

## Yapı

```
content/            bütün içerik (JSON): levhalar, sorular, senaryolar, dersler, rehber sayfaları, kaynaklar
public/signs/       levha çizimleri (SVG, CC0); scripts/signs/ üretir
src/router/table.js iki dilli adres tablosu (tek kaynak)
src/content/        içerik yükleyicileri ve otomatik levha soruları
src/lib/            tekrar sistemi, oturum kurucuları, depolama, metin yardımcıları
src/views/          sayfalar
scripts/            içerik denetimi, derleme sonrası işler, QA betikleri, statik sunucu
docs/               plan, tasarım sistemi, içerik şeması, araştırmalar, QA raporu, yayın rehberi
```

## İçerik ekleme

1. `docs/CONTENT-SCHEMA.md` dosyasını oku. Her soru, ders bölümü ve senaryo bir etiket taşır: `law` (yasada yazılı), `secondary` (ikincil kaynak) ya da `practice` (genel uygulama).
2. İlgili dosyaya ekle, örneğin yeni bir soru için `content/questions/rules.json`.
3. `npm run validate:strict` sıfır hata vermeli.
4. Kaynak yeni ise `content/sources/` altındaki bir dosyaya ekle.
5. Levha eklemek için `scripts/signs/signs.mjs` içine çizimi tanımla, `node scripts/signs/build-signs.mjs` çalıştır ve `content/signs/<kategori>.json` dosyasına veriyi ekle.

## Yayın

Herhangi bir statik barındırmada çalışır. Adımlar `docs/LAUNCH.md` içindedir.

## Lisans

- Kod: MIT.
- Levha çizimleri: CC0 1.0 (`public/signs/CREDITS.md`).
- Inter yazı tipi: SIL Open Font License 1.1.
