import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  filterOptionsSelector,
  patientsSelectedFiltersSelector,
} from 'selectors/patients-selectors';
import { useDispatch, useSelector } from 'react-redux';
import * as PatientsActions from 'actions/patients-actions';
import FilterHeader from 'components/filter/FilterHeader/FilterHeader';
import { Box } from '@material-ui/core';
import FilterTable from 'components/filter/FilterTable/FilterTable';
import {
  createQuickFilter,
  deleteQuickFilter,
  selectQuickFilter,
  showAddQuickFilterOption,
  updateQuickFilter,
} from 'actions/mega-filter-actions';
import CustomFilters from 'components/filter/CustomFilters/CustomFilters';
import equals from 'ramda/src/equals';
import {
  addQuickFilterOptionSelector,
  quickFiltersSelector,
  selectedQuickFilterSelector,
} from 'selectors/mega-filter-selectors';

const PatientsFilter = () => {
  const [searchValue, setSearchValue] = useState('');
  const dispatch = useDispatch();
  const filterOptions = useSelector(filterOptionsSelector);
  const selectedFilters = useSelector(patientsSelectedFiltersSelector);

  const quickFiltersList = useSelector(quickFiltersSelector);
  const addQuickFilterOption = useSelector(addQuickFilterOptionSelector);
  const selectedQuickFilter = useSelector(selectedQuickFilterSelector);

  useEffect(() => {
    if (!filterOptions) {
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

  const handleSaveAsQuickFilter = useCallback(
    () => dispatch(showAddQuickFilterOption()),
    [dispatch],
  );

  const handleQuickFilterCreate = useCallback(
    name => dispatch(createQuickFilter(name, selectedFilters)),
    [dispatch, selectedFilters],
  );

  const handleQuickFilterUpdate = useCallback(
    (quickFilterIdentifier, name) =>
      dispatch(updateQuickFilter(quickFilterIdentifier, { name })),
    [dispatch],
  );

  const handleQuickFilterDelete = useCallback(
    quickFilterIdentifier => dispatch(deleteQuickFilter(quickFilterIdentifier)),
    [dispatch],
  );

  const wasChangedFilters = useMemo(
    () =>
      !equals(
        selectedFilters,
        quickFiltersList?.find(
          f => f.quickFilterIdentifier === selectedQuickFilter,
        )?.selectedOptions,
      ),
    [quickFiltersList, selectedFilters, selectedQuickFilter],
  );

  return (
    <>
      <FilterHeader
        title="Filter patients"
        selectedFilters={selectedFilters}
        searchValue={searchValue}
        onSearchValueChange={setSearchValue}
        onClear={handleClear}
        // onSaveAsNew={handleSaveAsQuickFilter}
      />
      <Box p={2} />
      <FilterTable
        searchValue={searchValue}
        filters={filterOptions}
        selectedFilters={selectedFilters}
        onSelectedFiltersChange={handleSelectedFiltersChange}
      >
        <CustomFilters
          quickFiltersList={quickFiltersList}
          addQuickFilterOption={addQuickFilterOption}
          selectedQuickFilter={selectedQuickFilter}
          selectQuickFilter={quickFilterIdentifier =>
            dispatch(selectQuickFilter(quickFilterIdentifier))
          }
          editModeEnabled={wasChangedFilters}
          onCreate={handleQuickFilterCreate}
          onUpdate={handleQuickFilterUpdate}
          onDelete={handleQuickFilterDelete}
        />
      </FilterTable>
    </>
  );
};

export default PatientsFilter;
