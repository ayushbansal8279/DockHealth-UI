import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as PatientActions from '../actions/patient-actions';
import * as TaskActions from '../actions/task-actions';
import * as TaskListActions from '../actions/tasklist-actions';
import { downloadPDF } from '../api/tasklist-api';
import * as userApi from '../api/user-api';
import { onButtonClicked } from '../helpers/ga-event-helper';
import { noop } from '../helpers/utilityFunctions';
import TaskView from './TaskView';

class Inbox extends PureComponent {
  componentDidMount() {
    const { user, actions } = this.props;

    this.refreshAccessToken(user);
    actions.loading();
    actions.getInboxTasks('INCOMPLETE');
  }

  componentWillUpdate(nextProps) {
    const { actions, routeParams } = this.props;

    if (nextProps.routeParams.listName !== routeParams.listName) {
      actions.loading();
      actions.getInboxTasks('INCOMPLETE');
    }
  }

  refresh = () => {
    const { actions, patientActions } = this.props;

    actions.loading();
    actions.getInboxTasks('INCOMPLETE');
    patientActions.getAllPatients();
  };

  pullCompletedTasks = () => {
    const { showingCompletedTasks, actions } = this.props;

    if (!showingCompletedTasks) {
      actions.loadingCompletedTasks();
      actions.getInboxTasks('COMPLETE');
    } else {
      actions.hideCompletedTasks();
    }
  };

  downloadPDF = () => {
    const {
      routeParams: { taskListId },
    } = this.props;

    if (taskListId) {
      onButtonClicked('Print');
      downloadPDF(taskListId);
    }
  };

  filter = (filterBy, sortBy) => {
    const { actions } = this.props;

    actions.loading();
    actions.getInboxTasks('COMPLETE', sortBy, filterBy);
    actions.getInboxTasks('INCOMPLETE', sortBy, filterBy);
  };

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
        markAsUnread,
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
      markAsUnread,
      addTaskComment,
      toggleTaskPriority: (task, priority) =>
        toggleTaskPriority(task, userId, priority),
      pullCompletedTasks: this.pullCompletedTasks,
      onFilter: this.filter,
      refresh: this.refresh,
      downloadPDF: this.downloadPDF,
      title: 'Inbox',
      showToolbar: true,
      showSortingStats: false,
      isInbox: true,
      taskListId: 0,
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
)(Inbox);
