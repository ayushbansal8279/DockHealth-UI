import { useCallback } from 'react';
import { convertToPayload } from './helper';
import MegaFilter from '../../tasklist/list-toolbar-buttons/MegaFilter/MegaFilter';
import {
  showAddQuickFilterOption,
  selectQuickFilter,
  createQuickFilter,
  updateQuickFilter,
  deleteQuickFilter,
  getQuickFilters,
  clearFiltersForMegaFilter,
} from '@/app/actions/mega-filter-actions';
import { useDispatch, useSelector } from 'react-redux';
import {
  addQuickFilterOptionSelector,
  megaFilterSelector,
  quickFiltersSelector,
  selectedQuickFilterSelector,
} from '@/app/selectors/mega-filter-selectors';
import {
  selectedProfileFilters,
  getProfileFilterOptions,
  filterProfiles,
  clearFilteredProfiles,
} from '@/app/actions/profile-actions';
import React from 'react';

const ProfileFilter = ({ profileTypeIdentifier, fetchProfiles }) => {
  const dispatch = useDispatch();
  const selectedQuickFilter = useSelector(selectedQuickFilterSelector);
  const addQuickFilterOption = useSelector(addQuickFilterOptionSelector);
  const quickFiltersList = useSelector(quickFiltersSelector);

  const megaFilter = useSelector(megaFilterSelector);
  const { filters, selectedFilters } = megaFilter || {};

  const handleFilterOpen = () => {
    dispatch(getProfileFilterOptions());
    dispatch(getQuickFilters({ profileTypeIdentifier }));
  };

  const handleFilterSelect = async (newFilters) => {
    const payload = convertToPayload(newFilters);
    dispatch(filterProfiles(profileTypeIdentifier, payload));
    dispatch(selectedProfileFilters(newFilters));
  };

  const handleSaveAsQuickFilter = useCallback(
    () => dispatch(showAddQuickFilterOption()),
    [dispatch],
  );

  const handleSelectQuickFilter = useCallback(
    async (id, filtersSetup) => {
      dispatch(selectQuickFilter(id));
      const payload = convertToPayload(filtersSetup);
      dispatch(filterProfiles(profileTypeIdentifier, payload));
      dispatch(selectedProfileFilters(filtersSetup, id));
    },
    [dispatch, profileTypeIdentifier],
  );

  const handleQuickFilterCreate = useCallback(
    (name, selectedFilters, scope) =>
      dispatch(
        createQuickFilter(
          name,
          { profileTypeIdentifier },
          selectedFilters,
          scope,
        ),
      ),
    [dispatch, profileTypeIdentifier],
  );

  const handleQuickFilterUpdate = useCallback(
    (quickFilterIdentifier, name, selectedFilterOptions, scope) =>
      dispatch(
        updateQuickFilter(
          quickFilterIdentifier,
          { name, selectedOptions: selectedFilterOptions },
          { profileTypeIdentifier },
          scope,
        ),
      ),
    [dispatch],
  );

  const handleQuickFilterDelete = useCallback(
    (quickFilterIdentifier) =>
      dispatch(deleteQuickFilter(quickFilterIdentifier)),
    [dispatch],
  );

  const clearFilter = () => {
    dispatch(clearFiltersForMegaFilter());
    dispatch(clearFilteredProfiles());
    fetchProfiles();
  };

  return (
    <MegaFilter
      filters={filters}
      selectedFilters={selectedFilters}
      onSelectFilters={handleFilterSelect}
      isFetching={false}
      onOpen={handleFilterOpen}
      quickFiltersList={quickFiltersList}
      addQuickFilterOption={addQuickFilterOption}
      selectedQuickFilter={selectedQuickFilter}
      selectQuickFilter={handleSelectQuickFilter}
      onSaveAsNewClick={handleSaveAsQuickFilter}
      wasChangedFilters={false}
      onQuickFilterCreate={handleQuickFilterCreate}
      onQuickFilterUpdate={handleQuickFilterUpdate}
      onQuickFilterDelete={handleQuickFilterDelete}
      isDefaultDateFilterApplied={false}
      setClearFilter={clearFilter}
      showFilterCount={false}
    />
  );
};

export default ProfileFilter;
