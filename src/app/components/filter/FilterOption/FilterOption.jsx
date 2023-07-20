import React from 'react';
import {
  FilterOptionWrapper,
  OptionCount,
  OptionLabel,
  StartAdornmentWrapper,
} from './styled';

const FilterOption = (props) => {
  const { id, selected, label, count, color, startAdornment, onClick } = props;

  return (
    <FilterOptionWrapper
      color={color}
      selected={selected}
      disabled={count === 0}
      onClick={() => count !== 0 && onClick(id)}
    >
      {startAdornment && (
        <StartAdornmentWrapper>{startAdornment}</StartAdornmentWrapper>
      )}
      <OptionLabel>{label}</OptionLabel>
      {Number.isInteger(count) && <OptionCount>{count}</OptionCount>}
    </FilterOptionWrapper>
  );
};

export default FilterOption;
