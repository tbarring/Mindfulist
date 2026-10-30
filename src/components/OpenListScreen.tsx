import React, { useState } from 'react';
import {
  ChevronLeft,
  Trash2,
  Share2,
  Plus,
  Table2,
  GripVertical,
  Check,
  RotateCcw,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  X,
  Lock,
  Users,
} from 'lucide-react';
import { MindfulList, TaskItem, TableRow, RoutineTable } from '../types/mindfulist';
import { THEMES } from '../utils/storage';
import { CategoryIcon } from './CategoryIcon';
import { MindfulistLogo } from './MindfulistLogo';
import { playZenChime } from '../utils/audio';

interface OpenListScreenProps {
  list: MindfulList;
  onBack: () => void;
  onUpdateList: (updatedList: MindfulList) => void;
  onDeleteList: (listId: string) => void;
  onOpenShareModal: () => void;
  onOpenTimerModal: (task: TaskItem) => void;
}

export const OpenListScreen: React.FC<OpenListScreenProps> = ({
  list,
  onBack,
  onUpdateList,
  onDeleteList,
  onOpenShareModal,
  onOpenTimerModal,
}) => {
  const [newItemText, setNewItemText] = useState('');
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const theme = THEMES.find((t) => t.id === list.themeId) || THEMES[0];
  const activeItems = list.items.filter((item) => !item.completed);
  const completedItems = list.items.filter((item) => item.completed);

  // Toggle item check
  const handleToggleTask = (task: TaskItem) => {
    const updatedItems = list.items.map((item) => {
      if (item.id === task.id) {
        const nextState = !item.completed;
        if (nextState) {
          playZenChime('singing-bowl');
        } else {
          playZenChime('bamboo-wood');
        }
        return {
          ...item,
          completed: nextState,
          completedAt: nextState
            ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : undefined,
        };
      }
      return item;
    });

    onUpdateList({
      ...list,
      items: updatedItems,
    });
  };

  // Add new task item
  const handleAddItem = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newItemText.trim()) return;

    const newTask: TaskItem = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      text: newItemText.trim(),
      completed: false,
      hasTimer: true,
      durationMinutes: 15,
    };

    onUpdateList({
      ...list,
      items: [...list.items, newTask],
    });

    setNewItemText('');
    setIsAddingItem(false);
  };

  // Reset / Clear routine (unchecks all completed items so the routine can be rerun tomorrow)
  const handleResetRoutine = () => {
    playZenChime('soft-chime');
    const resetItems = list.items.map((item) => ({
      ...item,
      completed: false,
      completedAt: undefined,
    }));

    onUpdateList({
      ...list,
      items: resetItems,
    });
  };

  // Move item up or down
  const handleMoveItem = (index: number, direction: 'up' | 'down') => {
    const active = [...activeItems];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= active.length) return;

    const temp = active[index];
    active[index] = active[targetIndex];
    active[targetIndex] = temp;

    onUpdateList({
      ...list,
      items: [...active, ...completedItems],
    });
  };

  // Add a simple fillable table when clicked
  const handleAddFillableTable = () => {
    playZenChime('bamboo-wood');
    const newTable: RoutineTable = {
      headers: ['Item / Step', 'Details', 'Notes'],
      rows: [
        { id: `r-${Date.now()}-1`, cells: ['', '', ''], done: false },
        { id: `r-${Date.now()}-2`, cells: ['', '', ''], done: false },
      ],
    };
    onUpdateList({
      ...list,
      table: newTable,
    });
  };

  // Update header text in fillable table
  const handleUpdateHeader = (index: number, val: string) => {
    if (!list.table) return;
    const newHeaders = [...list.table.headers];
    newHeaders[index] = val;
    onUpdateList({
      ...list,
      table: {
        ...list.table,
        headers: newHeaders,
      },
    });
  };

  // Update cell text in fillable table
  const handleUpdateCell = (rowId: string, colIdx: number, val: string) => {
    if (!list.table) return;
    const updatedRows = list.table.rows.map((row) => {
      if (row.id === rowId) {
        const newCells = [...row.cells];
        newCells[colIdx] = val;
        return { ...row, cells: newCells };
      }
      return row;
    });
    onUpdateList({
      ...list,
      table: {
        ...list.table,
        rows: updatedRows,
      },
    });
  };

  // Add row to fillable table
  const handleAddTableRow = () => {
    if (!list.table) return;
    playZenChime('bamboo-wood');
    const emptyCells = new Array(list.table.headers.length).fill('');
    const newRow: TableRow = {
      id: `r-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      cells: emptyCells,
      done: false,
    };
    onUpdateList({
      ...list,
      table: {
        ...list.table,
        rows: [...list.table.rows, newRow],
      },
    });
  };

  // Add column to fillable table
  const handleAddTableColumn = () => {
    if (!list.table) return;
    playZenChime('bamboo-wood');
    const nextColNum = list.table.headers.length + 1;
    const newHeaders = [...list.table.headers, `Column ${nextColNum}`];
    const updatedRows = list.table.rows.map((row) => ({
      ...row,
      cells: [...row.cells, ''],
    }));
    onUpdateList({
      ...list,
      table: {
        headers: newHeaders,
        rows: updatedRows,
      },
    });
  };

  // Remove row from fillable table
  const handleRemoveTableRow = (rowId: string) => {
    if (!list.table) return;
    const filteredRows = list.table.rows.filter((r) => r.id !== rowId);
    onUpdateList({
      ...list,
      table: {
        ...list.table,
        rows:
          filteredRows.length > 0
            ? filteredRows
            : [{ id: `r-${Date.now()}`, cells: new Array(list.table.headers.length).fill(''), done: false }],
      },
    });
  };

  // Remove table entirely from list
  const handleRemoveTable = () => {
    onUpdateList({
      ...list,
      table: undefined,
    });
  };

  return (
    <div className="w-full max-w-3xl mx-auto pb-16 animate-fadeIn">
      {/* Web Navigation Bar */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/80 hover:bg-white text-[#3A4540] shadow-2xs border border-[#CCD4CA] transition-all active:scale-95 text-xs font-medium"
        >
          <ChevronLeft size={18} strokeWidth={2.2} />
          <span>Back to All Routines</span>
        </button>

        <div className="flex items-center gap-2">
          {!list.isPrivate && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/70 border border-[#CCD4CA] text-xs text-[#526356]">
              <Users size={13} />
              <span>Shared Routine</span>
            </div>
          )}

          {/* Right action pills: Share and Delete */}
          <div className="flex items-center gap-2 bg-white/90 rounded-full px-3 py-1.5 shadow-2xs border border-[#CCD4CA]">
            <button
              onClick={onOpenShareModal}
              className="flex items-center gap-1.5 text-xs font-medium text-[#3A4540] hover:text-[#2A6E3F] transition-colors px-1"
              title="Share routine or invite partner"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
                <polyline points="16 6 12 2 8 6" />
                <line x1="12" y1="2" x2="12" y2="15" />
              </svg>
              <span>Share</span>
            </button>

            <span className="text-[#C4CDC3]">|</span>

            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="text-[#3A4540] hover:text-[#9B3D44] transition-colors p-1"
              title="Delete this list"
              aria-label="Delete list"
            >
              <Trash2 size={16} strokeWidth={1.8} />
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl bg-[#F5F7F3] p-6 shadow-2xl border-2 border-[#9CAD9E] text-center">
            <h4 className="text-base font-semibold text-[#2D3748]">Delete "{list.title}"?</h4>
            <p className="mt-1.5 text-xs text-[#6B7870] leading-relaxed">
              Are you sure you want to remove this routine and its tasks? This action cannot be undone.
            </p>
            <div className="mt-5 flex gap-2.5 justify-center">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded-xl bg-[#E1E5DF] text-xs font-medium text-[#4A5568] hover:bg-[#D4DAD1] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  onDeleteList(list.id);
                }}
                className="px-4 py-2 rounded-xl bg-[#B85E65] text-white text-xs font-medium hover:bg-[#A34F56] transition-colors"
              >
                Delete List
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main List Workspace Card matching the authentic design */}
      <div
        className="rounded-[36px] p-8 md:p-10 shadow-sm transition-all"
        style={{
          backgroundColor: '#F3F5F1',
          border: `5px solid ${theme.borderColor}`,
          boxShadow: '0 8px 30px -4px rgba(45, 55, 72, 0.08)',
        }}
      >
        {/* Header inside card */}
        <div className="flex items-center justify-between pb-6 border-b border-[#E1E6DF]">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-2xl bg-white/70 shadow-2xs border border-[#CCD4CA]">
              <CategoryIcon icon={list.icon} size={26} className="text-[#2F3A33]" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-medium tracking-tight text-[#2A332E]">
                {list.title}
              </h1>
              <p className="text-xs text-[#718175] mt-0.5">
                {list.category.charAt(0).toUpperCase() + list.category.slice(1)} · Created for calm focus
              </p>
            </div>
          </div>
          <span className="text-sm font-medium text-[#445149] tracking-tight bg-white/80 px-3.5 py-1.5 rounded-full border border-[#D5DDD2]">
            {list.date}
          </span>
        </div>

        {/* Active / Uncompleted Items */}
        <div className="space-y-3.5 pt-6">
          <div className="flex items-center justify-between text-xs text-[#6F7D73] font-medium pb-1">
            <span>Routines & Tasks to complete:</span>
            <span>{activeItems.length} remaining</span>
          </div>

          {activeItems.map((task, idx) => (
            <div
              key={task.id}
              className="group flex items-center justify-between py-2.5 px-3 rounded-2xl hover:bg-black/[0.02] bg-white/40 border border-transparent hover:border-[#DEE3DC] transition-all"
            >
              <div className="flex items-center gap-3.5 flex-1 min-w-0">
                {/* 3-dots drag handle */}
                <div className="flex items-center text-[#4A5568] opacity-70 group-hover:opacity-100">
                  <div className="flex flex-col gap-[3px] py-1 cursor-grab" title="Reorder routine item">
                    <span className="w-1 h-1 rounded-full bg-[#3D4741]" />
                    <span className="w-1 h-1 rounded-full bg-[#3D4741]" />
                    <span className="w-1 h-1 rounded-full bg-[#3D4741]" />
                  </div>
                  {/* Reorder arrows on hover */}
                  <div className="hidden group-hover:flex flex-col ml-1">
                    <button
                      onClick={() => handleMoveItem(idx, 'up')}
                      disabled={idx === 0}
                      className="text-[#7A8880] hover:text-[#2D3748] disabled:opacity-20"
                      title="Move up"
                    >
                      <ChevronUp size={12} />
                    </button>
                    <button
                      onClick={() => handleMoveItem(idx, 'down')}
                      disabled={idx === activeItems.length - 1}
                      className="text-[#7A8880] hover:text-[#2D3748] disabled:opacity-20"
                      title="Move down"
                    >
                      <ChevronDown size={12} />
                    </button>
                  </div>
                </div>

                {/* Checkbox */}
                <button
                  onClick={() => handleToggleTask(task)}
                  className="w-5 h-5 rounded-[4px] border-2 border-[#333D37] flex items-center justify-center shrink-0 hover:border-[#8CA390] hover:bg-[#8CA390]/10 transition-colors"
                  aria-label={`Complete ${task.text}`}
                >
                  {/* Empty state */}
                </button>

                {/* Task Label */}
                <span className="text-base text-[#2E3732] truncate">
                  {task.text}
                </span>
              </div>

              {/* Task Timer Icon on right (Stopwatch / Alarm Clock matching screenshot 2) */}
              <button
                onClick={() => onOpenTimerModal(task)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[#3D4741] hover:bg-[#8CA390]/15 hover:text-[#24352A] transition-colors text-xs font-medium"
                title={`Start focus timer for "${task.text}"`}
                aria-label="Start timer"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="13" r="8" />
                  <path d="M12 9v4l2.5 2.5" />
                  <path d="M5 3L2 6" />
                  <path d="M22 6l-3-3" />
                  <path d="M12 2v2" />
                </svg>
                <span className="hidden sm:inline">Timer</span>
              </button>
            </div>
          ))}

          {activeItems.length === 0 && (
            <div className="py-6 text-center rounded-2xl bg-white/40 border border-[#DEE3DC]">
              <p className="text-sm text-[#6C7C71]">
                All tasks are checked off for today. You've cultivated your routine. 🌱
              </p>
            </div>
          )}
        </div>

        {/* Action buttons: "+ List item" and "⊞ Add table" */}
        <div className="mt-6 pt-3 space-y-3">
          {isAddingItem ? (
            <form onSubmit={handleAddItem} className="flex items-center gap-2.5 animate-fadeIn">
              <input
                type="text"
                autoFocus
                placeholder="What mindful step would you like to add?"
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                className="flex-1 px-4 py-2.5 text-sm bg-white rounded-2xl border border-[#CCD3CB] focus:outline-hidden focus:border-[#8CA390] shadow-2xs"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-[#8CA390] text-white rounded-2xl text-xs font-medium hover:bg-[#788E7C] shadow-2xs"
              >
                Add Item
              </button>
              <button
                type="button"
                onClick={() => setIsAddingItem(false)}
                className="p-2 text-[#7A8880] hover:text-[#2D3748]"
              >
                <X size={18} />
              </button>
            </form>
          ) : (
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => setIsAddingItem(true)}
                className="flex items-center gap-2.5 text-base text-[#2E3732] hover:text-[#1F2722] py-1.5 px-2 rounded-xl hover:bg-black/5 transition-colors group"
              >
                <Plus size={20} strokeWidth={2.2} className="text-[#333D37] group-hover:scale-110 transition-transform" />
                <span className="font-medium">List item</span>
              </button>

              {!list.table && (
                <button
                  type="button"
                  onClick={handleAddFillableTable}
                  className="flex items-center gap-2.5 text-base text-[#2E3732] hover:text-[#1F2722] py-1.5 px-2 rounded-xl hover:bg-black/5 transition-colors group"
                >
                  <div className="w-5 h-5 border-2 border-[#333D37] rounded-[3px] grid grid-cols-2 grid-rows-2 p-[1px] gap-[1px]">
                    <span className="bg-[#333D37]" />
                    <span className="bg-[#333D37]" />
                    <span className="bg-[#333D37]" />
                    <span className="bg-[#333D37]" />
                  </div>
                  <span className="font-medium">Add table</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Simple Fillable Table (Added when user clicks "Add table") */}
        {list.table && (
          <div className="mt-6 p-4 md:p-5 rounded-3xl bg-white/80 border border-[#DEE3DC] shadow-2xs animate-fadeIn">
            {/* Table Header Controls */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E3E8E2]">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-[#5A6E60] rounded-[2px] grid grid-cols-2 grid-rows-2 p-[1px] gap-[1px]">
                  <span className="bg-[#5A6E60]" />
                  <span className="bg-[#5A6E60]" />
                  <span className="bg-[#5A6E60]" />
                  <span className="bg-[#5A6E60]" />
                </div>
                <span className="text-xs font-semibold text-[#48554D] uppercase tracking-wider">
                  Fillable Table
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAddTableColumn}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white text-[11px] font-medium text-[#465E4E] border border-[#CCD4CA] hover:bg-[#F3F5F1] transition-colors shadow-2xs"
                  title="Add a new column"
                >
                  <Plus size={12} />
                  <span>Column</span>
                </button>

                <button
                  type="button"
                  onClick={handleAddTableRow}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white text-[11px] font-medium text-[#465E4E] border border-[#CCD4CA] hover:bg-[#F3F5F1] transition-colors shadow-2xs"
                  title="Add a new row"
                >
                  <Plus size={12} />
                  <span>Row</span>
                </button>

                <button
                  type="button"
                  onClick={handleRemoveTable}
                  className="p-1.5 rounded-lg text-[#994D53] hover:bg-[#B85E65]/10 transition-colors ml-1"
                  title="Remove table"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            {/* Editable Table Matrix */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#E3E8E2]">
                    {list.table.headers.map((h, i) => (
                      <th key={i} className="pb-2 px-1 font-medium">
                        <input
                          type="text"
                          value={h}
                          onChange={(e) => handleUpdateHeader(i, e.target.value)}
                          placeholder={`Column ${i + 1}`}
                          className="w-full bg-transparent px-2.5 py-1 font-semibold text-[#48554D] rounded-lg hover:bg-black/5 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#8CA390] transition-colors"
                        />
                      </th>
                    ))}
                    <th className="w-7 pb-2" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EBEFEA]">
                  {list.table.rows.map((row) => (
                    <tr key={row.id} className="group hover:bg-black/[0.015] transition-colors">
                      {row.cells.map((cellVal, colIdx) => (
                        <td key={colIdx} className="py-1 px-1">
                          <input
                            type="text"
                            value={cellVal}
                            onChange={(e) => handleUpdateCell(row.id, colIdx, e.target.value)}
                            placeholder="Type here..."
                            className="w-full bg-transparent px-2.5 py-1.5 text-xs text-[#2D3748] rounded-lg border border-transparent hover:border-[#CCD4CA] focus:bg-white focus:border-[#8CA390] focus:outline-hidden focus:ring-1 focus:ring-[#8CA390] transition-colors placeholder-[#9CA9A0]"
                          />
                        </td>
                      ))}
                      <td className="py-1 px-1 text-right">
                        <button
                          type="button"
                          onClick={() => handleRemoveTableRow(row.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-[#99A69D] hover:text-[#B85E65] transition-all rounded-md"
                          title="Delete row"
                        >
                          <X size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Bottom Add Row Bar */}
            <div className="mt-3 pt-2.5 border-t border-[#EEF2EC] flex justify-between items-center">
              <button
                type="button"
                onClick={handleAddTableRow}
                className="flex items-center gap-1.5 text-xs text-[#526857] hover:text-[#253A2B] font-medium py-1 px-2 rounded-lg hover:bg-black/5 transition-colors"
              >
                <Plus size={14} />
                <span>Add row</span>
              </button>

              <span className="text-[11px] text-[#7B8B80]">
                Simple fillable table · Click any cell or header to type
              </span>
            </div>
          </div>
        )}

        {/* Hairline Divider */}
        <div className="my-7 border-b border-[#D6DDD4]" />

        {/* Completed items section with strike-through */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-[#6F7D73] font-medium pb-1">
            <span>Completed milestones:</span>
            <span>{completedItems.length} checked off</span>
          </div>

          {completedItems.map((task) => (
            <div
              key={task.id}
              className="flex items-center gap-3.5 py-2 px-3 rounded-2xl hover:bg-black/[0.02] transition-colors"
            >
              {/* Checked Box */}
              <button
                onClick={() => handleToggleTask(task)}
                className="w-5 h-5 rounded-[4px] bg-[#333D37] border-2 border-[#333D37] flex items-center justify-center shrink-0 hover:opacity-90 transition-opacity"
                aria-label={`Uncheck ${task.text}`}
              >
                <Check size={13} className="text-white" strokeWidth={3} />
              </button>

              {/* Strikethrough Text */}
              <span className="text-base text-[#38433D] line-through decoration-[#38433D]/60 flex-1 truncate">
                {task.text}
              </span>

              {task.completedAt && (
                <span className="text-xs text-[#86948B] tabular-nums">
                  {task.completedAt}
                </span>
              )}
            </div>
          ))}

          {completedItems.length === 0 && (
            <p className="text-xs text-[#8A978E] italic py-2">
              No completed items yet. Take one gentle step at a time.
            </p>
          )}

          {/* Bottom Right "Clear" Broom / Sweep button matching screenshot 2 */}
          <div className="flex justify-end pt-5">
            <button
              onClick={handleResetRoutine}
              className="flex items-center gap-2 text-base font-medium text-[#2E3732] hover:text-[#18201B] active:scale-95 transition-all py-2 px-3.5 rounded-xl hover:bg-black/5"
              title="Reset all completed tasks for tomorrow"
            >
              <span>Clear</span>
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
                <path d="M18 3l-6 6" />
                <path d="M12 9l-2 2a4 4 0 0 0 5.66 5.66l2-2" />
                <path d="M5 19l4-4" />
                <path d="M3 21l2-2" />
                <path d="M8 16l-3 3" />
                <path d="M14 20l2-2" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
