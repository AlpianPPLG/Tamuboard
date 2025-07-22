"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { 
  Search, 
  Plus, 
  Filter,
  Calendar,
  Users,
  BarChart3
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { GuestForm } from '@/forms/guest-form';
import { FilterDialog } from '@/dialogs/filter-dialog';
import { StatsDialog } from '@/dialogs/stats-dialog';
import { FilterOptions } from '@/types/guest';

interface HeaderProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onGuestAdded: () => void;
}

export function Header({ 
  searchValue, 
  onSearchChange, 
  filters, 
  onFiltersChange,
  onGuestAdded 
}: HeaderProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);

  const handleGuestAdded = () => {
    setShowAddDialog(false);
    onGuestAdded();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Buku Tamu</h1>
              <p className="text-sm text-muted-foreground">Sistem Pencatatan Tamu Digital</p>
            </div>
          </div>

          {/* Search & Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari tamu..."
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-64 pl-9"
              />
            </div>

            {/* Filter */}
            <FilterDialog filters={filters} onFiltersChange={onFiltersChange}>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </FilterDialog>

            {/* Stats */}
            <StatsDialog>
              <Button variant="outline" size="icon">
                <BarChart3 className="h-4 w-4" />
              </Button>
            </StatsDialog>

            {/* Add Guest */}
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Tamu
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Tambah Tamu Baru</DialogTitle>
                </DialogHeader>
                <GuestForm onSuccess={handleGuestAdded} />
              </DialogContent>
            </Dialog>

            {/* Theme Toggle */}
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile Search */}
        <div className="mt-4 sm:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari tamu..."
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </div>
    </header>
  );
}