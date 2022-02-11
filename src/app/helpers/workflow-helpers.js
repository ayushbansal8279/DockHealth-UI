import {
  pipe,
  prop,
  path,
  sortWith,
  ascend,
  descend,
  defaultTo,
  toLower,
} from 'ramda';

/* eslint-disable import/prefer-default-export */

export const TaskTemplateItemColumn = {
  NAME: 'NAME',
  CREATED_BY: 'CREATED_BY',
  CREATED: 'CREATED',
  PERMISSIONS: 'PERMISSIONS',
};

export function checkIfTemplateWorkflow(workflow) {
  return (
    ['SMARTFLOW', 'WORKFLOW'].includes(workflow?.type) ||
    ['SMARTFLOW', 'WORKFLOW'].includes(workflow?.templateType)
  );
}

export const TASK_TEMPLATE_ITEM_BASE_COLUMN_CONFIG = {
  [TaskTemplateItemColumn.NAME]: true,
  [TaskTemplateItemColumn.CREATED_BY]: true,
  [TaskTemplateItemColumn.CREATED]: true,
  [TaskTemplateItemColumn.PERMISSIONS]: false,
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
