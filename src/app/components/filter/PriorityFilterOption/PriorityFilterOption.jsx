import React from 'react';
import { Box } from '@mui/material';
import FilterOption from 'components/filter/FilterOption/FilterOption';
import HighPriorityLabel from 'img/priority-high-label-icon.svg';

const PriorityFilterOption = ({ id, label, count, selected, onClick }) => (
  <FilterOption
    id={id}
    label={label}
    count={count}
    selected={selected}
    onClick={onClick}
    startAdornment={
      id === 'HIGH' ? (
        <img src={HighPriorityLabel} alt="Priority icon" />
      ) : (
        <Box px={0.8} />
      )
    }
  />
);

export default PriorityFilterOption;
