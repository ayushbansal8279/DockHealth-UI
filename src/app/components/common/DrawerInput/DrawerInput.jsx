import React from 'react';
import { TextField } from '@mui/material';

const sx = {
  '& .MuiInputBase-input': {
    textTransform: 'none !important',
  },
  '& .MuiInputBase-root': {
    borderRadius: '10px',
  },
  '& .MuiInputLabel-root': {
    textTransform: 'none !important',
    fontSize: '16px',
  },
};

const DrawerInput = ({ label, value, onChange, ...restProps }) => {
  return (
    <TextField
      label={label}
      variant="outlined"
      value={value}
      onChange={onChange}
      sx={sx}
      {...restProps}
    />
  );
};

export default DrawerInput;
