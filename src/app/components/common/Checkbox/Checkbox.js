import { bool, func, number } from 'prop-types';
import React from 'react';
import { CheckboxInput, Icon } from './styled';

const Checkbox = ({ onClick, isChecked, isDisabled, size, isCircle }) => (
  <CheckboxInput
    type="button"
    onClick={onClick}
    isChecked={isChecked}
    disabled={isDisabled}
    size={size}
    isCircle={isCircle}
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
  isChecked: bool.isRequired,
  isDisabled: bool,
  onClick: func.isRequired,
};

Checkbox.defaultProps = {
  size: 12,
  isDisabled: false,
};

export default Checkbox;
