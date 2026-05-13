import React, { useRef, useState, useEffect } from 'react';
import Draggable from 'react-draggable';

const RSS_URL = 'https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@muhajiramrullahub';

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

function stripHtml(html) {
  return html?.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ').trim() || '';
}

function extractImage(content) {
  const match = content?.match(/<img[^>]+src="([^">]+)"/);
  return match ? match[1] : null;
}

export default function MediumRSS({ isMaximized, toggleMax, minimize, close, zIndex, onFocus }) {
  const nodeRef = useRef(null);
  const [articles, setArticles] = useState([]);
  const [status, setStatus] = useState('booting'); // booting | loading | ready | error
  const [selected, setSelected] = useState(null);
  const [bootLines, setBootLines] = useState([]);
  const [filter, setFilter] = useState('ALL');

  const BOOT_SEQUENCE = [
    '> Initializing medium.rss reader...',
    '> Connecting to feed: medium.com/@muhajiramrullahub',
    '> Fetching articles...',
    '> Parsing RSS feed...',
    '> Rendering content...',
  ];

  // Boot animation
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setBootLines(prev => [...prev, BOOT_SEQUENCE[i]]);
      i++;
      if (i >= BOOT_SEQUENCE.length) {
        clearInterval(interval);
        setStatus('loading');
      }
    }, 400);
    return () => clearInterval(interval);
  }, []);

  // Fetch RSS
  useEffect(() => {
    if (status !== 'loading') return;
    fetch(RSS_URL)
      .then(r => r.json())
      .then(data => {
        if (data.status === 'ok') {
          setArticles(data.items || []);
          setStatus('ready');
        } else {
          setStatus('error');
        }
      })
      .catch(() => setStatus('error'));
  }, [status]);

  // Get all unique tags
  const allTags = ['ALL', ...new Set(articles.flatMap(a => a.categories || []))].slice(0, 8);

  const filtered = filter === 'ALL'
    ? articles
    : articles.filter(a => a.categories?.includes(filter));

  return (
    <Draggable
      nodeRef={nodeRef} handle=".rss-header"
      disabled={isMaximized || window.innerWidth < 768}
      position={isMaximized || window.innerWidth < 768 ? { x: 0, y: 0 } : null}
    >
      <div
        ref={nodeRef} onMouseDown={onFocus} onTouchStart={onFocus}
        style={{ zIndex, transform: (isMaximized || window.innerWidth < 768) ? 'none' : undefined }}
        className={`bg-[#0d0d0d] text-green-400 shadow-2xl flex flex-col overflow-hidden border border-green-900/40 transition-all duration-300 font-mono
          ${isMaximized
            ? 'fixed !top-8 !left-0 w-screen h-[calc(100vh-2rem)] rounded-none'
            : 'absolute top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-5xl h-[580px] rounded-lg'}`}
      >
        {/* HEADER */}
        <div className="rss-header bg-[#111] px-4 py-2 flex justify-between items-center border-b border-green-900/30 select-none cursor-move">
          <div className="flex items-center gap-2">
            <span className="text-green-500 animate-pulse text-xs">●</span>
            <span className="text-[11px] font-bold text-green-400 uppercase tracking-widest">medium.rss — @muhajiramrullahub</span>
          </div>
          <div className="flex items-center gap-4 md:gap-2">
            <button onClick={(e) => { e.stopPropagation(); minimize(); }} className="w-10 h-10 md:w-6 md:h-6 hover:bg-white/10 rounded flex items-center justify-center text-gray-500 hover:text-white transition">—</button>
            <button onClick={(e) => { e.stopPropagation(); toggleMax(); }} className="hidden md:flex w-6 h-6 hover:bg-white/10 rounded items-center justify-center text-gray-500 hover:text-white transition text-xs">{isMaximized ? '❐' : '❑'}</button>
            <button onClick={(e) => { e.stopPropagation(); close(); }} className="w-10 h-10 md:w-6 md:h-6 hover:bg-red-600 rounded flex items-center justify-center text-gray-500 hover:text-white transition">✕</button>
          </div>
        </div>

        {/* BOOT SCREEN */}
        {(status === 'booting' || (status === 'loading' && bootLines.length < BOOT_SEQUENCE.length)) && (
          <div className="flex-1 p-6 space-y-1 overflow-hidden">
            {bootLines.map((line, i) => (
              <p key={i} className="text-[11px] text-green-500 animate-in fade-in duration-300">{line}</p>
            ))}
            {status === 'loading' && (
              <p className="text-[11px] text-yellow-400 animate-pulse mt-2">{'>'} Loading articles<span className="animate-ping">...</span></p>
            )}
          </div>
        )}

        {/* ERROR */}
        {status === 'error' && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 p-6">
            <p className="text-red-400 text-[12px]">[ERROR] Failed to fetch RSS feed</p>
            <p className="text-gray-600 text-[11px]">Check connection or visit medium.com/@muhajiramrullahub directly</p>
            <a
              href="https://medium.com/@muhajiramrullahub"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 border border-green-700 text-green-400 text-[11px] hover:bg-green-900/20 transition rounded"
            >
              → Open Medium Profile
            </a>
            <button
              onClick={() => { setStatus('booting'); setBootLines([]); }}
              className="text-[10px] text-gray-600 hover:text-green-400 transition"
            >
              retry
            </button>
          </div>
        )}

        {/* READY — MAIN CONTENT */}
        {status === 'ready' && !selected && (
          <>
            {/* FILTER TAGS */}
            <div className="bg-[#0d0d0d] border-b border-green-900/20 px-4 py-2 flex gap-1.5 overflow-x-auto">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setFilter(tag)}
                  className={`shrink-0 px-2.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest border transition-all
                    ${filter === tag
                      ? 'bg-green-500/20 border-green-500 text-green-300'
                      : 'border-green-900/30 text-green-800 hover:border-green-700 hover:text-green-500'}`}
                >
                  {tag}
                </button>
              ))}
              <span className="ml-auto shrink-0 text-[9px] text-green-900 self-center">{filtered.length} articles</span>
            </div>

            {/* ARTICLE LIST */}
            <div className="flex-1 overflow-y-auto custom-scroll">
              {filtered.length === 0 ? (
                <div className="p-6 text-center text-green-800 text-[11px]">No articles found for this tag.</div>
              ) : (
                filtered.map((article, i) => {
                  const thumb = extractImage(article.content);
                  const preview = stripHtml(article.description || article.content).slice(0, 120);
                  return (
                    <div
                      key={i}
                      onClick={() => setSelected(article)}
                      className="group flex gap-4 px-4 py-4 border-b border-green-900/10 hover:bg-green-950/20 cursor-pointer transition-all"
                    >
                      {/* Index */}
                      <span className="text-[10px] text-green-900 font-mono w-6 shrink-0 mt-1 group-hover:text-green-600 transition">
                        {String(i + 1).padStart(2, '0')}
                      </span>

                      {/* Thumbnail */}
                      {thumb && (
                        <div className="w-16 h-16 shrink-0 overflow-hidden rounded border border-green-900/30 hidden md:block">
                          <img src={thumb} alt="" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition grayscale group-hover:grayscale-0" />
                        </div>
                      )}

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-[13px] font-bold text-green-300 group-hover:text-green-100 transition leading-tight line-clamp-2">
                            {article.title}
                          </h3>
                          <span className="shrink-0 text-[9px] text-green-800 font-mono mt-0.5">{timeAgo(article.pubDate)}</span>
                        </div>
                        <p className="text-[10px] text-green-800 mt-1 line-clamp-2 leading-relaxed">{preview}...</p>
                        {article.categories?.length > 0 && (
                          <div className="flex gap-1 mt-1.5 flex-wrap">
                            {article.categories.slice(0, 3).map(cat => (
                              <span key={cat} className="text-[8px] px-1.5 py-0.5 bg-green-900/20 border border-green-900/30 text-green-700 rounded">
                                #{cat}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <span className="text-green-800 group-hover:text-green-400 transition self-center shrink-0 text-sm">›</span>
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}

        {/* ARTICLE DETAIL */}
        {status === 'ready' && selected && (
          <div className="flex-1 flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
            {/* Detail toolbar */}
            <div className="px-4 py-2 border-b border-green-900/20 flex items-center gap-3 bg-[#0d0d0d]">
              <button
                onClick={() => setSelected(null)}
                className="text-green-700 hover:text-green-400 transition text-[11px] font-mono"
              >
                ← back
              </button>
              <span className="text-green-900 text-[10px] truncate flex-1">{selected.title}</span>
              <a
                href={selected.link}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 text-[10px] px-2.5 py-1 border border-green-700 text-green-400 hover:bg-green-900/20 transition rounded font-mono"
              >
                open ↗
              </a>
            </div>

            {/* Article content */}
            <div className="flex-1 overflow-y-auto p-5 custom-scroll space-y-4">
              {/* Thumbnail */}
              {extractImage(selected.content) && (
                <img
                  src={extractImage(selected.content)}
                  alt={selected.title}
                  className="w-full max-h-52 object-cover rounded border border-green-900/30 opacity-80"
                />
              )}

              {/* Meta */}
              <div className="space-y-1">
                <h2 className="text-[15px] font-black text-green-200 leading-tight">{selected.title}</h2>
                <p className="text-[10px] text-green-800 font-mono">
                  {new Date(selected.pubDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                  {selected.categories?.length > 0 && ` · ${selected.categories.slice(0, 3).join(', ')}`}
                </p>
              </div>

              {/* Preview text */}
              <div className="border-t border-green-900/20 pt-4">
                <p className="text-[11px] text-green-700 mb-3 font-mono">$ cat article_preview.txt</p>
                <p className="text-[12px] text-gray-400 leading-relaxed">
                  {stripHtml(selected.description || selected.content).slice(0, 600)}...
                </p>
              </div>

              {/* CTA */}
              <div className="border-t border-green-900/20 pt-4 flex flex-col items-start gap-2">
                <p className="text-[10px] text-green-800 font-mono">$ echo "Read full article on Medium"</p>
                <a
                  href={selected.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-600/40 text-green-300 text-[12px] font-bold hover:bg-green-500/20 transition rounded"
                >
                  📝 Read Full Article on Medium ↗
                </a>
              </div>
            </div>
          </div>
        )}

        {/* BOTTOM BAR */}
        <div className="bg-[#111] border-t border-green-900/20 px-4 py-1 flex justify-between items-center text-[9px] text-green-900 font-mono">
          <span>{status === 'ready' ? `${articles.length} articles loaded` : status}</span>
          <span className="text-green-700 animate-pulse">medium.rss · @muhajiramrullahub</span>
          <span>{status === 'ready' ? 'FEED OK' : '...'}</span>
        </div>
      </div>
    </Draggable>
  );
}