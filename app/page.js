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
  // 🎓 TAB FİLTRE STATE'İ
  // Boss listesini oyuna göre filtrelemek için kullanılır.
  // "HEPSİ" seçiliyken tüm boss'lar gösterilir.
  // ─────────────────────────────────────────────────────────────
  const [aktifTab, setAktifTab] = useState("HEPSİ");

  // Boss listesindeki benzersiz oyun isimlerini çıkar
  const benzersizOyunlar = [...new Set(bosslar.map(b => b.oyun))];

  // ─────────────────────────────────────────────────────────────
  // 🎓 HESAPLANMIŞ DEĞERLER (Derived State)
  // ─────────────────────────────────────────────────────────────
  const kesilenSayisi = bosslar.filter(b => b.kesildiMi).length;
  const toplamSayi = bosslar.length;
  const toplamOlum = bosslar.reduce((toplam, b) => toplam + b.olumler, 0);

  return (
    <main className="min-h-screen flex flex-col items-center pt-24 px-8 relative overflow-hidden">

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 🎓 HEADER — Minimal & Zarif                                */}
      {/* ─────────────────────────────────────────────────────────── */}
      <header className="w-full max-w-5xl flex justify-between items-end pb-4 mb-6 relative">
        {/* Alt gradient çizgi — parlaklaştırıldı */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4af37] to-transparent opacity-90"></div>

        {/* Sol Taraf: İkon ve Başlık */}
        <div className="flex items-center gap-3">
          <div className="text-[#b8a665]">
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
            <p className="font-sans text-[9px] tracking-[0.35em] text-[#b8a665] mt-0.5 opacity-90 uppercase">
              Boss Takipçisi
            </p>
          </div>
        </div>

        {/* Sağ Taraf: İstatistikler */}
        <div className="flex items-center gap-5 font-sans">
          <div className="flex flex-col items-center">
            <span className="text-[#b8a665] text-[8px] tracking-[0.2em] mb-0.5 opacity-85">KESİLEN</span>
            <span className="font-serif text-xl text-[#E6DFC8] font-light">{kesilenSayisi}</span>
          </div>

          <div className="w-px h-6 bg-[#4a3f2d]"></div>

          <div className="flex flex-col items-center">
            <span className="text-[#b8a665] text-[8px] tracking-[0.2em] mb-0.5 opacity-85">TOPLAM</span>
            <span className="font-serif text-xl text-[#E6DFC8] font-light">{toplamSayi}</span>
          </div>

          <div className="w-px h-6 bg-[#4a3f2d]"></div>

          <div className="flex flex-col items-center">
            <span className="text-[#b8a665] text-[8px] tracking-[0.2em] mb-0.5 opacity-85">ÖLÜMLER</span>
            <span className="font-serif text-xl text-[#E6DFC8] font-light">{toplamOlum}</span>
          </div>

          <div className="w-px h-6 bg-[#4a3f2d]"></div>

          {/* Ses İkonu */}
          <div className="ml-2 text-[#b8a665] opacity-60 hover:opacity-100 cursor-pointer transition-opacity">
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
      <div className="w-full max-w-5xl border border-[#4a3f2d]/70 p-6 relative flex flex-col gap-4 bg-[#d4af37]/[0.02]">
        {/* Köşe Süslemeleri */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#b8a665]"></div>
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#b8a665]"></div>
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#b8a665]"></div>
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#b8a665]"></div>

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

      {/* ─────────────────────────────────────────────────────── */}
      {/* 🎓 TAB FİLTRELERİ                                      */}
      {/* Boss listesini oyuna göre filtreler.                    */}
      {/* Aktif tab altın alt çizgi + parlak renk alır.           */}
      {/* ─────────────────────────────────────────────────────── */}
      <div className="w-full max-w-5xl mt-4">
        <div className="flex gap-1">
          {/* HEPSİ tabı */}
          <button
            onClick={() => setAktifTab("HEPSİ")}
            className={`px-4 py-2 text-[10px] font-serif tracking-[0.2em] uppercase transition-all relative
              ${aktifTab === "HEPSİ"
                ? "text-[#E6DFC8] bg-[#d4af37]/10"
                : "text-[#8A7A4A] hover:text-[#b8a665] hover:bg-[#d4af37]/5"
              }`}
          >
            HEPSİ
            {/* Aktif tab altı çizgisi */}
            {aktifTab === "HEPSİ" && (
              <div className="absolute bottom-0 left-1 right-1 h-[1.5px] bg-[#d4af37]" />
            )}
          </button>

          {/* Oyun tabları — boss listesindeki benzersiz oyunlardan dinamik */}
          {benzersizOyunlar.map((oyun) => (
            <button
              key={oyun}
              onClick={() => setAktifTab(oyun)}
              className={`px-4 py-2 text-[10px] font-serif tracking-[0.2em] uppercase transition-all relative
                ${aktifTab === oyun
                  ? "text-[#E6DFC8] bg-[#d4af37]/10"
                  : "text-[#8A7A4A] hover:text-[#b8a665] hover:bg-[#d4af37]/5"
                }`}
            >
              {oyun}
              {/* Aktif tab altı çizgisi */}
              {aktifTab === oyun && (
                <div className="absolute bottom-0 left-1 right-1 h-[1.5px] bg-[#d4af37]" />
              )}
            </button>
          ))}
        </div>

        {/* Tab çizgisi — tüm tabların altında ince ayırıcı */}
        <div className="h-px bg-[#1a1508]" />
      </div>

      {/* ─────────────────────────────────────────────────────── */}
      {/* 🎓 AKTİF BOSS KARTLARI                                 */}
      {/* kesildiMi === false olan boss'lar burada listelenir.    */}
      {/* aktifTab'a göre filtrelenir.                            */}
      {/* ─────────────────────────────────────────────────────── */}
      <div className="w-full max-w-5xl mt-6 flex flex-col gap-[2px]">
        {bosslar
          .filter(b => !b.kesildiMi)
          .filter(b => aktifTab === "HEPSİ" || b.oyun === aktifTab)
          .map((boss) => (
            <div
              key={boss.id}
              className="group flex items-center gap-[14px] px-[18px] py-[11px] border border-[#332b1f] bg-[#0c0a07] hover:bg-[#110e0a] transition-colors relative self-stretch"
            >
              {/* Sol altın kenar — orijinal: rgba(172, 138, 52, 0.50) */}
              <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#AC8A34]/50" />

              {/* Köşe Süslemeleri — sadece SOL ÜST + SAĞ ALT */}
              <div className="absolute top-0 left-[2px] w-2.5 h-2.5 border-t border-l border-[#AC8A34]/50" />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-[#AC8A34]/50" />

              {/* Oyun Etiketi — sabit genişlik ile hizalama */}
              <span className="font-sans text-[8px] leading-[12px] tracking-[1.28px] text-[#8A7A4A] uppercase font-normal w-20 flex-shrink-0">
                {boss.oyun}
              </span>

              {/* Boss Adı */}
              <span className="font-serif text-[13px] leading-[19.5px] tracking-[0.91px] text-[#E6DFC8] uppercase font-normal flex-1">
                {boss.isim}
              </span>

              {/* Ölüm Sayısı + İkon */}
              <div className="flex items-center gap-1.5">
                <img src="/death-icon.svg" alt="Ölüm" width={14} height={14} className="opacity-70" />
                <span className="font-sans text-[15px] leading-[15px] text-[#E6DFC8] font-light w-[24px] text-center inline-block">
                  {boss.olumler}
                </span>
              </div>

              {/* VANQUISHED Butonu */}
              <button
                className="w-[110px] py-2 font-serif text-[8px] leading-[12px] tracking-[1.6px] uppercase border border-[#3a7a3a] bg-[#0f2a0f] text-[#62B062] hover:bg-[#153015] hover:text-[#7ad07a] hover:border-[#4a9a4a] transition-all cursor-pointer text-center font-normal flex-shrink-0"
                style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))' }}
              >
                KESİLDİ
              </button>

              {/* DIED Butonu */}
              <button
                className="w-[90px] py-2 font-serif text-[8px] leading-[12px] tracking-[1.6px] uppercase border border-[#7a3030] bg-[#2a0f0f] text-[#D06060] hover:bg-[#351515] hover:text-[#e07070] hover:border-[#9a4040] transition-all cursor-pointer text-center font-normal flex-shrink-0"
                style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))' }}
              >
                ÖLDÜN
              </button>

              {/* Silme Butonu — 30x44px */}
              <button className="w-[30px] h-[44px] min-h-[44px] flex items-center justify-center border border-[#332b1f] bg-[#0a0907] text-[#5a5040] hover:text-[#b8a665] hover:border-[#4a3f2d] transition-all cursor-pointer flex-shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </button>
            </div>
          ))}
      </div>

      {/* ─────────────────────────────────────────────────────── */}
      {/* ⚔️ AYIRICI — Aktif ve Kesilmiş bosslar arası           */}
      {/* Sol gradient çizgi + merkez ikon + sağ gradient çizgi  */}
      {/* ─────────────────────────────────────────────────────── */}
      <div
        className="flex items-center gap-[12px] flex-shrink-0 w-full max-w-5xl"
        style={{ height: '36px', padding: '14px 0' }}
      >
        {/* Sol çizgi — soldan sağa solan gradient */}
        <div
          className="flex-1 h-px flex-shrink-0"
          style={{ background: 'linear-gradient(90deg, rgba(180, 148, 60, 0.20) 0%, rgba(180, 148, 60, 0.06) 100%)' }}
        />

        {/* Merkez ikon placeholder — 8x8px, sonra gerçek ikon eklenecek */}
        <div className="w-2 h-2 flex-shrink-0 rotate-45 border border-[#B4943C]/30" />

        {/* Sağ çizgi — sağdan sola solan gradient */}
        <div
          className="flex-1 h-px flex-shrink-0"
          style={{ background: 'linear-gradient(270deg, rgba(180, 148, 60, 0.20) 0%, rgba(180, 148, 60, 0.06) 100%)' }}
        />
      </div>

      {/* ─────────────────────────────────────────────────────── */}
      {/* 💀 KESİLMİŞ (SLAIN) BOSS KARTLARI                      */}
      {/* kesildiMi === true olan boss'lar burada listelenir.     */}
      {/* ─────────────────────────────────────────────────────── */}
      <div className="w-full max-w-5xl flex flex-col gap-[2px]">
        {bosslar
          .filter(b => b.kesildiMi)
          .filter(b => aktifTab === "HEPSİ" || b.oyun === aktifTab)
          .map((boss) => (
            <div
              key={boss.id}
              className="group flex items-center gap-[14px] px-[18px] py-[11px] border border-[#1a1508] bg-[#080704] hover:bg-[#0a0907] transition-colors relative opacity-50"
            >
              {/* Sol kenar — soluk */}
              <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#AC8A34]/20" />

              {/* Köşe Süslemeleri — soluk */}
              <div className="absolute top-0 left-[2px] w-2.5 h-2.5 border-t border-l border-[#AC8A34]/20" />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-[#AC8A34]/20" />

              {/* Oyun Etiketi */}
              <span className="font-sans text-[8px] leading-[12px] tracking-[1.28px] text-[#8A7A4A]/50 uppercase font-normal w-20 flex-shrink-0">
                {boss.oyun}
              </span>

              {/* Boss Adı — üstü çizili (gri/beyaz) */}
              <span className="font-serif text-[13px] leading-[19.5px] tracking-[0.91px] text-[#E6DFC8]/40 uppercase font-normal flex-1 line-through decoration-[#E6DFC8]/40">
                {boss.isim}
              </span>

              {/* Ölüm Sayısı */}
              <div className="flex items-center gap-1.5">
                <img src="/whitedeath-icon.svg" alt="Ölüm" width={14} height={14} className="opacity-30" />
                <span className="font-sans text-[15px] leading-[15px] text-[#E6DFC8]/40 font-light w-[24px] text-center inline-block">
                  {boss.olumler}
                </span>
              </div>

              {/* SLAIN Etiketi ve İkonu */}
              <div className="w-[110px] flex items-center justify-center gap-2 flex-shrink-0">
                <img src="/slain.svg" alt="Slain Icon" width={28} height={28} />
                <span className="font-serif text-[8px] leading-[12px] tracking-[1.6px] uppercase text-[#7a3030]">
                  KESİLDİ
                </span>
              </div>

              {/* Silme Butonu */}
              <button className="w-[30px] h-[44px] min-h-[44px] flex items-center justify-center border border-[#1a1508] bg-[#060503] text-[#5a5040]/40 hover:text-[#b8a665] hover:border-[#332b1f] transition-all cursor-pointer flex-shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </button>
            </div>
          ))}
      </div>

      {/* ─────────────────────────────────────────────────────── */}
      {/* 📜 FOOTER                                              */}
      {/* Çizgiler, merkez ikon ve kapanış yazısı                */}
      {/* ─────────────────────────────────────────────────────── */}
      <div
        className="w-full max-w-5xl flex flex-col pt-[36px]"
        style={{ height: '75px' }}
      >
        {/* Ayırıcı Çizgi ve İkon */}
        <div className="flex items-center w-full">
          {/* Sol Çizgi */}
          <div
            className="flex-1 h-px"
            style={{ background: 'linear-gradient(90deg, rgba(0, 0, 0, 0.00) 0%, rgba(180, 148, 60, 0.20) 100%)' }}
          />

          {/* Merkez İkon */}
          <img src="/mainicon.svg" alt="Main Icon" width={15} height={15} className="opacity-[1]" />

          {/* Sağ Çizgi */}
          <div
            className="flex-1 h-px"
            style={{ background: 'linear-gradient(270deg, rgba(0, 0, 0, 0.00) 0%, rgba(180, 148, 60, 0.20) 100%)' }}
          />
        </div>

        {/* Footer Yazısı */}
        <div className="flex flex-col items-center pt-[12px] h-[24px] flex-shrink-0 w-full">
          <span className="text-[#4A3E26] font-sans text-[8px] font-normal leading-[12px] tracking-[2.72px] text-center uppercase">
            LÜTFUN REHBERLİĞİ YOLUNU AYDINLATSIN
          </span>
        </div>
      </div>
    </main>
  );
}