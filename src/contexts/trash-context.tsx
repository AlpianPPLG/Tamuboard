"use client"

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Visitor } from '@/types/visitor';
import { toast } from 'sonner';

interface TrashItem extends Visitor {
  deletedAt: Date;
}

interface TrashContextType {
  trash: TrashItem[];
  addToTrash: (visitor: Visitor) => void;
  restoreFromTrash: (id: string) => void;
  removeFromTrash: (id: string) => void;
  clearTrash: () => void;
  isInTrash: (id: string) => boolean;
}

const TrashContext = createContext<TrashContextType | undefined>(undefined);

export function TrashProvider({ children }: { children: ReactNode }) {
  const [trash, setTrash] = useState<TrashItem[]>([]);

  const addToTrash = useCallback((visitor: Visitor) => {
    setTrash(prev => [...prev, { ...visitor, deletedAt: new Date() }]);
  }, []);

  const restoreFromTrash = useCallback((id: string) => {
    setTrash(prev => {
      const itemToRestore = prev.find(item => item.id === id);
      if (itemToRestore) {
        toast("Item dipulihkan");
      }
      return prev.filter(item => item.id !== id);
    });
  }, []);

  const removeFromTrash = useCallback((id: string) => {
    setTrash(prev => {
      const itemToRemove = prev.find(item => item.id === id);
      if (itemToRemove) {
        toast("Item dihapus permanen");
      }
      return prev.filter(item => item.id !== id);
    });
  }, []);

  const clearTrash = useCallback(() => {
    setTrash([]);
    toast("Tong sampah dikosongkan");
  }, []);

  const isInTrash = useCallback((id: string) => {
    return trash.some(item => item.id === id);
  }, [trash]);

  return (
    <TrashContext.Provider 
      value={{
        trash,
        addToTrash,
        restoreFromTrash,
        removeFromTrash,
        clearTrash,
        isInTrash,
      }}
    >
      {children}
    </TrashContext.Provider>
  );
}

export function useTrash() {
  const context = useContext(TrashContext);
  if (context === undefined) {
    throw new Error('useTrash must be used within a TrashProvider');
  }
  return context;
}
