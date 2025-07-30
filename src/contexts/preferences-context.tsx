'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'system';
type FontSize = 'sm' | 'base' | 'lg';
type FontFamily = 'sans' | 'serif' | 'mono';

interface Preferences {
  theme: Theme;
  fontSize: FontSize;
  fontFamily: FontFamily;
  reducedMotion: boolean;
  highContrast: boolean;
}

type PreferencesContextType = {
  preferences: Preferences;
  setPreferences: (prefs: Partial<Preferences>) => void;
};

const defaultPreferences: Preferences = {
  theme: 'system',
  fontSize: 'base',
  fontFamily: 'sans',
  reducedMotion: false,
  highContrast: false,
};

const PreferencesContext = createContext<PreferencesContextType | undefined>(
  undefined
);

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPrefs] = useState<Preferences>(() => {
    if (typeof window === 'undefined') return defaultPreferences;
    
    const saved = localStorage.getItem('preferences');
    return saved ? JSON.parse(saved) : defaultPreferences;
  });

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('preferences', JSON.stringify(preferences));
    
    // Apply theme class to document
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    
    // Apply theme
    const theme = preferences.theme === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      : preferences.theme;
    
    root.classList.add(theme);
    root.setAttribute('data-theme', theme);
    
    // Apply font family
    root.setAttribute('data-font-family', preferences.fontFamily);
    
    // Apply reduced motion if needed
    if (preferences.reducedMotion) {
      root.setAttribute('data-reduced-motion', 'true');
    } else {
      root.removeAttribute('data-reduced-motion');
    }
    
    // Apply high contrast if needed
    if (preferences.highContrast) {
      root.setAttribute('data-high-contrast', 'true');
    } else {
      root.removeAttribute('data-high-contrast');
    }
  }, [preferences]);

  const setPreferences = (newPrefs: Partial<Preferences>) => {
    setPrefs(prev => ({
      ...prev,
      ...newPrefs,
    }));
  };

  return (
    <PreferencesContext.Provider value={{ preferences, setPreferences }}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
}
