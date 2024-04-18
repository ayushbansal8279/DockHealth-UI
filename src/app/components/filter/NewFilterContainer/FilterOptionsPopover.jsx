import React, { useMemo, useCallback, useEffect } from 'react';
import { MenuItem, Popover } from '@mui/material';
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
  useEffect(() => {
    if (!open && searchPhrase !== '') onSearchChange('');
  }, [onSearchChange, open, searchPhrase]);

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
      {/* <SearchContainer isWorkFlowSearch={isWorkflowSearch}>
        <Search
          fullWidth
          noBackground
          value={searchPhrase}
          onChange={(event) => onSearchChange(event?.target?.value)}
          placeholder="Search"
          isWorkFlowSearch={isWorkflowSearch}
        />
      </SearchContainer> */}
      <SelectOptionsContainer>
        <FilterOptionsListContainer>
          <FilterOptionsList>
            {filterOptionsList?.map((option) => (
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
            {/* {!taskTemplatesIsLoading && taskTemplatesList?.length === 0 && (
              <EmptyLabel>There are no workflows to select from</EmptyLabel>
            )} */}
          </FilterOptionsList>
        </FilterOptionsListContainer>
      </SelectOptionsContainer>
    </Popover>
  );
};

export default FilterOptionsPopover;
