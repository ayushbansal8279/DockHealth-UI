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

export default {
  updateTaskOrSubtask,
};
