export default function Header({
  setIsPairingModalOpen,
  kesilenSayisi,
  toplamSayi,
  toplamOlum,
  volume,
  setVolume,
  isMuted,
  setIsMuted,
  prevVolume,
  setPrevVolume,
  onVolumeToggle,
}) {
  return (
    <header className="w-full max-w-5xl flex flex-col md:flex-row justify-between items-stretch md:items-end gap-5 md:gap-0 pb-4 mb-6 relative">
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
      <div className="flex items-center justify-between w-full md:w-auto md:justify-end gap-8 font-sans">
        {/* Cihaz Eşleştir Butonu */}
        <button
          onClick={() => setIsPairingModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-[#4a3f2d] bg-[#1a1508]/80 text-[#8A7A4A] hover:bg-[#2a2212] hover:text-[#b8a665] hover:border-[#8A7A4A] transition-all cursor-pointer font-serif text-[9px] tracking-[0.2em] uppercase shadow-[0_0_10px_rgba(180,148,60,0.05)]"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
          <span className="hidden md:inline">Ruh Çağır</span>
        </button>

        <div className="flex items-center gap-8">
          <div className="flex flex-col items-end">
            <span className="text-[#8A7A4A] font-sans text-[8px] font-normal leading-[12px] tracking-[1.76px] uppercase mb-0.5">KESİLEN</span>
            <span className="text-[#E6DFC8] font-sans text-[17px] font-light leading-[17px]">{kesilenSayisi}</span>
          </div>

          <div className="w-px h-8 bg-[#4a3f2d]"></div>

          <div className="flex flex-col items-end">
            <span className="text-[#8A7A4A] font-sans text-[8px] font-normal leading-[12px] tracking-[1.76px] uppercase mb-0.5">TOPLAM</span>
            <span className="text-[#E6DFC8] font-sans text-[17px] font-light leading-[17px]">{toplamSayi}</span>
          </div>

          <div className="w-px h-8 bg-[#4a3f2d]"></div>

          <div className="flex flex-col items-end">
            <span className="text-[#8A7A4A] font-sans text-[8px] font-normal leading-[12px] tracking-[1.76px] uppercase mb-0.5">ÖLÜMLER</span>
            <span className="text-[#E6DFC8] font-sans text-[17px] font-light leading-[17px]">{toplamOlum}</span>
          </div>

          <div className="w-px h-8 bg-[#4a3f2d]"></div>
        </div>

        {/* Ses Kontrolcüsü */}
        <div className="ml-auto md:ml-0 flex items-center group relative h-8">
          <div className="overflow-hidden transition-all duration-500 ease-in-out flex items-center h-6 w-24 opacity-100 mr-2 md:w-0 md:opacity-0 md:mr-0 md:group-hover:w-24 md:group-hover:opacity-100 md:group-hover:mr-4">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setVolume(val);
                if (val > 0) {
                  setIsMuted(false);
                } else {
                  setIsMuted(true);
                }
              }}
              className="custom-range w-full"
              style={{
                background: `linear-gradient(to right, #8A7A4A ${volume * 100}%, #332b1f ${volume * 100}%)`,
                transition: 'background 0.3s ease-in-out'
              }}
            />
          </div>

          <div
            className="text-[#b8a665] cursor-pointer transition-opacity opacity-100 md:opacity-60 md:group-hover:opacity-100"
            onClick={() => {
              if (isMuted || volume === 0) {
                setIsMuted(false);
                setVolume(prevVolume > 0 ? prevVolume : 0.5);
              } else {
                setPrevVolume(volume);
                setIsMuted(true);
                setVolume(0);
              }
              if (onVolumeToggle) onVolumeToggle();
            }}
            title={isMuted || volume === 0 ? "Sesi Aç" : "Sesi Kapat"}
          >
            {isMuted || volume === 0 ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="1" y1="1" x2="23" y2="23"></line>
                <path d="M9 9v6a3 3 0 0 0 3 3h0a3 3 0 0 0 3-3v-2"></path>
                <path d="M5 10v4"></path>
                <path d="M19 10v4"></path>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
                <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
              </svg>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
