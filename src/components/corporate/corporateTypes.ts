export type EmployeeScreenId =
  | 'LOGIN'
  | 'HOME'
  | 'REQUEST_RIDE'
  | 'REVIEW_REQUEST'
  | 'MY_TRIPS'
  | 'TRIP_DETAILS'
  | 'ACCOUNT'
  | 'DAILY_OFFICE_RIDE'
  | 'TRIP_IN_PROGRESS'
  | 'TRIP_COMPLETED'
  | 'NOTIFICATIONS'
  | 'OFFLINE_MODE'
  | 'SAFETY';

export type AdminMobileTab = 'HOME' | 'APPROVALS' | 'TRIPS' | 'WALLET' | 'MORE';

export type AdminMobileSubPage =
  | 'NONE'
  | 'APPROVAL_DETAIL'
  | 'ASSIGN_DRIVER'
  | 'EMPLOYEES'
  | 'DEPARTMENTS'
  | 'POLICIES'
  | 'RATE_CARD'
  | 'INVOICES'
  | 'REPORTS'
  | 'LIVE_TRACKING'
  | 'SUPPORT'
  | 'ROLES'
  | 'SECURITY'
  | 'COMPANY_PORTALS';

export interface TripBooking {
  id: string;
  traveler: string;
  employeeId: string;
  department: string;
  costCenter: string;
  projectCode: string;
  pickup: string;
  pickupAddress: string;
  dropoff: string;
  dropoffAddress: string;
  date: string;
  time: string;
  bookingType: 'ONEWAY' | 'ROUNDTRIP' | 'RENTAL' | 'AIRPORT';
  vehicleClass: string;
  passengers: number;
  specialInstructions?: string;
  purpose: string;
  billingMode: string;
  fare: string;
  status: 'PENDING' | 'APPROVED' | 'SCHEDULED' | 'ON_THE_WAY' | 'COMPLETED' | 'REJECTED' | 'CANCELLED';
  otp?: string;
  driverName?: string;
  cabModel?: string;
  cabNumber?: string;
  driverEta?: string;
  driverDistance?: string;
  progressStep: 'Requested' | 'Approved by admin' | 'Cab assigned' | 'Trip completed';
  createdAt: string;
}

export interface EmployeeRecord {
  id: string;
  name: string;
  department: string;
  costCenter: string;
  email: string;
  phone: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface DepartmentRecord {
  id: string;
  name: string;
  costCenter: string;
  employeeCount: number;
  monthlyBudget: number;
  usedBudget: number;
  status: 'Safe' | 'Above 80% alert' | 'Limit reached';
}

export interface WalletTransactionRecord {
  id: string;
  description: string;
  date: string;
  amount: number;
  type: 'DEBIT' | 'CREDIT';
}

export interface InvoiceRecord {
  id: string;
  month: string;
  date: string;
  amount: number;
  status: 'PAID' | 'DUE';
}

export interface SupportTicketRecord {
  id: string;
  employeeName: string;
  issue: string;
  tripId: string;
  complaintText: string;
  status: 'OPEN' | 'IN PROGRESS' | 'RESOLVED';
  replies: string[];
}

export interface DriverRecord {
  id: string;
  name: string;
  cabModel: string;
  cabNumber: string;
  distance: string;
  phone: string;
}

export interface AutoRuleRecord {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

export interface ScheduledReportRecord {
  id: string;
  reportName: string;
  recipientEmail: string;
  frequency: string;
  active: boolean;
}

export interface CompanyPortalRecord {
  id: string;
  name: string;
  adminEmail: string;
  employeeCount: number;
  status: 'ACTIVE' | 'INACTIVE';
  displayName: string;
  webAddress: string;
}

export const INITIAL_TRIPS: TripBooking[] = [
  {
    id: 'ACB-0482-2026',
    traveler: 'Amit Roy',
    employeeId: 'AOLO-EMP-0482',
    department: 'Operations',
    costCenter: 'Operations (AOLO-OPS-LAUNCH)',
    projectCode: 'AOLO-OPS-LAUNCH',
    pickup: 'Office HQ',
    pickupAddress: 'Exhibition Road, Patna',
    dropoff: 'Darbhanga Junction',
    dropoffAddress: 'Platform 1',
    date: '2026-07-14',
    time: '06:00',
    bookingType: 'ONEWAY',
    vehicleClass: 'AOLO Sedan (Dzire)',
    passengers: 1,
    specialInstructions: 'VIP client travel',
    purpose: 'Business Meeting',
    billingMode: 'Department Billing',
    fare: '₹3100',
    status: 'PENDING',
    otp: '4821',
    driverName: 'Rameshwar Kumar',
    cabModel: 'Maruti Suzuki Dzire',
    cabNumber: 'BR-01-PA-9921',
    driverEta: '4',
    driverDistance: '1.2 km',
    progressStep: 'Requested',
    createdAt: '2026-07-13 18:30',
  },
  {
    id: 'ACB-0419-2026',
    traveler: 'Priya Sharma',
    employeeId: 'AOLO-EMP-0312',
    department: 'Marketing',
    costCenter: 'Marketing (AOLO-MKT-2026)',
    projectCode: 'AOLO-MKT-2026',
    pickup: 'Office HQ',
    pickupAddress: 'Exhibition Road, Patna',
    dropoff: 'Jay Prakash Narayan Airport',
    dropoffAddress: 'Terminal 1 Departures',
    date: '2026-07-15',
    time: '08:30',
    bookingType: 'AIRPORT',
    vehicleClass: 'AOLO Sedan (Dzire)',
    passengers: 1,
    purpose: 'Executive Airport Transit',
    billingMode: 'Corporate Wallet',
    fare: '₹850',
    status: 'APPROVED',
    otp: '7729',
    driverName: 'Vikram Singh',
    cabModel: 'Toyota Etios',
    cabNumber: 'BR-01-EX-4412',
    driverEta: '8',
    driverDistance: '2.5 km',
    progressStep: 'Approved by admin',
    createdAt: '2026-07-12 11:00',
  },
  {
    id: 'ACB-0391-2026',
    traveler: 'Saurabh Verma',
    employeeId: 'AOLO-EMP-0018',
    department: 'Management',
    costCenter: 'Management (AOLO-MGMT-2026)',
    projectCode: 'AOLO-MGMT-2026',
    pickup: 'Office HQ',
    pickupAddress: 'Exhibition Road, Patna',
    dropoff: 'Muzaffarpur Collectorate',
    dropoffAddress: 'Civil Lines, Muzaffarpur',
    date: '2026-07-10',
    time: '09:00',
    bookingType: 'ROUNDTRIP',
    vehicleClass: 'AOLO SUV (Innova Crysta)',
    passengers: 3,
    purpose: 'State Government Review Meeting',
    billingMode: 'Corporate Wallet',
    fare: '₹4200',
    status: 'COMPLETED',
    otp: '3318',
    driverName: 'Mohd. Imran',
    cabModel: 'Toyota Innova Crysta',
    cabNumber: 'BR-01-TZ-6623',
    driverEta: '0',
    driverDistance: 'Arrived',
    progressStep: 'Trip completed',
    createdAt: '2026-07-09 14:15',
  },
];

export const INITIAL_DRIVERS: DriverRecord[] = [
  {
    id: 'DRV-101',
    name: 'Rameshwar Kumar',
    cabModel: 'Maruti Suzuki Dzire',
    cabNumber: 'BR-01-PA-9921',
    distance: '1.2 km away',
    phone: '+91 94310 11223',
  },
  {
    id: 'DRV-102',
    name: 'Sunil Paswan',
    cabModel: 'Hyundai Aura',
    cabNumber: 'BR-01-BZ-5509',
    distance: '2.4 km away',
    phone: '+91 98350 22334',
  },
  {
    id: 'DRV-103',
    name: 'Rajeev Ranjan',
    cabModel: 'Toyota Innova Crysta',
    cabNumber: 'BR-01-TA-7744',
    distance: '3.1 km away',
    phone: '+91 99340 33445',
  },
];

export const INITIAL_TICKETS: SupportTicketRecord[] = [
  {
    id: 'TCK-1082',
    employeeName: 'Amit Roy',
    issue: 'Driver delayed by 15 mins at HQ',
    tripId: 'ACB-0482-2026',
    complaintText: 'Cab driver reached 15 minutes after scheduled arrival window. Needs verification.',
    status: 'OPEN',
    replies: [
      'Dispatcher: We reached out to the driver. Traffic near Dak Bunglow chowk caused the delay.',
    ],
  },
  {
    id: 'TCK-1065',
    employeeName: 'Priya Sharma',
    issue: 'Fare dispute on toll inclusion',
    tripId: 'ACB-0312-2026',
    complaintText: 'Airport parking fee was billed separately on personal cash instead of corporate wallet.',
    status: 'RESOLVED',
    replies: [
      'Accounts Admin: ₹150 reimbursed to corporate wallet and adjusted in invoice INV-2026-06.',
    ],
  },
];

export const INITIAL_RULES: AutoRuleRecord[] = [
  {
    id: 'rule_1',
    title: 'Auto approve short rides',
    description: 'If fare is up to ₹1000 and within policy',
    enabled: true,
  },
  {
    id: 'rule_2',
    title: 'Send to admin',
    description: 'If fare is above ₹1000, outside hours or a guest booking',
    enabled: true,
  },
  {
    id: 'rule_3',
    title: 'Auto reject',
    description: 'If monthly limit of the employee is crossed',
    enabled: false,
  },
];

export const INITIAL_SCHEDULED_REPORTS: ScheduledReportRecord[] = [
  {
    id: 'rep_1',
    reportName: 'Monthly spend by department',
    recipientEmail: 'finance@abccorp.com',
    frequency: '1st of every month',
    active: true,
  },
  {
    id: 'rep_2',
    reportName: 'Weekly ride audit log',
    recipientEmail: 'admin@abccorp.com',
    frequency: 'Every Monday 09:00 AM',
    active: false,
  },
];

export const INITIAL_COMPANY_PORTALS: CompanyPortalRecord[] = [
  {
    id: 'cp_1',
    name: 'ABC CORPORATION',
    adminEmail: 'admin@abccorp.com',
    employeeCount: 5,
    status: 'ACTIVE',
    displayName: 'ABC CORPORATION',
    webAddress: 'abccorp.aolocabs.in',
  },
  {
    id: 'cp_2',
    name: 'PATNA TECH VENTURES',
    adminEmail: 'mobility@patnatech.in',
    employeeCount: 24,
    status: 'ACTIVE',
    displayName: 'PATNA TECH VENTURES',
    webAddress: 'patnatech.aolocabs.in',
  },
];
