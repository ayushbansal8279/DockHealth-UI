import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  filterOptionsSelector,
  patientsSelectedFiltersSelector,
} from 'selectors/patients-selectors';
import { useDispatch, useSelector } from 'react-redux';
import isEmpty from 'ramda/src/isEmpty';
import * as PatientsActions from 'actions/patients-actions';
import { organizationSelector } from 'selectors/organization-selectors';
import FilterHeader from 'components/filter/FilterHeader/FilterHeader';
import { Box } from '@mui/material';
import FilterTable from 'components/filter/FilterTable/FilterTable';
import {
  getQuickFilters,
  createQuickFilter,
  deleteQuickFilter,
  selectQuickFilter,
  showAddQuickFilterOption,
  updateQuickFilter,
  quickContextTypes,
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
  const isFilterApplied = selectedFilters && !isEmpty(selectedFilters);

  const quickFiltersList = useSelector(quickFiltersSelector);
  const addQuickFilterOption = useSelector(addQuickFilterOptionSelector);
  const selectedQuickFilter = useSelector(selectedQuickFilterSelector);

  const { organizationIdentifier } = useSelector(organizationSelector);

  useEffect(() => {
    if (!filterOptions || filterOptions?.length === 0) {
      dispatch(PatientsActions.getCurrentPatientsListFilterOptions());
    }
    dispatch(
      getQuickFilters({
        organizationIdentifier,
        contextType: quickContextTypes.PATIENTS,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectedFiltersChange = (newSelectedFilters) => {
    dispatch(PatientsActions.setPatientsSelectedFilters(newSelectedFilters));
  };

  const handleClear = () => {
    dispatch(PatientsActions.clearPatientsFilters());
    dispatch(selectQuickFilter(null));
  };

  const handleSaveAsQuickFilter = useCallback(
    () => dispatch(showAddQuickFilterOption()),
    [dispatch],
  );

  const handleSaveQuickFilter = useCallback(
    () =>
      dispatch(
        updateQuickFilter(
          selectedQuickFilter,
          {
            selectedOptions: selectedFilters,
          },
          { organizationIdentifier, contextType: quickContextTypes.PATIENTS },
        ),
      ),
    [dispatch, organizationIdentifier, selectedFilters, selectedQuickFilter],
  );

  const handleSelectQuickFilter = useCallback(
    (id, filtersSetup) => {
      // dispatch(selectQuickFilter(id));
      // dispatch(filterListDetailsTasks(filtersSetup));
      dispatch(selectQuickFilter(id));
      dispatch(PatientsActions.setPatientsSelectedFilters(filtersSetup));
    },
    [dispatch],
  );

  const handleQuickFilterCreate = useCallback(
    (name) =>
      dispatch(
        createQuickFilter(
          name,
          { organizationIdentifier, contextType: quickContextTypes.PATIENTS },
          selectedFilters,
        ),
      ),
    [dispatch, organizationIdentifier, selectedFilters],
  );

  const handleQuickFilterUpdate = useCallback(
    (quickFilterIdentifier, name) =>
      dispatch(updateQuickFilter(quickFilterIdentifier, { name })),
    [dispatch],
  );

  const handleQuickFilterDelete = useCallback(
    (quickFilterIdentifier) =>
      dispatch(deleteQuickFilter(quickFilterIdentifier)),
    [dispatch],
  );

  const wasChangedFilters = useMemo(
    () =>
      !equals(
        selectedFilters,
        quickFiltersList?.find(
          (f) => f.quickFilterIdentifier === selectedQuickFilter,
        )?.selectedOptions,
      ),
    [quickFiltersList, selectedFilters, selectedQuickFilter],
  );

  return (
    <>
      <FilterHeader
        title="Filter patients"
        filterActive={isFilterApplied}
        selectedFilters={selectedFilters}
        searchValue={searchValue}
        onSearchValueChange={setSearchValue}
        onClear={handleClear}
        onSave={handleSaveQuickFilter}
        onSaveAsNew={handleSaveAsQuickFilter}
        selectedQuickFilter={selectedQuickFilter}
        editModeEnabled={wasChangedFilters}
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
          selectQuickFilter={handleSelectQuickFilter}
          editModeEnabled={false}
          onCreate={handleQuickFilterCreate}
          onUpdate={handleQuickFilterUpdate}
          onDelete={handleQuickFilterDelete}
        />
      </FilterTable>
    </>
  );
};

export default PatientsFilter;
