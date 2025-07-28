import React from 'react';

interface ShortcutItem {
  key: string;
  description: string;
} 

interface ShortcutListProps {
  shortcuts: ShortcutItem[];
}

export const ShortcutList: React.FC<ShortcutListProps> = ({ shortcuts }) => {
  return (
    <div style={{ padding: '1rem' }}>
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
        {shortcuts.map(({ key, description }) => (
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
};
