"use client"

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
  status: 'checked-in' | 'checked-out' | 'deleted';
  notes?: string;
  avatar?: string;
  privacySettings?: PrivacySettings;
  specialRequirements?: SpecialRequirement[];
  autoCheckoutReminder?: AutoCheckoutReminder;
  reminderSettings?: ReminderSettings;
  reminderSentAt?: Date;
  expectedDuration?: ExpectedDuration;
  tags?: string[];
  deletedAt?: Date;
  deletedBy?: string;
  checkedInBy?: string;
  checkedOutBy?: string | null;
  updatedAt?: string;
  createdAt?: string;
}

export interface PrivacySettings {
  hideName?: boolean;
  hidePhone?: boolean;
  hideEmail?: boolean;
}

export interface SpecialRequirement {
  id?: string;
  type: 'food' | 'accommodation' | 'other';
  description: string;
}

export interface AutoCheckoutReminder {
  enabled: boolean;
  reminderTime: 'morning' | 'afternoon' | 'evening';
}

export interface ExpectedDuration {
  duration: number;
  unit: 'minutes' | 'hours';
}

export interface PurposeTemplate {
  id: string;
  name: string;
  requirements: RequirementType[];
  category: string;
}

export interface RequirementType {
  type: 'food' | 'accommodation' | 'other';
  description: string;
}

export interface ReminderSettings {
  enabled: boolean;
  reminderTime: 'morning' | 'afternoon' | 'evening';
  reminderIntervals: number[];
  autoCheckoutAfter: number;
  notificationMethods: ('system' | 'email' | 'sms')[];
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
  deletedCount: number;
}

export interface FilterOptions {
  search: string;
  dateFrom?: Date | string;
  dateTo?: Date | string;
  status?: 'all' | 'checked-in' | 'checked-out';
  category?: 'all' | 'VIP' | 'regular' | 'supplier' | 'intern';
  sortBy: 'name' | 'date' | 'institution';
  sortOrder: 'asc' | 'desc';
  tags?: string[];
}