import React from 'react';
import { BulkCheckboxInput, Icon } from './styled';

const BulkCheckbox = ({ onClick, isChecked, isDisabled }) => (
  <BulkCheckboxInput
    onClick={onClick}
    isChecked={isChecked}
    isDisabled={isDisabled}
  >
    <Icon width="8" height="8" viewBox="0 0 8 8">
      <rect width="8" height="8" rx="2" fill="#00A2E5" />
    </Icon>
  </BulkCheckboxInput>
);

export default BulkCheckbox;
