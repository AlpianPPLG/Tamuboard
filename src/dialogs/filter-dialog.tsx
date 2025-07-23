"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { FilterOptions } from '@/types/guest';
import { useLanguage } from '@/contexts/language-context';
import { CalendarIcon, RotateCcw } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface FilterDialogProps {
  children: React.ReactNode;
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
}

export function FilterDialog({ children, filters, onFiltersChange }: FilterDialogProps) {
  const [open, setOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters);
  const { t } = useLanguage();

  const handleApply = () => {
    onFiltersChange(localFilters);
    setOpen(false);
  };

  const handleReset = () => {
    const resetFilters: FilterOptions = {
      search: '',
      dateFrom: undefined,
      dateTo: undefined,
      status: 'all',
      category: 'all',
      sortBy: 'date',
      sortOrder: 'desc',
    };
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-[95vw] max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle>Filter & Urutkan</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 sm:space-y-4">
          {/* Date Range */}
          <div className="space-y-2">
            <Label>Rentang Tanggal</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="justify-start text-left font-normal h-9 text-sm"
                  >
                    <CalendarIcon className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    {localFilters.dateFrom
                      ? format(localFilters.dateFrom, 'dd MMM yyyy', { locale: id })
                      : 'Dari'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={localFilters.dateFrom}
                    onSelect={(date?: Date) =>
                      setLocalFilters((prev) => ({ ...prev, dateFrom: date }))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="justify-start text-left font-normal h-9 text-sm"
                  >
                    <CalendarIcon className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    {localFilters.dateTo
                      ? format(localFilters.dateTo, 'dd MMM yyyy', { locale: id })
                      : 'Sampai'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={localFilters.dateTo}
                    onSelect={(date?: Date) =>
                      setLocalFilters((prev) => ({ ...prev, dateTo: date }))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Status Filter */}
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={localFilters.status}
              onValueChange={(value: string) => {
                if (value === 'all' || value === 'checked-in' || value === 'checked-out') {
                  setLocalFilters((prev) => ({ ...prev, status: value }));
                }
              }}
            >
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="checked-in">{t.checkedIn}</SelectItem>
                <SelectItem value="checked-out">{t.checkedOut}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <Label>{t.category}</Label>
            <Select
              value={localFilters.category}
              onValueChange={(value: string) => {
                if (value === 'all' || value === 'VIP' || value === 'regular' || value === 'supplier' || value === 'intern') {
                  setLocalFilters((prev) => ({ ...prev, category: value }));
                }
              }}
            >
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                <SelectItem value="regular">{t.regular}</SelectItem>
                <SelectItem value="VIP">{t.vip}</SelectItem>
                <SelectItem value="supplier">{t.supplier}</SelectItem>
                <SelectItem value="intern">{t.intern}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Sort Options */}
          <div className="space-y-2">
            <Label>Urutkan Berdasarkan</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Select
                value={localFilters.sortBy}
                onValueChange={(value: string) => {
                  if (value === 'date' || value === 'name' || value === 'institution') {
                    setLocalFilters((prev) => ({ ...prev, sortBy: value }));
                  }
                }}
              >
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Tanggal</SelectItem>
                  <SelectItem value="name">Nama</SelectItem>
                  <SelectItem value="institution">Instansi</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={localFilters.sortOrder}
                onValueChange={(value: string) => {
                  if (value === 'asc' || value === 'desc') {
                    setLocalFilters((prev) => ({ ...prev, sortOrder: value }));
                  }
                }}
              >
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Terbaru</SelectItem>
                  <SelectItem value="asc">Terlama</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 flex-col sm:flex-row">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            Reset
          </Button>
          <Button onClick={handleApply}>Terapkan Filter</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}