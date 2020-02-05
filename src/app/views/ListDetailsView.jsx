import always from 'ramda/es/always';
import cond from 'ramda/es/cond';
import equals from 'ramda/es/equals';
import T from 'ramda/es/T';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as PatientActions from '../actions/patient-actions';
import * as TaskActions from '../actions/task-actions';
import * as TaskListActions from '../actions/tasklist-actions';
import * as userApi from '../api/user-api';
import { noop } from '../helpers/utility-functions';
import TaskView from './TaskView';

const ASSIGNED_BY_ME = 'assigned_by_me';
const ASSIGNED_TO_ME = 'assigned_to_me';

class Home extends PureComponent {
  componentDidMount() {
    const { user, routeParams, actions, taskListActions } = this.props;

    this.refreshAccessToken(user);
    actions.loading();

    const { filterBy, listName } = routeParams;
    let { taskStatus } = routeParams;
    let sortBy;

    if (!taskStatus) {
      taskStatus = 'INCOMPLETE';
    }

    if (filterBy) {
      sortBy = 'CREATED_DT';
    }

    const taskAction = cond([
      [equals(ASSIGNED_BY_ME), always(actions.getTasksAssignedByMe)],
      [equals(ASSIGNED_TO_ME), always(actions.getTasksAssignedToMe)],
      [T, always(actions.getListTasks)],
    ])(listName);

    const handleRetryTaskAction = error => {
      this.handleRetry(error, () => {
        taskAction(undefined, sortBy, filterBy, 'COMPLETE');
      });
    };

    const getAllTasks = () => {
      Promise.all([
        taskAction(routeParams.taskListId, sortBy, filterBy, 'INCOMPLETE'),
        taskAction(routeParams.taskListId, sortBy, filterBy, 'COMPLETE'),
      ]).catch(error => {
        this.handleRetry(error, getAllTasks);
      });
    };

    getAllTasks();

    if (listName !== ASSIGNED_BY_ME && listName !== ASSIGNED_TO_ME) {
      taskListActions
        .getTaskListById(routeParams.taskListId)
        .then(noop)
        .catch(handleRetryTaskAction);

      if (routeParams.taskListId) {
        taskListActions
          .getMembersByTaskListId(routeParams.taskListId, 'ALL')
          .then(noop)
          .catch(error => {
            this.handleRetry(error, () => {
              taskListActions.getMembersByTaskListId(
                routeParams.taskListId,
                'ALL',
              );
            });
          });
      }

      taskListActions
        .getOrganizationUsersNotInTaskList(routeParams.taskListId)
        .then(noop)
        .catch(error => {
          this.handleRetry(error, () => {
            taskListActions.getOrganizationUsersNotInTaskList(
              routeParams.taskListId,
            );
          });
        });
    }
  }

  componentWillUpdate(nextProps) {
    const { routeParams } = this.props;

    if (nextProps.routeParams.listName !== routeParams.listName) {
      const { actions, taskListActions } = this.props;
      const { listName } = nextProps.routeParams;

      actions.loading();
      if (listName != null && nextProps.routeParams.taskListId != null) {
        taskListActions.getTaskListById(nextProps.routeParams.taskListId);
        actions.getListTasks(
          nextProps.routeParams.taskListId,
          undefined,
          undefined,
          'INCOMPLETE',
        );
        if (nextProps.routeParams.taskListId) {
          taskListActions.getMembersByTaskListId(
            nextProps.routeParams.taskListId,
            'ALL',
          );
        }
        taskListActions.getOrganizationUsersNotInTaskList(
          nextProps.routeParams.taskListId,
        );

        // Start with no selected tasks
        actions.storeAsCurrentTask(null);
      }
    }
  }

  refresh = () => {
    const {
      actions,
      routeParams,
      taskListActions,
      patientActions,
    } = this.props;

    actions.loading();
    actions.getListTasks(
      routeParams.taskListId,
      undefined,
      undefined,
      'INCOMPLETE',
    );
    if (routeParams.taskListId) {
      taskListActions.getMembersByTaskListId(routeParams.taskListId, 'ALL');
    }
    taskListActions.getOrganizationUsersNotInTaskList(routeParams.taskListId);
    patientActions.getAllPatients();
  };

  downloadPDF = () => {
    const {
      routeParams: { taskListId },
    } = this.props;

    if (taskListId) {
      window.print();
    }
  };

  handleFilterChange = (filterBy, sortBy) => {
    const {
      actions,
      routeParams: { listName, taskListId },
    } = this.props;

    actions.loading();

    if (listName === ASSIGNED_BY_ME) {
      actions
        .getTasksAssignedByMe(undefined, sortBy, filterBy, 'INCOMPLETE')
        .then(noop)
        .catch(error => {
          this.handleRetry(error, () => {
            actions.getTasksAssignedByMe(
              undefined,
              sortBy,
              filterBy,
              'INCOMPLETE',
            );
          });
        });
      actions
        .getTasksAssignedByMe(undefined, sortBy, filterBy, 'COMPLETE')
        .then(noop)
        .catch(error => {
          this.handleRetry(error, () => {
            actions.getTasksAssignedByMe(
              undefined,
              sortBy,
              filterBy,
              'COMPLETE',
            );
          });
        });
    } else if (listName === ASSIGNED_TO_ME) {
      actions
        .getTasksAssignedToMe(undefined, sortBy, filterBy, 'INCOMPLETE')
        .then(noop)
        .catch(error => {
          this.handleRetry(error, () => {
            actions.getTasksAssignedToMe(
              undefined,
              sortBy,
              filterBy,
              'INCOMPLETE',
            );
          });
        });
      actions
        .getTasksAssignedToMe(undefined, sortBy, filterBy, 'COMPLETE')
        .then(noop)
        .catch(error => {
          this.handleRetry(error, () => {
            actions.getTasksAssignedToMe(
              undefined,
              sortBy,
              filterBy,
              'COMPLETE',
            );
          });
        });
    } else {
      actions
        .getListTasks(taskListId, sortBy, filterBy, 'INCOMPLETE')
        .then(noop)
        .catch(error => {
          this.handleRetry(error, () => {
            actions.getListTasks(taskListId, sortBy, filterBy, 'INCOMPLETE');
          });
        });
      actions
        .getListTasks(taskListId, sortBy, filterBy, 'COMPLETE')
        .then(noop)
        .catch(error => {
          this.handleRetry(error, () => {
            actions.getListTasks(taskListId, sortBy, filterBy, 'COMPLETE');
          });
        });
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

  handleSearch = () => {};

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

  render() {
    const {
      userId,
      members,
      tasks,
      completedTasks,
      isFetching,
      isCompletedTasksFetching,
      showingCompletedTasks,
      selectedTaskId,
      actions: {
        markComplete,
        storeAsCurrentTask,
        markAsUnread,
        refreshTask,
        toggleTaskPriority,
        addTaskComment,
      },
      tasklists,
      routeParams: { listName, taskListId, filterBy },
    } = this.props;

    const loadedTasklist = tasklists.find(
      t => `${t.taskListId}` === taskListId,
    );

    let isMultiList = false;
    let title = loadedTasklist ? loadedTasklist.listName : 'Loading...';

    let filterByDescription = '';
    if (filterBy === 'FLAGGED') {
      filterByDescription = 'Flagged';
    } else if (filterBy === 'OVERDUE') {
      filterByDescription = 'Overdue';
    } else if (filterBy === 'DUE_TODAY') {
      filterByDescription = 'Due Today';
    } else if (filterBy === 'DUE_THIS_WEEK') {
      filterByDescription = 'Due This Week';
    }

    if (listName === ASSIGNED_BY_ME) {
      title = `Assigned by me${
        filterByDescription !== '' ? ` (${filterByDescription})` : ''
      }`;
      isMultiList = true;
    } else if (listName === ASSIGNED_TO_ME) {
      title = `Assigned to me${
        filterByDescription !== '' ? ` (${filterByDescription})` : ''
      }`;
      isMultiList = true;
    }

    const taskViewProps = {
      userId,
      members,
      tasks,
      completedTasks,
      isFetching,
      isCompletedTasksFetching,
      showingCompletedTasks,
      markComplete,
      selectedTaskId,
      storeAsCurrentTask,
      markAsUnread,
      refreshTask,
      addTaskComment,
      toggleTaskPriority: (task, priority) =>
        toggleTaskPriority(task, userId, priority),
      onFilter: this.handleFilterChange,
      refresh: this.refresh,
      downloadPDF: this.downloadPDF,
      title,
      showToolbar: true,
      taskList: loadedTasklist || undefined,
      isMultiList,
      taskListId,
      listName,
    };

    return <TaskView {...taskViewProps} />;
  }
}

const mapStateToProps = store => ({
  tasklists: store.taskListState.tasklist,
  members: store.taskListState.tasklistmembers,
  tasks: store.taskState.tasks,
  completedTasks: store.taskState.completedTasks,
  isFetching: store.taskState.isFetching,
  isCompletedTasksFetching: store.taskState.isCompletedTasksFetching,
  showingCompletedTasks: store.taskState.showingCompletedTasks,
  user: store.userState.user,
  userId: store.userState.userProfile.userId,
  selectedTaskId: store.taskState.selectedTaskId,
  currentTaskHistory: store.taskState.currentTaskHistory,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(TaskActions, dispatch),
  taskListActions: bindActionCreators(TaskListActions, dispatch),
  patientActions: bindActionCreators(PatientActions, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Home);
