import { connect } from 'react-redux';
import {
  completedTasksSelector,
  tasksSelector,
} from 'selectors/task-selectors';
import { megaFilterSelector } from 'selectors/mega-filter-selectors';
import NewToolbar from './NewToolbar';

const mapStateToProps = (state, ownProps) => {
  const { members, showMembers } = ownProps;
  const completedTasks = completedTasksSelector(state);
  const openedTasks = tasksSelector(state);
  const haveTasks =
    (openedTasks && openedTasks.length > 0) ||
    (completedTasks && completedTasks.length > 0);

  return {
    printData: {
      openedTasks,
      completedTasks,
      taskListMembers: members,
      showMembers,
    },
    megaFilter: megaFilterSelector(state),
    haveTasks,
    ...ownProps,
  };
};

export default connect(mapStateToProps)(NewToolbar);
