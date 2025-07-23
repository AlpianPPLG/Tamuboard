import { Guest, GuestStats } from '@/types/guest';
import { getVisitTime } from './guest-utils';

const STORAGE_KEY = 'buku-tamu-guests';

// Tipe hasil parsing JSON dari localStorage
type StoredGuest = Omit<Guest, 'visitDate'> & { visitDate: string };

export class GuestStorage {
  static getGuests(): Guest[] {
    if (typeof window === 'undefined') return [];

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];

      const parsed: unknown = JSON.parse(stored);

      // Validasi hasil parse
      if (!Array.isArray(parsed)) return [];

      return parsed.map((item: unknown) => {
        if (
          typeof item === 'object' &&
          item !== null &&
          'visitDate' in item &&
          typeof (item as Record<string, unknown>).visitDate === 'string'
        ) {
          const raw = item as StoredGuest;
          return {
            ...raw,
            visitDate: new Date(raw.visitDate),
            // Ensure backward compatibility
            category: raw.category || 'regular',
            visitTime: raw.visitTime || getVisitTime(),
          };
        }
        // Jika struktur tidak sesuai, abaikan entri ini
        return null;
      }).filter((g): g is Guest => g !== null);
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

  static addGuest(
    guest: Omit<Guest, 'id' | 'visitDate' | 'checkInTime' | 'status' | 'visitTime'>
  ): Guest {
    const guests = this.getGuests();
    const newGuest: Guest = {
      ...guest,
      id: crypto.randomUUID(),
      visitDate: new Date(),
      checkInTime: new Date().toLocaleTimeString('id-ID'),
      visitTime: getVisitTime(),
      status: 'checked-in',
    };

    guests.unshift(newGuest);
    this.saveGuests(guests);
    return newGuest;
  }

  static updateGuest(id: string, updates: Partial<Guest>): Guest | null {
    const guests = this.getGuests();
    const index = guests.findIndex((g) => g.id === id);
    if (index === -1) return null;

    guests[index] = {
      ...guests[index],
      ...updates,
      visitDate: updates.visitDate ?? guests[index].visitDate,
      checkInTime: updates.checkInTime ?? guests[index].checkInTime,
    };

    this.saveGuests(guests);
    return guests[index];
  }

  static deleteGuest(id: string): boolean {
    const guests = this.getGuests();
    const filtered = guests.filter((g) => g.id !== id);

    if (filtered.length === guests.length) return false;

    this.saveGuests(filtered);
    return true;
  }

  static addFeedback(id: string, rating: number, feedback: string): Guest | null {
    return this.updateGuest(id, { rating, feedback });
  }
  static getStats(): GuestStats {
    const guests = this.getGuests();
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
    return {
      totalToday: todayGuests.length,
      totalThisMonth: guests.filter((g) => g.visitDate >= startOfMonth).length,
      totalThisYear: guests.filter((g) => g.visitDate >= startOfYear).length,
      currentlyCheckedIn: guests.filter((g) => g.status === 'checked-in').length,
      vipGuests: todayGuests.filter((g) => g.category === 'VIP').length,
      scheduledToday: scheduledToday.length,
    };
  }

  static checkOutGuest(id: string): Guest | null {
    const guest = this.getGuests().find(g => g.id === id);
    if (!guest) return null;
    
    if (guest.status === 'checked-out') {
      return null; // Already checked out
    }
    
    return this.updateGuest(id, {
      status: 'checked-out',
      checkOutTime: new Date().toLocaleTimeString('id-ID'),
    });
  }
}