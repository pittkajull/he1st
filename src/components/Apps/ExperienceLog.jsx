  import React, { useRef, useState } from 'react';
import Draggable from 'react-draggable';

const experiences = [
  {
    id: "EXP_001",
    date: "Jan 2026",
    level: "CONTRACT",
    levelColor: "text-yellow-400",
    org: "yollins_club",
    role: "Graphic Designer (Freelance)",
    location: "Kota Serang, Banten · Remote",
    desc: "Designed 3 promotional posters for a clothing brand. Translated client requirements into clear visual layouts aligned with brand identity and social media needs.",
    tags: ["graphic-design", "freelance", "branding"],
    tagColor: "bg-yellow-900/40 text-yellow-300",
  },
  {
    id: "EXP_002",
    date: "Des 2025 – Jan 2026",
    level: "CONTRACT",
    levelColor: "text-yellow-400",
    org: "Class Billiard",
    role: "Frontend Dev, Prompt Engineer & UI/UX Designer",
    location: "Kalimantan Tengah · Remote",
    desc: "End-to-end design and frontend development for a billiard venue platform. From wireframing to implementation, integrating AI prompting to boost efficiency and UX.",
    tags: ["react", "ui/ux", "prompt-engineering", "frontend"],
    tagColor: "bg-cyan-900/40 text-cyan-300",
  },
  {
    id: "EXP_003",
    date: "Nov 2025",
    level: "EVENT",
    levelColor: "text-blue-400",
    org: "HMPSTI Vokasi UB",
    role: "Field Coordinator – TechFair Vol. 2",
    location: "Brawijaya University · On-site",
    desc: "Led field operations for one of the largest IT student association programs. Managed on-site coordination, participant flow, and cross-division communication.",
    tags: ["leadership", "coordination", "event-management"],
    tagColor: "bg-blue-900/40 text-blue-300",
  },
  {
    id: "EXP_004",
    date: "Okt 2025",
    level: "EVENT",
    levelColor: "text-blue-400",
    org: "HMPSTI Vokasi UB",
    role: "Event Coordinator – TechnoCup",
    location: "Malang · On-site",
    desc: "Coordinated city-scale Mobile Legends tournament involving 20 teams from high schools and universities. Managed 7 committee members and full event execution.",
    tags: ["event-management", "leadership", "esports"],
    tagColor: "bg-blue-900/40 text-blue-300",
  },
  {
    id: "EXP_005",
    date: "Okt 2025",
    level: "EVENT",
    levelColor: "text-blue-400",
    org: "HMPSTI Vokasi UB",
    role: "Vice Project Leader – Think Solve Innovation",
    location: "Brawijaya University · On-site",
    desc: "Coordinated 17 committee members for an IT seminar serving 250+ new students. Supported planning, task distribution, and real-time execution across all divisions.",
    tags: ["leadership", "project-management", "seminar"],
    tagColor: "bg-blue-900/40 text-blue-300",
  },
  {
    id: "EXP_006",
    date: "Okt 2025",
    level: "CONTRACT",
    levelColor: "text-yellow-400",
    org: "Eksekutif Mahasiswa UB",
    role: "Project Leader – EXPERT x SIAP ADMIN x SAKU Vol. 3",
    location: "Brawijaya University · On-site",
    desc: "Led 27 committee members to deliver an event for 100+ participants within a tight 2-week timeline. Oversaw planning, task distribution, and cross-team coordination under high pressure.",
    tags: ["project-leader", "leadership", "decision-making"],
    tagColor: "bg-purple-900/40 text-purple-300",
  },
  {
    id: "EXP_007",
    date: "Sep 2025",
    level: "AWARD",
    levelColor: "text-green-400",
    org: "HMPSTI Vokasi UB",
    role: "Staff of The Month – Research & Technology Division",
    location: "Brawijaya University",
    desc: "Recognized for consistency, active contribution, and dedication in supporting organizational programs and team collaboration throughout September 2025.",
    tags: ["achievement", "recognition", "research-tech"],
    tagColor: "bg-green-900/40 text-green-300",
  },
  {
    id: "EXP_008",
    date: "Sep 2025 – Des 2025",
    level: "INTERN",
    levelColor: "text-orange-400",
    org: "Eksekutif Mahasiswa UB",
    role: "Internal Human Resources Intern",
    location: "Brawijaya University · On-site",
    desc: "Supported internal HR programs, member development, and organizational coordination. Also delegated to the Senora department for monitoring and oversight functions.",
    tags: ["hr", "internship", "organizational-development"],
    tagColor: "bg-orange-900/40 text-orange-300",
  },
  {
    id: "EXP_009",
    date: "Sep 2025 – Des 2025",
    level: "ORG",
    levelColor: "text-blue-400",
    org: "HMPSTI Vokasi UB",
    role: "Vice Field Coordinator – SAMBA TI",
    location: "Brawijaya University · On-site",
    desc: "Managed 250+ new IT students during the largest flagship orientation program. Supported on-site operations, crowd control, and schedule execution as part of a 5-member coordination team.",
    tags: ["leadership", "coordination", "orientation"],
    tagColor: "bg-blue-900/40 text-blue-300",
  },
  {
    id: "EXP_010",
    date: "Jun 2025",
    level: "EVENT",
    levelColor: "text-blue-400",
    org: "HMPSTI Vokasi UB",
    role: "Coordinator Creative Design Media – TechFair Vol. 1",
    location: "Brawijaya University · On-site",
    desc: "Led a 4-person creative team delivering all visual and promotional assets for a faculty-scale event. Designs received recognition from the Project Leader and were approved by lecturers.",
    tags: ["creative-lead", "design", "branding"],
    tagColor: "bg-pink-900/40 text-pink-300",
  },
  {
    id: "EXP_011",
    date: "Mei 2025",
    level: "EVENT",
    levelColor: "text-blue-400",
    org: "HMPSTI Vokasi UB",
    role: "Secretary & CDM – TechBridge Academy",
    location: "Brawijaya University · On-site",
    desc: "Handled dual roles: administrative (documentation, scheduling, meeting notes) and creative (visual content & promotional materials) for the TechBridgeAcademy program.",
    tags: ["secretary", "creative-design", "multitasking"],
    tagColor: "bg-pink-900/40 text-pink-300",
  },
  {
    id: "EXP_012",
    date: "Mei 2025",
    level: "EVENT",
    levelColor: "text-blue-400",
    org: "HMPSTI Vokasi UB",
    role: "Equipment Staff – TechPlanner",
    location: "Brawijaya University · On-site",
    desc: "Managed equipment logistics and ensured readiness for a student development program. Strengthened teamwork and problem-solving in technical and operational aspects.",
    tags: ["logistics", "teamwork", "operations"],
    tagColor: "bg-gray-700/40 text-gray-300",
  },
  {
    id: "EXP_013",
    date: "Apr 2025 – Feb 2026",
    level: "CONTRACT",
    levelColor: "text-yellow-400",
    org: "PROVOKS Universitas Brawijaya",
    role: "Multimedia Designer",
    location: "Brawijaya University · On-site",
    desc: "Created and managed visual & digital content for organizational events. Designed promotional materials, handled photo/video documentation, and maintained consistent visual branding across platforms.",
    tags: ["multimedia", "graphic-design", "content-creation"],
    tagColor: "bg-pink-900/40 text-pink-300",
  },
  {
    id: "EXP_014",
    date: "Jan 2025 – Des 2025",
    level: "ORG",
    levelColor: "text-blue-400",
    org: "HMPSTI Vokasi UB",
    role: "Expert Staff – Research & Technology Department",
    location: "Universitas Brawijaya",
    desc: "Full-year active membership in the Research & Technology division, contributing to research initiatives, editing, and tech-related organizational programs.",
    tags: ["research", "tech", "organization"],
    tagColor: "bg-cyan-900/40 text-cyan-300",
  },
  {
    id: "EXP_015",
    date: "Nov 2025",
    level: "EVENT",
    levelColor: "text-purple-400",
    org: "Eksekutif Mahasiswa UB",
    role: "Decoration & Documentation Staff – Farewell Party",
    location: "Brawijaya University · On-site",
    desc: "Part of a 5-member team managing all visual and decoration aspects for a university-level farewell event. Contributed to concept development, visual materials, and photo/video documentation.",
    tags: ["decoration", "documentation", "design"],
    tagColor: "bg-purple-900/40 text-purple-300",
  },
  {
    id: "EXP_016",
    date: "2022 – 2023",
    level: "ORG",
    levelColor: "text-green-400",
    org: "RISMA MAN 1 Kota Serang",
    role: "RISMA Member / Leadership Trainee",
    location: "MAN 1 Kota Serang · On-site",
    desc: "Completed DIKLAT RISMA leadership training. Involved in organizational, social, and community activities. Developed leadership, responsibility, and teamwork skills through structured training.",
    tags: ["leadership-training", "organization", "community"],
    tagColor: "bg-green-900/40 text-green-300",
  },
];

const LEVEL_FILTERS = ["ALL", "CONTRACT", "INTERN", "ORG", "EVENT", "AWARD"];

export default function ExperienceLog({ isMaximized, toggleMax, minimize, close, zIndex, onFocus }) {
  const nodeRef = useRef(null);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(null);

  const filtered = experiences.filter(e => {
    const matchLevel = filter === "ALL" || e.level === filter;
    const matchSearch = search === "" ||
      e.org.toLowerCase().includes(search.toLowerCase()) ||
      e.role.toLowerCase().includes(search.toLowerCase()) ||
      e.tags.some(t => t.includes(search.toLowerCase()));
    return matchLevel && matchSearch;
  });

  return (
    <Draggable
      nodeRef={nodeRef} handle=".log-header"
      disabled={isMaximized || window.innerWidth < 768}
      position={isMaximized || window.innerWidth < 768 ? { x: 0, y: 0 } : null}
    >
      <div
        ref={nodeRef} onMouseDown={onFocus} onTouchStart={onFocus}
        style={{ zIndex, transform: (isMaximized || window.innerWidth < 768) ? 'none' : undefined }}
        className={`bg-[#0d1117] text-green-400 shadow-2xl flex flex-col overflow-hidden border border-green-900/40 transition-all duration-300 font-mono
          ${isMaximized
            ? 'fixed !top-8 !left-0 w-screen h-[calc(100vh-2rem)] rounded-none'
            : 'absolute top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-5xl h-[580px] rounded-lg'}`}
      >
        {/* HEADER */}
        <div className={`log-header bg-[#161b22] px-4 py-2 flex justify-between items-center border-b border-green-900/30 select-none ${isMaximized ? 'cursor-default' : 'cursor-move'}`}>
          <div className="flex items-center gap-2">
            <span className="text-green-500 animate-pulse">●</span>
            <span className="text-[11px] font-bold text-green-400 uppercase tracking-widest">experience.log — muhajir_db</span>
          </div>
          <div className="flex items-center gap-4 md:gap-2">
            <button onClick={(e) => { e.stopPropagation(); minimize(); }} className="w-10 h-10 md:w-6 md:h-6 hover:bg-white/10 rounded flex items-center justify-center text-gray-400 hover:text-white transition">—</button>
            <button onClick={(e) => { e.stopPropagation(); toggleMax(); }} className="hidden md:flex w-6 h-6 hover:bg-white/10 rounded items-center justify-center text-gray-400 hover:text-white transition text-xs">{isMaximized ? '❐' : '❑'}</button>
            <button onClick={(e) => { e.stopPropagation(); close(); }} className="w-10 h-10 md:w-6 md:h-6 hover:bg-red-600 rounded flex items-center justify-center text-gray-400 hover:text-white transition">✕</button>
          </div>
        </div>

        {/* TOOLBAR: FILTER + SEARCH */}
        <div className="bg-[#0d1117] border-b border-green-900/20 px-4 py-2 flex flex-col md:flex-row gap-2 md:items-center md:justify-between">
          {/* Filter Tabs */}
          <div className="flex gap-1 flex-wrap">
            {LEVEL_FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest border transition-all
                  ${filter === f
                    ? 'bg-green-500/20 border-green-500 text-green-300'
                    : 'border-green-900/30 text-green-700 hover:border-green-600 hover:text-green-400'}`}
              >
                {f}
              </button>
            ))}
          </div>
          {/* Search */}
          <div className="flex items-center gap-2 bg-[#161b22] border border-green-900/30 rounded px-2 py-1">
            <span className="text-green-700 text-[10px]">grep</span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="search logs..."
              className="bg-transparent text-green-300 text-[10px] outline-none w-32 placeholder-green-900"
            />
          </div>
        </div>

        {/* LOG ENTRIES */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1 custom-scroll">
          {/* Header baris */}
          <div className="hidden md:grid grid-cols-[90px_80px_1fr] gap-3 text-[9px] text-green-800 uppercase tracking-widest border-b border-green-900/20 pb-1 mb-2">
            <span>TIMESTAMP</span>
            <span>LEVEL</span>
            <span>ENTRY</span>
          </div>

          {filtered.map((exp) => (
            <div
              key={exp.id}
              onClick={() => setExpanded(expanded === exp.id ? null : exp.id)}
              className={`group cursor-pointer rounded border transition-all duration-200
                ${expanded === exp.id
                  ? 'border-green-500/40 bg-green-950/30'
                  : 'border-transparent hover:border-green-900/40 hover:bg-green-950/10'}`}
            >
              {/* COLLAPSED ROW */}
              <div className="grid grid-cols-[1fr] md:grid-cols-[90px_80px_1fr] gap-2 md:gap-3 px-2 py-2 items-start">
                <span className="text-[9px] text-green-700 hidden md:block mt-0.5">{exp.date}</span>
                <span className={`text-[9px] font-bold hidden md:block mt-0.5 ${exp.levelColor}`}>[{exp.level}]</span>
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[9px] text-green-700 md:hidden">{exp.date}</span>
                    <span className={`text-[9px] font-bold md:hidden ${exp.levelColor}`}>[{exp.level}]</span>
                    <span className="text-[11px] text-white font-bold">{exp.org}</span>
                    <span className="text-green-600 text-[10px]">›</span>
                    <span className="text-[10px] text-green-300">{exp.role}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[9px] text-green-800">
                    <span>📍</span><span>{exp.location}</span>
                  </div>
                </div>
              </div>

              {/* EXPANDED DETAIL */}
              {expanded === exp.id && (
                <div className="px-2 pb-3 pt-1 border-t border-green-900/20 space-y-2">
                  <p className="text-[11px] text-gray-300 leading-relaxed pl-0 md:pl-[172px]">
                    {exp.desc}
                  </p>
                  <div className="flex gap-1 flex-wrap pl-0 md:pl-[172px]">
                    {exp.tags.map(tag => (
                      <span key={tag} className={`px-2 py-0.5 rounded-full text-[9px] font-mono ${exp.tagColor}`}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-10 text-green-800 text-xs">
              <p>grep: no matching entries found</p>
              <p className="mt-1 text-[10px]">try: <span className="text-green-600">filter ALL</span> or clear search</p>
            </div>
          )}
        </div>

        {/* BOTTOM STATUS BAR */}
        <div className="bg-[#161b22] border-t border-green-900/30 px-4 py-1 flex justify-between items-center text-[9px] text-green-800">
          <span>● {filtered.length} entries loaded / {experiences.length} total</span>
          <span className="text-green-600 animate-pulse">journalctl -f muhajir.log</span>
          <span>CONNECTION: STABLE</span>
        </div>
      </div>
    </Draggable>
  );
}
