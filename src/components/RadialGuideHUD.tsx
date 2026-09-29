import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Volume2, 
  VolumeX, 
  Zap, 
  Cpu, 
  Activity, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Layers, 
  ShieldCheck,
  Thermometer,
  Gauge,
  Sliders
} from 'lucide-react';
import { HardwareTelemetry, FileNode } from '@/src/types';
import { cn } from '@/src/lib/utils';

interface RadialGuideHUDProps {
  isOpen: boolean;
  onClose: () => void;
  shelfItems: FileNode[];
  onLaunchBooster: () => void;
  boosterActive: boolean;
}

export function RadialGuideHUD({ 
  isOpen, 
  onClose, 
  shelfItems, 
  onLaunchBooster, 
  boosterActive 
}: RadialGuideHUDProps) {
  const [volume, setVolume] = useState(78);
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeTab, setActiveTab] = useState<'perf' | 'audio' | 'shelf' | 'system'>('perf');

  const [telemetry, setTelemetry] = useState<HardwareTelemetry>({
    gpuTemp: 58,
    gpuUsage: 64,
    vramUsedMB: 1420,
    cpuUsage: 19,
    ramUsedGB: 4.8,
    fps: 118,
    suspendedProcessesCount: boosterActive ? 14 : 0,
  });

  // Dynamic telemetry updates for real-time console feel
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setTelemetry(prev => ({
        gpuTemp: Math.min(80, Math.max(45, prev.gpuTemp + (Math.random() > 0.5 ? 1 : -1))),
        gpuUsage: Math.min(99, Math.max(30, prev.gpuUsage + Math.floor(Math.random() * 5 - 2))),
        vramUsedMB: Math.min(2048, Math.max(1200, prev.vramUsedMB + Math.floor(Math.random() * 30 - 15))),
        cpuUsage: Math.min(90, Math.max(10, prev.cpuUsage + Math.floor(Math.random() * 4 - 2))),
        ramUsedGB: parseFloat((4.5 + Math.random() * 0.4).toFixed(1)),
        fps: boosterActive ? 120 + Math.floor(Math.random() * 4) : 98 + Math.floor(Math.random() * 8),
        suspendedProcessesCount: boosterActive ? 14 : 0,
      }));
    }, 1500);

    return () => clearInterval(interval);
  }, [isOpen, boosterActive]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/50 backdrop-blur-md"
        />

        {/* Xbox Guide Radial Overlay Panel */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 30 }}
          className="relative w-full max-w-2xl bg-white/95 border border-slate-300 rounded-3xl shadow-2xl overflow-hidden p-6 text-slate-900"
        >
          {/* Top Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 shadow-lg shadow-emerald-500/10">
                <Gauge className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black tracking-wide uppercase">XBOX GUIDE HUD</h2>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                    LOW OVERHEAD SHELL
                  </span>
                </div>
                <p className="text-xs text-slate-600">NVIDIA MX450 GPU • Intel Core i7 • Low RAM Mode</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-300 text-slate-600 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick HUD Navigation Tabs */}
          <div className="flex items-center gap-2 mb-6 bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button
              onClick={() => setActiveTab('perf')}
              className={cn(
                "flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2",
                activeTab === 'perf' ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "text-slate-600 hover:text-white"
              )}
            >
              <Activity className="w-4 h-4" />
              <span>PERFORMANCE</span>
            </button>
            <button
              onClick={() => setActiveTab('audio')}
              className={cn(
                "flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2",
                activeTab === 'audio' ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "text-slate-600 hover:text-white"
              )}
            >
              <Volume2 className="w-4 h-4" />
              <span>MEDIA & AUDIO</span>
            </button>
            <button
              onClick={() => setActiveTab('shelf')}
              className={cn(
                "flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 relative",
                activeTab === 'shelf' ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "text-slate-600 hover:text-white"
              )}
            >
              <Layers className="w-4 h-4" />
              <span>STACK SHELF</span>
              {shelfItems.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-[10px] bg-emerald-500 text-slate-950 font-black rounded-full">
                  {shelfItems.length}
                </span>
              )}
            </button>
          </div>

          {/* Tab Content: Telemetry & Performance */}
          {activeTab === 'perf' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-slate-100 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs text-slate-600 font-bold mb-2">
                    <span>GPU TEMP</span>
                    <Thermometer className="w-4 h-4 text-rose-400" />
                  </div>
                  <div className="text-2xl font-black text-rose-400">{telemetry.gpuTemp}°C</div>
                  <div className="text-[10px] text-slate-500 mt-1">NVIDIA GeForce MX450</div>
                </div>

                <div className="bg-slate-100 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs text-slate-600 font-bold mb-2">
                    <span>VRAM USAGE</span>
                    <Cpu className="w-4 h-4 text-purple-700" />
                  </div>
                  <div className="text-2xl font-black text-purple-700">{telemetry.vramUsedMB} MB</div>
                  <div className="text-[10px] text-slate-500 mt-1">/ 2048 MB GDDR6</div>
                </div>

                <div className="bg-slate-100 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs text-slate-600 font-bold mb-2">
                    <span>SYSTEM RAM</span>
                    <Sliders className="w-4 h-4 text-blue-700" />
                  </div>
                  <div className="text-2xl font-black text-blue-700">{telemetry.ramUsedGB} GB</div>
                  <div className="text-[10px] text-slate-500 mt-1">Low Overhead Shell</div>
                </div>

                <div className="bg-slate-100 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs text-slate-600 font-bold mb-2">
                    <span>TARGET FPS</span>
                    <Zap className="w-4 h-4 text-emerald-700" />
                  </div>
                  <div className="text-2xl font-black text-emerald-700">{telemetry.fps} FPS</div>
                  <div className="text-[10px] text-slate-500 mt-1">VSync Synchronized</div>
                </div>
              </div>

              {/* Game Booster Banner in HUD */}
              <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-slate-900 border border-blue-200 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center text-white transition-all shadow-lg",
                    boosterActive ? "bg-emerald-600 shadow-emerald-600/30" : "bg-blue-600 shadow-blue-200"
                  )}>
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">
                      {boosterActive ? "Process Suspender Active" : "Game Booster Ready"}
                    </h4>
                    <p className="text-xs text-slate-600">
                      {boosterActive 
                        ? `${telemetry.suspendedProcessesCount} non-essential processes suspended to free MX450 VRAM.`
                        : "Automatically suspends explorer background tasks for ultra-low latency."}
                    </p>
                  </div>
                </div>

                <button
                  onClick={onLaunchBooster}
                  className={cn(
                    "px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 active:scale-95 shadow-md",
                    boosterActive 
                      ? "bg-emerald-500 text-slate-950 hover:bg-emerald-400" 
                      : "bg-blue-600 text-white hover:bg-blue-500"
                  )}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{boosterActive ? "OPTIMIZED" : "BOOST NOW"}</span>
                </button>
              </div>
            </div>
          )}

          {/* Tab Content: Audio & Media */}
          {activeTab === 'audio' && (
            <div className="space-y-6">
              <div className="bg-slate-100 border border-slate-200 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">System Master Volume</span>
                  <span className="text-sm font-black text-blue-700">{volume}%</span>
                </div>
                <div className="flex items-center gap-4">
                  {volume === 0 ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5 text-blue-700" />}
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="flex-1 accent-blue-500 h-2 bg-slate-200 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              {/* Background Music / Game Soundtrack Player */}
              <div className="bg-slate-100 border border-slate-200 rounded-2xl p-5 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold text-blue-700 uppercase tracking-widest">Background Player</div>
                  <div className="text-sm font-bold text-slate-900">Synthwave Console Ambience (Lo-Fi)</div>
                  <div className="text-xs text-slate-500">Track 04 • Xbox Mode Audio Engine</div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="p-3 rounded-xl bg-slate-100 hover:bg-slate-300 text-slate-700">
                    <SkipBack className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-200"
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                  </button>
                  <button className="p-3 rounded-xl bg-slate-100 hover:bg-slate-300 text-slate-700">
                    <SkipForward className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content: Stack Shelf */}
          {activeTab === 'shelf' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Staged Files in Memory ({shelfItems.length})</span>
                <span>Press (A) on Explorer to Drop</span>
              </div>

              {shelfItems.length === 0 ? (
                <div className="p-8 text-center text-slate-500 border border-dashed border-slate-200 rounded-2xl">
                  No files stacked on the shelf yet. Press (X) on any file to throw it onto your stack!
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto custom-scrollbar pr-1">
                  {shelfItems.map(item => (
                    <div key={item.id} className="bg-slate-100 border border-slate-200 p-3 rounded-xl flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs uppercase">
                        {item.extension || 'FILE'}
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-bold text-slate-800 truncate">{item.name}</div>
                        <div className="text-[10px] text-slate-500 truncate">{item.path}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Controller Quick Key Guide */}
          <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-600">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="btn-icon-a scale-75">A</div>
                <span>Select</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="btn-icon-b scale-75">B</div>
                <span>Close HUD</span>
              </div>
            </div>
            <span className="font-mono text-slate-500 text-[10px]">SHELL VER: 2.4.0-XBOX-HW</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
