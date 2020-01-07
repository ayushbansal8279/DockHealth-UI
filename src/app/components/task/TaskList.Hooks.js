import ascend from 'ramda/es/ascend';
import descend from 'ramda/es/descend';
import partition from 'ramda/es/partition';
import prop from 'ramda/es/prop';
import propEq from 'ramda/es/propEq';
import reverse from 'ramda/es/reverse';
import sortWith from 'ramda/es/sortWith';
import uniqBy from 'ramda/es/uniqBy';
import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getTaskPage } from '../../actions/task-actions';
import { onTaskSortingChanged } from '../../helpers/ga-event-helper';
import {
  DEFAULT_SORTING,
  NO_SORTING,
  TASK_LIST_SHOW_MORE_STEP,
} from './TaskList.Data';

export default ({
  otherTaskListProps,
  tasks: propsTasks,
  taskListId,
  isInbox,
  status,
  filterBy,
  search,
  listName,
}) => {
  const tasks = otherTaskListProps.listTasks ?? propsTasks;

  const addingNewTask = useSelector(store => store.taskState.addingNewTask);
  const newlyAddedTaskIds = useSelector(
    store => store.taskState.newlyAddedTaskIds,
  );

  const dispatch = useDispatch();

  const [taskListShowMoreIndex, setTaskListShowMoreIndex] = useState(1);
  const [isShowMoreLocked, setShowMoreLocked] = useState(false);
  const [currentSorting, setCurrentSorting] = useState(NO_SORTING);

  const [newlyAddedTasks, tasksToShow] = partition(
    ({ taskId }) => newlyAddedTaskIds.includes(taskId),
    tasks,
  );

  const showMoreButtonVisible =
    taskListShowMoreIndex * TASK_LIST_SHOW_MORE_STEP < tasks.length &&
    (taskListId || isInbox);

  const incrementTaskListShowMoreIndex = useCallback(() => {
    if (showMoreButtonVisible && !isShowMoreLocked) {
      setShowMoreLocked(true);
      getTaskPage({
        taskListId,
        status,
        filterBy,
        sortBy: 'TASK_DESCRIPTION',
        queryStartPosition: taskListShowMoreIndex * TASK_LIST_SHOW_MORE_STEP,
        search,
        isInbox,
        isAssignedByMeList: listName === 'assigned_by_me',
        isAssignedToMeList: listName === 'assigned_to_me',
      })(dispatch)
        .then(() => {
          setTaskListShowMoreIndex(taskListShowMoreIndex + 1);
          setShowMoreLocked(false);
        })
        .catch(() => {
          setShowMoreLocked(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showMoreButtonVisible, isShowMoreLocked, taskListShowMoreIndex]);

  const onSortingChanged = useCallback(
    ({ key }) => () => {
      let currentSortingColumns = currentSorting;
      if (currentSortingColumns.length === 0) {
        currentSortingColumns = DEFAULT_SORTING;
      }

      const [[currentSortingColumn], otherSortingColumns] = partition(
        propEq('key', key),
        currentSortingColumns,
      );

      const order = currentSortingColumn.order === 'asc' ? 'desc' : 'asc';

      onTaskSortingChanged(currentSortingColumn.key, order.toUpperCase());

      setCurrentSorting([
        ...otherSortingColumns,
        {
          ...currentSortingColumn,
          order,
        },
      ]);
    },
    [setCurrentSorting, currentSorting],
  );

  const sortingMethods = currentSorting.map(({ order, valueGetter }) =>
    (order === 'asc' ? ascend : descend)(valueGetter),
  );

  const sortedTasksToShow = uniqBy(prop('taskId'), [
    ...newlyAddedTasks,
    ...sortWith(reverse(sortingMethods), tasksToShow),
  ]);

  return {
    addingNewTask,
    newlyAddedTaskIds,
    dispatch,
    NO_SORTING,
    showMoreButtonVisible,
    incrementTaskListShowMoreIndex,
    onSortingChanged,
    sortingMethods,
    sortedTasksToShow,
    currentSorting,
    isShowMoreLocked,
  };
};
