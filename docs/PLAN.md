# Test2Drive: production planı

Bu dosya, Test2Drive'ı ders projesi demosundan herkese açık, güvenilir bir ürüne taşımanın tek kaynağıdır. Planı uygulayan oturum bu dosyayı baştan sona okur, işaretli kutularla ilerler ve ilerlemeyi `docs/PROGRESS.md` dosyasına yazar.

- **Hazırlayan:** Claude (product manager rolünde), 2026-10-20
- **Sahip:** Asil Türkmen
- **Araştırma kaynakları:** `docs/research/` altındaki dört rapor. Plan bunlara dayanır; bir ayrıntı plana girmediyse rapordan okunur.
  - `kktc-regulations.md`: KKTC sınavı, ehliyet sınıfları, kurallar, acil numaralar, içerik hataları
  - `road-signs.md`: levha sisteminin yasal dayanağı, lisans durumu, kapsam karşılaştırması, SVG kuralları ve veri şeması
  - `benchmark.md`: 17 ürünün karşılaştırması, öğrenme modeli, iki dilli statik mimari, bilgi mimarisi
  - `current-site-audit.md`: doğrulanmış hatalar, erişilebilirlik, SEO, eksiksiz envanter, korunacaklar listesi

---

## 0. Kararlar

Bu tablodaki kararlar kapalıdır. Uygulayan oturum bunları yeniden tartışmaz.

| # | Konu | Karar | Tarih |
|---|---|---|---|
| K1 | Mimari | Statik site kalır. Backend, veritabanı ve giriş sistemi yok. İlerleme yalnız tarayıcıda (localStorage) tutulur. | 2026-10-20 |
| K2 | Diller | Türkçe ve İngilizce, eksiksiz eşlik. Türkçe varsayılan ve `/` adresinde, İngilizce `/en/` altında. | 2026-10-20 |
| K3 | Tasarım | Mevcut tasarım korunur: teal paleti, Inter, kartlar, hero ve bölüm düzenleri. Yeni her şey bu sistemin devamıdır. Yeni palet, yazı tipi ya da yerleşim önerilmez. | 2026-10-20 |
| K4 | Ürün adı | Test2Drive. "TRNC Driving Safety" ve "Traffic School" ürün adı olarak her yerden kalkar. | 2026-10-20 |
| K5 | Ders ve ekip bilgisi | Yalnız Hakkında sayfasında durur, alt bilgiden kalkar. Öğrenci numaraları yayınlanmaz. | 2026-10-20 |
| K6 | Yayın yeri | Sonraya bırakıldı. Çıktı her statik barındırmada çalışacak biçimde üretilir. | 2026-10-20 |
| K7 | Sınav modeli | İki mod birden. **Levha sınavı provası** bugünkü sözlü sınavı taklit eder. **Yazılı sınav provası** yönetmelikteki biçimi kullanır ve "yönetmelikte tanımlı, henüz uygulanmıyor" etiketi taşır. | 2026-10-20 |
| K8 | Ehliyet sınıfları | Kullanıcı harf yerine araç seçer: Otomobil, Motosiklet, Ağır vasıta. Her kartta bugünkü KKTC harfi ve yeni sistemdeki karşılığı yazar. EH kalkar. | 2026-10-20 |
| K9 | Levha seti | v1.0 çekirdek setle çıkar, yaklaşık 90 levha. Kalan levhalar, yol çizgileri, trafik ışıkları ve polis işaretleri v1.1 olarak planlıdır (bölüm 9). | 2026-10-20 |
| K10 | İkonlar | Emojiler, mevcut ok ikonuyla aynı kalınlıkta çizgi ikonlarla değişir. Levha kategorilerinde gerçek levha biçimleri kullanılır. Yerler, renkler ve düzen değişmez. | 2026-10-20 |
| K11 | Doğrulanamayan kurallar | Mantıklı olan "Genel uygulama" etiketiyle yayınlanır. Kaynaklar arasında çelişen bilgi yayınlanmaz (bölüm 5.1). | 2026-10-20 |
| K12 | Git | Tüm iş `dev` branch'ında. `dev`'e commit ve push serbest. `main`'e asla merge, rebase ya da push yapılmaz. | 2026-10-20 |
| K13 | Teknoloji | Vue 3 + Vite kalır. Üzerine vite-ssg ile sayfaların önceden üretilmesi, vue-i18n ve vite-plugin-pwa eklenir. Astro'ya geçilmez, çünkü mevcut tasarım ve bileşenler Vue'da. | 2026-10-20, PM kararı |
| K14 | Analitik | v1.0'da yok. Gizlilik sayfası "cevapların hiçbir sunucuya gitmez" der. Barındırma seçilince çerezsiz bir seçenek ayrıca değerlendirilir. | 2026-10-20, PM kararı |

---

## 1. Değişmez kurallar

Uygulayan her oturum ve her ajan bu kurallara uyar.

1. **Bilgi ve özellik sessizce silinmez.** Mevcut sitedeki her öğenin yeni yeri `docs/inventory-map.md` dosyasında eşlenir (iş paketi F0.2). Bir öğe kalkacaksa gerekçesi o dosyada yazar.
2. **Yalnız gerçek içerik.** Uydurma sayı, rozet, kullanıcı yorumu ya da istatistik yok. Sayılar veriden derlenir: "15 senaryo" yazıyorsa veride 15 senaryo vardır.
3. **Her kural bir kaynağa ya da açık bir etikete bağlıdır.** İçerik politikası bölüm 5.1'dedir.
4. **Tasarım korunur (K3).** Yeni bileşenler mevcut token'ları, `.card`, `.btn`, `grid-*` sınıflarını ve mevcut geçişleri kullanır. Renk eklemek gerekirse yalnız bölüm 7.2'deki erişilebilirlik token'ları eklenir.
5. **AI-made izleri yok.** Bölüm 7.4'teki listeye uyulur.
6. **Türkçe önce yazılır.** Türkçe metinler İngilizceden yüzde 15 ile 30 daha uzundur. Düğmeler ve menüler Türkçeye göre denenir.
7. **Telefon önce, masaüstü bozulmadan.** Her ekran 390 ve 1440 piksel genişlikte ölçülerek denetlenir.
8. **Git (K12).** Her iş paketi kendi commit'iyle `dev`'e gider. Commit'ten önce `git branch --show-current` çıktısı `dev` olmalıdır.

---

## 2. Bugünkü durum: demo kalan yerler

Ayrıntı ve kanıtlar `current-site-audit.md` içindedir. Özet:

**Kırık akışlar**
- A1 testi sonsuza kadar "Loading Test..." gösteriyor, çünkü A1 için soru yok.
- `/quiz` sınıf seçme sayfası hata veriyor. History'deki düğme buraya gidiyor.
- History sayfası hep boş. Test sonuçları hiçbir yere kaydedilmiyor, sonuç sayfası yenilenince kayboluyor.
- Menüde deneme testine bağlantı yok. A ve EH testlerine yalnız adres yazarak ulaşılıyor.
- 404 sayfası yok. Bilinmeyen adresler boş sayfa gösteriyor.
- Ana sayfadaki örnek senaryoda doğru cevap baştan işaretli ve şıklar çalışmıyor.
- Telefonda menü ekrandan taşıyor ve her sayfa yana kayıyor.

**Gerçeği yansıtmayan vaatler**
- "30+ senaryo" yazıyor, 15 var. "144+ levha" yazıyor, 118 var.
- "20 soru, 30 dakika" yazıyor. A ve B testleri 19 soru, sayaç da yok.
- "Most Popular" rozeti ve "100% Practical" istatistiği uydurma.
- "Timed practice", "Realistic exam simulation" ve "İngilizce ve Türkçe açıklama" vaatleri gerçekleşmemiş.

**İçerik hataları**
- İki senaryo sağ trafiğe göre yazılmış: ambulansa sağa çekilmek ve yokuşta park.
- ABD'ye ait kavramlar var: sarı elmas uyarı levhası, "4-way stop", otoyol rampaları.
- Ehliyet harfleri AB sistemine göre. KKTC'de B ağır kamyon demek, EH diye bir sınıf yok.
- İki soruda yanlış levha resmi var. Bir levha açıklamasında Çince karakter var.
- Doğru cevaplar çoğunlukla B şıkkında, çünkü şıklar hiç karıştırılmıyor.

**Lisans ve gizlilik**
- 118 levha görseli güney Kıbrıs'a ait bir siteden izinsiz çekiliyor. Her ziyaret o siteye kullanıcının IP adresini gönderiyor. İki görsel zaten kırık.

**Erişilebilirlik ve arama motoru**
- Klavyeyle hiçbir levha açılamıyor. Levha penceresi odak yönetmiyor. Yaklaşık 150 kontrast hatası var.
- Arama motorları boş bir sayfa görüyor. Her sayfanın başlığı aynı. Sekme ikonu Vite logosu.

**Korunacaklar** (`current-site-audit.md` bölüm 9): görsel sistem, Study yapısı, senaryo cevap ve geri bildirim deseni, 40 soruluk bankanın açıklamaları, "Review Incorrect Answers" listesi, kullanılmayan `studyData.js` içindeki kural ve güvenlik içeriği, "Practice. Evaluate. Drive Safe." sloganı, ekip ve ders bilgisi.

---

## 3. Ürün tanımı

### 3.1 Kime, ne için

- **Kitle:** KKTC'de ehliyet alacak herkes. İki büyük grup var: Türkçe konuşan adaylar ve İngilizce konuşan uluslararası öğrenciler. Öğrenciler oturum izni aldıkları için yabancı ehliyetlerini KKTC ehliyetine çevirmek zorundadır.
- **Vaat:** "KKTC ehliyet sınavına ücretsiz ve kayıtsız hazırlan. Levhaları öğren, eksiklerini tekrar et, sınavı dene."
- **Güven:** Her kural bir yasa maddesine ya da açık bir etikete bağlıdır. Site resmi bir kurum olmadığını açıkça söyler. İçeriğin son kontrol tarihi görünür.

### 3.2 Öğrenme döngüsü: Öğren, Tekrarla, Dene

Ayrıntılı model `benchmark.md` bölüm 2'dedir. v1.0'da şu modlar vardır:

| Mod | TR | EN | Geri bildirim |
|---|---|---|---|
| Konu çalışması | Konu çalış | Practise a topic | Her sorudan hemen sonra, kısa gerekçe ve kaynakla |
| Günlük tekrar | Bugünkü tekrar | Today's review | Hemen |
| Levha sınavı provası | Levha sınavı provası | Sign exam rehearsal | Levhayı gör, anlamını söyle, cevabı aç, "Bildim" ya da "Bilemedim" de |
| Hatalarım | Hatalarım | My mistakes | Hemen |
| Yazılı sınav provası | Yazılı sınav provası | Written exam rehearsal | Yalnız sonda, konu bazında |
| Senaryolar | Senaryolar | Scenarios | Hemen, her şık için ayrı açıklamayla |

- **Tekrar sistemi:** Leitner kutuları localStorage'da tutulur. Yanlış cevaplanan soru Hatalarım'a girer. Farklı günlerde iki kez doğru cevaplanınca çıkar.
- **Hazırlık durumu:** Yüzde yerine adlandırılmış dört durum gösterilir: Başlangıç, Yolda, Yaklaşıyor, Hazır görünüyor. İlerleme sayfası neyin eksik olduğunu cümleyle söyler ve bunun bir tahmin olduğunu belirtir.

### 3.3 Sınav provaları (K7)

| Prova | Biçim | Etiket |
|---|---|---|
| Levha sınavı provası | Rastgele 10 levha. Kullanıcı her levhanın anlamını söyler ya da yazar, sonra cevabı açar. Geçer not uygulanmaz, çünkü gerçek sınavda sabit bir not yok. | "Bugünkü sözlü sınavda müfettiş levha sorar. Soru sayısı sabit değildir." |
| Yazılı sınav provası: Otomobil ve Motosiklet | 50 soru, 40 doğru geçer, 60 dakika. Konu dağılımı yönetmelikteki gibidir: trafik kuralları ve levhalar 22, trafik güvenliği ve davranış 15, araç bilgisi 4, çevre 3, kişisel durum 3, ilk yardım 3. | "Bu biçim 2017 yönetmeliğinde tanımlı. Henüz uygulanmıyor." |
| Yazılı sınav provası: Ağır vasıta | 100 soru, 80 doğru geçer, 120 dakika. | Aynı etiket |

- Sayaç uzatılabilir (1,5 kat, 2 kat) ya da kapatılabilir. Kalan süre 10, 5 ve 1 dakikada duyurulur.
- Sorular işaretlenip sonra dönülebilir. Bitirmeden önce boş ve işaretli sorular gösterilir.
- Sonuçta doğru sayısı, geçer not, geçen süre ve konu bazında sonuç görünür. Yanlışların hepsi Hatalarım'a eklenir.
- Sınav biçimi verisi tek bir dosyada tutulur (`content/exam-profile.json`), kaynağı ve kontrol tarihiyle. Gerçek sınav değişirse yalnız bu dosya güncellenir.

### 3.4 Araç yolları (K8)

| Kart | Bugünkü KKTC sınıfı | Yeni sistemdeki karşılığı |
|---|---|---|
| Otomobil | D | B |
| Motosiklet | H1, H2, H; moped için J | A1, A2, A; moped için M |
| Ağır vasıta | A otobüs, B ağır kamyon, C minibüs | D, C, D1 ve diğerleri |

Kaynak: `kktc-regulations.md` bölüm 2. Kartlarda yaş sınırı yalnız doğrulanmış olanlar için yazar. Çelişen yaşlar, örneğin ağır kamyon için 21 ya da 22, yazılmaz; "kursuna ya da Trafik Dairesi'ne danış" denir.

### 3.5 Bilgi mimarisi

Menü: **Çalış · Levhalar · Konular · Deneme sınavı · İlerleme · EN**. Telefonda logo, "Çalış" düğmesi ve menü düğmesi görünür. Menü mevcut hap stilini kullanan, alttan açılan bir sayfa olarak açılır.

| Sayfa | TR adresi | EN adresi |
|---|---|---|
| Ana sayfa | `/` | `/en/` |
| Çalış merkezi | `/calis/` | `/en/practise/` |
| Bugünkü tekrar | `/calis/bugun/` | `/en/practise/today/` |
| Levha sınavı provası | `/calis/levha-sinavi/` | `/en/practise/sign-exam/` |
| Hatalarım | `/hatalarim/` | `/en/mistakes/` |
| Senaryolar | `/senaryolar/` | `/en/scenarios/` |
| Levhalar | `/levhalar/` | `/en/signs/` |
| Levha kategorisi | `/levhalar/uyari/` | `/en/signs/warning/` |
| Levha sayfası | `/levhalar/dur/` | `/en/signs/stop/` |
| Konular | `/konular/` | `/en/topics/` |
| Konu sayfası | `/konular/oncelik-kurallari/` | `/en/topics/right-of-way/` |
| Deneme sınavı seçimi | `/deneme-sinavi/` | `/en/mock-exam/` |
| Deneme sınavı | `/deneme-sinavi/otomobil/` | `/en/mock-exam/car/` |
| Sonuç | `/deneme-sinavi/sonuc/` | `/en/mock-exam/result/` |
| İlerleme ve geçmiş | `/ilerleme/` | `/en/progress/` |
| Sınav nasıl yapılır | `/sinav-nasil-yapilir/` | `/en/how-the-exam-works/` |
| Ehliyet nasıl alınır | `/ehliyet-nasil-alinir/` | `/en/getting-a-licence/` |
| Soldan trafik | `/soldan-trafik/` | `/en/driving-on-the-left/` |
| Kaynaklar | `/kaynaklar/` | `/en/sources/` |
| Hakkında | `/hakkinda/` | `/en/about/` |
| Gizlilik | `/gizlilik/` | `/en/privacy/` |
| 404 | `/404.html` | aynı dosya, metin dile göre |

- Eski adresler yeni karşılıklarına yönlenir: `/study` Levhalar'a, `/study/:id` kategoriye, `/quiz` ve `/quiz/:x` Deneme sınavı seçimine, `/scenarios` Senaryolar'a, `/history` İlerleme'ye, `/results` Deneme sınavı seçimine.
- Dil düğmesi aynı sayfanın öbür dildeki karşılığına götürür, ana sayfaya değil.
- Tarayıcı diline göre otomatik yönlendirme yapılmaz. Tarayıcı dili Türkçe değilse Türkçe sayfada kapatılabilir bir satır görünür: "This page is available in English".

### 3.6 Ana sayfa sırası

Mevcut bölüm düzenleri kullanılır, yalnız içerik değişir.

1. **Hero:** başlık "KKTC ehliyet sınavına hazırlan", İngilizcesi "Get ready for the North Cyprus driving theory test". Alt metin: "Levhalar, kurallar ve deneme sınavları. Ücretsiz, kayıt yok; ilerlemen bu cihazda kalır." Düğmeler "Çalışmaya başla" ve "Deneme sınavına gir". Sağdaki kategori kartları gerçek levha biçimleri ve veriden gelen sayılarla gelir, her biri kendi kategorisine bağlanır. Bilgi levhaları kartı eklenir.
2. **Kaldığın yerden devam:** yalnız ilerleme varsa görünür. "12 soru tekrar bekliyor · Hatalarım: 5 · Devam et".
3. **Sınav kısaca:** doğrulanmış 3 ya da 4 bilgi, kaynak ve kontrol tarihiyle, "Sınav nasıl yapılır" sayfasına bağlantı.
4. **Test2Drive nasıl çalışır:** mevcut "Application Objectives" kartlarının yerinde. Öğren, Tekrarla, Dene.
5. **Bir soru dene:** mevcut örnek senaryo kartı, artık çalışır. Cevap baştan görünmez.
6. **Levhalara göz at:** kategoriler.
7. **Uluslararası öğrenciler için:** soldan trafik, ehliyet çevirme zorunluluğu, İngilizce sayfalarda Türkçe terimler. "Ehliyet nasıl alınır" sayfasına bağlantı.
8. **Araç yolları:** mevcut ehliyet kartları, üç kart (K8), rozetsiz.
9. **Neden güvenebilirsin:** kaynaklar, kontrol tarihi, "resmi bir kurum değildir", "hesap yok, cevapların cihazında kalır", "hata bildir".
10. **Kapanış bandı:** mevcut gradyan bant, somut bir çağrıyla: "Bugünkü tekrar: 20 soru, yaklaşık 8 dakika".

Mevcut "Our Solutions" bölümünün doğru olan vaatleri 4. ve 9. bölümlere dağılır. Hangi cümlenin nereye gittiği `docs/inventory-map.md` içinde yazar.

---

## 4. v1.0 kapsamı ve kabul ölçütleri

Her madde, kabul ölçütü sağlanınca işaretlenir.

### 4.1 Altyapı
- [ ] Her sayfa önceden üretilmiş HTML olarak çıkar. JavaScript kapalıyken sayfa içeriği okunur.
- [ ] Her sayfanın kendi başlığı, açıklaması, canonical adresi, `hreflang` bağlantıları (tr, en, x-default) ve OG görseli vardır.
- [ ] `sitemap.xml` ve `robots.txt` derlemede üretilir. Site adresi bir ortam değişkeninden gelir (`SITE_URL`).
- [ ] Bilinmeyen adres 404 sayfası gösterir. Statik barındırmalar için `404.html` üretilir.
- [ ] Site çevrimdışı çalışır. Güncelleme, deneme sınavı sırasında asla devreye girmez.
- [ ] Inter yerel olarak barındırılır, yalnız kullanılan ağırlıklarla. Dış istek sayısı sıfırdır.

### 4.2 İçerik
- [ ] Çekirdek levha seti: yaklaşık 90 levha, kendi SVG'lerimiz, CC0 lisanslı. Her levhada TR ve EN ad, anlam, "ne yapmalısın", en az bir "sık karıştırılan" bilgisi ve KKTC kanıt durumu vardır.
- [ ] Ortak soru havuzu en az 240 soru: kurallar ve levhalar 110, güvenlik ve davranış 75, araç bilgisi 20, çevre 15, kişisel durum 15, ilk yardım 15.
- [ ] Motosiklete özel en az 20, ağır vasıtaya özel en az 40 soru.
- [ ] Her soruda TR ve EN metin, kısa gerekçe, kaynak ve etiket vardır (bölüm 5.1).
- [ ] Doğru cevabın şık konumu dengelidir. Doğrulama betiği her harfin payının yüzde 15 ile 35 arasında olduğunu denetler. Şıklar ayrıca ekranda karıştırılır.
- [ ] Mevcut 15 senaryonun hepsi KKTC'ye göre düzeltilir. Senaryo sayısı en az 30'a çıkar.
- [ ] Konu sayfaları: `studyData.js` içindeki kural, güvenlik ve acil durum içeriği kaynaklarla doğrulanıp konu sayfalarına taşınır.
- [ ] Rehber sayfaları: Sınav nasıl yapılır, Ehliyet nasıl alınır, Soldan trafik, Kaynaklar, Hakkında, Gizlilik.
- [ ] İngilizce sayfalarda her levhanın Türkçe adı da görünür, örneğin "Stop · DUR".

### 4.3 Öğrenme özellikleri
- [ ] Konu çalışması, günlük tekrar, levha sınavı provası, Hatalarım, iki yazılı sınav provası ve senaryolar bölüm 3.2 ve 3.3'teki gibi çalışır.
- [ ] Test her zaman söylenen sayıda soruyla gelir. Bir konuda soru yetmezse derleme hata verir.
- [ ] Yarım kalan deneme sınavı, sayfa yenilenince kaldığı yerden devam eder. Sınavdan çıkarken uyarı gösterilir.
- [ ] Sonuç sayfası yenilenince kaybolmaz.
- [ ] İlerleme sayfası hazırlık durumunu, eksikleri ve geçmiş denemeleri gösterir.
- [ ] İlerleme dışa aktarılabilir, içe aktarılabilir ve onay adımıyla sıfırlanabilir.
- [ ] localStorage erişilemiyorsa site çalışmaya devam eder ve kullanıcıya ilerlemenin kaydedilemediğini söyler.

### 4.4 Erişilebilirlik (WCAG 2.2 AA)
- [ ] Tıklanabilir her kart gerçek bir bağlantı ya da düğmedir. Klavyeyle her şey yapılabilir.
- [ ] Soru yapısı `fieldset`, `legend` ve gerçek radyo düğmelerinden oluşur. Geri bildirim bir canlı bölgeden (`role="status"`) duyurulur. Odak bir sonraki soruya taşınır.
- [ ] Levha penceresi gerçek bir `dialog`'dur: odağı alır, içinde tutar, Escape ile kapanır, açan öğeye geri döner, 390 piksele sığar.
- [ ] Görünür odak çerçevesi, sayfa başına atlama bağlantısı ve `prefers-reduced-motion` desteği vardır.
- [ ] Her metin en az 4,5:1 kontrast sağlar (bölüm 7.2).
- [ ] Doğru ve yanlış yalnız renkle değil, ikon ve yazıyla da belirtilir.
- [ ] Sınav sorusunda levhanın alt metni cevabı vermez.

### 4.5 Arayüz durumları
- [ ] Her ekranın yükleniyor, hata, boş ve çevrimdışı durumu vardır. Metinler `benchmark.md` bölüm 3.5'teki gibidir.
- [ ] 360 ile 430 piksel arasında yana kayma yoktur. Menünün her öğesine ulaşılır.

---

## 5. İçerik planı

### 5.1 İçerik politikası (K11)

Her kural, soru ve açıklama şu üç etiketten birini taşır. Etiket veride zorunlu bir alandır.

| Etiket | Ne zaman | Sitede nasıl görünür |
|---|---|---|
| `law` | Araştırmada [V] işaretli, yasa ya da resmi kaynakla doğrulanmış | Açıklamanın altında "Kaynak: Yol Kuralları Yasası, md. 2" gibi bir satır |
| `practice` | Kaynakta yazılı değil ama sol trafikte ve güvenli sürüşte mantıklı. Örnek: ambulansa yol vermek için sola çekilmek | "Genel uygulama: KKTC mevzuatında yazılı bir kural bulunamadı. Sol trafikte güvenli olan budur." |
| `secondary` | Yalnız ikincil kaynakta geçen [S] bilgi, örneğin 2019 hız tablosu | "Kaynak: Bakanlık duyurusu, basında yer aldığı biçimiyle" |

**Yayınlanmayanlar:**
- Kaynaklar arasında çelişen bilgi, örneğin ağır kamyon yaşının 21 mi 22 mi olduğu.
- KKTC'de olmadığı bilinen kavramlar: 4-way stop, otoyol rampası, sarı elmas uyarı levhası, EH sınıfı.
- Sayı içeren ama kaynağı olmayan her iddia. Sayı içeren bir kural `practice` etiketiyle yayınlanamaz. Örneğin "okul bölgesinde 30 km/sa" kuralının kaynağı yoksa soru "okul bölgesinde hızını düşür ve dikkatli ol" biçiminde, sayısız yazılır.

`kktc-regulations.md` bölüm 8 ve `road-signs.md` bölüm 6'daki açık sorular `docs/verification-checklist.md` dosyasında tek sayfa olarak toplanır (F2.1). Bu liste yayını engellemez. Bir madde doğrulanırsa etiketi `law` olur ve kontrol tarihi güncellenir.

### 5.2 Veri yapısı

```
content/
  exam-profile.json        sınav biçimleri, kaynak, kontrol tarihi
  tracks.json              Otomobil, Motosiklet, Ağır vasıta ve sınıf harfleri
  topics/<id>.json         konu sayfası: başlık, özet, gövde (TR/EN), ilgili sorular
  signs/<category>.json    levha verisi, şema road-signs.md bölüm 5.4
  questions/<topic>.json   soru bankası
  scenarios.json           senaryolar
  glossary.json            TR-EN terim sözlüğü
  sources.json             her kaynağın adı, adresi ve kontrol tarihi
locales/tr.json, en.json   yalnız arayüz metinleri
```

Soru şeması:

```jsonc
{
  "id": "rules.overtake-side",
  "rev": 1,
  "topic": "rules",              // exam-profile'daki altı konudan biri
  "tracks": ["car", "moto", "heavy"],
  "difficulty": "easy",
  "prompt":  { "tr": "...", "en": "..." },
  "options": [{ "id": "a", "text": { "tr": "...", "en": "..." } }],
  "answer": "b",
  "why":     { "tr": "...", "en": "..." },
  "signId": null,                // levha sorusuysa levhanın id'si; resim oradan gelir
  "basis": "law",                // law | practice | secondary
  "sourceId": "yol-kurallari-yasasi",
  "sourceRef": "md. 2",
  "reviewedAt": "2026-10-20"
}
```

- Bir doğrulama betiği (`scripts/validate-content.mjs`) derlemeden önce çalışır. Şu durumlarda derleme durur: eksik çeviri, bilinmeyen `sourceId`, eksik `basis`, olmayan bir `signId`, sınav biçimine yetmeyen konu başına soru sayısı, dengesiz şık konumu, iki kez kullanılan `id`, `practice` etiketli bir soruda sayı.
- Levha sorularında resim her zaman levha verisinden gelir. Böylece soru ile levha sayfası farklı resim gösteremez.

### 5.3 Yazım kuralları

- **Türkçe:** "sen" diye hitap, kısa cümle, ünlem yok, yönetmelikteki terimler ("yol ver", "geçiş üstünlüğü"). Başlıklar cümle düzeninde, sonda nokta yok.
- **İngilizce:** İngiliz yazımı (licence, practise, give way, roundabout), çünkü KKTC'de soldan trafik ve İngiliz döneminden kalan terimler var.
- **Terim tutarlılığı:** aynı kavram her yerde aynı adla geçer. `glossary.json` tek kaynaktır.
- **Türkçe büyük harf:** `lang="tr"` her sayfada doğru olmalıdır, yoksa CSS "i" harfini "I" yapar. Türkçe büyük harfli satırlardaki İngilizce marka adları `lang="en"` ile sarılır.

---

## 6. Teknik mimari

Ayrıntı `benchmark.md` bölüm 4'tedir. Özet:

- **Önceden üretim:** vite-ssg, `dirStyle: 'nested'`. Dinamik adresler (levhalar, konular, kategoriler) iki dil için içerik dosyalarından üretilir.
- **Diller:** vue-i18n, Composition API. Dil adresten gelir (`/en` öneki). Tüm adresler tek bir rota tablosundan üretilir; her bağlantıda `localePath(ad, parametreler, dil)` yardımcısı kullanılır.
- **Durum:** Pinia kalır. localStorage'a bağlı her şey yalnız istemcide, `onMounted` içinde okunur. Bu bileşenler, üretilen HTML ile istemci arasında fark oluşmasın diye aynı boyutta bir yer tutucuyla `ClientOnly` içinde durur.
- **Depolama:** tek anahtar `t2d.v1`, şema sürümü ve göç adımlarıyla. Her okuma ve yazma try/catch içinde. Bir sorunun `rev` değeri değişirse o sorunun kutusu iki basamak düşer.
- **Karıştırma:** Fisher-Yates, yalnız istemcide.
- **PWA:** vite-plugin-pwa, `registerType: 'prompt'`. İçerik JSON'u, SVG'ler, yazı tipi ve çekirdek sayfalar önbelleğe alınır.
- **OG görselleri:** derlemede satori ve resvg ile üretilir. Mevcut hero gradyanını ve levha SVG'sini kullanır, her dil için ayrıdır.
- **Testler:** Vitest ile tekrar sistemi, karıştırma, puanlama, depolama göçü ve içerik doğrulaması. Playwright ve Edge ile iki dilde temel akışlar: konu çalışması, baştan sona deneme sınavı, levha sayfası, dil değiştirme, 404.
- **CI:** GitHub Actions, `dev` branch'ına her push'ta içerik doğrulama, testler ve derleme. Yayın adımı yok (K6).

---

## 7. Tasarım sürekliliği

### 7.1 Değişmeyenler
`src/style.css` içindeki renk, gölge, köşe ve geçiş token'ları; Inter; `.card`, `.btn`, `grid-*`, `section-padding`; hero bölünmesi, kart ızgaraları ve gradyan kapanış bandı. Mevcut sayfaların görünümü, içerik değişse bile aynı kalır.

### 7.2 Erişilebilirlik için eklenen token'lar
Mevcut tonların koyu karşılıkları yeni token olarak eklenir. Palet değişmez, yalnız metin olarak kullanılan renkler koyulaşır. Hesaplanmış oranlar `benchmark.md` bölüm 3.4'tedir.

| Token | Değer | Neden |
|---|---|---|
| `--color-text-muted` | `#78909C` yerine `#5F7682` | 3,35:1 yerine 4,77:1 |
| `--color-accent-text` | `#B85C0F` | turuncu metin 4,59:1 |
| `--color-success-text` | `#1E7B45` | yeşil metin 5,28:1 |
| `--color-danger-text` | `#C0392B` | kırmızı metin 5,44:1 |
| Odak çerçevesi | 3 piksel `--color-primary`, gradyan üstünde beyaz | görünür odak |

`App.vue` içinde kalan eski mavi değerler (`rgba(15, 76, 129, ...)`) teal token'larına çevrilir. `HomeView.vue` içindeki token dışı renkler token'lara bağlanır.

### 7.3 İkonlar (K10)
- Lucide: 24 piksellik ızgara, çizgi kalınlığı 2, `currentColor`. Düğme ve menüde 20, kart başlıklarında 24 piksel.
- Levha kategorilerinin ikonu, kendi SVG setimizden küçük bir levha biçimidir: kırmızı kenarlı üçgen, kırmızı kenarlı daire, mavi disk, sekizgen, kare bilgi levhası.
- `signs.json`, `scenarios.json`, `studyData.js` ve görünümlerdeki tüm emojiler kalkar.

### 7.4 AI-made izleri: yapılmayacaklar
- Her başlıkta renkli italik vurgu kelimesi, başlık sonunda nokta, her bölümün üstünde küçük büyük harfli etiket.
- Uydurma istatistik, "Most Popular" gibi rozetler, "Ready to Start Your Journey?" gibi genel çağrılar.
- Proje raporu dili: "Application Objectives", "Our Solutions", "Our mission to...".
- Emoji ikon, ünlemli geri bildirim ("Correct!"), hero rozetinde başlığın tekrarı.
- Kodda uzun iç ses yorumları ("Let's assume...", "I'll skip..."). Yorumlar yalnız nedeni açıklar.

---

## 8. Fazlar ve iş paketleri

Süreler tek kişinin iş günü cinsinden tahmindir. Ajanlarla paralel çalışınca toplam süre kısalır. Her iş paketi bitince kabul ölçütleri denetlenir, `docs/PROGRESS.md` güncellenir, iş `dev`'e commit edilip push edilir.

### Ekip

| Rol | Kim | İşi |
|---|---|---|
| Lider | Ana oturum | Altyapı, rota tablosu, ortak bileşenler, ana sayfa, entegrasyon, QA, commit'ler |
| İçerik ajanları | 3 ajan, paralel | Konu gruplarına göre soru bankası, senaryolar, konu ve rehber sayfaları. Yalnız `content/` altına yazar. |
| Levha ajanı | 1 ajan | SVG çizimi ve levha verisi. Yalnız `public/signs/` ve `content/signs/` altına yazar. |
| Özellik ajanları | 2 ajan, paralel | Biri öğrenme motoru ve deneme sınavı, öbürü ilerleme, geçmiş ve dışa aktarma. Ortak dosyalara dokunmaz, değişiklik önerir. |
| Bağımsız gözden geçirici | 1 ajan ya da Codex | Her faz sonunda kodu ve içeriği taze gözle inceler. Bulgular doğrulanmadan uygulanmaz. |

Ajan kuralları: önce bu planı ve `docs/DESIGN.md`'yi okur. Kendi geliştirme sunucusu portunu kullanır. Derlemeyi kendi klasörüne yapar (`--outDir .builds/<ad>`). Ekran görüntülerini depo dışına kaydeder. Commit'i yalnız lider yapar.

### F0. Hazırlık (1 gün)
- [ ] F0.1 `docs/PROGRESS.md` ve `docs/DESIGN.md` oluşturulur. DESIGN.md mevcut tasarım sistemini, token'ları ve bölüm 7'yi anlatır.
- [ ] F0.2 `docs/inventory-map.md`: `current-site-audit.md` bölüm 8'deki her öğenin yeni yeri ya da kaldırılma gerekçesi.
- [ ] F0.3 Test altyapısı (Vitest, Playwright) ve CI.
- [ ] F0.4 Ölü kod temizliği: `HelloWorld.vue`, `assets/vue.svg`, kullanılmayan CSS sınıfları. `QuestionCard.vue`, `ResultsSummary.vue` ve `QuizProgress.vue` içindeki iyi fikirler not edilir; bu dosyalar F3'te yeni bileşenlere dönüşür.

### F1. Altyapı (3 gün)
- [ ] F1.1 vite-ssg ve vue-i18n kurulumu, rota tablosu, `localePath`, eski adres yönlendirmeleri.
- [ ] F1.2 `content/` yapısı, şemalar ve doğrulama betiği. Mevcut 118 levha ve 40 soru yeni şemaya taşınır, F2'de düzeltilir.
- [ ] F1.3 Kabuk: telefon menüsü, yeni alt bilgi, dil düğmesi, atlama bağlantısı, odak stilleri, erişilebilirlik token'ları, ikon seti.
- [ ] F1.4 Ortak durum bileşenleri: yükleniyor, hata, boş, çevrimdışı, 404.
- [ ] F1.5 localStorage katmanı ve Pinia store'ları.

### F2. İçerik (8 ile 10 gün, ajanlarla paralel)
- [ ] F2.1 `docs/verification-checklist.md` ve `content/sources.json`.
- [ ] F2.2 Çekirdek levha seti: yaklaşık 90 SVG ve verisi. Kurallar `road-signs.md` bölüm 5.2'de. Güney Kıbrıs'a ait yazılar ve tasarımlar KKTC karşılıklarıyla değişir: DUR, kızılay, Türkçe yazılar, saat yönünde dönel kavşak.
- [ ] F2.3 Soru bankası: altı konu, bölüm 4.2'deki sayılar. Mevcut 40 soru `kktc-regulations.md` bölüm 7'ye göre düzeltilir; silinmesi gerekenler `inventory-map.md`'ye yazılır.
- [ ] F2.4 Senaryolar: mevcut 15'in düzeltilmesi ve en az 15 yeni senaryo. Her senaryo emoji yerine bir levha ya da basit bir çizimle gösterilir.
- [ ] F2.5 Konu sayfaları, `studyData.js` içeriği dahil.
- [ ] F2.6 Rehber sayfaları ve Hakkında. Hakkında sayfası projenin hikâyesini, Asil Türkmen ve Arda Günsüren adlarını, TRAF101 dersini, Doç. Dr. Metin Kurt'u ve DAÜ'yü anlatır. DAÜ logosu izin gelene kadar kullanılmaz.
- [ ] F2.7 TR ve EN dil kontrolü: bir ajan iki dili baştan sona okur, terim tutarlılığını ve Türkçe karakterleri denetler.

### F3. Öğrenme motoru (4 gün)
- [ ] F3.1 Soru bileşeni: erişilebilir yapı, karıştırma, geri bildirim, kaynak satırı.
- [ ] F3.2 Konu çalışması, günlük tekrar, Hatalarım ve Leitner zamanlaması.
- [ ] F3.3 Levha sınavı provası.
- [ ] F3.4 Yazılı sınav provası: sayaç, işaretleme, kaldığı yerden devam, çıkış uyarısı, sonuç.
- [ ] F3.5 Senaryolar yeni yapıda. Yanlış cevaplanan senaryolar sonuçta listelenir.
- [ ] F3.6 İlerleme sayfası: hazırlık durumu, eksikler, geçmiş, dışa aktarma, içe aktarma, sıfırlama.

### F4. Sayfalar (3 gün)
- [ ] F4.1 Ana sayfa, bölüm 3.6'daki sırayla.
- [ ] F4.2 Levhalar, kategori ve levha sayfası şablonu (`benchmark.md` bölüm 4.4'teki sıra).
- [ ] F4.3 Konular, Çalış merkezi ve üç araç kartıyla Deneme sınavı seçimi.
- [ ] F4.4 Rehber sayfalarının görünümü.

### F5. Arama motoru ve çevrimdışı (2 gün)
- [ ] F5.1 Sayfa başına başlık, açıklama, canonical, hreflang ve yapılandırılmış veri (WebSite, BreadcrumbList, DefinedTermSet).
- [ ] F5.2 Sitemap, robots, OG görselleri, sekme ikonu, uygulama ikonları ve manifest. İkonlar mevcut logodan üretilir.
- [ ] F5.3 PWA ve çevrimdışı sayfa.

### F6. QA ve bağımsız inceleme (2 ile 3 gün)
- [ ] F6.1 Bölüm 10'daki ölçümler. Sonuçlar sayılarla `docs/QA-REPORT.md`'ye yazılır.
- [ ] F6.2 İki turlu bağımsız inceleme: önce altyapı ve öğrenme motoru, sonra içerik ve sayfalar.
- [ ] F6.3 Düzeltmeler ve ölçümlerin yeniden alınması.

### F7. Teslim (1 gün)
- [ ] F7.1 README: ürün tanımı, komutlar, içerik ekleme rehberi, herhangi bir statik barındırmaya yayın adımları.
- [ ] F7.2 `docs/LAUNCH.md`: barındırma seçilince yapılacaklar. Alan adı, `SITE_URL`, yönlendirmeler, 404 ayarı, önbellek başlıkları.
- [ ] F7.3 Sürüm notu ve `dev` üzerinde `v1.0.0` etiketi. `main`'e dokunulmaz.
- [ ] F7.4 Asil'e rapor: ne yapıldı, ölçümler, yayından önce ondan beklenenler.

Toplam tahmin tek kişiyle yaklaşık 25 iş günü. Ajanlarla F2, F3 ve F4 paralel yürür ve süre yaklaşık 12 ile 15 güne iner.

---

## 9. v1.1: planlı sonraki sürüm

K9 gereği bunlar v1.0'dan sonra yapılacak olarak planlıdır.

- [ ] Kalan levhalar, yaklaşık 110 görsel: sağ ve sol türevler, ek levhalar, yerleşim yeri girişi ve çıkışı, bölge levhaları, hız kamerası ve benzerleri (`road-signs.md` bölüm 4.3).
- [ ] Yol çizgileri, yaklaşık 15 çizim (`road-signs.md` bölüm 4.4).
- [ ] Trafik ışıkları ve yanıp sönen ışık durumları (`road-signs.md` bölüm 4.5).
- [ ] Polis el işaretleri.
- [ ] "Emin değildim" seçeneği ve soru başına "Bu soruda hata var" bağlantısı.
- [ ] Dönel kavşak anlatımı, yazdırılabilir levha listesi, TR-EN terim sözlüğü sayfası.
- [ ] Sıralama tablosu olmadan, sessiz bir çalışma günü serisi.

Daha sonra: FSRS tekrar algoritması, soruları sesli okuma, KKTC yollarından kendi fotoğraflarımızla tehlike soruları, Rusça ve Arapça gibi ek diller.

---

## 10. Bitti tanımı: ölçülen kapılar

Yayın derlemesi üzerinde, iki dilde, 390 ve 1440 piksel genişlikte:

| Ölçüm | Hedef |
|---|---|
| Kırık bağlantı | 0 |
| axe erişilebilirlik hatası | 0 |
| Konsol hatası | 0 |
| Kontrast hatası | 0 |
| Yana kayma (360, 390, 430 piksel, WebKit dahil) | yok |
| LCP, yavaşlatılmış telefon | 2,5 saniyenin altında |
| CLS | yaklaşık 0 |
| Dış istek | 0 |
| İçerik doğrulama betiği | hatasız |
| Vitest ve Playwright | hepsi geçer |
| Türkçe büyük harf denetimi | hatasız |
| hreflang karşılıklılık denetimi | her sayfa iki yönlü |
| JavaScript kapalıyken | levha, konu ve rehber sayfaları okunur |

Araçlar `C:\Users\turkm\Desktop\premium-web-playbook\tools\qa\` altındadır: shot, a11y, contrast, casing, perf, links, mobile-overflow. Bunlar `scripts/qa/` altına kopyalanıp uyarlanır. Her ekranın görüntüsü alınır ve ölçülür; "iyi görünüyor" kanıt sayılmaz.

---

## 11. Asil'den beklenenler

Bunların hiçbiri işi durdurmaz. Gerektiği yerde varsayılan uygulanır.

| # | Konu | Varsayılan |
|---|---|---|
| A1 | Barındırma ve alan adı (K6) | Çıktı her ortama uyar. `SITE_URL` bir yer tutucuyla derlenir. |
| A2 | DAÜ logosunu Hakkında sayfasında kullanma izni | İzin gelene kadar DAÜ yalnız yazıyla anılır. |
| A3 | Arda Günsüren'in, adının Hakkında sayfasında geçmesine onayı | Adı geçer, öğrenci numarası geçmez. |
| A4 | "Hata bildir" kanalı: e-posta mı, GitHub issue mu | Deponun GitHub issue formu. Depo gizliyse bir e-posta adresi gerekir. |
| A5 | `docs/verification-checklist.md` maddelerini bir sürücü kursuna sormak, isteğe bağlı | Sorulmazsa maddeler etiketleriyle yayınlanır (K11). |

---

## 12. Uygulama protokolü

Bu planı uygulayan oturum için:

1. Başlarken `git branch --show-current` çıktısı `dev` değilse `git checkout dev` yapılır. `main`'e hiçbir koşulda merge, rebase ya da push yapılmaz.
2. Önce bu plan, sonra `docs/PROGRESS.md`, sonra ilgili araştırma raporu okunur.
3. İş paketleri sırayla yürür. F2, F3 ve F4 içindeki bağımsız işler ajanlara paralel verilir.
4. Her iş paketi bitince kabul ölçütleri denetlenir, `PROGRESS.md` güncellenir, tek bir commit atılır ve `dev`'e push edilir. Commit mesajı iş paketinin numarasıyla başlar, örneğin "F1.2 İçerik şeması ve doğrulama betiği".
5. Bölüm 0'daki kararlar yeniden açılmaz. Plan dışı bir karar işi gerçekten değiştiriyorsa Asil'e sorulur. Değiştirmiyorsa makul bir varsayılan uygulanır ve `PROGRESS.md`'ye "Varsayım" başlığıyla yazılır.
6. Bir iş takılırsa nedeni `PROGRESS.md`'ye yazılır ve bağımsız bir sonraki işe geçilir.
7. Her fazın sonunda Beyin'e receipt yazılır ve `knowledge/concepts/traf101.md` notu güncellenir.
