import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronUp, 
  Search, 
  Grid, 
  List, 
  RefreshCcw,
  Clock,
  Wifi,
  Battery,
  PieChart,
  Sparkles
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { ViewMode } from '@/src/types';
import { useState, useEffect } from 'react';

interface ToolbarProps {
  path: string;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onNavigate: (path: string) => void;
  onRefresh: () => void;
  onAiSearch: () => void;
}

export function Toolbar({ path, viewMode, onViewModeChange, onNavigate, onRefresh, onAiSearch }: ToolbarProps) {
  const [time, setTime] = useState(new Date());
  const parts = path.split('/').filter(Boolean);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  
  return (
    <div className="h-20 border-b border-slate-200 bg-white/90 backdrop-blur-md flex items-center px-6 gap-6">
      <div className="flex items-center gap-2">
        <button tabIndex={0} className="p-2.5 text-slate-600 hover:bg-slate-200 rounded-xl">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button tabIndex={0} className="p-2.5 text-slate-600 hover:bg-slate-200 rounded-xl">
          <ChevronRight className="w-5 h-5" />
        </button>
        <button 
          tabIndex={0} 
          onClick={() => onNavigate('..')}
          className="p-2.5 text-slate-600 hover:bg-slate-200 rounded-xl group relative"
        >
          <ChevronUp className="w-5 h-5" />
          <div className="absolute -bottom-1 -right-1 btn-icon-b">B</div>
        </button>
      </div>

      <div className="flex-1 flex items-center bg-slate-100 border border-slate-200 rounded-xl px-4 py-2 gap-2">
        <div className="flex items-center text-sm font-medium text-slate-700 overflow-hidden whitespace-nowrap">
          <span className="hover:text-slate-900 cursor-pointer" onClick={() => onNavigate('.')}>Files</span>
          {parts.map((part, i) => (
            <div key={i} className="flex items-center">
              <ChevronRight className="w-4 h-4 mx-2 opacity-30" />
              <span className="hover:text-slate-900 cursor-pointer">{part}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-1 border-l border-slate-200 pl-4 relative">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-4 opacity-50">
          <div className="btn-icon-lb scale-75">LB</div>
          <div className="btn-icon-rb scale-75">RB</div>
        </div>
        <button 
          tabIndex={0}
          onClick={() => onViewModeChange('grid')}
          className={cn(
            "p-2.5 rounded-xl transition-all",
            viewMode === 'grid' ? "bg-blue-100 text-blue-700 shadow-inner" : "text-slate-500 hover:bg-slate-200"
          )}
        >
          <Grid className="w-5 h-5" />
        </button>
        <button 
          tabIndex={0}
          onClick={() => onViewModeChange('list')}
          className={cn(
            "p-2.5 rounded-xl transition-all",
            viewMode === 'list' ? "bg-blue-100 text-blue-700 shadow-inner" : "text-slate-500 hover:bg-slate-200"
          )}
        >
          <List className="w-5 h-5" />
        </button>
        <button 
          tabIndex={0}
          onClick={() => onViewModeChange('heatmap')}
          className={cn(
            "p-2.5 rounded-xl transition-all",
            viewMode === 'heatmap' ? "bg-blue-100 text-blue-700 shadow-inner" : "text-slate-500 hover:bg-slate-200"
          )}
        >
          <PieChart className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center gap-4">
        <button 
          tabIndex={0}
          onClick={onAiSearch}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-900/20"
        >
          <Sparkles className="w-4 h-4" />
          <span>AI SEARCH</span>
          <div className="btn-icon-y scale-75">Y</div>
        </button>

        <div className="h-8 w-px bg-slate-200 mx-2" />

        <div className="flex flex-col items-end">
          <span className="text-sm font-bold text-slate-900">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
            <Wifi className="w-3 h-3" />
            <Battery className="w-3 h-3" />
          </div>
        </div>
      </div>
    </div>
  );
}
