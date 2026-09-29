import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { Toolbar } from './components/Toolbar';
import { FileView } from './components/FileView';
import { DetailPanel } from './components/DetailPanel';
import { Shelf } from './components/Shelf';
import { HeatmapView } from './components/HeatmapView';
import { RadialGuideHUD } from './components/RadialGuideHUD';
import { GameBoosterModal } from './components/GameBoosterModal';
import { AmbientCanvas } from './components/AmbientCanvas';
import { FileNode, ViewMode } from './types';
import { useGamepad } from './hooks/useGamepad';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Sparkles, X, Gauge } from 'lucide-react';

export default function App() {
  const [currentPath, setCurrentPath] = useState('.');
  const [items, setItems] = useState<FileNode[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [loading, setLoading] = useState(true);
  const [shelfItems, setShelfItems] = useState<FileNode[]>([]);
  const [showAiSearch, setShowAiSearch] = useState(false);
  const [aiQuery, setAiQuery] = useState('');
  const [isAiSearching, setIsAiSearching] = useState(false);

  // New Console-Grade Features State
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [boosterActive, setBoosterActive] = useState(false);
  const [boosterExeName, setBoosterExeName] = useState<string | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);

  const fetchFiles = useCallback(async (path: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/files?path=${encodeURIComponent(path)}`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setItems(data);
      }
    } catch (error) {
      console.error('Failed to fetch files:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFiles(currentPath);
  }, [currentPath, fetchFiles]);

  const handleNavigate = (path: string) => {
    if (path === '..') {
      const parts = currentPath.split('/');
      parts.pop();
      setCurrentPath(parts.join('/') || '.');
    } else if (path === '.') {
      setCurrentPath('.');
    } else {
      setCurrentPath(path);
    }
    setSelectedId(null);
  };

  const handleOpen = (item: FileNode) => {
    if (item.type === 'directory') {
      handleNavigate(item.path);
    } else if (item.extension === 'exe') {
      handleLaunchBooster(item.name);
    }
  };

  const handleShelfToggle = () => {
    const selected = items.find(i => i.id === selectedId);
    if (!selected) return;

    if (shelfItems.find(i => i.id === selected.id)) {
      setShelfItems(prev => prev.filter(i => i.id !== selected.id));
    } else {
      setShelfItems(prev => [...prev, selected]);
    }
  };

  const handleLaunchBooster = (exeName: string = "Game.exe") => {
    setBoosterExeName(exeName);
    setBoosterActive(true);
  };

  const handleAiSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!aiQuery.trim()) return;

    setIsAiSearching(true);
    try {
      const response = await fetch('/api/ai/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: aiQuery, currentPath })
      });
      const matchedNames = await response.json();
      
      const filtered = items.filter(item => matchedNames.includes(item.name));
      setItems(filtered);
      setShowAiSearch(false);
      setAiQuery('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiSearching(false);
    }
  };

  // Gamepad integration
  useGamepad({
    onA: (index) => {
      // Action button A
      const active = document.activeElement;
      if (active && active.tagName === 'BUTTON') {
        (active as HTMLButtonElement).click();
      }
    },
    onB: () => {
      // Back button B
      handleNavigate('..');
    },
    onX: () => {
      // X button: Toggle shelf
      handleShelfToggle();
    },
    onY: () => {
      // Y button: Search
      setShowAiSearch(true);
    },
    onLB: () => {
      // LB: Cycle views or toggle grid/list
      setViewMode(prev => prev === 'grid' ? 'list' : prev === 'list' ? 'heatmap' : 'grid');
    },
    onRB: () => {
      // RB: Cycle views
      setViewMode(prev => prev === 'grid' ? 'heatmap' : prev === 'heatmap' ? 'list' : 'grid');
    }
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'x' || e.key === 'X') {
        handleShelfToggle();
      }
      if (e.key === 'y' || e.key === 'Y') {
        setShowAiSearch(true);
      }
      if (e.key === 'Tab' && e.shiftKey) {
        e.preventDefault();
        setIsGuideOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, items, shelfItems]);

  const selectedItem = items.find(item => item.id === selectedId) || null;

  // Determine dynamic ambient glow color based on selected item type
  const getAmbientColor = () => {
    if (!selectedItem) return '#3b82f6';
    if (selectedItem.extension === 'exe') return '#10b981'; // Green for games/apps
    if (['ini', 'json', 'yaml', 'xml', 'cfg'].includes(selectedItem.extension || '')) return '#8b5cf6'; // Purple for configs
    if (['jpg', 'png', 'webp', 'gif'].includes(selectedItem.extension || '')) return '#ec4899'; // Pink for media
    return '#3b82f6';
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-800 overflow-hidden font-sans selection:bg-blue-500/30 relative">
      {/* Dynamic Ambient Poster Glow (Disabled for clean light theme) */}
      {/* <AmbientCanvas color={getAmbientColor()} /> */}

      <Sidebar currentPath={currentPath} onNavigate={handleNavigate} />
      
      <main className="flex-1 flex flex-col min-w-0 z-10">
        <Toolbar 
          path={currentPath} 
          viewMode={viewMode} 
          onViewModeChange={setViewMode}
          onNavigate={handleNavigate}
          onRefresh={() => fetchFiles(currentPath)}
          onAiSearch={() => setShowAiSearch(true)}
        />
        
        <div className="flex-1 flex overflow-hidden">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex items-center justify-center"
              >
                <div className="relative w-12 h-12">
                  <div className="absolute inset-0 border-4 border-slate-200 rounded-full" />
                  <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin" />
                </div>
              </motion.div>
            ) : viewMode === 'heatmap' ? (
              <HeatmapView path={currentPath} />
            ) : (
              <motion.div 
                key="content"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex-1 flex flex-col min-w-0"
              >
                <FileView 
                  items={items} 
                  viewMode={viewMode} 
                  selectedId={selectedId}
                  onSelect={setSelectedId}
                  onOpen={handleOpen}
                />
              </motion.div>
            )}
          </AnimatePresence>
          
          {viewMode !== 'heatmap' && (
            <DetailPanel 
              selectedItem={selectedItem} 
              onLaunchBooster={(exeName) => handleLaunchBooster(exeName)}
            />
          )}
        </div>

        {/* Shelf Stack */}
        <Shelf 
          items={shelfItems} 
          onRemove={(id) => setShelfItems(prev => prev.filter(i => i.id !== id))}
          onClear={() => setShelfItems([])}
          onDrop={async () => {
            const isCloudPath = currentPath.startsWith('cloud://') || 
                                currentPath.startsWith('drive://') || 
                                currentPath.startsWith('photos://') || 
                                currentPath.startsWith('dropbox://') || 
                                currentPath.startsWith('onedrive://');
            
            if (isCloudPath) {
              setLoading(true);
              let cloudParentPath = "root";
              if (currentPath.startsWith('cloud://')) cloudParentPath = currentPath.replace('cloud://', '');
              else if (currentPath.startsWith('drive://')) cloudParentPath = 'drive';
              else if (currentPath.startsWith('photos://')) cloudParentPath = 'photos';
              else if (currentPath.startsWith('dropbox://')) cloudParentPath = 'dropbox';
              else if (currentPath.startsWith('onedrive://')) cloudParentPath = 'onedrive';

              for (const item of shelfItems) {
                try {
                  await fetch('/api/cloud/upload', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ localPath: item.path || item.id, cloudParentPath })
                  });
                } catch (err) {
                  console.error('Failed to upload', item.name, err);
                }
              }
              fetchFiles(currentPath);
            } else {
              alert(`Stacked ${shelfItems.length} items to ${currentPath}`);
            }
            setShelfItems([]);
          }}
        />
      </main>

      {/* Xbox Radial Guide HUD Overlay */}
      <RadialGuideHUD
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        shelfItems={shelfItems}
        onLaunchBooster={() => handleLaunchBooster()}
        boosterActive={boosterActive}
      />

      {/* Game Booster & Process Suspender Engine Modal */}
      <GameBoosterModal
        isOpen={!!boosterExeName}
        onClose={() => setBoosterExeName(null)}
        exeName={boosterExeName || "Game.exe"}
      />

      {/* AI Search Modal */}
      <AnimatePresence>
        {showAiSearch && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAiSearch(false)}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Semantic Discovery</h3>
                  <p className="text-xs text-slate-500">Ask Gemini to find exactly what you need.</p>
                </div>
                <button 
                  onClick={() => setShowAiSearch(false)}
                  className="ml-auto p-2 text-slate-500 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAiSearch} className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input 
                    autoFocus
                    ref={searchInputRef}
                    type="text"
                    value={aiQuery}
                    onChange={(e) => setAiQuery(e.target.value)}
                    placeholder="e.json files modified last tuesday..."
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-12 pr-4 py-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-600"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="btn-icon-a scale-75">A</div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Search</span>
                  </div>
                  <button 
                    disabled={isAiSearching}
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-6 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2"
                  >
                    {isAiSearching ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : <Sparkles className="w-4 h-4" />}
                    <span>{isAiSearching ? 'Analyzing...' : 'Ask Gemini'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

