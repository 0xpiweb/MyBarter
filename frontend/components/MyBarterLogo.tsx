import React from 'react';

const MyBarterLogo = ({ className = "w-12 h-12" }) => {
  return (
    <div className={`relative ${className}`}>
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect width="100" height="100" rx="28" fill="#0F172A" />
        <g stroke="#67E8F9" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M30 42H70L62 34M70 42V65C70 75 62 82 52 82H30" />
          <path d="M70 58H30L38 66M30 58V35C30 25 38 18 48 18H70" />
        </g>
      </svg>
    </div>
  );
};

export default MyBarterLogo;
