import React from 'react';

export default ({ width, height }) => (
  <svg
    width={width || 15}
    height={height || 15}
    viewBox="0 0 17 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="1"
      y="4.59961"
      width="11.3999"
      height="11.3999"
      rx="1.6"
      stroke="currentColor"
      strokeWidth="1.4"
    />
    <path
      d="M12.0999 12.3999H13.7999C14.6835 12.3999 15.3999 11.6835 15.3999 10.7999V2.6C15.3999 1.71634 14.6835 1 13.7999 1H5.6C4.71634 1 4 1.71634 4 2.6V4.89996"
      stroke="currentColor"
      strokeWidth="1.4"
    />
  </svg>
);
