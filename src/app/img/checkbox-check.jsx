import React from 'react';
import palette from 'styles/palette';

export default ({ className, size }) => (
  <svg
    width={(19.1 * size) / 30}
    height={(14.7 * size) / 30}
    viewBox="0 0 23.1 18.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    fill="none"
    stroke={palette.white}
    strokeWidth="3"
    className={className}
  >
    <path d="M 2 2 m 0 7.39 l 7.68 7.31 l 11.42 -14.7" />
  </svg>
);
