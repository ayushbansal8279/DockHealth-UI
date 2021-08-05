/* eslint-disable unicorn/prevent-abbreviations */
/* eslint-disable react-hooks/rules-of-hooks */
import React, {
  useEffect,
  useCallback,
  useState,
  useMemo,
  useRef,
} from 'react';
import { useSelector } from 'react-redux';
import { isEmpty, isNil, move } from 'ramda';
import { initializePusher } from 'helpers/pusher-instance';
import useActions from 'hooks/use-actions';
import usePrevious from 'hooks/use-previous';
import { TaskListTabName } from 'helpers/tasklist-helpers';
import localStorageHelper from 'helpers/local-storage-helper';
import { TaskStatus } from 'helpers/task-helpers';
import { checkIfTaskMatchesFilters } from 'helpers/filters-helpers';
import { TASK_DISAPPEAR_DELAY } from 'helpers/task-update-helper';

import {
  taskListsSelector,
  pendingTaskListsSelector,
  taskListMembersSelector,
} from 'selectors/task-list-selectors';
import { userProfileSelector } from 'selectors/user-selectors';
import { selectedFiltersInMegaFilterSelector } from 'selectors/mega-filter-selectors';
import {
  completedTasksIsFetchingSelector,
  tasksIsFetchingSelector,
  groupCompletedTasksSelector,
  groupTasksSelector,
  taskDetailsSortSelector,
  taskCountersSelector,
} from 'selectors/list-details-selectors';

import * as TemplateActions from 'actions/template-actions';
import * as MegaFilterActions from 'actions/mega-filter-actions';
import * as TaskActions from 'actions/task-actions';
import * as ListDetailsActions from 'actions/list-details-actions';
import { ListDetailsSagaActions } from 'sagas/list-details-saga';
import * as ModalActions from 'modal/actions';
import * as userApi from 'api/user-api';

import ListSelectHeader from 'components/task-view/ListSelectHeader/ListSelectHeader';

const LIST_DETAILS_FIRST_TIME_KEY = 'LIST_DETAILS_FIRST_TIME_KEY';

const initializeListDetailsViewHooks = (match, history) => {
  const sort = useSelector(taskDetailsSortSelector);
  const taskLists = useSelector(taskListsSelector);
  const currentUser = useSelector(userProfileSelector);
  const { userIdentifier: currentUserIdentifier } = currentUser || {};
  const members = useSelector(taskListMembersSelector);
  const pendingTaskLists = useSelector(pendingTaskListsSelector);
  const isFetching = useSelector(tasksIsFetchingSelector);
  const isCompletedTasksFetching = useSelector(
    completedTasksIsFetchingSelector,
  );
  const groupedTasks = useSelector(groupTasksSelector);
  const completedGroupedTasks = useSelector(groupCompletedTasksSelector);
  const taskCounters = useSelector(taskCountersSelector);
  const selectedFilters = useSelector(selectedFiltersInMegaFilterSelector);

  const actions = useActions(TaskActions);
  const listDetailsSagaActions = useActions(ListDetailsSagaActions);
  const templateActions = useActions(TemplateActions);
  const modalActions = useActions(ModalActions);
  const megaFilterActions = useActions(MegaFilterActions);
  const listDetailsActions = useActions(ListDetailsActions);

  const [isTourOpen, setIsTourOpen] = useState(false);
  const [tourConditionChecked, setTourConditionChecked] = useState(false);
  const [searchValue, setSearchValue] = useState(null);

  const prevTaskLists = usePrevious(taskLists);
  const prevCurrentUser = usePrevious(currentUser);
  const prevTaskCounters = usePrevious(taskCounters);
  const prevMatch = usePrevious(match);

  const pusher = useRef(initializePusher());
  const [channel, setChannel] = useState(null);

  const searchTasks = useCallback(
    searchQuery => {
      const tabName = match?.params?.tabName;

      const taskStatus =
        tabName === TaskListTabName.COMPLETE ? 'COMPLETE' : 'INCOMPLETE';

      listDetailsSagaActions.fetchTasksBySearchedTerm({
        status: taskStatus,
        searchedTerm: searchQuery,
      });
    },
    [listDetailsSagaActions, match],
  );

  const refreshTab = useCallback(
    (withLoader = false) => {
      const { params } = match || {};
      const { taskListIdentifier, tabName } = params || {};

      const status =
        tabName === TaskListTabName.COMPLETE
          ? TaskStatus.COMPLETE
          : TaskStatus.INCOMPLETE;

      megaFilterActions.getFiltersForMegaFilter(taskListIdentifier, status);
      listDetailsActions.getListDetailsTaskCounters(params.taskListIdentifier);
      listDetailsActions.refreshListDetailsGroupedTasks(withLoader);
    },
    [listDetailsActions, match, megaFilterActions],
  );

  const setViewHeader = useCallback(
    (taskListIdentifier, lists) => {
      const loadedTasklist =
        lists?.length > 0
          ? lists.find(t => t.taskListIdentifier === taskListIdentifier)
          : {};

      if (loadedTasklist?.listName) {
        const headerComponent = <ListSelectHeader taskList={loadedTasklist} />;

        templateActions.setHeader({
          layout: [
            {
              key: 'header',
              component: headerComponent,
              xs: 12,
            },
          ],
        });
      }
    },
    [templateActions],
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
    const { params } = match;
    const { taskListIdentifier, tabName } = params;

    const status =
      tabName === TaskListTabName.COMPLETE
        ? TaskStatus.COMPLETE
        : TaskStatus.INCOMPLETE;

    megaFilterActions.getFiltersForMegaFilter(taskListIdentifier, status);
  }, [match, megaFilterActions]);

  const refreshAccessToken = useCallback(user => {
    const systemTimeout = parseInt(process.env.HEALTHCHECK_INTERVAL, 10);

    if (sessionStorage.refreshAccessTokenTimeoutId) {
      clearTimeout(sessionStorage.refreshAccessTokenTimeoutId);
      sessionStorage.setItem('refreshAccessTokenTimeoutId', null);
    }

    const refreshAccessTokenTimeoutId = setTimeout(() => {
      userApi.refreshAccessToken(user.username);
      refreshAccessToken(user);
    }, systemTimeout);

    sessionStorage.setItem(
      'refreshAccessTokenTimeoutId',
      refreshAccessTokenTimeoutId,
    );
  }, []);

  const navigateToTab = useCallback(
    tabName => {
      const { params } = match;
      const { taskListIdentifier } = params;

      history.push(
        `/core/tasks/${taskListIdentifier}${
          tabName === TaskListTabName.OPEN ? '' : `/${TaskListTabName.COMPLETE}`
        }`,
      );
    },
    [history, match],
  );

  const quickAddTask = useCallback(
    task => {
      if (task?.description) {
        const payload = {
          ...task,
          autoOpenDrawer: taskCounters?.incomplete === 0,
        };

        listDetailsSagaActions.createTask(payload);
      }
    },
    [listDetailsSagaActions, taskCounters],
  );

  const deleteGroup = useCallback(
    groupId => {
      const { params } = match;
      const { taskListIdentifier } = params;

      const modalProps = {
        confirm: () => {
          modalActions.closeModal();
          listDetailsSagaActions.deleteTasksGroup({
            groupId,
            taskListIdentifier,
          });
        },
      };
      modalActions.openModal('DeleteGroup', modalProps);
    },
    [listDetailsSagaActions, match, modalActions],
  );

  const editGroupName = useCallback(
    (newGroupName, groupId) => {
      const { params } = match;
      const { taskListIdentifier } = params;

      if (newGroupName) {
        listDetailsSagaActions.editTasksGroupName({
          taskListIdentifier,
          groupId,
          newGroupName,
        });
      }
    },
    [listDetailsSagaActions, match],
  );

  const changeGroupsOrder = useCallback(
    (oldTaskIndex, newTaskIndex, groupList) => {
      const { params } = match;
      const { taskListIdentifier } = params;

      if (newTaskIndex < 0 || newTaskIndex >= groupList.length) {
        return;
      }
      const groupIdsList = groupList.map(group => group.taskGroupIdentifier);
      const newGroupList = move(oldTaskIndex, newTaskIndex, groupIdsList);
      listDetailsSagaActions.sortTasksGroups({
        taskGroupIdentifiers: newGroupList,
        taskListIdentifier,
      });
    },
    [listDetailsSagaActions, match],
  );

  const refreshTabAfterTaskUpdate = useCallback(
    updatedTask => {
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
    const { params } = match;
    const { taskListIdentifier } = params;

    listDetailsSagaActions.getTasksGroupsList({
      taskListIdentifier,
      shouldSetRequestState: false,
    });
    refreshFilters();
    if (selectedFilters && !isEmpty(selectedFilters)) {
      refreshTab();
    }
  }, [
    listDetailsSagaActions,
    match,
    refreshFilters,
    refreshTab,
    selectedFilters,
  ]);

  const changeSearchValue = useCallback(
    searchQuery => {
      setSearchValue(searchQuery);

      if (searchQuery) {
        searchTasks(searchQuery);
      } else {
        refreshTab(true);
      }
    },
    [refreshTab, searchTasks],
  );

  const resetSort = useCallback(() => {
    listDetailsActions.sortListDetailsTasks(null, null);
  }, [listDetailsActions]);

  const invokeToggleCompleteAction = useCallback(
    task => {
      const { params } = match;
      const { taskListIdentifier } = params;

      actions
        .toggleCompleteTask(task, currentUser)
        .then(() => {
          setTimeout(() => {
            listDetailsActions.getListDetailsTaskCounters(taskListIdentifier);
            listDetailsSagaActions.getTasksGroupsList({
              shouldSetRequestState: false,
            });
          }, TASK_DISAPPEAR_DELAY);
        })
        .catch(() => refreshTab());
    },
    [
      actions,
      currentUser,
      listDetailsActions,
      listDetailsSagaActions,
      match,
      refreshTab,
    ],
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

  const handleUpdateDueDate = useCallback(
    (task, dueDate) => {
      actions
        .updateDueDate(task, dueDate, true)
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

  const handleCreateGroup = useCallback(
    groupName => {
      listDetailsSagaActions.createTaskGroupList({ groupName });
    },
    [listDetailsSagaActions],
  );

  const loadTasksForTaskGroup = useCallback(
    ({ taskGroupIdentifier, startPosition, viewMode, refresh }) => {
      const payload = {
        taskGroupIdentifier,
        status: 'INCOMPLETE',
        startPosition,
        sort,
        viewMode,
        refresh,
      };
      listDetailsSagaActions.getTasksForTaskGroups(payload);
    },
    [listDetailsSagaActions, sort],
  );

  const loadMoreTasksForList = useCallback(
    ({ status, startPosition, viewMode }) => {
      const { params } = match;
      const { taskListIdentifier } = params;

      actions.getListTasksGroupedByTaskGroup(
        taskListIdentifier,
        sort,
        status,
        startPosition,
        0,
        true,
        viewMode,
      );
    },
    [actions, match, sort],
  );

  const toggleTaskCompletedStatus = useCallback(
    task => {
      const hasIncompletedSubtasks =
        task.subtasks?.length > 0
          ? task.subtasks.find(subtask => subtask.status === 'INCOMPLETE')
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
    [invokeToggleCompleteAction, modalActions],
  );

  const launchNewFeaturesModal = useCallback(() => {
    const isNewUser = currentUser?.usageState?.loginCount <= 5;

    if (currentUser && !isEmpty(currentUser) && !isNewUser) {
      const { userPreference: { appFeaturesReviewed } = {} } = currentUser;

      if (!appFeaturesReviewed?.includes('MULTI_MENTION_ASSIGN')) {
        modalActions.openModal('MultiMentionAssignTour', {
          onClose: () => {
            userApi.updateUserDashboardPrefs({
              appFeaturesReviewed: ['MULTI_MENTION_ASSIGN'],
            });
          },
        });
      }
    }
  }, [currentUser, modalActions]);

  useEffect(() => {
    const { params } = match;

    setViewHeader(params.taskListIdentifier, [
      ...taskLists,
      ...pendingTaskLists,
    ]);

    refreshAccessToken(currentUser);
    launchNewFeaturesModal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (
      taskCounters?.complete === 0 &&
      match.params.taskListIdentifier ===
        prevMatch?.params?.taskListIdentifier &&
      match.params.tabName === TaskListTabName.COMPLETE
    ) {
      navigateToTab(TaskListTabName.OPEN);
    }

    if (
      prevMatch?.params?.taskListIdentifier &&
      match.params.taskListIdentifier &&
      match.params.taskListIdentifier !== prevMatch?.params?.taskListIdentifier
    ) {
      setViewHeader(match.params.taskListIdentifier, [
        ...taskLists,
        ...pendingTaskLists,
      ]);
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
    currentUser,
    match.params.tabName,
    match.params.taskListIdentifier,
    navigateToTab,
    openTourModal,
    pendingTaskLists,
    prevCurrentUser,
    prevMatch,
    prevTaskCounters,
    prevTaskLists,
    setViewHeader,
    taskCounters,
    taskLists,
    tourConditionChecked,
  ]);

  const { params } = match;
  const { taskListIdentifier, tabName } = params;

  const loadedTasklist = useMemo(
    () =>
      taskLists
        ? taskLists.find(t => t.taskListIdentifier === taskListIdentifier)
        : {},
    [taskListIdentifier, taskLists],
  );

  const selectedTab = tabName || TaskListTabName.OPEN;

  const openedTasks = useMemo(
    () =>
      selectedTab === TaskListTabName.OPEN
        ? Object.values(groupedTasks)?.flatMap(({ tasks }) => tasks) || []
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

  const bulkEditIsDisabled = useMemo(
    () => selectedTab === TaskListTabName.COMPLETE,
    [selectedTab],
  );

  useEffect(() => {
    const callback = data => {
      if (
        data.task?.taskList &&
        data.task?.taskList.taskListIdentifier === taskListIdentifier
      ) {
        if (
          (data.eventType?.startsWith('CREATE_TASK') ||
            data.eventType?.startsWith('DUPLICATE_TASK')) &&
          data.task?.creator.userIdentifier !== currentUserIdentifier
        ) {
          refreshTab();
        } else if (
          data.eventType === 'UPDATE_TASK' &&
          data.task.taskIdentifier
        ) {
          actions.refreshAnotherTask(data.task);
        }
      }
    };

    if (channel && taskListIdentifier) {
      channel.bind('task-update', callback);
    }

    return () => {
      if (channel && taskListIdentifier) {
        channel.unbind('task-update', callback);
      }
    };
  }, [channel, refreshTab, taskListIdentifier, currentUserIdentifier, actions]);

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

  return {
    bulkEditIsDisabled,
    bulkEditTasks,
    changeGroupsOrder,
    changeSearchValue,
    completedTasks,
    deleteGroup,
    editGroupName,
    handleCreateGroup,
    handleTaskDelete,
    handleTaskUpdate,
    handleUpdateDueDate,
    handleUpdateWorkflowStatus,
    isCompletedTasksFetching,
    isFetching,
    isTourOpen,
    listDetailsActions,
    loadedTasklist,
    loadMoreTasksForList,
    loadTasksForTaskGroup,
    members,
    modalActions,
    navigateToTab,
    openedTasks,
    quickAddTask,
    refreshTab,
    refreshTabAfterTaskUpdate,
    resetSort,
    searchValue,
    selectedFilters,
    selectedTab,
    sort,
    taskCounters,
    taskListIdentifier,
    toggleTaskCompletedStatus,
  };
};

export default initializeListDetailsViewHooks;
