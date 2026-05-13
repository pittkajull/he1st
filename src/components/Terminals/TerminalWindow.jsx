import React, { useRef, useEffect, useState } from 'react';
import Draggable from 'react-draggable';

// ============================================================
// DATA
// ============================================================
const educationData = [
  {
    period: "2024 – Present",
    institution: "Universitas Brawijaya",
    major: "Information Technology – Vocational Faculty",
    detail: "Actively involved in HMPSTI, leading events, coordinating teams, and building skills in Frontend Dev & Cybersecurity alongside academic studies.",
    status: "ACTIVE",
    statusColor: "text-green-400",
  },
  {
    period: "2021 – 2024",
    institution: "MAN 1 Kota Serang",
    major: "Religious Education (IPA/Science Track)",
    detail: "Class Leader (Grade 12), active in ROHIS, Volleyball team, and MUBES committee. Developed leadership and communication skills.",
    status: "GRADUATED",
    statusColor: "text-blue-400",
  },
  {
    period: "2018 – 2021",
    institution: "Irhamna Bil Qur'an",
    major: "Tahfidz – Qur'an Memorization (5 Juz)",
    detail: "Completed 5 Juz of the Qur'an in a structured Islamic boarding environment. Built strong discipline, consistency, and time management.",
    status: "COMPLETED",
    statusColor: "text-purple-400",
  },
];

const recentActivity = [
  { status: "OK",  text: "Delivered TechFair Vol.2 field ops — 250+ participants managed" },
  { status: "OK",  text: "Completed Cisco Intro to Cybersecurity — verified on Credly" },
  { status: "OK",  text: "Shipped Class Billiard web platform — end-to-end UI/UX + frontend" },
  { status: "OK",  text: "Awarded Staff of the Month — HMPSTI Research & Tech Division" },
  { status: "OK",  text: "Completed TryHackMe Junior Pentester path" },
  { status: "RUN", text: "Currently: pursuing deeper Red Team & Penetration Testing skills..." },
];

// ============================================================
// COMMAND RESPONSES
// ============================================================
const COMMANDS = {
  whoami: () => ([
    { text: 'muhajir_amrullah', color: 'text-white font-bold' },
    { text: 'Frontend Developer · UI/UX Designer · CySec Enthusiast' },
    { text: 'Location : Malang, East Java, ID' },
    { text: 'Status   : ● actively_learning', color: 'text-green-400' },
  ]),
  'cat about.txt': () => ([
    { text: 'Focused on Front-End Development, UI/UX Design, and Cyber Security,', color: 'text-gray-300' },
    { text: 'particularly Penetration Testing. Passionate about crafting intuitive', color: 'text-gray-300' },
    { text: 'user experiences while developing a security-first mindset.', color: 'text-gray-300' },
  ]),
  'ls skills/': () => ([
    { text: 'react.js       [82%]  ████████░░', color: 'text-orange-400' },
    { text: 'html_css       [88%]  █████████░', color: 'text-orange-400' },
    { text: 'tailwind       [80%]  ████████░░', color: 'text-orange-400' },
    { text: 'figma_uiux     [78%]  ████████░░', color: 'text-pink-400' },
    { text: 'graphic_design [80%]  ████████░░', color: 'text-pink-400' },
    { text: 'pentest        [58%]  ██████░░░░', color: 'text-green-400' },
    { text: 'web_security   [62%]  ██████░░░░', color: 'text-green-400' },
    { text: 'leadership     [85%]  █████████░', color: 'text-blue-400' },
  ]),
  'ls projects/': () => ([
    { text: 'class_billiard_web     → React · UI/UX · Frontend Dev', color: 'text-cyan-300' },
    { text: 'portfolio_os_themed    → React · Tailwind · Design System', color: 'text-cyan-300' },
    { text: 'yollins_club_posters   → Graphic Design · Branding', color: 'text-cyan-300' },
    { text: 'techfair_design_assets → Creative Direction · CDM', color: 'text-cyan-300' },
    { text: "→ open Projects.localized for full list", color: 'text-yellow-400' },
  ]),
  'cat contact.txt': () => ([
    { text: 'LinkedIn : linkedin.com/in/muhajir-amrullah22', color: 'text-blue-400' },
    { text: 'Email    : muhajir@example.com', color: 'text-gray-300' },
    { text: "→ open Contact.chat to send a live message", color: 'text-yellow-400' },
  ]),
  'ls certs/': () => ([
    { text: '[2026] Cisco - Intro to Cybersecurity    ✓ Credly Verified', color: 'text-green-400' },
    { text: '[2025] TryHackMe - Junior Pentester      ✓', color: 'text-green-400' },
    { text: '[2024] IGnite - Web Security Fundamentals ✓', color: 'text-green-400' },
    { text: '[2024] Sololearn - Introduction to Java  ✓', color: 'text-green-400' },
    { text: '[2026] UB HR - Internship Staff Cert      ✓', color: 'text-green-400' },
    { text: '[2022] RISMA - Leadership Training        ✓', color: 'text-green-400' },
    { text: "[2021] Irhamna - Tasmi Qur'an 5 Juz      ✓", color: 'text-green-400' },
    { text: "→ open Skills.stats to view certificate gallery", color: 'text-yellow-400' },
  ]),
  help: () => ([
    { text: '┌──────────────────────────────────────┐', color: 'text-gray-600' },
    { text: '│  AVAILABLE COMMANDS                  │', color: 'text-gray-500' },
    { text: '├──────────────────────────────────────┤', color: 'text-gray-600' },
    { text: '  whoami          → identity info' },
    { text: '  cat about.txt   → full bio' },
    { text: '  ls skills/      → tech stack & levels' },
    { text: '  ls projects/    → project list' },
    { text: '  ls certs/       → certifications' },
    { text: '  cat contact.txt → contact info' },
    { text: '  clear           → clear terminal' },
    { text: '  help            → this menu' },
    { text: '└──────────────────────────────────────┘', color: 'text-gray-600' },
  ]),
};

// ============================================================
// TYPING HOOK
// ============================================================
function useTyping(text, speed = 18, delay = 0) {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    let i = 0;
    setDisplayed('');
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayed(text.slice(0, i + 1));
        i++;
        if (i >= text.length) clearInterval(interval);
      }, speed);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [text, speed, delay]);
  return displayed;
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function TerminalWindow({ isMaximized, toggleMax, minimize, close, zIndex, onFocus }) {
  const nodeRef = useRef(null);
  const inputRef = useRef(null);
  const bottomRef = useRef(null);

  const [showEdu, setShowEdu] = useState(false);
  const [showInteractive, setShowInteractive] = useState(false);
  const [expandedEdu, setExpandedEdu] = useState(null);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [cmdHistory, setCmdHistory] = useState([]);
  const [historyIdx, setHistoryIdx] = useState(-1);

  const bioText = "Focused on Front-End Development, UI/UX Design, and Cyber Security — particularly Penetration Testing. Passionate about crafting intuitive user experiences while developing a security-first mindset.";
  const typedBio = useTyping(bioText, 18, 400);
  const bioDelay = bioText.length * 18 + 800;

  useEffect(() => {
    const t1 = setTimeout(() => setShowEdu(true), bioDelay);
    const t2 = setTimeout(() => setShowInteractive(true), bioDelay + 800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, showInteractive]);

  const runCommand = (cmd) => {
    const trimmed = cmd.trim().toLowerCase();
    if (!trimmed) return;
    setCmdHistory(prev => [trimmed, ...prev]);
    setHistoryIdx(-1);
    if (trimmed === 'clear') { setHistory([]); return; }
    const fn = COMMANDS[trimmed];
    if (fn) {
      setHistory(prev => [...prev, { cmd: trimmed, outputs: fn() }]);
    } else {
      setHistory(prev => [...prev, {
        cmd: trimmed,
        outputs: [
          { text: `bash: ${trimmed}: command not found`, color: 'text-red-400' },
          { text: "type 'help' to see available commands", color: 'text-gray-600' },
        ]
      }]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') { runCommand(input); setInput(''); }
    else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const idx = Math.min(historyIdx + 1, cmdHistory.length - 1);
      setHistoryIdx(idx);
      setInput(cmdHistory[idx] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const idx = Math.max(historyIdx - 1, -1);
      setHistoryIdx(idx);
      setInput(idx === -1 ? '' : cmdHistory[idx] || '');
    }
  };

  return (
    <Draggable
      nodeRef={nodeRef} handle=".window-header"
      disabled={isMaximized || window.innerWidth < 768}
      position={isMaximized || window.innerWidth < 768 ? { x: 0, y: 0 } : null}
    >
      <div
        ref={nodeRef} onMouseDown={onFocus} onTouchStart={onFocus}
        style={{ zIndex, transform: (isMaximized || window.innerWidth < 768) ? 'none' : undefined }}
        className={`bg-[#0c0c0c]/95 backdrop-blur-md shadow-2xl flex flex-col overflow-hidden transition-all duration-300 border border-white/10
          ${isMaximized
            ? 'fixed !top-8 !left-0 w-screen h-[calc(100vh-2rem)] rounded-none'
            : 'absolute top-1 left-1/2 -translate-x-1/2 w-[95%] max-w-4xl h-[600px] rounded-lg'}`}
      >
        {/* HEADER */}
        <div className={`window-header bg-[#1a1a1a] px-4 py-2 flex justify-between items-center select-none ${isMaximized ? 'cursor-default' : 'cursor-move'}`}>
          <span className="text-[10px] md:text-xs text-gray-400 font-mono italic">muhajir@kali: ~</span>
          <div className="flex items-center gap-4 md:gap-3">
            <button onClick={(e) => { e.stopPropagation(); minimize(); }} className="w-8 h-8 md:w-3.5 md:h-3.5 rounded-full bg-gray-600 hover:bg-yellow-500 transition flex items-center justify-center">—</button>
            <button onClick={(e) => { e.stopPropagation(); toggleMax(); }} className="hidden md:flex md:w-3.5 md:h-3.5 rounded-full bg-gray-600 hover:bg-green-500 transition items-center justify-center">▢</button>
            <button onClick={(e) => { e.stopPropagation(); close(); }} className="w-8 h-8 md:w-3.5 md:h-3.5 rounded-full bg-gray-600 hover:bg-red-500 transition flex items-center justify-center">✕</button>
          </div>
        </div>

        {/* BODY */}
        <div
          className="flex-1 p-4 md:p-6 font-mono text-sm overflow-y-auto text-cyan-400 custom-scroll space-y-6"
          onClick={() => inputRef.current?.focus()}
        >

          {/* NEOFETCH */}
          <div className="flex flex-col md:flex-row gap-6 md:gap-10">
            <div className="flex flex-col items-center shrink-0">
              <div className="relative group">
                <div className="absolute -inset-1 bg-cyan-500/20 rounded blur group-hover:bg-cyan-500/40 transition"></div>
                <div className="relative w-40 h-40 md:w-48 md:h-48 overflow-hidden border border-cyan-500/50 bg-black rounded">
                  <img
                    src="img/kejol.jpeg"
                    alt="Muhajir Amrullah"
                    className="w-full h-full object-cover grayscale contrast-125 brightness-90 hover:grayscale-0 transition-all duration-700"
                  />
                  <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px]"></div>
                </div>
              </div>
              <p className="text-[10px] text-center mt-2 text-white bg-blue-600 px-2 py-0.5 italic rounded-sm">Authorized_User</p>
            </div>

            <div className="space-y-1.5 text-[12px] md:text-sm">
              <h2 className="text-xl font-black text-white uppercase tracking-tighter">Muhajir Amrullah</h2>
              <p className="text-gray-600">{'─'.repeat(30)}</p>
              <p><span className="text-blue-500 font-bold">OS:</span>       Brawijaya-University (Vocational)</p>
              <p><span className="text-blue-500 font-bold">Major:</span>    Information-Technology</p>
              <p><span className="text-blue-500 font-bold">Kernel:</span>   Frontend-Dev / RedTeam-Aspirant</p>
              <p><span className="text-blue-500 font-bold">Location:</span> Malang, East Java, ID</p>
              <p><span className="text-blue-500 font-bold">Theme:</span>    Kali / CyberSecurity / Pentest</p>
              <p><span className="text-blue-500 font-bold">Shell:</span>    bash 5.2.15 · zsh 5.9</p>
              <p><span className="text-blue-500 font-bold">Status:</span>   <span className="text-green-400 animate-pulse">● actively_learning</span></p>
              <div className="flex gap-1 mt-2">
                {['bg-red-500','bg-orange-500','bg-yellow-500','bg-green-500','bg-cyan-500','bg-blue-500','bg-purple-500','bg-pink-500'].map(c => (
                  <div key={c} className={`w-4 h-4 rounded-sm ${c}`}></div>
                ))}
              </div>
            </div>
          </div>

          {/* BIO */}
          <div>
            <p className="text-white font-bold mb-2">$ cat bio_muhajir.txt</p>
            <p className="text-gray-300 leading-relaxed text-[12px] md:text-sm">
              {typedBio}
              {typedBio.length < bioText.length && (
                <span className="inline-block w-2 h-4 bg-cyan-400 animate-pulse ml-0.5 align-middle"></span>
              )}
            </p>
          </div>

          {/* EDUCATION */}
          {showEdu && (
            <div className="animate-in fade-in duration-500">
              <p className="text-white font-bold mb-2">$ cat education.log</p>
              <div className="space-y-2">
                {educationData.map((edu, i) => (
                  <div
                    key={i}
                    onClick={(e) => { e.stopPropagation(); setExpandedEdu(expandedEdu === i ? null : i); }}
                    className="cursor-pointer border border-white/5 hover:border-cyan-500/20 rounded p-3 transition-all hover:bg-white/5"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] text-gray-600">[{edu.period}]</span>
                      <span className="text-white font-bold text-[12px]">{edu.institution}</span>
                      <span className="text-gray-500">›</span>
                      <span className="text-cyan-300 text-[11px]">{edu.major}</span>
                      <span className={`ml-auto text-[9px] font-bold ${edu.statusColor}`}>[{edu.status}]</span>
                    </div>
                    {expandedEdu === i && (
                      <p className="mt-2 text-[11px] text-gray-400 leading-relaxed border-t border-white/5 pt-2">{edu.detail}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* RECENT ACTIVITY */}
          {showEdu && (
            <div className="animate-in fade-in duration-700">
              <p className="text-white font-bold mb-2">$ ls --recent-activity</p>
              <div className="space-y-1.5 text-[11px]">
                {recentActivity.map((item, i) => (
                  <div key={i} className="flex gap-2 items-start">
                    <span className={`shrink-0 font-bold ${item.status === 'OK' ? 'text-green-500' : 'text-yellow-400 animate-pulse'}`}>[{item.status}]</span>
                    <span className="text-gray-400">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DIVIDER */}
          {showInteractive && (
            <div className="animate-in fade-in duration-500 border-t border-white/5 pt-4">
              <p className="text-gray-600 text-[10px]">{'─'.repeat(20)} interactive mode {'─'.repeat(20)}</p>
              <p className="text-gray-700 text-[10px] mt-1">type <span className="text-cyan-500">'help'</span> for commands · ↑↓ for history</p>
            </div>
          )}

          {/* COMMAND HISTORY */}
          {showInteractive && history.map((entry, i) => (
            <div key={i} className="space-y-1 animate-in fade-in duration-200">
              <div className="flex gap-2 text-[12px]">
                <span className="text-[#ff5555]">└─$</span>
                <span className="text-white">{entry.cmd}</span>
              </div>
              <div className="pl-4 space-y-0.5">
                {entry.outputs.map((line, j) => (
                  <p key={j} className={`text-[11px] leading-relaxed font-mono ${line.color || 'text-cyan-300'}`}>{line.text}</p>
                ))}
              </div>
            </div>
          ))}

          {/* INPUT */}
          {showInteractive && (
            <div className="animate-in fade-in duration-700">
              <div className="text-[#ff5555] text-[12px]">┌──(muhajir㉿kali)-[~]</div>
              <div className="flex gap-2 items-center">
                <span className="text-[#ff5555] text-[12px]">└─$</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent text-white text-[12px] outline-none caret-white font-mono"
                  spellCheck={false}
                  autoComplete="off"
                  autoFocus
                />
                {!input && <span className="w-2 h-4 bg-white animate-pulse"></span>}
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>
    </Draggable>
  );
}