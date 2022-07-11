import { connect } from 'react-redux';
import {
  isFetchingGroupsSelector,
  areGroupsInitialized,
  listDetailsGroupsSelector,
  groupTasksSelector,
} from 'selectors/list-details-selectors';
import { hasFiltersAppliedSelector } from 'selectors/mega-filter-selectors';
import ListDetailsTasks from './ListDetailsTasks';

const mapStateToProps = (state, ownProps) => {
  const { searchValue, ...restOwnProps } = ownProps;
  const areFiltersApplied = hasFiltersAppliedSelector(state);
  const groupedTasks = groupTasksSelector(state);
  const groups = listDetailsGroupsSelector(state);

  return {
    groupedTasks,
    groupList: groups,
    areFiltersApplied,
    isFetchingData:
      isFetchingGroupsSelector(state) && !areGroupsInitialized(state),
    isSearchApplied: !!searchValue,
    ...restOwnProps,
  };
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

export default connect(mapStateToProps, null, mergeProps)(ListDetailsTasks);
