import React, { useState } from 'react';
import { 
  FileText, 
  Printer, 
  CheckCircle2, 
  RotateCcw, 
  Check, 
  Building2, 
  Calendar,
  AlertCircle,
  Copy,
  Check as CheckIcon
} from 'lucide-react';
import { DailyHelp, SalaryAdvance, PayrollRecord, SocietyHoliday, AppLanguage } from '../types';
import { translations, roleLabels } from '../utils/translations';

interface PayrollGeneratorProps {
  currentLang: AppLanguage;
  dailyHelps: DailyHelp[];
  advances: SalaryAdvance[];
  payrolls: PayrollRecord[];
  holidays?: SocietyHoliday[];
  onUpdatePayrollStatus: (payrollId: string, status: 'draft' | 'approved' | 'paid', mode?: 'UPI' | 'Bank Transfer') => void;
  onRecalculateAll: () => void;
  onNavigateToHolidays?: () => void;
}

export const PayrollGenerator: React.FC<PayrollGeneratorProps> = ({
  currentLang,
  dailyHelps,
  advances,
  payrolls,
  holidays = [],
  onUpdatePayrollStatus,
  onRecalculateAll,
  onNavigateToHolidays,
}) => {
  const t = translations[currentLang];
  const [selectedMonth, setSelectedMonth] = useState('2026-09');
  const [activePayslip, setActivePayslip] = useState<PayrollRecord | null>(null);

  const monthHolidays = holidays.filter((h) => h.date.startsWith(selectedMonth));
  const holidaysCount = monthHolidays.length;

  const totalGrossPayroll = payrolls.reduce((acc, p) => acc + p.grossPay, 0);
  const totalAdvancesDeducted = payrolls.reduce((acc, p) => acc + p.advanceDeductions, 0);
  const totalNetPayable = payrolls.reduce((acc, p) => acc + p.netPay, 0);

  const activeHelp = activePayslip
    ? dailyHelps.find((h) => h.id === activePayslip.helpId)
    : null;

  const [copiedSlip, setCopiedSlip] = useState(false);
  const [copiedLedger, setCopiedLedger] = useState(false);

  // Find advances associated with the active help for this month
  const helpAdvancesForSlip = activeHelp
    ? advances.filter(
        (a) => a.helpId === activeHelp.id && a.status === 'approved_paid'
      )
    : [];

  const handlePrint = () => {
    window.print();
  };

  // Generate WhatsApp formatted text for an individual payslip
  const handleCopyPayslipText = () => {
    if (!activePayslip || !activeHelp) return;

    const advText = helpAdvancesForSlip.length > 0
      ? helpAdvancesForSlip.map((a) => `   - ₹${a.amount} (Ref: ${a.upiTransactionRef})`).join('\n')
      : '   - ₹0 (No advances taken)';

    const roleStr = roleLabels[activeHelp.role]?.[currentLang] || activeHelp.role;
    const text = `📄 *GREEN VALLEY HEIGHTS CHS - SALARY DISBURSEMENT SLIP*
🆔 *Voucher:* ${activePayslip.id}
📅 *Month:* ${selectedMonth}
👤 *Staff Member:* ${activeHelp.fullName} (${roleStr})
🏢 *Flats Assigned:* ${activeHelp.assignedFlats.join(', ')}

🗓️ *ATTENDANCE BREAKDOWN:*
• Total Days in Month: ${activePayslip.daysInMonth}
• Society Paid Holidays: ${activePayslip.societyHolidaysCount || 0} Days (Credited)
• Required Working Days: ${activePayslip.workingDays} Days
• Days Present: ${activePayslip.presentDays} Days
• Unpaid Leaves: ${activePayslip.unpaidLeaves} Days

💰 *SALARY BREAKDOWN:*
• Agreed Base Salary: ₹${activePayslip.baseSalary.toLocaleString('en-IN')}
${activePayslip.bonus > 0 ? `• Punctuality / Festival Bonus: +₹${activePayslip.bonus.toLocaleString('en-IN')}\n` : ''}• Gross Earnings: ₹${activePayslip.grossPay.toLocaleString('en-IN')}
• UPI Advance Deductions: -₹${activePayslip.advanceDeductions.toLocaleString('en-IN')}
${advText}
${activePayslip.unpaidLeaves > 0 ? `• Unpaid Leave Deduction: -₹${(activePayslip.unpaidLeaves * activePayslip.perDayRate).toFixed(0)}\n` : ''}
━━━━━━━━━━━━━━━━━━━━━━━━━━
💵 *NET SALARY DISBURSEMENT: ₹${activePayslip.netPay.toLocaleString('en-IN')}*
━━━━━━━━━━━━━━━━━━━━━━━━━━
Status: ${activePayslip.status === 'paid' ? `Disbursed via ${activePayslip.paymentMode || 'UPI'}` : 'Approved for Disbursal'}

_Authorized Signatory, Green Valley Heights Co-op Housing Society_`;

    navigator.clipboard.writeText(text);
    setCopiedSlip(true);
    setTimeout(() => setCopiedSlip(false), 2500);
  };

  // Generate WhatsApp formatted monthly payroll ledger summary for Managing Committee
  const handleCopyPayrollLedger = () => {
    const rowsText = payrolls.map((rec, i) => {
      const h = dailyHelps.find((dh) => dh.id === rec.helpId);
      const name = h ? h.fullName : rec.helpId;
      const role = h ? (roleLabels[h.role]?.[currentLang] || h.role) : '';
      return `${i + 1}. *${name}* (${role})
   Base: ₹${rec.baseSalary} | Adv Deduct: -₹${rec.advanceDeductions} | *Net: ₹${rec.netPay}* (${rec.status.toUpperCase()})`;
    }).join('\n\n');

    const text = `📊 *GREEN VALLEY HEIGHTS CHS - MONTHLY PAYROLL LEDGER*
📅 *Period:* ${selectedMonth}
🎉 *Society Holidays:* ${holidaysCount} Days | *Staff Workdays:* ${30 - holidaysCount} Days

👥 *STAFF DISBURSEMENTS (${payrolls.length} Members):*
${rowsText}

━━━━━━━━━━━━━━━━━━━━━━━━━━
📈 *FINANCIAL CONSOLIDATION:*
• Gross Base Wages: ₹${totalGrossPayroll.toLocaleString('en-IN')}
• Total UPI Advances Recovered: -₹${totalAdvancesDeducted.toLocaleString('en-IN')}
• *Total Net Society Payout: ₹${totalNetPayable.toLocaleString('en-IN')}*
━━━━━━━━━━━━━━━━━━━━━━━━━━

Submitted for Society Managing Committee Approval.
_Accounts & Treasury, Green Valley Heights CHS_`;

    navigator.clipboard.writeText(text);
    setCopiedLedger(true);
    setTimeout(() => setCopiedLedger(false), 2500);
  };

  return (
    <div className="space-y-5">
      {/* Header & Month Control */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                {t.payrollTitle}
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {t.payrollSubtitle}
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Month Picker */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Billing Cycle:</span>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-transparent font-bold text-slate-900 focus:outline-none cursor-pointer"
              >
                <option value="2026-09">September 2026</option>
                <option value="2026-08">August 2026</option>
                <option value="2026-07">July 2026</option>
              </select>
            </div>

            <button
              type="button"
              id="btn-copy-payroll-ledger"
              onClick={handleCopyPayrollLedger}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                copiedLedger
                  ? 'bg-emerald-700 text-white'
                  : 'text-emerald-800 bg-emerald-50 border border-emerald-300 hover:bg-emerald-100'
              }`}
              title="Copy formatted monthly payroll summary for WhatsApp Managing Committee group"
            >
              {copiedLedger ? <CheckIcon className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLedger ? 'Copied Summary! ✓' : 'Copy Ledger (WhatsApp)'}</span>
            </button>

            <button
              type="button"
              id="btn-recalculate-payroll"
              onClick={onRecalculateAll}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>{t.generatePayrollBtn}</span>
            </button>
          </div>
        </div>

        {/* Financial Summary Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-100">
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-xs font-semibold text-slate-500">Gross Monthly Wages</p>
            <p className="text-xl font-extrabold text-slate-900 mt-0.5">
              ₹{totalGrossPayroll.toLocaleString('en-IN')}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">Across all registered flats</p>
          </div>

          <div className="p-3 bg-purple-50/70 border border-purple-100 rounded-lg">
            <p className="text-xs font-semibold text-purple-900">Total UPI Advances Deducted</p>
            <p className="text-xl font-extrabold text-purple-700 mt-0.5">
              - ₹{totalAdvancesDeducted.toLocaleString('en-IN')}
            </p>
            <p className="text-[11px] text-purple-600 mt-0.5">Adjusted via UPI Ledger</p>
          </div>

          <div className="p-3 bg-emerald-50/80 border border-emerald-100 rounded-lg">
            <p className="text-xs font-semibold text-emerald-900">Net Society Payout Required</p>
            <p className="text-xl font-extrabold text-emerald-700 mt-0.5">
              ₹{totalNetPayable.toLocaleString('en-IN')}
            </p>
            <p className="text-[11px] text-emerald-600 mt-0.5">Ready for bank / UPI transfer</p>
          </div>
        </div>

        {/* Society Holiday Working Days Reduction Banner */}
        <div className="mt-3 p-3 bg-amber-50/80 border border-amber-200/80 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-amber-200 text-amber-900 font-bold text-[10px]">
              CALENDAR SYNC
            </span>
            <span className="text-slate-800">
              <strong>{holidaysCount} Society Holidays</strong> marked in {selectedMonth}. Expected monthly working days automatically reduced to <strong>{30 - holidaysCount} days</strong> for all staff.
            </span>
          </div>

          {onNavigateToHolidays && (
            <button
              type="button"
              id="btn-goto-holiday-calendar"
              onClick={onNavigateToHolidays}
              className="text-amber-800 hover:text-amber-950 font-bold underline shrink-0 cursor-pointer text-[11px]"
            >
              Configure Holiday Calendar →
            </button>
          )}
        </div>
      </div>

      {/* Automated Payroll Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Staff Member</th>
                <th className="py-3 px-3">Role</th>
                <th className="py-3 px-3 text-right">{t.basePay}</th>
                <th className="py-3 px-3 text-center">Working Days (Post-Holidays)</th>
                <th className="py-3 px-3 text-right text-purple-700">{t.advancesDeducted}</th>
                <th className="py-3 px-3 text-right">{t.bonusAdditions}</th>
                <th className="py-3 px-4 text-right font-extrabold text-slate-900">{t.netPayable}</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-4 text-center">Payslip</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payrolls.map((rec) => {
                const help = dailyHelps.find((h) => h.id === rec.helpId);
                const isPaid = rec.status === 'paid';

                return (
                  <tr 
                    key={rec.id} 
                    id={`payroll-row-${rec.id}`}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    {/* Staff Name & ID */}
                    <td className="py-3 px-4 font-semibold text-slate-900 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={help?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                          alt={help?.fullName || 'Help'}
                          referrerPolicy="no-referrer"
                          className="w-7 h-7 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{help?.fullName}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{rec.helpId}</p>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-3 px-3 text-slate-600 capitalize whitespace-nowrap">
                      {help?.role.replace('_', ' ')}
                    </td>

                    {/* Base Wages */}
                    <td className="py-3 px-3 text-right font-medium text-slate-700 whitespace-nowrap">
                      ₹{rec.baseSalary.toLocaleString('en-IN')}
                    </td>

                    {/* Attendance with Holidays Calculation */}
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <div>
                        <span className="font-bold text-emerald-700">
                          {rec.presentDays}
                        </span>
                        <span className="text-slate-400"> / {rec.workingDays} days</span>
                        {rec.societyHolidaysCount > 0 && (
                          <div className="text-[10px] text-amber-700 font-semibold">
                            ({rec.societyHolidaysCount} Society Holidays deducted)
                          </div>
                        )}
                        {rec.unpaidLeaves > 0 && (
                          <span className="ml-1 text-[10px] text-amber-700 bg-amber-50 px-1 rounded">
                            (-{rec.unpaidLeaves}d unpaid)
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Advance Deductions */}
                    <td className="py-3 px-3 text-right font-bold text-purple-700 whitespace-nowrap">
                      {rec.advanceDeductions > 0 ? (
                        <span>- ₹{rec.advanceDeductions.toLocaleString('en-IN')}</span>
                      ) : (
                        <span className="text-slate-300 font-normal">₹0</span>
                      )}
                    </td>

                    {/* Bonus */}
                    <td className="py-3 px-3 text-right font-medium text-emerald-700 whitespace-nowrap">
                      + ₹{rec.bonus.toLocaleString('en-IN')}
                    </td>

                    {/* Net Payable */}
                    <td className="py-3 px-4 text-right font-black text-slate-900 text-sm whitespace-nowrap">
                      ₹{rec.netPay.toLocaleString('en-IN')}
                    </td>

                    {/* Status badge */}
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      {isPaid ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Disbursed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          Approved
                        </span>
                      )}
                    </td>

                    {/* Action: View Slip */}
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <button
                        type="button"
                        id={`btn-view-slip-${rec.id}`}
                        onClick={() => setActivePayslip(rec)}
                        className="px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md transition-colors cursor-pointer"
                      >
                        {t.viewPayslip}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Official Society Itemized Payslip Modal */}
      {activePayslip && activeHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8">
            {/* Header / Modal Close */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 print:hidden">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 text-xs font-bold font-mono">
                  Receipt #{activePayslip.societyReceiptNo}
                </span>
                <span className="text-xs text-slate-500">
                  Billing: {activePayslip.month}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  id="btn-copy-payslip-text-top"
                  onClick={handleCopyPayslipText}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    copiedSlip
                      ? 'bg-emerald-700 text-white'
                      : 'text-emerald-800 bg-emerald-50 border border-emerald-300 hover:bg-emerald-100'
                  }`}
                  title="Copy formatted payslip text to paste directly into WhatsApp"
                >
                  {copiedSlip ? <CheckIcon className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSlip ? 'Copied Payslip! ✓' : 'Copy for WhatsApp'}</span>
                </button>
                <button
                  type="button"
                  id="btn-print-slip"
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  {t.printPayslip}
                </button>
                <button
                  type="button"
                  onClick={() => setActivePayslip(null)}
                  className="text-slate-400 hover:text-slate-600 text-xl leading-none"
                >
                  &times;
                </button>
              </div>
            </div>

            {/* Printable Payslip Card */}
            <div className="mt-4 p-5 sm:p-6 border-2 border-slate-300 rounded-xl bg-slate-50/40 text-slate-900 space-y-4">
              {/* Society Formal Header */}
              <div className="text-center pb-3 border-b-2 border-slate-800">
                <h3 className="text-lg font-black uppercase tracking-tight text-slate-900">
                  Green Valley Heights Co-Op. Housing Society Ltd.
                </h3>
                <p className="text-xs text-slate-600 font-medium">
                  Regn. No.: BOM/HSG/2012/984 • Plot 14, Sector 19, Palm Beach Road
                </p>
                <div className="mt-1.5 inline-block px-3 py-0.5 bg-slate-900 text-white font-bold text-xs rounded tracking-wider uppercase">
                  Monthly Daily Help Salary Voucher / Pay Slip
                </div>
              </div>

              {/* Staff Details Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-slate-500">Staff Name:</p>
                  <p className="text-sm font-bold text-slate-900">{activeHelp.fullName}</p>
                  <p className="text-slate-500 mt-1">Staff ID / PIN:</p>
                  <p className="font-mono font-bold text-slate-800">{activeHelp.id} (PIN: {activeHelp.passcode})</p>
                </div>
                <div>
                  <p className="text-slate-500">Category & Assigned Flats:</p>
                  <p className="font-bold text-slate-800 capitalize">
                    {activeHelp.role.replace('_', ' ')} • Flats: {activeHelp.assignedFlats.join(', ')}
                  </p>
                  <p className="text-slate-500 mt-1">UPI ID for Disbursement:</p>
                  <p className="font-mono font-bold text-purple-700">{activeHelp.upiId}</p>
                </div>
              </div>

              {/* Attendance Breakdown */}
              <div className="bg-white p-3 rounded-lg border border-slate-200 grid grid-cols-5 gap-2 text-center text-xs">
                <div>
                  <span className="text-slate-400 block">Total Days</span>
                  <span className="font-bold text-slate-800">{activePayslip.daysInMonth}</span>
                </div>
                <div>
                  <span className="text-amber-600 block">Society Holidays</span>
                  <span className="font-bold text-amber-700">-{activePayslip.societyHolidaysCount || 0}</span>
                </div>
                <div>
                  <span className="text-blue-600 block">Working Days</span>
                  <span className="font-bold text-blue-800">{activePayslip.workingDays}</span>
                </div>
                <div>
                  <span className="text-emerald-600 block">Days Present</span>
                  <span className="font-bold text-emerald-700">{activePayslip.presentDays}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Unpaid Leaves</span>
                  <span className="font-bold text-slate-700">{activePayslip.unpaidLeaves}</span>
                </div>
              </div>

              {/* Itemized Calculation Ledger */}
              <div className="border border-slate-200 rounded-lg overflow-hidden bg-white text-xs">
                <div className="grid grid-cols-2 bg-slate-100 p-2 font-bold text-slate-700 border-b border-slate-200">
                  <span>Earnings Component</span>
                  <span className="text-right">Amount (₹)</span>
                </div>
                <div className="p-2 space-y-1.5 divide-y divide-slate-100">
                  <div className="flex justify-between pt-1">
                    <span className="text-slate-600">Agreed Base Wages</span>
                    <span className="font-semibold text-slate-800">₹{activePayslip.baseSalary.toLocaleString('en-IN')}</span>
                  </div>
                  {activePayslip.bonus > 0 && (
                    <div className="flex justify-between pt-1">
                      <span className="text-slate-600">Festival Bonus / Punctuality Allowance</span>
                      <span className="font-semibold text-emerald-700">+ ₹{activePayslip.bonus.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-1 font-bold text-slate-900">
                    <span>Gross Earnings</span>
                    <span>₹{activePayslip.grossPay.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Deductions Header */}
                <div className="grid grid-cols-2 bg-purple-50/80 p-2 font-bold text-purple-900 border-t border-b border-purple-200">
                  <span>Deductions & Advances</span>
                  <span className="text-right">Deducted (₹)</span>
                </div>
                <div className="p-2 space-y-1.5 divide-y divide-slate-100">
                  {helpAdvancesForSlip.length > 0 ? (
                    helpAdvancesForSlip.map((adv) => (
                      <div key={adv.id} className="flex justify-between pt-1 text-[11px]">
                        <span className="text-slate-600">
                          UPI Advance ({adv.requestedDate}) • <span className="font-mono text-purple-800">{adv.upiTransactionRef}</span>
                        </span>
                        <span className="font-bold text-purple-700">- ₹{adv.amount.toLocaleString('en-IN')}</span>
                      </div>
                    ))
                  ) : (
                    <div className="flex justify-between pt-1">
                      <span className="text-slate-400 italic">No UPI advances in this billing cycle</span>
                      <span className="text-slate-400">₹0</span>
                    </div>
                  )}

                  {activePayslip.unpaidLeaves > 0 && (
                    <div className="flex justify-between pt-1 text-[11px]">
                      <span className="text-slate-600">Leave without pay ({activePayslip.unpaidLeaves} days)</span>
                      <span className="font-bold text-amber-700">
                        - ₹{(activePayslip.unpaidLeaves * activePayslip.perDayRate).toFixed(0)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Total Net Payable Bar */}
                <div className="bg-slate-900 text-white p-3 flex justify-between items-center text-sm font-black">
                  <span>NET SALARY DISBURSEMENT</span>
                  <span className="text-base text-emerald-400">
                    ₹{activePayslip.netPay.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Official Seal & Signatures */}
              <div className="pt-4 flex items-end justify-between text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <div className="w-16 h-16 rounded-full border-2 border-dashed border-emerald-600 flex flex-col items-center justify-center text-[9px] font-bold text-emerald-800 text-center leading-tight">
                    <Building2 className="w-3.5 h-3.5 text-emerald-700 mb-0.5" />
                    GVH CHS
                    <span>SEAL</span>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-700">Certified by Accounts Dept.</p>
                    <p className="text-[11px] text-slate-400">Green Valley Heights CHS</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="h-8 border-b border-slate-400 w-36 ml-auto"></div>
                  <p className="font-semibold text-slate-700 mt-1">Hon. Treasurer / Secretary</p>
                  <p className="text-[10px] text-slate-400">Authorized Signatory</p>
                </div>
              </div>
            </div>

            {/* Action Bar (Close & Disburse status) */}
            <div className="mt-5 flex items-center justify-between pt-3 border-t border-slate-200 print:hidden">
              <div className="flex items-center gap-2">
                {activePayslip.status !== 'paid' ? (
                  <button
                    type="button"
                    id="btn-mark-slip-paid"
                    onClick={() => {
                      onUpdatePayrollStatus(activePayslip.id, 'paid', 'UPI');
                      setActivePayslip({
                        ...activePayslip,
                        status: 'paid',
                        paymentMode: 'UPI',
                        paidDate: new Date().toISOString().split('T')[0],
                      });
                    }}
                    className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Disburse Net Pay via UPI
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4" />
                    Disbursed on {activePayslip.paidDate || 'Today'} via {activePayslip.paymentMode || 'UPI'}
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => setActivePayslip(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
              >
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
