import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, ShieldCheck, CheckCircle2, Cpu, Activity, X } from 'lucide-react';

interface GameBoosterModalProps {
  isOpen: boolean;
  onClose: () => void;
  exeName?: string;
}

export function GameBoosterModal({ isOpen, onClose, exeName = "Game.exe" }: GameBoosterModalProps) {
  const [step, setStep] = useState<number>(0);

  const suspendedServices = [
    { name: 'SysMain (Superfetch)', status: 'Suspended', ramFreed: '240 MB' },
    { name: 'Windows Search Indexer', status: 'Paused', ramFreed: '180 MB' },
    { name: 'Microsoft Edge Update', status: 'Suspended', ramFreed: '95 MB' },
    { name: 'Telemetry & Error Reporting', status: 'Low Priority', ramFreed: '110 MB' },
    { name: 'Background OneDrive Sync', status: 'Paused', ramFreed: '320 MB' },
  ];

  useEffect(() => {
    if (!isOpen) {
      setStep(0);
      return;
    }

    const t1 = setTimeout(() => setStep(1), 600);
    const t2 = setTimeout(() => setStep(2), 1500);
    const t3 = setTimeout(() => setStep(3), 2400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
        />

        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 20 }}
          className="relative w-full max-w-lg bg-white border border-blue-200 rounded-3xl shadow-2xl p-6 text-slate-900 overflow-hidden"
        >
          {/* Glowing Top Bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400" />

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700">
                <Zap className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <h3 className="text-lg font-black tracking-wide uppercase">PROCESS SUSPENDER ENGINE</h3>
                <p className="text-xs text-slate-600">Optimizing for {exeName}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-300 text-slate-600 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Status Progress */}
          <div className="space-y-4 mb-6">
            <div className="bg-slate-100 border border-slate-200 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-700">MX450 VRAM Pipeline Optimization</span>
                <span className="text-emerald-700 font-mono">
                  {step === 0 && '0%'}
                  {step === 1 && '40%'}
                  {step === 2 && '85%'}
                  {step >= 3 && '100% READY'}
                </span>
              </div>

              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <motion.div
                  className="bg-gradient-to-r from-blue-500 to-emerald-400 h-full rounded-full"
                  animate={{
                    width: step === 0 ? '0%' : step === 1 ? '40%' : step === 2 ? '85%' : '100%'
                  }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            </div>

            {/* Suspended Services List */}
            <div className="space-y-2">
              <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest pl-1">
                Background Windows Services Tuning
              </div>
              <div className="space-y-1.5 max-h-40 overflow-y-auto custom-scrollbar">
                {suspendedServices.map((srv, idx) => (
                  <div
                    key={srv.name}
                    className="bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      {step > idx ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-white/20 border-t-blue-400 animate-spin" />
                      )}
                      <span className="text-slate-800 font-semibold">{srv.name}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-mono font-bold">
                        +{srv.ramFreed} RAM
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>945 MB VRAM & RAM Reclaimed</span>
            </div>

            <button
              onClick={onClose}
              disabled={step < 3}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-200 flex items-center gap-2"
            >
              <Activity className="w-4 h-4" />
              <span>{step < 3 ? 'SUSPENDING...' : 'LAUNCH GAME'}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
