import moment from 'moment';

import { moveTask, saveTask } from '../../actions/task-actions';
import { noop } from '../../helpers/utility-functions';

export default ({
  dispatch,
  status,
  task,
  taskList,
  priorityActive,
  storeAsCurrentTask,
  deferredCommentsPromises,
  setAutoSaveVisible,
}) => async data => {
  const {
    assignedToUserId,
    patientId,
    patient: unusedPatient,
    newTaskListId,
    newTaskDueDate,
    description,
    descriptionEdit,
    ...newData
  } = data;

  const requestData = {
    ...task,
    ...newData,
    description: descriptionEdit || description,
    workflowStatus: status.value,
    priority: priorityActive ? 'HIGH' : 'LOW',
    assignedToId: assignedToUserId,
    patientId,
    taskListId: taskList?.taskListId,
  };

  if (!requestData.description || requestData.description === '') {
    return false;
  }

  if (newTaskDueDate && moment(newTaskDueDate).isValid()) {
    requestData.dueDate = newTaskDueDate;
  }

  try {
    const newTask = await saveTask(requestData)(dispatch);

    if (newTaskListId) {
      await moveTask(newTask, { taskListId: newTaskListId })(dispatch);
    }

    if (!requestData.taskId) {
      storeAsCurrentTask({
        ...newTask,
        ...requestData,
        taskId: newTask.taskId || requestData.taskId,
      });
    }

    let commentPromise = Promise.resolve();

    deferredCommentsPromises.forEach(deferredCommentPromise => {
      commentPromise = commentPromise.then(async () =>
        deferredCommentPromise({ task: { ...newTask, ...requestData } }),
      );
    });

    setAutoSaveVisible();

    return true;
  } catch {
    noop();
    return false;
  }
};
