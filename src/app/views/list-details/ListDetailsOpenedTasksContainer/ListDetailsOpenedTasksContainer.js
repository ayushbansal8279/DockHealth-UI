import { connect } from 'react-redux';
import {
  isFetchingGroupsSelector,
  areGroupsInitialized,
  listDetailsGroupsSelector,
} from 'selectors/list-details-selectors';
import {
  tasksIsFetchingSelector,
  groupTasksSelector,
} from 'selectors/task-selectors';
import {
  sortTasksInGroup,
  sortSubtasksInGroup,
  reassignTasksToAnotherGroup as reassignTasksToAnotherGroupAction,
} from 'sagas/list-details-saga';
import { filterTasksBySearchValue } from 'helpers/task-search-helper';
import { hasFiltersAppliedSelector } from 'selectors/mega-filter-selectors';
import ListDetailsOpenedTasks from './ListDetailsOpenedTasks';

const mapStateToProps = (state, ownProps) => {
  const { searchValue, ...restOwnProps } = ownProps;
  const areFiltersApplied = hasFiltersAppliedSelector(state);
  const groupedTasks = groupTasksSelector(state);
  const groups = listDetailsGroupsSelector(state);
  const searchedGroupsWithTasks = !searchValue
    ? groupedTasks
    : Object.keys(groupedTasks).reduce((groupObject, currentKey) => {
        const searchedTasks = filterTasksBySearchValue(
          groupedTasks[currentKey],
          searchValue,
        );

        if (searchedTasks.length === 0) return groupObject;

        return { ...groupObject, [currentKey]: searchedTasks };
      }, {});

  const searchedGroupsList = !searchValue
    ? groups
    : groups.filter(
        ({ taskGroupIdentifier, groupType }) =>
          Object.keys(searchedGroupsWithTasks).includes(taskGroupIdentifier) ||
          Object.keys(searchedGroupsWithTasks).includes(groupType),
      );

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
