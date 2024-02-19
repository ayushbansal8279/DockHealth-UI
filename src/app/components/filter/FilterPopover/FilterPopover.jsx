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
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      open={open}
      onClose={onClose}
      sx={{ left: '60px' }}
    >
      <FilterContainer>{children}</FilterContainer>
    </Popover>
  );
};

export default FilterPopover;
