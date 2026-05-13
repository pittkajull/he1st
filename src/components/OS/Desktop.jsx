import React from 'react';

export default function Desktop({ toggleApp }) {
  const desktopApps = [
    { id: 'profile',    name: 'PROFILE.SH',        icon: '🐚', color: 'bg-gray-800' },
    { id: 'experience', name: 'EXPERIENCE.LOG',     icon: '🗄️', color: 'bg-blue-600' },
    { id: 'projects',   name: 'PROJECTS.LOCALIZED', icon: '💼', color: 'bg-white text-black' },
    { id: 'skills',     name: 'SKILLS.STATS',       icon: '📊', color: 'bg-orange-700' },
    { id: 'contact',    name: 'CONTACT.CHAT',       icon: '💬', color: 'bg-indigo-600' },
    { id: 'medium',     name: 'MEDIUM.RSS',         icon: '📝', color: 'bg-black text-white' },
    { id: 'wallpaper',  name: 'WALLPAPER.SH',       icon: '🖼️', color: 'bg-sky-700' },
    { id: 'whoami',      name: 'WHOAMI.EXE',         icon: '👤', color: 'bg-green-700' },
    { id: 'network',     name: 'NETWORK_MAP.NET',    icon: '🌐', color: 'bg-purple-700' },
    { id: 'ctf',         name: 'CTFLOG.TXT',        icon: '🎯', color: 'bg-red-700' },
    { id: 'terminal',    name: 'TERMINAL.LIVE',      icon: '💻', color: 'bg-gray-700' },
    { id: 'arcade',      name: 'ARCADE.GAME',        icon: '🕹️', color: 'bg-green-700' },
  ];

  return (
    <div className="grid grid-cols-3 gap-x-6 gap-y-5 w-fit h-fit pt-2 pl-4">
      {desktopApps.map((app) => (
        <div
          key={app.id}
          onClick={() => toggleApp(app.id)}
          className="group w-20 flex flex-col items-center gap-1 cursor-pointer select-none"
        >
          <div className={`
            w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-3xl md:text-4xl
            transition-all duration-200
            ${app.color} bg-opacity-80 group-hover:bg-opacity-100 group-hover:scale-110
            border border-white/10 shadow-lg group-active:scale-95
          `}>
            {app.icon}
          </div>
          <span className="text-[9px] md:text-[10px] text-white font-bold bg-black/40 px-2 py-0.5 rounded shadow-sm group-hover:bg-black/60 transition-colors uppercase tracking-tighter text-center whitespace-nowrap">
            {app.name}
          </span>
        </div>
      ))}
    </div>
  );
}