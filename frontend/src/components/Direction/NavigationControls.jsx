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

    </>
  );
}
