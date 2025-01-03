/* eslint-disable no-console */
import isEmpty from 'ramda/src/isEmpty';
import move from 'ramda/src/move';
import remove from 'ramda/src/remove';
import insert from 'ramda/src/insert';
import pluck from 'ramda/src/pluck';
import filter from 'ramda/src/filter';
import compose from 'ramda/src/compose';

import {
  put,
  call,
  takeEvery,
  all,
  takeLatest,
  select,
  debounce,
  take,
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
import {
  getFiltersStorageKey,
  getQuickFilterStorageKey,
} from 'helpers/mega-filter-helper';
import { calendarDateRangeSelector } from 'selectors/calendar-tasks-selectors';
import { showGlobalAlert, showGlobalErrorAlert } from 'alert/actions';
import AlertMessages from 'alert/AlertMessages';
import { openDrawer } from 'actions/task-drawer-actions';
import { checkIfTaskMatchesFilters } from 'helpers/filters-helpers';
import { locationParametersSelector } from 'location/selectors';
import { TaskStatus } from 'helpers/task-helpers';
import { onSortChanged, onSearchChanged } from 'helpers/ga-event-helper';
import { openModal } from 'modal/actions';
import { applyTaskTemplate as applyTaskTemplateAction } from 'actions/list-details-actions';
import * as CustomFieldsApi from 'api/custom-fields-api';
import { getTasksForWorkflow } from 'actions/template-bundle-actions';
import { log } from 'helpers/log';
import store from '../store';
import localStorageHelper from '../helpers/local-storage-helper';
import sessionStorageHelper from '../helpers/session-storage-helper';

export const DO_CREATE_TASK = 'DO_CREATE_TASK';
export const DEFAULT_TASK_GROUPS_TO_LOAD = 3;
export const DEFAULT_TASK_GROUPS_TO_LOAD_COMPLETED = 2;

export const createTask = (payload) => ({
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
    log(error);
  }
}

function* getTasksGroupsList() {
  try {
    const taskListIdentifier = yield select(currentTaskListIdentifierSelector);
    if (!taskListIdentifier) {
      return;
    }
    const status = yield select(currentTaskListTasksStatusSelector);
    const groups = yield call(getGroupsByListId, taskListIdentifier, status);
    yield put({
      type: ActionTypes.GET_TASKS_GROUPS_LIST_SUCCESS,
      groups,
    });
  } catch (error) {
    log('error', error);
    yield put({ type: ActionTypes.GET_TASKS_GROUPS_LIST_FAILURE });
  }
}

function* getCurrentListTasks() {
  try {
    const sort = yield select(taskDetailsSortSelector);
    const status = yield select(currentTaskListTasksStatusSelector);

    let groups = yield select(listDetailsGroupsSelector);
    if (!groups || isEmpty(groups)) {
      const action = yield take(
        (a) => a.type === ActionTypes.GET_TASKS_GROUPS_LIST_SUCCESS,
      );
      groups = action.groups;
    }
    const groupsWithTasks = compose(filter((g) => g.metricValue >= 0))(groups);
    const groupsToGet = groupsWithTasks;

    yield all(
      groupsToGet.map(({ taskGroupIdentifier }) => 
        put(
          ListDetailsActions.getTasksForTaskGroups({
            taskGroupIdentifier,
            status,
            startPosition: 0,
            sort,
            refresh: true,
          }),
        ),
      ),
    );
  } catch (error) {
    log(error);
    yield put(showGlobalErrorAlert());
    yield put({ type: ActionTypes.GET_CURRENT_LIST_TASKS_FAILURE });
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

function* refreshGroupedTasks() {
  try {
    yield put(ListDetailsActions.getCurrentListTasks());
    yield put({
      type: ActionTypes.GET_TASKS_GROUPS_LIST,
    });
  } catch (error) {
    log(error);
  }
}

function* createTaskListGroup({ groupName }) {
  try {
    const { taskListIdentifier } = yield select(locationParametersSelector);
    const createdGroup = yield call(createGroupAssignedToList, {
      taskListIdentifier,
      groupName,
    });
    yield all([
      put(ListDetailsActions.getTasksGroupsList()),
      put(showGlobalAlert(AlertMessages.CREATED)),
      put({
        type: ActionTypes.CREATE_TASK_LIST_GROUP_SUCCESS,
        group: createdGroup,
      }),
    ]);
  } catch {
    yield put(showGlobalErrorAlert('A group with that name already exists.'));
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
      fetchWorkflowTasks = false,
    } = payload;

    const { taskListIdentifier } = yield select(locationParametersSelector);
    yield put({
      type: ActionTypes.REQUEST_TASKLIST_GROUP_TASKS,
      fetchedGroupIdentifier: taskGroupIdentifier,
      refresh,
    });

    const selectedFilters = yield select(selectedFiltersInMegaFilterSelector);
    const searchTerm = yield select(searchTermSelector);

    let groupOfTasks = {};

    if (
      (!selectedFilters || isEmpty(selectedFilters)) &&
      !(searchTerm && searchTerm !== '')
    ) {
      groupOfTasks = yield call(
        ListDetailsApi.getTasksForTaskListByTaskGroup,
        taskListIdentifier,
        taskGroupIdentifier,
        status,
        startPosition,
        endPosition,
        sort,
        viewMode,
      );

      if (fetchWorkflowTasks) {
        const bundles = groupOfTasks?.taskGroups?.[0]?.tasks?.filter(
          (t) => t.itemType === 'BUNDLE',
        );
        yield all(
          [...(bundles || [])]?.map((b) =>
            put(getTasksForWorkflow(b.identifier)),
          ),
        );
      }
    } else {
      const groupedTasks = yield call(
        ListDetailsApi.getFilteredTasksForList,
        taskListIdentifier,
        status,
        startPosition,
        endPosition,
        sort,
        selectedFilters,
        taskGroupIdentifier,
        searchTerm,
      );
      groupOfTasks = {
        taskGroups: groupedTasks,
      };
    }

    if (shouldSaveInStore) {
      yield put({
        type: ActionTypes.REQUEST_TASKLIST_GROUP_TASKS_SUCCESS,
        groupOfTasks,
        refresh,
        startPosition,
      });
    }

    return groupOfTasks;
  } catch (error) {
    log(error);
    yield put(showGlobalErrorAlert());
  }
}

function* sortTasksInGroup(payload) {
  const {
    destination: { droppableId: taskGroupIdentifier, index: destinationIndex },
    source: { index: sourceIndex },
  } = payload;

  if (destinationIndex === sourceIndex) return;

  const taskGroups = yield select(groupTasksSelector);
  const group = taskGroups.find(
    ({ groupIdentifier }) => groupIdentifier === taskGroupIdentifier,
  );

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
      // orderedTaskIds: pluck('identifier', reorderedTasks),
      orderedTaskIds: reorderedTasks,
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

  const taskGroups = yield select(groupTasksSelector);
  const sourceGroup = taskGroups.find(
    ({ groupIdentifier }) => groupIdentifier === sourceGroupIdentifier,
  );
  const destinationGroup = taskGroups.find(
    ({ groupIdentifier }) => groupIdentifier === destinationGroupIdentifier,
  );

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
      sourceTask.identifier || sourceTask,
    ]);
    yield call(reorderTasksInGroup, {
      // orderedTaskIds: pluck('identifier', destinationTasks),
      orderedTaskIds: destinationTasks,
      taskGroupIdentifier: destinationGroupIdentifier,
    });
    yield put(ListDetailsActions.getTasksGroupsList());

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

function* initializeListDetailsTableState() {
  try {
    const { taskIdentifier } = yield select(locationParametersSelector);
    const taskListIdentifier = yield select(currentTaskListIdentifierSelector);
    const status = yield select(currentTaskListTasksStatusSelector);

    if (taskListIdentifier) {
      let filters = localStorageHelper.getItem(
        getFiltersStorageKey(taskListIdentifier, status),
      );
      if (!filters) {
        filters = sessionStorageHelper.getItem(
          getFiltersStorageKey(taskListIdentifier, status),
        );
      }
      let selectedQuickFilter = localStorageHelper.getItem(
        getQuickFilterStorageKey(taskListIdentifier, status),
      );
      if (!selectedQuickFilter) {
        selectedQuickFilter = sessionStorageHelper.getItem(
          getQuickFilterStorageKey(taskListIdentifier, status),
        );
      }

      if (filters) {
        yield put(
          MegaFilterActions.selectFiltersForMegaFilter(
            filters,
            taskListIdentifier,
            status,
            selectedQuickFilter,
          ),
        );
      }

      yield all([
        put(ListDetailsActions.getTasksGroupsList()),
        put(ListDetailsActions.getListDetailsTaskCounters(taskListIdentifier)),
      ]);
      yield put(ListDetailsActions.getCurrentListTasks());
    }

    const isSelectedTask = yield select(taskIsSelectedSelector);

    if (taskIdentifier && !isSelectedTask) {
      sessionStorage.setItem('selectedTaskIdentifier', taskIdentifier);
    }

    if (isSelectedTask) {
      yield put(openDrawer());
    }
  } catch (error) {
    log('error', error);
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
    const status = yield select(currentTaskListTasksStatusSelector);

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
        const taskGroup = fetchedTasksGroups?.find(
          ({ groupIdentifier }) => groupIdentifier === taskGroupIdentifier,
        );

        if (!taskGroupIdentifier) {
          yield put(ListDetailsActions.refreshListDetailsGroupedTasks(true));
        } else if (taskGroup) {
          yield put({
            type: ActionTypes.ADD_TASK_SUCCESS,
            task: createdTask,
          });
        } else {
          yield call(getTasksForTaskGroups, {
            taskGroupIdentifier,
            status,
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
    console.log(error);
    yield put(showGlobalErrorAlert());
  }
}

function* searchCurrentListTasks() {
  try {
    onSearchChanged();

    yield put(ListDetailsActions.getCurrentListTasks());
  } catch {
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
  const { filters, selectedQuickFilter } = payload;

  const taskListIdentifier = yield select(currentTaskListIdentifierSelector);
  const status = yield select(currentTaskListTasksStatusSelector);

  yield put(
    MegaFilterActions.selectFiltersForMegaFilter(
      filters,
      taskListIdentifier,
      status,
      selectedQuickFilter,
    ),
  );

  yield all([
    // put(ListDetailsActions.getCurrentTaskListFilterOptions()),
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
    log(error);
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
    const { statusCode, assignmentsMismatchCount, taskWorkflowDto } =
      yield call(TemplateBundleApi.applyTemplate, {
        taskTemplateIdentifier,
        taskGroupIdentifier,
        taskListIdentifier,
        unassign,
      });
    const isWarning = statusCode === 'WARNING';

    yield isWarning
      ? applyTaskTemplateFailure({
          errorType: ERROR_TYPES.ASSIGNED_USERS_ARE_NOT_IN_THE_TASK_LIST,
          failureDetails: { taskCount: assignmentsMismatchCount },
          templateDetails: {
            taskTemplateIdentifier,
            taskGroupIdentifier,
            taskListIdentifier,
          },
        })
      : put({
          type: ActionTypes.APPLY_TASK_TEMPLATE_SUCCESS,
          template: taskWorkflowDto,
          taskListIdentifier,
          taskGroupIdentifier,
        });
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
    yield take(ActionTypes.GET_TASKS_GROUPS_LIST_SUCCESS);
    yield call(refreshGroupedTasks, {});
    yield put({
      type: ActionTypes.DELETE_TASK_LIST_GROUP_SUCCESS,
      groupIdentifier,
    });
    yield put(showGlobalAlert(AlertMessages.DELETED));
  } catch {
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
  } catch {
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
  } catch {
    yield put({
      type: ActionTypes.REORDER_TASK_LIST_GROUPS_FAILURE,
      newIndex,
      oldIndex,
    });
  }
}

function* getListCalendarTasks() {
  try {
    const taskListIdentifier = yield select(currentTaskListIdentifierSelector);
    const status = yield select(currentTaskListTasksStatusSelector);
    const { startDate, endDate } = yield select(calendarDateRangeSelector);
    const tasks = yield call(
      ListDetailsApi.getTasksForListByDateRange,
      taskListIdentifier,
      status,
      startDate,
      endDate,
    );
    yield put(ListDetailsActions.getListCalendarTasksSuccess(tasks));
  } catch {
    yield all([
      put(ListDetailsActions.getListCalendarTasksFailure()),
      put(showGlobalErrorAlert()),
    ]);
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
    ActionTypes.INITIALIZE_LIST_DETAILS_TABLE_STATE,
    initializeListDetailsTableState,
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
  yield takeLatest(ActionTypes.GET_LIST_CALENDAR_TASKS, getListCalendarTasks);
}
