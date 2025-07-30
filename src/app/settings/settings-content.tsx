'use client';

import { PageHeader } from '@/components/navigation/page-header';
import { ThemeSelector } from '@/components/settings/theme-selector';
import { FontSelector } from '@/components/settings/font-selector';
import { AccessibilitySettings } from '@/components/settings/accessibility-settings';
import { Separator } from '@/components/ui/separator';

export function SettingsContent() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <PageHeader showForwardButton={false} showSettingsButton={false} />
      
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Pengaturan</h1>
        <p className="text-muted-foreground">Sesuaikan pengalaman Anda menggunakan aplikasi</p>
      </div>

      <div className="space-y-12">
        {/* Tampilan */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold">Tampilan</h2>
            <p className="text-sm text-muted-foreground">
              Sesuaikan tampilan aplikasi sesuai preferensi Anda
            </p>
          </div>
          
          <div className="space-y-8">
            <ThemeSelector />
            <Separator />
            <FontSelector />
          </div>
        </section>

        {/* Aksesibilitas */}
        <section>
          <AccessibilitySettings />
        </section>

        {/* Reset Pengaturan */}
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold">Setel Ulang</h2>
            <p className="text-sm text-muted-foreground">
              Kembalikan pengaturan ke kondisi awal
            </p>
          </div>
          
          <div className="flex justify-end">
            <button 
              onClick={() => {
                if (confirm('Apakah Anda yakin ingin mengembalikan semua pengaturan ke kondisi awal?')) {
                  localStorage.removeItem('preferences');
                  window.location.reload();
                }
              }}
              className="px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-md transition-colors"
            >
              Setel Ulang Semua Pengaturan
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
