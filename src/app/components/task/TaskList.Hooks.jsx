import {
  ascend,
  descend,
  partition,
  prop,
  propEq,
  reverse,
  sortWith,
  uniqBy,
} from 'ramda';
import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { hashHistory } from 'react-router';
import { useToggle } from 'react-use';
import { getTaskPage, getInboxTasks } from '../../actions/task-actions';
import { onTaskSortingChanged } from '../../helpers/ga-event-helper';
import {
  DEFAULT_SORTING,
  NO_SORTING,
  TASK_LIST_SHOW_MORE_STEP,
} from './TaskList.Data';

export default ({
  otherTaskListProps,
  tasks: propsTasks,
  taskListIdentifier,
  isInbox,
  status,
  filterBy,
  sortBy,
  search,
  listName,
  isMultiList,
  taskDrawerProps,
  onCompletedTasksRequest,
}) => {
  const tasks = otherTaskListProps.listTasks ?? propsTasks;

  const addingNewTask = useSelector(store => store.taskState.addingNewTask);
  const newlyAddedTaskIds = useSelector(
    store => store.taskState.newlyAddedTaskIds,
  );

  const { addingNewSubtask, addingNewSubtaskParentId } = useSelector(store => ({
    addingNewSubtask: store.taskState.addingNewSubtask,
    addingNewSubtaskParentId: store.taskState.addingNewSubtaskParentId,
  }));

  const dispatch = useDispatch();

  const [taskListShowMoreIndex, setTaskListShowMoreIndex] = useState(1);
  const [isShowMoreLocked, setShowMoreLocked] = useState(false);
  const [currentSorting, setCurrentSorting] = useState(NO_SORTING);

  const [newlyAddedTasks, tasksToShow] = partition(
    ({ taskIdentifier }) => newlyAddedTaskIds.includes(taskIdentifier),
    tasks,
  );

  const showMoreButtonVisible =
    taskListShowMoreIndex * TASK_LIST_SHOW_MORE_STEP <= tasks.length &&
    (taskListIdentifier || isInbox);

  const incrementTaskListShowMoreIndex = useCallback(() => {
    if (showMoreButtonVisible && !isShowMoreLocked) {
      setShowMoreLocked(true);
      getTaskPage({
        taskListIdentifier,
        status,
        filterBy,
        sortBy,
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

  const sortedTasksToShow = uniqBy(prop('taskIdentifier'), [
    ...newlyAddedTasks,
    ...sortWith(reverse(sortingMethods), tasksToShow),
  ]);

  const [areCompleteTasksShown, toggleCompletedTasksShown] = useToggle(false);

  const { selectedTaskId, listTasks } = otherTaskListProps || {};

  const otherTaskListSubtasks = (listTasks ?? []).flatMap(
    ({ subtasks }) => subtasks,
  );

  const otherTaskListSubtasksIdentifiers = otherTaskListSubtasks.map(
    ({ taskIdentifier }) => taskIdentifier,
  );

  const otherTaskListIdentifiers = (listTasks ?? []).map(
    ({ taskIdentifier }) => taskIdentifier,
  );

  const isCurrentListSelected =
    (isMultiList &&
      otherTaskListSubtasksIdentifiers.includes(selectedTaskId)) ||
    otherTaskListIdentifiers.includes(selectedTaskId) ||
    (addingNewSubtask &&
      otherTaskListIdentifiers.includes(addingNewSubtaskParentId));

  const globalSearch =
    hashHistory.getCurrentLocation()?.pathname?.startsWith('/taskSearch') ??
    false;

  const getCompletedTasks = () => {
    let outputPromise = Promise.resolve();

    if (!areCompleteTasksShown) {
      const listIdentifier =
        taskListIdentifier ?? taskDrawerProps?.taskList?.taskListIdentifier;

      if (listIdentifier) {
        outputPromise = onCompletedTasksRequest(listIdentifier, filterBy, '');
      } else {
        outputPromise = getInboxTasks('COMPLETE', '', filterBy)(dispatch);
      }
    }

    toggleCompletedTasksShown();

    return outputPromise;
  };

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
    addingNewSubtask,
    addingNewSubtaskParentId,
    isCurrentListSelected,
    globalSearch,
    getCompletedTasks,
    listTasks,
    areCompleteTasksShown,
    toggleCompletedTasksShown,
  };
};
