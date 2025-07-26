"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Search, Plus, Filter, Users, BarChart3, Languages, Trash2 } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { GuestForm } from "@/forms/guest-form";
import { StatsDialog } from "@/dialogs/stats-dialog";
import { FilterOptions } from "@/types/guest";
import { useLanguage } from "@/contexts/language-context";
import { AdvancedSearchDialog } from "@/dialogs/advanced-search-dialog";
import { GuestStorage } from "@/lib/guest-stotrage";
import { SavedFilters } from "@/components/saved-filters";

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
  const { setLanguage, t } = useLanguage();
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  useEffect(() => {
    // Load available tags from storage
    const guests = GuestStorage.getGuests();
    const allTags = new Set<string>();
    
    guests.forEach(guest => {
      if (guest.tags) {
        guest.tags.forEach(tag => allTags.add(tag));
      }
    });
    
    setAvailableTags(Array.from(allTags));
  }, []);

  const handleGuestAdded = () => {
    setShowAddDialog(false);
    onGuestAdded();
  };

  const handleFiltersChange = (newFilters: FilterOptions) => {
    onFiltersChange(newFilters);
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
                {t.appTitle}
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                {t.appSubtitle}
              </p>
            </div>
          </div>

          {/* Search & Actions */}
          <div className="flex items-center gap-1 sm:gap-2 w-full sm:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:flex-initial sm:block">
              <Search className="absolute left-2 sm:left-3 top-1/2 h-3 w-3 sm:h-4 sm:w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t.searchPlaceholder}
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full sm:w-48 md:w-64 pl-7 sm:pl-9 h-8 sm:h-9 text-sm"
              />
            </div>

            {/* Saved Filters */}
            <SavedFilters 
              currentFilters={filters}
              onSelectFilter={handleFiltersChange}
            />

            {/* Advanced Search */}
            <AdvancedSearchDialog 
              filters={filters} 
              onFiltersChange={handleFiltersChange}
              availableTags={availableTags}
            />

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

            {/* Language Toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 sm:h-9 sm:w-9 p-0"
                >
                  <Languages className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLanguage('id')}>
                  🇮🇩 Indonesia
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('en')}>
                  🇺🇸 English
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {/* Add Guest */}
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button size="sm" className="h-8 sm:h-9">
                  <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden xs:inline">{t.addGuest.split(' ')[0]}</span>
                  <span className="hidden sm:inline ml-1">{t.addGuest.split(' ')[1] || ''}</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[95vw] max-w-md mx-auto">
                <DialogHeader>
                  <DialogTitle>{t.addGuest} Baru</DialogTitle>
                </DialogHeader>
                <GuestForm onSuccess={handleGuestAdded} />
              </DialogContent>
            </Dialog>

            {/* Trash Link */}
            <Button asChild variant="ghost" size="sm" className="h-8 w-8 sm:h-9 sm:w-9 p-0">
              <Link href="/trash" title="Tempat Sampah">
                <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
              </Link>
            </Button>

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
