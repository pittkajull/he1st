import React, { useState, useEffect } from 'react';

export default function BootLoader() {
  const [logs, setLogs] = useState([]);
  
  const bootSequence = [
    "MBR: MUHAJIR-OS SECTOR 0... OK",
    "DECOMPRESSING KERNEL... DONE",
    "INITIALIZING SYSTEM CLOCK... OK",
    "CHECKING CPU: AMD RYZEN 3 3300U... DETECTED",
    "MEMORY CHECK: 16384MB... OK",
    "LOADING DRIVERS: GRAPHICS, NETWORK, HID... DONE",
    "MOUNTING SYSTEM FILESYSTEMS... OK",
    "STARTING NETWORK MANAGER... OK [10.10.14.26]",
    "ESTABLISHING SECURE CONNECTION... ENCRYPTED",
    "INITIALIZING MUHAJIR DESKTOP ENVIRONMENT...",
  ];

  useEffect(() => {
    // Nampilin log satu-satu tiap beberapa milidetik
    bootSequence.forEach((text, index) => {
      setTimeout(() => {
        setLogs(prev => [...prev, text]);
      }, index * 400); // Muncul tiap 0.4 detik
    });
  }, []);

  return (
    <div className="h-screen w-screen bg-black text-green-500 font-mono p-10 flex flex-col justify-start overflow-hidden selection:bg-green-500 selection:text-black">
      
      {/* ASCII LOGO */}
      <pre className="text-[10px] md:text-xs mb-10 opacity-80 leading-none">
{`
 ██████  ███████     ██████   ██████   ██████  ████████ 
██    ██ ██          ██   ██ ██    ██ ██    ██    ██    
██    ██ ███████     ██████  ██    ██ ██    ██    ██    
██    ██      ██     ██   ██ ██    ██ ██    ██    ██    
 ██████  ███████     ██████   ██████   ██████     ██    
`}
      </pre>

      {/* BOOTING LOGS */}
      <div className="space-y-1 text-xs md:text-sm">
        {logs.map((log, i) => (
          <div key={i} className="flex gap-4">
            <span className="text-gray-600">[{ (i * 0.42).toFixed(3) }]</span>
            <span>{log}</span>
          </div>
        ))}
      </div>

      {/* LOADING BAR (Bawah) */}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-64 space-y-2">
         <div className="flex justify-between text-[10px] uppercase tracking-widest">
            <span>System Load</span>
            <span className="animate-pulse">Processing...</span>
         </div>
         <div className="w-full bg-gray-900 h-1 rounded-full overflow-hidden">
            <div className="bg-green-500 h-full animate-[loading_5s_ease-in-out]"></div>
         </div>
      </div>

      {/* CSS KHUSUS BUAT LOADING BAR */}
      <style>{`
        @keyframes loading {
          0% { width: 0%; }
          20% { width: 10%; }
          50% { width: 60%; }
          80% { width: 90%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
}   