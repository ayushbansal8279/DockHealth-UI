import moment from 'moment';
import {
  addTaskAttachment,
  moveTask,
  saveTask,
} from '../../actions/task-actions';

export default ({
  dispatch,
  status,
  task,
  taskList,
  priorityActive,
  storeAsCurrentTask,
  deferredCommentsPromises,
  setAutoSaveVisible,
  newTaskAttachments,
}) => async data => {
  const {
    assignedToUserIdentifier,
    patientIdentifier,
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
    assignedToIdentifier: assignedToUserIdentifier,
    patientIdentifier,
    taskListIdentifier: taskList?.taskListIdentifier,
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
      await moveTask(newTask, { taskListIdentifier: newTaskListId })(dispatch);
    }

    let commentPromise = Promise.resolve();
    const addedComments = [];

    deferredCommentsPromises.forEach(deferredCommentPromise => {
      commentPromise = commentPromise.then(async () => {
        const comment = await deferredCommentPromise({
          task: { ...newTask, ...requestData },
        });

        if (comment) {
          addedComments.push(comment);
        }
      });
    });

    await commentPromise;

    let attachmentPromise = Promise.resolve();
    const addedAttachments = [];

    newTaskAttachments.forEach(newTaskAttachment => {
      attachmentPromise = attachmentPromise.then(async () => {
        const addedAttachment = await addTaskAttachment(
          newTask.taskIdentifier || requestData.taskIdentifier,
          newTaskAttachment,
          {},
        )(dispatch);

        addedAttachments.push(addedAttachment);
      });
    });

    await attachmentPromise;

    setAutoSaveVisible();

    if (!requestData.taskIdentifier) {
      storeAsCurrentTask({
        ...newTask,
        ...requestData,
        taskIdentifier: newTask.taskIdentifier || requestData.taskIdentifier,
        attachments: [...newTask.attachments, ...addedAttachments],
        comments: [...newTask.comments, ...addedComments],
      });
    }

    return true;
  } catch {
    return false;
  }
};
