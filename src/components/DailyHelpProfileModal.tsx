import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Phone, 
  Globe, 
  MapPin, 
  Building, 
  Star, 
  Calendar, 
  KeyRound, 
  CreditCard, 
  HeartHandshake, 
  CheckCircle2 
} from 'lucide-react';
import { DailyHelp, AppLanguage } from '../types';
import { translations } from '../utils/translations';

interface DailyHelpProfileModalProps {
  help: DailyHelp | null;
  onClose: () => void;
  appLang: AppLanguage;
  onCheckIn?: (helpId: string) => void;
  onCheckOut?: (helpId: string) => void;
}

export const DailyHelpProfileModal: React.FC<DailyHelpProfileModalProps> = ({
  help,
  onClose,
  appLang,
  onCheckIn,
  onCheckOut,
}) => {
  const t = translations[appLang];
  // Local profile language toggle (English, Hindi, Marathi)
  const [profileLang, setProfileLang] = useState<AppLanguage>(appLang);

  if (!help) return null;

  const currentBio = help.multilingual[profileLang] || help.multilingual.en;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full p-5 sm:p-7 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 my-6">
        {/* Top bar with Profile Language Toggle & Close */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold text-slate-700">{t.switchProfileLang}:</span>
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                type="button"
                id="btn-prof-lang-en"
                onClick={() => setProfileLang('en')}
                className={`px-2 py-0.5 text-xs font-semibold rounded ${
                  profileLang === 'en'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                English
              </button>
              <button
                type="button"
                id="btn-prof-lang-hi"
                onClick={() => setProfileLang('hi')}
                className={`px-2 py-0.5 text-xs font-semibold rounded ${
                  profileLang === 'hi'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                हिन्दी
              </button>
              <button
                type="button"
                id="btn-prof-lang-mr"
                onClick={() => setProfileLang('mr')}
                className={`px-2 py-0.5 text-xs font-semibold rounded ${
                  profileLang === 'mr'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                मराठी
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-xl leading-none"
          >
            &times;
          </button>
        </div>

        {/* Hero Card */}
        <div className="mt-4 flex items-start gap-4">
          <img
            src={help.avatarUrl}
            alt={help.fullName}
            referrerPolicy="no-referrer"
            className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-emerald-500/30 shadow-md shrink-0"
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-bold text-slate-900">{help.fullName}</h3>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                {help.id}
              </span>
              {help.policeVerified && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  {t.policeVerifiedBadge}
                </span>
              )}
            </div>

            {/* Translated Role Title */}
            <p className="text-xs font-bold text-emerald-700 mt-1">
              {currentBio.roleTitle}
            </p>

            <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 flex-wrap">
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3 text-slate-400" />
                {help.phone}
              </span>
              <span>• Age: {help.age} yrs</span>
              <span>• {help.gender}</span>
              <span className="flex items-center gap-1 text-amber-600 font-bold">
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                {help.rating} ({help.totalReviews} reviews)
              </span>
            </div>
          </div>
        </div>

        {/* Assigned Flats & Gate Access */}
        <div className="grid grid-cols-2 gap-2.5 mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
          <div>
            <span className="text-slate-500 flex items-center gap-1 font-medium">
              <Building className="w-3.5 h-3.5 text-slate-400" />
              {t.assignedFlats}:
            </span>
            <div className="flex gap-1 flex-wrap mt-1">
              {help.assignedFlats.map((f) => (
                <span key={f} className="px-2 py-0.5 rounded font-mono font-bold bg-white text-slate-800 border border-slate-200">
                  {f}
                </span>
              ))}
            </div>
          </div>

          <div>
            <span className="text-slate-500 flex items-center gap-1 font-medium">
              <KeyRound className="w-3.5 h-3.5 text-slate-400" />
              Gate Security PIN:
            </span>
            <p className="font-mono font-black text-slate-900 text-sm mt-1">
              {help.passcode}
            </p>
          </div>
        </div>

        {/* Government Identity & Verified UPI */}
        <div className="grid grid-cols-2 gap-2.5 mt-2.5 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
          <div>
            <span className="text-slate-500 flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              {t.idProof}:
            </span>
            <p className="font-medium text-slate-800 mt-0.5">
              {help.idProofType} ({help.idNumberMasked})
            </p>
          </div>

          <div>
            <span className="text-slate-500 flex items-center gap-1 font-medium">
              <CreditCard className="w-3.5 h-3.5 text-purple-600" />
              Registered UPI ID:
            </span>
            <p className="font-mono font-bold text-purple-700 mt-0.5 truncate">
              {help.upiId}
            </p>
          </div>
        </div>

        {/* Multilingual Bio & Working Instructions */}
        <div className="mt-4 space-y-3">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              {t.bio} ({profileLang.toUpperCase()}):
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50/60 p-3 rounded-lg border border-slate-100">
              {currentBio.bio}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              {t.specialties}:
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {currentBio.specialties.map((spec) => (
                <span
                  key={spec}
                  className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200"
                >
                  ✓ {spec}
                </span>
              ))}
            </div>
          </div>

          <div className="p-2.5 bg-amber-50/70 rounded-lg border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-amber-700 shrink-0" />
            <div>
              <span className="font-bold">{t.emergencyContact}: </span>
              <span>{currentBio.emergencyContact}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Base Monthly Wages: <strong className="text-slate-900">₹{help.baseSalary.toLocaleString('en-IN')}</strong>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
