export default function GlobalToast({ toast }) {
  if (!toast || !toast.isVisible) return null;

  const isError = toast.type === "error";
  
  // Theme colors based on type
  const borderColor = isError ? "border-[#8b0000]" : "border-[#b89e6e]";
  const bgColor = isError ? "bg-[#0e0404]" : "bg-[#0a0a0a]";
  const shadowColor = isError ? "shadow-[0_0_40px_rgba(180,30,30,0.25)]" : "shadow-[0_0_40px_rgba(184,158,110,0.15)]";
  const iconColor = isError ? "text-[#8b0000]" : "text-[#d4af37]";
  const titleColor = isError ? "text-[#c0392b]" : "text-[#d4af37]";
  
  return (
    <div
      className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] pointer-events-none ${toast.isLeaving ? 'animate-toast-out' : 'animate-toast-in'}`}
    >
      <div className={`relative border ${borderColor} ${bgColor} px-6 py-4 flex items-start gap-4 ${shadowColor} min-w-[300px] max-w-[420px]`}>
        {/* Sol kenar çizgisi */}
        <div className={`absolute left-0 top-0 bottom-0 w-[2px] ${isError ? 'bg-[#8b0000]' : 'bg-[#b89e6e]'}`} />
        
        {/* Köşe süslemeleri */}
        <div className={`absolute top-0 left-[2px] w-2 h-2 border-t border-l ${borderColor}`} />
        <div className={`absolute bottom-0 right-0 w-2 h-2 border-b border-r ${borderColor}`} />

        {/* İkon */}
        <div className={`flex-shrink-0 mt-0.5 ${iconColor}`}>
          {isError ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          )}
        </div>

        {/* Metin */}
        <div className="flex flex-col gap-1">
          <p className={`font-serif text-[10px] tracking-[0.25em] ${titleColor} uppercase`}>
            {toast.title}
          </p>
          <p className="font-serif text-[11px] tracking-[0.1em] text-[#E6DFC8]">
            {toast.message}
          </p>
          {toast.subMessage && (
            <p className="font-serif text-[9px] tracking-[0.2em] text-[#8A7A4A] uppercase mt-0.5">
              {toast.subMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
