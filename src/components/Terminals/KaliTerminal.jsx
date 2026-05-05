export default function KaliTerminal({ onClose }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-40 p-4">
      <div className="w-full max-w-4xl border border-cyan-500/40 bg-[#0a0b10]/95 shadow-[0_0_50px_rgba(6,182,212,0.1)] flex flex-col h-[500px] animate-in zoom-in duration-150">
        
        {/* TERMINAL CONTENT */}
        <div className="flex-1 flex flex-col md:flex-row p-8 md:p-12 gap-10 overflow-y-auto">
          {/* KIRI: FOTO (Gantiin Naga) */}
          <div className="w-full md:w-1/3 flex items-center justify-center">
            <img 
              src="https://via.placeholder.com/300" // <--- GANTI FOTO LU DISINI
              className="w-full opacity-60 grayscale contrast-125 brightness-110" 
              alt="Avatar"
            />
          </div>

          {/* KANAN: INFO */}
          <div className="w-full md:w-2/3 text-cyan-400 text-xs md:text-sm space-y-1">
            <h2 className="text-xl font-bold mb-2">muhajir@kali</h2>
            <p className="text-gray-600">------------------</p>
            <p><span className="text-white font-bold">OS:</span> Kali GNU/Linux Rolling x86_64</p>
            <p><span className="text-white font-bold">Host:</span> VirtualBox 1.2</p>
            <p><span className="text-white font-bold">Kernel:</span> 6.5.0-kali3-amd64</p>
            <p><span className="text-white font-bold">Uptime:</span> 22 mins</p>
            <p><span className="text-white font-bold">Shell:</span> zsh 5.9</p>
            <p><span className="text-white font-bold">WM:</span> i3</p>
            <p><span className="text-white font-bold">CPU:</span> AMD Ryzen 3 3300U</p>
            <p><span className="text-white font-bold">Memory:</span> 868MiB / 3928MiB</p>
            
            <div className="pt-6 flex gap-2">
               <span className="text-green-500 font-bold underline">root@muhajir:~#</span>
               <span className="w-2 h-5 bg-cyan-500 animate-pulse"></span>
            </div>
          </div>
        </div>

        {/* FOOTER (TMUX BAR) */}
        <div className="bg-[#1a1b26] px-4 py-1 flex justify-between items-center text-[10px] text-cyan-500 border-t border-cyan-500/20 font-bold">
           <div className="flex gap-4 italic">
             <span>[Overgraph]</span>
             <span>0:vpn- 1:scanning*</span>
           </div>
           <div className="flex gap-4">
             <span>󱘖 10.10.14.26</span>
             <span>󰒄 10.10.11.157</span>
           </div>
        </div>

        {/* TOMBOL CLOSE (X) */}
        <button onClick={onClose} className="absolute top-3 right-4 text-gray-600 hover:text-red-500 transition">
          ✕
        </button>
      </div>
    </div>
  );
}