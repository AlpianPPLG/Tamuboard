"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Search, Plus, Filter, Users, BarChart3 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { GuestForm } from "@/forms/guest-form";
import { FilterDialog } from "@/dialogs/filter-dialog";
import { StatsDialog } from "@/dialogs/stats-dialog";
import { FilterOptions } from "@/types/guest";

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
  onGuestAdded,
}: HeaderProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);

  const handleGuestAdded = () => {
    setShowAddDialog(false);
    onGuestAdded();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground flex-shrink-0">
              <Users className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-bold truncate">
                Buku Tamu
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                Sistem Pencatatan Tamu Digital
              </p>
            </div>
          </div>

          {/* Search & Actions */}
          <div className="flex items-center gap-1 sm:gap-2 w-full sm:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:flex-initial sm:block">
              <Search className="absolute left-2 sm:left-3 top-1/2 h-3 w-3 sm:h-4 sm:w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari tamu..."
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full sm:w-48 md:w-64 pl-7 sm:pl-9 h-8 sm:h-9 text-sm"
              />
            </div>

            {/* Filter */}
            <FilterDialog filters={filters} onFiltersChange={onFiltersChange}>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 sm:h-9 sm:w-9 p-0"
              >
                <Filter className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </FilterDialog>

            {/* Stats */}
            <StatsDialog>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 sm:h-9 sm:w-9 p-0"
              >
                <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </StatsDialog>

            {/* Add Guest */}
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button size="sm" className="h-8 sm:h-9">
                  <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden xs:inline">Tambah</span>
                  <span className="hidden sm:inline ml-1">Tamu</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[95vw] max-w-md mx-auto">
                <DialogHeader>
                  <DialogTitle>Tambah Tamu Baru</DialogTitle>
                </DialogHeader>
                <GuestForm onSuccess={handleGuestAdded} />
              </DialogContent>
            </Dialog>

            {/* Theme Toggle */}
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
