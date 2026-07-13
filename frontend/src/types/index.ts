export type Role = "CUSTOMER" | "TECHNICIAN" | "ADMIN";
export type UserStatus = "ACTIVE" | "BANNED";
export type BookingStatus = "REQUESTED" | "ACCEPTED" | "DECLINED" | "PAID" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED";
export type PaymentMethod = "stripe" | "sslcommerz" | "cod" | "wallet";

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  location?: string;
  avatar?: string;
  role: Role;
  status: UserStatus;
  createdAt: string;
}

export interface TechnicianProfile {
  id: string;
  userId: string;
  user: User;
  bio?: string;
  experienceYears?: number;
  skills: string[];
  baseHourlyRate?: number;
  rating: number;
  totalReviews: number;
  completedJobs: number;
  certificates?: string[];
  availability?: DayAvailability[];
}

export interface DayAvailability {
  day: string;
  available: boolean;
  startTime?: string;
  endTime?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  serviceCount: number;
}

export interface Service {
  id: string;
  technicianId: string;
  technician?: TechnicianProfile;
  categoryId: string;
  category?: Category;
  title: string;
  description?: string;
  price: number;
  duration?: string;
  rating: number;
  reviewCount: number;
  image?: string;
  isFavorite?: boolean;
}

export interface Booking {
  id: string;
  customerId: string;
  customer?: User;
  technicianId: string;
  technician?: TechnicianProfile;
  serviceId: string;
  service?: Service;
  scheduledAt: string;
  timeSlot?: string;
  status: BookingStatus;
  totalAmount: number;
  address?: string;
  notes?: string;
  createdAt: string;
  payment?: Payment;
  review?: Review;
}

export interface Payment {
  id: string;
  bookingId: string;
  transactionId: string;
  amount: number;
  provider: string;
  method?: PaymentMethod;
  status: PaymentStatus;
  paidAt?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  bookingId: string;
  customerId: string;
  customer?: User;
  technicianId: string;
  rating: number;
  comment?: string;
  photos?: string[];
  helpful?: number;
  reply?: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "success" | "warning" | "error" | "info";
  read: boolean;
  createdAt: string;
}

export interface Transaction {
  id: string;
  type: "credit" | "debit";
  amount: number;
  description: string;
  status: PaymentStatus;
  createdAt: string;
}

export interface WalletData {
  balance: number;
  pendingAmount: number;
  totalEarned: number;
  totalSpent: number;
  transactions: Transaction[];
  coupons: Coupon[];
  rewards: Reward[];
}

export interface Coupon {
  id: string;
  code: string;
  discount: number;
  type: "percentage" | "fixed";
  expiresAt: string;
  minOrder?: number;
  used?: boolean;
}

export interface Reward {
  id: string;
  title: string;
  points: number;
  description: string;
  claimed: boolean;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  image?: string;
  category: string;
  readTime: number;
}

export interface JobOpening {
  id: string;
  title: string;
  department: string;
  location: string;
  type: "full-time" | "part-time" | "contract";
  description: string;
  postedAt: string;
}

export interface AdminStats {
  totalUsers: number;
  totalTechnicians: number;
  totalBookings: number;
  totalRevenue: number;
  pendingBookings: number;
  completedBookings: number;
  activeServices: number;
  monthlyGrowth: number;
}

export interface ChartData {
  label: string;
  value: number;
  color?: string;
}

export interface BookingStep {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}
