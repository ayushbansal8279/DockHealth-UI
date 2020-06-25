import moment from 'moment';
import { isEmpty } from 'ramda';
import { getPatientName } from 'helpers/utility-functions';
import { getWorkflowStatusConfig } from 'views/Task/NewTasksView/TaskItem/TaskItemStatus';

const getDueDateData = ({ dueDate }) => {
  const dueDateMoment = moment(dueDate ?? null);
  const dueDateLabel = dueDateMoment.isValid()
    ? dueDateMoment.format('ddd, MMM D')
    : '';
  const isOverdue =
    dueDateMoment.isValid() &&
    moment()
      .set({ hours: 0, minutes: 0, seconds: 0 })
      .isAfter(dueDateMoment);

  return {
    dueDateLabel,
    isOverdue,
  };
};

const getPdfTaskData = props => {
  const {
    comments,
    subtasks,
    createdDateTime,
    updatedDateTime,
    status,
    priority,
    assignedTo,
    attachments,
    patient,
    dueDate,
    workflowStatus,
    parentTaskIdentifier,
    taskListMembers,
    completedBy,
    completedDt,
    taskList,
  } = props;

  const isComplete = status === 'COMPLETE';
  const isHighPriority = priority === 'HIGH';
  const isEdited = createdDateTime !== updatedDateTime && updatedDateTime;
  const hasAttachments = attachments?.length > 0;
  const isSubtask = Boolean(parentTaskIdentifier);
  const listName = taskList?.listName;

  const mainContainerWidth = isSubtask ? 218 : 230;

  const {
    color: workflowStatusColor,
    label: workflowStatusLabel,
  } = getWorkflowStatusConfig(workflowStatus);

  const assignedMemberColor =
    (taskListMembers ?? []).find(
      ({ userIdentifier }) => userIdentifier === assignedTo?.userIdentifier,
    )?.bubbleColor ?? null;

  const completedName = `${completedBy?.firstName?.charAt(0)?.toUpperCase() ??
    ''}. ${completedBy?.lastName ?? ''}`
    .trim()
    .replace(/^\.$/, '');

  const completedDateMoment = moment(completedDt ?? null);

  const completedDateLabel = completedDateMoment.isValid()
    ? completedDateMoment.format('MM/DD/YYYY')
    : '';

  const completedByLabel =
    completedName && completedDateLabel
      ? `Completed by ${completedName} on ${completedDateLabel}`
      : '';

  const bottomLabelsArray = [
    isEmpty(subtasks) && `${subtasks.length} subtasks`,
    isEmpty(comments) && `${comments.length} comments`,
  ].filter(Boolean);

  const bottomLabel = bottomLabelsArray.join(' | ');

  const patientName = getPatientName(patient);

  const { dueDateLabel, isOverdue } = getDueDateData({ dueDate });

  return {
    isSubtask,
    isComplete,
    isHighPriority,
    isEdited,
    hasAttachments,
    mainContainerWidth,
    assignedMemberColor,
    bottomLabel,
    patientName,
    dueDateLabel,
    isOverdue,
    completedByLabel,
    workflowStatusColor,
    workflowStatusLabel,
    listName,
  };
};

export default getPdfTaskData;
