import React from 'react';
import { string } from 'prop-types';

const PriorityFlag = ({ color }) => (
  <svg
    width="6"
    height="20"
    viewBox="0 0 6 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <line
      x1="3"
      y1="1.31134e-07"
      x2="3"
      y2="20"
      stroke={color}
      strokeWidth="4"
    />
  </svg>
);

PriorityFlag.propTypes = {
  color: string.isRequired,
};

export default PriorityFlag;
