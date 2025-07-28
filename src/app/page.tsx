"use client"

import { useState, useEffect, useRef } from 'react';
import { Header } from '@/layout/header';
import { GuestList } from '@/guest/guest-list';
import { GuestStorage } from '@/lib/guest-stotrage';
import { filterGuests } from '@/lib/guest-utils';
import { Guest, FilterOptions } from '@/types/guest';
import { LanguageProvider } from '@/contexts/language-context';
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcut';
import { toast } from 'sonner';

function HomePage() {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [filteredGuests, setFilteredGuests] = useState<Guest[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    dateFrom: undefined,
    dateTo: undefined,
    status: 'all',
    category: 'all',
    sortBy: 'date',
    sortOrder: 'desc',
  });

  // Load guests from storage
  const loadGuests = () => {
    const loadedGuests = GuestStorage.getGuests();
    setGuests(loadedGuests);
  };

  // Apply filters and search
  useEffect(() => {
    const currentFilters = { ...filters, search: searchValue };
    const filtered = filterGuests(guests, currentFilters);
    setFilteredGuests(filtered);
  }, [guests, searchValue, filters]);

  // Load guests on mount
  useEffect(() => {
    loadGuests();
  }, []);

  // Set up keyboard shortcuts
  const { showShortcuts } = useKeyboardShortcuts({
    'ctrl+f': {
      handler: (e: KeyboardEvent) => {
        e.preventDefault();
        searchInputRef.current?.focus();
      },
      description: 'Fokus ke kolom pencarian',
      preventDefault: true
    },
    'ctrl+n': {
      handler: () => {
        // This would open the add guest form
        // You'll need to implement this based on your UI
        toast.info('Membuka form tambah tamu baru');
        // Example: router.push('/add-guest');
      },
      description: 'Tambah tamu baru'
    },
    'ctrl+?': {
      handler: (e: KeyboardEvent, showShortcutsFn?: () => void) => {
        e.preventDefault();
        if (showShortcutsFn) {
          showShortcutsFn();
        }
      },
      description: 'Tampilkan semua pintasan keyboard',
      preventDefault: true
    }
  });

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const handleGuestUpdate = () => {
    loadGuests();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pb-16">
      <Header
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onGuestAdded={handleGuestUpdate}
      />
      
      <main className="flex-1 w-full px-2 sm:px-4 py-3 sm:py-6 overflow-hidden mb-4">
        <div className="space-y-3 sm:space-y-6 h-full">
          {/* Summary */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 sm:gap-4">
            <div>
              <h2 className="text-lg sm:text-2xl font-bold">Daftar Tamu</h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {filteredGuests.length} dari {guests.length} tamu
              </p>
            </div>
          </div>

          {/* Guest List */}
          <div className="flex-1 overflow-hidden">
            <GuestList 
              guests={filteredGuests} 
              onGuestUpdate={handleGuestUpdate}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <LanguageProvider>
      <HomePage />
    </LanguageProvider>
  );
}