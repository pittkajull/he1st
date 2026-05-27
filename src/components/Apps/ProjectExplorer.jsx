import React, { useRef, useState } from 'react';
import Draggable from 'react-draggable';

// ============================================================
// DATA PROJECT
// Untuk nambah/edit project, update array ini aja.
// Field:
//   name        → nama file/project (underscore, no spasi)
//   category    → "Web" | "Design" | "Video" | "CySec" | "Other"
//   tech        → array string tech stack
//   desc        → deskripsi singkat 1-2 kalimat
//   thumbnail   → path dari public/ (contoh: "/img/nama.png")
//   github      → link github atau null
//   demo        → link live demo atau null
//   role        → role lu di project ini
//   year        → tahun
//   empty       → true kalau slot masih kosong (placeholder)
// ============================================================
const projects = [
  {
    id: 1,
    name: "Class_Billiard_Web",
    category: "Web",
    tech: ["Laravel", "Tailwind", "HTML", "JavaScript", "MySQL", "PHP"],
    desc: "Frontend development for a billiard venue platform in Central Kalimantan. Handled UI/UX design and responsive web implementation end-to-end.",
    thumbnail: "/img/class-billiard.png",
    github: "https://github.com/pittkajull/democlassbilliard.git",
    demo: "https://classbilliard.com",
    role: "Frontend Developer · UI/UX Designer · Prompt Engineer",
    year: "2025",
    empty: false,
  },
  // ── SLOT 2-6: Kosong dulu, isi sendiri nanti ──
  {
    id: 2,
    name: "Reincarnate_web",
    category: "Web",
    tech: ["Laravel, MYSQL, HTML, CSS, JavaScript, PHP"],
    desc: "",
    thumbnail: "/img/Reincarnate.png",
    github: "https://github.com/pittkajull/reincarnate.git",
    demo: "https://github.com/pittkajull/reincarnate.git",
    UI_UX: "https://www.figma.com/design/mHHGEvzxLB72z8ciaXVuNw/Reincernate.id?node-id=61-82&t=Nc3BIUtFmgXqzg6m-1",
    role: "Frontend Developer · UI/UX Designer · Prompt Engineer",
    year: "2025",
    empty: false,
  },
  {
    id: 3,
    name: "UMKMPAKBIE_Web",
    category: "Web",
    tech: ["Laravel, MYSQL, HTML, CSS, JavaScript, PHP"],
    desc: "",
    thumbnail: "/img/pakbie.png",
    github: "https://github.com/pittkajull/umkmpakbie.git",
    demo: "https://github.com/pittkajull/umkmpakbie.git",
    UI_UX: "https://www.figma.com/design/8hcHKrIcc6HdzJPCxnLfKV/UI-UX-PAK-BIE?node-id=0-1&t=0dME4iuUWWTOZik9-1",
    role: "Frontend Developer · UI/UX Designer · Prompt Engineer",
    year: "2025",
    empty: false,
  },
  {
    id: 4,
    name: "Artnest_Web",
    category: "Web",
    tech: ["MYSQL, HTML, CSS, JavaScript, PHP"],
    desc: "",
    thumbnail: "/img/Artnest.png",
    github: "https://github.com/pittkajull/artnest.git",
    demo: "https://github.com/pittkajull/artnest.git",
    UI_UX: "https://www.figma.com/design/Yk2cWKnVQukVTn87YKOGXn/ArtNest?node-id=109-86&t=BGdeQHjgSGGyS845-1",
    role: "Frontend Developer · UI/UX Designer · Prompt Engineer",
    year: "2025",
    empty: false,
  },
  {
    id: 5,
    name: "Design - Techfair Vol 1 - Himpunan Mahasiswa Teknologi Informasi Universitas Brawijaya",
    category: "Design",
    tech: ["Figma"],
    desc: "",
    thumbnail: "/img/Techfair.png",
    github: null,
    demo: null,
    UI_UX: "https://www.figma.com/design/oAzqXnwwdkvb9UtRBWp6yh/RISTEK?node-id=377-72&t=whCiCvWbPrTk3nv4-1",
    role: "Designer",
    year: "2025",
    empty: false,
  },
  {
    id: 6,
    name: "Design - Farewell Party - Eksekutif Mahasiswa Universitas Brawijaya",
    category: "Design",
    tech: ["Figma"],
    desc: "",
    thumbnail: "/img/FarewellPT.png",
    github: null,
    UI_UX: "https://www.figma.com/design/1AGB80y69MNLrTj6DbKTs4/MSDI-farewell-party?node-id=0-1&t=30u022R5p6SPIFXR-1",
    role: "Designer",
    year: "2025",
    empty: false,
  },

{
    id: 7,
    name: "Mobile Apllication - Focusly",
    category: "Mobile",
    tech: ["Flutter, sqlite, dart, Figma"],
    desc: "", 
    thumbnail: "/img/Focusly.png",
    demo: "https://github.com/pittkajull/focusly.git",
    github: "https://github.com/pittkajull/focusly.git",
    UI_UX: "https://www.figma.com/design/iHrQhafQRi1cerVdME2wGs/Focusly.?node-id=96-238&t=p14As5iVRHP4tByE-1",
    role: "UI/UX Designer · Prompt Engineer",
    year: "2025",
    empty: false,
  },

];

// ============================================================
// CATEGORY CONFIG
// ============================================================
const CATEGORY_CONFIG = {
  Web:    { icon: '🌐', color: 'from-blue-500 to-indigo-600',    badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  Design: { icon: '🎨', color: 'from-pink-500 to-rose-600',      badge: 'bg-pink-500/20 text-pink-300 border-pink-500/30' },
  Video:  { icon: '🎬', color: 'from-purple-500 to-violet-600',  badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
  CySec:  { icon: '🔐', color: 'from-green-500 to-emerald-600',  badge: 'bg-green-500/20 text-green-300 border-green-500/30' },
  Other:  { icon: '📁', color: 'from-gray-500 to-gray-600',      badge: 'bg-gray-500/20 text-gray-300 border-gray-500/30' },
  Mobile: { icon: '📱', color: 'from-green-500 to-teal-600',      badge: 'bg-green-500/20 text-green-300 border-green-500/30' },
};

const FILTERS = ['All', 'Web', 'Design', 'Video', 'CySec', 'Other'];

// ============================================================
// PROJECT DETAIL PANEL
// ============================================================
function ProjectDetail({ project, onClose }) {
  const cfg = CATEGORY_CONFIG[project.category] || CATEGORY_CONFIG.Other;

  return (
    <div className="absolute inset-0 bg-white z-10 flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 bg-[#f6f6f6]">
        <button onClick={onClose} className="text-gray-500 hover:text-gray-800 transition text-sm font-bold">‹ Back</button>
        <span className="text-[11px] font-bold text-gray-700 uppercase tracking-tight">{project.name}</span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Thumbnail */}
        <div className="w-full h-52 bg-gray-100 overflow-hidden relative">
          {project.thumbnail ? (
            <img
              src={project.thumbnail}
              alt={project.name}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
            />
          ) : null}
          <div className={`${project.thumbnail ? 'hidden' : 'flex'} w-full h-full items-center justify-center bg-gradient-to-br ${cfg.color} text-6xl`}>
            {cfg.icon}
          </div>
        </div>

        {/* Info */}
        <div className="p-5 space-y-4">
          {/* Title + category */}
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-base font-black text-gray-900 leading-tight">{project.name.replace(/_/g, ' ')}</h2>
            <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full border ${cfg.badge}`}>
              {cfg.icon} {project.category}
            </span>
          </div>

          {/* Role + year */}
          <div className="text-[11px] text-gray-500 space-y-0.5">
            {project.role && <p>🧑‍💻 <span className="font-semibold text-gray-700">{project.role}</span></p>}
            {project.year && <p>📅 {project.year}</p>}
          </div>

          {/* Desc */}
          {project.desc && (
            <p className="text-[12px] text-gray-600 leading-relaxed">{project.desc}</p>
          )}

          {/* Tech stack */}
          {project.tech.length > 0 && (
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Tech Stack</p>
              <div className="flex flex-wrap gap-1.5">
                {project.tech.map(t => (
                  <span key={t} className="px-2 py-0.5 bg-gray-100 text-gray-700 text-[10px] font-mono rounded border border-gray-200">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Links */}
          <div className="flex gap-2 pt-1">
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold rounded-lg transition"
              >
                🌐 Live Demo
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 bg-gray-800 hover:bg-gray-900 text-white text-[11px] font-bold rounded-lg transition"
              >
                🐙 GitHub
              </a>
            )}
            
              {project.UI_UX && (
              <a
                href={project.UI_UX}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 bg-gray-800 hover:bg-gray-900 text-white text-[11px] font-bold rounded-lg transition"
              >
                🎨 UI/UX Figma
              </a>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function ProjectExplorer({ isMaximized, toggleMax, minimize, close, zIndex, onFocus }) {
  const nodeRef = useRef(null);
  const [filter, setFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);
  const [view, setView] = useState('grid'); // 'grid' | 'list'

  const filtered = projects.filter(p =>
    filter === 'All' || p.category === filter
  );

  const handleOpen = (proj) => {
    if (proj.empty) return;
    setSelectedProject(proj);
  };

  return (
    <Draggable
      nodeRef={nodeRef} handle=".finder-header"
      disabled={isMaximized || window.innerWidth < 768}
      position={isMaximized || window.innerWidth < 768 ? { x: 0, y: 0 } : null}
    >
      <div
        ref={nodeRef} onMouseDown={onFocus} onTouchStart={onFocus}
        style={{ zIndex, transform: (isMaximized || window.innerWidth < 768) ? 'none' : undefined }}
        className={`bg-white shadow-2xl flex flex-col overflow-hidden transition-all duration-300
          ${isMaximized
            ? 'fixed !top-8 !left-0 w-screen h-[calc(100vh-2rem)] rounded-none'
            : 'absolute top-1 left-1/2 -translate-x-1/2 w-[95%] max-w-5xl h-[540px] rounded-xl border border-gray-300'}`}
      >
        {/* HEADER */}
        <div className={`finder-header bg-[#f6f6f6] px-4 py-2.5 flex justify-between items-center border-b border-gray-200 select-none ${isMaximized ? 'cursor-default' : 'cursor-move'}`}>
          <div className="flex items-center gap-2">
            <span className="text-sm">📂</span>
            <span className="text-[11px] font-bold text-gray-600 tracking-tight uppercase">Projects.localized</span>
          </div>
          <div className="flex items-center gap-4 md:gap-2.5">
            <button onClick={(e) => { e.stopPropagation(); minimize(); }}
              className="w-8 h-8 md:w-3.5 md:h-3.5 rounded-full bg-[#ffbd2e] border border-[#dea123] hover:brightness-90 transition flex items-center justify-center">
            </button>
            <button onClick={(e) => { e.stopPropagation(); toggleMax(); }}
              className="hidden md:flex w-3.5 h-3.5 rounded-full bg-[#27c93f] border border-[#1aab29] hover:brightness-90 transition items-center justify-center text-[6px] font-bold text-black/40">
              {isMaximized ? '❐' : '❑'}
            </button>
            <button onClick={(e) => { e.stopPropagation(); close(); }}
              className="w-8 h-8 md:w-3.5 md:h-3.5 rounded-full bg-[#ff5f56] border border-[#e0443e] hover:brightness-90 transition flex items-center justify-center text-[10px] font-bold text-black/40">
              ✕
            </button>
          </div>
        </div>

        {/* TOOLBAR */}
        <div className="bg-[#f0f0f0] px-4 py-1.5 flex items-center justify-between border-b border-gray-200 gap-2">
          {/* Filter tabs */}
          <div className="flex gap-1 overflow-x-auto">
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide transition-all
                  ${filter === f ? 'bg-blue-500 text-white' : 'text-gray-500 hover:bg-gray-200'}`}
              >
                {f}
              </button>
            ))}
          </div>
          {/* View toggle */}
          <div className="flex gap-1 shrink-0">
            <button onClick={() => setView('grid')} className={`px-2 py-0.5 rounded text-[11px] transition ${view === 'grid' ? 'bg-gray-300 text-gray-800' : 'text-gray-400 hover:bg-gray-200'}`}>⊞</button>
            <button onClick={() => setView('list')} className={`px-2 py-0.5 rounded text-[11px] transition ${view === 'list' ? 'bg-gray-300 text-gray-800' : 'text-gray-400 hover:bg-gray-200'}`}>≡</button>
          </div>
        </div>

        {/* BODY */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* SIDEBAR */}
          <div className="w-40 bg-[#f0f0f0]/60 border-r border-gray-200 p-3 hidden md:block shrink-0">
            <p className="text-[9px] font-bold text-gray-400 mb-3 uppercase tracking-widest">Favorites</p>
            <ul className="text-[11px] space-y-1 text-gray-600 font-medium">
              <li
                onClick={() => setFilter('All')}
                className={`px-2 py-1 rounded cursor-pointer transition ${filter === 'All' ? 'bg-blue-100 text-blue-700 font-bold' : 'hover:bg-gray-200'}`}
              >
                📁 All Projects
              </li>
              {['Web', 'Design', 'CySec', 'Video'].map(cat => (
                <li
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-2 py-1 rounded cursor-pointer transition ${filter === cat ? 'bg-blue-100 text-blue-700 font-bold' : 'hover:bg-gray-200'}`}
                >
                  {CATEGORY_CONFIG[cat]?.icon} {cat}
                </li>
              ))}
            </ul>

            <p className="text-[9px] font-bold text-gray-400 mt-4 mb-2 uppercase tracking-widest">Info</p>
            <p className="text-[9px] text-gray-400 leading-relaxed">
              {projects.filter(p => !p.empty).length} projects<br />
              {projects.filter(p => p.empty).length} slots available
            </p>
          </div>

          {/* MAIN GRID / LIST */}
          <div className="flex-1 overflow-y-auto bg-white custom-scroll">
            {view === 'grid' ? (
              <div className="p-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-5">
                {filtered.map((proj) => {
                  const cfg = CATEGORY_CONFIG[proj.category] || CATEGORY_CONFIG.Other;
                  return (
                    <div
                      key={proj.id}
                      onDoubleClick={() => handleOpen(proj)}
                      onClick={() => handleOpen(proj)}
                      className={`group flex flex-col cursor-pointer rounded-xl overflow-hidden border transition-all duration-200
                        ${proj.empty
                          ? 'border-dashed border-gray-200 opacity-40 cursor-default'
                          : 'border-gray-200 hover:border-blue-300 hover:shadow-lg hover:-translate-y-0.5'}`}
                    >
                      {/* Thumbnail */}
                      <div className={`w-full h-32 overflow-hidden bg-gradient-to-br ${cfg.color} relative`}>
                        {!proj.empty && proj.thumbnail && (
                          <img
                            src={proj.thumbnail}
                            alt={proj.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        )}
                        {proj.empty && (
                          <div className="w-full h-full flex items-center justify-center text-3xl opacity-30">
                            {cfg.icon}
                          </div>
                        )}
                        {!proj.empty && (
                          <div className="absolute top-2 right-2">
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border backdrop-blur-sm ${cfg.badge}`}>
                              {proj.category}
                            </span>
                          </div>
                        )}
                      </div>
                      {/* Label */}
                      <div className="p-2.5 bg-white">
                        <p className={`text-[11px] font-bold truncate ${proj.empty ? 'text-gray-300' : 'text-gray-800'}`}>
                          {proj.empty ? '— empty slot —' : proj.name.replace(/_/g, ' ')}
                        </p>
                        {!proj.empty && proj.tech.length > 0 && (
                          <p className="text-[9px] text-gray-400 mt-0.5 truncate">{proj.tech.join(' · ')}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              // LIST VIEW
              <div className="divide-y divide-gray-100">
                {filtered.map((proj) => {
                  const cfg = CATEGORY_CONFIG[proj.category] || CATEGORY_CONFIG.Other;
                  return (
                    <div
                      key={proj.id}
                      onClick={() => handleOpen(proj)}
                      className={`flex items-center gap-4 px-5 py-3 transition
                        ${proj.empty ? 'opacity-30 cursor-default' : 'hover:bg-blue-50 cursor-pointer'}`}
                    >
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${cfg.color} flex items-center justify-center text-xl shrink-0`}>
                        {cfg.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-bold text-gray-800 truncate">
                          {proj.empty ? '— empty slot —' : proj.name.replace(/_/g, ' ')}
                        </p>
                        {!proj.empty && (
                          <p className="text-[10px] text-gray-400 truncate">{proj.tech.join(' · ')}</p>
                        )}
                      </div>
                      {!proj.empty && (
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${cfg.badge}`}>
                          {proj.category}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* PROJECT DETAIL PANEL */}
          {selectedProject && (
            <ProjectDetail
              project={selectedProject}
              onClose={() => setSelectedProject(null)}
            />
          )}
        </div>

        {/* BOTTOM BAR */}
        <div className="bg-[#f6f6f6] border-t border-gray-200 px-4 py-1 flex justify-between items-center text-[10px] text-gray-400">
          <span>{filtered.length} items</span>
          <span className="font-mono">~/Projects.localized</span>
        </div>
      </div>
    </Draggable>
  );
}