import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@material-ui/core';
import * as AnalyticsActions from 'actions/analytics-actions';
import FilterHeader from 'components/filter/FilterHeader/FilterHeader';
import {
  analyticsFiltersSelector,
  analyticsSelectedFiltersSelector,
} from 'selectors/analytics-selectors';
import FilterTable from 'components/filter/FilterTable/FilterTable';
import { showAddQuickFilterOption } from 'actions/mega-filter-actions';
import { updateQuickFilter } from 'api/mega-filter-api';

const AnalyticsFilters = () => {
  const dispatch = useDispatch();
  const filters = useSelector(analyticsFiltersSelector);
  const selectedFilters = useSelector(analyticsSelectedFiltersSelector);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    dispatch(AnalyticsActions.getAnalyticsFilterOptions());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectedFiltersChange = newSelectedFilters => {
    dispatch(AnalyticsActions.setAnalyticsSelectedFilters(newSelectedFilters));
  };

  const handleSaveAsQuickFilter = useCallback(
    () => dispatch(showAddQuickFilterOption()),
    [dispatch],
  );

  console.log('filters', selectedFilters);

  const handleSaveQuickFilter = useCallback(
    () =>
      dispatch(
        updateQuickFilter(selectedFilters, {
          selectedOptions: filters,
        }),
      ),
    [dispatch, filters, selectedFilters],
  );

  return (
    <>
      <FilterHeader
        title="Filter"
        filterActive={!!selectedFilters}
        searchValue={searchValue}
        onSearchValueChange={setSearchValue}
        onSave={handleSaveQuickFilter}
        selectedFilters={selectedFilters}
        onSaveAsNew={handleSaveAsQuickFilter}
        onClear={() => dispatch(AnalyticsActions.clearAnalyticsFilter())}
      />
      <Box p={2} />
      <FilterTable
        searchValue={searchValue}
        filters={filters}
        selectedFilters={selectedFilters}
        onSelectedFiltersChange={handleSelectedFiltersChange}
      />
    </>
  );
};

export default AnalyticsFilters;
