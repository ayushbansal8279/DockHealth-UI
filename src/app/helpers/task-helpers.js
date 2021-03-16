import moment from 'moment';

/* eslint-disable import/prefer-default-export */
export const TaskStatus = {
  INCOMPLETE: 'INCOMPLETE',
  COMPLETE: 'COMPLETE',
};

export function getLabelsIconTooltipTitle(labels) {
  let toolTipMultiLabelDetails = '';
  if (labels.length === 1) {
    toolTipMultiLabelDetails = `${labels[0].labelName}`;
  } else if (labels.length === 2) {
    toolTipMultiLabelDetails = `${labels[0].labelName}, ${labels[1].labelName}`;
  } else if (labels.length > 2) {
    toolTipMultiLabelDetails = `${labels[0].labelName}, ${
      labels[1].labelName
    } + ${labels.length - 2}`;
  }
  return toolTipMultiLabelDetails;
}

export function getAttachmentsIconTooltipTitle(attachments) {
  let attachmentLabelDetails = '';
  if (attachments.length === 1) {
    attachmentLabelDetails = `${attachments[0].fileName}`;
  } else if (attachments.length > 1) {
    attachmentLabelDetails = `${
      attachments[0].fileName
    } + ${attachments.length - 1}`;
  }
  return attachmentLabelDetails;
}

export function getCommentsIconTooltipTitle(comments) {
  return `${comments?.length || 0} comment${comments.length === 1 ? '' : 's'}`;
}

export function isDueDateOverdue(task) {
  if (!task) {
    return false;
  }
  const { dueDate, status } = task;

  return (
    status === TaskStatus.INCOMPLETE &&
    (moment(dueDate).format('HH:mm') !== '00:00'
      ? moment(dueDate).isBefore(moment())
      : dueDate && moment(dueDate).isBefore(moment().startOf('day')))
  );
}
