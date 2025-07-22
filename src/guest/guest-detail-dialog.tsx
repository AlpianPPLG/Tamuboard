"use client"

import { useState } from 'react';
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
  Clock,
  LogIn,
  LogOut,
  Edit
} from 'lucide-react';

interface GuestDetailDialogProps {
  guest: Guest;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate?: () => void;
}

export function GuestDetailDialog({ guest, open, onOpenChange, onUpdate }: GuestDetailDialogProps) {
  const [showEditForm, setShowEditForm] = useState(false);

  const handleEditSuccess = () => {
    setShowEditForm(false);
    onUpdate?.();
  };

  if (showEditForm) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Data Tamu</DialogTitle>
          </DialogHeader>
          <GuestForm 
            guest={guest}
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
      value: guest.name,
    },
    {
      icon: Building,
      label: 'Instansi/Perusahaan',
      value: guest.institution,
    },
    {
      icon: Phone,
      label: 'Nomor Telepon',
      value: guest.phone,
    },
    ...(guest.email ? [{
      icon: Mail,
      label: 'Email',
      value: guest.email,
    }] : []),
    {
      icon: MessageSquare,
      label: 'Keperluan',
      value: guest.purpose,
    },
    ...(guest.notes ? [{
      icon: MessageSquare,
      label: 'Catatan',
      value: guest.notes,
    }] : []),
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Detail Tamu</DialogTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowEditForm(true)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header with Avatar and Status */}
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                {getGuestInitials(guest.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{guest.name}</h3>
              <p className="text-muted-foreground">{guest.institution}</p>
              <Badge className={`mt-2 ${getStatusColor(guest.status)}`}>
                {getStatusText(guest.status)}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Guest Details */}
          <div className="space-y-4">
            {detailItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div key={index} className="flex items-start gap-3">
                  <IconComponent className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-muted-foreground">
                      {item.label}
                    </p>
                    <p className="text-sm break-words">{item.value}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <Separator />

          {/* Visit Information */}
          <div className="space-y-4">
            <h4 className="font-medium">Informasi Kunjungan</h4>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tanggal Kunjungan</p>
                  <p className="text-sm">{formatDate(guest.visitDate)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <LogIn className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Waktu Check In</p>
                  <p className="text-sm">{guest.checkInTime}</p>
                </div>
              </div>

              {guest.checkOutTime && (
                <div className="flex items-center gap-3">
                  <LogOut className="h-4 w-4 text-red-600" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Waktu Check Out</p>
                    <p className="text-sm">{guest.checkOutTime}</p>
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