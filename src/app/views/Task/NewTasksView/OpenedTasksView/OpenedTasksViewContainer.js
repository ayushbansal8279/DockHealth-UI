import { connect } from 'react-redux';
import {
  tasksGroupsIsFetchingSelector,
  tasksGroupsIsInitializedSelector,
} from 'selectors/task-group-list-selectors';
import {
  tasksIsFetchingSelector,
  searchedGroupsWithTasksSelector,
  searchedGroupsListSelector,
} from 'selectors/task-selectors';
import {
  sortTasksInGroup,
  sortSubtasksInGroup,
  reassignTasksToAnotherGroup as reassignTasksToAnotherGroupAction,
} from 'sagas/tasks-groups-list-saga';
import { hasFiltersAppliedSelector } from 'selectors/mega-filter-selectors';
import OpenedTasksView from './OpenedTasksView';

const mapStateToProps = (state, ownProps) => {
  const { searchValue, ...restOwnProps } = ownProps;
  const areFiltersApplied = hasFiltersAppliedSelector(state);
  const searchedGroupsWithTasks = searchedGroupsWithTasksSelector(state)(
    searchValue,
  );

  return {
    groupedTasks: searchedGroupsWithTasks,
    groupList: searchedGroupsListSelector(state)(
      searchValue,
      searchedGroupsWithTasks,
    ),
    areFiltersApplied,
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
