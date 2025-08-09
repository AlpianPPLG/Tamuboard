import { Timestamp } from 'firebase/firestore';

export interface FirestoreGuest {
  id?: string;
  checkIn: Timestamp;
  checkOutTime: Timestamp | null | string;
  checkedInBy: string;
  checkedOutBy: string | null;
  createdAt: Timestamp;
  deletedAt: Timestamp | null;
  deletedBy: string;
  email: string;
  feedback: string;
  fullName: string;
  guestCategory: 'VIP' | 'regular' | 'supplier' | 'intern';
  institution: string;
  notes: string;
  phone: string;
  purpose: string;
  rating: number;
  scheduledDate: Timestamp | null;
  scheduledTime: string;
  status: 'checked-in' | 'checked-out' | 'deleted';
  tags: string[];
  updatedAt: Timestamp;
  visitTime: 'morning' | 'afternoon' | 'evening';
}

// Helper function to convert Firestore guest to local Guest type
export function firestoreToGuest(firestoreGuest: FirestoreGuest & { id: string }): import('@/types/guest').Guest {
  return {
    id: firestoreGuest.id,
    name: firestoreGuest.fullName,
    institution: firestoreGuest.institution,
    purpose: firestoreGuest.purpose,
    phone: firestoreGuest.phone,
    email: firestoreGuest.email || undefined,
    category: firestoreGuest.guestCategory,
    visitTime: firestoreGuest.visitTime,
    scheduledDate: firestoreGuest.scheduledDate?.toDate(),
    scheduledTime: firestoreGuest.scheduledTime,
    feedback: firestoreGuest.feedback || undefined,
    rating: firestoreGuest.rating || undefined,
    visitDate: firestoreGuest.checkIn.toDate(),
    checkInTime: firestoreGuest.checkIn.toDate().toLocaleTimeString('id-ID'),
    checkOutTime: firestoreGuest.checkOutTime ? 
      (typeof firestoreGuest.checkOutTime === 'string' ? 
        firestoreGuest.checkOutTime : 
        firestoreGuest.checkOutTime.toDate().toLocaleTimeString('id-ID')) : 
      undefined,
    status: firestoreGuest.status,
    notes: firestoreGuest.notes || undefined,
    tags: firestoreGuest.tags || [],
    deletedAt: firestoreGuest.deletedAt?.toDate(),
    deletedBy: firestoreGuest.deletedBy || undefined,
    checkedInBy: firestoreGuest.checkedInBy,
    checkedOutBy: firestoreGuest.checkedOutBy || undefined,
    updatedAt: firestoreGuest.updatedAt.toDate().toISOString(),
    createdAt: firestoreGuest.createdAt.toDate().toISOString(),
  };
}

// Helper function to convert local Guest to Firestore format
export function guestToFirestore(guest: import('@/types/guest').Guest): Omit<FirestoreGuest, 'id'> {
  const now = Timestamp.now();
  
  // Ensure visitDate is a valid Date object
  const visitDate = guest.visitDate instanceof Date ? guest.visitDate : new Date();
  
  // Log the conversion for debugging
  console.log('Converting guest to Firestore format:', {
    guest,
    visitDate,
    checkIn: Timestamp.fromDate(visitDate),
    now: now.toDate().toISOString()
  });
  
  const firestoreData: Omit<FirestoreGuest, 'id'> = {
    checkIn: Timestamp.fromDate(visitDate),
    checkOutTime: guest.checkOutTime ? Timestamp.fromDate(new Date(guest.checkOutTime)) : null,
    checkedInBy: guest.checkedInBy || 'system',
    checkedOutBy: guest.checkedOutBy || null,
    createdAt: guest.createdAt ? Timestamp.fromDate(new Date(guest.createdAt)) : now,
    deletedAt: guest.deletedAt ? Timestamp.fromDate(new Date(guest.deletedAt)) : null,
    deletedBy: guest.deletedBy || '',
    email: guest.email || '',
    feedback: guest.feedback || '',
    fullName: guest.name,  
    guestCategory: guest.category,
    institution: guest.institution,
    notes: guest.notes || '',
    phone: guest.phone,
    purpose: guest.purpose,
    rating: guest.rating || 0,
    scheduledDate: guest.scheduledDate ? Timestamp.fromDate(new Date(guest.scheduledDate)) : null,
    scheduledTime: guest.scheduledTime || '',
    status: guest.status || 'checked-in',
    tags: guest.tags || [],
    updatedAt: now,
    visitTime: guest.visitTime,
  };

  console.log('Converted to Firestore data:', firestoreData);
  return firestoreData;
}