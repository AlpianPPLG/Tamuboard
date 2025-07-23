export interface Guest {
  id: string;
  name: string;
  institution: string;
  purpose: string;
  phone: string;
  email?: string;
  category: 'VIP' | 'regular' | 'supplier' | 'intern';
  visitTime: 'morning' | 'afternoon' | 'evening';
  scheduledDate?: Date;
  scheduledTime?: string;
  feedback?: string;
  rating?: number;
  visitDate: Date;
  checkInTime: string;
  checkOutTime?: string;
  status: 'checked-in' | 'checked-out';
  notes?: string;
  avatar?: string;
}

export interface GuestFormData {
  name: string;
  institution: string;
  purpose: string;
  phone: string;
  email?: string;
  category: 'VIP' | 'regular' | 'supplier' | 'intern';
  scheduledDate?: Date;
  scheduledTime?: string;
  notes?: string;
}

export interface FeedbackData {
  rating: number;
  feedback: string;
}
export interface GuestStats {
  totalToday: number;
  totalThisMonth: number;
  totalThisYear: number;
  currentlyCheckedIn: number;
  vipGuests: number;
  scheduledToday: number;
}

export interface FilterOptions {
  search: string;
  dateFrom?: Date;
  dateTo?: Date;
  status?: 'all' | 'checked-in' | 'checked-out';
  category?: 'all' | 'VIP' | 'regular' | 'supplier' | 'intern';
  sortBy: 'name' | 'date' | 'institution';
  sortOrder: 'asc' | 'desc';
}