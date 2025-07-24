"use client"

import { useEffect, useState } from 'react';
import { Guest } from '@/types/guest';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { GuestForm } from '@/forms/guest-form';
import { 
  getGuestInitials, 
  formatDate, 
  getStatusColor, 
  getStatusText 
} from '@/lib/guest-utils';
import { 
  User, 
  Building, 
  Phone, 
  Mail, 
  MessageSquare, 
  Calendar, 
  LogIn,
  LogOut,
  Edit,
  XCircle
} from 'lucide-react';

import { DialogFooter } from '@/components/ui/dialog';
import { GuestStorage } from '@/lib/guest-stotrage';

interface GuestDetailDialogProps {
  guest: Guest;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate?: () => void;
}

export function GuestDetailDialog({ guest: initialGuest, open, onOpenChange, onUpdate }: GuestDetailDialogProps) {
  const [showEditForm, setShowEditForm] = useState(false);
  const [currentGuest, setCurrentGuest] = useState<Guest | null>(initialGuest);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch the latest guest data when dialog opens
  useEffect(() => {
    const fetchGuestData = async () => {
      if (open && initialGuest?.id) {
        try {
          setIsLoading(true);
          const guests = GuestStorage.getGuests();
          const freshGuest = guests.find(g => g.id === initialGuest.id) || null;
          setCurrentGuest(freshGuest);
        } catch (error) {
          console.error('Error fetching guest data:', error);
          setCurrentGuest(null);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchGuestData();
  }, [open, initialGuest?.id]);

  const handleEditSuccess = () => {
    setShowEditForm(false);
    onUpdate?.();
    
    // Refresh the guest data after successful update
    if (initialGuest?.id) {
      const guests = GuestStorage.getGuests();
      const updatedGuest = guests.find(g => g.id === initialGuest.id) || null;
      setCurrentGuest(updatedGuest);
    }
  };

  // Handle loading state
  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Memuat Data Tamu</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="text-muted-foreground text-center">
              Memuat data tamu, harap tunggu...
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Handle case when guest is not found
  if (!currentGuest) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Data Tamu Tidak Ditemukan</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-4 space-y-4">
            <XCircle className="h-12 w-12 text-red-500" />
            <p className="text-muted-foreground text-center">
              Data tamu tidak dapat dimuat. Silakan tutup dan coba lagi.
            </p>
          </div>
          <DialogFooter>
            <Button 
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto"
            >
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  if (showEditForm && currentGuest) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Data Tamu</DialogTitle>
          </DialogHeader>
          <GuestForm 
            guest={currentGuest}
            mode="edit"
            onSuccess={handleEditSuccess}
          />
        </DialogContent>
      </Dialog>
    );
  }

  const detailItems = [
    {
      icon: User,
      label: 'Nama Lengkap',
      value: currentGuest.name,
    },
    {
      icon: Building,
      label: 'Instansi/Perusahaan',
      value: currentGuest.institution || '-',
    },
    {
      icon: Phone,
      label: 'Nomor Telepon',
      value: currentGuest.phone || '-',
    },
    ...(currentGuest.email ? [{
      icon: Mail,
      label: 'Email',
      value: currentGuest.email,
    }] : []),
    {
      icon: MessageSquare,
      label: 'Keperluan',
      value: currentGuest.purpose || '-',
    },
    ...(currentGuest.notes ? [{
      icon: MessageSquare,
      label: 'Catatan',
      value: currentGuest.notes,
    }] : []),
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Detail Tamu</DialogTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowEditForm(true)}
              className="h-8"
              disabled={isLoading}
            >
              <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Edit
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6">
          {/* Header with Avatar and Status */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Avatar className="h-12 w-12 sm:h-16 sm:w-16 flex-shrink-0">
              <AvatarFallback className="bg-primary text-primary-foreground text-sm sm:text-lg">
                {getGuestInitials(currentGuest.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-lg font-semibold truncate">{currentGuest.name}</h3>
              <p className="text-sm sm:text-base text-muted-foreground truncate">
                {currentGuest.institution || 'Tidak ada instansi'}
              </p>
              <Badge className={`mt-2 ${getStatusColor(currentGuest.status)}`}>
                {getStatusText(currentGuest.status)}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Guest Details */}
          <div className="space-y-3 sm:space-y-4">
            {detailItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div key={index} className="flex items-start gap-2 sm:gap-3">
                  <IconComponent className="h-3 w-3 sm:h-4 sm:w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                      {item.label}
                    </p>
                    <p className="text-sm sm:text-base break-words">{item.value}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <Separator />

          {/* Visit Information */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="text-sm sm:text-base font-medium">Informasi Kunjungan</h4>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2 sm:gap-3">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Tanggal Kunjungan</p>
                  <p className="text-sm sm:text-base">
                    {currentGuest.visitDate ? formatDate(currentGuest.visitDate) : '-'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <LogIn className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 flex-shrink-0" />
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Waktu Check In</p>
                  <p className="text-sm sm:text-base">{currentGuest.checkInTime || '-'}</p>
                </div>
              </div>

              {currentGuest.checkOutTime && (
                <div className="flex items-center gap-2 sm:gap-3">
                  <LogOut className="h-3 w-3 sm:h-4 sm:w-4 text-red-600 flex-shrink-0" />
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground">Waktu Check Out</p>
                    <p className="text-sm sm:text-base">{currentGuest.checkOutTime}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}