import palette from '@/app/styles/palette';
import { TextField as Input } from '@mui/material';
import React, { useState } from 'react';

interface Prop {
  placeholder?: string;
  size?: string;
  border?: boolean;
  fontSize?: string;
  fontWeight?: string;
  width?: string;
  value?: string;
  onEnter?: (value: string) => void;
}

const TextField = ({
  placeholder,
  size,
  border,
  fontSize,
  fontWeight,
  width,
  onEnter,
  value,
}: Prop) => {
  const [inputValue, setValue] = useState(value || '');
  
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

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      console.log(inputValue);
      onEnter && onEnter(inputValue);
      // event.preventDefault();
    }
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const value = event.target.value;
    setValue(value);
  };

  return (
    <Input
      // @ts-ignore
      size={size}
      value={inputValue}
      sx={sx}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
    />
  );
};

export default TextField;
