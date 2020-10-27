import { connect } from 'react-redux';
import {
  isFetchingGroupsSelector,
  areGroupsInitialized,
  listDetailsGroupsSelector,
  tasksIsFetchingSelector,
  groupTasksSelector,
} from 'selectors/list-details-selectors';
import {
  sortTasksInGroup,
  sortSubtasksInGroup,
  reassignTasksToAnotherGroup as reassignTasksToAnotherGroupAction,
} from 'sagas/list-details-saga';
import { hasFiltersAppliedSelector } from 'selectors/mega-filter-selectors';
import ListDetailsOpenedTasks from './ListDetailsOpenedTasks';

const mapStateToProps = (state, ownProps) => {
  const { searchValue, ...restOwnProps } = ownProps;
  const areFiltersApplied = hasFiltersAppliedSelector(state);
  const groupedTasks = groupTasksSelector(state);
  const groups = listDetailsGroupsSelector(state);

  const searchedGroupsWithTasks = groupedTasks;

  const searchedGroupsList = groups;

  return {
    groupedTasks: searchedGroupsWithTasks,
    groupList: searchedGroupsList,
    areFiltersApplied,
    isFetchingData:
      (isFetchingGroupsSelector(state) && !areGroupsInitialized(state)) ||
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
)(ListDetailsOpenedTasks);
