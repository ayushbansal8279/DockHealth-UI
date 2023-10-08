import React from 'react';

export default ({ size = 25 }) => (
  <svg
    width={size}
    height={size * 0.75}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M19 12.4288L10 8.14307L1 12.4288L10 17.1431L19 12.4288Z"
      stroke="currentColor"
      strokeWidth="1.28571"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M19 9.85603L10 5.57031L1 9.85603L10 14.5703L19 9.85603Z"
      stroke="currentColor"
      strokeWidth="1.28571"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M19 7.28571L10 3L1 7.28571L10 12L19 7.28571Z"
      stroke="currentColor"
      strokeWidth="1.28571"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
