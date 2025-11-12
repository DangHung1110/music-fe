import React from 'react';
import BRAND from '../../config/brand';

const LogoMark = ({ size = 48, className = '' }) => {
  const pxSize = typeof size === 'number' ? `${size}px` : size;
  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`.trim()}
      style={{ width: pxSize, height: pxSize }}
    >
      <svg
        viewBox="0 0 64 64"
        className="w-full h-full drop-shadow-[0_4px_12px_rgba(29,185,84,0.45)]"
      >
        <defs>
          <linearGradient id="dutMusicGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={BRAND.colors.primary} />
            <stop offset="100%" stopColor={BRAND.colors.secondary} />
          </linearGradient>
        </defs>
        <rect
          x="4"
          y="4"
          width="56"
          height="56"
          rx="16"
          fill="#070b0f"
        />
        <g stroke="url(#dutMusicGradient)" strokeWidth="4" strokeLinecap="round" fill="none">
          <path d="M18 36 V28 C18 21 23 16 30 16 H34 C41 16 46 21 46 28 V36" />
          <path d="M14 36 C14 46 20 50 26 50" />
          <path d="M50 36 C50 46 44 50 38 50" />
          <polyline points="22,32 26,38 30,30 34,42 38,28 42,36" />
        </g>
        <circle cx="30" cy="22" r="2.5" fill={BRAND.colors.secondary} />
        <circle cx="34" cy="22" r="2.5" fill={BRAND.colors.secondary} />
      </svg>
    </div>
  );
};

export default LogoMark;

