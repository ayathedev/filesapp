import { 
  Home, 
  Monitor, 
  Download, 
  Image as ImageIcon, 
  Music, 
  Video, 
  Clock, 
  Star,
  HardDrive,
  Cloud,
  FolderGit2,
  Box,
  CloudSun
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

const NAV_ITEMS = [
  { icon: Clock, label: 'Recent', path: 'recent' },
  { icon: Star, label: 'Favorites', path: 'favorites' },
  { icon: Home, label: 'Home', path: '.' },
  { separator: true },
  { icon: Monitor, label: 'Desktop', path: 'Desktop' },
  { icon: Download, label: 'Downloads', path: 'Downloads' },
  { icon: ImageIcon, label: 'Pictures', path: 'Pictures' },
  { icon: Music, label: 'Music', path: 'Music' },
  { icon: Video, label: 'Videos', path: 'Videos' },
  { separator: true },
  { icon: HardDrive, label: 'Local Disk (C:)', path: '.' },
  { separator: true },
  { icon: Cloud, label: 'Cloud Nexus', path: 'cloud://root' },
  { icon: FolderGit2, label: 'Google Drive', path: 'drive://root' },
  { icon: ImageIcon, label: 'Google Photos', path: 'photos://root' },
  { icon: Box, label: 'Dropbox', path: 'dropbox://root' },
  { icon: CloudSun, label: 'OneDrive', path: 'onedrive://root' },
];

export function Sidebar({ currentPath, onNavigate }: SidebarProps) {
  return (
    <aside className="w-64 bg-white backdrop-blur-xl border-r border-slate-200 flex flex-col p-4 gap-2">
      <div className="flex items-center gap-3 px-3 py-4 mb-4">
        <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-200">
          <HardDrive className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="font-bold text-slate-900 tracking-tight block leading-tight">Xbox Files</span>
          <span className="text-[10px] text-emerald-700 font-medium tracking-wide block">by aya the being</span>
        </div>
      </div>

      <nav className="flex-1 flex flex-col gap-1">
        {NAV_ITEMS.map((item, idx) => {
          if (item.separator) {
            return <div key={`sep-${idx}`} className="h-px bg-slate-100 my-2 mx-3" />;
          }

          const Icon = item.icon!;
          const isActive = currentPath === item.path;

          return (
            <button
              key={item.label}
              tabIndex={0}
              onClick={() => onNavigate(item.path!)}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group text-left relative",
                "focus:outline-none focus:bg-slate-200",
                isActive 
                  ? "bg-blue-100 text-blue-700 font-medium border border-blue-200" 
                  : "text-slate-600 hover:bg-slate-200 hover:text-slate-800"
              )}
            >
              <Icon className={cn(
                "w-4 h-4 transition-transform group-hover:scale-110",
                isActive ? "text-blue-700" : "text-slate-500 group-hover:text-slate-700"
              )} />
              <span className="text-sm flex-1">{item.label}</span>
              <div className="btn-icon-a opacity-0 group-focus:opacity-100 transition-opacity scale-75">A</div>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto p-3 bg-slate-100 rounded-xl border border-slate-200">
        <div className="flex justify-between text-xs text-slate-600 mb-2">
          <span>Storage</span>
          <span>72% used</span>
        </div>
        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 w-[72%] shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
        </div>
      </div>
    </aside>
  );
}
