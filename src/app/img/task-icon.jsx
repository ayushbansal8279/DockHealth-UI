import React from 'react';

export default ({ size = 24 }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <rect
      x="1"
      y="1"
      width="18"
      height="18"
      rx="10"
      stroke="white"
      strokeWidth="1.5"
      fill="none"
    />
    <path
      d="M5 10l2 3 8-8"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
