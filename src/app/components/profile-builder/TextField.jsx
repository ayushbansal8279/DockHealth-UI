import palette from '@/app/styles/palette';
import { TextField as Input } from '@mui/material';
import React, { useEffect, useState } from 'react';

const TextField = ({
  placeholder,
  size,
  border,
  fontSize,
  fontWeight,
  width,
  onEnter,
  value,
  onBlur,
  onChange,
}) => {
  const [inputValue, setValue] = useState();
  useEffect(() => {
    setValue(value || '');
  }, [value]);

  const sx = {
    backgroundColor: palette.white,
    width: width || '100%',
    '& .MuiOutlinedInput-root': {
      '& .MuiOutlinedInput-notchedOutline': {
        border: border ? `1px solid ${palette.iron}` : 'none',
        borderRadius: '4px',
        padding: '8px',
      },
      '&.Mui-focused fieldset': {
        border: `1px solid ${palette.coolGrey1}`,
      },
    },
    '& .MuiInputBase-input': {
      fontSize: fontSize || '16px',
      fontWeight: fontWeight || 400,
      lineHeight: '22.68px',
      letterSpacing: '0.3px',
      textAlign: 'left',
    },
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      // console.log(inputValue);
      onEnter && onEnter(inputValue);
      // event.preventDefault();
    }
  };

  const handleChange = (event) => {
    const value = event.target.value;
    setValue(value);
    onChange(value)
  };

  const handleBlur = (event) => {
    onBlur && onBlur(event.target.value);
  };

  return (
    <Input
      size={size}
      value={inputValue}
      sx={sx}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      onBlur={handleBlur}
    />
  );
};

export default TextField;
