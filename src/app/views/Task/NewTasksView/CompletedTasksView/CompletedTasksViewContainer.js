import { connect } from 'react-redux';
import {
  completedTasksSelector,
  completedTasksIsFetchingSelector,
  completedTasksIsFetchingMoreSelector,
} from 'selectors/task-selectors';
import { hasFiltersAppliedSelector } from 'selectors/mega-filter-selectors';
import CompletedTasksView from './CompletedTasksView';

const mapStateToProps = (state, ownProps) => {
  const areFiltersApplied = hasFiltersAppliedSelector(state);
  const completedTasks = completedTasksSelector(state);
  const { searchValue, ...restOwnProps } = ownProps;

  const filteredCompletedTasks = !searchValue
    ? completedTasks
    : completedTasks.filter(({ description }) =>
        description.toLowerCase().includes(searchValue.toLowerCase()),
      );

  return {
    isFetchingData: completedTasksIsFetchingSelector(state),
    isFetchingMoreTasks: completedTasksIsFetchingMoreSelector(state),
    areFiltersApplied,
    tasks: filteredCompletedTasks,
    isSearchApplied: !!searchValue,
    ...restOwnProps,
  };
};

export default connect(mapStateToProps)(CompletedTasksView);
