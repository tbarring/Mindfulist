import React, { useState } from 'react';
import {
  ChevronLeft,
  User,
  Settings,
  HelpCircle,
  Volume2,
  Bell,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Check,
  Shield,
  Download,
  RotateCcw,
  Heart,
  Palette,
  Mail,
  Send,
} from 'lucide-react';
import { UserSettings, MindfulList } from '../types/mindfulist';
import { MindfulistLogo } from './MindfulistLogo';
import { playZenChime } from '../utils/audio';

interface AccountSettingsScreenProps {
  settings: UserSettings;
  lists: MindfulList[];
  onBack: () => void;
  onUpdateSettings: (updated: UserSettings) => void;
  onResetSampleData: () => void;
}

export const AccountSettingsScreen: React.FC<AccountSettingsScreenProps> = ({
  settings,
  lists,
  onBack,
  onUpdateSettings,
  onResetSampleData,
}) => {
  const [activeTab, setActiveTab] = useState<'settings' | 'help'>('settings');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');

  const totalTasks = lists.reduce((sum, l) => sum + l.items.length, 0);
  const completedTasks = lists.reduce(
    (sum, l) => sum + l.items.filter((i) => i.completed).length,
    0
  );

  const handleSoundToggle = () => {
    const next = !settings.soundEnabled;
    onUpdateSettings({ ...settings, soundEnabled: next });
    if (next) playZenChime(settings.soundType);
  };

  const handleSoundTypeChange = (type: UserSettings['soundType']) => {
    onUpdateSettings({ ...settings, soundType: type });
    playZenChime(type);
  };

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({ lists, settings }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `mindfulist_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    setFeedbackSent(true);
    playZenChime('soft-chime');
    setTimeout(() => {
      setFeedbackText('');
      setFeedbackSent(false);
    }, 4000);
  };

  const faqs = [
    {
      q: 'How does the "Clear" button help with morning routines?',
      a: 'Routines are meant to be repeated daily without re-typing tasks. In Mindfulist, tapping "Clear" unchecks completed routine items and resets them to active status so tomorrow morning you can start fresh with zero friction.',
    },
    {
      q: 'Why does each task have its own timer icon?',
      a: 'Tiffany designed Mindfulist to help users stay calm and focused without task anxiety. Clicking the clock icon starts a serene countdown timer with a gentle breathing circle and Tibetan singing bowl chime so you can finish the task with full presence.',
    },
    {
      q: 'Can I share routines with a friend or study buddy?',
      a: 'Yes! Inside any open list, tap the Share icon in the top right. You can toggle between "Private" and "Shared", and add their email so both of you can view and complete routine milestones together.',
    },
    {
      q: 'Can I add a table to my list?',
      a: 'Yes! Tap "Add table" in any open list to add a clean, simple fillable table. You can customize column headers, type directly into cells, add or remove rows and columns, and keep details organized with calm clarity.',
    },
    {
      q: 'How does Mindfulist prevent digital overwhelm?',
      a: 'No noisy badges, red notification dots, or aggressive gamification. Mindfulist uses grounding earth tones (sage, warm terracotta, dusty rose) and calm typography to create an oasis of tranquility.',
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto pb-20 animate-fadeIn">
      {/* Web Header Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/80 hover:bg-white text-[#3A4540] shadow-2xs border border-[#CCD4CA] transition-all active:scale-95 text-xs font-medium"
        >
          <ChevronLeft size={18} strokeWidth={2.2} />
          <span>Back to All Routines</span>
        </button>

        <span className="text-xs text-[#718175]">
          Account & Mindful Preferences
        </span>
      </div>

      {/* Main Container Card */}
      <div
        className="rounded-[36px] p-8 md:p-10 shadow-sm transition-all text-[#2D3748]"
        style={{
          backgroundColor: '#F3F5F1',
          border: '5px solid #9CAD9E',
          boxShadow: '0 8px 30px -4px rgba(45, 55, 72, 0.08)',
        }}
      >
        {/* Profile Card Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#E1E5DF]">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-[#8CA390] text-white flex items-center justify-center text-xl font-medium shadow-xs border-2 border-white">
                {settings.avatarSeed}
              </div>
              <span
                className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#F3F5F1]"
                title="Calm & Active"
              />
            </div>

            <div>
              <h1 className="text-xl md:text-2xl font-semibold text-[#25302A]">
                {settings.name}
              </h1>
              <p className="text-xs text-[#6F7D74] mt-0.5">{settings.email}</p>
              <div className="mt-1.5 flex items-center gap-2 text-xs font-medium text-[#46634F]">
                <span>🌱 {settings.streakDays} days mindful routine streak</span>
              </div>
            </div>
          </div>

          {/* Quiet Web Metrics Summary */}
          <div className="flex items-center gap-3 p-3 bg-white/70 rounded-2xl border border-[#DEE3DC] text-center self-stretch sm:self-auto shadow-2xs">
            <div className="px-3">
              <div className="text-lg font-semibold text-[#2D3748] tabular-nums">
                {lists.length}
              </div>
              <div className="text-[10px] text-[#718077]">Active Lists</div>
            </div>
            <div className="border-x border-[#E3E8E2] px-3">
              <div className="text-lg font-semibold text-[#2D3748] tabular-nums">
                {totalTasks}
              </div>
              <div className="text-[10px] text-[#718077]">Total Tasks</div>
            </div>
            <div className="px-3">
              <div className="text-lg font-semibold text-[#486B52] tabular-nums">
                {completedTasks}
              </div>
              <div className="text-[10px] text-[#718077]">Completed</div>
            </div>
          </div>
        </div>

        {/* Tab Switcher: Settings vs Help & Guidance */}
        <div className="mt-6 flex gap-2 p-1.5 bg-[#E4EAE2] rounded-2xl max-w-sm">
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-medium transition-all ${
              activeTab === 'settings'
                ? 'bg-white text-[#2D3748] shadow-xs'
                : 'text-[#627367] hover:text-[#2D3748]'
            }`}
          >
            <Settings size={15} />
            <span>Settings & Preferences</span>
          </button>

          <button
            onClick={() => setActiveTab('help')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-medium transition-all ${
              activeTab === 'help'
                ? 'bg-white text-[#2D3748] shadow-xs'
                : 'text-[#627367] hover:text-[#2D3748]'
            }`}
          >
            <HelpCircle size={15} />
            <span>Help & FAQ</span>
          </button>
        </div>

        {/* TAB 1: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
            {/* Column 1: Audio & Routines */}
            <div className="space-y-6">
              {/* Sound & Chimes */}
              <div className="p-5 rounded-3xl bg-white/70 border border-[#DEE3DC] shadow-2xs">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Volume2 size={18} className="text-[#657A6B]" />
                    <span className="text-xs font-semibold text-[#2F3A33] uppercase tracking-wider">
                      Mindfulness Audio Chimes
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleSoundToggle}
                    className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                      settings.soundEnabled ? 'bg-[#8CA390]' : 'bg-[#D1D8CF]'
                    }`}
                    aria-label="Toggle chime sounds"
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                        settings.soundEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <p className="text-xs text-[#6F7D74] mb-3">
                  Gentle synthesized chime plays upon routine completion and timer finish.
                </p>

                {settings.soundEnabled && (
                  <div className="space-y-2 pt-2 border-t border-[#EEF2EC]">
                    <span className="text-[11px] font-medium text-[#65736A]">
                      Select chime style:
                    </span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { id: 'singing-bowl', label: 'Singing Bowl' },
                        { id: 'soft-chime', label: 'Crystal Bell' },
                        { id: 'bamboo-wood', label: 'Bamboo Tap' },
                      ].map((s) => (
                        <button
                          key={s.id}
                          onClick={() => handleSoundTypeChange(s.id as any)}
                          className={`py-2 px-2.5 rounded-xl text-xs font-medium transition-all ${
                            settings.soundType === s.id
                              ? 'bg-[#8CA390] text-white shadow-xs'
                              : 'bg-[#E6ECE4] text-[#516155] hover:bg-[#DCE3DA]'
                          }`}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Routine Auto-Reset Preference */}
              <div className="p-5 rounded-3xl bg-white/70 border border-[#DEE3DC] shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-sm font-medium text-[#2E3731]">
                      Daily Routine Auto-Reset
                    </span>
                    <p className="text-xs text-[#718076] mt-0.5">
                      Automatically resets completed items at 04:00 AM for the next day.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      onUpdateSettings({
                        ...settings,
                        autoResetRoutines: !settings.autoResetRoutines,
                      })
                    }
                    className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                      settings.autoResetRoutines ? 'bg-[#8CA390]' : 'bg-[#D1D8CF]'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                        settings.autoResetRoutines ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Column 2: Focus Timers & Canvas Atmosphere */}
            <div className="space-y-6">
              {/* Default Focus Timer Duration */}
              <div className="p-5 rounded-3xl bg-white/70 border border-[#DEE3DC] shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-[#2E3731]">
                    Default Focus Timer Length
                  </span>
                  <span className="text-xs font-semibold text-[#486350] tabular-nums bg-[#8CA390]/15 px-2.5 py-1 rounded-full">
                    {settings.defaultTimerMinutes} min
                  </span>
                </div>
                <p className="text-xs text-[#6F7D74] mb-3">
                  Standard interval when clicking the clock icon on a task.
                </p>
                <div className="grid grid-cols-5 gap-1.5">
                  {[5, 10, 15, 25, 45].map((mins) => (
                    <button
                      key={mins}
                      onClick={() => {
                        onUpdateSettings({ ...settings, defaultTimerMinutes: mins });
                        playZenChime('bamboo-wood');
                      }}
                      className={`py-2 text-xs rounded-xl font-medium transition-all ${
                        settings.defaultTimerMinutes === mins
                          ? 'bg-[#8CA390] text-white shadow-xs'
                          : 'bg-white text-[#546458] hover:bg-[#EAEFE8] border border-[#CCD4CA]'
                      }`}
                    >
                      {mins}m
                    </button>
                  ))}
                </div>
              </div>

              {/* Canvas Atmosphere Tint */}
              <div className="p-5 rounded-3xl bg-white/70 border border-[#DEE3DC] shadow-2xs">
                <div className="flex items-center gap-2 mb-2">
                  <Palette size={16} className="text-[#657A6B]" />
                  <span className="text-sm font-medium text-[#2E3731]">
                    Canvas Background Tint
                  </span>
                </div>
                <p className="text-xs text-[#6F7D74] mb-3">
                  Soft neutral ambient tone for your browser window.
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'sage', label: 'Sage', bg: '#E2E6E1' },
                    { id: 'stone', label: 'Stone', bg: '#E3E4E2' },
                    { id: 'linen', label: 'Linen', bg: '#E8E5DF' },
                    { id: 'lavender', label: 'Nordic', bg: '#E1E3E8' },
                  ].map((tint) => (
                    <button
                      key={tint.id}
                      onClick={() =>
                        onUpdateSettings({ ...settings, canvasTint: tint.id as any })
                      }
                      className={`flex flex-col items-center justify-center gap-1.5 py-2.5 rounded-xl border text-xs transition-all ${
                        settings.canvasTint === tint.id
                          ? 'bg-white border-[#2D3748] shadow-xs text-[#2D3748] font-medium'
                          : 'bg-white/60 border-transparent text-[#616F66] hover:bg-white'
                      }`}
                    >
                      <span
                        className="w-4 h-4 rounded-full border border-black/10 shadow-2xs"
                        style={{ backgroundColor: tint.bg }}
                      />
                      <span>{tint.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Data & Backup */}
              <div className="p-5 rounded-3xl bg-white/70 border border-[#DEE3DC] shadow-2xs space-y-2.5">
                <button
                  onClick={handleExportData}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white text-xs font-medium text-[#3E4D42] border border-[#CCD3CB] hover:bg-white/90 transition-colors shadow-2xs"
                >
                  <Download size={14} />
                  <span>Export routines & backup (JSON)</span>
                </button>

                <button
                  onClick={onResetSampleData}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-transparent text-xs text-[#7F8D84] hover:text-[#B54A53] transition-colors"
                >
                  <RotateCcw size={13} />
                  <span>Reset to original sample lists</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: HELP & ROUTINE GUIDANCE */}
        {activeTab === 'help' && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
            {/* FAQs Accordion */}
            <div>
              <h2 className="text-xs font-semibold text-[#66766B] uppercase tracking-wider mb-3">
                Mindful Routine Guides
              </h2>
              <div className="space-y-2.5">
                {faqs.map((item, idx) => {
                  const isOpen = expandedFaq === idx;
                  return (
                    <div
                      key={idx}
                      className="rounded-2xl bg-white/80 border border-[#DEE3DC] overflow-hidden transition-all shadow-2xs"
                    >
                      <button
                        onClick={() => setExpandedFaq(isOpen ? null : idx)}
                        className="w-full flex items-center justify-between p-3.5 text-left text-xs font-medium text-[#2A342E] hover:bg-black/[0.02]"
                      >
                        <span className="pr-3 text-sm">{item.q}</span>
                        {isOpen ? (
                          <ChevronUp size={16} className="text-[#65796B] shrink-0" />
                        ) : (
                          <ChevronDown size={16} className="text-[#8B988F] shrink-0" />
                        )}
                      </button>
                      {isOpen && (
                        <div className="px-3.5 pb-3.5 text-xs text-[#5D6B62] leading-relaxed border-t border-[#EEF2EC] pt-2.5">
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Feedback / Contact Tiffany */}
            <div>
              <div className="p-6 rounded-3xl bg-white/70 border border-[#DEE3DC] shadow-2xs">
                <div className="flex items-center gap-2 mb-2">
                  <Mail size={16} className="text-[#657A6B]" />
                  <h3 className="text-sm font-semibold text-[#2E3731]">
                    Have suggestions or mindful routine ideas?
                  </h3>
                </div>
                <p className="text-xs text-[#718076] mb-4 leading-relaxed">
                  We designed Mindfulist to create calm in daily living. Tell Tiffany and the team how we can make your day more peaceful.
                </p>

                {feedbackSent ? (
                  <div className="p-4 rounded-2xl bg-[#9CAD9E]/20 text-[#305037] text-xs flex items-center gap-2.5">
                    <Check size={18} />
                    <span>Thank you! Your feedback has been received with gratitude.</span>
                  </div>
                ) : (
                  <form onSubmit={handleSendFeedback} className="space-y-3">
                    <textarea
                      rows={4}
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      placeholder="Write your note to Tiffany & the Mindfulist team..."
                      className="w-full p-3 text-xs bg-white rounded-2xl border border-[#CCD3CB] focus:outline-hidden focus:border-[#8CA390] text-[#2D3748] shadow-2xs"
                    />
                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 bg-[#8CA390] text-white rounded-2xl text-xs font-medium hover:bg-[#788E7C] transition-colors flex items-center justify-center gap-2 shadow-2xs"
                    >
                      <Send size={14} />
                      <span>Send note</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
