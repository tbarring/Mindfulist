export type ListCategory = 'home' | 'school' | 'work' | 'routine' | 'health' | 'creative';

export interface TaskItem {
  id: string;
  text: string;
  completed: boolean;
  completedAt?: string;
  hasTimer?: boolean;
  durationMinutes?: number;
}

export interface TableRow {
  id: string;
  cells: string[];
  done: boolean;
}

export interface RoutineTable {
  headers: string[];
  rows: TableRow[];
}

export interface ThemeConfig {
  id: string;
  name: string;
  borderColor: string;
  bgTint: string;
  chipColor: string;
}

export type ListIcon =
  | 'home'
  | 'school'
  | 'work'
  | 'routine'
  | 'health'
  | 'creative'
  | 'sun'
  | 'moon'
  | 'heart'
  | 'book'
  | 'dumbbell'
  | 'sparkles';

export interface MindfulList {
  id: string;
  title: string;
  category: ListCategory;
  icon: ListIcon;
  date: string;
  themeId: string;
  isPrivate: boolean;
  sharedWith?: string[];
  isDailyRoutine?: boolean;
  items: TaskItem[];
  table?: RoutineTable;
  createdDate: string;
}

export interface UserSettings {
  name: string;
  email: string;
  avatarSeed: string;
  soundEnabled: boolean;
  soundType: 'singing-bowl' | 'soft-chime' | 'bamboo-wood' | 'silent';
  autoResetRoutines: boolean;
  autoResetTime: string;
  defaultTimerMinutes: number;
  canvasTint: 'sage' | 'stone' | 'linen' | 'lavender';
  compactMode: boolean;
  streakDays: number;
}
