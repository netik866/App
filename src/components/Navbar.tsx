import React from 'react';
import { ShieldCheck, Globe, Building2, UserPlus, QrCode } from 'lucide-react';
import { AppLanguage } from '../types';
import { translations } from '../utils/translations';

interface NavbarProps {
  currentLang: AppLanguage;
  onLanguageChange: (lang: AppLanguage) => void;
  onOpenNewHelpModal: () => void;
  onOpenQuickGatePass: () => void;
  activeCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLang,
  onLanguageChange,
  onOpenNewHelpModal,
  onOpenQuickGatePass,
  activeCount,
}) => {
  const t = translations[currentLang];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand & Society Info */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-sm ring-2 ring-emerald-100">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-snug">
                  {t.societyName}
                </h1>
                <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  RWA Certified
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                {t.subHeader} • <span className="text-emerald-600 font-semibold">{activeCount} staff inside premises</span>
              </p>
            </div>
          </div>

          {/* Actions & Language Selector */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Multilingual Selector */}
            <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
              <Globe className="w-4 h-4 text-slate-500 ml-1.5 mr-1" />
              <button
                type="button"
                id="btn-lang-en"
                onClick={() => onLanguageChange('en')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  currentLang === 'en'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                id="btn-lang-hi"
                onClick={() => onLanguageChange('hi')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  currentLang === 'hi'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                हिन्दी
              </button>
              <button
                type="button"
                id="btn-lang-mr"
                onClick={() => onLanguageChange('mr')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  currentLang === 'mr'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                मराठी
              </button>
            </div>

            {/* Quick Gate Pass / Check-In button */}
            <button
              type="button"
              id="btn-quick-gate"
              onClick={onOpenQuickGatePass}
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-slate-600" />
              <span>Gate Terminal</span>
            </button>

            {/* Add New Daily Help button */}
            <button
              type="button"
              id="btn-add-daily-help"
              onClick={onOpenNewHelpModal}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span className="hidden sm:inline">{t.addNewHelp}</span>
              <span className="sm:hidden">+ Register</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
