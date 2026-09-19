# Proje Geliştirme ve Çalışma Kuralları

Bu kurallar, projedeki tüm görevlerde uygulanır. Kullanıcı arayüzü, form ve
TypeScript'e ilişkin kurallar özellikle bu alanlarda oluşturulan veya
değiştirilen kod için zorunludur.

## Görev planlama ve yürütme

- Üç veya daha fazla adım içeren ya da mimari karar gerektiren her görevde
  uygulamaya başlamadan önce plan yapın. Plan; kapsamı, varsayımları, riskleri,
  doğrulama adımlarını ve belirsizlikleri azaltacak teknik ayrıntıları içermelidir.
- Planı `tasks/todo.md` dosyasına işaretlenebilir maddeler halinde yazın.
  Uygulamaya geçmeden önce planın görevi doğru karşıladığını doğrulayın.
- İlerledikçe plan maddelerini tamamlandı olarak işaretleyin; her önemli adımda
  kısa bir üst düzey ilerleme özeti paylaşın.
- Görev tamamlandığında `tasks/todo.md` içindeki tamamlanmış todo maddelerini
  kaldırın; kalıcı kayıt için yalnızca inceleme/sonuç özetini bırakın.
- Bir adım başarısız olursa, hata ve logları inceleyin; körü körüne devam etmek
  yerine durup planı güncelleyin.
- Karmaşık olmayan, bariz düzeltmeler için gereksiz planlama ve süreç yükü
  oluşturmayın.
- Görev sonunda `tasks/todo.md` dosyasına yapılan değişiklikleri, doğrulama
  sonuçlarını ve açık kalan noktaları içeren bir inceleme bölümü ekleyin.

## Alt-ajan kullanımı

- Araştırma, keşif ve birbirinden bağımsız paralel analizler için alt-ajanları
  kullanarak ana bağlamı sade tutun.
- Karmaşık işlerde paralel çalışmadan yararlanın; her alt-ajana tek, açık ve
  odaklı bir sorumluluk verin.
- Küçük veya sıkı bağımlı işlerde koordinasyon maliyeti yaratacak gereksiz
  delegasyondan kaçının.

## Sürekli iyileştirme ve hata düzeltme

- Her oturum başında varsa `tasks/lessons.md` dosyasındaki, bu görevle ilgili
  dersleri gözden geçirin.
- Kullanıcıdan gelen her düzeltme veya geri bildirimden sonra
  `tasks/lessons.md` dosyasını güncelleyin. Aynı hatayı önleyecek açık,
  uygulanabilir kurallar kaydedin ve etkisiz kuralları iyileştirin.
- Hata raporlarında veya başarısız CI kontrollerinde ek yönlendirme beklemeden
  logları, hataları ve ilgili testleri inceleyin; kök nedeni giderin.
- Geçici çözümler yerine basit, kalıcı ve minimal etkili düzeltmeleri tercih edin.

## Tasarım kararları ve tamamlama ölçütü

- Basit olmayan değişikliklerde uygulamadan önce daha zarif ve daha küçük etkili
  bir çözüm olup olmadığını değerlendirin. Mevcut çözüm yamalı görünüyorsa,
  eldeki bilgilerle daha zarif çözümü uygulayın.
- Bir görevi, çalıştığı kanıtlanmadan tamamlandı olarak işaretlemeyin. Uygun
  testleri çalıştırın, hata loglarını kontrol edin ve gerektiğinde ana dalla
  farkı inceleyin.
- Son teslimden önce çözümün kıdemli bir mühendis incelemesinden geçebilecek
  sadelik, doğruluk ve sürdürülebilirlikte olup olmadığını değerlendirin.

## Mimari, dosya boyutu ve dizin standartları

- **Maksimum 250 Satır Kuralı:** Hiçbir component veya dosya 250 satırı aşmamalıdır. 250 satırı aşan dosyalar alt bileşenlere (sub-components), custom hook'lara veya yardımcı dosyalara bölünmelidir.
- **App Directory Kuralı:** `src/app` dizininde yalnızca standart Next.js dosyaları (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`, `route.ts` vb.) bulunmalıdır. Hiçbir UI bileşeni veya form `src/app` altında barındırılamaz; tüm ekran bileşenleri `src/features/[module]/` altında tutulmalıdır.
- **Klasör ve İsimlendirme Standartları:**
  - Tüm klasör isimleri **kebab-case** olmalıdır (`dashboard-page`, `theme-switcher`).
  - Atomik UI & Form bileşenleri **kebab-case** olmalıdır (`button.tsx`, `text-field.tsx`).
  - Feature bileşenleri **PascalCase** (`ProjectCard.tsx`) veya semantik **kebab-case** (`experience-card.tsx`) tutulmalı; `camelCase` dosya adı asla kullanılmamalıdır.
- **Server Component / Client Component Ayrımı:**
  - Sayfalar (`page.tsx`) varsayılan olarak **Server Component** kalmalıdır.
  - `"use client"` direktifi yalnızca DOM event'leri, React hook'ları (`useState`, `useEffect`) veya tarayıcı API'leri gereken alt bileşenlere indirilmelidir.
  - Veri çekme işlemleri Server Component içinde başlatılmalı, Client Component'lere props olarak aktarılmalıdır.

## Tasarım ve bileşenler

- **Mevcut Tasarım Dili:** Mevcut tasarım dilini koruyun. Yeni renk, tipografi, boşluk, kenarlık, gölge veya etkileşim dili yalnızca mevcut tasarım tokenları ve kalıplarıyla uyumluysa eklenebilir.
- **Core Bileşen Kullanım Zorunluluğu (HTML / Primitive Yasak):** Standart HTML elementleri veya harici primitive yapılar (`<button>`, `<input>`, `<textarea>`, `<select>`, `<label>`, `<table>`, `<tr>`, `<td>`, `<hr>`, `next/link` vb.) doğrudan kullanılmamalıdır. Karşılığı olan custom core bileşenleri (`@/components/core/button`, `@/components/core/input`, `@/components/core/textarea`, `@/components/core/select`, `@/components/core/label`, `@/components/core/table`, `@/components/core/card`, `@/components/core/badge`, `@/components/core/separator`, `@/components/core/link` vb.) kullanılmalıdır.
- **İçe Aktarma Yolları (Path / Alias Standartları):** Proje içi bileşen, modül, hook ve dosya içe aktarımlarında (`import`) göreceli derin yollar (`../../`) yerine daima proje kökünden başlayan alias (`@/components/core/...`, `@/components/forms/...`, `@/features/...`, `@/lib/...`, `@/types/...` vb.) kullanılmalıdır.
- **Tablo ve Veri Listeleri:** Liste veya tablo şeklinde veri sunumu gerektiren tüm ekran ve özelliklerde özel `div` grid simülasyonları yerine `@/components/core/table` bileşen ailesi (`Table`, `TableHeader`, `TableBody`, `TableRow`, `TableCell`, `TableHead`) kullanılmalıdır.
- **Responsive ve Erişilebilirlik:** Yeni arayüzler mevcut ekranların responsive davranışını, erişilebilirlik özelliklerini ve Tailwind sınıf düzenini takip etmelidir.
- **Standart Minimal Header Card Kuralı:** Sayfa başlığı olarak standart `@/components/layout/page-header-card` (`PageHeaderCard`) bileşeni kullanılmalıdır. Devasa fontlu, aşırı dikey alan işgal eden hantal banner'lar ve keyfi ad-hoc başlık blokları yasaktır.

## Formlar ve doğrulama

- Yeni veya değiştirilen form alanlarında önce `src/components/forms` altındaki
  alan bileşenlerini kullanın. Gerekli bir alan bileşeni yoksa, mevcut core
  bileşenlerini temel alarak bu dizinde yeniden kullanılabilir bir form bileşeni
  oluşturun; ekran içinde özel alan çözümü üretmeyin.
- Kullanıcıdan veri alan tüm form akışlarında `react-hook-form` kullanılmalıdır.
- Form şeması `zod` ile tanımlanmalı ve `@hookform/resolvers/zod` üzerinden
  forma bağlanmalıdır.
- İstemci doğrulaması tek başına yeterli değildir: API girişleri de aynı
  kuralları sunucu tarafında doğrulamalıdır.
- Hata mesajları kullanıcıya anlaşılır Türkçe ile gösterilmeli ve ilgili alanla
  ilişkilendirilmelidir.

## TypeScript

- Açık, dar ve yeniden kullanılabilir tipler tanımlayın; API istekleri, yanıtlar,
  bileşen props'ları ve form verileri tipli olmalıdır.
- `any` türünü hiçbir şekilde kullanmayın. Bilinmeyen dış veri için `unknown`
  kullanın; type guard, Zod ayrıştırması veya güvenli hata daraltması ile
  işleyin.
- `as` type assertion yalnızca doğrulama sonrası ve gerekli olduğunda
  kullanılabilir; doğrulanmamış veriyi zorla tipe dönüştürmek için kullanmayın.
- Yeni kodda `@ts-ignore`, `@ts-nocheck` veya TypeScript hata bastırma
  açıklamaları kullanmayın.

## UI / Görsel tasarımda "AI Kokusu" veren şeyler

- [ ] Aşırı gradient kullanılmıyor
- [ ] Her yerde shadow kullanılmıyor
- [ ] Her yerde glassmorphism kullanılmıyor
- [ ] Bento layout gereksiz kullanılmıyor
- [ ] Mor-siyah / neon / klişe pastel paletlere otomatik yaslanılmıyor
- [ ] Aşırı yuvarlatılmış köşeler kullanılmıyor
- [ ] Her elemente hover efekti eklenmiyor
- [ ] Blur glow efektleri abartılmıyor
- [ ] Noktalı arka planlar gereksiz kullanılmıyor
- [ ] Sparkle ikonları gereksiz kullanılmıyor
- [ ] Klişe font kombinasyonlarına otomatik yaslanılmıyor
- [ ] Sahte testimonial kullanılmıyor
- [ ] Devasa, ekranın dikey alanını gasp eden hantal banner başlıklar kullanılmıyor; standart `PageHeaderCard` kullanılıyor
- [ ] Mükerrer / iç içe yığılmış padding ve margin'ler ile boğulmuş layout'lar yapılmıyor

## React 19 ve kod kalitesi

- **`react-hooks/set-state-in-effect` Kuralı:** `useEffect` gövdesi içinde senkronize olarak doğrudan `setState` çağırmaktan kaçınılmalıdır.
- **Render Prop İçinde Hook Yasağı:** Form veya UI bileşenlerinin render callback'leri içine hook yerleştirilemez.
- Linter hataları bastırılmak yerine kod yeniden yapılandırılır.
- Kodda debug amaçlı `console.log`'lar production koduna bırakılamaz.

## Performans, Core Web Vitals (CWV) ve erişilebilirlik

- **Font Optimizasyonu:** `globals.css` içerisindeki `@import url(...)` harici font çağrıları kaldırılmalı; `next/font/google` kullanılmalıdır (Sıfır CLS, yerel cache).
- **Görsel Optimizasyonu:** `next/image` bileşeni kullanılmalı, `sizes`, `priority` (LCP öğeleri için) ve `alt` nitelikleri eksiksiz verilmelidir.
- **Erişilebilirlik (A11y):**
  - Tüm buton ve interaktif öğelerin minimum touch target boyutu `44x44px` olmalıdır.
  - `focus-visible` stilleri klavye navigasyonunu kusursuz desteklemelidir.

## Kalite kontrolü ve Pre-Flight (Definition of Done)

Bir iş tamamlanmadan "tamamlandı" olarak raporlanamaz. Değişiklik sonrasında şu kontroller sırasıyla çalıştırılmalı ve **0 hata** ile geçmelidir:

```bash
# 1. Tip Kontrolü
npx tsc --noEmit
# (veya npm run type-check)

# 2. Linter Kontrolü
npm run lint

# 3. Production Build Doğrulaması
npm run build
```
