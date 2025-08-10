'use client';

import { useState, useCallback } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useVisitors } from '@/hooks/useVisitors';
import { Visitor, CreateVisitorDTO, UpdateVisitorDTO } from '@/types/visitor';
import { VisitorForm } from '@/components/VisitorForm';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { GuestGrid } from '@/components/GuestGrid';

export default function Dashboard() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVisitor, setEditingVisitor] = useState<Visitor | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const { 
    visitors, 
    loading, 
    addVisitor, 
    updateVisitor, 
    deleteVisitor,
    deletedVisitor
  } = useVisitors();

  const handleAddVisitor = useCallback(async (data: CreateVisitorDTO) => {
    try {
      await addVisitor(data);
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error adding visitor:', error);
    }
  }, [addVisitor]);

  const handleUpdateVisitor = useCallback(async (data: UpdateVisitorDTO) => {
    if (!editingVisitor?.id) return;
    try {
      await updateVisitor(editingVisitor.id, data);
      setIsFormOpen(false);
      setEditingVisitor(null);
    } catch (error) {
      console.error('Error updating visitor:', error);
    }
  }, [editingVisitor, updateVisitor]);

  const handleDeleteVisitor = useCallback(async (id: string) => {
    setDeletingId(id);
    try {
      await deleteVisitor(id);
    } catch (error) {
      console.error('Error deleting visitor:', error);
    } finally {
      setDeletingId(null);
    }
  }, [deleteVisitor]);

  const openAddForm = useCallback(() => {
    setEditingVisitor(null);
    setIsFormOpen(true);
  }, []);

  const openEditForm = useCallback((visitor: Visitor) => {
    setEditingVisitor(visitor);
    setIsFormOpen(true);
  }, []);

  const closeForm = useCallback(() => {
    setIsFormOpen(false);
    setEditingVisitor(null);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Daftar Tamu</h1>
            <p className="mt-2 text-sm text-gray-700">
              Daftar tamu yang telah melakukan check-in
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              type="button"
              onClick={openAddForm}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Tambah Tamu
            </button>
          </div>
        </div>

        <div className="mt-8">
          <GuestGrid
            visitors={visitors}
            loading={loading}
            onAddClick={openAddForm}
            onEdit={openEditForm}
            onDelete={handleDeleteVisitor}
            deletingId={deletingId}
          />
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

      {/* Undo Notification */}
      {deletedVisitor.visitor && (
        <div className="fixed bottom-4 right-4 max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden">
          <div className="p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <svg
                  className="h-6 w-6 text-yellow-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div className="ml-3 w-0 flex-1 pt-0.5">
                <p className="text-sm font-medium text-gray-900">Tamu dihapus</p>
                <p className="mt-1 text-sm text-gray-500">
                  {deletedVisitor.visitor?.fullName} telah dihapus.
                </p>
                <div className="mt-3 flex space-x-4">
                  <button
                    type="button"
                    onClick={() => deletedVisitor.undo?.()}
                    className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500 focus:outline-none"
                  >
                    Batalkan
                  </button>
                  <button
                    type="button"
                    onClick={() => deletedVisitor.undo = null}
                    className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-gray-500 focus:outline-none"
                  >
                    Tutup
                  </button>
                </div>
              </div>
              <div className="ml-4 flex-shrink-0 flex">
                <button
                  className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => deletedVisitor.undo = null}
                >
                  <span className="sr-only">Tutup</span>
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
