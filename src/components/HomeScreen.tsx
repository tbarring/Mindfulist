import React, { useState, useMemo } from 'react';
import {
  User,
  LayoutGrid,
  Rows,
  ArrowUpDown,
  Plus,
  Check,
  Search,
  Sparkles,
  Lock,
  Users,
  Calendar,
  Clock,
  ChevronRight,
} from 'lucide-react';
import { MindfulList, TaskItem, ListCategory } from '../types/mindfulist';
import { THEMES } from '../utils/storage';
import { CategoryIcon } from './CategoryIcon';
import { MindfulistLogo } from './MindfulistLogo';
import { playZenChime } from '../utils/audio';

interface HomeScreenProps {
  lists: MindfulList[];
  onSelectList: (list: MindfulList) => void;
  onOpenCreateList: () => void;
  onOpenAccount: () => void;
  onUpdateList: (updatedList: MindfulList) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  lists,
  onSelectList,
  onOpenCreateList,
  onOpenAccount,
  onUpdateList,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSingleColumn, setIsSingleColumn] = useState(() => {
    try {
      return localStorage.getItem('mindfulist_layout_single_col') === 'true';
    } catch {
      return false;
    }
  });
  const [sortOption, setSortOption] = useState<'date' | 'title' | 'remaining'>('date');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const handleToggleLayout = () => {
    playZenChime('bamboo-wood');
    setIsSingleColumn((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('mindfulist_layout_single_col', String(next));
      } catch {}
      return next;
    });
  };

  // Filtered & sorted lists
  const displayedLists = useMemo(() => {
    let result = [...lists];

    // Category filter
    if (categoryFilter !== 'all') {
      result = result.filter((l) => l.category === categoryFilter);
    }

    // Search query filter (matches title or any task text)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          l.items.some((item) => item.text.toLowerCase().includes(q))
      );
    }

    // Sorting
    result.sort((a, b) => {
      if (sortOption === 'title') {
        return a.title.localeCompare(b.title);
      }
      if (sortOption === 'remaining') {
        const aRem = a.items.filter((i) => !i.completed).length;
        const bRem = b.items.filter((i) => !i.completed).length;
        return bRem - aRem;
      }
      return b.createdDate.localeCompare(a.createdDate);
    });

    return result;
  }, [lists, searchQuery, categoryFilter, sortOption]);

  const totalTasks = lists.reduce((sum, l) => sum + l.items.length, 0);
  const completedTasks = lists.reduce(
    (sum, l) => sum + l.items.filter((i) => i.completed).length,
    0
  );

  const handleToggleTaskFromCard = (e: React.MouseEvent, list: MindfulList, task: TaskItem) => {
    e.stopPropagation();
    const updatedItems = list.items.map((i) => {
      if (i.id === task.id) {
        const next = !i.completed;
        if (next) playZenChime('singing-bowl');
        else playZenChime('bamboo-wood');
        return { ...i, completed: next };
      }
      return i;
    });

    onUpdateList({
      ...list,
      items: updatedItems,
    });
  };

  return (
    <div className="w-full pb-20 animate-fadeIn">
      {/* Web Header Banner: Calm Greeting & Daily Focus */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-6 border-b border-black/5">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-[#65796B] mb-1">
            <span>Friday, October 30, 2026</span>
            <span>·</span>
            <span>Focus & Routines</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-medium tracking-tight text-[#2B352F]">
            Good morning, Tiffany
          </h1>
          <p className="text-sm text-[#6C7C71] mt-1">
            Take a gentle breath. Here are your mindful routines for today.
          </p>
        </div>

        {/* Quick Web Stats Strip */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#F3F5F1] border border-[#DEE3DC] text-xs text-[#4E5E52] shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#8CA390]" />
            <span>{lists.length} Active Lists</span>
            <span className="text-[#99A69D]">·</span>
            <span className="font-semibold text-[#2D3748]">{completedTasks}/{totalTasks} Tasks Done</span>
          </div>

          <button
            onClick={onOpenCreateList}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#8CA390] text-white text-xs font-medium hover:bg-[#788F7C] active:scale-95 transition-all shadow-xs"
          >
            <Plus size={16} strokeWidth={2.2} />
            <span>New List</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar matching the mockup style but scaled for web */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
        {/* Search Input Bar */}
        <div className="relative flex-1 max-w-xl">
          <div className="flex items-center justify-between px-4 py-2.5 rounded-full bg-[#E5E9E3] shadow-xs border border-white/70">
            {/* User profile avatar on left (opens Account/Settings) */}
            <button
              onClick={onOpenAccount}
              className="w-7 h-7 rounded-full flex items-center justify-center text-[#2D3748] hover:bg-black/5 transition-colors"
              title="Open Account, Settings & Help"
              aria-label="Account and Settings"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="10" r="3" />
                <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
              </svg>
            </button>

            {/* Search input field */}
            <div className="flex-1 px-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search your notes and routine tasks..."
                className="w-full bg-transparent text-sm text-[#2D3748] placeholder-[#5C6A60] focus:outline-hidden"
              />
            </div>

            {/* Right Action Icons: Layout toggle (side-by-side vs one list at a time) and Sort icon */}
            <div className="flex items-center gap-1.5 text-[#2D3748]">
              <button
                onClick={handleToggleLayout}
                className={`p-1.5 rounded-xl transition-all ${
                  isSingleColumn
                    ? 'bg-[#8CA390]/25 text-[#253A2B] shadow-2xs'
                    : 'text-[#4A574E] hover:bg-black/5'
                }`}
                title={
                  isSingleColumn
                    ? 'Switch layout to side-by-side view'
                    : 'Switch layout to one list at a time (stacked)'
                }
                aria-label="Toggle lists layout"
              >
                {isSingleColumn ? (
                  /* Two horizontal rectangles (representing one list at a time / stacked view) */
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="5" width="18" height="5" rx="1.5" />
                    <rect x="3" y="14" width="18" height="5" rx="1.5" />
                  </svg>
                ) : (
                  /* Four squares (representing side-by-side / grid view) */
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                  </svg>
                )}
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  className="p-1 rounded-full hover:bg-black/5 transition-colors"
                  title="Sort notes"
                  aria-label="Sort options"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m3 16 4 4 4-4" />
                    <path d="M7 20V4" />
                    <path d="m21 8-4-4-4 4" />
                    <path d="M17 4v16" />
                  </svg>
                </button>

                {/* Sort Dropdown */}
                {showSortDropdown && (
                  <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-[#F5F7F3] p-2 shadow-lg border border-[#CCD4CA] z-30 text-xs animate-fadeIn">
                    <div className="px-2 py-1 font-semibold text-[#66776C] uppercase tracking-wider text-[10px]">
                      Sort routines by:
                    </div>
                    <button
                      onClick={() => {
                        setSortOption('date');
                        setShowSortDropdown(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-xl transition-colors ${
                        sortOption === 'date'
                          ? 'bg-[#8CA390] text-white font-medium'
                          : 'text-[#3D4940] hover:bg-black/5'
                      }`}
                    >
                      Creation Date
                    </button>
                    <button
                      onClick={() => {
                        setSortOption('title');
                        setShowSortDropdown(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-xl transition-colors ${
                        sortOption === 'title'
                          ? 'bg-[#8CA390] text-white font-medium'
                          : 'text-[#3D4940] hover:bg-black/5'
                      }`}
                    >
                      Alphabetical (Title)
                    </button>
                    <button
                      onClick={() => {
                        setSortOption('remaining');
                        setShowSortDropdown(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-xl transition-colors ${
                        sortOption === 'remaining'
                          ? 'bg-[#8CA390] text-white font-medium'
                          : 'text-[#3D4940] hover:bg-black/5'
                      }`}
                    >
                      Remaining tasks count
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Category Filters (Clean unboxed tabs) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs text-[#5C6B61]">
          {[
            { id: 'all', label: 'All Routines' },
            { id: 'routine', label: 'Routines' },
            { id: 'school', label: 'School' },
            { id: 'work', label: 'Work' },
            { id: 'home', label: 'Home' },
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setCategoryFilter(filter.id)}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                categoryFilter === filter.id
                  ? 'bg-white text-[#243329] font-medium shadow-2xs border border-[#CCD4CA]'
                  : 'hover:text-[#243329] hover:bg-white/40'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Routine Cards: Either side-by-side (2-3 columns) or one list at a time (single stacked column) */}
      <div
        className={
          isSingleColumn
            ? 'flex flex-col gap-6 max-w-2xl mx-auto w-full transition-all duration-300'
            : 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 transition-all duration-300'
        }
      >
        {displayedLists.map((list) => {
          const theme = THEMES.find((t) => t.id === list.themeId) || THEMES[0];
          const previewItems = list.items.slice(0, 5);
          const activeCount = list.items.filter((i) => !i.completed).length;

          return (
            <div
              key={list.id}
              onClick={() => onSelectList(list)}
              className="rounded-[32px] p-6 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg active:scale-[0.99] group select-none flex flex-col justify-between"
              style={{
                backgroundColor: '#F3F5F1',
                border: `5px solid ${theme.borderColor}`,
                boxShadow: '0 4px 20px -2px rgba(45, 55, 72, 0.08)',
              }}
            >
              <div>
                {/* Card Header: Category Icon, Title, Date */}
                <div className="flex items-center justify-between pb-3.5 border-b border-[#E3E8E1]">
                  <div className="flex items-center gap-2.5">
                    <CategoryIcon icon={list.icon} size={22} className="text-[#2F3A33]" />
                    <h2 className="text-xl font-medium tracking-tight text-[#2B352F] group-hover:text-black transition-colors">
                      {list.title}
                    </h2>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-normal text-[#445149]">
                    {!list.isPrivate && (
                      <span title="Shared routine" className="inline-flex">
                        <Users size={13} className="text-[#687C6F]" />
                      </span>
                    )}
                    <span>{list.date}</span>
                  </div>
                </div>

                {/* Tasks List inside card */}
                <div className="space-y-3 pt-3">
                  {previewItems.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center gap-2.5 text-sm text-[#2E3732] hover:bg-black/[0.02] p-1 rounded-lg transition-colors"
                    >
                      {/* 3 dots drag handle */}
                      <div className="flex flex-col gap-[3px] py-0.5 opacity-60 group-hover:opacity-100">
                        <span className="w-1 h-1 rounded-full bg-[#3D4741]" />
                        <span className="w-1 h-1 rounded-full bg-[#3D4741]" />
                        <span className="w-1 h-1 rounded-full bg-[#3D4741]" />
                      </div>

                      {/* Square checkbox */}
                      <button
                        type="button"
                        onClick={(e) => handleToggleTaskFromCard(e, list, task)}
                        className={`w-5 h-5 rounded-[4px] border-2 flex items-center justify-center shrink-0 transition-all ${
                          task.completed
                            ? 'bg-[#333D37] border-[#333D37]'
                            : 'border-[#333D37] hover:border-[#8CA390]'
                        }`}
                        aria-label={`Toggle ${task.text}`}
                      >
                        {task.completed && (
                          <Check size={13} className="text-white" strokeWidth={3} />
                        )}
                      </button>

                      {/* Task text with strikethrough if completed */}
                      <span
                        className={`truncate flex-1 ${
                          task.completed ? 'line-through text-[#697A70]' : ''
                        }`}
                      >
                        {task.text}
                      </span>
                    </div>
                  ))}

                  {list.items.length > 5 && (
                    <div className="pt-1 text-xs text-[#718077] font-medium pl-6">
                      +{list.items.length - 5} more routine items...
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer: Status & Open Button */}
              <div className="mt-5 pt-3 border-t border-[#E1E6DF] flex items-center justify-between text-xs text-[#627367]">
                <span>
                  {activeCount === 0 ? 'All finished today ✨' : `${activeCount} pending tasks`}
                </span>
                <span className="flex items-center gap-1 font-medium text-[#465E4E] group-hover:translate-x-1 transition-transform">
                  <span>Open routine</span>
                  <ChevronRight size={14} />
                </span>
              </div>
            </div>
          );
        })}

        {/* Create New List Card (Inviting Web Action Tile) */}
        <div
          onClick={onOpenCreateList}
          className="rounded-[32px] p-6 border-4 border-dashed border-[#8CA390]/50 hover:border-[#8CA390] bg-[#F3F5F1]/60 hover:bg-[#F3F5F1] cursor-pointer flex flex-col items-center justify-center text-center gap-3 min-h-[260px] transition-all group hover:-translate-y-1 shadow-2xs"
        >
          <div className="w-14 h-14 rounded-full bg-[#8CA390]/15 group-hover:bg-[#8CA390] text-[#556F5C] group-hover:text-white flex items-center justify-center transition-all">
            <Plus size={28} strokeWidth={2.2} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-[#2D3748]">
              Create a New List
            </h3>
            <p className="text-xs text-[#6F7D74] mt-1 max-w-[200px]">
              Start a fresh routine or customize from mindful templates.
            </p>
          </div>
        </div>
      </div>

      {displayedLists.length === 0 && (
        <div className="text-center py-16 px-4 rounded-3xl bg-white/50 border border-[#D5DCD3] max-w-md mx-auto mt-6">
          <p className="text-sm text-[#5C6D62]">
            No routines found matching "{searchQuery}".
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setCategoryFilter('all');
            }}
            className="mt-3 px-4 py-1.5 rounded-xl bg-[#8CA390] text-white text-xs font-medium"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
};
