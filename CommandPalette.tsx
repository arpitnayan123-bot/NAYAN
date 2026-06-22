import React, { useEffect, useMemo, useState } from 'react';
import { Search, CornerDownLeft, ArrowUp, ArrowDown, Command } from 'lucide-react';

export interface CommandItem {
  id: string;
  label: string;
  group: string;
  emoji: string;
  keywords?: string;
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  items: CommandItem[];
  onSelect: (id: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ open, onClose, items, onSelect }) => {
  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(0);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return items;
    return items.filter(i =>
      i.label.toLowerCase().includes(q) ||
      i.group.toLowerCase().includes(q) ||
      (i.keywords || '').toLowerCase().includes(q)
    );
  }, [query, items]);

  useEffect(() => { setActiveIdx(0); }, [query]);
  useEffect(() => { if (open) { setQuery(''); setActiveIdx(0); } }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, filtered.length - 1)); }
      if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, 0)); }
      if (e.key === 'Enter' && filtered[activeIdx]) { e.preventDefault(); onSelect(filtered[activeIdx].id); onClose(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, filtered, activeIdx, onClose, onSelect]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center pt-[12vh] px-4" onClick={onClose}>
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-md animate-fadeIn" />
      <div onClick={e => e.stopPropagation()} className="relative w-full max-w-2xl glass rounded-3xl shadow-2xl overflow-hidden animate-fadeInScale">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/40">
          <Search className="w-5 h-5 text-emerald-600" />
          <input
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search features, tools, sections..."
            className="flex-1 bg-transparent outline-none text-base font-medium text-slate-800 placeholder:text-slate-400"
          />
          <kbd className="text-[10px] font-bold text-slate-500 bg-white/70 border border-slate-200 px-2 py-1 rounded-lg">ESC</kbd>
        </div>

        <div className="max-h-[50vh] overflow-y-auto scrollbar-slim p-2">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-sm text-slate-400">No results found for "{query}"</div>
          ) : (
            filtered.map((item, idx) => (
              <button
                key={item.id}
                onMouseEnter={() => setActiveIdx(idx)}
                onClick={() => { onSelect(item.id); onClose(); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-all ${idx === activeIdx ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg' : 'hover:bg-white/60 text-slate-700'}`}
              >
                <span className="text-xl">{item.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate">{item.label}</p>
                  <p className={`text-[11px] ${idx === activeIdx ? 'text-white/80' : 'text-slate-400'}`}>{item.group}</p>
                </div>
                {idx === activeIdx && <CornerDownLeft className="w-4 h-4" />}
              </button>
            ))
          )}
        </div>

        <div className="flex items-center justify-between px-5 py-3 border-t border-white/40 text-[11px] font-semibold text-slate-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1"><ArrowUp className="w-3 h-3" /><ArrowDown className="w-3 h-3" /> Navigate</span>
            <span className="flex items-center gap-1"><CornerDownLeft className="w-3 h-3" /> Select</span>
          </div>
          <span className="flex items-center gap-1 text-emerald-600"><Command className="w-3 h-3" /> Aarogya Command</span>
        </div>
      </div>
    </div>
  );
};
