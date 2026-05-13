import React, { useState } from 'react';

export default function Dock({ apps, toggleApp, isHidden }) {
  const [isHovered, setIsHovered] = useState(false);

  const dockItems = [
    { id: 'profile',   icon: '🐚', label: 'Profile',    color: 'bg-gray-800' },
    { id: 'experience',icon: '🗄️', label: 'Experience',  color: 'bg-blue-600' },
    { id: 'projects',  icon: '💼', label: 'Projects',    color: 'bg-white text-black' },
    { id: 'skills',    icon: '📊', label: 'Skills',      color: 'bg-orange-700' },
    { id: 'contact',   icon: '💬', label: 'Contact',     color: 'bg-indigo-600' },
    { id: 'medium',    icon: '📝', label: 'Medium',      color: 'bg-black text-white' },
    { id: 'wallpaper', icon: '🖼️', label: 'Wallpaper',   color: 'bg-sky-700' },
    { id: 'whoami',    icon: '👤', label: 'WhoAmI',      color: 'bg-green-700' },
    { id: 'network',   icon: '🌐', label: 'Network Map', color: 'bg-purple-700' },
    { id: 'ctf',       icon: '🎯', label: 'CTF Log',     color: 'bg-red-700' },
    { id: 'terminal',   icon: '💻', label: 'Terminal',    color: 'bg-gray-700' },
    { id: 'arcade',     icon: '🕹️', label: 'arcade',      color: 'bg-green-700' },
  ];

  const anyAppOpen = Object.values(apps).some(app => app.isOpen && !app.isMinimized);
  const shouldHide = (anyAppOpen && !isHovered) || isHidden;

  return (
    <>
      {anyAppOpen && (
        <div
          className="fixed bottom-0 left-0 w-full h-6 z-[140]"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        />
      )}

      <div
        className={`
          pb-4 flex justify-center w-full z-[150] fixed bottom-0 px-4
          transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
          ${shouldHide ? 'translate-y-28 opacity-0' : 'translate-y-0 opacity-100'}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="bg-white/10 backdrop-blur-3xl border border-white/20 p-2 rounded-3xl flex items-end gap-2 md:gap-4 shadow-2xl pointer-events-auto h-20 transition-all duration-500">
          {dockItems.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleApp(item.id)}
              className="relative group flex flex-col items-center cursor-pointer"
            >
              <span className="absolute -top-14 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none border border-white/10 uppercase tracking-[0.2em] whitespace-nowrap z-[160]">
                {item.label}
              </span>

              <div className={`
                w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center text-2xl md:text-3xl
                transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]
                ${item.color} shadow-lg border border-white/5
                hover:scale-150 hover:-translate-y-6 hover:mx-4
                active:scale-110 active:transition-none
                ${apps[item.id]?.isOpen ? 'opacity-100' : 'opacity-70 grayscale-[30%] hover:grayscale-0 hover:opacity-100'}
              `}>
                {item.icon}
              </div>

              {apps[item.id]?.isOpen && (
                <div className={`
                  absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full transition-all duration-500
                  ${apps[item.id].isMinimized ? 'bg-gray-500 opacity-50 scale-75' : 'bg-white shadow-[0_0_8px_white]'}
                `}></div>
              )}
            </div>
          ))}
        </div>

        {shouldHide && isHovered && (
          <div className="absolute bottom-full mb-2 text-[9px] text-white/40 font-mono tracking-widest animate-pulse">
            ↑ hover to show dock
          </div>
        )}
      </div>
    </>
  );
}