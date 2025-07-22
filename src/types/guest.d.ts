export interface Guest {
  id: string;
  name: string;
  institution: string;
  purpose: string;
  phone: string;
  email?: string;
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
  notes?: string;
}

export interface GuestStats {
  totalToday: number;
  totalThisMonth: number;
  totalThisYear: number;
  currentlyCheckedIn: number;
}

export interface FilterOptions {
  search: string;
  dateFrom?: Date;
  dateTo?: Date;
  status?: 'all' | 'checked-in' | 'checked-out';
  sortBy: 'name' | 'date' | 'institution';
  sortOrder: 'asc' | 'desc';
}