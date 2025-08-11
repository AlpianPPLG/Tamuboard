import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  deleteDoc, 
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  DocumentData,
  DocumentSnapshot,
  QueryDocumentSnapshot
} from 'firebase/firestore';
import { db } from './firebase';
import { Visitor, CreateVisitorDTO, UpdateVisitorDTO } from '@/types/visitor';

const VISITORS_COLLECTION = 'visitors';

// Convert Firestore data to Visitor
export const toVisitor = (doc: DocumentSnapshot<DocumentData> | QueryDocumentSnapshot<DocumentData>): Visitor => {
  const data = doc.data();
  if (!data) {
    throw new Error(`No data found for document ${doc.id}`);
  }
  
  // Ensure required fields are present
  if (!data.fullName || !data.email || !data.institution || !data.guestCategory || !data.checkIn) {
    throw new Error(`Missing required fields in document ${doc.id}`);
  }

  return {
    id: doc.id,
    fullName: data.fullName as string,
    email: data.email as string,
    institution: data.institution as string,
    guestCategory: data.guestCategory as 'regular' | 'vip' | 'supplier' | 'intern',
    checkIn: data.checkIn?.toDate(),
    checkOutTime: data.checkOutTime?.toDate(),
    createdAt: data.createdAt?.toDate(),
    updatedAt: data.updatedAt?.toDate(),
    deletedAt: data.deletedAt?.toDate(),
    // Optional fields with type assertions
    phone: data.phone as string | undefined,
    purpose: data.purpose as string | undefined,
    visitTime: data.visitTime as 'morning' | 'afternoon' | 'evening' | undefined,
    scheduledDate: data.scheduledDate?.toDate(),
    scheduledTime: data.scheduledTime as string | undefined,
    feedback: data.feedback as string | undefined,
    rating: data.rating as number | undefined,
    status: data.status as 'checked-in' | 'checked-out' | 'deleted' | undefined,
    notes: data.notes as string | undefined,
    avatar: data.avatar as string | undefined,
    tags: data.tags as string[] | undefined,
    specialRequirements: data.specialRequirements as Array<{ type: string; description: string }> | undefined,
    autoCheckoutReminder: data.autoCheckoutReminder as boolean | undefined,
    reminderSettings: data.reminderSettings as {
      enabled: boolean;
      reminderTime: 'morning' | 'afternoon' | 'evening';
      reminderIntervals: number[];
      autoCheckoutAfter: number;
      notificationMethods: ('system' | 'email' | 'sms')[];
    } | undefined,
    reminderSentAt: data.reminderSentAt?.toDate(),
    expectedDuration: data.expectedDuration as {
      duration: number;
      unit: 'minutes' | 'hours';
    } | undefined,
  };
};

export const createVisitor = async (data: CreateVisitorDTO): Promise<Visitor> => {
  const visitorData = {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, VISITORS_COLLECTION), visitorData);
  return { id: docRef.id, ...data } as Visitor;
};

export const updateVisitor = async (id: string, data: UpdateVisitorDTO): Promise<void> => {
  const visitorRef = doc(db, VISITORS_COLLECTION, id);
  await updateDoc(visitorRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

export const deleteVisitor = async (id: string): Promise<void> => {
  const visitorRef = doc(db, VISITORS_COLLECTION, id);
  await updateDoc(visitorRef, {
    deletedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

export const hardDeleteVisitor = async (id: string): Promise<void> => {
  const visitorRef = doc(db, VISITORS_COLLECTION, id);
  await deleteDoc(visitorRef);
};

// Get all visitors with optional deleted filter
export const getVisitors = async (includeDeleted: boolean = false): Promise<Visitor[]> => {
  let q = query(collection(db, VISITORS_COLLECTION));
  
  if (!includeDeleted) {
    q = query(q, where('deletedAt', '==', null));
  }
  
  q = query(q, orderBy('createdAt', 'desc'));
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => toVisitor(doc));
};

// Get a single visitor by ID
export const getVisitorById = async (id: string): Promise<Visitor | null> => {
  const docRef = doc(db, VISITORS_COLLECTION, id);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) {
    return null;
  }
  
  return toVisitor(docSnap);
};

// Restore a visitor from trash
export const restoreFromTrash = async (id: string): Promise<boolean> => {
  try {
    const visitorRef = doc(db, VISITORS_COLLECTION, id);
    await updateDoc(visitorRef, {
      deletedAt: null,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error restoring visitor:', error);
    return false;
  }
};

// Get visitor statistics
export const getVisitorStats = async (): Promise<{
  total: number;
  active: number;
  deleted: number;
}> => {
  const [allVisitors, activeVisitors, deletedVisitors] = await Promise.all([
    getVisitors(true),
    getVisitors(false),
    getVisitors(true).then(visitors => visitors.filter(v => v.deletedAt))
  ]);
  
  return {
    total: allVisitors.length,
    active: activeVisitors.length,
    deleted: deletedVisitors.length
  };
};