import React from 'react';
import palette from 'styles/palette';

const TickIcon = ({ active }) => (
  <svg
    width="22"
    height="21"
    viewBox="0 0 22 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3.30672 12.096L7.49754 16.4703L19.7802 4.20032"
      stroke={active ? palette.brightBlue : palette.coolGrey2}
      strokeWidth="4"
      strokeLinecap="round"
    />
  </svg>
);

export default TickIcon;
