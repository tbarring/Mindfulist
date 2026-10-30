import React, { useState } from 'react';
import { X, Lock, Users, Link2, Check, UserPlus } from 'lucide-react';
import { MindfulList } from '../types/mindfulist';

interface ShareListModalProps {
  list: MindfulList;
  isOpen: boolean;
  onClose: () => void;
  onUpdateList: (updatedList: MindfulList) => void;
}

export const ShareListModal: React.FC<ShareListModalProps> = ({
  list,
  isOpen,
  onClose,
  onUpdateList,
}) => {
  const [emailInput, setEmailInput] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleTogglePrivacy = (isPrivate: boolean) => {
    onUpdateList({
      ...list,
      isPrivate,
    });
  };

  const handleAddCollaborator = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    const currentShared = list.sharedWith || [];
    if (!currentShared.includes(emailInput.trim())) {
      onUpdateList({
        ...list,
        isPrivate: false,
        sharedWith: [...currentShared, emailInput.trim()],
      });
    }
    setEmailInput('');
  };

  const handleRemoveCollaborator = (email: string) => {
    const updated = (list.sharedWith || []).filter((e) => e !== email);
    onUpdateList({
      ...list,
      sharedWith: updated,
      isPrivate: updated.length === 0 ? true : list.isPrivate,
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2D3748]/40 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-sm rounded-3xl bg-[#F4F6F2] p-6 shadow-2xl border-4 border-[#9CAD9E] text-[#2D3748]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E1E5DF]">
          <div className="flex items-center gap-2">
            <Users size={18} className="text-[#657A6B]" />
            <h3 className="text-base font-semibold text-[#2D3748]">
              Share & Privacy
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-black/5 text-[#5F6D64]"
          >
            <X size={18} />
          </button>
        </div>

        <p className="mt-3 text-xs text-[#6F7C74]">
          Control who can view and complete routine items in <strong>{list.title}</strong>.
        </p>

        {/* Privacy Selector */}
        <div className="mt-4 grid grid-cols-2 gap-2 p-1 bg-[#E4EAE2] rounded-2xl">
          <button
            onClick={() => handleTogglePrivacy(true)}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-medium transition-all ${
              list.isPrivate
                ? 'bg-white text-[#2D3748] shadow-xs'
                : 'text-[#627367] hover:text-[#2D3748]'
            }`}
          >
            <Lock size={14} />
            <span>Private</span>
          </button>

          <button
            onClick={() => handleTogglePrivacy(false)}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-medium transition-all ${
              !list.isPrivate
                ? 'bg-white text-[#2D3748] shadow-xs'
                : 'text-[#627367] hover:text-[#2D3748]'
            }`}
          >
            <Users size={14} />
            <span>Shared Routine</span>
          </button>
        </div>

        {/* Invite Routine Partner */}
        {!list.isPrivate && (
          <div className="mt-4">
            <label className="block text-xs font-medium text-[#526156] mb-1.5">
              Invite friend or study partner
            </label>
            <form onSubmit={handleAddCollaborator} className="flex gap-1.5">
              <input
                type="email"
                placeholder="partner@example.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="flex-1 px-3 py-2 text-xs rounded-xl bg-white border border-[#D5DCD4] focus:outline-hidden focus:border-[#8FA491]"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-[#8CA390] text-white rounded-xl text-xs font-medium hover:bg-[#788F7C] transition-colors flex items-center gap-1"
              >
                <UserPlus size={14} />
                <span>Add</span>
              </button>
            </form>

            {/* List of collaborators */}
            {list.sharedWith && list.sharedWith.length > 0 && (
              <div className="mt-3 space-y-1.5">
                <span className="text-[11px] font-medium text-[#7A887F]">Collaborators:</span>
                {list.sharedWith.map((email) => (
                  <div
                    key={email}
                    className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-white/70 text-xs border border-[#E0E6DF]"
                  >
                    <span className="text-[#3F4A42] truncate">{email}</span>
                    <button
                      onClick={() => handleRemoveCollaborator(email)}
                      className="text-[#994D53] hover:text-[#7A363B] text-[11px] font-medium ml-2"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Copy Invite Link */}
        <div className="mt-5 pt-3 border-t border-[#E1E5DF]">
          <button
            onClick={handleCopyLink}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#E4EAE2] text-[#47574B] text-xs font-medium hover:bg-[#D9E1D7] transition-colors"
          >
            {copied ? <Check size={14} className="text-emerald-600" /> : <Link2 size={14} />}
            <span>{copied ? 'Link copied to clipboard!' : 'Copy routine sharing link'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
