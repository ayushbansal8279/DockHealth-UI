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
  getListTasksByUser,
  getFilteredTasksForList,
  reorderSubtasksForTask,
  reassignTasksToAnotherGroup as reassignTasksToAnotherGroupApi,
} from 'api/task-api';
import {
  TASK_GROUP_LIST_REQUEST,
  TASK_GROUP_LIST_SUCCESS,
  TASK_GROUP_LIST_FAILURE,
  GET_TASKS_SUCCESS,
  GET_COMPLETED_TASKS_SUCCESS,
} from 'actions/action-types';
import { selectedFiltersInMegaFilterSelector } from 'selectors/mega-filter-selectors';
import { showGlobalAlert } from 'alert/actions';
import AlertMessages from 'alert/AlertMessages';
import { locationParametersSelector } from '../location/selectors';

export const DO_GET_TASKS_GROUPS_LIST = 'DO_GET_TASKS_GROUPS_LIST';
export const DO_CREATE_TASKS_GROUP_LIST = 'DO_CREATE_TASKS_GROUP_LIST';
export const DO_EDIT_TASKS_GROUP_NAME = 'DO_EDIT_TASKS_GROUP_NAME';
export const DO_DELETE_TASKS_GROUP = 'DO_DELETE_TASKS_GROUP';
export const DO_SORT_TASKS_GROUPS = 'DO_SORT_TASKS_GROUPS';
export const DO_SORT_TASKS_IN_GROUPS = 'DO_SORT_TASKS_IN_GROUPS';
export const DO_SORT_SUBTASKS_IN_GROUPS = 'DO_SORT_SUBTASKS_IN_GROUPS';
export const DO_ON_ENTER_TASKS_GROUPS_LIST = 'DO_ON_ENTER_TASKS_GROUPS_LIST';
export const DO_CREATE_TASK = 'DO_CREATE_TASK';

export const DO_REASSIGN_TASKS_TO_ANOTHER_GROUP =
  'DO_REASSIGN_TASKS_TO_ANOTHER_GROUP';

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

export const onEnterTasksGroupsList = payload => ({
  type: DO_ON_ENTER_TASKS_GROUPS_LIST,
  ...payload,
});

export const TasksGroupsListActions = {
  getTasksGroupsList,
  createTaskGroupList,
  editTasksGroupName,
  deleteTasksGroup,
  sortTasksGroups,
  sortTasksInGroup,
  createTask,
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
      groupList: groups,
    });
  } catch (error) {
    yield put({ type: TASK_GROUP_LIST_FAILURE });
  }
}

export function* doGetTasksList(payload) {
  const { status = 'INCOMPLETE' } = payload;
  try {
    const { taskListIdentifier } = yield select(locationParametersSelector);
    const tasksActionType =
      status === 'INCOMPLETE' ? GET_TASKS_SUCCESS : GET_COMPLETED_TASKS_SUCCESS;

    const selectedFilters = yield select(selectedFiltersInMegaFilterSelector);

    let tasks;

    if (!selectedFilters || isEmpty(selectedFilters)) {
      tasks = yield call(
        getListTasksByUser,
        taskListIdentifier,
        status,
        undefined,
        undefined,
        0,
      );
    } else {
      tasks = yield call(
        getFilteredTasksForList,
        taskListIdentifier,
        status,
        selectedFilters,
      );
    }

    yield put({ type: tasksActionType, tasks });
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
    yield call(doGetTasksList, {
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

export function* doSortTasksInGroup(payload) {
  const { orderedTaskIds, taskGroupIdentifier } = payload;

  try {
    const { taskListIdentifier } = yield select(locationParametersSelector);
    yield put({ type: TASK_GROUP_LIST_REQUEST });
    yield call(reorderTasksInGroup, {
      orderedTaskIds,
      taskGroupIdentifier,
    });
    yield call(doGetTasksList, {
      taskListIdentifier,
    });

    yield put(showGlobalAlert(AlertMessages.UPDATED));
  } catch (error) {
    yield put({ type: TASK_GROUP_LIST_FAILURE });
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
      call(doGetTasksList, { taskListIdentifier }),
    ]);

    yield put(showGlobalAlert(AlertMessages.UPDATED));
  } catch (error) {
    yield put({ type: TASK_GROUP_LIST_FAILURE });
  }
}

export function* doReassignTasksToAnotherGroup(payload) {
  const { taskIdentifiers, taskGroupIdentifier, orderedTaskIds } = payload;

  try {
    const { taskListIdentifier } = yield select(locationParametersSelector);
    yield put({ type: TASK_GROUP_LIST_REQUEST });

    yield call(
      reassignTasksToAnotherGroupApi,
      taskGroupIdentifier,
      taskIdentifiers,
    );

    yield call(doSortTasksInGroup, {
      orderedTaskIds,
      taskGroupIdentifier,
    });

    yield call(doGetTasksList, {
      taskListIdentifier,
    });

    yield put(showGlobalAlert(AlertMessages.UPDATED));
  } catch (error) {
    yield put({ type: TASK_GROUP_LIST_FAILURE });
  }
}

export function* doOnEnterTasksGroupsList() {
  try {
    const { taskListIdentifier } = yield select(locationParametersSelector);
    yield put({ type: TASK_GROUP_LIST_REQUEST });

    if (taskListIdentifier) {
      yield call(doGetTasksGroupsList, { taskListIdentifier });
    }
  } catch (error) {
    yield put({ type: TASK_GROUP_LIST_FAILURE });
  }
}

export function* doCreateTask(payload) {
  try {
    const { taskGroupIdentifier, description } = payload;
    const { taskListIdentifier } = yield select(locationParametersSelector);
    yield put({ type: TASK_GROUP_LIST_REQUEST });

    if (taskListIdentifier) {
      yield call(createTaskApi, {
        taskGroupIdentifier,
        taskListIdentifier,
        description,
      });

      yield all([
        call(doGetTasksGroupsList, {
          taskListIdentifier,
          shouldSetRequestState: false,
        }),
        call(doGetTasksList, { taskListIdentifier }),
      ]);
    }
  } catch (error) {
    yield put({ type: TASK_GROUP_LIST_FAILURE });
  }
}

export default function* watchTasksGroupsList() {
  yield takeLatest(DO_ON_ENTER_TASKS_GROUPS_LIST, doOnEnterTasksGroupsList);
  yield takeEvery(DO_GET_TASKS_GROUPS_LIST, doGetTasksGroupsList);
  yield takeEvery(DO_CREATE_TASKS_GROUP_LIST, doCreateTasksGroupList);
  yield takeEvery(DO_EDIT_TASKS_GROUP_NAME, doEditTasksGroupName);
  yield takeEvery(DO_DELETE_TASKS_GROUP, doDeleteTasksGroup);
  yield takeEvery(DO_SORT_TASKS_GROUPS, doSortTasksGroups);
  yield takeEvery(DO_SORT_TASKS_IN_GROUPS, doSortTasksInGroup);
  yield takeEvery(DO_SORT_SUBTASKS_IN_GROUPS, doSortSubtasksInGroup);
  yield takeLatest(DO_CREATE_TASK, doCreateTask);
  yield takeEvery(
    DO_REASSIGN_TASKS_TO_ANOTHER_GROUP,
    doReassignTasksToAnotherGroup,
  );
}
