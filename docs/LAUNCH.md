# Yayına alma rehberi

Barındırma yeri henüz seçilmedi (K6). Site statik bir klasördür (`dist/`); aşağıdaki adımlar her barındırma için geçerlidir.

## 1. Alan adı ve derleme

1. Alan adını seç, örneğin `test2drive.example` yerine gerçek adres.
2. Derlemeyi bu adresle yap:

```bash
VITE_SITE_URL=https://GERCEK-ADRES npm run build
```

Bu adres canonical, hreflang, sitemap, robots ve OG görsel adreslerine yazılır. Adres değişirse yeniden derlenir.

## 2. Barındırma ayarları

| Ayar | Değer |
|---|---|
| Yayın klasörü | `dist` |
| Derleme komutu | `npm run build` (CI ile derlenip `dist` yüklenebilir) |
| 404 sayfası | `/404.html`, durum kodu 404 |
| Sonda eğik çizgi | Adresler `/` ile biter; `/levhalar` isteği `/levhalar/` adresine 301 ile yönlenmeli |
| Önbellek | `/assets/*` için `Cache-Control: public, max-age=31536000, immutable`; HTML, `sw.js` ve `manifest.webmanifest` için `no-cache` |
| HTTPS | Zorunlu (service worker yalnız HTTPS'te çalışır) |

Eski ders sürümünün adresleri (`/study`, `/quiz`, `/scenarios`, `/history`, `/results`) 404 sayfası üzerinden uygulama içinde yeni adreslere yönlenir. Barındırma sunucu tarafı yönlendirme destekliyorsa şu kurallar da eklenebilir:

```
/study        /levhalar/       301
/study/*      /levhalar/       301
/quiz         /deneme-sinavi/  301
/quiz/*       /deneme-sinavi/  301
/results      /deneme-sinavi/  301
/scenarios    /senaryolar/     301
/history      /ilerleme/       301
```

### Seçeneklere göre notlar
- **Kendi VDS + Cloudflare:** nginx'te `root /…/dist; try_files $uri $uri/ =404; error_page 404 /404.html;`. Cloudflare'de HTML önbelleklemesini kapalı tut ya da yayından sonra purge et.
- **Cloudflare Pages:** derleme komutu `npm run build`, çıktı `dist`. `404.html` kendiliğinden kullanılır. Yönlendirmeler için `dist/_redirects` dosyası yukarıdaki kurallarla eklenebilir.
- **GitHub Pages:** `dist` klasörünü yayınla; `404.html` desteklenir. Sunucu tarafı yönlendirme yoktur, uygulama içi yönlendirme yeterlidir.

## 3. Yayından sonra kontrol

```bash
curl -sI https://GERCEK-ADRES/levhalar/ | head -1        # 200
curl -sI https://GERCEK-ADRES/olmayan-sayfa/ | head -1   # 404
curl -s https://GERCEK-ADRES/sitemap.xml | head -5
```

- Google Search Console'a alan adını ekle ve `sitemap.xml` gönder.
- Bir levha sayfasının bağlantısını WhatsApp'ta paylaşıp OG görselinin çıktığını gör.
- Telefonda siteyi aç, ana ekrana ekle, uçak moduna alıp çalışmaya devam edebildiğini gör.

## 4. Senden beklenenler (yayını durdurmaz)

| Konu | Durum |
|---|---|
| Alan adı | Bekleniyor |
| Doğrulanamayan kurallar | `docs/verification-checklist.md`; bir sürücü kursuna sorulursa içerik `law` etiketine geçer |
| Analitik | v1.0'da yok (K14) |
