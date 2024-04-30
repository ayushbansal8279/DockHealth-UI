import React from 'react';
import { Typography } from '@mui/material';
import { OptionWrapper, IconBox } from './styled';

const BulkEditOption = (props) => {
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
      <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>
        {title}
      </Typography>
    </OptionWrapper>
  );
};

export default BulkEditOption;
