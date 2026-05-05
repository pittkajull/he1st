import React, { useRef } from 'react';
import Draggable from 'react-draggable';

export default function SystemMonitor({ isMaximized, toggleMax, minimize, close, zIndex, onFocus }) {
  const nodeRef = useRef(null);

  return (
    <Draggable nodeRef={nodeRef} handle=".sm-header" disabled={isMaximized || window.innerWidth < 768} position={isMaximized || window.innerWidth < 768 ? {x: 0, y: 0} : null}>
      <div ref={nodeRef} onMouseDown={onFocus} onTouchStart={onFocus} style={{ zIndex: zIndex, transform: (isMaximized || window.innerWidth < 768) ? 'none' : undefined }}
        className={`bg-[#3d3c37] text-white shadow-2xl flex flex-col overflow-hidden transition-all duration-300
          ${isMaximized ? 'fixed !top-8 !left-0 w-screen h-[calc(100vh-2rem)] rounded-none' 
          : 'absolute top-2 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl h-[450px] rounded-lg'}`}>
        
        <div className="sm-header bg-[#2c2b29] px-4 py-2 flex justify-between items-center select-none cursor-move">
          <span className="text-xs font-bold font-sans">📊 System Monitor</span>
          <div className="flex gap-2">
            <button onClick={(e) => { e.stopPropagation(); minimize(); }} className="w-8 h-8 md:w-6 md:h-6 hover:bg-white/10 rounded">—</button>
            <button onClick={(e) => { e.stopPropagation(); toggleMax(); }} className="hidden md:block w-6 h-6 hover:bg-white/10 rounded">❑</button>
            <button onClick={(e) => { e.stopPropagation(); close(); }} className="w-8 h-8 md:w-6 md:h-6 hover:bg-red-500 rounded">✕</button>
          </div>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto">
          <p className="text-sm font-bold border-b border-white/10 pb-2">Tech Stack Utilization</p>
          {/* Skill 1 */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs"><span>React.js</span><span>85%</span></div>
            <div className="w-full bg-gray-700 h-2 rounded-full"><div className="bg-orange-500 h-full w-[85%] rounded-full"></div></div>
          </div>
          {/* Skill 2 */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs"><span>Cyber Security</span><span>60%</span></div>
            <div className="w-full bg-gray-700 h-2 rounded-full"><div className="bg-green-500 h-full w-[60%] rounded-full"></div></div>
          </div>
        </div>
      </div>
    </Draggable>
  );
}