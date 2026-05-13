import React, { useRef, useState, useEffect } from 'react';
import Draggable from 'react-draggable';

const skills = [
  {
    category: "Frontend Development",
    color: "bg-orange-500",
    textColor: "text-orange-400",
    borderColor: "border-orange-500/30",
    items: [
      { name: "React.js",     level: 50, desc: "Component-based UI, hooks, state management" },
      { name: "HTML & CSS",   level: 88, desc: "Semantic HTML, Flexbox, Grid, animations" },
      { name: "Tailwind CSS", level: 40, desc: "Utility-first styling, responsive design" },
      { name: "JavaScript",   level: 50, desc: "ES6+, DOM manipulation, async/await" },
    ]
  },
  {
    category: "Design & Creative",
    color: "bg-pink-500",
    textColor: "text-pink-400",
    borderColor: "border-pink-500/30",
    items: [
      { name: "Figma / UI/UX",   level: 80, desc: "Wireframing, prototyping, design systems" },
      { name: "Graphic Design",  level: 80, desc: "Poster, branding, visual communication" },
      { name: "Multimedia",      level: 80, desc: "Photo/video documentation, content creation" },
    ]
  },
  {
    category: "Cybersecurity",
    color: "bg-green-500",
    textColor: "text-green-400",
    borderColor: "border-green-500/30",
    items: [
      { name: "Penetration Testing", level: 10, desc: "TryHackMe Jr Pentester, CTF, recon" },
      { name: "Web Security",        level: 15, desc: "JWT attacks, XSS, SQLi, OWASP Top 10" },
      { name: "Kali Linux",          level: 15, desc: "Tools, bash scripting, red team basics" },
      { name: "Network Fundamentals",level: 15, desc: "Cisco NetAcad, TCP/IP, threat detection" },
    ]
  },
  {
    category: "Soft Skills",
    color: "bg-blue-500",
    textColor: "text-blue-400",
    borderColor: "border-blue-500/30",
    items: [
      { name: "Leadership",         level: 50, desc: "Led 27 committees, coordinated 250+ participants" },
      { name: "Event Management",   level: 60, desc: "Field coord, project lead across 10+ events" },
      { name: "Team Communication", level: 90, desc: "Cross-division collaboration, documentation" },
    ]
  },
];

// ── UPDATE SERTIFIKAT: tambah EthicalHacking & KaliLinux ──
const certificates = [
  {
    id: "CRT_01",
    name: "Introduction to Cybersecurity",
    issuer: "Cisco Networking Academy",
    year: "Apr 2026",
    verified: true,
    img: "https://images.credly.com/size/340x340/images/af8c6b4e-fc31-47c4-8dcb-eb7a2065dc5b/I2CS__1_.png",
    link: "https://www.credly.com/badges/85a05efd-3374-46ee-b353-42259f21ae58/public_url",
  },
  {
    id: "CRT_02",
    name: "Introduction to Cybersecurity",
    issuer: "Cisco Networking Academy",
    year: "2025",
    verified: true,
    img: "/img/Sertifikat-Cisco-ITCS.png",
    link: "https://www.credly.com/badges/85a05efd-3374-46ee-b353-42259f21ae58/public_url",
  },
  {
    id: "CRT_03",
    name: "Web Security Fundamentals",
    issuer: "IGnite Academy",
    year: "2024",
    verified: true,
    img: "/img/Sertifikat-EM.png",
    link: null,
  },
  {
    id: "CRT_04",
    name: "Internship Staff Certificate",
    issuer: "Executive UB HR Management",
    year: "Jan 2026",
    verified: true,
    img: "/img/Sertifikat-EM.png",
    link: null,
  },
  {
    id: "CRT_05",
    name: "Introduction to Java",
    issuer: "Sololearn",
    year: "Nov 2024",
    verified: true,
    img: "/img/Sertifikat-JAVA.jpeg",
    link: null,
  },
  {
    id: "CRT_06",
    name: "RISMA Leadership Training",
    issuer: "MAN 1 Kota Serang",
    year: "2022",
    verified: true,
    img: "/img/Sertifikat-ROHIS.png",
    link: null,
  },
  {
    id: "CRT_07",
    name: "Tasmi Qur'an 5 Juz",
    issuer: "Irhamna Bil Qur'an",
    year: "Feb 2021",
    verified: true,
    img: "/img/Sertifikat-Tasmi.png",
    link: null,
  },
  // ── BARU ──
  {
    id: "CRT_08",
    name: "Ethical Hacking",
    issuer: "Sertifikasi Ethical Hacking",
    year: "2025",
    verified: true,
    img: "/img/Sertifikat-EthicalHacking.png",
    link: "https://www.simplilearn.com/skillup-certificate-landing?token=eyJjb3Vyc2VfaWQiOiIzMjY4IiwiY2VydGlmaWNhdGVfdXJsIjoiaHR0cHM6XC9cL2NlcnRpZmljYXRlcy5zaW1wbGljZG4ubmV0XC9zaGFyZVwvMTAxOTgxNDBfMTA0NzcyOTVfMTc3ODEwNDM1NTQ1Mi5wbmciLCJ1c2VybmFtZSI6Ik11aGFqaXIgYW1ydWxsYWgifQ%3D%3D&utm_source=shared-certificate&utm_medium=lms&utm_campaign=shared-certificate-promotion&referrer=https%3A%2F%2Flms.simplilearn.com%2Fcourses%2F6061%2FEthical-hacking-101-%3A-Beginners-guide-to-Ethical-hacking%2Fcertificate%2Fdownload-skillup&%24web_only=true&_branch_match_id=1576871257777616953&_branch_referrer=H4sIAAAAAAAAA8soKSkottLXL87MLcjJ1EssKNDLyczL1k%2FVDwoyjCrwT%2FMOM0qyrytKTUstKsrMS49PKsovL04tsvUBqkpN8cwDAGFHdgFBAAAA",
  },
  {
    id: "CRT_09",
    name: "Kali Linux",
    issuer: "Sertifikasi Kali Linux",
    year: "2025",
    verified: true,
    img: "/img/Sertifikat-KaliLinux.png",
    link: "https://www.simplilearn.com/skillup-certificate-landing?token=eyJjb3Vyc2VfaWQiOiI0MjM3IiwiY2VydGlmaWNhdGVfdXJsIjoiaHR0cHM6XC9cL2NlcnRpZmljYXRlcy5zaW1wbGljZG4ubmV0XC9zaGFyZVwvMTAxOTgyMTJfMTA0NzcyOTVfMTc3ODExMDkwNDk3Ny5wbmciLCJ1c2VybmFtZSI6Ik11aGFqaXIgYW1ydWxsYWgifQ%3D%3D&utm_source=shared-certificate&utm_medium=lms&utm_campaign=shared-certificate-promotion&referrer=https%3A%2F%2Flms.simplilearn.com%2Fcourses%2F7220%2FIntroduction-to-Kali-Linux-Basics%2Fcertificate%2Fdownload-skillup&%24web_only=true&_branch_match_id=1576871257777616953&_branch_referrer=H4sIAAAAAAAAA8soKSkottLXL87MLcjJ1EssKNDLyczL1k%2FVDwxNKk4sNg4KM0qyrytKTUstKsrMS49PKsovL04tsvUBqkpN8cwDAAMpNTpBAAAA",
  },
];

function SkillBar({ name, level, desc, color }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(level), 200);
    return () => clearTimeout(t);
  }, [level]);

  return (
    <div className="group">
      <div className="flex justify-between items-center mb-1">
        <span className="text-[11px] text-gray-200 font-mono">{name}</span>
        <span className="text-[10px] text-gray-500 font-mono">{level}%</span>
      </div>
      <div className="w-full bg-gray-800 h-2 rounded-sm overflow-hidden">
        <div className={`h-full rounded-sm transition-all duration-1000 ease-out ${color}`} style={{ width: `${width}%` }} />
      </div>
      <p className="text-[9px] text-gray-600 mt-0.5 hidden group-hover:block">{desc}</p>
    </div>
  );
}

export default function SystemMonitor({ isMaximized, toggleMax, minimize, close, zIndex, onFocus }) {
  const nodeRef = useRef(null);
  const [activeTab, setActiveTab] = useState('skills');
  const [selectedCert, setSelectedCert] = useState(null);

  return (
    <>
      <Draggable
        nodeRef={nodeRef} handle=".sm-header"
        disabled={isMaximized || window.innerWidth < 768}
        position={isMaximized || window.innerWidth < 768 ? { x: 0, y: 0 } : null}
      >
        <div
          ref={nodeRef} onMouseDown={onFocus} onTouchStart={onFocus}
          style={{ zIndex, transform: (isMaximized || window.innerWidth < 768) ? 'none' : undefined }}
          className={`bg-[#1a1b1e] text-white shadow-2xl flex flex-col overflow-hidden border border-white/10 transition-all duration-300
            ${isMaximized
              ? 'fixed !top-8 !left-0 w-screen h-[calc(100vh-2rem)] rounded-none'
              : 'absolute top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-5xl h-[580px] rounded-lg'}`}
        >
          {/* HEADER */}
          <div className="sm-header bg-[#141517] px-4 py-2 flex justify-between items-center border-b border-white/10 select-none cursor-move">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-gray-400">📊</span>
              <span className="text-[11px] font-bold text-gray-300 uppercase tracking-widest font-mono">skills.stats — muhajir_db</span>
            </div>
            <div className="flex items-center gap-4 md:gap-2">
              <button onClick={(e) => { e.stopPropagation(); minimize(); }} className="w-10 h-10 md:w-6 md:h-6 hover:bg-white/10 rounded flex items-center justify-center text-gray-400 hover:text-white transition">—</button>
              <button onClick={(e) => { e.stopPropagation(); toggleMax(); }} className="hidden md:flex w-6 h-6 hover:bg-white/10 rounded items-center justify-center text-gray-400 hover:text-white transition text-xs">{isMaximized ? '❐' : '❑'}</button>
              <button onClick={(e) => { e.stopPropagation(); close(); }} className="w-10 h-10 md:w-6 md:h-6 hover:bg-red-600 rounded flex items-center justify-center text-gray-400 hover:text-white transition">✕</button>
            </div>
          </div>

          {/* TABS */}
          <div className="flex border-b border-white/10 bg-[#141517]">
            <button onClick={() => setActiveTab('skills')}
              className={`px-6 py-2 text-[11px] font-mono font-bold uppercase tracking-widest transition-all border-b-2
                ${activeTab === 'skills' ? 'border-orange-500 text-orange-400' : 'border-transparent text-gray-600 hover:text-gray-400'}`}>
              ⚡ Tech Stack
            </button>
            <button onClick={() => setActiveTab('certs')}
              className={`px-6 py-2 text-[11px] font-mono font-bold uppercase tracking-widest transition-all border-b-2
                ${activeTab === 'certs' ? 'border-orange-500 text-orange-400' : 'border-transparent text-gray-600 hover:text-gray-400'}`}>
              🏆 Certificates ({certificates.length})
            </button>
          </div>

          {/* CONTENT */}
          <div className="flex-1 overflow-hidden">

            {/* SKILLS TAB */}
            {activeTab === 'skills' && (
              <div className="h-full overflow-y-auto p-4 md:p-6 custom-scroll">
                <div className="font-mono text-[10px] text-gray-600 mb-4 space-y-0.5">
                  <p><span className="text-green-400">●</span> PID: muhajir_amrullah | STATUS: actively_learning | UPTIME: 21yrs</p>
                  <p><span className="text-blue-400">●</span> LOAD: frontend[HIGH] cybersec[MEDIUM] design[HIGH]</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {skills.map((cat) => (
                    <div key={cat.category} className={`bg-[#0d0e10] rounded-lg p-4 border ${cat.borderColor}`}>
                      <p className={`text-[10px] font-bold uppercase tracking-widest mb-3 font-mono ${cat.textColor}`}>▶ {cat.category}</p>
                      <div className="space-y-3">
                        {cat.items.map((skill) => (
                          <SkillBar key={skill.name} name={skill.name} level={skill.level} desc={skill.desc} color={cat.color} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-[9px] text-gray-700 font-mono text-center mt-4">* hover skill bar for details · percentages based on hands-on experience</p>
              </div>
            )}

            {/* CERTS TAB */}
            {activeTab === 'certs' && (
              <div className="h-full overflow-y-auto p-4 md:p-6 custom-scroll">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {certificates.map((cert) => (
                    <div key={cert.id} onClick={() => setSelectedCert(cert)}
                      className="group cursor-pointer bg-[#0d0e10] border border-white/5 rounded-lg overflow-hidden hover:border-orange-500/40 transition-all duration-200 hover:scale-[1.02]">
                      <div className="aspect-[4/3] overflow-hidden bg-gray-900 relative">
                        <img src={cert.img} alt={cert.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                        />
                        <div className="hidden w-full h-full items-center justify-center text-3xl bg-gray-900">🏆</div>
                        {cert.verified && (
                          <div className="absolute top-1 right-1 bg-green-500 text-black text-[8px] font-bold px-1.5 py-0.5 rounded-full">✓ VERIFIED</div>
                        )}
                      </div>
                      <div className="p-2">
                        <p className="text-[10px] font-bold text-white leading-tight">{cert.name}</p>
                        <p className="text-[9px] text-gray-500 mt-0.5">{cert.issuer}</p>
                        <p className="text-[9px] text-orange-400 font-mono mt-0.5">{cert.year}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* BOTTOM BAR */}
          <div className="bg-[#141517] border-t border-white/10 px-4 py-1 flex justify-between items-center text-[9px] font-mono text-gray-600">
            <span>skills: {skills.reduce((a, c) => a + c.items.length, 0)} loaded</span>
            <span className="text-orange-400">muhajir@kali: ~/skills.stats</span>
            <span>certs: {certificates.length} verified</span>
          </div>
        </div>
      </Draggable>

      {/* LIGHTBOX */}
      {selectedCert && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          style={{ zIndex: zIndex + 100 }}
          onClick={() => setSelectedCert(null)}>
          <div className="bg-[#1a1b1e] border border-white/10 rounded-xl overflow-hidden max-w-2xl w-full shadow-2xl"
            onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center px-4 py-2 border-b border-white/10 bg-[#141517]">
              <span className="text-[11px] font-mono text-gray-300 font-bold">{selectedCert.name}</span>
              <button onClick={() => setSelectedCert(null)} className="text-gray-500 hover:text-white transition text-sm">✕</button>
            </div>
            <div className="bg-gray-900 flex items-center justify-center p-4">
              <img src={selectedCert.img} alt={selectedCert.name} className="max-h-[60vh] w-auto object-contain rounded" />
            </div>
            <div className="px-4 py-3 flex justify-between items-center">
              <div>
                <p className="text-[11px] text-gray-300 font-bold">{selectedCert.issuer}</p>
                <p className="text-[10px] text-orange-400 font-mono">{selectedCert.year}</p>
              </div>
              {selectedCert.link && (
                <a href={selectedCert.link} target="_blank" rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-black text-[10px] font-bold rounded transition">
                  🔗 Verify on Credly
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}