import { MindfulList, ThemeConfig, UserSettings } from '../types/mindfulist';

export const THEMES: ThemeConfig[] = [
  {
    id: 'sage',
    name: 'Salviagrön',
    borderColor: '#9CAD9E',
    bgTint: '#F3F5F1',
    chipColor: '#8C9E8E',
  },
  {
    id: 'terracotta',
    name: 'Varm lera',
    borderColor: '#BCA194',
    bgTint: '#F5F2F0',
    chipColor: '#B08E7F',
  },
  {
    id: 'rose',
    name: 'Dämpad rosa',
    borderColor: '#CB9499',
    bgTint: '#F6F1F2',
    chipColor: '#BE8187',
  },
  {
    id: 'moss',
    name: 'Skogsmossa',
    borderColor: '#7F9E87',
    bgTint: '#F1F4F1',
    chipColor: '#6B8C74',
  },
  {
    id: 'slate',
    name: 'Skiffergrå',
    borderColor: '#97A6B2',
    bgTint: '#F1F3F5',
    chipColor: '#7D8F9C',
  },
  {
    id: 'ochre',
    name: 'Varm ockra',
    borderColor: '#D1AF84',
    bgTint: '#F7F4EE',
    chipColor: '#C49E6F',
  },
];

export const INITIAL_SETTINGS: UserSettings = {
  name: 'Petra',
  email: 'petra@example.se',
  avatarSeed: 'P',
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
    title: 'Morgonrutin',
    category: 'routine',
    icon: 'home',
    date: '15 okt / 26',
    themeId: 'sage',
    isPrivate: true,
    isDailyRoutine: true,
    createdDate: '2026-10-15',
    items: [
      { id: 'm1', text: 'Mata katten', completed: false, hasTimer: true, durationMinutes: 5 },
      { id: 'm2', text: 'Äta frukost', completed: false, hasTimer: true, durationMinutes: 15 },
      { id: 'm3', text: 'Göra matsäck', completed: false, hasTimer: true, durationMinutes: 15 },
      { id: 'm4', text: 'Välja kläder', completed: false, hasTimer: true, durationMinutes: 5 },
      { id: 'm5', text: 'Meditera', completed: true, completedAt: '07:15', hasTimer: true, durationMinutes: 10 },
      { id: 'm6', text: 'Borsta tänderna', completed: true, completedAt: '07:30', hasTimer: true, durationMinutes: 3 },
      { id: 'm7', text: 'Ta en dusch', completed: true, completedAt: '07:45', hasTimer: true, durationMinutes: 12 },
      { id: 'm8', text: 'Gå ut med soporna', completed: true, completedAt: '08:00', hasTimer: true, durationMinutes: 4 },
    ],
  },
  {
    id: 'list-2',
    title: 'Skola',
    category: 'school',
    icon: 'school',
    date: '29 sep / 26',
    themeId: 'terracotta',
    isPrivate: true,
    isDailyRoutine: false,
    createdDate: '2026-09-29',
    items: [
      { id: 's1', text: 'Skriva klart rapporten', completed: false, hasTimer: true, durationMinutes: 45 },
      { id: 's2', text: 'Repetera föreläsningsanteckningar', completed: false, hasTimer: true, durationMinutes: 25 },
      { id: 's3', text: 'Söka praktikplats', completed: false, hasTimer: true, durationMinutes: 30 },
      { id: 's4', text: 'Kolla ItsLearning', completed: false, hasTimer: true, durationMinutes: 10 },
      { id: 's5', text: 'Läsa kapitel 4 i psykologiboken', completed: true, completedAt: 'Igår', hasTimer: true, durationMinutes: 40 },
    ],
  },
  {
    id: 'list-3',
    title: 'Jobb',
    category: 'work',
    icon: 'work',
    date: '12 okt / 26',
    themeId: 'rose',
    isPrivate: false,
    sharedWith: ['emma.nord@mindful.se'],
    isDailyRoutine: false,
    createdDate: '2026-10-12',
    items: [
      { id: 'w1', text: 'Boka möte', completed: false, hasTimer: true, durationMinutes: 15 },
      { id: 'w2', text: 'Förbereda presentation', completed: false, hasTimer: true, durationMinutes: 60 },
      { id: 'w3', text: 'Genomföra dataanalys', completed: false, hasTimer: true, durationMinutes: 45 },
      { id: 'w4', text: 'Skicka in rapport', completed: false, hasTimer: true, durationMinutes: 20 },
      { id: 'w5', text: 'Svara på brådskande Slack-trådar', completed: true, completedAt: '09:30', hasTimer: true, durationMinutes: 15 },
    ],
  },
];

export const ROUTINE_TEMPLATES = [
  {
    title: 'Morgonrutin',
    category: 'routine' as const,
    icon: 'home' as const,
    themeId: 'sage',
    description: 'Jordande vanor för att starta dagen med lugn klarhet och närvaro.',
    items: [
      'Drick ett stort glas ljummet vatten',
      '10 minuters medveten andning',
      'Mjuk morgonstretch eller yoga',
      'Lugn frukost utan skärm',
      'Välj ut dagens 3 prioriteringar',
    ],
  },
  {
    title: 'Fokuserat studiepass',
    category: 'school' as const,
    icon: 'school' as const,
    themeId: 'terracotta',
    description: 'Distraktionsfritt studieflöde med tidsintervaller och fokus.',
    items: [
      'Lägg mobilen i ett annat rum',
      'Repetera sammanfattningar & anteckningar',
      '45 minuter oavbruten djupstudie',
      'Lös övningsuppgifter',
      'Sammanfatta dagens viktigaste insikter',
    ],
  },
  {
    title: 'Kvällsrutin',
    category: 'routine' as const,
    icon: 'routine' as const,
    themeId: 'rose',
    description: 'Varva ner, släpp dagens intryck och förbered god sömn.',
    items: [
      'Plocka undan på skrivbordet',
      'Stäng av alla digitala skärmar',
      'Brygg en kopp varmt kamomillte',
      'Skriv 3 tacksamheter i anteckningsboken',
      'Dämpa belysningen i sovrummet',
    ],
  },
  {
    title: 'Söndagsåterhämtning',
    category: 'home' as const,
    icon: 'home' as const,
    themeId: 'moss',
    description: 'Vårda hemmet och skapa en harmonisk grund inför veckan.',
    items: [
      'Vädra rummet och byt sängkläder',
      'Gå igenom veckans kalender i lugn och ro',
      'Vattna krukväxter och blommor',
      'Förbered hälsosam mat för två dagar',
      'Avkopplande varmt bad eller te-stund',
    ],
  },
];

const LISTS_STORAGE_KEY = 'mindfulist_lists_v3_sv';
const SETTINGS_STORAGE_KEY = 'mindfulist_settings_v3_sv';

export function loadLists(): MindfulList[] {
  try {
    const raw = localStorage.getItem(LISTS_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Kunde inte läsa listor från localStorage', err);
  }
  return INITIAL_LISTS;
}

export function saveLists(lists: MindfulList[]) {
  try {
    localStorage.setItem(LISTS_STORAGE_KEY, JSON.stringify(lists));
  } catch (err) {
    console.error('Kunde inte spara listor till localStorage', err);
  }
}

export function loadSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Kunde inte läsa inställningar från localStorage', err);
  }
  return INITIAL_SETTINGS;
}

export function saveSettings(settings: UserSettings) {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error('Kunde inte spara inställningar till localStorage', err);
  }
}
