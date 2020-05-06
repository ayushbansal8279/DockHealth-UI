import React from 'react';
import palette from 'styles/palette';

const SmallSwitchChevron = ({ color = palette.dirtyBanana }) => (
  <svg
    width="11"
    height="7"
    viewBox="0 0 11 7"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10.1055 5.25693L6.15775 1.10419L5.2602 1.98343L6.15948 1.10132L5.11342 -0.000518362L-0.000366325 5.01563L1.04569 6.11747L5.07236 2.16769L9.01996 6.32031L10.1055 5.25693Z"
      fill={color}
    />
  </svg>
);

export default SmallSwitchChevron;
