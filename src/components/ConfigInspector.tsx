import { useState } from 'react';
import { motion } from 'motion/react';
import { Sliders, Save, RefreshCw, Check, Sparkles } from 'lucide-react';
import { ConfigSetting } from '@/src/types';

interface ConfigInspectorProps {
  fileName: string;
  filePath: string;
  onSave?: (settings: Record<string, any>) => void;
}

export function ConfigInspector({ fileName }: ConfigInspectorProps) {
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [settings, setSettings] = useState<ConfigSetting[]>([
    { key: 'Target_FPS_Cap', value: 120, type: 'number', min: 30, max: 240, step: 15, section: 'Graphics Engine' },
    { key: 'Resolution_Scale', value: 100, type: 'number', min: 50, max: 200, step: 5, section: 'Graphics Engine' },
    { key: 'VSync_Mode', value: true, type: 'boolean', section: 'Display' },
    { key: 'FOV_Field_Of_View', value: 95, type: 'number', min: 70, max: 120, step: 1, section: 'Camera & View' },
    { key: 'Shadow_Quality', value: 'High', type: 'select', options: ['Low', 'Medium', 'High', 'Ultra'], section: 'Graphics Engine' },
    { key: 'Nvidia_Reflex_Low_Latency', value: true, type: 'boolean', section: 'Performance (MX450)' },
    { key: 'Texture_Filtering', value: '16x Anisotropic', type: 'select', options: ['Off', '4x', '8x', '16x Anisotropic'], section: 'Graphics Engine' },
    { key: 'Master_Volume', value: 90, type: 'number', min: 0, max: 100, step: 5, section: 'Audio & Haptics' },
    { key: 'Controller_Vibration', value: true, type: 'boolean', section: 'Audio & Haptics' },
  ]);

  const handleChange = (key: string, newValue: any) => {
    setSettings(prev => prev.map(s => s.key === key ? { ...s, value: newValue } : s));
  };

  const handleSaveConfig = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const sections = Array.from(new Set(settings.map(s => s.section || 'General')));

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-200 flex items-center justify-center text-purple-700">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-sm text-slate-900">Config & Patch Tweaker</h4>
              <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-700 text-[10px] font-bold">
                VISUAL INSPECTOR
              </span>
            </div>
            <p className="text-[11px] text-slate-600 truncate max-w-[240px]">{fileName}</p>
          </div>
        </div>

        <button
          onClick={handleSaveConfig}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-lg shadow-purple-600/20 active:scale-95"
        >
          {savedSuccess ? <Check className="w-4 h-4 text-emerald-700" /> : <Save className="w-4 h-4" />}
          <span>{savedSuccess ? 'PATCH SAVED!' : 'APPLY PATCH'}</span>
        </button>
      </div>

      {/* Grouped Settings */}
      <div className="space-y-4 max-h-[380px] overflow-y-auto custom-scrollbar pr-1">
        {sections.map(section => (
          <div key={section} className="space-y-2">
            <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest pl-1">
              {section}
            </div>
            <div className="space-y-2">
              {settings.filter(s => (s.section || 'General') === section).map(setting => (
                <div 
                  key={setting.key} 
                  className="bg-slate-100 border border-slate-200 rounded-xl p-3 flex items-center justify-between gap-4 hover:border-slate-200 transition-all"
                >
                  <div className="truncate">
                    <div className="text-xs font-semibold text-slate-800 truncate">{setting.key.replace(/_/g, ' ')}</div>
                    <div className="text-[10px] text-slate-500">Value: {String(setting.value)}</div>
                  </div>

                  {/* Input Controls */}
                  <div className="flex items-center gap-3 min-w-[140px] justify-end">
                    {setting.type === 'boolean' && (
                      <button
                        onClick={() => handleChange(setting.key, !setting.value)}
                        className={`w-12 h-6 rounded-full transition-colors relative ${
                          setting.value ? 'bg-purple-600' : 'bg-slate-700'
                        }`}
                      >
                        <motion.div
                          layout
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          className={`w-4 h-4 rounded-full bg-white absolute top-1 ${
                            setting.value ? 'right-1' : 'left-1'
                          }`}
                        />
                      </button>
                    )}

                    {setting.type === 'number' && (
                      <div className="flex items-center gap-2 w-full">
                        <input
                          type="range"
                          min={setting.min}
                          max={setting.max}
                          step={setting.step}
                          value={Number(setting.value)}
                          onChange={(e) => handleChange(setting.key, Number(e.target.value))}
                          className="w-24 accent-purple-500 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                        />
                        <span className="text-xs font-bold text-purple-700 font-mono w-8 text-right">
                          {String(setting.value)}
                        </span>
                      </div>
                    )}

                    {setting.type === 'select' && (
                      <select
                        value={String(setting.value)}
                        onChange={(e) => handleChange(setting.key, e.target.value)}
                        className="bg-slate-800 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-purple-500"
                      >
                        {setting.options?.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="text-[10px] text-slate-500 flex items-center gap-1.5 pt-2 border-t border-slate-200">
        <Sparkles className="w-3.5 h-3.5 text-purple-700" />
        <span>Changes automatically validate syntax before applying to disk.</span>
      </div>
    </div>
  );
}
