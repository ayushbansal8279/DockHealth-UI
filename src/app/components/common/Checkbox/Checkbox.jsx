import { bool, func, number } from 'prop-types';
import React from 'react';
import { CheckboxInput, Icon } from './styled';

const Checkbox = ({ onClick, isChecked, isDisabled, size, isCircle, borderHeight }) => (
  <CheckboxInput
    onClick={onClick}
    isChecked={isChecked}
    disabled={isDisabled}
    size={size}
    isCircle={isCircle}
    borderHeight={borderHeight}
  >
    <Icon
      width={size - 4}
      height={size - 4}
      viewBox={`0 0 ${size - 4} ${size - 4}`}
    >
      <rect
        width={size - 4}
        height={size - 4}
        rx={isCircle ? 8 : 2}
        fill="#00A2E5"
      />
    </Icon>
  </CheckboxInput>
);

Checkbox.propTypes = {
  size: number,
  isChecked: bool,
  isDisabled: bool,
  onClick: func,
};

Checkbox.defaultProps = {
  size: 12,
  isChecked: false,
  isDisabled: false,
  onClick: null,
};

export default Checkbox;
