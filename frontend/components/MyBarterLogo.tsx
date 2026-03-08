import React from 'react';

interface MyBarterLogoProps {
  /** Size in pixels — always rendered as a perfect square. Default: 32 */
  size?: number;
  className?: string;
}

/**
 * MyBarter logo icon.
 * Renders a strict square via explicit pixel width/height on both the
 * container div and the SVG. flex-shrink-0 prevents parent flex layout
 * from ever squishing or stretching it.
 */
const MyBarterLogo = ({ size = 32, className = '' }: MyBarterLogoProps) => (
  <div
    className={`flex-shrink-0 ${className}`}
    style={{
      width: size,
      height: size,
      minWidth: size,
      minHeight: size,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: size, height: size, display: 'block', flexShrink: 0 }}
    >
      <rect width="100" height="100" rx="28" fill="#0F172A" />
      <g stroke="#67E8F9" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M30 42H70L62 34M70 42V65C70 75 62 82 52 82H30" />
        <path d="M70 58H30L38 66M30 58V35C30 25 38 18 48 18H70" />
      </g>
    </svg>
  </div>
);

export default MyBarterLogo;
