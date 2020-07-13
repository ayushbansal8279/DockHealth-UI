export const checkIfTasksHaveSubtasksOrCommnets = tasks => {
  if (tasks?.length === 0) return false;

  return tasks.find(({ subtasks, comments }) => {
    if (comments?.length > 0) return true;

    if (subtasks?.length > 0) return true;

    return subtasks?.find(
      ({ comments: subtaskComments }) => subtaskComments?.length > 0,
    );
  });
};

export default checkIfTasksHaveSubtasksOrCommnets;
