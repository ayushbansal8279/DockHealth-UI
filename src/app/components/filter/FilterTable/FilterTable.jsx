import React, { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { userProfileSelector } from 'selectors/user-selectors';
import { capitalize } from 'helpers/capitalize';
import { getCustomerTypeLabel } from 'helpers/customer-type-helper';
import {
  extractSelectedOptions,
  FilterOptionsCategory,
  selectFilterOption,
  setFilterRangeDate,
  unselectFilterOption,
} from 'helpers/filter-options-helpers';
import FilterScrollableRow from 'components/filter/FilterScrollableRow/FilterScrollableRow';
import FilterOptionsColumn from 'components/filter/FilterOptionsColumn/FilterOptionsColumn';
import FilterTableLoader from 'components/filter/FilterTableLoader/FilterTableLoader';
import SearchableFilterOptions from 'components/filter/SearchableFilterOptions/SearchableFilterOptions';
import DateRangeOptions from 'components/filter/DateRangeOptions/DateRangeOptions';
import FilterOptionByCategory from 'components/filter/FilterOptionByCategory/FilterOptionByCategory';
import FilterOptionsGroup from 'components/filter/FilterOptionsGroup/FilterOptionsGroup';

// eslint-disable-next-line sonarjs/cognitive-complexity
const FilterTable = props => {
  const {
    isLoading,
    searchValue,
    filters,
    selectedFilters,
    onSelectedFiltersChange,
    children,
  } = props;
  const currentUser = useSelector(userProfileSelector);
  const customerTypeLabel = getCustomerTypeLabel(currentUser);

  const handleFilterOptionSelect = (categoryId, optionId) => {
    onSelectedFiltersChange(
      selectFilterOption(categoryId, optionId, selectedFilters),
    );
  };

  const [startDate, setStartDate] = useState(() => {
    if (selectedFilters) {
      return selectedFilters[FilterOptionsCategory.DUE_DATE]?.dateStart;
    }
    return null;
  });

  const [endDate, setEndDate] = useState(() => {
    if (selectedFilters) {
      return selectedFilters[FilterOptionsCategory.DUE_DATE]?.dateEnd;
    }
    return null;
  });

  const handleFilterOptionUnselect = (categoryId, optionId) => {
    onSelectedFiltersChange(
      unselectFilterOption(categoryId, optionId, selectedFilters),
    );
  };

  const handleRangeDateStartChange = useCallback(
    (categoryId, value) => {
      setStartDate(value);
      if (endDate) {
        onSelectedFiltersChange(
          setFilterRangeDate(categoryId, value, endDate, selectedFilters),
        );
      }
    },
    [endDate, onSelectedFiltersChange, selectedFilters],
  );

  const handleRangeDateEndChange = useCallback(
    (categoryId, value) => {
      setEndDate(value);
      if (startDate) {
        onSelectedFiltersChange(
          setFilterRangeDate(categoryId, startDate, value, selectedFilters),
        );
      }
    },
    [onSelectedFiltersChange, selectedFilters, startDate],
  );

  return !isLoading && filters ? (
    <FilterScrollableRow>
      {children}
      {filters
        .filter(({ options }) => options?.length > 0)
        .map(({ id, label, options }) => (
          <FilterOptionsColumn
            key={id}
            label={capitalize(
              FilterOptionsCategory.PATIENTS === id ? customerTypeLabel : label,
            )}
          >
            <SearchableFilterOptions
              selectedFilterOptions={extractSelectedOptions(
                id,
                selectedFilters,
              )}
              filterOptions={options.filter(
                ({ key }) => !key?.includes('RANGE'),
              )}
              searchValue={searchValue}
              renderOption={({
                key: optionId,
                selected,
                displayValue,
                count,
                reference,
              }) => (
                <FilterOptionByCategory
                  key={optionId}
                  categoryId={id}
                  id={optionId}
                  selected={selected}
                  displayValue={displayValue}
                  count={count}
                  reference={reference}
                  onClick={option =>
                    (selected
                      ? handleFilterOptionUnselect
                      : handleFilterOptionSelect)(id, option)
                  }
                />
              )}
            />
            {options.some(({ key }) => key?.includes('RANGE')) && (
              <FilterOptionsGroup>
                <DateRangeOptions
                  dateStart={selectedFilters?.[id]?.dateStart}
                  dateEnd={selectedFilters?.[id]?.dateEnd}
                  onStartDateChange={v => handleRangeDateStartChange(id, v)}
                  onEndDateChange={v => handleRangeDateEndChange(id, v)}
                />
              </FilterOptionsGroup>
            )}
          </FilterOptionsColumn>
        ))}
    </FilterScrollableRow>
  ) : (
    <FilterTableLoader />
  );
};

export default FilterTable;
