'use client';

import { useAppPreferences } from '@/hooks/use-preferences';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export function AccessibilitySettings() {
  const { 
    preferences, 
    toggleReducedMotion, 
    toggleHighContrast 
  } = useAppPreferences();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Aksesibilitas</h3>
        <p className="text-sm text-muted-foreground">
          Sesuaikan pengalaman pengguna untuk kebutuhan khusus
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <Label htmlFor="reduced-motion" className="text-base">
              Gerakan Berkurang
            </Label>
            <p className="text-sm text-muted-foreground">
              Menonaktifkan animasi dan transisi
            </p>
          </div>
          <Switch
            id="reduced-motion"
            checked={preferences.reducedMotion}
            onCheckedChange={toggleReducedMotion}
          />
        </div>

        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <Label htmlFor="high-contrast" className="text-base">
              Kontras Tinggi
            </Label>
            <p className="text-sm text-muted-foreground">
              Meningkatkan kontras warna untuk keterbacaan yang lebih baik
            </p>
          </div>
          <Switch
            id="high-contrast"
            checked={preferences.highContrast}
            onCheckedChange={toggleHighContrast}
          />
        </div>
      </div>
    </div>
  );
}
