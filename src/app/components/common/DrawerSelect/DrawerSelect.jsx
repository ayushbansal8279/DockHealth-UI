import React from 'react';
import { Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import palette from '@/app/styles/palette';

const arrowSx = {
  color: palette.brightBlue,
  stroke: palette.brightBlue,
  marginRight: '5px',
};

const selectSx = {
  borderRadius: '10px',
  height: '45px',
};

const labelSx = {
  textTransform: 'none',
  fontSize: '16px',
  '&.MuiInputLabel-outlined': {
    transform: 'translate(14px, 10px) scale(1)',
    '&.MuiInputLabel-shrink': {
      transform: 'translate(14px, -9px) scale(0.75)',
    },
  },
};

const Arrow = () => {
  return <ArrowDropDownIcon sx={arrowSx} />;
};

const DrawerSelect = ({ label, value, onChange, options = [] }) => {
  return (
    <FormControl fullWidth variant="outlined">
      <InputLabel sx={labelSx} id={`${label}-select-label`}>
        {label}
      </InputLabel>
      <Select
        label={label}
        value={value}
        onChange={onChange}
        displayEmpty
        fullWidth
        renderValue={(selected) => {
          if (selected === '' || selected === undefined) {
            return;
          }
          const selectedOption = options.find((opt) => opt.value === selected);
          return selectedOption?.label ?? '';
        }}
        sx={selectSx}
        IconComponent={Arrow}
      >
        {options.length === 0 ? (
          <MenuItem disabled>No options available</MenuItem>
        ) : (
          options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))
        )}
      </Select>
    </FormControl>
  );
};

export default DrawerSelect;
