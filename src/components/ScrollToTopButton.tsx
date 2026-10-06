import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { UserPreferences } from '../types';
import { getUIStrings } from '../utils/i18n';

interface ScrollToTopButtonProps {
  preferences?: UserPreferences;
}

export const ScrollToTopButton: React.FC<ScrollToTopButtonProps> = ({ preferences }) => {
  const [isVisible, setIsVisible] = useState(false);
  const lang = preferences?.activeLanguage || preferences?.appLanguage || 'gujarati';
  const isGu = lang === 'gujarati' || lang === 'hindi';

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center gap-1.5 px-3.5 py-2.5 rounded-full bg-[#8B2500] hover:bg-[#A83200] text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 border border-amber-400/30 group"
      title="Go to top"
      aria-label="Go to top"
    >
      <ArrowUp className="w-4 h-4 text-amber-300 group-hover:animate-bounce" />
      <span className="text-xs font-medium font-serif tracking-wide">
        {isGu ? 'ઉપર જાઓ ^' : 'Top ^'}
      </span>
    </button>
  );
};
