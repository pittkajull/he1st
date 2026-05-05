import React from 'react';

export default function Desktop({ toggleApp }) {
  // Daftar shortcut aplikasi
  const desktopApps = [
    { id: 'profile', name: 'Profile.sh', icon: '🐚', color: 'bg-gray-800' },
    { id: 'education', name: 'Education.db', icon: '🗄️', color: 'bg-blue-600' },
    { id: 'projects', name: 'Projects.localized', icon: '💼', color: 'bg-white text-black' },
    { id: 'skills', name: 'Skills.stats', icon: '📊', color: 'bg-orange-700' },
    { id: 'contact', name: 'Contact.chat', icon: '💬', color: 'bg-indigo-600' },
  ];

  return (
    /* 
       UBAHAN DISINI: 
       - 'grid grid-cols-2': Kita buat jadi 2 kolom (Bisa 3 kalau lu mau).
       - 'grid-flow-row': Ngisi ke samping dulu baru ke bawah.
       - 'gap-x-12': Kasih jarak lebar antar kolom biar teksnya gak tabrakan.
    */
    <div className="gap-x-12 md:grid-cols-3 gap-x-12 gap-y-10 w-fit h-fit">
      {desktopApps.map((app) => (
        <div 
          key={app.id}
          onClick={() => toggleApp(app.id)}
          className="group w-20 flex flex-col items-center gap-1 cursor-pointer select-none"
        >
          {/* Icon Box */}
          <div className={`
            w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-3xl md:text-4xl transition-all duration-200 
            ${app.color} bg-opacity-80 group-hover:bg-opacity-100 group-hover:scale-110 
            border border-white/10 shadow-lg group-active:scale-95
          `}>
            {app.icon}
          </div>
          
          {/* Label Nama */}
          <span className="text-[9px] md:text-[10px] text-white font-bold bg-black/40 px-2 py-0.5 rounded shadow-sm group-hover:bg-black/60 transition-colors uppercase tracking-tighter text-center whitespace-nowrap">
            {app.name}
          </span>
        </div>
      ))}
    </div>
  );
}