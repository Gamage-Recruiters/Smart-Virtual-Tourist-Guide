import React from 'react';
import { useAppNavigate } from '../../hooks/useAppNavigate';

export default function NavigationControls({ onCancel, onSafetyAlert }) {
  const appNavigate = useAppNavigate();

  return (
    <>
      <div className="flex items-center justify-center" style={{ marginTop: '150px', marginBottom: '150px', gap: '260px' }}>
        <button
          type="button"
          onClick={onCancel || (() => appNavigate('explore'))}
          className="rounded-xl bg-[#e53e3e] px-12 py-4 text-lg font-semibold text-white hover:bg-[#c53030]"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onSafetyAlert}
          className="flex items-center gap-4 rounded-[14px] bg-[#FFD84D] px-8 py-5 text-lg font-extrabold text-white shadow-[0_8px_18px_rgba(0,0,0,0.18)] transition-transform duration-150 hover:scale-[1.01] hover:bg-[#ffcf2e]"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E31B23] text-[18px] leading-none text-white shadow-[0_2px_4px_rgba(0,0,0,0.2)]">
            !
          </span>
          <span>Safety Alert</span>
        </button>
      </div>
      <button
        type="button"
        onClick={() => appNavigate('direction')}
        aria-label="Back to direction"
        style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          zIndex: 50,
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: '#fff',
          border: 'none',
          boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      </button>
    </>
  );
}
