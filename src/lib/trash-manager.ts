"use client";

import { GuestStorage } from '@/lib/guest-storage'; // ✅ Perbaikan typo: 'guest-stotrage' → 'guest-storage'

export class TrashManager {
  private static readonly CLEANUP_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours
  private static cleanupTimer: NodeJS.Timeout | null = null;
  private static callbacks: Array<() => void> = [];

  // ✅ Typing eksplisit untuk return type
  static initialize(): void {
    if (typeof window === 'undefined') return;

    // ✅ Hindari multiple initializations
    if (this.cleanupTimer !== null) return;

    this.runCleanup();
    this.cleanupTimer = setInterval(() => {
      this.runCleanup();
    }, this.CLEANUP_INTERVAL);

    // ✅ Gunakan passive listener untuk performa
    window.addEventListener('beforeunload', () => {
      this.cleanup();
    }, { passive: true });
  }

  static cleanup(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
  }

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

  static onChange(callback: () => void): () => void {
    this.callbacks.push(callback);
    return () => {
      this.callbacks = this.callbacks.filter(cb => cb !== callback);
    };
  }

  private static notifyChange(): void {
    // ✅ Validasi callbacks sebelum eksekusi
    this.callbacks.forEach((callback, index) => {
      try {
        callback();
      } catch (err) {
        console.error(`Callback ${index} failed:`, err);
        // Opsional: Hapus callback yang gagal
        // this.callbacks.splice(index, 1);
      }
    });
  }

  static getDaysRemaining(deletedAt: Date): number {
    const now = new Date();
    const deletionDate = new Date(deletedAt);
    
    // ✅ Validasi input tanggal
    if (isNaN(deletionDate.getTime())) {
      console.warn('Invalid date provided to getDaysRemaining');
      return 0;
    }

    const thirtyDaysLater = new Date(deletionDate);
    thirtyDaysLater.setDate(deletionDate.getDate() + 30);

    const diffTime = thirtyDaysLater.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return Math.max(0, diffDays);
  }

  // ✅ Tambahkan return type
  static async getTrash(): Promise<unknown[]> { // Ganti `unknown` dengan tipe data Anda
    return await GuestStorage.getTrash();
  }

  static async moveToTrash(
    id: string, 
    deletedBy: string = 'system'
  ): Promise<boolean> {
    if (!id) {
      console.warn('moveToTrash called with empty id');
      return false;
    }

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

  static async restoreFromTrash(id: string): Promise<boolean> {
    if (!id) {
      console.warn('restoreFromTrash called with empty id');
      return false;
    }

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

  // ✅ Tambahkan method untuk cleanup manual
  static destroy(): void {
    this.cleanup();
    this.callbacks = [];
  }
}

// ✅ Inisialisasi yang lebih aman
if (typeof window !== 'undefined') {
  // Pastikan hanya dijalankan sekali
  if (!window.__TRASH_MANAGER_INITIALIZED__) {
    TrashManager.initialize();
    window.__TRASH_MANAGER_INITIALIZED__ = true;
  }
}

declare global {
  interface Window {
    __TRASH_MANAGER_INITIALIZED__?: boolean;
  }
}

export default TrashManager;
