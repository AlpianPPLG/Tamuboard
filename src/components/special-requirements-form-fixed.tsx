"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Guest, SpecialRequirement } from "@/types/guest";
import { GuestStorage } from "@/lib/guest-stotrage";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SpecialRequirementsForm({ guest, onUpdate }: { guest: Guest; onUpdate?: () => void }) {
  const [requirements, setRequirements] = useState<SpecialRequirement[]>(
    guest.specialRequirements || []
  );
  const [newRequirement, setNewRequirement] = useState<Omit<SpecialRequirement, 'id'>>({
    type: 'other',
    description: ''
  });

  // Load purpose templates based on the guest's purpose
  const getPurposeTemplates = (purpose: string) => {
    // This would typically come from an API or configuration
    const templates: Record<string, SpecialRequirement[]> = {
      'Meeting': [
        { type: 'other', description: 'Proyektor' },
        { type: 'other', description: 'Whiteboard' },
        { type: 'food', description: 'Snack' },
      ],
      'Training': [
        { type: 'other', description: 'Laptop' },
        { type: 'food', description: 'Makan siang' },
        { type: 'accommodation', description: 'Penginapan' },
      ],
      'Interview': [
        { type: 'other', description: 'Ruangan tertutup' },
        { type: 'other', description: 'Minuman' },
      ],
    };

    return templates[purpose] || [];
  };

  const availableTemplates = getPurposeTemplates(guest.purpose);

  useEffect(() => {
    // Update the guest record when requirements change
    const updatedGuest = {
      ...guest,
      specialRequirements: requirements,
    };

    GuestStorage.updateGuest(guest.id, {
      specialRequirements: updatedGuest.specialRequirements,
    });

    onUpdate?.();
  }, [requirements, guest.id, onUpdate]);

  const addRequirement = () => {
    if (newRequirement.description.trim()) {
      setRequirements([...requirements, { ...newRequirement, id: Date.now().toString() }]);
      setNewRequirement({ type: 'other', description: '' });
    }
  };

  const removeRequirement = (index: number) => {
    const newRequirements = [...requirements];
    newRequirements.splice(index, 1);
    setRequirements(newRequirements);
  };

  const addTemplateRequirement = (template: SpecialRequirement) => {
    if (!requirements.some(r => r.description === template.description)) {
      setRequirements([...requirements, { ...template, id: Date.now().toString() }]);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium mb-2">Keperluan Khusus</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Tambahkan kebutuhan khusus untuk kunjungan ini
        </p>
      </div>

      {availableTemplates.length > 0 && (
        <div className="space-y-2">
          <Label>Template Kebutuhan ({guest.purpose})</Label>
          <div className="flex flex-wrap gap-2">
            {availableTemplates.map((template, index) => (
              <Button
                key={index}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addTemplateRequirement(template)}
                disabled={requirements.some(r => r.description === template.description)}
              >
                {template.description}
              </Button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="new-requirement">Tambah Kebutuhan Baru</Label>
        <div className="flex gap-2">
          <Select
            value={newRequirement.type}
            onValueChange={(value: 'food' | 'accommodation' | 'other') =>
              setNewRequirement({
                ...newRequirement,
                type: value,
              })
            }
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Pilih tipe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="food">Makanan</SelectItem>
              <SelectItem value="accommodation">Akomodasi</SelectItem>
              <SelectItem value="other">Lainnya</SelectItem>
            </SelectContent>
          </Select>
          <Input
            id="new-requirement"
            placeholder="Contoh: Proyektor, Ruangan Khusus, dll"
            value={newRequirement.description}
            onChange={(e) =>
              setNewRequirement({ ...newRequirement, description: e.target.value })
            }
            onKeyDown={(e) => e.key === 'Enter' && addRequirement()}
            aria-label="Deskripsi kebutuhan"
          />
          <Button type="button" onClick={addRequirement}>
            Tambah
          </Button>
        </div>
      </div>

      {requirements.length > 0 && (
        <div className="space-y-2">
          <Label>Daftar Kebutuhan</Label>
          <div className="space-y-2">
            {requirements.map((req, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-md border p-3"
              >
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                    {req.type === 'food' ? '🍽️' : req.type === 'accommodation' ? '🏨' : '📋'}
                    {req.type === 'food' ? 'Makanan' : req.type === 'accommodation' ? 'Akomodasi' : 'Lainnya'}
                  </span>
                  <span>{req.description}</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeRequirement(index)}
                  aria-label={`Hapus ${req.description}`}
                >
                  Hapus
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
