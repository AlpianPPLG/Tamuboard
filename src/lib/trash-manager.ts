"use client";

export class TrashManager {
  private static readonly CLEANUP_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours
  private static cleanupTimer: NodeJS.Timeout | null = null;
  private static callbacks: Array<() => void> = [];
import { GuestStorage } from '@/lib/guest-stotrage';
  // Initialize the trash manager with automatic cleanup
  static initialize(): void {
    if (typeof window === 'undefined') return;
    // Run cleanup immediately on initialization
    this.runCleanup();
    // Set up periodic cleanup
    this.cleanupTimer = setInterval(() => {
      this.runCleanup();
    }, this.CLEANUP_INTERVAL);
    // Also run cleanup when the page is being unloaded
    window.addEventListener('beforeunload', () => {
      this.cleanup();
    });
  }
  // Clean up resources
  static cleanup(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
  }
  // Run the actual cleanup process
  private static async runCleanup(): Promise<void> {
    try {
      const deletedCount = await GuestStorage.cleanupExpiredTrash();
      
      if (deletedCount > 0) {
        console.log(`Permanently deleted ${deletedCount} expired trash items`);
        this.notifyChange();
      }
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  }
  // Register a callback to be notified when trash changes
  static onChange(callback: () => void): () => void {
    this.callbacks.push(callback);
    return () => {
      this.callbacks = this.callbacks.filter(cb => cb !== callback);
    };
  }
  // Notify all registered callbacks of a change
  static notifyChange(): void {
    this.callbacks.forEach(callback => callback());
  }
  // Calculate days remaining before permanent deletion
  static getDaysRemaining(deletedAt: Date): number {
    const now = new Date();
    const deletionDate = new Date(deletedAt);
    const thirtyDaysLater = new Date(deletionDate);
    thirtyDaysLater.setDate(deletionDate.getDate() + 30);
    
    const diffTime = thirtyDaysLater.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diffDays);
  }
  // Get all items in trash
  static async getTrash() {
    return await GuestStorage.getTrash();
  }
  // Move item to trash
  static async moveToTrash(id: string, deletedBy: string = 'system'): Promise<boolean> {
    try {
      const result = await GuestStorage.moveToTrash(id, deletedBy);
      if (result) {
        this.notifyChange();
      }
      return result;
    } catch (error) {
      console.error('Error moving to trash:', error);
      return false;
    }
  }
  // Restore item from trash
  static async restoreFromTrash(id: string): Promise<boolean> {
    try {
      const result = await GuestStorage.restoreFromTrash(id);
      if (result) {
        this.notifyChange();
      }
      return result;
    } catch (error) {
      console.error('Error restoring from trash:', error);
      return false;
    }
  }
}
// Initialize the trash manager when the module loads
if (typeof window !== 'undefined') {
  TrashManager.initialize();
}
export default TrashManager;