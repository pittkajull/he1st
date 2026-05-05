import React, { useState, useEffect } from 'react';

export default function TopBar() {
  // 1. State buat nyimpen waktu sekarang
  const [dateTime, setDateTime] = useState(new Date());

  // 2. Efek buat nge-update jam setiap detik
  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date()); // Update state pake waktu terbaru
    }, 1000);

    // Bersihin timer kalau komponennya mati biar gak nge-lag
    return () => clearInterval(timer);
  }, []);

  // 3. Helper buat format tanggal (Contoh: 05 May 11:19 PM)
  const formatDateTime = () => {
    return dateTime.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit', // Tambahin detik biar makin keren liatnya gerak
      hour12: true
    }).replace(',', ''); // Hapus koma bawaan format
  };

  return (
    <div className="h-8 bg-black/40 backdrop-blur-md flex items-center justify-between px-6 text-[11px] text-white font-medium z-[100]">
      <div className="flex gap-4">
        <span className="font-bold hover:bg-white/10 px-2 rounded transition cursor-default">Activities</span>
        <span className="hover:bg-white/10 px-2 rounded transition cursor-default">Places</span>
      </div>
      
      {/* TANGGAL & JAM REAL-TIME */}
      <div className="absolute left-1/2 -translate-x-1/2 tracking-widest uppercase font-bold">
        {formatDateTime()}
      </div>

      <div className="flex gap-4 items-center">
        <span className="flex items-center gap-1">󰖩 <span className="text-gray-300">100%</span></span>
        <span className="flex items-center gap-1">󰂄 <span className="text-gray-300">39%</span></span>
        <span className="hover:bg-white/10 px-1 rounded transition cursor-default text-[10px]">EN</span>
        <div className="w-3 h-3 bg-white rounded-full"></div>
      </div>
    </div>
  );
}