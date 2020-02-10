import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as PatientActions from '../actions/patient-actions';
import * as TaskActions from '../actions/task-actions';
import * as TaskListActions from '../actions/tasklist-actions';
import { downloadPDF } from '../api/tasklist-api';
import * as userApi from '../api/user-api';
import TaskView from './TaskView';
import { noop } from '../helpers/utility-functions';

class AssignedToMe extends PureComponent {
  componentDidMount() {
    const { user, actions } = this.props;

    this.refreshAccessToken(user);
    actions.loading();
    actions.getTasksAssignedToMe(undefined, undefined, undefined, 'INCOMPLETE');
  }

  componentWillUpdate(nextProps) {
    const { routeParams } = this.props;

    if (nextProps.routeParams.listName !== routeParams.listName) {
      const { actions } = this.props;

      actions.loading();
      actions.getTasksAssignedToMe(
        undefined,
        undefined,
        undefined,
        'INCOMPLETE',
      );
    }
  }

  refresh = () => {
    const { actions, patientActions } = this.props;

    actions.loading();
    actions.getTasksAssignedToMe(undefined, undefined, undefined, 'INCOMPLETE');
    patientActions.getAllPatients();
  };

  pullCompletedTasks = () => {
    const { showingCompletedTasks, actions } = this.props;

    if (!showingCompletedTasks) {
      actions.loadingCompletedTasks();
      actions.getTasksAssignedToMe(undefined, undefined, undefined, 'COMPLETE');
    } else {
      actions.hideCompletedTasks();
    }
  };

  closeAuditHistory = () => {
    const { actions } = this.props;
    actions.storeAsCurrentTask(null);
    // actions.clearCurrentTaskHistory();
  };

  downloadPDF = () => {
    const {
      routeParams: { taskListIdentifier },
    } = this.props;

    if (taskListIdentifier) {
      downloadPDF(taskListIdentifier);
    }
  };

  handleFilterChange = (filterBy, sortBy) => {
    const { actions } = this.props;

    actions.loading();
    actions.getTasksAssignedToMe(undefined, sortBy, filterBy, 'COMPLETE');
    actions.getTasksAssignedToMe(undefined, sortBy, filterBy, 'INCOMPLETE');
  };

  handleSearch = () => {};

  refreshAccessToken(user) {
    const systemTimeout = parseInt(process.env.HEALTHCHECK_INTERVAL, 10);

    if (
      sessionStorage.refreshAccessTokenTimeoutId != null ||
      sessionStorage.refreshAccessTokenTimeoutId !== undefined
    ) {
      clearTimeout(sessionStorage.refreshAccessTokenTimeoutId);
      sessionStorage.setItem('refreshAccessTokenTimeoutId', null);
    }
    const comp = this;
    const refreshAccessTokenTimeoutId = setTimeout(() => {
      userApi
        .refreshAccessToken(user.username)
        .then(noop)
        .catch(noop);
      comp.refreshAccessToken(user);
    }, systemTimeout);

    sessionStorage.setItem(
      'refreshAccessTokenTimeoutId',
      refreshAccessTokenTimeoutId,
    );
  }

  render() {
    const {
      userIdentifier,
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
        toggleTaskPriority,
        addTaskComment,
      },
    } = this.props;

    const taskViewProps = {
      userIdentifier,
      tasks,
      completedTasks,
      isFetching,
      isCompletedTasksFetching,
      showingCompletedTasks,
      markComplete,
      selectedTaskId,
      storeAsCurrentTask,
      markAsUnread,
      addTaskComment,
      toggleTaskPriority: (task, priority) =>
        toggleTaskPriority(task, userIdentifier, priority),
      pullCompletedTasks: this.pullCompletedTasks,
      onFilter: this.handleFilterChange,
      refresh: this.refresh,
      downloadPDF: this.downloadPDF,
      title: 'Assigned to me',
      showToolbar: true,
    };

    return <TaskView {...taskViewProps} />;
  }
}

const mapStateToProps = store => ({
  members: store.taskListState.tasklistmembers,
  tasks: store.taskState.tasks,
  completedTasks: store.taskState.completedTasks,
  isFetching: store.taskState.isFetching,
  isCompletedTasksFetching: store.taskState.isCompletedTasksFetching,
  showingCompletedTasks: store.taskState.showingCompletedTasks,
  user: store.userState.user,
  userIdentifier: store.userState.userProfile.userIdentifier,
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
)(AssignedToMe);
