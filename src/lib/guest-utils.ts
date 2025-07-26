"use client"

import { Guest, FilterOptions } from '@/types/guest';

type SortableValue = string | number;

export function getVisitTime(): 'morning' | 'afternoon' | 'evening' {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}

export function getCategoryColor(category: Guest['category']): string {
  switch (category) {
    case 'VIP':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
    case 'supplier':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'intern':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
    case 'regular':
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  }
}

export function getCategoryText(category: Guest['category'], language: 'id' | 'en' = 'id'): string {
  const translations = {
    id: {
      VIP: 'VIP',
      regular: 'Biasa',
      supplier: 'Supplier',
      intern: 'Siswa PKL',
    },
    en: {
      VIP: 'VIP',
      regular: 'Regular',
      supplier: 'Supplier',
      intern: 'Intern',
    },
  };
  return translations[language][category];
}

export function getVisitTimeText(time: Guest['visitTime'], language: 'id' | 'en' = 'id'): string {
  const translations = {
    id: {
      morning: 'Pagi',
      afternoon: 'Siang',
      evening: 'Sore',
    },
    en: {
      morning: 'Morning',
      afternoon: 'Afternoon',
      evening: 'Evening',
    },
  };
  return translations[language][time];
}

export function filterGuests(guests: Guest[], filters: FilterOptions): Guest[] {
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
    let aValue: SortableValue;
    let bValue: SortableValue;

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

export function getGuestInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return 'Tanggal tidak valid';
  
  const dateObj = date instanceof Date ? date : new Date(date);
  
  // Check if the date is valid
  if (isNaN(dateObj.getTime())) {
    console.error('Invalid date provided to formatDate:', date);
    return 'Tanggal tidak valid';
  }
  
  return dateObj.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatTime(time: string): string {
  return time;
}

export function getStatusColor(status: Guest['status']): string {
  switch (status) {
    case 'checked-in':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'checked-out':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  }
}

export function getStatusText(status: Guest['status']): string {
  switch (status) {
    case 'checked-in':
      return 'Check In';
    case 'checked-out':
      return 'Check Out';
    default:
      return 'Unknown';
  }
}