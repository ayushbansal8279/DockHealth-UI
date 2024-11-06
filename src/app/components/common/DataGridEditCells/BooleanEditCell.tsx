import React from 'react';
import { Select, MenuItem, SelectChangeEvent } from '@mui/material';
import {
  useGridApiContext,
  GridRenderEditCellParams,
} from '@mui/x-data-grid-premium';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

export default function BooleanDropdownEditCell({ id, field, value, name }: GridRenderEditCellParams<any, boolean | undefined>) {
  const apiRef = useGridApiContext();

  const handleChange = (event: SelectChangeEvent<string>) => {
    const selectedValue = event.target.value;

    apiRef.current.setEditCellValue({
      id,
      field,
      value: selectedValue === 'yes' ? 'yes' : selectedValue === 'no' ? 'no' : undefined,
    });
  };

  return (
    <Select
      displayEmpty
      fullWidth
      value={typeof value === 'string' ? value : ''}
      onChange={handleChange}
      renderValue={(selected) => {
        if (selected === '') {
          return <span style={{ color: 'gray' }}>{name}</span>;
        }
        return selected;
      }}
      IconComponent={ArrowDropDownIcon}
      sx={{
        marginInline: '8px',
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
      <MenuItem value="" disabled>
        {name}
      </MenuItem>
      <MenuItem value="none">None</MenuItem>
      <MenuItem value="yes">Yes</MenuItem>
      <MenuItem value="no">No</MenuItem>
    </Select>
  );
}
