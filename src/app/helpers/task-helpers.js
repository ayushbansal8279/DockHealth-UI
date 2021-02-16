/* eslint-disable import/prefer-default-export */
export const TaskStatus = {
  INCOMPLETE: 'INCOMPLETE',
  COMPLETE: 'COMPLETE',
};

export function isTaskTreeMemberSelected(targetTask, selectedTask) {
  if (!selectedTask) {
    return false;
  }

  const {
    taskIdentifier: selectedTaskIdentifier,
    parentTaskIdentifier: selectedTaskParentIdentifier,
  } = selectedTask;

  return (
    selectedTaskIdentifier === targetTask.taskIdentifier ||
    selectedTaskIdentifier === targetTask.parentTaskIdentifier ||
    (selectedTaskParentIdentifier &&
      (selectedTaskParentIdentifier === targetTask.taskIdentifier ||
        selectedTaskParentIdentifier === targetTask.parentTaskIdentifier))
  );
}
