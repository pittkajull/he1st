import React, { useRef } from 'react';
import Draggable from 'react-draggable';

export default function ContactMe({ isMaximized, toggleMax, minimize, close, zIndex, onFocus }) {
  const nodeRef = useRef(null);

  return (
    <Draggable 
      nodeRef={nodeRef} handle=".cm-header" disabled={isMaximized || window.innerWidth < 768}
      position={isMaximized || window.innerWidth < 768 ? {x: 0, y: 0} : null}
    >
      <div 
        ref={nodeRef} onMouseDown={onFocus} onTouchStart={onFocus}
        style={{ zIndex: zIndex, transform: (isMaximized || window.innerWidth < 768) ? 'none' : undefined }}
        className={`bg-[#313338] text-white shadow-2xl flex flex-col overflow-hidden transition-all duration-300
          ${isMaximized ? 'fixed !top-8 !left-0 w-screen h-[calc(100vh-2rem)] rounded-none' 
          : 'absolute top-1 left-1/2 -translate-x-1/2 w-[90%] max-w-md h-[500px] rounded-xl border border-white/10'}`}
      >
        
        {/* HEADER MESSENGER (MMC LENGKAP DI KANAN) */}
        <div className={`cm-header bg-[#2b2d31] px-4 py-2 flex justify-between items-center select-none ${isMaximized ? 'cursor-default' : 'cursor-move'}`}>
          <div className="flex items-center gap-2">
            <span className="text-xs">💬</span>
            <span className="text-[11px] font-bold font-sans uppercase tracking-tighter">Muhajir_Messenger</span>
          </div>

          {/* FITUR MMC (LENGKAP: MIN, MAX, CLOSE) */}
          <div className="flex items-center gap-4 md:gap-2.5">
            {/* Kuning: Minimize */}
            <button onClick={(e) => { e.stopPropagation(); minimize(); }} 
              className="w-10 h-10 md:w-3.5 md:h-3.5 rounded-full bg-[#ffbd2e] border border-[#dea123] hover:brightness-110 transition flex items-center justify-center text-black/40 hover:text-black/80 font-bold text-xs md:text-[8px]">
              <span className="md:block hidden">—</span>
            </button>
            
            {/* Hijau: Maximize (Dulu ilang, sekarang balik) */}
            <button onClick={(e) => { e.stopPropagation(); toggleMax(); }} 
              className="hidden md:flex w-3.5 h-3.5 rounded-full bg-[#27c93f] border border-[#1aab29] hover:brightness-110 transition items-center justify-center text-black/40 hover:text-black/80 text-[6px] font-bold">
              {isMaximized ? '❐' : '❑'}
            </button>
            
            {/* Merah: Close */}
            <button onClick={(e) => { e.stopPropagation(); close(); }} 
              className="w-10 h-10 md:w-3.5 md:h-3.5 rounded-full bg-[#ff5f56] border border-[#e0443e] hover:brightness-110 transition flex items-center justify-center text-black/40 hover:text-black/80 font-bold text-xs md:text-[8px]">
              ✕
            </button>
          </div>
        </div>

        {/* BODY MESSENGER */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Status Bar */}
          <div className="p-4 flex items-center gap-3 border-b border-white/5">
             <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-xl">👤</div>
             <div>
                <p className="text-sm font-bold">Muhajir</p>
                <p className="text-[10px] text-green-500 flex items-center gap-1">
                   <span className="w-2 h-2 bg-green-500 rounded-full"></span> Online
                </p>
             </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-sm font-sans custom-scroll">
            <div className="bg-[#383a40] p-3 rounded-2xl rounded-tl-none w-fit max-w-[85%]">
              Yo! Gue Muhajir. Ada yang bisa gue bantu seputar Cybersec atau Web Dev? 
            </div>
            <div className="bg-indigo-600 p-3 rounded-2xl rounded-tr-none w-fit max-w-[85%] self-end ml-auto shadow-lg">
              Kirim email ke: <span className="font-bold underline italic">muhajir@example.com</span>
            </div>
          </div>

          {/* Input Box (Pajangan biar afdol) */}
          <div className="p-4 bg-[#2b2d31]">
             <div className="bg-[#383a40] px-4 py-2 rounded-full text-xs text-gray-400">
                Message #Muhajir...
             </div>
          </div>
        </div>

      </div>
    </Draggable>
  );
}