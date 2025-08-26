import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  megaFilterSelector,
  quickFiltersSelector,
  addQuickFilterOptionSelector,
  selectedQuickFilterSelector,
} from 'selectors/mega-filter-selectors';
import {
  getQuickFilters,
  selectFiltersForMegaFilter,
  selectQuickFilter,
  showAddQuickFilterOption,
  createQuickFilter,
  updateQuickFilter,
  deleteQuickFilter,
} from 'actions/mega-filter-actions';
import { getUserTaskFilterOptions } from 'actions/person-details-actions';
import {
  taskCountersSelector,
  tasksIsFetchingSelector,
  taskIdentifiersSelector,
  currentTasksStatusSelector,
  userIdentifierSelector,
} from 'selectors/person-details-selectors';
import { TaskStatus } from 'helpers/task-helpers';
import equals from 'ramda/src/equals';
import MegaFilter from '@/app/components/tasklist/list-toolbar-buttons/MegaFilter/MegaFilter';
import { determineTaskCounts } from './helpers';

const UserDetailsFilters = () => {
  const dispatch = useDispatch();
  const megaFilter = useSelector(megaFilterSelector);
  const selectedTab = useSelector(currentTasksStatusSelector);
  const userIdentifier = useSelector(userIdentifierSelector);
  const isFetching = useSelector(tasksIsFetchingSelector);
  const taskIdentifiers = useSelector(taskIdentifiersSelector);
  const taskCounters = useSelector(taskCountersSelector);
  const quickFiltersList = useSelector(quickFiltersSelector);
  const addQuickFilterOption = useSelector(addQuickFilterOptionSelector);
  const selectedQuickFilter = useSelector(selectedQuickFilterSelector);
  const { filters, selectedFilters } = megaFilter || {};

  // @TODO - fix this
  const tasksAndSubTasksCount = determineTaskCounts({
    selectedFilters,
    isFetching,
    tasks: taskIdentifiers,
    tasksCount: selectedTab === TaskStatus.INCOMPLETE ? taskCounters.incomplete : taskCounters.complete,
    status: selectedTab === TaskStatus.INCOMPLETE ? 'INCOMPLETE' : 'COMPLETE',
  });

  const handleFilterChange = (updatedFilters) => {
    dispatch(
      selectFiltersForMegaFilter(updatedFilters, userIdentifier, selectedTab),
    );
  };

  const handleFilterOpen = () => {
    dispatch(getUserTaskFilterOptions());
    dispatch(getQuickFilters({ contextType: 'PERSONS' }));
  };

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

  const handleSaveAsQuickFilter = useCallback(
    () => dispatch(showAddQuickFilterOption()),
    [dispatch],
  );

  const handleSelectQuickFilter = useCallback(
    (id, filtersSetup) => {
      dispatch(selectQuickFilter(id));
      dispatch(
        selectFiltersForMegaFilter(
          filtersSetup,
          userIdentifier,
          selectedTab,
          id,
        ),
      );
    },
    [dispatch, selectedTab, userIdentifier],
  );

  const handleQuickFilterCreate = useCallback(
    (name, scope) =>
      dispatch(
        createQuickFilter(
          name,
          { personIdentifier: userIdentifier },
          selectedFilters,
          scope,
        ),
      ),
    [dispatch, selectedFilters, userIdentifier],
  );

  const handleQuickFilterUpdate = useCallback(
    (quickFilterIdentifier, name, selectedFilterOptions, scope) =>
      dispatch(
        updateQuickFilter(
          quickFilterIdentifier,
          { name, selectedOptions: selectedFilterOptions },
          { personIdentifier: userIdentifier },
          scope,
        ),
      ),
    [dispatch, userIdentifier],
  );

  const handleQuickFilterDelete = useCallback(
    (quickFilterIdentifier) =>
      dispatch(deleteQuickFilter(quickFilterIdentifier)),
    [dispatch],
  );

  return (
    <>
      <MegaFilter
        filters={filters}
        selectedFilters={selectedFilters}
        onSelectFilters={handleFilterChange}
        tasksAndSubTasksCount={tasksAndSubTasksCount}
        activeItemsAmount={
          selectedTab === TaskStatus.INCOMPLETE
            ? taskCounters.incomplete
            : taskCounters.complete
        }
        isFetching={isFetching}
        onOpen={handleFilterOpen}
        quickFiltersList={quickFiltersList}
        addQuickFilterOption={addQuickFilterOption}
        selectedQuickFilter={selectedQuickFilter}
        selectQuickFilter={handleSelectQuickFilter}
        onSaveAsNewClick={handleSaveAsQuickFilter}
        wasChangedFilters={wasChangedFilters}
        onQuickFilterCreate={handleQuickFilterCreate}
        onQuickFilterUpdate={handleQuickFilterUpdate}
        onQuickFilterDelete={handleQuickFilterDelete}
      />
    </>
  );
};

export default UserDetailsFilters;
