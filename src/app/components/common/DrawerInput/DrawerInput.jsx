import React from 'react';
import { TextField } from '@mui/material';

const inputSx = {
  '& .MuiInputBase-input': {
    textTransform: 'none !important',
  },
  '& .MuiInputBase-root': {
    borderRadius: '10px',
    height: '45px',
  },
  '& .MuiInputLabel-root': {
    textTransform: 'none !important',
    fontSize: '16px',
    '&.MuiInputLabel-outlined': {
      transform: 'translate(16px, 10px) scale(1)',
      '&.MuiInputLabel-shrink': {
        transform: 'translate(14px, -9px) scale(0.75)',
      },
    },
  },
};

const DrawerInput = ({ label, value, onChange, ...restProps }) => {
  return (
    <TextField
      label={label}
      variant="outlined"
      value={value}
      onChange={onChange}
      sx={inputSx}
      {...restProps}
    />
  );
};

export default DrawerInput;
