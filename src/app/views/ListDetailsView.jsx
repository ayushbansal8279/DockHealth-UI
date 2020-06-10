/* eslint-disable sonarjs/cognitive-complexity */
import { isEmpty } from 'ramda';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { hashHistory } from 'react-router';
import { TaskListTabName } from 'components/taskView/Toolbar/config';
import { setHeader as setHeaderRaw } from 'actions/header-actions';
import * as MegaFilterActions from 'actions/mega-filter-actions';
import * as InvitationActions from 'actions/invitation-actions';
import * as PatientActions from 'actions/patient-actions';
import * as TaskActions from 'actions/task-actions';
import * as TaskListActions from 'actions/tasklist-actions';
import { TasksGroupsListActions } from 'sagas/tasks-groups-list';
import * as ModalActions from 'modal/actions';
import * as userApi from 'api/user-api';
import { noop } from 'helpers/utility-functions';
import sessionStorageHelper from 'helpers/session-storage-helper';
import { arrayMove } from 'helpers/sorting-helper';
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

import TasksView from './Task/NewTasksView/TasksView';

class Home extends Component {
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

    this.initTable();

    // TODO: Move to saga
    taskListActions.getOrganizationUsersNotInTaskList(
      routeParams.taskListIdentifier,
    );
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
        taskListActions.getOrganizationUsersNotInTaskList(
          nextProps.routeParams.taskListIdentifier,
        );

        // Start with no selected tasks
        actions.storeAsCurrentTask(null);
      }
    }
  }

  componentWillUnmount() {
    const { actions } = this.props;

    actions.resetTaskCounters();
  }

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
      this.getTasksList(taskListIdentifier, status);
    } else {
      this.getFilteredTasks(filters, status);
    }
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
    const { actions, routeParams, taskListActions } = this.props;

    const status = 'INCOMPLETE';

    const filters = sessionStorageHelper.getItem(
      `filter-${routeParams.taskListIdentifier}-${status}`,
    );

    if (withLoader) {
      actions.loading();
    }

    taskListActions.getTaskListStats({
      taskListIdentifier: routeParams.taskListIdentifier,
    });

    if (filters && !isEmpty(filters)) {
      return this.getFilteredTasks(filters, status);
    }

    return this.getTasksList(routeParams.taskListIdentifier, status);
  };

  // TODO: Move to saga
  refreshCompleteTasks = (cumulativeFlag = false, withLoader = true) => {
    const {
      actions,
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

    taskListActions.getTaskListStats({ taskListIdentifier });

    const status = 'COMPLETE';

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

  quickAddTask = (taskName, taskGroupIdentifier, reloadGroups = false) => {
    const {
      actions,
      routeParams: { taskListIdentifier },
    } = this.props;

    if (taskName) {
      const payload = {
        description: taskName,
        taskListIdentifier,
        taskGroupIdentifier,
      };

      actions.saveTask(payload, reloadGroups);
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
      membersNotInTaskList,
      routeParams,
      selectedFilters,
      routeParams: { taskListIdentifier },
    } = this.props;

    const { createTaskGroupList } = tasksGroupsListActions;

    const loadedTasklist = taskLists.find(
      t => t.taskListIdentifier === taskListIdentifier,
    );

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
      membersNotInTaskList,
      routeParams,
      hasFiltersApplied: !isEmpty(selectedFilters),
    };

    return <TasksView {...taskViewProps} defaultGroupName="New tasks" />;
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
