import React, { useRef, useState, useEffect } from 'react';
import Draggable from 'react-draggable';

// ============================================================
// REDACTED TEXT COMPONENT
// ============================================================
function Redacted({ children, revealed = false }) {
  const [isRevealed, setIsRevealed] = useState(revealed);
  return (
    <span
      onClick={() => setIsRevealed(!isRevealed)}
      title={isRevealed ? 'Click to redact' : 'Click to reveal'}
      className="cursor-pointer inline-block transition-all duration-300"
      style={{
        background: isRevealed ? 'transparent' : '#1a1a1a',
        color: isRevealed ? '#a3e635' : '#1a1a1a',
        padding: '0 4px',
        borderRadius: '2px',
        userSelect: isRevealed ? 'text' : 'none',
        border: isRevealed ? '1px solid #a3e63540' : '1px solid #333',
        fontSize: 'inherit',
      }}
    >
      {isRevealed ? children : '█'.repeat(Math.max(children.length, 8))}
    </span>
  );
}

// ============================================================
// GLITCH TEXT COMPONENT
// ============================================================
function GlitchText({ text, className = '' }) {
  return (
    <span className={`relative inline-block ${className}`} style={{ fontFamily: 'monospace' }}>
      <span className="relative z-10">{text}</span>
      <span
        aria-hidden
        className="absolute top-0 left-0 opacity-70"
        style={{
          color: '#ff0040',
          clipPath: 'polygon(0 30%, 100% 30%, 100% 50%, 0 50%)',
          transform: 'translateX(-2px)',
          animation: 'glitch1 3s infinite',
        }}
      >{text}</span>
      <span
        aria-hidden
        className="absolute top-0 left-0 opacity-70"
        style={{
          color: '#00ffff',
          clipPath: 'polygon(0 60%, 100% 60%, 100% 80%, 0 80%)',
          transform: 'translateX(2px)',
          animation: 'glitch2 3s infinite',
        }}
      >{text}</span>
      <style>{`
        @keyframes glitch1 {
          0%, 90%, 100% { transform: translateX(-2px); opacity: 0; }
          92% { transform: translateX(-4px); opacity: 0.7; }
          94% { transform: translateX(2px); opacity: 0.7; }
          96% { transform: translateX(0); opacity: 0; }
        }
        @keyframes glitch2 {
          0%, 88%, 100% { transform: translateX(2px); opacity: 0; }
          90% { transform: translateX(4px); opacity: 0.7; }
          93% { transform: translateX(-2px); opacity: 0.7; }
          95% { transform: translateX(0); opacity: 0; }
        }
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes flicker {
          0%, 97%, 100% { opacity: 1; }
          98% { opacity: 0.4; }
          99% { opacity: 0.8; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes stamp {
          0% { transform: scale(2) rotate(-15deg); opacity: 0; }
          60% { transform: scale(0.9) rotate(-15deg); opacity: 1; }
          80% { transform: scale(1.05) rotate(-15deg); }
          100% { transform: scale(1) rotate(-15deg); opacity: 1; }
        }
        .dossier-section { animation: fadeInUp 0.4s ease both; }
        .stamp-anim { animation: stamp 0.5s cubic-bezier(.36,.07,.19,.97) both; }
        .flicker { animation: flicker 5s infinite; }
        .scanline-anim {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 60px;
          background: linear-gradient(to bottom, transparent, rgba(0,255,0,0.03), transparent);
          animation: scanline 4s linear infinite;
          pointer-events: none;
          z-index: 5;
        }
      `}</style>
    </span>
  );
}

// ============================================================
// TYPING LINE COMPONENT
// ============================================================
function TypeLine({ text, delay = 0, speed = 30, className = '', onDone }) {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    let i = 0;
    const t = setTimeout(() => {
      const iv = setInterval(() => {
        setDisplayed(text.slice(0, ++i));
        if (i >= text.length) { clearInterval(iv); onDone?.(); }
      }, speed);
      return () => clearInterval(iv);
    }, delay);
    return () => clearTimeout(t);
  }, [text, delay, speed]);
  return <span className={className}>{displayed}<span style={{ animation: 'blink 1s infinite' }}>_</span></span>;
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function WhoAmI({ isMaximized, toggleMax, minimize, close, zIndex, onFocus }) {
  const nodeRef = useRef(null);
  const [phase, setPhase] = useState(0); // 0=booting, 1=dossier
  const [showDossier, setShowDossier] = useState(false);
  const [revealAll, setRevealAll] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setPhase(1);
      setTimeout(() => setShowDossier(true), 800);
    }, 2800);
    return () => clearTimeout(t);
  }, []);

  return (
    <Draggable
      nodeRef={nodeRef}
      handle=".whoami-header"
      disabled={isMaximized || window.innerWidth < 768}
      position={isMaximized || window.innerWidth < 768 ? { x: 0, y: 0 } : null}
    >
      <div
        ref={nodeRef}
        onMouseDown={onFocus}
        onTouchStart={onFocus}
        style={{
          zIndex,
          transform: (isMaximized || window.innerWidth < 768) ? 'none' : undefined,
          fontFamily: '"Courier New", Courier, monospace',
          background: '#0a0a0a',
        }}
        className={`text-white shadow-2xl flex flex-col overflow-hidden transition-all duration-300
          ${isMaximized
            ? 'fixed !top-8 !left-0 w-screen h-[calc(100vh-2rem)] rounded-none'
            : 'absolute top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-3xl h-[600px] rounded-xl border border-green-900/60'}`}
      >
        {/* SCANLINE EFFECT */}
        <div className="scanline-anim" />

        {/* HEADER */}
        <div className="whoami-header bg-[#0d1a0d] px-4 py-2 flex justify-between items-center border-b border-green-900/40 select-none cursor-move">
          <div className="flex items-center gap-2">
            <span className="text-green-500 text-xs">●</span>
            <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest">CLASSIFIED — WHOAMI.TXT — CLEARANCE LEVEL: VISITOR</span>
          </div>
          <div className="flex items-center gap-4 md:gap-2">
            <button onClick={(e) => { e.stopPropagation(); minimize(); }} className="w-10 h-10 md:w-6 md:h-6 hover:bg-white/10 rounded flex items-center justify-center text-green-700 hover:text-white transition">—</button>
            <button onClick={(e) => { e.stopPropagation(); toggleMax(); }} className="hidden md:flex w-6 h-6 hover:bg-white/10 rounded items-center justify-center text-green-700 hover:text-white transition text-xs">{isMaximized ? '❐' : '❑'}</button>
            <button onClick={(e) => { e.stopPropagation(); close(); }} className="w-10 h-10 md:w-6 md:h-6 hover:bg-red-700 rounded flex items-center justify-center text-green-700 hover:text-white transition">✕</button>
          </div>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 relative flicker" style={{ background: 'linear-gradient(180deg, #0a0a0a 0%, #060d06 100%)' }}>

          {/* BOOT PHASE */}
          {phase === 0 && (
            <div className="space-y-1 text-green-500 text-xs">
              <TypeLine text="$ sudo cat /etc/whoami.txt" delay={0} speed={40} />
              <div style={{ animationDelay: '0.8s' }} className="dossier-section">
                <TypeLine text="[sudo] password: ••••••••" delay={800} speed={40} />
              </div>
              <div style={{ animationDelay: '1.6s' }} className="dossier-section">
                <TypeLine text="Decrypting classified file... ████████████████ 100%" delay={1600} speed={20} />
              </div>
              <div style={{ animationDelay: '2.2s', color: '#ff0' }} className="dossier-section text-yellow-400">
                <TypeLine text="WARNING: Unauthorized access will be logged." delay={2200} speed={30} />
              </div>
            </div>
          )}

          {/* DOSSIER PHASE */}
          {showDossier && (
            <div className="space-y-5">

              {/* TOP HEADER BANNER */}
              <div className="border border-green-800/60 rounded p-3 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #00ff00 2px, #00ff00 3px)' }} />
                <p className="text-[9px] text-green-600 tracking-[0.4em] uppercase">— United Intelligence Portfolio Network —</p>
                <p className="text-[10px] text-red-500 tracking-[0.3em] font-bold mt-0.5">CLASSIFIED // RESTRICTED // FOR RECRUITER EYES ONLY</p>
                <p className="text-[9px] text-green-700 mt-0.5">Document ID: MJR-22-UB-PORTFOLIO-{new Date().getFullYear()}</p>
              </div>

              {/* MAIN DOSSIER CARD */}
              <div className="border border-green-800/40 rounded-lg overflow-hidden" style={{ animationDelay: '0.1s' }}>

                {/* SUBJECT HEADER */}
                <div className="bg-green-950/40 px-4 py-2 border-b border-green-800/30 flex items-center justify-between">
                  <span className="text-[10px] text-green-600 tracking-widest uppercase">SUBJECT PROFILE</span>
                  <span className="text-[9px] text-green-800">FILE-001-ALPHA</span>
                </div>

                <div className="p-4 flex gap-4 flex-col sm:flex-row">
                  {/* PHOTO */}
                  <div className="shrink-0">
                    <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded border-2 border-green-700/50 overflow-hidden"
                      style={{ filter: 'saturate(0.3) contrast(1.2)', boxShadow: '0 0 20px rgba(0,255,0,0.1)' }}>
                      <img
                        src="/h31st.jpeg"
                        alt="Subject"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="hidden w-full h-full bg-green-950 items-center justify-center text-4xl">👤</div>
                      {/* Scanline overlay on photo */}
                      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, #000 3px, #000 4px)' }} />
                    </div>
                    <div className="mt-1 text-center">
                      <span className="text-[8px] text-green-800 tracking-widest">PHOTO ON FILE</span>
                    </div>

                    {/* STAMP */}
                    <div className="mt-3 flex justify-center">
                      <div className="stamp-anim border-4 border-red-700/80 rounded px-2 py-1 text-red-700/80 text-[9px] font-black tracking-widest uppercase"
                        style={{ transform: 'rotate(-15deg)', boxShadow: 'inset 0 0 8px rgba(200,0,0,0.3)' }}>
                        DECLASSIFIED
                      </div>
                    </div>
                  </div>

                  {/* FIELDS */}
                  <div className="flex-1 space-y-2 text-xs">
                    {[
                      { label: 'FULL NAME', value: 'Muhajir Amrullah', secret: false },
                      { label: 'ALIAS', value: 'kajoels', secret: false },
                      { label: 'STATUS', value: 'ACTIVE — Available for hire', secret: false },
                      { label: 'LOCATION', value: 'Malang, East Java, ID', secret: false },
                      { label: 'AFFILIATION', value: 'Universitas Brawijaya — D4 IT', secret: false },
                      { label: 'SPECIALTY', value: 'Frontend Dev + Cybersecurity', secret: false },
                      { label: 'CONTACT', value: 'muhajiramrullahub@gmail.com', secret: true },
                      { label: 'THREAT LEVEL', value: 'HIRED', secret: false },
                    ].map((field, i) => (
                      <div key={i} className="flex gap-2 items-start border-b border-green-900/30 pb-1.5">
                        <span className="text-green-700 text-[10px] w-24 shrink-0 tracking-wider">{field.label}</span>
                        <span className="text-green-300 text-[11px]">
                          {field.secret
                            ? <Redacted>{field.value}</Redacted>
                            : field.label === 'STATUS'
                              ? <span className="text-yellow-400 font-bold">{field.value}</span>
                              : field.label === 'THREAT LEVEL'
                                ? <span className="text-red-400 font-black">{field.value}</span>
                                : field.value
                          }
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* INTEL REPORT */}
              <div className="border border-green-800/40 rounded-lg overflow-hidden dossier-section" style={{ animationDelay: '0.2s' }}>
                <div className="bg-green-950/40 px-4 py-2 border-b border-green-800/30">
                  <span className="text-[10px] text-green-600 tracking-widest uppercase">INTEL REPORT — PSYCHOLOGICAL PROFILE</span>
                </div>
                <div className="p-4 text-[11px] text-green-400/80 leading-relaxed space-y-2">
                  <p>
                    Subject is a <span className="text-green-300 font-bold">D3 Information Technology</span> student at Universitas Brawijaya with a dangerous obsession
                    with <Redacted revealed>Kali Linux</Redacted> and offensive security. Exhibits high threat potential in frontend development
                    and cybersecurity domains.
                  </p>
                  <p>
                    Known to operate under aliases <span className="text-yellow-400">h31st</span> and <span className="text-yellow-400">pittkajull</span>.
                    Active in multiple technical organizations. Has been documented completing
                    penetration testing certifications, ethical hacking courses, and CTF challenges.
                  </p>
                  <p>
                    Primary weapons of choice: <Redacted revealed>React.js, Tailwind CSS, Figma, Metasploit</Redacted>.
                    Subject is known to build <span className="text-green-300">OS-themed portfolio websites</span> that confuse and delight unsuspecting recruiters.
                  </p>
                </div>
              </div>

              {/* KNOWN CAPABILITIES */}
              <div className="border border-green-800/40 rounded-lg overflow-hidden dossier-section" style={{ animationDelay: '0.3s' }}>
                <div className="bg-green-950/40 px-4 py-2 border-b border-green-800/30">
                  <span className="text-[10px] text-green-600 tracking-widest uppercase">KNOWN CAPABILITIES — THREAT ASSESSMENT</span>
                </div>
                <div className="p-4 grid grid-cols-2 gap-2">
                  {[
                    { tag: 'FRONTEND', level: 'HIGH', color: 'text-yellow-400 border-yellow-700/50 bg-yellow-900/10' },
                    { tag: 'CYBERSEC', level: 'MEDIUM', color: 'text-orange-400 border-orange-700/50 bg-orange-900/10' },
                    { tag: 'UI/UX DESIGN', level: 'HIGH', color: 'text-yellow-400 border-yellow-700/50 bg-yellow-900/10' },
                    { tag: 'LINUX OPS', level: 'MEDIUM', color: 'text-orange-400 border-orange-700/50 bg-orange-900/10' },
                    { tag: 'MULTIMEDIA', level: 'HIGH', color: 'text-yellow-400 border-yellow-700/50 bg-yellow-900/10' },
                    { tag: 'LEADERSHIP', level: 'HIGH', color: 'text-yellow-400 border-yellow-700/50 bg-yellow-900/10' },
                    { tag: 'PENTEST', level: 'DEVELOPING', color: 'text-green-400 border-green-700/50 bg-green-900/10' },
                    { tag: 'COFFEE OPS', level: 'CRITICAL', color: 'text-red-400 border-red-700/50 bg-red-900/10' },
                  ].map((cap, i) => (
                    <div key={i} className={`border rounded px-2 py-1.5 flex justify-between items-center ${cap.color}`}>
                      <span className="text-[9px] tracking-wider font-bold">{cap.tag}</span>
                      <span className="text-[8px] opacity-80">{cap.level}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* FIELD NOTES */}
              <div className="border border-green-800/40 rounded-lg overflow-hidden dossier-section" style={{ animationDelay: '0.4s' }}>
                <div className="bg-green-950/40 px-4 py-2 border-b border-green-800/30">
                  <span className="text-[10px] text-green-600 tracking-widest uppercase">FIELD NOTES</span>
                </div>
                <div className="p-4 space-y-1.5 text-[10px] text-green-600 font-mono">
                  {[
                    '[2022] — First exposure to web development. Threat level rising.',
                    '[2023] — Enrolled at Universitas Brawijaya. Joined multiple orgs.',
                    '[2024] — Completed IGnite Cybersecurity Bootcamp. Solved first CTF.',
                    '[2024] — Staff of the Month, HMPTSI. Confirmed leadership capabilities.',
                    '[2025] — Multimedia Designer at PROVOKS UB. Visual threat escalating.',
                    '[2025] — Built OS-themed portfolio. Recruiters now confused in a good way.',
                    `[${new Date().getFullYear()}] — CURRENTLY AVAILABLE. Proceed with caution. Or hire immediately.`,
                  ].map((note, i) => (
                    <div key={i} className="flex gap-2">
                      <span className="text-green-800 shrink-0">▸</span>
                      <span>{note}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* REVEAL ALL HINT */}
              <div className="text-center text-[9px] text-green-800 mt-2">
                <span>// Click on </span>
                <span className="bg-[#1a1a1a] text-[#1a1a1a] border border-[#333] px-1 rounded">████████</span>
                <span> blocks to reveal redacted intel</span>
              </div>

            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="bg-[#0d1a0d] border-t border-green-900/40 px-4 py-1 flex justify-between items-center text-[9px] text-green-900">
          <span>CLEARANCE: VISITOR</span>
          <span className="text-green-700">whoami.txt — DECLASSIFIED {new Date().getFullYear()}</span>
          <span>SYS: ONLINE ●</span>
        </div>
      </div>
    </Draggable>
  );
}
