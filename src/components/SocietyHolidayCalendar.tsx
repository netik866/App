import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Sparkles, 
  Calculator, 
  Info, 
  ShieldCheck, 
  ChevronLeft, 
  ChevronRight,
  Sun,
  Flag,
  Wrench,
  PartyPopper,
  Copy,
  Check
} from 'lucide-react';
import { SocietyHoliday, AppLanguage } from '../types';
import { translations } from '../utils/translations';

interface SocietyHolidayCalendarProps {
  currentLang: AppLanguage;
  holidays: SocietyHoliday[];
  selectedMonth: string; // "2026-09"
  onMonthChange: (month: string) => void;
  onAddHoliday: (holiday: Omit<SocietyHoliday, 'id' | 'affectedMonth'>) => void;
  onDeleteHoliday: (holidayId: string) => void;
  onNavigateToPayroll?: () => void;
}

export const SocietyHolidayCalendar: React.FC<SocietyHolidayCalendarProps> = ({
  currentLang,
  holidays,
  selectedMonth,
  onMonthChange,
  onAddHoliday,
  onDeleteHoliday,
  onNavigateToPayroll,
}) => {
  const t = translations[currentLang];
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [copiedCircular, setCopiedCircular] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(`${selectedMonth}-15`);
  const [category, setCategory] = useState<'festival' | 'national' | 'society_special'>('festival');
  const [description, setDescription] = useState('');
  const [isPaidHoliday, setIsPaidHoliday] = useState(true);

  // Selected year and month numbers
  const [yearStr, monthStr] = selectedMonth.split('-');
  const year = parseInt(yearStr, 10);
  const monthIndex = parseInt(monthStr, 10) - 1; // 0-indexed

  // Days in selected month
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, monthIndex, 1).getDay(); // 0 = Sun

  // Filter holidays for selected month
  const monthHolidays = holidays.filter((h) => h.date.startsWith(selectedMonth));
  const holidaysCount = monthHolidays.length;
  const workingDays = Math.max(0, daysInMonth - holidaysCount);

  // Generate WhatsApp formatted holiday circular
  const generateHolidayCircularText = () => {
    const holidaysListText = monthHolidays.length > 0
      ? monthHolidays
          .map((h, i) => `  ${i + 1}. 🗓️ ${h.date}: *${h.title}* (${h.category.toUpperCase()})\n     ↳ ${h.description || 'Paid Society Holiday'}`)
          .join('\n\n')
      : '  • No official society holidays marked for this month.';

    return `📢 *GREEN VALLEY HEIGHTS CO-OP HOUSING SOCIETY*
📜 *OFFICIAL HOLIDAY CIRCULAR & STAFF WORKING DAYS*
📅 *Billing Period:* ${monthName}

Dear Residents & Household Helps,

Please take note of the official society holidays scheduled for this month. In accordance with Society Bye-laws, daily helps are granted full wage protection for these dates, and expected monthly working days have been reduced accordingly in payroll.

✨ *SCHEDULED SOCIETY HOLIDAYS:*
${holidaysListText}

📊 *PAYROLL & WORKING DAYS SUMMARY:*
• Total Calendar Days: ${daysInMonth}
• Official Society Holidays: ${holidaysCount} Days
• *Adjusted Staff Working Days:* ${workingDays} Days

💡 *Notice to Residents:* If your daily help works on these designated holidays, please coordinate directly or offer holiday overtime.

Regards,
*Managing Committee & Security Gate*
Green Valley Heights CHS`;
  };

  const handleCopyCircular = () => {
    const text = generateHolidayCircularText();
    navigator.clipboard.writeText(text);
    setCopiedCircular(true);
    setTimeout(() => setCopiedCircular(false), 2500);
  };

  // Month navigation
  const handlePrevMonth = () => {
    const prevDate = new Date(year, monthIndex - 1, 1);
    const newMonthStr = `${prevDate.getFullYear()}-${(prevDate.getMonth() + 1).toString().padStart(2, '0')}`;
    onMonthChange(newMonthStr);
  };

  const handleNextMonth = () => {
    const nextDate = new Date(year, monthIndex + 1, 1);
    const newMonthStr = `${nextDate.getFullYear()}-${(nextDate.getMonth() + 1).toString().padStart(2, '0')}`;
    onMonthChange(newMonthStr);
  };

  const handleQuickAddPreset = (presetTitle: string, presetDate: string, presetCat: 'festival' | 'national' | 'society_special') => {
    // Check if already exists
    if (holidays.some((h) => h.date === presetDate)) return;

    onAddHoliday({
      title: presetTitle,
      date: presetDate,
      category: presetCat,
      description: `Society officially recognized holiday for ${presetTitle}. Staff wages protected.`,
      isPaidHoliday: true,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date) return;

    onAddHoliday({
      title: title.trim(),
      date,
      category,
      description: description.trim(),
      isPaidHoliday,
    });

    setTitle('');
    setDescription('');
    setIsAddModalOpen(false);
  };

  const monthName = new Date(year, monthIndex, 1).toLocaleString(
    currentLang === 'hi' ? 'hi-IN' : currentLang === 'mr' ? 'mr-IN' : 'en-US',
    { month: 'long', year: 'numeric' }
  );

  return (
    <div className="space-y-6">
      {/* Header and Month Controls */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <CalendarIcon className="w-4.5 h-4.5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                {t.holidayCalendarTitle}
              </h2>
              <p className="text-xs text-slate-500">
                {t.holidayCalendarSubtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Month Selector & Add Button */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              type="button"
              id="btn-prev-month"
              onClick={handlePrevMonth}
              className="p-1 hover:bg-white rounded text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 text-xs font-bold text-slate-800 min-w-[130px] text-center">
              {monthName}
            </span>
            <button
              type="button"
              id="btn-next-month"
              onClick={handleNextMonth}
              className="p-1 hover:bg-white rounded text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            id="btn-copy-holiday-circular"
            onClick={handleCopyCircular}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg shadow-xs transition-all cursor-pointer ${
              copiedCircular
                ? 'bg-emerald-700 text-white'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
            }`}
            title="Copy formatted notice to paste in society WhatsApp group or notice board"
          >
            {copiedCircular ? <Check className="w-4 h-4 text-emerald-200" /> : <Copy className="w-4 h-4 text-emerald-700" />}
            <span>{copiedCircular ? 'Copied Circular! ✓' : 'Copy Notice (WhatsApp)'}</span>
          </button>

          <button
            type="button"
            id="btn-open-add-holiday"
            onClick={() => {
              setDate(`${selectedMonth}-01`);
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t.addHolidayBtn}</span>
          </button>
        </div>
      </div>

      {/* Impact on Payroll Banner */}
      <div className="bg-gradient-to-r from-emerald-900 to-slate-900 text-white p-5 rounded-xl shadow-xs border border-emerald-800/40">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <Calculator className="w-3 h-3" />
                Automatic Payroll Integration
              </span>
              <span className="text-xs text-slate-300">
                Billing Cycle: <strong className="text-white">{selectedMonth}</strong>
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span>{monthHolidays.length} Society Holidays Marked</span>
              <span className="text-emerald-400">➔</span>
              <span>Working Days Reduced to {workingDays} Days</span>
            </h3>

            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              When administrators declare official society holidays, staff expected working days are automatically reduced from {daysInMonth} to {workingDays} in the Monthly Payroll module. Daily helps are granted full wage protection without penalty or loss of pay.
            </p>
          </div>

          {/* Stat Pills */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-white/10 backdrop-blur-xs p-3 rounded-lg border border-white/15 text-center min-w-[85px]">
              <span className="block text-[11px] text-slate-300">Days in Month</span>
              <span className="text-xl font-black text-white">{daysInMonth}</span>
            </div>

            <div className="bg-amber-500/20 backdrop-blur-xs p-3 rounded-lg border border-amber-400/30 text-center min-w-[85px]">
              <span className="block text-[11px] text-amber-200">Holidays</span>
              <span className="text-xl font-black text-amber-300">-{holidaysCount}</span>
            </div>

            <div className="bg-emerald-500/20 backdrop-blur-xs p-3 rounded-lg border border-emerald-400/30 text-center min-w-[95px]">
              <span className="block text-[11px] text-emerald-200">Payroll Days</span>
              <span className="text-xl font-black text-emerald-300">{workingDays}</span>
            </div>
          </div>
        </div>

        {onNavigateToPayroll && (
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
            <span className="text-slate-300 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Payroll records automatically adjust per-day rates and present percentages.
            </span>
            <button
              type="button"
              onClick={onNavigateToPayroll}
              className="text-emerald-300 hover:text-emerald-200 font-bold underline cursor-pointer"
            >
              Verify in Monthly Payroll Tab →
            </button>
          </div>
        )}
      </div>

      {/* Preset Indian Festivals Quick Bar */}
      <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Popular Housing Society Festival Presets:</span>
          </div>
          <span className="text-[11px] text-amber-700">Click to quick-schedule as paid holiday</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            { title: 'Janmashtami', date: `${yearStr}-09-04`, cat: 'festival' as const },
            { title: 'Ganesh Chaturthi', date: `${yearStr}-09-17`, cat: 'festival' as const },
            { title: 'Anant Chaturdashi', date: `${yearStr}-09-28`, cat: 'festival' as const },
            { title: 'Gandhi Jayanti', date: `${yearStr}-10-02`, cat: 'national' as const },
            { title: 'Dussehra (Vijayadashami)', date: `${yearStr}-10-20`, cat: 'festival' as const },
            { title: 'Diwali (Laxmi Pujan)', date: `${yearStr}-11-08`, cat: 'festival' as const },
            { title: 'Bhai Dooj', date: `${yearStr}-11-10`, cat: 'festival' as const },
            { title: 'Republic Day', date: `${yearStr}-01-26`, cat: 'national' as const },
            { title: 'Independence Day', date: `${yearStr}-08-15`, cat: 'national' as const },
          ]
            .filter((p) => p.date.startsWith(selectedMonth))
            .map((preset) => {
              const isAlreadyAdded = holidays.some((h) => h.date === preset.date);
              return (
                <button
                  key={preset.title}
                  type="button"
                  disabled={isAlreadyAdded}
                  onClick={() => handleQuickAddPreset(preset.title, preset.date, preset.cat)}
                  className={`text-xs px-2.5 py-1 rounded-md font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                    isAlreadyAdded
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 opacity-80 cursor-default'
                      : 'bg-white text-amber-900 border border-amber-300 hover:bg-amber-100 shadow-2xs'
                  }`}
                >
                  {isAlreadyAdded ? (
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <Plus className="w-3 h-3 text-amber-600" />
                  )}
                  <span>{preset.title}</span>
                  <span className="text-[10px] opacity-70">({preset.date.slice(8)}th)</span>
                </button>
              );
            })}
        </div>
      </div>

      {/* Main Grid: Interactive Calendar & Scheduled Holidays List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Col 1 & 2: Interactive Calendar Grid */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-amber-600" />
              <span>{monthName} Calendar View</span>
            </h3>
            <span className="text-xs text-slate-500">
              {holidaysCount} holidays marked
            </span>
          </div>

          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-1.5 text-center mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, i) => (
              <div
                key={d}
                className={`py-1.5 text-xs font-bold rounded ${
                  i === 0 ? 'text-red-500 bg-red-50/50' : 'text-slate-600 bg-slate-50'
                }`}
              >
                {d}
              </div>
            ))}
          </div>

          {/* Calendar date cells */}
          <div className="grid grid-cols-7 gap-1.5">
            {/* Empty slots for month offset */}
            {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
              <div
                key={`empty-${idx}`}
                className="h-20 bg-slate-50/40 rounded-lg border border-transparent"
              />
            ))}

            {/* Days in month */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const dayNum = idx + 1;
              const dateStr = `${selectedMonth}-${dayNum.toString().padStart(2, '0')}`;
              const holiday = holidays.find((h) => h.date === dateStr);
              const dayOfWeek = (firstDayOfWeek + idx) % 7;
              const isSunday = dayOfWeek === 0;

              return (
                <div
                  key={dateStr}
                  id={`cal-day-${dateStr}`}
                  onClick={() => {
                    if (holiday) {
                      // Already holiday
                    } else {
                      setDate(dateStr);
                      setIsAddModalOpen(true);
                    }
                  }}
                  className={`h-22 p-1.5 rounded-lg border transition-all flex flex-col justify-between group relative cursor-pointer ${
                    holiday
                      ? 'bg-amber-50/90 border-amber-300 ring-1 ring-amber-400/50 shadow-2xs'
                      : isSunday
                      ? 'bg-red-50/20 border-slate-200/80 hover:bg-amber-50/40 hover:border-amber-200'
                      : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold ${
                        holiday
                          ? 'text-amber-900 bg-amber-200/70 px-1 rounded'
                          : isSunday
                          ? 'text-red-600 font-semibold'
                          : 'text-slate-700'
                      }`}
                    >
                      {dayNum}
                    </span>

                    {holiday ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteHoliday(holiday.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-600 transition-opacity p-0.5"
                        title="Delete holiday"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    ) : (
                      <span className="opacity-0 group-hover:opacity-100 text-[10px] text-amber-600 font-bold">
                        + Mark
                      </span>
                    )}
                  </div>

                  {holiday ? (
                    <div className="mt-1">
                      <div className="text-[10px] font-bold text-amber-950 truncate leading-tight flex items-center gap-0.5">
                        <PartyPopper className="w-2.5 h-2.5 text-amber-600 shrink-0" />
                        <span className="truncate">{holiday.title}</span>
                      </div>
                      <span className="inline-block mt-1 text-[9px] font-bold px-1 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-200">
                        Paid Holiday
                      </span>
                    </div>
                  ) : (
                    <div className="text-[10px] text-slate-300 group-hover:text-slate-400">
                      Workday
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Col 3: Scheduled Holidays Details & Management List */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <PartyPopper className="w-4 h-4 text-amber-600" />
                <span>{t.societyHolidaysThisMonth}</span>
              </h3>
              <span className="text-xs font-mono font-bold px-2 py-0.5 bg-amber-100 text-amber-800 rounded">
                {holidaysCount}
              </span>
            </div>

            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {monthHolidays.map((holiday) => (
                <div
                  key={holiday.id}
                  id={`holiday-card-${holiday.id}`}
                  className="p-3 rounded-lg border border-amber-200/80 bg-amber-50/50 hover:bg-amber-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900">
                          {holiday.title}
                        </span>
                        {holiday.category === 'national' && (
                          <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-blue-100 text-blue-800">
                            National
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] font-mono text-amber-800 font-bold mt-0.5">
                        📅 {holiday.date}
                      </p>
                    </div>

                    <button
                      type="button"
                      id={`btn-del-holiday-${holiday.id}`}
                      onClick={() => onDeleteHoliday(holiday.id)}
                      className="text-slate-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors cursor-pointer"
                      title={t.deleteHoliday}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {holiday.description && (
                    <p className="text-[11px] text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
                      {holiday.description}
                    </p>
                  )}

                  <div className="mt-2 pt-2 border-t border-amber-200/60 flex items-center justify-between text-[10px]">
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Paid Staff Holiday
                    </span>
                    <span className="text-slate-500">
                      -1 Workday in Payroll
                    </span>
                  </div>
                </div>
              ))}

              {monthHolidays.length === 0 && (
                <div className="py-10 text-center text-xs text-slate-400">
                  <CalendarIcon className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                  <p>{t.noHolidaysInMonth}</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Click "+ Mark Society Holiday" or select any calendar day to declare a holiday.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Society Policy Reminder */}
          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="p-2.5 bg-slate-50 rounded-lg text-[11px] text-slate-600 space-y-1">
              <div className="flex items-center gap-1 font-bold text-slate-800">
                <Info className="w-3.5 h-3.5 text-blue-600" />
                <span>Society Bye-Laws Rule 42(B):</span>
              </div>
              <p>
                Official society holidays marked by the Managing Committee guarantee that household helpers are not penalized. Total working days in monthly billing are reduced accordingly.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Mark New Society Holiday */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                  <PartyPopper className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {t.addHolidayBtn}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Mark date as official holiday to update payroll working days
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xl leading-none"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.holidayName}:
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ganesh Chaturthi, Diwali, Republic Day"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.holidayDate}:
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.holidayCategory}:
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="festival">{t.categoryFestival}</option>
                    <option value="national">{t.categoryNational}</option>
                    <option value="society_special">{t.categorySpecial}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description / Notice to Residents & Staff:
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Society clubhouse puja and staff holiday."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                />
              </div>

              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-emerald-900">
                    {t.isPaidHoliday}
                  </p>
                  <p className="text-[11px] text-emerald-700">
                    Staff expected working days in payroll automatically reduced
                  </p>
                </div>
                <input
                  type="checkbox"
                  id="chk-paid-holiday"
                  checked={isPaidHoliday}
                  onChange={(e) => setIsPaidHoliday(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs cursor-pointer"
                >
                  Confirm & Update Payroll Days
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
