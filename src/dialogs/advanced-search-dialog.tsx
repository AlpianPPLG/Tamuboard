"use client"

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, X, Search } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { FilterOptions } from '@/types/guest';

interface AdvancedSearchDialogProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  availableTags: string[];
}

export function AdvancedSearchDialog({ 
  filters, 
  onFiltersChange,
  availableTags 
}: AdvancedSearchDialogProps) {
  const [open, setOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters);
  const [selectedTags, setSelectedTags] = useState<string[]>(filters.tags || []);

  // Sync local filters when props change
  useEffect(() => {
    setLocalFilters(filters);
    setSelectedTags(filters.tags || []);
  }, [filters]);

  const handleApply = () => {
    onFiltersChange({
      ...localFilters,
      tags: selectedTags
    });
    setOpen(false);
  };

  const handleReset = () => {
    const newFilters: FilterOptions = {
      search: '',
      dateFrom: undefined,
      dateTo: undefined,
      status: 'all',
      category: 'all',
      sortBy: 'date',
      sortOrder: 'desc',
      tags: []
    };
    setLocalFilters(newFilters);
    setSelectedTags([]);
    onFiltersChange(newFilters);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const hasActiveFilters = 
    localFilters.search ||
    localFilters.dateFrom ||
    localFilters.dateTo ||
    localFilters.status !== 'all' ||
    localFilters.category !== 'all' ||
    selectedTags.length > 0;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant={hasActiveFilters ? "secondary" : "outline"} 
          size="sm" 
          className="h-8 w-8 sm:h-9 sm:w-auto px-2 sm:px-3 relative"
        >
          <Search className="h-3.5 w-3.5 sm:mr-1.5" />
          <span className="hidden sm:inline">Cari Lanjutan</span>
          {hasActiveFilters && (
            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-primary"></span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] sm:w-[400px] p-4 space-y-4">
        <div className="space-y-3">
          <div>
            <Label htmlFor="search">Kata Kunci</Label>
            <Input
              id="search"
              placeholder="Cari nama, institusi, dll..."
              value={localFilters.search}
              onChange={(e) => 
                setLocalFilters({...localFilters, search: e.target.value})
              }
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Dari Tanggal</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full mt-1 justify-start text-left font-normal",
                      !localFilters.dateFrom && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {localFilters.dateFrom ? (
                      format(new Date(localFilters.dateFrom), "PPP")
                    ) : (
                      <span>Pilih tanggal</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={localFilters.dateFrom ? new Date(localFilters.dateFrom) : undefined}
                    onSelect={(date) => 
                      setLocalFilters({...localFilters, dateFrom: date?.toISOString()})
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label>Sampai Tanggal</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full mt-1 justify-start text-left font-normal",
                      !localFilters.dateTo && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {localFilters.dateTo ? (
                      format(new Date(localFilters.dateTo), "PPP")
                    ) : (
                      <span>Pilih tanggal</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={localFilters.dateTo ? new Date(localFilters.dateTo) : undefined}
                    onSelect={(date) => 
                      setLocalFilters({...localFilters, dateTo: date?.toISOString()})
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={localFilters.status}
                onChange={(e) => 
                  setLocalFilters({...localFilters, status: e.target.value as never})
                }
              >
                <option value="all">Semua Status</option>
                <option value="checked-in">Sedang Berkunjung</option>
                <option value="checked-out">Sudah Check Out</option>
              </select>
            </div>

            <div>
              <Label htmlFor="category">Kategori</Label>
              <select
                id="category"
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={localFilters.category}
                onChange={(e) => 
                  setLocalFilters({...localFilters, category: e.target.value as never})
                }
              >
                <option value="all">Semua Kategori</option>
                <option value="VIP">VIP</option>
                <option value="regular">Reguler</option>
                <option value="supplier">Supplier</option>
                <option value="intern">Magang</option>
              </select>
            </div>
          </div>

          {availableTags.length > 0 && (
            <div>
              <Label>Tag</Label>
              <div className="mt-1 flex flex-wrap gap-2">
                {availableTags.map((tag) => (
                  <Button
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between pt-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleReset}
            disabled={!hasActiveFilters}
          >
            <X className="h-4 w-4 mr-1" />
            Reset
          </Button>
          <Button size="sm" onClick={handleApply}>
            Terapkan Filter
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
