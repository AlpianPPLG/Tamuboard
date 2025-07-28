import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import React from 'react';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface ShortcutDefinition {
  handler: (e: KeyboardEvent, showShortcuts?: () => void) => void;
  description: string;
  preventDefault?: boolean;
}

type ShortcutHandler = (e: KeyboardEvent) => void;

type ShortcutMap = {
  [key: string]: {
    handler: ShortcutHandler;
    description: string;
    preventDefault?: boolean;
  };
}

export function useKeyboardShortcuts(shortcuts: ShortcutMap): { showShortcuts: () => void } {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const router = useRouter();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Skip if typing in an input/textarea/select
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable
      ) {
        return;
      }

      // Create a shortcut key string (e.g., "ctrl+f")
      const keys: string[] = [];
      if (e.ctrlKey || e.metaKey) keys.push('ctrl');
      if (e.altKey) keys.push('alt');
      if (e.shiftKey) keys.push('shift');
      
      // Add the actual key, handling special cases
      if (e.key === ' ') {
        keys.push('space');
      } else if (e.key.length === 1) {
        keys.push(e.key.toLowerCase());
      } else {
        keys.push(e.key.toLowerCase());
      }

      const shortcutKey = keys.join('+');
      const shortcut = Object.entries(shortcuts).find(([key]) => {
        return key.toLowerCase() === shortcutKey;
      });

      if (shortcut) {
        const [, { handler, preventDefault = true }] = shortcut;
        if (preventDefault) {
          e.preventDefault();
          e.stopPropagation();
        }
        handler(e);
      }
    },
    [shortcuts]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Helper function to show available shortcuts
  const showShortcuts = useCallback(() => {
    const shortcutList = Object.entries(shortcuts).map(([key, { description }]) => ({
      key: key
        .split('+')
        .map(k => k.charAt(0).toUpperCase() + k.slice(1))
        .join(' + '),
      description
    }));

    const ShortcutListComponent = () => (
      <div style={{
        padding: '1rem',
        maxWidth: '400px',
        width: '90vw',
        margin: '0 auto',
        borderRadius: '0.5rem',
        backgroundColor: 'white',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      }}>
        <h4 style={{
          fontWeight: 600,
          marginBottom: '0.5rem',
          fontSize: '1rem',
          lineHeight: '1.5',
          color: 'hsl(0, 0%, 9.0%)'
        }}>
          Pintasan Keyboard Tersedia
        </h4>
        <div style={{
          display: 'grid',
          gap: '0.5rem',
          fontSize: '0.875rem',
          lineHeight: '1.25rem'
        }}>
          {shortcutList.map(({ key, description }) => (
            <div
              key={key}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <kbd style={{
                padding: '0.25rem 0.5rem',
                backgroundColor: 'hsl(0, 0%, 95%)',
                borderRadius: '0.25rem',
                fontSize: '0.75rem',
                fontFamily: 'monospace',
                border: '1px solid hsl(0, 0%, 90%)',
                color: 'hsl(0, 0%, 30%)'
              }}>
                {key}
              </kbd>
              <span style={{
                marginLeft: '1rem',
                color: 'hsl(0, 0%, 30%)'
              }}>
                {description}
              </span>
            </div>
          ))}
        </div>
      </div>
    );

    toast.info(<ShortcutListComponent />, {
      duration: 5000,
      style: {
        left: '50%',
        transform: 'translateX(-50%)',
        padding: 0,
        background: 'none',
        border: 'none',
        boxShadow: 'none'
      }
    });
  }, [shortcuts]);

  return { showShortcuts };
}

// Common shortcuts that can be reused across components
export const commonShortcuts = {
  'ctrl+/': {
    handler: (e: KeyboardEvent, showShortcuts: () => void) => {
      showShortcuts();
    },
    description: 'Tampilkan semua pintasan keyboard',
    preventDefault: true
  },
  'escape': {
    handler: () => {
      // Close any open modals or dialogs
      const escapeEvent = new KeyboardEvent('keydown', {
        key: 'Escape',
        code: 'Escape',
        keyCode: 27,
        which: 27,
        bubbles: true
      });
      document.dispatchEvent(escapeEvent);
    },
    description: 'Tutup modal atau dialog yang terbuka'
  }
};
