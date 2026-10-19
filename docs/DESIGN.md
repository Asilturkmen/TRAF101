# Tasarım sistemi ve yapım kuralları

Bu dosya Test2Drive'da yeni bir sayfa ya da bileşen yazmadan önce okunur. Karar K3 geçerlidir: mevcut tasarım korunur, yeni her şey bu sistemin devamıdır.

## Kaynaklar
- `src/style.css`: renk, gölge, köşe, boşluk ve geçiş token'ları; temel tipografi; `.btn`, `.card`, `grid-*` sınıfları.
- `src/styles/components.css`: iç sayfa hero'su (`.page-hero`), bölüm başlığı, çip, soru kartı ve şıklar, geri bildirim kutusu, sonuç kartı, durum blokları, kaynak satırı, levha kutucuğu. Bunlar eski Study ve Senaryo sayfalarından çıkarıldı.
- `src/styles/fonts.css`: Inter (yalnız Latin ve Latin Extended) ve ölçüsü eşlenmiş yedek yazı tipi.

## Renk
- Ana renk teal `--color-primary #377272`, gradyanlar `--gradient-primary` ve `--gradient-hero`.
- Metin olarak durum renkleri kullanılmaz; koyu karşılıkları kullanılır: `--color-success-text #1E7B45`, `--color-danger-text #C0392B`, `--color-accent-text #B85C0F`. Soluk metin `--color-text-muted #5F7682` (beyazda 4,77:1).
- Yeni renk eklenmez. Levha SVG'lerindeki renkler levha standardıdır ve sayfa renklerinden bağımsızdır.

## Yerleşim
- Telefon önce yazılır, masaüstü bozulmaz. Her ekran 390 ve 1440 piksel genişlikte denetlenir (`scripts/qa/shots.mjs`).
- İçerik genişliği: genel sayfalar 1200 piksel (`.page-wrap`), okuma sayfaları ve sorular 900 piksel.
- Telefonda yan boşluk 16 piksel. Dokunma hedefleri en az 44 piksel.

## İkonlar
- `lucide-vue-next`, çizgi kalınlığı varsayılan (2) ya da 1,75, `currentColor`. Düğmede 18-20, kart başlığında 24-48 piksel.
- Levha kategorileri için ikon kullanılmaz, gerçek levha çizimi kullanılır (`categoryIcon`).
- Emoji kullanılmaz.

## Metin
- Sayfaya özgü metin görünümün içinde `copy = { tr: {...}, en: {...} }` nesnesinde durur. Ortak arayüz metinleri `src/locales/*.json` içindedir.
- Türkçe "sen" diye konuşur, ünlem yoktur, başlık sonunda nokta yoktur. İngilizce İngiliz yazımıdır.
- AI-made izleri yasaktır: her başlıkta renkli vurgu kelimesi, küçük büyük harfli etiketler, uydurma istatistik, "Ready to start your journey" türü çağrılar, rozetler.
- Sayılar veriden gelir (`__CONTENT_STATS__`, içerik modülleri); elle sayı yazılmaz.

## Erişilebilirlik
- Tıklanabilir her şey `RouterLink`, `a` ya da `button`.
- Sorular `fieldset` + `legend` + gerçek radyo düğmeleriyle; geri bildirim `role="status"` bölgesinden duyurulur.
- Pencereler yerel `<dialog>` ile açılır (menü, onay pencereleri).
- Doğru ve yanlış renk, ikon ve yazıyla birlikte gösterilir.
- `npm run build` sonrası `node scripts/qa/a11y.mjs http://localhost:4173` sıfır ihlal vermelidir.

## Sayfa yazarken
1. Rota `src/router/table.js` içine iki dilde eklenir; görünüm `src/router/routes.js` içine bağlanır.
2. Görünüm `usePage({ title, description, alternates, noindex })` çağırır. `alternates` iki dilin adresini verir; dil düğmesi ve hreflang buradan beslenir.
3. localStorage'a bağlı her şey `onMounted` içinde ya da `ClientOnly` içinde okunur; önceden üretilen HTML ile istemci aynı kalmalıdır.
4. Bağlantılar `src/lib/paths.js` yardımcılarıyla kurulur; elle adres yazılmaz.
