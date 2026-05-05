import React from 'react';

export default function Dock({ apps, toggleApp, isHidden }) {
  const dockItems = [
    { id: 'profile', icon: '🐚', label: 'Profile', color: 'bg-gray-800' },
    { id: 'education', icon: '🗄️', label: 'Education', color: 'bg-blue-600' },
    { id: 'projects', icon: '💼', label: 'Projects', color: 'bg-white' },
    { id: 'skills', icon: '📊', label: 'Skills', color: 'bg-orange-700' },
    { id: 'contact', icon: '💬', label: 'Contact', color: 'bg-indigo-600' },
  ];

  return (
    /* 
       UBAHAN DISINI: 
       - transition-all duration-500: Biar slide-nya halus.
       - ${isHidden ? 'translate-y-24 opacity-0' : 'translate-y-0 opacity-100'}:
         Kalau ada yang Maximize, Dock turun 96px (ngumpet) dan transparan.
    */
    <div className={`
      pb-4 flex justify-center w-full z-[150] fixed bottom-0 px-4 transition-all duration-500 ease-in-out
      ${isHidden ? 'translate-y-24 opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}
    `}>
      <div className="bg-white/10 backdrop-blur-2xl border border-white/20 p-2 rounded-2xl flex gap-2 md:gap-4 shadow-2xl pointer-events-auto">
        {dockItems.map((item) => (
          <div key={item.id} onClick={() => toggleApp(item.id)} className="relative group cursor-pointer">
            {/* ... isi icon tetap sama ... */}
            <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center text-2xl md:text-3xl transition-all duration-300 ${item.color} shadow-lg border border-white/5`}>
               {item.icon}
            </div>
            {apps[item.id].isOpen && (
              <div className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full shadow-[0_0_8px_white] ${apps[item.id].isMinimized ? 'bg-gray-500 opacity-50' : 'bg-white'}`}></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}