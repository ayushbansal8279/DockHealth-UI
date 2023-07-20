import React from 'react';
import { MenuItem, Box } from '@mui/material';
import zIndex from 'styles/z-index';
import { Select, SelectWrapper } from './styled';

const ToolbarSelect = ({ options, name, value, icon, ...restProps }) => {
  return (
    <SelectWrapper>
      <Select
        onClose={() => {
          setTimeout(() => {
            document.activeElement.blur();
          }, 0);
        }}
        iconcoloractive={restProps.iconColorActive}
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
        renderValue={(selectedValue) => {
          const foundOption = options?.find(
            (option) => option.value === selectedValue,
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
        {options?.map((option) => {
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
