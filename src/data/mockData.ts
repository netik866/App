import { DailyHelp, SalaryAdvance, Review, QuickLeaveNotification, PayrollRecord, AttendanceRecord, SocietyHoliday } from '../types';

export const initialDailyHelps: DailyHelp[] = [
  {
    id: 'DH-101',
    passcode: '4120',
    fullName: 'Sunita Shinde',
    phone: '+91 98201 44521',
    role: 'maid',
    gender: 'Female',
    age: 34,
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    assignedFlats: ['A-402', 'B-104', 'C-701'],
    upiId: 'sunita.shinde@oksbi',
    idProofType: 'Aadhaar',
    idNumberMasked: 'XXXX-XXXX-8921',
    policeVerified: true,
    baseSalary: 9600,
    rating: 4.9,
    totalReviews: 18,
    todayStatus: 'present',
    currentFlat: 'A-402',
    checkInTime: '07:45 AM',
    joiningDate: '2023-04-10',
    multilingual: {
      en: {
        roleTitle: 'Housekeeper & Utensils Cleaning',
        bio: 'Over 8 years experience in luxury apartments. Proficient with modern kitchen appliances, vacuum cleaners, and deep bathroom sanitation.',
        specialties: ['Deep Dusting', 'Vessel Scrubbing', 'Keyholder Trustworthy', 'Early Morning Slot'],
        emergencyContact: 'Suresh Shinde (Husband) - +91 98201 99812'
      },
      hi: {
        roleTitle: 'गृह सहायिका (सफाई एवं बर्तन)',
        bio: 'सोसाइटी में 8 वर्षों का अनुभव। आधुनिक उपकरणों, वैक्यूम क्लीनर और गहन सफाई में कुशल। समय की अत्यंत पाबंद।',
        specialties: ['गहन सफाई', 'बर्तन धुलाई', 'घर की चाबी रखने योग्य विश्वसनीय', 'सुबह का समय'],
        emergencyContact: 'सुरेश शिंदे (पति) - +91 98201 99812'
      },
      mr: {
        roleTitle: 'घरकाम मदतनीस (झाडू, फरशी, भांडी)',
        bio: '८ वर्षांचा प्रदीर्घ अनुभव. आधुनिक उपकरणे व सर्व प्रकारच्या घरकामात पारंगत. अतिशय प्रामाणिक व वेळेचे काटेकोर पालन.',
        specialties: ['स्वच्छ फरशी पुसणे', 'भांडी घासणे', 'घराच्या चाव्या विश्वासाने सांभाळणे', 'पहाटेची वेळ'],
        emergencyContact: 'सुरेश शिंदे (पती) - +91 ९८२०१ ९९८१२'
      }
    }
  },
  {
    id: 'DH-102',
    passcode: '6591',
    fullName: 'Ramesh Kumar',
    phone: '+91 97112 30981',
    role: 'cook',
    gender: 'Male',
    age: 41,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    assignedFlats: ['B-303', 'A-402', 'D-502'],
    upiId: 'ramesh.cook@paytm',
    idProofType: 'Aadhaar',
    idNumberMasked: 'XXXX-XXXX-4102',
    policeVerified: true,
    baseSalary: 14500,
    rating: 4.8,
    totalReviews: 24,
    todayStatus: 'present',
    currentFlat: 'B-303',
    checkInTime: '08:15 AM',
    joiningDate: '2022-11-15',
    multilingual: {
      en: {
        roleTitle: 'Specialized Cook (North & South Indian, Jain)',
        bio: 'Expert vegetarian and non-vegetarian cook. Prepares Jain food separately without onion-garlic when instructed. Highly hygienic.',
        specialties: ['Soft Rotis & Phulkas', 'Jain Food', 'South Indian Breakfast', 'Low Oil Diet Meals'],
        emergencyContact: 'Geeta Devi (Wife) - +91 97112 88402'
      },
      hi: {
        roleTitle: 'विशेष रसोइया (उत्तर व दक्षिण भारतीय, जैन भोजन)',
        bio: 'शाकाहारी व मांसाहारी भोजन विशेषज्ञ। बिना लहसुन-प्याज का जैन भोजन अलग से बनाने में निपुण। पूर्ण स्वच्छता का ध्यान।',
        specialties: ['नरम फुल्का रोटी', 'जैन भोजन', 'इडली-डोसा नाश्ता', 'कम तेल वाला पौष्टिक खाना'],
        emergencyContact: 'गीता देवी (पत्नी) - +91 97112 88402'
      },
      mr: {
        roleTitle: 'विशेष स्वयंपाकी (सर्व प्रकारचे रुचकर जेवण)',
        bio: 'उत्कृष्ट शाकाहारी व मांसाहारी स्वयंपाक. जैन जेवण वेगळे बनवण्याचा दांडगा अनुभव. स्वयंपाकघराची चोख स्वच्छता.',
        specialties: ['गरमागरम पोळ्या/फुलके', 'जैन जेवण', 'दक्षिण भारतीय नाश्ता', 'कमी तेलाचे जेवण'],
        emergencyContact: 'गीता देवी (पत्नी) - +91 ९७११२ ८८४०२'
      }
    }
  },
  {
    id: 'DH-103',
    passcode: '8834',
    fullName: 'Laxmi Devi',
    phone: '+91 96541 23091',
    role: 'nanny',
    gender: 'Female',
    age: 38,
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    assignedFlats: ['C-201', 'A-102'],
    upiId: 'laxmi.devi@okhdfcbank',
    idProofType: 'Aadhaar',
    idNumberMasked: 'XXXX-XXXX-9912',
    policeVerified: true,
    baseSalary: 12000,
    rating: 4.95,
    totalReviews: 15,
    todayStatus: 'present',
    currentFlat: 'C-201',
    checkInTime: '08:30 AM',
    joiningDate: '2023-01-05',
    multilingual: {
      en: {
        roleTitle: 'Infant & Toddler Caregiver / Nanny',
        bio: 'Gentle, patient caretaker with toddler first-aid certification. Handles baby food preparation, feeding, and educational play activities.',
        specialties: ['Infant Massage', 'Sterilizing Baby Bottles', 'Bedtime Stories', 'Pediatric First Aid'],
        emergencyContact: 'Manoj Kumar (Son) - +91 96541 77123'
      },
      hi: {
        roleTitle: 'शिशु एवं बाल देखभाल सहायिका (आया)',
        bio: 'शांत व स्नेहमयी स्वभाव। बच्चों के लिए पोषक आहार तैयार करना, खेल-खेल में सिखाना और मालिश का विशेष अनुभव।',
        specialties: ['शिशु मालिश', 'बेबी बॉटल स्टरलाइज़ेशन', 'बाल पोषण', 'प्राथमिक चिकित्सा'],
        emergencyContact: 'मनोज कुमार (पुत्र) - +91 96541 77123'
      },
      mr: {
        roleTitle: 'लहान मुलांची काळजीवाहू (आया)',
        bio: 'अतिशय प्रेमळ व संयमी स्वभाव. लहान बाळांची मालिश, आहार व संगोपनाचा प्रदीर्घ अनुभव. बालकांशी उत्तम संवाद.',
        specialties: ['बाळाची मालिश', 'बाटल्या निर्जंतुकीकरण', 'बाल आहार', 'प्रथमोपचार'],
        emergencyContact: 'मनोज कुमार (मुलगा) - +91 ९६५४१ ७७१२३'
      }
    }
  },
  {
    id: 'DH-104',
    passcode: '2904',
    fullName: 'Rajesh Sawant',
    phone: '+91 98210 55198',
    role: 'driver',
    gender: 'Male',
    age: 45,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    assignedFlats: ['D-502', 'C-701'],
    upiId: 'rajesh.sawant@icici',
    idProofType: 'Aadhaar',
    idNumberMasked: 'XXXX-XXXX-6743',
    policeVerified: true,
    baseSalary: 16000,
    rating: 4.7,
    totalReviews: 12,
    todayStatus: 'checked_out',
    checkInTime: '06:30 AM',
    checkOutTime: '01:30 PM',
    joiningDate: '2021-08-20',
    multilingual: {
      en: {
        roleTitle: 'Experienced Chauffeur (Manual & Automatic Cars)',
        bio: 'Over 15 years driving in Mumbai/NCR metro traffic with zero accident record. Well-versed with GPS navigation, airport routes, and highway safety.',
        specialties: ['Luxury Car Care', 'Highway Driving', 'Airport Timings', 'Defensive Driving'],
        emergencyContact: 'Sunita Sawant (Wife) - +91 98210 33412'
      },
      hi: {
        roleTitle: 'अनुभवी व्यक्तिगत चालक (मैनुअल एवं ऑटोमैटिक कारें)',
        bio: '15+ वर्षों का सुरक्षित ड्राइविंग अनुभव। शहर व हाईवे पर सुरक्षित वाहन चलाने में माहिर। समय के पाबंद एवं विनम्र।',
        specialties: ['लग्जरी कार संचालन', 'हाईवे ड्राइविंग', 'एयरपोर्ट ड्रॉप/पिकअप', 'सुरक्षित ड्राइविंग'],
        emergencyContact: 'सुनीता सावंत (पत्नी) - +91 98210 33412'
      },
      mr: {
        roleTitle: 'अनुभवी खाजगी वाहनचालक (मॅन्युअल व ऑटोमॅटिक)',
        bio: '१५ वर्षांहून अधिक काळ विना-अपघात सुरक्षित ड्रायव्हिंगचा अनुभव. मुंबई व महामार्गांवरील सर्व मार्गांची अचूक माहिती.',
        specialties: ['लक्झरी वाहनांची निगा', 'हायवे ड्रायव्हिंग', 'विमानतळ ने-आण', 'शांत व नम्र स्वभाव'],
        emergencyContact: 'सुनीता सावंत (पत्नी) - +91 ९८२१० ३३४१२'
      }
    }
  },
  {
    id: 'DH-105',
    passcode: '5119',
    fullName: 'Geeta Bai',
    phone: '+91 98920 18872',
    role: 'elderly_care',
    gender: 'Female',
    age: 48,
    avatarUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
    assignedFlats: ['B-104'],
    upiId: 'geetabai@ybl',
    idProofType: 'Aadhaar',
    idNumberMasked: 'XXXX-XXXX-1123',
    policeVerified: true,
    baseSalary: 11000,
    rating: 4.88,
    totalReviews: 9,
    todayStatus: 'present',
    currentFlat: 'B-104',
    checkInTime: '09:00 AM',
    joiningDate: '2023-08-01',
    multilingual: {
      en: {
        roleTitle: 'Senior Citizen & Bedside Attendant',
        bio: 'Compassionate assistance for senior citizens. Assists with mobility, prescribed medicine reminders, wheelchair support, and evening walks.',
        specialties: ['Medicine Timetables', 'Wheelchair Transfer', 'Blood Pressure Check', 'Evening Strolls'],
        emergencyContact: 'Ashok Bai (Son) - +91 98920 66219'
      },
      hi: {
        roleTitle: 'वरिष्ठ नागरिक देखभाल सहायिका',
        bio: 'बुजुर्गों की सेवा व सहायता में समर्पित। दवाइयों का समय पर देना, व्हीलचेयर सहायता और शाम की सैर में साथ देना।',
        specialties: ['दवा समय सारिणी', 'व्हीलचेयर सहायता', 'बीपी जांच सहायता', 'शाम की सैर'],
        emergencyContact: 'अशोक बाई (पुत्र) - +91 98920 66219'
      },
      mr: {
        roleTitle: 'ज्येष्ठ नागरिक शुश्रूषक',
        bio: 'ज्येष्ठांची आपुलकीने व मायेने काळजी घेण्याचा अनुभव. औषधांच्या वेळा पाळणे, व्हीलचेअरची मदत आणि संध्याकाळच्या फेरफटक्यात सोबत.',
        specialties: ['औषध वेळेचे नियोजन', 'व्हीलचेअर सहाय्य', 'रक्तदाब तपासणी मदत', 'संध्याकाळची सोबत'],
        emergencyContact: 'अशोक बाई (मुलगा) - +91 ९८९२० ६६२१९'
      }
    }
  },
  {
    id: 'DH-106',
    passcode: '3772',
    fullName: 'Mohammad Imran',
    phone: '+91 91670 44901',
    role: 'car_cleaner',
    gender: 'Male',
    age: 29,
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    assignedFlats: ['A-102', 'A-402', 'B-303', 'C-201', 'D-502'],
    upiId: 'imran.auto@axisbank',
    idProofType: 'Aadhaar',
    idNumberMasked: 'XXXX-XXXX-7721',
    policeVerified: true,
    baseSalary: 7500,
    rating: 4.65,
    totalReviews: 20,
    todayStatus: 'checked_out',
    checkInTime: '05:30 AM',
    checkOutTime: '08:45 AM',
    joiningDate: '2024-02-14',
    multilingual: {
      en: {
        roleTitle: 'Society Daily Vehicle Detailing & Cleaning',
        bio: 'Daily microfiber water-saving car wash, interior dusting, windshield degreasing, and tire polishing for assigned parking slots.',
        specialties: ['Waterless Dry Wash', 'Interior Vacuuming', 'Windshield Care', 'Punctual 6 AM Slot'],
        emergencyContact: 'Mohammad Yusuf (Brother) - +91 91670 99820'
      },
      hi: {
        roleTitle: 'दैनिक वाहन सफाई एवं पॉलिश कर्मी',
        bio: 'सोसाइटी पार्किंग में रोज सुबह माइक्रोफाइबर कपड़े से कारों की सफाई, कांच चमकाना और टायरों की पॉलिश।',
        specialties: ['माइक्रोफाइबर धुलाई', 'अंदरूनी वैक्यूम सफाई', 'विंडशील्ड सफाई', 'सुबह 6 बजे उपस्थिति'],
        emergencyContact: 'मोहम्मद युसुफ (भाई) - +91 91670 99820'
      },
      mr: {
        roleTitle: 'सोसायटी दैनंदिन वाहन स्वच्छता कामगार',
        bio: 'दररोज सकाळी वाहनांची पाणी वाचवून मायक्रोफायबर कपड्याने स्वच्छता, काचांची सफाई व टायर पॉलिश.',
        specialties: ['ड्राय वॉश तंत्रज्ञान', 'आतील स्वच्छता', 'काचांची निगा', 'सकाळी ६ वाजता वेळेवर'],
        emergencyContact: 'मोहम्मद युसुफ (भाऊ) - +91 ९१६७० ९९८२०'
      }
    }
  },
  {
    id: 'DH-107',
    passcode: '9045',
    fullName: 'Savita Patil',
    phone: '+91 98334 11239',
    role: 'maid',
    gender: 'Female',
    age: 36,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    assignedFlats: ['A-102', 'D-502'],
    upiId: 'savita.patil@upi',
    idProofType: 'Aadhaar',
    idNumberMasked: 'XXXX-XXXX-3345',
    policeVerified: true,
    baseSalary: 8000,
    rating: 4.82,
    totalReviews: 14,
    todayStatus: 'on_leave',
    joiningDate: '2023-09-01',
    multilingual: {
      en: {
        roleTitle: 'Housekeeper (Dusting & Mopping)',
        bio: 'Known for speed and thoroughness. Respectful of household customs, handles delicate crockery and glassware with extreme care.',
        specialties: ['Crockery Handling', 'Curtain & Window Detailing', 'Polite Nature', 'Afternoon Slots'],
        emergencyContact: 'Pravin Patil (Husband) - +91 98334 88712'
      },
      hi: {
        roleTitle: 'गृह सहायिका (धूल सफाई व पोछा)',
        bio: 'तेज़ व गहन कार्य के लिए जानी जाती हैं। कांच व महंगे बर्तनों की विशेष सावधानी से सफाई। अत्यंत विनम्र स्वभाव।',
        specialties: ['कांच बर्तनों की सफाई', 'खिड़कियों की सफाई', 'शांत व आदरपूर्ण व्यवहार', 'दोपहर का समय'],
        emergencyContact: 'प्रवीण पाटिल (पति) - +91 98334 88712'
      },
      mr: {
        roleTitle: 'घरकाम मदतनीस (झाडू, लादी व स्वच्छता)',
        bio: 'कामात चपळ व व्यवस्थित. नाजूक भांडी व काचेच्या वस्तूंची विशेष काळजी. अतिशय शांत व आदरयुक्त स्वभाव.',
        specialties: ['काचेच्या वस्तूंची स्वच्छता', 'खिडक्यांची सफाई', 'नम्र वागणूक', 'दुपारची वेळ'],
        emergencyContact: 'प्रवीण पाटील (पती) - +91 ९८३३४ ८८७१२'
      }
    }
  }
];

export const initialSalaryAdvances: SalaryAdvance[] = [
  {
    id: 'ADV-2026-001',
    helpId: 'DH-101', // Sunita Shinde
    amount: 2500,
    requestedDate: '2026-09-18',
    reason: 'Children school book purchase & stationery',
    status: 'approved_paid',
    upiTransactionRef: 'UPI/HDFC/20260918002941',
    disbursedDate: '2026-09-18 11:30 AM',
    approvedBy: 'Society Treasurer (Mr. K. V. Rao)',
    deductedInMonth: '2026-09'
  },
  {
    id: 'ADV-2026-002',
    helpId: 'DH-102', // Ramesh Kumar
    amount: 4000,
    requestedDate: '2026-09-20',
    reason: 'Emergency medicine for aged mother in village',
    status: 'approved_paid',
    upiTransactionRef: 'UPI/SBI/20260920884912',
    disbursedDate: '2026-09-20 04:15 PM',
    approvedBy: 'Society Secretary (Mrs. P. Deshmukh)',
    deductedInMonth: '2026-09'
  },
  {
    id: 'ADV-2026-003',
    helpId: 'DH-103', // Laxmi Devi
    amount: 2000,
    requestedDate: '2026-09-22',
    reason: 'Home electricity bill and ration grocery',
    status: 'pending',
    approvedBy: undefined
  },
  {
    id: 'ADV-2026-004',
    helpId: 'DH-106', // Mohammad Imran
    amount: 1500,
    requestedDate: '2026-09-21',
    reason: 'Two-wheeler servicing and new battery',
    status: 'pending',
    approvedBy: undefined
  }
];

export const initialReviews: Review[] = [
  {
    id: 'REV-01',
    helpId: 'DH-101',
    residentName: 'Mrs. Neha Sharma',
    flatNumber: 'A-402',
    rating: 5,
    tags: ['Always On Time', 'Very Thorough', 'Keyholder Trust'],
    comment: 'Sunita has been working with us for over two years. Never once missed a morning without informing in advance. Cleans the kitchen counters and chimney spotless.',
    date: '2026-09-15'
  },
  {
    id: 'REV-02',
    helpId: 'DH-102',
    residentName: 'Mr. Arvind Mehta',
    flatNumber: 'B-303',
    rating: 5,
    tags: ['Soft Rotis', 'Jain Food Expert', 'Hygienic Cook'],
    comment: 'Rameshji makes the best phulkas and dal tadka in the entire building. He follows strict Jain dietary rules without any fuss. Great culinary skill.',
    date: '2026-09-12'
  },
  {
    id: 'REV-03',
    helpId: 'DH-103',
    residentName: 'Dr. Priya Varma',
    flatNumber: 'C-201',
    rating: 5,
    tags: ['Kids Love Her', 'Punctual', 'Patient & Calm'],
    comment: 'Laxmi is a blessing for working parents. Our 2-year old daughter smiles the moment Laxmi arrives. She is attentive, gentle, and very responsible.',
    date: '2026-09-10'
  },
  {
    id: 'REV-04',
    helpId: 'DH-104',
    residentName: 'Mr. K. V. Rao',
    flatNumber: 'C-701',
    rating: 5,
    tags: ['Smooth Driving', 'Airport Timings', 'Careful with Car'],
    comment: 'Rajesh drives very smoothly and never honks unnecessarily. Always reaches 10 minutes before departure time for early morning flights.',
    date: '2026-09-08'
  },
  {
    id: 'REV-05',
    helpId: 'DH-105',
    residentName: 'Mr. Subhash Deshmukh',
    flatNumber: 'B-104',
    rating: 5,
    tags: ['Caring & Patient', 'Medical Schedule Followed', 'Great with Elders'],
    comment: 'Geeta takes care of my 82-year-old father with utmost devotion. She ensures his BP medicines and fruit juices are served right on schedule.',
    date: '2026-09-14'
  }
];

export const initialLeaveAlerts: QuickLeaveNotification[] = [
  {
    id: 'LV-2026-0901',
    helpId: 'DH-107', // Savita Patil
    startDate: '2026-09-22',
    endDate: '2026-09-23',
    reason: 'High fever and doctor advised 2 days rest',
    leaveType: 'sick',
    affectedFlats: ['A-102', 'D-502'],
    substituteHelpId: 'DH-101', // Sunita Shinde
    broadcastSent: true,
    status: 'approved',
    reportedAt: '2026-09-22 06:15 AM'
  },
  {
    id: 'LV-2026-0902',
    helpId: 'DH-104', // Rajesh Sawant
    startDate: '2026-09-25',
    endDate: '2026-09-26',
    reason: 'Daughter college admission counseling in Pune',
    leaveType: 'personal',
    affectedFlats: ['D-502', 'C-701'],
    broadcastSent: false,
    status: 'pending',
    reportedAt: '2026-09-21 07:40 PM'
  }
];

export const initialAttendanceRecords: AttendanceRecord[] = [
  {
    id: 'ATT-101',
    helpId: 'DH-101',
    date: '2026-09-22',
    checkInTime: '07:45 AM',
    gate: 'Main Gate 1',
    visitedFlats: ['A-402', 'B-104'],
    status: 'present'
  },
  {
    id: 'ATT-102',
    helpId: 'DH-102',
    date: '2026-09-22',
    checkInTime: '08:15 AM',
    gate: 'Service Gate 2',
    visitedFlats: ['B-303'],
    status: 'present'
  },
  {
    id: 'ATT-103',
    helpId: 'DH-103',
    date: '2026-09-22',
    checkInTime: '08:30 AM',
    gate: 'Main Gate 1',
    visitedFlats: ['C-201'],
    status: 'present'
  },
  {
    id: 'ATT-104',
    helpId: 'DH-104',
    date: '2026-09-22',
    checkInTime: '06:30 AM',
    checkOutTime: '01:30 PM',
    gate: 'Main Gate 1',
    visitedFlats: ['D-502', 'C-701'],
    status: 'present'
  },
  {
    id: 'ATT-105',
    helpId: 'DH-105',
    date: '2026-09-22',
    checkInTime: '09:00 AM',
    gate: 'Service Gate 2',
    visitedFlats: ['B-104'],
    status: 'present'
  },
  {
    id: 'ATT-106',
    helpId: 'DH-106',
    date: '2026-09-22',
    checkInTime: '05:30 AM',
    checkOutTime: '08:45 AM',
    gate: 'Main Gate 1',
    visitedFlats: ['Basement Parking P1/P2'],
    status: 'present'
  }
];

export const initialHolidays: SocietyHoliday[] = [
  {
    id: 'HOL-2026-09-01',
    date: '2026-09-04',
    title: 'Janmashtami / Dahi Handi',
    category: 'festival',
    description: 'Society annual Dahi Handi celebration at Central Lawn. Paid holiday for all daily staff.',
    isPaidHoliday: true,
    affectedMonth: '2026-09',
  },
  {
    id: 'HOL-2026-09-02',
    date: '2026-09-17',
    title: 'Ganesh Chaturthi (Aagman)',
    category: 'festival',
    description: 'Lord Ganesha Sthapana & society clubhouse puja. Official paid holiday across society.',
    isPaidHoliday: true,
    affectedMonth: '2026-09',
  },
  {
    id: 'HOL-2026-09-03',
    date: '2026-09-28',
    title: 'Anant Chaturdashi (Ganesh Visarjan)',
    category: 'festival',
    description: 'Ganesh Visarjan procession. Society premises security on high protocol. Staff holiday.',
    isPaidHoliday: true,
    affectedMonth: '2026-09',
  },
  {
    id: 'HOL-2026-10-01',
    date: '2026-10-02',
    title: 'Mahatma Gandhi Jayanti',
    category: 'national',
    description: 'National gazetted holiday. Cleanliness drive & community tree planting.',
    isPaidHoliday: true,
    affectedMonth: '2026-10',
  }
];
