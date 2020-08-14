import { connect } from 'react-redux';
import {
  completedTasksSelector,
  completedTasksIsFetchingSelector,
  completedTasksIsFetchingMoreSelector,
} from 'selectors/task-selectors';
import { pluck } from 'ramda';
import { hasFiltersAppliedSelector } from 'selectors/mega-filter-selectors';
import CompletedTasksView from './CompletedTasksView';

const mapStateToProps = (state, ownProps) => {
  const areFiltersApplied = hasFiltersAppliedSelector(state);
  const completedTasks = completedTasksSelector(state);
  const { searchValue, ...restOwnProps } = ownProps;

  const filteredCompletedTasks = !searchValue
    ? completedTasks
    : completedTasks.filter(
        ({ description, comments, subtasks, patient, assignedTo }) =>
          description.toLowerCase().includes(searchValue.toLowerCase()) ||
          pluck('comment', comments).filter(s =>
            new RegExp(searchValue.toLowerCase(), 'ig').test(s),
          ).length > 0 ||
          pluck('description', subtasks).filter(s =>
            new RegExp(searchValue.toLowerCase(), 'ig').test(s),
          ).length > 0 ||
          patient?.firstName
            .toLowerCase()
            .includes(searchValue.toLowerCase()) ||
          patient?.lastName.toLowerCase().includes(searchValue.toLowerCase()) ||
          assignedTo?.firstName
            .toLowerCase()
            .includes(searchValue.toLowerCase()) ||
          assignedTo?.lastName
            .toLowerCase()
            .includes(searchValue.toLowerCase()),
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
