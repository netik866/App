import React, { useState } from 'react';
import { UserPlus, ShieldCheck, CreditCard } from 'lucide-react';
import { DailyHelp, DailyHelpRole, AppLanguage } from '../types';
import { translations } from '../utils/translations';

interface NewDailyHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddHelp: (newHelp: DailyHelp) => void;
  currentLang: AppLanguage;
  nextHelpId: string;
}

export const NewDailyHelpModal: React.FC<NewDailyHelpModalProps> = ({
  isOpen,
  onClose,
  onAddHelp,
  currentLang,
  nextHelpId,
}) => {
  const t = translations[currentLang];

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const [role, setRole] = useState<DailyHelpRole>('maid');
  const [gender, setGender] = useState<'Female' | 'Male'>('Female');
  const [age, setAge] = useState<number>(32);
  const [flatsInput, setFlatsInput] = useState('A-102, B-204');
  const [upiId, setUpiId] = useState('');
  const [baseSalary, setBaseSalary] = useState<number>(8500);
  const [idType, setIdType] = useState<'Aadhaar' | 'Voter ID' | 'e-Shram'>('Aadhaar');
  const [idNumber, setIdNumber] = useState('');
  const [policeVerified, setPoliceVerified] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !upiId.trim()) return;

    const flatsArray = flatsInput
      .split(',')
      .map((f) => f.trim().toUpperCase())
      .filter(Boolean);

    const generatedPasscode = Math.floor(1000 + Math.random() * 9000).toString();

    const newHelp: DailyHelp = {
      id: nextHelpId,
      passcode: generatedPasscode,
      fullName: fullName.trim(),
      phone: phone.trim(),
      role,
      gender,
      age,
      avatarUrl:
        gender === 'Female'
          ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      assignedFlats: flatsArray.length > 0 ? flatsArray : ['A-101'],
      upiId: upiId.trim(),
      idProofType: idType,
      idNumberMasked: `XXXX-XXXX-${idNumber.slice(-4) || '5521'}`,
      policeVerified,
      baseSalary,
      rating: 5.0,
      totalReviews: 1,
      todayStatus: 'checked_out',
      joiningDate: new Date().toISOString().split('T')[0],
      multilingual: {
        en: {
          roleTitle: `${role.replace('_', ' ').toUpperCase()} Services`,
          bio: `Registered staff at Green Valley Heights. Committed to punctuality and reliable assistance.`,
          specialties: ['Punctual', 'Verified Trust', 'Household Care'],
          emergencyContact: `Family Contact - ${phone}`
        },
        hi: {
          roleTitle: `${role} सेवाएं`,
          bio: `ग्रीन वैली हाइट्स में पंजीकृत दैनिक सहायक। समयबद्धता एवं भरोसेमंद सेवा के लिए समर्पित।`,
          specialties: ['समय का पाबंद', 'सत्यापित विश्वास', 'घर की देखभाल'],
          emergencyContact: `पारिवारिक संपर्क - ${phone}`
        },
        mr: {
          roleTitle: `${role} सेवा`,
          bio: `ग्रीन व्हॅली हाइट्समधील नोंदणीकृत मदतनीस. वेळेचे काटेकोर पालन आणि विश्वासार्ह कामाची हमी.`,
          specialties: ['वेळेचे पालन', 'विश्वासार्ह', 'घराची योग्य निगा'],
          emergencyContact: `कौटुंबिक संपर्क - ${phone}`
        }
      }
    };

    onAddHelp(newHelp);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 my-8 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">{t.addNewHelp}</h3>
              <p className="text-xs text-slate-500">Auto-allocated ID: <span className="font-mono font-bold text-emerald-700">{nextHelpId}</span></p>
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

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Legal Name:
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Suman Devi"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mobile Phone:
              </label>
              <input
                type="text"
                required
                placeholder="+91 98XXX XXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Work Category:
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as DailyHelpRole)}
                className="w-full px-2.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="maid">Maid / Housekeeper</option>
                <option value="cook">Cook / Chef</option>
                <option value="nanny">Nanny / Caretaker</option>
                <option value="driver">Driver</option>
                <option value="elderly_care">Elderly Care</option>
                <option value="car_cleaner">Car Cleaner</option>
                <option value="gardener">Gardener</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Gender:
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full px-2.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Age:
              </label>
              <input
                type="number"
                min={18}
                max={75}
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full px-2.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Assigned Flat Numbers (Comma Separated):
            </label>
            <input
              type="text"
              required
              placeholder="e.g. A-102, B-402, C-701"
              value={flatsInput}
              onChange={(e) => setFlatsInput(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm font-mono uppercase bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                UPI ID for Instant Advances:
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. suman@oksbi"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Base Monthly Wages (₹):
              </label>
              <input
                type="number"
                min={1000}
                step={500}
                required
                value={baseSalary}
                onChange={(e) => setBaseSalary(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs sm:text-sm font-bold bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Govt ID Proof:
              </label>
              <select
                value={idType}
                onChange={(e) => setIdType(e.target.value as any)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg"
              >
                <option value="Aadhaar">Aadhaar Card</option>
                <option value="Voter ID">Voter ID Card</option>
                <option value="e-Shram">e-Shram Card</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ID Last 4 Digits:
              </label>
              <input
                type="text"
                maxLength={4}
                required
                placeholder="e.g. 8831"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm font-mono bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>
          </div>

          <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
              <div>
                <p className="text-xs font-bold text-emerald-900">Police Verification Status</p>
                <p className="text-[11px] text-emerald-700">Certified by Local Police Station</p>
              </div>
            </div>
            <input
              type="checkbox"
              id="checkbox-police-verified"
              checked={policeVerified}
              onChange={(e) => setPoliceVerified(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs cursor-pointer"
            >
              Register & Generate Security Pass
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
