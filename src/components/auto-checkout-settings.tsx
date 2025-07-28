"use client";

import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Guest } from "@/types/guest";
import { GuestStorage } from "@/lib/guest-stotrage";

interface AutoCheckoutSettingsProps {
  guest: Guest;
  onUpdate?: () => void;
}
export function AutoCheckoutSettings({ guest, onUpdate }: AutoCheckoutSettingsProps) {
  const [enabled, setEnabled] = useState<boolean>(
    guest.autoCheckoutReminder?.enabled ?? false
  );
  
  const [reminderTime, setReminderTime] = useState<'morning' | 'afternoon' | 'evening'>(
    guest.autoCheckoutReminder?.reminderTime ?? 'afternoon'
  );
  
  const [duration, setDuration] = useState<number>(
    guest.expectedDuration?.duration ?? 60
  );

  const [durationUnit, setDurationUnit] = useState<'minutes' | 'hours'>(
    guest.expectedDuration?.unit ?? 'minutes'
  );

  useEffect(() => {
    GuestStorage.updateGuest(guest.id, {
      autoCheckoutReminder: { enabled, reminderTime },
      expectedDuration: { duration, unit: durationUnit },
    });
    onUpdate?.();
  }, [enabled, reminderTime, duration, durationUnit, guest.id, onUpdate]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="auto-checkout">Aktifkan Pengingat Check-out Otomatis</Label>
          <p className="text-sm text-muted-foreground">
            Tamu akan mendapatkan notifikasi sebelum waktu check-out habis
          </p>
        </div>
        <Switch
          id="auto-checkout"
          checked={enabled}
          onCheckedChange={(checked: boolean) => setEnabled(checked)}
        />
      </div>

      {enabled && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Durasi Kunjungan</Label>
              <div className="flex gap-2">
                <Input
                  id="duration"
                  type="number"
                  min={1}
                  value={duration}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setDuration(Number(e.target.value))
                  }
                  placeholder="Masukkan durasi"
                  aria-label="Durasi kunjungan"
                />
                <Select
                  value={durationUnit}
                  onValueChange={(value: 'minutes' | 'hours') =>
                    setDurationUnit(value)
                  }
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Satuan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minutes">Menit</SelectItem>
                    <SelectItem value="hours">Jam</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Waktu Pengingat</Label>
              <Select
                value={reminderTime}
                onValueChange={(value: 'morning' | 'afternoon' | 'evening') =>
                  setReminderTime(value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Waktu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">Pagi (08:00 - 11:59)</SelectItem>
                  <SelectItem value="afternoon">Siang (12:00 - 17:59)</SelectItem>
                  <SelectItem value="evening">Malam (18:00 - 23:59)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            Tamu akan menerima notifikasi 15 menit sebelum waktu check-out.
          </p>
        </>
      )}
    </div>
  );
}