"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Guest, SpecialRequirement } from "@/types/guest";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, X, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/language-context";
import { toast } from "sonner";

interface SpecialRequirementsFormProps {
  guest: Guest & { id: string };
  onUpdate?: (requirements: SpecialRequirement[]) => void;
  className?: string;
}

// Template untuk kebutuhan berdasarkan tujuan kunjungan
const TEMPLATE_MAP: Record<string, Omit<SpecialRequirement, "id">[]> = {
  Meeting: [
    { type: "other", description: "Proyektor" },
    { type: "other", description: "Whiteboard" },
    { type: "food", description: "Snack" },
    { type: "other", description: "Flipchart" },
    { type: "other", description: "Sound System" },
  ],
  Training: [
    { type: "other", description: "Laptop" },
    { type: "food", description: "Makan siang" },
    { type: "accommodation", description: "Penginapan" },
    { type: "other", description: "Modul Pelatihan" },
    { type: "other", description: "Sertifikat" },
  ],
  Interview: [
    { type: "other", description: "Ruangan tertutup" },
    { type: "other", description: "Minuman" },
    { type: "other", description: "Formulir Interview" },
    { type: "other", description: "Papan Tulis" },
  ],
  Lainnya: [
    { type: "food", description: "Air Mineral" },
    { type: "food", description: "Makan Ringan" },
    { type: "other", description: "WiFi" },
    { type: "other", description: "Stop Kontak" },
  ],
};

const TYPE_LABEL: Record<SpecialRequirement["type"], { label: string; color: string }> = {
  food: { label: "Makanan", color: "bg-green-100 text-green-800 border-green-200" },
  accommodation: { label: "Akomodasi", color: "bg-blue-100 text-blue-800 border-blue-200" },
  other: { label: "Lainnya", color: "bg-gray-100 text-gray-800 border-gray-200" },
};

export function SpecialRequirementsForm({
  guest,
  onUpdate,
  className,
}: SpecialRequirementsFormProps) {
  useLanguage();
  const [requirements, setRequirements] = useState<SpecialRequirement[]>(
    guest.specialRequirements ?? []
  );
  const [newReq, setNewReq] = useState<Omit<SpecialRequirement, "id">>({
    type: "other",
    description: "",
  });
  const [showTemplate, setShowTemplate] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const guestRef = useRef(guest);

  // Update guest ref when guest changes
  useEffect(() => {
    guestRef.current = guest;
    setRequirements(guest.specialRequirements ?? []);
  }, [guest]);

  // Persist changes to storage and notify parent
  useEffect(() => {
    if (onUpdate) {
      onUpdate(requirements);
    }
  }, [requirements, onUpdate]);

  // Handle adding a new requirement
  const handleAdd = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newReq.description.trim()) {
      toast.error("Deskripsi kebutuhan tidak boleh kosong");
      return;
    }
    
    setRequirements((prev) => [
      ...prev,
      { ...newReq, id: Date.now().toString() },
    ]);
    setNewReq({ type: "other", description: "" });
    inputRef.current?.focus();
  };

  // Handle removing a requirement
  const handleRemove = (id: string) => {
    setRequirements((prev) => prev.filter((r) => r.id !== id));
    toast.success("Kebutuhan dihapus");
  };

  // Add template requirements
  const addTemplate = (template: Omit<SpecialRequirement, "id">) => {
    // Check if requirement already exists
    const exists = requirements.some(
      (req) => req.description.toLowerCase() === template.description.toLowerCase()
    );
    
    if (exists) {
      toast.warning("Kebutuhan sudah ada dalam daftar");
      return;
    }
    
    setRequirements((prev) => [
      ...prev,
      { ...template, id: Date.now().toString() },
    ]);
    toast.success("Template kebutuhan ditambahkan");
  };

  // Get templates based on guest's purpose or show all if no match
  const templates = TEMPLATE_MAP[guest.purpose] || [
    ...TEMPLATE_MAP.Meeting,
    ...TEMPLATE_MAP.Training,
    ...TEMPLATE_MAP.Interview,
    ...TEMPLATE_MAP.Lainnya,
  ].filter(
    (item, index, self) =>
      index === self.findIndex((t) => t.description === item.description)
  );

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span>Kebutuhan Tambahan</span>
          <Badge variant="outline" className="ml-2">
            {requirements.length} Item
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Form untuk menambahkan kebutuhan baru */}
        <form onSubmit={handleAdd} className="space-y-3">
          <div className="flex gap-2">
            <Select
              value={newReq.type}
              onValueChange={(value: SpecialRequirement["type"]) =>
                setNewReq({ ...newReq, type: value })
              }
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Tipe Kebutuhan" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(TYPE_LABEL).map(([type, { label }]) => (
                  <SelectItem key={type} value={type}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              ref={inputRef}
              placeholder="Contoh: Proyektor, Makan Siang, dll."
              value={newReq.description}
              onChange={(e) =>
                setNewReq({ ...newReq, description: e.target.value })
              }
              className="flex-1"
            />
            <Button type="submit" size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </form>

        {/* Daftar kebutuhan yang sudah ditambahkan */}
        {requirements.length > 0 ? (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Daftar Kebutuhan:</h4>
            <div className="space-y-2">
              {requirements.map((req) => (
                <div
                  key={req.id}
                  className="flex items-center justify-between p-2 border rounded-md hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs font-medium",
                        TYPE_LABEL[req.type].color
                      )}
                    >
                      {TYPE_LABEL[req.type].label}
                    </Badge>
                    <span>{req.description}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleRemove(req.id!)}
                  >
                    <X className="h-3.5 w-3.5 text-muted-foreground" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
            <AlertCircle className="mx-auto h-5 w-5 mb-2" />
            <p>Belum ada kebutuhan yang ditambahkan</p>
          </div>
        )}

        {/* Template Kebutuhan */}
        <div className="pt-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground h-7 px-2"
            onClick={() => setShowTemplate(!showTemplate)}
          >
            {showTemplate ? (
              <>
                <X className="h-3.5 w-3.5 mr-1" /> Sembunyikan Template
              </>
            ) : (
              <>
                <Plus className="h-3.5 w-3.5 mr-1" /> Tampilkan Template
              </>
            )}
          </Button>

          {showTemplate && (
            <div className="mt-2 space-y-2">
              <p className="text-xs text-muted-foreground">
                Pilih template kebutuhan berdasarkan tujuan kunjungan:
              </p>
              <div className="flex flex-wrap gap-2">
                {templates.map((tpl, idx) => (
                  <Button
                    key={idx}
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs h-7"
                    onClick={() => addTemplate(tpl)}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    {tpl.description}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
