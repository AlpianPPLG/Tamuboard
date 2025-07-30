'use client';

import { usePreferences } from '@/contexts/preferences-context';

export function useAppPreferences() {
  const { preferences, setPreferences } = usePreferences();
  
  const updatePreferences = (newPrefs: Partial<typeof preferences>) => {
    setPreferences({
      ...preferences,
      ...newPrefs,
    });
  };

  return {
    preferences,
    updatePreferences,
    // Convenience methods
    setTheme: (theme: typeof preferences.theme) => updatePreferences({ theme }),
    setFontSize: (fontSize: typeof preferences.fontSize) => updatePreferences({ fontSize }),
    setFontFamily: (fontFamily: typeof preferences.fontFamily) => updatePreferences({ fontFamily }),
    toggleReducedMotion: () => updatePreferences({ reducedMotion: !preferences.reducedMotion }),
    toggleHighContrast: () => updatePreferences({ highContrast: !preferences.highContrast }),
  };
}
