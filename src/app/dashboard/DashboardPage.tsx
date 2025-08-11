'use client';

import { useState, useCallback, useEffect, Fragment, useMemo } from 'react';
import { PlusIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { Pagination } from '@/components/Pagination';
import { Dialog, Transition } from '@headlessui/react';
import { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';

import { useVisitors } from '@/hooks/useVisitors';
import { Visitor, CreateVisitorDTO, UpdateVisitorDTO } from '@/types/visitor';
import { formatDateTime } from '@/utils/dateUtils';
import { VisitorForm } from '@/components/VisitorForm';
import { GuestGrid } from '@/components/GuestGrid';

type TabType = 'active' | 'all';

// Reusable Components
const LoadingSpinner = ({ text = 'Memuat data...' }: { text?: string }) => (
  <div className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-md">
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    {text}
  </div>
);

const TabButton = ({
  active,
  onClick,
  label,
  count,
  showCount = true,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count?: number;
  showCount?: boolean;
}) => (
  <button
    onClick={onClick}
    className={`${
      active
        ? 'border-blue-500 text-blue-600'
        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
  >
    {label}
    {showCount && count !== undefined && (
      <span className="ml-2 bg-blue-100 text-blue-600 text-xs font-medium px-2.5 py-0.5 rounded-full">
        {count}
      </span>
    )}
  </button>
);

const DashboardPage = () => {
  // State
  const [activeTab, setActiveTab] = useState<TabType>('active');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVisitor, setEditingVisitor] = useState<Visitor | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [allVisitors, setAllVisitors] = useState<Visitor[]>([]);
  const [isLoadingAll, setIsLoadingAll] = useState(false);
  const [allLastVisible, setAllLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMoreAll, setHasMoreAll] = useState(true);
  const [isLoadingMoreAll, setIsLoadingMoreAll] = useState(false);
  
  // Pagination state
  const [activePage, setActivePage] = useState(1);
  const [allPage, setAllPage] = useState(1);
  const [pageSize] = useState(10);

  // Hooks
  const { 
    visitors, 
    loading, 
    addVisitor, 
    updateVisitor, 
    deleteVisitor,
    deletedVisitor,
    getAllVisitors,
    refreshVisitors
  } = useVisitors();

  // Load all visitors when tab changes to 'all' or on mount
  const loadAllVisitors = useCallback(async () => {
    if (activeTab === 'all' && allVisitors.length === 0) {
      try {
        setIsLoadingAll(true);
        const { visitors: fetchedVisitors, lastVisible } = await getAllVisitors();
        setAllVisitors(fetchedVisitors);
        setAllLastVisible(lastVisible);
        setHasMoreAll(fetchedVisitors.length === 10);
      } catch (error) {
        console.error('Error loading all visitors:', error);
      } finally {
        setIsLoadingAll(false);
      }
    }
  }, [activeTab, allVisitors.length, getAllVisitors]);

  useEffect(() => {
    loadAllVisitors();
  }, [loadAllVisitors]);

  // Load more all visitors
  const loadMoreAll = useCallback(async () => {
    if (!allLastVisible || !hasMoreAll || isLoadingMoreAll) return;
    
    try {
      setIsLoadingMoreAll(true);
      const { visitors: moreVisitors, lastVisible } = await getAllVisitors(allLastVisible);
      setAllVisitors(prev => {
        // Filter out any duplicates that might exist
        const existingIds = new Set(prev.map(v => v.id));
        const newVisitors = moreVisitors.filter(v => !existingIds.has(v.id));
        return [...prev, ...newVisitors];
      });
      setAllLastVisible(lastVisible);
      setHasMoreAll(moreVisitors.length > 0);
      setAllPage(prev => prev + 1);
    } catch (error) {
      console.error('Error loading more visitors:', error);
    } finally {
      setIsLoadingMoreAll(false);
    }
  }, [allLastVisible, hasMoreAll, isLoadingMoreAll, getAllVisitors]);

  // Refresh data when needed
  useEffect(() => {
    if (activeTab === 'active') {
      refreshVisitors();
    }
  }, [activeTab, refreshVisitors]);

  // Memoized values
  const currentVisitors = useMemo(
    () => (activeTab === 'all' ? allVisitors : visitors),
    [activeTab, allVisitors, visitors]
  );

  const currentLoading = useMemo(
    () => (activeTab === 'all' ? isLoadingAll : loading),
    [activeTab, isLoadingAll, loading]
  );
  
  // For active tab, show all visitors without pagination
  const paginatedVisitors = useMemo(() => {
    if (activeTab === 'active') {
      return [...visitors]; // Return all active visitors
    }
    // For 'all' tab, keep pagination
    const startIndex = (allPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return allVisitors.slice(startIndex, endIndex);
  }, [activeTab, activePage, allPage, visitors, allVisitors, pageSize]);
  
  // For active tab, always show 1 page since we're showing all
  const totalActivePages = 1;
  // For all tab, calculate pages normally
  const totalAllPages = Math.ceil(allVisitors.length / pageSize);

  // Event Handlers
  const handleAddVisitor = useCallback(
    async (data: CreateVisitorDTO) => {
      try {
        await addVisitor(data);
        setIsFormOpen(false);
      } catch (error) {
        console.error('Error adding visitor:', error);
      }
    },
    [addVisitor]
  );

  const handleUpdateVisitor = useCallback(
    async (data: UpdateVisitorDTO) => {
      if (!editingVisitor?.id) return;
      try {
        await updateVisitor(editingVisitor.id, data);
        setIsFormOpen(false);
        setEditingVisitor(null);
      } catch (error) {
        console.error('Error updating visitor:', error);
      }
    },
    [editingVisitor, updateVisitor]
  );

  const handleDeleteVisitor = useCallback(
    async (id: string) => {
      setDeletingId(id);
      try {
        await deleteVisitor(id);
      } catch (error) {
        console.error('Error deleting visitor:', error);
      } finally {
        setDeletingId(null);
      }
    },
    [deleteVisitor]
  );

  const openForm = useCallback(() => {
    setEditingVisitor(null);
    setIsFormOpen(true);
  }, [setEditingVisitor, setIsFormOpen]);

  const openEditForm = useCallback((visitor: Visitor) => {
    setEditingVisitor(visitor);
    setIsFormOpen(true);
  }, []);

  const closeForm = useCallback(() => {
    setIsFormOpen(false);
    setEditingVisitor(null);
  }, []);

  // Load all visitors when the tab changes
  useEffect(() => {
    const loadAllVisitors = async () => {
      if (activeTab === 'all') {
        setIsLoadingAll(true);
        try {
          const result = await getAllVisitors();
          setAllVisitors(result.visitors);
          setAllLastVisible(result.lastVisible);
          setHasMoreAll(result.hasMore);
        } catch (error) {
          console.error('Error loading all visitors:', error);
        } finally {
          setIsLoadingAll(false);
        }
      }
    };

    loadAllVisitors();
  }, [activeTab, getAllVisitors]);

  // Pagination handlers
  const handleActivePageChange = (page: number) => {
    setActivePage(page);
  };

  const handleAllPageChange = (page: number) => {
    setAllPage(page);
  };

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activePage, allPage]);

  // Render
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Daftar Tamu</h1>
            <p className="mt-2 text-sm text-gray-700">
              Daftar tamu yang telah mengisi buku tamu
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              type="button"
              onClick={openForm}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
              Tambah Tamu
            </button>
          </div>
        </div>
        
        {/* Loading indicator */}
        {currentLoading && (
          <div className="mt-4 text-center">
            <LoadingSpinner />
          </div>
        )}

        <div className="mt-8">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <TabButton
                active={activeTab === 'active'}
                onClick={() => setActiveTab('active')}
                label="Tamu Aktif"
                count={visitors.length}
              />
              <TabButton
                active={activeTab === 'all'}
                onClick={() => setActiveTab('all')}
                label="Semua Data"
                count={activeTab === 'all' ? allVisitors.length : undefined}
                showCount={activeTab === 'all'}
              />
            </nav>
          </div>

          {activeTab === 'active' ? (
            <div className="mt-8">
              <div className="max-h-[600px] overflow-y-auto">
                <GuestGrid 
                  visitors={paginatedVisitors}
                  loading={loading}
                  onAddClick={openForm}
                  onEdit={openEditForm} 
                  onDelete={handleDeleteVisitor} 
                  deletingId={deletingId} 
                />
                
                {visitors.length > 0 && (
                  <div className="mt-4">
                    <Pagination
                      currentPage={activePage}
                      totalPages={totalActivePages}
                      totalItems={visitors.length}
                      itemsPerPage={pageSize}
                      onPageChange={handleActivePageChange}
                      className="mt-4"
                    />
                  </div>
                )}
                
                {visitors.length === 0 && !loading && (
                  <div className="p-4 text-center text-sm text-gray-500">
                    Tidak ada data tamu aktif
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="overflow-y-auto max-h-[600px]">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                        Nama Tamu
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Instansi
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Kategori
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Check-in
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedVisitors.length > 0 ? (
                      paginatedVisitors.map((visitor) => (
                        <tr key={visitor.id} className={visitor.deletedAt ? 'bg-gray-50' : ''}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                                {visitor.fullName?.charAt(0) || '?'}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {visitor.fullName}
                                  {visitor.deletedAt && (
                                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                      Dihapus
                                    </span>
                                  )}
                                </div>
                                <div className="text-sm text-gray-500">{visitor.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{visitor.institution || '-'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              visitor.guestCategory === 'vip' 
                                ? 'bg-purple-100 text-purple-800' 
                                : visitor.guestCategory === 'supplier'
                                ? 'bg-yellow-100 text-yellow-800'
                                : visitor.guestCategory === 'intern'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {visitor.guestCategory?.toUpperCase() || 'REGULAR'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDateTime(visitor.checkIn, 'id-ID')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {visitor.checkOutTime 
                              ? `Check-out: ${formatDateTime(visitor.checkOutTime, 'id-ID')}`
                              : visitor.deletedAt
                                ? `Dihapus: ${formatDateTime(visitor.deletedAt, 'id-ID')}`
                                : 'Masuk'}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                          {isLoadingAll ? 'Memuat data...' : 'Tidak ada data tamu yang ditemukan'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                
                {allVisitors.length > 0 && (
                  <div className="mt-4 px-4 pb-4">
                    <Pagination
                      currentPage={allPage}
                      totalPages={totalAllPages}
                      totalItems={allVisitors.length}
                      itemsPerPage={pageSize}
                      onPageChange={handleAllPageChange}
                      className="mt-4"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Form Modal */}
      <Transition.Root show={isFormOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeForm}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div>
                    <div className="mt-3 text-center sm:mt-5">
                      <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                        {editingVisitor ? 'Edit Data Tamu' : 'Tambah Tamu Baru'}
                      </Dialog.Title>
                      <div className="mt-4">
                        <VisitorForm
                          initialData={editingVisitor || undefined}
                          onSubmit={editingVisitor ? handleUpdateVisitor : handleAddVisitor}
                          onCancel={closeForm} 
                          isSubmitting={false}
                        />
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Deletion Notification */}
      {deletedVisitor.visitor && (
        <div className="fixed bottom-4 right-4 max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden">
          <div className="p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div className="ml-3 w-0 flex-1 pt-0.5">
                <p className="text-sm font-medium text-gray-900">Berhasil</p>
                <p className="mt-1 text-sm text-gray-500">
                  Data tamu {deletedVisitor.visitor.fullName} berhasil dihapus
                </p>
              </div>
              <div className="ml-4 flex-shrink-0 flex">
                <button
                  type="button"
                  className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => {}}
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
