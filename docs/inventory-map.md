# Envanter eşlemesi

Bu dosya `docs/research/current-site-audit.md` bölüm 8'deki her öğenin production sürümündeki yerini gösterir (PLAN iş paketi F0.2, değişmez kural 1). Yeni yerler `docs/PLAN.md` bölüm 3.5 (bilgi mimarisi) ve 3.6'ya (ana sayfa sırası) göredir. Kalkan her öğenin gerekçesi yazılıdır.

- **Hazırlayan:** rehber ajanı, 2026-10-20
- **Ayrıntılı göç dosyaları:** soru bankası `docs/migration/questions.md`, senaryolar `docs/migration/scenarios.md`, `studyData.js` ve konu sayfaları `docs/migration/lessons.md`, levhalar `docs/migration/signs.md`. Bu dosyaları diğer içerik ajanları yazıyor; adları teslimde değişirse bu satır güncellenir.
- **Kısaltmalar:** AS = ana sayfa, bölüm numarası PLAN 3.6'daki sıradır (AS-1 Hero ... AS-10 Kapanış bandı).

## 8.1 Genel kabuk (`App.vue`, `index.html`, `style.css`)

| Mevcut öğe | Yeni yeri | Not |
|---|---|---|
| `<title>` "Test2Drive - Practice. Evaluate. Drive Safe." | Her sayfanın kendi başlığı, "… · Test2Drive" biçiminde (F5.1) | Tek başlık kalkar. Slogan Hakkında sayfasına gider |
| meta description "TRNC Driving Safety - Master traffic signs…" | Sayfa başına açıklama, iki dilde (F5.1) | "TRNC Driving Safety" (K4) ve "Master" (7.4) kalkar; "all license types" yanlıştı |
| meta keywords | Kalkar | Arama motorları kullanmıyor |
| meta author "TRNC Driving Safety" | "Test2Drive" | K4 |
| og:type / og:title / og:description | Sayfa başına OG etiketleri, og:image ve og:url ile (F5.1, F5.2) | Metin yeniden yazılır |
| Favicon `/vite.svg` | Logodan üretilen sekme ikonu ve uygulama ikonları (F5.2) | Vite logosu kalkar |
| `<html lang="en">` | Türkçe sayfalarda `tr`, İngilizce sayfalarda `en` (K2) | Türkçe büyük harf sorunu için zorunlu |
| Başlık logosu `/logo.png` → `/` | Kabukta aynı yerde, küçültülmüş dosyayla (F1.3) | Korunur |
| Menü "Home, Study, Scenarios, History" | Menü: Çalış · Levhalar · Konular · Deneme sınavı · İlerleme · EN (PLAN 3.5). Senaryolar Çalış merkezinden | Home logoya geçer, Study → Levhalar ve Konular, History → İlerleme. Deneme sınavı bağlantısı eklenir |
| Aktif menü hapı (gradyan) | Aynı stil, yeni menüde ve telefonda alttan açılan menüde | Korunur (K3) |
| Kullanılmayan `.logo-text` | Silinir (F0.4) | Hiçbir öğe kullanmıyor |
| Alt bilgi "Developed by" Asil Türkmen, Arda Günsüren | Hakkında sayfası, "Kim yapıyor" bölümü (`content/pages/about.json`) | Adlar korunur. Öğrenci numaraları (21330934, 21330887) kalkar: kişisel veri, K5 |
| Alt bilgi DAÜ logosu `/emu-logo.png` | İzin gelene kadar kullanılmaz; DAÜ Hakkında'da yazıyla anılır | PLAN A2. Dosya depoda kalabilir |
| Alt bilgi "Course Information" TRAF101, "Instructor: Assoc.Prof.Dr Metin Kurt" | Hakkında sayfası, "Nasıl başladı" ve "Teşekkür" bölümleri | Alt bilgiden kalkar (K5) |
| Alt bilgi "© 2025 Test2Drive. Practice. Evaluate. Drive Safe." | Alt bilgide "© Test2Drive" ve yıl derleme tarihinden. Slogan Hakkında'da | Sabit yıl kalkar |
| Tasarım token'ları (renk, gradyan, gölge, köşe, boşluk, geçiş) | `style.css` aynen kalır; erişilebilirlik token'ları eklenir (PLAN 7.2) | K3. `--color-text-muted` koyulaşır |
| Genel sınıflar `.btn`, `.card`, `.grid-*`, `.bento-*`, `.animate-*`, `.section-padding`, `.full-bleed` | Aynen kalır, yeni bileşenler bunları kullanır | `.section-padding` telefonda yan boşluk alır |
| Google Fonts Inter 400–900 `@import` | Inter yerel, yalnız kullanılan ağırlıklar (PLAN 4.1) | Dış istek kalkar |

## 8.2 Rotalar

| Mevcut öğe | Yeni yeri | Not |
|---|---|---|
| `/` home | `/` ve `/en/` | |
| `/study` StudyHub | `/levhalar/` ve `/en/signs/`; eski adres yönlenir | |
| `/study/:topicId` | `/levhalar/<kategori>/`; eski adres kategoriye yönlenir | Bilinmeyen kategori 404 gösterir |
| `/quiz` SelectLicense (kırık) | `/deneme-sinavi/` üç araç kartıyla; eski adres yönlenir | Kırık görünüm yeniden yazılır |
| `/quiz/:licenseType` | `/deneme-sinavi/otomobil/`, `/motosiklet/`, `/agir-vasita/`; eski adres seçim sayfasına yönlenir | A1 sonsuz yükleme sorunu kalkar: soru yetmezse derleme durur |
| `/results` | `/deneme-sinavi/sonuc/`, yenilenince kaybolmaz | |
| `/scenarios` | `/senaryolar/` ve `/en/scenarios/` | |
| `/history` (sahte) | `/ilerleme/` ve `/en/progress/` | Artık gerçek geçmiş |
| catch-all yok | `404.html` ve yakalayıcı rota (F1.4) | |
| `/select-license` (yok) | Yok | Yalnız kullanılmayan `ResultsView.vue` çağırıyordu |

## 8.3 Ana sayfa (`HomeView.vue`)

| Mevcut öğe | Yeni yeri | Not |
|---|---|---|
| Hero rozeti "🚗 Practice. Evaluate. Drive Safe." | Kalkar; slogan Hakkında sayfasında | Başlığı kelimesi kelimesine tekrarlıyordu (PLAN 7.4). Emoji kalkar (K10) |
| Hero H1 "Practice. Evaluate. Drive Safe." | AS-1 başlık "KKTC ehliyet sınavına hazırlan" / "Get ready for the North Cyprus driving theory test" | Slogan Hakkında'da korunur (keep list 11) |
| Hero paragrafı "Complete digital learning platform…" | AS-1 alt metin "Levhalar, kurallar ve deneme sınavları. Ücretsiz, kayıt yok; ilerlemen bu cihazda kalır." | "Interactive lessons" yoktu; yeni metin yalnız var olanı söyler |
| "Start Learning Now" → `/study` | AS-1 "Çalışmaya başla" → `/calis/` | |
| "Take Practice Test" → `/quiz/B` | AS-1 "Deneme sınavına gir" → `/deneme-sinavi/` | Hep B'ye gidiyordu |
| Hero kartları "Warning 46, Prohibitory 35, Mandatory 13, Priority 8" | AS-1 sağdaki kartlar: gerçek levha biçimleri, veriden gelen sayılar, kategori bağlantıları, Bilgi levhaları kartı eklenir | Sabit sayılar kalkar |
| `.hero-pattern`, `.card-glow` | Kalır; glow taşması düzeltilir | |
| "🎬 Try a Real Situation" ve alt başlık | AS-5 "Bir soru dene" | Emoji kalkar. "Try a Real Situation" metni AS-5 başlığına esin olur (keep list 11) |
| Örnek kart "School Zone Situation", 50 km/h, 30 km/h şıkkı | AS-5 çalışan tek soruluk demo; içerik `content/scenarios.json`'dan | Okul bölgesi 30 km/sa kaynaksız (kktc-regulations 7.3). Senaryo 1'in düzeltilmiş hâli kullanılır, bkz. `docs/migration/scenarios.md` |
| Örnek şıklar (işlevsiz, cevap baştan işaretli) | AS-5 gerçek düğmeler, cevap seçince görünür | |
| "Start Scenario Practice" → `/scenarios` | AS-5 bağlantısı → `/senaryolar/` | |
| İstatistikler "30+ Real Scenarios", "5 Categories", "100% Practical" | Kalkar. Gerçek sayılar AS-1 kartlarında ve Çalış merkezinde veriden | 30+ yanlıştı (15 vardı), 100% Practical dolgu (değişmez kural 2) |
| "🎯 Application Objectives" ve "Our mission to make TRNC roads safer…" | AS-4 "Test2Drive nasıl çalışır": Öğren, Tekrarla, Dene | Proje raporu dili kalkar (PLAN 7.4) |
| Hedef kartı "Evaluate Readiness" | AS-4 "Dene" kartı ve İlerleme sayfasındaki hazırlık durumu | |
| Hedef kartı "License-Specific Practice" | AS-8 Araç yolları | "all categories" yanlıştı; üç araç yolu var |
| Hedef kartı "Traffic Sign Knowledge" | AS-4 "Öğren" kartı ve AS-6 Levhalara göz at | |
| Hedef kartı "Safe Driving" | AS-9 Neden güvenebilirsin ve Konular | |
| "💡 Our Solutions" ve "Comprehensive tools…" | Başlık kalkar; doğru vaatler AS-4 ve AS-9'a dağılır | PLAN 3.6 son paragraf |
| Çözüm "License-Based Practice Tests" ve "Category-specific questions" | AS-8 Araç yolları ve Deneme sınavı seçimi | Artık doğru: soruların `tracks` alanı var |
| "Realistic exam simulation" | AS-4 "Dene" kartı: "Yazılı sınav provası, yönetmelikteki biçimle" | Etiketiyle (K7); "gerçek sınav" denmez |
| "Timed practice sessions" | Yazılı sınav provasındaki sayaç (PLAN 3.3) | Artık gerçek |
| "⚡ Instant Feedback" | AS-4 "Tekrarla" kartı: her sorudan sonra gerekçe ve kaynak | |
| "🔍 Detailed Explanations … English and Turkish" | AS-9 ve AS-7: iki dil, her açıklamada kaynak | Artık doğru (K2) |
| "🌐 Simple & Accessible Platform", "No downloads required", "Mobile-friendly design", "100% Free to use" | AS-9: "Ücretsiz, hesap yok, cevapların cihazında kalır"; Hakkında "Ücretsiz, hesapsız, resmi değil" | "Mobile-friendly" ayrı vaat olarak kalkar, ölçüm kapısıyla sağlanır |
| "Choose Your License Type" / "Select the category…" | AS-8 Araç yolları başlığı | |
| Ehliyet kartları A1, B, C, D, "20 Questions • 30 Min", "Most Popular" | AS-8 üç kart: Otomobil, Motosiklet, Ağır vasıta; bugünkü KKTC harfi ve yeni karşılığı (K8) | AB harfleri KKTC'de yanlış anlamda; "20 soru/30 dk" sahteydi; "Most Popular" uydurma rozet |
| Kapanış bandı "Ready to Start Your Journey?" ve "Start Learning Now" | AS-10 aynı gradyan bant: "Bugünkü tekrar: 20 soru, yaklaşık 8 dakika" | Genel çağrı kalkar (PLAN 7.4) |
| Kullanılmayan CSS `.stat-badge`, bounce/scroll, `slideIn` | Silinir (F0.4) | İşaretlemesi yok |

## 8.4 Levha merkezi (`/study`)

| Mevcut öğe | Yeni yeri | Not |
|---|---|---|
| "← Back to Home" | Kalkar | Menüyü tekrarlıyordu; yerine sayfa yolu (breadcrumb) |
| H1 "Traffic School" ve alt başlık | `/levhalar/` başlığı "Levhalar" / "Signs"; "Traffic School" adı Konular sayfasının karşılığıdır (benchmark 3.6) | "Master all … rules" kalkar; kurallar Konular'da |
| 5 kategori kartı, küçük resimler, "+{n} more", "Explore All Signs →" | `/levhalar/` aynı kart düzeni, gerçek bağlantı olarak | Keep list 2. Klavyeyle açılır |
| Kategori adları ve açıklamaları | `content/signs/categories.json` | Bkz. `docs/migration/signs.md` |
| `nameTr`, `nameEn` (gösterilmiyordu) | Gösterilir: TR sayfada Türkçe ad, EN sayfada "Stop · DUR" | |
| Yükleniyor "Loading traffic signs..." | Ortak yükleniyor ve hata durumları (F1.4) | Hata durumu eklenir |

## 8.5 Levha kategorisi (`/study/:topicId`)

| Mevcut öğe | Yeni yeri | Not |
|---|---|---|
| "Back" (`router.back()`) | Sayfa yolu bağlantısı | |
| Başlık: ikon, "{n} Traffic Signs", ad, açıklama | `/levhalar/<kategori>/` başlığı; ikon gerçek levha biçimi (K10) | |
| "All {Category}" / "Click on any sign…" | Aynı bölüm, "Bir levhaya dokun ya da tıkla" | "Click" telefonda yanlış |
| Levha kartı: resim, ad, "TR: {nameTr}" | Aynı kart, kendi SVG'miz; ayrıca her levhanın kendi sayfası `/levhalar/<slug>/` | Klavye erişimi |
| Pencere: ad, "Turkish:", kategori rozeti, "Description" | Gerçek `dialog` (PLAN 4.4) ve levha sayfası: anlam, ne yapmalısın, sık karıştırılan | |
| "⚡ Maximum Speed" bloğu (verisi yoktu) | Kalkar | Hiç veri yoktu; hız sınırı levhaları ayrı levha oldu |
| Bilinmeyen kategori → boş sayfa | 404 | |
| 118 levha verisi (`public/signs.json`) | Çekirdek ~90 levha v1.0, kalanlar v1.1 (K9); bkz. `docs/migration/signs.md` | Çince karakter düzeltilir; 117 hotlink ve 2 kırık görsel kendi SVG'lerimizle değişir |
| `metadata` (source cysigns.online, totalSigns 144) | Kalkar; sayı veriden derlenir, kaynak `content/sources/signs.json` | 144 yanlıştı |

## 8.6 Ehliyet testi (`/quiz/:licenseType`)

| Mevcut öğe | Yeni yeri | Not |
|---|---|---|
| İlerleme çubuğu | Yazılı sınav provası ve konu çalışmasında, ekran okuyucuya açık | |
| "{type} License Test" rozeti | "Otomobil · Yazılı sınav provası" gibi | Harf yerine araç (K8) |
| "Question {i} / {n}" | Aynı sayaç; n her zaman söylenen sayı | 19 soru sorunu kalkar |
| Kategori etiketi (Signs, Speed Limits, Right of Way, Traffic Rules, Driving Duties) | Altı sınav konusu (`content/topics.json`) ve dersler | Eski beş kategori derslere dağılır, bkz. `docs/migration/questions.md` |
| Soru metni `h2` | `fieldset` ve `legend` (PLAN 4.4) | |
| Levha resmi, alt "Traffic sign" | Levha verisinden gelen resim; alt metin cevabı vermez | 2 yanlış eşleşen resim düzelir |
| 4 şık, karıştırılmıyor, anında geçiyor | Gerçek radyo düğmeleri, ekranda karıştırma, geri bildirim | |
| "Loading Test..." sonsuz | Kalkar; soru yetmezse derleme durur | |
| 8 levha + 12 diğer soru seçimi | Yönetmelikteki konu dağılımı (`content/exam-profile.json`) | 8:12 fikri levha sınavı provasında ve levha sorularında yaşar |
| Store: başlangıç ve bitiş zamanı | Sonuçta geçen süre gösterilir | Artık kullanılıyor |
| `QUIZ_CONFIG` (20 soru, %70) | `content/exam-profile.json` | %70 KKTC'de dayanaksızdı; yönetmelikte 50'de 40 |
| 40 soruluk banka | Yeni soru dosyaları `content/questions/*.json`; her sorunun akıbeti `docs/migration/questions.md` | Silinecekler orada gerekçesiyle: s5 (ABD sarı karo), rw4 (4-way stop), dd4 (AB sürüş süresi), dd7 (tehlikeli madde, EH yok) vb. |
| `difficulty` (gösterilmiyordu) | Veride kalır; konu çalışmasında rozet olarak (QuestionCard fikri) | |
| `correctOptionIds[]` | Tek `answer` alanı | Çoklu cevap hiç kullanılmadı |
| Ehliyet kapsamı A 31, A1 0, B 34, C 34, D 33, EH 34 | `tracks`: car, moto, heavy | EH kalkar: KKTC'de böyle bir sınıf yok |
| `public/signs/` 13 SVG (6'sı kullanılmıyor) | Yeni SVG seti `public/signs/<kategori>/` | Eski dosyalar yeni çizimlerle değişir, bkz. `docs/migration/signs.md` |

## 8.7 Sonuç (`/results`)

| Mevcut öğe | Yeni yeri | Not |
|---|---|---|
| "🎉 Ready for Traffic!" / "⚠️ More Practice Needed" | Sonuç başlığı "Geçer notun üstündesin" / "Biraz daha çalışmalısın" türü, emojisiz | Metin tonu korunur (keep list 11) |
| Puan dairesi "{%}" | Aynı daire; doğru sayısı, geçer not ve süre eklenir | |
| Geri bildirim cümleleri | Sonuç sayfasında Türkçe ve İngilizce karşılıklarıyla | Keep list 11 |
| "Take Another Test" → ana sayfa | "Aynı sınavı yeniden başlat" ve "Hatalarımı çalış" | Eve gitmesi hataydı |
| "Review Incorrect Answers" listesi | Sonuç sayfasında, levha resmiyle; yanlışlar Hatalarım'a eklenir | Keep list 6 |
| Yönlendirme koruması, yenilenince kayıp | Sonuç localStorage'dan okunur | |

## 8.8 Senaryolar (`/scenarios`)

| Mevcut öğe | Yeni yeri | Not |
|---|---|---|
| "← Back to Home", "🎬 Scenario Practice", "Real-world driving situations" | `/senaryolar/` başlığı "Senaryolar" | Geri düğmesi ve emoji kalkar |
| "Scenario {i} / 10", "Score" ve çubuk | Aynı | |
| Kategori rozeti (urban, highway, weather, emergency, parking) | `category`: urban, rural, weather, emergency, parking | "highway" → "rural": KKTC'de otoyol yok |
| Zorluk rozeti renkleri | Erişilebilir renk token'larıyla | Kontrast hatası |
| Büyük emoji görsel | Levha ya da basit çizim (F2.4) | K10 |
| 3 şık, kilitlenme, ✓/✗ | Aynı desen, ikon ve yazıyla; şıklar karıştırılır | Keep list 3 |
| Geri bildirim kutusu, "Next Scenario →" | Aynı | |
| Sonuç "Quiz Complete!", kademeli mesajlar, "Try Again", "Back to Home" | "Senaryolar bitti: 15'te 12"; mesajlar korunur, emoji ve ünlem kalkar; yanlış senaryolar listelenir | Keep list 11 |
| "Loading scenarios..." | Ortak durumlar | Hata durumu eklenir |
| 15 senaryo | `content/scenarios.json`, en az 30; her birinin akıbeti `docs/migration/scenarios.md` | Senaryo 5 (sağa çekilmek) ve 7 (yokuşta park) sağ trafiğe göreydi, düzelir |
| `metadata` | Kalkar; sayılar veriden | |

## 8.9 Geçmiş (`/history`)

| Mevcut öğe | Yeni yeri | Not |
|---|---|---|
| "Test History" / "Track your progress…" | `/ilerleme/` "İlerleme" | Artık gerçek |
| Boş durum "No History Yet" | İlerleme sayfasının boş durumu (benchmark 3.5) | Emoji ve ünlem kalkar |
| "Start Practice Test" → `/quiz` (kırık), "Back to Home" | "Deneme sınavına gir" → `/deneme-sinavi/` | Geri düğmesi kalkar |

## 8.10 Ehliyet seçimi (`/quiz`)

| Mevcut öğe | Yeni yeri | Not |
|---|---|---|
| "Select License Type" / "Choose the vehicle class…" | `/deneme-sinavi/` başlığı | |
| Kartlar B Car, A Motorcycle, C Truck, D Bus, EH Hazard | Üç araç kartı (K8) | AB harfleri KKTC'de farklı anlama geliyor; EH sınıfı yok |
| "Continue" (hep kapalı) | Her kart doğrudan bağlantı | |

## 8.11 Kullanılmayan kod ve veri

| Mevcut öğe | Yeni yeri | Not |
|---|---|---|
| `ResultsView.vue` (rotasız) | Silinir (F0.4); "Change License", "Retake Test" fikirleri yeni sonuç sayfasında | Var olmayan store işlevlerini çağırıyordu |
| `ResultsSummary.vue` "PASSED/FAILED", "{n} correct out of {total}" | Yeni sonuç bileşeni (F3.4) | Keep list 8 |
| `QuestionCard.vue` karıştırma, zorluk rozeti | Yeni soru bileşeni (F3.1) | Keep list 8 |
| `QuizProgress.vue` | Yeni ilerleme göstergesi | Keep list 8 |
| `LicenseCard.vue` | Araç kartı bileşenine dönüşür | |
| `HelloWorld.vue` | Silinir | Vite iskeleti |
| `src/assets/vue.svg`, `public/vite.svg` | Silinir | İskelet logoları |
| `studyData.js` "Signs & Markings" ve aile ipuçları | Ders `signs-basics` ve kategori açıklamaları; bkz. `docs/migration/lessons.md` | "Disobeying these is a direct traffic offense" kaynakla doğrulanır |
| `studyData.js` ayrı hız levhaları 30/50/65/80/100, No Left Turn, Hospital, Turn Left | Levha setinde `prohibitory.speed-limit--30` vb., `prohibitory.no-left-turn`, `information.hospital`, `mandatory.turn-left` | En düşük hız 30 levhası v1.1 listesinde, bkz. `docs/migration/signs.md` |
| "Drive on the LEFT. Overtake on the RIGHT." | Soldan trafik sayfası (`content/pages/left-driving.json`) ve ders `overtaking` | `law` (s7) |
| "Roundabouts are Clockwise" | Soldan trafik sayfası ve ders `junctions` | `practice`; doğrulanacaklar M6 |
| "Give way to traffic from the RIGHT…" | Soldan trafik sayfası ve ders `right-of-way` | `law` (s1) |
| Trafik ışığı sırası ve "Flashing Amber = Yield" | Ders `junctions` ya da `right-of-way`, sayısız `practice`; ayrıntılı bölüm v1.1 | Doğrulanacaklar L10 |
| "Do not park on double yellow lines…", "Never block a hydrant" | Ders `parking`; çift sarı çizgi `law` yazılmaz | İngiltere kuralı, KKTC'de doğrulanmadı (M10) |
| Cockpit Drill | Ders `vehicle` | `practice` |
| POWER kontrolleri | Ders `vehicle`, "hatırlatma yolu" olarak | kktc-regulations 7.2 dd1 |
| Takip mesafesi 2/4/10 saniye | Ders `speed` | Sayı içerdiği için kaynak bulunmazsa sayısız yazılır, bkz. `docs/migration/lessons.md`. "Only a fool…" cümlesi kalkar: aşağılayıcı ton |
| "Stop. Warn. Help. Call 112/155." | Ders `emergencies`; acil numaralar her yerde 155, 112, 199 | `law` (s1, s15) |
| "Warning triangle 45m back" | Ders `emergencies`, mesafesiz | KKTC'de kaynak yok (M11) |
| "50mg (0.05%) limit", "Zero tolerance is best" | Ders `fitness`; nefes sınırı ve toplu taşımada 0 eklenir | `law` (s8) |
| "License, Insurance, Registration, Tax" | Ders `documents` ve Ehliyet sayfası "Yanında taşıman gerekenler" | `law` (s1) |

## 8.12 README iddiaları

| Mevcut öğe | Yeni yeri | Not |
|---|---|---|
| Başlık "🚗 TRNC Driving Safety" | README başlığı "Test2Drive" (F7.1) | K4 |
| "144+ traffic signs" | Gerçek sayı veriden | Sahteydi (118) |
| "License-specific quizzes (A, A1, B, C, D, EH)" | Üç araç yolu | EH yok, A1 kırıktı |
| "Instant Feedback" | README özellik listesinde | Doğru |
| "Progress Tracking" | README özellik listesinde, artık gerçek | |
| "Bilingual: English interface with Turkish translations" | "Türkçe ve İngilizce, eksiksiz" | K2 |
| "Responsive Design" | README'de, ölçüm kapısıyla | |
| Teknoloji yığını | README; vite-ssg, vue-i18n, vite-plugin-pwa eklenir | K13 |
| "Node.js 16+" | Doğru sürüm (Node 20.19+ ya da 22.12+) | Yanlıştı |
| Proje yapısı `public/signs/`, `signs.json` | `content/` yapısı (CONTENT-SCHEMA) | |
| "Ocean Blue color palette" ve tasarım maddeleri | `docs/DESIGN.md`, "teal" olarak | Palet tealdi |
| Ehliyet listesi A1, A, B, C, D, EH | Bugünkü KKTC sınıfları ve yeni sistem: Ehliyet sayfası "Ehliyet sınıfları" | `law` (s10, s4) |
| "Contributions are welcome" | README katkı bölümü, içerik ekleme rehberiyle | |
| "MIT License" (LICENSE dosyası yok) | Asil lisansı seçer; seçilene kadar iddia kalkar | Sahte iddia |
| "Traffic sign data and regulations based on TRNC traffic laws" | Kaynaklar sayfası ve `content/sources/` | Artık kaynaklı |
