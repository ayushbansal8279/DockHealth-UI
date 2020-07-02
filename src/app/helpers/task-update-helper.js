import moment from 'moment';

export const updateTaskOrSubtask = (tasks, taskIdentifier, newTaskData) => {
  return tasks.map(task => {
    let updatedSubtasks = [];
    if (task.subtasks?.length > 0) {
      updatedSubtasks = updateTaskOrSubtask(
        task.subtasks,
        taskIdentifier,
        newTaskData,
      );
    }
    if (taskIdentifier === task.taskIdentifier) {
      return { ...task, subtasks: updatedSubtasks, ...newTaskData };
    }
    return { ...task, subtasks: updatedSubtasks };
  });
};

export const updateTaskOrSubtaskInListsArray = (
  lists,
  newTaskData,
  taskIdentifier,
) =>
  lists.map(list => {
    const newTasks = updateTaskOrSubtask(
      list.tasks,
      taskIdentifier,
      newTaskData,
    );
    return { ...list, tasks: newTasks };
  });

export const toggleTaskPriority = task => {
  const { priority } = task;
  const newPriority =
    !priority || priority === 'NONE' || priority === 'LOW' || priority === null
      ? 'HIGH'
      : 'LOW';

  return { ...task, priority: newPriority };
};

export const toggleTaskCompletedStatus = (task, currentUser) => {
  const newStatus = task.status === 'INCOMPLETE' ? 'COMPLETE' : 'INCOMPLETE';

  return {
    ...task,
    status: newStatus,
    completedBy: newStatus === 'COMPLETE' ? currentUser : null,
    completedDt:
      newStatus === 'COMPLETE'
        ? moment().format('YYYY-MM-DDTHH:mm:ss.SSSZ')
        : null,
  };
};
