import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { 
  IndianRupee, 
  QrCode, 
  Check, 
  Copy, 
  Clock, 
  CheckCircle2, 
  Plus, 
  ShieldCheck,
  Send,
  ExternalLink
} from 'lucide-react';
import { DailyHelp, SalaryAdvance, AppLanguage } from '../types';
import { translations } from '../utils/translations';

interface SalaryAdvanceUPIProps {
  currentLang: AppLanguage;
  dailyHelps: DailyHelp[];
  advances: SalaryAdvance[];
  onRequestAdvance: (newAdvance: Omit<SalaryAdvance, 'id'>) => void;
  onConfirmPayment: (advanceId: string, utr: string) => void;
  onRejectAdvance: (advanceId: string) => void;
}

export const SalaryAdvanceUPI: React.FC<SalaryAdvanceUPIProps> = ({
  currentLang,
  dailyHelps,
  advances,
  onRequestAdvance,
  onConfirmPayment,
  onRejectAdvance,
}) => {
  const t = translations[currentLang];

  // Request Advance modal
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [selectedHelpId, setSelectedHelpId] = useState(dailyHelps[0]?.id || '');
  const [amount, setAmount] = useState<number>(2000);
  const [reason, setReason] = useState('');

  // Payment QR Modal
  const [activePaymentAdvance, setActivePaymentAdvance] = useState<SalaryAdvance | null>(null);
  const [utrNumber, setUtrNumber] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const qrCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const selectedHelpForAdvance = dailyHelps.find((h) => h.id === selectedHelpId);
  const activePayHelp = activePaymentAdvance
    ? dailyHelps.find((h) => h.id === activePaymentAdvance.helpId)
    : null;

  // Generate QR code whenever activePaymentAdvance changes
  useEffect(() => {
    if (activePaymentAdvance && activePayHelp && qrCanvasRef.current) {
      // Standard UPI URI format
      const upiUrl = `upi://pay?pa=${activePayHelp.upiId}&pn=${encodeURIComponent(
        activePayHelp.fullName
      )}&am=${activePaymentAdvance.amount}&cu=INR&tn=Salary%20Advance%20GVH`;

      QRCode.toCanvas(
        qrCanvasRef.current,
        upiUrl,
        {
          width: 220,
          margin: 2,
          color: {
            dark: '#0f172a',
            light: '#ffffff',
          },
        },
        (err) => {
          if (err) console.error('Error generating UPI QR code', err);
        }
      );
      // Pre-fill a realistic default UTR for demo testing convenience
      setUtrNumber(`UPI/GVH/${Date.now().toString().slice(-8)}`);
    }
  }, [activePaymentAdvance, activePayHelp]);

  const handleCopyUPI = (upiId: string) => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleSubmitAdvanceRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHelpId || amount <= 0 || !reason.trim()) return;

    onRequestAdvance({
      helpId: selectedHelpId,
      amount,
      requestedDate: new Date().toISOString().split('T')[0],
      reason: reason.trim(),
      status: 'pending',
      deductedInMonth: '2026-09',
    });

    setIsRequestModalOpen(false);
    setReason('');
    setAmount(2000);
  };

  const handleDisbursePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePaymentAdvance || !utrNumber.trim()) return;
    onConfirmPayment(activePaymentAdvance.id, utrNumber.trim());
    setActivePaymentAdvance(null);
    setUtrNumber('');
  };

  return (
    <div className="space-y-5">
      {/* Header and Call to Action */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              {t.advancesTitle}
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {t.advancesSubtitle}
          </p>
        </div>

        <button
          type="button"
          id="btn-open-request-advance"
          onClick={() => setIsRequestModalOpen(true)}
          className="flex items-center justify-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 active:bg-purple-800 rounded-lg shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          {t.requestAdvanceBtn}
        </button>
      </div>

      {/* Advance Requests Table / Cards */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Society Advance Request Ledger ({advances.length})
          </h3>
          <span className="text-[11px] font-medium text-slate-500">
            Auto-linked to September 2026 Payroll
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {advances.map((adv) => {
            const help = dailyHelps.find((h) => h.id === adv.helpId);
            const isApproved = adv.status === 'approved_paid';
            const isPending = adv.status === 'pending';

            return (
              <div
                key={adv.id}
                id={`row-advance-${adv.id}`}
                className="p-4 sm:px-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
              >
                {/* Staff Details & Reason */}
                <div className="flex items-start gap-3 min-w-0">
                  <img
                    src={help?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                    alt={help?.fullName || 'Staff'}
                    referrerPolicy="no-referrer"
                    className="w-11 h-11 rounded-full object-cover border border-slate-200 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-slate-900">
                        {help?.fullName || 'Staff Member'}
                      </h4>
                      <span className="text-[11px] font-mono font-medium px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                        {adv.helpId}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        UPI: {help?.upiId}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mt-1 font-medium">
                      Reason: <span className="text-slate-800 font-normal">{adv.reason}</span>
                    </p>

                    <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-400">
                      <span>Requested: {adv.requestedDate}</span>
                      {adv.upiTransactionRef && (
                        <span className="font-mono text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
                          UTR: {adv.upiTransactionRef}
                        </span>
                      )}
                      {adv.approvedBy && (
                        <span>Approved by: {adv.approvedBy}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Amount & Actions */}
                <div className="flex items-center justify-between md:justify-end gap-3 shrink-0">
                  <div className="text-right">
                    <p className="text-base font-extrabold text-slate-900 tracking-tight">
                      ₹{adv.amount.toLocaleString('en-IN')}
                    </p>
                    <div className="mt-0.5">
                      {isApproved && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          {t.approvedAndDisbursed}
                        </span>
                      )}
                      {isPending && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                          <Clock className="w-3 h-3 text-amber-600" />
                          {t.pendingApproval}
                        </span>
                      )}
                      {adv.status === 'rejected' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-800">
                          {t.rejected}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    {isPending ? (
                      <>
                        <button
                          type="button"
                          id={`btn-pay-upi-${adv.id}`}
                          onClick={() => setActivePaymentAdvance(adv)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-xs transition-colors cursor-pointer"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          <span>Pay via UPI</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onRejectAdvance(adv.id)}
                          className="px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:text-red-700 bg-slate-100 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setActivePaymentAdvance(adv)}
                        className="flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                      >
                        <QrCode className="w-3.5 h-3.5 text-slate-500" />
                        <span>View UPI QR</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {advances.length === 0 && (
            <div className="p-8 text-center text-slate-400 text-xs">
              {t.noAdvances}
            </div>
          )}
        </div>
      </div>

      {/* MODAL 1: Request New Advance */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                  <IndianRupee className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  {t.requestAdvanceBtn}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsRequestModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xl leading-none"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmitAdvanceRequest} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Select Daily Help:
                </label>
                <select
                  value={selectedHelpId}
                  onChange={(e) => setSelectedHelpId(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900"
                >
                  {dailyHelps.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.fullName} ({h.id}) - {h.role}
                    </option>
                  ))}
                </select>
                {selectedHelpForAdvance && (
                  <p className="text-[11px] text-slate-500 mt-1">
                    Linked UPI ID: <span className="font-mono text-slate-700 font-semibold">{selectedHelpForAdvance.upiId}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.advanceAmount}:
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-semibold text-slate-500">
                    ₹
                  </span>
                  <input
                    type="number"
                    min={200}
                    max={10000}
                    step={100}
                    required
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full pl-8 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-semibold text-slate-900"
                  />
                </div>
                <div className="flex gap-2 mt-1.5">
                  {[1000, 2000, 3000, 5000].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setAmount(preset)}
                      className="px-2 py-0.5 text-[11px] font-medium bg-slate-100 hover:bg-purple-50 hover:text-purple-700 text-slate-600 rounded transition-colors"
                    >
                      ₹{preset}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.reason}:
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Medical prescription, Children school books, Urgent travel"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900"
                />
              </div>

              <div className="bg-purple-50/70 p-3 rounded-lg border border-purple-100 text-xs text-purple-900 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
                <span>
                  This advance will be registered for direct UPI disbursement and will be <strong>automatically deducted from the September 2026 monthly payroll</strong>.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsRequestModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  Submit Advance Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Interactive UPI Payment & Authentic QR Code Generator */}
      {activePaymentAdvance && activePayHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <QrCode className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Instant UPI Salary Advance
                  </h3>
                  <p className="text-xs text-slate-500">
                    {activePayHelp.fullName} • ₹{activePaymentAdvance.amount.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActivePaymentAdvance(null)}
                className="text-slate-400 hover:text-slate-600 text-xl leading-none"
              >
                &times;
              </button>
            </div>

            <div className="mt-4 flex flex-col items-center text-center">
              {/* Authentic Canvas QR Code */}
              <div className="p-3 bg-white rounded-xl border-2 border-slate-200 shadow-sm relative group">
                <canvas ref={qrCanvasRef} className="rounded-lg" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-8 h-8 rounded-full bg-white shadow-md border border-slate-200 flex items-center justify-center">
                    <IndianRupee className="w-4 h-4 text-emerald-600" />
                  </div>
                </div>
              </div>

              <p className="text-xs font-semibold text-slate-700 mt-2.5">
                {t.scanToPayUPI}
              </p>
              <p className="text-[11px] text-slate-500">
                Scan using Google Pay, PhonePe, Paytm, BHIM, or any UPI app
              </p>

              {/* UPI ID & Copy Bar */}
              <div className="mt-3 w-full bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex items-center justify-between">
                <div className="text-left min-w-0 pr-2">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Staff UPI ID</p>
                  <p className="text-xs font-mono font-bold text-slate-800 truncate">
                    {activePayHelp.upiId}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyUPI(activePayHelp.upiId)}
                  className="px-2.5 py-1 text-xs font-medium bg-white hover:bg-slate-100 text-slate-700 rounded border border-slate-200 shadow-xs flex items-center gap-1 cursor-pointer"
                >
                  {copiedUpi ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-700 font-semibold">{t.copied}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>{t.copyUPI}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Direct UPI Intent Link */}
              <a
                href={`upi://pay?pa=${activePayHelp.upiId}&pn=${encodeURIComponent(
                  activePayHelp.fullName
                )}&am=${activePaymentAdvance.amount}&cu=INR&tn=SalaryAdvance_GVH`}
                className="mt-2 text-xs font-semibold text-purple-600 hover:text-purple-800 flex items-center gap-1"
              >
                <span>{t.openUPIApp}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Confirmation Form (Only if pending or editing) */}
            <form onSubmit={handleDisbursePayment} className="mt-4 pt-4 border-t border-slate-100 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Bank Reference / UTR Number:
                </label>
                <input
                  type="text"
                  required
                  placeholder={t.utrNumberPlaceholder}
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setActivePaymentAdvance(null)}
                  className="px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
                >
                  {t.close}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {t.markAsPaidBtn}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
