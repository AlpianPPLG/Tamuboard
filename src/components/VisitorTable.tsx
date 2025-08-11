import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Visitor } from '@/types/visitor';
import { Button } from '@/components/ui/button';

interface VisitorTableProps {
  visitors: Visitor[];
  loading: boolean;
  onEdit: (visitor: Visitor) => void;
  onDelete: (id: string) => void;
  deletingId: string | null;
}

export const VisitorTable = ({
  visitors,
  loading,
  onEdit,
  onDelete,
  deletingId
}: VisitorTableProps) => {
  // Format date to Indonesian locale
  const formatDate = (date: Date | { toDate: () => Date } | string | undefined) => {
    if (!date) return 'N/A';
    
    try {
      // If it's a Firestore Timestamp, convert to Date
      const dateObj = typeof date === 'object' && 'toDate' in date 
        ? date.toDate() 
        : new Date(date);
      
      return format(dateObj, 'dd/MM/yyyy HH:mm', { locale: id });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'N/A';
    }
  };

  // Format guest category
  const formatCategory = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  if (loading && visitors.length === 0) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-200 rounded"></div>
        ))}
      </div>
    );
  }

  if (visitors.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-500">Tidak ada data tamu yang ditemukan</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                  Nama
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Institusi
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Kategori
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Check-in
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Check-out
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Tujuan
                </th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span className="sr-only">Aksi</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {visitors.map((visitor) => (
                <tr key={visitor.id} className={deletingId === visitor.id ? 'opacity-50' : ''}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                    {visitor.fullName}
                    <div className="text-gray-500 text-xs">{visitor.email}</div>
                    {visitor.phone && <div className="text-gray-500 text-xs">{visitor.phone}</div>}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {visitor.institution || '-'}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      visitor.guestCategory === 'vip' 
                        ? 'bg-purple-100 text-purple-800' 
                        : visitor.guestCategory === 'supplier'
                        ? 'bg-yellow-100 text-yellow-800'
                        : visitor.guestCategory === 'intern'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {formatCategory(visitor.guestCategory || 'regular')}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {visitor.checkIn ? formatDate(visitor.checkIn) : '-'}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {visitor.checkOutTime ? formatDate(visitor.checkOutTime) : 'Masuk'}
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-500">
                    {visitor.purpose || '-'}
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <div className="flex space-x-2 justify-end">
                      <Button
                        onClick={() => onEdit(visitor)}
                        variant="ghost"
                        size="icon"
                        className="text-blue-600 hover:text-blue-900"
                        disabled={!!deletingId}
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => onDelete(visitor.id!)}
                        variant="ghost"
                        size="icon"
                        className="text-red-600 hover:text-red-900"
                        disabled={!!deletingId}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VisitorTable;
