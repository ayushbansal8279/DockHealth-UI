import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as PatientActions from '../actions/patient-actions';
import * as TaskActions from '../actions/task-actions';
import * as TaskListActions from '../actions/tasklist-actions';
import { downloadPDF } from '../api/tasklist-api';
import * as userApi from '../api/user-api';
import TaskView from './TaskView';

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
      routeParams: { taskListId },
    } = this.props;

    if (taskListId) {
      downloadPDF(taskListId);
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
    const systemTimeout = 5 * 60 * 1000;

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
        .then(() => {
          console.log('refreshed tokens');
        })
        .catch(e => {
          console.log(e);
        });
      // set again
      comp.refreshAccessToken(user);
    }, systemTimeout);

    sessionStorage.setItem(
      'refreshAccessTokenTimeoutId',
      refreshAccessTokenTimeoutId,
    );
  }

  render() {
    const {
      userId,
      tasks,
      completedTasks,
      isFetching,
      isCompletedTasksFetching,
      showingCompletedTasks,
      selectedTaskId,
      actions: {
        markComplete,
        storeAsCurrentTask,
        toggleTaskPriority,
        addTaskComment,
      },
    } = this.props;

    const taskViewProps = {
      userId,
      tasks,
      completedTasks,
      isFetching,
      isCompletedTasksFetching,
      showingCompletedTasks,
      markComplete,
      selectedTaskId,
      storeAsCurrentTask,
      addTaskComment,
      toggleTaskPriority: (task, priority) =>
        toggleTaskPriority(task, userId, priority),
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
)(AssignedToMe);
