import { put, call, takeEvery } from 'redux-saga/effects';
import {
  getGroupsByListId,
  createGroupAssignedToList,
  editGroupName,
  deleteGroup,
  sortGroups,
} from 'api/task-group-list-api';
import {
  TASK_GROUP_LIST_REQUEST,
  TASK_GROUP_LIST_SUCCESS,
  TASK_GROUP_LIST_FAILURE,
} from 'actions/action-types';
import { showGlobalAlert } from 'alert/actions';
import AlertMessages from 'alert/AlertMessages';

export const DO_GET_TASKS_GROUPS_LIST = 'DO_GET_TASKS_GROUPS_LIST';
export const DO_CREATE_TASKS_GROUP_LIST = 'DO_CREATE_TASKS_GROUP_LIST';
export const DO_EDIT_TASKS_GROUP_NAME = 'DO_EDIT_TASKS_GROUP_NAME';
export const DO_DELETE_TASKS_GROUP = 'DO_DELETE_TASKS_GROUP';
export const DO_SORT_TASKS_GROUPS = 'DO_SORT_TASKS_GROUPS';

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

export const TasksGroupsListActions = {
  getTasksGroupsList,
  createTaskGroupList,
  editTasksGroupName,
  deleteTasksGroup,
  sortTasksGroups,
};

export function* doGetTasksGroupsList(payload) {
  const { shouldSetRequestState = true, taskListIdentifier } = payload;
  try {
    if (shouldSetRequestState) {
      yield put({ type: TASK_GROUP_LIST_REQUEST });
    }

    const data = yield call(getGroupsByListId, taskListIdentifier);
    yield put({
      type: TASK_GROUP_LIST_SUCCESS,
      groupList: data,
    });
  } catch (error) {
    yield put({ type: TASK_GROUP_LIST_FAILURE });
  }
}

export function* doCreateTasksGroupList(payload) {
  const { taskListIdentifier, groupName } = payload;

  try {
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
  const { taskListIdentifier, groupId, newGroupName } = payload;

  try {
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
  const { groupId, taskListIdentifier } = payload;

  try {
    yield put({ type: TASK_GROUP_LIST_REQUEST });
    yield call(deleteGroup, groupId);
    yield call(doGetTasksGroupsList, {
      taskListIdentifier,
      shouldSetRequestState: false,
    });
    yield put(showGlobalAlert(AlertMessages.DELETED));
  } catch (error) {
    yield put({ type: TASK_GROUP_LIST_FAILURE });
  }
}

export function* doSortTasksGroups(payload) {
  const { taskGroupIdentifiers, taskListIdentifier } = payload;

  try {
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

export default function* watchTasksGroupsList() {
  yield takeEvery(DO_GET_TASKS_GROUPS_LIST, doGetTasksGroupsList);
  yield takeEvery(DO_CREATE_TASKS_GROUP_LIST, doCreateTasksGroupList);
  yield takeEvery(DO_EDIT_TASKS_GROUP_NAME, doEditTasksGroupName);
  yield takeEvery(DO_DELETE_TASKS_GROUP, doDeleteTasksGroup);
  yield takeEvery(DO_SORT_TASKS_GROUPS, doSortTasksGroups);
}
