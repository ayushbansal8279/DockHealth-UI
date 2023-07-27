import React, { forwardRef } from 'react';
import * as MUI from '@mui/material';

const Button = forwardRef(({ ...props }, reference) => {
  return <MUI.Button ref={reference} {...props} />;
});

export default Button;
