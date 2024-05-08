import React from 'react';
import palette from 'styles/palette';

export default ({ size = 13, color = palette.coolGrey1 }) => (
  <svg
    width={size * 1.65}
    height={size}
    viewBox="0 0 23 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="2.91667"
      cy="2.91667"
      r="2.16667"
      stroke={color}
      strokeWidth="1.5"
    />
    <path
      d="M2.9165 4.66602L2.9165 11.0827C2.9165 11.727 3.43884 12.2493 4.08317 12.2493H6.4165"
      stroke={color}
      strokeWidth="1.5"
    />
    <rect
      x="6.5835"
      y="10.084"
      width="14.8333"
      height="3.16667"
      rx="1.58333"
      stroke={color}
      strokeWidth="1.5"
    />
  </svg>
);
