import React, { useEffect, useState } from 'react';
import {
  filterOptionsSelector,
  patientsSelectedFiltersSelector,
} from 'selectors/patients-selectors';
import { useDispatch, useSelector } from 'react-redux';
import * as PatientsActions from 'actions/patients-actions';
import FilterHeader from 'components/filter/FilterHeader/FilterHeader';
import { Box } from '@material-ui/core';
import FilterTable from 'components/filter/FilterTable/FilterTable';

const PatientsFilter = () => {
  const [searchValue, setSearchValue] = useState('');
  const dispatch = useDispatch();
  const filterOptions = useSelector(filterOptionsSelector);
  const selectedFilters = useSelector(patientsSelectedFiltersSelector);

  useEffect(() => {
    if (!selectedFilters && !filterOptions) {
      dispatch(PatientsActions.getCurrentPatientsListFilterOptions());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectedFiltersChange = newSelectedFilters => {
    dispatch(PatientsActions.setPatientsSelectedFilters(newSelectedFilters));
  };

  const handleClear = () => {
    dispatch(PatientsActions.clearPatientsFilters());
  };

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
      <FilterTable
        searchValue={searchValue}
        filters={filterOptions}
        selectedFilters={selectedFilters}
        onSelectedFiltersChange={handleSelectedFiltersChange}
      />
    </>
  );
};

export default PatientsFilter;
