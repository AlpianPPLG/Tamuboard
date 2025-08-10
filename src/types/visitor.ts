import { Timestamp } from 'firebase/firestore';

export interface Visitor {
  id?: string;                    // undefined for new docs
  fullName: string;
  email: string;
  institution: string;
  guestCategory: 'regular' | 'vip';
  checkIn: Timestamp | Date;
  checkOutTime?: Timestamp | Date | null;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
  deletedAt?: Timestamp | Date | null;
}

export type CreateVisitorDTO = Omit<Visitor, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;
export type UpdateVisitorDTO = Partial<CreateVisitorDTO>;
