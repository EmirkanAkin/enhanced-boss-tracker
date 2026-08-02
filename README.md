# Düşenlerin Külliyatı - Boss Takipçisi 🗡️

Soulslike oyunları (Elden Ring, Sekiro, Bloodborne vb.) için özenle tasarlanmış, görsel olarak çarpıcı bir Boss Takipçisi web uygulaması. Bu proje, oyuncuların en zorlu düşmanlara karşı ilerlemelerini, ölümlerini ve zaferlerini takip etmeleri için dinamik ve etkileşimli bir başvuru kaynağı (külliyat) olarak hizmet vermektedir.

## ✨ Özellikler

- **Dinamik Durum (State) Yönetimi:** React'in güçlü state yönetimi sayesinde toplam boss, toplam ölüm ve kesilen düşman sayılarının gerçek zamanlı olarak takip edilmesi.
- **Özel Temalı Arayüz ve Deneyim (UI/UX):** FromSoftware oyunlarının estetiğinden ilham alan, özel tasarım karanlık fantastik bir arayüz. Tamamen Tailwind CSS ile oluşturulmuş özel açılır menüler (dropdown), karmaşık CSS stilleri ve duyarlı (responsive) tasarımlar içerir.
- **Koşullu Görselleştirme (Conditional Rendering):** Etkileşimli öğeler (örneğin 'Ekle' butonu), kullanıcı girdisinin geçerliliğine bağlı olarak görsel durumlarını dinamik olarak değiştirir.
- **Genişletilebilir Oyun Seçimi:** Kullanıcılar önceden tanımlanmış popüler oyunlardan seçim yapabilir veya dinamik form yapısı sayesinde kendi özel oyun isimlerini sorunsuzca ekleyebilirler.

## 🛠️ Kullanılan Teknolojiler

- **Framework:** [Next.js 15+](https://nextjs.org/) (App Router)
- **Kütüphane:** [React](https://react.dev/)
- **Stil (Styling):** [Tailwind CSS v4](https://tailwindcss.com/)
- **Dil:** JavaScript (ES6+)

## 🧠 Neler Öğrendim ve Uyguladım?

Bu projeyi geliştirmek, aşağıdaki konuları derinlemesine keşfetmemi ve uygulamamı sağladı:
- **İleri Seviye Tailwind CSS:** İsteğe bağlı değerler (arbitrary values), özel CSS değişkenleri, katmanlı renk geçişleri (gradient) ve özel kaydırma çubukları (scrollbar) gibi sözde-öğe (pseudo-element) stillerini kullanarak piksellerine kadar mükemmel, son derece spesifik bir tasarım elde etme.
- **React Hook'ları (useState, useEffect, useRef):** Tarayıcıların varsayılan sınırlamalarını aşmak için sıfırdan tamamen özelleştirilmiş ve erişilebilir arayüz bileşenleri (özel açılır menü vb.) inşa etme.
- **Türetilmiş Durum (Derived State):** Fazladan state değişkenleri (gereksiz veriler) tutmadan, toplam ölüm ve kesilen boss sayıları gibi istatistikleri anlık ve etkili bir şekilde hesaplama.

## 📜 Lisans

Bu proje açık kaynaklıdır ve MIT Lisansı altında kullanılabilir.
