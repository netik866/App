import React, { useState } from 'react';
import { 
  BellRing, 
  CalendarX, 
  Plus, 
  Copy, 
  Check, 
  AlertCircle, 
  Users, 
  Building,
  UserCheck
} from 'lucide-react';
import { DailyHelp, QuickLeaveNotification, AppLanguage } from '../types';
import { translations } from '../utils/translations';

interface QuickLeaveSystemProps {
  currentLang: AppLanguage;
  dailyHelps: DailyHelp[];
  leaveAlerts: QuickLeaveNotification[];
  onReportLeave: (newLeave: Omit<QuickLeaveNotification, 'id' | 'reportedAt'>) => void;
  onMarkBroadcastSent: (leaveId: string) => void;
}

export const QuickLeaveSystem: React.FC<QuickLeaveSystemProps> = ({
  currentLang,
  dailyHelps,
  leaveAlerts,
  onReportLeave,
  onMarkBroadcastSent,
}) => {
  const t = translations[currentLang];
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form states
  const [selectedHelpId, setSelectedHelpId] = useState(dailyHelps[0]?.id || '');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [leaveType, setLeaveType] = useState<'sick' | 'personal' | 'emergency' | 'festival'>('sick');
  const [reason, setReason] = useState('');
  const [substituteHelpId, setSubstituteHelpId] = useState<string>('');

  const selectedHelp = dailyHelps.find((h) => h.id === selectedHelpId);

  // Available substitutes in the same role
  const potentialSubstitutes = dailyHelps.filter(
    (h) => h.id !== selectedHelpId && h.role === selectedHelp?.role
  );

  const handleCopyAlertMessage = (leave: QuickLeaveNotification) => {
    const help = dailyHelps.find((h) => h.id === leave.helpId);
    const subHelp = dailyHelps.find((h) => h.id === leave.substituteHelpId);

    const message = `🚨 *GREEN VALLEY HEIGHTS NOTICE: DAILY HELP LEAVE ALERT* 🚨
━━━━━━━━━━━━━━━━━━━━━━━━━━
Staff: ${help?.fullName || 'Daily Help'} (${help?.role})
Dates: ${leave.startDate} to ${leave.endDate}
Reason: ${leave.reason} (${leave.leaveType.toUpperCase()})

📍 *Affected Flats:* ${leave.affectedFlats.join(', ')}
${
  subHelp
    ? `✅ *Recommended Substitute Staff:* ${subHelp.fullName} (${subHelp.phone}) - Available on request.`
    : `⚠️ *Substitute:* No dedicated substitute assigned. Society desk will assist if needed.`
}

Sent by Society Management Desk`;

    navigator.clipboard.writeText(message);
    setCopiedId(leave.id);
    onMarkBroadcastSent(leave.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHelp) return;

    onReportLeave({
      helpId: selectedHelpId,
      startDate,
      endDate,
      leaveType,
      reason: reason.trim() || 'Leave reported to society desk',
      affectedFlats: selectedHelp.assignedFlats,
      substituteHelpId: substituteHelpId || undefined,
      broadcastSent: false,
      status: 'approved',
    });

    setIsLeaveModalOpen(false);
    setReason('');
    setSubstituteHelpId('');
  };

  return (
    <div className="space-y-5">
      {/* Header and Add Leave Alert */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <BellRing className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              {t.leaveTitle}
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {t.leaveSubtitle}
          </p>
        </div>

        <button
          type="button"
          id="btn-open-report-leave"
          onClick={() => setIsLeaveModalOpen(true)}
          className="flex items-center justify-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-bold text-white bg-amber-600 hover:bg-amber-700 active:bg-amber-800 rounded-lg shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          {t.reportLeaveBtn}
        </button>
      </div>

      {/* Broadcast Alerts Board */}
      <div className="space-y-3.5">
        {leaveAlerts.map((leave) => {
          const help = dailyHelps.find((h) => h.id === leave.helpId);
          const substitute = dailyHelps.find((h) => h.id === leave.substituteHelpId);
          const isCopied = copiedId === leave.id;

          return (
            <div
              key={leave.id}
              id={`leave-alert-${leave.id}`}
              className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs hover:border-amber-300 transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Help information & dates */}
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
                    <CalendarX className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-bold text-slate-900">
                        {help?.fullName || 'Daily Help'}
                      </h3>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 capitalize">
                        {help?.role}
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                        {leave.leaveType === 'sick'
                          ? t.leaveTypeSick
                          : leave.leaveType === 'personal'
                          ? t.leaveTypePersonal
                          : leave.leaveType === 'emergency'
                          ? t.leaveTypeEmergency
                          : t.leaveTypeFestival}
                      </span>
                    </div>

                    <p className="text-xs font-medium text-slate-600 mt-1">
                      Leave Duration:{' '}
                      <span className="font-bold text-slate-800">
                        {leave.startDate} {leave.startDate !== leave.endDate && `to ${leave.endDate}`}
                      </span>{' '}
                      • Reason: <span className="italic text-slate-700">{leave.reason}</span>
                    </p>

                    {/* Affected Flats Strip */}
                    <div className="mt-2.5 flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        {t.affectedFlats}:
                      </span>
                      <div className="flex gap-1.5 flex-wrap">
                        {leave.affectedFlats.map((flat) => (
                          <span
                            key={flat}
                            className="px-2 py-0.5 rounded-md text-xs font-bold font-mono bg-red-50 text-red-700 border border-red-200"
                          >
                            Flat {flat}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Substitute Suggestion */}
                    {substitute && (
                      <div className="mt-2 text-xs flex items-center gap-1.5 text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                        <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>
                          {t.suggestedSubstitute}: <strong>{substitute.fullName}</strong> ({substitute.phone})
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right side: Action to copy broadcast & alert residents */}
                <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between gap-2.5 shrink-0">
                  <button
                    type="button"
                    id={`btn-copy-alert-${leave.id}`}
                    onClick={() => handleCopyAlertMessage(leave)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer shadow-xs ${
                      isCopied
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>{t.alertCopied}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>{t.copyAlertMessage}</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    {leave.broadcastSent ? (
                      <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                        <Check className="w-3 h-3" />
                        {t.broadcastSentBadge}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-amber-700 font-medium">
                        <AlertCircle className="w-3 h-3" />
                        Pending WhatsApp Broadcast
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {leaveAlerts.length === 0 && (
          <div className="bg-white p-10 text-center rounded-xl border border-slate-200 text-slate-500">
            <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-medium">No active leaves reported. Society staff attendance is at 100%.</p>
          </div>
        )}
      </div>

      {/* Report Leave Modal */}
      {isLeaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                  <CalendarX className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  {t.reportLeaveBtn}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsLeaveModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xl leading-none"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Daily Help Reporting Leave:
                </label>
                <select
                  value={selectedHelpId}
                  onChange={(e) => setSelectedHelpId(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900"
                >
                  {dailyHelps.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.fullName} ({h.id}) - {h.role}
                    </option>
                  ))}
                </select>
                {selectedHelp && (
                  <div className="mt-1.5 flex items-center gap-1.5 flex-wrap text-xs text-slate-500">
                    <span>Assigned Flats:</span>
                    {selectedHelp.assignedFlats.map((f) => (
                      <span key={f} className="px-1.5 py-0.5 rounded font-mono font-bold bg-slate-100 text-slate-700">
                        {f}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Start Date:
                  </label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    End Date:
                  </label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Leave Type:
                </label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="sick">{t.leaveTypeSick}</option>
                  <option value="personal">{t.leaveTypePersonal}</option>
                  <option value="emergency">{t.leaveTypeEmergency}</option>
                  <option value="festival">{t.leaveTypeFestival}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Reason for Absence:
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Viral fever, doctor appointment, daughter wedding"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Substitute Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Suggested Substitute Daily Help (Optional):
                </label>
                <select
                  value={substituteHelpId}
                  onChange={(e) => setSubstituteHelpId(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800"
                >
                  <option value="">-- No substitute assigned --</option>
                  {potentialSubstitutes.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.fullName} ({sub.id}) - {sub.phone}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-400 mt-1">
                  Substitutes with identical skill category are listed above for seamless resident coverage.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsLeaveModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs cursor-pointer"
                >
                  Confirm & Generate Broadcast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
