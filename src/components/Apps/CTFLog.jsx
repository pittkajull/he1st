import React, { useRef, useState, useEffect } from 'react';
import Draggable from 'react-draggable';

// ============================================================
// CTF DATA
// ============================================================
const CTF_ENTRIES = [
  {
    id: 'jwt-forgery',
    title: 'JWT Token Forgery',
    event: 'IGnite Cybersecurity Bootcamp',
    date: '2024',
    category: 'Web Exploitation',
    difficulty: 'MEDIUM',
    diffColor: '#f59e0b',
    status: 'SOLVED',
    points: 100,
    tools: ['jwt.io', 'Burp Suite', 'Browser DevTools', 'Python'],
    tags: ['jwt', 'authentication', 'web', 'token-forgery'],
    summary: 'A web application used JWT tokens for authentication. The server failed to validate the algorithm properly, allowing an attacker to forge a token with elevated privileges.',
    steps: [
      {
        phase: 'RECON',
        color: '#3b82f6',
        title: 'Intercept & Analyze Token',
        commands: ['# Login dengan akun biasa', '# Intercept request di Burp Suite', 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'],
        notes: 'Login ke aplikasi dengan akun normal, intercept HTTP request menggunakan Burp Suite. Ditemukan JWT token di header Authorization.',
      },
      {
        phase: 'ANALYZE',
        color: '#8b5cf6',
        title: 'Decode JWT Payload',
        commands: [
          '# Decode di jwt.io atau manual base64',
          '$ echo "eyJ1c2VyIjoiZ3Vlc3QiLCJyb2xlIjoidXNlciJ9" | base64 -d',
          '{"user":"guest","role":"user","alg":"HS256"}',
        ],
        notes: 'Decode payload JWT. Terlihat field "role": "user" — target: ubah jadi "admin". Algoritma menggunakan HS256.',
      },
      {
        phase: 'EXPLOIT',
        color: '#ef4444',
        title: 'Algorithm Confusion Attack',
        commands: [
          '# Ubah header algorithm ke "none"',
          'header  = {"alg": "none", "typ": "JWT"}',
          'payload = {"user": "guest", "role": "admin"}',
          '# Forge token tanpa signature',
          'token = base64(header) + "." + base64(payload) + "."',
        ],
        notes: 'Server tidak memvalidasi algoritma. Dengan mengganti alg ke "none", signature bisa dikosongkan. Token baru dibuat dengan role: admin.',
      },
      {
        phase: 'FLAG',
        color: '#22c55e',
        title: 'Access Admin Panel & Capture Flag',
        commands: [
          '# Kirim request dengan forged token',
          'GET /admin/dashboard HTTP/1.1',
          'Authorization: Bearer <forged_token>',
          '',
          '# Response:',
          'HTTP/1.1 200 OK',
          '{"flag": "FLAG{jwt_n0n3_alg_byp4ss_ftw}"}',
        ],
        notes: 'Forged token diterima server. Admin panel berhasil diakses. Flag ditemukan di response body.',
      },
    ],
    flag: 'FLAG{jwt_n0n3_alg_byp4ss_ftw}',
    lesson: 'Always validate the algorithm on the server side. Never trust the alg field from the client. Use a whitelist of allowed algorithms.',
  },
  {
    id: 'placeholder-1',
    title: '???',
    event: '— UPCOMING —',
    date: '2025',
    category: 'Unknown',
    difficulty: 'TBD',
    diffColor: '#555',
    status: 'LOCKED',
    points: 0,
    tools: [],
    tags: [],
    summary: 'Challenge writeup coming soon...',
    steps: [],
    flag: null,
    lesson: null,
  },
  {
    id: 'placeholder-2',
    title: '???',
    event: '— UPCOMING —',
    date: '2025',
    category: 'Unknown',
    difficulty: 'TBD',
    diffColor: '#555',
    status: 'LOCKED',
    points: 0,
    tools: [],
    tags: [],
    summary: 'Challenge writeup coming soon...',
    steps: [],
    flag: null,
    lesson: null,
  },
];

// ============================================================
// TYPEWRITER
// ============================================================
function TypeWriter({ lines, speed = 18 }) {
  const [displayed, setDisplayed] = useState([]);
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);

  useEffect(() => {
    setDisplayed([]);
    setLineIdx(0);
    setCharIdx(0);
  }, [lines]);

  useEffect(() => {
    if (lineIdx >= lines.length) return;
    if (charIdx === 0) setDisplayed(prev => [...prev, '']);
    const t = setTimeout(() => {
      const current = lines[lineIdx];
      if (charIdx < current.length) {
        setDisplayed(prev => {
          const next = [...prev];
          next[lineIdx] = current.slice(0, charIdx + 1);
          return next;
        });
        setCharIdx(c => c + 1);
      } else {
        setLineIdx(l => l + 1);
        setCharIdx(0);
      }
  }, lines[lineIdx] === '' ? 80 : speed);
    return () => clearTimeout(t);
  }, [lineIdx, charIdx, lines, speed]);

  return (
    <div>
      {displayed.map((line, i) => (
        <div key={i} style={{ fontFamily: 'monospace', fontSize: 11, lineHeight: '1.7', color: line.startsWith('#') ? '#4a7a4a' : line.startsWith('FLAG') ? '#22c55e' : line.startsWith('HTTP') ? '#f59e0b' : '#a3e635', whiteSpace: 'pre' }}>
          {line || <span>&nbsp;</span>}
          {i === displayed.length - 1 && lineIdx < lines.length && (
            <span style={{ animation: 'ctf-blink 1s infinite', color: '#22c55e' }}>▊</span>
          )}
        </div>
      ))}
    </div>
  );
}

// ============================================================
// MAIN
// ============================================================
export default function CTFLog({ isMaximized, toggleMax, minimize, close, zIndex, onFocus }) {
  const nodeRef = useRef(null);
  const [selected, setSelected] = useState('jwt-forgery');
  const [activeStep, setActiveStep] = useState(0);
  const [stepKey, setStepKey] = useState(0);
  const [showFlag, setShowFlag] = useState(false);

  const entry = CTF_ENTRIES.find(e => e.id === selected);

  const handleStepClick = (idx) => {
    setActiveStep(idx);
    setStepKey(k => k + 1);
    setShowFlag(false);
  };

  useEffect(() => {
    setActiveStep(0);
    setStepKey(k => k + 1);
    setShowFlag(false);
  }, [selected]);

  return (
    <Draggable
      nodeRef={nodeRef}
      handle=".ctf-header"
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
          background: '#080808',
          border: '1px solid #22c55e20',
          fontFamily: 'monospace',
        }}
        className={`text-white shadow-2xl flex flex-col overflow-hidden transition-all duration-300
          ${isMaximized
            ? 'fixed !top-8 !left-0 w-screen h-[calc(100vh-2rem)] rounded-none'
            : 'absolute top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-4xl h-[580px] rounded-xl'}`}
      >
        <style>{`
          @keyframes ctf-blink { 0%,100%{opacity:1} 50%{opacity:0} }
          @keyframes ctf-fadein { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
          @keyframes ctf-glow { 0%,100%{text-shadow:0 0 8px #22c55e} 50%{text-shadow:0 0 20px #22c55e,0 0 40px #22c55e60} }
        `}</style>

        {/* HEADER */}
        <div className="ctf-header" style={{ background: '#0a0a0a', borderBottom: '1px solid #22c55e20', padding: '8px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'move', userSelect: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: '#22c55e', fontSize: 12 }}>🚩</span>
            <span style={{ fontSize: 10, color: '#4ade80', letterSpacing: '0.15em', fontWeight: 'bold' }}>CTF.LOG — Capture The Flag Writeups</span>
            <span style={{ fontSize: 9, color: '#1a4a1a', background: '#22c55e15', padding: '1px 8px', borderRadius: 99, border: '1px solid #22c55e20' }}>
              {CTF_ENTRIES.filter(e => e.status === 'SOLVED').length} SOLVED
            </span>
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            <button onPointerDown={e => e.stopPropagation()} onClick={e => { e.stopPropagation(); minimize(); }}
              style={{ width: 28, height: 28, background: 'none', border: 'none', color: '#4a7a4a', cursor: 'pointer', borderRadius: 4 }}>—</button>
            <button onPointerDown={e => e.stopPropagation()} onClick={e => { e.stopPropagation(); toggleMax(); }}
              style={{ width: 28, height: 28, background: 'none', border: 'none', color: '#4a7a4a', cursor: 'pointer', borderRadius: 4 }}>❑</button>
            <button onPointerDown={e => e.stopPropagation()} onClick={e => { e.stopPropagation(); close(); }}
              style={{ width: 28, height: 28, background: 'none', border: 'none', color: '#4a7a4a', cursor: 'pointer', borderRadius: 4 }}
              onMouseEnter={e => e.currentTarget.style.background = '#7f1d1d'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}>✕</button>
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

          {/* SIDEBAR — challenge list */}
          <div style={{ width: 180, background: '#060606', borderRight: '1px solid #22c55e15', overflowY: 'auto', flexShrink: 0 }}>
            <div style={{ padding: '8px 12px', fontSize: 9, color: '#1a4a1a', letterSpacing: '0.2em', borderBottom: '1px solid #22c55e10' }}>
              CHALLENGES
            </div>
            {CTF_ENTRIES.map(e => (
              <button
                key={e.id}
                onPointerDown={ev => ev.stopPropagation()}
                onClick={ev => { ev.stopPropagation(); if (e.status !== 'LOCKED') setSelected(e.id); }}
                style={{
                  width: '100%', textAlign: 'left', padding: '10px 12px',
                  background: selected === e.id ? '#22c55e10' : 'none',
                  border: 'none', borderLeft: `2px solid ${selected === e.id ? '#22c55e' : 'transparent'}`,
                  cursor: e.status === 'LOCKED' ? 'not-allowed' : 'pointer',
                  opacity: e.status === 'LOCKED' ? 0.4 : 1,
                  borderBottom: '1px solid #22c55e08',
                }}
              >
                <div style={{ fontSize: 11, color: selected === e.id ? '#4ade80' : '#555', fontWeight: 'bold', marginBottom: 3 }}>
                  {e.status === 'LOCKED' ? '🔒 LOCKED' : e.title}
                </div>
                <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                  <span style={{ fontSize: 8, color: e.diffColor, background: e.diffColor + '15', padding: '1px 5px', borderRadius: 99, border: `1px solid ${e.diffColor}30` }}>
                    {e.difficulty}
                  </span>
                  {e.status === 'SOLVED' && (
                    <span style={{ fontSize: 8, color: '#22c55e' }}>✓</span>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* MAIN AREA */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {entry && entry.status === 'SOLVED' ? (
              <>
                {/* Challenge info bar */}
                <div style={{ padding: '10px 16px', background: '#0a0a0a', borderBottom: '1px solid #22c55e15', display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 'bold', color: '#4ade80' }}>{entry.title}</div>
                    <div style={{ fontSize: 9, color: '#555' }}>{entry.event} · {entry.date}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 9, color: '#3b82f6', background: '#3b82f615', padding: '2px 8px', borderRadius: 99, border: '1px solid #3b82f630' }}>{entry.category}</span>
                    <span style={{ fontSize: 9, color: entry.diffColor, background: entry.diffColor + '15', padding: '2px 8px', borderRadius: 99, border: `1px solid ${entry.diffColor}30` }}>{entry.difficulty}</span>
                    <span style={{ fontSize: 9, color: '#22c55e', background: '#22c55e15', padding: '2px 8px', borderRadius: 99, border: '1px solid #22c55e30' }}>✓ SOLVED</span>
                  </div>
                  <div style={{ marginLeft: 'auto', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {entry.tools.map(t => (
                      <span key={t} style={{ fontSize: 8, color: '#666', background: '#ffffff08', padding: '2px 6px', borderRadius: 4, border: '1px solid #ffffff10' }}>{t}</span>
                    ))}
                  </div>
                </div>

                <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                  {/* STEP NAVIGATOR */}
                  <div style={{ width: 130, background: '#060606', borderRight: '1px solid #22c55e10', padding: '8px 0', flexShrink: 0 }}>
                    <div style={{ padding: '0 10px 6px', fontSize: 9, color: '#1a4a1a', letterSpacing: '0.2em' }}>PHASES</div>
                    {entry.steps.map((step, i) => (
                      <button
                        key={i}
                        onPointerDown={ev => ev.stopPropagation()}
                        onClick={ev => { ev.stopPropagation(); handleStepClick(i); }}
                        style={{
                          width: '100%', textAlign: 'left', padding: '8px 10px',
                          background: activeStep === i ? `${step.color}15` : 'none',
                          border: 'none', borderLeft: `2px solid ${activeStep === i ? step.color : 'transparent'}`,
                          cursor: 'pointer', borderBottom: '1px solid #ffffff05',
                        }}
                      >
                        <div style={{ fontSize: 9, color: activeStep === i ? step.color : '#444', fontWeight: 'bold', letterSpacing: '0.1em' }}>{step.phase}</div>
                        <div style={{ fontSize: 8, color: '#333', marginTop: 1 }}>{step.title}</div>
                      </button>
                    ))}
                  </div>

                  {/* TERMINAL OUTPUT */}
                  <div style={{ flex: 1, overflowY: 'auto', padding: 16, background: '#050505' }}>
                    {entry.steps[activeStep] && (
                      <div key={`${selected}-${activeStep}-${stepKey}`} style={{ animation: 'ctf-fadein 0.3s ease' }}>
                        {/* Phase header */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                          <span style={{ fontSize: 9, color: entry.steps[activeStep].color, background: entry.steps[activeStep].color + '20', padding: '2px 10px', borderRadius: 99, border: `1px solid ${entry.steps[activeStep].color}40`, letterSpacing: '0.15em', fontWeight: 'bold' }}>
                            {entry.steps[activeStep].phase}
                          </span>
                          <span style={{ fontSize: 11, color: '#aaa', fontWeight: 'bold' }}>{entry.steps[activeStep].title}</span>
                        </div>

                        {/* Notes */}
                        <div style={{ fontSize: 11, color: '#666', marginBottom: 12, lineHeight: 1.6, padding: '8px 12px', background: '#ffffff04', borderRadius: 6, borderLeft: `2px solid ${entry.steps[activeStep].color}40` }}>
                          {entry.steps[activeStep].notes}
                        </div>

                        {/* Terminal */}
                        <div style={{ background: '#020202', border: '1px solid #22c55e15', borderRadius: 8, overflow: 'hidden' }}>
                          <div style={{ background: '#0a0a0a', padding: '6px 12px', borderBottom: '1px solid #22c55e10', display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontSize: 8, color: '#1a4a1a' }}>root@kali:~#</span>
                            <span style={{ fontSize: 8, color: '#1a3a1a' }}>terminal</span>
                          </div>
                          <div style={{ padding: 14, minHeight: 120 }}>
                            <TypeWriter key={`tw-${selected}-${activeStep}-${stepKey}`} lines={entry.steps[activeStep].commands} />
                          </div>
                        </div>

                        {/* Flag reveal — show on last step */}
                        {activeStep === entry.steps.length - 1 && (
                          <div style={{ marginTop: 16 }}>
                            {!showFlag ? (
                              <button
                                onPointerDown={e => e.stopPropagation()}
                                onClick={e => { e.stopPropagation(); setShowFlag(true); }}
                                style={{ width: '100%', padding: '10px', background: '#22c55e15', border: '1px solid #22c55e40', borderRadius: 8, color: '#22c55e', fontSize: 11, cursor: 'pointer', fontFamily: 'monospace', fontWeight: 'bold', letterSpacing: '0.1em' }}
                              >
                                🚩 REVEAL FLAG
                              </button>
                            ) : (
                              <div style={{ padding: '12px 16px', background: '#22c55e10', border: '1px solid #22c55e40', borderRadius: 8, animation: 'ctf-fadein 0.3s ease' }}>
                                <div style={{ fontSize: 9, color: '#1a4a1a', marginBottom: 4, letterSpacing: '0.2em' }}>FLAG CAPTURED:</div>
                                <div style={{ fontSize: 14, color: '#22c55e', fontWeight: 'bold', animation: 'ctf-glow 2s ease infinite', letterSpacing: '0.05em' }}>
                                  {entry.flag}
                                </div>
                                {entry.lesson && (
                                  <div style={{ marginTop: 10, padding: '8px 10px', background: '#ffffff04', borderRadius: 6, fontSize: 10, color: '#666', borderLeft: '2px solid #f59e0b40' }}>
                                    <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>LESSON: </span>{entry.lesson}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Next step button */}
                        {activeStep < entry.steps.length - 1 && (
                          <button
                            onPointerDown={e => e.stopPropagation()}
                            onClick={e => { e.stopPropagation(); handleStepClick(activeStep + 1); }}
                            style={{ marginTop: 12, padding: '7px 16px', background: 'none', border: `1px solid ${entry.steps[activeStep + 1].color}40`, borderRadius: 6, color: entry.steps[activeStep + 1].color, fontSize: 10, cursor: 'pointer', fontFamily: 'monospace' }}
                          >
                            NEXT: {entry.steps[activeStep + 1].phase} →
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1a3a1a', fontSize: 12 }}>
                SELECT A CHALLENGE
              </div>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div style={{ background: '#0a0a0a', borderTop: '1px solid #22c55e10', padding: '4px 16px', display: 'flex', justifyContent: 'space-between', fontSize: 9, color: '#1a4a1a', fontFamily: 'monospace' }}>
          <span>CTF.LOG</span>
          <span style={{ color: '#22c55e40' }}>capture the flag writeups</span>
          <span>{CTF_ENTRIES.filter(e => e.status === 'SOLVED').length}/{CTF_ENTRIES.length} SOLVED</span>
        </div>
      </div>
    </Draggable>
  );
}
