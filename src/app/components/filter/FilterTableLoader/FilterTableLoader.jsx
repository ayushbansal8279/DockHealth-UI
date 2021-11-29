/* eslint-disable react/no-array-index-key */
import React from 'react';
import FilterOptionsColumn from 'components/filter/FilterOptionsColumn/FilterOptionsColumn';
import { FilterOptionLoader } from './styled';

const FilterTableLoader = () => {
  return (
    <>
      <FilterOptionsColumn>
        {new Array(12).fill().map((_, index) => (
          <FilterOptionLoader key={index} />
        ))}
      </FilterOptionsColumn>
      <FilterOptionsColumn>
        {new Array(5).fill().map((_, index) => (
          <FilterOptionLoader key={index} />
        ))}
      </FilterOptionsColumn>
      <FilterOptionsColumn>
        {new Array(12).fill().map((_, index) => (
          <FilterOptionLoader key={index} />
        ))}
      </FilterOptionsColumn>
      <FilterOptionsColumn>
        {new Array(8).fill().map((_, index) => (
          <FilterOptionLoader key={index} />
        ))}
      </FilterOptionsColumn>
      <FilterOptionsColumn>
        {new Array(2).fill().map((_, index) => (
          <FilterOptionLoader key={index} />
        ))}
      </FilterOptionsColumn>
    </>
  );
};

export default FilterTableLoader;
