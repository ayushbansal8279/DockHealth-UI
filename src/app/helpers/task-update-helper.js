import moment from 'moment';

export const TASK_DISAPPEAR_DELAY = 1000;

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

export const setWorkflowStatus = (task, workflowStatus) => {
  return {
    ...task,
    workflowStatus,
  };
};
