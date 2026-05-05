import React, { useRef } from 'react';
import Draggable from 'react-draggable';

export default function ProjectExplorer({ isMaximized, toggleMax, minimize, close, zIndex, onFocus }) {
  const nodeRef = useRef(null);

  const projects = [
    { id: 1, name: "Web_Exploit_Dashboard", type: "Web", tech: "React" },
    { id: 2, name: "Cinematic_Edit_v1", type: "Video", tech: "Premiere" },
    { id: 3, name: "IoT_Monitoring_System", type: "System", tech: "NodeJS" },
  ];

  return (
    <Draggable 
      nodeRef={nodeRef} handle=".finder-header" disabled={isMaximized || window.innerWidth < 768}
      position={isMaximized || window.innerWidth < 768 ? {x: 0, y: 0} : null}
    >
      <div 
        ref={nodeRef} onMouseDown={onFocus} onTouchStart={onFocus}
        style={{ zIndex: zIndex, transform: (isMaximized || window.innerWidth < 768) ? 'none' : undefined }}
        className={`bg-white shadow-2xl flex flex-col overflow-hidden transition-all duration-300
          ${isMaximized ? 'fixed !top-8 !left-0 w-screen h-[calc(100vh-2rem)] rounded-none' 
          : 'absolute top-1 left-1/2 -translate-x-1/2 w-[95%] max-w-4xl h-[500px] rounded-xl border border-gray-300'}`}
      >
        {/* HEADER FINDER (macOS Style tapi di KANAN) */}
        <div className={`finder-header bg-[#f6f6f6] px-4 py-2 flex justify-between items-center border-b border-gray-200 select-none ${isMaximized ? 'cursor-default' : 'cursor-move'}`}>
          
          {/* Judul di Kiri */}
          <div className="flex items-center gap-2">
            <span className="text-sm">📂</span>
            <span className="text-[11px] font-bold text-gray-600 tracking-tight uppercase">Project_Explorer</span>
          </div>

          {/* FITUR MMC (macOS Colors di Kanan) */}
          <div className="flex items-center gap-4 md:gap-2.5">
            {/* Kuning: Minimize */}
            <button onClick={(e) => { e.stopPropagation(); minimize(); }} 
              className="w-8 h-8 md:w-3.5 md:h-3.5 rounded-full bg-[#ffbd2e] border border-[#dea123] hover:brightness-90 transition-all flex items-center justify-center text-[10px] md:text-[8px] font-bold text-black/40 hover:text-black/80">
              <span className="md:block hidden">—</span>
            </button>
            
            {/* Hijau: Maximize */}
            <button onClick={(e) => { e.stopPropagation(); toggleMax(); }} 
              className="hidden md:flex w-3.5 h-3.5 rounded-full bg-[#27c93f] border border-[#1aab29] hover:brightness-90 transition-all items-center justify-center text-[6px] font-bold text-black/40 hover:text-black/80">
              {isMaximized ? '❐' : '❑'}
            </button>
            
            {/* Merah: Close */}
            <button onClick={(e) => { e.stopPropagation(); close(); }} 
              className="w-8 h-8 md:w-3.5 md:h-3.5 rounded-full bg-[#ff5f56] border border-[#e0443e] hover:brightness-90 transition-all flex items-center justify-center text-[10px] md:text-[8px] font-bold text-black/40 hover:text-black/80">
              ✕
            </button>
          </div>
        </div>

        {/* BODY FINDER */}
        <div className="flex-1 flex overflow-hidden">
          {/* SIDEBAR */}
          <div className="w-40 bg-[#f0f0f0]/50 border-r border-gray-200 p-4 hidden md:block">
            <p className="text-[10px] font-bold text-gray-400 mb-4 uppercase tracking-tighter text-center">Favorites</p>
            <ul className="text-xs space-y-3 text-gray-700 font-medium">
              <li className="text-blue-600 bg-blue-100 -mx-2 px-2 py-1 rounded-md">󰉋 All Projects</li>
              <li className="hover:text-blue-600 cursor-pointer">󰈫 Web Exploits</li>
              <li className="hover:text-blue-600 cursor-pointer">󰕧 Video Assets</li>
            </ul>
          </div>

          {/* MAIN GRID */}
          <div className="flex-1 p-6 overflow-y-auto bg-white">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {projects.map((proj) => (
                <div key={proj.id} className="group flex flex-col items-center gap-2 cursor-pointer transition-transform active:scale-90">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg group-hover:shadow-blue-200 transition-all">
                    {proj.type === 'Web' ? '🌐' : proj.type === 'Video' ? '🎬' : '⚙️'}
                  </div>
                  <span className="text-[10px] md:text-xs text-gray-800 font-bold text-center leading-tight group-hover:bg-blue-600 group-hover:text-white px-1 transition-colors">
                    {proj.name}
                  </span>
                  <span className="text-[9px] text-gray-400 font-black uppercase tracking-tighter">{proj.tech}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Draggable>
  );
}