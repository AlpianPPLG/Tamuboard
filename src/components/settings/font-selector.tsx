'use client';

import { useAppPreferences } from '@/hooks/use-preferences';
import { cn } from '@/lib/utils';

type FontOption = {
  id: 'sans' | 'serif' | 'mono';
  label: string;
  description: string;
  fontClass: string;
};

export function FontSelector() {
  const { preferences, setFontFamily } = useAppPreferences();

  const fontOptions: FontOption[] = [
    {
      id: 'sans',
      label: 'Sans Serif',
      description: 'Font modern dan mudah dibaca',
      fontClass: 'font-sans',
    },
    {
      id: 'serif',
      label: 'Serif',
      description: 'Font klasik dengan kait di ujung huruf',
      fontClass: 'font-serif',
    },
    {
      id: 'mono',
      label: 'Monospace',
      description: 'Font dengan lebar karakter tetap',
      fontClass: 'font-mono',
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Jenis Huruf</h3>
        <p className="text-sm text-muted-foreground">
          Pilih gaya huruf yang nyaman untuk dibaca
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        {fontOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => setFontFamily(option.id)}
            className={cn(
              'flex flex-col items-start gap-2 rounded-lg border p-4 text-left transition-all hover:bg-accent',
              preferences.fontFamily === option.id && 'border-primary bg-accent/50',
              option.fontClass
            )}
          >
            <span className="font-medium">{option.label}</span>
            <p className="text-sm text-muted-foreground">{option.description}</p>
            <p className={cn(
              'mt-2 text-sm',
              option.id === 'sans' && 'font-sans',
              option.id === 'serif' && 'font-serif',
              option.id === 'mono' && 'font-mono',
            )}>
              Contoh teks dengan {option.label}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
