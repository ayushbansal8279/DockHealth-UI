import React from 'react';
import {
  Autocomplete,
  Checkbox,
  ListItemText,
  TextField,
} from '@mui/material';
import { useGridApiContext, GridRenderEditCellParams } from '@mui/x-data-grid-premium';

interface MultiDropDownEditCellProps extends GridRenderEditCellParams<any, { values?: string[]; value?: string } | undefined> {
  options: { name: string; identifier: string }[];
}

export default function MultiDropDownEditCell({
  id,
  field,
  value = { values: [], value: '' },
  options,
}: MultiDropDownEditCellProps) {
  const apiRef = useGridApiContext();

  let valueToUse = '';
  if (typeof value === 'string') {
    valueToUse = value;
  } else if (value && typeof value === 'object') {
    valueToUse = value.value ? value.value : (value.values ? value.values.join(',') : '');
  }

  const handleChange = (
    _: React.ChangeEvent<{}>, 
    newValue: { identifier: string; name: string }[] 
  ) => {
    const selectedIdentifiersArray = newValue.map((option) => option.identifier);
    const selectedNamesArray = newValue.map((option) => option.name);
    const valueString = selectedNamesArray.join(',');

    apiRef.current.setEditCellValue({
      id,
      field,
      value: {
        values: selectedIdentifiersArray, 
        value: valueString,                
      },
    });
  };

  return (
    <Autocomplete
      fullWidth
      multiple
      value={options.filter((option) => valueToUse.split(',').includes(option.name))}
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