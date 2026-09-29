import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Save, CloudUpload, History, CheckCircle2, FolderDown, RotateCcw, Plus, Sparkles } from 'lucide-react';
import { GameSaveSnapshot } from '@/src/types';
import { formatFileSize } from '@/src/lib/utils';

interface GameSaveManagerProps {
  gameName?: string;
}

export function GameSaveManager({ gameName = "Cyberpunk 2077" }: GameSaveManagerProps) {
  const [snapshots, setSnapshots] = useState<GameSaveSnapshot[]>([
    {
      id: 'snap-1',
      gameName: gameName,
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
      size: 14200000,
      cloudSynced: true,
      savePath: '%AppData%/Local/CD Projekt Red/SavedGames/Save004'
    },
    {
      id: 'snap-2',
      gameName: gameName,
      timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
      size: 13900000,
      cloudSynced: true,
      savePath: '%AppData%/Local/CD Projekt Red/SavedGames/Save003'
    },
    {
      id: 'snap-3',
      gameName: gameName,
      timestamp: new Date(Date.now() - 3600000 * 72).toISOString(),
      size: 12500000,
      cloudSynced: false,
      savePath: '%AppData%/Local/CD Projekt Red/SavedGames/Save001'
    }
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleCreateSnapshot = () => {
    setIsCreating(true);
    setTimeout(() => {
      const newSnap: GameSaveSnapshot = {
        id: `snap-${Date.now()}`,
        gameName: gameName,
        timestamp: new Date().toISOString(),
        size: Math.floor(14000000 + Math.random() * 500000),
        cloudSynced: true,
        savePath: `%AppData%/Local/SavedGames/AutoSave_${Date.now().toString().slice(-4)}`
      };
      setSnapshots(prev => [newSnap, ...prev]);
      setIsCreating(false);
      setSuccessMsg('Save snapshot created & synced to Cloud Nexus!');
      setTimeout(() => setSuccessMsg(''), 3000);
    }, 1200);
  };

  const handleRollback = (id: string) => {
    setSuccessMsg('Restored save state successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-600/20 border border-emerald-200 flex items-center justify-center text-emerald-700">
            <Save className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-sm text-slate-900">Smart Save Vault</h4>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                CLOUD SYNCED
              </span>
            </div>
            <p className="text-[11px] text-slate-600">Auto-versioning for {gameName}</p>
          </div>
        </div>

        <button
          onClick={handleCreateSnapshot}
          disabled={isCreating}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-lg shadow-emerald-200 active:scale-95"
        >
          {isCreating ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          <span>NEW SNAPSHOT</span>
        </button>
      </div>

      {successMsg && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-500/10 border border-emerald-200 p-2.5 rounded-xl text-xs font-semibold text-emerald-700 flex items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>{successMsg}</span>
        </motion.div>
      )}

      {/* Snapshots List */}
      <div className="space-y-2 max-h-[260px] overflow-y-auto custom-scrollbar pr-1">
        {snapshots.map(snap => (
          <div
            key={snap.id}
            className="bg-slate-100 border border-slate-200 rounded-xl p-3 flex items-center justify-between gap-3 hover:border-slate-200 transition-all"
          >
            <div className="flex items-center gap-3 truncate">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                <History className="w-4 h-4" />
              </div>
              <div className="truncate">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
                  <span>{new Date(snap.timestamp).toLocaleString()}</span>
                  {snap.cloudSynced && (
                    <span className="px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 text-[9px] font-bold">
                      CLOUD
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-slate-500 truncate">{snap.savePath}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[11px] font-mono text-slate-600">{formatFileSize(snap.size)}</span>
              <button
                onClick={() => handleRollback(snap.id)}
                className="p-2 rounded-lg bg-slate-100 hover:bg-slate-300 text-slate-700 hover:text-emerald-700 transition-colors"
                title="Rollback to this save state"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="text-[10px] text-slate-500 flex items-center gap-1.5 pt-2 border-t border-slate-200">
        <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
        <span>Protects save files against corruption or uninstalled game updates.</span>
      </div>
    </div>
  );
}
