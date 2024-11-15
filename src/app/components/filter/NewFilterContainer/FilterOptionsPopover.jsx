import React, { useEffect, useState } from 'react';
import { Input, MenuItem, Popover } from '@mui/material';
import { useSelector } from 'react-redux';
import { userProfileSelector } from 'selectors/user-selectors';
import { getCustomerTypeLabel } from 'helpers/customer-type-helper';
import { capitalizeWords } from 'helpers/capitalize';
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
  getTemplatesList,
  idField = 'id',
  labelField = 'label',
  popoverZindex,
}) => {
  const currentUser = useSelector(userProfileSelector);
  const customerTypeLabel = getCustomerTypeLabel(currentUser);
  const customerTypeLabelMixedCase = capitalizeWords(customerTypeLabel);
  const sanitizedFilters = filterOptionsList?.map((item) => {
    return item?.id?.toLowerCase() === 'patients'
    ? { ...item, label: customerTypeLabelMixedCase }
    : item;
  });
  const [filterOptions, setFilterOptions] = useState(sanitizedFilters);

  useEffect(() => {
    setFilterOptions(sanitizedFilters);
  }, [sanitizedFilters]);

  const handleFilterListSearch = (event) => {
    const filteredList = sanitizedFilters.filter((item) =>
      item[labelField]
        ?.toLowerCase()
        .includes(event.target.value.toLowerCase()),
    );
    setFilterOptions(filteredList);
  };

  return (
    <Popover
      sx={popoverZindex ? { zIndex: popoverZindex } : {}}
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
        placeholder="Search"
        sx={{ padding: '5px 10px 5px 15px' }}
        onChange={handleFilterListSearch}
      />
      <SelectOptionsContainer>
        <FilterOptionsListContainer>
          <FilterOptionsList>
            {filterOptions?.map((option) => (
              <MenuItem
                onClick={() => onFilterSelect(option[idField])}
                value={option[idField]}
                sx={{
                  textOverflow: 'ellipsis',
                  paddingBottom: '8px',
                  paddingTop: '8px',
                }}
              >
                {option[labelField]}
              </MenuItem>
            ))}
          </FilterOptionsList>
        </FilterOptionsListContainer>
      </SelectOptionsContainer>
    </Popover>
  );
};

export default FilterOptionsPopover;
