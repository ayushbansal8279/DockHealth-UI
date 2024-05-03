/* eslint-disable react/no-array-index-key */
import React from 'react';
import FilterOptionsColumn from 'components/filter/FilterOptionsColumn/FilterOptionsColumn';
import FilterScrollableRow from 'components/filter/FilterScrollableRow/FilterScrollableRow';
import { FilterOptionLoader } from './styled';

const FilterTableLoader = () => {
  return (
    <FilterScrollableRow>
      <FilterOptionsColumn>
        {new Array(1).fill().map((_, index) => (
          <FilterOptionLoader key={index} />
        ))}
      </FilterOptionsColumn>
      <FilterOptionsColumn>
        {new Array(1).fill().map((_, index) => (
          <FilterOptionLoader key={index} />
        ))}
      </FilterOptionsColumn>
      <FilterOptionsColumn>
        {new Array(1).fill().map((_, index) => (
          <FilterOptionLoader key={index} />
        ))}
      </FilterOptionsColumn>
    </FilterScrollableRow>
  );
};

export default FilterTableLoader;
