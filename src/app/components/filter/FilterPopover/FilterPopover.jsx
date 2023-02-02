import { Popover } from '@mui/material';
import React from 'react';
import { FilterContainer } from './styled';

const FilterPopover = (props) => {
  const { anchorEl, open, onClose, children } = props;
  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      open={open}
      onClose={onClose}
    >
      <FilterContainer>{children}</FilterContainer>
    </Popover>
  );
};

export default FilterPopover;
