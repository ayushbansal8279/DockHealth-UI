import { connect } from 'react-redux';
import {
  completedTasksSelector,
  completedTasksIsFetchingSelector,
  completedTasksIsFetchingMoreSelector,
} from 'selectors/task-selectors';
import { pluck } from 'ramda';
import CompletedTasksView from './CompletedTasksView';

const mapStateToProps = (state, ownProps) => {
  const completedTasks = completedTasksSelector(state);
  const { searchValue, ...restOwnProps } = ownProps;

  const filteredCompletedTasks = !searchValue
    ? completedTasks
    : completedTasks.filter(
        ({ description, comments, subtasks }) =>
          description.toLowerCase().includes(searchValue.toLowerCase()) ||
          pluck('comment', comments).filter(s =>
            new RegExp(searchValue.toLowerCase(), 'ig').test(s),
          ).length > 0 ||
          pluck('description', subtasks).filter(s =>
            new RegExp(searchValue.toLowerCase(), 'ig').test(s),
          ).length > 0,
      );

  return {
    isFetchingData: completedTasksIsFetchingSelector(state),
    isFetchingMoreTasks: completedTasksIsFetchingMoreSelector(state),
    tasks: filteredCompletedTasks,
    isSearchApplied: !!searchValue,
    ...restOwnProps,
  };
};

export default connect(mapStateToProps)(CompletedTasksView);
