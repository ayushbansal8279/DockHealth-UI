import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Input, ListItemText, MenuItem, Select } from '@mui/material';
import { ColorIndicator, DropdownBox } from './styled';

const TaskItemDropdown = ({
  value: initialValue,
  onChange,
  field: { options: initialOptions = [], displayOptions = [] },
  readOnly = false,
  withSearch = false,
}) => {
  const isRequired = displayOptions.includes('TASK_REQUIRED');
  const [value, setValue] = useState(initialValue);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredOptions = useMemo(() => {
    return initialOptions.filter(({ name }) =>
      name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [initialOptions, searchTerm]);

  const options = useMemo(() => {
    const o = filteredOptions.map(({ identifier, name, color, tag }) => ({
      label: name,
      tag,
      value: identifier,
      color,
    }));

    if (o.length > 0 && !isRequired) {
      o.unshift({ label: 'None', value: null });
    }
    return o;
  }, [filteredOptions, isRequired]);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleChange = useCallback(
    (event) => {
      setValue(event.target.value);
      onChange(event.target.value);
    },
    [onChange],
  );

  const handleKeyDown = (event) => {
    if (event.target.tagName === 'INPUT') {
      event.stopPropagation();
    }
  };

  const menuProps = useMemo(() => ({
    PaperProps: {},
    MenuListProps: {disablePadding: !withSearch,},
  }), [withSearch]);

  const handleDropdownClose = () => {
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleDropdownOpen = () => {
    setIsOpen(true);
  };

  const selectedOption = options.find((o) => o.value === value);
  const colorIndicator = selectedOption ? selectedOption.color : null;

  return (
    <>
      {colorIndicator && <ColorIndicator color={colorIndicator} />}
      <DropdownBox>
        <Select
          key={value}
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
            '&.Mui-disabled .MuiOutlinedInput-notchedOutline': {
              borderColor: 'transparent',
            },
            height: '26px',
          }}
          name="dropdownCustomField"
          value={value}
          renderValue={(selectedValue) => {
            const option = options.find((option) => option.value === selectedValue);
            return option ? (option.tag !== '' ? option.label : option.tag) : '';
          }}
          onChange={handleChange}
          IconComponent={() => <></>}
          disabled={readOnly}
          MenuProps={menuProps}
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
                placeholder="Search"
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
              />   
          )}
          {options.map((option) => {
            const { OptionIcon } = option;
            return (
              <MenuItem key={option.value} value={option.value}>
                {option.color && <ColorIndicator color={option.color} />}
                {OptionIcon || null}
                <ListItemText>{option.label}</ListItemText>
              </MenuItem>
            );
          })}
        </Select>
      </DropdownBox>
    </>
  );
};

export default TaskItemDropdown;
