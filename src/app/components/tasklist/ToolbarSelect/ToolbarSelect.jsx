import React, { useState } from 'react';
import { MenuItem, Box } from '@mui/material';
import zIndex from 'styles/z-index';
import { Select, SelectWrapper, SelectIcon } from './styled';
import palette from 'styles/palette';

const ToolbarSelect = ({ options, name, value, icon, ...restProps }) => {
  const [isOpen, setIsOpen] = useState(palette.newDarkBlue);

  return (
    <SelectWrapper>
      <Select
        onOpen={() => {
          setTimeout(() => {
            setIsOpen(palette.newBrightBlue);
          }, 0);
        }}
        onClose={() => {
          setTimeout(() => {
            document.activeElement.blur();
            setIsOpen(palette.newDarkBlue);
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
        isOpen={isOpen}
        value={value}
        renderValue={(selectedValue) => {
          const foundOption = options?.find(
            (option) => option.value === selectedValue,
          );
          return (
            <SelectIcon>
              {icon}
              <Box component="span" mx={0.5} />
              {foundOption?.label || ''}
            </SelectIcon>
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
