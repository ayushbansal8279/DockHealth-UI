import React, { useState } from 'react';
import { Input, MenuItem, Popover } from '@mui/material';
import {
  FilterOptionsList,
  FilterOptionsListContainer,
  SelectOptionsContainer,
} from './styled';

const FilterOptionsPopover = ({
  anchorEl,
  filterOptionsList = [],
  onFilterSelect,
  open,
  onClose,
  searchPhrase = '',
  onSearchChange,
  getTemplatesList,
}) => {
  const [filterOptionLists, setFilterOptionList] = useState(filterOptionsList);

  const handleFilterListSearch = (event) => {
    const filteredList = filterOptionsList.filter((item) =>
      item.label.toLowerCase().includes(event.target.value.toLowerCase()),
    );
    setFilterOptionList(filteredList);
  };

  return (
    <Popover
      PaperProps={{
        style: {
          width: 260,
          borderRadius: '7px 7px 0px 0px',
          overflowY: 'hidden',
          marginLeft: '95px',
          marginTop: '2px',
        },
      }}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      anchorEl={anchorEl}
      open={open}
      onEnter={getTemplatesList}
      onClose={onClose}
    >
      <Input
        fullWidth
        placeholder='Search'
        sx={{ padding: '5px 10px 5px 15px' }}
        onChange={handleFilterListSearch}
      />
      <SelectOptionsContainer>
        <FilterOptionsListContainer>
          <FilterOptionsList>
            {filterOptionLists?.map((option) => (
              <MenuItem
                onClick={() => onFilterSelect(option.id)}
                value={option.id}
                sx={{
                  textOverflow: 'ellipsis',
                  paddingBottom: '8px',
                  paddingTop: '8px',
                }}
              >
                {option.label}
              </MenuItem>
            ))}
          </FilterOptionsList>
        </FilterOptionsListContainer>
      </SelectOptionsContainer>
    </Popover>
  );
};

export default FilterOptionsPopover;
