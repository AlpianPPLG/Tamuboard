"use client";
import {
  createVisitor,
  updateVisitor,
  hardDeleteVisitor,
  getVisitors,
  getVisitorById,
} from "@/lib/firestore-service";
import { Guest, GuestStats } from "@/types/guest";
import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
  DocumentData,
} from "firebase/firestore";
import { db } from "./firebase";
import {
  mapGuestToVisitor,
  mapVisitorToGuest,
  toFirestoreDate,
} from "./mappers";

// Migration wrapper class that delegates to FirestoreService
export class GuestStorage {
  // Check if a guest with the same name and phone already exists
  static async checkDuplicateGuest(
    name: string,
    phone: string,
    excludeId?: string
  ): Promise<boolean> {
    try {
      const q = query(
        collection(db, "visitors"),
        where("fullName", "==", name),
        where("phone", "==", phone)
      );

      const querySnapshot = await getDocs(q);

      // If no documents found, no duplicate
      if (querySnapshot.empty) return false;

      // If excludeId is provided, check if the found document is the one being excluded
      if (excludeId) {
        return !querySnapshot.docs.every(
          (doc: DocumentData) => doc.id === excludeId
        );
      }

      return true;
    } catch (error) {
      console.error("Error checking for duplicate guest:", error);
      return false;
    }
  }

  // Get all active guests (not deleted by default)
  static async getGuests(includeDeleted: boolean = false): Promise<Guest[]> {
    try {
      const visitors = await getVisitors(includeDeleted);
      return visitors.map((visitor) => mapVisitorToGuest(visitor));
    } catch (error) {
      console.error("Error getting guests:", error);
      return [];
    }
  }

  // Add a new guest
  static async addGuest(
    guest: Omit<
      Guest,
      "id" | "visitDate" | "checkInTime" | "status" | "visitTime"
    >
  ): Promise<Guest> {
    try {
      // Create a complete guest object with required fields
      const newGuest: Guest = {
        ...guest,
        id: "", // Will be set by Firestore
        visitDate: new Date(),
        checkInTime: new Date().toISOString().split("T")[1].substring(0, 5),
        status: "checked-in",
        visitTime: "morning", // Default value
      };

      const visitor = mapGuestToVisitor(newGuest);
      const createdVisitor = await createVisitor(visitor);
      return mapVisitorToGuest(createdVisitor);
    } catch (error) {
      console.error("Error adding guest:", error);
      throw error;
    }
  }

  // Update an existing guest
  static async updateGuest(
    id: string,
    updates: Partial<Guest>
  ): Promise<Guest | null> {
    try {
      // First, get the current visitor data
      const currentVisitor = await getVisitorById(id);
      if (!currentVisitor) return null;

      // Map current visitor to guest
      const currentGuest = mapVisitorToGuest(currentVisitor);

      // Apply updates
      const updatedGuest = { ...currentGuest, ...updates };

      // Convert back to visitor and update
      const visitorUpdates = mapGuestToVisitor(updatedGuest);
      await updateVisitor(id, visitorUpdates);

      // Return the updated guest
      return updatedGuest;
    } catch (error) {
      console.error(`Error updating guest ${id}:`, error);
      throw error;
    }
  }

  // Move guest to trash instead of permanent deletion
  static async moveToTrash(
    id: string,
    deletedBy: string = "system"
  ): Promise<boolean> {
    try {
      await updateVisitor(id, {
        deletedAt: Timestamp.now(),
        deletedBy,
      });
      return true;
    } catch (error) {
      console.error(`Error moving guest ${id} to trash:`, error);
      return false;
    }
  }

  // Alias for backward compatibility
  static async deleteGuest(
    id: string,
    deletedBy: string = "system"
  ): Promise<boolean> {
    return await this.moveToTrash(id, deletedBy);
  }

  // Get all guests in trash
  static async getTrash(): Promise<Guest[]> {
    try {
      const deletedVisitors = await getVisitors(true);
      return deletedVisitors
        .filter((v) => v.deletedAt)
        .map((visitor) => mapVisitorToGuest(visitor));
    } catch (error) {
      console.error("Error getting trash:", error);
      return [];
    }
  }

  // Permanently delete guests that have been in trash for more than 30 days
  static async cleanupExpiredTrash(): Promise<number> {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const deletedVisitors = await getVisitors(true);
      const expiredVisitors = deletedVisitors.filter(
        (visitor) =>
          visitor.deletedAt &&
          toFirestoreDate(visitor.deletedAt) <= thirtyDaysAgo
      );

      await Promise.all(
        expiredVisitors.map((visitor) => hardDeleteVisitor(visitor.id!))
      );

      return expiredVisitors.length;
    } catch (error) {
      console.error("Error cleaning up expired trash:", error);
      return 0;
    }
  }

  // Restore a guest from trash
  static async restoreFromTrash(id: string): Promise<boolean> {
    try {
      await updateVisitor(id, {
        deletedAt: null,
        updatedAt: Timestamp.now(),
      });
      return true;
    } catch (error) {
      console.error(`Error restoring guest ${id}:`, error);
      return false;
    }
  }

  // Permanently remove a guest from the system
  static async permanentDelete(id: string): Promise<boolean> {
    try {
      await hardDeleteVisitor(id);
      return true;
    } catch (error) {
      console.error(`Error permanently deleting guest ${id}:`, error);
      return false;
    }
  }

  // Restore a guest from trash (alias)
  static async restoreGuest(id: string): Promise<boolean> {
    return await this.restoreFromTrash(id);
  }

  // Get all deleted guests
  static async getDeletedGuests(): Promise<Guest[]> {
    return await this.getTrash();
  }

  // Tag management
  static async getAllTags(): Promise<string[]> {
    try {
      const visitors = await getVisitors();
      const tags = new Set<string>();

      visitors.forEach((visitor) => {
        if (visitor.tags && Array.isArray(visitor.tags)) {
          visitor.tags.forEach((tag) => tags.add(tag));
        }
      });

      return Array.from(tags);
    } catch (error) {
      console.error("Error getting all tags:", error);
      return [];
    }
  }

  // Add a tag to a guest
  static async addTagToGuest(guestId: string, tag: string): Promise<boolean> {
    try {
      const visitor = await getVisitorById(guestId);
      if (!visitor) return false;

      const tags = new Set(visitor.tags || []);
      tags.add(tag);

      await updateVisitor(guestId, {
        tags: Array.from(tags),
        updatedAt: Timestamp.now(),
      });

      return true;
    } catch (error) {
      console.error(`Error adding tag to guest ${guestId}:`, error);
      return false;
    }
  }

  // Remove a tag from a guest
  static async removeTagFromGuest(
    guestId: string,
    tag: string
  ): Promise<boolean> {
    try {
      const visitor = await getVisitorById(guestId);
      if (!visitor || !visitor.tags) return false;

      const tags = visitor.tags.filter((t) => t !== tag);

      await updateVisitor(guestId, {
        tags,
        updatedAt: Timestamp.now(),
      });

      return true;
    } catch (error) {
      console.error(`Error removing tag from guest ${guestId}:`, error);
      return false;
    }
  }

  // Add feedback to a guest
  static async addFeedback(
    id: string,
    rating: number,
    feedback: string
  ): Promise<Guest | null> {
    try {
      await updateVisitor(id, {
        rating,
        feedback,
        updatedAt: Timestamp.now(),
      });

      const updatedVisitor = await getVisitorById(id);
      return updatedVisitor ? mapVisitorToGuest(updatedVisitor) : null;
    } catch (error) {
      console.error(`Error adding feedback to guest ${id}:`, error);
      return null;
    }
  }

  // Get statistics
  static async getStats(): Promise<GuestStats> {
    try {
      const [allVisitors, activeVisitors, deletedVisitors] = await Promise.all([
        getVisitors(true),
        getVisitors(false),
        getVisitors(true).then((visitors) =>
          visitors.filter((v) => v.deletedAt)
        ),
      ]);

      // Get visitors by category
      const categoryCounts = allVisitors.reduce((acc, visitor) => {
        const category = visitor.guestCategory || "regular";
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        totalToday: allVisitors.filter((v) => {
          const visitDate = toFirestoreDate(v.checkIn);
          return visitDate.toDateString() === new Date().toDateString();
        }).length,
        totalThisMonth: allVisitors.filter((v) => {
          const visitDate = toFirestoreDate(v.checkIn);
          return (
            visitDate.getMonth() === new Date().getMonth() &&
            visitDate.getFullYear() === new Date().getFullYear()
          );
        }).length,
        totalThisYear: allVisitors.filter((v) => {
          return (
            toFirestoreDate(v.checkIn).getFullYear() ===
            new Date().getFullYear()
          );
        }).length,
        currentlyCheckedIn: activeVisitors.filter((v) => !v.checkOutTime)
          .length,
        vipGuests: categoryCounts["vip"] || 0,
        scheduledToday: 0, // Not implemented in Visitor model
        deletedCount: deletedVisitors.length,
      };
    } catch (error) {
      console.error("Error getting stats:", error);
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

  // Check out a guest
  static async checkOutGuest(id: string): Promise<Guest | null> {
    try {
      await updateVisitor(id, {
        checkOutTime: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      const updatedVisitor = await getVisitorById(id);
      return updatedVisitor ? mapVisitorToGuest(updatedVisitor) : null;
    } catch (error) {
      console.error(`Error checking out guest ${id}:`, error);
      return null;
    }
  }

  // Real-time listener for guests
  static onGuestsChange(
    callback: (guests: Guest[]) => void,
    includeDeleted: boolean = false
  ): () => void {
    // For now, we'll implement a simple polling mechanism
    // In a real app, you would use Firestore's real-time updates
    let isActive = true;

    const checkForUpdates = async () => {
      if (!isActive) return;

      try {
        const guests = await this.getGuests(includeDeleted);
        callback(guests);
      } catch (error) {
        console.error("Error in onGuestsChange:", error);
      }

      // Poll every 30 seconds
      if (isActive) {
        setTimeout(checkForUpdates, 30000);
      }
    };

    // Initial fetch
    checkForUpdates();

    // Return cleanup function
    return () => {
      isActive = false;
    };
  }
  public static clearLocalStorage(): void {
    // kode untuk membersihkan localStorage
    localStorage.removeItem("buku-tamu-guests");
    localStorage.removeItem("savedFilters");
    localStorage.removeItem("reminderSettings");
  }
}

export type { Guest };
export type { GuestStats };
