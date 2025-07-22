import { Guest, GuestStats } from '@/types/guest';

const STORAGE_KEY = 'buku-tamu-guests';

export class GuestStorage {
  static getGuests(): Guest[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      
      const guests = JSON.parse(stored);
      return guests.map((guest: any) => ({
        ...guest,
        visitDate: new Date(guest.visitDate)
      }));
    } catch (error) {
      console.error('Error loading guests:', error);
      return [];
    }
  }

  static saveGuests(guests: Guest[]): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(guests));
    } catch (error) {
      console.error('Error saving guests:', error);
    }
  }

  static addGuest(guest: Omit<Guest, 'id' | 'visitDate' | 'checkInTime' | 'status'>): Guest {
    const guests = this.getGuests();
    const newGuest: Guest = {
      ...guest,
      id: crypto.randomUUID(),
      visitDate: new Date(),
      checkInTime: new Date().toLocaleTimeString('id-ID'),
      status: 'checked-in'
    };
    
    guests.unshift(newGuest);
    this.saveGuests(guests);
    return newGuest;
  }

  static updateGuest(id: string, updates: Partial<Guest>): Guest | null {
    const guests = this.getGuests();
    const index = guests.findIndex(g => g.id === id);
    
    if (index === -1) return null;
    
    guests[index] = { 
      ...guests[index], 
      ...updates,
      // Preserve original timestamps unless explicitly updating
      visitDate: updates.visitDate || guests[index].visitDate,
      checkInTime: updates.checkInTime || guests[index].checkInTime
    };
    this.saveGuests(guests);
    return guests[index];
  }

  static deleteGuest(id: string): boolean {
    const guests = this.getGuests();
    const filtered = guests.filter(g => g.id !== id);
    
    if (filtered.length === guests.length) return false;
    
    this.saveGuests(filtered);
    return true;
  }

  static getStats(): GuestStats {
    const guests = this.getGuests();
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);

    return {
      totalToday: guests.filter(g => g.visitDate >= startOfDay).length,
      totalThisMonth: guests.filter(g => g.visitDate >= startOfMonth).length,
      totalThisYear: guests.filter(g => g.visitDate >= startOfYear).length,
      currentlyCheckedIn: guests.filter(g => g.status === 'checked-in').length
    };
  }

  static checkOutGuest(id: string): Guest | null {
    return this.updateGuest(id, {
      status: 'checked-out',
      checkOutTime: new Date().toLocaleTimeString('id-ID')
    });
  }
}