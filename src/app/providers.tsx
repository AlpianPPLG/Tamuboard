'use client';

import { ThemeProvider } from "@/providers/theme-provider";
import { LanguageProvider } from "@/contexts/language-context";
import { PreferencesProvider } from "@/contexts/preferences-context";
import { TrashProvider } from "@/contexts/trash-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PreferencesProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem={false}
        disableTransitionOnChange
      >
        <LanguageProvider>
          <TrashProvider>
            {children}
          </TrashProvider>
        </LanguageProvider>
      </ThemeProvider>
    </PreferencesProvider>
  );
}
