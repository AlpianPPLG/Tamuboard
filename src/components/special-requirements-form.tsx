"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Guest, SpecialRequirement } from "@/types/guest";
import { GuestStorage } from "@/lib/guest-stotrage";

interface SpecialRequirementsFormProps {
  guest: Guest & { id: string }; // pastikan id tidak undefined
  onUpdate?: () => void;
}

// Helper konstan
const TEMPLATE_MAP: Record<string, Omit<SpecialRequirement, "id">[]> = {
  Meeting: [
    { type: "other", description: "Proyektor" },
    { type: "other", description: "Whiteboard" },
    { type: "food", description: "Snack" },
  ],
  Training: [
    { type: "other", description: "Laptop" },
    { type: "food", description: "Makan siang" },
    { type: "accommodation", description: "Penginapan" },
  ],
  Interview: [
    { type: "other", description: "Ruangan tertutup" },
    { type: "other", description: "Minuman" },
  ],
};

const TYPE_LABEL: Record<SpecialRequirement["type"], string> = {
  food: "Makanan",
  accommodation: "Akomodasi",
  other: "Lainnya",
};

export function SpecialRequirementsForm({
  guest,
  onUpdate,
}: SpecialRequirementsFormProps) {
  const [requirements, setRequirements] = useState<SpecialRequirement[]>(
    guest.specialRequirements ?? []
  );
  const [newReq, setNewReq] = useState<Omit<SpecialRequirement, "id">>({
    type: "other",
    description: "",
  });

  // Stabilkan ref agar useEffect tidak memicu ulang
  const guestRef = useRef(guest);
  useEffect(() => {
    guestRef.current = guest;
  }, [guest]);

  // Persist ke storage
  useEffect(() => {
    GuestStorage.updateGuest(guestRef.current.id, {
      specialRequirements: requirements,
    });
    onUpdate?.();
  }, [requirements, onUpdate]);

  const handleAdd = () => {
    if (!newReq.description.trim()) return;
    setRequirements((prev) => [
      ...prev,
      { ...newReq, id: Date.now().toString() },
    ]);
    setNewReq({ type: "other", description: "" });
  };

  const handleRemove = (id: string) =>
    setRequirements((prev) => prev.filter((r) => r.id !== id));

  const templates = TEMPLATE_MAP[guest.purpose] ?? [];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium mb-2">Keperluan Khusus</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Tambahkan kebutuhan khusus untuk kunjungan ini
        </p>
      </div>

      {/* Template */}
      {templates.length > 0 && (
        <div className="space-y-2">
          <Label>Template ({guest.purpose})</Label>
          <div className="flex flex-wrap gap-2">
            {templates.map((tpl, idx) => (
              <Button
                key={idx}
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setRequirements((prev) => [
                    ...prev,
                    { ...tpl, id: Date.now().toString() },
                  ])
                }
                disabled={requirements.some(
                  (r) => r.description === tpl.description
                )}
              >
                {tpl.description}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Form tambah */}
      <div className="flex gap-2">
        <select
          value={newReq.type}
          onChange={(e) =>
            setNewReq({
              ...newReq,
              type: e.target.value as SpecialRequirement["type"],
            })
          }
          className="flex h-10 w-32 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <option value="food">Makanan</option>
          <option value="accommodation">Akomodasi</option>
          <option value="other">Lainnya</option>
        </select>
        <Input
          placeholder="Contoh: Proyektor"
          value={newReq.description}
          onChange={(e) =>
            setNewReq({ ...newReq, description: e.target.value })
          }
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        />
        <Button type="button" onClick={handleAdd}>
          Tambah
        </Button>
      </div>

      {/* Daftar */}
      {requirements.length > 0 && (
        <div className="space-y-2">
          <Label>Daftar Kebutuhan</Label>
          {requirements.map((r) => (
            <div
              key={r.id}
              className="flex items-center justify-between rounded-md border p-3"
            >
              <span className="inline-flex items-center gap-2">
                <span className="text-sm font-medium">
                  {TYPE_LABEL[r.type]}
                </span>
                <span>{r.description}</span>
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemove(r.id!)}
              >
                Hapus
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
