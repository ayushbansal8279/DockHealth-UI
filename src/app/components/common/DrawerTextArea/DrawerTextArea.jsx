import React from 'react';
import { TextareaAutosize } from '@mui/material';
import palette from '@/app/styles/palette';

const DrawerTextArea = ({ value, onChange, placeholder }) => {
  return (
    <TextareaAutosize
      value={value}
      onChange={onChange}
      minRows={2}
      placeholder={placeholder}
      style={{
        borderRadius: '10px',
        padding: '10px',
        fontSize: '16px',
        width: '100%',
      }}
      sx={{
        '&:focus': {
          borderColor: 'blue',
          outline: 'none !important',
        },
      }}
      onFocus={(e) => {
        console.log('focus',e.target.style);
        e.target.style.borderColor = palette.brightBlue;
        e.target.style.borderWidth = '2px';
        // e.target.style.outlineColor = 'red';
      }}
      onBlur={(e) => {
        e.target.style.borderColor = '#ccc';
      }}
    />
  );
};

export default DrawerTextArea;
