import Grid from '@material-ui/core/Grid';
import { isEmpty, memoizeWith } from 'ramda';
import React from 'react';
import { connect, useSelector } from 'react-redux';
import { useUnmount } from 'react-use';
import { bindActionCreators } from 'redux';
import * as TaskActions from '../../actions/task-actions';
import { groupTasksAndCompletedTasksByList } from '../../helpers/group-tasks-by-list';
import TaskView from '../../views/TaskView';

const TaskListLayout = ({
  searchedTasks,
  isFetching,
  isCompletedTasksFetching,
  userIdentifier,
  taskActions,
  showingCompletedTasks,
  searchPerformed,
  onFilter,
  onCompletedTasksRequest,
  isSearching = false,
  globalSearch = false,
  showToolbar = true,
  paneled = false,
}) => {
  const selectedTaskId = useSelector(
    store => store.taskState.selectedTask?.taskIdentifier,
  );

  const lists = groupTasksAndCompletedTasksByList(
    searchedTasks.tasks,
    searchedTasks.completedTasks,
  );

  const taskViewProps = {
    userIdentifier,
    tasks: searchedTasks.tasks,
    completedTasks: searchedTasks.completedTasks,
    isFetching,
    isCompletedTasksFetching,
    showingCompletedTasks,
    markComplete: taskActions.markComplete,
    selectedTaskId,
    storeAsCurrentTask: taskActions.storeAsCurrentTask,
    markAsUnread: taskActions.markAsUnread,
    addTaskComment: taskActions.addTaskComment,
    toggleTaskPriority: (task, priority) =>
      taskActions.toggleTaskPriority(task, userIdentifier, priority),
    showToolbar,
    showAddTaskButton: false,
    isSearching,
    isMultiList: true,
    isSpecificPatient: false,
    showListHeadings: false,
    paneled,
    onFilter,
    onCompletedTasksRequest: onCompletedTasksRequest
      ? memoizeWith(
          (...arguments_) => arguments_.join('-'),
          onCompletedTasksRequest,
        )
      : onCompletedTasksRequest,
    globalSearch,
  };

  if (searchPerformed) {
    return !isFetching && !isSearching && isEmpty(lists) ? (
      <Grid container justify="center">
        <b>No matching tasks</b>
      </Grid>
    ) : (
      <TaskView {...taskViewProps} />
    );
  }
  return '';
};

const TaskListSearchContainer = ({
  userIdentifier,
  tasks,
  completedTasks,
  isFetching,
  isCompletedTasksFetching,
  taskActions,
  showingCompletedTasks,
  searchPerformed,
  onFilter,
  onCompletedTasksRequest,
  globalSearch = false,
  isSearching = false,
  showToolbar = true,
  paneled = false,
}) => {
  useUnmount(() => {
    taskActions.resetTaskSearch();
  });

  const searchedTasks = {
    tasks,
    completedTasks,
  };

  const taskListProps = {
    searchedTasks,
    isFetching,
    isSearching,
    isCompletedTasksFetching,
    userIdentifier,
    taskActions,
    showingCompletedTasks,
    searchPerformed,
    onFilter,
    onCompletedTasksRequest,
    globalSearch,
    showToolbar,
    paneled,
  };

  return <TaskListLayout {...taskListProps} />;
};

function mapStateToProps(state) {
  return {
    tasklists: state.taskListState.tasklist,
    tasks: state.taskState.tasks,
    completedTasks: state.taskState.completedTasks,
    isFetching: state.taskState.isFetching,
    isCompletedTasksFetching: state.taskState.isCompletedTasksFetching,
    showingCompletedTasks: state.taskState.showingCompletedTasks,
    user: state.userState.user,
    userIdentifier: state.userState.userProfile.userIdentifier,
    selectedTaskId: state.taskState.selectedTaskId,
    selectedTask: state.taskState.selectedTask,
    currentTaskHistory: state.taskState.currentTaskHistory,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    taskActions: bindActionCreators(TaskActions, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TaskListSearchContainer);
