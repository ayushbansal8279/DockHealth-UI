import React, { forwardRef } from 'react';
import * as MUI from '@mui/material';
import ToolbarButton from './ToolbarButton';

const Toolbar = forwardRef(({ children }, reference) => {
  return (
    <MUI.Stack ref={reference} direction="row" justifyContent="start">
      {children}
    </MUI.Stack>
  );
});

Toolbar.Button = ToolbarButton;

export default Toolbar;
