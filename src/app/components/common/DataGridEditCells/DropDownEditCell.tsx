import React from 'react';
import { Select, MenuItem, SelectChangeEvent } from '@mui/material';
import {
  useGridApiContext,
  GridRenderEditCellParams,
} from '@mui/x-data-grid-premium';

interface DropdownEditCellProps extends GridRenderEditCellParams<any, string | undefined> {
  options: { name: string }[]; 
}

export default function DropdownEditCell({ id, field, value, options, name }: DropdownEditCellProps) {
  const apiRef = useGridApiContext();

  const handleChange = (event: SelectChangeEvent<string>) => {
    apiRef.current.setEditCellValue({
      id,
      field,
      value: event.target.value,
    });
  };

  return (
    <Select
      displayEmpty
      fullWidth
      value={value || ''}
      onChange={handleChange}
      renderValue={(selected) => {
        if (selected === '') {
          return <span style={{ color: 'gray' }}>{name}</span>;
        }
        return selected;
      }}
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
    >
      <MenuItem value="" disabled sx={{ color: 'gray' }}>
        {name}
      </MenuItem>
      {options.map(({ name }) => (
        <MenuItem key={name} value={name}>
          {name}
        </MenuItem>
      ))}
    </Select>
  );
}