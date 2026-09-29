import { motion, AnimatePresence } from 'motion/react';
import { FileNode } from '@/src/types';
import { FileIcon } from './FileIcon';
import { X, Trash2, Move } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface ShelfProps {
  items: FileNode[];
  onRemove: (id: string) => void;
  onClear: () => void;
  onDrop: () => void;
}

export function Shelf({ items, onRemove, onClear, onDrop }: ShelfProps) {
  if (items.length === 0) return null;

  return (
    <motion.div 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      exit={{ y: 100 }}
      className="fixed bottom-16 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-white/90 backdrop-blur-2xl border border-slate-200 p-2 rounded-2xl shadow-2xl shadow-black/50"
    >
      <div className="flex items-center gap-2 px-3 border-r border-slate-200 mr-2">
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white">
          {items.length}
        </div>
        <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">Stack</span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto max-w-[600px] custom-scrollbar py-1">
        <AnimatePresence>
          {items.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="flex items-center gap-2 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl group relative min-w-[120px]"
            >
              <FileIcon type={item.type} extension={item.extension} className="w-4 h-4" />
              <span className="text-[10px] text-slate-700 truncate max-w-[80px]">{item.name}</span>
              <button 
                onClick={() => onRemove(item.id)}
                className="absolute -top-1 -right-1 bg-rose-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-2 ml-2 pl-4 border-l border-slate-200">
        <button 
          onClick={onClear}
          className="p-2 text-slate-500 hover:text-rose-400 transition-colors"
          title="Clear Stack"
        >
          <Trash2 className="w-4 h-4" />
        </button>
        <button 
          onClick={onDrop}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-200 active:scale-95"
        >
          <Move className="w-3 h-3" />
          <span>DROP HERE</span>
        </button>
      </div>

      <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
        <div className="xbox-prompt">
          <div className="btn-icon-x">X</div>
          <span>Unstack</span>
        </div>
        <div className="xbox-prompt">
          <div className="btn-icon-a">A</div>
          <span>Drop All</span>
        </div>
      </div>
    </motion.div>
  );
}
