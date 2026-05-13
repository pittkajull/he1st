import React, { useRef, useState, useEffect } from 'react';
import Draggable from 'react-draggable';

// ============================================================
// CONTACT LINKS — pakai logo asli dari public/img
// ============================================================
const CONTACTS = [
  { label: 'Email',     logo: '/img/email.png',     url: 'mailto:muhajiramrullahub@gmail.com',             display: 'muhajiramrullahub@gmail.com' },
  { label: 'LinkedIn',  logo: '/img/linkedin.png',  url: 'https://www.linkedin.com/in/muhajir-amrullah22', display: 'linkedin.com/in/muhajir-amrullah22' },
  { label: 'GitHub',    logo: '/img/github.png',    url: 'https://github.com/pittkajull',                  display: 'github.com/pittkajull' },
  { label: 'Medium',    logo: '/img/medium.png',    url: 'https://medium.com/@muhajiramrullahub',           display: 'medium.com/@muhajiramrullahub' },
  { label: 'Linktree',  logo: '/img/linktree.png',  url: 'https://linktr.ee/muhajiramrullah',               display: 'linktr.ee/muhajiramrullah' },
  { label: 'Instagram', logo: '/img/instagram.png', url: 'https://www.instagram.com/muhajiramrllh._',      display: '@muhajiramrllh._' },
  { label: 'TikTok',    logo: '/img/tiktok.png',    url: 'https://www.tiktok.com/@user0123405056789101112', display: '@muhajiramrullah' },
];

// ============================================================
// KNOWLEDGE BASE
// ============================================================
const KB = [
  {
    keywords: ['halo', 'hai', 'hello', 'hi', 'hey', 'yo', 'assalamualaikum', 'salam', 'pagi', 'sore', 'malam'],
    response: () => `Halo! 👋 Saya **Edelweys**, asisten virtual Muhajir Amrullah.\n\nSaya bisa bantu Anda mengenal Muhajir lebih dalam — skill, project, pengalaman, atau jika Anda ingin hire dia.\n\nCoba tanyakan:\n• "siapa muhajir?"\n• "skill apa yang dia punya?"\n• "apakah dia available untuk hire?"`,
  },
  {
    keywords: ['edelweys', 'kamu siapa', 'kamu ini', 'bot', 'asisten', 'assistant', 'ai'],
    response: () => `Saya **Edelweys** 🌸 — asisten virtual yang dibuat untuk membantu Anda mengenal **Muhajir Amrullah** lebih dalam.\n\nSaya bisa menjawab pertanyaan seputar:\n• Profil & latar belakang Muhajir\n• Skill & tech stack-nya\n• Project & pengalaman kerjanya\n• Cara menghubunginya\n\nKetik **'help'** untuk melihat semua topik yang bisa ditanyakan! 😊`,
  },
  {
    keywords: ['help', 'bantuan', 'panduan', 'topik', 'apa saja', 'bisa tanya apa', 'tanya apa'],
    response: () => `Berikut topik yang bisa Anda tanyakan:\n\n👤 **Profil** → "siapa muhajir?"\n💻 **Skill** → "skill apa yang dia miliki?"\n🗂️ **Project** → "project apa saja yang dia buat?"\n📋 **Pengalaman** → "pengalaman organisasinya apa?"\n🏆 **Sertifikat** → "sertifikat apa yang dia punya?"\n🔐 **Cybersec** → "kemampuan cybersecurity-nya?"\n🎨 **Design** → "pengalaman design-nya?"\n✅ **Hire** → "apakah dia available?"\n💰 **Rate** → "berapa rate freelance-nya?"\n📍 **Lokasi** → "dia tinggal di mana?"\n📬 **Kontak** → "cara menghubungi muhajir?"\n\nKetik pertanyaan Anda secara bebas! 😊`,
  },
  {
    keywords: ['siapa muhajir', 'profil muhajir', 'tentang muhajir', 'muhajir itu', 'muhajir siapa', 'perkenalkan muhajir'],
    response: () => `Muhajir Amrullah adalah mahasiswa **Information Technology (Vocational)** di Universitas Brawijaya, Malang. 🎓\n\nDia fokus di tiga bidang utama:\n• 🖥️ **Frontend Development** — React, Tailwind, UI/UX\n• 🎨 **Graphic Design & Multimedia** — Branding, content creation\n• 🔐 **Cybersecurity** — Penetration testing, web security\n\nSelain akademik, dia aktif di organisasi kampus dan sudah punya pengalaman kerja nyata sejak semester awal.`,
  },
  {
    keywords: ['skill', 'kemampuan', 'keahlian', 'tech stack', 'teknologi', 'bahasa pemrograman', 'programming'],
    response: () => `Berikut tech stack Muhajir:\n\n**Frontend:**\n• React.js [82%], HTML/CSS [88%], Tailwind [80%], JavaScript [72%]\n\n**Design:**\n• Figma/UI/UX [78%], Graphic Design [80%], Multimedia [75%]\n\n**Cybersecurity:**\n• Penetration Testing [60%], Web Security [62%], Kali Linux [65%]\n\n**Soft Skills:**\n• Leadership [85%], Event Management [83%], Communication [87%]\n\nBuka **Skills.stats** untuk melihat detail + gallery sertifikatnya! 📊`,
  },
  {
    keywords: ['project', 'projek', 'karya', 'portfolio', 'portofolio', 'hasil kerja', 'apa yang pernah dibuat'],
    response: () => `Muhajir sudah mengerjakan beberapa project nyata:\n\n🌐 **Class Billiard Web** — Frontend dev + UI/UX untuk venue billiard di Kalimantan. Live di classbilliard.com\n\n🎨 **Yollins Club Posters** — 3 poster promosi untuk clothing brand\n\n🖥️ **OS-Themed Portfolio** — Website portfolio yang sedang Anda lihat sekarang 😄\n\nBuka **Projects.localized** untuk melihat semua project lengkapnya! 💼`,
  },
  {
    keywords: ['pengalaman', 'experience', 'organisasi', 'riwayat', 'pernah kerja', 'pernah ikut'],
    response: () => `Muhajir memiliki pengalaman organisasi yang sangat padat:\n\n🏆 **Staff of the Month** — HMPSTI Research & Tech Division (Sep 2025)\n👨‍💼 **Project Leader** — EXPERT x SIAP ADMIN x SAKU Vol.3 (27 panitia, 100+ peserta)\n🎯 **Field Coordinator** — TechFair Vol.2 (250+ peserta)\n💻 **Frontend Dev** — Class Billiard (freelance, live project)\n🎨 **Multimedia Designer** — PROVOKS UB (11 bulan)\n\n...dan masih banyak lagi! Buka **Experience.log** untuk melihat riwayat lengkapnya. 📋`,
  },
  {
    keywords: ['sertifikat', 'sertifikasi', 'certificate', 'cert', 'lisensi', 'license', 'kredensial'],
    response: () => `Sertifikat yang dimiliki Muhajir:\n\n✅ **Cisco** — Introduction to Cybersecurity (Apr 2026, Credly verified)\n✅ **TryHackMe** — Junior Pentester Path (2025)\n✅ **IGnite Academy** — Web Security Fundamentals (2024)\n✅ **Sololearn** — Introduction to Java (Nov 2024)\n✅ **UB HR** — Internship Staff Certificate (Jan 2026)\n✅ **ROHIS** — Leadership Training MAN 1 Kota Serang (2022)\n✅ **Irhamna** — Tasmi Qur'an 5 Juz (2021)\n✅ **Ethical Hacking** — Sertifikasi Ethical Hacking\n✅ **Kali Linux** — Sertifikasi Kali Linux\n\nBuka **Skills.stats** untuk melihat foto sertifikatnya! 🏆`,
  },
  {
    keywords: ['hire', 'rekrut', 'available', 'tersedia', 'open work', 'freelance', 'magang', 'internship', 'lowongan', 'collab', 'kerja sama', 'bisa diajak', 'butuh developer', 'cari developer'],
    response: () => `**Muhajir saat ini OPEN untuk:**\n\n✅ Freelance project (Web Dev, UI/UX, Graphic Design)\n✅ Internship / Magang\n✅ Kolaborasi project\n✅ Part-time remote work\n\nUntuk diskusi lebih lanjut, hubungi langsung via:\n📧 muhajiramrullahub@gmail.com\n💼 linkedin.com/in/muhajir-amrullah22\n\nAtau buka tab **Contact Links** di atas! 👆`,
  },
  {
    keywords: ['kontak', 'contact', 'hubungi', 'reach out', 'dm', 'email', 'sosmed', 'social media', 'instagram', 'linkedin', 'github', 'tiktok'],
    response: () => `Anda bisa menghubungi Muhajir melalui:\n\n✉️ **Email** — muhajiramrullahub@gmail.com\n💼 **LinkedIn** — linkedin.com/in/muhajir-amrullah22\n🐙 **GitHub** — github.com/pittkajull\n📝 **Medium** — medium.com/@muhajiramrullahub\n🌿 **Linktree** — linktr.ee/muhajiramrullah\n\nBuka tab **Contact Links** di atas untuk akses langsung ke semua platform! 👆`,
  },
  {
    keywords: ['pendidikan', 'kuliah', 'sekolah', 'education', 'study', 'universitas brawijaya', 'ub vokasi', 'man 1'],
    response: () => `Riwayat pendidikan Muhajir:\n\n🎓 **Universitas Brawijaya** (2024–Sekarang)\nInformation Technology — Vocational Faculty, Malang\n\n🏫 **MAN 1 Kota Serang** (2021–2024)\nReligious Education — Class Leader Grade 12\n\n📖 **Irhamna Bil Qur'an** (2018–2021)\nTahfidz — Menghafal 5 Juz Al-Qur'an\n\nBuka **Profile.sh** untuk melihat detail lengkapnya! 🖥️`,
  },
  {
    keywords: ['cybersecurity', 'cyber security', 'hacking', 'hacker', 'pentest', 'penetration testing', 'tryhackme', 'ctf', 'ethical hacking', 'keamanan siber', 'kali linux'],
    response: () => `Muhajir sangat passionate di bidang Cybersecurity! 🔐\n\nPencapaiannya:\n• Menyelesaikan **Junior Pentester Path** di TryHackMe\n• Simulasi eksploitasi **Samba 3.0.20**\n• Tantangan **JWT Token Forgery** di IGnite Academy\n• Certified **Cisco Intro to Cybersecurity** (Credly verified)\n• Sertifikasi **Ethical Hacking** & **Kali Linux**\n• Aktif mempelajari **Web Security** — XSS, SQLi, OWASP Top 10\n\nTarget jangka panjang: menjadi **Red Team Professional**. 🎯`,
  },
  {
    keywords: ['design', 'desain', 'figma', 'graphic design', 'poster', 'visual', 'kreatif', 'ui ux', 'user interface'],
    response: () => `Muhajir juga solid di bidang design! 🎨\n\nPengalamannya:\n• **Coordinator Creative Design Media** — TechFair Vol.1 (desain disetujui dosen)\n• **Multimedia Designer** — PROVOKS UB (11 bulan)\n• **Freelance Graphic Designer** — Yollins Club (poster clothing brand)\n• **Secretary & CDM** — TechBridge Academy\n\nTools: Figma, Adobe tools, dan berbagai software desain kreatif.\nLihat hasilnya di **Projects.localized**! 💼`,
  },
  {
    keywords: ['frontend', 'react', 'web developer', 'developer', 'coding', 'code', 'html', 'css', 'javascript', 'tailwind', 'laravel'],
    response: () => `Muhajir adalah Frontend Developer yang solid! 💻\n\nStack utamanya:\n• **React.js** — component-based, hooks, state management\n• **Tailwind CSS** — utility-first, responsive design\n• **HTML & CSS** — semantic, accessible, animasi\n• **JavaScript** — ES6+, DOM, async/await\n\nProject live:\n🌐 **classbilliard.com** — full frontend + UI/UX\n🖥️ **Portfolio OS-themed** ini sendiri!\n\nBuka Projects.localized untuk melihat lebih lanjut! 🚀`,
  },
  {
    keywords: ['medium', 'artikel', 'blog', 'tulisan', 'nulis', 'menulis', 'content'],
    response: () => `Muhajir aktif menulis artikel di Medium! 📝\n\nTopik yang biasa dibahas:\n• Web Development & Frontend tips\n• Cybersecurity & ethical hacking\n• Pengalaman organisasi & kepemimpinan\n\nCek tulisannya di:\n📝 medium.com/@muhajiramrullahub\n\n(Link juga tersedia di tab **Contact Links**!) 👆`,
  },
  {
    keywords: ['rate', 'harga', 'biaya', 'bayar', 'price', 'cost', 'budget', 'tarif'],
    response: () => `Untuk rate freelance Muhajir, lebih baik didiskusikan langsung karena tergantung scope project-nya. 😊\n\nHubungi via:\n📧 muhajiramrullahub@gmail.com\n💼 linkedin.com/in/muhajir-amrullah22\n\nMuhajir terbuka untuk negosiasi dan siap mendengarkan kebutuhan project Anda terlebih dahulu! 🤝`,
  },
  {
    keywords: ['lokasi', 'location', 'domisili', 'tinggal di mana', 'kota', 'malang', 'jawa timur', 'indonesia'],
    response: () => `Muhajir tinggal di **Malang, East Java, Indonesia** 📍\n\nDia terbuka untuk:\n• Remote work (dari mana saja)\n• On-site di area Malang\n• Hybrid\n\nUntuk project luar kota atau luar negeri, bisa didiskusikan lebih lanjut! 💬`,
  },
  {
    keywords: ['terima kasih', 'makasih', 'thanks', 'thank you', 'thx', 'ty'],
    response: () => `Sama-sama! 😊 Senang bisa membantu.\n\nJika ada pertanyaan lain, jangan ragu bertanya. Dan jika ingin menghubungi Muhajir langsung, buka tab **Contact Links** di atas. 👆`,
  },
  {
    keywords: ['keren', 'bagus', 'mantap', 'wow', 'impressive', 'amazing', 'hebat', 'luar biasa'],
    response: () => `Terima kasih! 😄 Muhajir memang terus berkembang dan berdedikasi di bidang yang dia tekuni.\n\nAda hal lain yang ingin Anda ketahui? Saya siap membantu! 🌸`,
  },
];

function findResponse(input) {
  const lower = input.toLowerCase().trim();
  for (const entry of KB) {
    const match = entry.keywords.some(kw => {
      const regex = new RegExp(`(^|\\s|[^a-z])${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\s|$|[^a-z])`, 'i');
      return regex.test(lower) || lower === kw;
    });
    if (match) return typeof entry.response === 'function' ? entry.response() : entry.response;
  }
  return `Hmm, saya belum memiliki jawaban untuk itu. 🤔\n\nCoba tanyakan hal lain, atau ketik **'help'** untuk melihat topik yang bisa saya jawab.\n\nJika ingin berbicara langsung dengan Muhajir, silakan buka tab **Contact Links** di atas! 👆`;
}

function formatMessage(text) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i} className="text-white font-bold">{part}</strong> : part
  );
}

function Bubble({ msg }) {
  const isBot = msg.sender === 'bot';
  return (
    <div className={`flex gap-2 items-end ${isBot ? '' : 'flex-row-reverse'}`}>
      {isBot && (
        <div className="w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center text-xs shrink-0 mb-0.5">🌸</div>
      )}
      <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-[12px] leading-relaxed whitespace-pre-wrap
        ${isBot ? 'bg-[#383a40] text-gray-200 rounded-tl-none' : 'bg-indigo-600 text-white rounded-tr-none'}`}>
        {isBot ? formatMessage(msg.text) : msg.text}
        <p className="text-[9px] opacity-40 mt-1 text-right">{msg.time}</p>
      </div>
    </div>
  );
}

const QUICK_REPLIES = ['Siapa Muhajir?', 'Skill apa yang dia punya?', 'Apakah dia available?', 'Cara menghubunginya?'];

export default function ContactMe({ isMaximized, toggleMax, minimize, close, zIndex, onFocus }) {
  const nodeRef = useRef(null);
  const inputRef = useRef(null);
  const bottomRef = useRef(null);
  const [activeTab, setActiveTab] = useState('chat');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: `Halo! 👋 Saya **Edelweys**, asisten virtual Muhajir Amrullah.\n\nSaya bisa membantu Anda mengenal Muhajir lebih dalam — skill, project, pengalaman, atau jika Anda ingin hire dia.\n\nKetik pertanyaan Anda atau pilih topik di bawah! 😊`,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const time = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: trimmed, time }]);
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      const response = findResponse(trimmed);
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'bot',
        text: response,
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      }]);
    }, 700 + Math.random() * 500);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  };

  return (
    <Draggable
      nodeRef={nodeRef} handle=".cm-header"
      disabled={isMaximized || window.innerWidth < 768}
      position={isMaximized || window.innerWidth < 768 ? { x: 0, y: 0 } : null}
    >
      <div
        ref={nodeRef} onMouseDown={onFocus} onTouchStart={onFocus}
        style={{ zIndex, transform: (isMaximized || window.innerWidth < 768) ? 'none' : undefined }}
        className={`bg-[#313338] text-white shadow-2xl flex flex-col overflow-hidden transition-all duration-300
          ${isMaximized
            ? 'fixed !top-8 !left-0 w-screen h-[calc(100vh-2rem)] rounded-none'
            : 'absolute top-1 left-1/2 -translate-x-1/2 w-[90%] max-w-md h-[580px] rounded-xl border border-white/10'}`}
      >
        {/* HEADER */}
        <div className="cm-header bg-[#2b2d31] px-4 py-2.5 flex justify-between items-center select-none cursor-move border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center text-sm">🌸</div>
            <div>
              <p className="text-[12px] font-bold leading-none">Edelweys</p>
              <p className="text-[9px] text-green-400 flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span> Asisten Muhajir · Online
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 md:gap-2.5">
            <button onClick={(e) => { e.stopPropagation(); minimize(); }} className="w-10 h-10 md:w-3.5 md:h-3.5 rounded-full bg-[#ffbd2e] border border-[#dea123] hover:brightness-110 transition"></button>
            <button onClick={(e) => { e.stopPropagation(); toggleMax(); }} className="hidden md:flex w-3.5 h-3.5 rounded-full bg-[#27c93f] border border-[#1aab29] hover:brightness-110 transition items-center justify-center text-[6px] font-bold text-black/40">{isMaximized ? '❐' : '❑'}</button>
            <button onClick={(e) => { e.stopPropagation(); close(); }} className="w-10 h-10 md:w-3.5 md:h-3.5 rounded-full bg-[#ff5f56] border border-[#e0443e] hover:brightness-110 transition flex items-center justify-center text-black/40 font-bold text-xs md:text-[8px]">✕</button>
          </div>
        </div>

        {/* TABS */}
        <div className="flex border-b border-white/5 bg-[#2b2d31]">
          <button onClick={() => setActiveTab('chat')} className={`flex-1 py-2 text-[11px] font-bold uppercase tracking-widest transition-all border-b-2 ${activeTab === 'chat' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-gray-600 hover:text-gray-400'}`}>
            💬 Chat
          </button>
          <button onClick={() => setActiveTab('links')} className={`flex-1 py-2 text-[11px] font-bold uppercase tracking-widest transition-all border-b-2 ${activeTab === 'links' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-gray-600 hover:text-gray-400'}`}>
            🔗 Contact Links
          </button>
        </div>

        {/* TAB: CHAT */}
        {activeTab === 'chat' && (
          <>
            <div className="flex-1 p-4 overflow-y-auto space-y-3 custom-scroll font-sans">
              {messages.map(msg => <Bubble key={msg.id} msg={msg} />)}
              {isTyping && (
                <div className="flex gap-2 items-end">
                  <div className="w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center text-xs shrink-0">🌸</div>
                  <div className="bg-[#383a40] px-4 py-3 rounded-2xl rounded-tl-none">
                    <div className="flex gap-1 items-center">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Quick replies */}
            <div className="px-3 pb-2 flex gap-1.5 overflow-x-auto">
              {QUICK_REPLIES.map(qr => (
                <button key={qr} onClick={() => sendMessage(qr)}
                  className="shrink-0 px-2.5 py-1 bg-[#383a40] hover:bg-indigo-600 text-[10px] text-gray-300 hover:text-white rounded-full border border-white/10 transition-all">
                  {qr}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="p-3 bg-[#2b2d31] border-t border-white/5">
              <div className="flex items-center gap-2 bg-[#383a40] rounded-xl px-3 py-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Tanya sesuatu tentang Muhajir..."
                  className="flex-1 bg-transparent text-[12px] text-white outline-none placeholder-gray-600 font-sans"
                />
                <button onClick={() => sendMessage(input)} disabled={!input.trim()}
                  className="w-7 h-7 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all text-sm">
                  ➤
                </button>
              </div>
            </div>
          </>
        )}

        {/* TAB: CONTACT LINKS */}
        {activeTab === 'links' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scroll font-sans">
            <p className="text-[11px] text-gray-500 mb-3">Hubungi Muhajir langsung via platform berikut:</p>
            {CONTACTS.map((c) => (
              <a key={c.label} href={c.url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-[#2b2d31] hover:bg-[#383a40] rounded-xl border border-white/5 hover:border-indigo-500/30 transition-all group">
                {/* Logo asli */}
                <div className="w-9 h-9 rounded-xl overflow-hidden shrink-0 bg-white/5 flex items-center justify-center">
                  <img
                    src={c.logo}
                    alt={c.label}
                    className="w-7 h-7 object-contain"
                    onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                  />
                  {/* Fallback emoji kalau gambar gagal load */}
                  <span className="hidden text-lg">🔗</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-bold text-white">{c.label}</p>
                  <p className="text-[10px] text-gray-500 truncate group-hover:text-indigo-400 transition-colors">{c.display}</p>
                </div>
                <span className="text-gray-600 group-hover:text-indigo-400 transition-colors text-sm">→</span>
              </a>
            ))}
          </div>
        )}
      </div>
    </Draggable>
  );
}