/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  MindfulList,
  UserSettings,
  TaskItem,
} from './types/mindfulist';
import {
  loadLists,
  saveLists,
  loadSettings,
  saveSettings,
  INITIAL_LISTS,
  INITIAL_SETTINGS,
  THEMES,
} from './utils/storage';
import { HomeScreen } from './components/HomeScreen';
import { OpenListScreen } from './components/OpenListScreen';
import { CreateListScreen } from './components/CreateListScreen';
import { AccountSettingsScreen } from './components/AccountSettingsScreen';
import { FocusTimerModal } from './components/FocusTimerModal';
import { ShareListModal } from './components/ShareListModal';
import { MindfulistLogo } from './components/MindfulistLogo';
import { CategoryIcon } from './components/CategoryIcon';
import {
  Plus,
  Settings,
  Sparkles,
  Volume2,
  Clock,
  CheckCircle2,
  ListTodo,
  Layers,
  ChevronRight,
  User,
  Heart,
} from 'lucide-react';
import { playZenChime } from './utils/audio';

export default function App() {
  const [lists, setLists] = useState<MindfulList[]>(loadLists);
  const [settings, setSettings] = useState<UserSettings>(loadSettings);
  const [currentScreen, setCurrentScreen] = useState<'home' | 'detail' | 'create' | 'account'>('home');
  const [selectedListId, setSelectedListId] = useState<string>('list-1');
  const [activeTimerTask, setActiveTimerTask] = useState<{ task: TaskItem; listTitle: string } | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Sync to local storage
  useEffect(() => {
    saveLists(lists);
  }, [lists]);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  // Canvas background tints
  const canvasBgClass = {
    sage: 'bg-[#E1E5DF]',
    stone: 'bg-[#E3E4E2]',
    linen: 'bg-[#E8E5DF]',
    lavender: 'bg-[#E2E4E8]',
  }[settings.canvasTint] || 'bg-[#E1E5DF]';

  const selectedList = lists.find((l) => l.id === selectedListId) || lists[0];

  // Screen navigation handlers
  const handleSelectList = (list: MindfulList) => {
    setSelectedListId(list.id);
    setCurrentScreen('detail');
  };

  const handleUpdateList = (updated: MindfulList) => {
    setLists((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
  };

  const handleDeleteList = (listId: string) => {
    setLists((prev) => prev.filter((l) => l.id !== listId));
    setCurrentScreen('home');
  };

  const handleCreateList = (newList: MindfulList) => {
    setLists((prev) => [newList, ...prev]);
    setSelectedListId(newList.id);
    setCurrentScreen('detail');
  };

  const handleResetSampleData = () => {
    setLists(INITIAL_LISTS);
    setSettings(INITIAL_SETTINGS);
    setSelectedListId('list-1');
    setCurrentScreen('home');
  };

  const handleCompleteTimerTask = () => {
    if (!activeTimerTask || !selectedList) return;
    const updatedItems = selectedList.items.map((i) =>
      i.id === activeTimerTask.task.id ? { ...i, completed: true } : i
    );
    handleUpdateList({ ...selectedList, items: updatedItems });
  };

  return (
    <div className={`min-h-screen ${canvasBgClass} text-[#2D3748] transition-colors duration-500 font-sans flex flex-col`}>
      {/* Web Application Top Navigation Bar in Swedish */}
      <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-md border-b border-[#CCD4CA] px-6 lg:px-12 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark */}
          <button
            onClick={() => setCurrentScreen('home')}
            className="flex items-center gap-2 hover:opacity-90 transition-opacity focus:outline-hidden whitespace-nowrap shrink-0"
            aria-label="Mindfulist Hem"
          >
            <MindfulistLogo size="md" />
          </button>

          {/* Zone 2: Navigation Links in Swedish */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#4D5E53]">
            <button
              onClick={() => setCurrentScreen('home')}
              className={`hover:text-black transition-colors whitespace-nowrap shrink-0 py-1 ${
                currentScreen === 'home'
                  ? 'text-black font-semibold border-b-2 border-[#8CA390]'
                  : ''
              }`}
            >
              Alla rutiner
            </button>
            <button
              onClick={() => {
                setSelectedListId(lists[0]?.id || 'list-1');
                setCurrentScreen('detail');
              }}
              className={`hover:text-black transition-colors whitespace-nowrap shrink-0 py-1 ${
                currentScreen === 'detail'
                  ? 'text-black font-semibold border-b-2 border-[#8CA390]'
                  : ''
              }`}
            >
              Aktiv rutin
            </button>
            <button
              onClick={() => setCurrentScreen('create')}
              className={`hover:text-black transition-colors whitespace-nowrap shrink-0 py-1 ${
                currentScreen === 'create'
                  ? 'text-black font-semibold border-b-2 border-[#8CA390]'
                  : ''
              }`}
            >
              Mallar & Skapa
            </button>
            <button
              onClick={() => setCurrentScreen('account')}
              className={`hover:text-black transition-colors whitespace-nowrap shrink-0 py-1 ${
                currentScreen === 'account'
                  ? 'text-black font-semibold border-b-2 border-[#8CA390]'
                  : ''
              }`}
            >
              Inställningar & Hjälp
            </button>
          </nav>

          {/* Zone 3: Primary Action & Profile Lockup (Petra) */}
          <div className="flex items-center gap-3.5 shrink-0">
            {/* Quick Chime Preview Button */}
            <button
              onClick={() => playZenChime(settings.soundType)}
              title="Spela rogivande klangljud"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/60 hover:bg-white text-xs text-[#526356] border border-[#CCD4CA] transition-colors shadow-2xs"
            >
              <Volume2 size={14} className="text-[#657A6B]" />
              <span>Klang</span>
            </button>

            {/* + New List Primary CTA */}
            <button
              onClick={() => setCurrentScreen('create')}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#8CA390] text-white text-xs font-medium hover:bg-[#788E7C] active:scale-95 transition-all shadow-xs whitespace-nowrap"
            >
              <Plus size={16} strokeWidth={2.2} />
              <span>Ny lista</span>
            </button>

            {/* User Profile avatar pill: Petra (no last name) */}
            <button
              onClick={() => setCurrentScreen('account')}
              className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-white/70 hover:bg-white border border-[#CCD4CA] text-xs transition-colors shadow-2xs"
              title="Konto, inställningar & hjälp"
            >
              <div className="w-6 h-6 rounded-full bg-[#8CA390] text-white flex items-center justify-center text-[10px] font-semibold">
                {settings.avatarSeed}
              </div>
              <span className="hidden lg:inline text-[#3F4D43] font-medium">
                {settings.name}
              </span>
              <span className="text-[11px] text-[#4E6755] font-semibold">
                🌱 {settings.streakDays} d
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Web Workspace Area */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-10 py-8 flex-1 flex flex-col lg:flex-row gap-8">
        {/* Left Navigation Rail (Desktop Only) in Swedish */}
        <aside className="hidden xl:flex flex-col w-64 shrink-0 space-y-6">
          {/* Quick List Navigator */}
          <div className="p-5 rounded-3xl bg-white/60 border border-[#CCD4CA] shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-[#5A6E60] uppercase tracking-wider">
                Mina rutiner
              </span>
              <span className="text-xs text-[#7A8A7F] tabular-nums">
                {lists.length}
              </span>
            </div>

            <div className="space-y-1.5">
              {lists.map((list) => {
                const theme = THEMES.find((t) => t.id === list.themeId) || THEMES[0];
                const isCurrent = currentScreen === 'detail' && selectedListId === list.id;
                const pending = list.items.filter((i) => !i.completed).length;

                return (
                  <button
                    key={list.id}
                    onClick={() => handleSelectList(list)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-2xl text-xs transition-all text-left ${
                      isCurrent
                        ? 'bg-white font-medium text-[#2D3748] shadow-xs border border-[#CCD4CA]'
                        : 'text-[#48564D] hover:bg-white/50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: theme.borderColor }}
                      />
                      <span className="truncate">{list.title}</span>
                    </div>
                    {pending > 0 ? (
                      <span className="text-[10px] text-[#69796F] font-semibold tabular-nums bg-black/5 px-1.5 py-0.5 rounded-full">
                        {pending}
                      </span>
                    ) : (
                      <CheckCircle2 size={13} className="text-[#557F60]" />
                    )}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setCurrentScreen('create')}
              className="mt-4 w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white/80 hover:bg-white text-xs font-medium text-[#465E4E] border border-dashed border-[#CCD4CA] transition-colors"
            >
              <Plus size={14} />
              <span>Lägg till rutin</span>
            </button>
          </div>

          {/* Serene Mindfulness Card in Swedish */}
          <div className="p-5 rounded-3xl bg-[#F3F5F1] border-2 border-[#9CAD9E]/50 shadow-2xs text-xs text-[#4F5E54] space-y-2">
            <div className="flex items-center gap-2 font-semibold text-[#3A4A3E]">
              <Sparkles size={15} className="text-[#688A72]" />
              <span>Medveten reflektion</span>
            </div>
            <p className="leading-relaxed text-[#607065]">
              "Fokusera inte på att hinna allt på en gång, utan ge din lugna närvaro till just detta steg."
            </p>
          </div>
        </aside>

        {/* Content Viewport */}
        <main className="flex-1 min-w-0">
          {currentScreen === 'home' && (
            <HomeScreen
              lists={lists}
              onSelectList={handleSelectList}
              onOpenCreateList={() => setCurrentScreen('create')}
              onOpenAccount={() => setCurrentScreen('account')}
              onUpdateList={handleUpdateList}
            />
          )}

          {currentScreen === 'detail' && selectedList && (
            <OpenListScreen
              list={selectedList}
              onBack={() => setCurrentScreen('home')}
              onUpdateList={handleUpdateList}
              onDeleteList={handleDeleteList}
              onOpenShareModal={() => setIsShareModalOpen(true)}
              onOpenTimerModal={(task) =>
                setActiveTimerTask({ task, listTitle: selectedList.title })
              }
            />
          )}

          {currentScreen === 'create' && (
            <CreateListScreen
              onBack={() => setCurrentScreen('home')}
              onCreateList={handleCreateList}
            />
          )}

          {currentScreen === 'account' && (
            <AccountSettingsScreen
              settings={settings}
              lists={lists}
              onBack={() => setCurrentScreen('home')}
              onUpdateSettings={setSettings}
              onResetSampleData={handleResetSampleData}
            />
          )}
        </main>
      </div>

      {/* Global Focus Timer Modal */}
      {activeTimerTask && (
        <FocusTimerModal
          taskTitle={activeTimerTask.task.text}
          listTitle={activeTimerTask.listTitle}
          defaultMinutes={activeTimerTask.task.durationMinutes || settings.defaultTimerMinutes}
          isOpen={Boolean(activeTimerTask)}
          onClose={() => setActiveTimerTask(null)}
          onCompleteTask={handleCompleteTimerTask}
        />
      )}

      {/* Global Share & Privacy Modal */}
      {selectedList && isShareModalOpen && (
        <ShareListModal
          list={selectedList}
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          onUpdateList={handleUpdateList}
        />
      )}

      {/* Calm Web Footer in Swedish */}
      <footer className="mt-auto border-t border-[#CCD4CA] bg-white/40 py-4 px-6 text-center text-xs text-[#718076]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Mindfulist · Lugn och medveten rutinplanerare</span>
          <span>Skapad med naturinspirerad harmoni för rofyllt fokus i vardagen.</span>
        </div>
      </footer>
    </div>
  );
}
