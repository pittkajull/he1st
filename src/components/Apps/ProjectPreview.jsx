import React, { useRef } from 'react';
import Draggable from 'react-draggable';

export default function ProjectPreview({ isMaximized, toggleMax, minimize, close, zIndex, onFocus, data }) {
  const nodeRef = useRef(null);
  if (!data) return null;

  return (
    <Draggable nodeRef={nodeRef} handle=".pv-header" disabled={isMaximized} position={isMaximized ? {x:0, y:0} : null}>
      <div ref={nodeRef} onMouseDown={onFocus} style={{ zIndex: zIndex }}
        className={`bg-black shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden transition-all duration-300 border border-white/10
          ${isMaximized ? 'fixed !top-8 !left-0 w-screen h-[calc(100vh-2rem)] rounded-none' 
          : 'absolute top-10 left-[15%] w-[90%] max-w-2xl h-[500px] rounded-lg'}`}>
        
        {/* PV HEADER */}
        <div className="pv-header bg-black/80 px-4 py-2 flex justify-between items-center select-none cursor-move border-b border-white/5">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{data.name} - Preview</span>
          <div className="flex gap-2">
            <button onClick={(e) => { e.stopPropagation(); minimize(); }} className="w-6 h-6 hover:bg-white/10 rounded">—</button>
            <button onClick={(e) => { e.stopPropagation(); toggleMax(); }} className="hidden md:block w-6 h-6 hover:bg-white/10 rounded">❑</button>
            <button onClick={(e) => { e.stopPropagation(); close(); }} className="w-6 h-6 hover:bg-red-500 rounded font-bold">✕</button>
          </div>
        </div>

        {/* PV CONTENT */}
        <div className="flex-1 overflow-y-auto flex flex-col">
          <img src={data.img} alt={data.name} className="w-full aspect-video object-cover" />
          <div className="p-6 space-y-4">
             <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white tracking-tight">{data.name}</h2>
                <span className="bg-blue-600 text-[10px] px-2 py-0.5 rounded font-bold uppercase">{data.tech}</span>
             </div>
             <p className="text-sm text-gray-400 leading-relaxed border-l-2 border-blue-500 pl-4">
               {data.desc}
             </p>
             <button className="bg-white text-black text-xs font-bold px-4 py-2 rounded hover:bg-gray-200 transition">
               Launch Project ↗
             </button>
          </div>
        </div>
      </div>
    </Draggable>
  );
}