import React, { useState } from 'react';
import {
  ChevronLeft,
  Check,
  Plus,
  Trash2,
  Clock,
  Sparkles,
  Lock,
  Users,
  Calendar,
  Layers,
  ArrowRight,
  X,
} from 'lucide-react';
import { MindfulList, ListCategory, TaskItem, ListIcon } from '../types/mindfulist';
import { THEMES, ROUTINE_TEMPLATES } from '../utils/storage';
import { CategoryIcon } from './CategoryIcon';
import { MindfulistLogo } from './MindfulistLogo';
import { playZenChime } from '../utils/audio';

interface CreateListScreenProps {
  onBack: () => void;
  onCreateList: (newList: MindfulList) => void;
}

const CATEGORIES: { id: ListCategory; label: string; icon: ListIcon }[] = [
  { id: 'routine', label: 'Rutin', icon: 'sun' },
  { id: 'home', label: 'Hemma', icon: 'home' },
  { id: 'school', label: 'Skola', icon: 'school' },
  { id: 'work', label: 'Jobb', icon: 'work' },
  { id: 'health', label: 'Hälsa', icon: 'heart' },
  { id: 'creative', label: 'Kreativt', icon: 'sparkles' },
];

const ICONS: ListIcon[] = ['home', 'school', 'work', 'sun', 'moon', 'heart', 'book', 'dumbbell', 'sparkles'];

export const CreateListScreen: React.FC<CreateListScreenProps> = ({
  onBack,
  onCreateList,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ListCategory>('routine');
  const [selectedIcon, setSelectedIcon] = useState<ListIcon>('sun');
  const [themeId, setThemeId] = useState('sage');
  const [isPrivate, setIsPrivate] = useState(true);
  const [isDailyRoutine, setIsDailyRoutine] = useState(true);
  const [includeTable, setIncludeTable] = useState(false);
  const [dateStr, setDateStr] = useState('30 okt / 26');

  // Initial task items list in Swedish
  const [tasks, setTasks] = useState<string[]>([
    '5 minuters lugn andning',
    'Drick ett stort glas vatten eller te',
    'Sätt dagens 3 prioriteringar',
  ]);
  const [taskInput, setTaskInput] = useState('');

  const currentTheme = THEMES.find((t) => t.id === themeId) || THEMES[0];

  const handleApplyTemplate = (template: typeof ROUTINE_TEMPLATES[0]) => {
    setTitle(template.title);
    setCategory(template.category);
    setSelectedIcon(template.icon as ListIcon);
    setThemeId(template.themeId);
    setTasks([...template.items]);
    setIsDailyRoutine(true);
    playZenChime('soft-chime');
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskInput.trim()) return;
    setTasks([...tasks, taskInput.trim()]);
    setTaskInput('');
  };

  const handleRemoveTask = (index: number) => {
    setTasks(tasks.filter((_, idx) => idx !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    playZenChime('singing-bowl');

    const createdItems: TaskItem[] = tasks.map((t, idx) => ({
      id: `task-${Date.now()}-${idx}`,
      text: t,
      completed: false,
      hasTimer: true,
      durationMinutes: 15,
    }));

    const newList: MindfulList = {
      id: `list-${Date.now()}`,
      title: title.trim(),
      category,
      icon: selectedIcon,
      date: dateStr,
      themeId,
      isPrivate,
      isDailyRoutine,
      createdDate: new Date().toISOString().split('T')[0],
      items: createdItems,
      table: includeTable
        ? {
            headers: ['Uppgift / Steg', 'Detaljer', 'Anteckningar'],
            rows: [
              { id: `r-${Date.now()}-1`, cells: ['', '', ''], done: false },
              { id: `r-${Date.now()}-2`, cells: ['', '', ''], done: false },
            ],
          }
        : undefined,
    };

    onCreateList(newList);
  };

  return (
    <div className="w-full max-w-3xl mx-auto pb-20 animate-fadeIn">
      {/* Web Header Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/80 hover:bg-white text-[#3A4540] shadow-2xs border border-[#CCD4CA] transition-all active:scale-95 text-xs font-medium"
        >
          <ChevronLeft size={18} strokeWidth={2.2} />
          <span>Tillbaka till alla rutiner</span>
        </button>

        <span className="text-xs text-[#718175]">
          Skapa ny rutin & lista
        </span>
      </div>

      {/* Main Creation Card Form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-[36px] p-8 md:p-10 shadow-sm transition-all"
        style={{
          backgroundColor: '#F3F5F1',
          border: `5px solid ${currentTheme.borderColor}`,
          boxShadow: '0 8px 30px -4px rgba(45, 55, 72, 0.08)',
        }}
      >
        <div className="pb-5 border-b border-[#E1E5DF]">
          <h1 className="text-2xl md:text-3xl font-medium tracking-tight text-[#2A332E]">
            Skapa en ny lista
          </h1>
          <p className="text-sm text-[#6B7970] mt-1">
            Bygg en rogivande daglig rutin, studiesession eller ett arbetsprojekt med distraktionsfri klarhet.
          </p>
        </div>

        {/* Quick-Start Routine Templates Section */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#5A6E60] uppercase tracking-wider">
              Börja från en medveten mall:
            </span>
            <span className="text-[11px] text-[#7B8B80]">Klicka på en mall för att fylla i automatiskt</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ROUTINE_TEMPLATES.map((tmpl) => (
              <button
                type="button"
                key={tmpl.title}
                onClick={() => handleApplyTemplate(tmpl)}
                className="text-left p-3.5 rounded-2xl bg-white/80 border border-[#DEE3DC] hover:border-[#8CA390] hover:bg-white transition-all text-xs group shadow-2xs"
              >
                <div className="flex items-center gap-2 font-medium text-[#2E3832]">
                  <CategoryIcon icon={tmpl.icon} size={16} className="text-[#65796B]" />
                  <span className="text-sm">{tmpl.title}</span>
                </div>
                <p className="text-xs text-[#7A877E] mt-1 leading-relaxed">
                  {tmpl.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* List Title Input */}
        <div className="mt-6 pt-5 border-t border-[#E1E5DF]">
          <label className="block text-xs font-medium text-[#46544B] mb-2">
            Listans eller rutinens namn
          </label>
          <input
            type="text"
            required
            placeholder="t.ex. Morgonrutin, Studiepass, Kvällsrutin, Träning & Välmående"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 text-base bg-white rounded-2xl border border-[#CCD3CB] focus:outline-hidden focus:border-[#8CA390] text-[#2D3748] shadow-2xs"
          />
        </div>

        {/* Category, Date & Theme Row */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-medium text-[#46544B] mb-2">
              Kategori
            </label>
            <select
              value={category}
              onChange={(e) => {
                const cat = e.target.value as ListCategory;
                setCategory(cat);
                const matching = CATEGORIES.find((c) => c.id === cat);
                if (matching) setSelectedIcon(matching.icon as any);
              }}
              className="w-full px-3.5 py-2.5 text-sm bg-white rounded-2xl border border-[#CCD3CB] focus:outline-hidden text-[#2D3748] shadow-2xs"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#46544B] mb-2">
              Datumetikett
            </label>
            <input
              type="text"
              value={dateStr}
              onChange={(e) => setDateStr(e.target.value)}
              placeholder="30 okt / 26"
              className="w-full px-3.5 py-2.5 text-sm bg-white rounded-2xl border border-[#CCD3CB] focus:outline-hidden text-[#2D3748] shadow-2xs"
            />
          </div>
        </div>

        {/* Icon Selection */}
        <div className="mt-5">
          <label className="block text-xs font-medium text-[#46544B] mb-2">
            Välj ikon
          </label>
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            {ICONS.map((iconName) => (
              <button
                type="button"
                key={iconName}
                onClick={() => setSelectedIcon(iconName)}
                className={`p-2.5 rounded-xl transition-all shrink-0 ${
                  selectedIcon === iconName
                    ? 'bg-[#8CA390] text-white shadow-xs'
                    : 'bg-white/80 text-[#546358] hover:bg-white border border-[#DEE3DC]'
                }`}
              >
                <CategoryIcon icon={iconName} size={20} />
              </button>
            ))}
          </div>
        </div>

        {/* Nature Palette Theme Picker */}
        <div className="mt-5">
          <label className="block text-xs font-medium text-[#46544B] mb-2">
            Kant- och accentfärg
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {THEMES.map((theme) => (
              <button
                type="button"
                key={theme.id}
                onClick={() => setThemeId(theme.id)}
                className={`flex items-center gap-2.5 p-2.5 rounded-2xl border transition-all text-xs ${
                  themeId === theme.id
                    ? 'bg-white border-[#2D3748] shadow-xs'
                    : 'bg-white/60 border-transparent hover:bg-white'
                }`}
              >
                <span
                  className="w-5 h-5 rounded-full shrink-0 border border-black/10 shadow-2xs"
                  style={{ backgroundColor: theme.borderColor }}
                />
                <span className="font-medium text-[#3A453E]">{theme.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Privacy & Routine Settings in Swedish */}
        <div className="mt-6 pt-5 border-t border-[#E1E5DF] space-y-4">
          <div className="flex items-center justify-between p-3.5 bg-white/70 rounded-2xl border border-[#DEE3DC]">
            <div>
              <span className="text-sm font-medium text-[#2E3731]">
                Daglig återkommande rutin
              </span>
              <p className="text-xs text-[#718076] mt-0.5">
                Aktiverar knappen "Rensa" för att enkelt nollställa uppgifterna inför nästa dag.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsDailyRoutine(!isDailyRoutine)}
              className={`w-12 h-7 rounded-full transition-colors relative p-0.5 ${
                isDailyRoutine ? 'bg-[#8CA390]' : 'bg-[#D1D8CF]'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-white shadow-xs transition-transform ${
                  isDailyRoutine ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 bg-white/70 rounded-2xl border border-[#DEE3DC]">
            <div>
              <span className="text-sm font-medium text-[#2E3731]">
                Sekretess och delning
              </span>
              <p className="text-xs text-[#718076] mt-0.5">
                {isPrivate ? 'Endast synlig för dig på denna enhet' : 'Kan bjuda in rutinkamrater via e-post'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsPrivate(!isPrivate)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-xs font-medium text-[#3E4C42] border border-[#CCD3CB] shadow-2xs"
            >
              {isPrivate ? <Lock size={14} /> : <Users size={14} />}
              <span>{isPrivate ? 'Privat' : 'Delad rutin'}</span>
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 bg-white/70 rounded-2xl border border-[#DEE3DC]">
            <div>
              <span className="text-sm font-medium text-[#2E3731]">
                Inkludera en enkel tabell
              </span>
              <p className="text-xs text-[#718076] mt-0.5">
                Lägger till en tom anpassningsbar tabell med redigerbara kolumner och rader.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIncludeTable(!includeTable)}
              className={`w-12 h-7 rounded-full transition-colors relative p-0.5 ${
                includeTable ? 'bg-[#8CA390]' : 'bg-[#D1D8CF]'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-white shadow-xs transition-transform ${
                  includeTable ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Initial Tasks Section in Swedish */}
        <div className="mt-6 pt-5 border-t border-[#E1E5DF]">
          <div className="flex items-center justify-between mb-2.5">
            <label className="text-xs font-semibold text-[#5A6E60] uppercase tracking-wider">
              Inledande uppgifter & rutinsteg ({tasks.length})
            </label>
            <span className="text-[11px] text-[#718076]">Redigera eller ta bort steg</span>
          </div>

          <div className="space-y-2 mb-4">
            {tasks.map((taskText, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-white/80 border border-[#DEE3DC] text-sm text-[#2F3A33]"
              >
                <span className="truncate flex-1">{taskText}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTask(idx)}
                  className="p-1 text-[#8E9B92] hover:text-[#B3474F] ml-2"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Lägg till ytterligare ett rutinsteg..."
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              className="flex-1 px-3.5 py-2.5 text-sm bg-white rounded-xl border border-[#CCD3CB] focus:outline-hidden text-[#2D3748]"
            />
            <button
              type="button"
              onClick={handleAddTask}
              className="px-4 py-2.5 bg-[#8CA390] text-white rounded-xl text-xs font-medium hover:bg-[#788E7C] shadow-2xs"
            >
              Lägg till
            </button>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="mt-8 pt-5 border-t border-[#E1E5DF] flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onBack}
            className="px-5 py-3 rounded-2xl bg-[#E1E5DF] text-xs font-medium text-[#4A5568] hover:bg-[#D5DCD3] transition-colors"
          >
            Avbryt
          </button>
          <button
            type="submit"
            className="py-3 px-6 rounded-2xl bg-[#8CA390] text-white font-medium text-sm flex items-center justify-center gap-2 hover:bg-[#79917D] active:scale-[0.98] shadow-sm transition-all"
          >
            <span>Skapa medveten lista</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </form>
    </div>
  );
};
