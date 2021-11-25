import { isEmpty, move, remove, insert, pluck } from 'ramda';
import {
  put,
  call,
  takeEvery,
  all,
  takeLatest,
  select,
  debounce,
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
  reassignTasksToAnotherGroup as reassignTasksToAnotherGroupApi,
  getTasksForTaskListByTaskGroup,
  searchTasksByTaskList,
} from 'api/task-api';
import * as ListDetailsApi from 'api/list-details-api';
import * as TemplateBundleApi from 'api/template-bundle-api';
import * as ListDetailsActions from 'actions/list-details-actions';
import * as MegaFilterActions from 'actions/mega-filter-actions';
import * as ActionTypes from 'actions/action-types';
// eslint-disable-next-line import/no-cycle
import { storeAsCurrentTask } from 'actions/task-actions';
import { selectedFiltersInMegaFilterSelector } from 'selectors/mega-filter-selectors';
import { taskIsSelectedSelector } from 'selectors/task-drawer-selectors';
import {
  groupTasksSelector,
  taskDetailsSortSelector,
} from 'selectors/list-details-selectors';
import { showGlobalAlert, showGlobalErrorAlert } from 'alert/actions';
import AlertMessages from 'alert/AlertMessages';
import { openDrawer } from 'actions/task-drawer-actions';
import { checkIfTaskMatchesFilters } from 'helpers/filters-helpers';
import { locationParametersSelector } from 'location/selectors';
import { TaskStatus } from 'helpers/task-helpers';
import sessionStorageHelper from 'helpers/session-storage-helper';
import { onSortChanged, onSearchChanged } from 'helpers/ga-event-helper';
import { openModal } from 'modal/actions';
import { applyTaskTemplate as applyTaskTemplateAction } from 'actions/list-details-actions';
import * as CustomFieldsApi from 'api/custom-fields-api';
import * as TaskListApi from 'api/task-list-api';
import store from '../store';
import { currentTaskListSelector } from '../selectors/task-list-selectors';

export const DO_GET_TASKS_GROUPS_LIST = 'DO_GET_TASKS_GROUPS_LIST';
export const DO_CREATE_TASKS_GROUP_LIST = 'DO_CREATE_TASKS_GROUP_LIST';
export const DO_EDIT_TASKS_GROUP_NAME = 'DO_EDIT_TASKS_GROUP_NAME';
export const DO_DELETE_TASKS_GROUP = 'DO_DELETE_TASKS_GROUP';
export const DO_SORT_TASKS_GROUPS = 'DO_SORT_TASKS_GROUPS';
export const DO_SORT_TASKS_IN_GROUPS = 'DO_SORT_TASKS_IN_GROUPS';
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

export const reassignTasksToAnotherGroup = payload => ({
  type: DO_REASSIGN_TASKS_TO_ANOTHER_GROUP,
  ...payload,
});

export const createTask = payload => ({
  type: DO_CREATE_TASK,
  ...payload,
});

export const onEnterListDetails = () => ({
  type: DO_ON_ENTER_LIST_DETAILS,
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

const ERROR_TYPES = {
  ASSIGNED_USERS_ARE_NOT_IN_THE_TASK_LIST:
    'TASK_TEMPLATE/ASSIGNED_USERS_ARE_NOT_IN_THE_TASK_LIST',
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
  try {
    const { taskListIdentifier } = payload;
    if (!taskListIdentifier) {
      return;
    }

    const responseData = yield call(
      ListDetailsApi.getTaskStatsForList,
      taskListIdentifier,
    );

    yield put({
      type: ActionTypes.GET_LIST_DETAILS_TASK_COUNTERS_SUCCESS,
      payload: processTaskCountersSuccess(responseData),
    });
  } catch (error) {
    yield put({
      type: ActionTypes.GET_LIST_DETAILS_TASK_COUNTERS_FAILURE,
    });
    console.log(error);
  }
}

function* doGetTasksGroupsList(payload) {
  const { shouldSetRequestState = true } = payload;
  try {
    const { taskListIdentifier } = yield select(locationParametersSelector);
    if (!taskListIdentifier) {
      return;
    }

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
      yield put({
        type: ActionTypes.FETCH_MEGA_FILTERS_UPDATE_SUCCESS,
        filters: groupedTasks.taskFilterOptions,
      });
    }

    yield put({
      type: tasksActionType,
      groupedTasks,
      loadingMore,
      taskListIdentifier,
    });
  } catch (error) {
    yield put({ type: ActionTypes.TASK_GROUP_LIST_FAILURE });
  }
}

function* doRefreshGroupedTasks({ payload }) {
  try {
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
  } catch (error) {
    console.log(error);
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
  const {
    destination: { droppableId: taskGroupIdentifier, index: destinationIndex },
    source: { index: sourceIndex },
  } = payload;

  if (destinationIndex === sourceIndex) return;

  const { [taskGroupIdentifier]: group } = yield select(groupTasksSelector);

  try {
    const reorderedTasks = move(sourceIndex, destinationIndex, group.tasks);

    yield put({
      type: ActionTypes.REQUEST_TASKLIST_GROUP_TASKS_SUCCESS,
      groupOfTasks: {
        taskGroups: [
          {
            ...group,
            groupIdentifier: taskGroupIdentifier,
            tasks: reorderedTasks,
          },
        ],
      },
      refresh: true,
    });

    yield call(reorderTasksInGroup, {
      orderedTaskIds: pluck('identifier', reorderedTasks),
      taskGroupIdentifier,
    });
    yield all([put(showGlobalAlert(AlertMessages.UPDATED))]);
  } catch {
    yield all([put(showGlobalErrorAlert())]);
    yield put({
      type: ActionTypes.REQUEST_TASKLIST_GROUP_TASKS_SUCCESS,
      groupOfTasks: {
        taskGroups: [
          {
            ...group,
            groupIdentifier: taskGroupIdentifier,
            tasks: group.tasks,
          },
        ],
      },
      refresh: true,
    });
  }
}

function* doReassignTasksToAnotherGroup(payload) {
  const {
    destination: {
      index: destinationIndex,
      droppableId: destinationGroupIdentifier,
    },
    source: { index: sourceIndex, droppableId: sourceGroupIdentifier },
  } = payload;

  const {
    [sourceGroupIdentifier]: sourceGroup,
    [destinationGroupIdentifier]: destinationGroup,
  } = yield select(groupTasksSelector);

  const sourceTask = sourceGroup.tasks[sourceIndex];

  try {
    const destinationTasks = insert(
      destinationIndex,
      sourceTask,
      destinationGroup?.tasks || [],
    );

    yield put({
      type: ActionTypes.REQUEST_TASKLIST_GROUP_TASKS_SUCCESS,
      groupOfTasks: {
        taskGroups: [
          {
            ...sourceGroup,
            groupIdentifier: sourceGroupIdentifier,
            tasks: remove(sourceIndex, 1, sourceGroup.tasks || []),
          },
          {
            ...destinationGroup,
            groupIdentifier: destinationGroupIdentifier,
            tasks: destinationTasks,
          },
        ],
      },
      refresh: true,
    });

    yield call(reassignTasksToAnotherGroupApi, destinationGroupIdentifier, [
      sourceTask.identifier,
    ]);
    yield call(reorderTasksInGroup, {
      orderedTaskIds: pluck('identifier', destinationTasks),
      taskGroupIdentifier: destinationGroupIdentifier,
    });

    yield all([put(showGlobalAlert(AlertMessages.UPDATED))]);
  } catch {
    yield put(showGlobalErrorAlert());
    yield put({
      type: ActionTypes.REQUEST_TASKLIST_GROUP_TASKS_SUCCESS,
      groupOfTasks: {
        taskGroups: [
          {
            ...sourceGroup,
            groupIdentifier: sourceGroupIdentifier,
            tasks: sourceGroup.tasks || [],
          },
          {
            ...destinationGroup,
            groupIdentifier: destinationGroupIdentifier,
            tasks: destinationGroup.tasks || [],
          },
        ],
      },
      refresh: true,
    });
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
        put(ListDetailsActions.getListDetailsTaskCounters(taskListIdentifier)),
        yield put(
          MegaFilterActions.getFiltersForMegaFilter(taskListIdentifier, status),
        ),
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

// eslint-disable-next-line sonarjs/cognitive-complexity
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
          });
        }
      } else {
        const fetchedTasksGroups = yield select(groupTasksSelector);

        if (!taskGroupIdentifier) {
          yield put(ListDetailsActions.refreshListDetailsGroupedTasks(true));
        } else if (!fetchedTasksGroups[taskGroupIdentifier]) {
          yield call(doGetTasksForTaskGroup, {
            taskGroupIdentifier,
            status: 'INCOMPLETE',
          });
        } else {
          yield put({
            type: ActionTypes.ADD_TASK_SUCCESS,
            task: createdTask,
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
      yield put(
        ListDetailsActions.getListDetailsTaskCounters(taskListIdentifier),
      );
      yield put(showGlobalAlert(AlertMessages.TASK_CREATED));
    }
  } catch (error) {
    yield put({ type: ActionTypes.TASK_GROUP_LIST_FAILURE });
  }
}

function* doFetchTasksBySearchedTerm(payload) {
  try {
    const { status, searchedTerm } = payload;
    const { taskListIdentifier } = yield select(locationParametersSelector);

    onSearchChanged();

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
  onSortChanged(order ? key : null, order);
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

  if (!filters || isEmpty(filters))
    yield put(
      MegaFilterActions.getFiltersForMegaFilter(taskListIdentifier, status),
    );

  yield put(
    MegaFilterActions.selectFiltersForMegaFilter(
      filters,
      taskListIdentifier,
      status,
    ),
  );
  yield put(ListDetailsActions.refreshListDetailsGroupedTasks());
}

function* applyTaskTemplateFailure({
  error,
  errorType,
  failureDetails: { taskCount },
  templateDetails,
}) {
  if (errorType === ERROR_TYPES.ASSIGNED_USERS_ARE_NOT_IN_THE_TASK_LIST) {
    const modalProps = {
      taskCount,
      confirm: () => {
        store.dispatch(
          applyTaskTemplateAction({ ...templateDetails, unassign: true }),
        );
      },
    };
    yield put(openModal('UnassignTaskTemplate', modalProps));
  } else {
    console.log(error);
    yield put(showGlobalErrorAlert());
  }
}

function* applyTaskTemplate({
  taskTemplateIdentifier,
  taskGroupIdentifier,
  taskListIdentifier,
  options: { unassign = false },
}) {
  try {
    const { statusCode, assignmentsMismatchCount } = yield call(
      TemplateBundleApi.applyTemplate,
      {
        taskTemplateIdentifier,
        taskGroupIdentifier,
        taskListIdentifier,
        unassign,
      },
    );
    const isWarning = statusCode === 'WARNING';

    if (isWarning) {
      yield applyTaskTemplateFailure({
        errorType: ERROR_TYPES.ASSIGNED_USERS_ARE_NOT_IN_THE_TASK_LIST,
        failureDetails: { taskCount: assignmentsMismatchCount },
        templateDetails: {
          taskTemplateIdentifier,
          taskGroupIdentifier,
          taskListIdentifier,
        },
      });
    } else {
      yield put(
        getTasksForTaskGroups({
          taskGroupIdentifier,
          status: 'INCOMPLETE',
          refresh: true,
        }),
      );
    }
  } catch {
    yield put(showGlobalErrorAlert());
  }
}

function* getListCustomFields({ taskListIdentifier }) {
  try {
    const listCustomFields = yield call(
      CustomFieldsApi.getAllTaskListCustomFields,
      taskListIdentifier,
    );
    yield put({
      type: ActionTypes.GET_LIST_CUSTOM_FIELDS_SUCCESS,
      listCustomFields,
    });
  } catch {
    yield put({ type: ActionTypes.GET_LIST_CUSTOM_FIELDS_FAILURE });
    yield put(showGlobalErrorAlert());
  }
}

function* updateListCustomFieldsSetup({ setup }) {
  try {
    const { taskListIdentifier } = yield select(locationParametersSelector);
    yield call(
      TaskListApi.updateUserCustomFieldsOptionsListViewSetup,
      setup,
      taskListIdentifier,
    );
    yield put({
      type: ActionTypes.UPDATE_CUSTOM_LIST_FIELDS_SETUP_SUCCESS,
    });
  } catch {
    yield put(showGlobalErrorAlert());
    yield put({ type: ActionTypes.UPDATE_CUSTOM_LIST_FIELDS_SETUP_FAILURE });
  }
}

function* taskCounterIncreaseWatcher({ task }) {
  const { taskListIdentifier } = yield select(currentTaskListSelector);
  if (task?.taskList?.taskListIdentifier === taskListIdentifier) {
    if (task.status === TaskStatus.INCOMPLETE) {
      yield put({ type: ActionTypes.INCREASE_INCOMPLETE_TASK_COUNTERS });
    } else if (task.status === TaskStatus.COMPLETE) {
      yield put({ type: ActionTypes.INCREASE_COMPLETE_TASK_COUNTERS });
    }
  }
}

function* taskCounterDecreaseWatcher() {
  const { taskListIdentifier } = yield select(currentTaskListSelector);
  yield put({
    type: ActionTypes.GET_LIST_DETAILS_TASK_COUNTERS,
    payload: { taskListIdentifier },
  });
}

export default function* watchTasksGroupsList() {
  yield takeEvery(ActionTypes.APPLY_TASK_TEMPLATE, applyTaskTemplate);
  yield takeLatest(
    ActionTypes.GET_LIST_DETAILS_TASK_COUNTERS,
    doGetListDetailsCounters,
  );
  yield takeLatest(
    ActionTypes.GET_LIST_DETAILS_GROUPED_TASKS,
    doGetGroupedTasks,
  );
  yield takeLatest(
    ActionTypes.REFRESH_LIST_DETAILS_GROUPED_TASKS,
    doRefreshGroupedTasks,
  );
  yield takeLatest(
    ActionTypes.FILTER__LIST_DETAILS_TASKS,
    doFilterListDetailsTasks,
  );
  yield takeLatest([ActionTypes.ADD_TASK_SUCCESS], taskCounterIncreaseWatcher);
  yield takeLatest([ActionTypes.DELETE_TASK], taskCounterDecreaseWatcher);
  yield takeLatest(ActionTypes.GET_LIST_CUSTOM_FIELDS, getListCustomFields);
  yield takeLatest(ActionTypes.SORT_LIST_DETAILS_TASKS, doSortListDetailsTasks);
  yield takeLatest(DO_ON_ENTER_LIST_DETAILS, doOnEnterListDetails);
  yield takeEvery(DO_GET_TASKS_GROUPS_LIST, doGetTasksGroupsList);
  yield takeEvery(DO_CREATE_TASKS_GROUP_LIST, doCreateTasksGroupList);
  yield takeEvery(DO_EDIT_TASKS_GROUP_NAME, doEditTasksGroupName);
  yield takeEvery(DO_DELETE_TASKS_GROUP, doDeleteTasksGroup);
  yield takeEvery(DO_SORT_TASKS_GROUPS, doSortTasksGroups);
  yield takeEvery(DO_SORT_TASKS_IN_GROUPS, doSortTasksInGroup);
  yield takeEvery(DO_CREATE_TASK, doCreateTask);
  yield takeEvery(
    DO_REASSIGN_TASKS_TO_ANOTHER_GROUP,
    doReassignTasksToAnotherGroup,
  );
  yield takeEvery(DO_GET_TASKS_FOR_GROUP, doGetTasksForTaskGroup);
  yield debounce(
    500,
    DO_FETCH_TASKS_BY_SEARCHED_TERM,
    doFetchTasksBySearchedTerm,
  );
  yield takeEvery(
    ActionTypes.UPDATE_CUSTOM_LIST_FIELDS_SETUP,
    updateListCustomFieldsSetup,
  );
}
