/* eslint-disable unicorn/no-nested-ternary */
import { connect } from 'react-redux';
import { megaFilterSelector } from 'selectors/mega-filter-selectors';
import { isEmpty } from 'ramda';
import NewToolbar from './NewToolbar';
import { TaskListTabName } from './config';

const determineTaskCounts = ({
  selectedFilters,
  isFetching,
  tasks,
  tasksCount,
  status,
}) => {
  return selectedFilters && !isEmpty(selectedFilters) && !isFetching
    ? tasks?.reduce(
        (counter, task) =>
          counter + task.subtasks?.filter(x => x.status === status).length + 1,
        0,
      ) || 0
    : tasksCount;
};

const mapStateToProps = (state, ownProps) => {
  const {
    members,
    showMembers,
    tasks: openedTasks,
    completedTasks,
    openTasksAmount,
    completedTasksAmount,
    selectedFilters,
    isFetching,
  } = ownProps;

  const haveTasks =
    (openTasksAmount > 0 && ownProps.selectedTab === TaskListTabName.OPEN) ||
    (completedTasksAmount > 0 &&
      ownProps.selectedTab === TaskListTabName.COMPLETE);

  const tasksAndSubTasksCount =
    ownProps.selectedTab === TaskListTabName.OPEN
      ? determineTaskCounts({
          selectedFilters,
          isFetching,
          tasks: openedTasks,
          tasksCount: openTasksAmount,
          status: 'INCOMPLETE',
        })
      : determineTaskCounts({
          selectedFilters,
          isFetching,
          tasks: completedTasks,
          tasksCount: completedTasksAmount,
          status: 'COMPLETE',
        });

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
