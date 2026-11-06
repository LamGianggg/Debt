import React from 'react';

// Cactus Practice Main Logo
export function CactusLogo({ className = "w-6 h-6" }) {
  return (
    <div className={`${className} rounded bg-[#10B981] flex items-center justify-center text-white shadow-sm shrink-0`}>
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M12 2a2 2 0 0 0-2 2v7H8a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h2v4a2 2 0 1 0 4 0v-4h2a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2h-2V4a2 2 0 0 0-2-2z"/>
      </svg>
    </div>
  );
}

// Rocket Rides Logo
export function RocketLogo({ className = "w-5 h-5" }) {
  return (
    <svg className={`${className} text-[#4F566B] fill-current`} viewBox="0 0 24 24">
      <path d="M13.13 2.188a1.5 1.5 0 0 0-2.26 0l-5.5 6.5A1.5 1.5 0 0 0 5 9.75v5.5a1.5 1.5 0 0 0 1.5 1.5h11a1.5 1.5 0 0 0 1.5-1.5v-5.5a1.5 1.5 0 0 0-.37-1.062l-5.5-6.5zm-1.13 2.5 4.5 5.312H7.5l4.5-5.312zM7 11.25h10v4H7v-4zM5 19.5a1.5 1.5 0 0 1 1.5-1.5h11a1.5 1.5 0 0 1 1.5 1.5v1a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 20.5v-1z"/>
    </svg>
  );
}

// Credit Card Brand Logos
export function VisaLogo({ className = "h-4" }) {
  return (
    <span className="font-bold tracking-tight text-blue-800 text-xs italic font-serif">
      VISA
    </span>
  );
}

export function MastercardLogo() {
  return (
    <div className="flex -space-x-1.5 items-center">
      <span className="w-3.5 h-3.5 rounded-full bg-red-500 opacity-90 inline-block"></span>
      <span className="w-3.5 h-3.5 rounded-full bg-amber-400 opacity-90 inline-block"></span>
    </div>
  );
}

export function AmexLogo() {
  return (
    <span className="text-[10px] font-bold bg-[#006FCF] text-white px-1 py-0.5 rounded">
      AMEX
    </span>
  );
}

// Flags
export function FlagUS() {
  return <span className="text-sm">🇺🇸</span>;
}

export function FlagUK() {
  return <span className="text-sm">🇬🇧</span>;
}

export function FlagCA() {
  return <span className="text-sm">🇨🇦</span>;
}

export function FlagAU() {
  return <span className="text-sm">🇦🇺</span>;
}
