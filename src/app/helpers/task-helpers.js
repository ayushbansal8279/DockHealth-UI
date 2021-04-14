import moment from 'moment';
import {
  pipe,
  prop,
  path,
  sortWith,
  ascend,
  descend,
  defaultTo,
  toLower,
  trim,
  ifElse,
} from 'ramda';

/* eslint-disable import/prefer-default-export */
export const TaskStatus = {
  INCOMPLETE: 'INCOMPLETE',
  COMPLETE: 'COMPLETE',
};

export const TaskItemType = {
  BUNDLE: 'BUNDLE',
  TASK: 'TASK',
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

export function checkIfTemplateTask(task) {
  return task?.type === 'TEMPLATE';
}

export const TaskItemColumn = {
  DESCRIPTION: 'DESCRIPTION',
  DUE_DATE: 'DUE_DATE',
  ACTIVITY: 'ACTIVITY',
  LIST_NAME: 'LIST_NAME',
  ASSIGNED: 'ASSIGNED',
  PATIENT: 'PATIENT',
  SUBTASKS_COUNT: 'SUBTASKS_COUNT',
  WORKFLOW_STATUS: 'WORKFLOW_STATUS',
};

export const TASK_ITEM_BASE_COLUMN_CONFIG = {
  [TaskItemColumn.DESCRIPTION]: true,
  [TaskItemColumn.SUBTASKS_COUNT]: true,
  [TaskItemColumn.PATIENT]: true,
  [TaskItemColumn.WORKFLOW_STATUS]: true,
  [TaskItemColumn.ACTIVITY]: true,
  [TaskItemColumn.DUE_DATE]: true,
  [TaskItemColumn.ASSIGNED]: true,
  [TaskItemColumn.LIST_NAME]: false,
};

export const checkColumnIsInConfig = (column, taskConfig) => taskConfig[column];

export const TASK_ITEM_SORT_METHODS = {
  [TaskItemColumn.DESCRIPTION]: sortWith([
    ascend(pipe(prop('description'), defaultTo('~'), toLower)),
  ]),
  [TaskItemColumn.DUE_DATE]: sortWith([
    ascend(pipe(prop('dueDate'), defaultTo('~'))),
  ]),
  [TaskItemColumn.WORKFLOW_STATUS]: sortWith([
    ascend(pipe(prop('workflowStatus'), defaultTo('~'), toLower)),
  ]),
  [TaskItemColumn.PATIENT]: sortWith([
    ascend(
      ifElse(
        path(['patient', 'patientName']),
        pipe(path(['patient', 'patientName']), defaultTo('~'), toLower),
        pipe(
          path(['parentTask', 'patient', 'patientName']),
          defaultTo('~'),
          toLower,
        ),
      ),
    ),
  ]),
  [TaskItemColumn.ASSIGNED]: sortWith([
    ascend(pipe(path(['assignedTo', 'userName']), defaultTo('~'), toLower)),
  ]),
  [TaskItemColumn.LIST_NAME]: sortWith([
    ascend(pipe(path(['taskList', 'listName']), defaultTo('~'), toLower, trim)),
  ]),
};

export const TASK_ITEM_SORT_DESC_METHODS = {
  [TaskItemColumn.DESCRIPTION]: sortWith([
    descend(pipe(prop('description'), defaultTo(' '), toLower)),
  ]),
  [TaskItemColumn.DUE_DATE]: sortWith([
    descend(pipe(prop('dueDate'), defaultTo(' '))),
  ]),
  [TaskItemColumn.WORKFLOW_STATUS]: sortWith([
    descend(pipe(prop('workflowStatus'), defaultTo(' '), toLower)),
  ]),
  [TaskItemColumn.PATIENT]: sortWith([
    descend(
      ifElse(
        path(['patient', 'patientName']),
        pipe(path(['patient', 'patientName']), defaultTo(' '), toLower),
        pipe(
          path(['parentTask', 'patient', 'patientName']),
          defaultTo(' '),
          toLower,
        ),
      ),
    ),
  ]),
  [TaskItemColumn.ASSIGNED]: sortWith([
    descend(pipe(path(['assignedTo', 'userName']), defaultTo(' '), toLower)),
  ]),
  [TaskItemColumn.LIST_NAME]: sortWith([
    descend(
      pipe(path(['taskList', 'listName']), defaultTo(' '), toLower, trim),
    ),
  ]),
};

export function extractTasksAndSubtasks(listOfTasks) {
  return listOfTasks.reduce(
    (accumulator, task) => {
      if (task.itemType === TaskItemType.BUNDLE) {
        // eslint-disable-next-line no-unused-expressions
        task.tasks?.forEach(t => {
          if (t.parentTaskIdentifier) {
            accumulator.subtasks.push(t);
          } else {
            accumulator.parentTasks.push(t);
            // eslint-disable-next-line no-unused-expressions
            t.subtasks?.forEach(subtask => accumulator.subtasks.push(subtask));
          }
        });
      } else if (task.parentTaskIdentifier) {
        accumulator.subtasks.push(task);
      } else {
        accumulator.parentTasks.push(task);
        // eslint-disable-next-line no-unused-expressions
        task.subtasks?.forEach(subtask => accumulator.subtasks.push(subtask));
      }

      return accumulator;
    },
    { parentTasks: [], subtasks: [] },
  );
}
