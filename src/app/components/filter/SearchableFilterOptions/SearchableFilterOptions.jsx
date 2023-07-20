import FilterOptionsGroup from 'components/filter/FilterOptionsGroup/FilterOptionsGroup';
import React from 'react';

const SearchableFilterOptions = (props) => {
  const { selectedFilterOptions, filterOptions, searchValue, renderOption } =
    props;

  const { searchedOptions, options } =
    filterOptions?.reduce(
      (accumulator, option) => {
        if (!searchValue) {
          accumulator.options = filterOptions;
        } else if (
          option.displayValue.toLowerCase().includes(searchValue.toLowerCase())
        ) {
          accumulator.searchedOptions.push(option);
        } else {
          accumulator.options.push(option);
        }
        return accumulator;
      },
      {
        options: [],
        searchedOptions: [],
      },
    ) || {};

  return (
    <>
      {searchedOptions?.length > 0 && (
        <FilterOptionsGroup>
          {searchedOptions
            ?.filter(({ key }) => selectedFilterOptions?.includes(key))
            .map((o) => renderOption({ ...o, selected: true }))}
          {searchedOptions
            ?.filter(({ key }) => !selectedFilterOptions?.includes(key))
            .map(renderOption)}
        </FilterOptionsGroup>
      )}
      {options?.length > 0 && (
        <FilterOptionsGroup>
          {options
            ?.filter(({ key }) => selectedFilterOptions?.includes(key))
            .map((o) => renderOption({ ...o, selected: true }))}
          {options
            ?.filter(({ key }) => !selectedFilterOptions?.includes(key))
            .map(renderOption)}
        </FilterOptionsGroup>
      )}
    </>
  );
};

export default SearchableFilterOptions;
