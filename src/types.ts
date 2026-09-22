export type DailyHelpRole = 
  | 'maid' 
  | 'cook' 
  | 'nanny' 
  | 'driver' 
  | 'elderly_care' 
  | 'car_cleaner' 
  | 'gardener';

export type AttendanceStatus = 'present' | 'checked_out' | 'on_leave' | 'absent';

export interface MultilingualBio {
  en: {
    roleTitle: string;
    bio: string;
    specialties: string[];
    emergencyContact: string;
  };
  hi: {
    roleTitle: string;
    bio: string;
    specialties: string[];
    emergencyContact: string;
  };
  mr: {
    roleTitle: string;
    bio: string;
    specialties: string[];
    emergencyContact: string;
  };
}

export interface Review {
  id: string;
  helpId: string;
  residentName: string;
  flatNumber: string;
  rating: number; // 1 to 5
  tags: string[];
  comment: string;
  date: string;
}

export interface DailyHelp {
  id: string;
  passcode: string; // 4-digit gate PIN
  fullName: string;
  phone: string;
  role: DailyHelpRole;
  gender: 'Female' | 'Male';
  age: number;
  avatarUrl: string;
  assignedFlats: string[]; // e.g. ['A-402', 'B-104', 'C-701']
  upiId: string; // for instant UPI advances
  idProofType: 'Aadhaar' | 'Voter ID' | 'e-Shram';
  idNumberMasked: string;
  policeVerified: boolean;
  baseSalary: number; // aggregate monthly INR
  rating: number; // calculated 1-5
  totalReviews: number;
  todayStatus: AttendanceStatus;
  currentFlat?: string;
  checkInTime?: string;
  checkOutTime?: string;
  multilingual: MultilingualBio;
  joiningDate: string;
}

export interface AttendanceRecord {
  id: string;
  helpId: string;
  date: string; // YYYY-MM-DD
  checkInTime: string;
  checkOutTime?: string;
  gate: string;
  visitedFlats: string[];
  status: 'present' | 'half_day' | 'leave' | 'absent';
}

export interface SalaryAdvance {
  id: string;
  helpId: string;
  amount: number;
  requestedDate: string;
  reason: string;
  status: 'pending' | 'approved_paid' | 'rejected' | 'deducted';
  upiTransactionRef?: string;
  disbursedDate?: string;
  approvedBy?: string;
  deductedInMonth?: string; // e.g. "2026-09"
}

export interface QuickLeaveNotification {
  id: string;
  helpId: string;
  startDate: string;
  endDate: string;
  reason: string;
  leaveType: 'sick' | 'personal' | 'emergency' | 'festival';
  affectedFlats: string[];
  substituteHelpId?: string;
  broadcastSent: boolean;
  status: 'approved' | 'pending' | 'cancelled';
  reportedAt: string;
}

export interface SocietyHoliday {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  category: 'festival' | 'national' | 'society_special';
  description?: string;
  isPaidHoliday: boolean;
  affectedMonth: string; // "2026-09"
}

export interface PayrollRecord {
  id: string;
  helpId: string;
  month: string; // "2026-09"
  baseSalary: number;
  daysInMonth: number;
  workingDays: number;
  societyHolidaysCount: number;
  presentDays: number;
  paidLeaves: number;
  unpaidLeaves: number;
  perDayRate: number;
  grossPay: number;
  advanceDeductions: number;
  bonus: number;
  netPay: number;
  status: 'draft' | 'approved' | 'paid';
  generatedDate: string;
  paidDate?: string;
  paymentMode?: 'UPI' | 'Bank Transfer' | 'Cash';
  societyReceiptNo: string;
}

export type AppLanguage = 'en' | 'hi' | 'mr';
