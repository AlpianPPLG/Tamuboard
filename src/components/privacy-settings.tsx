"use client";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Guest } from "@/types/guest";
import { GuestStorage } from "@/lib/guest-stotrage";
import { useEffect, useState, useRef } from "react";

interface PrivacySettingsProps {
  guest: Guest;
  onUpdate?: () => void;
}

/**
 * Komponen untuk mengatur privasi tamu
 *
 * @param {PrivacySettingsProps} props Props untuk komponen ini
 * @returns {JSX.Element} JSX element yang akan ditampilkan
 */
export function PrivacySettings({ guest, onUpdate }: PrivacySettingsProps) {
  const [privacySettings, setPrivacySettings] = useState({
    hideName: guest.privacySettings?.hideName ?? false,
    hidePhone: guest.privacySettings?.hidePhone ?? false,
    hideEmail: guest.privacySettings?.hideEmail ?? false,
  });

  const guestRef = useRef(guest);
  useEffect(() => {
    guestRef.current = guest;
  }, [guest]);

  useEffect(() => {
    GuestStorage.updateGuest(guestRef.current.id, {
      privacySettings,
    });
    onUpdate?.();
  }, [privacySettings, onUpdate]);

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
        {(["hideName", "hidePhone", "hideEmail"] as const).map((key) => (
          <div key={key} className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor={key}>
                {key === "hideName"
                  ? "Sembunyikan Nama"
                  : key === "hidePhone"
                  ? "Sembunyikan Nomor Telepon"
                  : "Sembunyikan Email"}
              </Label>
              <p className="text-sm text-muted-foreground">
                {key === "hideName"
                  ? "Nama Anda akan ditampilkan sebagai Tamu Anonim"
                  : key === "hidePhone"
                  ? "Nomor telepon tidak akan ditampilkan di dashboard"
                  : "Alamat email tidak akan ditampilkan di dashboard"}
              </p>
            </div>
            <Switch
              id={key}
              checked={privacySettings[key]}
              onCheckedChange={() => handlePrivacyToggle(key)}
            />
          </div>
        ))}
      </div>

      <p className="text-sm text-muted-foreground">
        Catatan: Data tetap tersimpan di sistem dan dapat dilihat oleh administrator.
      </p>
    </div>
  );
}