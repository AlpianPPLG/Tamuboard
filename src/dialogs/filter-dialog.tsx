"use client"

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
      sortBy: 'date',
      sortOrder: 'desc',
    };
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Filter & Urutkan</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Date Range */}
          <div className="space-y-2">
            <Label>Rentang Tanggal</Label>
            <div className="grid grid-cols-2 gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {localFilters.dateFrom ? (
                      format(localFilters.dateFrom, "dd MMM yyyy", { locale: id })
                    ) : (
                      "Dari"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={localFilters.dateFrom}
                    onSelect={(date) => setLocalFilters(prev => ({ ...prev, dateFrom: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {localFilters.dateTo ? (
                      format(localFilters.dateTo, "dd MMM yyyy", { locale: id })
                    ) : (
                      "Sampai"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={localFilters.dateTo}
                    onSelect={(date) => setLocalFilters(prev => ({ ...prev, dateTo: date }))}
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
              onValueChange={(value: any) => setLocalFilters(prev => ({ ...prev, status: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="checked-in">Check In</SelectItem>
                <SelectItem value="checked-out">Check Out</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort Options */}
          <div className="space-y-2">
            <Label>Urutkan Berdasarkan</Label>
            <div className="grid grid-cols-2 gap-2">
              <Select
                value={localFilters.sortBy}
                onValueChange={(value: any) => setLocalFilters(prev => ({ ...prev, sortBy: value }))}
              >
                <SelectTrigger>
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
                onValueChange={(value: any) => setLocalFilters(prev => ({ ...prev, sortOrder: value }))}
              >
                <SelectTrigger>
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

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button onClick={handleApply}>
            Terapkan Filter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}