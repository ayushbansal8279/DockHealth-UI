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
  const tasks = groupTasksSelector(state);
  const group = listDetailsGroupsSelector(state);
  const searchedGroupsWithTasks = !searchValue
    ? tasks
    : Object.keys(tasks).reduce((groupObject, currentKey) => {
        const searchedTasks = filterTasksBySearchValue(
          tasks[currentKey],
          searchValue,
        );

        if (searchedTasks.length === 0) return groupObject;

        return { ...groupObject, [currentKey]: searchedTasks };
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
