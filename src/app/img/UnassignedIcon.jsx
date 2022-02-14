import React from 'react';

const UnassignedIcon = ({ size = 30 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 30 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <mask id="path-1-inside-1" fill="white">
      <path d="M15 30C23.2843 30 30 23.2843 30 15C30 6.71573 23.2843 0 15 0C6.71573 0 0 6.71573 0 15C0 23.2843 6.71573 30 15 30Z" />
    </mask>
    <path
      d="M27 15C27 21.6274 21.6274 27 15 27V33C24.9411 33 33 24.9411 33 15H27ZM15 27C8.37258 27 3 21.6274 3 15H-3C-3 24.9411 5.05887 33 15 33V27ZM3 15C3 8.37258 8.37258 3 15 3V-3C5.05887 -3 -3 5.05887 -3 15H3ZM15 3C21.6274 3 27 8.37258 27 15H33C33 5.05887 24.9411 -3 15 -3V3Z"
      fill="#C1CCDA"
      mask="url(#path-1-inside-1)"
    />
    <path d="M9.03516 15L20.9682 15" stroke="#C1CCDA" strokeWidth="4" />
  </svg>
);

export default UnassignedIcon;
