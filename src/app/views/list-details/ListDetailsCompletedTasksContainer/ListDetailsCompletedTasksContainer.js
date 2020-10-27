import { connect } from 'react-redux';
import {
  groupCompletedTasksSelector,
  completedTasksIsFetchingSelector,
  completedTasksIsFetchingMoreSelector,
} from 'selectors/list-details-selectors';
import { hasFiltersAppliedSelector } from 'selectors/mega-filter-selectors';
import ListDetailsCompletedTasks from './ListDetailsCompletedTasks';

const mapStateToProps = (state, ownProps) => {
  const areFiltersApplied = hasFiltersAppliedSelector(state);
  const completedTasksGroup = groupCompletedTasksSelector(state);
  const { searchValue, ...restOwnProps } = ownProps;

  const completedTasks = completedTasksGroup?.tasks || [];

  const filteredCompletedTasks = completedTasks;

  return {
    isFetchingData: completedTasksIsFetchingSelector(state),
    isFetchingMoreTasks: completedTasksIsFetchingMoreSelector(state),
    areFiltersApplied,
    completedTasksGroup,
    tasks: filteredCompletedTasks,
    isSearchApplied: !!searchValue,
    ...restOwnProps,
  };
};

export default connect(mapStateToProps)(ListDetailsCompletedTasks);
