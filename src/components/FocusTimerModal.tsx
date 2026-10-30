import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Check, X, Bell, Volume2, VolumeX, Minimize2 } from 'lucide-react';
import { playZenChime } from '../utils/audio';

interface FocusTimerModalProps {
  taskTitle: string;
  listTitle: string;
  defaultMinutes?: number;
  isOpen: boolean;
  onClose: () => void;
  onCompleteTask: () => void;
}

export const FocusTimerModal: React.FC<FocusTimerModalProps> = ({
  taskTitle,
  listTitle,
  defaultMinutes = 15,
  isOpen,
  onClose,
  onCompleteTask,
}) => {
  const [minutes, setMinutes] = useState(defaultMinutes);
  const [secondsLeft, setSecondsLeft] = useState(defaultMinutes * 60);
  const [isActive, setIsActive] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [breathPhase, setBreathPhase] = useState<'andas in' | 'håll' | 'andas ut'>('andas in');

  const totalSeconds = minutes * 60;
  const progress = Math.max(0, Math.min(1, 1 - secondsLeft / totalSeconds));
  const radius = 96;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progress * circumference;

  // Sync when defaultMinutes changes
  useEffect(() => {
    setMinutes(defaultMinutes);
    setSecondsLeft(defaultMinutes * 60);
    setIsActive(false);
  }, [defaultMinutes, taskTitle]);

  // Timer interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval!);
            setIsActive(false);
            if (soundEnabled) {
              playZenChime('singing-bowl');
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, secondsLeft, soundEnabled]);

  // Breathing pacing guide (4s inhale, 4s hold, 4s exhale)
  useEffect(() => {
    if (!isActive) return;
    const breathInterval = setInterval(() => {
      setBreathPhase((prev) => {
        if (prev === 'andas in') return 'håll';
        if (prev === 'håll') return 'andas ut';
        return 'andas in';
      });
    }, 4000);
    return () => clearInterval(breathInterval);
  }, [isActive]);

  if (!isOpen) return null;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handlePresetSelect = (mins: number) => {
    setMinutes(mins);
    setSecondsLeft(mins * 60);
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setSecondsLeft(minutes * 60);
  };

  const handleFinishAndComplete = () => {
    if (soundEnabled) {
      playZenChime('singing-bowl');
    }
    onCompleteTask();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2D3748]/40 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-sm rounded-3xl bg-[#F4F6F2] p-6 shadow-2xl border-4 border-[#9CAD9E] text-[#2D3748]">
        {/* Header bar */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E1E5DF]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#9CAD9E]" />
            <span className="text-xs font-medium uppercase tracking-wider text-[#6B7870]">
              {listTitle}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                if (!soundEnabled) playZenChime('soft-chime');
              }}
              title={soundEnabled ? 'Klangljud aktiverat' : 'Ljud avstängt'}
              className="p-1.5 rounded-full hover:bg-black/5 text-[#5F6D64] transition-colors"
            >
              {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-black/5 text-[#5F6D64] transition-colors"
              aria-label="Stäng timer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Task Title */}
        <div className="mt-4 text-center">
          <h3 className="text-lg font-semibold text-[#2F3833] line-clamp-2">
            {taskTitle}
          </h3>
          <p className="mt-0.5 text-xs text-[#7B8880]">
            {isActive ? (
              <span className="capitalize transition-opacity duration-700">
                Lugnt andetag: <strong className="text-[#4E5C53]">{breathPhase}</strong>
              </span>
            ) : (
              'Meditativ fokus-timer'
            )}
          </p>
        </div>

        {/* Circular Countdown Progress */}
        <div className="relative my-6 flex items-center justify-center">
          {/* Subtle breathing glow ring */}
          <div
            className={`absolute w-56 h-56 rounded-full bg-[#9CAD9E]/15 transition-transform duration-1000 ${
              isActive && breathPhase === 'andas in'
                ? 'scale-110 opacity-70'
                : 'scale-95 opacity-30'
            }`}
          />

          <svg width="220" height="220" className="rotate-[-90deg]">
            {/* Background circle track */}
            <circle
              cx="110"
              cy="110"
              r={radius}
              stroke="#E0E6DE"
              strokeWidth="7"
              fill="transparent"
            />
            {/* Animated active stroke */}
            <circle
              cx="110"
              cy="110"
              r={radius}
              stroke="#8FA491"
              strokeWidth="7"
              strokeLinecap="round"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-[stroke-dashoffset] duration-500 ease-linear"
            />
          </svg>

          {/* Time Display Centered */}
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-4xl font-light tracking-tight text-[#2D3748] tabular-nums">
              {formatTime(secondsLeft)}
            </span>
            <span className="text-[11px] font-medium text-[#7A8A7F] mt-1">
              {secondsLeft === 0 ? 'Passet slutfört' : isActive ? 'I fokus' : 'Pausad'}
            </span>
          </div>
        </div>

        {/* Quick Minute Preset Buttons */}
        <div className="flex items-center justify-center gap-1.5 mb-5">
          {[3, 5, 10, 15, 25].map((preset) => (
            <button
              key={preset}
              onClick={() => handlePresetSelect(preset)}
              className={`px-2.5 py-1 text-xs rounded-full font-medium transition-all ${
                minutes === preset
                  ? 'bg-[#8CA390] text-white shadow-xs'
                  : 'bg-[#E3E8E2] text-[#55635A] hover:bg-[#D7DDD5]'
              }`}
            >
              {preset}m
            </button>
          ))}
        </div>

        {/* Play / Pause / Reset Controls */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={handleReset}
            className="p-3 rounded-full bg-[#E5EAE3] text-[#5A685F] hover:bg-[#DAE1D8] transition-colors"
            title="Starta om timern"
          >
            <RotateCcw size={18} />
          </button>

          <button
            onClick={() => {
              if (!isActive && soundEnabled && secondsLeft === totalSeconds) {
                playZenChime('bamboo-wood');
              }
              setIsActive(!isActive);
            }}
            className="flex items-center justify-center w-14 h-14 rounded-full bg-[#8CA390] text-white shadow-md hover:bg-[#7D9481] active:scale-95 transition-all"
            aria-label={isActive ? 'Pausa timer' : 'Starta timer'}
          >
            {isActive ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
          </button>

          <button
            onClick={handleFinishAndComplete}
            className="p-3 rounded-full bg-[#8CA390]/15 text-[#5B7360] hover:bg-[#8CA390]/25 transition-colors"
            title="Klar och bocka av uppgift"
          >
            <Check size={20} />
          </button>
        </div>

        {/* Bottom Helper prompt */}
        <div className="mt-5 text-center">
          <button
            onClick={handleFinishAndComplete}
            className="text-xs font-medium text-[#5F7564] hover:text-[#425547] underline underline-offset-2 transition-colors"
          >
            Markera uppgiften som klar nu
          </button>
        </div>
      </div>
    </div>
  );
};
