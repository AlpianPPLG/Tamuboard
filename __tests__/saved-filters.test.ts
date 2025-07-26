import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { SavedFiltersService } from '@/lib/saved-filters';
import type { FilterOptions } from '@/types/guest';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('SavedFiltersService', () => {
  const sampleFilter: FilterOptions = {
    search: 'test',
    status: 'checked-in',
    category: 'VIP',
    sortBy: 'date',
    sortOrder: 'desc'
  };

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should save and retrieve a filter', () => {
    // Save a filter
    const savedFilter = SavedFiltersService.saveFilter({
      name: 'Test Filter',
      filters: sampleFilter,
      isDefault: false
    });

    // Retrieve all filters
    const filters = SavedFiltersService.getSavedFilters();
    
    expect(filters).toHaveLength(1);
    expect(filters[0].name).toBe('Test Filter');
    expect(filters[0].filters).toEqual(sampleFilter);
    expect(filters[0].isDefault).toBe(false);
    expect(filters[0].id).toBeDefined();
    expect(filters[0].createdAt).toBeInstanceOf(Date);
    expect(filters[0].updatedAt).toBeInstanceOf(Date);
  });

  it('should update a filter', () => {
    // Save a filter
    const savedFilter = SavedFiltersService.saveFilter({
      name: 'Test Filter',
      filters: sampleFilter,
      isDefault: false
    });

    // Update the filter
    const updatedFilter = SavedFiltersService.updateFilter(savedFilter.id, {
      name: 'Updated Filter',
      isDefault: true
    });

    expect(updatedFilter).not.toBeNull();
    expect(updatedFilter?.name).toBe('Updated Filter');
    expect(updatedFilter?.isDefault).toBe(true);
    
    // Verify the update is reflected in the stored filters
    const filters = SavedFiltersService.getSavedFilters();
    expect(filters[0].name).toBe('Updated Filter');
    expect(filters[0].isDefault).toBe(true);
  });

  it('should delete a filter', () => {
    // Save a filter
    const savedFilter = SavedFiltersService.saveFilter({
      name: 'Test Filter',
      filters: sampleFilter,
      isDefault: false
    });

    // Delete the filter
    const result = SavedFiltersService.deleteFilter(savedFilter.id);
    expect(result).toBe(true);
    
    // Verify the filter is deleted
    const filters = SavedFiltersService.getSavedFilters();
    expect(filters).toHaveLength(0);
  });

  it('should handle setting default filter', () => {
    // Save two filters
    const firstFilter = SavedFiltersService.saveFilter({
      name: 'First Filter',
      filters: sampleFilter,
      isDefault: true
    });

    const secondFilter = SavedFiltersService.saveFilter({
      name: 'Second Filter',
      filters: sampleFilter,
      isDefault: false
    });

    // Set second filter as default
    const updatedFilter = SavedFiltersService.updateFilter(secondFilter.id, {
      isDefault: true
    });

    // Verify only one filter is default
    const filters = SavedFiltersService.getSavedFilters();
    const defaultFilters = filters.filter(f => f.isDefault);
    
    expect(defaultFilters).toHaveLength(1);
    expect(defaultFilters[0].id).toBe(secondFilter.id);
  });

  it('should get default filter', () => {
    // Save a default filter
    const defaultFilter = SavedFiltersService.saveFilter({
      name: 'Default Filter',
      filters: sampleFilter,
      isDefault: true
    });

    // Save a non-default filter
    SavedFiltersService.saveFilter({
      name: 'Regular Filter',
      filters: sampleFilter,
      isDefault: false
    });

    // Get default filter
    const result = SavedFiltersService.getDefaultFilter();
    
    expect(result).not.toBeNull();
    expect(result?.id).toBe(defaultFilter.id);
  });
});
