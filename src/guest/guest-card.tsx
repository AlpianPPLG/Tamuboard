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
import { FeedbackDialog } from '@/dialogs/feedback-dialog';
import { GuestForm } from '@/forms/guest-form';
import { GuestStorage } from '@/lib/guest-stotrage';
import { 
  getGuestInitials, 
  formatDate, 
  getStatusColor, 
  getStatusText,
  getCategoryColor,
  getCategoryText,
  getVisitTimeText
} from '@/lib/guest-utils';
import { useLanguage } from '@/contexts/language-context';
import { 
  MoreVertical, 
  Eye, 
  LogOut, 
  Trash2, 
  Edit,
  Building, 
  Clock,
  Phone,
  CheckCircle,
  XCircle,
  MessageSquare,
  Star,
  Calendar
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
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const { language, t } = useLanguage();

  const handleCheckOut = () => {
    const updatedGuest = GuestStorage.checkOutGuest(guest.id);
    if (updatedGuest) {
      toast.success(`${guest.name} ${t.successCheckOut}`, {
        description: `Check out pada ${updatedGuest.checkOutTime}`,
        icon: <CheckCircle className="h-4 w-4" />,
      });
      onUpdate();
    } else {
      toast.error("Gagal melakukan check out", {
        description: "Terjadi kesalahan saat memproses check out",
        icon: <XCircle className="h-4 w-4" />,
      });
    }
  };

  const handleEditSuccess = () => {
    setShowEditDialog(false);
    onUpdate();
  };
  const handleDelete = () => {
    const success = GuestStorage.deleteGuest(guest.id);
    if (success) {
      toast.success(`Data tamu ${t.successDelete}`, {
        icon: <CheckCircle className="h-4 w-4" />,
      });
      onUpdate();
    } else {
      toast.error('Gagal menghapus data tamu', {
        icon: <XCircle className="h-4 w-4" />,
      });
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
                  {t.viewDetail}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                  <Edit className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  {t.edit}
                </DropdownMenuItem>
                {guest.status === 'checked-in' && (
                  <DropdownMenuItem onClick={handleCheckOut}>
                    <LogOut className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    {t.checkOut}
                  </DropdownMenuItem>
                )}
                {guest.status === 'checked-out' && (
                  <DropdownMenuItem onClick={() => setShowFeedbackDialog(true)}>
                    <MessageSquare className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    {t.feedback}
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem 
                  onClick={() => setShowDeleteDialog(true)}
                  variant="destructive"
                >
                  <Trash2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  {t.delete}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="space-y-2 sm:space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1 sm:gap-2">
              <Badge className={getStatusColor(guest.status)}>
                {getStatusText(guest.status)}
              </Badge>
              <Badge className={getCategoryColor(guest.category)}>
                {getCategoryText(guest.category, language)}
              </Badge>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
              <span>{getVisitTimeText(guest.visitTime, language)}</span>
            </div>
          </div>

          <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
            <div>
              <span className="text-muted-foreground">{t.purpose}:</span>
              <p className="font-medium truncate text-xs sm:text-sm">{guest.purpose}</p>
            </div>
            
            <div className="flex items-center gap-1 text-muted-foreground">
              <Phone className="h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0" />
              <span className="truncate">{guest.phone}</span>
            </div>

            {guest.scheduledDate && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0" />
                <span className="truncate text-xs">
                  Jadwal: {formatDate(guest.scheduledDate)}
                  {guest.scheduledTime && ` ${guest.scheduledTime}`}
                </span>
              </div>
            )}

            {guest.rating && (
              <div className="flex items-center gap-1">
                <Star className="h-2.5 w-2.5 sm:h-3 sm:w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs text-muted-foreground">{guest.rating}/5</span>
              </div>
            )}
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

      {/* Feedback Dialog */}
      <FeedbackDialog
        guest={guest}
        open={showFeedbackDialog}
        onOpenChange={setShowFeedbackDialog}
        onUpdate={onUpdate}
      />
      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="w-[95vw] max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle>{t.edit}</DialogTitle>
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
            <AlertDialogTitle>{t.delete} Data Tamu</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus data tamu <strong>{guest.name}</strong>? 
              Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {t.delete}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}