import { 
  File, 
  Folder, 
  FileText, 
  Image as ImageIcon, 
  Music, 
  Video, 
  Archive, 
  Code,
  FileJson,
  Terminal,
  Settings,
  HelpCircle
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface FileIconProps {
  type: 'file' | 'directory';
  extension?: string;
  className?: string;
}

export function FileIcon({ type, extension, className }: FileIconProps) {
  if (type === 'directory') {
    return <Folder className={cn("text-blue-700 fill-blue-400/20", className)} />;
  }

  const ext = extension?.toLowerCase();

  switch (ext) {
    case 'txt':
    case 'md':
      return <FileText className={cn("text-slate-700", className)} />;
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'svg':
    case 'webp':
      return <ImageIcon className={cn("text-emerald-700", className)} />;
    case 'mp3':
    case 'wav':
    case 'flac':
      return <Music className={cn("text-purple-700", className)} />;
    case 'mp4':
    case 'mov':
    case 'avi':
      return <Video className={cn("text-rose-400", className)} />;
    case 'zip':
    case 'rar':
    case '7z':
    case 'tar':
    case 'gz':
      return <Archive className={cn("text-amber-400", className)} />;
    case 'js':
    case 'ts':
    case 'tsx':
    case 'jsx':
    case 'html':
    case 'css':
      return <Code className={cn("text-sky-400", className)} />;
    case 'json':
      return <FileJson className={cn("text-yellow-400", className)} />;
    case 'sh':
    case 'bat':
    case 'exe':
      return <Terminal className={cn("text-red-400", className)} />;
    case 'config':
    case 'env':
      return <Settings className={cn("text-slate-500", className)} />;
    default:
      return <File className={cn("text-slate-600", className)} />;
  }
}
