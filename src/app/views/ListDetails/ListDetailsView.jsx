/* eslint-disable sonarjs/cognitive-complexity */
import { isEmpty, isNil } from 'ramda';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { hashHistory } from 'react-router';
import { TaskListTabName } from 'components/taskView/Toolbar/config';
import Tour from 'components/tour-wizard/Tour/Tour';
import { setHeader } from 'actions/header-actions';
import * as MegaFilterActions from 'actions/mega-filter-actions';
import * as InvitationActions from 'actions/invitation-actions';
import * as PatientActions from 'actions/patient-actions';
import * as TaskActions from 'actions/task-actions';
import * as TaskListActions from 'actions/tasklist-actions';
import { TasksGroupsListActions } from 'sagas/tasks-groups-list-saga';
import * as ModalActions from 'modal/actions';
import * as userApi from 'api/user-api';
import { noop } from 'helpers/utility-functions';
import sessionStorageHelper from 'helpers/session-storage-helper';
import { arrayMove } from 'helpers/sorting-helper';
import localStorageHelper from 'helpers/local-storage-helper';
import {
  taskListSelector,
  taskListMembersSelector,
} from 'selectors/task-list-selectors';
import { completedTasksSelector } from 'selectors/task-selectors';
import { userProfileSelector } from 'selectors/user-selectors';
import {
  selectedFiltersInMegaFilterSelector,
  availableFiltersInInMegaFilterSelector,
} from 'selectors/mega-filter-selectors';
import Header from 'components/taskView/Header';

import { initializePusher } from 'helpers/pusher-instance';
import { ListTourWrapper, ListTourBackground } from './ListDetailsView.Styled';
import TasksView from '../Task/NewTasksView/TasksView';
import { LIST_TOUR_STEPS } from './list-tour-steps';

const LIST_DETAILS_FIRST_TIME_KEY = 'LIST_DETAILS_FIRST_TIME_KEY';

class Home extends Component {
  state = { isTourOpen: false, tourConditionChecked: false };

  async componentDidMount() {
    const {
      routeParams,
      currentUser,
      taskLists,
      pendingTaskLists = [],
    } = this.props;

    this.initTable();

    this.setViewHeader(routeParams.taskListIdentifier, [
      ...taskLists,
      ...pendingTaskLists,
    ]);

    this.refreshAccessToken(currentUser);

    this.listenForRealTimeEvents(routeParams.taskListIdentifier, currentUser);
  }

  componentWillUpdate(nextProps) {
    const {
      actions,
      routeParams,
      taskLists,
      currentUser,
      taskCounters,
    } = this.props;

    if (
      nextProps.taskCounters?.complete === 0 &&
      nextProps.routeParams.taskListIdentifier ===
        routeParams.taskListIdentifier &&
      nextProps.routeParams.tabName === TaskListTabName.COMPLETE
    ) {
      this.navigateToTab(TaskListTabName.OPEN);
    }

    if (
      taskLists !== nextProps.taskLists ||
      nextProps.routeParams.taskListIdentifier !==
        routeParams.taskListIdentifier
    ) {
      this.setViewHeader(nextProps.routeParams.taskListIdentifier, [
        ...nextProps?.taskLists,
        ...nextProps?.pendingTaskLists,
      ]);
    }

    if (
      taskCounters !== nextProps.taskCounters &&
      nextProps.taskCounters?.incomplete !== undefined
    ) {
      const { tourConditionChecked } = this.state;

      if (nextProps.taskCounters?.incomplete === 0 && !tourConditionChecked) {
        // eslint-disable-next-line react/no-will-update-set-state
        this.setState({ tourConditionChecked: true });
      }

      if (nextProps.taskCounters?.incomplete > 0 && !tourConditionChecked) {
        this.openTourModal();
      }
    }

    if (
      nextProps.routeParams.taskListIdentifier ===
        routeParams.taskListIdentifier &&
      nextProps.routeParams.tabName !== routeParams.tabName
    ) {
      actions.getTaskStatsForList(routeParams.taskListIdentifier);
      if (nextProps.routeParams.tabName === TaskListTabName.COMPLETE) {
        this.refreshCompleteTasks();
      } else {
        this.refreshIncompleteTasks();
      }
    }

    if (
      nextProps.routeParams.taskListIdentifier !==
      routeParams.taskListIdentifier
    ) {
      const { taskListActions, megaFilterActions } = this.props;

      actions.loading();
      megaFilterActions.clearFiltersForMegaFilter();
      actions.resetTaskCounters();
      actions.getTaskStatsForList(nextProps.routeParams.taskListIdentifier);

      if (nextProps.routeParams.taskListIdentifier != null) {
        taskListActions.getTaskListById(
          nextProps.routeParams.taskListIdentifier,
        );

        const status =
          nextProps.routeParams.tabName === TaskListTabName.COMPLETE
            ? 'COMPLETE'
            : 'INCOMPLETE';
        const filters = sessionStorageHelper.getItem(
          `filter-${nextProps.routeParams.taskListIdentifier}-${status}`,
        );

        if (!filters) {
          this.getTasksList(nextProps.routeParams.taskListIdentifier, status);
        } else {
          this.getFilteredTasks(
            nextProps.routeParams.taskListIdentifier,
            filters,
            status,
          );
        }

        // Start with no selected tasks
        actions.storeAsCurrentTask(null);
      }
    }

    if (
      (currentUser &&
        nextProps &&
        nextProps.currentUser &&
        currentUser.userIdentifier !== nextProps.currentUser.userIdentifier) ||
      nextProps.routeParams.taskListIdentifier !==
        routeParams.taskListIdentifier
    ) {
      this.listenForRealTimeEvents(
        nextProps.routeParams.taskListIdentifier,
        nextProps.currentUser,
      );
    }
  }

  componentWillUnmount() {
    const { actions } = this.props;

    actions.resetTaskCounters();
  }

  listenForRealTimeEvents = (taskListIdentifier, currentUser) => {
    if (!currentUser || !currentUser.userIdentifier) {
      return;
    }

    const { actions } = this.props;
    const currentUserIdentifier = currentUser.userIdentifier;
    const channelName = `private-dock-user-channel-${currentUserIdentifier}`;

    const pusher = initializePusher();
    let channel = pusher?.channel(channelName);
    if (!channel || !channel.subscribed) {
      channel = pusher.subscribe(channelName);
      console.log(`subscribed to channel: ${channelName}`);
    }
    // channel.bind('pusher:subscription_succeeded', function() {
    //   console.log('subscription_succeeded');
    // });
    // channel.bind('pusher:subscription_error', function(status) {
    //   console.log('subscription_error', status);
    // });
    // console.log(channel);
    // Listen to the channel for new entries.
    // The server publishes to this channel whenever a entry is updated

    channel.bind('task-update', data => {
      // Since the app is going to be realtime, we don't want the same item to
      // be shown twice. Device A publishes an entry, all other devices including itself
      // receives the entry, so act like a basic filter
      // console.log(data);
      const currentTaskListIdentifier = taskListIdentifier;
      if (
        data.task?.taskList &&
        data.task?.taskList.taskListIdentifier === currentTaskListIdentifier
      ) {
        if (
          (data.eventType?.startsWith('CREATE_TASK') ||
            data.eventType?.startsWith('DUPLICATE_TASK')) &&
          data.task?.taskList &&
          data.task?.creator.userIdentifier !== currentUserIdentifier
        ) {
          const status = 'INCOMPLETE';
          const filters = sessionStorageHelper.getItem(
            `filter-${data.task.taskList.taskListIdentifier}-${status}`,
          );

          if (!filters) {
            this.getTasksList(data.task.taskList.taskListIdentifier, status);
          } else {
            this.getFilteredTasks(
              data.task.taskList.taskListIdentifier,
              filters,
              status,
            );
          }
        }
        // eslint-disable-next-line no-unused-expressions
        actions.refreshAnotherTask(data.task);
      }
    });
  };

  setViewHeader = (taskListIdentifier, taskLists) => {
    const { setHeaderAction } = this.props;

    const loadedTasklist =
      taskLists?.length > 0
        ? taskLists.find(t => t.taskListIdentifier === taskListIdentifier)
        : {};

    if (loadedTasklist?.listName) {
      const headerComponent = (
        <Header
          isFetching={false}
          title={loadedTasklist.listName}
          taskList={loadedTasklist}
          resetHeader={this.setViewHeader}
          hasTitle={loadedTasklist.listName}
        />
      );

      setHeaderAction({
        layout: [
          {
            key: 'header',
            component: headerComponent,
            xs: 12,
          },
        ],
      });
    }
  };

  openTourModal = () => {
    const listDatailsFirstTimeValue = localStorageHelper.getItem(
      LIST_DETAILS_FIRST_TIME_KEY,
    );
    if (isNil(listDatailsFirstTimeValue) || listDatailsFirstTimeValue) {
      this.setState({ isTourOpen: true });
    }
  };

  closeTourModal = () => {
    this.setState({ isTourOpen: false });
    localStorageHelper.setItem(LIST_DETAILS_FIRST_TIME_KEY, false);
  };

  initTable = () => {
    const {
      actions,
      routeParams: { tabName, taskListIdentifier },
    } = this.props;

    actions.getTaskStatsForList(taskListIdentifier);

    let status = 'INCOMPLETE';

    if (tabName === TaskListTabName.COMPLETE) {
      actions.loadingCompletedTasks();
      status = 'COMPLETE';
    } else {
      actions.loading();
    }

    const filters = sessionStorageHelper.getItem(
      `filter-${taskListIdentifier}-${status}`,
    );

    if (!filters) {
      return this.getTasksList(taskListIdentifier, status);
    }
    return this.getFilteredTasks(taskListIdentifier, filters, status);
  };

  refreshTab = (withLoader = false, cumulativeFlag = false) => {
    const {
      actions,
      routeParams: { tabName, taskListIdentifier },
    } = this.props;

    actions.getTaskStatsForList(taskListIdentifier);

    if (tabName === TaskListTabName.COMPLETE) {
      return this.refreshCompleteTasks(cumulativeFlag, withLoader);
    }

    return this.refreshIncompleteTasks(withLoader);
  };

  // TODO: Move to saga
  refreshIncompleteTasks = (withLoader = true) => {
    const {
      actions,
      megaFilterActions,
      routeParams: { taskListIdentifier },
    } = this.props;

    const status = 'INCOMPLETE';

    megaFilterActions.getFiltersForMegaFilter(taskListIdentifier, status);

    const filters = sessionStorageHelper.getItem(
      `filter-${taskListIdentifier}-${status}`,
    );

    if (withLoader) {
      actions.loading();
    }

    if (filters && !isEmpty(filters)) {
      return this.getFilteredTasks(
        taskListIdentifier,
        filters,
        status,
        withLoader,
      );
    }

    return this.getTasksList(taskListIdentifier, status);
  };

  // TODO: Move to saga
  refreshCompleteTasks = (cumulativeFlag = false, withLoader = true) => {
    const {
      actions,
      megaFilterActions,
      completedTasks,
      routeParams: { taskListIdentifier },
    } = this.props;

    let queryStartPosition = 0;

    if (cumulativeFlag) {
      queryStartPosition = completedTasks.reduce(
        (counter, task) => counter + task.subtasks.length + 1,
        0,
      );
    }

    if (withLoader) {
      actions.loadingCompletedTasks();
    }

    const status = 'COMPLETE';

    megaFilterActions.getFiltersForMegaFilter(taskListIdentifier, status);

    const filters = sessionStorageHelper.getItem(
      `filter-${taskListIdentifier}-${status}`,
    );

    if (filters && !isEmpty(filters)) {
      this.getFilteredTasks(taskListIdentifier, filters, status, withLoader);
    } else {
      this.getTasksList(
        taskListIdentifier,
        status,
        cumulativeFlag,
        queryStartPosition,
      );
    }
  };

  getTasksList = (
    taskListIdentifier,
    status,
    cumulativeFlag = false,
    queryStartPosition = 0,
  ) => {
    const { actions } = this.props;

    return actions.getListTasks(
      taskListIdentifier,
      undefined,
      undefined,
      status,
      cumulativeFlag,
      queryStartPosition,
    );
  };

  // TODO: Move to saga
  getFilteredTasks = (taskListIdentifier, filters, taskStatus, withLoader) => {
    const { actions } = this.props;

    return actions.getFilteredTasksForList(
      taskListIdentifier,
      taskStatus,
      filters,
      withLoader,
    );
  };

  // TODO: Move to saga
  handleFilterChange = updatedFilters => {
    const {
      routeParams: { tabName, taskListIdentifier },
      megaFilterActions,
    } = this.props;

    const taskStatus =
      tabName === TaskListTabName.COMPLETE ? 'COMPLETE' : 'INCOMPLETE';

    megaFilterActions.selectFiltersForMegaFilter(
      updatedFilters,
      taskListIdentifier,
      taskStatus,
    );

    if (isEmpty(updatedFilters)) {
      return this.getTasksList(taskListIdentifier, taskStatus);
    }

    return this.getFilteredTasks(
      taskListIdentifier,
      updatedFilters,
      taskStatus,
    );
  };

  downloadPDF = () => {
    const {
      routeParams: { taskListIdentifier },
    } = this.props;

    if (taskListIdentifier) {
      window.print();
    }
  };

  handleRetry = (error, callback) => {
    if (error.message === 'Network Error') {
      console.log('refresh token on Network Error');
      userApi
        .refreshAccessToken(sessionStorage.getItem('username'))
        .then(callback)
        .catch(noop);
    }
  };

  refreshAccessToken = user => {
    const systemTimeout = parseInt(process.env.HEALTHCHECK_INTERVAL, 10);

    if (sessionStorage.refreshAccessTokenTimeoutId) {
      clearTimeout(sessionStorage.refreshAccessTokenTimeoutId);
      sessionStorage.setItem('refreshAccessTokenTimeoutId', null);
    }

    const refreshAccessTokenTimeoutId = setTimeout(() => {
      console.log('refresh token on timeout');
      userApi.refreshAccessToken(user.username);
      this.refreshAccessToken(user);
    }, systemTimeout);

    sessionStorage.setItem(
      'refreshAccessTokenTimeoutId',
      refreshAccessTokenTimeoutId,
    );
  };

  navigateToTab = tabName => {
    const {
      routeParams: { taskListIdentifier },
    } = this.props;

    hashHistory.push(
      `/tasks/${taskListIdentifier}${
        tabName === TaskListTabName.OPEN ? '' : `/${TaskListTabName.COMPLETE}`
      }`,
    );
  };

  quickAddTask = task => {
    const { tasksGroupsListActions, taskCounters } = this.props;

    if (task?.description) {
      const payload = {
        ...task,
        autoOpenDrawer: taskCounters?.incomplete === 0,
      };

      tasksGroupsListActions.createTask(payload);
    }
  };

  deleteGroup = groupId => {
    const {
      modalActions,
      tasksGroupsListActions: { deleteTasksGroup },
      routeParams: { taskListIdentifier },
    } = this.props;

    const modalProps = {
      confirm: () => {
        modalActions.closeModal();
        deleteTasksGroup({ groupId, taskListIdentifier });
      },
    };
    modalActions.openModal('DeleteGroup', modalProps);
  };

  editGroupName = (newGroupName, groupId) => {
    const {
      tasksGroupsListActions: { editTasksGroupName },
      routeParams: { taskListIdentifier },
    } = this.props;

    if (newGroupName) {
      editTasksGroupName({ taskListIdentifier, groupId, newGroupName });
    }
  };

  changeGroupsOrder = (oldTaskIndex, newTaskIndex, groupList) => {
    const {
      tasksGroupsListActions: { sortTasksGroups },
      routeParams: { taskListIdentifier },
    } = this.props;
    if (newTaskIndex < 0 || newTaskIndex >= groupList.length) {
      return;
    }
    const groupIdsList = groupList.map(group => group.taskGroupIdentifier);
    const newGroupList = arrayMove(groupIdsList, oldTaskIndex, newTaskIndex);
    sortTasksGroups({ taskGroupIdentifiers: newGroupList, taskListIdentifier });
  };

  render() {
    const {
      tasksGroupsListActions,
      members,
      taskLists,
      routeParams,
      selectedFilters,
      routeParams: { taskListIdentifier },
      taskCounters,
    } = this.props;

    const { isTourOpen } = this.state;

    const { createTaskGroupList } = tasksGroupsListActions;

    const loadedTasklist = taskLists
      ? taskLists.find(t => t.taskListIdentifier === taskListIdentifier)
      : {};

    const taskViewProps = {
      members,
      refreshTab: this.refreshTab,
      downloadPDF: this.downloadPDF,
      navigateToTab: this.navigateToTab,
      createListGroup: groupName => createTaskGroupList({ groupName }),
      quickAddTask: this.quickAddTask,
      deleteGroup: this.deleteGroup,
      editGroupName: this.editGroupName,
      changeGroupsOrder: this.changeGroupsOrder,
      handleFilterChange: this.handleFilterChange,
      taskList: loadedTasklist || undefined,
      routeParams,
      hasFiltersApplied: !isEmpty(selectedFilters),
      isMainListView: true,
      listUniqueKey: taskListIdentifier,
      pdfTitle: `${loadedTasklist?.listName}`,
      groupPagination: true,
      drawerAutoOpenEnabled: taskCounters?.incomplete === 0,
      isTourOpen,
    };

    return (
      <>
        <TasksView {...taskViewProps} defaultGroupName="New tasks" />
        {isTourOpen && (
          <>
            <ListTourWrapper>
              <Tour
                modalName="List tour modal"
                steps={LIST_TOUR_STEPS}
                onClose={this.closeTourModal}
              />
            </ListTourWrapper>
            <ListTourBackground onClick={this.closeTourModal} />
          </>
        )}
      </>
    );
  }
}

const mapStateToProps = state => ({
  taskLists: taskListSelector(state),
  completedTasks: completedTasksSelector(state),
  currentUser: userProfileSelector(state),
  selectedFilters: selectedFiltersInMegaFilterSelector(state),
  filters: availableFiltersInInMegaFilterSelector(state),
  members: taskListMembersSelector(state),
  taskCounters: state.listTasks.taskCounters,
  pendingTaskLists: state.invitationState.pendingTasklists,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(TaskActions, dispatch),
  taskListActions: bindActionCreators(TaskListActions, dispatch),
  tasksGroupsListActions: bindActionCreators(TasksGroupsListActions, dispatch),
  patientActions: bindActionCreators(PatientActions, dispatch),
  invitationActions: bindActionCreators(InvitationActions, dispatch),
  setHeaderAction: setHeader(dispatch),
  modalActions: bindActionCreators(ModalActions, dispatch),
  megaFilterActions: bindActionCreators(MegaFilterActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
