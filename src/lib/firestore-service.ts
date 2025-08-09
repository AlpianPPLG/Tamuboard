import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc,
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp,
  onSnapshot,
  QuerySnapshot,
  DocumentData
} from 'firebase/firestore';
import { db } from './firebase';
import { FirestoreGuest, firestoreToGuest, guestToFirestore } from '@/types/firestore-guest';
import { Guest, GuestStats, FilterOptions } from '@/types/guest';

const COLLECTION_NAME = 'visitors';

export class FirestoreService {
  // Create a new guest
  static async createGuest(guestData: Omit<Guest, 'id' | 'visitDate' | 'checkInTime' | 'status' | 'visitTime'>): Promise<Guest> {
    try {
      const now = new Date();
      const newGuest: Guest = {
        ...guestData,
        id: '', // Will be set by Firestore
        visitDate: now,
        checkInTime: now.toLocaleTimeString('id-ID'),
        status: 'checked-in',
        visitTime: this.getTimeOfDay(now),
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
        checkedInBy: 'system',
      };

      const firestoreData = guestToFirestore(newGuest);
      const docRef = await addDoc(collection(db, COLLECTION_NAME), firestoreData);
      
      return {
        ...newGuest,
        id: docRef.id,
      };
    } catch (error) {
      console.error('Error creating guest:', error);
      throw new Error('Gagal menambahkan tamu');
    }
  }

  // Get all guests
  static async getGuests(includeDeleted: boolean = false): Promise<Guest[]> {
    try {
      let q = query(
        collection(db, COLLECTION_NAME),
        orderBy('createdAt', 'desc')
      );

      if (!includeDeleted) {
        q = query(
          collection(db, COLLECTION_NAME),
          where('status', '!=', 'deleted'),
          orderBy('status'),
          orderBy('createdAt', 'desc')
        );
      }

      const querySnapshot = await getDocs(q);
      const guests: Guest[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data() as FirestoreGuest;
        guests.push(firestoreToGuest({ ...data, id: doc.id }));
      });

      return guests;
    } catch (error) {
      console.error('Error getting guests:', error);
      throw new Error('Gagal memuat data tamu');
    }
  }

  // Get a single guest by ID
  static async getGuest(id: string): Promise<Guest | null> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as FirestoreGuest;
        return firestoreToGuest({ ...data, id: docSnap.id });
      }

      return null;
    } catch (error) {
      console.error('Error getting guest:', error);
      throw new Error('Gagal memuat data tamu');
    }
  }

  // Update a guest
  static async updateGuest(id: string, updates: Partial<Guest>): Promise<Guest | null> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      
      // Get current guest data
      const currentGuest = await this.getGuest(id);
      if (!currentGuest) {
        throw new Error('Tamu tidak ditemukan');
      }

      // Merge updates with current data
      const updatedGuest: Guest = {
        ...currentGuest,
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      // Convert to Firestore format
      const firestoreData = guestToFirestore(updatedGuest);
      
      await updateDoc(docRef, firestoreData);
      
      return updatedGuest;
    } catch (error) {
      console.error('Error updating guest:', error);
      throw new Error('Gagal memperbarui data tamu');
    }
  }

  // Soft delete a guest (move to trash)
  static async moveToTrash(id: string, deletedBy: string = 'system'): Promise<boolean> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      
      await updateDoc(docRef, {
        status: 'deleted',
        deletedAt: Timestamp.now(),
        deletedBy,
        updatedAt: Timestamp.now(),
      });

      return true;
    } catch (error) {
      console.error('Error moving guest to trash:', error);
      throw new Error('Gagal menghapus tamu');
    }
  }

  // Restore guest from trash
  static async restoreFromTrash(id: string): Promise<boolean> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      
      await updateDoc(docRef, {
        status: 'checked-out',
        deletedAt: null,
        deletedBy: '',
        updatedAt: Timestamp.now(),
      });

      return true;
    } catch (error) {
      console.error('Error restoring guest:', error);
      throw new Error('Gagal mengembalikan tamu');
    }
  }

  // Permanently delete a guest
  static async permanentDelete(id: string): Promise<boolean> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error('Error permanently deleting guest:', error);
      throw new Error('Gagal menghapus tamu secara permanen');
    }
  }

  // Check out a guest
  static async checkOutGuest(id: string): Promise<Guest | null> {
    try {
      const now = new Date();
      return await this.updateGuest(id, {
        status: 'checked-out',
        checkOutTime: now.toLocaleTimeString('id-ID'),
        checkedOutBy: 'system',
      });
    } catch (error) {
      console.error('Error checking out guest:', error);
      throw new Error('Gagal melakukan check out');
    }
  }

  // Get guests in trash
  static async getTrash(): Promise<Guest[]> {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const q = query(
        collection(db, COLLECTION_NAME),
        where('status', '==', 'deleted'),
        where('deletedAt', '>', Timestamp.fromDate(thirtyDaysAgo)),
        orderBy('deletedAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const guests: Guest[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data() as FirestoreGuest;
        guests.push(firestoreToGuest({ ...data, id: doc.id }));
      });

      return guests;
    } catch (error) {
      console.error('Error getting trash:', error);
      throw new Error('Gagal memuat data sampah');
    }
  }

  // Get statistics
  static async getStats(): Promise<GuestStats> {
    try {
      const guests = await this.getGuests();
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const startOfYear = new Date(today.getFullYear(), 0, 1);

      const todayGuests = guests.filter((g) => g.visitDate >= startOfDay);
      const scheduledToday = guests.filter((g) => 
        g.scheduledDate && 
        new Date(g.scheduledDate) >= startOfDay && 
        new Date(g.scheduledDate) < new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000)
      );
      
      const deletedGuests = await this.getTrash();
      
      return {
        totalToday: todayGuests.length,
        totalThisMonth: guests.filter((g) => g.visitDate >= startOfMonth).length,
        totalThisYear: guests.filter((g) => g.visitDate >= startOfYear).length,
        currentlyCheckedIn: guests.filter((g) => g.status === 'checked-in').length,
        vipGuests: todayGuests.filter((g) => g.category === 'VIP').length,
        scheduledToday: scheduledToday.length,
        deletedCount: deletedGuests.length,
      };
    } catch (error) {
      console.error('Error getting stats:', error);
      return {
        totalToday: 0,
        totalThisMonth: 0,
        totalThisYear: 0,
        currentlyCheckedIn: 0,
        vipGuests: 0,
        scheduledToday: 0,
        deletedCount: 0,
      };
    }
  }

  // Check for duplicate guest
  static async checkDuplicateGuest(name: string, phone: string, excludeId?: string): Promise<boolean> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('fullName', '==', name),
        where('phone', '==', phone),
        where('status', '!=', 'deleted')
      );

      const querySnapshot = await getDocs(q);
      
      if (excludeId) {
        return querySnapshot.docs.some(doc => doc.id !== excludeId);
      }
      
      return !querySnapshot.empty;
    } catch (error) {
      console.error('Error checking duplicate guest:', error);
      return false;
    }
  }

  // Add tag to guest
  static async addTagToGuest(guestId: string, tag: string): Promise<boolean> {
    try {
      const guest = await this.getGuest(guestId);
      if (!guest) return false;

      const updatedTags = [...new Set([...(guest.tags || []), tag.trim()])];
      await this.updateGuest(guestId, { tags: updatedTags });
      
      return true;
    } catch (error) {
      console.error('Error adding tag to guest:', error);
      return false;
    }
  }

  // Remove tag from guest
  static async removeTagFromGuest(guestId: string, tag: string): Promise<boolean> {
    try {
      const guest = await this.getGuest(guestId);
      if (!guest || !guest.tags) return false;

      const updatedTags = guest.tags.filter(t => t !== tag);
      await this.updateGuest(guestId, { tags: updatedTags });
      
      return true;
    } catch (error) {
      console.error('Error removing tag from guest:', error);
      return false;
    }
  }

  // Get all tags
  static async getAllTags(): Promise<string[]> {
    try {
      const guests = await this.getGuests();
      const allTags = new Set<string>();
      
      guests.forEach(guest => {
        if (guest.tags) {
          guest.tags.forEach(tag => allTags.add(tag));
        }
      });
      
      return Array.from(allTags);
    } catch (error) {
      console.error('Error getting all tags:', error);
      return [];
    }
  }

  // Add feedback to guest
  static async addFeedback(id: string, rating: number, feedback: string): Promise<Guest | null> {
    try {
      return await this.updateGuest(id, { rating, feedback });
    } catch (error) {
      console.error('Error adding feedback:', error);
      throw new Error('Gagal menambahkan feedback');
    }
  }

  // Clean up expired trash (older than 30 days)
  static async cleanupExpiredTrash(): Promise<number> {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const q = query(
        collection(db, COLLECTION_NAME),
        where('status', '==', 'deleted'),
        where('deletedAt', '<', Timestamp.fromDate(thirtyDaysAgo))
      );

      const querySnapshot = await getDocs(q);
      const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
      
      await Promise.all(deletePromises);
      
      return querySnapshot.size;
    } catch (error) {
      console.error('Error cleaning up expired trash:', error);
      return 0;
    }
  }

  // Real-time listener for guests
  static onGuestsChange(callback: (guests: Guest[]) => void, includeDeleted: boolean = false): () => void {
    try {
      let q = query(
        collection(db, COLLECTION_NAME),
        orderBy('createdAt', 'desc')
      );

      if (!includeDeleted) {
        q = query(
          collection(db, COLLECTION_NAME),
          where('status', '!=', 'deleted'),
          orderBy('status'),
          orderBy('createdAt', 'desc')
        );
      }

      return onSnapshot(q, (querySnapshot: QuerySnapshot<DocumentData>) => {
        const guests: Guest[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data() as FirestoreGuest;
          guests.push(firestoreToGuest({ ...data, id: doc.id }));
        });
        callback(guests);
      });
    } catch (error) {
      console.error('Error setting up real-time listener:', error);
      return () => {}; // Return empty unsubscribe function
    }
  }

  // Helper function to get time of day
  private static getTimeOfDay(date: Date): 'morning' | 'afternoon' | 'evening' {
    const hour = date.getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  }

  // Filter guests (client-side filtering after fetching from Firestore)
  static filterGuests(guests: Guest[], filters: FilterOptions): Guest[] {
    let filtered = [...guests];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (guest) =>
          guest.name.toLowerCase().includes(searchLower) ||
          guest.institution.toLowerCase().includes(searchLower) ||
          guest.purpose.toLowerCase().includes(searchLower)
      );
    }

    // Date range filter
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      fromDate.setHours(0, 0, 0, 0);
      filtered = filtered.filter((guest) => guest.visitDate >= fromDate);
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter((guest) => guest.visitDate <= toDate);
    }

    // Status filter
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter((guest) => guest.status === filters.status);
    }

    // Category filter
    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter((guest) => guest.category === filters.category);
    }

    // Tags filter
    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter(guest => 
        guest.tags && filters.tags?.some(tag => guest.tags?.includes(tag))
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (filters.sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'institution':
          aValue = a.institution.toLowerCase();
          bValue = b.institution.toLowerCase();
          break;
        case 'date':
        default:
          aValue = a.visitDate.getTime();
          bValue = b.visitDate.getTime();
          break;
      }

      if (aValue < bValue) return filters.sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return filters.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }

  // Clear all local storage data (migration helper)
  static clearLocalStorage(): void {
    if (typeof window === 'undefined') return;
    
    const keysToRemove = [
      'buku-tamu-guests',
      'buku-tamu-guests-trash',
      'buku-tamu-guests-tags',
      'savedFilters',
      'reminderSettings'
    ];

    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });

    console.log('Local storage cleared successfully');
  }
}