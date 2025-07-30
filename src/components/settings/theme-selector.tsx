'use client';

import { useAppPreferences } from '@/hooks/use-preferences';
import { Moon, Monitor, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ThemeOption = {
  value: 'light' | 'dark' | 'system';
  label: string;
  icon: React.ReactNode;
  description: string;
};

export function ThemeSelector() {
  const { preferences, setTheme } = useAppPreferences();

  const themeOptions: ThemeOption[] = [
    {
      value: 'light',
      label: 'Terang',
      icon: <Sun className="h-5 w-5" />,
      description: 'Tampilan terang yang nyaman di siang hari',
    },
    {
      value: 'dark',
      label: 'Gelap',
      icon: <Moon className="h-5 w-5" />,
      description: 'Tampilan gelap yang nyaman di malam hari',
    },
    {
      value: 'system',
      label: 'Sistem',
      icon: <Monitor className="h-5 w-5" />,
      description: 'Mengikuti pengaturan tema sistem operasi',
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Tema</h3>
        <p className="text-sm text-muted-foreground">
          Sesuaikan tampilan aplikasi sesuai preferensi Anda
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        {themeOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setTheme(option.value)}
            className={cn(
              'flex flex-col items-start gap-2 rounded-lg border p-4 text-left transition-all hover:bg-accent',
              preferences.theme === option.value && 'border-primary bg-accent/50',
            )}
          >
            <div className="flex items-center gap-2">
              <span className={cn(
                'flex h-6 w-6 items-center justify-center rounded-full',
                preferences.theme === option.value ? 'bg-primary text-primary-foreground' : 'bg-muted'
              )}>
                {option.icon}
              </span>
              <span className="font-medium">{option.label}</span>
            </div>
            <p className="text-sm text-muted-foreground">{option.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
