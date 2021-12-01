import React from 'react';
import FilterOption from '../FilterOption/FilterOption';

const DateFilterOption = ({ id, label, count, selected, onClick }) =>
  id.includes('RANGE') ? null : (
    <FilterOption
      id={id}
      label={label}
      count={count}
      selected={selected}
      onClick={onClick}
    />
  );

export default DateFilterOption;
