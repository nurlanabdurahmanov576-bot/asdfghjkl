import React from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({
  value,
  onChange,
  placeholder = 'Search destinations, places, or activities...',
  onClear
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        background: '#ffffff',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-full)',
        padding: '8px 16px',
        boxShadow: 'var(--shadow-xs)',
        width: '100%',
        maxWidth: '420px'
      }}
    >
      <Search size={18} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          border: 'none',
          outline: 'none',
          width: '100%',
          fontSize: '0.9rem',
          color: 'var(--text-dark)'
        }}
      />
      {value && (
        <button
          type="button"
          onClick={onClear || (() => onChange(''))}
          style={{
            border: 'none',
            background: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
