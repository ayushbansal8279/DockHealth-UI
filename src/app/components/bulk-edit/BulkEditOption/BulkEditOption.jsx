import React from 'react';
import { OptionWrapper, IconBox } from './styled';

const BulkEditOption = props => {
  const {
    iconComponent: IconComponent,
    title,
    color,
    isDisabled,
    wideView,
  } = props;
  return (
    <OptionWrapper color={color} disabled={isDisabled}>
      <IconBox wideView={wideView}>
        <IconComponent />
      </IconBox>
      <p>{title}</p>
    </OptionWrapper>
  );
};

export default BulkEditOption;
