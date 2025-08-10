import { Visitor } from '@/types/visitor';
import { GuestCard } from './GuestCard';
import { PlusIcon } from '@heroicons/react/24/outline';

interface GuestGridProps {
  visitors: Visitor[];
  loading: boolean;
  onAddClick: () => void;
  onEdit: (visitor: Visitor) => void;
  onDelete: (id: string) => void;
  deletingId: string | null;
}

export const GuestGrid = ({
  visitors,
  loading,
  onAddClick,
  onEdit,
  onDelete,
  deletingId
}: GuestGridProps) => {
  if (loading && visitors.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse bg-gray-200 rounded-lg h-48" />
        ))}
      </div>
    );
  }

  if (visitors.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-24 w-24 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h3 className="mt-2 text-sm font-medium text-gray-900">Belum ada tamu</h3>
        <p className="mt-1 text-sm text-gray-500">Mulai dengan menambahkan tamu baru.</p>
        <div className="mt-6">
          <button
            type="button"
            onClick={onAddClick}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Tambah Tamu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {visitors.map((visitor) => (
        <GuestCard
          key={visitor.id}
          visitor={visitor}
          onEdit={onEdit}
          onDelete={onDelete}
          isDeleting={deletingId === visitor.id}
        />
      ))}
    </div>
  );
};

export default GuestGrid;
