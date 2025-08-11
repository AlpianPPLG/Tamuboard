import { Timestamp } from 'firebase/firestore';

export interface Visitor {
  id?: string;                    // undefined for new docs
  fullName: string;
  email: string;
  institution: string;
  guestCategory: 'regular' | 'vip' | 'supplier' | 'intern';
  checkIn: Timestamp | Date;
  checkOutTime?: Timestamp | Date | null;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
  deletedAt?: Timestamp | Date | null;
  deletedBy?: string;
  
  // Additional fields from Guest
  phone?: string;
  purpose?: string;
  visitTime?: 'morning' | 'afternoon' | 'evening';
  scheduledDate?: Timestamp | Date | null;
  scheduledTime?: string;
  feedback?: string;
  rating?: number;
  status?: 'checked-in' | 'checked-out' | 'deleted';
  notes?: string;
  avatar?: string;
  tags?: string[];
  specialRequirements?: Array<{
    type: string;
    description: string;
  }>;
  autoCheckoutReminder?: boolean;
  reminderSettings?: {
    enabled: boolean;
    reminderTime: 'morning' | 'afternoon' | 'evening';
    reminderIntervals: number[];
    autoCheckoutAfter: number;
    notificationMethods: ('system' | 'email' | 'sms')[];
  };
  reminderSentAt?: Timestamp | Date | null;
  expectedDuration?: {
    duration: number;
    unit: 'minutes' | 'hours';
  };
}

export type CreateVisitorDTO = Omit<Visitor, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;
export type UpdateVisitorDTO = Partial<CreateVisitorDTO> & {
  deletedAt?: Timestamp | Date | null;
  deletedBy?: string;
  updatedAt?: Timestamp | Date;
};
