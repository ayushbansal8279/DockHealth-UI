import React from 'react';
import { TextField } from '@mui/material';
import {
  useGridApiContext,
  GridRenderEditCellParams,
} from '@mui/x-data-grid-premium';

export default function TextEditCell({ id, field, value, name }: GridRenderEditCellParams<any, string | undefined>) {
  const apiRef = useGridApiContext();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    apiRef.current.setEditCellValue({
      id,
      field,
      value: event.target.value,
    });
  };

  return (
    <TextField
      fullWidth
      value={value || ''}
      onChange={handleChange}
      placeholder={name}
      sx={{
        '& .MuiOutlinedInput-notchedOutline': {
          border: 'none',
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          outline: 'none', 
        },
        '&.Mui-focused': {
          backgroundColor: 'transparent',
        },
      }}
    />
  );
}