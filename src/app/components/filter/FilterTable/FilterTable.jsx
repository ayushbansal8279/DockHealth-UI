import React from 'react';
import { useSelector } from 'react-redux';
import { userProfileSelector } from 'selectors/user-selectors';
import { capitalize } from 'helpers/capitalize';
import { getCustomerTypeLabel } from 'helpers/customer-type-helper';
import {
  extractSelectedOptions,
  FilterOptionsCategory,
  selectFilterOption,
  setFilterRangeEndDate,
  setFilterRangeStartDate,
  unselectFilterOption,
} from 'helpers/filter-options-helpers';
import FilterScrollableRow from 'components/filter/FilterScrollableRow/FilterScrollableRow';
import FilterOptionsColumn from 'components/filter/FilterOptionsColumn/FilterOptionsColumn';
import FilterTableLoader from 'components/filter/FilterTableLoader/FilterTableLoader';
import SearchableFilterOptions from 'components/filter/SearchableFilterOptions/SearchableFilterOptions';
import DateRangeOptions from 'components/filter/DateRangeOptions/DateRangeOptions';
import FilterOptionByCategory from 'components/filter/FilterOptionByCategory/FilterOptionByCategory';
import FilterOptionsGroup from 'components/filter/FilterOptionsGroup/FilterOptionsGroup';

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

  const handleFilterOptionUnselect = (categoryId, optionId) => {
    onSelectedFiltersChange(
      unselectFilterOption(categoryId, optionId, selectedFilters),
    );
  };

  const handleRangeDateStartChange = (categoryId, value) => {
    onSelectedFiltersChange(
      setFilterRangeStartDate(categoryId, value, selectedFilters),
    );
  };

  const handleRangeDateEndChange = (categoryId, value) => {
    onSelectedFiltersChange(
      setFilterRangeEndDate(categoryId, value, selectedFilters),
    );
  };

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
