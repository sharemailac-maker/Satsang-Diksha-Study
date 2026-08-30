import React, { useState } from 'react';
import { X, Hash, ArrowRight, Sparkles } from 'lucide-react';

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

  const keyVerses = [
    { id: 1, label: '૧. મંગલાચરણ (શ્રીમત્પરબ્રહ્મ)' },
    { id: 2, label: '૨. અક્ષર-પુરુષોત્તમ સિદ્ધાંત' },
    { id: 5, label: '૫. દીક્ષા સંકલ્પ' },
    { id: 18, label: '૧૮. અક્ષરબ્રહ્મ ગુરુ' },
    { id: 45, label: '૪૫. પ્રાતઃ પૂજા વિધિ' },
    { id: 54, label: '૫૪. તિલક-ચાંદલો વિધિ' },
    { id: 61, label: '૬૧. માનસી પૂજા' },
    { id: 84, label: '૮૪. સાત્વિક આહાર' },
    { id: 116, label: '૧૧૬. માતા-પિતા સેવા' },
    { id: 161, label: '૧૬૧. ઘરસભા નિયમ' },
    { id: 201, label: '૨૦૧. અંતઃશત્રુ ત્યાગ' },
    { id: 251, label: '૨૫૧. અક્ષરરૂપ ભાવના' },
    { id: 315, label: '૩૧૫. ફલશ્રુતિ (અક્ષરધામ)' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-[#221D1A] w-full max-w-md rounded-3xl shadow-2xl border border-[#E8DFD1] dark:border-[#3D342C] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#8B2500] to-[#C4820F] px-5 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Hash className="w-5 h-5 text-amber-300" />
            <h3 className="font-serif font-bold text-base text-amber-50">
              શ્લોક ક્રમાંક પર જાઓ (Jump to Shloka #)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
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
                className="px-5 py-3 rounded-2xl bg-[#8B2500] hover:bg-[#A63000] text-white font-bold text-sm transition shadow-md flex items-center gap-1 flex-shrink-0"
              >
                <span>ખોલો</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Quick jump to Key Verses */}
          <div className="space-y-2 pt-2 border-t border-[#F2EADB] dark:border-[#352D26]">
            <span className="text-xs font-bold text-[#6B5E51] dark:text-[#C5B7A8] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              મુખ્ય શ્લોકો (Key Famous Verses):
            </span>
            <div className="grid grid-cols-1 gap-1.5 max-h-48 overflow-y-auto pr-1">
              {keyVerses.map((kv) => (
                <button
                  key={kv.id}
                  onClick={() => handleJump(kv.id)}
                  className="w-full text-left px-3 py-2 rounded-xl bg-[#FAF6F0] dark:bg-[#2C241F] hover:bg-amber-100 dark:hover:bg-amber-950/40 text-xs font-medium text-[#4A3E34] dark:text-[#E2D8CC] flex items-center justify-between transition"
                >
                  <span>{kv.label}</span>
                  <span className="text-[10px] text-amber-700 dark:text-amber-400 font-mono">#{kv.id}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
