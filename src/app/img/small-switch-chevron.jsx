import React from 'react';
import palette from 'styles/palette';

const SmallSwitchChevron = ({ color = palette.dirtyBanana }) => (
  <svg
    width="10"
    height="7"
    viewBox="0 0 10 7"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6.36389 4.94983L9.89951 1.41421L8.48529 0L4.94968 3.53561L1.41422 0.000150919L0 1.41436L4.94975 6.36411L6.36396 4.9499L6.36389 4.94983Z"
      fill={color}
    />
  </svg>
);

export default SmallSwitchChevron;
