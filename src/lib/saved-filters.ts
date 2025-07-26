import { v4 as uuidv4 } from 'uuid';
import type { SavedFilter } from '@/types/saved-filter';

export type { SavedFilter };

const STORAGE_KEY = 'savedFilters';

export class SavedFiltersService {
  static getSavedFilters(): SavedFilter[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return [];
      
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) return [];
      
      return parsed.map(filter => ({
        ...filter,
        filters: {
          ...filter.filters,
          dateFrom: filter.filters.dateFrom ? new Date(filter.filters.dateFrom) : undefined,
          dateTo: filter.filters.dateTo ? new Date(filter.filters.dateTo) : undefined,
        },
        createdAt: new Date(filter.createdAt),
        updatedAt: new Date(filter.updatedAt)
      }));
    } catch (error) {
      console.error('Error loading saved filters:', error);
      return [];
    }
  }

  static saveFilter(filter: Omit<SavedFilter, 'id' | 'createdAt' | 'updatedAt'>): SavedFilter {
    const filters = this.getSavedFilters();
    const now = new Date();
    const newFilter: SavedFilter = {
      ...filter,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
    };

    // If this is set as default, remove default from others
    if (filter.isDefault) {
      filters.forEach(f => {
        if (f.isDefault) f.isDefault = false;
      });
    }

    filters.push(newFilter);
    this.saveAllFilters(filters);
    return newFilter;
  }

  static updateFilter(id: string, updates: Partial<SavedFilter>): SavedFilter | null {
    const filters = this.getSavedFilters();
    const index = filters.findIndex(f => f.id === id);
    
    if (index === -1) return null;

    const updatedFilter = {
      ...filters[index],
      ...updates,
      updatedAt: new Date(),
    };

    // If this is set as default, remove default from others
    if (updates.isDefault) {
      filters.forEach(f => {
        if (f.id !== id && f.isDefault) f.isDefault = false;
      });
    }

    filters[index] = updatedFilter;
    this.saveAllFilters(filters);
    return updatedFilter;
  }

  static deleteFilter(id: string): boolean {
    const filters = this.getSavedFilters();
    const newFilters = filters.filter(f => f.id !== id);
    
    if (newFilters.length === filters.length) return false;
    
    this.saveAllFilters(newFilters);
    return true;
  }

  static getDefaultFilter(): SavedFilter | null {
    const filters = this.getSavedFilters();
    return filters.find(f => f.isDefault) || null;
  }

  private static saveAllFilters(filters: SavedFilter[]): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
    } catch (error) {
      console.error('Error saving filters:', error);
    }
  }
}
