"use client"

import React from 'react';
import { Guest, ReminderSettings } from '@/types/guest';
import { GuestStorage } from '@/lib/guest-stotrage';
import { toast } from 'sonner';
import { CheckCircle, Clock, Bell } from 'lucide-react';

class ReminderService {
  private static instance: ReminderService;
  private reminders: Map<string, NodeJS.Timeout> = new Map();
  private settings: ReminderSettings = {
    enabled: false,
    reminderTime: 'afternoon',
    reminderIntervals: [15, 30, 45, 60],
    autoCheckoutAfter: 480,
    notificationMethods: ['system'],
  };

  static getInstance(): ReminderService {
    if (!ReminderService.instance) {
      ReminderService.instance = new ReminderService();
    }
    return ReminderService.instance;
  }

  private constructor() {
  if (typeof window === 'undefined') return;
    const savedSettings = localStorage.getItem('reminderSettings');
    if (savedSettings) {
      try {
        this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
      } catch (error) {
        console.error('Error loading reminder settings:', error);
      }
    }
    this.initializeExistingReminders();
  }

  private initializeExistingReminders(): void {
    if (!this.settings.enabled) return;
    const guests = GuestStorage.getGuests();
    const checkedInGuests = guests.filter((g) => g.status === 'checked-in');
    checkedInGuests.forEach((g) => this.scheduleReminder(g));
  }

  public getSettings(): ReminderSettings {
    return { ...this.settings };
  }

  public setSettings(settings: ReminderSettings): void {
    this.settings = { ...this.settings, ...settings };
    if (typeof window !== 'undefined') {
      localStorage.setItem('reminderSettings', JSON.stringify(this.settings));
    }
  }

  public updateSettings(settings: ReminderSettings): void {
    this.setSettings(settings);
    this.clearAllReminders();
    if (settings.enabled) this.startReminders();
  }

  public startReminders(): void {
    this.clearAllReminders();
    if (!this.settings.enabled) return;
    const guests = GuestStorage.getGuests();
    guests.forEach((g) => {
      if (g.status === 'checked-in' && g.autoCheckoutReminder?.enabled) {
        this.scheduleReminder(g);
      }
    });
  }

  private scheduleReminder(guest: Guest): void {
    if (!this.settings.enabled || !guest.autoCheckoutReminder?.enabled) return;

    const now = new Date();
    const checkInTime = new Date(guest.visitDate);
    const [h, m] = guest.checkInTime.split(':').map(Number);
    checkInTime.setHours(h, m, 0, 0);

    const expectedDuration =
      guest.expectedDuration?.duration ?? this.settings.autoCheckoutAfter;
    const unit = guest.expectedDuration?.unit ?? 'minutes';
    const durationMinutes = unit === 'hours' ? expectedDuration * 60 : expectedDuration;
    const expectedCheckout = new Date(checkInTime.getTime() + durationMinutes * 60_000);

    this.clearGuestReminders(guest.id);

    this.settings.reminderIntervals.forEach((min) => {
      const reminderTime = new Date(expectedCheckout.getTime() - min * 60_000);
      if (reminderTime > now) {
        const id = setTimeout(() => this.sendReminderNotification(guest, min), reminderTime.getTime() - now.getTime());
        this.reminders.set(`${guest.id}-reminder-${min}`, id);
      }
    });

    if (expectedCheckout > now) {
      const id = setTimeout(() => this.performAutoCheckout(guest), expectedCheckout.getTime() - now.getTime());
      this.reminders.set(`${guest.id}-auto-checkout`, id);
    }
  }

  private sendReminderNotification(guest: Guest, minutesLeft: number): void {
    const methods = this.settings.notificationMethods;

    if (methods.includes('system')) this.showSystemNotification(guest, minutesLeft);
    if (methods.includes('email')) this.showEmailNotification(guest, minutesLeft);
    if (methods.includes('sms')) this.showSmsNotification(guest, minutesLeft);

    GuestStorage.updateGuest(guest.id, { reminderSentAt: new Date() });

    window.dispatchEvent(
      new CustomEvent('reminderSent', { detail: { guest, minutesLeft } })
    );
  }

  private showSystemNotification(guest: Guest, minutesLeft: number): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Guest Checkout Reminder', {
        body: `${guest.name} has ${minutesLeft} minutes left before checkout`,
        icon: '/favicon.ico',
        tag: `reminder-${guest.id}`,
        requireInteraction: true,
      });
    }

    toast(`Reminder: ${guest.name} checkout soon`, {
      duration: 10000,
      description: `${minutesLeft} minutes left before auto-checkout`,
      icon: React.createElement(Clock, { className: 'w-4 h-4' }),
      action: { label: 'Check Out Now', onClick: () => this.performCheckout(guest) },
    });
  }

  private showEmailNotification(guest: Guest, minutesLeft: number): void {
    console.log(`Email reminder sent to ${guest.email}: ${minutesLeft} minutes left`);
    toast(`Email reminder sent to ${guest.name}`, {
      duration: 3000,
      description: `Reminder email sent to ${guest.email}`,
      icon: React.createElement(Bell, { className: 'w-4 h-4' }),
    });
  }

  private showSmsNotification(guest: Guest, minutesLeft: number): void {
    console.log(`SMS reminder sent to ${guest.phone}: ${minutesLeft} minutes left`);
    toast(`SMS reminder sent to ${guest.name}`, {
      duration: 3000,
      description: `Reminder SMS sent to ${guest.phone}`,
      icon: React.createElement(Bell, { className: 'w-4 h-4' }),
    });
  }

  private performAutoCheckout(guest: Guest): void {
    const now = new Date();
    GuestStorage.updateGuest(guest.id, {
      status: 'checked-out',
      checkOutTime: `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`,
      notes: `${guest.notes || ''}\n[Auto-checkout performed due to time limit]`.trim(),
    });
    this.clearGuestReminders(guest.id);

    toast(`Auto-checkout: ${guest.name}`, {
      duration: 8000,
      description: 'Guest has been automatically checked out due to time limit',
      icon: React.createElement(CheckCircle, { className: 'w-4 h-4' }),
    });

    window.dispatchEvent(new CustomEvent('autoCheckout', { detail: { guest } }));
  }

  public performCheckout(guest: Guest): void {
    const now = new Date();
    GuestStorage.updateGuest(guest.id, {
      status: 'checked-out',
      checkOutTime: `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`,
    });
    this.clearGuestReminders(guest.id);

    toast(`Guest ${guest.name} has been checked out`, {
      duration: 5000,
      description: `Checked out at ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`,
      icon: React.createElement(CheckCircle, { className: 'w-4 h-4' }),
    });

    window.dispatchEvent(new CustomEvent('guestCheckout', { detail: { guest } }));
  }

  private clearGuestReminders(guestId: string): void {
    const keys = [...this.reminders.keys()].filter((k) => k.startsWith(guestId));
    keys.forEach((k) => {
      clearTimeout(this.reminders.get(k)!);
      this.reminders.delete(k);
    });
  }

  private clearAllReminders(): void {
    this.reminders.forEach(clearTimeout);
    this.reminders.clear();
  }

  public stopReminders(): void {
    this.clearAllReminders();
  }

  public getRemainingTime(guest: Guest): number | null {
    if (guest.status !== 'checked-in') return null;

    const now = new Date();
    const checkIn = new Date(guest.visitDate);
    const [h, m] = guest.checkInTime.split(':').map(Number);
    checkIn.setHours(h, m, 0, 0);

    const duration =
      guest.expectedDuration?.duration ?? this.settings.autoCheckoutAfter;
    const unit = guest.expectedDuration?.unit ?? 'minutes';
    const minutes = unit === 'hours' ? duration * 60 : duration;

    const checkout = new Date(checkIn.getTime() + minutes * 60_000);
    const remaining = checkout.getTime() - now.getTime();
    return remaining > 0 ? Math.floor(remaining / 60_000) : 0;
  }

  public isGuestAboutToExpire(guest: Guest, warningMinutes = 30): boolean {
    const remaining = this.getRemainingTime(guest);
    return remaining !== null && remaining <= warningMinutes && remaining > 0;
  }

  public getExpectedCheckoutTime(guest: Guest): Date | null {
    if (guest.status !== 'checked-in') return null;
    const checkIn = new Date(guest.visitDate);
    const [h, m] = guest.checkInTime.split(':').map(Number);
    checkIn.setHours(h, m, 0, 0);

    const duration =
      guest.expectedDuration?.duration ?? this.settings.autoCheckoutAfter;
    const unit = guest.expectedDuration?.unit ?? 'minutes';
    const minutes = unit === 'hours' ? duration * 60 : duration;
    return new Date(checkIn.getTime() + minutes * 60_000);
  }

  public async requestNotificationPermission(): Promise<boolean> {
    if (typeof window === 'undefined') return false;
    if (!('Notification' in window)) return false;

    if (Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return Notification.permission === 'granted';
  }

  public addGuestReminder(guest: Guest): void {
    if (guest.autoCheckoutReminder?.enabled && this.settings.enabled) {
      this.scheduleReminder(guest);
    }
  }

  public removeGuestReminder(guestId: string): void {
    this.clearGuestReminders(guestId);
  }
}

export const reminderService = ReminderService.getInstance();