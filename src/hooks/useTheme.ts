import { useState, useEffect } from 'react';

type ColorScheme = 'light' | 'dark';

export const useTheme = () => {
  const [colorScheme, setColorScheme] = useState<ColorScheme>('light');

  useEffect(() => {
    // Check for browser support of prefers-color-scheme
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Set the initial value
    setColorScheme(mediaQuery.matches ? 'dark' : 'light');
    
    // Listen for changes
    const handleChange = (e: MediaQueryListEvent) => {
      setColorScheme(e.matches ? 'dark' : 'light');
    };
    
    // Add event listener for future changes
    mediaQuery.addEventListener('change', handleChange);
    
    // Clean up
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return {
    isDarkMode: colorScheme === 'dark',
    textColor: colorScheme === 'dark' ? 'text-white' : 'text-gray-900',
    inputTextColor: colorScheme === 'dark' ? 'text-white' : 'text-gray-900',
    inputBgColor: colorScheme === 'dark' ? 'bg-gray-800' : 'bg-white',
    inputBorderColor: colorScheme === 'dark' ? 'border-gray-700' : 'border-gray-300',
    inputFocusBorderColor: colorScheme === 'dark' ? 'border-blue-500' : 'border-blue-500',
  };
};
