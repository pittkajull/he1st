import React, { useRef } from 'react';
import Draggable from 'react-draggable';

export default function TerminalWindow({ isMaximized, toggleMax, minimize, close, zIndex, onFocus }) {
  const nodeRef = useRef(null);

  return (
    <Draggable 
      nodeRef={nodeRef} handle=".window-header" 
      disabled={isMaximized || window.innerWidth < 768}
      position={isMaximized || window.innerWidth < 768 ? {x: 0, y: 0} : null}
    >
      <div 
        ref={nodeRef}
        onMouseDown={onFocus}
        onTouchStart={onFocus}
        style={{ 
          zIndex: zIndex,
          transform: (isMaximized || window.innerWidth < 768) ? 'none' : undefined 
        }}
        className={`bg-[#1e1e1e]/95 backdrop-blur-md shadow-2xl flex flex-col overflow-hidden transition-all duration-300
          ${isMaximized ? 'fixed !top-8 !left-0 w-screen h-[calc(100vh-2rem)] rounded-none' 
          : 'absolute top-2 left-1/2 -translate-x-1/2 w-[95%] max-w-3xl h-[500px] rounded-lg border border-white/10'}`}
      >
        <div className={`window-header bg-[#2d2d2d] px-4 py-2 flex justify-between items-center select-none ${isMaximized ? 'cursor-default' : 'cursor-move'}`}>
          <span className="text-[10px] md:text-xs text-gray-400 font-mono">muhajir@kali: ~</span>
          <div className="flex items-center gap-4 md:gap-3">
            <button onClick={(e) => { e.stopPropagation(); minimize(); }} className="w-8 h-8 md:w-3.5 md:h-3.5 rounded-full bg-gray-600 hover:bg-yellow-500 transition flex items-center justify-center text-black font-bold">—</button>
            <button onClick={(e) => { e.stopPropagation(); toggleMax(); }} className="hidden md:flex md:w-3.5 md:h-3.5 rounded-full bg-gray-600 hover:bg-green-500 transition items-center justify-center text-black font-bold">▢</button>
            <button onClick={(e) => { e.stopPropagation(); close(); }} className="w-8 h-8 md:w-3.5 md:h-3.5 rounded-full bg-gray-600 hover:bg-red-500 transition flex items-center justify-center text-black font-bold">✕</button>
          </div>
        </div>
        <div className="flex-1 p-6 font-mono text-sm overflow-y-auto text-cyan-400">
          <p>root@muhajir:~$ whoami</p>
          <p className="text-white mt-2">MUHAJIR - Red Teamer</p>
          <div className="mt-10 flex gap-2">
            <span className="text-green-500">└─$</span>
            <span className="w-2 h-5 bg-white animate-pulse"></span>
          </div>
        </div>
      </div>
    </Draggable>
  );
}