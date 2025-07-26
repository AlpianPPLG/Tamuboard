"use client"

import { Guest, GuestStats } from '@/types/guest';
import { getVisitTime } from './guest-utils';

const STORAGE_KEY = 'buku-tamu-guests';

// Tipe hasil parsing JSON dari localStorage
type StoredGuest = Omit<Guest, 'visitDate'> & { visitDate: string };

export class GuestStorage {
  private static readonly TRASH_KEY = `${STORAGE_KEY}-trash`;
  private static readonly TAGS_KEY = `${STORAGE_KEY}-tags`;

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

  // Move guest to trash instead of permanent deletion
  static deleteGuest(id: string, deletedBy: string = 'system'): boolean {
    const guest = this.getGuests(true).find(g => g.id === id);
    if (!guest) return false;

    // Update guest status to deleted and set deletion timestamp
    const updatedGuest = {
      ...guest,
      status: 'deleted' as const,
      deletedAt: new Date(),
      deletedBy,
    };

    // Save the updated guest
    const guests = this.getGuests(true).filter(g => g.id !== id);
    guests.unshift(updatedGuest);
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

  static saveTags(tags: string[]): void {
    if (typeof window === 'undefined') return;
    
    try {
      const uniqueTags = Array.from(new Set(tags.map(tag => tag.trim()).filter(Boolean)));
      localStorage.setItem(this.TAGS_KEY, JSON.stringify(uniqueTags));
    } catch (error) {
      console.error('Error saving tags:', error);
    }
  }

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
