import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  deleteDoc, 
  serverTimestamp} from 'firebase/firestore';
import { db } from './firebase';
import { Visitor, CreateVisitorDTO, UpdateVisitorDTO } from '@/types/visitor';

const VISITORS_COLLECTION = 'visitors';

// Convert Firestore data to Visitor
export const toVisitor = (doc: any): Visitor => {
  const data = doc.data();
  return {
    id: doc.id,
    fullName: data.fullName,
    email: data.email,
    institution: data.institution,
    guestCategory: data.guestCategory,
    checkIn: data.checkIn?.toDate(),
    checkOutTime: data.checkOutTime?.toDate(),
    createdAt: data.createdAt?.toDate(),
    updatedAt: data.updatedAt?.toDate(),
    deletedAt: data.deletedAt?.toDate()
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