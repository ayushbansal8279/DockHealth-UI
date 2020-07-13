/* eslint-disable sonarjs/cognitive-complexity */
import { isEmpty, isNil } from 'ramda';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { hashHistory } from 'react-router';
import { TaskListTabName } from 'components/taskView/Toolbar/config';
import Tour from 'components/tour-wizard/Tour/Tour';
import { setHeader as setHeaderRaw } from 'actions/header-actions';
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
import { userSelector } from 'selectors/user-selectors';
import {
  selectedFiltersInMegaFilterSelector,
  availableFiltersInInMegaFilterSelector,
} from 'selectors/mega-filter-selectors';

import { ListTourWrapper, ListTourBackground } from './ListDetailsView.Styled';
import TasksView from '../Task/NewTasksView/TasksView';
import { LIST_TOUR_STEPS } from './list-tour-steps';

const LIST_DETAILS_FIRST_TIME_KEY = 'LIST_DETAILS_FIRST_TIME_KEY';

class Home extends Component {
  state = { isTourOpen: false };

  async componentDidMount() {
    const {
      user,
      routeParams,
      taskListActions,
      patientActions,
      setHeader,
    } = this.props;

    setHeader({
      layout: [
        {
          key: 'generic-header',
          component: null,
        },
      ],
    });

    if (routeParams.taskListIdentifier) {
      taskListActions.getMembersByTaskListId(
        routeParams.taskListIdentifier,
        'ALL',
      );
    }

    this.initTable().then(() => {
      this.openTourModal();
    });

    patientActions.getAllPatients();

    this.refreshAccessToken(user);

    // TODO: Move to saga
    taskListActions.getTaskListStats({
      taskListIdentifier: routeParams.taskListIdentifier,
    });
  }

  componentWillUpdate(nextProps) {
    const { actions, routeParams } = this.props;

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
        taskListActions.getTaskListStats({
          taskListIdentifier: nextProps.routeParams.taskListIdentifier,
        });
        this.getTasksList(
          nextProps.routeParams.taskListIdentifier,
          nextProps.routeParams.tabName === TaskListTabName.COMPLETE
            ? 'COMPLETE'
            : 'INCOMPLETE',
        );

        if (nextProps.routeParams.taskListIdentifier) {
          taskListActions.getMembersByTaskListId(
            nextProps.routeParams.taskListIdentifier,
            'ALL',
          );
        }

        // Start with no selected tasks
        actions.storeAsCurrentTask(null);
      }
    }
  }

  componentWillUnmount() {
    const { actions } = this.props;

    actions.resetTaskCounters();
  }

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
    return this.getFilteredTasks(filters, status);
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
      taskListActions,
    } = this.props;

    const status = 'INCOMPLETE';

    megaFilterActions.getFiltersForMegaFilter(taskListIdentifier, status);

    const filters = sessionStorageHelper.getItem(
      `filter-${taskListIdentifier}-${status}`,
    );

    if (withLoader) {
      actions.loading();
    }

    taskListActions.getTaskListStats({
      taskListIdentifier,
    });

    if (filters && !isEmpty(filters)) {
      return this.getFilteredTasks(filters, status);
    }

    return this.getTasksList(taskListIdentifier, status);
  };

  // TODO: Move to saga
  refreshCompleteTasks = (cumulativeFlag = false, withLoader = true) => {
    const {
      actions,
      megaFilterActions,
      taskListActions,
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

    taskListActions.getTaskListStats({ taskListIdentifier });

    const filters = sessionStorageHelper.getItem(
      `filter-${taskListIdentifier}-${status}`,
    );

    if (filters && !isEmpty(filters)) {
      this.getFilteredTasks(filters, status);
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
  getFilteredTasks = (filters, taskStatus) => {
    const {
      routeParams: { taskListIdentifier },
      actions,
    } = this.props;

    return actions.getFilteredTasksForList(
      taskListIdentifier,
      taskStatus,
      filters,
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

    return this.getFilteredTasks(updatedFilters, taskStatus);
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

  quickAddTask = (taskName, taskGroupIdentifier) => {
    const { tasksGroupsListActions } = this.props;

    if (taskName) {
      const payload = {
        description: taskName,
        taskGroupIdentifier,
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
    } = this.props;

    const { isTourOpen } = this.state;

    const { createTaskGroupList } = tasksGroupsListActions;

    const loadedTasklist = taskLists ? taskLists.find(
      t => t.taskListIdentifier === taskListIdentifier,
    ) : {};

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
      title: loadedTasklist?.listName,
      isMainListView: true,
      listUniqueKey: taskListIdentifier,
      pdfTitle: `${loadedTasklist?.listName}`,
      groupPagination: true,
    };

    return (
      <>
        <TasksView {...taskViewProps} defaultGroupName="New tasks" />
        {isTourOpen && (
          <>
            <ListTourWrapper>
              <Tour steps={LIST_TOUR_STEPS} onClose={this.closeTourModal} />
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
  user: userSelector(state),
  selectedFilters: selectedFiltersInMegaFilterSelector(state),
  filters: availableFiltersInInMegaFilterSelector(state),
  members: taskListMembersSelector(state),
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(TaskActions, dispatch),
  taskListActions: bindActionCreators(TaskListActions, dispatch),
  tasksGroupsListActions: bindActionCreators(TasksGroupsListActions, dispatch),
  patientActions: bindActionCreators(PatientActions, dispatch),
  invitationActions: bindActionCreators(InvitationActions, dispatch),
  setHeader: setHeaderRaw(dispatch),
  modalActions: bindActionCreators(ModalActions, dispatch),
  megaFilterActions: bindActionCreators(MegaFilterActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
