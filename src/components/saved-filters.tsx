"use client"

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check, Filter, Plus, Trash2 } from 'lucide-react';
import { SavedFiltersService, type SavedFilter } from '@/lib/saved-filters';
import { FilterOptions } from '@/types/guest';
import { toast } from 'sonner';

interface SavedFiltersProps {
  currentFilters: FilterOptions;
  onSelectFilter: (filters: FilterOptions) => void;
}

export function SavedFilters({ currentFilters, onSelectFilter }: SavedFiltersProps) {
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [filterName, setFilterName] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  useEffect(() => {
    loadSavedFilters();
  }, []);

  const loadSavedFilters = () => {
    const filters = SavedFiltersService.getSavedFilters();
    setSavedFilters(filters);
  };

  const handleSaveFilter = () => {
    if (!filterName.trim()) {
      toast.error('Nama filter tidak boleh kosong');
      return;
    }

    const newFilter: Omit<SavedFilter, 'id' | 'createdAt' | 'updatedAt'> = {
      name: filterName.trim(),
      filters: { ...currentFilters },
      isDefault,
    };

    const savedFilter = SavedFiltersService.saveFilter(newFilter);
    setSavedFilters(prev => [...prev, savedFilter]);
    setFilterName('');
    setIsCreating(false);
    setIsDefault(false);
    
    toast.success(`Filter "${savedFilter.name}" berhasil disimpan`);
  };
  const handleDeleteFilter = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (window.confirm('Apakah Anda yakin ingin menghapus filter ini?')) {
      const success = SavedFiltersService.deleteFilter(id);
      if (success) {
        setSavedFilters(prev => prev.filter(f => f.id !== id));
        toast.success('Filter berhasil dihapus');
      } else {
        toast.error('Gagal menghapus filter');
      }
    }
  
  };
  const handleSetDefault = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const updatedFilter = SavedFiltersService.updateFilter(id, { isDefault: true });
    if (updatedFilter) {
      setSavedFilters(prev => 
        prev.map(f => ({
          ...f,
          isDefault: f.id === id ? true : false
        }))
      );
      toast.success('Filter default berhasil diatur');
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(date));
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 w-8 sm:h-9 sm:w-auto px-2 sm:px-3">
          <Filter className="h-3.5 w-3.5 sm:mr-1.5" />
          <span className="hidden sm:inline">Filter Tersimpan</span>
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-72 sm:w-80 p-0" align="end">
        <div className="p-4 border-b">
          <h4 className="font-medium text-sm">Filter Tersimpan</h4>
          <p className="text-xs text-muted-foreground mt-1">
            Kelola filter yang telah Anda simpan
          </p>
        </div>

        <div className="max-h-60 overflow-y-auto">
          {savedFilters.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Belum ada filter yang disimpan
            </div>
          ) : (
            <div className="divide-y">
              {savedFilters.map((filter) => (
                <div
                  key={filter.id}
                  className="p-3 hover:bg-accent cursor-pointer flex items-center justify-between group"
                  onClick={() => {
                    onSelectFilter(filter.filters);
                    setIsOpen(false);
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm truncate">
                        {filter.name}
                      </span>
                      {filter.isDefault && (
                        <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {Object.keys(filter.filters).length} filter • {formatDate(filter.updatedAt)}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
                    {!filter.isDefault && (
                      <button
                        className="p-1 rounded-full hover:bg-accent"
                        onClick={(e) => handleSetDefault(filter.id, e)}
                        title="Jadikan default"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </button>
                    )}
                    <button
                      className="p-1 rounded-full hover:bg-accent text-destructive"
                      onClick={(e) => handleDeleteFilter(filter.id, e)}
                      title="Hapus filter"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t p-3">
          {isCreating ? (
            <div className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="filterName" className="text-xs">
                  Nama Filter
                </Label>
                <Input
                  id="filterName"
                  value={filterName}
                  onChange={(e) => setFilterName(e.target.value)}
                  placeholder="Contoh: Tamu VIP Bulan Ini"
                  className="h-8 text-xs"
                  autoFocus
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="setAsDefault"
                  checked={isDefault}
                  onChange={(e) => setIsDefault(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label
                  htmlFor="setAsDefault"
                  className="text-xs text-muted-foreground cursor-pointer"
                >
                  Jadikan filter default
                </label>
              </div>
              
              <div className="flex justify-end gap-2 pt-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => {
                    setIsCreating(false);
                    setFilterName('');
                  }}
                >
                  Batal
                </Button>
                <Button
                  size="sm"
                  className="h-7 text-xs"
                  onClick={handleSaveFilter}
                >
                  Simpan
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="w-full h-8 text-xs"
              onClick={() => setIsCreating(true)}
            >
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              Simpan Filter Saat Ini
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
