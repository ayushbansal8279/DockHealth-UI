export const DEFAULT_TASK_GROUP_NAME = 'default';

const checkIfGroupExists = (groupedTasks, groupName) => {
  if (groupedTasks[groupName]) {
    return;
  }
  // eslint-disable-next-line no-param-reassign
  groupedTasks[groupName] = [];
};

const addTaskToDefaultGroup = (groupedTasks, task) => {
  checkIfGroupExists(groupedTasks, DEFAULT_TASK_GROUP_NAME);
  groupedTasks.default.push(task);
};

const groupTasksByGroupId = tasks => {
  const groupedTasks = {};

  tasks.forEach(task => {
    if (task.taskGroups.length === 0) {
      addTaskToDefaultGroup(groupedTasks, task);
    } else {
      task.tasksGroups.forEach(taskGroup => {
        if (taskGroup.taskGroupIdentifier) {
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

export default groupTasksByGroupId;
