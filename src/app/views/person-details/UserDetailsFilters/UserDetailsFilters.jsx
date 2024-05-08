import React, { useCallback, useMemo } from 'react';
import MegaFilter from '@/app/components/tasklist/list-toolbar-buttons/MegaFilter/MegaFilter';
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
  completedTasksIsFetchingSelector,
  taskIdentifiersSelector,
  completedTaskIdentifiersSelector,
  currentTasksStatusSelector,
  userIdentifierSelector,
} from 'selectors/person-details-selectors';
import { TaskStatus } from 'helpers/task-helpers';
import equals from 'ramda/src/equals';
import { determineTaskCounts } from './helpers';

const UserDetailsFilters = () => {
  const dispatch = useDispatch();
  const megaFilter = useSelector(megaFilterSelector);
  const selectedTab = useSelector(currentTasksStatusSelector);
  const userIdentifier = useSelector(userIdentifierSelector);
  const isFetching = useSelector(tasksIsFetchingSelector);
  const isCompletedTasksFetching = useSelector(
    completedTasksIsFetchingSelector,
  );
  const taskIdentifiers = useSelector(taskIdentifiersSelector);
  const completedTaskIdentifiers = useSelector(
    completedTaskIdentifiersSelector,
  );
  const taskCounters = useSelector(taskCountersSelector);
  const quickFiltersList = useSelector(quickFiltersSelector);
  const addQuickFilterOption = useSelector(addQuickFilterOptionSelector);
  const selectedQuickFilter = useSelector(selectedQuickFilterSelector);
  const { filters, selectedFilters } = megaFilter || {};

  // @TODO - fix this
  const tasksAndSubTasksCount =
    selectedTab === TaskStatus.INCOMPLETE
      ? determineTaskCounts({
          selectedFilters,
          isFetching,
          tasks: taskIdentifiers,
          tasksCount: taskCounters.incomplete,
          status: 'INCOMPLETE',
        })
      : determineTaskCounts({
          selectedFilters,
          isFetching,
          tasks: completedTaskIdentifiers,
          tasksCount: taskCounters.complete,
          status: 'COMPLETE',
        });

  const handleFilterChange = (updatedFilters) => {
    dispatch(
      selectFiltersForMegaFilter(updatedFilters, userIdentifier, selectedTab),
    );
  };

  const handleFilterOpen = () => {
    dispatch(getUserTaskFilterOptions());
    dispatch(getQuickFilters({ personIdentifier: userIdentifier }));
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

  const handleSaveQuickFilter = useCallback(
    () =>
      dispatch(
        updateQuickFilter(
          selectedQuickFilter,
          {
            selectedOptions: selectedFilters,
          },
          { personIdentifier: userIdentifier },
        ),
      ),
    [dispatch, selectedFilters, selectedQuickFilter, userIdentifier],
  );

  const handleSelectQuickFilter = useCallback(
    (id, filtersSetup) => {
      dispatch(selectQuickFilter(id));
      dispatch(
        selectFiltersForMegaFilter(filtersSetup, userIdentifier, selectedTab),
      );
    },
    [dispatch, selectedTab, userIdentifier],
  );

  const handleQuickFilterCreate = useCallback(
    (name) =>
      dispatch(
        createQuickFilter(
          name,
          { personIdentifier: userIdentifier },
          selectedFilters,
        ),
      ),
    [dispatch, selectedFilters, userIdentifier],
  );

  const handleQuickFilterUpdate = useCallback(
    (quickFilterIdentifier, name) =>
      dispatch(
        updateQuickFilter(
          quickFilterIdentifier,
          { name },
          { personIdentifier: userIdentifier },
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
        isFetching={isFetching || isCompletedTasksFetching}
        onOpen={handleFilterOpen}
        quickFiltersList={quickFiltersList}
        addQuickFilterOption={addQuickFilterOption}
        selectedQuickFilter={selectedQuickFilter}
        selectQuickFilter={handleSelectQuickFilter}
        onSaveClick={handleSaveQuickFilter}
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
