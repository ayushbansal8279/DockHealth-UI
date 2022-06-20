import { TaskItemColumnWidth } from 'helpers/task-helpers';
import { SINGLE_TASK_RESTRICTIONS_OPTIONS } from 'restrictions/task-restrictions';

export const TaskHeaderColumn = {
  DESCRIPTION: 'TASK_DESCRIPTION',
  SUBTASKS_COUNT: 'SUBTASKS_COUNT',
  PATIENT: 'PATIENT',
  WORKFLOW_STATUS: 'WORKFLOW_STATUS',
  ACTIVITY: 'ACTIVITY',
  START_DATE: 'START_DT',
  DUE_DATE: 'DUE_DT',
  ASSIGNED: 'ASSIGNED_TO',
  LIST_NAME: 'LIST_NAME',
};

const { DISABLED } = SINGLE_TASK_RESTRICTIONS_OPTIONS;

export const getTaskHeaderOptions = (
  customerTypeLabel,
  groupHasMultipleAssignees,
  column,
  restrictions,
) => {
  const predefinedHeaderColumns = [
    {
      identifier: TaskHeaderColumn.DESCRIPTION,
      label: 'Tasks',
      draggable: false,
    },
    {
      identifier: TaskHeaderColumn.SUBTASKS_COUNT,
      label: 'Sub',
      draggable: true,
      width: TaskItemColumnWidth[TaskHeaderColumn.SUBTASKS_COUNT],
    },
    {
      identifier: TaskHeaderColumn.PATIENT,
      label: customerTypeLabel,
      draggable: true,
      width: TaskItemColumnWidth[TaskHeaderColumn.PATIENT],
    },
    {
      identifier: TaskHeaderColumn.WORKFLOW_STATUS,
      label: 'Status',
      draggable: true,
      width: TaskItemColumnWidth[TaskHeaderColumn.WORKFLOW_STATUS],
    },
    {
      identifier: TaskHeaderColumn.ACTIVITY,
      label: 'Details',
      draggable: true,
      width: TaskItemColumnWidth[TaskHeaderColumn.ACTIVITY],
    },
    {
      identifier: TaskHeaderColumn.START_DATE,
      label: 'Start',
      draggable: true,
      width: TaskItemColumnWidth[TaskHeaderColumn.START_DATE],
    },
    {
      identifier: TaskHeaderColumn.DUE_DATE,
      label: 'Due',
      draggable: true,
      width: TaskItemColumnWidth[TaskHeaderColumn.DUE_DATE],
      hidden: restrictions?.dueDate !== DISABLED,
    },
    {
      identifier: TaskHeaderColumn.ASSIGNED,
      label: groupHasMultipleAssignees ? 'Assign' : 'Asgn',
      draggable: true,
      width: TaskItemColumnWidth[TaskHeaderColumn.ASSIGNED].WIDE,
      printWidth: TaskItemColumnWidth[TaskHeaderColumn.ASSIGNED].PRINT,
    },
    {
      identifier: TaskHeaderColumn.LIST_NAME,
      label: 'List',
      draggable: true,
      width: TaskItemColumnWidth[TaskHeaderColumn.LIST_NAME],
      hidden: restrictions?.listName !== DISABLED,
    },
  ];

  const foundHeaderColumn = predefinedHeaderColumns.find(
    c => c.identifier === column.identifier,
  );

  return { ...foundHeaderColumn, ...column };
};

export const reorderColumns = (list, startIndex, endIndex) => {
  const result = [...list];
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};
