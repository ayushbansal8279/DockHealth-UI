export const TaskListTabName = {
  OPEN: 'INCOMPLETE',
  COMPLETE: 'COMPLETE',
};

export const checkIfTasksHaveSubtasksOrComments = tasks => {
  if (tasks?.length === 0) return false;

  return tasks.find(({ subtasks, subTasksCount, comments }) => {
    if (comments?.length > 0) return true;

    if (subTasksCount > 0) return true;

    return subtasks?.find(
      ({ comments: subtaskComments }) => subtaskComments?.length > 0,
    );
  });
};
