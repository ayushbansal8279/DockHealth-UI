/* eslint-disable sonarjs/cognitive-complexity */
import { isEmpty } from 'ramda';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { TaskListTabName } from 'components/taskView/Toolbar/config';
import { setHeader as setHeaderRaw } from 'actions/header-actions';
import * as InvitationActions from 'actions/invitation-actions';
import * as PatientActions from 'actions/patient-actions';
import * as TaskActions from 'actions/task-actions';
import * as TaskListActions from 'actions/tasklist-actions';
import * as TaskLabelActions from 'actions/task-label-actions';
import * as TaskGroupActions from 'actions/task-group-list-actions';
import * as ModalActions from 'modal/actions';
import * as userApi from 'api/user-api';
import { noop } from 'helpers/utility-functions';
import { arrayMove } from 'helpers/sorting-helper';
import { hashHistory } from 'react-router';
import TasksView from './Task/NewTasksView/TasksView';

const ASSIGNED_BY_ME = 'assigned_by_me';
const ASSIGNED_TO_ME = 'assigned_to_me';

class Home extends Component {
  async componentDidMount() {
    const {
      user,
      routeParams,
      actions,
      taskListActions,
      patientActions,
      invitationActions,
      taskLabelActions: { getTaskListLabels },
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

    actions.getTaskStatsForList(routeParams.taskListIdentifier);

    if (routeParams.taskListIdentifier) {
      taskListActions.getMembersByTaskListId(
        routeParams.taskListIdentifier,
        'ALL',
      );
    }

    if (routeParams.tabName === TaskListTabName.COMPLETE) {
      await this.refreshCompleteTasks(false, true);
    } else {
      await this.refreshIncompleteTasks(true);
    }

    taskListActions.getOrganizationUsersNotInTaskList(
      routeParams.taskListIdentifier,
    );
    patientActions.getAllPatients();

    await invitationActions.findPendingTaskListsForUser();

    const { pendingTasklists } = this.props;

    await Promise.all(
      pendingTasklists.map(tasklist =>
        invitationActions.acceptInviteToTaskList(tasklist),
      ),
    );

    this.refreshAccessToken(user);

    taskListActions.getTaskListStats({
      taskListIdentifier: routeParams.taskListIdentifier,
    });

    getTaskListLabels({ taskListIdentifier: routeParams.taskListIdentifier });
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
      const { taskListActions } = this.props;

      actions.loading();
      actions.resetTaskCounters();
      actions.getTaskStatsForList(nextProps.routeParams.taskListIdentifier);

      if (nextProps.routeParams.taskListIdentifier != null) {
        taskListActions.getTaskListById(
          nextProps.routeParams.taskListIdentifier,
        );
        taskListActions.getTaskListStats({
          taskListIdentifier: nextProps.routeParams.taskListIdentifier,
        });
        actions.getListTasks(
          nextProps.routeParams.taskListIdentifier,
          undefined,
          undefined,
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

  refreshTab = (withLoader = false, cumulativeFlag = false) => {
    const {
      actions,
      routeParams: { tabName, taskListIdentifier },
    } = this.props;

    actions.getTaskStatsForList(taskListIdentifier);

    if (tabName === TaskListTabName.COMPLETE) {
      this.refreshCompleteTasks(cumulativeFlag, withLoader);
    } else {
      this.refreshIncompleteTasks(withLoader);
    }
  };

  refreshIncompleteTasks = (withLoader = true) => {
    const {
      actions,
      routeParams,
      taskListActions,
      megaFilter: { selectedFilters },
    } = this.props;

    const status = 'INCOMPLETE';

    if (withLoader) {
      actions.loading();
    }

    taskListActions.getTaskListStats({
      taskListIdentifier: routeParams.taskListIdentifier,
    });

    if (!isEmpty(selectedFilters)) {
      return this.getFilteredTasks(selectedFilters, status);
    }

    return actions.getListTasks(
      routeParams.taskListIdentifier,
      undefined,
      undefined,
      status,
    );
  };

  refreshCompleteTasks = (cumulativeFlag = false, withLoader = true) => {
    const {
      actions,
      taskListActions,
      completedTasks,
      routeParams: { taskListIdentifier },
      megaFilter: { selectedFilters },
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

    if (isEmpty(selectedFilters)) {
      actions
        .getListTasks(
          taskListIdentifier,
          undefined,
          undefined,
          status,
          cumulativeFlag,
          queryStartPosition,
        )
        .then(noop)
        .catch(error => {
          this.handleRetry(error, () => {
            actions.getListTasks(
              taskListIdentifier,
              undefined,
              undefined,
              status,
              cumulativeFlag,
              queryStartPosition,
            );
          });
        });
    } else {
      this.getFilteredTasks(selectedFilters, status);
    }
  };

  downloadPDF = () => {
    const {
      routeParams: { taskListIdentifier },
    } = this.props;

    if (taskListIdentifier) {
      window.print();
    }
  };

  handleFilterChange = updatedFilters => {
    const {
      routeParams: { tabName },
    } = this.props;

    const taskStatus =
      tabName === TaskListTabName.COMPLETE ? 'COMPLETE' : 'INCOMPLETE';

    this.getFilteredTasks(updatedFilters, taskStatus);
  };

  getFilteredTasks = (updatedFilters, taskStatus) => {
    const {
      routeParams: { taskListIdentifier },
      actions,
      megaFilter: { filters },
    } = this.props;

    const taskFilters = {};

    if (!isEmpty(updatedFilters)) {
      Object.keys(updatedFilters).forEach(keyIndex => {
        const { filterKey } = filters[keyIndex];
        taskFilters[filterKey] = updatedFilters[keyIndex];
      });
    }

    actions.getFilteredTasksForList(
      taskListIdentifier,
      taskStatus,
      taskFilters,
    );
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
      taskGroupActions,
      routeParams: { taskListIdentifier },
    } = this.props;

    const modalProps = {
      confirm: () => {
        modalActions.closeModal();
        taskGroupActions.deleteTasksGroup(groupId, taskListIdentifier);
      },
    };
    modalActions.openModal('DeleteGroup', modalProps);
  };

  editGroupName = (newGroupName, groupId) => {
    const {
      taskGroupActions,
      routeParams: { taskListIdentifier },
    } = this.props;

    if (newGroupName) {
      taskGroupActions.editTasksGroupName(
        taskListIdentifier,
        groupId,
        newGroupName,
      );
    }
  };

  changeGroupsOrder = (oldTaskIndex, newTaskIndex, groupList) => {
    const {
      taskGroupActions,
      routeParams: { taskListIdentifier },
    } = this.props;
    if (newTaskIndex < 0 || newTaskIndex >= groupList.length) {
      return;
    }
    const groupIdsList = groupList.map(group => group.taskGroupIdentifier);
    const newGroupList = arrayMove(groupIdsList, oldTaskIndex, newTaskIndex);
    taskGroupActions.sortTaskGroups(newGroupList, taskListIdentifier);
  };

  render() {
    const {
      taskGroupActions,
      members,
      tasklists,
      taskListMembers,
      pendingTasklists,
      membersNotInTaskList,
      routeParams,
      megaFilter: { selectedFilters },
      routeParams: { listName, taskListIdentifier },
    } = this.props;

    const allTaskLists = [...(pendingTasklists ?? []), ...(tasklists ?? [])];

    const loadedTasklist = allTaskLists.find(
      t => t.taskListIdentifier === taskListIdentifier,
    );

    const isSpecialList = [ASSIGNED_BY_ME, ASSIGNED_TO_ME].includes(listName);

    const taskViewProps = {
      members,
      refreshTab: this.refreshTab,
      downloadPDF: this.downloadPDF,
      navigateToTab: this.navigateToTab,
      createListGroup: groupName =>
        taskGroupActions.createTaskGroupList({ groupName, taskListIdentifier }),
      quickAddTask: this.quickAddTask,
      deleteGroup: this.deleteGroup,
      editGroupName: this.editGroupName,
      changeGroupsOrder: this.changeGroupsOrder,
      handleFilterChange: this.handleFilterChange,
      isSpecialList,
      taskList: loadedTasklist || undefined,
      taskListMembers,
      membersNotInTaskList,
      routeParams,
      hasFiltersApplied: !isEmpty(selectedFilters),
    };

    return <TasksView {...taskViewProps} defaultGroupName="New tasks" />;
  }
}

const mapStateToProps = store => ({
  tasklists: store.taskListState.tasklist,
  pendingTasklists: store.invitationState.pendingTasklists,
  members: store.taskListState.tasklistmembers,
  membersNotInTaskList: store.taskListState.orgusersnotintasklist,
  completedTasks: store.taskState.completedTasks,
  user: store.userState.user,
  taskListMembers: store.taskListState.tasklistmembers,
  megaFilter: store.megaFilter,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(TaskActions, dispatch),
  taskListActions: bindActionCreators(TaskListActions, dispatch),
  taskLabelActions: bindActionCreators(TaskLabelActions, dispatch),
  taskGroupActions: bindActionCreators(TaskGroupActions, dispatch),
  patientActions: bindActionCreators(PatientActions, dispatch),
  invitationActions: bindActionCreators(InvitationActions, dispatch),
  setHeader: setHeaderRaw(dispatch),
  modalActions: bindActionCreators(ModalActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
