import React, { useEffect } from 'react';

/**
 * Reusable toast notification with auto-dismiss.
 * @param {{ message: { text: string, type: 'success'|'error' } | null, onDismiss: () => void }} props
 */
export default function ActionToast({ message, onDismiss }) {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => onDismiss(), 3000);
      return () => clearTimeout(timer);
    }
  }, [message, onDismiss]);

  if (!message) return null;

  const isError = message.type === 'error';

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      background: isError ? '#EF4444' : '#1A73E8',
      color: '#fff',
      padding: '12px 24px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      zIndex: 999999,
      fontWeight: 600,
      fontSize: '15px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    }}>
      {isError ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      )}
      {message.text}
    </div>
  );
}
