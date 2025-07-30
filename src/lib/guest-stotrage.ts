"use client"

import { Guest, GuestStats } from '@/types/guest';
import { getVisitTime } from './guest-utils';

// Kunci untuk menyimpan data tamu di localStorage  
const STORAGE_KEY = 'buku-tamu-guests';

// Tipe hasil parsing JSON dari localStorage
type StoredGuest = Omit<Guest, 'visitDate'> & { visitDate: string };

// Kelas untuk mengelola data tamu  
export class GuestStorage {
  private static readonly TRASH_KEY = `${STORAGE_KEY}-trash`;
  private static readonly TAGS_KEY = `${STORAGE_KEY}-tags`;

  // Check if a guest with the same name and phone already exists
  static checkDuplicateGuest(name: string, phone: string, excludeId?: string): boolean {
    const guests = this.getGuests();
    return guests.some(guest => 
      guest.name.toLowerCase() === name.toLowerCase() && 
      guest.phone === phone &&
      (!excludeId || guest.id !== excludeId)
    );
  }

  // Get all active guests (not deleted by default)
  static getGuests(includeDeleted: boolean = false): Guest[] {
    if (typeof window === 'undefined') return [];

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];

      const parsed: unknown = JSON.parse(stored);

      // Validate parse result
      if (!Array.isArray(parsed)) return [];

      // Process and filter guests
      const guests: Guest[] = [];
      
      // Loop through parsed guests
      for (const item of parsed) {
        if (
          typeof item === 'object' &&
          item !== null &&
          'visitDate' in item &&
          typeof (item as Record<string, unknown>).visitDate === 'string' &&
          'id' in item &&
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          typeof (item as any).id === 'string'
        ) {
          const raw = item as StoredGuest;
          const guest: Guest = {
            id: raw.id,
            name: raw.name || '',
            institution: raw.institution || '',
            purpose: raw.purpose || '',
            phone: raw.phone || '',
            email: raw.email,
            category: raw.category || 'regular',
            visitTime: raw.visitTime || getVisitTime(),
            scheduledDate: raw.scheduledDate ? new Date(raw.scheduledDate) : undefined,
            scheduledTime: raw.scheduledTime,
            feedback: raw.feedback,
            rating: raw.rating,
            visitDate: new Date(raw.visitDate),
            checkInTime: raw.checkInTime || new Date().toLocaleTimeString('id-ID'),
            checkOutTime: raw.checkOutTime,
            status: raw.status || 'checked-in',
            notes: raw.notes,
            avatar: raw.avatar,
            privacySettings: raw.privacySettings,
            specialRequirements: raw.specialRequirements || [],
            autoCheckoutReminder: raw.autoCheckoutReminder,
            reminderSettings: raw.reminderSettings,
            reminderSentAt: raw.reminderSentAt ? new Date(raw.reminderSentAt) : undefined,
            expectedDuration: raw.expectedDuration,
            tags: raw.tags || [],
            deletedAt: raw.deletedAt ? new Date(raw.deletedAt) : undefined,
            deletedBy: raw.deletedBy,
          };
          
          if (includeDeleted || guest.status !== 'deleted') {
            guests.push(guest);
          }
        }
      }
      
      return guests;
    } catch (error) {
      console.error('Error loading guests:', error);
      return [];
    }
  }

  // Save guests to localStorage  
  static saveGuests(guests: Guest[]): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(guests));
    } catch (error) {
      console.error('Error saving guests:', error);
    }
  }

  // Add a new guest  
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

  // Update an existing guest  
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

    // Move guest to trash instead of permanent deletion
  static moveToTrash(id: string, deletedBy: string = 'system'): boolean {
    const guests = this.getGuests(true);
    const index = guests.findIndex(g => g.id === id);
    
    if (index === -1) return false;
    
    // Mark as deleted with current timestamp
    guests[index] = {
      ...guests[index],
      status: 'deleted',
      deletedAt: new Date(),
      deletedBy
    };
    
    this.saveGuests(guests);
    return true;
  }

  // Alias for backward compatibility
  static deleteGuest(id: string, deletedBy: string = 'system'): boolean {
    return this.moveToTrash(id, deletedBy);
  }

  // Get all guests in trash
  static getTrash(): Guest[] {
    const guests = this.getGuests(true);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    return guests.filter(guest => 
      guest.status === 'deleted' && 
      guest.deletedAt && 
      guest.deletedAt >= thirtyDaysAgo
    );
  }

  // Permanently delete guests that have been in trash for more than 30 days
  static cleanupExpiredTrash(): number {
    const guests = this.getGuests(true);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const remainingGuests = guests.filter(guest => {
      // Keep guests that are not deleted or were deleted within the last 30 days
      return guest.status !== 'deleted' || 
             !guest.deletedAt || 
             guest.deletedAt >= thirtyDaysAgo;
    });
    
    const deletedCount = guests.length - remainingGuests.length;
    if (deletedCount > 0) {
      this.saveGuests(remainingGuests);
    }
    
    return deletedCount;
  }

  // Restore a guest from trash
  static restoreFromTrash(id: string): boolean {
    const guests = this.getGuests(true);
    const index = guests.findIndex(g => g.id === id);
    
    if (index === -1 || guests[index].status !== 'deleted') return false;
    
    guests[index] = {
      ...guests[index],
      status: 'checked-out',
      deletedAt: undefined,
      deletedBy: undefined
    };
    
    this.saveGuests(guests);
    return true;
  }

  // Permanently remove a guest from the system
  static permanentDelete(id: string): boolean {
    const guests = this.getGuests(true).filter(g => g.id !== id);
    this.saveGuests(guests);
    return true;
  }

  // Restore a guest from trash
  static restoreGuest(id: string): boolean {
    const guest = this.getGuests(true).find(g => g.id === id && g.status === 'deleted');
    if (!guest) return false;

    // Remove deletion metadata and restore to checked-out status
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { deletedAt, deletedBy, ...rest } = guest;
    const updatedGuest = {
      ...rest,
      status: 'checked-out' as const,
    };

    // Save the restored guest
    const guests = this.getGuests(true).filter(g => g.id !== id);
    guests.unshift(updatedGuest);
    this.saveGuests(guests);
    
    return true;
  }

  // Get all deleted guests
  static getDeletedGuests(): Guest[] {
    return this.getGuests(true).filter(g => g.status === 'deleted');
  }

  // Tag management
  static getAllTags(): string[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(this.TAGS_KEY);
      if (!stored) return [];
      
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('Error loading tags:', error);
      return [];
    }
  }

  // Save tags to localStorage
  static saveTags(tags: string[]): void {
    if (typeof window === 'undefined') return;
    
    try {
      const uniqueTags = Array.from(new Set(tags.map(tag => tag.trim()).filter(Boolean)));
      localStorage.setItem(this.TAGS_KEY, JSON.stringify(uniqueTags));
    } catch (error) {
      console.error('Error saving tags:', error);
    }
  }

  // Add a tag to a guest
  static addTagToGuest(guestId: string, tag: string): boolean {
    const guests = this.getGuests(true);
    const guest = guests.find(g => g.id === guestId);
    if (!guest) return false;

    const updatedTags = [...new Set([...(guest.tags || []), tag.trim()])];
    const updatedGuest = {
      ...guest,
      tags: updatedTags,
    };

    // Update tags list
    const allTags = this.getAllTags();
    const newTags = [tag.trim()].filter(t => !allTags.includes(t));
    if (newTags.length > 0) {
      this.saveTags([...allTags, ...newTags]);
    }

    // Update guest
    const updatedGuests = guests.map(g => (g.id === guestId ? updatedGuest : g));
    this.saveGuests(updatedGuests);
    
    return true;
  }

  // Remove a tag from a guest
  static removeTagFromGuest(guestId: string, tag: string): boolean {
    const guests = this.getGuests(true);
    const guest = guests.find(g => g.id === guestId);
    if (!guest || !guest.tags) return false;

    const updatedGuest = {
      ...guest,
      tags: guest.tags.filter(t => t !== tag),
    };

    const updatedGuests = guests.map(g => (g.id === guestId ? updatedGuest : g));
    this.saveGuests(updatedGuests);
    
    return true;
  }

    // Add feedback to a guest
  static addFeedback(id: string, rating: number, feedback: string): Guest | null {
    return this.updateGuest(id, { rating, feedback });
  }

  // Get statistics
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
    
    // Get deleted count from trash
    const deletedCount = this.getDeletedGuests().length;
    
    return {
      totalToday: todayGuests.length,
      totalThisMonth: guests.filter((g) => g.visitDate >= startOfMonth).length,
      totalThisYear: guests.filter((g) => g.visitDate >= startOfYear).length,
      currentlyCheckedIn: guests.filter((g) => g.status === 'checked-in').length,
      vipGuests: todayGuests.filter((g) => g.category === 'VIP').length,
      scheduledToday: scheduledToday.length,
      deletedCount,
    };
  }

  // Check out a guest
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

export type { Guest };
export type { GuestStats };
