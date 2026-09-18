import React, { useState } from 'react';
import { X, Hash, ArrowRight, BookOpen, Layers } from 'lucide-react';
import { CHAPTERS } from '../data/chapters';

interface QuickJumpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJumpToShloka: (shlokaId: number) => void;
}

export const QuickJumpModal: React.FC<QuickJumpModalProps> = ({
  isOpen,
  onClose,
  onJumpToShloka
}) => {
  const [inputVal, setInputVal] = useState('');

  if (!isOpen) return null;

  const handleJump = (id: number) => {
    if (id >= 1 && id <= 315) {
      onJumpToShloka(id);
      onClose();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(inputVal, 10);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= 315) {
      handleJump(parsed);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-[#221D1A] w-full max-w-md rounded-3xl shadow-2xl border border-[#E8DFD1] dark:border-[#3D342C] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#8B2500] to-[#C4820F] px-5 py-4 text-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <Hash className="w-5 h-5 text-amber-300" />
            <h3 className="font-serif font-bold text-base text-amber-50">
              શ્લોક ક્રમાંક પર જાઓ (Jump to Shloka #)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          <form onSubmit={handleSubmit} className="space-y-3">
            <label className="text-xs font-bold text-[#8B2500] dark:text-amber-400 block">
              શ્લોક નંબર લખો (૧ થી ૩૧૫):
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="315"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="દા.ત. 54"
                className="w-full bg-[#FAF6F0] dark:bg-[#2C241F] text-[#2D241E] dark:text-[#EDE5D8] text-lg font-mono font-bold p-3 rounded-2xl border-2 border-amber-400/40 focus:outline-none focus:border-amber-500 text-center"
                autoFocus
              />
              <button
                type="submit"
                className="px-5 py-3 rounded-2xl bg-[#8B2500] hover:bg-[#A63000] text-white font-bold text-sm transition shadow-md flex items-center gap-1 flex-shrink-0 cursor-pointer"
              >
                <span>ખોલો</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Study Prakran Verses (All 10 Chapters with verse ranges) */}
          <div className="space-y-2.5 pt-3 border-t border-[#F2EADB] dark:border-[#352D26]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#6B5E51] dark:text-[#C5B7A8] flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>અધ્યયન પ્રકરણ શ્લોકો (Study Prakran Verses):</span>
              </span>
              <span className="text-[10px] text-[#8B2500] dark:text-amber-400 font-medium">
                પ્રકરણ ૧ થી ૧૦
              </span>
            </div>

            <div className="grid grid-cols-1 gap-1.5 max-h-56 overflow-y-auto pr-1">
              {CHAPTERS.map((ch) => {
                const [startVerse, endVerse] = ch.shlokaRange;
                return (
                  <button
                    key={ch.id}
                    onClick={() => handleJump(startVerse)}
                    className="w-full text-left px-3 py-2.5 rounded-xl bg-[#FAF6F0] dark:bg-[#2C241F] hover:bg-amber-100 dark:hover:bg-amber-950/50 border border-amber-200/40 dark:border-stone-800 text-xs font-medium text-[#4A3E34] dark:text-[#E2D8CC] flex items-center justify-between transition cursor-pointer group"
                    title={`પ્રકરણ ${ch.id}: ${ch.titleGu} • શ્લોક ${startVerse} પર જાઓ`}
                  >
                    <div className="flex items-center gap-2 min-w-0 pr-2">
                      <span className="w-5 h-5 rounded-full bg-amber-500/20 text-[#8B2500] dark:text-amber-400 font-bold text-[11px] flex items-center justify-center flex-shrink-0">
                        {ch.id}
                      </span>
                      <span className="truncate font-semibold text-[#2D241E] dark:text-stone-200 group-hover:text-[#8B2500] dark:group-hover:text-amber-300">
                        {ch.titleGu}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <span className="px-2 py-0.5 rounded-md bg-white dark:bg-[#1A1410] border border-amber-300/60 dark:border-stone-700 text-[11px] font-mono font-bold text-[#8B2500] dark:text-amber-300">
                        શ્લોક {startVerse}–{endVerse}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
