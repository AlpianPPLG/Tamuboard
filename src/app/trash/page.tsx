"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Guest } from '@/types/guest';
import { GuestStorage } from '@/lib/guest-stotrage';
import { Button } from '@/components/ui/button';
import { Trash2, Undo2, Search, X, ArrowLeft } from 'lucide-react';
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
    const guests = GuestStorage.getDeletedGuests();
    setDeletedGuests(guests);
  };

  useEffect(() => {
    loadDeletedGuests();
  }, []);

  const handleRestore = (id: string) => {
    const success = GuestStorage.restoreGuest(id);
    if (success) {
      toast.success('Tamu berhasil dikembalikan');
      loadDeletedGuests();
    } else {
      toast.error('Gagal mengembalikan tamu');
    }
  };

  const handlePermanentDelete = (id: string) => {
    const success = GuestStorage.permanentDelete(id);
    if (success) {
      toast.success('Tamu berhasil dihapus permanen');
      loadDeletedGuests();
    } else {
      toast.error('Gagal menghapus tamu');
    }
  };

  const handleBulkAction = (action: 'restore' | 'delete') => {
    const ids = Array.from(selectedGuests);
    const success = ids.every(id => 
      action === 'restore' 
        ? GuestStorage.restoreGuest(id)
        : GuestStorage.permanentDelete(id)
    );

    if (success) {
      toast.success(
        `${ids.length} tamu berhasil ${action === 'restore' ? 'dikembalikan' : 'dihapus permanen'}`
      );
      setSelectedGuests(new Set());
      loadDeletedGuests();
    } else {
      toast.error(`Gagal ${action === 'restore' ? 'mengembalikan' : 'menghapus'} beberapa tamu`);
    }
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

  const filteredGuests = deletedGuests.filter(guest => 
    guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.phone.includes(searchTerm) ||
    (guest.email?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
  );

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
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRestore(guest.id)}
                            className="h-8 w-8 p-0"
                            title="Kembalikan"
                          >
                            <Undo2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handlePermanentDelete(guest.id)}
                            className="h-8 w-8 p-0"
                            title="Hapus Permanen"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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
