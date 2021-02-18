import React from 'react';
import { CheckboxInput, Icon } from './styled';

const Checkbox = ({ onClick, isChecked, isDisabled }) => (
  <CheckboxInput
    type="button"
    onClick={onClick}
    isChecked={isChecked}
    isDisabled={isDisabled}
  >
    <Icon width="8" height="8" viewBox="0 0 8 8">
      <rect width="8" height="8" rx="2" fill="#00A2E5" />
    </Icon>
  </CheckboxInput>
);

export default Checkbox;
