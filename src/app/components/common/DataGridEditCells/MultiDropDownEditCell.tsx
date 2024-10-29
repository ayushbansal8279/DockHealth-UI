import React from 'react';
import {
  Autocomplete,
  Checkbox,
  ListItemText,
  TextField,
} from '@mui/material';
import { useGridApiContext, GridRenderEditCellParams } from '@mui/x-data-grid-premium';

interface MultiDropdownEditCellProps extends GridRenderEditCellParams<any, { customFieldIdentifier: string; values: string[]; displayNames: string[] } | undefined> {
  options: { name: string; identifier: string }[];
}

export default function MultiDropdownEditCell({
  id,
  field,
  value = { customFieldIdentifier: '', values: [], displayNames: [] },
  options,
}: MultiDropdownEditCellProps) {
  const apiRef = useGridApiContext();

  const handleChange = (_, newValue) => {
    const selectedValues = newValue.map((option) => option.identifier);
    const selectedNames = newValue.map((option) => option.name);

    apiRef.current.setEditCellValue({
      id,
      field,
      value: {
        customFieldIdentifier: value.customFieldIdentifier,
        values: selectedValues,
        displayNames: selectedNames,
      },
    });
  };

  return (
    <Autocomplete
      fullWidth
      multiple
      value={options.filter((option) => value.values && value.values.includes(option.identifier))}
      onChange={handleChange}
      options={options}
      getOptionLabel={(option) => option.name} 
      disableCloseOnSelect
      renderOption={(props, option, { selected }) => (
        <li {...props}>
          <Checkbox style={{ marginRight: 8 }} checked={selected} />
          <ListItemText primary={option.name} />
        </li>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          placeholder="Select options"
          fullWidth
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
      )}
    />
  );
}