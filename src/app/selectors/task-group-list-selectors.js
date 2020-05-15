import { TASKGROUP_DEFAULT_TYPE } from 'api/task-group-list-api';

const addGroupIfNotExists = (groupedTasks, groupName) => {
  if (groupedTasks[groupName]) {
    return;
  }
  // eslint-disable-next-line no-param-reassign
  groupedTasks[groupName] = [];
};

const addTaskToDefaultGroup = (groupedTasks, task) => {
  addGroupIfNotExists(groupedTasks, TASKGROUP_DEFAULT_TYPE);
  groupedTasks[TASKGROUP_DEFAULT_TYPE].push(task);
};

export const groupTasksSelector = tasks => {
  if (!tasks) {
    return {};
  }
  const groupedTasks = {};

  tasks.forEach(task => {
    if (!task.taskGroups || task.taskGroups.length === 0) {
      addTaskToDefaultGroup(groupedTasks, task);
    } else {
      task.taskGroups.forEach(taskGroup => {
        if (taskGroup.groupType !== TASKGROUP_DEFAULT_TYPE) {
          addGroupIfNotExists(groupedTasks, taskGroup.taskGroupIdentifier);
          groupedTasks[taskGroup.taskGroupIdentifier].push(task);
        } else {
          addTaskToDefaultGroup(groupedTasks, task);
        }
      });
    }
  });

  return groupedTasks;
};

export default groupTasksSelector;
