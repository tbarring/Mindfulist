import { MindfulList, ThemeConfig, UserSettings } from '../types/mindfulist';

export const THEMES: ThemeConfig[] = [
  {
    id: 'sage',
    name: 'Sage Green',
    borderColor: '#9CAD9E',
    bgTint: '#F3F5F1',
    chipColor: '#8C9E8E',
  },
  {
    id: 'terracotta',
    name: 'Warm Clay',
    borderColor: '#BCA194',
    bgTint: '#F5F2F0',
    chipColor: '#B08E7F',
  },
  {
    id: 'rose',
    name: 'Dusty Rose',
    borderColor: '#CB9499',
    bgTint: '#F6F1F2',
    chipColor: '#BE8187',
  },
  {
    id: 'moss',
    name: 'Forest Moss',
    borderColor: '#7F9E87',
    bgTint: '#F1F4F1',
    chipColor: '#6B8C74',
  },
  {
    id: 'slate',
    name: 'River Slate',
    borderColor: '#97A6B2',
    bgTint: '#F1F3F5',
    chipColor: '#7D8F9C',
  },
  {
    id: 'ochre',
    name: 'Warm Ochre',
    borderColor: '#D1AF84',
    bgTint: '#F7F4EE',
    chipColor: '#C49E6F',
  },
];

export const INITIAL_SETTINGS: UserSettings = {
  name: 'Tiffany Barrington',
  email: 'tiffany.n.barrington@gmail.com',
  avatarSeed: 'TB',
  soundEnabled: true,
  soundType: 'singing-bowl',
  autoResetRoutines: true,
  autoResetTime: '04:00',
  defaultTimerMinutes: 15,
  canvasTint: 'sage',
  compactMode: false,
  streakDays: 14,
};

export const INITIAL_LISTS: MindfulList[] = [
  {
    id: 'list-1',
    title: 'Morning routine',
    category: 'routine',
    icon: 'home',
    date: 'Oct 15/26',
    themeId: 'sage',
    isPrivate: true,
    isDailyRoutine: true,
    createdDate: '2026-10-15',
    items: [
      { id: 'm1', text: 'Feed the cat', completed: false, hasTimer: true, durationMinutes: 5 },
      { id: 'm2', text: 'Eat breakfast', completed: false, hasTimer: true, durationMinutes: 15 },
      { id: 'm3', text: 'Make a lunch', completed: false, hasTimer: true, durationMinutes: 15 },
      { id: 'm4', text: 'Decide what to wear', completed: false, hasTimer: true, durationMinutes: 5 },
      { id: 'm5', text: 'Meditate', completed: true, completedAt: '07:15', hasTimer: true, durationMinutes: 10 },
      { id: 'm6', text: 'Brush teeth', completed: true, completedAt: '07:30', hasTimer: true, durationMinutes: 3 },
      { id: 'm7', text: 'Take a shower', completed: true, completedAt: '07:45', hasTimer: true, durationMinutes: 12 },
      { id: 'm8', text: 'Take garbage out', completed: true, completedAt: '08:00', hasTimer: true, durationMinutes: 4 },
    ],
  },
  {
    id: 'list-2',
    title: 'School',
    category: 'school',
    icon: 'school',
    date: 'Sept 29/26',
    themeId: 'terracotta',
    isPrivate: true,
    isDailyRoutine: false,
    createdDate: '2026-09-29',
    items: [
      { id: 's1', text: 'Finish report', completed: false, hasTimer: true, durationMinutes: 45 },
      { id: 's2', text: 'Review class notes', completed: false, hasTimer: true, durationMinutes: 25 },
      { id: 's3', text: 'Apply for internship', completed: false, hasTimer: true, durationMinutes: 30 },
      { id: 's4', text: 'Check ItsLearning', completed: false, hasTimer: true, durationMinutes: 10 },
      { id: 's5', text: 'Read chapter 4 psychology', completed: true, completedAt: 'Yesterday', hasTimer: true, durationMinutes: 40 },
    ],
  },
  {
    id: 'list-3',
    title: 'Work',
    category: 'work',
    icon: 'work',
    date: 'Oct 12/26',
    themeId: 'rose',
    isPrivate: false,
    sharedWith: ['emma.nord@mindful.se'],
    isDailyRoutine: false,
    createdDate: '2026-10-12',
    items: [
      { id: 'w1', text: 'Schedule meeting', completed: false, hasTimer: true, durationMinutes: 15 },
      { id: 'w2', text: 'Prepare presentation', completed: false, hasTimer: true, durationMinutes: 60 },
      { id: 'w3', text: 'Complete data analysis', completed: false, hasTimer: true, durationMinutes: 45 },
      { id: 'w4', text: 'Submit report', completed: false, hasTimer: true, durationMinutes: 20 },
      { id: 'w5', text: 'Respond to urgent Slack threads', completed: true, completedAt: '09:30', hasTimer: true, durationMinutes: 15 },
    ],
  },
];

export const ROUTINE_TEMPLATES = [
  {
    title: 'Morning Routine',
    category: 'routine' as const,
    icon: 'home' as const,
    themeId: 'sage',
    description: 'Grounding habits to begin your day with calm clarity.',
    items: ['Hydrate with warm lemon water', '10 min mindful breathing', 'Gentle morning stretch', 'Wholesome breakfast', 'Plan top 3 intentions'],
  },
  {
    title: 'Deep Study Block',
    category: 'school' as const,
    icon: 'school' as const,
    themeId: 'terracotta',
    description: 'Distraction-free academic flow session with timed intervals.',
    items: ['Set phone in another room', 'Review summary flashcards', '45 min uninterrupted reading', 'Solve practice problem set', 'Synthesize key takeaways'],
  },
  {
    title: 'Evening Wind-Down',
    category: 'routine' as const,
    icon: 'routine' as const,
    themeId: 'rose',
    description: 'Decompress, release screen tension, and rest deeply.',
    items: ['Tidy desk and workspace', 'Put away digital devices', 'Brew herbal chamomile tea', 'Gratitude journal entry', 'Dim bedroom lighting'],
  },
  {
    title: 'Sunday Mindful Reset',
    category: 'home' as const,
    icon: 'home' as const,
    themeId: 'moss',
    description: 'Nurture your home space and prepare for a peaceful week ahead.',
    items: ['Clean bedding and ventilate room', 'Check week calendar and appointments', 'Water plants & fresh flowers', 'Prep healthy meals for 2 days', 'Soothing warm bath'],
  },
];

const LISTS_STORAGE_KEY = 'mindfulist_lists_v2';
const SETTINGS_STORAGE_KEY = 'mindfulist_settings_v1';

export function loadLists(): MindfulList[] {
  try {
    const raw = localStorage.getItem(LISTS_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
    // Check v1 and strip default routine table
    const v1Raw = localStorage.getItem('mindfulist_lists_v1');
    if (v1Raw) {
      const parsed: MindfulList[] = JSON.parse(v1Raw);
      const cleaned = parsed.map((l) => ({ ...l, table: undefined }));
      localStorage.setItem(LISTS_STORAGE_KEY, JSON.stringify(cleaned));
      return cleaned;
    }
  } catch (err) {
    console.error('Error loading lists from localStorage', err);
  }
  return INITIAL_LISTS;
}

export function saveLists(lists: MindfulList[]) {
  try {
    localStorage.setItem(LISTS_STORAGE_KEY, JSON.stringify(lists));
  } catch (err) {
    console.error('Error saving lists to localStorage', err);
  }
}

export function loadSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error loading settings from localStorage', err);
  }
  return INITIAL_SETTINGS;
}

export function saveSettings(settings: UserSettings) {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error('Error saving settings to localStorage', err);
  }
}
