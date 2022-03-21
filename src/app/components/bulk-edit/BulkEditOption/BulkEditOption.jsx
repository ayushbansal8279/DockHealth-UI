import React from 'react';
import { OptionWrapper, IconBox } from './styled';

const BulkEditOption = props => {
  const { iconComponent: IconComponent, title, color, isDisabled } = props;
  return (
    <OptionWrapper color={color} disabled={isDisabled}>
      <IconBox>
        <IconComponent />
      </IconBox>
      <p>{title}</p>
    </OptionWrapper>
  );
};

export default BulkEditOption;
