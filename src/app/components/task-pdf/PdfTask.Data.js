import moment from 'moment';
import { isEmpty } from 'ramda';
import { getPatientName } from '../../helpers/utility-functions';
import { priorityColor } from '../common/Priority';

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
    creator,
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
  } = props;

  const isComplete = status === 'COMPLETE';
  const isHighPriority = priority === 'HIGH';
  const isEdited = createdDateTime !== updatedDateTime && updatedDateTime;
  const hasAttachments = attachments?.length > 0;
  const isSubtask = Boolean(parentTaskIdentifier);

  const mainContainerWidth = isSubtask ? 212 : 240;

  const assignedMemberColor =
    (taskListMembers ?? []).find(
      ({ userIdentifier }) => userIdentifier === assignedTo?.userIdentifier,
    )?.bubbleColor ?? null;

  const assignerName = `${creator?.firstName?.charAt(0)?.toUpperCase() ??
    ''}. ${creator?.lastName ?? ''}`
    .trim()
    .replace(/^\.$/, '');

  const assignedDateMoment = moment(createdDateTime ?? null);

  const assignedDateLabel = assignedDateMoment.isValid()
    ? assignedDateMoment.format('MM/DD/YYYY')
    : '';

  const assignedByLabel =
    assignerName && assignedDateLabel
      ? `Assigned by ${assignerName} on ${assignedDateLabel}`
      : '';

  const bottomLabelsArray = [
    isEmpty(subtasks) && `${subtasks.length} subtasks`,
    isEmpty(comments) && `${comments.length} comments`,
  ].filter(Boolean);

  const bottomLabel = bottomLabelsArray.join(' | ');

  const patientName = getPatientName(patient);

  const { dueDateLabel, isOverdue } = getDueDateData({ dueDate });

  const currentPriorityColor = priorityColor(workflowStatus ?? '');

  return {
    isSubtask,
    isComplete,
    isHighPriority,
    isEdited,
    hasAttachments,
    mainContainerWidth,
    assignedMemberColor,
    assignedByLabel,
    bottomLabel,
    patientName,
    dueDateLabel,
    isOverdue,
    currentPriorityColor,
  };
};

export default getPdfTaskData;
