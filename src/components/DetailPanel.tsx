import { FileNode } from '@/src/types';
import { FileIcon } from './FileIcon';
import { formatFileSize } from '@/src/lib/utils';
import { format } from 'date-fns';
import { Info, Share2, Trash2, Download, ExternalLink, List as ListIcon, FileText, Zap, Sliders, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { ConfigInspector } from './ConfigInspector';
import { GameSaveManager } from './GameSaveManager';

interface DetailPanelProps {
  selectedItem: FileNode | null;
  onLaunchBooster?: (exeName: string) => void;
}

interface PreviewData {
  type: 'directory' | 'text' | 'other' | 'media';
  items?: { name: string; type: 'file' | 'directory' }[];
  total?: number;
  content?: string;
}

export function DetailPanel({ selectedItem, onLaunchBooster }: DetailPanelProps) {
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [loading, setLoading] = useState(false);

  const ext = selectedItem?.extension?.toLowerCase() || '';
  const isConfigFile = ['ini', 'json', 'yaml', 'xml', 'cfg'].includes(ext);
  const isExecutable = ext === 'exe';
  const isSaveFile = selectedItem?.name.toLowerCase().includes('save') || selectedItem?.path.toLowerCase().includes('savedgames');

  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext);
  const isVideo = ['mp4', 'webm', 'ogg'].includes(ext);
  const isAudio = ['mp3', 'wav', 'ogg'].includes(ext);
  const isPdf = ext === 'pdf';

  useEffect(() => {
    if (!selectedItem) {
      setPreview(null);
      return;
    }

    if (isImage || isVideo || isAudio || isPdf) {
      setPreview({ type: 'media' });
      return;
    }

    const fetchPreview = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/preview?path=${encodeURIComponent(selectedItem.path)}`);
        const data = await response.json();
        setPreview(data);
      } catch (error) {
        console.error('Failed to fetch preview:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPreview();
  }, [selectedItem]);

  if (!selectedItem) {
    return (
      <aside className="w-85 border-l border-slate-200 bg-white backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600">
          <Info className="w-8 h-8" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-600">No item selected</p>
          <p className="text-xs text-slate-500 mt-1">Select a file or folder to view properties, tweak configs, or backup save states.</p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-85 border-l border-slate-200 bg-white backdrop-blur-xl flex flex-col p-6 overflow-hidden">
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
        <div className="flex flex-col items-center text-center mb-6">
          <motion.div 
            key={selectedItem.id}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative mb-4"
          >
            <FileIcon type={selectedItem.type} extension={selectedItem.extension} className="w-20 h-20" />
            <div className="absolute inset-0 bg-blue-500/10 blur-3xl -z-10 rounded-full" />
          </motion.div>
          
          <h2 className="text-base font-bold text-slate-900 break-all px-2 mb-1">{selectedItem.name}</h2>
          <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">
            {selectedItem.type === 'directory' ? 'Folder' : `${selectedItem.extension?.toUpperCase() || 'FILE'}`}
          </p>

          {/* Executable Game Booster Launcher Button */}
          {isExecutable && (
            <button
              onClick={() => onLaunchBooster?.(selectedItem.name)}
              className="mt-4 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-200 active:scale-95"
            >
              <Zap className="w-4 h-4 text-emerald-700" />
              <span>LAUNCH WITH GAME BOOSTER</span>
            </button>
          )}
        </div>

        {/* Visual Config Inspector embed for .ini/.json/.cfg files */}
        {isConfigFile ? (
          <div className="mb-6">
            <ConfigInspector fileName={selectedItem.name} filePath={selectedItem.path} />
          </div>
        ) : isSaveFile ? (
          <div className="mb-6">
            <GameSaveManager gameName={selectedItem.name} />
          </div>
        ) : (
          /* Default Quick Preview Section */
          <div className="mb-6">
            <span className="text-[10px] uppercase font-bold text-slate-500 mb-2 block">Quick Preview</span>
            <div className="bg-slate-100 rounded-xl border border-slate-200 min-h-[120px] overflow-hidden">
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div 
                    key="loading" 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    className="h-[120px] flex items-center justify-center"
                  >
                    <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  </motion.div>
                ) : preview?.type === 'directory' ? (
                  <motion.div 
                    key="dir"
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }}
                    className="p-3 flex flex-col gap-2"
                  >
                    <div className="flex items-center gap-2 text-blue-700 mb-1">
                      <ListIcon className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-tighter">Directory Contents</span>
                    </div>
                    {preview.items?.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                        <FileIcon type={item.type} className="w-3 h-3" />
                        <span className="truncate">{item.name}</span>
                      </div>
                    ))}
                    {preview.total! > 5 && (
                      <div className="text-[10px] text-slate-600 mt-1 italic">
                        + {preview.total! - 5} more items
                      </div>
                    )}
                  </motion.div>
                ) : preview?.type === 'media' ? (
                  <motion.div 
                    key="media"
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }}
                    className="w-full h-full min-h-[120px] flex items-center justify-center bg-black/5"
                  >
                    {isImage && (
                      <img 
                        src={`/api/raw?path=${encodeURIComponent(selectedItem.path)}`} 
                        alt={selectedItem.name}
                        className="max-w-full max-h-[160px] object-contain"
                      />
                    )}
                    {isVideo && (
                      <video 
                        src={`/api/raw?path=${encodeURIComponent(selectedItem.path)}`} 
                        controls
                        className="max-w-full max-h-[160px]"
                      />
                    )}
                    {isAudio && (
                      <audio 
                        src={`/api/raw?path=${encodeURIComponent(selectedItem.path)}`} 
                        controls
                        className="w-[90%]"
                      />
                    )}
                    {isPdf && (
                      <object 
                        data={`/api/raw?path=${encodeURIComponent(selectedItem.path)}`} 
                        type="application/pdf"
                        className="w-full h-[200px]"
                      >
                        <p className="text-[10px] text-center mt-4">PDF Preview Available</p>
                      </object>
                    )}
                  </motion.div>
                ) : preview?.type === 'text' ? (
                  <motion.div 
                    key="text"
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }}
                    className="p-3"
                  >
                    <div className="flex items-center gap-2 text-emerald-700 mb-2">
                      <FileText className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-tighter">File Contents</span>
                    </div>
                    <pre className="text-[10px] font-mono text-slate-600 whitespace-pre-wrap line-clamp-[8] bg-slate-100 p-2 rounded">
                      {preview.content}
                    </pre>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="none"
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }}
                    className="h-[120px] flex flex-col items-center justify-center text-slate-600"
                  >
                    <Info className="w-6 h-6 opacity-20 mb-2" />
                    <span className="text-[10px] uppercase font-bold tracking-widest">No Preview Available</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3 mb-6">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase font-bold text-slate-500">Size</span>
            <span className="text-xs text-slate-800">{formatFileSize(selectedItem.size)}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase font-bold text-slate-500">Last Modified</span>
            <span className="text-xs text-slate-800">
              {format(new Date(selectedItem.lastModified), 'MMMM d, yyyy HH:mm:ss')}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase font-bold text-slate-500">Path</span>
            <span className="text-[11px] text-slate-600 break-all bg-slate-100 p-2 rounded-lg border border-slate-200">
              {selectedItem.path}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 pt-4 border-t border-slate-200 mt-2">
        <button tabIndex={0} className="flex items-center gap-3 w-full p-2.5 rounded-xl bg-slate-100 hover:bg-slate-300 text-slate-800 text-xs font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50">
          <ExternalLink className="w-4 h-4 text-slate-600" />
          <span>Open File</span>
        </button>
        <div className="grid grid-cols-2 gap-2">
          <button tabIndex={0} className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-slate-100 hover:bg-slate-300 text-slate-800 text-[11px] font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50">
            <Download className="w-4 h-4 text-slate-600" />
            <span>Download</span>
          </button>
          <button tabIndex={0} className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-slate-100 hover:bg-slate-300 text-slate-800 text-[11px] font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50">
            <Share2 className="w-4 h-4 text-slate-600" />
            <span>Share</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

