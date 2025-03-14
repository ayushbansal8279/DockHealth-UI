import moment from 'moment';
import pipe from 'ramda/src/pipe';
import prop from 'ramda/src/prop';
import path from 'ramda/src/path';
import sortWith from 'ramda/src/sortWith';
import ascend from 'ramda/src/ascend';
import descend from 'ramda/src/descend';
import defaultTo from 'ramda/src/defaultTo';
import toLower from 'ramda/src/toLower';
import move from 'ramda/src/move';
import { TaskStatus, DueDateIntent } from 'helpers/task-helpers';

export const TaskTemplateItemColumn = {
  NAME: 'NAME',
  CREATED_BY: 'CREATED_BY',
  CREATED: 'CREATED',
  PERMISSIONS: 'PERMISSIONS',
};

export function checkIfTemplateWorkflow(workflow) {
  return ['SMARTFLOW', 'WORKFLOW'].includes(workflow?.templateType);
}

export const TASK_TEMPLATE_ITEM_BASE_COLUMN_CONFIG = {
  [TaskTemplateItemColumn.NAME]: true,
  [TaskTemplateItemColumn.CREATED_BY]: true,
  [TaskTemplateItemColumn.CREATED]: true,
  [TaskTemplateItemColumn.PERMISSIONS]: true,
};

export const TEMPLATE_TASK_ITEM_SORT_METHODS = {
  [TaskTemplateItemColumn.NAME]: sortWith([
    ascend(pipe(prop('name'), defaultTo('~'), toLower)),
  ]),
  [TaskTemplateItemColumn.CREATED]: sortWith([
    ascend(pipe(prop('createdDateTime'), defaultTo('~'))),
  ]),
  [TaskTemplateItemColumn.CREATED_BY]: sortWith([
    ascend(pipe(path(['creator', 'userName']), defaultTo('~'))),
  ]),
  [TaskTemplateItemColumn.PERMISSIONS]: sortWith([
    ascend(pipe(path(['members', 0, 'userName']), defaultTo(' '), toLower)),
  ]),
};

export const TEMPLATE_TASK_ITEM_SORT_DESC_METHODS = {
  [TaskTemplateItemColumn.NAME]: sortWith([
    descend(pipe(prop('name'), defaultTo('~'), toLower)),
  ]),
  [TaskTemplateItemColumn.CREATED]: sortWith([
    descend(pipe(prop('createdDateTime'), defaultTo('~'))),
  ]),
  [TaskTemplateItemColumn.CREATED_BY]: sortWith([
    descend(pipe(path(['creator', 'userName']), defaultTo('~'))),
  ]),
  [TaskTemplateItemColumn.PERMISSIONS]: sortWith([
    descend(pipe(path(['members', 0, 'userName']), defaultTo(' '), toLower)),
  ]),
};

export function checkIfWorkflowTemplate(workflow) {
  return workflow?.type === 'WORKFLOW';
}

export function isWorkflowDueDateOverdue(workflow) {
  if (!workflow) {
    return false;
  }
  const { dueDateTime } = workflow;

  const dueDateObject =
    workflow.dueDateIntent === DueDateIntent.DATE
      ? moment.utc(dueDateTime)
      : moment(dueDateTime);

  // Compare with today's start of day
  const todayStart = moment(
    `${moment().startOf('day').format('MM/DD/YYYY HH:mm:ss')} +0000`,
  );

  // overdue if due date is before today
  return dueDateObject.isBefore(todayStart);
}

export function reorderTasksForWorkflow(
  sourceIndex,
  destinationIndex,
  incompleteTasksShown,
  completedTasksShown,
  tasks,
) {
  let reorderedTasks;

  if (completedTasksShown && incompleteTasksShown) {
    reorderedTasks = move(
      sourceIndex,
      destinationIndex,
      tasks?.map((task) => task?.taskIdentifier),
    );
  } else {
    const [openedTasks, completedTasks] = tasks.reduce(
      (accumulator, task) =>
        task.status === TaskStatus.INCOMPLETE
          ? [[...accumulator[0], task?.taskIdentifier], [...accumulator[1]]]
          : [[...accumulator[0]], [...accumulator[1], task?.taskIdentifier]],
      [[], []],
    );

    if ((!completedTasksShown, incompleteTasksShown)) {
      reorderedTasks = move(sourceIndex, destinationIndex, openedTasks).concat(
        completedTasks,
      );
    } else if ((completedTasksShown, !incompleteTasksShown)) {
      reorderedTasks = move(
        sourceIndex,
        destinationIndex,
        completedTasks,
      ).concat(openedTasks);
    }
  }

  return reorderedTasks;
}
