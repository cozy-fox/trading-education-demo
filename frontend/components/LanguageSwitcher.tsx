'use client';

import { useState, useRef, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { locales, localeNames, localeFlags, type Locale } from '@/lib/i18n';

export default function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLocale, setCurrentLocale] = useState<Locale>('en');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Get current locale from localStorage or default to 'en'
    const savedLocale = (localStorage.getItem('locale') as Locale) || 'en';
    setCurrentLocale(savedLocale);

    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (locale: Locale) => {
    setCurrentLocale(locale);
    localStorage.setItem('locale', locale);
    setIsOpen(false);
    // Reload page to apply new language
    window.location.reload();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1.5 sm:space-x-2 px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl bg-gradient-to-br from-dark-800 to-dark-900 hover:from-dark-700 hover:to-dark-800 border border-primary-500/30 transition-all duration-300 hover:shadow-glow hover:border-primary-500/50 group"
        aria-label="Change language"
      >
        <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-primary-400 group-hover:text-primary-300 transition-colors" />
        <span className="text-white font-semibold hidden lg:inline text-sm sm:text-base">
          {localeFlags[currentLocale]} {localeNames[currentLocale]}
        </span>
        <span className="text-white font-semibold lg:hidden text-base sm:text-lg">
          {localeFlags[currentLocale]}
        </span>
        <svg
          className={`w-3 h-3 sm:w-4 sm:h-4 text-primary-400 transition-transform duration-300 hidden sm:block ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 sm:w-64 glass-card overflow-hidden z-50 animate-slide-down shadow-2xl border-2 border-primary-500/20">
          <div className="py-2">
            <div className="px-4 py-2 border-b border-dark-700/50">
              <p className="text-xs font-semibold text-dark-400 uppercase tracking-wider">Select Language</p>
            </div>
            {locales.map((locale) => (
              <button
                key={locale}
                onClick={() => handleLanguageChange(locale)}
                className={`w-full px-4 py-3.5 text-left flex items-center space-x-3 transition-all duration-200 group ${
                  currentLocale === locale
                    ? 'bg-gradient-to-r from-primary-600/30 to-primary-500/20 text-white border-l-4 border-primary-500'
                    : 'text-gray-300 hover:bg-dark-700/50 hover:text-white border-l-4 border-transparent'
                }`}
              >
                <span className="text-2xl sm:text-3xl transform group-hover:scale-110 transition-transform">{localeFlags[locale]}</span>
                <div className="flex-1">
                  <span className="font-semibold text-sm sm:text-base block">{localeNames[locale]}</span>
                  {currentLocale === locale && (
                    <span className="text-xs text-primary-400">Currently selected</span>
                  )}
                </div>
                {currentLocale === locale && (
                  <svg className="w-5 h-5 text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

