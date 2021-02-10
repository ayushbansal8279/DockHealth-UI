import { isEmpty } from 'ramda';
import {
  put,
  call,
  takeEvery,
  all,
  takeLatest,
  select,
} from 'redux-saga/effects';
import {
  getGroupsByListId,
  createGroupAssignedToList,
  editGroupName,
  deleteGroup,
  sortGroups,
} from 'api/task-group-list-api';
import {
  addTask as createTaskApi,
  reorderTasksInGroup,
  getListTasksGroupedByTaskGroup,
  getFilteredTasksForList,
  reorderSubtasksForTask,
  reassignTasksToAnotherGroup as reassignTasksToAnotherGroupApi,
  getTasksForTaskListByTaskGroup,
  searchTasksByTaskList,
  getTaskDetails,
} from 'api/task-api';
import {
  TASK_GROUP_LIST_REQUEST,
  TASK_GROUP_LIST_SUCCESS,
  TASK_GROUP_LIST_FAILURE,
  REQUEST_TASKS,
  REQUEST_COMPLETED_TASKS,
  SET_AS_CURRENT_TASK,
  INCREASE_INCOMPLETE_TASK_COUNTERS,
  ADD_TASK_SUCCESS,
  REQUEST_TASKLIST_GROUP_TASKS,
  REQUEST_TASKLIST_GROUP_TASKS_SUCCESS,
  GET_TASKS_BY_GROUPS_SUCCESS,
  GET_COMPLETED_TASKS_BY_GROUPS_SUCCESS,
  REQUEST_MULTIPLE_TASKLIST_GROUP_TASKS_SUCCESS,
  GET_MORE_TASKS_REQUEST,
} from 'actions/action-types';
// eslint-disable-next-line import/no-cycle
import { storeAsCurrentTask } from 'actions/task-actions';
import { selectedFiltersInMegaFilterSelector } from 'selectors/mega-filter-selectors';
import { taskIsSelectedSelector } from 'selectors/task-selectors';
import {
  groupTasksSelector,
  taskDetailsSortSelector,
} from 'selectors/list-details-selectors';
import { showGlobalAlert } from 'alert/actions';
import AlertMessages from 'alert/AlertMessages';
import { openDrawer } from 'actions/task-drawer-actions';
import { checkIfTaskMatchesFilters } from 'helpers/filters-helpers';
import { locationParametersSelector } from 'location/selectors';

export const DO_GET_TASKS_GROUPS_LIST = 'DO_GET_TASKS_GROUPS_LIST';
export const DO_CREATE_TASKS_GROUP_LIST = 'DO_CREATE_TASKS_GROUP_LIST';
export const DO_EDIT_TASKS_GROUP_NAME = 'DO_EDIT_TASKS_GROUP_NAME';
export const DO_DELETE_TASKS_GROUP = 'DO_DELETE_TASKS_GROUP';
export const DO_SORT_TASKS_GROUPS = 'DO_SORT_TASKS_GROUPS';
export const DO_SORT_TASKS_IN_GROUPS = 'DO_SORT_TASKS_IN_GROUPS';
export const DO_SORT_SUBTASKS_IN_GROUPS = 'DO_SORT_SUBTASKS_IN_GROUPS';
export const DO_ON_ENTER_LIST_DETAILS = 'DO_ON_ENTER_LIST_DETAILS';
export const DO_CREATE_TASK = 'DO_CREATE_TASK';
export const DO_GET_TASKS_FOR_GROUP = 'DO_GET_TASKS_FOR_GROUP';
export const DO_REASSIGN_TASKS_TO_ANOTHER_GROUP =
  'DO_REASSIGN_TASKS_TO_ANOTHER_GROUP';
export const DO_FETCH_TASKS_BY_SEARCHED_TERM =
  'DO_FETCH_TASKS_BY_SEARCHED_TERM';
export const DO_FETCH_GROUPED_TASKS = 'DO_FETCH_GROUPED_TASKS';

export const getTasksGroupsList = payload => ({
  type: DO_GET_TASKS_GROUPS_LIST,
  ...payload,
});

export const createTaskGroupList = payload => ({
  type: DO_CREATE_TASKS_GROUP_LIST,
  ...payload,
});

export const editTasksGroupName = payload => ({
  type: DO_EDIT_TASKS_GROUP_NAME,
  ...payload,
});

export const deleteTasksGroup = payload => ({
  type: DO_DELETE_TASKS_GROUP,
  ...payload,
});

export const sortTasksGroups = payload => ({
  type: DO_SORT_TASKS_GROUPS,
  ...payload,
});

export const sortTasksInGroup = payload => ({
  type: DO_SORT_TASKS_IN_GROUPS,
  ...payload,
});

export const sortSubtasksInGroup = payload => ({
  type: DO_SORT_SUBTASKS_IN_GROUPS,
  ...payload,
});

export const reassignTasksToAnotherGroup = payload => ({
  type: DO_REASSIGN_TASKS_TO_ANOTHER_GROUP,
  ...payload,
});

export const createTask = payload => ({
  type: DO_CREATE_TASK,
  ...payload,
});

export const onEnterListDetails = payload => ({
  type: DO_ON_ENTER_LIST_DETAILS,
  ...payload,
});

export const getTasksForTaskGroups = payload => ({
  type: DO_GET_TASKS_FOR_GROUP,
  ...payload,
});

export const fetchTasksBySearchedTerm = payload => ({
  type: DO_FETCH_TASKS_BY_SEARCHED_TERM,
  ...payload,
});

export const fetchGroupedTasks = payload => ({
  type: DO_FETCH_GROUPED_TASKS,
  ...payload,
});

export const ListDetailsSagaActions = {
  getTasksGroupsList,
  createTaskGroupList,
  editTasksGroupName,
  deleteTasksGroup,
  sortTasksGroups,
  sortTasksInGroup,
  createTask,
  getTasksForTaskGroups,
  fetchTasksBySearchedTerm,
  fetchGroupedTasks,
};

export function* doGetTasksGroupsList(payload) {
  const { shouldSetRequestState = true } = payload;
  try {
    const { taskListIdentifier } = yield select(locationParametersSelector);

    if (shouldSetRequestState) {
      yield put({ type: TASK_GROUP_LIST_REQUEST });
    }
    const groups = yield call(getGroupsByListId, taskListIdentifier);
    yield put({
      type: TASK_GROUP_LIST_SUCCESS,
      listGroups: groups,
    });
  } catch (error) {
    yield put({ type: TASK_GROUP_LIST_FAILURE });
  }
}

export function* doFetchGroupedTasks({
  withLoader = true,
  loadingMore = false,
}) {
  try {
    const { taskListIdentifier, tabName: status } = yield select(
      locationParametersSelector,
    );

    const isCompletedTasksContext = status?.toLowerCase() === 'complete';

    if (withLoader) {
      yield put({
        type: isCompletedTasksContext ? REQUEST_COMPLETED_TASKS : REQUEST_TASKS,
      });
    }

    if (loadingMore) {
      yield put({
        type: GET_MORE_TASKS_REQUEST,
      });
    }

    const tasksActionType = isCompletedTasksContext
      ? GET_COMPLETED_TASKS_BY_GROUPS_SUCCESS
      : GET_TASKS_BY_GROUPS_SUCCESS;

    const selectedFilters = yield select(selectedFiltersInMegaFilterSelector);

    const sort = yield select(taskDetailsSortSelector);

    let groupedTasks;

    if (!selectedFilters || isEmpty(selectedFilters)) {
      groupedTasks = yield call(
        getListTasksGroupedByTaskGroup,
        taskListIdentifier,
        status,
        sort,
        0,
      );
    } else {
      groupedTasks = yield call(
        getFilteredTasksForList,
        taskListIdentifier,
        status,
        sort,
        selectedFilters,
      );
    }

    yield put({ type: tasksActionType, groupedTasks, loadingMore });
  } catch (error) {
    yield put({ type: TASK_GROUP_LIST_FAILURE });
  }
}

export function* doGetTaskDetails(payload) {
  const { taskIdentifier } = payload;
  try {
    const selectedTask = yield call(getTaskDetails, taskIdentifier);

    yield put({
      type: SET_AS_CURRENT_TASK,
      task: selectedTask,
      taskContext: 'list',
    });
  } catch (error) {
    yield put({ type: TASK_GROUP_LIST_FAILURE });
  }
}

export function* doCreateTasksGroupList(payload) {
  const { groupName } = payload;

  try {
    const { taskListIdentifier } = yield select(locationParametersSelector);
    yield put({ type: TASK_GROUP_LIST_REQUEST });
    yield call(createGroupAssignedToList, { taskListIdentifier, groupName });
    yield call(doGetTasksGroupsList, {
      taskListIdentifier,
      shouldSetRequestState: false,
    });
    yield put(showGlobalAlert(AlertMessages.CREATED));
  } catch (error) {
    yield put({ type: TASK_GROUP_LIST_FAILURE });
  }
}

export function* doEditTasksGroupName(payload) {
  const { groupId, newGroupName } = payload;

  try {
    const { taskListIdentifier } = yield select(locationParametersSelector);
    yield put({ type: TASK_GROUP_LIST_REQUEST });
    yield call(editGroupName, taskListIdentifier, groupId, newGroupName);
    yield call(doGetTasksGroupsList, {
      taskListIdentifier,
      shouldSetRequestState: false,
    });
    yield put(showGlobalAlert(AlertMessages.UPDATED));
  } catch (error) {
    yield put({ type: TASK_GROUP_LIST_FAILURE });
  }
}

export function* doDeleteTasksGroup(payload) {
  const { groupId } = payload;

  try {
    const { taskListIdentifier } = yield select(locationParametersSelector);
    yield put({ type: TASK_GROUP_LIST_REQUEST });
    yield call(deleteGroup, groupId);
    yield call(doGetTasksGroupsList, {
      taskListIdentifier,
      shouldSetRequestState: false,
    });
    yield call(doFetchGroupedTasks, {
      taskListIdentifier,
    });
    yield put(showGlobalAlert(AlertMessages.DELETED));
  } catch (error) {
    yield put({ type: TASK_GROUP_LIST_FAILURE });
  }
}

export function* doSortTasksGroups(payload) {
  const { taskGroupIdentifiers } = payload;

  try {
    const { taskListIdentifier } = yield select(locationParametersSelector);
    yield put({ type: TASK_GROUP_LIST_REQUEST });
    yield call(sortGroups, { taskGroupIdentifiers, taskListIdentifier });
    yield call(doGetTasksGroupsList, {
      taskListIdentifier,
      shouldSetRequestState: false,
    });
    yield put(showGlobalAlert(AlertMessages.UPDATED));
  } catch (error) {
    yield put({ type: TASK_GROUP_LIST_FAILURE });
  }
}

// eslint-disable-next-line consistent-return
export function* doGetTasksForTaskGroup(payload) {
  try {
    const {
      taskGroupIdentifier,
      status,
      startPosition,
      endPosition,
      refresh,
      shouldSaveInStore = true,
      sort,
      viewMode,
    } = payload;
    const { taskListIdentifier } = yield select(locationParametersSelector);
    yield put({
      type: REQUEST_TASKLIST_GROUP_TASKS,
      fetchedGroupIdentifier: taskGroupIdentifier,
      refresh,
    });

    const groupOfTasks = yield call(
      getTasksForTaskListByTaskGroup,
      taskListIdentifier,
      taskGroupIdentifier,
      status,
      startPosition,
      endPosition,
      sort,
      viewMode,
    );

    if (shouldSaveInStore) {
      yield put({
        type: REQUEST_TASKLIST_GROUP_TASKS_SUCCESS,
        groupOfTasks,
        refresh,
      });
    }

    return groupOfTasks;
  } catch (error) {
    yield put({ type: TASK_GROUP_LIST_FAILURE });
  }
}

export function* doSortTasksInGroup(payload) {
  const { orderedTaskIds, taskGroupIdentifier, endPosition } = payload;

  try {
    yield call(reorderTasksInGroup, {
      orderedTaskIds,
      taskGroupIdentifier,
    });

    yield all([put(showGlobalAlert(AlertMessages.UPDATED))]);
  } catch (error) {
    yield put({ type: TASK_GROUP_LIST_FAILURE });
    yield call(doGetTasksForTaskGroup, {
      taskGroupIdentifier,
      status: 'INCOMPLETE',
      refresh: true,
      endPosition,
    });
  }
}

export function* doSortSubtasksInGroup(payload) {
  const {
    orderedSubtaskIds,
    taskGroupIdentifier,
    parentTaskIdentifier,
  } = payload;

  try {
    const { taskListIdentifier } = yield select(locationParametersSelector);
    yield put({ type: TASK_GROUP_LIST_REQUEST });

    yield call(
      reorderSubtasksForTask,
      orderedSubtaskIds,
      taskGroupIdentifier,
      parentTaskIdentifier,
    );

    yield all([
      call(doGetTasksGroupsList, {
        taskListIdentifier,
        shouldSetRequestState: false,
      }),
      call(doGetTaskDetails, { taskIdentifier: parentTaskIdentifier }),
      yield put(showGlobalAlert(AlertMessages.UPDATED)),
    ]);
  } catch (error) {
    yield put({ type: TASK_GROUP_LIST_FAILURE });
  }
}

export function* doReassignTasksToAnotherGroup(payload) {
  const {
    taskIdentifiers,
    taskGroupIdentifier,
    sourceTaskGroupIdentifier,
    endPosition,
    sourceEndPosition,
    orderedTaskIds,
  } = payload;

  try {
    const { taskListIdentifier } = yield select(locationParametersSelector);

    yield call(
      reassignTasksToAnotherGroupApi,
      taskGroupIdentifier,
      taskIdentifiers,
    );

    yield call(reorderTasksInGroup, {
      orderedTaskIds,
      taskGroupIdentifier,
    });

    const sourceGroup = yield call(doGetTasksForTaskGroup, {
      taskGroupIdentifier: sourceTaskGroupIdentifier,
      status: 'INCOMPLETE',
      refresh: true,
      endPosition: sourceEndPosition,
      shouldSaveInStore: false,
    });

    const destinationGroup = yield call(doGetTasksForTaskGroup, {
      taskGroupIdentifier,
      status: 'INCOMPLETE',
      refresh: true,
      endPosition,
      shouldSaveInStore: false,
    });

    yield call(doGetTasksGroupsList, {
      taskListIdentifier,
      shouldSetRequestState: false,
    });

    yield put({
      type: REQUEST_MULTIPLE_TASKLIST_GROUP_TASKS_SUCCESS,
      groupsOfTasks: [sourceGroup, destinationGroup],
      refresh: true,
    });

    yield all([put(showGlobalAlert(AlertMessages.UPDATED))]);
  } catch (error) {
    yield put({ type: TASK_GROUP_LIST_FAILURE });
  }
}

export function* doOnEnterListDetails() {
  try {
    const { taskListIdentifier, taskIdentifier } = yield select(
      locationParametersSelector,
    );
    yield put({ type: TASK_GROUP_LIST_REQUEST });

    if (taskListIdentifier) {
      yield call(doGetTasksGroupsList, { taskListIdentifier });
    }

    const isSelectedTask = yield select(taskIsSelectedSelector);

    if (taskIdentifier && !isSelectedTask) {
      sessionStorage.setItem('selectedTaskIdentifier', taskIdentifier);
    }

    if (isSelectedTask) {
      yield put(openDrawer());
    }
  } catch (error) {
    yield put({ type: TASK_GROUP_LIST_FAILURE });
  }
}

export function* doCreateTask(payload) {
  try {
    const {
      taskGroupIdentifier,
      description,
      patientIdentifier,
      autoOpenDrawer,
    } = payload;
    const { taskListIdentifier } = yield select(locationParametersSelector);
    yield put({ type: TASK_GROUP_LIST_REQUEST });

    if (taskListIdentifier) {
      const createdTask = yield call(createTaskApi, {
        taskGroupIdentifier,
        taskListIdentifier,
        description,
        patientIdentifier,
      });

      const filters = yield select(selectedFiltersInMegaFilterSelector);

      if (filters && !isEmpty(filters)) {
        if (checkIfTaskMatchesFilters(createdTask, filters)) {
          yield put({
            type: ADD_TASK_SUCCESS,
            task: createdTask,
            taskGroupIdentifier,
          });
        }
      } else {
        const fetchedTasksGroups = yield select(groupTasksSelector);

        if (!fetchedTasksGroups[taskGroupIdentifier]) {
          yield call(doGetTasksForTaskGroup, {
            taskGroupIdentifier,
            status: 'INCOMPLETE',
          });
        } else {
          yield put({
            type: ADD_TASK_SUCCESS,
            task: createdTask,
            taskGroupIdentifier,
          });
        }
      }

      if (autoOpenDrawer) {
        yield put(storeAsCurrentTask(createdTask));
        yield put(openDrawer());
      }
      yield call(doGetTasksGroupsList, {
        taskListIdentifier,
        shouldSetRequestState: false,
      });
      yield put(showGlobalAlert(AlertMessages.TASK_CREATED));
      yield put({ type: INCREASE_INCOMPLETE_TASK_COUNTERS });
    }
  } catch (error) {
    yield put({ type: TASK_GROUP_LIST_FAILURE });
  }
}

export function* doFetchTasksBySearchedTerm(payload) {
  try {
    const { status, searchedTerm } = payload;
    const { taskListIdentifier } = yield select(locationParametersSelector);

    yield put({
      type: status === 'INCOMPLETE' ? REQUEST_TASKS : REQUEST_COMPLETED_TASKS,
    });
    const groupedTasks = yield call(
      searchTasksByTaskList,
      taskListIdentifier,
      searchedTerm,
      status,
    );

    const action =
      status === 'INCOMPLETE'
        ? GET_TASKS_BY_GROUPS_SUCCESS
        : GET_COMPLETED_TASKS_BY_GROUPS_SUCCESS;
    yield put({
      type: action,
      groupedTasks,
    });
  } catch (error) {
    yield put({ type: TASK_GROUP_LIST_FAILURE });
  }
}

export default function* watchTasksGroupsList() {
  yield takeLatest(DO_ON_ENTER_LIST_DETAILS, doOnEnterListDetails);
  yield takeEvery(DO_GET_TASKS_GROUPS_LIST, doGetTasksGroupsList);
  yield takeEvery(DO_CREATE_TASKS_GROUP_LIST, doCreateTasksGroupList);
  yield takeEvery(DO_EDIT_TASKS_GROUP_NAME, doEditTasksGroupName);
  yield takeEvery(DO_DELETE_TASKS_GROUP, doDeleteTasksGroup);
  yield takeEvery(DO_SORT_TASKS_GROUPS, doSortTasksGroups);
  yield takeEvery(DO_SORT_TASKS_IN_GROUPS, doSortTasksInGroup);
  yield takeEvery(DO_SORT_SUBTASKS_IN_GROUPS, doSortSubtasksInGroup);
  yield takeEvery(DO_CREATE_TASK, doCreateTask);
  yield takeEvery(
    DO_REASSIGN_TASKS_TO_ANOTHER_GROUP,
    doReassignTasksToAnotherGroup,
  );
  yield takeEvery(DO_GET_TASKS_FOR_GROUP, doGetTasksForTaskGroup);
  yield takeEvery(DO_FETCH_TASKS_BY_SEARCHED_TERM, doFetchTasksBySearchedTerm);
  yield takeLatest(DO_FETCH_GROUPED_TASKS, doFetchGroupedTasks);
}
