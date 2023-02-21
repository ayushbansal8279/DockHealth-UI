/* eslint-disable unicorn/prevent-abbreviations */
import React, {
  useEffect,
  useCallback,
  useState,
  useMemo,
  useRef,
} from 'react';
import { TaskListTabName } from 'helpers/tasklist-helpers';
import * as ListDetailsActions from 'actions/list-details-actions';
import TaskDrawer from 'components/task-drawer/TaskDrawer/TaskDrawer';
import BulkEditSection from 'components/tasklist/BulkEditSection/BulkEditSection';
import HorizontallyScrolledViewLayout from 'components/template/HorizontallyScrolledViewLayout/HorizontallyScrolledViewLayout';
import StickyContainer from 'components/common/HorizontalScroll/StickyContainer';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import isEmpty from 'ramda/src/isEmpty';
import isNil from 'ramda/src/isNil';
import { initializePusher } from 'helpers/pusher-instance';
import useActions from 'hooks/use-actions';
import usePrevious from 'hooks/use-previous';
import localStorageHelper from 'helpers/local-storage-helper';
import { updateUserListViewSetup } from 'actions/task-list-actions';
import { checkIfTaskMatchesFilters } from 'helpers/filters-helpers';
import { TASK_DISAPPEAR_DELAY } from 'helpers/task-update-helper';
import {
  completedTasksIsFetchingSelector,
  tasksIsFetchingSelector,
  groupCompletedTasksSelector,
  groupTasksSelector,
  taskDetailsSortSelector,
  taskCountersSelector,
  searchTermSelector,
} from 'selectors/list-details-selectors';
import {
  currentTaskListIdentifierSelector,
  currentTaskListTasksStatusSelector,
  currentTaskListSelector,
  pendingTaskListsSelector,
  archivedTaskListsSelector,
} from 'selectors/task-list-selectors';
import { taskCustomFieldsSelector } from 'selectors/task-drawer-selectors';
import { findIncompleteRequiredFields } from 'helpers/task-helpers';
import { userProfileSelector } from 'selectors/user-selectors';
import { selectedFiltersInMegaFilterSelector } from 'selectors/mega-filter-selectors';
import { useTaskListColumnsConfig } from 'context-api/columns-config-context';
import * as TaskActions from 'actions/task-actions';
import * as ModalActions from 'modal/actions';
import * as UserAuthApi from 'api/user-auth-api';
import { TaskViewContainer } from './styled';
import ListDetailsToolbar from '../ListDetailsToolbar/ListDetailsToolbar';
import ListDetailsHeader from '../ListDetailsHeader/ListDetailsHeader';
// import TasksView from '../ListDetailsTasksContainer/ListDetailsTasksContainer';
import TasksView from '../ListDetailsTasks/ListDetailsTasks';

const VIEW_LIST_OPTIONS_CONFIG = {
  SHOW_WORKFLOW_DETAILS: false,
  SHOW_WORKFLOW_COMPLETED_TASKS: false,
};

const LIST_DETAILS_FIRST_TIME_KEY = 'LIST_DETAILS_FIRST_TIME_KEY';

const ListDetailsTableView = () => {
  const history = useHistory();
  const params = useParams();
  const sort = useSelector(taskDetailsSortSelector);
  const currentTaskListIdentifier = useSelector(
    currentTaskListIdentifierSelector,
  );
  const taskList = useSelector(currentTaskListSelector);
  const currentStatus = useSelector(currentTaskListTasksStatusSelector);
  const { setCurrentList } = useTaskListColumnsConfig();
  const currentUser = useSelector(userProfileSelector);
  const { userIdentifier: currentUserIdentifier } = currentUser || {};
  const pendingTaskLists = useSelector(pendingTaskListsSelector);
  const archivedTaskLists = useSelector(archivedTaskListsSelector);
  const isFetching = useSelector(tasksIsFetchingSelector);
  const isCompletedTasksFetching = useSelector(
    completedTasksIsFetchingSelector,
  );
  const groupedTasks = useSelector(groupTasksSelector);
  const completedGroupedTasks = useSelector(groupCompletedTasksSelector);
  const taskCounters = useSelector(taskCountersSelector);
  const selectedFilters = useSelector(selectedFiltersInMegaFilterSelector);

  const actions = useActions(TaskActions);
  const modalActions = useActions(ModalActions);

  const [isTourOpen, setIsTourOpen] = useState(false);
  const [tourConditionChecked, setTourConditionChecked] = useState(false);
  const searchValue = useSelector(searchTermSelector);

  const prevCurrentUser = usePrevious(currentUser);
  const prevTaskCounters = usePrevious(taskCounters);
  const prevParams = usePrevious(params);

  const pusher = useRef(initializePusher());
  const [channel, setChannel] = useState(null);

  const dispatch = useDispatch();
  const { taskListIdentifier, tabName } = params;
  const { templates } = useSelector(taskCustomFieldsSelector);

  useEffect(() => {
    if (currentTaskListIdentifier)
      dispatch(ListDetailsActions.initializeListDetailsTableState());
  }, [dispatch, currentTaskListIdentifier, currentStatus]);

  useEffect(() => {
    if (taskListIdentifier) {
      dispatch(ListDetailsActions.getListCustomFields(taskListIdentifier));
    }
  }, [dispatch, taskListIdentifier]);

  const refreshTab = useCallback(
    (withLoader = false) => {
      dispatch(ListDetailsActions.getCurrentTaskListFilterOptions());
      dispatch(
        ListDetailsActions.getListDetailsTaskCounters(taskListIdentifier),
      );
      dispatch(ListDetailsActions.refreshListDetailsGroupedTasks(withLoader));
    },
    [dispatch, taskListIdentifier],
  );

  const openTourModal = useCallback(() => {
    const listDatailsFirstTimeValue = localStorageHelper.getItem(
      LIST_DETAILS_FIRST_TIME_KEY,
    );
    if (isNil(listDatailsFirstTimeValue) || listDatailsFirstTimeValue) {
      setIsTourOpen(true);
    }
  }, []);

  const refreshFilters = useCallback(() => {
    dispatch(ListDetailsActions.getCurrentTaskListFilterOptions());
  }, [dispatch]);

  const refreshAccessToken = useCallback((user) => {
    const systemTimeout = Number.parseInt(
      import.meta.env.VITE_HEALTHCHECK_INTERVAL,
      10,
    );

    if (sessionStorage.refreshAccessTokenTimeoutId) {
      clearTimeout(sessionStorage.refreshAccessTokenTimeoutId);
      sessionStorage.setItem('refreshAccessTokenTimeoutId', null);
    }

    const refreshAccessTokenTimeoutId = setTimeout(() => {
      UserAuthApi.refreshAccessToken(user.username);
      refreshAccessToken(user);
    }, systemTimeout);

    sessionStorage.setItem(
      'refreshAccessTokenTimeoutId',
      refreshAccessTokenTimeoutId,
    );
  }, []);

  const navigateToTab = useCallback(
    (tab) => {
      history.push(
        `/core/tasks/${taskListIdentifier}${
          tab === TaskListTabName.OPEN ? '' : `/${TaskListTabName.COMPLETE}`
        }`,
      );
    },
    [history, taskListIdentifier],
  );

  const refreshTabAfterTaskUpdate = useCallback(
    (updatedTask) => {
      if (
        !checkIfTaskMatchesFilters(updatedTask, selectedFilters) ||
        sort?.key
      ) {
        refreshTab();
      } else {
        refreshFilters();
      }
    },
    [refreshFilters, refreshTab, selectedFilters, sort],
  );

  const handleTaskDelete = useCallback(() => {
    dispatch(ListDetailsActions.getListDetailsTaskCounters(taskListIdentifier));
    dispatch(ListDetailsActions.getTasksGroupsList());
    refreshFilters();
    if (selectedFilters && !isEmpty(selectedFilters)) {
      refreshTab();
    }
  }, [
    dispatch,
    taskListIdentifier,
    refreshFilters,
    refreshTab,
    selectedFilters,
  ]);

  const changeSearchValue = useCallback(
    (searchQuery) =>
      dispatch(ListDetailsActions.searchCurrentListTasks(searchQuery)),
    [dispatch],
  );

  const invokeToggleCompleteAction = useCallback(
    (task) => {
      actions
        .toggleCompleteTask(task, currentUser)
        .then(() => {
          setTimeout(() => {
            dispatch(
              ListDetailsActions.getListDetailsTaskCounters(taskListIdentifier),
            );
            dispatch(ListDetailsActions.getTasksGroupsList());
          }, TASK_DISAPPEAR_DELAY);
        })
        .catch(() => refreshTab());
    },
    [actions, currentUser, dispatch, taskListIdentifier, refreshTab],
  );

  const handleTaskUpdate = useCallback(
    (taskIdentifier, dataToUpdate) => {
      actions
        .partialUpdateTask(taskIdentifier, dataToUpdate)
        .then(refreshTabAfterTaskUpdate)
        .catch(() => refreshTab());
    },
    [actions, refreshTab, refreshTabAfterTaskUpdate],
  );

  const handleUpdateWorkflowStatus = useCallback(
    (task, workflowStatus) => {
      actions
        .updateWorkflowStatus(task, workflowStatus)
        .then(refreshTabAfterTaskUpdate)
        .catch(() => refreshTab());
    },
    [actions, refreshTab, refreshTabAfterTaskUpdate],
  );

  const loadTasksForTaskGroup = useCallback(
    ({ taskGroupIdentifier, startPosition, viewMode, refresh }) => {
      const payload = {
        taskGroupIdentifier,
        status: params.tabName || 'INCOMPLETE',
        startPosition,
        sort,
        viewMode,
        refresh,
      };
      dispatch(ListDetailsActions.getTasksForTaskGroups(payload));
    },
    [dispatch, params.tabName, sort],
  );

  const toggleTaskCompletedStatus = useCallback(
    (task) => {
      const incompleteRequiredFields = findIncompleteRequiredFields(
        templates,
        task,
      );
      const isRequiredFieldsAreIncomplete = incompleteRequiredFields.length > 0;

      if (isRequiredFieldsAreIncomplete) {
        const modalProps = {
          incompleteFields: incompleteRequiredFields,
        };
        modalActions.openModal('CompleteAllFields', modalProps);
        return;
      }

      const hasIncompletedSubtasks =
        task.subtasks?.length > 0
          ? task.subtasks.find((subtask) => subtask.status === 'INCOMPLETE')
          : task.subTasksCount - task.subTasksCompletedCount > 0;

      if (task.status === 'INCOMPLETE' && hasIncompletedSubtasks) {
        const modalProps = {
          confirm: () => {
            modalActions.closeModal();
            invokeToggleCompleteAction(task);
          },
        };
        modalActions.openModal('CompleteAllTasks', modalProps);
      } else {
        invokeToggleCompleteAction(task);
      }
    },
    [invokeToggleCompleteAction, modalActions, templates],
  );

  useEffect(() => {
    refreshAccessToken(currentUser);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (
      taskCounters?.complete === 0 &&
      params.taskListIdentifier === prevParams?.taskListIdentifier &&
      params.tabName === TaskListTabName.COMPLETE
    ) {
      navigateToTab(TaskListTabName.OPEN);
    }

    if (
      prevTaskCounters !== taskCounters &&
      taskCounters?.incomplete !== undefined
    ) {
      if (taskCounters?.incomplete === 0 && !tourConditionChecked) {
        // eslint-disable-next-line react/no-will-update-set-state
        setTourConditionChecked(true);
      }

      if (taskCounters?.incomplete > 0 && !tourConditionChecked) {
        openTourModal();
      }
    }
  }, [
    archivedTaskLists,
    currentUser,
    params.tabName,
    params.taskListIdentifier,
    navigateToTab,
    openTourModal,
    pendingTaskLists,
    prevCurrentUser,
    prevParams,
    prevTaskCounters,
    taskCounters,
    tourConditionChecked,
  ]);

  const selectedTab = tabName || TaskListTabName.OPEN;

  const openedTasks = useMemo(
    () =>
      selectedTab === TaskListTabName.OPEN
        ? groupedTasks?.flatMap(({ tasks }) => tasks) || []
        : [],
    [groupedTasks, selectedTab],
  );

  const completedTasks = useMemo(
    () =>
      selectedTab === TaskListTabName.COMPLETE
        ? completedGroupedTasks?.tasks || []
        : [],
    [completedGroupedTasks, selectedTab],
  );

  const bulkEditTasks = useMemo(
    () => (selectedTab === TaskListTabName.OPEN ? openedTasks : completedTasks),
    [completedTasks, openedTasks, selectedTab],
  );

  const bulkEditIsDisabled = false;
  // const bulkEditIsDisabled = useMemo(
  //   () => selectedTab === TaskListTabName.COMPLETE,
  //   [selectedTab],
  // );

  // eslint-disable-next-line sonarjs/cognitive-complexity
  useEffect(() => {
    const taskCallback = (data) => {
      if (
        data.task?.taskList &&
        data.task?.taskList.taskListIdentifier === taskListIdentifier
      ) {
        if (
          (data.eventType?.startsWith('CREATE_TASK') ||
            data.eventType?.startsWith('DUPLICATE_TASK')) &&
          data.task?.creator.userIdentifier !== currentUserIdentifier
        ) {
          if (data.task?.taskGroups && data.task?.taskGroups.length > 0) {
            loadTasksForTaskGroup({
              taskGroupIdentifier: data.task?.taskGroups[0].taskGroupIdentifier,
              startPosition: 0,
              refresh: false,
            });
          } else {
            refreshTab();
          }
        } else if (data.task.taskIdentifier) {
          actions.refreshTask(data.task.identifier);
        }
      }
    };
    const taskBundleCallback = (data) => {
      // eslint-disable-next-line sonarjs/no-collapsible-if
      if (
        data.taskListIdentifier &&
        data.taskListIdentifier === taskListIdentifier &&
        (data.eventType?.startsWith('CREATE_TASK_BUNDLE') ||
          data.eventType?.startsWith('UPDATE_TASK_BUNDLE') ||
          data.eventType?.startsWith('DUPLICATE_TASK_BUNDLE') ||
          data.eventType?.startsWith('MORE_TASKS_TASK_BUNDLE')) &&
        data.taskBundle.identifier
      ) {
        actions.refreshTaskBundle(data.taskBundle.identifier);
      }
    };

    if (channel && taskListIdentifier) {
      channel.bind('task-update', taskCallback);
      channel.bind('task-bundle-update', taskBundleCallback);
    }

    return () => {
      if (channel && taskListIdentifier) {
        channel.unbind('task-update', taskCallback);
        channel.unbind('task-bundle-update', taskBundleCallback);
      }
    };
  }, [
    channel,
    refreshTab,
    taskListIdentifier,
    currentUserIdentifier,
    actions,
    dispatch,
    loadTasksForTaskGroup,
  ]);

  useEffect(() => {
    if (currentUserIdentifier) {
      const channelName = `private-dock-user-channel-${currentUserIdentifier}`;
      const ch = pusher.current.subscribe(channelName);
      setChannel(ch);

      return () => {
        if (ch) ch.unsubscribe(channelName);
      };
    }

    return () => {};
  }, [currentUserIdentifier]);

  useEffect(() => {
    setCurrentList(taskList);
  }, [setCurrentList, taskList]);

  const displayListPreferences = useMemo(() => {
    const { displayOptions = [] } =
      taskList?.listType === 'PUBLIC'
        ? taskList
        : taskList?.listUsers?.find(
            (user) => user.identifier === currentUserIdentifier,
          ) ||
          taskList ||
          {};

    return displayOptions.reduce(
      (accumulator, value) => ({ ...accumulator, [value]: true }),
      VIEW_LIST_OPTIONS_CONFIG,
    );
  }, [currentUserIdentifier, taskList]);

  const setDisplayListPreferences = useCallback(
    (columnKey) => {
      const newConfig = {
        ...displayListPreferences,
        [columnKey]: !displayListPreferences[columnKey],
      };
      const parsedConfig = Object.entries(newConfig).reduce(
        (accumulator, [key, value]) =>
          value ? [...accumulator, key] : accumulator,
        [],
      );
      dispatch(
        updateUserListViewSetup(
          taskListIdentifier,
          parsedConfig,
          currentUserIdentifier,
        ),
      );
    },
    [
      displayListPreferences,
      dispatch,
      taskListIdentifier,
      currentUserIdentifier,
    ],
  );

  const additionalToolbarOptions = [
    {
      name: 'Show Workflow Details',
      onClick: () => {
        setDisplayListPreferences('SHOW_WORKFLOW_DETAILS');
      },
      key: 'SHOW_WORKFLOW_DETAILS',
      checked: displayListPreferences.SHOW_WORKFLOW_DETAILS,
    },
    {
      name:
        selectedTab === TaskListTabName.COMPLETE
          ? 'Show Workflow Uncompleted Tasks'
          : 'Show Workflow Completed Tasks',
      onClick: () => setDisplayListPreferences('SHOW_WORKFLOW_COMPLETED_TASKS'),
      key: 'SHOW_COMPLETED_OR_UNCOMPLETED_WORKFLOW_DETAILS',
      checked: displayListPreferences.SHOW_WORKFLOW_COMPLETED_TASKS,
    },
  ];

  return (
    <HorizontallyScrolledViewLayout
      header={
        <ListDetailsHeader
          isFetchingTasks={isFetching || isCompletedTasksFetching}
          searchValue={searchValue}
          onSearchChange={changeSearchValue}
          tasks={
            selectedTab === TaskListTabName.OPEN ? openedTasks : completedTasks
          }
          totalTasksAmount={
            selectedTab === TaskListTabName.OPEN
              ? taskCounters.incomplete
              : taskCounters.complete
          }
        />
      }
    >
      <BulkEditSection
        allTasks={bulkEditTasks}
        refreshTasks={refreshTab}
        disabled={bulkEditIsDisabled}
        searchValue={searchValue}
      >
        <div>
          <TaskViewContainer>
            <StickyContainer>
              <ListDetailsToolbar
                additionalOptions={additionalToolbarOptions}
              />
            </StickyContainer>
            <TasksView
              toggleCompleteTask={toggleTaskCompletedStatus}
              onTaskUpdate={handleTaskUpdate}
              updateWorkflowStatus={handleUpdateWorkflowStatus}
              loadTasksForTaskGroup={loadTasksForTaskGroup}
            />
          </TaskViewContainer>
          <TaskDrawer
            fromFirstAddTask={taskCounters?.incomplete === 0}
            hideTour={isTourOpen}
            onTaskUpdate={refreshTabAfterTaskUpdate}
            onTaskDelete={handleTaskDelete}
            onTaskCreation={refreshTabAfterTaskUpdate}
          />
        </div>
      </BulkEditSection>
    </HorizontallyScrolledViewLayout>
  );
};

export default ListDetailsTableView;
