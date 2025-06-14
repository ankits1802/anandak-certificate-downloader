import React from 'react';

export const RajyaAnandSansthanLogo: React.FC<{ width?: number; height?: number; className?: string }> = ({ 
  width = 55, 
  height = 55, 
  className = "" 
}) => (
  <svg 
    width={width} 
    height={height} 
    viewBox="0 0 100 100" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="50" cy="50" r="45" fill="#FF6B35" stroke="#333" strokeWidth="2"/>
    <circle cx="50" cy="35" r="12" fill="#FFF"/>
    <rect x="35" y="55" width="30" height="20" fill="#FFF" rx="3"/>
    <text x="50" y="85" textAnchor="middle" fill="#FFF" fontSize="8" fontWeight="bold">RAS</text>
  </svg>
);

export const MpEmblem: React.FC<{ width?: number; height?: number; className?: string }> = ({ 
  width = 45, 
  height = 45, 
  className = "" 
}) => (
  <svg 
    width={width} 
    height={height} 
    viewBox="0 0 100 100" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="50" cy="50" r="45" fill="#1E40AF" stroke="#333" strokeWidth="2"/>
    <polygon points="50,20 60,40 40,40" fill="#FFF"/>
    <circle cx="50" cy="55" r="15" fill="#FFF"/>
    <text x="50" y="85" textAnchor="middle" fill="#FFF" fontSize="6" fontWeight="bold">MP</text>
  </svg>
);

export const IitKgpLogo: React.FC<{ width?: number; height?: number; className?: string }> = ({ 
  width = 50, 
  height = 50, 
  className = "" 
}) => (
  <svg 
    width={width} 
    height={height} 
    viewBox="0 0 100 100" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="10" y="10" width="80" height="80" fill="#8B5CF6" stroke="#333" strokeWidth="2" rx="8"/>
    <rect x="20" y="25" width="60" height="8" fill="#FFF"/>
    <rect x="20" y="40" width="60" height="8" fill="#FFF"/>
    <rect x="20" y="55" width="60" height="8" fill="#FFF"/>
    <text x="50" y="80" textAnchor="middle" fill="#FFF" fontSize="8" fontWeight="bold">IIT KGP</text>
  </svg>
);
