"use client"

import { useState, useEffect } from 'react';
import { Guest, GuestStorage } from '@/lib/guest-stotrage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Tag } from 'lucide-react';
import { toast } from 'sonner';

export function TagManagement({ guest, onUpdate }: { guest: Guest; onUpdate: () => void }) {
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [allTags, setAllTags] = useState<string[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    // Load all available tags
    setAllTags(GuestStorage.getAllTags());
    
    // Load current guest's tags
    if (guest?.tags) {
      setTags([...guest.tags]);
    }
  }, [guest]);

  const handleAddTag = () => {
    if (!newTag.trim()) return;
    
    const tag = newTag.trim();
    
    // Add tag to guest
    const success = GuestStorage.addTagToGuest(guest.id, tag);
    
    if (success) {
      setTags(prev => [...prev, tag]);
      setAllTags(prev => Array.from(new Set([...prev, tag])));
      setNewTag('');
      onUpdate();
      toast.success(`Tag "${tag}" ditambahkan`);
    } else {
      toast.error('Gagal menambahkan tag');
    }
    
    setIsAdding(false);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const success = GuestStorage.removeTagFromGuest(guest.id, tagToRemove);
    
    if (success) {
      setTags(prev => prev.filter(tag => tag !== tagToRemove));
      onUpdate();
      toast.success(`Tag "${tagToRemove}" dihapus`);
    } else {
      toast.error('Gagal menghapus tag');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTag();
    } else if (e.key === 'Escape') {
      setIsAdding(false);
      setNewTag('');
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">Tag</h4>
        {!isAdding && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs"
            onClick={() => setIsAdding(true)}
          >
            <Plus className="h-3 w-3 mr-1" />
            Tambah Tag
          </Button>
        )}
      </div>
      
      {/* Current Tags */}
      <div className="flex flex-wrap gap-2">
        {tags.length > 0 ? (
          tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
              <Tag className="h-3 w-3" />
              <span>{tag}</span>
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="ml-1 hover:text-destructive"
                title={`Hapus tag ${tag}`}
                aria-label={`Hapus tag ${tag}`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">Belum ada tag</p>
        )}
      </div>

      {/* Add Tag Form */}
      {isAdding && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              placeholder="Nama tag"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              className="h-8"
            />
            <Button size="sm" onClick={handleAddTag} disabled={!newTag.trim()}>
              Tambah
            </Button>
            <Button variant="outline" size="sm" onClick={() => setIsAdding(false)}>
              Batal
            </Button>
          </div>
          
          {/* Suggested Tags */}
          {allTags.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Tag yang tersedia:</p>
              <div className="flex flex-wrap gap-1">
                {allTags
                  .filter(tag => !tags.includes(tag))
                  .filter(tag => tag.toLowerCase().includes(newTag.toLowerCase()))
                  .slice(0, 5)
                  .map(tag => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="cursor-pointer hover:bg-secondary/80"
                      onClick={() => {
                        setNewTag(tag);
                        // Auto-add if clicking on a suggested tag
                        setTimeout(() => {
                          handleAddTag();
                        }, 100);
                      }}
                    >
                      {tag}
                    </Badge>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
