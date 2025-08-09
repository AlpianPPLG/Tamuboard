"use client"

import { FirestoreService } from './firestore-service';
import { Guest, GuestStats } from '@/types/guest';

// Migration wrapper class that delegates to FirestoreService
export class GuestStorage {
  // Check if a guest with the same name and phone already exists
  static async checkDuplicateGuest(name: string, phone: string, excludeId?: string): Promise<boolean> {
    return await FirestoreService.checkDuplicateGuest(name, phone, excludeId);
  }

  // Get all active guests (not deleted by default)
  static async getGuests(includeDeleted: boolean = false): Promise<Guest[]> {
    return await FirestoreService.getGuests(includeDeleted);
  }

  // Add a new guest  
  static async addGuest(
    guest: Omit<Guest, 'id' | 'visitDate' | 'checkInTime' | 'status' | 'visitTime'>
  ): Promise<Guest> {
    return await FirestoreService.createGuest(guest);
  }

  // Update an existing guest  
  static async updateGuest(id: string, updates: Partial<Guest>): Promise<Guest | null> {
    return await FirestoreService.updateGuest(id, updates);
  }

  // Move guest to trash instead of permanent deletion
  static async moveToTrash(id: string, deletedBy: string = 'system'): Promise<boolean> {
    return await FirestoreService.moveToTrash(id, deletedBy);
  }

  // Alias for backward compatibility
  static async deleteGuest(id: string, deletedBy: string = 'system'): Promise<boolean> {
    return await FirestoreService.moveToTrash(id, deletedBy);
  }

  // Get all guests in trash
  static async getTrash(): Promise<Guest[]> {
    return await FirestoreService.getTrash();
  }

  // Permanently delete guests that have been in trash for more than 30 days
  static async cleanupExpiredTrash(): Promise<number> {
    return await FirestoreService.cleanupExpiredTrash();
  }

  // Restore a guest from trash
  static async restoreFromTrash(id: string): Promise<boolean> {
    return await FirestoreService.restoreFromTrash(id);
  }

  // Permanently remove a guest from the system
  static async permanentDelete(id: string): Promise<boolean> {
    return await FirestoreService.permanentDelete(id);
  }

  // Restore a guest from trash (alias)
  static async restoreGuest(id: string): Promise<boolean> {
    return await FirestoreService.restoreFromTrash(id);
  }

  // Get all deleted guests
  static async getDeletedGuests(): Promise<Guest[]> {
    return await FirestoreService.getTrash();
  }

  // Tag management
  static async getAllTags(): Promise<string[]> {
    return await FirestoreService.getAllTags();
  }

  // Add a tag to a guest
  static async addTagToGuest(guestId: string, tag: string): Promise<boolean> {
    return await FirestoreService.addTagToGuest(guestId, tag);
  }

  // Remove a tag from a guest
  static async removeTagFromGuest(guestId: string, tag: string): Promise<boolean> {
    return await FirestoreService.removeTagFromGuest(guestId, tag);
  }

  // Add feedback to a guest
  static async addFeedback(id: string, rating: number, feedback: string): Promise<Guest | null> {
    return await FirestoreService.addFeedback(id, rating, feedback);
  }

  // Get statistics
  static async getStats(): Promise<GuestStats> {
    return await FirestoreService.getStats();
  }

  // Check out a guest
  static async checkOutGuest(id: string): Promise<Guest | null> {
    return await FirestoreService.checkOutGuest(id);
  }

  // Real-time listener for guests
  static onGuestsChange(callback: (guests: Guest[]) => void, includeDeleted: boolean = false): () => void {
    return FirestoreService.onGuestsChange(callback, includeDeleted);
  }
}

export type { Guest };
export type { GuestStats };