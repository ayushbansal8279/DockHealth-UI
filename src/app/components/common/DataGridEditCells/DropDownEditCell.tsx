import React from 'react';
import { Select, MenuItem, SelectChangeEvent } from '@mui/material';
import {
  useGridApiContext,
  GridRenderEditCellParams,
} from '@mui/x-data-grid-premium';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { selectStyles } from './helpers';
import { PlaceholderText } from './styled';

interface DropDownEditCellProps extends GridRenderEditCellParams<any, string | undefined> {
  options: { name: string, identifier: string }[]; 
}

export default function DropDownEditCell({ id, field, value, options, name }: DropDownEditCellProps) {
  const apiRef = useGridApiContext();

  const handleChange = (event: SelectChangeEvent<string>) => {
    apiRef.current.setEditCellValue({
      id,
      field,
      value: event.target.value,
    });
  };

  const selectedOption = options.find(option => option.identifier === value);
  const displayValue = selectedOption ? selectedOption.name : value;

  return (
    <Select
      displayEmpty
      fullWidth
      value={value || ''}
      onChange={handleChange}
      renderValue={(selected) => {
        if (selected === '') {
          return <PlaceholderText>{name}</PlaceholderText>;
        }
        return displayValue || selected;
      }}
      IconComponent={ArrowDropDownIcon}
      sx={selectStyles}
    >
      <MenuItem value="" disabled sx={{ color: 'gray' }}>
        {name}
      </MenuItem>
      {options.map(({ name, identifier }) => (
        <MenuItem key={identifier} value={identifier}>
          {name}
        </MenuItem>
      ))}
    </Select>
  );
}