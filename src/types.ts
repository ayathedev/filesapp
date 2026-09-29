export interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'directory';
  size?: number;
  lastModified: string;
  extension?: string;
  path: string;
  dominantColor?: string;
  bannerUrl?: string;
  isExecutable?: boolean;
}

export interface Breadcrumb {
  name: string;
  path: string;
}

export type ViewMode = 'grid' | 'list' | 'heatmap';

export interface GameSaveSnapshot {
  id: string;
  gameName: string;
  timestamp: string;
  size: number;
  cloudSynced: boolean;
  savePath: string;
}

export interface ConfigSetting {
  key: string;
  value: string | number | boolean;
  type: 'boolean' | 'number' | 'string' | 'select';
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
  section?: string;
}

export interface HardwareTelemetry {
  gpuTemp: number; // e.g. 58°C MX450
  gpuUsage: number; // e.g. 74%
  vramUsedMB: number; // e.g. 1840 / 2048 MB
  cpuUsage: number; // e.g. 18%
  ramUsedGB: number; // e.g. 5.2 / 16 GB
  fps: number; // e.g. 120
  suspendedProcessesCount: number;
}

export interface FileSystemState {
  currentPath: string;
  items: FileNode[];
  selectedId: string | null;
  viewMode: ViewMode;
  loading: boolean;
  error: string | null;
  shelfItems: FileNode[];
  semanticQuery: string;
  isAiSearching: boolean;
}

