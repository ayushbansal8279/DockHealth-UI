import always from 'ramda/es/always';
import cond from 'ramda/es/cond';
import equals from 'ramda/es/equals';
import T from 'ramda/es/T';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as InvitationActions from '../actions/invitation-actions';
import * as PatientActions from '../actions/patient-actions';
import * as TaskActions from '../actions/task-actions';
import * as TaskListActions from '../actions/tasklist-actions';
import * as userApi from '../api/user-api';
import { noop } from '../helpers/utility-functions';
import TaskView from './TaskView';

const ASSIGNED_BY_ME = 'assigned_by_me';
const ASSIGNED_TO_ME = 'assigned_to_me';

class Home extends Component {
  state = {
    preSelectedTask: null,
  };

  async componentDidMount() {
    const {
      user,
      routeParams,
      actions,
      taskListActions,
      invitationActions,
    } = this.props;

    await invitationActions.findPendingTaskListsForUser();

    const { pendingTasklists } = this.props;

    await Promise.all(
      pendingTasklists.map(tasklist =>
        invitationActions.acceptInviteToTaskList(tasklist),
      ),
    );

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

    const getAllTasks = async () => {
      await Promise.all([
        taskAction(
          routeParams.taskListIdentifier,
          sortBy,
          filterBy,
          'INCOMPLETE',
        ),

        taskAction(
          routeParams.taskListIdentifier,
          sortBy,
          filterBy,
          'COMPLETE',
        ),
      ]);

      const {
        tasks,
        completedTasks,
        routeParams: { taskIdentifier: preSelectedTaskIdentifier },
      } = this.props;

      const incompleteTasksWithSubtasks = [
        ...tasks,
        ...tasks.flatMap(({ subtasks }) => subtasks ?? []),
      ];

      const incompletePreselectedTask = incompleteTasksWithSubtasks.find(
        ({ taskIdentifier }) => preSelectedTaskIdentifier === taskIdentifier,
      );

      if (incompletePreselectedTask) {
        this.setState({
          preSelectedTask: incompletePreselectedTask,
        });
      } else {
        const completeTasksWithSubtasks = [
          ...completedTasks,
          ...completedTasks.flatMap(({ subtasks }) => subtasks ?? []),
        ];

        const completePreselectedTask = completeTasksWithSubtasks.find(
          ({ taskIdentifier }) => preSelectedTaskIdentifier === taskIdentifier,
        );

        this.setState({
          preSelectedTask: completePreselectedTask ?? null,
        });
      }
    };

    if (listName !== ASSIGNED_BY_ME && listName !== ASSIGNED_TO_ME) {
      getAllTasks().then(() => {
        taskListActions.getTaskListById(routeParams.taskListIdentifier);

        if (routeParams.taskListIdentifier) {
          taskListActions
            .getMembersByTaskListId(routeParams.taskListIdentifier, 'ALL')
            .then(noop);
        }

        taskListActions
          .getOrganizationUsersNotInTaskList(routeParams.taskListIdentifier)
          .then(noop);
      });
    }
  }

  componentWillUpdate(nextProps) {
    const { routeParams } = this.props;

    if (nextProps.routeParams.listName !== routeParams.listName) {
      const { actions, taskListActions } = this.props;
      const { listName } = nextProps.routeParams;

      actions.loading();

      if (
        listName != null &&
        nextProps.routeParams.taskListIdentifier != null
      ) {
        taskListActions.getTaskListById(
          nextProps.routeParams.taskListIdentifier,
        );
        actions.getListTasks(
          nextProps.routeParams.taskListIdentifier,
          undefined,
          undefined,
          'INCOMPLETE',
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

  refresh = () => {
    const {
      actions,
      routeParams,
      taskListActions,
      patientActions,
    } = this.props;

    actions.loading();
    actions.getListTasks(
      routeParams.taskListIdentifier,
      undefined,
      undefined,
      'INCOMPLETE',
    );

    if (routeParams.taskListIdentifier) {
      taskListActions.getMembersByTaskListId(
        routeParams.taskListIdentifier,
        'ALL',
      );
    }

    taskListActions.getOrganizationUsersNotInTaskList(
      routeParams.taskListIdentifier,
    );
    patientActions.getAllPatients();
  };

  downloadPDF = () => {
    const {
      routeParams: { taskListIdentifier },
    } = this.props;

    if (taskListIdentifier) {
      window.print();
    }
  };

  handleFilterChange = (filterBy, sortBy) => {
    const {
      actions,
      routeParams: { listName, taskListIdentifier },
    } = this.props;

    actions.loading();

    if (listName === ASSIGNED_BY_ME) {
      actions
        .getTasksAssignedByMe(undefined, sortBy, filterBy, 'INCOMPLETE')
        .then(noop);
      actions
        .getTasksAssignedByMe(undefined, sortBy, filterBy, 'COMPLETE')
        .then(noop);
    } else if (listName === ASSIGNED_TO_ME) {
      actions
        .getTasksAssignedToMe(undefined, sortBy, filterBy, 'INCOMPLETE')
        .then(noop);
      actions
        .getTasksAssignedToMe(undefined, sortBy, filterBy, 'COMPLETE')
        .then(noop);
    } else {
      actions
        .getListTasks(taskListIdentifier, sortBy, filterBy, 'INCOMPLETE')
        .then(noop);
      actions
        .getListTasks(taskListIdentifier, sortBy, filterBy, 'COMPLETE')
        .then(noop);
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
      userIdentifier,
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
      pendingTasklists,
      routeParams: { listName, taskListIdentifier, filterBy },
    } = this.props;

    const { preSelectedTask } = this.state;

    const allTaskLists = [...pendingTasklists, ...tasklists];

    const loadedTasklist = allTaskLists.find(
      t => t.taskListIdentifier === taskListIdentifier,
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
      userIdentifier,
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
        toggleTaskPriority(task, userIdentifier, priority),
      onFilter: this.handleFilterChange,
      refresh: this.refresh,
      downloadPDF: this.downloadPDF,
      title,
      showToolbar: true,
      taskList: loadedTasklist || undefined,
      isMultiList,
      taskListIdentifier,
      listName,
      preSelectedTask,
    };

    return <TaskView {...taskViewProps} />;
  }
}

const mapStateToProps = store => ({
  tasklists: store.taskListState.tasklist,
  pendingTasklists: store.invitationState.pendingTasklists,
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
  invitationActions: bindActionCreators(InvitationActions, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Home);
