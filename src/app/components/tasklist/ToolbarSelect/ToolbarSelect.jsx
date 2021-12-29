import React from 'react';
import { Select as MuiSelect, MenuItem } from '@material-ui/core';
import zIndex from 'styles/z-index';

const ToolbarSelect = ({ options, name, value, icon, ...restProps }) => {
  return (
    <MuiSelect
      MenuProps={{
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'left',
        },
        transformOrigin: {
          vertical: 'top',
          horizontal: 'left',
        },
        getContentAnchorEl: null,
        style: { zIndex: zIndex.optionsMenu },
      }}
      inputProps={{ name }}
      value={value}
      renderValue={selectedValue => {
        const { label } = options.find(
          option => option.value === selectedValue,
        );
        return (
          <div>
            {icon}
            {label}
          </div>
        );
      }}
      {...restProps}
    >
      {options?.map(option => {
        return (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        );
      })}
    </MuiSelect>
  );
};

export default ToolbarSelect;
