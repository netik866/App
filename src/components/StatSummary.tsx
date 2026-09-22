import React from 'react';
import { Users, LogIn, CalendarX, IndianRupee, ArrowUpRight } from 'lucide-react';
import { AppLanguage } from '../types';
import { translations } from '../utils/translations';

interface StatSummaryProps {
  currentLang: AppLanguage;
  presentCount: number;
  totalHelps: number;
  leaveCount: number;
  pendingAdvancesCount: number;
  totalPendingAdvanceAmount: number;
  totalMonthlyPayroll: number;
  onSelectTab: (tab: string) => void;
}

export const StatSummary: React.FC<StatSummaryProps> = ({
  currentLang,
  presentCount,
  totalHelps,
  leaveCount,
  pendingAdvancesCount,
  totalPendingAdvanceAmount,
  totalMonthlyPayroll,
  onSelectTab,
}) => {
  const t = translations[currentLang];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
      {/* 1. Inside Premises */}
      <div 
        id="card-stat-present"
        onClick={() => onSelectTab('attendance')}
        className="bg-white p-4 rounded-xl border border-slate-200 hover:border-emerald-300 transition-all shadow-xs cursor-pointer group"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <LogIn className="w-4 h-4" />
          </div>
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
        </div>
        <p className="text-2xl font-bold text-slate-900 tracking-tight">{presentCount}</p>
        <p className="text-xs font-medium text-slate-500 mt-0.5 flex items-center justify-between">
          <span>{t.currentlyInside}</span>
          <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-600" />
        </p>
      </div>

      {/* 2. Total Registered Workforce */}
      <div 
        id="card-stat-total"
        onClick={() => onSelectTab('directory')}
        className="bg-white p-4 rounded-xl border border-slate-200 hover:border-blue-300 transition-all shadow-xs cursor-pointer group"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Users className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
            Active
          </span>
        </div>
        <p className="text-2xl font-bold text-slate-900 tracking-tight">{totalHelps}</p>
        <p className="text-xs font-medium text-slate-500 mt-0.5 flex items-center justify-between">
          <span>{t.totalStaff}</span>
          <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-blue-600" />
        </p>
      </div>

      {/* 3. On Leave Today */}
      <div 
        id="card-stat-leave"
        onClick={() => onSelectTab('leave')}
        className="bg-white p-4 rounded-xl border border-slate-200 hover:border-amber-300 transition-all shadow-xs cursor-pointer group"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <CalendarX className="w-4 h-4" />
          </div>
          {leaveCount > 0 && (
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
              Notice Sent
            </span>
          )}
        </div>
        <p className="text-2xl font-bold text-slate-900 tracking-tight">{leaveCount}</p>
        <p className="text-xs font-medium text-slate-500 mt-0.5 flex items-center justify-between">
          <span>{t.todayLeaves}</span>
          <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-amber-600" />
        </p>
      </div>

      {/* 4. Pending UPI Advances */}
      <div 
        id="card-stat-advances"
        onClick={() => onSelectTab('advances')}
        className="bg-white p-4 rounded-xl border border-slate-200 hover:border-purple-300 transition-all shadow-xs cursor-pointer group"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <IndianRupee className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
            UPI Quick
          </span>
        </div>
        <p className="text-2xl font-bold text-slate-900 tracking-tight">
          {pendingAdvancesCount}
          <span className="text-xs font-normal text-slate-500 ml-1.5">
            (₹{totalPendingAdvanceAmount.toLocaleString('en-IN')})
          </span>
        </p>
        <p className="text-xs font-medium text-slate-500 mt-0.5 flex items-center justify-between">
          <span>{t.pendingAdvances}</span>
          <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-purple-600" />
        </p>
      </div>

      {/* 5. Monthly Payroll */}
      <div 
        id="card-stat-payroll"
        onClick={() => onSelectTab('payroll')}
        className="col-span-2 lg:col-span-1 bg-gradient-to-br from-slate-900 to-slate-800 p-4 rounded-xl text-white shadow-xs cursor-pointer group"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] uppercase tracking-wider text-slate-300 font-bold">
            Sep 2026 Payroll
          </span>
          <span className="px-2 py-0.5 rounded-md bg-white/10 text-emerald-400 text-xs font-semibold">
            Auto-Calculated
          </span>
        </div>
        <p className="text-2xl font-bold tracking-tight text-white">
          ₹{totalMonthlyPayroll.toLocaleString('en-IN')}
        </p>
        <p className="text-xs text-slate-400 mt-0.5 flex items-center justify-between">
          <span>Auto Deducts Advances</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </p>
      </div>
    </div>
  );
};
