import React from 'react';
import { MenuItem, Box, Select } from '@material-ui/core';
import zIndex from 'styles/z-index';
import { useStyles, SelectWrapper } from './styled';

const ToolbarSelect = ({ options, name, value, icon, ...restProps }) => {
  const classes = useStyles({ iconColorActive: restProps.iconColorActive });

  return (
    <SelectWrapper>
      <Select
        onClose={() => {
          setTimeout(() => {
            document.activeElement.blur();
          }, 0);
        }}
        className={classes.select}
        MenuProps={{
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'right',
          },
          transformOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          getContentAnchorEl: null,
          style: { zIndex: zIndex.optionsMenu },
        }}
        variant="outlined"
        inputProps={{ name }}
        value={value}
        renderValue={selectedValue => {
          const foundOption = options?.find(
            option => option.value === selectedValue,
          );
          return (
            <>
              {icon}
              <Box component="span" mx={0.5} />
              {foundOption?.label || ''}
            </>
          );
        }}
        {...restProps}
      >
        {options?.map(option => {
          return (
            <MenuItem
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </MenuItem>
          );
        })}
      </Select>
    </SelectWrapper>
  );
};

export default ToolbarSelect;
