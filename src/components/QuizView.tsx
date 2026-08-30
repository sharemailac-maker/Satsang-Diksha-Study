import React, { useState } from 'react';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  HelpCircle, 
  Sparkles, 
  BookOpen, 
  ChevronRight,
  Trophy
} from 'lucide-react';
import { QuizQuestion } from '../types';
import { QUIZ_QUESTIONS } from '../data/quizData';

interface QuizViewProps {
  onSelectShloka: (id: number) => void;
}

export const QuizView: React.FC<QuizViewProps> = ({ onSelectShloka }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [userAnswers, setUserAnswers] = useState<{ qId: string; selected: number; isCorrect: boolean }[]>([]);

  const currentQ = QUIZ_QUESTIONS[currentIdx];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    const isCorrect = idx === currentQ.correctIndex;
    if (isCorrect) {
      setScore(score + 1);
    }

    setUserAnswers([...userAnswers, { qId: currentQ.id, selected: idx, isCorrect }]);
  };

  const handleNext = () => {
    if (currentIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
    setUserAnswers([]);
  };

  const percentage = Math.round((score / QUIZ_QUESTIONS.length) * 100);

  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      {/* Quiz Banner */}
      <div className="bg-gradient-to-r from-[#8B2500] via-[#A83200] to-[#C4820F] rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-300" />
              <span className="text-xs font-bold uppercase tracking-wider text-amber-200">
                સત્સંગ દીક્ષા સ્વાધ્યાય કસોટી
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-amber-50">
              Satsang Diksha Knowledge Quiz
            </h2>
          </div>

          <div className="text-right">
            <span className="text-xs text-amber-200">સ્કોર:</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-mono">
              {score}/{QUIZ_QUESTIONS.length}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        {!isFinished && (
          <div className="mt-4 space-y-1">
            <div className="w-full bg-black/30 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-amber-300 h-full transition-all duration-300"
                style={{ width: `${((currentIdx + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-amber-200">
              <span>પ્રશ્ન {currentIdx + 1} of {QUIZ_QUESTIONS.length}</span>
              <span>{Math.round(((currentIdx + 1) / QUIZ_QUESTIONS.length) * 100)}%</span>
            </div>
          </div>
        )}
      </div>

      {/* Quiz Body */}
      {!isFinished ? (
        <div className="bg-white dark:bg-[#221D1A] rounded-3xl p-6 sm:p-8 shadow-lg border border-[#E8DFD1] dark:border-[#3D342C] space-y-6">
          {/* Question text */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-amber-800 dark:text-amber-400 font-bold">
              <span>સંદર્ભ શ્લોક #{currentQ.shlokaId}</span>
              <button
                onClick={() => onSelectShloka(currentQ.shlokaId)}
                className="hover:underline flex items-center gap-1"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>શ્લોક વાંચો</span>
              </button>
            </div>
            <h3 className="text-base sm:text-lg font-serif font-bold text-[#2D241E] dark:text-[#EDE5D8] leading-relaxed">
              {currentQ.question}
            </h3>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQ.correctIndex;
              let btnStyle = "bg-[#FAF6F0] dark:bg-[#2C241F] border-[#E8DFD1] dark:border-[#3D342C] text-[#2D241E] dark:text-[#EDE5D8] hover:bg-[#F2EADB]";

              if (isAnswered) {
                if (isCorrect) {
                  btnStyle = "bg-emerald-100 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold";
                } else if (isSelected) {
                  btnStyle = "bg-red-100 dark:bg-red-950/60 border-red-500 text-red-900 dark:text-red-200";
                } else {
                  btnStyle = "opacity-50 bg-[#FAF6F0] dark:bg-[#2C241F]";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswered}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center justify-between text-sm ${btnStyle}`}
                >
                  <span className="flex-1 pr-2">{opt}</span>
                  {isAnswered && (
                    <div className="flex-shrink-0">
                      {isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
                      {isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Box */}
          {isAnswered && (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-[#29201A] border border-amber-300 dark:border-amber-900/50 space-y-2 animate-fadeIn">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 dark:text-amber-300">
                <Sparkles className="w-4 h-4" />
                <span>શાસ્ત્રીય ખુલાસો (Explanation):</span>
              </div>
              <p className="text-xs text-[#54473C] dark:text-[#D1C5B7] leading-relaxed">
                {currentQ.explanation}
              </p>
            </div>
          )}

          {/* Next Button */}
          {isAnswered && (
            <div className="pt-4 flex justify-end">
              <button
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-[#8B2500] hover:bg-[#A63000] text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition shadow-md"
              >
                <span>{currentIdx === QUIZ_QUESTIONS.length - 1 ? 'પરિણામ જુઓ (See Results)' : 'આગળનો પ્રશ્ન (Next)'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Results Screen */
        <div className="bg-white dark:bg-[#221D1A] rounded-3xl p-8 shadow-xl border border-[#E8DFD1] dark:border-[#3D342C] text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-950/60 text-[#8B2500] dark:text-amber-300 mx-auto flex items-center justify-center shadow-inner border-2 border-amber-400">
            <Trophy className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-serif font-bold text-[#8B2500] dark:text-amber-300">
              કસોટી પૂર્ણ! (Quiz Completed)
            </h3>
            <p className="text-sm text-[#6B5E51] dark:text-[#C5B7A8]">
              તમારો સ્કોર: <strong className="text-xl text-[#8B2500] dark:text-amber-300">{score}</strong> / {QUIZ_QUESTIONS.length} ({percentage}%)
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-[#2A211B] border border-amber-300 max-w-md mx-auto text-xs text-amber-900 dark:text-amber-200">
            {percentage >= 80 ? '🌟 અદ્ભુત સ્વાધ્યાય! સત્સંગ દીક્ષાના સિદ્ધાંતોનું ઉત્કૃષ્ટ જ્ઞાન.' :
             percentage >= 50 ? '👍 સારો પ્રયાસ! વધુ સ્વાધ્યાય અને મુખપાઠ દ્વારા જ્ઞાન દૃઢ કરો.' :
             '📖 સત્સંગ દીક્ષા શ્લોક અધ્યયન વિભાગમાં જઈને ફરીથી અભ્યાસ કરો.'}
          </div>

          <button
            onClick={handleRestart}
            className="px-6 py-3 rounded-2xl bg-[#8B2500] hover:bg-[#A63000] text-white font-bold text-sm inline-flex items-center gap-2 transition shadow-md"
          >
            <RotateCcw className="w-4 h-4" />
            <span>ફરીથી કસોટી આપો (Restart Quiz)</span>
          </button>
        </div>
      )}
    </div>
  );
};
