import { Timestamp } from 'firebase/firestore';
import { Guest } from '@/types/guest';
import { Visitor } from '@/types/visitor';

export function mapGuestToVisitor(guest: Guest): Visitor {
  return {
    id: guest.id,
    fullName: guest.name,
    email: guest.email || '',
    institution: guest.institution,
    guestCategory: guest.category.toLowerCase() as 'regular' | 'vip',
    checkIn: guest.visitDate,
    checkOutTime: guest.checkOutTime ? new Date(guest.checkOutTime) : null,
    createdAt: guest.visitDate,
    updatedAt: new Date(),
    deletedAt: guest.deletedAt || null,
  };
}

export function mapVisitorToGuest(visitor: Visitor): Guest {
  return {
    id: visitor.id || '',
    name: visitor.fullName,
    email: visitor.email,
    institution: visitor.institution,
    purpose: '', // Not available in Visitor
    phone: '', // Not available in Visitor
    category: visitor.guestCategory.toUpperCase() as 'VIP' | 'regular',
    visitDate: visitor.checkIn instanceof Date ? visitor.checkIn : visitor.checkIn.toDate(),
    checkInTime: visitor.checkIn instanceof Date ? 
      visitor.checkIn.toISOString().split('T')[1].substring(0, 5) : 
      visitor.checkIn.toDate().toISOString().split('T')[1].substring(0, 5),
    checkOutTime: visitor.checkOutTime ? 
      (visitor.checkOutTime instanceof Date ? 
        visitor.checkOutTime.toISOString() : 
        visitor.checkOutTime.toDate().toISOString()) : 
      undefined,
    status: 'checked-in',
    visitTime: 'morning', // Default value
  };
}

// Helper function to handle date conversion
export function toFirestoreDate(date: Date | Timestamp): Date {
  return date instanceof Date ? date : date.toDate();
}
