"use client";

import { useState, useEffect } from "react";
import { Guest } from "@/types/guest";
import { GuestStorage } from "@/lib/guest-stotrage";
import TrashManager from "@/lib/trash-manager";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, RotateCcw } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { TestTrashItem } from "./test-utils";

const createTestGuest = (id: number): Omit<Guest, "id"> => ({
  name: `Test Guest ${id}`,
  institution: `Test Institution ${id}`,
  purpose: `Test Purpose ${id}`,
  phone: `+62812345678${id}`,
  email: `test${id}@example.com`,
  category: id % 2 === 0 ? "VIP" : "regular",
  visitTime: "morning",
  visitDate: new Date(),
  checkInTime: new Date().toISOString(),
  status: "checked-in",
  deletedAt: new Date(),
});

export default function TrashTestPage() {
  useLanguage();
  const [testGuests, setTestGuests] = useState<Guest[]>([]);
  const [trashItems, setTrashItems] = useState<Guest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTestData();
    
    const unsubscribe = TrashManager.onChange(loadTrash);
    
    return () => {
      unsubscribe();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadTestData = () => {
    const guests = GuestStorage.getGuests(true);
    const testGuests = guests.filter(g => g.name.startsWith("Test Guest"));
    setTestGuests(testGuests);
    loadTrash();
    setIsLoading(false);
  };

  const loadTrash = () => {
    const trash = TrashManager.getTrash();
    setTrashItems(trash);
  };

  const createTestGuestHandler = () => {
    const id = Math.floor(Math.random() * 1000);
    const newGuest = {
      ...createTestGuest(id),
      id: `test-${Date.now()}-${id}`,
    };
    
    GuestStorage.addGuest(newGuest);
    loadTestData();
  };

  const moveToTrash = async (id: string) => {
    try {
      await TrashManager.moveToTrash(id, 'test-user');
      loadTestData();
    } catch (error) {
      console.error('Error moving to trash:', error);
    }
  };

  const restoreFromTrash = async (id: string) => {
    try {
      await TrashManager.restoreFromTrash(id);
      loadTestData();
    } catch (error) {
      console.error('Error restoring from trash:', error);
    }
  };

  const deletePermanently = (id: string) => {
    const guests = GuestStorage.getGuests(true).filter(g => g.id !== id);
    GuestStorage.saveGuests(guests);
    loadTestData();
  };

  const resetTestData = () => {
  const deletePermanently = async (id: string) => {
    try {
      await GuestStorage.permanentDelete(id);
      loadTestData();
    } catch (error) {
      console.error('Error deleting permanently:', error);
    }
  };

  const resetTestData = async () => {
    try {
      const guests = await GuestStorage.getGuests(true);
      const testGuests = guests.filter(g => g.name.startsWith("Test Guest"));
      
      // Delete all test guests permanently
      for (const guest of testGuests) {
        await GuestStorage.permanentDelete(guest.id);
      }
      
      loadTestData();
    } catch (error) {
      console.error('Error resetting test data:', error);
    }
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Trash Feature Test</h1>
        <div className="flex gap-4 mb-6">
          <Button onClick={createTestGuestHandler}>
            <Plus className="h-4 w-4 mr-2" />
            Create Test Guest
          </Button>
          <Button variant="outline" onClick={resetTestData}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset Test Data
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Active Test Guests ({testGuests.length})</h2>
            <div className="space-y-4">
              {testGuests.length === 0 ? (
                <p className="text-muted-foreground">No active test guests</p>
              ) : (
                testGuests.map(guest => (
                  <div key={guest.id} className="border p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{guest.name}</h3>
                        <p className="text-sm text-muted-foreground">{guest.institution}</p>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => moveToTrash(guest.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Move to Trash
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Trash ({trashItems.length})</h2>
            <div className="space-y-4">
              {trashItems.length === 0 ? (
                <p className="text-muted-foreground">Trash is empty</p>
              ) : (
                trashItems.map(guest => (
                  <TestTrashItem
                    key={guest.id}
                    guest={guest}
                    onRestore={restoreFromTrash}
                    onDelete={deletePermanently}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 p-6 bg-muted/50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Test Instructions</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Click Create Test Guest to add a test guest</li>
          <li>Click Move to Trash to move a guest to the trash</li>
          <li>Verify the guest appears in the Trash section with the correct expiration time</li>
          <li>Test restoring a guest from trash</li>
          <li>Test permanent deletion of a guest</li>
          <li>Use Reset Test Data to clean up after testing</li>
        </ol>
      </div>
    </div>
  );
}
