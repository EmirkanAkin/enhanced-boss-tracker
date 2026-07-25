import { useState } from 'react';

export default function SplashScreen({ onEnter, audioPlay }) {
  const [isFading, setIsFading] = useState(false);

  const handleClick = () => {
    if (isFading) return;
    audioPlay();
    setIsFading(true);
    setTimeout(() => {
      onEnter();
    }, 1500); // 1.5s fade out
  };

  return (
    <div
      onClick={handleClick}
      className={`fixed inset-0 z-[999] flex flex-col items-center justify-center cursor-pointer transition-all duration-[1500ms] ease-in-out ${
        isFading ? "opacity-0 pointer-events-none bg-black" : "opacity-100"
      }`}
      style={{
        background: isFading ? "#000" : "radial-gradient(circle at center, #110e0a 0%, #000000 100%)"
      }}
    >
      <div className={`flex flex-col items-center gap-6 transition-all duration-[1200ms] ease-in-out ${isFading ? "blur-sm scale-110 opacity-0" : "scale-100 opacity-100 hover:scale-105"}`}>
        {/* Süsleme Çizgisi */}
        <div className="w-32 md:w-48 h-[1px] bg-gradient-to-r from-transparent via-[#AC8A34] to-transparent opacity-50"></div>
        
        <h1 className="font-serif text-[#E6DFC8] text-xl md:text-2xl tracking-[0.4em] md:tracking-[0.5em] uppercase text-center antialiased drop-shadow-sm">
          GİRİŞ İÇİN TIKLAYIN
        </h1>
        
        <p className="font-sans text-[#8A7A4A] text-[10px] md:text-xs tracking-[0.8em] uppercase opacity-70 text-center">
          AV BAŞLIYOR...
        </p>

        {/* Süsleme Çizgisi */}
        <div className="w-32 md:w-48 h-[1px] bg-gradient-to-r from-transparent via-[#AC8A34] to-transparent opacity-50"></div>
      </div>
    </div>
  );
}
