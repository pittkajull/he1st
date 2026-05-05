import React, { useState } from 'react';
import Draggable from 'react-draggable';

const Window = ({ title, icon, children, onClose, onMinimize, activeApp, setActive }) => {
  const [isMaximized, setIsMaximized] = useState(false);

  return (
    <Draggable
      handle=".window-header"
      disabled={isMaximized}
      position={isMaximized ? { x: 0, y: 0 } : undefined}
    >
      <div
        onClick={() => setActive(title)}
        className={`absolute shadow-2xl overflow-hidden flex flex-col transition-all duration-200 
          ${isMaximized 
            ? 'w-screen h-[calc(100vh-32px)] top-8 left-0 rounded-none' 
            : 'w-[800px] h-[500px] top-20 left-20 rounded-lg'
          } 
          ${activeApp === title ? 'z-50' : 'z-10'}
          bg-[#1e1e1e] border border-white/10`}
      >
        {/* Header / Title Bar */}
        <div className="window-header h-10 bg-[#2d2d2d] flex items-center justify-between px-4 cursor-default select-none">
          <div className="flex items-center gap-2">
            <span className="text-sm">{icon}</span>
            <span className="text-sm font-medium text-gray-300">{title}</span>
          </div>
          
          <div className="flex gap-2">
            <button onClick={onMinimize} className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 shadow-inner" />
            <button onClick={() => setIsMaximized(!isMaximized)} className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 shadow-inner" />
            <button onClick={onClose} className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 shadow-inner" />
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto bg-[#1a1a1a]/90 backdrop-blur-md">
          {children}
        </div>
      </div>
    </Draggable>
  );
};

export default Window;