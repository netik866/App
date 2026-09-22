import React, { useState } from 'react';
import { 
  Search, 
  LogIn, 
  LogOut, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  CalendarX, 
  Building,
  KeyRound,
  Copy,
  Check
} from 'lucide-react';
import { DailyHelp, AppLanguage, DailyHelpRole } from '../types';
import { translations, roleLabels } from '../utils/translations';

interface AttendanceManagerProps {
  currentLang: AppLanguage;
  dailyHelps: DailyHelp[];
  onCheckIn: (helpId: string, flat?: string) => void;
  onCheckOut: (helpId: string) => void;
  onViewProfile: (help: DailyHelp) => void;
}

export const AttendanceManager: React.FC<AttendanceManagerProps> = ({
  currentLang,
  dailyHelps,
  onCheckIn,
  onCheckOut,
  onViewProfile,
}) => {
  const t = translations[currentLang];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  
  // Gate check-in passcode modal state
  const [quickPasscode, setQuickPasscode] = useState('');
  const [selectedFlatForCheckIn, setSelectedFlatForCheckIn] = useState<string>('');
  const [gateModalHelp, setGateModalHelp] = useState<DailyHelp | null>(null);
  const [passcodeError, setPasscodeError] = useState('');

  // Filter list
  const filteredHelps = dailyHelps.filter((help) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      !q ||
      help.fullName.toLowerCase().includes(q) ||
      help.id.toLowerCase().includes(q) ||
      help.phone.includes(q) ||
      help.assignedFlats.some(f => f.toLowerCase().includes(q));

    const matchesRole = selectedRole === 'all' || help.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || help.todayStatus === selectedStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleOpenGateModal = (help: DailyHelp) => {
    setGateModalHelp(help);
    setQuickPasscode('');
    setSelectedFlatForCheckIn(help.assignedFlats[0] || '');
    setPasscodeError('');
  };

  const handleConfirmGateAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gateModalHelp) return;

    // Verify passcode if entered or allow direct committee bypass
    if (quickPasscode && quickPasscode !== gateModalHelp.passcode) {
      setPasscodeError('Invalid 4-digit Passcode. Please check staff ID card.');
      return;
    }

    if (gateModalHelp.todayStatus === 'present') {
      onCheckOut(gateModalHelp.id);
    } else {
      onCheckIn(gateModalHelp.id, selectedFlatForCheckIn);
    }
    setGateModalHelp(null);
  };

  const [copiedReport, setCopiedReport] = useState(false);

  // Generate WhatsApp formatted Gate Attendance Report
  const handleCopyGateReport = () => {
    const todayStr = new Date().toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    const presentHelps = dailyHelps.filter((h) => h.todayStatus === 'present');
    const onLeaveHelps = dailyHelps.filter((h) => h.todayStatus === 'on_leave' || h.todayStatus === 'absent');
    const checkedOutHelps = dailyHelps.filter((h) => h.todayStatus === 'checked_out');

    const presentList = presentHelps.length > 0
      ? presentHelps.map((h, i) => {
          const roleStr = roleLabels[h.role]?.[currentLang] || h.role;
          return `  ${i + 1}. ✅ *${h.fullName}* (${roleStr})\n     🕒 In: ${h.checkInTime || 'Morning'} | Flats: ${h.assignedFlats.join(', ')}`;
        }).join('\n\n')
      : '  • None checked in currently.';

    const leaveList = onLeaveHelps.length > 0
      ? onLeaveHelps.map((h, i) => {
          const roleStr = roleLabels[h.role]?.[currentLang] || h.role;
          return `  ${i + 1}. ❌ *${h.fullName}* (${roleStr}) - On Leave (Flats: ${h.assignedFlats.join(', ')})`;
        }).join('\n')
      : '  • None reported on leave today.';

    const text = `🚪 *GREEN VALLEY HEIGHTS CHS - DAILY GATE ATTENDANCE LOG*
📅 *Date:* ${todayStr}
📍 *Location:* Main Security Gates 1 & 2

📊 *DAILY SUMMARY:*
• Total Registered Staff: ${dailyHelps.length}
• Currently Inside Society: ${presentHelps.length}
• Reported on Leave: ${onLeaveHelps.length}
• Checked Out: ${checkedOutHelps.length}

🟢 *STAFF CURRENTLY ON PREMISES:*
${presentList}

🔴 *STAFF ON LEAVE TODAY:*
${leaveList}

━━━━━━━━━━━━━━━━━━━━━━━━━━
Security Gate Desk | Green Valley Heights Co-Op Housing Society Ltd.`;

    navigator.clipboard.writeText(text);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2500);
  };

  return (
    <div className="space-y-4">
      {/* Header & Filter Controls */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              {t.attendanceTitle}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {t.attendanceSubtitle}
            </p>
          </div>
          
          <div className="flex items-center gap-2 text-xs flex-wrap">
            <button
              type="button"
              id="btn-copy-gate-report"
              onClick={handleCopyGateReport}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                copiedReport
                  ? 'bg-emerald-700 text-white'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
              }`}
              title="Copy attendance summary to paste in society WhatsApp group"
            >
              {copiedReport ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedReport ? 'Copied Log! ✓' : 'Copy Gate Log (WhatsApp)'}</span>
            </button>

            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Gate 1 & 2 Live
            </span>
            <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-medium">
              Today: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
          {/* Search box */}
          <div className="relative sm:col-span-2 lg:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="input-search-attendance"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchGatePlaceholder}
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-900"
            />
          </div>

          {/* Role Filter */}
          <div>
            <select
              id="select-role-filter"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              aria-label={t.filterRole}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700"
            >
              <option value="all">{t.allRoles}</option>
              <option value="maid">Maid / Housekeeper</option>
              <option value="cook">Cook / Chef</option>
              <option value="nanny">Nanny / Babysitter</option>
              <option value="driver">Driver</option>
              <option value="elderly_care">Elderly Caretaker</option>
              <option value="car_cleaner">Car Cleaner</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              id="select-status-filter"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              aria-label="Filter by Status"
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700"
            >
              <option value="all">All Gate Statuses</option>
              <option value="present">Inside Society (Checked-In)</option>
              <option value="checked_out">Checked Out (Exited)</option>
              <option value="on_leave">On Approved Leave</option>
              <option value="absent">Absent</option>
            </select>
          </div>
        </div>
      </div>

      {/* Attendance Cards Grid / Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredHelps.map((help) => {
          const isPresent = help.todayStatus === 'present';
          const isOnLeave = help.todayStatus === 'on_leave';
          const roleName = roleLabels[help.role]?.[currentLang] || help.role;

          return (
            <div
              key={help.id}
              id={`card-help-${help.id}`}
              className={`bg-white rounded-xl border transition-all p-4 shadow-xs hover:shadow-sm ${
                isPresent 
                  ? 'border-emerald-300 ring-1 ring-emerald-100' 
                  : isOnLeave
                  ? 'border-amber-200 bg-amber-50/20'
                  : 'border-slate-200'
              }`}
            >
              {/* Top Row: Avatar, Name, Role & Status Pill */}
              <div className="flex items-start gap-3">
                <img
                  src={help.avatarUrl}
                  alt={help.fullName}
                  referrerPolicy="no-referrer"
                  className="w-13 h-13 rounded-full object-cover border-2 border-white shadow-xs shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h3 
                      onClick={() => onViewProfile(help)}
                      className="text-sm font-bold text-slate-900 truncate hover:text-emerald-700 cursor-pointer"
                    >
                      {help.fullName}
                    </h3>
                    <span className="text-[11px] font-mono font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                      {help.id}
                    </span>
                  </div>
                  
                  <p className="text-xs text-slate-500 truncate mt-0.5">
                    {roleName}
                  </p>

                  <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
                    {isPresent && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                        {t.statusPresent}
                      </span>
                    )}
                    {help.todayStatus === 'checked_out' && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {t.statusCheckedOut}
                      </span>
                    )}
                    {isOnLeave && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                        <CalendarX className="w-3 h-3 text-amber-600" />
                        {t.statusOnLeave}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Working Information & Flats */}
              <div className="mt-3 pt-3 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-1 text-slate-400">
                    <Building className="w-3.5 h-3.5" />
                    {t.assignedFlats}:
                  </span>
                  <div className="flex gap-1 flex-wrap justify-end">
                    {help.assignedFlats.map((flat) => (
                      <span
                        key={flat}
                        className={`px-1.5 py-0.5 rounded text-[11px] font-medium font-mono ${
                          help.currentFlat === flat && isPresent
                            ? 'bg-emerald-600 text-white font-bold'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {flat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Gate Entry Timestamps */}
                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-1 text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    {isPresent ? t.entryTime : t.exitTime}:
                  </span>
                  <span className="font-semibold text-slate-700">
                    {isPresent 
                      ? `${help.checkInTime || '08:00 AM'}` 
                      : help.checkOutTime 
                      ? `${help.checkOutTime}` 
                      : '--'}
                  </span>
                </div>

                {/* Current Flat location indicator */}
                {isPresent && help.currentFlat && (
                  <div className="flex items-center justify-between bg-emerald-50/70 text-emerald-800 px-2 py-1 rounded-md text-[11px] font-medium border border-emerald-100">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-600" />
                      {t.currentlyInFlat}:
                    </span>
                    <span className="font-bold">{help.currentFlat}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-3.5 flex items-center gap-2">
                {isPresent ? (
                  <button
                    type="button"
                    id={`btn-checkout-${help.id}`}
                    onClick={() => handleOpenGateModal(help)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    {t.markCheckOut}
                  </button>
                ) : (
                  <button
                    type="button"
                    id={`btn-checkin-${help.id}`}
                    onClick={() => handleOpenGateModal(help)}
                    disabled={isOnLeave}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                      isOnLeave
                        ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                    }`}
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    {t.markCheckIn}
                  </button>
                )}

                <button
                  type="button"
                  id={`btn-profile-${help.id}`}
                  onClick={() => onViewProfile(help)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  {t.viewProfile}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredHelps.length === 0 && (
        <div className="bg-white p-12 text-center rounded-xl border border-slate-200 text-slate-500">
          <Building className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-medium">No daily helps match your search or filter.</p>
        </div>
      )}

      {/* Gate Pass Verification & Check-In/Out Modal */}
      {gateModalHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {gateModalHelp.todayStatus === 'present' ? 'Confirm Gate Exit' : 'Security Gate Entry'}
                  </h3>
                  <p className="text-xs text-slate-500">{gateModalHelp.fullName} ({gateModalHelp.id})</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setGateModalHelp(null)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleConfirmGateAction} className="mt-4 space-y-3.5">
              {gateModalHelp.todayStatus !== 'present' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    First Visiting Flat:
                  </label>
                  <select
                    value={selectedFlatForCheckIn}
                    onChange={(e) => setSelectedFlatForCheckIn(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {gateModalHelp.assignedFlats.map((flat) => (
                      <option key={flat} value={flat}>
                        Flat {flat}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Security Gate PIN (Optional Security Verification):
                </label>
                <input
                  type="password"
                  maxLength={4}
                  value={quickPasscode}
                  onChange={(e) => {
                    setQuickPasscode(e.target.value);
                    setPasscodeError('');
                  }}
                  placeholder={`Staff Passcode (e.g. ${gateModalHelp.passcode})`}
                  className="w-full px-3 py-2 text-sm tracking-widest bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Card PIN on file: <span className="font-mono text-slate-600">{gateModalHelp.passcode}</span> (Guards can verify on ID badge)
                </p>
                {passcodeError && (
                  <p className="text-xs text-red-600 font-medium mt-1">{passcodeError}</p>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setGateModalHelp(null)}
                  className="px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 text-xs font-bold rounded-lg text-white shadow-xs cursor-pointer ${
                    gateModalHelp.todayStatus === 'present'
                      ? 'bg-amber-600 hover:bg-amber-700'
                      : 'bg-emerald-600 hover:bg-emerald-700'
                  }`}
                >
                  {gateModalHelp.todayStatus === 'present' ? 'Confirm Gate Check-Out' : 'Log Gate Check-In'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
