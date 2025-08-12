import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  limit, 
  startAfter,
  DocumentData,
  QueryDocumentSnapshot
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { createVisitor, updateVisitor, toVisitor, hardDeleteVisitor, deleteVisitor } from '@/lib/firestore-service';
import { Visitor, CreateVisitorDTO, UpdateVisitorDTO } from '@/types/visitor';

export const VISITORS_PER_PAGE = 20;

export const useVisitors = () => {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [deletedVisitor, setDeletedVisitor] = useState<{
    visitor: Visitor | null;
    undo: (() => void) | null;
  }>({
    visitor: null,
    undo: null
  });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  
  const pendingUpdates = useRef<Record<string, Partial<Visitor>>>({});
  const updateTimeout = useRef<NodeJS.Timeout | null>(null);
  const lastDocRef = useRef<QueryDocumentSnapshot<DocumentData> | null>(null);
  const firstDocRef = useRef<QueryDocumentSnapshot<DocumentData> | null>(null);

  // Load all active visitors at once
  const loadVisitors = useCallback(async () => {
    try {
      setLoading(true);
      
      // Query to get all active visitors
      const q = query(
        collection(db, 'visitors'),
        where('deletedAt', '==', null),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const allVisitors = querySnapshot.docs.map(doc => toVisitor(doc));
      
      // Update state with all visitors
      setVisitors(allVisitors);
      setTotalItems(allVisitors.length);
      setTotalPages(1);
      setCurrentPage(1);
      
      // Update document references (though not needed for pagination anymore)
      if (querySnapshot.docs.length > 0) {
        firstDocRef.current = querySnapshot.docs[0];
        lastDocRef.current = querySnapshot.docs[querySnapshot.docs.length - 1];
      }
    } catch (err) {
      console.error('Error loading visitors:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Load initial data
  useEffect(() => {
    loadVisitors();
  }, [loadVisitors]);

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

  // Note: Removed unused deleteVisitorWithUndo function as it was not being used

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

  // Function to get all visitors including deleted ones with pagination
  const getAllVisitors = useCallback(async (startAfterDoc: QueryDocumentSnapshot<DocumentData> | null = null, limitCount: number = VISITORS_PER_PAGE) => {
    try {
      setIsLoadingMore(!!startAfterDoc);
      
      let q = query(
        collection(db, 'visitors'),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      
      if (startAfterDoc) {
        q = query(q, startAfter(startAfterDoc));
      }
      
      const querySnapshot = await getDocs(q);
      const allVisitors = querySnapshot.docs.map(doc => toVisitor(doc));
      
      return {
        visitors: allVisitors,
        lastVisible: querySnapshot.docs[querySnapshot.docs.length - 1] || null,
        hasMore: querySnapshot.docs.length === limitCount
      };
    } catch (err) {
      console.error('Error fetching all visitors:', err);
      setError(err as Error);
      return { visitors: [], lastVisible: null, hasMore: false };
    } finally {
      setIsLoadingMore(false);
      if (!startAfterDoc) {
        setLoading(false);
      }
    }
  }, []);
  
  // Function to load more visitors (for pagination)
  const loadMoreVisitors = useCallback(async (lastVisible: QueryDocumentSnapshot<DocumentData> | null) => {
    if (!lastVisible) return { visitors: [], lastVisible: null, hasMore: false };
    
    try {
      const q = query(
        collection(db, 'visitors'),
        where('deletedAt', '==', null),
        orderBy('createdAt', 'desc'),
        startAfter(lastVisible),
        limit(VISITORS_PER_PAGE)
      );
      
      const querySnapshot = await getDocs(q);
      const newVisitors = querySnapshot.docs.map(doc => toVisitor(doc));
      const newLastVisible = querySnapshot.docs[querySnapshot.docs.length - 1] || null;
      
      return {
        visitors: newVisitors,
        lastVisible: newLastVisible,
        hasMore: !querySnapshot.empty
      };
    } catch (err) {
      console.error('Error loading more visitors:', err);
      setError(err as Error);
      return { visitors: [], lastVisible: null, hasMore: false };
    }
  }, []);
  
  // Function to refresh visitors
  const refreshVisitors = useCallback(async () => {
    await loadVisitors();
  }, [loadVisitors]);

  // Handle page change - no longer needed for active tab, but keeping for compatibility
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    // No need to load data here as we're loading all visitors at once
  }, []);

  // Handle delete with undo
  const handleDeleteWithUndo = useCallback(async (visitorId: string) => {
    try {
      setLoading(true);
      
      // Find the visitor object first
      const visitorToDelete = visitors.find(v => v.id === visitorId);
      if (!visitorToDelete) return;
      
      // Optimistic update
      setVisitors(prev => prev.filter(v => v.id !== visitorId));
      
      // Show undo notification
      const undo = async () => {
        await updateVisitor(visitorId, { deletedAt: null });
        setVisitors(prev => [visitorToDelete, ...prev]);
      };
      
      setDeletedVisitor({ visitor: visitorToDelete, undo });
      
      // Reset after 5 seconds
      const timeoutId = setTimeout(() => {
        setDeletedVisitor({ visitor: null, undo: null });
      }, 5000);
      
      // Actual delete operation
      await deleteVisitor(visitorId);
      
      // Clear timeout if the component unmounts
      return () => clearTimeout(timeoutId);
    } catch (err) {
      console.error('Error deleting visitor:', err);
      setError(err as Error);
      // Revert optimistic update on error
      setVisitors(prev => [...prev]);
    } finally {
      setLoading(false);
    }
  }, [visitors]);

  return {
    visitors,
    loading,
    error,
    addVisitor,
    updateVisitor: updateVisitorOptimistic,
    deleteVisitor: handleDeleteWithUndo,
    permanentDelete,
    deletedVisitor,
    getAllVisitors,
    loadMoreVisitors,
    refreshVisitors,
    currentPage,
    totalPages,
    totalItems,
    handlePageChange,
    isLoadingMore,
    hasMore: !!lastDocRef.current,
    VISITORS_PER_PAGE,
  };
};
