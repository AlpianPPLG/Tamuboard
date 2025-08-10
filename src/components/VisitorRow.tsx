import { useState } from 'react';
import { format } from 'date-fns';
import { PencilIcon, TrashIcon, CheckIcon } from '@heroicons/react/24/outline';
import { Visitor } from '@/types/visitor';
import { Timestamp } from 'firebase/firestore';
import { XIcon } from 'lucide-react';

interface VisitorRowProps {
  visitor: Visitor;
  onEdit: (visitor: Visitor) => void;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

export const VisitorRow = ({ visitor, onEdit, onDelete, isDeleting = false }: VisitorRowProps) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const handleEdit = () => {
    onEdit(visitor);
  };

  const handleDelete = () => {
    if (showDeleteConfirm) {
      onDelete(visitor.id!);
      setShowDeleteConfirm(false);
    } else {
      setShowDeleteConfirm(true);
      // Auto-hide the confirmation after 5 seconds
      setTimeout(() => {
        setShowDeleteConfirm(false);
      }, 5000);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  // Format date for display
  const formatDate = (date: Date | Timestamp) => {
    try {
      const dateObj = date instanceof Date ? date : date.toDate();
      return format(dateObj, 'MMM d, yyyy h:mm a');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  return (
    <tr className={`hover:bg-gray-50 ${isDeleting ? 'opacity-50' : ''}`}>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-blue-100">
            <span className="text-blue-600 font-medium">
              {visitor.fullName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{visitor.fullName}</div>
            <div className="text-sm text-gray-500">{visitor.email}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{visitor.institution}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          visitor.guestCategory === 'vip' 
            ? 'bg-purple-100 text-purple-800' 
            : 'bg-green-100 text-green-800'
        }`}>
          {visitor.guestCategory.toUpperCase()}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatDate(visitor.checkIn)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center space-x-2 justify-end">
          <button
            onClick={handleEdit}
            className="text-blue-600 hover:text-blue-900 disabled:opacity-50"
            disabled={isDeleting}
            title="Edit visitor"
          >
            <PencilIcon className="h-5 w-5" />
          </button>
          
          {showDeleteConfirm ? (
            <div className="flex space-x-1">
              <button
                onClick={cancelDelete}
                className="text-gray-500 hover:text-gray-700"
                title="Cancel"
              >
                <XIcon className="h-5 w-5" />
              </button>
              <button
                onClick={handleDelete}
                className="text-red-600 hover:text-red-900"
                title="Confirm delete"
              >
                <CheckIcon className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleDelete}
              className="text-red-600 hover:text-red-900 disabled:opacity-50"
              disabled={isDeleting}
              title="Delete visitor"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

export default VisitorRow;
