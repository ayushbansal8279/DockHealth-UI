import React, { useCallback, useMemo, useState } from 'react';
import { Box } from '@material-ui/core';
import { capitalize } from 'helpers/capitalize';
import FilterOptionsColumn from 'components/filter/FilterOptionsColumn/FilterOptionsColumn';
import FilterScrollableRow from 'components/filter/FilterScrollableRow/FilterScrollableRow';
import FilterOption from 'components/filter/FilterOption/FilterOption';
import FilterHeader from 'components/filter/FilterHeader/FilterHeader';
import FilterOptionsGroup from 'components/filter/FilterOptionsGroup/FilterOptionsGroup';

const FilterOptionsTable = props => {
  const {
    title = 'Filter',
    selectedFilterOptions,
    filterOptions,
    onSelect,
    onClear,
  } = props;
  const [searchValue, setSearchValue] = useState('');

  const searchedFilterOptions = useMemo(() => {
    if (!searchValue) return filterOptions;

    return filterOptions?.map(f => {
      return {
        ...f,
        ...f.options?.reduce(
          (accumulator, option) => {
            if (
              option.displayValue
                .toLowerCase()
                .includes(searchValue.toLowerCase())
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
        ),
      };
    });
  }, [filterOptions, searchValue]);

  const renderOptionsGroup = useCallback(
    (groupId, options) => (
      <>
        {options
          ?.filter(({ key }) => selectedFilterOptions?.[groupId]?.includes(key))
          .map(({ key, displayValue, patientCount }) => (
            <FilterOption
              id={key}
              key={key}
              label={displayValue}
              count={patientCount}
              selected
              onClick={option => onSelect(groupId, option)}
            />
          ))}
        {options
          ?.filter(
            ({ key }) => !selectedFilterOptions?.[groupId]?.includes(key),
          )
          .map(({ key, displayValue, patientCount }) => (
            <FilterOption
              id={key}
              key={key}
              label={displayValue}
              count={patientCount}
              onClick={option => onSelect(groupId, option)}
            />
          ))}
      </>
    ),
    [onSelect, selectedFilterOptions],
  );

  return (
    <>
      <FilterHeader
        title={title}
        filterActive={selectedFilterOptions}
        searchValue={searchValue}
        onSearchValueChange={setSearchValue}
        onClear={onClear}
      />
      <Box p={2} />
      <FilterScrollableRow>
        {searchedFilterOptions
          ?.filter(({ options }) => options?.length > 0)
          .map(({ id, label, options, searchedOptions }) => (
            <FilterOptionsColumn key={id} label={capitalize(label)}>
              {searchedOptions?.length > 0 && (
                <FilterOptionsGroup>
                  {renderOptionsGroup(id, searchedOptions)}
                </FilterOptionsGroup>
              )}
              <FilterOptionsGroup>
                {renderOptionsGroup(id, options)}
              </FilterOptionsGroup>
            </FilterOptionsColumn>
          ))}
      </FilterScrollableRow>
    </>
  );
};

export default FilterOptionsTable;
