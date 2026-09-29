import { motion, AnimatePresence } from 'motion/react';
import { FileNode, ViewMode } from '@/src/types';
import { FileIcon } from './FileIcon';
import { cn, formatFileSize } from '@/src/lib/utils';
import { format } from 'date-fns';

interface FileViewProps {
  items: FileNode[];
  viewMode: ViewMode;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onOpen: (item: FileNode) => void;
}

export function FileView({ items, viewMode, selectedId, onSelect, onOpen }: FileViewProps) {
  if (items.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-slate-500 gap-4">
        <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center">
          <FileIcon type="directory" className="w-10 h-10 opacity-20" />
        </div>
        <div className="text-center">
          <p className="font-medium text-slate-600">This folder is empty</p>
          <p className="text-sm opacity-50">Drag items here to upload</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-4">
          <AnimatePresence mode="popLayout">
            {items.map((item) => (
              <motion.button
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                tabIndex={0}
                onClick={() => onSelect(item.id)}
                onDoubleClick={() => onOpen(item)}
                className={cn(
                  "flex flex-col items-center p-4 rounded-xl transition-all group focus:outline-none focus:ring-2 focus:ring-blue-500/50",
                  selectedId === item.id 
                    ? "bg-blue-100 ring-1 ring-blue-300" 
                    : "hover:bg-slate-200 active:scale-95"
                )}
              >
                <div className="relative mb-3">
                  <FileIcon type={item.type} extension={item.extension} className="w-16 h-16" />
                  {selectedId === item.id && (
                    <motion.div 
                      layoutId="selection-glow"
                      className="absolute inset-[-20%] bg-blue-500/20 blur-2xl rounded-full -z-10"
                    />
                  )}
                  <div className="absolute -bottom-1 -right-1 flex gap-1 opacity-0 group-focus:opacity-100 transition-opacity">
                    <div className="btn-icon-x">X</div>
                    <div className="btn-icon-a">A</div>
                  </div>
                </div>
                <span className="text-xs font-medium text-slate-800 text-center line-clamp-2 w-full break-all">
                  {item.name}
                </span>
                {item.size && (
                  <span className="text-[10px] text-slate-500 mt-1">
                    {formatFileSize(item.size)}
                  </span>
                )}
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          <div className="grid grid-cols-[1fr_120px_180px_60px] px-4 py-2 text-[10px] uppercase tracking-wider font-bold text-slate-500 border-b border-slate-200 mb-2">
            <span>Name</span>
            <span>Size</span>
            <span>Modified</span>
            <span></span>
          </div>
          {items.map((item) => (
            <button
              key={item.id}
              tabIndex={0}
              onClick={() => onSelect(item.id)}
              onDoubleClick={() => onOpen(item)}
              className={cn(
                "grid grid-cols-[1fr_120px_180px_60px] items-center px-4 py-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50 group",
                selectedId === item.id 
                  ? "bg-blue-100 ring-1 ring-blue-300" 
                  : "hover:bg-slate-200"
              )}
            >
              <div className="flex items-center gap-3">
                <FileIcon type={item.type} extension={item.extension} className="w-4 h-4" />
                <span className="text-sm text-slate-800 truncate">{item.name}</span>
              </div>
              <span className="text-xs text-slate-600">{formatFileSize(item.size)}</span>
              <span className="text-xs text-slate-600">
                {format(new Date(item.lastModified), 'MMM d, yyyy HH:mm')}
              </span>
              <div className="flex items-center justify-end gap-1 opacity-0 group-focus:opacity-100 transition-opacity">
                <div className="btn-icon-x scale-75">X</div>
                <div className="btn-icon-a scale-75">A</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
