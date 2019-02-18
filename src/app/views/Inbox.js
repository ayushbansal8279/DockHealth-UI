import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import TaskView from './TaskView';
import * as TaskActions from '../actions/task-actions';
import * as TaskListActions from '../actions/tasklist-actions';
import * as PatientActions from '../actions/patient-actions';
import * as userApi from '../api/user-api';
import { downloadPDF } from '../api/tasklist-api';

class Inbox extends React.Component {
  componentDidMount() {
    const {
      user, actions,
    } = this.props;

    this.refreshAccessToken(user);
    actions.loading();
    actions.getInboxTasks('INCOMPLETE');
  }

  componentWillUpdate(nextProps) {
    const { routeParams } = this.props;

    if (nextProps.routeParams.listName !== routeParams.listName) {
      const { actions } = this.props;

      actions.loading();
      actions.getInboxTasks('INCOMPLETE');
    }
  }

  refresh = () => {
    const {
      actions,
      patientActions,
    } = this.props;

    actions.loading();
    actions.getInboxTasks('INCOMPLETE');
    patientActions.getAllPatients();
  }

  pullCompletedTasks = () => {
    const { showingCompletedTasks, actions } = this.props;

    if (!showingCompletedTasks) {
      actions.loadingCompletedTasks();
      actions.getInboxTasks('COMPLETE');
    } else {
      actions.hideCompletedTasks();
    }
  }

  downloadPDF = () => {
    const { routeParams: { taskListId } } = this.props;

    if (taskListId) {
      downloadPDF(taskListId);
    }
  }

  filter = (filterBy, sortBy) => {
    const { actions } = this.props;

    actions.loading();
    actions.getInboxTasks('COMPLETE', sortBy, filterBy);
    actions.getInboxTasks('INCOMPLETE', sortBy, filterBy);
  }

  refreshAccessToken(user) {
    const systemTimeout = 5 * 60 * 1000;

    if (sessionStorage.refreshAccessTokenTimeoutId != null
      || sessionStorage.refreshAccessTokenTimeoutId !== undefined) {
      clearTimeout(sessionStorage.refreshAccessTokenTimeoutId);
      sessionStorage.setItem('refreshAccessTokenTimeoutId', null);
    }
    const comp = this;
    const refreshAccessTokenTimeoutId = setTimeout(() => {
      userApi.refreshAccessToken(user.username)
        .then(() => {
          console.log('refreshed tokens');
        })
        .catch((e) => {
          console.log(e);
        });
      // set again
      comp.refreshAccessToken(user);
    }, systemTimeout);

    sessionStorage.setItem('refreshAccessTokenTimeoutId', refreshAccessTokenTimeoutId);
  }

  render() {
    const {
      user,
      tasks,
      completedTasks,
      isFetching,
      isCompletedTasksFetching,
      showingCompletedTasks,
      selectedTaskId,
      actions: { markComplete, storeAsCurrentTask, toggleTaskPriority },
    } = this.props;

    const taskViewProps = {
      tasks,
      completedTasks,
      isFetching,
      isCompletedTasksFetching,
      showingCompletedTasks,
      markComplete,
      selectedTaskId,
      storeAsCurrentTask,
      toggleTaskPriority: (task, priority) => toggleTaskPriority(task, user.userId, priority),
      pullCompletedTasks: this.pullCompletedTasks,
      onFilter: this.filter,
      refresh: this.refresh,
      downloadPDF: this.downloadPDF,
      title: 'Inbox',
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
  selectedTaskId: store.taskState.selectedTaskId,
  currentTaskHistory: store.taskState.currentTaskHistory,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(TaskActions, dispatch),
  taskListActions: bindActionCreators(TaskListActions, dispatch),
  patientActions: bindActionCreators(PatientActions, dispatch),
});


export default connect(mapStateToProps, mapDispatchToProps)(Inbox);
