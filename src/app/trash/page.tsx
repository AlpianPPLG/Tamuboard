"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Guest } from '@/types/guest';
import { GuestStorage } from '@/lib/guest-stotrage';
import TrashManager from '@/lib/trash-manager';
import { Button } from '@/components/ui/button';
import { Trash2, Undo2, Search, X, ArrowLeft, Clock, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { useLanguage } from '@/contexts/language-context';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

export default function TrashPage() {
  const [deletedGuests, setDeletedGuests] = useState<Guest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGuests, setSelectedGuests] = useState<Set<string>>(new Set());
  const { t } = useLanguage();

  const loadDeletedGuests = () => {
    const guests = TrashManager.getTrash();
    setDeletedGuests(guests);
  };

  useEffect(() => {
    loadDeletedGuests();
    
    // Subscribe to trash changes
    const unsubscribe = TrashManager.onChange(loadDeletedGuests);
    
    // Initial cleanup check - run cleanup on component mount
    const cleanup = async () => {
      // Force cleanup of any expired items
      const guests = GuestStorage.getGuests(true);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const remainingGuests = guests.filter(guest => 
        guest.status !== 'deleted' || 
        !guest.deletedAt || 
        new Date(guest.deletedAt) >= thirtyDaysAgo
      );
      
      if (remainingGuests.length < guests.length) {
        GuestStorage.saveGuests(remainingGuests);
        loadDeletedGuests();
      }
    };
    
    cleanup();
    
    return () => {
      unsubscribe();
    };
  }, []);

  const handleRestore = (id: string) => {
    const success = TrashManager.restoreFromTrash(id);
    if (success) {
      toast.success(t.restoreSuccess);
    } else {
      toast.error(t.restoreError);
    }
  };

  const handlePermanentDelete = (id: string) => {
    const guests = GuestStorage.getGuests(true);
    const updatedGuests = guests.filter(guest => guest.id !== id);
    GuestStorage.saveGuests(updatedGuests);
    toast.success(t.deleteSuccess);
    loadDeletedGuests();
  };

  const handleBulkAction = (action: 'restore' | 'delete') => {
    const ids = Array.from(selectedGuests);
    let success = true;
    
    for (const id of ids) {
      try {
        if (action === 'restore') {
          if (!TrashManager.restoreFromTrash(id)) {
            success = false;
          }
        } else {
          const guests = GuestStorage.getGuests(true);
          const updatedGuests = guests.filter(guest => guest.id !== id);
          GuestStorage.saveGuests(updatedGuests);
        }
      } catch (error) {
        console.error(`Error during ${action}:`, error);
        success = false;
      }
    }

    if (success) {
      const message = action === 'restore' 
        ? `${ids.length} ${t.restoreSuccess.toLowerCase()}`
        : `${ids.length} ${t.deleteSuccess.toLowerCase()}`;
      
      toast.success(message);
      setSelectedGuests(new Set());
      loadDeletedGuests();
    } else {
      const errorMessage = action === 'restore' 
        ? t.restoreError
        : t.deleteError;
      toast.error(errorMessage);
    }
  };
  
  const getDaysRemaining = (deletedAt: Date): number => {
    const now = new Date();
    const thirtyDaysLater = new Date(deletedAt);
    thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);
    
    const diffTime = thirtyDaysLater.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  };
  
  const getDaysRemainingText = (days: number): string => {
    if (days === 0) return t.trash.expiresToday;
    if (days === 1) return t.trash.expiresInOneDay;
    return t.trash.expiresInDays.replace('{days}', days.toString());
  };

  const toggleSelectGuest = (id: string) => {
    const newSelection = new Set(selectedGuests);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedGuests(newSelection);
  };

  const toggleSelectAll = () => {
    if (selectedGuests.size === deletedGuests.length) {
      setSelectedGuests(new Set());
    } else {
      setSelectedGuests(new Set(deletedGuests.map(g => g.id)));
    }
  };

  const filteredGuests = deletedGuests
    .filter(guest => 
      guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.phone.includes(searchTerm) ||
      (guest.email?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
    )
    .sort((a, b) => {
      // Sort by days remaining (ascending)
      if (a.deletedAt && b.deletedAt) {
        return a.deletedAt.getTime() - b.deletedAt.getTime();
      }
      return 0;
    });

  const router = useRouter();

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => router.push('/')}
              className="h-10 w-10"
              title="Kembali ke Beranda"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Tempat Sampah</h1>
              <p className="text-sm text-muted-foreground">
                {deletedGuests.length} tamu di tempat sampah
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Cari tamu..."
                className="pl-8 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <X
                  className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground cursor-pointer"
                  onClick={() => setSearchTerm('')}
                />
              )}
            </div>
          </div>
        </div>

        {selectedGuests.size > 0 && (
          <div className="bg-muted/50 p-3 rounded-lg flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium">
              {selectedGuests.size} dipilih
            </span>
            <div className="flex-1" />
            <div className="flex gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction('restore')}
                className="gap-1"
              >
                <Undo2 className="h-4 w-4" />
                <span>Kembalikan</span>
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleBulkAction('delete')}
                className="gap-1"
              >
                <Trash2 className="h-4 w-4" />
                <span>Hapus Permanen</span>
              </Button>
            </div>
          </div>
        )}

        <div className="rounded-md border">
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-12">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      checked={selectedGuests.size > 0 && selectedGuests.size === deletedGuests.length}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Nama
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Institusi
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Dihapus
                  </th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {filteredGuests.length > 0 ? (
                  filteredGuests.map((guest) => (
                    <tr key={guest.id} className="border-b transition-colors hover:bg-muted/50">
                      <td className="p-4 align-middle">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          checked={selectedGuests.has(guest.id)}
                          onChange={() => toggleSelectGuest(guest.id)}
                        />
                      </td>
                      <td className="p-4 align-middle font-medium">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                            {guest.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium">{guest.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {guest.phone}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        <div className="text-sm">{guest.institution}</div>
                        {guest.category && (
                          <Badge variant="outline" className="mt-1">
                            {guest.category}
                          </Badge>
                        )}
                      </td>
                      <td className="p-4 align-middle">
                        <div className="text-sm">
                          {guest.deletedAt 
                            ? format(new Date(guest.deletedAt), 'PPp', { locale: id })
                            : 'Tidak diketahui'}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          oleh {guest.deletedBy || 'Sistem'}
                        </div>
                      </td>
                      <td className="p-4 align-middle text-right">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
                          {guest.deletedAt && (
                            <div className="flex items-center text-xs text-muted-foreground mb-2 sm:mb-0 sm:mr-2">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>{getDaysRemainingText(getDaysRemaining(guest.deletedAt))}</span>
                              <span className="mx-1">•</span>
                              <Calendar className="h-3 w-3 mr-1" />
                              <span>{format(guest.deletedAt, 'dd MMM yyyy, HH:mm', { locale: id })}</span>
                            </div>
                          )}
                          <div className="flex gap-2 w-full sm:w-auto">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRestore(guest.id)}
                              className="text-xs sm:text-sm flex-1 sm:flex-initial"
                            >
                              <Undo2 className="h-3 w-3 mr-1" /> {t.trash.restore}
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handlePermanentDelete(guest.id)}
                              className="text-xs sm:text-sm flex-1 sm:flex-initial"
                            >
                              <Trash2 className="h-3 w-3 mr-1" /> {t.trash.deletePermanent}
                            </Button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="h-24 text-center">
                      {searchTerm ? (
                        <div className="flex flex-col items-center justify-center py-8">
                          <p className="text-muted-foreground">Tidak ada tamu yang cocok dengan pencarian</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSearchTerm('')}
                            className="mt-2"
                          >
                            Hapus pencarian
                          </Button>
                        </div>
                      ) : (
                        <p className="text-muted-foreground">Tidak ada tamu di tempat sampah</p>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
