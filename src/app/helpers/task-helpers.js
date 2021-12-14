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
  isNil,
  unless,
} from 'ramda';
import palette from 'styles/palette';

/* eslint-disable import/prefer-default-export */
export const TaskStatus = {
  INCOMPLETE: 'INCOMPLETE',
  COMPLETE: 'COMPLETE',
};

export const TaskItemType = {
  BUNDLE: 'BUNDLE',
  TASK: 'TASK',
};

export const TaskPriority = {
  NONE: 'NONE',
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
};

export function getPriorityColor(priority) {
  switch (priority) {
    case TaskPriority.HIGH:
      return palette.tomatoInYoFace;
    case TaskPriority.MEDIUM:
      return palette.orangeJulius;
    case TaskPriority.LOW:
      return palette.accentYellow;
    case TaskPriority.NONE:
    default:
      return 'transparent';
  }
}

export const TaskGroupType = {
  TASKLIST_DEFAULT: 'TASKLIST_DEFAULT',
  TASKLIST: 'TASKLIST',
  BUNDLE: 'TASK_BUNDLE',
};

export const ReminderType = {
  NONE: 'NONE',
  DAY_OF: 'DAY_OF',
  DAY_BEFORE_1: 'DAY_BEFORE_1',
  DAY_BEFORE_2: 'DAY_BEFORE_2',
  WEEK_BEFORE_1: 'WEEK_BEFORE_1',
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

export function checkIfBundleTask(task) {
  return !!task?.taskGroups?.find(
    ({ groupType }) => groupType === TaskGroupType.BUNDLE,
  );
}

export const TaskItemColumn = {
  DESCRIPTION: 'TASK_DESCRIPTION',
  DUE_DATE: 'DUE_DT',
  ACTIVITY: 'ACTIVITY',
  LIST_NAME: 'LIST_NAME',
  ASSIGNED: 'ASSIGNED_TO',
  PATIENT: 'PATIENT',
  SUBTASKS_COUNT: 'SUBTASKS_COUNT',
  WORKFLOW_STATUS: 'WORKFLOW_STATUS',
  DECISION_SELECT: 'DECISION_SELECT',
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
  [TaskItemColumn.DECISION_SELECT]: true,
};

export const MAX_COLUMNS_TO_SHOW = 5;

export const checkColumnIsInConfig = (column, taskConfig) => taskConfig[column];

export const TASK_ITEM_SORT_METHODS = {
  [TaskItemColumn.DESCRIPTION]: sortWith([
    ascend(pipe(prop('description'), defaultTo('~'), toLower)),
  ]),
  [TaskItemColumn.DUE_DATE]: sortWith([
    ascend(pipe(prop('dueDate'), defaultTo('~'))),
  ]),
  [TaskItemColumn.WORKFLOW_STATUS]: sortWith([
    ascend(
      pipe(
        prop('workflowStatus'),
        unless(isNil, prop('name')),
        defaultTo('~'),
        toLower,
      ),
    ),
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
    ascend(
      pipe(path(['assignedToUsers', 0, 'userName']), defaultTo('~'), toLower),
    ),
  ]),
  [TaskItemColumn.LIST_NAME]: sortWith([
    ascend(pipe(path(['taskList', 'listName']), defaultTo('~'), toLower, trim)),
  ]),
  [TaskItemColumn.SUBTASKS_COUNT]: sortWith([
    ascend(pipe(prop('subTasksCount'), defaultTo(-1))),
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
    descend(
      pipe(
        prop('workflowStatus'),
        unless(isNil, prop('name')),
        defaultTo(' '),
        toLower,
      ),
    ),
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
    descend(
      pipe(path(['assignedToUsers', 0, 'userName']), defaultTo(' '), toLower),
    ),
  ]),
  [TaskItemColumn.LIST_NAME]: sortWith([
    descend(
      pipe(path(['taskList', 'listName']), defaultTo(' '), toLower, trim),
    ),
  ]),
  [TaskItemColumn.SUBTASKS_COUNT]: sortWith([
    descend(pipe(prop('subTasksCount'), defaultTo(-1))),
  ]),
};

export function updateNestedTask(dataToUpdate, taskIdentifier, task) {
  return {
    ...task,
    subtasks: task?.subtasks?.map(subtask =>
      taskIdentifier === subtask.taskIdentifier
        ? { ...subtask, ...dataToUpdate }
        : subtask,
    ),
    taskDependencies: task?.taskDependencies?.map(t =>
      taskIdentifier === t.taskIdentifier ? { ...t, ...dataToUpdate } : t,
    ),
  };
}

export function updateSubtasksInTaskWithCallback(
  updateCallback,
  taskIdentifier,
  task,
) {
  return {
    ...task,
    subtasks: task?.subtasks?.map(subtask =>
      taskIdentifier === subtask.taskIdentifier
        ? updateCallback(subtask)
        : subtask,
    ),
    taskDependencies: task?.taskDependencies?.map(t =>
      taskIdentifier === t.taskIdentifier ? updateCallback(t) : t,
    ),
  };
}
