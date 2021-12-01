import React, { useCallback, useMemo, useState } from 'react';
import {
  filterOptionsSelector,
  patientsSelectedFiltersSelector,
} from 'selectors/patients-selectors';
import { useDispatch, useSelector } from 'react-redux';
import * as PatientsActions from 'actions/patients-actions';
import { capitalize } from 'helpers/capitalize';
import FilterOptionsColumn from 'components/filter/FilterOptionsColumn/FilterOptionsColumn';
import FilterScrollableRow from 'components/filter/FilterScrollableRow/FilterScrollableRow';
import FilterOption from 'components/filter/FilterOption/FilterOption';
import FilterHeader from 'components/filter/FilterHeader/FilterHeader';
import FilterOptionsGroup from 'components/filter/FilterOptionsGroup/FilterOptionsGroup';
import { Box } from '@material-ui/core';

const PatientsFilter = () => {
  const [searchValue, setSearchValue] = useState('');
  const dispatch = useDispatch();
  const filterOptions = useSelector(filterOptionsSelector);
  const selectedFilters = useSelector(patientsSelectedFiltersSelector);

  const handleOptionClick = useCallback(
    (groupId, optionId) => {
      if (selectedFilters?.[groupId]?.includes(optionId)) {
        dispatch(PatientsActions.unselectPatientsFilter(groupId, optionId));
      } else {
        dispatch(PatientsActions.selectPatientsFilter(groupId, optionId));
      }
    },
    [dispatch, selectedFilters],
  );

  const handleClear = () => {
    dispatch(PatientsActions.clearPatientsFilters());
  };

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
          ?.filter(({ key }) => selectedFilters?.[groupId]?.includes(key))
          .map(({ key, displayValue, patientCount }) => (
            <FilterOption
              id={key}
              key={key}
              label={displayValue}
              count={patientCount}
              selected
              onClick={option => handleOptionClick(groupId, option)}
            />
          ))}
        {options
          ?.filter(({ key }) => !selectedFilters?.[groupId]?.includes(key))
          .map(({ key, displayValue, patientCount }) => (
            <FilterOption
              id={key}
              key={key}
              label={displayValue}
              count={patientCount}
              onClick={option => handleOptionClick(groupId, option)}
            />
          ))}
      </>
    ),
    [handleOptionClick, selectedFilters],
  );

  return (
    <>
      <FilterHeader
        title="Filter patients"
        filterActive={selectedFilters}
        searchValue={searchValue}
        onSearchValueChange={setSearchValue}
        onClear={handleClear}
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

export default PatientsFilter;
