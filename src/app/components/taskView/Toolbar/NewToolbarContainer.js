import { connect } from 'react-redux';
import { megaFilterSelector } from 'selectors/mega-filter-selectors';
import NewToolbar from './NewToolbar';
import { TaskListTabName } from './config';

const mapStateToProps = (state, ownProps) => {
  const {
    members,
    showMembers,
    tasks: openedTasks,
    completedTasks,
    openTasksAmount,
    completedTasksAmount,
  } = ownProps;

  const haveTasks =
    (openTasksAmount > 0 && ownProps.selectedTab === TaskListTabName.OPEN) ||
    (completedTasksAmount > 0 &&
      ownProps.selectedTab === TaskListTabName.COMPLETE);

  const tasksAndSubTasksCount = openTasksAmount;

  return {
    printData: {
      openedTasks,
      completedTasks,
      taskListMembers: members,
      showMembers,
    },
    megaFilter: megaFilterSelector(state),
    haveTasks,
    tasksAndSubTasksCount,
    ...ownProps,
  };
};

export default connect(mapStateToProps)(NewToolbar);
