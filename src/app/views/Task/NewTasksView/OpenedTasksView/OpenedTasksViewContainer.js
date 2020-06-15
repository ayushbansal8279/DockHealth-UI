import { connect } from 'react-redux';
import {
  tasksGroupsIsFetchingSelector,
  tasksGroupsIsInitializedSelector,
  tasksGroupListSelector,
} from 'selectors/task-group-list-selectors';
import {
  tasksIsFetchingSelector,
  groupTasksSelector,
} from 'selectors/task-selectors';
import {
  sortTasksInGroup,
  sortSubtasksInGroup,
  reassignTasksToAnotherGroup as reassignTasksToAnotherGroupAction,
} from 'sagas/tasks-groups-list';
import OpenedTasksView from './OpenedTasksView';

const mapStateToProps = (state, ownProps) => {
  const { searchValue, ...restOwnProps } = ownProps;
  const tasks = groupTasksSelector(state);
  const group = tasksGroupListSelector(state);
  const searchedGroupsWithTasks = !searchValue
    ? tasks
    : Object.keys(tasks).reduce((groupObject, currentKey) => {
        const filteredTasks = tasks[currentKey].filter(({ description }) =>
          description.toLowerCase().includes(searchValue.toLowerCase()),
        );

        if (filteredTasks.length === 0) return groupObject;

        return { ...groupObject, [currentKey]: filteredTasks };
      }, {});

  const searchedGroupsList = !searchValue
    ? group
    : group.filter(
        ({ taskGroupIdentifier, groupType }) =>
          Object.keys(searchedGroupsWithTasks).includes(taskGroupIdentifier) ||
          Object.keys(searchedGroupsWithTasks).includes(groupType),
      );

  return {
    groupedTasks: searchedGroupsWithTasks,
    groupList: searchedGroupsList,
    isFetchingData:
      (tasksGroupsIsFetchingSelector(state) &&
        !tasksGroupsIsInitializedSelector(state)) ||
      tasksIsFetchingSelector(state),
    isSearchApplied: !!searchValue,
    ...restOwnProps,
  };
};

const mapDispatchToProps = {
  reorderTasksInGroup: sortTasksInGroup,
  reorderSubtasksForTask: sortSubtasksInGroup,
  reassignTasksToAnotherGroup: reassignTasksToAnotherGroupAction,
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { groupList } = stateProps;
  const { changeGroupsOrder, ...restOwnProps } = ownProps;

  return {
    ...restOwnProps,
    ...stateProps,
    ...dispatchProps,
    changeGroupsOrder: (oldTaskIndex, newTaskIndex) =>
      changeGroupsOrder(oldTaskIndex, newTaskIndex, groupList),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(OpenedTasksView);
