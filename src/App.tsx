import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  IndianRupee, 
  Star, 
  BellRing, 
  FileText, 
  Users, 
  LayoutDashboard,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  QrCode,
  Building,
  Clock,
  MapPin,
  CalendarDays
} from 'lucide-react';

import { 
  DailyHelp, 
  SalaryAdvance, 
  Review, 
  QuickLeaveNotification, 
  PayrollRecord,
  SocietyHoliday,
  AppLanguage 
} from './types';

import { 
  initialDailyHelps, 
  initialSalaryAdvances, 
  initialReviews, 
  initialLeaveAlerts,
  initialHolidays
} from './data/mockData';

import { translations, roleLabels } from './utils/translations';
import { Navbar } from './components/Navbar';
import { StatSummary } from './components/StatSummary';
import { AttendanceManager } from './components/AttendanceManager';
import { SalaryAdvanceUPI } from './components/SalaryAdvanceUPI';
import { RatingSystem } from './components/RatingSystem';
import { QuickLeaveSystem } from './components/QuickLeaveSystem';
import { PayrollGenerator } from './components/PayrollGenerator';
import { SocietyHolidayCalendar } from './components/SocietyHolidayCalendar';
import { DailyHelpProfileModal } from './components/DailyHelpProfileModal';
import { NewDailyHelpModal } from './components/NewDailyHelpModal';

export default function App() {
  // Multilingual state (en, hi, mr)
  const [currentLang, setCurrentLang] = useState<AppLanguage>(() => {
    return (localStorage.getItem('gvh_lang') as AppLanguage) || 'en';
  });

  // Daily helps master list
  const [dailyHelps, setDailyHelps] = useState<DailyHelp[]>(() => {
    const saved = localStorage.getItem('gvh_daily_helps');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return initialDailyHelps;
  });

  // Salary advances ledger
  const [advances, setAdvances] = useState<SalaryAdvance[]>(() => {
    const saved = localStorage.getItem('gvh_advances');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return initialSalaryAdvances;
  });

  // Ratings & reviews
  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('gvh_reviews');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return initialReviews;
  });

  // Quick leave alerts
  const [leaveAlerts, setLeaveAlerts] = useState<QuickLeaveNotification[]>(() => {
    const saved = localStorage.getItem('gvh_leave_alerts');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return initialLeaveAlerts;
  });

  // Society holidays
  const [holidays, setHolidays] = useState<SocietyHoliday[]>(() => {
    const saved = localStorage.getItem('gvh_holidays');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return initialHolidays;
  });

  const [holidayMonth, setHolidayMonth] = useState<string>('2026-09');

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Modals
  const [selectedProfileHelp, setSelectedProfileHelp] = useState<DailyHelp | null>(null);
  const [isNewHelpModalOpen, setIsNewHelpModalOpen] = useState(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('gvh_lang', currentLang);
  }, [currentLang]);

  useEffect(() => {
    localStorage.setItem('gvh_daily_helps', JSON.stringify(dailyHelps));
  }, [dailyHelps]);

  useEffect(() => {
    localStorage.setItem('gvh_advances', JSON.stringify(advances));
  }, [advances]);

  useEffect(() => {
    localStorage.setItem('gvh_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('gvh_leave_alerts', JSON.stringify(leaveAlerts));
  }, [leaveAlerts]);

  useEffect(() => {
    localStorage.setItem('gvh_holidays', JSON.stringify(holidays));
  }, [holidays]);

  const t = translations[currentLang];

  // Helper calculations for automated monthly payroll factoring in society holidays
  const calculatePayrolls = (activeHolidays = holidays): PayrollRecord[] => {
    const billingMonth = '2026-09';
    const daysInMonth = 30;
    
    // Count official society holidays in this billing cycle
    const monthHolidays = activeHolidays.filter((h) => h.date.startsWith(billingMonth));
    const societyHolidaysCount = monthHolidays.length;

    // Working days are automatically reduced by society holidays
    const workingDays = Math.max(1, daysInMonth - societyHolidaysCount);

    return dailyHelps.map((help, index) => {
      // Per day rate based on working days
      const perDayRate = Math.round(help.baseSalary / workingDays);

      // Check leaves
      const helpLeaves = leaveAlerts.filter((l) => l.helpId === help.id && l.status === 'approved');
      const totalLeaveDays = helpLeaves.length; // simplified 1 day per record
      const paidLeaves = Math.min(totalLeaveDays, 2); // 2 free paid leaves per month
      const unpaidLeaves = Math.max(0, totalLeaveDays - paidLeaves);
      const presentDays = Math.max(0, workingDays - unpaidLeaves);

      // Deduct approved advances
      const helpAdvances = advances.filter(
        (a) => a.helpId === help.id && a.status === 'approved_paid'
      );
      const advanceDeductions = helpAdvances.reduce((sum, a) => sum + a.amount, 0);

      // Bonus (Punctuality & rating > 4.8)
      const bonus = help.rating >= 4.8 ? 500 : 0;
      const grossPay = Math.max(0, help.baseSalary - (unpaidLeaves * perDayRate));
      const netPay = Math.max(0, grossPay - advanceDeductions + bonus);

      return {
        id: `PAY-2026-09-${(index + 1).toString().padStart(3, '0')}`,
        helpId: help.id,
        month: billingMonth,
        baseSalary: help.baseSalary,
        daysInMonth,
        workingDays,
        societyHolidaysCount,
        presentDays,
        paidLeaves,
        unpaidLeaves,
        perDayRate,
        grossPay,
        advanceDeductions,
        bonus,
        netPay,
        status: index === 0 ? 'paid' : 'approved',
        generatedDate: '2026-09-22',
        paidDate: index === 0 ? '2026-09-21' : undefined,
        paymentMode: index === 0 ? 'UPI' : undefined,
        societyReceiptNo: `GVH-REC-${8800 + index}`,
      };
    });
  };

  const [payrolls, setPayrolls] = useState<PayrollRecord[]>(() => calculatePayrolls(initialHolidays));

  // Recalculate payroll whenever dailyHelps, advances, or leaveAlerts update
  const handleRecalculatePayroll = () => {
    setPayrolls(calculatePayrolls(holidays));
  };

  // Check-In handler
  const handleCheckIn = (helpId: string, flat?: string) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setDailyHelps((prev) =>
      prev.map((h) => {
        if (h.id === helpId) {
          return {
            ...h,
            todayStatus: 'present',
            checkInTime: timeStr,
            checkOutTime: undefined,
            currentFlat: flat || h.assignedFlats[0],
          };
        }
        return h;
      })
    );
  };

  // Check-Out handler
  const handleCheckOut = (helpId: string) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setDailyHelps((prev) =>
      prev.map((h) => {
        if (h.id === helpId) {
          return {
            ...h,
            todayStatus: 'checked_out',
            checkOutTime: timeStr,
            currentFlat: undefined,
          };
        }
        return h;
      })
    );
  };

  // New advance request
  const handleRequestAdvance = (newAdv: Omit<SalaryAdvance, 'id'>) => {
    const id = `ADV-2026-${(advances.length + 1).toString().padStart(3, '0')}`;
    const updated = [{ id, ...newAdv }, ...advances];
    setAdvances(updated);
  };

  // Confirm UPI payment for advance
  const handleConfirmAdvancePayment = (advanceId: string, utr: string) => {
    const nowStr = new Date().toLocaleString();
    setAdvances((prev) =>
      prev.map((a) => {
        if (a.id === advanceId) {
          return {
            ...a,
            status: 'approved_paid',
            upiTransactionRef: utr,
            disbursedDate: nowStr,
            approvedBy: 'Society Managing Committee',
          };
        }
        return a;
      })
    );
    // Refresh payroll deductions immediately
    setTimeout(() => {
      setPayrolls(calculatePayrolls());
    }, 100);
  };

  // Reject advance
  const handleRejectAdvance = (advanceId: string) => {
    setAdvances((prev) =>
      prev.map((a) => (a.id === advanceId ? { ...a, status: 'rejected' } : a))
    );
  };

  // Add resident review
  const handleAddReview = (newReviewData: Omit<Review, 'id' | 'date'>) => {
    const newId = `REV-${Date.now().toString().slice(-4)}`;
    const dateStr = new Date().toISOString().split('T')[0];
    const newReview: Review = {
      id: newId,
      ...newReviewData,
      date: dateStr,
    };

    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);

    // Recalculate daily help average rating
    const helpRevList = updatedReviews.filter((r) => r.helpId === newReviewData.helpId);
    const avg =
      helpRevList.reduce((acc, r) => acc + r.rating, 0) / (helpRevList.length || 1);

    setDailyHelps((prev) =>
      prev.map((h) => {
        if (h.id === newReviewData.helpId) {
          return {
            ...h,
            rating: Number(avg.toFixed(2)),
            totalReviews: helpRevList.length,
          };
        }
        return h;
      })
    );
  };

  // Report Leave
  const handleReportLeave = (newLeaveData: Omit<QuickLeaveNotification, 'id' | 'reportedAt'>) => {
    const id = `LV-${Date.now().toString().slice(-6)}`;
    const nowStr = new Date().toLocaleString();
    const newLeave: QuickLeaveNotification = {
      id,
      ...newLeaveData,
      reportedAt: nowStr,
    };

    setLeaveAlerts([newLeave, ...leaveAlerts]);

    // Mark daily help todayStatus as 'on_leave' if start date is today
    const todayStr = new Date().toISOString().split('T')[0];
    if (newLeaveData.startDate <= todayStr && newLeaveData.endDate >= todayStr) {
      setDailyHelps((prev) =>
        prev.map((h) => {
          if (h.id === newLeaveData.helpId) {
            return {
              ...h,
              todayStatus: 'on_leave',
              currentFlat: undefined,
            };
          }
          return h;
        })
      );
    }

    // Refresh payroll
    setTimeout(() => {
      setPayrolls(calculatePayrolls());
    }, 100);
  };

  // Mark broadcast sent
  const handleMarkBroadcastSent = (leaveId: string) => {
    setLeaveAlerts((prev) =>
      prev.map((l) => (l.id === leaveId ? { ...l, broadcastSent: true } : l))
    );
  };

  // Add new daily help
  const handleAddNewHelp = (newHelp: DailyHelp) => {
    setDailyHelps([...dailyHelps, newHelp]);
  };

  // Add Society Holiday and automatically recalculate payroll working days
  const handleAddHoliday = (holidayData: Omit<SocietyHoliday, 'id' | 'affectedMonth'>) => {
    const id = `HOL-${Date.now().toString().slice(-6)}`;
    const affectedMonth = holidayData.date.slice(0, 7);
    const newHoliday: SocietyHoliday = {
      id,
      ...holidayData,
      affectedMonth,
    };
    const updated = [newHoliday, ...holidays];
    setHolidays(updated);
    setPayrolls(calculatePayrolls(updated));
  };

  // Delete Society Holiday and automatically recalculate payroll working days
  const handleDeleteHoliday = (holidayId: string) => {
    const updated = holidays.filter((h) => h.id !== holidayId);
    setHolidays(updated);
    setPayrolls(calculatePayrolls(updated));
  };

  // Update payroll status
  const handleUpdatePayrollStatus = (
    payrollId: string,
    status: 'draft' | 'approved' | 'paid',
    mode?: 'UPI' | 'Bank Transfer'
  ) => {
    const today = new Date().toISOString().split('T')[0];
    setPayrolls((prev) =>
      prev.map((p) => {
        if (p.id === payrollId) {
          return {
            ...p,
            status,
            paidDate: status === 'paid' ? today : undefined,
            paymentMode: mode,
          };
        }
        return p;
      })
    );
  };

  // Summary counts
  const presentCount = dailyHelps.filter((h) => h.todayStatus === 'present').length;
  const leaveCount = dailyHelps.filter((h) => h.todayStatus === 'on_leave').length;
  const pendingAdvances = advances.filter((a) => a.status === 'pending');
  const pendingAdvancesCount = pendingAdvances.length;
  const totalPendingAdvanceAmount = pendingAdvances.reduce((acc, a) => acc + a.amount, 0);
  const totalMonthlyPayroll = payrolls.reduce((acc, p) => acc + p.netPay, 0);
  const monthHolidaysCount = holidays.filter((h) => h.date.startsWith('2026-09')).length;

  const nextHelpId = `DH-${(dailyHelps.length + 101).toString()}`;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Top Navbar with society name, language toggle, and actions */}
      <Navbar
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        onOpenNewHelpModal={() => setIsNewHelpModalOpen(true)}
        onOpenQuickGatePass={() => setActiveTab('attendance')}
        activeCount={presentCount}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Top Operational Metrics Summary */}
        <StatSummary
          currentLang={currentLang}
          presentCount={presentCount}
          totalHelps={dailyHelps.length}
          leaveCount={leaveCount}
          pendingAdvancesCount={pendingAdvancesCount}
          totalPendingAdvanceAmount={totalPendingAdvanceAmount}
          totalMonthlyPayroll={totalMonthlyPayroll}
          onSelectTab={setActiveTab}
        />

        {/* Primary Navigation Tabs */}
        <div className="bg-white p-1.5 rounded-xl border border-slate-200 shadow-xs mb-6 overflow-x-auto scrollbar-none flex items-center gap-1.5">
          {[
            { id: 'overview', label: t.tabOverview, icon: LayoutDashboard },
            { id: 'attendance', label: t.tabAttendance, icon: CheckCircle2, badge: presentCount > 0 ? `${presentCount} In` : undefined },
            { id: 'advances', label: t.tabAdvances, icon: IndianRupee, badge: pendingAdvancesCount > 0 ? `${pendingAdvancesCount}` : undefined },
            { id: 'ratings', label: t.tabRatings, icon: Star },
            { id: 'leave', label: t.tabLeaveAlerts, icon: BellRing, badge: leaveCount > 0 ? `${leaveCount}` : undefined },
            { id: 'payroll', label: t.tabPayroll, icon: FileText },
            { id: 'holidays', label: t.tabHolidays, icon: CalendarDays, badge: monthHolidaysCount > 0 ? `${monthHolidaysCount} Days` : undefined },
            { id: 'directory', label: t.tabDirectory, icon: Users },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isActive
                        ? 'bg-emerald-500 text-white'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW DASHBOARD */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Live Security Gate Alert Banner if any leaves today */}
            {leaveCount > 0 && (
              <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-4 rounded-xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                    <ShieldAlert className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold">
                      Staff Leave Broadcast Active Today
                    </h3>
                    <p className="text-xs text-amber-100">
                      {leaveCount} daily help(s) are on approved leave today. Affected flats have been notified with substitute options.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  id="btn-overview-view-leave"
                  onClick={() => setActiveTab('leave')}
                  className="px-3.5 py-1.5 bg-white text-amber-900 hover:bg-amber-50 font-bold text-xs rounded-lg shadow-xs transition-colors shrink-0 cursor-pointer"
                >
                  View Affected Flats
                </button>
              </div>
            )}

            {/* Split Grid: Live Attendance Snapshot & Pending Advances */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Col 1 & 2: Live Gate Attendance Feed */}
              <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-emerald-600" />
                      Live Gate Pass Activity
                    </h3>
                    <p className="text-xs text-slate-500">
                      Staff inside society premises right now ({presentCount} active)
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('attendance')}
                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Full Terminal</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="divide-y divide-slate-100">
                  {dailyHelps
                    .filter((h) => h.todayStatus === 'present')
                    .map((help) => (
                      <div
                        key={help.id}
                        className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={help.avatarUrl}
                            alt={help.fullName}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 rounded-full object-cover border border-slate-200"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span 
                                onClick={() => setSelectedProfileHelp(help)}
                                className="text-xs font-bold text-slate-900 hover:text-emerald-700 cursor-pointer"
                              >
                                {help.fullName}
                              </span>
                              <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                                {help.id}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 capitalize">
                              {roleLabels[help.role]?.[currentLang] || help.role}
                            </p>
                          </div>
                        </div>

                        <div className="text-right text-xs">
                          {help.currentFlat && (
                            <span className="inline-flex items-center gap-1 font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded text-[11px] border border-emerald-200">
                              <MapPin className="w-3 h-3 text-emerald-600" />
                              Flat {help.currentFlat}
                            </span>
                          )}
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            Entered at: {help.checkInTime || '08:00 AM'}
                          </p>
                        </div>
                      </div>
                    ))}

                  {presentCount === 0 && (
                    <div className="py-8 text-center text-xs text-slate-400">
                      No daily helps currently logged inside premises.
                    </div>
                  )}
                </div>
              </div>

              {/* Col 3: Instant UPI Advance Requests Widget */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <IndianRupee className="w-4 h-4 text-purple-700" />
                      Pending UPI Advances
                    </h3>
                    <button
                      type="button"
                      onClick={() => setActiveTab('advances')}
                      className="text-xs font-semibold text-purple-700 hover:text-purple-800 flex items-center gap-1 cursor-pointer"
                    >
                      <span>Manage All</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {advances
                      .filter((a) => a.status === 'pending')
                      .map((adv) => {
                        const help = dailyHelps.find((h) => h.id === adv.helpId);
                        return (
                          <div
                            key={adv.id}
                            className="p-3 rounded-lg border border-purple-100 bg-purple-50/40 text-xs"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-900">{help?.fullName}</span>
                              <span className="font-black text-purple-800 text-sm">₹{adv.amount}</span>
                            </div>
                            <p className="text-[11px] text-slate-600 mt-0.5 truncate italic">
                              "{adv.reason}"
                            </p>
                            <button
                              type="button"
                              id={`btn-quick-upi-${adv.id}`}
                              onClick={() => setActiveTab('advances')}
                              className="mt-2 w-full py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-[11px] font-bold shadow-xs cursor-pointer flex items-center justify-center gap-1"
                            >
                              <QrCode className="w-3 h-3" />
                              Pay via UPI QR Code
                            </button>
                          </div>
                        );
                      })}

                    {pendingAdvancesCount === 0 && (
                      <div className="py-6 text-center text-xs text-slate-400">
                        No pending salary advance requests right now.
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="bg-slate-50 p-2.5 rounded-lg text-xs text-slate-600 flex items-center justify-between">
                    <span>Auto-Payroll Sync:</span>
                    <span className="font-bold text-emerald-700">Enabled</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row: Quick Society Features Tour */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div 
                onClick={() => setActiveTab('ratings')}
                className="bg-white p-4 rounded-xl border border-slate-200 hover:border-amber-300 transition-all shadow-xs cursor-pointer"
              >
                <div className="flex items-center gap-2 text-amber-600 mb-1.5">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-bold uppercase tracking-wider">Resident Feedback</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">
                  {reviews.length + 90} Verified Reviews Logged
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Residents rate punctuality, cooking quality, and trust. 100% police verified badges.
                </p>
              </div>

              <div 
                onClick={() => setActiveTab('leave')}
                className="bg-white p-4 rounded-xl border border-slate-200 hover:border-red-300 transition-all shadow-xs cursor-pointer"
              >
                <div className="flex items-center gap-2 text-red-600 mb-1.5">
                  <BellRing className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Quick-Leave System</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">
                  Instant Flat Broadcasts
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  When a maid or cook takes leave, all assigned flats are alerted with substitute staff suggestions.
                </p>
              </div>

              <div 
                onClick={() => setActiveTab('payroll')}
                className="bg-white p-4 rounded-xl border border-slate-200 hover:border-emerald-300 transition-all shadow-xs cursor-pointer"
              >
                <div className="flex items-center gap-2 text-emerald-600 mb-1.5">
                  <FileText className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Automated Payroll</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">
                  One-Click Payslips
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Automatically calculates days present, deducts UPI salary advances, and adjusts working days for society holidays.
                </p>
              </div>

              <div 
                onClick={() => setActiveTab('holidays')}
                className="bg-white p-4 rounded-xl border border-slate-200 hover:border-amber-400 transition-all shadow-xs cursor-pointer"
              >
                <div className="flex items-center gap-2 text-amber-700 mb-1.5">
                  <CalendarDays className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-bold uppercase tracking-wider">{t.tabHolidays}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">
                  {monthHolidaysCount} Society Holidays Set
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Mark festival holidays like Ganesh Chaturthi or Janmashtami to automatically reduce expected staff working days.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DIGITAL ATTENDANCE */}
        {activeTab === 'attendance' && (
          <AttendanceManager
            currentLang={currentLang}
            dailyHelps={dailyHelps}
            onCheckIn={handleCheckIn}
            onCheckOut={handleCheckOut}
            onViewProfile={(help) => setSelectedProfileHelp(help)}
          />
        )}

        {/* TAB 3: INSTANT UPI ADVANCES */}
        {activeTab === 'advances' && (
          <SalaryAdvanceUPI
            currentLang={currentLang}
            dailyHelps={dailyHelps}
            advances={advances}
            onRequestAdvance={handleRequestAdvance}
            onConfirmPayment={handleConfirmAdvancePayment}
            onRejectAdvance={handleRejectAdvance}
          />
        )}

        {/* TAB 4: RATINGS & REVIEWS */}
        {activeTab === 'ratings' && (
          <RatingSystem
            currentLang={currentLang}
            dailyHelps={dailyHelps}
            reviews={reviews}
            onAddReview={handleAddReview}
            onViewProfile={(help) => setSelectedProfileHelp(help)}
          />
        )}

        {/* TAB 5: QUICK LEAVE SYSTEM */}
        {activeTab === 'leave' && (
          <QuickLeaveSystem
            currentLang={currentLang}
            dailyHelps={dailyHelps}
            leaveAlerts={leaveAlerts}
            onReportLeave={handleReportLeave}
            onMarkBroadcastSent={handleMarkBroadcastSent}
          />
        )}

        {/* TAB 6: AUTOMATED MONTHLY PAYROLL */}
        {activeTab === 'payroll' && (
          <PayrollGenerator
            currentLang={currentLang}
            dailyHelps={dailyHelps}
            advances={advances}
            payrolls={payrolls}
            holidays={holidays}
            onUpdatePayrollStatus={handleUpdatePayrollStatus}
            onRecalculateAll={handleRecalculatePayroll}
            onNavigateToHolidays={() => setActiveTab('holidays')}
          />
        )}

        {/* TAB 7: SOCIETY HOLIDAY CALENDAR */}
        {activeTab === 'holidays' && (
          <SocietyHolidayCalendar
            currentLang={currentLang}
            holidays={holidays}
            selectedMonth={holidayMonth}
            onMonthChange={setHolidayMonth}
            onAddHoliday={handleAddHoliday}
            onDeleteHoliday={handleDeleteHoliday}
            onNavigateToPayroll={() => setActiveTab('payroll')}
          />
        )}

        {/* TAB 8: STAFF DIRECTORY & MULTILINGUAL PROFILES */}
        {activeTab === 'directory' && (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  {t.tabDirectory}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Complete workforce roster with multilingual profiles, government ID proofs, and assigned flats
                </p>
              </div>

              <button
                type="button"
                id="btn-dir-add-help"
                onClick={() => setIsNewHelpModalOpen(true)}
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                + Register New Daily Help
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dailyHelps.map((help) => {
                const bio = help.multilingual[currentLang] || help.multilingual.en;
                const roleLabel = roleLabels[help.role]?.[currentLang] || help.role;

                return (
                  <div
                    key={help.id}
                    id={`directory-card-${help.id}`}
                    className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs hover:border-blue-300 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start gap-3">
                        <img
                          src={help.avatarUrl}
                          alt={help.fullName}
                          referrerPolicy="no-referrer"
                          className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold text-slate-900 truncate">
                              {help.fullName}
                            </h3>
                            <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                              {help.id}
                            </span>
                          </div>

                          <p className="text-xs font-semibold text-emerald-700 mt-0.5 truncate">
                            {roleLabel}
                          </p>

                          <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                            <span className="flex items-center text-amber-600 font-bold">
                              <Star className="w-3 h-3 fill-amber-500 text-amber-500 mr-0.5" />
                              {help.rating} ({help.totalReviews})
                            </span>
                            <span>• {help.phone}</span>
                          </div>
                        </div>
                      </div>

                      {/* Multilingual bio snippet */}
                      <p className="text-xs text-slate-600 mt-3 line-clamp-2 italic bg-slate-50 p-2 rounded">
                        "{bio.bio}"
                      </p>

                      {/* Flats & UPI ID */}
                      <div className="mt-3 space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Assigned Flats:</span>
                          <div className="flex gap-1 flex-wrap">
                            {help.assignedFlats.map((f) => (
                              <span key={f} className="px-1.5 py-0.2 rounded font-mono font-bold text-[11px] bg-slate-100 text-slate-700">
                                {f}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">UPI ID:</span>
                          <span className="font-mono font-semibold text-purple-700 truncate max-w-[170px]">
                            {help.upiId}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Monthly Wage:</span>
                          <span className="font-bold text-slate-900">
                            ₹{help.baseSalary.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] font-mono text-slate-400">
                        Gate PIN: <strong className="text-slate-700">{help.passcode}</strong>
                      </span>
                      <button
                        type="button"
                        id={`btn-open-prof-${help.id}`}
                        onClick={() => setSelectedProfileHelp(help)}
                        className="px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                      >
                        {t.viewProfile}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Multilingual Profile Modal */}
      {selectedProfileHelp && (
        <DailyHelpProfileModal
          help={selectedProfileHelp}
          onClose={() => setSelectedProfileHelp(null)}
          appLang={currentLang}
          onCheckIn={handleCheckIn}
          onCheckOut={handleCheckOut}
        />
      )}

      {/* Register New Daily Help Modal */}
      <NewDailyHelpModal
        isOpen={isNewHelpModalOpen}
        onClose={() => setIsNewHelpModalOpen(false)}
        onAddHelp={handleAddNewHelp}
        currentLang={currentLang}
        nextHelpId={nextHelpId}
      />
    </div>
  );
}
