import { TASKGROUP_DEFAULT_TYPE } from 'api/task-group-list-api';

const checkIfGroupExists = (groupedTasks, groupName) => {
  if (groupedTasks[groupName]) {
    return;
  }
  // eslint-disable-next-line no-param-reassign
  groupedTasks[groupName] = [];
};

const addTaskToDefaultGroup = (groupedTasks, task) => {
  checkIfGroupExists(groupedTasks, TASKGROUP_DEFAULT_TYPE);
  groupedTasks[TASKGROUP_DEFAULT_TYPE].push(task);
};

export const groupTasksSelector = tasks => {
  if (!tasks) {
    return null;
  }
  const groupedTasks = {};

  tasks.forEach(task => {
    if (!task.taskGroup || task.taskGroups.length === 0) {
      addTaskToDefaultGroup(groupedTasks, task);
    } else {
      task.tasksGroups.forEach(taskGroup => {
        if (taskGroup.groupType !== TASKGROUP_DEFAULT_TYPE) {
          checkIfGroupExists(taskGroup.taskGroupIdentifier);
          groupedTasks.taskGroupIdentifier.push(task);
        } else {
          addTaskToDefaultGroup(groupedTasks, task);
        }
      });
    }
  });

  return groupedTasks;
};

export default groupTasksSelector;
