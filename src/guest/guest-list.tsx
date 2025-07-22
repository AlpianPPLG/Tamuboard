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
    <div className="space-y-4 sm:space-y-6 h-full flex flex-col">
      {/* Guest Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 flex-1 overflow-y-auto">
        {currentGuests.map((guest) => (
          <GuestCard 
            key={guest.id} 
            guest={guest} 
            onUpdate={onGuestUpdate}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 pt-4 border-t">
          <div className="text-xs sm:text-sm text-muted-foreground order-2 sm:order-1">
            Menampilkan {startIndex + 1}-{Math.min(endIndex, guests.length)} dari {guests.length} tamu
          </div>
          
          <div className="flex items-center gap-1 sm:gap-2 order-1 sm:order-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-8 px-2 sm:px-3"
            >
              <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline ml-1">Sebelumnya</span>
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => goToPage(page)}
                  className="w-7 h-7 sm:w-8 sm:h-8 p-0 text-xs sm:text-sm"
                >
                  {page}
                </Button>
              ))}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="h-8 px-2 sm:px-3"
            >
              <span className="hidden sm:inline mr-1">Selanjutnya</span>
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}