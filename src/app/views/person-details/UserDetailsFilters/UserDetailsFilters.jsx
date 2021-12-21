import React from 'react';
import MegaFilter from 'components/tasklist/MegaFilter/MegaFilter';
import { useDispatch, useSelector } from 'react-redux';
import { megaFilterSelector } from 'selectors/mega-filter-selectors';
import { selectFiltersForMegaFilter } from 'actions/mega-filter-actions';
import { getUserTaskFilterOptions } from 'actions/person-details-actions';
import { isEmpty } from 'ramda';
import {
  taskCountersSelector,
  tasksIsFetchingSelector,
  completedTasksIsFetchingSelector,
  tasksSelector,
  completedTasksSelector,
  currentTasksStatusSelector,
  userIdentifierSelector,
} from 'selectors/person-details-selectors';
import { TaskStatus } from 'helpers/task-helpers';
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
  const tasks = useSelector(tasksSelector);
  const completedTasks = useSelector(completedTasksSelector);
  const taskCounters = useSelector(taskCountersSelector);

  const { filters, selectedFilters } = megaFilter || {};

  const tasksAndSubTasksCount =
    selectedTab === TaskStatus.INCOMPLETE
      ? determineTaskCounts({
          selectedFilters,
          isFetching,
          tasks,
          tasksCount: taskCounters.incomplete,
          status: 'INCOMPLETE',
        })
      : determineTaskCounts({
          selectedFilters,
          isFetching,
          tasks: completedTasks,
          tasksCount: taskCounters.complete,
          status: 'COMPLETE',
        });

  const handleFilterChange = updatedFilters => {
    dispatch(
      selectFiltersForMegaFilter(updatedFilters, userIdentifier, selectedTab),
    );
  };

  const handleFilterOpen = () => {
    if (!selectedFilters || isEmpty(selectedFilters))
      dispatch(getUserTaskFilterOptions());
  };

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
      />
    </>
  );
};

export default UserDetailsFilters;
