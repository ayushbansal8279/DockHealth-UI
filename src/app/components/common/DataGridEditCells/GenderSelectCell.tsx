import React from 'react';
import { Select, MenuItem, SelectChangeEvent } from '@mui/material';
import {
  useGridApiContext,
  GridRenderEditCellParams,
} from '@mui/x-data-grid-premium';

import { ISelectOption } from '@/app/types/gender';

interface Props extends GridRenderEditCellParams<any, string | undefined> {
  options: ISelectOption[];
}

export default function GenderSelectCell({
  id,
  field,
  value = '',
  options,
}: Props) {
  const apiRef = useGridApiContext();

  const handleChange = (event: SelectChangeEvent<string>) => {
    apiRef.current.setEditCellValue({
      id,
      field,
      value: event.target.value,
    });
  };

  return (
    <Select displayEmpty fullWidth value={value} onChange={handleChange}>
      {options.map(({ value, label }) => (
        <MenuItem key={value} value={value}>
          {label}
        </MenuItem>
      ))}
    </Select>
  );
}
