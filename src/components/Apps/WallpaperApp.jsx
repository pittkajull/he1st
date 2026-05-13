import React, { useRef, useState } from 'react';
import Draggable from 'react-draggable';

const WALLPAPERS = [
  {
    id: 'bliss',
    name: 'Bliss',
    os: 'Windows XP',
    year: '2001',
    url: '/img/wallpapers/Bliss.jpg',
    thumb: '/img/wallpapers/Bliss.jpg',
    color: 'from-green-400 to-blue-500',
    desc: 'The most viewed photograph in history. Rolling hills of Sonoma County, California.',
  },
  {
    id: 'aurora',
    name: 'Aurora',
    os: 'Windows Vista',
    year: '2007',
    url: '/img/wallpapers/Aurora.jpg',
    thumb: '/img/wallpapers/Aurora.jpg',
    color: 'from-blue-600 to-purple-700',
    desc: 'The iconic glowing aurora that defined the Windows Vista era.',
  },
  {
    id: 'harmony',
    name: 'Harmony',
    os: 'Windows 7',
    year: '2009',
    url: '/img/wallpapers/Harmony.jpg',
    thumb: '/img/wallpapers/Harmony.jpg',
    color: 'from-cyan-500 to-blue-700',
    desc: 'The calm Windows 7 default — fish underwater in cool blue tones.',
  },
  {
    id: 'hero2009',
    name: 'Hero',
    os: 'Windows 7',
    year: '2009',
    url: '/img/wallpapers/Hero-2009.jpg',
    thumb: '/img/wallpapers/Hero-2009.jpg',
    color: 'from-blue-800 to-indigo-900',
    desc: 'Windows 7 Hero — the dark, dramatic variant of the default wallpaper.',
  },
  {
    id: 'sunrise',
    name: 'Sunrise',
    os: 'Windows 8',
    year: '2012',
    url: '/img/wallpapers/Sunrise.png',
    thumb: '/img/wallpapers/Sunrise.png',
    color: 'from-sky-400 to-blue-600',
    desc: 'Windows 8 logo wallpaper — minimalist and clean.',
  },
  {
    id: 'hero2015',
    name: 'Hero',
    os: 'Windows 10',
    year: '2015',
    url: '/img/wallpapers/Hero-2015.jpg',
    thumb: '/img/wallpapers/Hero-2015.jpg',
    color: 'from-blue-500 to-indigo-600',
    desc: 'Windows 10 default — the light beam that marked a new era.',
  },
   {
    id: 'xp_autumn',
    name: 'Autumn',
    os: 'Windows XP',
    year: '2001',
    url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1280&q=80',
    thumb: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=400&q=80',
    color: 'from-orange-400 to-amber-600',
    desc: 'XP Autumn — the warm orange tones from the XP wallpaper collection.',
  },
  {
    id: 'xp_winter',
    name: 'Winter',
    os: 'Windows XP',
    year: '2001',
    url: 'https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=1280&q=80',
    thumb: 'https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=400&q=80',
    color: 'from-blue-200 to-slate-400',
    desc: 'XP Winter — snow-covered landscape from the XP wallpaper set.',
  },
];

const OS_FILTERS = ['All', 'Windows XP', 'Windows Vista', 'Windows 7', 'Windows 8', 'Windows 10'];

export default function WallpaperApp({ isMaximized, toggleMax, minimize, close, zIndex, onFocus, onWallpaperChange }) {
  const nodeRef = useRef(null);
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState(null);
  const [applied, setApplied] = useState(null);
  const [hovering, setHovering] = useState(null);

  const filtered = filter === 'All'
    ? WALLPAPERS
    : WALLPAPERS.filter(w => w.os === filter);

  const handleApply = (wp) => {
    setApplied(wp.id);
    if (onWallpaperChange) onWallpaperChange(wp.url);
  };

  return (
    <Draggable
      nodeRef={nodeRef} handle=".wp-header"
      disabled={isMaximized || window.innerWidth < 768}
      position={isMaximized || window.innerWidth < 768 ? { x: 0, y: 0 } : null}
    >
      <div
        ref={nodeRef} onMouseDown={onFocus} onTouchStart={onFocus}
        style={{ zIndex, transform: (isMaximized || window.innerWidth < 768) ? 'none' : undefined }}
        className={`bg-[#1a1a2e] text-white shadow-2xl flex flex-col overflow-hidden border border-white/10 transition-all duration-300
          ${isMaximized
            ? 'fixed !top-8 !left-0 w-screen h-[calc(100vh-2rem)] rounded-none'
            : 'absolute top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-5xl h-[580px] rounded-xl'}`}
      >
        {/* HEADER */}
        <div className="wp-header bg-[#16213e] px-4 py-2.5 flex justify-between items-center border-b border-white/10 select-none cursor-move">
          <div className="flex items-center gap-2">
            <span className="text-lg">🖼️</span>
            <span className="text-[11px] font-bold text-gray-300 uppercase tracking-widest">Wallpaper.sh — Windows Nostalgia Collection</span>
          </div>
          <div className="flex items-center gap-4 md:gap-2">
            <button onClick={(e) => { e.stopPropagation(); minimize(); }} className="w-10 h-10 md:w-6 md:h-6 hover:bg-white/10 rounded flex items-center justify-center text-gray-400 hover:text-white transition">—</button>
            <button onClick={(e) => { e.stopPropagation(); toggleMax(); }} className="hidden md:flex w-6 h-6 hover:bg-white/10 rounded items-center justify-center text-gray-400 hover:text-white transition text-xs">{isMaximized ? '❐' : '❑'}</button>
            <button onClick={(e) => { e.stopPropagation(); close(); }} className="w-10 h-10 md:w-6 md:h-6 hover:bg-red-600 rounded flex items-center justify-center text-gray-400 hover:text-white transition">✕</button>
          </div>
        </div>

        {/* OS FILTER */}
        <div className="bg-[#16213e] border-b border-white/10 px-4 py-2 flex gap-1.5 overflow-x-auto">
          {OS_FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`shrink-0 px-3 py-1 rounded-full text-[10px] font-bold transition-all
                ${filter === f
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/5 text-gray-500 hover:bg-white/10 hover:text-gray-300'}`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* GRID */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {filtered.map((wp) => (
                <div
                  key={wp.id}
                  onClick={() => setSelected(wp)}
                  onMouseEnter={() => setHovering(wp.id)}
                  onMouseLeave={() => setHovering(null)}
                  className={`group cursor-pointer rounded-xl overflow-hidden border-2 transition-all duration-200
                    ${selected?.id === wp.id
                      ? 'border-blue-500 scale-[1.02] shadow-lg shadow-blue-500/20'
                      : 'border-transparent hover:border-white/20'}`}
                >
                  <div className="aspect-video relative overflow-hidden bg-gray-900">
                    <img
                      src={wp.thumb}
                      alt={wp.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className={`hidden w-full h-full bg-gradient-to-br ${wp.color} items-center justify-center text-2xl`}>🖼️</div>

                    {applied === wp.id && (
                      <div className="absolute top-1.5 left-1.5 bg-green-500 text-black text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                        ✓ APPLIED
                      </div>
                    )}

                    {hovering === wp.id && selected?.id !== wp.id && (
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <span className="text-white text-[10px] font-bold bg-black/50 px-2 py-1 rounded">Click to select</span>
                      </div>
                    )}
                  </div>

                  <div className="bg-[#0f3460] px-2 py-1.5">
                    <p className="text-[11px] font-bold text-white truncate">{wp.name}</p>
                    <p className="text-[9px] text-blue-300">{wp.os} · {wp.year}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* DETAIL PANEL */}
          <div className="w-56 bg-[#16213e] border-l border-white/10 p-4 hidden md:flex flex-col gap-4 shrink-0">
            {selected ? (
              <>
                <div className="aspect-video rounded-lg overflow-hidden bg-gray-900 border border-white/10">
                  <img
                    src={selected.thumb}
                    alt={selected.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className={`hidden w-full h-full bg-gradient-to-br ${selected.color} items-center justify-center text-3xl`}>🖼️</div>
                </div>

                <div className="space-y-1">
                  <p className="text-[13px] font-black text-white">{selected.name}</p>
                  <p className="text-[10px] text-blue-300 font-bold">{selected.os}</p>
                  <p className="text-[10px] text-gray-500">{selected.year}</p>
                  <p className="text-[10px] text-gray-400 leading-relaxed mt-2">{selected.desc}</p>
                </div>

                <button
                  onClick={() => handleApply(selected)}
                  className={`w-full py-2 rounded-lg text-[11px] font-bold transition-all
                    ${applied === selected.id
                      ? 'bg-green-600 text-white cursor-default'
                      : 'bg-blue-600 hover:bg-blue-500 text-white'}`}
                >
                  {applied === selected.id ? '✓ Applied!' : '🖥️ Apply Wallpaper'}
                </button>

                {applied && (
                  <button
                    onClick={() => {
                      setApplied(null);
                      if (onWallpaperChange) onWallpaperChange(null);
                    }}
                    className="w-full py-1.5 rounded-lg text-[10px] text-gray-500 hover:text-gray-300 border border-white/5 hover:border-white/20 transition-all"
                  >
                    Reset to Default
                  </button>
                )}
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center gap-2">
                <span className="text-4xl opacity-20">🖼️</span>
                <p className="text-[11px] text-gray-600">Select a wallpaper to preview</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-[#16213e] border-t border-white/10 px-4 py-1 flex justify-between items-center text-[9px] text-gray-600">
          <span>{filtered.length} wallpapers</span>
          <span className="text-blue-400">Windows Nostalgia Collection</span>
          <span>{applied ? `Applied: ${WALLPAPERS.find(w => w.id === applied)?.name}` : 'No wallpaper applied'}</span>
        </div>
      </div>
    </Draggable>
  );
}