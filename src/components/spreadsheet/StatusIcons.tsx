
import React from 'react';

interface IconProps {
  className?: string;
}

export const CalculatorIcon: React.FC<IconProps> = ({ className }) => (
  <svg 
    className={className}
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <rect x="4" y="2" width="16" height="20" rx="2" />
    <line x1="8" x2="16" y1="6" y2="6" />
    <line x1="8" x2="8" y1="11" y2="11" />
    <line x1="12" x2="12" y1="11" y2="11" />
    <line x1="16" x2="16" y1="11" y2="11" />
    <line x1="8" x2="8" y1="16" y2="16" />
    <line x1="12" x2="12" y1="16" y2="16" />
    <line x1="16" x2="16" y1="16" y2="16" />
  </svg>
);

export const SumIcon: React.FC<IconProps> = ({ className }) => (
  <svg 
    className={className}
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M4 7h16M4 12h4M4 17h8" />
    <path d="M14 12l4 4.5M14 16.5l4-4.5" />
  </svg>
);

export const AverageIcon: React.FC<IconProps> = ({ className }) => (
  <svg 
    className={className}
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M4 12h16M12 4v16" />
  </svg>
);
