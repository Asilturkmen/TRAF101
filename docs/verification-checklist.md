# Doğrulanacaklar listesi

Bu liste `docs/research/kktc-regulations.md` bölüm 8 ve `docs/research/road-signs.md` bölüm 6'daki açık soruları tek yerde toplar. Yayını engellemez (PLAN K11, bölüm 5.1). Bir madde doğrulanınca ilgili içeriğin etiketi `law` olur, `sourceId` ve `reviewedAt` güncellenir, bu satıra cevap ve tarih yazılır.

- **Hazırlayan:** rehber ajanı, 2026-10-20
- **Etiketler:** `law` = Kaynak, `secondary` = İkincil kaynak, `practice` = Genel uygulama, "yayınlanmıyor" = sitede hiç yer almıyor
- **Kime:** TD = Trafik Dairesi (BUB, Sürüş Ehliyeti ve Müfettişleri Şubesi), Kurs = bir sürücü kursu ya da TKÖD, Polis = Polis Genel Müdürlüğü Trafik Şubesi

## Mevzuat ve sınav (kktc-regulations.md bölüm 8)

| # | Soru | Neden önemli | Sitede bugün | Kime |
|---|---|---|---|---|
| M1 | Yazılı e-sınav 2026 sonunda başladı mı, hangi dillerde? | Sınav sayfasının ve iki prova modunun çerçevesi buna bağlı | Sözlü sınav `secondary` (s24, Nisan 2026). Yazılı biçim `law` (yönetmelik) ama "henüz uygulanmıyor" etiketiyle. Dil sorusu `practice`: "kursuna sor" | TD, Kurs |
| M2 | Trafik Eğitim Kitabı ya da "Karayolları Trafik Kuralları" kitabı herkese açık mı, İngilizcesi var mı? | Hazırlık sınavı bu kitaba dayanıyor; kaynak olarak gösterilebilir | Kaynak olarak kullanılmıyor. Hakkında sayfası "herkese açık kopyasını bulamadık" diyor | TD, Kurs |
| M3 | Eski sınıflar A, B, C, E, F, G, J, K için yaş sınırları ne? Ağır kamyon (B) 21 mi 22 mi? | Araç kartlarında ve Ehliyet sayfasında yaş yazılamıyor | Yayınlanmıyor (çelişki). `tracks.json` içinde `minAge: null`; sayfa "kursuna ya da Trafik Dairesi'ne sor" diyor | TD |
| M4 | Turist statüsü bitince ehliyet çevirmek için süre ne kadar (1 ay, 30 gün, izin süresi)? | Öğrenciler bu süre içinde yabancı ehliyetle sürebilir mi, bilmek istiyor | Süre yazılmıyor. `practice` bölümü: "iznin çıkar çıkmaz başvur, süreni oradan öğren". Polis riski `secondary` (s36) | TD, Polis |
| M5 | Acil araca yol verirken hangi tarafa yanaşılır? | Soldan trafiğin en kritik farkı; eski senaryo 5 sağa çekiyordu | `practice`: "sinyal ver, sola yanaş". Yol vermemenin suç olduğu `secondary` (s31) | Polis, Kurs |
| M6 | Dönel kavşakta dönüş yönü (saat yönü) ve çok şeritli çemberde şerit kuralları | Kavşak dersi ve sorular buna dayanıyor | Öncelik `law` (s1). Saat yönü `practice`. Çok şeritli çember için "kursuna sor". Not: BUB broşüründeki levha resmi saat yönünü gösteriyor (road-signs R4); broşür maddesiyle `law`'a yükseltilebilir | Kurs, TD |
| M7 | Okul bölgesi, römork, en düşük hız ya da gece hız kuralı var mı? | Eski sp5, sp6, sp8 ve senaryo 1 bu sayılara dayanıyordu | Sayısız `practice`: "okul önünde yavaşla, levhaya uy". Sayı yayınlanmıyor | TD, Polis |
| M8 | Yeni sürücüler ya da toplu taşıma dışındaki ticari sürücüler için daha düşük alkol sınırı var mı? 2025 metni ne diyor? | Alkol soruları ve "kişisel durum" dersi | Genel sınır ve toplu taşımada 0 `law` (s8). Yeni sürücü için hiçbir şey yazılmıyor | TD, Polis |
| M9 | Eski sistemde yeni sürücüler için deneme süresi var mı? | "İlk ehliyet" anlatımı ve sorular | Yalnız "ilk ehliyet bir yıllık" `law` (s6). Deneme süresinden söz edilmiyor | TD |
| M10 | Sarı karo "ana yol" levhası, çift sarı çizgi, çift beyaz orta çizgi ve yanıp sönen sarı ışık KKTC'de var mı, anlamı ne? | Eski s5 ve tr7 soruları, `studyData.js` maddeleri | Levha verisinde `kktc.status: unverified`. Çift sarı çizgi ve yanıp sönen sarı `law` olarak yazılmıyor; gerekirse sayısız `practice` | Kurs, Polis |
| M11 | Özel araçta reflektör ve ilk yardım çantası zorunlu mu? | Arıza ve kaza dersi | `practice`: "uyarı aracın varsa kur". Yangın söndürücü `secondary` (s38) | Polis |
| M12 | Profesyonel sürücüler için takograf ve sürüş süresi kuralları | Ağır vasıta soruları; eski dd4 AB kuralıydı | Yayınlanmıyor. dd4 kaldırıldı | TD |
| M13 | PGM'nin resmi yıllık kaza istatistikleri | Güvenlik dersinde sayı kullanmak | Sayı kullanılmıyor; gerekirse yalnız `secondary`, "basında yer aldığı biçimiyle" | Polis |
| M14 | 2019 hız tablosu (Bildiri) o tarihten sonra değişti mi? | Hız soruları araç ve yol türüne göre ayrılıyor | Temel sınırlar `law` (s1). Araç türüne göre tablo `secondary` (s27) | TD |
| M15 | TC ile KKTC arasındaki ehliyet değişim protokolünün bugünkü durumu ve AB ehliyetlerinin çevrilmesi | Ehliyet sayfası, Türk ve AB'li öğrenciler | Anlaşmanın varlığı `law` (s13). Uygulama "Trafik Dairesi'ne sor". AB için `practice`: "aksi söylenmedikçe Türkiye dışı ehliyet yolu" | TD |

## Levhalar (road-signs.md bölüm 6)

| # | Soru | Neden önemli | Sitede bugün | Kime |
|---|---|---|---|---|
| L1 | 1974 Motorlu Araçlar ve Yol Trafik Tüzüğü'nde bir levha cetveli var mı, numaraları ne? | Levhaları maddeye bağlayıp `law` etiketi vermek | Levhalar Viyana sözleşmesi ve Türkiye tasarımına göre çiziliyor; her levhada `kktc.status` | TD |
| L2 | 2003 tarihli KKTC Karayolları Trafik Kuralları Kitabı'nın güncel baskısı ne? Kursların pembe kitapçığı fiilî levha listesi mi? | Sözlü sınavda sorulan levha seti | Sınav sayfasında pembe kitapçık `secondary` (s26) olarak anılıyor | Kurs, TD |
| L3 | Yalnız "DUR" mu, "DUR / STOP" mu, ikisi de mi yasal? Yeni levhalarda STOP hâlâ kullanılıyor mu? | Çekirdek levha çizimi | DUR çiziliyor; `kktc.status` levha ajanının kararına göre | TD |
| L4 | KKTC "yol ver" levhasında "YOL VER" yazısı var mı? | Levha çizimi | Levha verisinde not olarak; doğrulanmadı | TD, Kurs |
| L5 | Yön levhalarının renk düzeni (ana yollar mavi mi yeşil mi), TR/EN çift dil kuralları | Bilgi levhaları | v1.0 çekirdek sette yön levhası yok | TD |
| L6 | Sarı karo "ana yol" levhası KKTC'de kullanılıyor mu? | M10 ile aynı; eski s5 sorusu | `kktc.status: unverified`; sorularda kullanılmıyor | Kurs, Polis |
| L7 | KKTC'de otoyol levha sınıfı var mı? | Eski tr8 ve senaryo 12 otoyol diliyle yazılmıştı | Yayınlanmıyor; içerik "çift şeritli yol" diyor | TD |
| L8 | Tek/çift gün parkı, kar zinciri, açılır köprü, alçak uçan helikopter, karaya oturma riski, su kirletici yasağı, "GO" diski, polis ya da gümrük "dur" levhaları kuzeyde var mı? | v1.1 levha listesi | Çekirdek sette yok; v1.1'de karar | TD |
| L9 | Yol çizgilerinin anlamı: orta çizgiler, sarı kaldırım çizgileri, zikzaklar, otobüs şeritleri | v1.1 yol çizgileri bölümü | v1.0'da yok; sorular bu konulara sayı ya da kesin kuralla girmiyor | Kurs, Polis |
| L10 | Trafik ışığı sırası (kırmızı+sarı evresi var mı), yanıp sönen sarı, ok ışıkları, yaya ışıkları | Işık soruları, `studyData.js` ışık maddesi | v1.0'da ayrı bölüm yok; ışık soruları `practice` | Polis, Kurs |
| L11 | Polis el işaretleri | v1.1 bölümü | v1.0'da yok | Polis |
| L12 | Kızılay ilk yardım levhasının tasarımı ("İLK YARDIM" yazısı var mı?) | `information.first-aid` çizimi | Kızılaylı çiziliyor; yazı ayrıntısı doğrulanmadı | TD |
| L13 | CySigns görsellerini üçüncü kişilere lisansladı mı? | Eski görsellerin hukuki durumu | Konu kapandı: eski görsellerin hepsi kendi çizimlerimizle değişiyor | Gerek yok |
| L14 | KKTC'de yasal levha tasarımlarını yeniden kullanmanın hukuki durumu (Fasıl 264, 1911 İngiliz yasası) | Ücretli bir sürüm düşünülürse | Ücretsiz sürümde kendi çizimlerimiz CC0; işlem yok | Avukat, yalnız ticari sürüm gündeme gelirse |

Toplam 29 madde: mevzuatta 15, levhalarda 14. Sürücü kursuna tek ziyarette sorulabilecek olanlar: M1, M2, M5, M6, M10, M11, L2, L4, L9, L10.
