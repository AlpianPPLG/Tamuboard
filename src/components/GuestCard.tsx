import { PencilIcon, TrashIcon, EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Visitor } from '@/types/visitor';
import { Button } from '@/components/ui/button';

interface GuestCardProps {
  visitor: Visitor;
  onEdit: (visitor: Visitor) => void;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

export const GuestCard = ({ visitor, onEdit, onDelete, isDeleting = false }: GuestCardProps) => {
  // Format date to Indonesian locale
  const formatDate = (date: Date | { toDate: () => Date } | string) => {
    try {
      // If it's a Firestore Timestamp, convert to Date
      const dateObj = typeof date === 'object' && 'toDate' in date 
        ? date.toDate() 
        : new Date(date);
      
      return format(dateObj, 'EEEE, d MMMM yyyy HH:mm', { locale: id });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Tanggal tidak valid';
    }
  };

  return (
    <div className={`bg-white overflow-hidden shadow rounded-lg ${isDeleting ? 'opacity-50' : ''}`}>
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
            <div className="h-10 w-10 text-white text-xl font-bold flex items-center justify-center">
              {visitor.fullName.charAt(0).toUpperCase()}
            </div>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">{visitor.fullName}</h3>
            <p className="text-sm text-gray-500">{visitor.institution}</p>
          </div>
          <div className="ml-auto">
            <div className="relative">
              <Button className="text-gray-400 hover:text-gray-500">
                <EllipsisVerticalIcon className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              visitor.guestCategory === 'vip' 
                ? 'bg-purple-100 text-purple-800' 
                : 'bg-green-100 text-green-800'
            }`}>
              {visitor.guestCategory.toUpperCase()}
            </span>
            <div className="flex space-x-2">
              <Button
                onClick={() => onEdit(visitor)}
                className="text-blue-600 hover:text-blue-900"
                disabled={isDeleting}
              >
                <PencilIcon className="h-5 w-5" />
              </Button>
              <Button
                onClick={() => onDelete(visitor.id!)}
                className="text-red-600 hover:text-red-900"
                disabled={isDeleting}
              >
                <TrashIcon className="h-5 w-5" />
              </Button>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            {formatDate(visitor.checkIn)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default GuestCard;
