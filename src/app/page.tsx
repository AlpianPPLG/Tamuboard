"use client"

import { useState, useEffect } from 'react';
import { Header } from '@/layout/header';
import { GuestList } from '@/guest/guest-list';
import { GuestStorage } from '@/lib/guest-stotrage';
import { filterGuests } from '@/lib/guest-utils';
import { Guest, FilterOptions } from '@/types/guest';

export default function Home() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [filteredGuests, setFilteredGuests] = useState<Guest[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    dateFrom: undefined,
    dateTo: undefined,
    status: 'all',
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

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const handleGuestUpdate = () => {
    loadGuests();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onGuestAdded={handleGuestUpdate}
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Summary */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Daftar Tamu</h2>
              <p className="text-muted-foreground">
                {filteredGuests.length} dari {guests.length} tamu
              </p>
            </div>
          </div>

          {/* Guest List */}
          <GuestList 
            guests={filteredGuests} 
            onGuestUpdate={handleGuestUpdate}
          />
        </div>
      </main>
    </div>
  );
}