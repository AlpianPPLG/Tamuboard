"use client";

import { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { CheckCircle, Database, Loader2 } from 'lucide-react';
import { GuestStorage } from '@/lib/guest-stotrage';

export function MigrationNotice() {
  const [showNotice, setShowNotice] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  useEffect(() => {
    // Check if there's any localStorage data
    const hasLocalData = 
      localStorage.getItem('buku-tamu-guests') ||
      localStorage.getItem('savedFilters') ||
      localStorage.getItem('reminderSettings');
    
    setShowNotice(!!hasLocalData);
  }, []);

  const handleClearLocalStorage = async () => {
    setIsClearing(true);
    try {
      // Clear all localStorage data
      GuestStorage.clearLocalStorage();
      
      // Wait a bit for visual feedback
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setShowNotice(false);
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    } finally {
      setIsClearing(false);
    }
  };

  if (!showNotice) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
        <Database className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-800 dark:text-blue-200">
          Migrasi ke Firebase
        </AlertTitle>
        <AlertDescription className="text-blue-700 dark:text-blue-300 space-y-3">
          <p>
            Aplikasi sekarang menggunakan Firebase/Firestore. Data lama di localStorage dapat dihapus.
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleClearLocalStorage}
              disabled={isClearing}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isClearing ? (
                <>
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                  Menghapus...
                </>
              ) : (
                <>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Hapus Data Lama
                </>
              )}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowNotice(false)}
              className="border-blue-300 text-blue-700 hover:bg-blue-100"
            >
              Nanti Saja
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}