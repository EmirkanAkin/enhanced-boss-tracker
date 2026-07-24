"use client";
import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [digerSecildiMi, setDigerSecildiMi] = useState(false);

  // ─────────────────────────────────────────────────────────────
  // 🎓 CUSTOM DROPDOWN STATE'İ
  // ─────────────────────────────────────────────────────────────
  const [acilirMenuAcikMi, setAcilirMenuAcikMi] = useState(false);
  const acilirMenuRef = useRef(null);

  // Dropdown dışına tıklayınca kapat
  useEffect(() => {
    function handleClickOutside(e) {
      if (acilirMenuRef.current && !acilirMenuRef.current.contains(e.target)) {
        setAcilirMenuAcikMi(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Oyun listesi — dropdown'da gösterilecek seçenekler
  const oyunSecenekleri = ["Elden Ring", "Sekiro", "Bloodborne", "Dark Souls III", "Dark Souls II", "Dark Souls", "Demon's Souls", "Lies of P", "Diğer"];

  // ─────────────────────────────────────────────────────────────
  // 🎓 BOSS LİSTESİ STATE'İ
  // ─────────────────────────────────────────────────────────────
  const [bosslar, setBosslar] = useState([
    { id: 1, isim: "Margit, the Fell Omen", oyun: "Elden Ring", olumler: 7, kesildiMi: false },
    { id: 2, isim: "Genichiro Ashina", oyun: "Sekiro", olumler: 19, kesildiMi: false },
    { id: 3, isim: "Malenia, Blade of Miquella", oyun: "Elden Ring", olumler: 43, kesildiMi: false },
    { id: 4, isim: "Godrick the Grafted", oyun: "Elden Ring", olumler: 12, kesildiMi: true },
    { id: 5, isim: "Lady Butterfly", oyun: "Sekiro", olumler: 8, kesildiMi: true },
    { id: 6, isim: "Vicar Amelia", oyun: "Bloodborne", olumler: 3, kesildiMi: true },
  ]);

  // ─────────────────────────────────────────────────────────────
  // 🎓 FORM STATE'LERİ
  // ─────────────────────────────────────────────────────────────
  const [bossAdi, setBossAdi] = useState("");
  const [seciliOyun, setSeciliOyun] = useState("Elden Ring");

  // ─────────────────────────────────────────────────────────────
  // 🎓 HESAPLANMIŞ DEĞERLER (Derived State)
  // ─────────────────────────────────────────────────────────────
  const kesilenSayisi = bosslar.filter(b => b.kesildiMi).length;
  const toplamSayi = bosslar.length;
  const toplamOlum = bosslar.reduce((toplam, b) => toplam + b.olumler, 0);

  return (
    <main className="min-h-screen flex flex-col items-center pt-24 px-8 relative overflow-hidden bg-[#050505]">

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 🎓 HEADER — Minimal & Zarif                                */}
      {/* ─────────────────────────────────────────────────────────── */}
      <header className="w-full max-w-5xl flex justify-between items-end pb-4 mb-6 relative">
        {/* Alt gradient çizgi — parlaklaştırıldı */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4af37] to-transparent opacity-70"></div>

        {/* Sol Taraf: İkon ve Başlık */}
        <div className="flex items-center gap-3">
          <div className="text-[#8A7A4A] opacity-80">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 3v18M3 12h18" />
              <circle cx="12" cy="12" r="2.5" />
            </svg>
          </div>
          <div>
            <h1 className="font-serif text-[18px] tracking-[0.2em] text-[#E6DFC8] uppercase font-normal">
              Düşenlerin Külliyatı
            </h1>
            <p className="font-sans text-[9px] tracking-[0.35em] text-[#8A7A4A] mt-0.5 opacity-80 uppercase">
              Boss Takipçisi
            </p>
          </div>
        </div>

        {/* Sağ Taraf: İstatistikler */}
        <div className="flex items-center gap-5 font-sans">
          <div className="flex flex-col items-center">
            <span className="text-[#8A7A4A] text-[8px] tracking-[0.2em] mb-0.5 opacity-70">KESİLEN</span>
            <span className="font-serif text-xl text-[#E6DFC8] font-light">{kesilenSayisi}</span>
          </div>

          <div className="w-px h-6 bg-[#332b1f]"></div>

          <div className="flex flex-col items-center">
            <span className="text-[#8A7A4A] text-[8px] tracking-[0.2em] mb-0.5 opacity-70">TOPLAM</span>
            <span className="font-serif text-xl text-[#E6DFC8] font-light">{toplamSayi}</span>
          </div>

          <div className="w-px h-6 bg-[#332b1f]"></div>

          <div className="flex flex-col items-center">
            <span className="text-[#8A7A4A] text-[8px] tracking-[0.2em] mb-0.5 opacity-70">ÖLÜMLER</span>
            <span className="font-serif text-xl text-[#E6DFC8] font-light">{toplamOlum}</span>
          </div>

          <div className="w-px h-6 bg-[#332b1f]"></div>

          {/* Ses İkonu */}
          <div className="ml-2 text-[#8A7A4A] opacity-40 hover:opacity-80 cursor-pointer transition-opacity">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
            </svg>
          </div>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────── */}
      {/* 🎓 INPUT PANELİ                                        */}
      {/* ─────────────────────────────────────────────────────── */}
      <div className="w-full max-w-5xl border border-[#4a3f2d]/50 p-6 relative flex flex-col gap-4 bg-yellow-500/1">
        {/* Köşe Süslemeleri */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#8A7A4A]"></div>
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#8A7A4A]"></div>
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#8A7A4A]"></div>
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#8A7A4A]"></div>

        <div className="flex gap-4 items-start">
          {/* Boss İsmi Inputu */}
          <div className="flex-1 border border-[#332b1f] bg-[#050505] transition-colors hover:border-[#4a3f2d] focus-within:border-[#8A7A4A]">
            <input
              type="text"
              placeholder="BOSS ADINI GİRİN..."
              value={bossAdi}
              onChange={(e) => setBossAdi(e.target.value)}
              className="w-full bg-transparent px-5 py-3 text-xs font-serif tracking-widest text-[#E6DFC8] placeholder:text-[#332b1f] focus:outline-none uppercase"
            />
          </div>

          {/* ─────────────────────────────────────────────────── */}
          {/* 🎓 CUSTOM DROPDOWN                                  */}
          {/* ─────────────────────────────────────────────────── */}
          <div className="w-56 flex flex-col gap-2 relative" ref={acilirMenuRef}>
            {/* Dropdown Trigger */}
            <div
              className="border border-[#332b1f] bg-[#050505] transition-colors hover:border-[#4a3f2d] relative cursor-pointer"
              onClick={() => setAcilirMenuAcikMi(!acilirMenuAcikMi)}
            >
              <div className="px-4 py-3 text-xs font-serif tracking-widest text-[#E6DFC8] uppercase">
                {digerSecildiMi ? "DİĞER..." : seciliOyun.toUpperCase()}
              </div>
              <div className={`absolute right-3 top-1/2 -translate-y-1/2 text-[#8A7A4A] transition-transform ${acilirMenuAcikMi ? "rotate-180" : ""}`}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>
            </div>

            {/* DROPDOWN MENÜ */}
            {acilirMenuAcikMi && (
              <ul className="absolute top-full left-0 right-0 mt-1 border border-[#332b1f] bg-[#0e0c08] z-50 max-h-72 overflow-y-auto custom-scrollbar">
                {oyunSecenekleri.map((oyun) => (
                  <li
                    key={oyun}
                    className={`px-4 py-2.5 text-xs font-serif tracking-widest cursor-pointer transition-all
                      ${(oyun === "Diğer" && digerSecildiMi) || (!digerSecildiMi && oyun === seciliOyun)
                        ? "text-[#d4af37] bg-[#1a1508]"
                        : "text-[#8A7A4A] hover:text-[#d4af37] hover:bg-[#1a1508] hover:pl-5"
                      }`}
                    onClick={() => {
                      if (oyun === "Diğer") {
                        setDigerSecildiMi(true);
                        setSeciliOyun("");
                      } else {
                        setDigerSecildiMi(false);
                        setSeciliOyun(oyun);
                      }
                      setAcilirMenuAcikMi(false);
                    }}
                  >
                    {oyun}
                  </li>
                ))}
              </ul>
            )}

            {/* "Diğer" seçilince altına oyun adı inputu açılır */}
            {digerSecildiMi && (
              <div className="border border-[#332b1f] bg-[#050505] transition-colors hover:border-[#4a3f2d] focus-within:border-[#8A7A4A]">
                <input
                  type="text"
                  placeholder="OYUN ADINI GİRİN..."
                  autoFocus
                  value={seciliOyun}
                  onChange={(e) => setSeciliOyun(e.target.value)}
                  className="w-full bg-transparent px-5 py-3 text-xs font-serif tracking-widest text-[#E6DFC8] placeholder:text-[#332b1f] focus:outline-none uppercase"
                />
              </div>
            )}
          </div>

          {/* EKLE BUTONU */}
          <button
            className={`w-40 border text-xs font-serif tracking-[0.2em] py-3 transition-all flex justify-center items-center gap-2 uppercase self-center ${bossAdi.trim()
              ? "border-[#4a3f2d] bg-[#181208] text-[#8A7A4A] hover:bg-[#1e1810] hover:text-[#b8a665] cursor-pointer"
              : "border-[#332b1f] bg-[#050505] text-[#332b1f] cursor-not-allowed"
              }`}
          >
            <span>+</span> EKLE
          </button>
        </div>
      </div>
    </main>
  );
}