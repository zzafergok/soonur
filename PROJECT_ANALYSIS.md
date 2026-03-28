# Project Analysis: Soonur - Countdown Tracking App

Bu rapor, Soonur projesinin teknik mimarisini, iş modelini ve uygulama detaylarını analiz eder.

## 1. Teknik İskelet (Technical Skeleton)

Soonur, hassas zaman hesaplamaları ve SEO odaklı bir mimari üzerine kurulmuş "lightweight" ama güçlü bir uygulamadır:

- **Frontend Core**: Next.js 16 (React 19) ile en yeni framework yetenekleri kullanılmıştır.
- **Zaman Yönetimi**: `date-fns` kütüphanesi ile karmaşık tarih farkı hesaplamaları ve zaman dilimi yönetimi profesyonelce implement edilmiştir.
- **Arama Motoru Optimizasyonu (SEO)**: `sitemap.ts`, `robots.ts` ve özel `seo/` bileşenleri ile Google anahtar kelime sıralamalarında ("YKS ne zaman", "KPSS geri sayım" vb.) üstte yer almayı hedefler.
- **Görsel Tasarım**: Tailwind CSS, Radix UI ve Framer Motion ile geri sayım kartlarına dinamik ve göz yormayan animasyonlar eklenmiştir.
- **Veri Mimarisi**: Etkinlikler `src/data/countdown-events.ts` dosyasında kategorize edilmiş (Sınavlar, Tatiller, Özel Günler) ve modüler bir yapıda tutulur.

## 2. İş İskeleti (Business Skeleton)

Soonur, Türkiye odağında bir **Event & Exam Tracking Platform** (Etkinlik ve Sınav Takip Platformu) olarak konumlanır:

- **Değer Önermesi**: Sınavlara ve önemli günlere hazırlanan kullanıcıların; "Kaç gün kaldı?" sorusuna en hızlı, en güvenilir ve en görsel şekilde yanıt vererek zaman yönetimlerine yardımcı olur.
- **Hedef Kitle**: Öğrenciler (LGS/YKS), memur adayları (KPSS), öğretmenler ve resmi tatilleri takip etmek isteyen tüm kullanıcılar.
- **Domain Uzmanlığı**: Türkiye'ye özgü sınav takvimini (ÖSYM/MEB tabanlı) merkeze alarak global rakiplerinden yerelleşme gücüyle ayrışır.

## 3. Uygulama Detayları (Implementation Details)

- **Countdown Components**: `src/components/countdown` klasörü, saniye hassasiyetinde güncellenen reaktif saatler ve görsel ilerleme çubuklarını (Progress bar) yönetir.
- **Kategori Bazlı Navigasyon**: `/categories` rotası ile kullanıcıların ilgi alanlarına (Örn: Sadece ÖSYM sınavları) hızlıca ulaşması sağlanmıştır.
- **Merkezi Veri Yönetimi**: Tüm sınav tarihleri tek bir JSON benzeri yapıda (`countdown-events.ts`) toplandığı için yeni bir etkinlik eklemek veya güncellemek saniyeler sürer.
- **Mobil Uyumluluk**: Mobil-first yaklaşımıyla, sınav sonuçlarını bekleyen genç kitlenin telefonlarından kolayca erişebileceği şekilde optimize edilmiştir.

## 4. İnisiyatif & Eksik Parça Analizi (Initiative & Missed Parts)

- **Push Notifications**: Önemli sınavlara son düzlükte hatırlatıcı göndermek için `Firebase Cloud Messaging` veya `Web Push API` entegrasyonu inisiyatifimdir.
- **PWA Desteği**: Uygulamanın bir "ikon" olarak telefona eklenmesi ve internet bağlantısı kopukken de (offline) geri sayımın sürmesi (Service Workers) kritik bir eksiktir.
- **Kişiselleştirilmiş Favoriler**: Kullanıcıların "kendi sınavlarını" (Örn: Okul vizesi) veya favori kategorilerini kaydedebileceği bir in-memory (`Zustand`) veya persistent (`Local-storage`) yapı eklenmelidir.
- **Exam Insight**: Sınava kaç gün kaldığının yanında, o sınava katılım istatistikleri veya geçen seneki taban puanlar gibi ek "ince bilgiler" (insight) sunulabilir.

## 5. Skill Uyumluluk Analizi (Skill Compatibility)

- **Mevcut Durum**: Proje kullanıcı odaklı bir izleme aracıdır.
- **Uyumlu Skill'ler**:
    - `seo-growth-architect`: Organik trafik artışı için.
    - `ux-conversion-specialist`: Kullanıcıyı sayfada tutma ve geri gelmesini sağlama (retention) için.
- **Öneri**: Tarih ve zaman manipülasyonları için `date-time-logic-expert` skill'i bu projenin "çekirdek" lojiğini daha iyi koruyabilir.
