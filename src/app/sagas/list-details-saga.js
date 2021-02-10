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
import * as ListDetailsApi from 'api/list-details-api';
import * as ListDetailsActions from 'actions/list-details-actions';
import * as MegaFilterActions from 'actions/mega-filter-actions';
import * as ActionTypes from 'actions/action-types';
import * as ActionTypesSaga from 'actions/action-types-saga';
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
import { TaskStatus } from 'helpers/task-helpers';
import sessionStorageHelper from 'helpers/session-storage-helper';

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
};

function processTaskCountersSuccess(countersData) {
  return {
    incomplete: countersData
      ? countersData.find(
          ({ metricName }) => metricName === 'INCOMPLETE_TASKS_COUNT',
        )?.metricValue
      : 0,
    complete: countersData
      ? countersData.find(
          ({ metricName }) => metricName === 'COMPLETE_TASKS_COUNT',
        )?.metricValue
      : 0,
  };
}

function* doGetListDetailsCounters({ payload }) {
  const { taskListIdentifier } = payload;

  const responseData = yield call(
    ListDetailsApi.getTaskStatsForList,
    taskListIdentifier,
  );

  yield put({
    type: ActionTypes.LIST_DETAILS_TASK_COUNTERS_SUCCESS,
    payload: processTaskCountersSuccess(responseData),
  });
}

function* doGetTasksGroupsList(payload) {
  const { shouldSetRequestState = true } = payload;
  try {
    const { taskListIdentifier } = yield select(locationParametersSelector);

    if (shouldSetRequestState) {
      yield put({ type: ActionTypes.TASK_GROUP_LIST_REQUEST });
    }
    const groups = yield call(getGroupsByListId, taskListIdentifier);
    yield put({
      type: ActionTypes.TASK_GROUP_LIST_SUCCESS,
      listGroups: groups,
    });
  } catch (error) {
    yield put({ type: ActionTypes.TASK_GROUP_LIST_FAILURE });
  }
}

function* doGetGroupedTasks({ payload }) {
  const {
    withLoader = true,
    loadingMore = false,
    taskListIdentifier,
    status,
  } = payload;

  try {
    const isCompletedTasksContext = status?.toLowerCase() === 'complete';

    if (withLoader) {
      yield put({
        type: isCompletedTasksContext
          ? ActionTypes.REQUEST_COMPLETED_TASKS
          : ActionTypes.REQUEST_TASKS,
      });
    }

    if (loadingMore) {
      yield put({
        type: ActionTypes.GET_MORE_TASKS_REQUEST,
      });
    }

    const tasksActionType = isCompletedTasksContext
      ? ActionTypes.GET_COMPLETED_TASKS_BY_GROUPS_SUCCESS
      : ActionTypes.GET_TASKS_BY_GROUPS_SUCCESS;

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
    yield put({ type: ActionTypes.TASK_GROUP_LIST_FAILURE });
  }
}

function* doRefreshGroupedTasks({ payload }) {
  const { withLoader = true } = payload || {};
  const { taskListIdentifier, tabName } = yield select(
    locationParametersSelector,
  );

  const status =
    tabName?.toLowerCase() === 'complete'
      ? TaskStatus.COMPLETE
      : TaskStatus.INCOMPLETE;

  yield put(
    ListDetailsActions.getListDetailsGroupedTasks({
      taskListIdentifier,
      status,
      withLoader,
    }),
  );
}

function* doGetTaskDetails(payload) {
  const { taskIdentifier } = payload;
  try {
    const selectedTask = yield call(getTaskDetails, taskIdentifier);

    yield put({
      type: ActionTypes.SET_AS_CURRENT_TASK,
      task: selectedTask,
      taskContext: 'list',
    });
  } catch (error) {
    yield put({ type: ActionTypes.TASK_GROUP_LIST_FAILURE });
  }
}

function* doCreateTasksGroupList(payload) {
  const { groupName } = payload;

  try {
    const { taskListIdentifier } = yield select(locationParametersSelector);
    yield put({ type: ActionTypes.TASK_GROUP_LIST_REQUEST });
    yield call(createGroupAssignedToList, { taskListIdentifier, groupName });
    yield call(doGetTasksGroupsList, {
      taskListIdentifier,
      shouldSetRequestState: false,
    });
    yield put(showGlobalAlert(AlertMessages.CREATED));
  } catch (error) {
    yield put({ type: ActionTypes.TASK_GROUP_LIST_FAILURE });
  }
}

function* doEditTasksGroupName(payload) {
  const { groupId, newGroupName } = payload;

  try {
    const { taskListIdentifier } = yield select(locationParametersSelector);
    yield put({ type: ActionTypes.TASK_GROUP_LIST_REQUEST });
    yield call(editGroupName, taskListIdentifier, groupId, newGroupName);
    yield call(doGetTasksGroupsList, {
      taskListIdentifier,
      shouldSetRequestState: false,
    });
    yield put(showGlobalAlert(AlertMessages.UPDATED));
  } catch (error) {
    yield put({ type: ActionTypes.TASK_GROUP_LIST_FAILURE });
  }
}

function* doDeleteTasksGroup(payload) {
  const { groupId } = payload;

  try {
    const { taskListIdentifier } = yield select(locationParametersSelector);

    yield put({ type: ActionTypes.TASK_GROUP_LIST_REQUEST });
    yield call(deleteGroup, groupId);
    yield call(doGetTasksGroupsList, {
      taskListIdentifier,
      shouldSetRequestState: false,
    });
    yield call(doRefreshGroupedTasks);
    yield put(showGlobalAlert(AlertMessages.DELETED));
  } catch (error) {
    yield put({ type: ActionTypes.TASK_GROUP_LIST_FAILURE });
  }
}

function* doSortTasksGroups(payload) {
  const { taskGroupIdentifiers } = payload;

  try {
    const { taskListIdentifier } = yield select(locationParametersSelector);
    yield put({ type: ActionTypes.TASK_GROUP_LIST_REQUEST });
    yield call(sortGroups, { taskGroupIdentifiers, taskListIdentifier });
    yield call(doGetTasksGroupsList, {
      taskListIdentifier,
      shouldSetRequestState: false,
    });
    yield put(showGlobalAlert(AlertMessages.UPDATED));
  } catch (error) {
    yield put({ type: ActionTypes.TASK_GROUP_LIST_FAILURE });
  }
}

// eslint-disable-next-line consistent-return
function* doGetTasksForTaskGroup(payload) {
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
      type: ActionTypes.REQUEST_TASKLIST_GROUP_TASKS,
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
        type: ActionTypes.REQUEST_TASKLIST_GROUP_TASKS_SUCCESS,
        groupOfTasks,
        refresh,
      });
    }

    return groupOfTasks;
  } catch (error) {
    yield put({ type: ActionTypes.TASK_GROUP_LIST_FAILURE });
  }
}

function* doSortTasksInGroup(payload) {
  const { orderedTaskIds, taskGroupIdentifier, endPosition } = payload;

  try {
    yield call(reorderTasksInGroup, {
      orderedTaskIds,
      taskGroupIdentifier,
    });

    yield all([put(showGlobalAlert(AlertMessages.UPDATED))]);
  } catch (error) {
    yield put({ type: ActionTypes.TASK_GROUP_LIST_FAILURE });
    yield call(doGetTasksForTaskGroup, {
      taskGroupIdentifier,
      status: 'INCOMPLETE',
      refresh: true,
      endPosition,
    });
  }
}

function* doSortSubtasksInGroup(payload) {
  const {
    orderedSubtaskIds,
    taskGroupIdentifier,
    parentTaskIdentifier,
  } = payload;

  try {
    const { taskListIdentifier } = yield select(locationParametersSelector);
    yield put({ type: ActionTypes.TASK_GROUP_LIST_REQUEST });

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
    yield put({ type: ActionTypes.TASK_GROUP_LIST_FAILURE });
  }
}

function* doReassignTasksToAnotherGroup(payload) {
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
      type: ActionTypes.REQUEST_MULTIPLE_TASKLIST_GROUP_TASKS_SUCCESS,
      groupsOfTasks: [sourceGroup, destinationGroup],
      refresh: true,
    });

    yield all([put(showGlobalAlert(AlertMessages.UPDATED))]);
  } catch (error) {
    yield put({ type: ActionTypes.TASK_GROUP_LIST_FAILURE });
  }
}

function* doOnEnterListDetails() {
  try {
    const { taskListIdentifier, taskIdentifier, tabName } = yield select(
      locationParametersSelector,
    );

    const status =
      tabName?.toLowerCase() === 'complete'
        ? TaskStatus.COMPLETE
        : TaskStatus.INCOMPLETE;

    yield put({ type: ActionTypes.TASK_GROUP_LIST_REQUEST });

    if (taskListIdentifier && status) {
      const filters = sessionStorageHelper.getItem(
        `filter-${taskListIdentifier}-${status}`,
      );

      if (filters) {
        yield put(
          MegaFilterActions.selectFiltersForMegaFilter(
            filters,
            taskListIdentifier,
            status,
          ),
        );
      }

      yield all([
        status === TaskStatus.INCOMPLETE &&
          call(doGetTasksGroupsList, { taskListIdentifier }),
        put(
          MegaFilterActions.getFiltersForMegaFilter(taskListIdentifier, status),
        ),
        put(ListDetailsActions.getListDetailsTaskCounters(taskListIdentifier)),
        put(
          ListDetailsActions.getListDetailsGroupedTasks({
            taskListIdentifier,
            status,
          }),
        ),
      ]);
    }

    const isSelectedTask = yield select(taskIsSelectedSelector);

    if (taskIdentifier && !isSelectedTask) {
      sessionStorage.setItem('selectedTaskIdentifier', taskIdentifier);
    }

    if (isSelectedTask) {
      yield put(openDrawer());
    }
  } catch (error) {
    yield put({ type: ActionTypes.TASK_GROUP_LIST_FAILURE });
  }
}

function* doCreateTask(payload) {
  try {
    const {
      taskGroupIdentifier,
      description,
      patientIdentifier,
      autoOpenDrawer,
    } = payload;
    const { taskListIdentifier } = yield select(locationParametersSelector);
    yield put({ type: ActionTypes.TASK_GROUP_LIST_REQUEST });

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
            type: ActionTypes.ADD_TASK_SUCCESS,
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
            type: ActionTypes.ADD_TASK_SUCCESS,
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
      yield put({ type: ActionTypes.INCREASE_INCOMPLETE_TASK_COUNTERS });
    }
  } catch (error) {
    yield put({ type: ActionTypes.TASK_GROUP_LIST_FAILURE });
  }
}

function* doFetchTasksBySearchedTerm(payload) {
  try {
    const { status, searchedTerm } = payload;
    const { taskListIdentifier } = yield select(locationParametersSelector);

    yield put({
      type:
        status === 'INCOMPLETE'
          ? ActionTypes.REQUEST_TASKS
          : ActionTypes.REQUEST_COMPLETED_TASKS,
    });
    const groupedTasks = yield call(
      searchTasksByTaskList,
      taskListIdentifier,
      searchedTerm,
      status,
    );

    const action =
      status === 'INCOMPLETE'
        ? ActionTypes.GET_TASKS_BY_GROUPS_SUCCESS
        : ActionTypes.GET_COMPLETED_TASKS_BY_GROUPS_SUCCESS;

    yield put({
      type: action,
      groupedTasks,
    });
  } catch (error) {
    yield put({ type: ActionTypes.TASK_GROUP_LIST_FAILURE });
  }
}

function* doSortListDetailsTasks({ payload }) {
  const { key, order } = payload;
  yield all([
    put(ListDetailsActions.requestAllListDetailsGroups()),
    put(ListDetailsActions.setListDetailsTasksSort(order ? key : null, order)),
  ]);
  yield put(ListDetailsActions.refreshListDetailsGroupedTasks(false));
}

function* doFilterListDetailsTasks({ payload }) {
  const { filters } = payload;

  const { taskListIdentifier, tabName } = yield select(
    locationParametersSelector,
  );

  const status =
    tabName?.toLowerCase() === 'complete'
      ? TaskStatus.COMPLETE
      : TaskStatus.INCOMPLETE;

  yield put(
    MegaFilterActions.selectFiltersForMegaFilter(
      filters,
      taskListIdentifier,
      status,
    ),
  );
  yield put(ListDetailsActions.refreshListDetailsGroupedTasks());
}

export default function* watchTasksGroupsList() {
  yield takeLatest(
    ActionTypesSaga.GET_LIST_DETAILS_TASK_COUNTERS,
    doGetListDetailsCounters,
  );
  yield takeLatest(
    ActionTypesSaga.GET_LIST_DETAILS_GROUPED_TASKS,
    doGetGroupedTasks,
  );
  yield takeLatest(
    ActionTypesSaga.REFRESH_LIST_DETAILS_GROUPED_TASKS,
    doRefreshGroupedTasks,
  );
  yield takeLatest(
    ActionTypesSaga.FILTER__LIST_DETAILS_TASKS,
    doFilterListDetailsTasks,
  );
  yield takeLatest(
    ActionTypesSaga.SORT_LIST_DETAILS_TASKS,
    doSortListDetailsTasks,
  );
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
}
