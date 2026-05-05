import React, { useRef } from 'react';
import Draggable from 'react-draggable';

export default function EducationDB({ isMaximized, toggleMax, minimize, close, zIndex, onFocus }) {
  const nodeRef = useRef(null);
  const eduData = [
    { year: "2024 - Present", school: "Universitas Brawijaya", major: "Teknologi Informasi", status: "Active" },
    { year: "2021 - 2024", school: "SMAN 4 Babelan", major: "IPA", status: "Graduated" },
  ];

  return (
    <Draggable 
      nodeRef={nodeRef} handle=".db-header" disabled={isMaximized || window.innerWidth < 768}
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
        className={`bg-[#f3f3f3] shadow-2xl flex flex-col overflow-hidden border border-gray-400 transition-all duration-300
          ${isMaximized ? 'fixed !top-8 !left-0 w-screen h-[calc(100vh-2rem)] rounded-none' 
          : 'absolute top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-2xl h-[450px] rounded-lg'}`}
      >
        <div className={`db-header bg-[#e1e1e1] px-4 py-2 flex justify-between items-center border-b border-gray-300 select-none ${isMaximized ? 'cursor-default' : 'cursor-move'}`}>
          <div className="flex items-center gap-2 text-gray-700 font-bold text-[11px]">
            <span>🗄️</span> DATABASE_EXPLORER
          </div>
          <div className="flex items-center gap-4 md:gap-2">
            <button onClick={(e) => { e.stopPropagation(); minimize(); }} className="w-10 h-10 md:w-6 md:h-6 bg-gray-200 md:bg-transparent rounded hover:bg-gray-300 transition flex items-center justify-center">—</button>
            <button onClick={(e) => { e.stopPropagation(); toggleMax(); }} className="hidden md:flex md:w-6 md:h-6 items-center justify-center hover:bg-gray-300 rounded text-xs">{isMaximized ? '❐' : '❑'}</button>
            <button onClick={(e) => { e.stopPropagation(); close(); }} className="w-10 h-10 md:w-6 md:h-6 bg-gray-200 md:bg-transparent rounded hover:bg-red-500 hover:text-white transition flex items-center justify-center font-bold">✕</button>
          </div>
        </div>
        <div className="flex-1 p-4 bg-white overflow-y-auto">
          <table className="w-full text-left text-xs border-collapse text-gray-800">
            <thead>
              <tr className="bg-gray-100 uppercase border-b text-gray-500">
                <th className="p-2 border">Year</th><th className="p-2 border">Institution</th><th className="p-2 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {eduData.map((d, i) => (
                <tr key={i} className="border-b hover:bg-blue-50">
                  <td className="p-2 border font-mono text-blue-600">{d.year}</td>
                  <td className="p-2 border font-bold">{d.school}</td>
                  <td className="p-2 border text-center">{d.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Draggable>
  );
}