import React from 'react';
import { string } from 'prop-types';

const PriorityFlag = ({ color }) => (
  <svg
    width="17"
    height="21"
    viewBox="0 0 17 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M0 0H17V10.5V21H0L5.14328 10.5L0 0Z" fill={color} />
  </svg>
);

PriorityFlag.propTypes = {
  color: string.isRequired,
};

export default PriorityFlag;
