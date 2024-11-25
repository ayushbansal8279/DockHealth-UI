import React from 'react';
import { TextField } from '@mui/material';
import {
  useGridApiContext,
  GridRenderEditCellParams,
} from '@mui/x-data-grid-premium';

export default function NumberEditCell({ id, field, value, name }: GridRenderEditCellParams<any, number | undefined>) {
  const apiRef = useGridApiContext();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    if (!isNaN(Number(newValue)) || newValue === '') {
      apiRef.current.setEditCellValue({
        id,
        field,
        value: newValue === '' ? undefined : Number(newValue),
      });
    }
  };

  return (
    <TextField
      type="number"
      fullWidth
      value={value === undefined ? '' : value}
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