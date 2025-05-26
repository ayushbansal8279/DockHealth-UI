import React from 'react';

export default ({ color = 'currentColor' }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 17 18"
    xmlns="http://www.w3.org/2000/svg"
    fill={color}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.33333 3H2.5V8.83333H8.33333V3Z"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M17.5001 3H11.6667V8.83333H17.5001V3Z"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M17.5001 12.166H11.6667V17.9993H17.5001V12.166Z"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.33333 12.166H2.5V17.9993H8.33333V12.166Z"
    />
  </svg>
);
