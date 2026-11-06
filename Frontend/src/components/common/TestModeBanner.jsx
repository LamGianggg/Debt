import React from 'react';

export default function TestModeBanner({ isTestMode, onToggle }) {
  if (!isTestMode) return null;

  return (
    <div className="bg-amber-500 text-white text-xs font-medium py-1.5 px-4 text-center tracking-wide flex items-center justify-center gap-2 shadow-sm z-50">
      <span>⚠️ TEST MODE ACTIVE: You are viewing simulated sandbox records. Real bank transfers and live charges are disabled.</span>
      <button 
        onClick={onToggle}
        className="underline hover:text-amber-100 font-semibold ml-2 focus:outline-none cursor-pointer"
      >
        Switch to Live
      </button>
    </div>
  );
}
