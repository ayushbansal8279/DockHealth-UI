/* eslint-disable import/extensions */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { MenuItem, ListItemText, Checkbox, Input, Select } from '@mui/material';
import zIndex from 'styles/z-index';
import { DropdownBox } from './styled';

const TaskItemMultiDropdown = ({
  value: initialValue,
  onChange,
  field,
  readOnly = false,
  withSearch = false,
}) => {
  const { options: initialOptions } = field;
  const [value, setValue] = useState(initialValue);
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  
  const options = useMemo(() => {
    const mappedOptions = initialOptions?.map(({ identifier, name }) => ({
      label: name,
      value: identifier,
    })) || [];
    if (searchQuery) {
      return mappedOptions.filter(option =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return mappedOptions;
  }, [initialOptions, searchQuery]);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleChange = useCallback(
    (event) => {
      const {
        target: { value: selectedValue },
      } = event;
      setValue(selectedValue);
      onChange(selectedValue);
    },
    [onChange],
  );
  console.log(value);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.target.tagName === 'INPUT') {
      event.stopPropagation();
    }
  };

  const handleDropdownClose = () => {
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleDropdownOpen = () => {
    setIsOpen(true);
  };

  return (
    <>
      <DropdownBox>
        <Select
          multiple
          readOnly={readOnly}
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
          onChange={handleChange}
          disableUnderline
          options={options}
          value={value ?? []}
          input={<Input />}
          IconComponent={() => <></>}
          renderValue={(selectedValue) =>
            selectedValue
              .map((selected) => {
                return initialOptions.find((option) => option.identifier === selected)?.name;
              })
              .join(', ')
          }
          onClose={handleDropdownClose}
          onOpen={handleDropdownOpen}
        >
          {withSearch && isOpen && (
              <Input
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'transparent',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'transparent',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'transparent',
                  },
                  height: '35px',
                  padding: '5px 10px 5px 15px',
                }}
                fullWidth
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search"
                onKeyDown={handleKeyDown}
              />   
          )}
          {options?.map((option) => {
            return (
              <MenuItem key={option.value} value={option.value} >
                <Checkbox checked={value.includes(option.value)} />
                <ListItemText primary={option.label} />
              </MenuItem>
            );
          })}
        </Select>
      </DropdownBox>
    </>
  );
};
export default TaskItemMultiDropdown;
