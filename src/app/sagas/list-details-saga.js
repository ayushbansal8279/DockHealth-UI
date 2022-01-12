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
  sortGroups,
  deleteGroup,
} from 'api/task-group-list-api';
import {
  addTask as createTaskApi,
  reorderTasksInGroup,
  reassignTasksToAnotherGroup as reassignTasksToAnotherGroupApi,
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
  listDetailsGroupsSelector,
  groupTasksSelector,
  taskDetailsSortSelector,
  searchTermSelector,
} from 'selectors/list-details-selectors';
import {
  currentTaskListTasksStatusSelector,
  currentTaskListSelector,
  currentTaskListIdentifierSelector,
} from 'selectors/task-list-selectors';
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

export const DO_CREATE_TASK = 'DO_CREATE_TASK';

export const createTask = payload => ({
  type: DO_CREATE_TASK,
  ...payload,
});

export const ListDetailsSagaActions = {
  createTask,
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

function* getTasksGroupsList() {
  try {
    const taskListIdentifier = yield select(currentTaskListIdentifierSelector);
    if (!taskListIdentifier) {
      return;
    }

    const groups = yield call(getGroupsByListId, taskListIdentifier);
    yield put({
      type: ActionTypes.GET_TASKS_GROUPS_LIST_SUCCESS,
      groups,
    });
  } catch (error) {
    yield put({ type: ActionTypes.GET_TASKS_GROUPS_LIST_FAILURE });
  }
}

function* getCurrentListTasks() {
  try {
    const taskListIdentifier = yield select(currentTaskListIdentifierSelector);
    const selectedFilters = yield select(selectedFiltersInMegaFilterSelector);
    const sort = yield select(taskDetailsSortSelector);
    const searchTerm = yield select(searchTermSelector);

    let groupedTasks;

    if (searchTerm) {
      groupedTasks = yield call(
        ListDetailsApi.searchTasksByTaskList,
        taskListIdentifier,
        searchTerm,
        TaskStatus.INCOMPLETE,
      );
    } else if (!selectedFilters || isEmpty(selectedFilters)) {
      groupedTasks = yield call(
        ListDetailsApi.getListTasksGroupedByTaskGroup,
        taskListIdentifier,
        TaskStatus.INCOMPLETE,
        sort,
        0,
      );
    } else {
      groupedTasks = yield call(
        ListDetailsApi.getFilteredTasksForList,
        taskListIdentifier,
        TaskStatus.INCOMPLETE,
        sort,
        selectedFilters,
      );
    }

    yield put({
      type: ActionTypes.GET_CURRENT_LIST_TASKS_SUCCESS,
      groupedTasks,
    });
  } catch (error) {
    yield put(showGlobalErrorAlert());
    yield put({ type: ActionTypes.GET_CURRENT_LIST_TASKS_FAILURE });
  }
}

function* getCurrentListCompleteTasks() {
  try {
    const taskListIdentifier = yield select(currentTaskListIdentifierSelector);
    const selectedFilters = yield select(selectedFiltersInMegaFilterSelector);
    const sort = yield select(taskDetailsSortSelector);
    const searchTerm = yield select(searchTermSelector);

    let groupedTasks;

    if (searchTerm) {
      groupedTasks = yield call(
        ListDetailsApi.searchTasksByTaskList,
        taskListIdentifier,
        searchTerm,
        TaskStatus.COMPLETE,
      );
    } else if (!selectedFilters || isEmpty(selectedFilters)) {
      groupedTasks = yield call(
        ListDetailsApi.getListTasksGroupedByTaskGroup,
        taskListIdentifier,
        TaskStatus.COMPLETE,
        sort,
        0,
      );
    } else {
      groupedTasks = yield call(
        ListDetailsApi.getFilteredTasksForList,
        taskListIdentifier,
        TaskStatus.COMPLETE,
        sort,
        selectedFilters,
      );
    }

    yield put({
      type: ActionTypes.GET_CURRENT_LIST_COMPLETE_TASKS_SUCCESS,
      groupedTasks,
    });
  } catch {
    yield put({ type: ActionTypes.GET_CURRENT_LIST_COMPLETE_TASKS_FAILURE });
  }
}

function* getCurrentTaskListFilterOptions() {
  try {
    const taskListIdentifier = yield select(currentTaskListIdentifierSelector);
    const status = yield select(currentTaskListTasksStatusSelector);

    const currentFilters = yield select(selectedFiltersInMegaFilterSelector);

    const filters = yield call(
      ListDetailsApi.getTaskListFilterOptions,
      taskListIdentifier,
      status,
      currentFilters,
    );
    yield put({
      type: ActionTypes.GET_CURRENT_TASK_LIST_FILTER_OPTIONS_SUCCESS,
      filters,
    });
  } catch {
    yield put({
      type: ActionTypes.GET_CURRENT_TASK_LIST_FILTER_OPTIONS_SUCCESS,
    });
  }
}

function* refreshGroupedTasks({ payload }) {
  try {
    const { withLoader = true } = payload || {};
    const status = yield select(currentTaskListTasksStatusSelector);

    if (status === TaskStatus.INCOMPLETE) {
      yield put(ListDetailsActions.getCurrentListTasks(withLoader));
    } else {
      yield put(ListDetailsActions.getCurrentListCompleteTasks());
    }
  } catch (error) {
    console.log(error);
  }
}

function* createTaskListGroup({ groupName }) {
  try {
    const { taskListIdentifier } = yield select(locationParametersSelector);
    yield call(createGroupAssignedToList, { taskListIdentifier, groupName });
    yield put(ListDetailsActions.getTasksGroupsList());
    yield put(showGlobalAlert(AlertMessages.CREATED));
  } catch (error) {
    yield put(showGlobalErrorAlert());
  }
}

// eslint-disable-next-line consistent-return
function* getTasksForTaskGroups(payload) {
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
      ListDetailsApi.getTasksForTaskListByTaskGroup,
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
    yield put(showGlobalErrorAlert());
  }
}

function* sortTasksInGroup(payload) {
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

function* reassignTasksToAnotherGroup(payload) {
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

function* initializeTaskListState() {
  try {
    const { taskIdentifier } = yield select(locationParametersSelector);
    const taskListIdentifier = yield select(currentTaskListIdentifierSelector);
    const status = yield select(currentTaskListTasksStatusSelector);

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
          put(ListDetailsActions.getTasksGroupsList()),
        put(ListDetailsActions.getListDetailsTaskCounters(taskListIdentifier)),
        status === TaskStatus.INCOMPLETE
          ? put(ListDetailsActions.getCurrentListTasks())
          : put(ListDetailsActions.getCurrentListCompleteTasks()),
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
    console.log('errror', error);
    yield put(showGlobalErrorAlert());
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
          yield call(getTasksForTaskGroups, {
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
      yield put(ListDetailsActions.getTasksGroupsList());
      yield put(
        ListDetailsActions.getListDetailsTaskCounters(taskListIdentifier),
      );
      yield put(showGlobalAlert(AlertMessages.TASK_CREATED));
    }
  } catch (error) {
    yield put(showGlobalErrorAlert());
  }
}

function* searchCurrentListTasks() {
  try {
    const status = yield select(currentTaskListTasksStatusSelector);
    onSearchChanged();

    yield put(
      status === TaskStatus.INCOMPLETE
        ? ListDetailsActions.getCurrentListTasks()
        : ListDetailsActions.getCurrentListCompleteTasks(),
    );
  } catch (error) {
    yield put(showGlobalErrorAlert());
  }
}

function* sortListDetailsTasks({ payload }) {
  const { key, order } = payload;
  onSortChanged(order ? key : null, order);
  yield all([
    put(ListDetailsActions.requestAllListDetailsGroups()),
    put(ListDetailsActions.setListDetailsTasksSort(order ? key : null, order)),
  ]);
  yield put(ListDetailsActions.refreshListDetailsGroupedTasks(false));
}

function* filterListDetailsTasks({ payload }) {
  const { filters } = payload;

  const taskListIdentifier = yield select(currentTaskListIdentifierSelector);
  const status = yield select(currentTaskListTasksStatusSelector);

  yield put(
    MegaFilterActions.selectFiltersForMegaFilter(
      filters,
      taskListIdentifier,
      status,
    ),
  );

  yield all([
    put(ListDetailsActions.getCurrentTaskListFilterOptions()),
    put(ListDetailsActions.refreshListDetailsGroupedTasks()),
  ]);
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
        ListDetailsActions.getTasksForTaskGroups({
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
  const currentTaskList = yield select(currentTaskListSelector);
  if (currentTaskList) {
    const { taskListIdentifier } = currentTaskList;
    if (task?.taskList?.taskListIdentifier === taskListIdentifier) {
      if (task.status === TaskStatus.INCOMPLETE) {
        yield put({ type: ActionTypes.INCREASE_INCOMPLETE_TASK_COUNTERS });
      } else if (task.status === TaskStatus.COMPLETE) {
        yield put({ type: ActionTypes.INCREASE_COMPLETE_TASK_COUNTERS });
      }
    }
  }
}

function* taskCounterDecreaseWatcher() {
  const currentTaskList = yield select(currentTaskListSelector);
  if (currentTaskList) {
    const { taskListIdentifier } = currentTaskList;
    yield put({
      type: ActionTypes.GET_LIST_DETAILS_TASK_COUNTERS,
      payload: { taskListIdentifier },
    });
  }
}

function* deleteTaskListGroup(payload) {
  const { groupIdentifier } = payload;

  try {
    yield call(deleteGroup, groupIdentifier);
    yield put(ListDetailsActions.getTasksGroupsList());
    yield call(refreshGroupedTasks, {});
    yield put({
      type: ActionTypes.DELETE_TASK_LIST_GROUP_SUCCESS,
      groupIdentifier,
    });
    yield put(showGlobalAlert(AlertMessages.DELETED));
  } catch (error) {
    yield put(showGlobalErrorAlert());
    yield put({
      type: ActionTypes.DELETE_TASK_LIST_GROUP_FAILURE,
      groupIdentifier,
    });
  }
}

function* changeTaskListGroupName({ groupIdentifier, name }) {
  try {
    const taskListIdentifier = yield select(currentTaskListIdentifierSelector);
    yield call(editGroupName, taskListIdentifier, groupIdentifier, name);
    yield put(ListDetailsActions.getTasksGroupsList());
    yield put(showGlobalAlert(AlertMessages.UPDATED));
    yield put({
      type: ActionTypes.CHANGE_TASK_LIST_GROUP_NAME_SUCCESS,
      groupIdentifier,
      name,
    });
  } catch (error) {
    yield put({
      type: ActionTypes.CHANGE_TASK_LIST_GROUP_NAME_FAILURE,
      groupIdentifier,
      name,
    });
  }
}

function* reorderTaskListGroups({ newIndex, oldIndex }) {
  try {
    const groups = yield select(listDetailsGroupsSelector);
    // groups are already reordered by reducer
    const taskGroupIdentifiers = pluck('taskGroupIdentifier', groups);

    const taskListIdentifier = yield select(currentTaskListIdentifierSelector);
    yield call(sortGroups, { taskGroupIdentifiers, taskListIdentifier });
    yield put({ type: ActionTypes.REORDER_TASK_LIST_GROUPS_SUCCESS });
    yield put(showGlobalAlert(AlertMessages.UPDATED));
  } catch (error) {
    yield put({
      type: ActionTypes.REORDER_TASK_LIST_GROUPS_FAILURE,
      newIndex,
      oldIndex,
    });
  }
}

export default function* watchTasksGroupsList() {
  yield takeEvery(ActionTypes.APPLY_TASK_TEMPLATE, applyTaskTemplate);
  yield takeLatest(
    ActionTypes.GET_LIST_DETAILS_TASK_COUNTERS,
    doGetListDetailsCounters,
  );
  yield takeLatest(ActionTypes.GET_CURRENT_LIST_TASKS, getCurrentListTasks);
  yield takeLatest(
    ActionTypes.GET_CURRENT_LIST_COMPLETE_TASKS,
    getCurrentListCompleteTasks,
  );
  yield takeLatest(
    ActionTypes.REFRESH_LIST_DETAILS_GROUPED_TASKS,
    refreshGroupedTasks,
  );
  yield takeLatest(
    ActionTypes.FILTER_LIST_DETAILS_TASKS,
    filterListDetailsTasks,
  );
  yield takeLatest([ActionTypes.ADD_TASK_SUCCESS], taskCounterIncreaseWatcher);
  yield takeLatest([ActionTypes.DELETE_TASK], taskCounterDecreaseWatcher);
  yield takeLatest(ActionTypes.GET_LIST_CUSTOM_FIELDS, getListCustomFields);
  yield takeLatest(ActionTypes.SORT_LIST_DETAILS_TASKS, sortListDetailsTasks);
  yield takeEvery(ActionTypes.GET_TASKS_GROUPS_LIST, getTasksGroupsList);
  yield takeLatest(
    ActionTypes.INITIALIZE_TASK_LIST_STATE,
    initializeTaskListState,
  );
  yield takeEvery(ActionTypes.CREATE_TASK_LIST_GROUP, createTaskListGroup);
  yield takeEvery(ActionTypes.REORDER_TASKS_IN_GROUP, sortTasksInGroup);
  yield takeEvery(DO_CREATE_TASK, doCreateTask);
  yield takeEvery(
    ActionTypes.REASSIGN_TASKS_TO_ANOTHER_GROUP,
    reassignTasksToAnotherGroup,
  );
  yield takeEvery(ActionTypes.GET_TASKS_FOR_TASK_GROUP, getTasksForTaskGroups);
  yield debounce(
    500,
    ActionTypes.SEARCH_CURRENT_LIST_TASKS,
    searchCurrentListTasks,
  );
  yield takeEvery(
    ActionTypes.UPDATE_CUSTOM_LIST_FIELDS_SETUP,
    updateListCustomFieldsSetup,
  );
  yield takeEvery(ActionTypes.DELETE_TASK_LIST_GROUP, deleteTaskListGroup);
  yield takeEvery(
    ActionTypes.CHANGE_TASK_LIST_GROUP_NAME,
    changeTaskListGroupName,
  );
  yield takeEvery(ActionTypes.REORDER_TASK_LIST_GROUPS, reorderTaskListGroups);
  yield takeEvery(
    ActionTypes.GET_CURRENT_TASK_LIST_FILTER_OPTIONS,
    getCurrentTaskListFilterOptions,
  );
}
