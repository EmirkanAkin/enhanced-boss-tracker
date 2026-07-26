import { useState } from 'react';
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db, generatePairingCode } from "../lib/firebase";

export default function PairingModal({ isOpen, onClose, myHunterId, setActiveHunterId, setActiveRole, showToast }) {
  const [pairingMode, setPairingMode] = useState(null); // 'share' | 'connect' | null
  const [pairingCode, setPairingCode] = useState("");
  const [inputCode, setInputCode] = useState("");
  const [pairingError, setPairingError] = useState("");
  const [isPairingLoading, setIsPairingLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  if (!isOpen) return null;

  // Paylaşma Fonksiyonu
  const handleShareDevice = async (role) => {
    setPairingMode("share");
    setSelectedRole(role);
    setPairingError("");
    const code = generatePairingCode();
    setPairingCode(code);
    try {
      await setDoc(doc(db, "pairing_sessions", code), {
        hunterId: myHunterId,
        role: role,
        createdAt: serverTimestamp()
      });
    } catch (e) {
      console.error("Paylaşım hatası:", e);
      setPairingError("Bağlantı kurulamadı.");
    }
  };

  // Bağlanma Fonksiyonu
  const handleConnectDevice = async () => {
    if (inputCode.length !== 4) {
      setPairingError("Lütfen 4 haneli mühür kodunu giriniz.");
      return;
    }
    setIsPairingLoading(true);
    setPairingError("");

    try {
      const docSnap = await getDoc(doc(db, "pairing_sessions", inputCode));
      if (docSnap.exists()) {
        const data = docSnap.data();
        const newHunterId = data.hunterId;
        const newRole = data.role || 'observer';
        setActiveHunterId(newHunterId);
        setActiveRole(newRole);

        // Kalıcı yoldaşlık için localStorage'a kaydet (kendi ana ID'mizi silmeden)
        localStorage.setItem("paired_hunter_id", newHunterId);
        localStorage.setItem("paired_role", newRole);

        onClose();
        setPairingMode(null);
        setInputCode("");
        if (showToast) {
          showToast("Ruh Çağrıldı", "Başka bir dünyaya başarıyla bağlandınız", `Yetki: ${newRole === 'editor' ? 'Yoldaş (Düzenleme)' : 'Gözlemci'}`, "success");
        }
      } else {
        setPairingError("Mühür Bulunamadı");
      }
    } catch (e) {
      console.error("Bağlanma hatası:", e);
      setPairingError("Mühür kontrol edilemedi.");
    } finally {
      setIsPairingLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setPairingMode(null);
    setInputCode("");
    setPairingError("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative border border-[#4a3f2d] bg-[#0c0a07] w-full max-w-md flex flex-col shadow-[0_0_50px_rgba(180,148,60,0.15)] animate-toast-in">
        {/* Altın kenarlar ve süslemeler */}
        <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#AC8A34]/50" />
        <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-[#AC8A34]/50" />
        <div className="absolute top-0 left-[2px] w-3 h-3 border-t border-l border-[#AC8A34]/80" />
        <div className="absolute top-0 right-[2px] w-3 h-3 border-t border-r border-[#AC8A34]/80" />
        <div className="absolute bottom-0 left-[2px] w-3 h-3 border-b border-l border-[#AC8A34]/80" />
        <div className="absolute bottom-0 right-[2px] w-3 h-3 border-b border-r border-[#AC8A34]/80" />

        {/* Header / Kapat */}
        <div className="flex items-center justify-between p-4 border-b border-[#1a1508]">
          <h2 className="font-serif text-[14px] tracking-[0.2em] text-[#E6DFC8] uppercase">
            Ruh Çağırma Ayini
          </h2>
          <button
            onClick={handleClose}
            className="text-[#8A7A4A] hover:text-[#c0392b] transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* İçerik */}
        <div className="p-6 flex flex-col items-center gap-6 min-h-[250px]">
          {!pairingMode ? (
            <>
              <p className="font-sans text-[11px] tracking-wide text-[#b8a665] text-center leading-relaxed">
                Başka bir dünyadaki avcıyla güçlerini birleştir veya kendi dünyanı başkalarına aç.
              </p>
              <div className="flex flex-col gap-4 w-full mt-2">
                <div className="flex flex-col gap-2 p-3 border border-[#332b1f] bg-[#0f0c08]">
                  <p className="font-serif text-[10px] tracking-widest text-[#E6DFC8] uppercase text-center mb-1">Kendi Dünyanı Paylaş</p>
                  <button
                    onClick={() => handleShareDevice('observer')}
                    className="w-full border border-[#4a3f2d] bg-[#181208] text-[#8A7A4A] hover:bg-[#221a0c] hover:text-[#E6DFC8] hover:border-[#b8a665] transition-all px-4 py-2 font-serif text-[10px] tracking-[0.1em] uppercase flex justify-center items-center gap-2"
                  >
                    <span>Gözlemci Olarak</span>
                  </button>
                  <button
                    onClick={() => handleShareDevice('editor')}
                    className="w-full border border-[#4a3f2d] bg-[#181208] text-[#8A7A4A] hover:bg-[#221a0c] hover:text-[#E6DFC8] hover:border-[#b8a665] transition-all px-4 py-2 font-serif text-[10px] tracking-[0.1em] uppercase flex justify-center items-center gap-2"
                  >
                    <span>Kalıcı Olarak</span>
                  </button>
                </div>
                <button
                  onClick={() => { setPairingMode("connect"); setPairingError(""); }}
                  className="w-full border border-[#1a1508] bg-[#050505] text-[#8A7A4A] hover:bg-[#0a0907] hover:text-[#E6DFC8] hover:border-[#4a3f2d] transition-all px-4 py-4 font-serif text-[11px] tracking-[0.15em] uppercase flex flex-col items-center gap-2"
                >
                  <span>Mühre Bağlan</span>
                  <span className="font-sans text-[9px] text-[#5a5040] tracking-normal lowercase normal-case">Başka bir cihazın ilerlemesini al</span>
                </button>
              </div>
            </>
          ) : pairingMode === "share" ? (
            <div className="flex flex-col items-center justify-center w-full h-full gap-4">
              <p className="font-sans text-[10px] tracking-wider text-[#8A7A4A] uppercase">
                Eşleştirme Mührünüz
              </p>
              <div className="border border-[#b8a665] bg-[#1a1508]/50 px-8 py-4 shadow-[0_0_20px_rgba(180,148,60,0.2)]">
                <span className="font-serif text-[36px] tracking-[0.2em] text-[#E6DFC8]">
                  {pairingCode || "...."}
                </span>
              </div>
              <p className="font-sans text-[9px] tracking-wide text-[#b8a665]/70 text-center max-w-[250px] mt-2">
                Bu kodu diğer cihazda "Mühre Bağlan" seçeneğine girerek cihazları eşleştirebilirsiniz.
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center w-full gap-5">
              <p className="font-sans text-[10px] tracking-wider text-[#8A7A4A] uppercase text-center">
                Bağlanılacak Mührü Girin
              </p>
              <input
                type="text"
                maxLength={4}
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.replace(/\D/g, ''))}
                placeholder="0000"
                className="w-32 bg-[#050505] border-b-2 border-[#4a3f2d] focus:border-[#d4af37] px-2 py-2 text-center text-[28px] font-serif tracking-[0.2em] text-[#E6DFC8] placeholder:text-[#332b1f] focus:outline-none transition-colors"
              />
              {pairingError && (
                <p className="font-serif text-[10px] tracking-wider text-[#c0392b] uppercase animate-toast-in">
                  {pairingError}
                </p>
              )}
              <button
                onClick={handleConnectDevice}
                disabled={isPairingLoading || inputCode.length !== 4}
                className="mt-2 w-full max-w-[200px] border border-[#4a3f2d] bg-[#181208] text-[#8A7A4A] hover:bg-[#1e1810] hover:text-[#b8a665] disabled:opacity-50 disabled:cursor-not-allowed transition-all px-4 py-3 font-serif text-[10px] tracking-[0.2em] uppercase"
              >
                {isPairingLoading ? "Bağlanıyor..." : "BAĞLAN"}
              </button>
            </div>
          )}
        </div>

        {/* Geri butonu (alt sol) */}
        {pairingMode && (
          <button
            onClick={() => { setPairingMode(null); setInputCode(""); setPairingError(""); }}
            className="absolute bottom-4 left-4 text-[#5a5040] hover:text-[#8A7A4A] flex items-center gap-1 font-serif text-[9px] tracking-widest uppercase transition-colors"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Geri
          </button>
        )}
      </div>
    </div>
  );
}
