import React, { useRef, useState, useEffect } from 'react';
import Draggable from 'react-draggable';

const CATEGORIES = [
  {
    id: 'frontend',
    label: 'Frontend Dev',
    color: '#f97316',
    icon: '⚡',
    skills: [
      { name: 'React.js', level: 50 },
      { name: 'HTML/CSS', level: 88 },
      { name: 'JavaScript', level: 50 },
      { name: 'Tailwind CSS', level: 40 },
      { name: 'Laravel', level: 40 },
      { name: 'PHP', level: 50 },
    ],
  },
  {
    id: 'cybersec',
    label: 'Cyber Security',
    color: '#22c55e',
    icon: '🛡',
    skills: [
      { name: 'Kali Linux', level: 15 },
      { name: 'Penetration Testing', level: 10 },
      { name: 'Web Security', level: 15 },
      { name: 'Nmap', level: 40 },
      { name: 'Burp Suite', level: 10 },
      { name: 'CTF', level: 10 },
    ],
  },
  {
    id: 'design',
    label: 'Design',
    color: '#a855f7',
    icon: '✦',
    skills: [
      { name: 'Figma', level: 80 },
      { name: 'Graphic Design', level: 80 },
      { name: 'Multimedia', level: 80 },
      { name: 'Canva', level: 30 },
    ],
  },
  {
    id: 'softskill',
    label: 'Soft Skills',
    color: '#3b82f6',
    icon: '◈',
    skills: [
      { name: 'Leadership', level: 50 },
      { name: 'Event Management', level: 60 },
      { name: 'Research', level: 75 },
      { name: 'Content Creation', level: 50 },
      { name: 'Team Coordination', level: 80 },
    ],
  },
];

function SkillBar({ name, level, color, delay = 0 }) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span style={{ fontSize: 11, color: '#ccc', fontFamily: 'monospace' }}>{name}</span>
        <span style={{ fontSize: 10, color, fontFamily: 'monospace', fontWeight: 'bold' }}>{level}%</span>
      </div>
      <div style={{ height: 5, borderRadius: 99, background: '#ffffff10' }}>
        <div style={{
          height: '100%',
          borderRadius: 99,
          width: animated ? `${level}%` : '0%',
          background: `linear-gradient(90deg, ${color}80, ${color})`,
          boxShadow: `0 0 6px ${color}60`,
          transition: 'width 0.7s ease-out',
        }} />
      </div>
    </div>
  );
}

export default function NetworkMap({ isMaximized, toggleMax, minimize, close, zIndex, onFocus }) {
  const nodeRef = useRef(null);
  const [selected, setSelected] = useState('frontend');
  const selectedCat = CATEGORIES.find(c => c.id === selected);

  // Fixed positions for the 4 quadrant nodes
  const positions = [
    { id: 'frontend',  top: '15%',  left: '18%'  },
    { id: 'cybersec',  top: '15%',  right: '18%' },
    { id: 'design',    bottom: '15%', left: '18%'  },
    { id: 'softskill', bottom: '15%', right: '18%' },
  ];

  return (
    <Draggable
      nodeRef={nodeRef}
      handle=".nm-header"
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
          border: '1px solid #1a2a1a',
          fontFamily: 'monospace',
        }}
        className={`text-white shadow-2xl flex flex-col overflow-hidden transition-all duration-300
          ${isMaximized
            ? 'fixed !top-8 !left-0 w-screen h-[calc(100vh-2rem)] rounded-none'
            : 'absolute top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-4xl h-[560px] rounded-xl'}`}
      >
        <style>{`
          @keyframes nm-ping {
            0%   { transform: translate(-50%,-50%) scale(1); opacity: 0.7; }
            100% { transform: translate(-50%,-50%) scale(2); opacity: 0; }
          }
          @keyframes nm-fadein {
            from { opacity: 0; transform: translateY(8px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes nm-dash {
            to { stroke-dashoffset: -24; }
          }
        `}</style>

        {/* HEADER */}
        <div
          className="nm-header px-4 py-2 flex justify-between items-center select-none cursor-move"
          style={{ background: '#0d1a0d', borderBottom: '1px solid #1a3a1a' }}
        >
          <div className="flex items-center gap-2">
            <span style={{ color: '#22c55e', fontSize: 11 }}>◈</span>
            <span style={{ fontSize: 10, color: '#4ade80', letterSpacing: '0.15em', fontWeight: 'bold' }}>
              NETWORK.MAP — Skill Topology
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => { e.stopPropagation(); minimize(); }}
              style={{ color: '#4a7a4a', background: 'transparent', border: 'none', cursor: 'pointer', width: 28, height: 28 }}
            >—</button>
            <button
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => { e.stopPropagation(); toggleMax(); }}
              style={{ color: '#4a7a4a', background: 'transparent', border: 'none', cursor: 'pointer', width: 28, height: 28, display: window.innerWidth < 768 ? 'none' : 'inline' }}
            >{isMaximized ? '❐' : '❑'}</button>
            <button
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => { e.stopPropagation(); close(); }}
              style={{ color: '#4a7a4a', background: 'transparent', border: 'none', cursor: 'pointer', width: 28, height: 28 }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#7f1d1d'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >✕</button>
          </div>
        </div>

        {/* BODY */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

          {/* MAP */}
          <div style={{ flex: 1, position: 'relative', background: 'radial-gradient(ellipse at center, #0a150a 0%, #050805 100%)' }}>

            {/* SVG lines only — no interaction */}
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
              <defs>
                <pattern id="nm-grid" width="32" height="32" patternUnits="userSpaceOnUse">
                  <path d="M32 0L0 0 0 32" fill="none" stroke="#0d1f0d" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#nm-grid)" />
              {/* Lines center to each corner — approximate percentages */}
              <line x1="50%" y1="50%" x2="22%" y2="22%"
                stroke={selected === 'frontend' ? '#f97316' : '#f9731620'}
                strokeWidth={selected === 'frontend' ? 1.5 : 0.8}
                strokeDasharray="6 4"
                style={selected === 'frontend' ? { animation: 'nm-dash 1s linear infinite' } : {}} />
              <line x1="50%" y1="50%" x2="78%" y2="22%"
                stroke={selected === 'cybersec' ? '#22c55e' : '#22c55e20'}
                strokeWidth={selected === 'cybersec' ? 1.5 : 0.8}
                strokeDasharray="6 4"
                style={selected === 'cybersec' ? { animation: 'nm-dash 1s linear infinite' } : {}} />
              <line x1="50%" y1="50%" x2="22%" y2="78%"
                stroke={selected === 'design' ? '#a855f7' : '#a855f720'}
                strokeWidth={selected === 'design' ? 1.5 : 0.8}
                strokeDasharray="6 4"
                style={selected === 'design' ? { animation: 'nm-dash 1s linear infinite' } : {}} />
              <line x1="50%" y1="50%" x2="78%" y2="78%"
                stroke={selected === 'softskill' ? '#3b82f6' : '#3b82f620'}
                strokeWidth={selected === 'softskill' ? 1.5 : 0.8}
                strokeDasharray="6 4"
                style={selected === 'softskill' ? { animation: 'nm-dash 1s linear infinite' } : {}} />
            </svg>

            {/* CENTER NODE */}
            <div style={{
              position: 'absolute',
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 70, height: 70,
              borderRadius: '50%',
              background: '#0a1a0a',
              border: '2px solid #22c55e60',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 24px #22c55e18',
              zIndex: 5,
            }}>
              <img
                src="/h31st.jpeg"
                alt="core"
                style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', filter: 'saturate(0.5)', border: '1px solid #22c55e40' }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <span style={{ fontSize: 8, color: '#22c55e80', marginTop: 2 }}>h31st</span>
            </div>

            {/* CATEGORY NODES — pure HTML buttons, zero SVG conflict */}
            {positions.map((pos) => {
              const cat = CATEGORIES.find(c => c.id === pos.id);
              const isActive = selected === pos.id;
              return (
                <button
                  key={pos.id}
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => { e.stopPropagation(); setSelected(pos.id); }}
                  style={{
                    position: 'absolute',
                    ...pos,
                    width: 76,
                    height: 76,
                    borderRadius: '50%',
                    background: isActive ? `${cat.color}18` : '#0a0a0a',
                    border: `2px solid ${isActive ? cat.color : cat.color + '40'}`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: isActive ? `0 0 24px ${cat.color}35` : 'none',
                    transform: isActive ? 'scale(1.12)' : 'scale(1)',
                    transition: 'all 0.2s ease',
                    zIndex: 10,
                    color: 'white',
                  }}
                >
                  <span style={{ fontSize: 20, lineHeight: 1 }}>{cat.icon}</span>
                  <span style={{ fontSize: 9, color: isActive ? cat.color : '#777', fontWeight: 'bold', marginTop: 3, textAlign: 'center', lineHeight: 1.2, padding: '0 4px', fontFamily: 'monospace' }}>
                    {cat.label}
                  </span>
                  {isActive && (
                    <span style={{
                      position: 'absolute',
                      top: '50%', left: '50%',
                      width: 76, height: 76,
                      borderRadius: '50%',
                      border: `1.5px solid ${cat.color}`,
                      animation: 'nm-ping 1.5s ease-out infinite',
                      pointerEvents: 'none',
                    }} />
                  )}
                </button>
              );
            })}

            <div style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', fontSize: 9, color: '#1a3a1a', letterSpacing: '0.15em', whiteSpace: 'nowrap' }}>
              CLICK A NODE TO INSPECT SKILLS
            </div>
          </div>

          {/* SKILL PANEL */}
          <div style={{ width: 200, background: '#060d06', borderLeft: '1px solid #1a2a1a', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {selectedCat && (
              <>
                <div style={{ padding: '12px 16px', borderBottom: `1px solid ${selectedCat.color}30`, background: `${selectedCat.color}08` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 18 }}>{selectedCat.icon}</span>
                    <span style={{ fontSize: 12, fontWeight: 'bold', color: selectedCat.color, fontFamily: 'monospace' }}>{selectedCat.label}</span>
                  </div>
                  <span style={{ fontSize: 9, color: '#333', letterSpacing: '0.2em', fontFamily: 'monospace' }}>{selectedCat.skills.length} SKILLS</span>
                </div>

                <div
                  key={selected}
                  style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12, animation: 'nm-fadein 0.3s ease' }}
                >
                  {selectedCat.skills.map((skill, i) => (
                    <SkillBar key={skill.name} name={skill.name} level={skill.level} color={selectedCat.color} delay={i * 80} />
                  ))}
                </div>

                <div style={{ padding: '8px 16px', borderTop: `1px solid ${selectedCat.color}20`, display: 'flex', justifyContent: 'space-between', fontSize: 9, color: '#333', fontFamily: 'monospace' }}>
                  <span>AVG</span>
                  <span style={{ color: selectedCat.color, fontWeight: 'bold' }}>
                    {Math.round(selectedCat.skills.reduce((a, s) => a + s.level, 0) / selectedCat.skills.length)}%
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div style={{ background: '#0d1a0d', borderTop: '1px solid #1a2a1a', padding: '4px 16px', display: 'flex', justifyContent: 'space-between', fontSize: 9, color: '#1a4a1a', fontFamily: 'monospace' }}>
          <span>ACTIVE: {selectedCat?.label}</span>
          <span style={{ color: '#22c55e50' }}>network.map</span>
          <span>● ONLINE</span>
        </div>
      </div>
    </Draggable>
  );
}