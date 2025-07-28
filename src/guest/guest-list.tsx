"use client"

import { useState } from 'react';
import { Guest } from '@/types/guest';
import { GuestCard } from './guest-card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Users } from 'lucide-react';

interface GuestListProps {
  guests: Guest[];
  onGuestUpdate: () => void;
}

const ITEMS_PER_PAGE = 8;

export function GuestList({ guests, onGuestUpdate }: GuestListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.ceil(guests.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentGuests = guests.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  if (guests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center h-full">
        <div className="rounded-full bg-muted p-4 sm:p-6 mb-3 sm:mb-4">
          <Users className="h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground" />
        </div>
        <h3 className="text-base sm:text-lg font-semibold mb-2">Belum ada tamu</h3>
        <p className="text-sm sm:text-base text-muted-foreground max-w-sm px-4">
          Belum ada tamu yang terdaftar. Tambahkan tamu pertama dengan mengklik tombol Tambah Tamu.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2 xs:space-y-3 h-full flex flex-col">
      {/* Guest Cards Grid */}
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1.5 xs:gap-2 sm:gap-3 flex-1 overflow-y-auto">
        {currentGuests.map((guest) => (
          <div key={guest.id} className="w-full h-full">
            <GuestCard 
              guest={guest} 
              onUpdate={onGuestUpdate}
            />
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col xs:flex-row items-center justify-between gap-1.5 xs:gap-3 pt-2 border-t">
          <div className="text-[11px] xs:text-xs text-muted-foreground order-2 xs:order-1 text-center xs:text-left">
            {startIndex + 1}-{Math.min(endIndex, guests.length)} dari {guests.length}
          </div>
          
          <div className="flex items-center gap-1 order-1 xs:order-2 w-full xs:w-auto justify-between xs:justify-start">
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-7 w-8 p-0"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            
            <div className="flex-1 xs:flex-none flex items-center justify-center overflow-x-auto mx-1">
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "ghost"}
                    size="sm"
                    onClick={() => goToPage(page)}
                    className={`h-7 min-w-[28px] p-0 text-xs ${currentPage === page ? '' : 'text-muted-foreground'}`}
                  >
                    {page}
                  </Button>
                ))}
              </div>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="h-7 w-8 p-0"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}