"use client"

import { useState } from 'react';
import { Guest } from '@/types/guest';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { GuestDetailDialog } from './guest-detail-dialog';
import { GuestForm } from '@/forms/guest-form';
import { GuestStorage } from '@/lib/guest-stotrage';
import { 
  getGuestInitials, 
  formatDate, 
  getStatusColor, 
  getStatusText 
} from '@/lib/guest-utils';
import { 
  MoreVertical, 
  Eye, 
  LogOut, 
  Trash2, 
  Edit,
  Building, 
  Clock,
  Phone
} from 'lucide-react';
import { toast } from 'sonner';

interface GuestCardProps {
  guest: Guest;
  onUpdate: () => void;
}

export function GuestCard({ guest, onUpdate }: GuestCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const handleCheckOut = () => {
    const updatedGuest = GuestStorage.checkOutGuest(guest.id);
    if (updatedGuest) {
      toast.success(`${guest.name} telah check out`, {
        description: `Check out pada ${updatedGuest.checkOutTime}`,
      });
      onUpdate();
    }
  };

  const handleEditSuccess = () => {
    setShowEditDialog(false);
    onUpdate();
  };
  const handleDelete = () => {
    const success = GuestStorage.deleteGuest(guest.id);
    if (success) {
      toast.success('Data tamu berhasil dihapus');
      onUpdate();
    }
    setShowDeleteDialog(false);
  };

  return (
    <>
      <Card className="hover:shadow-md transition-shadow h-fit">
        <CardHeader className="pb-2 sm:pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <Avatar className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {getGuestInitials(guest.name)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm sm:text-base font-semibold truncate">{guest.name}</h3>
                <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
                  <Building className="h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0" />
                  <span className="truncate">{guest.institution}</span>
                </div>
              </div>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 sm:h-8 sm:w-8 p-0 flex-shrink-0">
                  <MoreVertical className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowDetailDialog(true)}>
                  <Eye className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  Lihat Detail
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                  <Edit className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  Edit Data
                </DropdownMenuItem>
                {guest.status === 'checked-in' && (
                  <DropdownMenuItem onClick={handleCheckOut}>
                    <LogOut className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    Check Out
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem 
                  onClick={() => setShowDeleteDialog(true)}
                  variant="destructive"
                >
                  <Trash2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  Hapus
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="space-y-2 sm:space-y-3">
          <div className="flex items-center justify-between">
            <Badge className={getStatusColor(guest.status)}>
              {getStatusText(guest.status)}
            </Badge>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
              {guest.checkInTime}
            </div>
          </div>

          <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
            <div>
              <span className="text-muted-foreground">Keperluan:</span>
              <p className="font-medium truncate text-xs sm:text-sm">{guest.purpose}</p>
            </div>
            
            <div className="flex items-center gap-1 text-muted-foreground">
              <Phone className="h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0" />
              <span className="truncate">{guest.phone}</span>
            </div>
          </div>

          <div className="pt-1 sm:pt-2 border-t">
            <p className="text-xs text-muted-foreground">
              {formatDate(guest.visitDate)}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <GuestDetailDialog
        guest={guest}
        open={showDetailDialog}
        onOpenChange={setShowDetailDialog}
        onUpdate={onUpdate}
      />

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="w-[95vw] max-w-md mx-auto">
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="w-[95vw] max-w-md mx-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Data Tamu</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus data tamu <strong>{guest.name}</strong>? 
              Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}