import React from 'react';
import { Bookmark as BookmarkIcon, BookOpen, Trash2, Edit3, Sparkles } from 'lucide-react';
import { Shloka, Bookmark, UserPreferences } from '../types';
import { getShlokaTitle, getShlokaChapterName, getShlokaMeaning, LANGUAGE_METADATA } from '../utils/translationHelper';
import { getUIStrings } from '../utils/i18n';

interface BookmarksViewProps {
  bookmarks: Bookmark[];
  shlokas: Shloka[];
  preferences?: UserPreferences;
  onRemoveBookmark: (shlokaId: number) => void;
  onSelectShloka: (shlokaId: number) => void;
}

export const BookmarksView: React.FC<BookmarksViewProps> = ({
  bookmarks,
  shlokas,
  preferences,
  onRemoveBookmark,
  onSelectShloka
}) => {
  const shlokaMap = new Map<number, Shloka>(shlokas.map(s => [s.id, s]));
  const lang = preferences?.activeLanguage || 'gujarati';
  const ui = getUIStrings(lang);
  const langMeta = LANGUAGE_METADATA[lang] || LANGUAGE_METADATA.gujarati;

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      {/* Title */}
      <div className="bg-gradient-to-r from-[#8B2500] via-[#A83200] to-[#C4820F] rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-2xl bg-amber-400 text-amber-950">
            <BookmarkIcon className="w-6 h-6 fill-current" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-amber-50">
              {lang === 'hindi' ? 'सहेजे गए श्लोक एवं व्यक्तिगत टिप्पणियाँ' : lang === 'english' ? 'Saved Shlokas & Personal Notes' : 'સાચવેલા શ્લોકો અને અંગત નોંધો'}
            </h2>
            <p className="text-xs sm:text-sm text-amber-100/80">
              Saved Shlokas & Personal Study Reflections ({bookmarks.length} saved)
            </p>
          </div>
        </div>
      </div>

      {/* Bookmarks List */}
      {bookmarks.length > 0 ? (
        <div className="space-y-4">
          {bookmarks.map((bm) => {
            const shloka = shlokaMap.get(bm.shlokaId);
            if (!shloka) return null;

            return (
              <div
                key={bm.shlokaId}
                className="bg-white dark:bg-[#221D1A] rounded-2xl p-5 shadow-md border border-[#E8DFD1] dark:border-[#3D342C] space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-amber-500 text-amber-950 font-bold flex items-center justify-center text-xs">
                      #{shloka.id}
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-sm sm:text-base text-[#8B2500] dark:text-amber-300">
                        {getShlokaTitle(shloka, lang)}
                      </h4>
                      <span className="text-xs text-[#8A7A68] dark:text-[#A89886]">
                        {ui.chapterPrefix} {shloka.chapterId}: {getShlokaChapterName(shloka, lang)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectShloka(shloka.id)}
                      className="px-3 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 text-xs font-semibold hover:bg-amber-200 transition flex items-center gap-1 cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{ui.tabReader} ➔</span>
                    </button>
                    <button
                      onClick={() => onRemoveBookmark(shloka.id)}
                      title="Remove Bookmark"
                      className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Sanskrit text (Untouched) */}
                <div className="p-3 rounded-xl bg-[#FAF6F0] dark:bg-[#2A231D] text-xs font-sanskrit text-[#731E00] dark:text-[#F39C38] whitespace-pre-line font-bold">
                  {shloka.sanskritDevanagari}
                </div>

                {/* Meaning in active language */}
                <p className="text-xs text-[#4A3E34] dark:text-[#D1C5B7]">
                  <strong className="text-[#8B2500] dark:text-amber-400">{langMeta.nativeName}:</strong> {getShlokaMeaning(shloka, lang)}
                </p>

                {/* Personal Note if exists */}
                {bm.note && (
                  <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-[#261E18] border border-amber-300/40 text-xs text-amber-950 dark:text-amber-200">
                    <strong className="block text-[11px] text-amber-800 dark:text-amber-300 mb-0.5">
                      તમારી નોંધ (Note):
                    </strong>
                    {bm.note}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white dark:bg-[#221D1A] rounded-3xl p-12 text-center border border-[#E8DFD1] dark:border-[#3D342C] space-y-3">
          <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 mx-auto flex items-center justify-center">
            <BookmarkIcon className="w-8 h-8" />
          </div>
          <h3 className="text-base font-serif font-bold text-[#8B2500] dark:text-amber-300">
            કોઈ બુકમાર્ક સાચવેલા નથી
          </h3>
          <p className="text-xs text-[#6B5E51] dark:text-[#A89886] max-w-sm mx-auto">
            શ્લોક કાર્ડ પર રહેલા બુકમાર્ક આઇકન (🔖) પર ક્લિક કરીને તમારા મનપસંદ શ્લોકો અને અંગત નોંધો અહીં સાચવી શકો છો.
          </p>
        </div>
      )}
    </div>
  );
};
