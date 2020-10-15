import { connect } from 'react-redux';
import { megaFilterSelector } from 'selectors/mega-filter-selectors';
import NewToolbar from './NewToolbar';
import { TaskListTabName } from './config';

const mapStateToProps = (state, ownProps) => {
  const {
    members,
    showMembers,
    selectedTab,
    tasks: propertyTasks,
    completedTasks: propertyCompletedTasks,
  } = ownProps;
  const completedTasks =
    selectedTab === TaskListTabName.COMPLETE ? propertyCompletedTasks : [];
  const openedTasks = selectedTab === TaskListTabName.OPEN ? propertyTasks : [];

  const haveTasks =
    (openedTasks &&
      openedTasks.length > 0 &&
      ownProps.selectedTab === TaskListTabName.OPEN) ||
    (completedTasks &&
      completedTasks.length > 0 &&
      ownProps.selectedTab === TaskListTabName.COMPLETE);

  const tasksAndSubTasksCount =
    ownProps.selectedTab === TaskListTabName.OPEN
      ? openedTasks?.reduce(
          (counter, task) =>
            counter +
            task.subtasks?.filter(x => x.status === 'INCOMPLETE').length +
            1,
          0,
        ) || 0
      : completedTasks?.reduce(
          (counter, task) =>
            counter +
            task.subtasks?.filter(x => x.status === 'COMPLETE').length +
            1,
          0,
        ) || 0;

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
