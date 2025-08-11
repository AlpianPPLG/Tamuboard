import { useState, useEffect, useCallback, useRef } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { createVisitor, updateVisitor, toVisitor, hardDeleteVisitor, deleteVisitor } from '@/lib/firestore-service';
import { Visitor, CreateVisitorDTO, UpdateVisitorDTO } from '@/types/visitor';

export const useVisitors = () => {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [deletedVisitor, setDeletedVisitor] = useState<{ visitor: Visitor | null; undo: (() => void) | null }>({ 
    visitor: null, 
    undo: null 
  });
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pendingUpdates = useRef<Record<string, Partial<Visitor>>>({});
  const updateTimeout = useRef<NodeJS.Timeout | null>(null);

  // Real-time listener for visitors collection
  useEffect(() => {
    setLoading(true);
    
    const q = query(
      collection(db, 'visitors'),
      where('deletedAt', '==', null),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const updatedVisitors = snapshot.docs.map(doc => toVisitor(doc));
        
        // Apply any pending optimistic updates
        const visitorsWithOptimisticUpdates = updatedVisitors.map(visitor => ({
          ...visitor,
          ...(pendingUpdates.current[visitor.id!] || {})
        }));
        
        setVisitors(visitorsWithOptimisticUpdates);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching visitors:', err);
        setError(err as Error);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (updateTimeout.current) clearTimeout(updateTimeout.current);
    };
  }, []);

  // Optimistically add a visitor
  const addVisitor = useCallback(async (data: CreateVisitorDTO): Promise<Visitor> => {
    const newVisitor: Visitor = {
      ...data,
      id: 'temp-' + Date.now(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Optimistic update
    setVisitors(prev => [newVisitor, ...prev]);

    try {
      // Actual Firestore operation
      const createdVisitor = await createVisitor(data);
      
      // Replace the temporary visitor with the actual one
      setVisitors(prev => 
        prev.map(v => v.id === newVisitor.id ? createdVisitor : v)
      );
      
      return createdVisitor;
    } catch (err) {
      // Rollback on error
      setVisitors(prev => prev.filter(v => v.id !== newVisitor.id));
      throw err;
    }
  }, []);

  // Debounced update function
  const debouncedUpdate = useCallback((id: string, updates: UpdateVisitorDTO) => {
    // Store pending updates
    pendingUpdates.current = {
      ...pendingUpdates.current,
      [id]: { ...pendingUpdates.current[id], ...updates, updatedAt: new Date() }
    };

    // Clear any pending update timeout
    if (updateTimeout.current) {
      clearTimeout(updateTimeout.current);
    }

    // Set a new timeout
    updateTimeout.current = setTimeout(async () => {
      try {
        await updateVisitor(id, updates);
        // Clear the pending update on success
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [id]: _, ...rest } = pendingUpdates.current;
        pendingUpdates.current = rest;
      } catch (err) {
        console.error('Error updating visitor:', err);
        // On error, trigger a re-fetch to get the latest data
        setVisitors(prev => [...prev]);
      }
    }, 500); // 500ms debounce
  }, []);

  // Update visitor with optimistic UI
  const updateVisitorOptimistic = useCallback(async (id: string, updates: UpdateVisitorDTO): Promise<void> => {
    // Optimistic update
    setVisitors(prev => 
      prev.map(visitor => 
        visitor.id === id 
          ? { ...visitor, ...updates, updatedAt: new Date() } 
          : visitor
      )
    );

    // Debounced Firestore update
    debouncedUpdate(id, updates);
  }, [debouncedUpdate]);

  // Delete visitor with undo option
  const deleteVisitorWithUndo = useCallback(async (id: string): Promise<void> => {
    const visitorToDelete = visitors.find(v => v.id === id);
    if (!visitorToDelete) return;

    // Optimistic update
    setVisitors(prev => prev.filter(v => v.id !== id));

    // Store the deleted visitor for potential undo
    const undo = async () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        setDeletedVisitor({ visitor: null, undo: null });
        
        // Re-add the visitor
        setVisitors(prev => [visitorToDelete, ...prev]);
        
        // Update Firestore to remove the deletedAt field
        await updateVisitor(visitorToDelete.id!, { deletedAt: null } as UpdateVisitorDTO);
      }
    };

    // Set timeout for undo (5 seconds)
    setDeletedVisitor({ visitor: visitorToDelete, undo });
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(async () => {
      try {
        // After timeout, perform the actual delete
        await deleteVisitor(id);
        setDeletedVisitor({ visitor: null, undo: null });
      } catch (err) {
        console.error('Error deleting visitor:', err);
        // On error, revert the optimistic update
        setVisitors(prev => [visitorToDelete, ...prev]);
      }
    }, 5000);

  }, [visitors]);

  // Permanently delete a visitor (no undo)
  const permanentDelete = useCallback(async (id: string): Promise<void> => {
    // Optimistic update
    setVisitors(prev => prev.filter(v => v.id !== id));
    
    try {
      await hardDeleteVisitor(id);
    } catch (err) {
      console.error('Error permanently deleting visitor:', err);
      // On error, trigger a re-fetch to get the latest data
      setVisitors(prev => [...prev]);
      throw err;
    }
  }, []);

  return {
    visitors,
    loading,
    error: error || null,
    addVisitor: addVisitor || (() => Promise.reject(new Error('addVisitor not initialized'))),
    updateVisitor: updateVisitorOptimistic || (() => Promise.reject(new Error('updateVisitor not initialized'))),
    deleteVisitor: deleteVisitorWithUndo || (() => Promise.reject(new Error('deleteVisitor not initialized'))),
    permanentDelete: permanentDelete || (() => Promise.reject(new Error('permanentDelete not initialized'))),
    deletedVisitor,
  };
};
