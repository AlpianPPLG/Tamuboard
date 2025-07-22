import { Guest, FilterOptions } from '@/types/guest';

export function filterGuests(guests: Guest[], filters: FilterOptions): Guest[] {
  let filtered = [...guests];

  // Search filter
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(guest =>
      guest.name.toLowerCase().includes(searchLower) ||
      guest.institution.toLowerCase().includes(searchLower) ||
      guest.purpose.toLowerCase().includes(searchLower)
    );
  }

  // Date range filter
  if (filters.dateFrom) {
    const fromDate = new Date(filters.dateFrom);
    fromDate.setHours(0, 0, 0, 0);
    filtered = filtered.filter(guest => guest.visitDate >= fromDate);
  }

  if (filters.dateTo) {
    const toDate = new Date(filters.dateTo);
    toDate.setHours(23, 59, 59, 999);
    filtered = filtered.filter(guest => guest.visitDate <= toDate);
  }

  // Status filter
  if (filters.status && filters.status !== 'all') {
    filtered = filtered.filter(guest => guest.status === filters.status);
  }

  // Sort
  filtered.sort((a, b) => {
    let aValue: any, bValue: any;

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
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
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