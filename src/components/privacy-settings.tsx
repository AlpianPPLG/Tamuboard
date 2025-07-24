"use client";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Guest } from "@/types/guest";
import { GuestStorage } from "@/lib/guest-stotrage";
import { useEffect, useState } from "react";

export function PrivacySettings({ guest, onUpdate }: { guest: Guest; onUpdate?: () => void }) {
  const [privacySettings, setPrivacySettings] = useState({
    hideName: guest.privacySettings?.hideName ?? false,
    hidePhone: guest.privacySettings?.hidePhone ?? false,
    hideEmail: guest.privacySettings?.hideEmail ?? false,
  });

  useEffect(() => {
    // Update the guest record when privacy settings change
    const updatedGuest = {
      ...guest,
      privacySettings,
    };

    GuestStorage.updateGuest(guest.id, {
      privacySettings: updatedGuest.privacySettings,
    });

    onUpdate?.();
  }, [privacySettings, guest.id, onUpdate]);

  const handlePrivacyToggle = (setting: keyof typeof privacySettings) => {
    setPrivacySettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Pengaturan Privasi</h3>
        <p className="text-sm text-muted-foreground">
          Atur data mana yang ingin Anda sembunyikan dari tampilan publik
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <Label htmlFor="hide-name">Sembunyikan Nama</Label>
            <p className="text-sm text-muted-foreground">
              Nama Anda akan ditampilkan sebagai "Tamu Anonim"
            </p>
          </div>
          <Switch
            id="hide-name"
            checked={privacySettings.hideName}
            onCheckedChange={() => handlePrivacyToggle('hideName')}
          />
        </div>

        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <Label htmlFor="hide-phone">Sembunyikan Nomor Telepon</Label>
            <p className="text-sm text-muted-foreground">
              Nomor telepon tidak akan ditampilkan di dashboard
            </p>
          </div>
          <Switch
            id="hide-phone"
            checked={privacySettings.hidePhone}
            onCheckedChange={() => handlePrivacyToggle('hidePhone')}
          />
        </div>

        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <Label htmlFor="hide-email">Sembunyikan Email</Label>
            <p className="text-sm text-muted-foreground">
              Alamat email tidak akan ditampilkan di dashboard
            </p>
          </div>
          <Switch
            id="hide-email"
            checked={privacySettings.hideEmail}
            onCheckedChange={() => handlePrivacyToggle('hideEmail')}
          />
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        Catatan: Data tetap tersimpan di sistem dan dapat dilihat oleh administrator.
      </p>
    </div>
  );
}
